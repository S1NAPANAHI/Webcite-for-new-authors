import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27',
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CORS headers for serverless functions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export default async function handler(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== CREATE SUBSCRIPTION REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
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

    const token = authHeader.split(' ')[1];
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

    // Get or create Stripe customer
    let customerId;
    const existingCustomers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
      console.log('Found existing Stripe customer:', customerId);
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      console.log('Created new Stripe customer:', customerId);
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

    // Return success response
    const response = {
      success: true,
      subscriptionId: subscription.id,
      customerId: customerId,
      status: subscription.status,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret || null
    };

    console.log('Sending success response:', response);
    res.json(response);

  } catch (error) {
    console.error('=== ERROR IN CREATE-SUBSCRIPTION ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    
    // Always return a proper JSON error response
    const errorResponse = {
      error: error.message || 'An unexpected error occurred while creating subscription'
    };
    
    res.status(500).json(errorResponse);
  }
}