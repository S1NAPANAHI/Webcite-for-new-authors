-- ==============================================================================
-- DEPLOY UNIFIED SCHEMA + MISSING TABLES
-- ==============================================================================
-- Run this script in your Supabase SQL Editor to fix all the 404 errors
-- ==============================================================================

-- ==============================================================================
-- 1. EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;

-- ==============================================================================
-- 2. CUSTOM TYPES
-- ==============================================================================

-- User role system
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('user', 'beta_reader', 'admin', 'super_admin');
    END IF;
END$$;

-- Subscription management
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE public.subscription_status AS ENUM (
            'incomplete', 'incomplete_expired', 'trialing', 'active', 
            'past_due', 'canceled', 'unpaid', 'paused'
        );
    END IF;
END$$;

-- Content management
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type') THEN
        CREATE TYPE public.content_type AS ENUM (
            'book', 'volume', 'saga', 'arc', 'issue', 'chapter'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
        CREATE TYPE public.content_status AS ENUM (
            'planning', 'writing', 'editing', 'published', 'on_hold', 'archived'
        );
    END IF;
END$$;

-- Wiki management
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wiki_content_type') THEN
        CREATE TYPE public.wiki_content_type AS ENUM (
            'heading_1', 'heading_2', 'heading_3', 'paragraph', 'bullet_list',
            'ordered_list', 'image', 'video', 'audio', 'table', 'quote', 
            'code', 'divider', 'file_attachment'
        );
    END IF;
END$$;

-- Product and commerce
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
        CREATE TYPE public.product_type AS ENUM (
            'single_issue', 'arc_bundle', 'saga_bundle', 'volume_bundle', 
            'book_bundle', 'subscription_tier'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discount_type') THEN
        CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed_amount');
    END IF;
END$$;

-- Beta reader system
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'beta_application_status') THEN
        CREATE TYPE public.beta_application_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END$$;

-- User activity tracking
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
        CREATE TYPE public.activity_type AS ENUM (
            'chapter_read', 'book_completed', 'review_posted', 'comment_posted',
            'wiki_edited', 'profile_updated', 'subscription_started', 'achievement_earned'
        );
    END IF;
END$$;

-- ==============================================================================
-- 3. CORE USER TABLES
-- ==============================================================================

-- Helper function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enhanced user profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE,
    display_name text,
    avatar_url text,
    bio text,
    website text,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    
    -- Subscription info
    subscription_tier integer DEFAULT 0 NOT NULL, -- 0=free, 1=basic, 2=premium
    subscription_status text DEFAULT 'inactive',
    stripe_customer_id text UNIQUE,
    
    -- Privacy settings
    profile_visibility text DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'friends_only')),
    show_reading_progress boolean DEFAULT true,
    show_achievements boolean DEFAULT true,
    
    -- Email preferences
    email_notifications boolean DEFAULT true,
    marketing_emails boolean DEFAULT false,
    
    -- Statistics (cached for performance)
    total_reading_time integer DEFAULT 0, -- in minutes
    books_completed integer DEFAULT 0,
    chapters_read integer DEFAULT 0,
    reviews_written integer DEFAULT 0,
    
    -- Timestamps
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    last_active_at timestamptz DEFAULT now(),
    
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
    CONSTRAINT display_name_length CHECK (char_length(display_name) <= 100),
    CONSTRAINT bio_length CHECK (char_length(bio) <= 500)
);

-- User statistics table (detailed analytics)
CREATE TABLE IF NOT EXISTS public.user_statistics (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Reading statistics
    total_reading_minutes integer DEFAULT 0,
    books_read integer DEFAULT 0,
    chapters_read integer DEFAULT 0,
    current_streak_days integer DEFAULT 0,
    longest_streak_days integer DEFAULT 0,
    last_read_date date,
    
    -- Engagement statistics
    reviews_posted integer DEFAULT 0,
    comments_posted integer DEFAULT 0,
    wiki_contributions integer DEFAULT 0,
    forum_posts integer DEFAULT 0,
    
    -- Achievement statistics
    achievements_unlocked integer DEFAULT 0,
    points_earned integer DEFAULT 0,
    level_reached integer DEFAULT 1,
    
    -- Subscription statistics
    subscription_start_date timestamptz,
    subscription_months integer DEFAULT 0,
    total_spent numeric(10,2) DEFAULT 0,
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 4. SUBSCRIPTION MANAGEMENT
-- ==============================================================================

-- Subscription plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    stripe_price_id text UNIQUE,
    tier integer NOT NULL, -- 1=basic, 2=premium
    price_cents integer NOT NULL,
    currency text DEFAULT 'usd',
    interval text NOT NULL CHECK (interval IN ('month', 'year')),
    trial_days integer DEFAULT 0,
    features jsonb DEFAULT '[]'::jsonb,
    content_access jsonb DEFAULT '[]'::jsonb, -- Which content types this plan grants access to
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id text REFERENCES public.subscription_plans(id),
    stripe_subscription_id text UNIQUE,
    stripe_customer_id text,
    
    status public.subscription_status NOT NULL,
    cancel_at_period_end boolean DEFAULT false,
    
    -- Periods
    current_period_start timestamptz,
    current_period_end timestamptz,
    trial_start timestamptz,
    trial_end timestamptz,
    canceled_at timestamptz,
    
    -- Metadata
    metadata jsonb DEFAULT '{}'::jsonb,
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Payment history
CREATE TABLE IF NOT EXISTS public.payment_history (
    id text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id uuid REFERENCES public.subscriptions(id),
    stripe_payment_intent_id text,
    stripe_invoice_id text,
    
    amount integer NOT NULL,
    currency text DEFAULT 'usd',
    status text NOT NULL,
    description text,
    
    created_at timestamptz DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 5. CONTENT MANAGEMENT SYSTEM
-- ==============================================================================

-- Content hierarchy (books > volumes > sagas > arcs > issues > chapters)
CREATE TABLE IF NOT EXISTS public.content_works (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    content_type public.content_type NOT NULL,
    parent_id uuid REFERENCES public.content_works(id) ON DELETE CASCADE,
    order_in_parent integer DEFAULT 0,
    
    -- Status and visibility
    status public.content_status DEFAULT 'planning',
    is_published boolean DEFAULT false,
    is_featured boolean DEFAULT false,
    requires_subscription boolean DEFAULT false,
    subscription_tier_required integer DEFAULT 0,
    
    -- Content details
    word_count integer DEFAULT 0,
    estimated_read_time integer DEFAULT 0, -- in minutes
    chapter_count integer DEFAULT 0,
    completed_chapter_count integer DEFAULT 0,
    
    -- Media
    cover_image_url text,
    trailer_video_url text,
    
    -- SEO
    seo_title text,
    seo_description text,
    seo_keywords text[],
    
    -- Statistics
    view_count integer DEFAULT 0,
    favorite_count integer DEFAULT 0,
    average_rating numeric(3,2),
    rating_count integer DEFAULT 0,
    
    -- Dates
    release_date date,
    next_update_date date,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Individual chapters/content pieces
CREATE TABLE IF NOT EXISTS public.content_chapters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id uuid NOT NULL REFERENCES public.content_works(id) ON DELETE CASCADE,
    title text NOT NULL,
    slug text NOT NULL,
    chapter_number integer,
    
    -- Content
    content text,
    excerpt text,
    
    -- Status
    is_published boolean DEFAULT false,
    requires_subscription boolean DEFAULT false,
    subscription_tier_required integer DEFAULT 0,
    
    -- Metadata
    word_count integer DEFAULT 0,
    estimated_read_time integer DEFAULT 0,
    
    -- File storage (for premium content files)
    file_path text, -- Path in Supabase Storage
    file_bucket text DEFAULT 'content',
    
    -- SEO
    seo_title text,
    seo_description text,
    
    -- Statistics
    view_count integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    
    UNIQUE (work_id, slug)
);

-- User reading progress
CREATE TABLE IF NOT EXISTS public.reading_progress (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter_id uuid NOT NULL REFERENCES public.content_chapters(id) ON DELETE CASCADE,
    
    progress_percentage numeric(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_position text, -- JSON with reading position data
    is_completed boolean DEFAULT false,
    reading_time_minutes integer DEFAULT 0,
    
    first_read_at timestamptz DEFAULT now(),
    last_read_at timestamptz DEFAULT now(),
    
    PRIMARY KEY (user_id, chapter_id)
);

-- ==============================================================================
-- 6. WIKI SYSTEM WITH STORAGE INTEGRATION
-- ==============================================================================

-- Wiki categories (topics/subjects)
CREATE TABLE IF NOT EXISTS public.wiki_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    parent_id uuid REFERENCES public.wiki_categories(id) ON DELETE CASCADE,
    
    -- Display
    icon text, -- Icon name or emoji
    color text, -- Hex color for theming
    sort_order integer DEFAULT 0,
    
    -- Permissions
    is_public boolean DEFAULT true,
    requires_subscription boolean DEFAULT false,
    
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Wiki pages
CREATE TABLE IF NOT EXISTS public.wiki_pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid REFERENCES public.wiki_categories(id) ON DELETE SET NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    
    title text NOT NULL,
    slug text NOT NULL,
    content jsonb DEFAULT '[]'::jsonb, -- Rich content blocks
    excerpt text,
    
    -- Status and visibility
    is_published boolean DEFAULT false,
    is_featured boolean DEFAULT false,
    requires_subscription boolean DEFAULT false,
    
    -- SEO
    seo_title text,
    seo_description text,
    seo_keywords text[],
    
    -- Statistics
    view_count integer DEFAULT 0,
    
    -- Version control
    version integer DEFAULT 1,
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    
    UNIQUE (category_id, slug)
);

-- Wiki revisions (for version control)
CREATE TABLE IF NOT EXISTS public.wiki_revisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id uuid NOT NULL REFERENCES public.wiki_pages(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    title text NOT NULL,
    content jsonb NOT NULL,
    excerpt text,
    change_summary text,
    version integer NOT NULL,
    
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Wiki media files (integrates with Supabase Storage)
CREATE TABLE IF NOT EXISTS public.wiki_media (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    page_id uuid REFERENCES public.wiki_pages(id) ON DELETE SET NULL,
    
    -- File information
    file_name text NOT NULL,
    file_path text NOT NULL, -- Path in Supabase Storage bucket
    bucket_name text DEFAULT 'wiki-media',
    file_type text NOT NULL,
    file_size bigint NOT NULL,
    mime_type text,
    
    -- Metadata
    alt_text text,
    caption text,
    title text,
    
    -- Image-specific metadata
    width integer,
    height integer,
    
    -- Organization
    tags text[] DEFAULT '{}',
    is_featured boolean DEFAULT false,
    
    created_at timestamptz DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 7. COMMERCE AND PRODUCTS
-- ==============================================================================

-- Products
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    product_type public.product_type NOT NULL,
    
    -- Linking to content
    work_id uuid REFERENCES public.content_works(id) ON DELETE SET NULL,
    content_grants jsonb DEFAULT '[]'::jsonb, -- What content access this grants
    
    -- Pricing
    price_cents integer,
    currency text DEFAULT 'usd',
    
    -- Status
    active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    
    -- Media
    image_url text,
    gallery_urls text[] DEFAULT '{}',
    
    -- Metadata
    metadata jsonb DEFAULT '{}'::jsonb,
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Product reviews
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text text,
    is_verified_purchase boolean DEFAULT false,
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    
    UNIQUE (user_id, product_id)
);

-- Promotions and discounts
CREATE TABLE IF NOT EXISTS public.promotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    description text,
    
    discount_type public.discount_type NOT NULL,
    discount_value numeric NOT NULL CHECK (discount_value > 0),
    
    -- Validity
    active boolean DEFAULT true,
    start_date timestamptz,
    end_date timestamptz,
    
    -- Usage limits
    usage_limit integer,
    usage_count integer DEFAULT 0,
    per_user_limit integer DEFAULT 1,
    
    -- Applicable products (empty array = all products)
    applicable_products uuid[] DEFAULT '{}',
    minimum_purchase_amount integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 8. USER ACTIVITY AND ANALYTICS
-- ==============================================================================

-- User activity log
CREATE TABLE IF NOT EXISTS public.user_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    activity_type public.activity_type NOT NULL,
    description text NOT NULL,
    
    -- Related entities
    related_content_id uuid, -- Could be chapter, book, etc.
    related_content_type text, -- 'chapter', 'book', 'wiki_page', etc.
    
    -- Activity data
    metadata jsonb DEFAULT '{}'::jsonb,
    points_earned integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Daily user statistics (for analytics dashboard)
CREATE TABLE IF NOT EXISTS public.daily_user_stats (
    date date NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Reading activity
    minutes_read integer DEFAULT 0,
    chapters_read integer DEFAULT 0,
    books_completed integer DEFAULT 0,
    
    -- Engagement
    wiki_edits integer DEFAULT 0,
    reviews_posted integer DEFAULT 0,
    comments_posted integer DEFAULT 0,
    
    -- Session info
    sessions integer DEFAULT 0,
    total_session_time integer DEFAULT 0, -- in seconds
    
    PRIMARY KEY (date, user_id)
);

-- Site-wide statistics (cached daily)
CREATE TABLE IF NOT EXISTS public.site_statistics (
    date date PRIMARY KEY,
    
    -- User metrics
    total_users integer DEFAULT 0,
    new_users_today integer DEFAULT 0,
    active_users_today integer DEFAULT 0,
    active_subscribers integer DEFAULT 0,
    
    -- Content metrics
    total_content_views integer DEFAULT 0,
    new_content_pieces integer DEFAULT 0,
    
    -- Engagement metrics
    total_reading_time_minutes integer DEFAULT 0,
    total_reviews integer DEFAULT 0,
    total_wiki_edits integer DEFAULT 0,
    
    -- Revenue metrics (if applicable)
    new_subscriptions integer DEFAULT 0,
    canceled_subscriptions integer DEFAULT 0,
    revenue_cents integer DEFAULT 0,
    
    created_at timestamptz DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 9. BETA READER SYSTEM
-- ==============================================================================

-- Beta applications
CREATE TABLE IF NOT EXISTS public.beta_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    
    status public.beta_application_status DEFAULT 'pending',
    admin_notes text,
    
    -- Application data
    full_name text NOT NULL,
    email text NOT NULL,
    time_zone text NOT NULL,
    country text,
    
    -- Beta reader details
    goodreads_profile text,
    beta_commitment text NOT NULL,
    hours_per_week text NOT NULL,
    portal_use text NOT NULL,
    recent_reads text,
    interest_statement text NOT NULL,
    prior_beta_experience text,
    feedback_philosophy text NOT NULL,
    track_record text,
    communication_style text NOT NULL,
    
    -- Technical details
    devices text[] DEFAULT '{}',
    access_needs text,
    demographics text,
    
    -- Scoring (if used)
    composite_score numeric,
    
    created_at timestamptz DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 10. MISSING FRONTEND TABLES
-- ==============================================================================

-- Homepage content table (for homepage sections)
CREATE TABLE IF NOT EXISTS public.homepage_content (
    id bigserial PRIMARY KEY,
    title text,
    content text NOT NULL,
    section text NOT NULL, -- 'hero', 'about', 'features', etc.
    order_position integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Release items table (for release announcements)
CREATE TABLE IF NOT EXISTS public.release_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    type text NOT NULL, -- 'chapter', 'book', 'announcement', etc.
    status text DEFAULT 'available',
    description text,
    link text, -- Link to the content or announcement
    release_date date NOT NULL,
    is_featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Posts table (for blog posts and news)
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
    
    -- SEO
    seo_title text,
    seo_description text,
    
    -- Statistics
    views integer DEFAULT 0,
    
    -- Dates
    published_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Daily spins table (for the prophecy spinner feature)
CREATE TABLE IF NOT EXISTS public.daily_spins (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    spin_date date NOT NULL,
    spin_count integer DEFAULT 0 NOT NULL,
    last_spin_at timestamptz,
    PRIMARY KEY (user_id, spin_date)
);

-- ==============================================================================
-- 11. SYSTEM TABLES
-- ==============================================================================

-- Audit log
CREATE TABLE IF NOT EXISTS public.audit_log (
    id bigserial PRIMARY KEY,
    actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    
    action text NOT NULL,
    target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    target_id text,
    target_type text,
    
    -- Change tracking
    before_data jsonb,
    after_data jsonb,
    
    -- Request info
    ip_address inet,
    user_agent text,
    
    created_at timestamptz DEFAULT now()
);

-- Webhook events (for external integrations)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id text PRIMARY KEY,
    provider text NOT NULL,
    event_type text NOT NULL,
    payload jsonb NOT NULL,
    processed boolean DEFAULT false,
    error_message text,
    
    received_at timestamptz DEFAULT now(),
    processed_at timestamptz
);

-- ==============================================================================
-- 12. FUNCTIONS
-- ==============================================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN EXISTS (
        SELECT 1 
        FROM public.profiles 
        WHERE id = p_user_id 
        AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check subscription access
CREATE OR REPLACE FUNCTION public.has_subscription_access(
    p_user_id uuid,
    p_required_tier integer DEFAULT 1
)
RETURNS boolean AS $$
DECLARE
    user_tier integer;
    has_active_sub boolean;
BEGIN
    SELECT 
        subscription_tier,
        subscription_status = 'active'
    INTO user_tier, has_active_sub
    FROM public.profiles 
    WHERE id = p_user_id;
    
    RETURN COALESCE(has_active_sub, false) AND COALESCE(user_tier, 0) >= p_required_tier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id, 
        COALESCE(NEW.email, 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    
    INSERT INTO public.user_statistics (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get site member count
CREATE OR REPLACE FUNCTION public.get_member_count()
RETURNS integer AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.profiles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Current user is admin check
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN public.is_admin(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create wiki page function
CREATE OR REPLACE FUNCTION public.create_wiki_page(
    p_title text,
    p_slug text,
    p_content jsonb,
    p_excerpt text,
    p_category_id uuid,
    p_user_id uuid,
    p_seo_title text DEFAULT NULL,
    p_seo_description text DEFAULT NULL,
    p_seo_keywords text[] DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
    new_page_id uuid;
BEGIN
    INSERT INTO public.wiki_pages (
        title, slug, content, excerpt, category_id, created_by,
        seo_title, seo_description, seo_keywords
    ) VALUES (
        p_title, p_slug, p_content, p_excerpt, p_category_id, p_user_id,
        p_seo_title, p_seo_description, p_seo_keywords
    ) RETURNING id INTO new_page_id;
    
    RETURN new_page_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 13. ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;
CREATE POLICY "Public profiles viewable" ON public.profiles 
    FOR SELECT USING (
        profile_visibility = 'public' OR 
        id = auth.uid() OR 
        public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
CREATE POLICY "Users can manage own profile" ON public.profiles 
    FOR ALL USING (id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles 
    FOR ALL USING (public.is_admin(auth.uid()));

-- User statistics
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own stats" ON public.user_statistics;
CREATE POLICY "Users can view own stats" ON public.user_statistics 
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can manage own stats" ON public.user_statistics;
CREATE POLICY "Users can manage own stats" ON public.user_statistics 
    FOR ALL USING (user_id = auth.uid());

-- Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions 
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Service can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Service can manage subscriptions" ON public.subscriptions 
    FOR ALL TO service_role USING (true);

-- Content works
ALTER TABLE public.content_works ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published content viewable" ON public.content_works;
CREATE POLICY "Published content viewable" ON public.content_works 
    FOR SELECT USING (
        is_published = true OR 
        public.is_admin(auth.uid()) OR
        (requires_subscription = false)
    );

DROP POLICY IF EXISTS "Admins can manage content" ON public.content_works;
CREATE POLICY "Admins can manage content" ON public.content_works 
    FOR ALL USING (public.is_admin(auth.uid()));

-- Content chapters
ALTER TABLE public.content_chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published chapters viewable" ON public.content_chapters;
CREATE POLICY "Published chapters viewable" ON public.content_chapters 
    FOR SELECT USING (
        is_published = true AND (
            requires_subscription = false OR 
            public.has_subscription_access(auth.uid(), subscription_tier_required) OR
            public.is_admin(auth.uid())
        )
    );

-- Wiki pages
ALTER TABLE public.wiki_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published wiki pages viewable" ON public.wiki_pages;
CREATE POLICY "Published wiki pages viewable" ON public.wiki_pages 
    FOR SELECT USING (
        is_published = true AND (
            requires_subscription = false OR 
            public.has_subscription_access(auth.uid(), 1) OR
            public.is_admin(auth.uid())
        )
    );

DROP POLICY IF EXISTS "Admins can manage wiki" ON public.wiki_pages;
CREATE POLICY "Admins can manage wiki" ON public.wiki_pages 
    FOR ALL USING (public.is_admin(auth.uid()));

-- User activities
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own activities" ON public.user_activities;
CREATE POLICY "Users can view own activities" ON public.user_activities 
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Site statistics (public read, admin write)
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site stats" ON public.site_statistics;
CREATE POLICY "Public can view site stats" ON public.site_statistics 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage site stats" ON public.site_statistics;
CREATE POLICY "Admins can manage site stats" ON public.site_statistics 
    FOR ALL USING (public.is_admin(auth.uid()));

-- Subscription plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active plans" ON public.subscription_plans;
CREATE POLICY "Public can view active plans" ON public.subscription_plans 
    FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins can manage plans" ON public.subscription_plans;
CREATE POLICY "Admins can manage plans" ON public.subscription_plans 
    FOR ALL USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- MISSING FRONTEND TABLES RLS
-- ==============================================================================

-- Homepage content (public read, admin write)
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Homepage content viewable by everyone" ON public.homepage_content;
CREATE POLICY "Homepage content viewable by everyone" ON public.homepage_content 
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage homepage content" ON public.homepage_content;
CREATE POLICY "Admins can manage homepage content" ON public.homepage_content 
    FOR ALL USING (public.is_admin(auth.uid()));

-- Release items (public read, admin write)
ALTER TABLE public.release_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Release items viewable by everyone" ON public.release_items;
CREATE POLICY "Release items viewable by everyone" ON public.release_items 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage release items" ON public.release_items;
CREATE POLICY "Admins can manage release items" ON public.release_items 
    FOR ALL USING (public.is_admin(auth.uid()));

-- Posts (public read for published, admin/author write)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published posts viewable by everyone" ON public.posts;
CREATE POLICY "Published posts viewable by everyone" ON public.posts 
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Authors can manage their own posts" ON public.posts;
CREATE POLICY "Authors can manage their own posts" ON public.posts 
    FOR ALL USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
CREATE POLICY "Admins can manage all posts" ON public.posts 
    FOR ALL USING (public.is_admin(auth.uid()));

-- Daily spins (users can only access their own)
ALTER TABLE public.daily_spins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own spins" ON public.daily_spins;
CREATE POLICY "Users can view their own spins" ON public.daily_spins 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own spins" ON public.daily_spins;
CREATE POLICY "Users can manage their own spins" ON public.daily_spins 
    FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- 14. TRIGGERS
-- ==============================================================================

-- User creation trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers for existing tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_statistics_updated_at ON public.user_statistics;
CREATE TRIGGER update_user_statistics_updated_at 
    BEFORE UPDATE ON public.user_statistics 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON public.subscriptions 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_works_updated_at ON public.content_works;
CREATE TRIGGER update_content_works_updated_at 
    BEFORE UPDATE ON public.content_works 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_chapters_updated_at ON public.content_chapters;
CREATE TRIGGER update_content_chapters_updated_at 
    BEFORE UPDATE ON public.content_chapters 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wiki_pages_updated_at ON public.wiki_pages;
CREATE TRIGGER update_wiki_pages_updated_at 
    BEFORE UPDATE ON public.wiki_pages 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Updated_at triggers for new tables
DROP TRIGGER IF EXISTS update_homepage_content_updated_at ON public.homepage_content;
CREATE TRIGGER update_homepage_content_updated_at 
    BEFORE UPDATE ON public.homepage_content 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_release_items_updated_at ON public.release_items;
CREATE TRIGGER update_release_items_updated_at 
    BEFORE UPDATE ON public.release_items 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON public.posts 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- 15. VIEWS FOR EASIER QUERYING
-- ==============================================================================

-- Active subscribers view
CREATE OR REPLACE VIEW public.active_subscribers AS
SELECT 
    p.id,
    p.username,
    p.display_name,
    p.subscription_tier,
    s.plan_id,
    s.current_period_end,
    s.status
FROM public.profiles p
JOIN public.subscriptions s ON p.id = s.user_id
WHERE s.status IN ('active', 'trialing');

-- User dashboard stats
CREATE OR REPLACE VIEW public.user_dashboard_stats AS
SELECT 
    p.id as user_id,
    p.username,
    p.display_name,
    p.subscription_tier,
    us.total_reading_minutes,
    us.books_read,
    us.chapters_read,
    us.current_streak_days,
    us.achievements_unlocked,
    us.level_reached
FROM public.profiles p
LEFT JOIN public.user_statistics us ON p.id = us.user_id;

-- Content with access info
CREATE OR REPLACE VIEW public.content_with_access AS
SELECT 
    cw.*,
    CASE 
        WHEN cw.requires_subscription = false THEN true
        WHEN auth.uid() IS NULL THEN false
        ELSE public.has_subscription_access(auth.uid(), cw.subscription_tier_required)
    END as user_has_access
FROM public.content_works cw
WHERE cw.is_published = true;

-- Site analytics summary
CREATE OR REPLACE VIEW public.analytics_summary AS
SELECT 
    (SELECT COUNT(*) FROM public.profiles) as total_members,
    (SELECT COUNT(*) FROM public.active_subscribers) as active_subscribers,
    (SELECT COUNT(*) FROM public.content_works WHERE is_published = true) as published_works,
    (SELECT COUNT(*) FROM public.content_chapters WHERE is_published = true) as published_chapters,
    (SELECT COUNT(*) FROM public.wiki_pages WHERE is_published = true) as wiki_pages,
    (SELECT COALESCE(SUM(view_count), 0) FROM public.content_works) as total_content_views;

-- ==============================================================================
-- 16. INITIAL DATA
-- ==============================================================================

-- Insert default subscription plans
INSERT INTO public.subscription_plans (id, name, description, tier, price_cents, interval, features, content_access) VALUES 
('basic_monthly', 'Basic Monthly', 'Monthly access to all premium content', 1, 999, 'month', 
 '["Premium Content Access", "Early Chapter Releases", "Email Support"]'::jsonb,
 '["chapters", "books"]'::jsonb),
('premium_monthly', 'Premium Monthly', 'Monthly premium access with extras', 2, 1999, 'month',
 '["Premium Content Access", "Early Releases", "Beta Reader Access", "Exclusive Content", "Priority Support"]'::jsonb,
 '["chapters", "books", "beta_content", "exclusive_content"]'::jsonb),
('basic_yearly', 'Basic Yearly', 'Yearly access to all premium content (2 months free)', 1, 9999, 'year',
 '["Premium Content Access", "Early Chapter Releases", "Email Support", "2 Months Free"]'::jsonb,
 '["chapters", "books"]'::jsonb),
('premium_yearly', 'Premium Yearly', 'Yearly premium access with all benefits (2 months free)', 2, 19999, 'year',
 '["Premium Content Access", "Early Releases", "Beta Reader Access", "Exclusive Content", "Priority Support", "2 Months Free"]'::jsonb,
 '["chapters", "books", "beta_content", "exclusive_content"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert initial site statistics
INSERT INTO public.site_statistics (date, total_users, active_subscribers) 
VALUES (CURRENT_DATE, 0, 0)
ON CONFLICT (date) DO NOTHING;

-- Sample homepage content
INSERT INTO public.homepage_content (title, content, section, order_position) VALUES 
('Welcome to Zoroastervers', 'Experience the epic saga of cosmic proportions', 'hero', 1),
('About the Universe', 'Dive into a world where ancient wisdom meets modern storytelling', 'about', 2),
('Latest Updates', 'Stay up to date with the latest releases and announcements', 'updates', 3)
ON CONFLICT DO NOTHING;

-- Sample release items
INSERT INTO public.release_items (title, type, description, release_date, link) VALUES 
('Welcome Chapter Available', 'chapter', 'The first chapter of our epic journey is now live', CURRENT_DATE, '/read/1'),
('Character Profiles Updated', 'announcement', 'New character profiles added to the wiki', CURRENT_DATE - INTERVAL '1 day', '/wiki/characters'),
('Beta Reader Program Open', 'announcement', 'Applications now open for beta readers', CURRENT_DATE - INTERVAL '2 days', '/beta/application')
ON CONFLICT DO NOTHING;

-- Sample blog posts (will only work if there are users)
INSERT INTO public.posts (author_id, title, slug, content, excerpt, status, published_at) 
SELECT 
    (SELECT id FROM auth.users LIMIT 1),
    'Welcome to Zoroastervers',
    'welcome-to-zoroastervers',
    'Welcome to the official Zoroastervers website! Here you''ll find epic stories, rich lore, and an engaged community of readers. Stay tuned for exciting updates and new content releases.',
    'Welcome to the official Zoroastervers website! Discover epic stories and rich lore.',
    'published',
    now() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM auth.users)
ON CONFLICT (slug) DO NOTHING;

-- Add a fallback blog post if no users exist yet
INSERT INTO public.posts (author_id, title, slug, content, excerpt, status, published_at) VALUES 
(NULL, 'Welcome to Zoroastervers', 'welcome-post', 'Welcome to our amazing universe of stories!', 'Welcome to our universe!', 'published', now())
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- 17. INDEXES FOR PERFORMANCE
-- ==============================================================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON public.profiles(last_active_at);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);

-- Content
CREATE INDEX IF NOT EXISTS idx_content_works_type ON public.content_works(content_type);
CREATE INDEX IF NOT EXISTS idx_content_works_status ON public.content_works(status);
CREATE INDEX IF NOT EXISTS idx_content_works_published ON public.content_works(is_published);
CREATE INDEX IF NOT EXISTS idx_content_works_parent ON public.content_works(parent_id);
CREATE INDEX IF NOT EXISTS idx_content_works_slug ON public.content_works(slug);

CREATE INDEX IF NOT EXISTS idx_content_chapters_work ON public.content_chapters(work_id);
CREATE INDEX IF NOT EXISTS idx_content_chapters_published ON public.content_chapters(is_published);

-- Wiki
CREATE INDEX IF NOT EXISTS idx_wiki_pages_category ON public.wiki_pages(category_id);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_published ON public.wiki_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_slug ON public.wiki_pages(category_id, slug);

-- Activities
CREATE INDEX IF NOT EXISTS idx_user_activities_user ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created ON public.user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON public.user_activities(activity_type);

-- Analytics
CREATE INDEX IF NOT EXISTS idx_daily_user_stats_date ON public.daily_user_stats(date);
CREATE INDEX IF NOT EXISTS idx_daily_user_stats_user ON public.daily_user_stats(user_id);

-- Frontend tables indexes
CREATE INDEX IF NOT EXISTS idx_homepage_content_section ON public.homepage_content(section);
CREATE INDEX IF NOT EXISTS idx_homepage_content_active ON public.homepage_content(is_active);

CREATE INDEX IF NOT EXISTS idx_release_items_date ON public.release_items(release_date);
CREATE INDEX IF NOT EXISTS idx_release_items_featured ON public.release_items(is_featured);

CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at);

CREATE INDEX IF NOT EXISTS idx_daily_spins_date ON public.daily_spins(spin_date);

-- ==============================================================================
-- END OF SCHEMA DEPLOYMENT
-- ==============================================================================

COMMENT ON SCHEMA public IS 'Zoroastervers unified database schema v2.0 with frontend compatibility tables';