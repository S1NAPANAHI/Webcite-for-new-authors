import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  }

  try {
    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Missing required parameter: priceId' });
    }

    // Get the user from the session
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the subscription plan from Supabase
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('stripe_price_id', priceId)
      .single();

    if (planError || !plan) {
      return res.status(400).json({ error: 'Invalid subscription plan' });
    }

    // Check if customer already exists in Stripe
    let customerId;

    // Check if customer already exists in stripe_customers table
    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Insert a new record into stripe_customers to store the customer ID
      await supabase.from('stripe_customers').insert({
        user_id: user.id,
        stripe_customer_id: customerId,
        email: user.email,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoroastervers-website.vercel.app'}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zoroastervers-website.vercel.app'}/subscriptions`,
      metadata: {
        user_id: user.id,
        plan_id: plan.id,
      },
      client_reference_id: user.id,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
}