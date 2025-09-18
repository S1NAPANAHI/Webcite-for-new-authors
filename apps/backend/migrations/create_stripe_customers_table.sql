-- Create stripe_customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_customers (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on stripe_customer_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_id ON stripe_customers(stripe_customer_id);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_stripe_customers_email ON stripe_customers(email);

-- Enable Row Level Security
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only see their own customer record
CREATE POLICY "Users can view own stripe customer" ON stripe_customers
    FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy: Users can insert their own customer record
CREATE POLICY "Users can insert own stripe customer" ON stripe_customers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can update their own customer record
CREATE POLICY "Users can update own stripe customer" ON stripe_customers
    FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_stripe_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER stripe_customers_updated_at
    BEFORE UPDATE ON stripe_customers
    FOR EACH ROW
    EXECUTE FUNCTION update_stripe_customers_updated_at();

-- Grant necessary permissions
GRANT ALL ON stripe_customers TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

COMMENT ON TABLE stripe_customers IS 'Links Supabase users to their Stripe customer IDs for subscription management';
COMMENT ON COLUMN stripe_customers.user_id IS 'References the Supabase auth user ID';
COMMENT ON COLUMN stripe_customers.stripe_customer_id IS 'The corresponding Stripe customer ID';
COMMENT ON COLUMN stripe_customers.email IS 'Email address used for the Stripe customer';
