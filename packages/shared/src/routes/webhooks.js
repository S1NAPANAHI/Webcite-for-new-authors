const express = require('express');
const Stripe = require('stripe');
const { insert, update, getRow, transaction } = require('../database/connection');
const { generateDownloadUrl } = require('../services/s3Service');
const { sendPurchaseEmail, sendSubscriptionEmail } = require('../services/emailService');

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook endpoint for Stripe events
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Store webhook event for debugging
    await insert(
      'INSERT INTO webhook_events (provider, event_id, event_type, payload) VALUES ($1, $2, $3, $4)',
      ['stripe', event.id, event.type, event.data.object]
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark webhook as processed
    await update(
      'UPDATE webhook_events SET processed = true WHERE event_id = $1',
      [event.id]
    );

    res.json({ received: true });

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Handle successful checkout completion
async function handleCheckoutSessionCompleted(session) {
  console.log('✅ Checkout session completed:', session.id);
  
  try {
    const { product_id, price_id } = session.metadata;
    
    // Create order record
    const order = await insert(
      `INSERT INTO orders (
        provider, provider_session_id, provider_payment_intent_id, 
        price_id, status, amount_cents, currency, customer_email, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        'stripe',
        session.id,
        session.payment_intent,
        price_id,
        'completed',
        session.amount_total,
        session.currency,
        session.customer_details?.email,
        {
          product_id,
          price_id,
          session_id: session.id,
          payment_intent: session.payment_intent
        }
      ]
    );

    // If this is a subscription, handle it separately
    if (session.mode === 'subscription') {
      console.log('📅 Subscription checkout completed');
      return; // Subscription will be handled by subscription.created event
    }

    // For one-time purchases, generate download links and send email
    await fulfillOrder(order.id, product_id, session.customer_details?.email);

  } catch (error) {
    console.error('❌ Error handling checkout completion:', error);
    throw error;
  }
}

// Handle successful payment
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('✅ Payment succeeded:', paymentIntent.id);
  
  try {
    // Update order status if not already updated
    await update(
      'UPDATE orders SET status = $1 WHERE provider_payment_intent_id = $2',
      ['completed', paymentIntent.id]
    );
  } catch (error) {
    console.error('❌ Error handling payment success:', error);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentIntentFailed(paymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);
  
  try {
    await update(
      'UPDATE orders SET status = $1 WHERE provider_payment_intent_id = $2',
      ['failed', paymentIntent.id]
    );
  } catch (error) {
    console.error('❌ Error handling payment failure:', error);
    throw error;
  }
}

// Handle successful subscription payment
async function handleInvoicePaymentSucceeded(invoice) {
  console.log('✅ Subscription payment succeeded:', invoice.id);
  
  try {
    if (invoice.subscription) {
      await update(
        'UPDATE subscriptions SET status = $1, current_period_end = to_timestamp($2) WHERE provider_subscription_id = $3',
        ['active', invoice.period_end, invoice.subscription]
      );
    }
  } catch (error) {
    console.error('❌ Error handling subscription payment success:', error);
    throw error;
  }
}

// Handle failed subscription payment
async function handleInvoicePaymentFailed(invoice) {
  console.log('❌ Subscription payment failed:', invoice.id);
  
  try {
    if (invoice.subscription) {
      await update(
        'UPDATE subscriptions SET status = $1 WHERE provider_subscription_id = $2',
        ['past_due', invoice.subscription]
      );
    }
  } catch (error) {
    console.error('❌ Error handling subscription payment failure:', error);
    throw error;
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription) {
  console.log('📅 Subscription created:', subscription.id);
  
  try {
    const { product_id } = subscription.metadata;
    
    // Get customer details
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    // Find user by email if available
    let user_id = null;
    if (customer.email) {
      const user = await getRow(
        'SELECT id FROM auth.users WHERE email = $1',
        [customer.email]
      );
      user_id = user?.id || null;
    }
    
    // Store/update Stripe customer data
    if (user_id) {
      await insert(
        `INSERT INTO stripe_customers (user_id, stripe_customer_id, email, metadata)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (stripe_customer_id) DO UPDATE SET
         user_id = EXCLUDED.user_id,
         email = EXCLUDED.email,
         metadata = EXCLUDED.metadata,
         updated_at = NOW()`,
        [user_id, subscription.customer, customer.email, customer.metadata || {}]
      );
    }
    
    // Get price details for the subscription
    const priceData = subscription.items.data[0].price;
    let plan_price_id = null;
    
    // Find price record in our database
    const price = await getRow(
      'SELECT id FROM prices WHERE price_id = $1 AND provider = $2',
      [priceData.id, 'stripe']
    );
    plan_price_id = price?.id || null;
    
    // Create subscription record
    const newSubscription = await insert(
      `INSERT INTO subscriptions (
        user_id, provider, provider_subscription_id, status,
        current_period_start, current_period_end, plan_price_id, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        user_id,
        'stripe',
        subscription.id,
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
        plan_price_id,
        {
          product_id,
          customer_id: subscription.customer,
          trial_end: subscription.trial_end,
          stripe_price_id: priceData.id
        }
      ]
    );
    
    // Update user profile with subscription status
    if (user_id) {
      await insert(
        `INSERT INTO user_profiles (id, email, subscription_status, subscription_tier, stripe_customer_id, current_period_end)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
         subscription_status = EXCLUDED.subscription_status,
         subscription_tier = EXCLUDED.subscription_tier,
         stripe_customer_id = EXCLUDED.stripe_customer_id,
         current_period_end = EXCLUDED.current_period_end,
         updated_at = NOW()`,
        [
          user_id,
          customer.email,
          subscription.status,
          priceData.recurring?.interval === 'month' ? 'monthly' : 'annual',
          subscription.customer,
          new Date(subscription.current_period_end * 1000)
        ]
      );
    }

    // Send welcome email for subscription
    if (customer.email) {
      await sendSubscriptionEmail(customer.email, 'welcome', {
        subscriptionId: subscription.id,
        productId: product_id,
        trialEnd: subscription.trial_end
      });
    }

  } catch (error) {
    console.error('❌ Error handling subscription creation:', error);
    throw error;
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription) {
  console.log('📅 Subscription updated:', subscription.id);
  
  try {
    await update(
      `UPDATE subscriptions SET 
        status = $1, 
        current_period_start = to_timestamp($2),
        current_period_end = to_timestamp($3),
        cancel_at_period_end = $4,
        metadata = jsonb_set(metadata, '{last_updated}', to_jsonb(now()))
      WHERE provider_subscription_id = $5`,
      [
        subscription.status,
        subscription.current_period_start,
        subscription.current_period_end,
        subscription.cancel_at_period_end,
        subscription.id
      ]
    );
  } catch (error) {
    console.error('❌ Error handling subscription update:', error);
    throw error;
  }
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
  console.log('📅 Subscription deleted:', subscription.id);
  
  try {
    await update(
      'UPDATE subscriptions SET status = $1 WHERE provider_subscription_id = $2',
      ['canceled', subscription.id]
    );
  } catch (error) {
    console.error('❌ Error handling subscription deletion:', error);
    throw error;
  }
}

// Fulfill order by generating download links and sending email
async function fulfillOrder(orderId, productId, customerEmail) {
  try {
    // Get product files
    const files = await getRow(
      'SELECT * FROM files WHERE product_id = $1 AND is_primary = true',
      [productId]
    );

    if (!files) {
      console.error('❌ No files found for product:', productId);
      return;
    }

    // Generate download URLs
    const downloadUrls = [];
    for (const file of files) {
      const downloadUrl = await generateDownloadUrl(file.s3_key, file.content_type);
      downloadUrls.push({
        format: file.format,
        url: downloadUrl,
        expiresIn: '24 hours'
      });
    }

    // Send purchase confirmation email
    if (customerEmail) {
      await sendPurchaseEmail(customerEmail, {
        orderId,
        productId,
        downloadUrls,
        expiresIn: '24 hours'
      });
    }

    console.log('✅ Order fulfilled successfully:', orderId);

  } catch (error) {
    console.error('❌ Error fulfilling order:', error);
    throw error;
  }
}

module.exports = router;
