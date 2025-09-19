-- Migration: Add subscription fields to profiles table
-- Date: 2025-09-19 16:24:00
-- Purpose: Add subscription status tracking fields to user profiles

-- Step 1: Add subscription-related columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'patron')),
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Step 2: Create unique constraint on stripe_customer_id (separate from ADD COLUMN)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_stripe_customer_id_key'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_stripe_customer_id_key UNIQUE (stripe_customer_id);
    END IF;
END $$;

-- Step 3: Create indexes for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Step 4: Create or update the subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'inactive',
    stripe_status TEXT,
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

-- Step 5: Create indexes on subscriptions table
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_status ON subscriptions(stripe_status);

-- Step 6: Create webhook_events table for tracking Stripe webhooks
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

-- Step 7: Create indexes on webhook_events table
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed, received_at);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(event_type);

-- Step 8: Create payment_history table for tracking payments (optional)
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

-- Step 9: Create indexes on payment_history table
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);

-- Step 10: Update existing users to have default subscription values
UPDATE profiles 
SET 
    subscription_status = COALESCE(subscription_status, 'inactive'),
    subscription_tier = COALESCE(subscription_tier, 'free')
WHERE subscription_status IS NULL OR subscription_tier IS NULL;

-- Step 11: Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 12: Create trigger for subscriptions table (only if table exists and has updated_at column)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscriptions' 
        AND column_name = 'updated_at'
    ) THEN
        DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
        CREATE TRIGGER update_subscriptions_updated_at
            BEFORE UPDATE ON subscriptions
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Step 13: Enable RLS on new tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Step 14: Create RLS policies for subscriptions table
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;
    
    -- Create new policies
    CREATE POLICY "Users can view their own subscriptions" ON subscriptions
        FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Service role can manage subscriptions" ON subscriptions
        FOR ALL USING (auth.role() = 'service_role');
END $$;

-- Step 15: Create RLS policies for webhook_events table
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Only service role can access webhook events" ON webhook_events;
    
    CREATE POLICY "Only service role can access webhook events" ON webhook_events
        FOR ALL USING (auth.role() = 'service_role');
END $$;

-- Step 16: Create RLS policies for payment_history table
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own payment history" ON payment_history;
    DROP POLICY IF EXISTS "Service role can manage payment history" ON payment_history;
    
    CREATE POLICY "Users can view their own payment history" ON payment_history
        FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Service role can manage payment history" ON payment_history
        FOR ALL USING (auth.role() = 'service_role');
END $$;

-- Step 17: Create the view (only after all tables and columns exist)
DO $$ 
BEGIN
    -- First check if all required columns exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'subscription_tier'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'subscriptions'
    ) THEN
        -- Create or replace the view
        CREATE OR REPLACE VIEW user_subscription_status AS
        SELECT 
            p.id as user_id,
            p.email,
            p.subscription_status,
            p.subscription_tier,
            p.subscription_end_date,
            p.stripe_customer_id,
            s.id as subscription_id,
            s.plan_id,
            s.stripe_status,
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
    END IF;
END $$;

-- Step 18: Add helpful comments
COMMENT ON COLUMN profiles.subscription_status IS 'Current subscription status from Stripe (active, trialing, canceled, etc.)';
COMMENT ON COLUMN profiles.subscription_tier IS 'User tier level (free, premium, patron)';
COMMENT ON COLUMN profiles.subscription_end_date IS 'When the current subscription period ends';
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for this user';

COMMENT ON TABLE subscriptions IS 'Detailed subscription data from Stripe webhooks';
COMMENT ON TABLE webhook_events IS 'Log of all Stripe webhook events for debugging and auditing';
COMMENT ON TABLE payment_history IS 'History of all payments and invoices';