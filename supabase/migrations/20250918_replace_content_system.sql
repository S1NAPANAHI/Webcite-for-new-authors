-- =====================================================
-- REPLACE OLD CONTENT SYSTEM WITH HIERARCHICAL STRUCTURE
-- This migration completely replaces the old book/chapter system
-- =====================================================

-- First, drop all existing content-related tables and their dependencies
-- Note: This will remove all existing content data!

-- Drop existing tables if they exist
DROP TABLE IF EXISTS book_subscriptions CASCADE;
DROP TABLE IF EXISTS book_ratings CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS content_ratings CASCADE;
DROP TABLE IF EXISTS user_library CASCADE;
DROP TABLE IF EXISTS reading_progress CASCADE;
DROP TABLE IF EXISTS content_items CASCADE;

-- Drop any existing types
DROP TYPE IF EXISTS content_item_type CASCADE;
DROP TYPE IF EXISTS content_status CASCADE;
DROP TYPE IF EXISTS chapter_status CASCADE;

-- =====================================================
-- CREATE NEW HIERARCHICAL CONTENT SYSTEM
-- =====================================================

-- Create content item type enum
CREATE TYPE content_item_type AS ENUM (
    'book',
    'volume', 
    'saga',
    'arc',
    'issue'
);

-- Create content status enum
CREATE TYPE content_status AS ENUM (
    'draft',
    'published',
    'scheduled',
    'archived'
);

-- Create chapter status enum
CREATE TYPE chapter_status AS ENUM (
    'draft',
    'published',
    'scheduled',
    'archived'
);

-- =====================================================
-- CONTENT ITEMS TABLE (Hierarchical structure)
-- =====================================================

CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type content_item_type NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    
    -- Hierarchy
    parent_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    
    -- Progress and Statistics
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    average_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (average_rating >= 0.0 AND average_rating <= 5.0),
    rating_count INTEGER DEFAULT 0,
    
    -- Publishing
    status content_status DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata (flexible JSON for type-specific data)
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CHAPTERS TABLE (Linked to Issues)
-- =====================================================

CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    
    -- Basic Information
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    
    -- Content (using JSONB for rich text)
    content JSONB NOT NULL DEFAULT '{}', -- Rich text content in JSON format
    plain_content TEXT DEFAULT '', -- Plain text for search
    
    -- Statistics
    word_count INTEGER DEFAULT 0,
    estimated_read_time INTEGER DEFAULT 0, -- in minutes
    
    -- Publishing
    status chapter_status DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(issue_id, chapter_number),
    UNIQUE(issue_id, slug),
    CHECK (chapter_number > 0)
);

-- =====================================================
-- USER LIBRARY TABLE (User's personal content library)
-- =====================================================

CREATE TABLE user_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    
    -- Library metadata
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_favorite BOOLEAN DEFAULT FALSE,
    personal_rating INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 5),
    personal_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, content_item_id)
);

-- =====================================================
-- READING PROGRESS TABLE (Chapter-level progress tracking)
-- =====================================================

CREATE TABLE reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    
    -- Progress tracking
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed BOOLEAN DEFAULT FALSE,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reading_time_minutes INTEGER DEFAULT 0,
    
    -- User data
    bookmarks JSONB DEFAULT '[]', -- Array of bookmark positions
    notes JSONB DEFAULT '[]', -- Array of user notes
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, chapter_id)
);

-- =====================================================
-- CONTENT RATINGS TABLE (Public ratings and reviews)
-- =====================================================

CREATE TABLE content_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    
    -- Rating and review
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title TEXT,
    review_text TEXT,
    
    -- Moderation
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    reported_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, content_item_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Content Items indexes
CREATE INDEX idx_content_items_type ON content_items(type);
CREATE INDEX idx_content_items_parent ON content_items(parent_id);
CREATE INDEX idx_content_items_slug ON content_items(slug);
CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_published ON content_items(published_at) WHERE status = 'published';
CREATE INDEX idx_content_items_rating ON content_items(average_rating DESC);
CREATE INDEX idx_content_items_updated ON content_items(updated_at DESC);
CREATE INDEX idx_content_items_hierarchy ON content_items(parent_id, order_index);

-- Chapters indexes
CREATE INDEX idx_chapters_issue ON chapters(issue_id);
CREATE INDEX idx_chapters_slug ON chapters(issue_id, slug);
CREATE INDEX idx_chapters_number ON chapters(issue_id, chapter_number);
CREATE INDEX idx_chapters_status ON chapters(status);
CREATE INDEX idx_chapters_published ON chapters(published_at) WHERE status = 'published';
CREATE INDEX idx_chapters_search ON chapters USING gin(to_tsvector('english', title || ' ' || plain_content));

-- User Library indexes
CREATE INDEX idx_user_library_user ON user_library(user_id);
CREATE INDEX idx_user_library_content ON user_library(content_item_id);
CREATE INDEX idx_user_library_added ON user_library(user_id, added_at DESC);
CREATE INDEX idx_user_library_favorites ON user_library(user_id) WHERE is_favorite = TRUE;
CREATE INDEX idx_user_library_accessed ON user_library(user_id, last_accessed_at DESC);

-- Reading Progress indexes
CREATE INDEX idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX idx_reading_progress_chapter ON reading_progress(chapter_id);
CREATE INDEX idx_reading_progress_completed ON reading_progress(user_id, completed);
CREATE INDEX idx_reading_progress_recent ON reading_progress(user_id, last_read_at DESC);

-- Content Ratings indexes
CREATE INDEX idx_content_ratings_content ON content_ratings(content_item_id);
CREATE INDEX idx_content_ratings_user ON content_ratings(user_id);
CREATE INDEX idx_content_ratings_rating ON content_ratings(content_item_id, rating DESC);
CREATE INDEX idx_content_ratings_featured ON content_ratings(content_item_id) WHERE is_featured = TRUE;
CREATE INDEX idx_content_ratings_approved ON content_ratings(content_item_id) WHERE is_approved = TRUE;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ratings ENABLE ROW LEVEL SECURITY;

-- Content Items Policies
CREATE POLICY "Public can view published content items" ON content_items
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated can view all content items" ON content_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage content items" ON content_items
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Content creators can manage their content" ON content_items
    FOR ALL TO authenticated 
    USING (
        auth.jwt() ->> 'role' IN ('admin', 'author') OR
        metadata->>'created_by' = auth.uid()::text
    );

-- Chapters Policies
CREATE POLICY "Public can view published chapters" ON chapters
    FOR SELECT USING (
        status = 'published' AND 
        EXISTS (
            SELECT 1 FROM content_items ci 
            WHERE ci.id = chapters.issue_id AND ci.status = 'published'
        )
    );

CREATE POLICY "Authenticated can view all chapters" ON chapters
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage chapters" ON chapters
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Content creators can manage their chapters" ON chapters
    FOR ALL TO authenticated 
    USING (
        auth.jwt() ->> 'role' IN ('admin', 'author') OR
        metadata->>'created_by' = auth.uid()::text
    );

-- User Library Policies
CREATE POLICY "Users can manage their own library" ON user_library
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own library" ON user_library
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Reading Progress Policies
CREATE POLICY "Users can manage their own reading progress" ON reading_progress
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reading progress" ON reading_progress
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Content Ratings Policies
CREATE POLICY "Public can view approved ratings" ON content_ratings
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage their own ratings" ON content_ratings
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all ratings" ON content_ratings
    FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATING FIELDS
-- =====================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_content_items_updated_at
    BEFORE UPDATE ON content_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at
    BEFORE UPDATE ON chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_library_updated_at
    BEFORE UPDATE ON user_library
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_progress_updated_at
    BEFORE UPDATE ON reading_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_ratings_updated_at
    BEFORE UPDATE ON content_ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER TO UPDATE CONTENT ITEM RATINGS
-- =====================================================

CREATE OR REPLACE FUNCTION update_content_item_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the average rating and count for the content item
    UPDATE content_items SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0.0)
            FROM content_ratings 
            WHERE content_item_id = COALESCE(NEW.content_item_id, OLD.content_item_id)
            AND is_approved = true
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM content_ratings 
            WHERE content_item_id = COALESCE(NEW.content_item_id, OLD.content_item_id)
            AND is_approved = true
        )
    WHERE id = COALESCE(NEW.content_item_id, OLD.content_item_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply rating update triggers
CREATE TRIGGER update_rating_on_insert
    AFTER INSERT ON content_ratings
    FOR EACH ROW EXECUTE FUNCTION update_content_item_rating();

CREATE TRIGGER update_rating_on_update
    AFTER UPDATE ON content_ratings
    FOR EACH ROW EXECUTE FUNCTION update_content_item_rating();

CREATE TRIGGER update_rating_on_delete
    AFTER DELETE ON content_ratings
    FOR EACH ROW EXECUTE FUNCTION update_content_item_rating();

-- =====================================================
-- INSERT SAMPLE DATA FOR DEVELOPMENT
-- =====================================================

-- Insert sample hierarchical content
INSERT INTO content_items (id, type, title, slug, description, cover_image_url, status, published_at, completion_percentage, average_rating, rating_count, metadata) VALUES
('00000000-0000-0000-0000-000000000001', 'book', 'The Chronicles of Ahura', 'chronicles-of-ahura', 'The epic tale of light versus darkness in ancient Persia', '/covers/chronicles-book.jpg', 'published', '2025-01-15T00:00:00Z', 45, 4.8, 127, '{"total_volumes": 3, "estimated_read_time": 1440}');

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) VALUES
('00000000-0000-0000-0000-000000000002', 'volume', 'Volume I: The Awakening', 'volume-1-awakening', 'The beginning of the great journey', '00000000-0000-0000-0000-000000000001', 1, 'published', '2025-01-15T00:00:00Z', 75, 4.9, 89, '{"total_sagas": 2, "estimated_read_time": 480}');

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) VALUES
('00000000-0000-0000-0000-000000000003', 'saga', 'The Fire Temple Saga', 'fire-temple-saga', 'The discovery of the ancient fire temple', '00000000-0000-0000-0000-000000000002', 1, 'published', '2025-01-20T00:00:00Z', 100, 4.7, 64, '{"total_arcs": 3, "estimated_read_time": 240}');

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) VALUES
('00000000-0000-0000-0000-000000000004', 'arc', 'The First Trial Arc', 'first-trial-arc', 'The protagonist faces their first major challenge', '00000000-0000-0000-0000-000000000003', 1, 'published', '2025-02-01T00:00:00Z', 100, 4.6, 45, '{"total_issues": 4, "estimated_read_time": 120}');

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) VALUES
('00000000-0000-0000-0000-000000000005', 'issue', 'Issue #1: The Calling', 'issue-1-the-calling', 'The journey begins with a mysterious calling', '00000000-0000-0000-0000-000000000004', 1, 'published', '2025-02-10T00:00:00Z', 75, 4.8, 32, '{"chapter_count": 4, "estimated_read_time": 30}');

-- Insert sample chapters
INSERT INTO chapters (id, issue_id, title, slug, chapter_number, content, plain_content, word_count, estimated_read_time, status, published_at) VALUES
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000005', 'The Dream of Fire', 'the-dream-of-fire', 1, 
'{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "In the depths of night, when the world lay silent and the stars whispered ancient secrets, Darius found himself standing in a realm that existed between dreams and reality. The air shimmered with an otherworldly heat, and before him stretched a vast temple wreathed in eternal flames."}]}]}', 
'In the depths of night, when the world lay silent and the stars whispered ancient secrets, Darius found himself standing in a realm that existed between dreams and reality. The air shimmered with an otherworldly heat, and before him stretched a vast temple wreathed in eternal flames.', 
3200, 16, 'published', '2025-02-10T00:00:00Z');

INSERT INTO chapters (id, issue_id, title, slug, chapter_number, content, plain_content, word_count, estimated_read_time, status, published_at) VALUES
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000005', 'The Voice of Ancient Wisdom', 'the-voice-of-ancient-wisdom', 2, 
'{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "As dawn broke over the village of Persepolis, Darius awoke with the memory of flames still dancing before his eyes. The voice that had spoken to him in the temple echoed in his mind, carrying with it the weight of destiny."}]}]}', 
'As dawn broke over the village of Persepolis, Darius awoke with the memory of flames still dancing before his eyes. The voice that had spoken to him in the temple echoed in his mind, carrying with it the weight of destiny.', 
2800, 14, 'published', '2025-02-12T00:00:00Z');

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON content_items TO authenticated;
GRANT SELECT ON chapters TO authenticated;
GRANT ALL ON user_library TO authenticated;
GRANT ALL ON reading_progress TO authenticated;
GRANT ALL ON content_ratings TO authenticated;

-- Grant permissions for the utility functions (they will be created in the next migration)
-- This ensures the functions work properly when created
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Add a comment to track migration completion
COMMENT ON TABLE content_items IS 'Hierarchical content structure: BOOKS → VOLUMES → SAGAS → ARCS → ISSUES. Migrated 2025-09-18';
COMMENT ON TABLE chapters IS 'Chapter content linked to issues. Supports rich text content. Migrated 2025-09-18';
COMMENT ON TABLE user_library IS 'User personal content library with favorites and ratings. Migrated 2025-09-18';
COMMENT ON TABLE reading_progress IS 'Chapter-level reading progress tracking. Migrated 2025-09-18';
COMMENT ON TABLE content_ratings IS 'Public content ratings and reviews system. Migrated 2025-09-18';

-- Log successful migration
DO $$
BEGIN
    RAISE NOTICE 'Successfully replaced content system with hierarchical structure!';
    RAISE NOTICE 'Created tables: content_items, chapters, user_library, reading_progress, content_ratings';
    RAISE NOTICE 'Added comprehensive indexes and RLS policies';
    RAISE NOTICE 'Inserted sample data for development';
END $$;