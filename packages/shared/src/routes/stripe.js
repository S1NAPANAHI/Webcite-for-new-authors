const express = require('express');
const Stripe = require('stripe');
const { insert, update, getRow, transaction } = require('../database/connection');
const { generateDownloadUrl } = require('../services/s3Service');
const { sendPurchaseEmail, sendSubscriptionEmail } = require('../services/emailService');

module.exports = (supabase) => {
  const router = express.Router();

  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Create checkout session for one-time purchase
  router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail, productSlug } = req.body;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'priceId, successUrl, and cancelUrl are required'
      });
    }

    // Get product details from database
    const product = await getRow(
      'SELECT p.*, pr.amount_cents, pr.currency FROM products p JOIN prices pr ON p.id = pr.product_id WHERE pr.id = $1',
      [priceId]
    );

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'Invalid price ID'
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      customer_email: customerEmail,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        product_slug: productSlug,
        product_id: product.id,
        price_id: priceId
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'AU'], // Add countries you ship to
      },
    });

    res.json({
      sessionId: session.id,
      url: session.url,
      product: {
        title: product.title,
        amount: product.amount_cents,
        currency: product.currency
      }
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
});

// Create subscription with Payment Element (new flow)
router.post('/create-subscription-intent', async (req, res) => {
  try {
    const { priceId, customerEmail } = req.body;

    if (!priceId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'priceId is required'
      });
    }

    // Get or create customer
    let customer;
    if (customerEmail) {
      const existingCustomers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({ email: customerEmail });
      }
    } else {
      customer = await stripe.customers.create({});
    }

    // Create subscription in incomplete state
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    const clientSecret = subscription.latest_invoice.payment_intent.client_secret;

    res.json({
      clientSecret,
      subscriptionId: subscription.id,
      customerId: customer.id,
    });

  } catch (error) {
    console.error('Error creating subscription intent:', error);
    res.status(500).json({
      error: 'Failed to create subscription intent',
      message: error.message
    });
  }
});

// Create checkout session for subscription
router.post('/create-subscription-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail, productSlug } = req.body;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'priceId, successUrl, and cancelUrl are required'
      });
    }

    // Get product details from database
    const product = await getRow(
      'SELECT p.*, pr.amount_cents, pr.currency, pr.interval, pr.trial_period_days FROM products p JOIN prices pr ON p.id = pr.product_id WHERE pr.id = $1',
      [priceId]
    );

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'Invalid price ID'
      });
    }

    // Create Stripe checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      customer_email: customerEmail,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        product_slug: productSlug,
        product_id: product.id,
        price_id: priceId
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      subscription_data: {
        trial_period_days: product.trial_period_days || 0,
        metadata: {
          product_slug: productSlug,
          product_id: product.id
        }
      }
    });

    res.json({
      sessionId: session.id,
      url: session.url,
      product: {
        title: product.title,
        amount: product.amount_cents,
        currency: product.currency,
        interval: product.interval,
        trialDays: product.trial_period_days
      }
    });

  } catch (error) {
    console.error('Error creating subscription session:', error);
    res.status(500).json({
      error: 'Failed to create subscription session',
      message: error.message
    });
  }
});

// Get customer portal URL for subscription management
router.post('/create-portal-session', async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body;

    if (!customerId) {
      return res.status(400).json({
        error: 'Missing customer ID',
        message: 'customerId is required'
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.CORS_ORIGIN}/account`,
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({
      error: 'Failed to create portal session',
      message: error.message
    });
  }
});

// Get customer details
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      return res.status(404).json({
        error: 'Customer not found',
        message: 'Customer has been deleted'
      });
    }

    // Get customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method']
    });

    // Get customer's payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });

    res.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        created: customer.created
      },
      subscriptions: subscriptions.data,
      paymentMethods: paymentMethods.data
    });

  } catch (error) {
    console.error('Error retrieving customer:', error);
    res.status(500).json({
      error: 'Failed to retrieve customer',
      message: error.message
    });
  }
});

// Get payment intent details
router.get('/payment-intent/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      created: paymentIntent.created,
      metadata: paymentIntent.metadata
    });

  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    res.status(500).json({
      error: 'Failed to retrieve payment intent',
      message: error.message
    });
  }
});

// Refund a payment
router.post('/refund', async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Missing payment intent ID',
        message: 'paymentIntentId is required'
      });
    }

    const refundData = {
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer'
    };

    if (amount) {
      refundData.amount = amount; // Amount in cents
    }

    const refund = await stripe.refunds.create(refundData);

    // Update order status in database
    await update(
      'UPDATE orders SET status = $1, metadata = jsonb_set(metadata, $2, $3) WHERE provider_payment_intent_id = $4',
      ['refunded', '{refund_id}', refund.id, paymentIntentId]
    );

    res.json({
      id: refund.id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status,
      reason: refund.reason
    });

  } catch (error) {
    console.error('Error creating refund:', error);
    res.status(500).json({
      error: 'Failed to create refund',
      message: error.message
    });
  }
});

  return router;
};
