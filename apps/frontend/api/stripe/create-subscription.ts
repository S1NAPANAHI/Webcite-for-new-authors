import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Initialize Supabase
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase environment variables are not set');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper to upsert subscription status in Supabase
async function upsertSubscription(subscription: Stripe.Subscription) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        id: subscription.id,
        user_id: subscription.metadata.user_id || subscription.customer,
        plan_id: subscription.items.data[0].price.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        metadata: subscription.metadata,
      }, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Error upserting subscription:', error);
      // Don't throw error here - subscription creation succeeded in Stripe
    }
    return data;
  } catch (error) {
    console.error('Database error storing subscription (non-critical):', error);
    // Continue - subscription was created successfully in Stripe
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('=== CREATE SUBSCRIPTION REQUEST ===');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);

  try {
    const { paymentMethodId, priceId } = req.body;

    // Validate required fields
    if (!paymentMethodId || !priceId) {
      console.error('Validation Error: Missing paymentMethodId or priceId');
      return res.status(400).json({
        error: 'Missing required fields: paymentMethodId and priceId are required'
      });
    }

    // Extract and validate token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Authentication Error: Missing or invalid authorization header');
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.error('Authentication Error: Missing token');
      return res.status(401).json({ error: 'Missing authentication token' });
    }

    console.log('Token extracted, verifying user...');

    // Verify user with Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('Error fetching user from Supabase:', userError);
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    console.log('User verified:', user.id, user.email);

    let customerId: string;

    // Try to get existing customer from database
    let existingCustomer = null;

    // First try the stripe_customers table
    const { data: stripeCustomer, error: stripeCustomerError } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!stripeCustomerError && stripeCustomer) {
      existingCustomer = stripeCustomer;
      customerId = stripeCustomer.stripe_customer_id;
      console.log('Found existing customer in stripe_customers table:', customerId);
    } else {
      // If stripe_customers table doesn't exist or no customer found, try customers table
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

      if (!customerError && customerData?.stripe_customer_id) {
        existingCustomer = customerData;
        customerId = customerData.stripe_customer_id;
        console.log('Found existing customer in customers table:', customerId);
      }
    }

    if (!existingCustomer) {
      console.log('No existing customer found, creating new Stripe customer...');

      // Create a new customer in Stripe
      const stripeCustomer = await stripe.customers.create({
        email: user.email!,
        metadata: { user_id: user.id },
      });
      customerId = stripeCustomer.id;
      console.log('Created new Stripe customer:', customerId);

      // Try to store in stripe_customers table first, fallback to customers table
      try {
        const { error: insertError } = await supabase
          .from('stripe_customers')
          .insert({
            user_id: user.id,
            stripe_customer_id: customerId,
            email: user.email!,
          });

        if (insertError) {
          console.log('stripe_customers table not available, trying customers table...');

          // Fallback to customers table
          const { error: customerInsertError } = await supabase
            .from('customers')
            .upsert({
              id: user.id,
              stripe_customer_id: customerId,
              email: user.email!,
            });

          if (customerInsertError) {
            console.error('Error inserting customer into both tables:', customerInsertError);
            // Don't throw error here - customer creation in Stripe succeeded
          } else {
            console.log('Stored customer in customers table');
          }
        } else {
          console.log('Stored customer in stripe_customers table');
        }
      } catch (dbError) {
        console.error('Database error storing customer (non-critical):', dbError);
        // Continue with subscription creation even if DB storage fails
      }
    }

    console.log('Attaching payment method to customer...');

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    console.log('Creating subscription...');

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
      metadata: { user_id: user.id },
    });

    console.log('Subscription created:', subscription.id);

    // Try to update database with subscription (non-critical)
    try {
      await upsertSubscription(subscription);
      console.log('Subscription stored in database');
    } catch (dbError) {
      console.error('Error storing subscription in database (non-critical):', dbError);
      // Continue - subscription was created successfully in Stripe
    }

    // Return success response
    const response = {
      success: true,
      subscriptionId: subscription.id,
      customerId: customerId,
      status: subscription.status,
      clientSecret: (subscription.latest_invoice as Stripe.Invoice)?.payment_intent ? 
        ((subscription.latest_invoice as Stripe.Invoice).payment_intent as Stripe.PaymentIntent)?.client_secret : null
    };

    console.log('Sending success response:', response);
    return res.status(200).json(response);

  } catch (error: any) {
    console.error('=== ERROR IN CREATE-SUBSCRIPTION ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // Always return a proper JSON error response
    const errorResponse = {
      error: error.message || 'An unexpected error occurred while creating subscription',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    return res.status(500).json(errorResponse);
  }
}