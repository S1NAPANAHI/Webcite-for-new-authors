# Create additional helper files and troubleshooting guides

# 4. Supabase database schema
database_schema = '''-- Supabase SQL for creating subscription tables
-- Create users table (if not already exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table for Stripe customer IDs
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY, -- Stripe subscription ID
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL,
  status TEXT NOT NULL,
  price_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL,
  updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE
);

-- Create prices table to store Stripe price information
CREATE TABLE IF NOT EXISTS prices (
  id TEXT PRIMARY KEY, -- Stripe price ID
  product_id TEXT NOT NULL, -- Stripe product ID
  active BOOLEAN DEFAULT TRUE,
  currency TEXT NOT NULL,
  unit_amount INTEGER,
  interval TEXT, -- month, year, etc.
  interval_count INTEGER DEFAULT 1,
  trial_period_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table to store Stripe product information
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, -- Stripe product ID
  active BOOLEAN DEFAULT TRUE,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data  
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can read their own customer data
CREATE POLICY "Users can read own customer data" ON customers
  FOR SELECT USING (auth.uid() = user_id);

-- Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can read active prices and products
CREATE POLICY "Anyone can read prices" ON prices
  FOR SELECT USING (active = true);

CREATE POLICY "Anyone can read products" ON products
  FOR SELECT USING (active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_customer_id ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();'''

# 5. Environment variables template
env_variables = '''# .env.local template for Stripe subscription setup

# Stripe Keys (get these from your Stripe dashboard)
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: For production
# STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
# STRIPE_SECRET_KEY=sk_live_your_live_secret_key'''

# 6. Common error fixes and troubleshooting
troubleshooting_guide = '''// Common Stripe Integration Errors and Fixes

// 1. Fix for 405 Method Not Allowed Error
// Problem: API route doesn't handle POST requests properly
// Solution: Ensure your API route explicitly handles POST method

// ❌ WRONG (missing method check)
export default async function handler(req, res) {
  // This will cause 405 errors for non-POST requests
  const session = await stripe.checkout.sessions.create({...});
}

// ✅ CORRECT (with proper method handling)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Handle POST request here...
}

// For App Router (Next.js 13+), ensure you export the right method:
// ✅ CORRECT
export async function POST(request: NextRequest) {
  // Handle POST request
}

// 2. Fix for "Unexpected end of JSON input" Error
// Problem: Server returns HTML error page instead of JSON
// Solution: Add proper error handling and content-type headers

// ❌ WRONG (can return HTML error pages)
export async function POST(request: NextRequest) {
  const { priceId } = await request.json(); // This might fail
  const session = await stripe.checkout.sessions.create({...});
  return { sessionId: session.id }; // Missing NextResponse.json()
}

// ✅ CORRECT (with proper error handling)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { priceId } = body;
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }
    
    const session = await stripe.checkout.sessions.create({
      // ... your session config
    });
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 3. Fix for CORS issues (if applicable)
// Add CORS headers to your API routes if needed
export async function POST(request: NextRequest) {
  // Your logic here...
  
  const response = NextResponse.json({ sessionId: session.id });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}

// 4. Frontend error handling improvements
// ❌ WRONG (poor error handling)
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  body: JSON.stringify({ priceId }),
});
const data = await response.json(); // This can fail if response is HTML

// ✅ CORRECT (robust error handling)
try {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId }),
  });

  if (!response.ok) {
    // Handle HTTP error status
    const errorText = await response.text();
    console.error('HTTP Error:', response.status, errorText);
    
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.error || 'Request failed');
    } catch {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  const data = await response.json();
  
  if (!data.sessionId) {
    throw new Error('No session ID returned');
  }
  
  // Proceed with Stripe checkout...
} catch (error) {
  console.error('Checkout error:', error);
  // Show user-friendly error message
  setError(error.message || 'Something went wrong. Please try again.');
}

// 5. Debugging tips
// Add these console.logs to debug your API routes:

export async function POST(request: NextRequest) {
  console.log('🔍 API Route called');
  console.log('🔍 Headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    const body = await request.json();
    console.log('🔍 Request body:', body);
    
    const session = await stripe.checkout.sessions.create({...});
    console.log('🔍 Stripe session created:', session.id);
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}'''

print("✅ Created additional helper files:")
print("- Database schema for Supabase")
print("- Environment variables template") 
print("- Troubleshooting guide for common errors")
print("- Specific fixes for 405 and JSON parsing errors")