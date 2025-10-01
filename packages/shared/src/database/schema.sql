-- Zoroastervers E-commerce Database Schema
-- Run this file to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends existing profiles)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(500),
    file_key VARCHAR(500), -- S3 key for the main file
    is_bundle BOOLEAN DEFAULT FALSE,
    is_subscription BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prices table (Stripe price IDs)
CREATE TABLE IF NOT EXISTS prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', 'gumroad'
    price_id VARCHAR(255) NOT NULL, -- Stripe price_XXXX ID
    currency VARCHAR(3) DEFAULT 'USD',
    amount_cents INTEGER NOT NULL, -- Amount in cents
    interval VARCHAR(20), -- 'month', 'year' for subscriptions
    interval_count INTEGER DEFAULT 1,
    trial_period_days INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    provider VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', 'gumroad'
    provider_session_id VARCHAR(255), -- Stripe session ID
    provider_payment_intent_id VARCHAR(255), -- Stripe payment intent ID
    price_id UUID REFERENCES prices(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    customer_email VARCHAR(255),
    metadata JSONB, -- Store additional provider-specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'stripe', 'paypal'
    provider_subscription_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, past_due, canceled, incomplete
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    plan_price_id UUID REFERENCES prices(id),
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table (multiple file formats per product)
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    s3_key VARCHAR(500) NOT NULL,
    content_type VARCHAR(100) NOT NULL, -- 'application/pdf', 'application/epub+zip'
    file_size BIGINT, -- File size in bytes
    format VARCHAR(20) NOT NULL, -- 'pdf', 'epub', 'mobi'
    is_primary BOOLEAN DEFAULT FALSE, -- Main file for the product
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table (for bundles with multiple products)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    price_id UUID REFERENCES prices(id),
    quantity INTEGER DEFAULT 1,
    unit_amount_cents INTEGER NOT NULL,
    total_amount_cents INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Download tracking table
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook events table (for tracking and debugging)
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL, -- 'stripe', 'paypal'
    event_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_prices_product_id ON prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_provider ON prices(provider);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_provider ON orders(provider);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON subscriptions(provider);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_files_product_id ON files(product_id);
CREATE INDEX IF NOT EXISTS idx_files_format ON files(format);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_order_id ON downloads(order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO products (slug, title, description, is_bundle, status, published_at) VALUES
('the-first-saga', 'The First Saga', 'An epic tale of adventure and discovery in the Zoroastervers.', FALSE, 'published', NOW()),
('complete-collection', 'Complete Collection', 'All books in the Zoroastervers series in one bundle.', TRUE, 'published', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert sample prices
INSERT INTO prices (product_id, provider, price_id, currency, amount_cents, interval) VALUES
((SELECT id FROM products WHERE slug = 'the-first-saga'), 'stripe', 'price_test_saga', 'USD', 1999, NULL),
((SELECT id FROM products WHERE slug = 'complete-collection'), 'stripe', 'price_test_bundle', 'USD', 4999, NULL),
((SELECT id FROM products WHERE slug = 'the-first-saga'), 'stripe', 'price_test_subscription', 'USD', 999, 'month')
ON CONFLICT DO NOTHING;
