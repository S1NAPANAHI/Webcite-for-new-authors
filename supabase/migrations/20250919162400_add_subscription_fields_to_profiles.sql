-- Migration: Add subscription fields to profiles table
-- Date: 2025-09-19 16:24:00
-- Purpose: Add subscription status tracking fields to user profiles

-- Add subscription-related columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'patron')),
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add unique constraint separately to avoid conflicts
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_stripe_customer_id_key' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_stripe_customer_id_key UNIQUE (stripe_customer_id);
    END IF;
END $$;

-- Create index for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Create or update the subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'inactive',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on subscriptions table
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Create webhook_events table for tracking Stripe webhooks
CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY,
    provider TEXT NOT NULL DEFAULT 'stripe',
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    error_message TEXT,
    received_at TIMESTAMPTZ DEFAULT now(),
    processed_at TIMESTAMPTZ
);

-- Create index on webhook_events table
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed, received_at);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(event_type);

-- Create payment_history table for tracking payments (optional)
CREATE TABLE IF NOT EXISTS payment_history (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_invoice_id TEXT,
    subscription_id TEXT,
    amount BIGINT,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on payment_history table
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);

-- Update existing users to have default subscription values
UPDATE profiles 
SET 
    subscription_status = COALESCE(subscription_status, 'inactive'),
    subscription_tier = COALESCE(subscription_tier, 'free')
WHERE subscription_status IS NULL OR subscription_tier IS NULL;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for subscriptions table
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;

-- Policy: Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Service role can manage all subscriptions (for webhooks)
CREATE POLICY "Service role can manage subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Add RLS policies for webhook_events table
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Only service role can access webhook events" ON webhook_events;

-- Policy: Only service role can access webhook events
CREATE POLICY "Only service role can access webhook events" ON webhook_events
    FOR ALL USING (auth.role() = 'service_role');

-- Add RLS policies for payment_history table
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own payment history" ON payment_history;
DROP POLICY IF EXISTS "Service role can manage payment history" ON payment_history;

-- Policy: Users can view their own payment history
CREATE POLICY "Users can view their own payment history" ON payment_history
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Service role can manage all payment history
CREATE POLICY "Service role can manage payment history" ON payment_history
    FOR ALL USING (auth.role() = 'service_role');

-- Create a view for easy subscription status checking
-- FIXED: Removed reference to non-existent stripe_status column
DROP VIEW IF EXISTS user_subscription_status;

CREATE VIEW user_subscription_status AS
SELECT 
    p.id as user_id,
    p.email,
    p.subscription_status,
    p.subscription_tier,
    p.subscription_end_date,
    p.stripe_customer_id,
    s.id as subscription_id,
    s.plan_id,
    s.status as stripe_status, -- FIXED: Use 'status' instead of 'stripe_status'
    s.current_period_start,
    s.current_period_end,
    s.trial_end,
    s.cancel_at_period_end,
    CASE 
        WHEN p.subscription_tier IN ('premium', 'patron') 
             AND p.subscription_status IN ('active', 'trialing') 
        THEN true
        ELSE false
    END as has_premium_access,
    CASE 
        WHEN p.subscription_end_date IS NOT NULL 
             AND p.subscription_end_date > now() 
        THEN true
        ELSE false
    END as subscription_valid
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id AND s.status IN ('active', 'trialing');

-- Grant access to the view
GRANT SELECT ON user_subscription_status TO authenticated;
GRANT SELECT ON user_subscription_status TO service_role;

-- Add helpful comments
COMMENT ON COLUMN profiles.subscription_status IS 'Current subscription status from Stripe (active, trialing, canceled, etc.)';
COMMENT ON COLUMN profiles.subscription_tier IS 'User tier level (free, premium, patron)';
COMMENT ON COLUMN profiles.subscription_end_date IS 'When the current subscription period ends';
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for this user';
COMMENT ON TABLE subscriptions IS 'Detailed subscription data from Stripe webhooks';
COMMENT ON TABLE webhook_events IS 'Log of all Stripe webhook events for debugging and auditing';
COMMENT ON TABLE payment_history IS 'History of all payments and invoices';
COMMENT ON VIEW user_subscription_status IS 'Convenient view combining profile and subscription data for easy access checking';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Added subscription tracking fields to profiles table';
    RAISE NOTICE 'Created subscriptions, webhook_events, and payment_history tables';
    RAISE NOTICE 'Created user_subscription_status view for easy querying';
END $$;
