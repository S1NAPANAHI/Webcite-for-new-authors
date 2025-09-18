-- =====================================================
-- Hierarchical Content System Migration
-- Creates the database structure for BOOKS>VOLUMES>SAGAS>ARCS>ISSUES>CHAPTERS
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Main hierarchical content table
-- =====================================================
CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('book', 'volume', 'saga', 'arc', 'issue')),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    parent_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    average_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (average_rating >= 0.0 AND average_rating <= 5.0),
    rating_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'scheduled')),
    published_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Chapters table (belongs to issues)
-- =====================================================
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content JSONB DEFAULT '{}', -- Rich text content from editor
    plain_content TEXT, -- Plain text version for search
    chapter_number INTEGER NOT NULL,
    word_count INTEGER DEFAULT 0,
    estimated_read_time INTEGER DEFAULT 0, -- in minutes
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'scheduled')),
    published_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(issue_id, chapter_number),
    UNIQUE(issue_id, slug)
);

-- =====================================================
-- User library - items users have added to their collection
-- =====================================================
CREATE TABLE user_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_favorite BOOLEAN DEFAULT FALSE,
    personal_rating INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 5),
    personal_notes TEXT,
    UNIQUE(user_id, content_item_id)
);

-- =====================================================
-- Reading progress tracking
-- =====================================================
CREATE TABLE reading_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed BOOLEAN DEFAULT FALSE,
    reading_time_minutes INTEGER DEFAULT 0,
    bookmarks JSONB DEFAULT '[]', -- Array of bookmark positions
    notes JSONB DEFAULT '[]', -- Array of user notes/highlights
    UNIQUE(user_id, chapter_id)
);

-- =====================================================
-- Content ratings (separate from user library)
-- =====================================================
CREATE TABLE content_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_item_id)
);

-- =====================================================
-- Indexes for performance
-- =====================================================
CREATE INDEX idx_content_items_type ON content_items(type);
CREATE INDEX idx_content_items_parent_id ON content_items(parent_id);
CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_slug ON content_items(slug);
CREATE INDEX idx_content_items_created_by ON content_items(created_by);
CREATE INDEX idx_content_items_order ON content_items(parent_id, order_index);

CREATE INDEX idx_chapters_issue_id ON chapters(issue_id);
CREATE INDEX idx_chapters_status ON chapters(status);
CREATE INDEX idx_chapters_number ON chapters(issue_id, chapter_number);
CREATE INDEX idx_chapters_published_at ON chapters(published_at);

CREATE INDEX idx_user_library_user_id ON user_library(user_id);
CREATE INDEX idx_user_library_content_item ON user_library(content_item_id);
CREATE INDEX idx_user_library_added_at ON user_library(added_at);

CREATE INDEX idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX idx_reading_progress_chapter_id ON reading_progress(chapter_id);
CREATE INDEX idx_reading_progress_last_read ON reading_progress(last_read_at);

CREATE INDEX idx_content_ratings_content_item ON content_ratings(content_item_id);
CREATE INDEX idx_content_ratings_user_id ON content_ratings(user_id);

-- =====================================================
-- RLS (Row Level Security) Policies
-- =====================================================

-- Content Items
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published content items" ON content_items
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all content items" ON content_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Chapters
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published chapters" ON chapters
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all chapters" ON chapters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- User Library
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own library" ON user_library
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user libraries" ON user_library
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Reading Progress
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reading progress" ON reading_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all reading progress" ON reading_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Content Ratings
ALTER TABLE content_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings" ON content_ratings
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own ratings" ON content_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON content_ratings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" ON content_ratings
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function to update content item ratings when ratings change
CREATE OR REPLACE FUNCTION update_content_item_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE content_items 
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating::decimal), 0.0)
            FROM content_ratings 
            WHERE content_item_id = COALESCE(NEW.content_item_id, OLD.content_item_id)
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM content_ratings 
            WHERE content_item_id = COALESCE(NEW.content_item_id, OLD.content_item_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.content_item_id, OLD.content_item_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for rating updates
CREATE TRIGGER trigger_update_content_rating
    AFTER INSERT OR UPDATE OR DELETE ON content_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_content_item_rating();

-- Function to update completion percentage based on chapters
CREATE OR REPLACE FUNCTION update_completion_percentage()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE content_items 
    SET 
        completion_percentage = (
            SELECT CASE 
                WHEN COUNT(*) = 0 THEN 0
                ELSE ROUND((COUNT(*) FILTER (WHERE status = 'published') * 100.0) / COUNT(*))
            END
            FROM chapters 
            WHERE issue_id = COALESCE(NEW.issue_id, OLD.issue_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.issue_id, OLD.issue_id) AND type = 'issue';
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for completion percentage updates
CREATE TRIGGER trigger_update_completion_percentage
    AFTER INSERT OR UPDATE OR DELETE ON chapters
    FOR EACH ROW
    EXECUTE FUNCTION update_completion_percentage();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_content_items_updated_at
    BEFORE UPDATE ON content_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_chapters_updated_at
    BEFORE UPDATE ON chapters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Useful Views
-- =====================================================

-- View for content items with their hierarchy path
CREATE VIEW content_items_with_path AS
WITH RECURSIVE content_hierarchy AS (
    -- Base case: root items (books)
    SELECT 
        id, type, title, slug, parent_id, order_index,
        title as path,
        0 as depth,
        ARRAY[order_index] as sort_path
    FROM content_items 
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case: child items
    SELECT 
        ci.id, ci.type, ci.title, ci.slug, ci.parent_id, ci.order_index,
        ch.path || ' > ' || ci.title as path,
        ch.depth + 1 as depth,
        ch.sort_path || ci.order_index as sort_path
    FROM content_items ci
    JOIN content_hierarchy ch ON ci.parent_id = ch.id
)
SELECT 
    ci.*,
    ch.path,
    ch.depth,
    ch.sort_path
FROM content_items ci
JOIN content_hierarchy ch ON ci.id = ch.id;

-- View for user reading statistics
CREATE VIEW user_reading_stats AS
SELECT 
    ul.user_id,
    COUNT(DISTINCT ul.content_item_id) as items_in_library,
    COUNT(DISTINCT rp.chapter_id) as chapters_started,
    COUNT(DISTINCT rp.chapter_id) FILTER (WHERE rp.completed = true) as chapters_completed,
    SUM(rp.reading_time_minutes) as total_reading_time,
    MAX(rp.last_read_at) as last_reading_session
FROM user_library ul
LEFT JOIN content_items ci ON ul.content_item_id = ci.id
LEFT JOIN chapters c ON c.issue_id = ci.id OR 
    c.issue_id IN (
        SELECT id FROM content_items 
        WHERE parent_id = ci.id OR 
              parent_id IN (SELECT id FROM content_items WHERE parent_id = ci.id) OR
              parent_id IN (SELECT id FROM content_items WHERE parent_id IN (SELECT id FROM content_items WHERE parent_id = ci.id))
    )
LEFT JOIN reading_progress rp ON rp.chapter_id = c.id AND rp.user_id = ul.user_id
GROUP BY ul.user_id;

-- =====================================================
-- Sample Data for Testing
-- =====================================================

-- Insert sample hierarchy
INSERT INTO content_items (type, title, slug, description, status, order_index) VALUES 
('book', 'The Chronicles of Ahura', 'chronicles-of-ahura', 'The epic tale of light versus darkness in ancient Persia', 'published', 1);

-- Get the book ID for subsequent inserts
DO $$
DECLARE
    book_id UUID;
    volume_id UUID;
    saga_id UUID;
    arc_id UUID;
    issue_id UUID;
BEGIN
    -- Get book ID
    SELECT id INTO book_id FROM content_items WHERE slug = 'chronicles-of-ahura';
    
    -- Insert volume
    INSERT INTO content_items (type, title, slug, description, parent_id, status, order_index) 
    VALUES ('volume', 'Volume I: The Awakening', 'volume-1-awakening', 'The beginning of the great journey', book_id, 'published', 1)
    RETURNING id INTO volume_id;
    
    -- Insert saga
    INSERT INTO content_items (type, title, slug, description, parent_id, status, order_index) 
    VALUES ('saga', 'The Fire Temple Saga', 'fire-temple-saga', 'The discovery of the ancient fire temple', volume_id, 'published', 1)
    RETURNING id INTO saga_id;
    
    -- Insert arc
    INSERT INTO content_items (type, title, slug, description, parent_id, status, order_index) 
    VALUES ('arc', 'The First Trial Arc', 'first-trial-arc', 'The protagonist faces their first major challenge', saga_id, 'published', 1)
    RETURNING id INTO arc_id;
    
    -- Insert issue
    INSERT INTO content_items (type, title, slug, description, parent_id, status, order_index, completion_percentage) 
    VALUES ('issue', 'Issue #1: The Calling', 'issue-1-the-calling', 'The journey begins with a mysterious calling', arc_id, 'published', 1, 75)
    RETURNING id INTO issue_id;
    
    -- Insert chapters
    INSERT INTO chapters (issue_id, title, slug, chapter_number, content, plain_content, word_count, estimated_read_time, status, published_at) VALUES 
    (issue_id, 'The Dream', 'the-dream', 1, '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"In the depths of night, Darius received a vision..."}]}]}', 'In the depths of night, Darius received a vision...', 2500, 12, 'published', NOW() - INTERVAL '7 days'),
    (issue_id, 'The Journey Begins', 'the-journey-begins', 2, '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"With the dawn came clarity and purpose..."}]}]}', 'With the dawn came clarity and purpose...', 3200, 16, 'published', NOW() - INTERVAL '5 days'),
    (issue_id, 'The Fire Temple', 'the-fire-temple', 3, '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"The ancient temple stood before them, wreathed in eternal flames..."}]}]}', 'The ancient temple stood before them, wreathed in eternal flames...', 2800, 14, 'draft', NULL);
END $$;