import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  }

  try {
    // Get the user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser(req.headers.authorization?.replace('Bearer ', ''));

    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Retrieve the Stripe Customer ID from your database
    const { data: customer, error: customerError } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (customerError || !customer?.stripe_customer_id) {
      console.error('Stripe customer not found for user:', user.id, customerError);
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const stripeCustomerId = customer.stripe_customer_id;
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173'}/subscriptions`;

    // Create a Stripe Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    // Return the URL to the frontend
    res.status(200).json({ url: portalSession.url });

  } catch (error: any) {
    console.error('Billing portal session error:', error);
    res.status(500).json({ error: error.message });
  }
}
