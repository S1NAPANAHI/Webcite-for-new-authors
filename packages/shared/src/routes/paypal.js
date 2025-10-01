const express = require('express');
const { getRow, insert, update } = require('../database/connection');

module.exports = (supabase) => {
  const router = express.Router();

  // PayPal configuration
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'; // 'sandbox' or 'live'

  // PayPal API base URL
  const PAYPAL_BASE_URL = PAYPAL_MODE === 'live' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

  // Get PayPal access token
  async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw error;
  }
}

// Create PayPal subscription
router.post('/create-subscription', async (req, res) => {
  try {
    const { planId, successUrl, cancelUrl, productName } = req.body;

    if (!planId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'planId, successUrl, and cancelUrl are required'
      });
    }

    // Get subscription plan details from database
    const plan = await getRow(
      'SELECT * FROM subscription_plans WHERE id = $1',
      [planId]
    );

    if (!plan) {
      return res.status(404).json({
        error: 'Plan not found',
        message: 'Invalid plan ID'
      });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal subscription
    const subscriptionResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        plan_id: plan.paypal_plan_id,
        start_time: new Date(Date.now() + 60000).toISOString(), // Start in 1 minute
        application_context: {
          brand_name: 'Zoroastervers',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
          },
          return_url: successUrl,
          cancel_url: cancelUrl,
        },
        custom_id: `zoroastervers_${planId}_${Date.now()}`,
      }),
    });

    if (!subscriptionResponse.ok) {
      const errorData = await subscriptionResponse.json();
      console.error('PayPal subscription creation error:', errorData);
      throw new Error('Failed to create PayPal subscription');
    }

    const subscriptionData = await subscriptionResponse.json();
    
    // Store subscription in database
    const subscriptionId = await insert(
      'INSERT INTO subscriptions (user_id, paypal_subscription_id, status, plan_name, plan_price, plan_interval, paypal_plan_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [
        req.user?.id || null, // Will be null for guest users
        subscriptionData.id,
        'pending',
        plan.name,
        plan.price,
        plan.interval,
        plan.paypal_plan_id
      ]
    );

    res.json({
      subscriptionId: subscriptionData.id,
      approvalUrl: subscriptionData.links.find(link => link.rel === 'approve')?.href,
      status: subscriptionData.status,
      plan: {
        name: plan.name,
        price: plan.price,
        interval: plan.interval
      }
    });

  } catch (error) {
    console.error('Error creating PayPal subscription:', error);
    res.status(500).json({
      error: 'Failed to create subscription',
      message: error.message
    });
  }
});

// Handle PayPal webhook for subscription events
router.post('/webhook', async (req, res) => {
  try {
    const { event_type, resource } = req.body;

    console.log('PayPal webhook received:', event_type);

    switch (event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        // Subscription activated
        await update(
          'UPDATE subscriptions SET status = $1, current_period_start = $2, current_period_end = $3 WHERE paypal_subscription_id = $4',
          [
            'active',
            new Date(),
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            resource.id
          ]
        );
        break;

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // Subscription cancelled
        await update(
          'UPDATE subscriptions SET status = $1, cancel_at_period_end = $2 WHERE paypal_subscription_id = $4',
          ['canceled', true, resource.id]
        );
        break;

      case 'BILLING.SUBSCRIPTION.EXPIRED':
        // Subscription expired
        await update(
          'UPDATE subscriptions SET status = $1 WHERE paypal_subscription_id = $2',
          ['expired', resource.id]
        );
        break;

      case 'PAYMENT.SALE.COMPLETED':
        // Payment completed
        if (resource.billing_agreement_id) {
          await update(
            'UPDATE subscriptions SET last_payment_date = $1, next_payment_date = $2 WHERE paypal_subscription_id = $3',
            [
              new Date(),
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
              resource.billing_agreement_id
            ]
          );
        }
        break;

      default:
        console.log('Unhandled PayPal webhook event:', event_type);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: error.message
    });
  }
});

// Get subscription details
router.get('/subscription/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await getRow(
      'SELECT * FROM subscriptions WHERE paypal_subscription_id = $1',
      [id]
    );

    if (!subscription) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: 'Invalid subscription ID'
      });
    }

    res.json({ subscription });

  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({
      error: 'Failed to get subscription',
      message: error.message
    });
  }
});

// Cancel subscription
router.post('/subscription/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Cancel PayPal subscription
    const cancelResponse = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'User requested cancellation'
      }),
    });

    if (!cancelResponse.ok) {
      throw new Error('Failed to cancel PayPal subscription');
    }

    // Update database
    await update(
      'UPDATE subscriptions SET status = $1, cancel_at_period_end = $2 WHERE paypal_subscription_id = $3',
      ['canceled', true, id]
    );

    res.json({ 
      message: 'Subscription cancelled successfully',
      subscriptionId: id
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      error: 'Failed to cancel subscription',
      message: error.message
    });
  }
});

  return router;
};
