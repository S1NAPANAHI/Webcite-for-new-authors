const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27',
});
const helmet = require('helmet');
const cors = require('cors');

const { createClient } = require('@supabase/supabase-js');

// Import enhanced business logic components
const { 
  errorHandler, 
  notFoundHandler, 
  addRequestId, 
  securityHeaders,
  createRateLimiter 
} = require('../../packages/shared/dist/business/middleware/errorHandler');

const createProductRoutes = require('../../packages/shared/dist/routes/products.js');
const createEnhancedProductRoutes = require('../../packages/shared/dist/routes/products.enhanced.js');
const createAdminRoutes = require('../../packages/shared/dist/routes/admin.js');

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


// Enhanced rate limiting with user-based limits
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'API rate limit exceeded'
);

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Custom middleware
app.use(addRequestId);
app.use(securityHeaders);
app.use(express.json({ limit: '10mb' }));
app.use(apiLimiter);

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

app.post('/api/stripe/create-subscription', async (req, res) => {
  try {
    const { paymentMethodId, priceId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('Error fetching user from Supabase:', userError);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let customerId;

    // Check if customer exists in our database
    const { data: existingCustomer, error: customerFetchError } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (customerFetchError && customerFetchError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching existing customer:', customerFetchError);
      throw new Error('Database error fetching customer.');
    }

    if (existingCustomer) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      // Create a new customer in Stripe
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = stripeCustomer.id;

      // Store customer ID in our database
      const { error: insertError } = await supabase
        .from('stripe_customers')
        .insert({
          user_id: user.id,
          stripe_customer_id: customerId,
          email: user.email,
        });

      if (insertError) {
        console.error('Error inserting new customer into DB:', insertError);
        throw new Error('Database error storing new customer.');
      }
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(
      paymentMethodId,
      { customer: customerId }
    );

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
      metadata: { user_id: user.id },
    });

    // Update our database with the new subscription
    await upsertSubscription(subscription);

    res.json({ subscriptionId: subscription.id, clientSecret: subscription.latest_invoice.payment_intent.client_secret });

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enhanced Stripe webhook for e-commerce and subscriptions
const handleStripeWebhook = require('./webhooks/stripe-ecommerce');
app.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);



async function startServer() {
  const { default: createProductRoutes } = await import('../../packages/shared/dist/routes/products.js');
  const { default: createEnhancedProductRoutes } = await import('../../packages/shared/dist/routes/products.enhanced.js');
  const { default: createAdminRoutes } = await import('../../packages/shared/dist/routes/admin.js');

  const authRoutes = require('./routes/auth.js');
  const myAdminRoutes = require('./routes/admin.js');

  const { createCartRoutes, createOrderRoutes } = await import('./routes/cart.js');

  const adminRouter = createAdminRoutes(supabase);

  console.log('adminRouter:', adminRouter);

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/v2/admin', myAdminRoutes);
  app.use('/api/products', createProductRoutes(supabase));
  app.use('/api/products-v2', createEnhancedProductRoutes(supabase)); // Enhanced version
  app.use('/api/cart', createCartRoutes(supabase, process.env.STRIPE_SECRET_KEY));
  app.use('/api/orders', createOrderRoutes(supabase, process.env.STRIPE_SECRET_KEY));
  app.use('/api/admin', (req, res, next) => {
    console.log('Request received for /api/admin path:', req.originalUrl);
    next();
  }, adminRouter);

  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Zoroasterverse Backend API is running!',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      features: {
        businessLogic: true,
        validation: true,
        errorHandling: true,
        security: true
      }
    });
  });

  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // 404 handler for undefined routes
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  if (!process.env.VERCEL_ENV) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Zoroasterverse Backend running on port ${PORT}`);
      console.log(`📊 Enhanced business logic enabled`);
      console.log(`🔒 Security middleware active`);
      console.log(`✅ Validation layer active`);
    });
  }

  return app;
}

module.exports = startServer();
