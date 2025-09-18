-- Full Database Schema for Zoroasterverse Platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update the 'updated_at' column automatically
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==================================================
-- CORE USER AND PROFILE TABLES
-- ==================================================

-- Profiles (main user profile table, linked to auth.users)
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'admin')),
    role VARCHAR(50) DEFAULT 'user' NOT NULL,
    reading_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Stats (for tracking user activity and achievements)
DROP TABLE IF EXISTS public.user_stats CASCADE;
CREATE TABLE public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    books_read INT DEFAULT 0,
    reading_hours INT DEFAULT 0,
    currently_reading TEXT,
    achievements INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- CONTENT HIERARCHY TABLES
-- ==================================================

-- Books (Top-level container)
DROP TABLE IF EXISTS books CASCADE;
CREATE TABLE books (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    cover_image VARCHAR(500),
    og_image VARCHAR(500),
    state VARCHAR(20) DEFAULT 'draft' CHECK (state IN ('draft', 'scheduled', 'published', 'archived')),
    publish_at TIMESTAMPTZ,
    unpublish_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volumes (Book subdivisions)
DROP TABLE IF EXISTS volumes CASCADE;
CREATE TABLE volumes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    slug VARCHAR(255) NOT NULL,
    cover_image VARCHAR(500),
    order_index INTEGER NOT NULL DEFAULT 0,
    state VARCHAR(20) DEFAULT 'draft' CHECK (state IN ('draft', 'scheduled', 'published', 'archived')),
    publish_at TIMESTAMPTZ,
    unpublish_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(book_id, slug)
);

-- Sagas (Volume subdivisions)
DROP TABLE IF EXISTS sagas CASCADE;
CREATE TABLE sagas (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    volume_id uuid NOT NULL REFERENCES volumes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    slug VARCHAR(255) NOT NULL,
    cover_image VARCHAR(500),
    order_index INTEGER NOT NULL DEFAULT 0,
    state VARCHAR(20) DEFAULT 'draft' CHECK (state IN ('draft', 'scheduled', 'published', 'archived')),
    publish_at TIMESTAMPTZ,
    unpublish_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(volume_id, slug)
);

-- Arcs (Saga subdivisions)
DROP TABLE IF EXISTS arcs CASCADE;
CREATE TABLE arcs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    saga_id uuid NOT NULL REFERENCES sagas(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    slug VARCHAR(255) NOT NULL,
    cover_image VARCHAR(500),
    order_index INTEGER NOT NULL DEFAULT 0,
    state VARCHAR(20) DEFAULT 'draft' CHECK (state IN ('draft', 'scheduled', 'published', 'archived')),
    publish_at TIMESTAMPTZ,
    unpublish_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(saga_id, slug)
);

-- Issues (Arc subdivisions - serialized releases)
DROP TABLE IF EXISTS issues CASCADE;
CREATE TABLE issues (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    arc_id uuid NOT NULL REFERENCES arcs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    slug VARCHAR(255) NOT NULL,
    cover_image VARCHAR(500),
    order_index INTEGER NOT NULL DEFAULT 0,
    subscription_required BOOLEAN DEFAULT false,
    release_date TIMESTAMPTZ,
    state VARCHAR(20) DEFAULT 'draft' CHECK (state IN ('draft', 'scheduled', 'published', 'archived')),
    publish_at TIMESTAMPTZ,
    unpublish_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(arc_id, slug)
);

-- Chapters (Issue subdivisions - smallest readable unit)
DROP TABLE IF EXISTS chapters CASCADE;
CREATE TABLE chapters (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    chapter_number INTEGER,
    subtitle VARCHAR(255),
    synopsis TEXT,
    slug VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    content_format VARCHAR(20) DEFAULT 'rich' CHECK (content_format IN ('rich', 'markdown', 'file')),
    content_json JSONB,
    content_text TEXT,
    content_url VARCHAR(500),
    release_date TIMESTAMPTZ,
    subscription_required BOOLEAN,
    state VARCHAR(20) DEFAULT 'draft' CHECK (state IN ('draft', 'scheduled', 'published', 'archived')),
    publish_at TIMESTAMPTZ,
    unpublish_at TIMESTAMPTZ,
    word_count INTEGER DEFAULT 0,
    estimated_reading_time INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(issue_id, slug)
);

-- ==================================================
-- E-COMMERCE TABLES
-- ==================================================

-- Products table
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(500),
    file_key VARCHAR(500),
    is_bundle BOOLEAN DEFAULT FALSE,
    is_subscription BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prices table (Stripe price IDs)
DROP TABLE IF EXISTS prices CASCADE;
CREATE TABLE prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    price_id VARCHAR(255) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    amount_cents INTEGER NOT NULL,
    interval VARCHAR(20),
    interval_count INTEGER DEFAULT 1,
    trial_period_days INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Link to profiles table
    provider VARCHAR(50) NOT NULL,
    provider_session_id VARCHAR(255),
    provider_payment_intent_id VARCHAR(255),
    price_id UUID REFERENCES prices(id),
    status VARCHAR(50) DEFAULT 'pending',
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    customer_email VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table (from novel_publishing_platform_schema.sql, adapted for profiles)
DROP TABLE IF EXISTS public.subscriptions CASCADE;
CREATE TABLE public.subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files table (multiple file formats per product)
DROP TABLE IF EXISTS files CASCADE;
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    s3_key VARCHAR(500) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT,
    format VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table (for bundles with multiple products)
DROP TABLE IF EXISTS order_items CASCADE;
CREATE TABLE order_items (
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
DROP TABLE IF EXISTS downloads CASCADE;
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Link to profiles table
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook events table (for tracking and debugging)
DROP TABLE IF EXISTS webhook_events CASCADE;
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL,
    event_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- AUDIT AND ACTIVITY TABLES
-- ==================================================

-- Activity Log (for admin actions and reader activities)
DROP TABLE IF EXISTS activity_log CASCADE;
CREATE TABLE activity_log (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Link to profiles table
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(20) NOT NULL,
    entity_id uuid NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapter Revisions (version control for chapters)
DROP TABLE IF EXISTS chapter_revisions CASCADE;
CREATE TABLE chapter_revisions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title VARCHAR(255),
    content_json JSONB,
    content_text TEXT,
    content_url VARCHAR(500),
    revision_notes TEXT,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Link to profiles table
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(chapter_id, version_number)
);

-- ==================================================
-- INDEXES FOR PERFORMANCE
-- ==================================================

-- Content hierarchy indexes
DROP INDEX IF EXISTS idx_books_slug;
DROP INDEX IF EXISTS idx_books_slug;
CREATE INDEX idx_books_slug ON books(slug);
DROP INDEX IF EXISTS idx_books_state;
DROP INDEX IF EXISTS idx_books_state;
CREATE INDEX idx_books_state ON books(state);
DROP INDEX IF EXISTS idx_volumes_book_id;
DROP INDEX IF EXISTS idx_volumes_book_id;
CREATE INDEX idx_volumes_book_id ON volumes(book_id);
DROP INDEX IF EXISTS idx_volumes_slug;
DROP INDEX IF EXISTS idx_volumes_slug;
CREATE INDEX idx_volumes_slug ON volumes(slug);
DROP INDEX IF EXISTS idx_volumes_state;
DROP INDEX IF EXISTS idx_volumes_state;
CREATE INDEX idx_volumes_state ON volumes(state);
DROP INDEX IF EXISTS idx_sagas_volume_id;
DROP INDEX IF EXISTS idx_sagas_volume_id;
CREATE INDEX idx_sagas_volume_id ON sagas(volume_id);
DROP INDEX IF EXISTS idx_sagas_slug;
DROP INDEX IF EXISTS idx_sagas_slug;
CREATE INDEX idx_sagas_slug ON sagas(slug);
DROP INDEX IF EXISTS idx_sagas_state;
DROP INDEX IF EXISTS idx_sagas_state;
CREATE INDEX idx_sagas_state ON sagas(state);
DROP INDEX IF EXISTS idx_arcs_saga_id;
DROP INDEX IF EXISTS idx_arcs_saga_id;
CREATE INDEX idx_arcs_saga_id ON arcs(saga_id);
DROP INDEX IF EXISTS idx_arcs_slug;
DROP INDEX IF EXISTS idx_arcs_slug;
CREATE INDEX idx_arcs_slug ON arcs(slug);
DROP INDEX IF EXISTS idx_arcs_state;
DROP INDEX IF EXISTS idx_arcs_state;
CREATE INDEX idx_arcs_state ON arcs(state);
DROP INDEX IF EXISTS idx_issues_arc_id;
DROP INDEX IF EXISTS idx_issues_arc_id;
CREATE INDEX idx_issues_arc_id ON issues(arc_id);
DROP INDEX IF EXISTS idx_issues_slug;
DROP INDEX IF EXISTS idx_issues_slug;
CREATE INDEX idx_issues_slug ON issues(slug);
DROP INDEX IF EXISTS idx_issues_state;
DROP INDEX IF EXISTS idx_issues_state;
CREATE INDEX idx_issues_state ON issues(state);
DROP INDEX IF EXISTS idx_issues_release_date;
DROP INDEX IF EXISTS idx_issues_release_date;
CREATE INDEX idx_issues_release_date ON issues(release_date);
DROP INDEX IF EXISTS idx_issues_subscription_required;
DROP INDEX IF EXISTS idx_issues_subscription_required;
CREATE INDEX idx_issues_subscription_required ON issues(subscription_required);
DROP INDEX IF EXISTS idx_chapters_issue_id;
DROP INDEX IF EXISTS idx_chapters_issue_id;
CREATE INDEX idx_chapters_issue_id ON chapters(issue_id);
DROP INDEX IF EXISTS idx_chapters_slug;
DROP INDEX IF EXISTS idx_chapters_slug;
CREATE INDEX idx_chapters_slug ON chapters(slug);
DROP INDEX IF EXISTS idx_chapters_state;
DROP INDEX IF EXISTS idx_chapters_state;
CREATE INDEX idx_chapters_state ON chapters(state);
DROP INDEX IF EXISTS idx_chapters_release_date;
DROP INDEX IF EXISTS idx_chapters_release_date;
CREATE INDEX idx_chapters_release_date ON chapters(release_date);

-- Order indexes for proper sequencing
DROP INDEX IF EXISTS idx_volumes_order;
DROP INDEX IF EXISTS idx_volumes_order;
CREATE INDEX idx_volumes_order ON volumes(book_id, order_index);
DROP INDEX IF EXISTS idx_sagas_order;
DROP INDEX IF EXISTS idx_sagas_order;
CREATE INDEX idx_sagas_order ON sagas(volume_id, order_index);
DROP INDEX IF EXISTS idx_arcs_order;
DROP INDEX IF EXISTS idx_arcs_order;
CREATE INDEX idx_arcs_order ON arcs(saga_id, order_index);
DROP INDEX IF EXISTS idx_issues_order;
DROP INDEX IF EXISTS idx_issues_order;
CREATE INDEX idx_issues_order ON issues(arc_id, order_index);
DROP INDEX IF EXISTS idx_chapters_order;
DROP INDEX IF EXISTS idx_chapters_order;
CREATE INDEX idx_chapters_order ON chapters(issue_id, order_index);

-- User and subscription indexes
DROP INDEX IF EXISTS idx_profiles_subscription_status;
DROP INDEX IF EXISTS idx_profiles_subscription_status;
CREATE INDEX idx_profiles_subscription_status ON public.profiles(subscription_status);
DROP INDEX IF EXISTS idx_subscriptions_user_id;
DROP INDEX IF EXISTS idx_subscriptions_user_id;
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
DROP INDEX IF EXISTS idx_subscriptions_status;
DROP INDEX IF EXISTS idx_subscriptions_status;
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
DROP INDEX IF EXISTS idx_user_library_user_id;
DROP INDEX IF EXISTS idx_user_library_user_id;
CREATE INDEX idx_user_library_user_id ON public.user_library(user_id);
DROP INDEX IF EXISTS idx_user_library_work_type;
DROP INDEX IF EXISTS idx_user_library_work_type;
CREATE INDEX idx_user_library_work_type ON public.user_library(work_type);
DROP INDEX IF EXISTS idx_reading_progress_user_id;
DROP INDEX IF EXISTS idx_reading_progress_user_id;
CREATE INDEX idx_reading_progress_user_id ON public.reading_progress(user_id);
DROP INDEX IF EXISTS idx_reading_progress_chapter_id;
DROP INDEX IF EXISTS idx_reading_progress_chapter_id;
CREATE INDEX idx_reading_progress_chapter_id ON public.reading_progress(chapter_id);
DROP INDEX IF EXISTS idx_user_stats_user_id;
DROP INDEX IF EXISTS idx_user_stats_user_id;
CREATE INDEX idx_user_stats_user_id ON public.user_stats(user_id);

-- E-commerce indexes
DROP INDEX IF EXISTS idx_products_slug;
DROP INDEX IF EXISTS idx_products_slug;
CREATE INDEX idx_products_slug ON products(slug);
DROP INDEX IF EXISTS idx_products_status;
DROP INDEX IF EXISTS idx_products_status;
CREATE INDEX idx_products_status ON products(status);
DROP INDEX IF EXISTS idx_prices_product_id;
DROP INDEX IF EXISTS idx_prices_product_id;
CREATE INDEX idx_prices_product_id ON prices(product_id);
DROP INDEX IF EXISTS idx_prices_provider;
DROP INDEX IF EXISTS idx_prices_provider;
CREATE INDEX idx_prices_provider ON prices(provider);
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_orders_user_id;
CREATE INDEX idx_orders_user_id ON orders(user_id);
DROP INDEX IF EXISTS idx_orders_provider;
DROP INDEX IF EXISTS idx_orders_provider;
CREATE INDEX idx_orders_provider ON orders(provider);
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_status;
CREATE INDEX idx_orders_status ON orders(status);
DROP INDEX IF EXISTS idx_files_product_id;
DROP INDEX IF EXISTS idx_files_product_id;
CREATE INDEX idx_files_product_id ON files(product_id);
DROP INDEX IF EXISTS idx_files_format;
DROP INDEX IF EXISTS idx_files_format;
CREATE INDEX idx_files_format ON files(format);
DROP INDEX IF EXISTS idx_downloads_user_id;
DROP INDEX IF EXISTS idx_downloads_user_id;
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
DROP INDEX IF EXISTS idx_downloads_order_id;
DROP INDEX IF EXISTS idx_downloads_order_id;
CREATE INDEX idx_downloads_order_id ON downloads(order_id);
DROP INDEX IF EXISTS idx_webhook_events_provider;
DROP INDEX IF EXISTS idx_webhook_events_provider;
CREATE INDEX idx_webhook_events_provider ON webhook_events(provider);
DROP INDEX IF EXISTS idx_webhook_events_event_id;
DROP INDEX IF EXISTS idx_webhook_events_event_id;
CREATE INDEX idx_webhook_events_event_id ON webhook_events(event_id);

-- Activity and audit indexes
DROP INDEX IF EXISTS idx_activity_log_user_id;
DROP INDEX IF EXISTS idx_activity_log_user_id;
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
DROP INDEX IF EXISTS idx_activity_log_entity;
DROP INDEX IF EXISTS idx_activity_log_entity;
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
DROP INDEX IF EXISTS idx_activity_log_created_at;
DROP INDEX IF EXISTS idx_activity_log_created_at;
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);
DROP INDEX IF EXISTS idx_chapter_revisions_chapter_id;
DROP INDEX IF EXISTS idx_chapter_revisions_chapter_id;
CREATE INDEX idx_chapter_revisions_chapter_id ON chapter_revisions(chapter_id);

-- ==================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ==================================================

-- Apply update triggers to all main content tables
DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_volumes_updated_at ON volumes;
CREATE TRIGGER update_volumes_updated_at BEFORE UPDATE ON volumes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_sagas_updated_at ON sagas;
CREATE TRIGGER update_sagas_updated_at BEFORE UPDATE ON sagas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_arcs_updated_at ON arcs;
CREATE TRIGGER update_arcs_updated_at BEFORE UPDATE ON arcs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_issues_updated_at ON issues;
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_chapters_updated_at ON chapters;
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_user_stats_updated_at ON public.user_stats;
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE volumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE arcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
DROP POLICY IF EXISTS "Published books are publicly viewable" ON books;
CREATE POLICY "Published books are publicly viewable" ON books
    FOR SELECT USING (state = 'published' AND (publish_at IS NULL OR publish_at <= NOW())
                     AND (unpublish_at IS NULL OR unpublish_at > NOW()));

DROP POLICY IF EXISTS "Published volumes are publicly viewable" ON volumes;
CREATE POLICY "Published volumes are publicly viewable" ON volumes
    FOR SELECT USING (state = 'published' AND (publish_at IS NULL OR publish_at <= NOW())
                     AND (unpublish_at IS NULL OR unpublish_at > NOW()));

DROP POLICY IF EXISTS "Published sagas are publicly viewable" ON sagas;
CREATE POLICY "Published sagas are publicly viewable" ON sagas
    FOR SELECT USING (state = 'published' AND (publish_at IS NULL OR publish_at <= NOW())
                     AND (unpublish_at IS NULL OR unpublish_at > NOW()));

DROP POLICY IF EXISTS "Published arcs are publicly viewable" ON arcs;
CREATE POLICY "Published arcs are publicly viewable" ON arcs
    FOR SELECT USING (state = 'published' AND (publish_at IS NULL OR publish_at <= NOW())
                     AND (unpublish_at IS NULL OR unpublish_at > NOW()));

DROP POLICY IF EXISTS "Published issues are publicly viewable" ON issues;
CREATE POLICY "Published issues are publicly viewable" ON issues
    FOR SELECT USING (state = 'published' AND (publish_at IS NULL OR publish_at <= NOW())
                     AND (unpublish_at IS NULL OR unpublish_at > NOW()));

-- Chapter access with subscription check
DROP POLICY IF EXISTS "Chapter access with subscription check" ON chapters;
CREATE POLICY "Chapter access with subscription check" ON chapters
    FOR SELECT USING (
        state = 'published'
        AND (publish_at IS NULL OR publish_at <= NOW())
        AND (unpublish_at IS NULL OR unpublish_at > NOW())
        AND (release_date IS NULL OR release_date <= NOW())
        AND (
            (COALESCE(subscription_required,
                (SELECT subscription_required FROM issues WHERE id = chapters.issue_id)
            ) = false)
            OR
            (auth.uid() IS NOT NULL AND EXISTS (
                SELECT 1 FROM public.profiles p
                JOIN public.subscriptions s ON s.user_id = p.id
                WHERE p.id = auth.uid()
                AND s.status = 'active'
                AND (s.end_date IS NULL OR s.end_date > NOW())
            ))
        )
    );

-- Admin policies (users with admin subscription_status can see/edit everything)
DROP POLICY IF EXISTS "Admins can view all content" ON books;
CREATE POLICY "Admins can view all content" ON books
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can manage all content" ON books;
CREATE POLICY "Admins can manage all content" ON books
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

-- Apply similar admin policies to other content tables
DROP POLICY IF EXISTS "Admins can view all volumes" ON volumes;
CREATE POLICY "Admins can view all volumes" ON volumes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can manage all volumes" ON volumes;
CREATE POLICY "Admins can manage all volumes" ON volumes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can view all sagas" ON sagas;
CREATE POLICY "Admins can view all sagas" ON sagas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can manage all sagas" ON sagas;
CREATE POLICY "Admins can manage all sagas" ON sagas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can view all arcs" ON arcs;
CREATE POLICY "Admins can view all arcs" ON arcs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can manage all arcs" ON arcs;
CREATE POLICY "Admins can manage all arcs" ON arcs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can view all issues" ON issues;
CREATE POLICY "Admins can view all issues" ON issues
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can manage all issues" ON issues;
CREATE POLICY "Admins can manage all issues" ON issues
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can view all chapters" ON chapters;
CREATE POLICY "Admins can view all chapters" ON chapters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can manage all chapters" ON chapters;
CREATE POLICY "Admins can manage all chapters" ON chapters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

-- User profile policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Subscription policies
DROP POLICY IF EXISTS "Users can view their own subscriptions." ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions." ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- User library policies
DROP POLICY IF EXISTS "Users can manage their own library." ON public.user_library;
CREATE POLICY "Users can manage their own library." ON public.user_library
    FOR ALL USING (auth.uid() = user_id);

-- Reading progress policies
DROP POLICY IF EXISTS "Users can manage their own reading progress." ON public.reading_progress;
CREATE POLICY "Users can manage their own reading progress." ON public.reading_progress
    FOR ALL USING (auth.uid() = user_id);

-- User stats policies
DROP POLICY IF EXISTS "Users can view their own user stats." ON public.user_stats;
CREATE POLICY "Users can view their own user stats." ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own user stats." ON public.user_stats;
CREATE POLICY "Users can update their own user stats." ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own user stats." ON public.user_stats;
CREATE POLICY "Users can insert their own user stats." ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity log policies
DROP POLICY IF EXISTS "Users can view their own activity log." ON activity_log;
CREATE POLICY "Users can view their own activity log." ON activity_log
    FOR SELECT USING (auth.uid() = user_id);

-- Chapter revisions policies
DROP POLICY IF EXISTS "Users can view chapter revisions." ON chapter_revisions;
CREATE POLICY "Users can view chapter revisions." ON chapter_revisions
    FOR SELECT USING (true); -- Adjust as needed for specific access control

-- Product policies
DROP POLICY IF EXISTS "Products are publicly viewable." ON products;
CREATE POLICY "Products are publicly viewable." ON products
    FOR SELECT USING (status = 'published');

-- Prices policies
DROP POLICY IF EXISTS "Prices are publicly viewable." ON prices;
CREATE POLICY "Prices are publicly viewable." ON prices
    FOR SELECT USING (active = true);

-- Orders policies
DROP POLICY IF EXISTS "Users can view their own orders." ON orders;
CREATE POLICY "Users can view their own orders." ON orders
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders." ON orders;
CREATE POLICY "Users can insert their own orders." ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Files policies
DROP POLICY IF EXISTS "Files are publicly viewable." ON files;
CREATE POLICY "Files are publicly viewable." ON files
    FOR SELECT USING (true); -- Adjust as needed for specific access control

-- Order items policies
DROP POLICY IF EXISTS "Order items are viewable by order owner." ON order_items;
CREATE POLICY "Order items are viewable by order owner." ON order_items
    FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Downloads policies
DROP POLICY IF EXISTS "Users can view their own downloads." ON downloads;
CREATE POLICY "Users can view their own downloads." ON downloads
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own downloads." ON downloads;
CREATE POLICY "Users can insert their own downloads." ON downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Webhook events policies (admin only)
DROP POLICY IF EXISTS "Admins can view webhook events." ON webhook_events;
CREATE POLICY "Admins can view webhook events." ON webhook_events
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_status = 'admin'));

-- Grant execute permissions for RPC functions
GRANT EXECUTE ON FUNCTION get_admin_profiles() TO anon;
GRANT EXECUTE ON FUNCTION get_admin_profiles() TO authenticated;
