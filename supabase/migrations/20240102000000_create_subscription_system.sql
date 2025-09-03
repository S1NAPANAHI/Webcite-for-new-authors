-- Enable RLS (Row Level Security)
-- Note: Run these in your Supabase SQL editor

-- =============================================
-- SUBSCRIPTION PLANS TABLE
-- =============================================
CREATE TABLE subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Plan Details
  name TEXT NOT NULL, -- e.g., "Basic", "Premium", "Ultimate"
  description TEXT,
  features JSONB DEFAULT '[]', -- Array of features: ["Feature 1", "Feature 2"]
  
  -- Stripe Integration
  stripe_product_id TEXT NOT NULL UNIQUE, -- Stripe Product ID
  stripe_price_id TEXT NOT NULL UNIQUE,   -- Stripe Price ID
  
  -- Pricing
  price_amount INTEGER NOT NULL, -- Price in cents (e.g., 999 for $9.99)
  currency TEXT DEFAULT 'usd' NOT NULL,
  billing_interval TEXT NOT NULL CHECK (billing_interval IN ('month', 'year')),
  
  -- Plan Configuration
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  -- Privileges (what this subscription unlocks)
  privileges JSONB DEFAULT '{}' -- e.g., {"beta_access": true, "premium_content": true, "api_calls": 1000}
);

-- =============================================
-- USER SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- User & Plan References
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_plan_id UUID REFERENCES subscription_plans(id) ON DELETE SET NULL,
  
  -- Stripe Integration
  stripe_subscription_id TEXT UNIQUE, -- Stripe Subscription ID
  stripe_customer_id TEXT, -- Stripe Customer ID
  
  -- Subscription Status
  status TEXT NOT NULL DEFAULT 'incomplete' CHECK (
    status IN ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid')
  ),
  
  -- Subscription Timing
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- =============================================
-- SUBSCRIPTION USAGE TRACKING (Optional)
-- =============================================
CREATE TABLE subscription_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE NOT NULL,
  
  -- Usage Tracking
  feature_name TEXT NOT NULL, -- e.g., "api_calls", "premium_downloads"
  usage_count INTEGER DEFAULT 1,
  usage_limit INTEGER, -- NULL means unlimited
  
  -- Time Period
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL
);

-- =============================================
-- STRIPE WEBHOOK EVENTS (For debugging/audit)
-- =============================================
CREATE TABLE stripe_webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed BOOLEAN DEFAULT false,
  
  data JSONB NOT NULL,
  error_message TEXT
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_sub_id ON user_subscriptions(stripe_subscription_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active, sort_order);
CREATE INDEX idx_subscription_usage_user_period ON subscription_usage(user_id, period_start, period_end);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Subscription Plans (Public read access, admin write access)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subscription plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage subscription plans" ON subscription_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- User Subscriptions (Users can view their own, admins can view all)
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions" ON user_subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Service role can manage subscriptions" ON user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Subscription Usage (Users can view their own, admins can view all)
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage" ON subscription_usage
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all usage" ON subscription_usage
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Webhook Events (Admin only)
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view webhook events" ON stripe_webhook_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Function to get user's active subscription
CREATE OR REPLACE FUNCTION get_user_active_subscription(user_uuid UUID)
RETURNS TABLE (
  subscription_id UUID,
  plan_name TEXT,
  status TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  privileges JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id,
    sp.name,
    us.status,
    us.current_period_end,
    sp.privileges
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.subscription_plan_id = sp.id
  WHERE us.user_id = user_uuid 
    AND us.status IN ('active', 'trialing')
  ORDER BY us.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific privilege
CREATE OR REPLACE FUNCTION user_has_privilege(user_uuid UUID, privilege_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_privileges JSONB;
BEGIN
  SELECT privileges INTO user_privileges
  FROM get_user_active_subscription(user_uuid) gas
  JOIN subscription_plans sp ON sp.name = gas.plan_name
  LIMIT 1;
  
  IF user_privileges IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN COALESCE((user_privileges->privilege_name)::BOOLEAN, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SAMPLE DATA (Remove after testing)
-- =============================================

-- Insert sample subscription plans
INSERT INTO subscription_plans (name, description, features, stripe_product_id, stripe_price_id, price_amount, billing_interval, privileges, sort_order) VALUES
(
  'Beta Reader Access',
  'Join our exclusive beta reader program',
  '["Early access to new releases", "Beta reader community access", "Feedback privileges", "Monthly beta calls"]',
  'prod_sample_beta', -- Replace with actual Stripe Product ID
  'price_sample_beta', -- Replace with actual Stripe Price ID
  999, -- $9.99
  'month',
  '{"beta_access": true, "early_releases": true, "community_access": true}',
  1
),
(
  'Premium Supporter',
  'Support the Zoroasterverse and unlock premium features',
  '["All Beta Reader benefits", "Premium content access", "Ad-free experience", "Exclusive merchandise discounts", "Priority support"]',
  'prod_sample_premium', -- Replace with actual Stripe Product ID
  'price_sample_premium', -- Replace with actual Stripe Price ID
  1999, -- $19.99
  'month',
  '{"beta_access": true, "early_releases": true, "community_access": true, "premium_content": true, "ad_free": true, "priority_support": true}',
  2
),
(
  'Ultimate Patron',
  'The ultimate Zoroasterverse experience',
  '["All Premium benefits", "Direct author access", "Manuscript reviews", "Custom character consultations", "Annual signed book", "Patron credits in publications"]',
  'prod_sample_ultimate', -- Replace with actual Stripe Product ID
  'price_sample_ultimate', -- Replace with actual Stripe Price ID
  4999, -- $49.99
  'month',
  '{"beta_access": true, "early_releases": true, "community_access": true, "premium_content": true, "ad_free": true, "priority_support": true, "author_access": true, "manuscript_reviews": true, "patron_credits": true}',
  3
);

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
