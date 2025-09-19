import './config.js';

import express from 'express';
import Stripe from 'stripe';
import bodyParser from 'body-parser';

// Fixed: Use proper Stripe API version format
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia', // Fixed: Added the release name
});
import helmet from 'helmet';
import cors from 'cors';

import { createClient } from '@supabase/supabase-js';

// Import webhook handler
import handleStripeWebhook from './webhooks/stripe-ecommerce.js';

// Import route modules
import adminRoutes from './routes/admin.js';
import contentRoutes from './routes/content.js';
import subscriptionRoutes from './routes/subscription.js';
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

// Create subscription in default_incomplete to collect payment with Payment Element
async function startServer() {
  console.log('Backend ENV: SUPABASE_URL =', process.env.SUPABASE_URL);
  console.log('Backend ENV: SUPABASE_SERVICE_ROLE_KEY =', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set (value hidden)' : 'Not Set');
  console.log('🔧 Stripe API Version:', '2024-09-30.acacia'); // Log the API version being used

  const app = express(); // Define app inside startServer

  // ========================================
  // WEBHOOK ENDPOINT SETUP (CRITICAL!)
  // This must come BEFORE express.json() middleware
  // ========================================
  
  app.post('/api/stripe/webhook', 
    bodyParser.raw({ type: 'application/json' }), // Raw body for webhook signature verification
    handleStripeWebhook
  );
  
  console.log('🎣 Stripe webhook endpoint configured at /api/stripe/webhook');

  // CORS Configuration - Fixed for production
  const allowedOrigins = new Set([
    'http://localhost:5173',
    'https://www.zoroastervers.com',
    'https://zoroastervers.com'
  ]);

  // Add environment variable if provided
  if (process.env.FRONTEND_URL) {
    allowedOrigins.add(process.env.FRONTEND_URL);
  }

  console.log('🌐 CORS - Allowed origins:', Array.from(allowedOrigins));

  // CORS middleware with dynamic origin checking
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.has(origin)) {
        console.log('✅ CORS - Origin allowed:', origin);
        return callback(null, true);
      }
      
      console.log('❌ CORS - Origin denied:', origin);
      return callback(new Error(`CORS: Origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Explicit preflight handler for all routes
  app.options('*', (req, res) => {
    const origin = req.headers.origin;
    console.log('🔍 CORS PREFLIGHT - Origin:', origin);
    
    if (origin && allowedOrigins.has(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      console.log('✅ CORS PREFLIGHT - Headers set for:', origin);
      return res.sendStatus(204);
    }
    
    console.log('❌ CORS PREFLIGHT - Origin not allowed:', origin);
    return res.sendStatus(403);
  });

  // Add JSON body parsing middleware (AFTER webhook endpoint)
  app.use(express.json());

  // Add debug logging middleware
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS' || req.path.startsWith('/api/stripe') || req.path.startsWith('/api/subscription')) {
      console.log('🔍 Request:', {
        method: req.method,
        path: req.path,
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
      });
    }
    next();
  });

  // ========================================
  // MOUNT ROUTE MODULES
  // ========================================
  app.use('/api/subscription', subscriptionRoutes); // NEW: Enhanced subscription API
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

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      stripeApiVersion: '2024-09-30.acacia'
    });
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`✅ CORS configured for:`, Array.from(allowedOrigins));
    console.log(`🔧 Using Stripe API version: 2024-09-30.acacia`);
    console.log(`🎣 Webhook endpoint: http://localhost:${PORT}/api/stripe/webhook`);
    console.log(`📊 Enhanced Subscription API: http://localhost:${PORT}/api/subscription/status`);
    console.log(`🔄 Subscription refresh: http://localhost:${PORT}/api/subscription/refresh`);
    console.log(`💳 Billing info: http://localhost:${PORT}/api/subscription/billing`);
  });
}

startServer();