-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  interval VARCHAR(20) NOT NULL CHECK (interval IN ('month', 'year')),
  paypal_plan_id VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create subscriptions table (if not exists)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  paypal_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  plan_name VARCHAR(255) NOT NULL,
  plan_price DECIMAL(10,2) NOT NULL,
  plan_interval VARCHAR(20) NOT NULL,
  paypal_plan_id VARCHAR(255) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  last_payment_date TIMESTAMP,
  next_payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample subscription plans
INSERT INTO subscription_plans (name, description, price, interval, paypal_plan_id) VALUES
(
  'Monthly Episodes',
  'Access to all released chapters and new chapters as they are written',
  9.99,
  'month',
  'P-5ML4271244450612XMQIZHI' -- Replace with your actual PayPal plan ID
),
(
  'Annual Episodes',
  'Everything in Monthly plan plus 2 months free and exclusive content',
  99.99,
  'year',
  'P-5ML4271244450612XMQIZHI' -- Replace with your actual PayPal plan ID
)
ON CONFLICT (paypal_plan_id) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paypal_id ON subscriptions(paypal_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
