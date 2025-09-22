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
// Import homepage routes (new)
import homepageRoutes from './routes/homepage.js';
// Import releases routes (NEW)
import releasesRoutes from './routes/releases.js';

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

  // ENHANCED CORS Configuration - Fixed for production with comprehensive domain support
  const allowedOrigins = new Set([
    // Development origins
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    
    // Production origins - comprehensive list
    'https://www.zoroastervers.com',
    'https://zoroastervers.com',
    'https://zoroastervers.netlify.app',
    'https://zoroastervers.vercel.app',
    
    // Add environment-specific origins
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [])
  ]);

  console.log('🌐 CORS - Allowed origins:', Array.from(allowedOrigins));
  console.log('🔧 CORS - Environment FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set');
  console.log('🔧 CORS - Environment CORS_ORIGINS:', process.env.CORS_ORIGINS || 'Not set');

  // CORS middleware with dynamic origin checking and enhanced logging
  app.use(cors({
    origin: (origin, callback) => {
      console.log('🔍 CORS Check - Incoming origin:', origin || 'undefined');
      
      // Allow requests with no origin (mobile apps, curl, postman, etc.)
      if (!origin) {
        console.log('✅ CORS - No origin header, allowing request');
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.has(origin)) {
        console.log('✅ CORS - Origin allowed:', origin);
        return callback(null, true);
      }
      
      console.log('❌ CORS - Origin denied:', origin);
      console.log('❌ CORS - Available origins:', Array.from(allowedOrigins));
      return callback(new Error(`CORS: Origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cache-Control',
      'X-File-Name'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // Cache preflight requests for 24 hours
  }));

  // Explicit preflight handler for all routes with enhanced logging
  app.options('*', (req, res) => {
    const origin = req.headers.origin;
    console.log('🔍 CORS PREFLIGHT - Origin:', origin || 'undefined');
    console.log('🔍 CORS PREFLIGHT - Method:', req.method);
    console.log('🔍 CORS PREFLIGHT - Headers:', req.headers);
    
    if (!origin || allowedOrigins.has(origin)) {
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Vary', 'Origin');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name');
      res.header('Access-Control-Max-Age', '86400');
      console.log('✅ CORS PREFLIGHT - Headers set for:', origin || 'no-origin');
      return res.sendStatus(204);
    }
    
    console.log('❌ CORS PREFLIGHT - Origin not allowed:', origin);
    console.log('❌ CORS PREFLIGHT - Available origins:', Array.from(allowedOrigins));
    return res.sendStatus(403);
  });

  app.use((req, res, next) => {
    if (req.path === '/api/homepage/content' && req.method === 'PUT') {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => {
        const rawBody = Buffer.concat(chunks).toString();
        console.log('RAW REQUEST BODY:', rawBody);
        next();
      });
    } else {
      next();
    }
  });

  // Add JSON body parsing middleware (AFTER webhook endpoint)
  app.use(express.json());

  // Add enhanced debug logging middleware
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS' || req.path.startsWith('/api/stripe') || req.path.startsWith('/api/subscription') || req.path.startsWith('/api/homepage') || req.path.startsWith('/api/releases')) {
      console.log('🔍 Request:', {
        method: req.method,
        path: req.path,
        origin: req.headers.origin || 'undefined',
        userAgent: req.headers['user-agent'] || 'undefined',
        timestamp: new Date().toISOString()
      });
    }
    next();
  });

  // ========================================
  // MOUNT ROUTE MODULES
  // ========================================
  app.use('/api/subscription', subscriptionRoutes); // Enhanced subscription API
  app.use('/api/homepage', homepageRoutes); // Homepage management API
  app.use('/api/releases', releasesRoutes); // NEW: Releases management API
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

  // Health check endpoint with CORS info
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      stripeApiVersion: '2024-09-30.acacia',
      cors: {
        allowedOrigins: Array.from(allowedOrigins),
        requestOrigin: req.headers.origin || 'none'
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        FRONTEND_URL: process.env.FRONTEND_URL || 'not set',
        CORS_ORIGINS: process.env.CORS_ORIGINS || 'not set'
      }
    });
  });

  // Enhanced error handling middleware
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      origin: req.headers.origin,
      timestamp: new Date().toISOString()
    });
    
    if (err.message && err.message.includes('CORS')) {
      return res.status(403).json({ 
        error: 'CORS policy violation',
        message: 'Origin not allowed',
        requestOrigin: req.headers.origin,
        allowedOrigins: Array.from(allowedOrigins)
      });
    }
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
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
    console.log(`🏠 Homepage Management API: http://localhost:${PORT}/api/homepage`);
    console.log(`📈 Homepage Metrics: http://localhost:${PORT}/api/homepage/metrics`);
    console.log(`💬 Homepage Quotes: http://localhost:${PORT}/api/homepage/quotes`);
    console.log(`📚 Releases API: http://localhost:${PORT}/api/releases`);
    console.log(`🔄 Chapter Sync: http://localhost:${PORT}/api/releases/sync-from-chapters`);
    
    // Log environment variables for debugging
    console.log('🔧 Environment Check:');
    console.log('   - NODE_ENV:', process.env.NODE_ENV || 'not set');
    console.log('   - FRONTEND_URL:', process.env.FRONTEND_URL || 'not set');
    console.log('   - CORS_ORIGINS:', process.env.CORS_ORIGINS || 'not set');
    console.log('   - SUPABASE_URL:', process.env.SUPABASE_URL ? 'set' : 'not set');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'not set');
  });
}

startServer();