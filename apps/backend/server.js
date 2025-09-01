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
app.post('/create-subscription', async (req, res) => {
  try {
    const { email, priceId } = req.body;
    if (!email || !priceId) return res.status(400).json({ error: 'Missing email or priceId' });

    const customer = await getOrCreateCustomer(email);

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
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

// Stripe webhook (set STRIPE_WEBHOOK_SECRET from Dashboard → Developers → Webhooks)
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
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

  // Handle subscription lifecycle and invoices
  switch (event.type) {
    case 'invoice.payment_succeeded': {
      // Provision access, mark subscription active in your DB
      break;
    }
    case 'invoice.payment_failed': {
      // Notify user, prompt to update payment method
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.created':
    case 'customer.subscription.deleted': {
      // Sync subscription status to your DB
      break;
    }
    default:
      break;
  }

  res.json({ received: true });
});

const adminRouter = createAdminRoutes(supabase);
console.log('adminRouter:', adminRouter);

// Routes
app.use('/api/products', createProductRoutes(supabase));
app.use('/api/products-v2', createEnhancedProductRoutes(supabase)); // Enhanced version
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
