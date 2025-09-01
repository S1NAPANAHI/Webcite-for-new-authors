-- ==============================================================================
-- UNIFIED ZOROASTERVERSE DATABASE SCHEMA
-- ==============================================================================
-- This migration consolidates all tables, types, functions, and policies
-- for the complete Zoroasterverse website functionality including:
-- - User management and profiles
-- - Content management (works, chapters, posts)
-- - E-commerce and subscriptions (Stripe integration)
-- - Wiki and documentation
-- - User engagement features
-- ==============================================================================

-- ==============================================================================
-- NOTE: Enums are created in migration 99999999999998_enum_setup.sql
-- This ensures enum values are committed before being used
-- ==============================================================================

-- ==============================================================================
-- CORE USER TABLES
-- ==============================================================================

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE,
    display_name text,
    avatar_url text,
    website text,
    email text,
    full_name text,
    
    -- Subscription info
    subscription_status text DEFAULT 'inactive',
    subscription_tier text,
    stripe_customer_id text UNIQUE,
    current_period_end timestamptz,
    cancel_at_period_end boolean DEFAULT false,
    
    -- User role and permissions
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    
    -- Beta reader status
    beta_reader_status text DEFAULT 'none',
    beta_reader_approved_at timestamptz,
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    
    PRIMARY KEY (id),
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- User role assignments
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role public.user_role NOT NULL,
    granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, role)
);

-- User statistics tracking
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    books_read integer DEFAULT 0 NOT NULL,
    reading_hours integer DEFAULT 0 NOT NULL,
    achievements integer DEFAULT 0 NOT NULL,
    currently_reading text DEFAULT 'None' NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Daily spins for prophecy spinner
CREATE TABLE IF NOT EXISTS public.daily_spins (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    spin_date date NOT NULL,
    spin_count integer DEFAULT 0 NOT NULL,
    last_spin_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, spin_date)
);

-- ==============================================================================
-- CONTENT MANAGEMENT TABLES
-- ==============================================================================

-- Works (books, volumes, sagas, arcs)
CREATE TABLE IF NOT EXISTS public.works (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    type public.work_type NOT NULL,
    parent_id uuid REFERENCES public.works(id) ON DELETE CASCADE,
    order_in_parent integer,
    description text,
    status public.work_status DEFAULT 'planning'::public.work_status NOT NULL,
    release_date date,
    cover_image_url text,
    is_featured boolean DEFAULT false,
    is_premium boolean DEFAULT false,
    is_free boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Chapters within works
CREATE TABLE IF NOT EXISTS public.chapters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id uuid NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
    title text NOT NULL,
    chapter_number integer NOT NULL,
    content text,
    file_path text,
    is_published boolean DEFAULT false,
    is_premium boolean DEFAULT false,
    is_free boolean DEFAULT true,
    word_count integer,
    estimated_read_time integer,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Blog posts and news
CREATE TABLE IF NOT EXISTS public.posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text,
    excerpt text,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured boolean DEFAULT false,
    tags text[] DEFAULT '{}',
    
    -- SEO fields
    seo_title text,
    seo_description text,
    seo_keywords text[],
    
    -- Statistics
    views integer DEFAULT 0,
    
    -- Dates
    published_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Static pages
CREATE TABLE IF NOT EXISTS public.pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id uuid,
    category_id uuid,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text,
    status text DEFAULT 'draft',
    
    -- SEO fields
    seo_title text,
    seo_description text,
    seo_keywords text[],
    
    -- Publishing
    is_published boolean DEFAULT false,
    published_at timestamptz,
    
    -- Statistics  
    view_count integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Characters
CREATE TABLE IF NOT EXISTS public.characters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    title text,
    description text,
    traits text[],
    image_url text,
    silhouette_url text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- User reading progress
CREATE TABLE IF NOT EXISTS public.reading_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    progress_percentage numeric(5,2) DEFAULT 0,
    last_position text,
    is_completed boolean DEFAULT false,
    last_read_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (user_id, chapter_id)
);

-- User ratings and reviews
CREATE TABLE IF NOT EXISTS public.user_ratings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    work_id uuid NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (user_id, work_id)
);

-- ==============================================================================
-- WIKI TABLES
-- ==============================================================================

-- Wiki folder structure
CREATE TABLE IF NOT EXISTS public.wiki_folders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text NOT NULL,
    parent_id uuid REFERENCES public.wiki_folders(id) ON DELETE CASCADE,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (parent_id, slug)
);

-- Wiki categories
CREATE TABLE IF NOT EXISTS public.wiki_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    parent_id uuid REFERENCES public.wiki_categories(id) ON DELETE SET NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Wiki pages
CREATE TABLE IF NOT EXISTS public.wiki_pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id uuid REFERENCES public.wiki_folders(id) ON DELETE SET NULL,
    category_id uuid REFERENCES public.wiki_categories(id) ON DELETE SET NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text,
    excerpt text,
    is_published boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (folder_id, slug)
);

-- Wiki page revisions
CREATE TABLE IF NOT EXISTS public.wiki_revisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id uuid NOT NULL REFERENCES public.wiki_pages(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    content jsonb NOT NULL,
    excerpt text,
    change_summary text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Wiki content blocks
CREATE TABLE IF NOT EXISTS public.wiki_content_blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id uuid NOT NULL REFERENCES public.wiki_pages(id) ON DELETE CASCADE,
    type public.content_block_type NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    position integer NOT NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Wiki media files
CREATE TABLE IF NOT EXISTS public.wiki_media (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_type text NOT NULL,
    file_size bigint NOT NULL,
    alt_text text,
    caption text,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- ==============================================================================
-- E-COMMERCE TABLES
-- ==============================================================================

-- Products (books, subscriptions, etc.)
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    title text NOT NULL,
    description text,
    product_type public.product_type,
    cover_image_url text,
    file_key text,
    is_bundle boolean DEFAULT false,
    is_subscription boolean DEFAULT false,
    is_premium boolean DEFAULT false,
    active boolean DEFAULT true NOT NULL,
    status text DEFAULT 'draft',
    published_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Pricing for products
CREATE TABLE IF NOT EXISTS public.prices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    price_id text NOT NULL UNIQUE, -- Stripe price ID
    provider text NOT NULL DEFAULT 'stripe',
    nickname text,
    currency text NOT NULL DEFAULT 'USD',
    amount_cents integer NOT NULL,
    unit_amount integer NOT NULL, -- For compatibility
    interval text, -- 'month', 'year' for subscriptions
    interval_count integer DEFAULT 1,
    trial_period_days integer DEFAULT 0,
    trial_days integer DEFAULT 0, -- For compatibility
    active boolean DEFAULT true NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Customer data for Stripe
CREATE TABLE IF NOT EXISTS public.stripe_customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id text NOT NULL UNIQUE,
    email text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    provider text NOT NULL DEFAULT 'stripe',
    provider_subscription_id text NOT NULL,
    plan_id text,
    plan_price_id uuid REFERENCES public.prices(id),
    status public.subscription_status NOT NULL DEFAULT 'active',
    cancel_at_period_end boolean DEFAULT false,
    current_period_start timestamptz,
    current_period_end timestamptz,
    trial_start timestamptz,
    trial_end timestamptz,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Orders for one-time purchases
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    provider text NOT NULL DEFAULT 'stripe',
    provider_session_id text,
    provider_payment_intent_id text,
    price_id uuid REFERENCES public.prices(id),
    status text DEFAULT 'pending',
    amount_cents integer NOT NULL,
    currency text DEFAULT 'USD',
    customer_email text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Purchases (completed orders)
CREATE TABLE IF NOT EXISTS public.purchases (
    id text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    price_id text NOT NULL REFERENCES public.prices(price_id) ON DELETE RESTRICT,
    status text NOT NULL,
    purchased_at timestamptz DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    total integer NOT NULL,
    currency text NOT NULL,
    hosted_invoice_url text,
    pdf_url text,
    status text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Refunds
CREATE TABLE IF NOT EXISTS public.refunds (
    id text PRIMARY KEY,
    invoice_id text NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    currency text NOT NULL,
    reason text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- User entitlements (access to specific content)
CREATE TABLE IF NOT EXISTS public.entitlements (
    id bigserial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    work_id uuid REFERENCES public.works(id) ON DELETE CASCADE,
    scope text NOT NULL, -- 'work', 'chapter', 'subscription'
    source text NOT NULL, -- 'purchase', 'subscription', 'admin_grant'
    source_id uuid, -- Reference to subscription, order, etc.
    is_active boolean DEFAULT true,
    starts_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Promotions and discount codes
CREATE TABLE IF NOT EXISTS public.promotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    description text,
    discount_type public.discount_type NOT NULL,
    discount_value numeric NOT NULL,
    active boolean DEFAULT true NOT NULL,
    start_date timestamptz,
    end_date timestamptz,
    usage_limit integer,
    usage_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT promotions_code_check CHECK (code <> ''),
    CONSTRAINT promotions_discount_value_check CHECK (discount_value > 0)
);

-- Product reviews
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title text,
    review_text text,
    is_verified_purchase boolean DEFAULT false,
    is_approved boolean DEFAULT false,
    approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (user_id, product_id)
);

-- ==============================================================================
-- SYSTEM TABLES
-- ==============================================================================

-- Homepage content sections
CREATE TABLE IF NOT EXISTS public.homepage_content (
    id bigserial PRIMARY KEY,
    title text,
    content text NOT NULL,
    section text NOT NULL,
    order_position integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- News items
CREATE TABLE IF NOT EXISTS public.news_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text,
    status text DEFAULT 'draft',
    date date NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Release announcements
CREATE TABLE IF NOT EXISTS public.release_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'available',
    description text,
    link text,
    release_date date NOT NULL,
    purchase_link text,
    is_featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Recent activity feed
CREATE TABLE IF NOT EXISTS public.recent_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    type text NOT NULL,
    description text NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Beta reader applications
CREATE TABLE IF NOT EXISTS public.beta_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    status public.beta_application_status DEFAULT 'pending',
    admin_notes text,
    
    -- Application form data
    full_name text NOT NULL,
    email text NOT NULL,
    time_zone text NOT NULL,
    country text,
    goodreads text,
    beta_commitment text NOT NULL,
    hours_per_week text NOT NULL,
    portal_use text NOT NULL,
    recent_reads text,
    interest_statement text NOT NULL,
    prior_beta text,
    feedback_philosophy text NOT NULL,
    track_record text,
    communication text NOT NULL,
    devices text[],
    access_needs text,
    demographics text,
    
    -- Scoring
    stage1_raw_score integer,
    stage1_passed boolean,
    stage1_auto_fail boolean,
    stage2_raw_score integer,
    stage2_passed boolean,
    stage3_raw_score integer,
    stage3_passed boolean,
    stage4_raw_score integer,
    stage4_passed boolean,
    composite_score numeric,
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Audit logging
CREATE TABLE IF NOT EXISTS public.audit_log (
    id bigserial PRIMARY KEY,
    actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    action text NOT NULL,
    target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    target_id text,
    target_type text,
    before jsonb,
    after jsonb,
    ip inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- Webhook events tracking
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider text NOT NULL,
    event_id text NOT NULL,
    event_type text NOT NULL,
    payload jsonb NOT NULL,
    processed boolean DEFAULT false,
    received_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now() NOT NULL
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================

-- Profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_works_parent_id ON public.works(parent_id);
CREATE INDEX IF NOT EXISTS idx_works_type ON public.works(type);
CREATE INDEX IF NOT EXISTS idx_works_status ON public.works(status);
CREATE INDEX IF NOT EXISTS idx_works_premium ON public.works(is_premium, is_free);

CREATE INDEX IF NOT EXISTS idx_chapters_work_id ON public.chapters(work_id);
CREATE INDEX IF NOT EXISTS idx_chapters_published ON public.chapters(is_published);
CREATE INDEX IF NOT EXISTS idx_chapters_premium ON public.chapters(is_premium, is_free);

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON public.pages(is_published);

-- E-commerce indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_type ON public.products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);

CREATE INDEX IF NOT EXISTS idx_prices_product_id ON public.prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_price_id ON public.prices(price_id);
CREATE INDEX IF NOT EXISTS idx_prices_active ON public.prices(active);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider_id ON public.subscriptions(provider_subscription_id);

CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON public.stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_id ON public.stripe_customers(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON public.entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_work_id ON public.entitlements(work_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_active ON public.entitlements(is_active);

-- User activity indexes
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON public.reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_chapter_id ON public.reading_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON public.user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_work_id ON public.user_ratings(work_id);
CREATE INDEX IF NOT EXISTS idx_daily_spins_date ON public.daily_spins(spin_date);

-- Wiki indexes
CREATE INDEX IF NOT EXISTS idx_wiki_folders_parent_id ON public.wiki_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_wiki_categories_parent_id ON public.wiki_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_folder_id ON public.wiki_pages(folder_id);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_category_id ON public.wiki_pages(category_id);
CREATE INDEX IF NOT EXISTS idx_wiki_revisions_page_id ON public.wiki_revisions(page_id);
CREATE INDEX IF NOT EXISTS idx_wiki_content_blocks_page_id ON public.wiki_content_blocks(page_id);

-- System indexes
CREATE INDEX IF NOT EXISTS idx_homepage_content_section ON public.homepage_content(section);
CREATE INDEX IF NOT EXISTS idx_recent_activity_created_at ON public.recent_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON public.webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON public.audit_log(actor_user_id);

-- ==============================================================================
-- HELPER FUNCTIONS
-- ==============================================================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Drop ALL existing is_admin functions to avoid signature conflicts
-- This will temporarily break dependent policies but they'll be recreated
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Find and drop all is_admin functions
    FOR func_record IN 
        SELECT p.oid, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public' AND p.proname = 'is_admin'
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS public.is_admin(%s) CASCADE', func_record.args);
    END LOOP;
END $$;

-- Now create the single is_admin function we want
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = p_user_id
          AND (role = 'admin'::public.user_role OR role = 'super_admin'::public.user_role)
    );
$$;

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid UUID DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    is_active boolean := false;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_uuid
        AND subscription_status = 'active'
        AND (current_period_end IS NULL OR current_period_end > NOW())
    ) INTO is_active;
    
    RETURN is_active;
END;
$$;

-- Function to get user's subscription tier
CREATE OR REPLACE FUNCTION public.get_user_subscription_tier(user_uuid UUID DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    tier text;
BEGIN
    SELECT subscription_tier 
    FROM public.profiles
    WHERE id = user_uuid
    AND subscription_status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW())
    INTO tier;
    
    RETURN COALESCE(tier, 'free');
END;
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Create profile for new user
    INSERT INTO public.profiles (id, username, email, role)
    VALUES (NEW.id, NEW.email, NEW.email, 'user');
    
    -- Create user stats
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$;

-- ==============================================================================
-- TRIGGERS
-- ==============================================================================

-- New user trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers for all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_works_updated_at ON public.works;
CREATE TRIGGER update_works_updated_at
    BEFORE UPDATE ON public.works
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_chapters_updated_at ON public.chapters;
CREATE TRIGGER update_chapters_updated_at
    BEFORE UPDATE ON public.chapters
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON public.pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_prices_updated_at ON public.prices;
CREATE TRIGGER update_prices_updated_at
    BEFORE UPDATE ON public.prices
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- User stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own stats" ON public.user_stats;
CREATE POLICY "Users can manage their own stats"
    ON public.user_stats FOR ALL
    USING (auth.uid() = user_id);

-- Daily spins
ALTER TABLE public.daily_spins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own spins" ON public.daily_spins;
CREATE POLICY "Users can manage their own spins"
    ON public.daily_spins FOR ALL
    USING (auth.uid() = user_id);

-- Works (content access based on subscription)
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view free works" ON public.works;
CREATE POLICY "Everyone can view free works"
    ON public.works FOR SELECT
    USING (is_free = true OR is_premium = false);

DROP POLICY IF EXISTS "Subscribers can view premium works" ON public.works;
CREATE POLICY "Subscribers can view premium works"
    ON public.works FOR SELECT
    TO authenticated
    USING (
        is_premium = true 
        AND (
            public.has_active_subscription()
            OR EXISTS (
                SELECT 1 FROM public.entitlements e
                WHERE e.user_id = auth.uid()
                AND e.work_id = works.id
                AND e.is_active = true
                AND (e.expires_at IS NULL OR e.expires_at > NOW())
            )
        )
    );

DROP POLICY IF EXISTS "Admins can manage all works" ON public.works;
CREATE POLICY "Admins can manage all works"
    ON public.works FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Chapters (content access based on subscription)
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view free published chapters" ON public.chapters;
CREATE POLICY "Everyone can view free published chapters"
    ON public.chapters FOR SELECT
    USING (is_published = true AND (is_free = true OR is_premium = false));

DROP POLICY IF EXISTS "Subscribers can view premium published chapters" ON public.chapters;
CREATE POLICY "Subscribers can view premium published chapters"
    ON public.chapters FOR SELECT
    TO authenticated
    USING (
        is_published = true 
        AND is_premium = true 
        AND public.has_active_subscription()
    );

DROP POLICY IF EXISTS "Admins can manage all chapters" ON public.chapters;
CREATE POLICY "Admins can manage all chapters"
    ON public.chapters FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published posts viewable by everyone" ON public.posts;
CREATE POLICY "Published posts viewable by everyone"
    ON public.posts FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "Authors can manage their own posts" ON public.posts;
CREATE POLICY "Authors can manage their own posts"
    ON public.posts FOR ALL
    USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
CREATE POLICY "Admins can manage all posts"
    ON public.posts FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Pages
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published pages viewable by everyone" ON public.pages;
CREATE POLICY "Published pages viewable by everyone"
    ON public.pages FOR SELECT
    USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage all pages" ON public.pages;
CREATE POLICY "Admins can manage all pages"
    ON public.pages FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active products viewable by everyone" ON public.products;
CREATE POLICY "Active products viewable by everyone"
    ON public.products FOR SELECT
    USING (active = true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
    ON public.products FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Prices
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active prices viewable by everyone" ON public.prices;
CREATE POLICY "Active prices viewable by everyone"
    ON public.prices FOR SELECT
    USING (active = true);

DROP POLICY IF EXISTS "Admins can manage prices" ON public.prices;
CREATE POLICY "Admins can manage prices"
    ON public.prices FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage all subscriptions"
    ON public.subscriptions FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Service role policies for backend operations
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Service role can manage subscriptions"
    ON public.subscriptions FOR ALL
    USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage customers" ON public.stripe_customers;
CREATE POLICY "Service role can manage customers"
    ON public.stripe_customers FOR ALL
    USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage profiles" ON public.profiles;
CREATE POLICY "Service role can manage profiles"
    ON public.profiles FOR ALL
    USING (auth.role() = 'service_role');

-- Entitlements
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own entitlements" ON public.entitlements;
CREATE POLICY "Users can view their own entitlements"
    ON public.entitlements FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all entitlements" ON public.entitlements;
CREATE POLICY "Admins can manage all entitlements"
    ON public.entitlements FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Reading progress
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own reading progress" ON public.reading_progress;
CREATE POLICY "Users can manage their own reading progress"
    ON public.reading_progress FOR ALL
    USING (auth.uid() = user_id);

-- User ratings
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User ratings viewable by everyone" ON public.user_ratings;
CREATE POLICY "User ratings viewable by everyone"
    ON public.user_ratings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can manage their own ratings" ON public.user_ratings;
CREATE POLICY "Users can manage their own ratings"
    ON public.user_ratings FOR ALL
    USING (auth.uid() = user_id);

-- Beta applications
ALTER TABLE public.beta_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own beta application" ON public.beta_applications;
CREATE POLICY "Users can manage their own beta application"
    ON public.beta_applications FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all beta applications" ON public.beta_applications;
CREATE POLICY "Admins can manage all beta applications"
    ON public.beta_applications FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- System tables (admin only)
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Homepage content
DROP POLICY IF EXISTS "Homepage content viewable by everyone" ON public.homepage_content;
CREATE POLICY "Homepage content viewable by everyone"
    ON public.homepage_content FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage homepage content" ON public.homepage_content;
CREATE POLICY "Admins can manage homepage content"
    ON public.homepage_content FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- News items
DROP POLICY IF EXISTS "Published news viewable by everyone" ON public.news_items;
CREATE POLICY "Published news viewable by everyone"
    ON public.news_items FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage news" ON public.news_items;
CREATE POLICY "Admins can manage news"
    ON public.news_items FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Release items
DROP POLICY IF EXISTS "Release items viewable by everyone" ON public.release_items;
CREATE POLICY "Release items viewable by everyone"
    ON public.release_items FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage releases" ON public.release_items;
CREATE POLICY "Admins can manage releases"
    ON public.release_items FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Recent activity
DROP POLICY IF EXISTS "Recent activity viewable by everyone" ON public.recent_activity;
CREATE POLICY "Recent activity viewable by everyone"
    ON public.recent_activity FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage activity" ON public.recent_activity;
CREATE POLICY "Admins can manage activity"
    ON public.recent_activity FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Audit log (admin only)
DROP POLICY IF EXISTS "Admins can view audit log" ON public.audit_log;
CREATE POLICY "Admins can view audit log"
    ON public.audit_log FOR SELECT
    USING (public.is_admin());

-- Webhook events (no client access)
DROP POLICY IF EXISTS "No client access to webhooks" ON public.webhook_events;
CREATE POLICY "No client access to webhooks"
    ON public.webhook_events
    USING (false);

-- ==============================================================================
-- GRANT PERMISSIONS
-- ==============================================================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.has_active_subscription TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_subscription_tier TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- ==============================================================================
-- INITIAL DATA FOR STRIPE SUBSCRIPTIONS
-- ==============================================================================

-- Insert subscription products
INSERT INTO public.products (slug, name, title, description, product_type, is_subscription, active, status, published_at) VALUES
(
    'monthly-membership',
    'Monthly Membership',
    'Monthly Membership',
    'Access to all released chapters and new chapters as they are written. Includes community access and behind-the-scenes content.',
    'subscription',
    true,
    true,
    'published',
    NOW()
),
(
    'annual-membership', 
    'Annual Membership',
    'Annual Membership',
    'Everything in Monthly plan plus 2 months free, priority content access, exclusive annual content, and direct Q&A with author.',
    'subscription',
    true,
    true,
    'published',
    NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Stripe price data
INSERT INTO public.prices (product_id, provider, price_id, currency, amount_cents, unit_amount, interval, interval_count, trial_period_days, trial_days, active) VALUES
(
    (SELECT id FROM public.products WHERE slug = 'monthly-membership'),
    'stripe',
    'price_1S2L8JQv3TvmaocsYofzFKgm',
    'USD',
    999,
    999,
    'month',
    1,
    0,
    0,
    true
),
(
    (SELECT id FROM public.products WHERE slug = 'annual-membership'),
    'stripe', 
    'price_1S2L95Qv3TvmaocsN5zRIEXO',
    'USD',
    9999,
    9999,
    'year',
    1,
    0,
    0,
    true
)
ON CONFLICT (price_id) DO NOTHING;

-- ==============================================================================
-- SAMPLE DATA
-- ==============================================================================

-- Sample homepage content
INSERT INTO public.homepage_content (title, content, section, order_position) VALUES 
('Welcome to Zoroasterverse', 'Experience the epic saga of cosmic proportions', 'hero', 1),
('About the Universe', 'Dive into a world where ancient wisdom meets modern storytelling', 'about', 2),
('Latest Updates', 'Stay up to date with the latest releases and announcements', 'updates', 3)
ON CONFLICT DO NOTHING;

-- Sample release items
INSERT INTO public.release_items (title, type, description, release_date, link) VALUES 
('Welcome Chapter Available', 'chapter', 'The first chapter of our epic journey is now live', CURRENT_DATE, '/read/1'),
('Character Profiles Updated', 'announcement', 'New character profiles added to the wiki', CURRENT_DATE - INTERVAL '1 day', '/wiki/characters'),
('Beta Reader Program Open', 'announcement', 'Applications now open for beta readers', CURRENT_DATE - INTERVAL '2 days', '/beta/application')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- VALIDATION QUERIES
-- ==============================================================================

-- These queries can be used to verify the schema was created correctly:
/*
-- Check all tables exist
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check subscription system
SELECT p.slug, pr.price_id, pr.amount_cents, pr.interval
FROM products p
JOIN prices pr ON p.id = pr.product_id
WHERE p.is_subscription = true;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
*/

-- ==============================================================================
-- END OF UNIFIED MIGRATION
-- ==============================================================================
