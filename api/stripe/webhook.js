import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import getRawBody from 'raw-body';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  }

  try {
    const buf = await getRawBody(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Log the event
    await supabase
      .from('stripe_webhook_events')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        data: event.data,
        processed: false,
      });

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark event as processed
    await supabase
      .from('stripe_webhook_events')
      .update({ processed: true })
      .eq('stripe_event_id', event.id);

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    
    // Log the error
    await supabase
      .from('stripe_webhook_events')
      .update({ error_message: error.message })
      .eq('stripe_event_id', event.id);

    res.status(500).json({ error: error.message });
  }
}

async function handleCheckoutSessionCompleted(session) {
  const userId = session.client_reference_id;
  const planId = session.metadata?.plan_id;

  if (!userId || !planId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  // Get the subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  
  // Create or update user subscription in Supabase
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan_id: planId,
      provider_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    }, {
      onConflict: 'provider_subscription_id'
    });
}

async function handleSubscriptionUpdate(subscription) {
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    })
    .eq('provider_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription) {
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
    })
    .eq('provider_subscription_id', subscription.id);
}

async function handleInvoicePaymentSucceeded(invoice) {
  // Update subscription status if needed
  if (invoice.subscription) {
    await supabase
      .from('subscriptions')
      .update({ status: 'active' })
      .eq('provider_subscription_id', invoice.subscription);
  }
}

async function handleInvoicePaymentFailed(invoice) {
  // Update subscription status to past_due
  if (invoice.subscription) {
    await supabase
      .from('subscriptions')
      .update({ status: 'past_due' })
      .eq('provider_subscription_id', invoice.subscription);
  }
}