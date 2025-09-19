import './config.js';

import express from 'express';
import Stripe from 'stripe';
import bodyParser from 'body-parser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27',
});
import helmet from 'helmet';
import cors from 'cors';

import { createClient } from '@supabase/supabase-js';


import adminRoutes from './routes/admin.js';
import contentRoutes from './routes/content.js';

import betaRoutes from './routes/beta.js';
import worldRoutes from './routes/world.js';
import filesRoutes from './routes/files.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Utility: get or create a customer by email
async function getOrCreateCustomer(email) {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length) return existing.data[0];
  return stripe.customers.create({ email });
}

// Helper to upsert subscription status in Supabase
async function upsertSubscription(subscription) {
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert({
      id: subscription.id,
      user_id: subscription.metadata.user_id || subscription.customer, // Assuming user_id is stored in metadata or customer ID maps to user_id
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
    throw error;
  }
  return data;
}

// Helper to upsert invoice status in Supabase
async function upsertInvoice(invoice) {
  const { data, error } = await supabase
    .from('invoices')
    .upsert({
      id: invoice.id,
      user_id: invoice.customer_email || invoice.customer, // Assuming user_id is stored in customer_email or customer ID maps to user_id
      subscription_id: invoice.subscription,
      status: invoice.status,
      total: invoice.total / 100, // Convert cents to dollars
      currency: invoice.currency,
      hosted_invoice_url: invoice.hosted_invoice_url,
      pdf_url: invoice.invoice_pdf,
    }, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Error upserting invoice:', error);
    throw error;
  }
  return data;
}

// CORS Configuration Updated: 2025-09-19 05:33 CEST
// This ensures www.zoroastervers.com is allowed to make requests

// Create subscription in default_incomplete to collect payment with Payment Element
async function startServer() {
  console.log('Backend ENV: SUPABASE_URL =', process.env.SUPABASE_URL);
  console.log('Backend ENV: SUPABASE_SERVICE_ROLE_KEY =', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set (value hidden)' : 'Not Set');

  const app = express(); // Define app inside startServer

  // FIXED CORS configuration to allow production frontend domain
  const allowedOrigins = [
    'http://localhost:5173',           // Development
    'https://www.zoroastervers.com',   // Production (PRIMARY)
    'https://zoroastervers.com',       // Production (without www)
    process.env.FRONTEND_URL           // Environment variable fallback
  ].filter(Boolean); // Remove any undefined values

  console.log('🌐 CORS FIXED - Allowed origins:', allowedOrigins);

  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Add JSON body parsing middleware
  app.use(express.json());

  // Add logging middleware for debugging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Request Origin:', req.headers.origin);
    console.log('CORS Check: Origin allowed?', allowedOrigins.includes(req.headers.origin));
    next();
  });

  // Mount route modules
  app.use('/admin', adminRoutes);
  app.use('/content', contentRoutes);
  
  app.use('/beta', betaRoutes);
  app.use('/world', worldRoutes);
  app.use('/files', filesRoutes);

  // Create subscription in default_incomplete to collect payment with Payment Element
  app.all('/api/stripe/create-subscription-intent', async (req, res) => {
    if (req.method !== 'POST') {
      console.error(`Method Not Allowed: Received ${req.method} request for /api/stripe/create-subscription-intent`);
      return res.status(405).json({ error: `Method Not Allowed. Expected POST, received ${req.method}` });
    }

    try {
      console.log('Received create-subscription-intent request. Body:', req.body);
      const { email, priceId, userId } = req.body;
      if (!email || !priceId || !userId) {
        console.error('Validation Error: Missing email, priceId, or userId in create-subscription-intent request.');
        return res.status(400).json({ error: 'Missing email, priceId, or userId' });
      }

      const customer = await getOrCreateCustomer(email);

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: { user_id: userId }, // Add user_id to metadata
      });

      const clientSecret = subscription.latest_invoice.payment_intent.client_secret;
      res.json({
        clientSecret,
        subscriptionId: subscription.id,
        customerId: customer.id,
      });
    } catch (err) {
      console.error('Error in create-subscription-intent:', err);
      // Ensure a JSON response is always sent, even for unexpected errors
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || 'An unknown error occurred' });
      }
    }
  });

  // Endpoint to create a Stripe Checkout Session for subscriptions
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      console.log('Received create-checkout-session request. Body:', req.body);
      const { priceId, userId } = req.body;

      if (!priceId || !userId) {
        console.error('Validation Error: Missing priceId or userId in create-checkout-session request.');
        return res.status(400).json({ error: 'Missing priceId or userId' });
      }

      // Fetch user email from Supabase to pre-fill checkout and create customer
      const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError || !user) {
        console.error('Error fetching user from Supabase:', userError);
        return res.status(404).json({ error: 'User not found' });
      }

      const customer = await getOrCreateCustomer(user.user.email);

      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/subscriptions`,
        metadata: {
          user_id: userId,
          // You can add more metadata here if needed
        },
        subscription_data: {
          metadata: {
            user_id: userId,
          },
        },
      });

      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Endpoint to manage Stripe Billing Portal
  app.post('/api/manage-billing-portal', async (req, res) => {
    try {
      console.log('Received manage-billing-portal request. Body:', req.body);
      const { userId } = req.body;

      if (!userId) {
        console.error('Validation Error: Missing userId in manage-billing-portal request.');
        return res.status(400).json({ error: 'Missing userId' });
      }

      // Fetch the user's Stripe customer ID from your Supabase 'customers' table
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();

      if (customerError || !customerData || !customerData.stripe_customer_id) {
        console.error('Error fetching customer ID from Supabase:', customerError || 'Stripe customer ID not found for user.');
        return res.status(404).json({ error: 'Stripe customer ID not found for user.' });
      }

      const customerId = customerData.stripe_customer_id;

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.FRONTEND_URL}/subscriptions`, // URL to return to after managing subscription
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // FIXED: Enhanced create-subscription endpoint
  app.post('/api/stripe/create-subscription', async (req, res) => {
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

      let customerId;

      // Try to get existing customer from both possible tables
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

        if (!customerError && customerData && customerData.stripe_customer_id) {
          existingCustomer = customerData;
          customerId = customerData.stripe_customer_id;
          console.log('Found existing customer in customers table:', customerId);
        }
      }

      if (!existingCustomer) {
        console.log('No existing customer found, creating new Stripe customer...');
        
        // Create a new customer in Stripe
        const stripeCustomer = await stripe.customers.create({
          email: user.email,
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
              email: user.email,
            });

          if (insertError) {
            console.log('stripe_customers table not available, trying customers table...');
            
            // Fallback to customers table
            const { error: customerInsertError } = await supabase
              .from('customers')
              .upsert({
                id: user.id,
                stripe_customer_id: customerId,
                email: user.email,
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
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret || null
      };

      console.log('Sending success response:', response);
      res.json(response);

    } catch (error) {
      console.error('=== ERROR IN CREATE-SUBSCRIPTION ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Always return a proper JSON error response
      const errorResponse = {
        error: error.message || 'An unexpected error occurred while creating subscription',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
      
      if (!res.headersSent) {
        res.status(500).json(errorResponse);
      }
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/api/health`);
    console.log('🚀 CORS UPDATED - Production domain www.zoroastervers.com is now allowed!');
    console.log('🌐 All allowed origins:', allowedOrigins);
  });
}

startServer();