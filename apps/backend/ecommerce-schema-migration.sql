-- ==============================================================================
-- ZOROASTERVERS E-COMMERCE CATALOG ENHANCEMENT
-- ==============================================================================
-- This migration extends the existing schema to support full e-commerce operations
-- with Stripe integration, inventory management, and order processing
-- ==============================================================================

-- ==============================================================================
-- 1. EXTEND EXISTING TABLES WITH STRIPE INTEGRATION
-- ==============================================================================

-- Add Stripe integration fields to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stripe_product_id TEXT UNIQUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS inventory_quantity INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS allow_backorders BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_cents INTEGER; -- Keep for backward compatibility
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Add Stripe integration fields to prices table
ALTER TABLE public.prices ADD COLUMN IF NOT EXISTS stripe_price_id TEXT UNIQUE;
ALTER TABLE public.prices ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;
ALTER TABLE public.prices ADD COLUMN IF NOT EXISTS interval_count INTEGER DEFAULT 1;

-- ==============================================================================
-- 2. CREATE NEW E-COMMERCE TABLES
-- ==============================================================================

-- Product categories for better organization
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Product variants (enhanced price system)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    
    -- Stripe integration
    stripe_price_id TEXT UNIQUE,
    
    -- Variant details
    name TEXT, -- e.g., "Digital Download", "Physical Copy", "Premium Edition"
    sku TEXT UNIQUE,
    
    -- Pricing
    currency CHAR(3) NOT NULL DEFAULT 'usd',
    unit_amount INTEGER NOT NULL, -- in cents
    
    -- Subscription pricing
    recurring_interval TEXT CHECK (recurring_interval IN ('day', 'week', 'month', 'year')),
    recurring_interval_count INTEGER DEFAULT 1,
    
    -- Inventory
    track_inventory BOOLEAN DEFAULT false,
    inventory_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    
    -- Variant attributes
    attributes JSONB DEFAULT '{}', -- flexible attributes like size, color, format
    
    -- Status
    active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    
    -- Physical attributes
    weight DECIMAL(10,2),
    dimensions JSONB, -- {length, width, height, unit}
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    CONSTRAINT valid_recurring CHECK (
        (recurring_interval IS NULL AND recurring_interval_count IS NULL) OR
        (recurring_interval IS NOT NULL AND recurring_interval_count IS NOT NULL)
    )
);

-- Add category reference to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.product_categories(id);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Stripe integration
    stripe_checkout_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    
    -- Order totals (in cents)
    subtotal INTEGER NOT NULL DEFAULT 0,
    tax_amount INTEGER DEFAULT 0,
    shipping_amount INTEGER DEFAULT 0,
    discount_amount INTEGER DEFAULT 0,
    total_amount INTEGER NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'usd',
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
    payment_status TEXT NOT NULL DEFAULT 'unpaid', -- 'unpaid', 'paid', 'partially_paid', 'refunded', 'partially_refunded'
    fulfillment_status TEXT DEFAULT 'unfulfilled', -- 'unfulfilled', 'partial', 'fulfilled'
    
    -- Customer information
    email TEXT NOT NULL,
    phone TEXT,
    
    -- Addresses (stored as JSONB for flexibility)
    billing_address JSONB NOT NULL DEFAULT '{}',
    shipping_address JSONB DEFAULT '{}',
    
    -- Order metadata
    notes TEXT,
    admin_notes TEXT,
    promotion_code TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    confirmed_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- Order line items
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    variant_id UUID REFERENCES public.product_variants(id),
    
    -- Stripe reference
    stripe_price_id TEXT,
    
    -- Item details at time of purchase (for historical accuracy)
    product_name TEXT NOT NULL,
    variant_name TEXT,
    sku TEXT,
    
    -- Pricing and quantity
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_amount INTEGER NOT NULL, -- in cents
    total_amount INTEGER NOT NULL, -- unit_amount * quantity
    
    -- Digital delivery
    access_granted BOOLEAN DEFAULT false,
    access_granted_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Inventory movements tracking
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE, -- For backward compatibility
    
    movement_type TEXT NOT NULL, -- 'in', 'out', 'adjustment'
    quantity INTEGER NOT NULL,
    quantity_before INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    
    reason TEXT,
    reference_type TEXT, -- 'order', 'restock', 'adjustment', 'return'
    reference_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Shopping carts (persistent across sessions)
CREATE TABLE IF NOT EXISTS public.shopping_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT, -- For anonymous users
    
    -- Cart metadata
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
    
    CONSTRAINT cart_user_or_session CHECK (
        (user_id IS NOT NULL AND session_id IS NULL) OR
        (user_id IS NULL AND session_id IS NOT NULL)
    )
);

-- Shopping cart items
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES public.shopping_carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    
    quantity INTEGER NOT NULL DEFAULT 1,
    
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    UNIQUE(cart_id, product_id, variant_id)
);

-- Sync logs for Stripe integration
CREATE TABLE IF NOT EXISTS public.stripe_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sync_type TEXT NOT NULL, -- 'products', 'prices', 'full_sync'
    status TEXT NOT NULL, -- 'success', 'error', 'partial'
    result JSONB,
    error_details TEXT,
    
    -- Sync metadata
    items_processed INTEGER DEFAULT 0,
    items_synced INTEGER DEFAULT 0,
    items_failed INTEGER DEFAULT 0,
    
    started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER
);

-- ==============================================================================
-- 3. CREATE ENHANCED FUNCTIONS
-- ==============================================================================

-- Function to generate unique order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    attempt INTEGER := 0;
    max_attempts INTEGER := 10;
BEGIN
    LOOP
        -- Generate format: ZV-YYYYMMDD-XXXXX
        new_number := 'ZV-' || to_char(now(), 'YYYYMMDD') || '-' || 
                     LPAD(floor(random() * 99999)::TEXT, 5, '0');
        
        -- Check if this number already exists
        IF NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = new_number) THEN
            RETURN new_number;
        END IF;
        
        attempt := attempt + 1;
        IF attempt >= max_attempts THEN
            RAISE EXCEPTION 'Failed to generate unique order number after % attempts', max_attempts;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to update inventory with movement tracking
CREATE OR REPLACE FUNCTION public.update_inventory(
    p_variant_id UUID,
    p_product_id UUID DEFAULT NULL,
    p_quantity_change INTEGER,
    p_movement_type TEXT,
    p_reason TEXT DEFAULT NULL,
    p_reference_type TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    current_quantity INTEGER;
    new_quantity INTEGER;
    target_table TEXT;
    update_sql TEXT;
BEGIN
    -- Determine which table to update based on variant_id presence
    IF p_variant_id IS NOT NULL THEN
        -- New variant system
        SELECT inventory_quantity INTO current_quantity
        FROM public.product_variants
        WHERE id = p_variant_id;
        
        target_table := 'product_variants';
        
        IF current_quantity IS NULL THEN
            RAISE EXCEPTION 'Variant not found: %', p_variant_id;
        END IF;
    ELSIF p_product_id IS NOT NULL THEN
        -- Legacy product inventory
        SELECT inventory_quantity INTO current_quantity
        FROM public.products
        WHERE id = p_product_id;
        
        target_table := 'products';
        
        IF current_quantity IS NULL THEN
            RAISE EXCEPTION 'Product not found: %', p_product_id;
        END IF;
    ELSE
        RAISE EXCEPTION 'Either variant_id or product_id must be provided';
    END IF;
    
    -- Calculate new quantity
    new_quantity := current_quantity + p_quantity_change;
    
    -- Check for sufficient inventory (only for outbound movements)
    IF p_movement_type = 'out' AND new_quantity < 0 THEN
        RAISE EXCEPTION 'Insufficient inventory. Current: %, Requested: %', 
            current_quantity, ABS(p_quantity_change);
    END IF;
    
    -- Update inventory
    IF target_table = 'product_variants' THEN
        UPDATE public.product_variants
        SET inventory_quantity = new_quantity,
            updated_at = now()
        WHERE id = p_variant_id;
    ELSE
        UPDATE public.products
        SET inventory_quantity = new_quantity,
            updated_at = now()
        WHERE id = p_product_id;
    END IF;
    
    -- Record movement
    INSERT INTO public.inventory_movements (
        variant_id, product_id, movement_type, quantity, 
        quantity_before, quantity_after, reason,
        reference_type, reference_id, created_by
    )
    VALUES (
        p_variant_id, p_product_id, p_movement_type, p_quantity_change,
        current_quantity, new_quantity, p_reason,
        p_reference_type, p_reference_id, p_user_id
    );
    
    RETURN TRUE;
END;
$$;

-- Function to create product with variants atomically
CREATE OR REPLACE FUNCTION public.create_product_with_variants(
    p_product_data JSONB,
    p_variants_data JSONB DEFAULT '[]'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    new_product_id UUID;
    variant_ids UUID[] := '{}';
    variant_record RECORD;
    result JSONB;
BEGIN
    -- Insert product
    INSERT INTO public.products (
        name, description, product_type, category_id,
        images, track_inventory, active, slug,
        work_id, content_grants
    )
    VALUES (
        p_product_data->>'name',
        p_product_data->>'description',
        (p_product_data->>'product_type')::public.product_type,
        (p_product_data->>'category_id')::UUID,
        COALESCE((p_product_data->'images')::TEXT[], '{}'),
        COALESCE((p_product_data->>'track_inventory')::BOOLEAN, false),
        COALESCE((p_product_data->>'active')::BOOLEAN, true),
        public.generate_slug(p_product_data->>'name'),
        (p_product_data->>'work_id')::UUID,
        COALESCE(p_product_data->'content_grants', '[]'::JSONB)
    )
    RETURNING id INTO new_product_id;

    -- Insert variants if provided
    IF jsonb_array_length(p_variants_data) > 0 THEN
        FOR variant_record IN 
            SELECT * FROM jsonb_array_elements(p_variants_data)
        LOOP
            DECLARE
                new_variant_id UUID;
            BEGIN
                INSERT INTO public.product_variants (
                    product_id, name, sku, currency, unit_amount,
                    recurring_interval, recurring_interval_count,
                    track_inventory, inventory_quantity, attributes,
                    active, is_default, weight, dimensions
                )
                VALUES (
                    new_product_id,
                    variant_record.value->>'name',
                    variant_record.value->>'sku',
                    COALESCE(variant_record.value->>'currency', 'usd'),
                    (variant_record.value->>'unit_amount')::INTEGER,
                    variant_record.value->>'recurring_interval',
                    COALESCE((variant_record.value->>'recurring_interval_count')::INTEGER, 1),
                    COALESCE((variant_record.value->>'track_inventory')::BOOLEAN, false),
                    COALESCE((variant_record.value->>'inventory_quantity')::INTEGER, 0),
                    COALESCE(variant_record.value->'attributes', '{}'::JSONB),
                    COALESCE((variant_record.value->>'active')::BOOLEAN, true),
                    COALESCE((variant_record.value->>'is_default')::BOOLEAN, false),
                    (variant_record.value->>'weight')::DECIMAL,
                    variant_record.value->'dimensions'
                )
                RETURNING id INTO new_variant_id;
                
                variant_ids := variant_ids || new_variant_id;
            END;
        END LOOP;
    END IF;

    -- Build result
    result := jsonb_build_object(
        'product_id', new_product_id,
        'variant_ids', to_jsonb(variant_ids)
    );

    RETURN result;
END;
$$;

-- Function to get or create shopping cart
CREATE OR REPLACE FUNCTION public.get_or_create_cart(
    p_user_id UUID DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    cart_id UUID;
BEGIN
    -- Validate input
    IF p_user_id IS NULL AND p_session_id IS NULL THEN
        RAISE EXCEPTION 'Either user_id or session_id must be provided';
    END IF;
    
    -- Try to find existing cart
    IF p_user_id IS NOT NULL THEN
        SELECT id INTO cart_id
        FROM public.shopping_carts
        WHERE user_id = p_user_id
        AND expires_at > now()
        ORDER BY updated_at DESC
        LIMIT 1;
    ELSE
        SELECT id INTO cart_id
        FROM public.shopping_carts
        WHERE session_id = p_session_id
        AND expires_at > now()
        ORDER BY updated_at DESC
        LIMIT 1;
    END IF;
    
    -- Create new cart if none exists
    IF cart_id IS NULL THEN
        INSERT INTO public.shopping_carts (user_id, session_id, expires_at)
        VALUES (
            p_user_id, 
            p_session_id,
            now() + INTERVAL '30 days'
        )
        RETURNING id INTO cart_id;
    END IF;
    
    RETURN cart_id;
END;
$$;

-- Slug generation function (if not exists)
CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(input_text, '[^a-zA-Z0-9\s\-_]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$;

-- ==============================================================================
-- 4. ADD INDEXES FOR PERFORMANCE
-- ==============================================================================

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_stripe_id ON public.products(stripe_product_id) WHERE stripe_product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;

-- Variant indexes
CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_variants_stripe_id ON public.product_variants(stripe_price_id) WHERE stripe_price_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_variants_sku ON public.product_variants(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_variants_default ON public.product_variants(product_id, is_default) WHERE is_default = true;

-- Price indexes
CREATE INDEX IF NOT EXISTS idx_prices_stripe_id ON public.prices(stripe_price_id) WHERE stripe_price_id IS NOT NULL;

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status, payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.orders(stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment ON public.orders(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant ON public.order_items(variant_id);

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_carts_user ON public.shopping_carts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_carts_session ON public.shopping_carts(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_carts_expires ON public.shopping_carts(expires_at);

-- ==============================================================================
-- 5. ADD ROW LEVEL SECURITY
-- ==============================================================================

-- Product categories (public read, admin write)
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active categories" ON public.product_categories
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage categories" ON public.product_categories
    FOR ALL USING (public.is_admin(auth.uid()));

-- Product variants (public read for active, admin write)
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active variants" ON public.product_variants
    FOR SELECT USING (
        active = true AND 
        EXISTS (
            SELECT 1 FROM public.products p 
            WHERE p.id = product_id AND p.active = true
        )
    );

CREATE POLICY "Admins can manage variants" ON public.product_variants
    FOR ALL USING (public.is_admin(auth.uid()));

-- Orders (users can view their own, admins can view all)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Service can manage orders" ON public.orders
    FOR ALL TO service_role USING (true);

-- Order items (inherit from orders)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin(auth.uid()))
        )
    );

CREATE POLICY "Service can manage order items" ON public.order_items
    FOR ALL TO service_role USING (true);

-- Shopping carts (users can access their own)
ALTER TABLE public.shopping_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own carts" ON public.shopping_carts
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Anonymous can access session carts" ON public.shopping_carts
    FOR ALL USING (user_id IS NULL); -- Session-based access handled in application

-- Cart items (inherit from carts)
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart items" ON public.cart_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.shopping_carts sc 
            WHERE sc.id = cart_id AND sc.user_id = auth.uid()
        )
    );

CREATE POLICY "Anonymous can manage session cart items" ON public.cart_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.shopping_carts sc 
            WHERE sc.id = cart_id AND sc.user_id IS NULL
        )
    );

-- Inventory movements (read for admins, write via functions)
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view inventory movements" ON public.inventory_movements
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Service can manage inventory movements" ON public.inventory_movements
    FOR ALL TO service_role USING (true);

-- ==============================================================================
-- 6. ADD TRIGGERS FOR AUTOMATIC UPDATES
-- ==============================================================================

-- Updated_at triggers for new tables
CREATE TRIGGER update_product_categories_updated_at 
    BEFORE UPDATE ON public.product_categories 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at 
    BEFORE UPDATE ON public.product_variants 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON public.orders 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shopping_carts_updated_at 
    BEFORE UPDATE ON public.shopping_carts 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at 
    BEFORE UPDATE ON public.cart_items 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Automatic order number generation
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := public.generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.set_order_number();

-- ==============================================================================
-- 7. SAMPLE DATA FOR TESTING
-- ==============================================================================

-- Insert sample product categories
INSERT INTO public.product_categories (name, slug, description, sort_order) VALUES 
('Digital Books', 'digital-books', 'Complete digital book collections', 1),
('Individual Issues', 'issues', 'Single chapter releases', 2),
('Bundle Packs', 'bundles', 'Curated content bundles', 3),
('Merchandise', 'merchandise', 'Physical goods and collectibles', 4),
('Access Passes', 'access-passes', 'Subscription tiers and special access', 5)
ON CONFLICT (slug) DO NOTHING;

-- Migrate existing products to have slugs and categories
UPDATE public.products 
SET 
    slug = public.generate_slug(name),
    category_id = (
        SELECT id FROM public.product_categories 
        WHERE CASE 
            WHEN product_type = 'single_issue' THEN slug = 'issues'
            WHEN product_type IN ('arc_bundle', 'saga_bundle', 'volume_bundle', 'book_bundle') THEN slug = 'bundles'
            WHEN product_type = 'subscription_tier' THEN slug = 'access-passes'
            ELSE slug = 'digital-books'
        END
        LIMIT 1
    )
WHERE slug IS NULL;

-- Create variants for existing products with prices
INSERT INTO public.product_variants (
    product_id, name, currency, unit_amount, 
    active, is_default, track_inventory
)
SELECT 
    p.id,
    'Standard Edition',
    pr.currency,
    pr.unit_amount,
    pr.active,
    true, -- Default variant
    p.track_inventory
FROM public.products p
JOIN public.prices pr ON p.id = pr.product_id
WHERE NOT EXISTS (
    SELECT 1 FROM public.product_variants pv WHERE pv.product_id = p.id
);

-- ==============================================================================
-- 8. VIEWS FOR EASIER QUERYING
-- ==============================================================================

-- Complete product catalog view
CREATE OR REPLACE VIEW public.product_catalog AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.product_type,
    p.slug,
    p.images,
    p.active,
    p.is_featured,
    p.track_inventory,
    p.inventory_quantity,
    p.stripe_product_id,
    p.created_at,
    p.updated_at,
    
    -- Category info
    pc.name as category_name,
    pc.slug as category_slug,
    
    -- Content work info
    cw.title as work_title,
    cw.description as work_description,
    cw.cover_image_url as work_cover_url,
    
    -- Variant info (default variant)
    pv.id as default_variant_id,
    pv.stripe_price_id as default_stripe_price_id,
    pv.unit_amount as default_price,
    pv.currency as default_currency,
    pv.recurring_interval,
    
    -- Aggregated data
    (SELECT COUNT(*) FROM public.product_variants WHERE product_id = p.id AND active = true) as variant_count,
    (SELECT MIN(unit_amount) FROM public.product_variants WHERE product_id = p.id AND active = true) as min_price,
    (SELECT MAX(unit_amount) FROM public.product_variants WHERE product_id = p.id AND active = true) as max_price
    
FROM public.products p
LEFT JOIN public.product_categories pc ON p.category_id = pc.id
LEFT JOIN public.content_works cw ON p.work_id = cw.id
LEFT JOIN public.product_variants pv ON p.id = pv.product_id AND pv.is_default = true
WHERE p.active = true;

-- Order summary view
CREATE OR REPLACE VIEW public.order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.user_id,
    o.email,
    o.status,
    o.payment_status,
    o.fulfillment_status,
    o.total_amount,
    o.currency,
    o.created_at,
    o.confirmed_at,
    
    -- User info
    p.username,
    p.display_name,
    
    -- Order items count and details
    (SELECT COUNT(*) FROM public.order_items WHERE order_id = o.id) as item_count,
    (SELECT SUM(quantity) FROM public.order_items WHERE order_id = o.id) as total_quantity,
    
    -- Order items as JSON for easy access
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'product_name', product_name,
                'variant_name', variant_name,
                'quantity', quantity,
                'unit_amount', unit_amount,
                'total_amount', total_amount
            )
        )
        FROM public.order_items 
        WHERE order_id = o.id
    ) as items
    
FROM public.orders o
LEFT JOIN public.profiles p ON o.user_id = p.id;

COMMENT ON SCHEMA public IS 'ZOROASTERVERS enhanced e-commerce schema with Stripe catalog integration v3.0';
