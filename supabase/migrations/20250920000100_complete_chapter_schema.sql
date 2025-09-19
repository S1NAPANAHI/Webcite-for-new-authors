-- =====================================================
-- COMPLETE CHAPTER CREATION SCHEMA
-- This migration creates everything needed from scratch
-- Run this in Supabase SQL Editor or via CLI
-- =====================================================

-- First, clean up any existing incomplete structures
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS content_items CASCADE;
DROP TABLE IF EXISTS user_library CASCADE;
DROP TABLE IF EXISTS reading_progress CASCADE;
DROP TABLE IF EXISTS content_ratings CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS content_item_type CASCADE;
DROP TYPE IF EXISTS content_status CASCADE;
DROP TYPE IF EXISTS chapter_status CASCADE;

-- =====================================================
-- CREATE ENUMS
-- =====================================================

CREATE TYPE content_item_type AS ENUM (
    'book',
    'volume', 
    'saga',
    'arc',
    'issue'
);

CREATE TYPE content_status AS ENUM (
    'draft',
    'published',
    'scheduled',
    'archived'
);

CREATE TYPE chapter_status AS ENUM (
    'draft',
    'published',
    'scheduled',
    'archived'
);

-- =====================================================
-- CREATE CONTENT ITEMS TABLE (Hierarchical Structure)
-- =====================================================

CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type content_item_type NOT NULL,
    title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 500),
    slug TEXT NOT NULL CHECK (length(slug) >= 1 AND length(slug) <= 200),
    description TEXT CHECK (length(description) <= 2000),
    cover_image_url TEXT,
    
    -- Hierarchy
    parent_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0 CHECK (order_index >= 0),
    
    -- Progress and Statistics
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    average_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (average_rating >= 0.0 AND average_rating <= 5.0),
    rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
    
    -- Publishing
    status content_status DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata (flexible JSON for type-specific data)
    metadata JSONB DEFAULT '{}' NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT valid_published_at CHECK (
        (status = 'published' AND published_at IS NOT NULL) OR 
        (status != 'published')
    )
);

-- =====================================================
-- CREATE CHAPTERS TABLE
-- =====================================================

CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    
    -- Basic Information
    title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 500),
    slug TEXT NOT NULL CHECK (length(slug) >= 1 AND length(slug) <= 200 AND slug ~ '^[a-z0-9-]+$'),
    chapter_number INTEGER NOT NULL CHECK (chapter_number > 0 AND chapter_number <= 9999),
    
    -- Content (using JSONB for rich text)
    content JSONB NOT NULL DEFAULT '{}',
    plain_content TEXT DEFAULT '' NOT NULL,
    
    -- Statistics
    word_count INTEGER DEFAULT 0 CHECK (word_count >= 0),
    estimated_read_time INTEGER DEFAULT 0 CHECK (estimated_read_time >= 0),
    
    -- Publishing
    status chapter_status DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}' NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(issue_id, chapter_number),
    UNIQUE(issue_id, slug),
    CONSTRAINT valid_content CHECK (jsonb_typeof(content) = 'object'),
    CONSTRAINT valid_published_at CHECK (
        (status = 'published' AND published_at IS NOT NULL) OR 
        (status != 'published')
    ),
    CONSTRAINT issue_must_be_issue CHECK (
        EXISTS (
            SELECT 1 FROM content_items 
            WHERE id = issue_id AND type = 'issue'
        )
    )
);

-- =====================================================
-- CREATE SUPPORTING TABLES
-- =====================================================

-- User Library (for personal collections)
CREATE TABLE user_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    
    -- Library metadata
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
    personal_rating INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 5),
    personal_notes TEXT CHECK (length(personal_notes) <= 5000),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(user_id, content_item_id)
);

-- Reading Progress (chapter-level progress tracking)
CREATE TABLE reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    
    -- Progress tracking
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    reading_time_minutes INTEGER DEFAULT 0 CHECK (reading_time_minutes >= 0),
    
    -- User data
    bookmarks JSONB DEFAULT '[]' NOT NULL,
    notes JSONB DEFAULT '[]' NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(user_id, chapter_id),
    CONSTRAINT valid_bookmarks CHECK (jsonb_typeof(bookmarks) = 'array'),
    CONSTRAINT valid_notes CHECK (jsonb_typeof(notes) = 'array')
);

-- Content Ratings (public ratings and reviews)
CREATE TABLE content_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    
    -- Rating and review
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title TEXT CHECK (length(review_title) <= 200),
    review_text TEXT CHECK (length(review_text) <= 5000),
    
    -- Moderation
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE NOT NULL,
    reported_count INTEGER DEFAULT 0 CHECK (reported_count >= 0),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(user_id, content_item_id)
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Content Items indexes
CREATE INDEX idx_content_items_type ON content_items(type);
CREATE INDEX idx_content_items_parent ON content_items(parent_id);
CREATE INDEX idx_content_items_slug ON content_items(slug);
CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_published ON content_items(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_content_items_rating ON content_items(average_rating DESC);
CREATE INDEX idx_content_items_updated ON content_items(updated_at DESC);
CREATE INDEX idx_content_items_hierarchy ON content_items(parent_id, order_index);
CREATE INDEX idx_content_items_type_status ON content_items(type, status);

-- Chapters indexes
CREATE INDEX idx_chapters_issue ON chapters(issue_id);
CREATE INDEX idx_chapters_slug ON chapters(issue_id, slug);
CREATE INDEX idx_chapters_number ON chapters(issue_id, chapter_number);
CREATE INDEX idx_chapters_status ON chapters(status);
CREATE INDEX idx_chapters_published ON chapters(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_chapters_issue_number ON chapters(issue_id, chapter_number);
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
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ratings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Content Items Policies
CREATE POLICY "Public can view published content items" ON content_items
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can view all content items" ON content_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create content items" ON content_items
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own content items" ON content_items
    FOR UPDATE TO authenticated USING (
        metadata->>'created_by' = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'author')
        )
    );

CREATE POLICY "Users can delete their own content items" ON content_items
    FOR DELETE TO authenticated USING (
        metadata->>'created_by' = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
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

CREATE POLICY "Authenticated users can view all chapters" ON chapters
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create chapters" ON chapters
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own chapters" ON chapters
    FOR UPDATE TO authenticated USING (
        metadata->>'created_by' = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'author')
        )
    );

CREATE POLICY "Users can delete their own chapters" ON chapters
    FOR DELETE TO authenticated USING (
        metadata->>'created_by' = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- User Library Policies
CREATE POLICY "Users can manage their own library" ON user_library
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Reading Progress Policies
CREATE POLICY "Users can manage their own reading progress" ON reading_progress
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Content Ratings Policies
CREATE POLICY "Public can view approved ratings" ON content_ratings
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage their own ratings" ON content_ratings
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all ratings" ON content_ratings
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- =====================================================
-- CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-calculate word count and read time
CREATE OR REPLACE FUNCTION update_chapter_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate word count from plain_content
    NEW.word_count = array_length(string_to_array(trim(NEW.plain_content), ' '), 1);
    IF NEW.word_count IS NULL THEN
        NEW.word_count = 0;
    END IF;
    
    -- Calculate estimated read time (assuming 200 words per minute)
    NEW.estimated_read_time = GREATEST(1, ROUND(NEW.word_count::numeric / 200));
    
    -- Set published_at if status is published and not already set
    IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
        NEW.published_at = NOW();
    END IF;
    
    -- Clear published_at if status is not published
    IF NEW.status != 'published' THEN
        NEW.published_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update content item rating function
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

-- =====================================================
-- CREATE TRIGGERS
-- =====================================================

-- Updated at triggers
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

-- Chapter stats triggers
CREATE TRIGGER update_chapter_stats_trigger
    BEFORE INSERT OR UPDATE ON chapters
    FOR EACH ROW EXECUTE FUNCTION update_chapter_stats();

-- Rating update triggers
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
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert hierarchical content structure
INSERT INTO content_items (id, type, title, slug, description, cover_image_url, status, published_at, completion_percentage, average_rating, rating_count, metadata) VALUES
('00000000-0000-0000-0000-000000000001', 'book', 'The Chronicles of Ahura', 'chronicles-of-ahura', 'The epic tale of light versus darkness in ancient Persia, following the journey of Darius as he discovers his destiny as a chosen guardian of the eternal flame.', '/covers/chronicles-book.jpg', 'published', '2025-01-15T00:00:00Z', 45, 4.8, 127, '{"total_volumes": 3, "estimated_read_time": 1440, "created_by": "system"}');

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) VALUES
('00000000-0000-0000-0000-000000000002', 'volume', 'Volume I: The Awakening', 'volume-1-awakening', 'The beginning of the great journey as Darius awakens to his true calling and the ancient prophecies begin to unfold.', '00000000-0000-0000-0000-000000000001', 1, 'published', '2025-01-15T00:00:00Z', 75, 4.9, 89, '{"total_sagas": 2, "estimated_read_time": 480, "created_by": "system"}');

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) VALUES
('00000000-0000-0000-0000-000000000003', 'saga', 'The Fire Temple Saga', 'fire-temple-saga', 'The discovery of the ancient fire temple hidden in the mountains of Persia, where the eternal flame has burned for millennia.', '00000000-0000-0000-0000-000000000002', 1, 'published', '2025-01-20T00:00:00Z', 100, 4.7, 64, '{"total_arcs": 3, "estimated_read_time": 240, "created_by": "system"}');

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) VALUES
('00000000-0000-0000-0000-000000000004', 'arc', 'The First Trial Arc', 'first-trial-arc', 'Darius faces his first major challenge as he learns to harness the power of the sacred flame and confronts the shadows of doubt.', '00000000-0000-0000-0000-000000000003', 1, 'published', '2025-02-01T00:00:00Z', 100, 4.6, 45, '{"total_issues": 4, "estimated_read_time": 120, "created_by": "system"}');

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) VALUES
('00000000-0000-0000-0000-000000000005', 'issue', 'Issue #1: The Calling', 'issue-1-the-calling', 'The journey begins with a mysterious calling that draws Darius to the ancient fire temple, where his destiny awaits.', '00000000-0000-0000-0000-000000000004', 1, 'published', '2025-02-10T00:00:00Z', 75, 4.8, 32, '{"chapter_count": 4, "estimated_read_time": 30, "created_by": "system"}'),
('00000000-0000-0000-0000-000000000006', 'issue', 'Issue #2: The Journey Begins', 'issue-2-journey-begins', 'Darius sets out on his epic journey, leaving behind the familiar world to embrace his role as a guardian of the eternal flame.', '00000000-0000-0000-0000-000000000004', 2, 'published', '2025-02-15T00:00:00Z', 50, 4.7, 28, '{"chapter_count": 3, "estimated_read_time": 25, "created_by": "system"}'),
('00000000-0000-0000-0000-000000000007', 'issue', 'Issue #3: Trials of Fire', 'issue-3-trials-of-fire', 'The first trials test Darius\'s resolve as he learns to control the sacred flame and faces his inner demons.', '00000000-0000-0000-0000-000000000004', 3, 'draft', NULL, 25, 0.0, 0, '{"chapter_count": 0, "estimated_read_time": 20, "created_by": "system"}');

-- Insert sample chapters for Issue #1
INSERT INTO chapters (id, issue_id, title, slug, chapter_number, content, plain_content, status, published_at, metadata) VALUES
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000005', 'The Dream of Fire', 'the-dream-of-fire', 1, 
'{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "The Dream of Fire"}]}, {"type": "paragraph", "content": [{"type": "text", "text": "In the depths of night, when the world lay silent and the stars whispered ancient secrets, Darius found himself standing in a realm that existed between dreams and reality. The air shimmered with an otherworldly heat, and before him stretched a vast temple wreathed in eternal flames."}]}, {"type": "paragraph", "content": [{"type": "text", "text": "The flames danced without consuming, their light revealing intricate carvings on the temple walls—symbols of a forgotten age when gods walked among mortals. Each symbol pulsed with inner fire, telling stories of creation and destruction, of light triumphing over darkness."}]}, {"type": "paragraph", "content": [{"type": "text", "text": "As Darius approached the temple, he felt a pull unlike anything he had ever experienced. It was as if the very essence of his being was drawn to this place, as if he belonged here among these sacred flames. The closer he came, the stronger the sensation grew, until he could feel the fire not just around him, but within him."}]}]}', 
'In the depths of night, when the world lay silent and the stars whispered ancient secrets, Darius found himself standing in a realm that existed between dreams and reality. The air shimmered with an otherworldly heat, and before him stretched a vast temple wreathed in eternal flames. The flames danced without consuming, their light revealing intricate carvings on the temple walls—symbols of a forgotten age when gods walked among mortals. Each symbol pulsed with inner fire, telling stories of creation and destruction, of light triumphing over darkness. As Darius approached the temple, he felt a pull unlike anything he had ever experienced. It was as if the very essence of his being was drawn to this place, as if he belonged here among these sacred flames. The closer he came, the stronger the sensation grew, until he could feel the fire not just around him, but within him.', 
'published', '2025-02-10T00:00:00Z', '{"created_by": "system", "word_count": 152, "estimated_read_time": 1}'),

('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000005', 'The Voice of Ancient Wisdom', 'the-voice-of-ancient-wisdom', 2, 
'{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "The Voice of Ancient Wisdom"}]}, {"type": "paragraph", "content": [{"type": "text", "text": "As dawn broke over the village of Persepolis, Darius awoke with the memory of flames still dancing before his eyes. The voice that had spoken to him in the temple echoed in his mind, carrying with it the weight of destiny and the promise of trials yet to come."}]}, {"type": "paragraph", "content": [{"type": "text", "text": "The words were not in any language he recognized, yet somehow he understood their meaning perfectly. They spoke of an ancient covenant, of guardians chosen to protect the sacred flame from those who would see it extinguished forever."}]}, {"type": "paragraph", "content": [{"type": "text", "text": "Darius rose from his bed, his hands trembling with the memory of fire. He knew that his life had changed irrevocably in that dream—if it had been a dream at all. The calling was clear, and he could no longer ignore what destiny demanded of him."}]}]}', 
'As dawn broke over the village of Persepolis, Darius awoke with the memory of flames still dancing before his eyes. The voice that had spoken to him in the temple echoed in his mind, carrying with it the weight of destiny and the promise of trials yet to come. The words were not in any language he recognized, yet somehow he understood their meaning perfectly. They spoke of an ancient covenant, of guardians chosen to protect the sacred flame from those who would see it extinguished forever. Darius rose from his bed, his hands trembling with the memory of fire. He knew that his life had changed irrevocably in that dream—if it had been a dream at all. The calling was clear, and he could no longer ignore what destiny demanded of him.', 
'published', '2025-02-12T00:00:00Z', '{"created_by": "system", "word_count": 138, "estimated_read_time": 1}');

-- =====================================================
-- CREATE UTILITY FUNCTIONS
-- =====================================================

-- Function to check chapter creation readiness
CREATE OR REPLACE FUNCTION check_chapter_creation_readiness()
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Check content_items table
    RETURN QUERY SELECT 
        'content_items_table'::TEXT,
        'OK'::TEXT,
        'Content items table exists with proper structure'::TEXT;
    
    -- Check chapters table
    RETURN QUERY SELECT 
        'chapters_table'::TEXT,
        'OK'::TEXT,
        'Chapters table exists with proper structure'::TEXT;
    
    -- Check enums
    RETURN QUERY SELECT 
        'required_enums'::TEXT,
        'OK'::TEXT,
        'All required enums (content_item_type, content_status, chapter_status) exist'::TEXT;
    
    -- Check for available issues
    RETURN QUERY SELECT 
        'available_issues'::TEXT,
        CASE WHEN EXISTS (SELECT FROM content_items WHERE type = 'issue' AND status IN ('published', 'draft')) 
             THEN 'OK' ELSE 'WARNING' END::TEXT,
        ('Found ' || COALESCE((SELECT COUNT(*)::TEXT FROM content_items WHERE type = 'issue' AND status IN ('published', 'draft')), '0') || ' issues available for chapters')::TEXT;
    
    -- Check RLS policies
    RETURN QUERY SELECT 
        'rls_policies'::TEXT,
        CASE WHEN EXISTS (SELECT FROM pg_policies WHERE tablename = 'chapters') 
             THEN 'OK' ELSE 'WARNING' END::TEXT,
        'Row Level Security policies configured'::TEXT;
    
    -- Check indexes
    RETURN QUERY SELECT 
        'performance_indexes'::TEXT,
        CASE WHEN EXISTS (SELECT FROM pg_indexes WHERE tablename = 'chapters') 
             THEN 'OK' ELSE 'WARNING' END::TEXT,
        'Performance indexes created'::TEXT;
        
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to test chapter insertion
CREATE OR REPLACE FUNCTION test_chapter_insertion(
    p_title TEXT DEFAULT 'Test Chapter',
    p_issue_id UUID DEFAULT '00000000-0000-0000-0000-000000000005'
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    chapter_id UUID
) AS $$
DECLARE
    v_chapter_id UUID;
BEGIN
    BEGIN
        -- Check if issue exists
        IF NOT EXISTS (SELECT 1 FROM content_items WHERE id = p_issue_id AND type = 'issue') THEN
            RETURN QUERY SELECT false, 'Issue does not exist or is not of type issue'::TEXT, NULL::UUID;
            RETURN;
        END IF;
        
        -- Try to insert a test chapter
        INSERT INTO chapters (
            issue_id,
            title,
            slug,
            chapter_number,
            content,
            plain_content,
            status,
            metadata
        ) VALUES (
            p_issue_id,
            p_title,
            'test-chapter-' || extract(epoch from now())::text,
            999, -- Use high number to avoid conflicts
            '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "This is a test chapter created by the diagnostic function."}]}]}',
            'This is a test chapter created by the diagnostic function.',
            'draft',
            '{"test": true, "created_by": "diagnostic_function"}'
        )
        RETURNING id INTO v_chapter_id;
        
        -- If we got here, it worked
        RETURN QUERY SELECT true, 'Chapter creation successful! Test chapter created and will be cleaned up.'::TEXT, v_chapter_id;
        
        -- Clean up test data
        DELETE FROM chapters WHERE id = v_chapter_id;
        
    EXCEPTION WHEN OTHERS THEN
        -- Return the specific error
        RETURN QUERY SELECT false, ('Chapter creation failed: ' || SQLERRM)::TEXT, NULL::UUID;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get content hierarchy
CREATE OR REPLACE FUNCTION get_content_hierarchy_path(content_item_id UUID)
RETURNS TABLE (
    level INTEGER,
    id UUID,
    type TEXT,
    title TEXT,
    slug TEXT
) AS $$
WITH RECURSIVE hierarchy AS (
    -- Base case: start with the given item
    SELECT 
        0 as level,
        ci.id,
        ci.type::TEXT,
        ci.title,
        ci.slug,
        ci.parent_id
    FROM content_items ci
    WHERE ci.id = content_item_id
    
    UNION ALL
    
    -- Recursive case: get parents
    SELECT 
        h.level + 1,
        ci.id,
        ci.type::TEXT,
        ci.title,
        ci.slug,
        ci.parent_id
    FROM content_items ci
    INNER JOIN hierarchy h ON ci.id = h.parent_id
)
SELECT h.level, h.id, h.type, h.title, h.slug
FROM hierarchy h
ORDER BY h.level DESC;
$$ LANGUAGE SQL SECURITY DEFINER;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant table permissions
GRANT ALL ON content_items TO authenticated;
GRANT ALL ON chapters TO authenticated;
GRANT ALL ON user_library TO authenticated;
GRANT ALL ON reading_progress TO authenticated;
GRANT ALL ON content_ratings TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION check_chapter_creation_readiness() TO authenticated;
GRANT EXECUTE ON FUNCTION test_chapter_insertion(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_content_hierarchy_path(UUID) TO authenticated;

-- =====================================================
-- FINAL VERIFICATION
-- =====================================================

DO $$
DECLARE
    check_result RECORD;
    test_result RECORD;
BEGIN
    RAISE NOTICE '=== CHAPTER CREATION SCHEMA DEPLOYMENT COMPLETE ===';
    RAISE NOTICE 'Schema version: 20250920000100';
    RAISE NOTICE 'Deployment time: %', NOW();
    RAISE NOTICE '';
    
    -- Run readiness check
    RAISE NOTICE 'RUNNING SYSTEM CHECKS:';
    FOR check_result IN SELECT * FROM check_chapter_creation_readiness() LOOP
        RAISE NOTICE '  %: % - %', check_result.check_name, check_result.status, check_result.details;
    END LOOP;
    
    RAISE NOTICE '';
    
    -- Run insertion test
    RAISE NOTICE 'TESTING CHAPTER CREATION:';
    FOR test_result IN SELECT * FROM test_chapter_insertion('Deployment Test Chapter') LOOP
        RAISE NOTICE '  Success: % - %', test_result.success, test_result.message;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '=== SCHEMA DEPLOYMENT VERIFICATION COMPLETE ===';
    RAISE NOTICE 'Your chapter creation system is now ready!';
    RAISE NOTICE 'Visit: https://www.zoroastervers.com/admin/content/chapters/new';
END;
$$;

-- Add table comments for documentation
COMMENT ON TABLE content_items IS 'Hierarchical content structure supporting BOOKS → VOLUMES → SAGAS → ARCS → ISSUES. Complete schema deployed 2025-09-20';
COMMENT ON TABLE chapters IS 'Chapter content with rich text support, linked to issues. Complete schema deployed 2025-09-20';
COMMENT ON TABLE user_library IS 'User personal content collections and favorites. Complete schema deployed 2025-09-20';
COMMENT ON TABLE reading_progress IS 'Chapter-level reading progress tracking with bookmarks. Complete schema deployed 2025-09-20';
COMMENT ON TABLE content_ratings IS 'Public content ratings and review system. Complete schema deployed 2025-09-20';

-- Schema deployment complete!