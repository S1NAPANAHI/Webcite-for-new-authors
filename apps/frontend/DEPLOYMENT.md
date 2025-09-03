# Deployment Instructions for Subscription System

## Prerequisites

Before deploying the subscription system, ensure you have:

1. A Supabase project set up
2. A Stripe account (test and production)
3. Your environment variables configured

## Setup Steps

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in your actual values:

```bash
cp .env.example .env
```

Fill in:
- **Supabase URL & Keys**: Get these from your Supabase project dashboard
- **Stripe Keys**: Get these from your Stripe dashboard
- **Site URL**: Your production domain (for webhooks)

### 2. Supabase Database Schema

Execute the following SQL in your Supabase SQL editor to create the required tables:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscription_plans table
CREATE TABLE subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    stripe_product_id TEXT UNIQUE NOT NULL,
    stripe_price_id TEXT UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    billing_interval TEXT CHECK (billing_interval IN ('month', 'year')) NOT NULL,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_subscriptions table
CREATE TABLE user_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')) NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_usage table
CREATE TABLE subscription_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    limit_count INTEGER,
    period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stripe_webhook_events table
CREATE TABLE stripe_webhook_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
CREATE INDEX idx_subscription_usage_user_subscription_id ON subscription_usage(user_subscription_id);
CREATE INDEX idx_stripe_webhook_events_stripe_event_id ON stripe_webhook_events(stripe_event_id);

-- Enable Row Level Security
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read active subscription plans
CREATE POLICY "Anyone can view active subscription plans" ON subscription_plans
    FOR SELECT USING (is_active = true);

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own usage
CREATE POLICY "Users can view own usage" ON subscription_usage
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_subscriptions 
            WHERE user_subscriptions.id = subscription_usage.user_subscription_id 
            AND user_subscriptions.user_id = auth.uid()
        )
    );

-- Service role can manage all webhook events
CREATE POLICY "Service role can manage webhook events" ON stripe_webhook_events
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
```

### 3. Stripe Configuration

1. **Create Products in Stripe Dashboard**:
   - Go to Products in your Stripe dashboard
   - Create products for each subscription tier
   - Note down the product IDs and price IDs

2. **Insert Subscription Plans**:
   Replace the IDs below with your actual Stripe product and price IDs:

```sql
INSERT INTO subscription_plans (name, description, stripe_product_id, stripe_price_id, price, billing_interval, features) VALUES
('Basic', 'Essential features for getting started', 'prod_your_basic_product_id', 'price_your_basic_price_id', 9.99, 'month', '["Basic prophecy readings", "Community access", "Email support"]'),
('Premium', 'Advanced features for serious practitioners', 'prod_your_premium_product_id', 'price_your_premium_price_id', 19.99, 'month', '["Unlimited prophecy readings", "Advanced astrology features", "Priority support", "Exclusive content"]'),
('Pro', 'Complete access for professionals', 'prod_your_pro_product_id', 'price_your_pro_price_id', 39.99, 'month', '["All Premium features", "API access", "White-label options", "Phone support"]');
```

3. **Configure Webhooks**:
   - In Stripe dashboard, go to Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe-webhook`
   - Select events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

### 4. Build and Deploy

1. **Install Dependencies**:
```bash
npm install
```

2. **Build the UI Package** (if using monorepo structure):
```bash
npm run build:ui
```

3. **Build the Frontend**:
```bash
npm run build
```

4. **Deploy to your hosting platform** (Vercel, Netlify, etc.)

### 5. Testing

1. **Test Subscription Flow**:
   - Navigate to `/subscriptions`
   - Try subscribing with Stripe test cards
   - Verify webhook events are processed

2. **Test Cards** (use these in test mode):
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

### 6. Going Live

1. **Switch to Production**:
   - Update environment variables with production Stripe keys
   - Update webhook endpoint to production URL
   - Test thoroughly before going live

2. **Security Checklist**:
   - [ ] All sensitive keys are in environment variables
   - [ ] Webhook signature verification is enabled
   - [ ] RLS policies are properly configured
   - [ ] CORS settings are configured correctly

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails**:
   - Ensure `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint secret
   - Check that raw request body is being passed to verification

2. **Subscription status not updating**:
   - Check webhook endpoint is receiving events
   - Verify Supabase service role key has proper permissions
   - Check webhook event logs in Stripe dashboard

3. **CSS/styling issues**:
   - Rebuild UI package after changes: `npm run build:ui`
   - Clear browser cache
   - Check CSS modules are properly imported

For additional help, check:
- Stripe documentation: https://stripe.com/docs
- Supabase documentation: https://supabase.com/docs
