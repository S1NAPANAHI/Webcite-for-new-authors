
-- ==================================================
-- NOVEL PUBLISHING PLATFORM DATABASE SCHEMA
-- Hierarchical Content Management with Subscription System
-- ==================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================
-- CORE CONTENT HIERARCHY TABLES
-- ==================================================

-- Books (Top-level container)
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
CREATE TABLE chapters (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    synopsis TEXT,
    slug VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,

    -- Content storage options
    content_format VARCHAR(20) DEFAULT 'rich' CHECK (content_format IN ('rich', 'markdown', 'file')),
    content_json JSONB, -- For rich text editor content
    content_text TEXT, -- For markdown content
    content_url VARCHAR(500), -- For uploaded files

    -- Publishing control
    release_date TIMESTAMPTZ,
    subscription_required BOOLEAN, -- Nullable to inherit from issue
    state VARCHAR(20) DEFAULT 'draft' CHECK (state IN ('draft', 'scheduled', 'published', 'archived')),
    publish_at TIMESTAMPTZ,
    unpublish_at TIMESTAMPTZ,

    -- Word count and reading time
    word_count INTEGER DEFAULT 0,
    estimated_reading_time INTEGER DEFAULT 0, -- in minutes

    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(issue_id, slug)
);

-- ==================================================
-- USER MANAGEMENT TABLES
-- ==================================================

-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'admin')),
    reading_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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

-- User Library (polymorphic - can point to any content level)
CREATE TABLE user_library (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    work_type VARCHAR(20) NOT NULL CHECK (work_type IN ('book', 'volume', 'saga', 'arc', 'issue', 'chapter')),
    work_id uuid NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, work_type, work_id)
);

-- Reading Progress
CREATE TABLE reading_progress (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_read_position INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, chapter_id)
);

-- ==================================================
-- AUDIT AND ACTIVITY TABLES
-- ==================================================

-- Activity Log (for admin actions and reader activities)
CREATE TABLE activity_log (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL, -- 'create', 'update', 'publish', 'read', 'add_to_library', etc.
    entity_type VARCHAR(20) NOT NULL, -- 'book', 'chapter', etc.
    entity_id uuid NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapter Revisions (version control for chapters)
CREATE TABLE chapter_revisions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title VARCHAR(255),
    content_json JSONB,
    content_text TEXT,
    content_url VARCHAR(500),
    revision_notes TEXT,
    created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(chapter_id, version_number)
);

-- ==================================================
-- INDEXES FOR PERFORMANCE
-- ==================================================

-- Content hierarchy indexes
CREATE INDEX idx_volumes_book_id ON volumes(book_id);
CREATE INDEX idx_sagas_volume_id ON sagas(volume_id);
CREATE INDEX idx_arcs_saga_id ON arcs(saga_id);
CREATE INDEX idx_issues_arc_id ON issues(arc_id);
CREATE INDEX idx_chapters_issue_id ON chapters(issue_id);

-- Slug indexes for URL resolution
CREATE INDEX idx_books_slug ON books(slug);
CREATE INDEX idx_volumes_slug ON volumes(slug);
CREATE INDEX idx_sagas_slug ON sagas(slug);
CREATE INDEX idx_arcs_slug ON arcs(slug);
CREATE INDEX idx_issues_slug ON issues(slug);
CREATE INDEX idx_chapters_slug ON chapters(slug);

-- State and publishing indexes
CREATE INDEX idx_books_state ON books(state);
CREATE INDEX idx_volumes_state ON volumes(state);
CREATE INDEX idx_sagas_state ON sagas(state);
CREATE INDEX idx_arcs_state ON arcs(state);
CREATE INDEX idx_issues_state ON issues(state);
CREATE INDEX idx_chapters_state ON chapters(state);

CREATE INDEX idx_issues_release_date ON issues(release_date);
CREATE INDEX idx_chapters_release_date ON chapters(release_date);
CREATE INDEX idx_issues_subscription_required ON issues(subscription_required);

-- Order indexes for proper sequencing
CREATE INDEX idx_volumes_order ON volumes(book_id, order_index);
CREATE INDEX idx_sagas_order ON sagas(volume_id, order_index);
CREATE INDEX idx_arcs_order ON arcs(saga_id, order_index);
CREATE INDEX idx_issues_order ON issues(arc_id, order_index);
CREATE INDEX idx_chapters_order ON chapters(issue_id, order_index);

-- User and subscription indexes
CREATE INDEX idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_user_library_user_id ON user_library(user_id);
CREATE INDEX idx_user_library_work_type ON user_library(work_type);
CREATE INDEX idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX idx_reading_progress_chapter_id ON reading_progress(chapter_id);

-- Activity and audit indexes
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX idx_chapter_revisions_chapter_id ON chapter_revisions(chapter_id);

-- ==================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ==================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to all main content tables
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volumes_updated_at BEFORE UPDATE ON volumes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sagas_updated_at BEFORE UPDATE ON sagas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_arcs_updated_at BEFORE UPDATE ON arcs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_revisions ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
CREATE POLICY "Published books are publicly viewable" ON books
    FOR SELECT USING (state = 'published' AND (publish_at IS NULL OR publish_at <= NOW()) 
                     AND (unpublish_at IS NULL OR unpublish_at > NOW()));

CREATE POLICY "Published volumes are publicly viewable" ON volumes
    FOR SELECT USING (state = 'published' AND (publish_at IS NULL OR publish_at <= NOW()) 
                     AND (unpublish_at IS NULL OR unpublish_at > NOW()));

CREATE POLICY "Published sagas are publicly viewable" ON sagas
    FOR SELECT USING (state = 'published' AND (publish_at IS NULL OR publish_at <= NOW()) 
                     AND (unpublish_at IS NULL OR unpublish_at > NOW()));

CREATE POLICY "Published arcs are publicly viewable" ON arcs
    FOR SELECT USING (state = 'published' AND (publish_at IS NULL OR publish_at <= NOW()) 
                     AND (unpublish_at IS NULL OR unpublish_at > NOW()));

CREATE POLICY "Published issues are publicly viewable" ON issues
    FOR SELECT USING (state = 'published' AND (publish_at IS NULL OR publish_at <= NOW()) 
                     AND (unpublish_at IS NULL OR unpublish_at > NOW()));

-- Chapter access with subscription check
CREATE POLICY "Chapter access with subscription check" ON chapters
    FOR SELECT USING (
        state = 'published' 
        AND (publish_at IS NULL OR publish_at <= NOW()) 
        AND (unpublish_at IS NULL OR unpublish_at > NOW())
        AND (release_date IS NULL OR release_date <= NOW())
        AND (
            -- Free chapters (no subscription required)
            (COALESCE(subscription_required, 
                (SELECT subscription_required FROM issues WHERE id = chapters.issue_id)
            ) = false)
            OR
            -- Premium chapters (subscription required and user has active subscription)
            (auth.uid() IS NOT NULL AND EXISTS (
                SELECT 1 FROM profiles p 
                JOIN subscriptions s ON s.user_id = p.id 
                WHERE p.id = auth.uid() 
                AND s.status = 'active' 
                AND (s.end_date IS NULL OR s.end_date > NOW())
            ))
        )
    );

-- Admin policies (users with admin subscription_status can see/edit everything)
CREATE POLICY "Admins can view all content" ON books
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

CREATE POLICY "Admins can manage all content" ON books
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

-- Apply similar admin policies to other content tables
CREATE POLICY "Admins can view all volumes" ON volumes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

CREATE POLICY "Admins can manage all volumes" ON volumes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND subscription_status = 'admin'
        )
    );

-- User profile policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Subscription policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- User library policies
CREATE POLICY "Users can manage their own library" ON user_library
    FOR ALL USING (auth.uid() = user_id);

-- Reading progress policies
CREATE POLICY "Users can manage their own reading progress" ON reading_progress
    FOR ALL USING (auth.uid() = user_id);

-- ==================================================
-- HELPER FUNCTIONS
-- ==================================================

-- Function to get full content path
CREATE OR REPLACE FUNCTION get_content_path(
    content_type TEXT,
    content_id UUID
)
RETURNS TEXT AS $$
DECLARE
    result TEXT;
    book_slug TEXT;
    volume_slug TEXT;
    saga_slug TEXT;
    arc_slug TEXT;
    issue_slug TEXT;
    chapter_slug TEXT;
BEGIN
    CASE content_type
        WHEN 'chapter' THEN
            SELECT b.slug, v.slug, s.slug, a.slug, i.slug, c.slug
            INTO book_slug, volume_slug, saga_slug, arc_slug, issue_slug, chapter_slug
            FROM chapters c
            JOIN issues i ON i.id = c.issue_id
            JOIN arcs a ON a.id = i.arc_id
            JOIN sagas s ON s.id = a.saga_id
            JOIN volumes v ON v.id = s.volume_id
            JOIN books b ON b.id = v.book_id
            WHERE c.id = content_id;

            result := '/library/books/' || book_slug || '/volumes/' || volume_slug || 
                     '/sagas/' || saga_slug || '/arcs/' || arc_slug || 
                     '/issues/' || issue_slug || '/chapters/' || chapter_slug;

        WHEN 'issue' THEN
            SELECT b.slug, v.slug, s.slug, a.slug, i.slug
            INTO book_slug, volume_slug, saga_slug, arc_slug, issue_slug
            FROM issues i
            JOIN arcs a ON a.id = i.arc_id
            JOIN sagas s ON s.id = a.saga_id
            JOIN volumes v ON v.id = s.volume_id
            JOIN books b ON b.id = v.book_id
            WHERE i.id = content_id;

            result := '/library/books/' || book_slug || '/volumes/' || volume_slug || 
                     '/sagas/' || saga_slug || '/arcs/' || arc_slug || 
                     '/issues/' || issue_slug;

        WHEN 'book' THEN
            SELECT slug INTO book_slug FROM books WHERE id = content_id;
            result := '/library/books/' || book_slug;

        -- Add other cases as needed
        ELSE
            result := '/library';
    END CASE;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has access to content
CREATE OR REPLACE FUNCTION user_has_content_access(
    user_id_param UUID,
    content_type TEXT,
    content_id_param UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    requires_subscription BOOLEAN;
    user_has_subscription BOOLEAN;
BEGIN
    -- Check if content requires subscription
    CASE content_type
        WHEN 'chapter' THEN
            SELECT COALESCE(c.subscription_required, i.subscription_required, false)
            INTO requires_subscription
            FROM chapters c
            JOIN issues i ON i.id = c.issue_id
            WHERE c.id = content_id_param;

        WHEN 'issue' THEN
            SELECT subscription_required INTO requires_subscription
            FROM issues WHERE id = content_id_param;

        ELSE
            requires_subscription := false;
    END CASE;

    -- If no subscription required, access granted
    IF NOT requires_subscription THEN
        RETURN true;
    END IF;

    -- Check if user has active subscription
    SELECT EXISTS (
        SELECT 1 FROM subscriptions s 
        WHERE s.user_id = user_id_param 
        AND s.status = 'active' 
        AND (s.end_date IS NULL OR s.end_date > NOW())
    ) INTO user_has_subscription;

    RETURN user_has_subscription;
END;
$$ LANGUAGE plpgsql;

-- ==================================================
-- SAMPLE DATA INSERTION
-- ==================================================

-- Insert sample data (for testing)
INSERT INTO books (title, description, slug, state) VALUES 
('The Eternal Heights', 'An epic fantasy saga spanning multiple worlds and dimensions', 'the-eternal-heights', 'published'),
('Chronicles of the Void', 'A science fiction epic exploring the depths of space', 'chronicles-of-the-void', 'published');

INSERT INTO volumes (book_id, title, slug, order_index, state) 
SELECT id, 'Volume I: The Awakening', 'volume-1-the-awakening', 1, 'published'
FROM books WHERE slug = 'the-eternal-heights';

INSERT INTO sagas (volume_id, title, slug, order_index, state)
SELECT id, 'The First Journey', 'the-first-journey', 1, 'published'
FROM volumes WHERE slug = 'volume-1-the-awakening';

INSERT INTO arcs (saga_id, title, slug, order_index, state)
SELECT id, 'Dawn of Heroes', 'dawn-of-heroes', 1, 'published'
FROM sagas WHERE slug = 'the-first-journey';

INSERT INTO issues (arc_id, title, slug, order_index, subscription_required, state)
SELECT id, 'Issue 1: The Call', 'issue-1-the-call', 1, false, 'published'
FROM arcs WHERE slug = 'dawn-of-heroes';

INSERT INTO chapters (issue_id, title, slug, order_index, content_format, content_text, state)
SELECT id, 'Chapter 1: In the Beginning', 'chapter-1-in-the-beginning', 1, 'markdown', 
'# Chapter 1: In the Beginning

It was a day like any other when the world changed forever...

The protagonist stood at the edge of the cliff, looking out over the vast expanse of the unknown realm. What lay ahead would test everything they thought they knew about reality itself.', 'published'
FROM issues WHERE slug = 'issue-1-the-call';

