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

const createProductRoutes = require('../../packages/shared/dist/routes/products');
const createEnhancedProductRoutes = require('../../packages/shared/dist/routes/products.enhanced');
const createAdminRoutes = require('../../packages/shared/dist/routes/admin');

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
app.post('/api/stripe/create-subscription-intent', async (req, res) => {
  try {
    const { email, priceId, userId } = req.body;
    if (!email || !priceId || !userId) return res.status(400).json({ error: 'Missing email, priceId, or userId' });

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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Enhanced Stripe webhook for e-commerce and subscriptions
const handleStripeWebhook = require('./webhooks/stripe-ecommerce');
app.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Legacy webhook endpoint for backward compatibility
app.post('/webhook-legacy', express.raw({ type: 'application/json' }), (req, res) => {
  let event;
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }

  // Handle subscription lifecycle and invoices (legacy)
  switch (event.type) {
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      try {
        await upsertInvoice(invoice);
        console.log(`Invoice ${invoice.id} payment succeeded. User: ${invoice.customer_email || invoice.customer}`);
      } catch (e) {
        console.error(`Error handling invoice.payment_succeeded for invoice ${invoice.id}:`, e);
        return res.status(500).json({ error: 'Webhook handler failed' });
      }
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      try {
        await upsertInvoice(invoice);
        console.log(`Invoice ${invoice.id} payment failed. User: ${invoice.customer_email || invoice.customer}`);
      } catch (e) {
        console.error(`Error handling invoice.payment_failed for invoice ${invoice.id}:`, e);
        return res.status(500).json({ error: 'Webhook handler failed' });
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const subscription = event.data.object;
      try {
        await upsertSubscription(subscription);
        console.log(`Subscription ${subscription.id} status updated/created to ${subscription.status}. User: ${subscription.customer}`);
      } catch (e) {
        console.error(`Error handling customer.subscription.updated/created for subscription ${subscription.id}:`, e);
        return res.status(500).json({ error: 'Webhook handler failed' });
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('id', subscription.id);

        if (error) throw error;
        console.log(`Subscription ${subscription.id} deleted. User: ${subscription.customer}`);
      } catch (e) {
        console.error(`Error handling customer.subscription.deleted for subscription ${subscription.id}:`, e);
        return res.status(500).json({ error: 'Webhook handler failed' });
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  res.json({ received: true });
});

const adminRouter = createAdminRoutes(supabase);
const { createCartRoutes, createOrderRoutes } = require('./routes/cart');

console.log('adminRouter:', adminRouter);

// Routes
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Zoroasterverse Backend running on port ${PORT}`);
  console.log(`📊 Enhanced business logic enabled`);
  console.log(`🔒 Security middleware active`);
  console.log(`✅ Validation layer active`);
});
