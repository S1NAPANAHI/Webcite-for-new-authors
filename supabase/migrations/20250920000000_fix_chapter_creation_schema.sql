-- =====================================================
-- FIX CHAPTER CREATION SCHEMA
-- This migration fixes chapter creation issues by ensuring all
-- necessary schemas, policies, and functions are properly set up
-- =====================================================

-- First, let's ensure the tables exist with correct structure
-- (This is idempotent - won't error if they already exist)

-- =====================================================
-- ENSURE CONTENT_ITEMS TABLE EXISTS
-- =====================================================

CREATE TABLE IF NOT EXISTS content_items (
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
-- ENSURE CHAPTERS TABLE EXISTS WITH CORRECT STRUCTURE
-- =====================================================

CREATE TABLE IF NOT EXISTS chapters (
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
-- ENSURE REQUIRED ENUMS EXIST
-- =====================================================

-- Create content_item_type enum if it doesn't exist
DO $$ 
BEGIN
    CREATE TYPE content_item_type AS ENUM (
        'book',
        'volume', 
        'saga',
        'arc',
        'issue'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create content_status enum if it doesn't exist
DO $$ 
BEGIN
    CREATE TYPE content_status AS ENUM (
        'draft',
        'published',
        'scheduled',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create chapter_status enum if it doesn't exist
DO $$ 
BEGIN
    CREATE TYPE chapter_status AS ENUM (
        'draft',
        'published',
        'scheduled',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- ENSURE ALL NECESSARY INDEXES EXIST
-- =====================================================

-- Content Items indexes
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_parent ON content_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_content_items_slug ON content_items(slug);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_published ON content_items(published_at) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_content_items_rating ON content_items(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_updated ON content_items(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_hierarchy ON content_items(parent_id, order_index);

-- Chapters indexes
CREATE INDEX IF NOT EXISTS idx_chapters_issue ON chapters(issue_id);
CREATE INDEX IF NOT EXISTS idx_chapters_slug ON chapters(issue_id, slug);
CREATE INDEX IF NOT EXISTS idx_chapters_number ON chapters(issue_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_chapters_status ON chapters(status);
CREATE INDEX IF NOT EXISTS idx_chapters_published ON chapters(published_at) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_chapters_search ON chapters USING gin(to_tsvector('english', title || ' ' || plain_content));

-- =====================================================
-- ENSURE RLS IS ENABLED AND POLICIES EXIST
-- =====================================================

-- Enable RLS
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them fresh
DROP POLICY IF EXISTS "Public can view published content items" ON content_items;
DROP POLICY IF EXISTS "Authenticated can view all content items" ON content_items;
DROP POLICY IF EXISTS "Admins can manage content items" ON content_items;
DROP POLICY IF EXISTS "Content creators can manage their content" ON content_items;

DROP POLICY IF EXISTS "Public can view published chapters" ON chapters;
DROP POLICY IF EXISTS "Authenticated can view all chapters" ON chapters;
DROP POLICY IF EXISTS "Admins can manage chapters" ON chapters;
DROP POLICY IF EXISTS "Content creators can manage their chapters" ON chapters;

-- Content Items Policies
CREATE POLICY "Public can view published content items" ON content_items
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated can view all content items" ON content_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage content items" ON content_items
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Content creators can manage their content" ON content_items
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'author')
        )
        OR metadata->>'created_by' = auth.uid()::text
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
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Content creators can manage their chapters" ON chapters
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'author')
        )
        OR metadata->>'created_by' = auth.uid()::text
    );

-- =====================================================
-- ENSURE UPDATED_AT TRIGGERS EXIST
-- =====================================================

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers (these are idempotent)
DROP TRIGGER IF EXISTS update_content_items_updated_at ON content_items;
CREATE TRIGGER update_content_items_updated_at
    BEFORE UPDATE ON content_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chapters_updated_at ON chapters;
CREATE TRIGGER update_chapters_updated_at
    BEFORE UPDATE ON chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ENSURE SAMPLE DATA EXISTS FOR TESTING
-- =====================================================

-- Insert sample content items if they don't exist
INSERT INTO content_items (id, type, title, slug, description, cover_image_url, status, published_at, completion_percentage, average_rating, rating_count, metadata) 
VALUES (
    '00000000-0000-0000-0000-000000000001', 
    'book', 
    'The Chronicles of Ahura', 
    'chronicles-of-ahura', 
    'The epic tale of light versus darkness in ancient Persia', 
    '/covers/chronicles-book.jpg', 
    'published', 
    '2025-01-15T00:00:00Z', 
    45, 
    4.8, 
    127, 
    '{"total_volumes": 3, "estimated_read_time": 1440}'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) 
VALUES (
    '00000000-0000-0000-0000-000000000002', 
    'volume', 
    'Volume I: The Awakening', 
    'volume-1-awakening', 
    'The beginning of the great journey', 
    '00000000-0000-0000-0000-000000000001', 
    1, 
    'published', 
    '2025-01-15T00:00:00Z', 
    75, 
    4.9, 
    89, 
    '{"total_sagas": 2, "estimated_read_time": 480}'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) 
VALUES (
    '00000000-0000-0000-0000-000000000003', 
    'saga', 
    'The Fire Temple Saga', 
    'fire-temple-saga', 
    'The discovery of the ancient fire temple', 
    '00000000-0000-0000-0000-000000000002', 
    1, 
    'published', 
    '2025-01-20T00:00:00Z', 
    100, 
    4.7, 
    64, 
    '{"total_arcs": 3, "estimated_read_time": 240}'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) 
VALUES (
    '00000000-0000-0000-0000-000000000004', 
    'arc', 
    'The First Trial Arc', 
    'first-trial-arc', 
    'The protagonist faces their first major challenge', 
    '00000000-0000-0000-0000-000000000003', 
    1, 
    'published', 
    '2025-02-01T00:00:00Z', 
    100, 
    4.6, 
    45, 
    '{"total_issues": 4, "estimated_read_time": 120}'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) 
VALUES (
    '00000000-0000-0000-0000-000000000005', 
    'issue', 
    'Issue #1: The Calling', 
    'issue-1-the-calling', 
    'The journey begins with a mysterious calling', 
    '00000000-0000-0000-0000-000000000004', 
    1, 
    'published', 
    '2025-02-10T00:00:00Z', 
    75, 
    4.8, 
    32, 
    '{"chapter_count": 4, "estimated_read_time": 30}'
)
ON CONFLICT (id) DO NOTHING;

-- Add a second issue for testing
INSERT INTO content_items (id, type, title, slug, description, parent_id, order_index, status, published_at, completion_percentage, average_rating, rating_count, metadata) 
VALUES (
    '00000000-0000-0000-0000-000000000006', 
    'issue', 
    'Issue #2: The Journey Begins', 
    'issue-2-journey-begins', 
    'The protagonist sets out on their epic journey', 
    '00000000-0000-0000-0000-000000000004', 
    2, 
    'published', 
    '2025-02-15T00:00:00Z', 
    50, 
    4.7, 
    28, 
    '{"chapter_count": 3, "estimated_read_time": 25}'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON content_items TO authenticated;
GRANT SELECT ON chapters TO authenticated;
GRANT INSERT, UPDATE, DELETE ON content_items TO authenticated;
GRANT INSERT, UPDATE, DELETE ON chapters TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- CREATE UTILITY FUNCTIONS FOR DEBUGGING
-- =====================================================

-- Function to check chapter creation readiness
CREATE OR REPLACE FUNCTION check_chapter_creation_readiness()
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Check if content_items table exists
    RETURN QUERY SELECT 
        'content_items_table'::TEXT,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'content_items') 
             THEN 'OK' ELSE 'MISSING' END::TEXT,
        'Content items table for hierarchical structure'::TEXT;
    
    -- Check if chapters table exists
    RETURN QUERY SELECT 
        'chapters_table'::TEXT,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chapters') 
             THEN 'OK' ELSE 'MISSING' END::TEXT,
        'Chapters table for storing chapter content'::TEXT;
    
    -- Check if required enums exist
    RETURN QUERY SELECT 
        'content_item_type_enum'::TEXT,
        CASE WHEN EXISTS (SELECT FROM pg_type WHERE typname = 'content_item_type') 
             THEN 'OK' ELSE 'MISSING' END::TEXT,
        'Enum for content item types (book, volume, saga, arc, issue)'::TEXT;
    
    RETURN QUERY SELECT 
        'chapter_status_enum'::TEXT,
        CASE WHEN EXISTS (SELECT FROM pg_type WHERE typname = 'chapter_status') 
             THEN 'OK' ELSE 'MISSING' END::TEXT,
        'Enum for chapter status (draft, published, etc.)'::TEXT;
    
    -- Check if issues exist
    RETURN QUERY SELECT 
        'available_issues'::TEXT,
        CASE WHEN EXISTS (SELECT FROM content_items WHERE type = 'issue' AND status = 'published') 
             THEN 'OK' ELSE 'MISSING' END::TEXT,
        ('Found ' || COALESCE((SELECT COUNT(*)::TEXT FROM content_items WHERE type = 'issue' AND status = 'published'), '0') || ' published issues')::TEXT;
    
    -- Check RLS policies
    RETURN QUERY SELECT 
        'chapter_policies'::TEXT,
        CASE WHEN EXISTS (SELECT FROM pg_policies WHERE tablename = 'chapters') 
             THEN 'OK' ELSE 'MISSING' END::TEXT,
        'Row Level Security policies for chapters table'::TEXT;
        
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
    -- Try to insert a test chapter
    BEGIN
        INSERT INTO chapters (
            issue_id,
            title,
            slug,
            chapter_number,
            content,
            plain_content,
            word_count,
            estimated_read_time,
            status,
            metadata
        ) VALUES (
            p_issue_id,
            p_title,
            lower(replace(p_title, ' ', '-')),
            999, -- Use high number to avoid conflicts
            '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "This is a test chapter."}]}]}',
            'This is a test chapter.',
            5,
            1,
            'draft',
            '{"test": true}'
        )
        RETURNING id INTO v_chapter_id;
        
        -- If we got here, it worked
        RETURN QUERY SELECT true, 'Chapter created successfully'::TEXT, v_chapter_id;
        
        -- Clean up test data
        DELETE FROM chapters WHERE id = v_chapter_id;
        
    EXCEPTION WHEN OTHERS THEN
        -- Return the error
        RETURN QUERY SELECT false, SQLERRM::TEXT, NULL::UUID;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FINAL VERIFICATION
-- =====================================================

-- Run a quick check and log results
DO $$
DECLARE
    check_result RECORD;
BEGIN
    RAISE NOTICE '=== CHAPTER CREATION SCHEMA FIX COMPLETE ===';
    
    -- Run readiness check
    FOR check_result IN SELECT * FROM check_chapter_creation_readiness() LOOP
        RAISE NOTICE '%: % - %', check_result.check_name, check_result.status, check_result.details;
    END LOOP;
    
    RAISE NOTICE '=== END VERIFICATION ===';
END;
$$;

-- Add final comment
COMMENT ON TABLE content_items IS 'Hierarchical content structure: BOOKS → VOLUMES → SAGAS → ARCS → ISSUES. Fixed chapter creation schema 2025-09-20';
COMMENT ON TABLE chapters IS 'Chapter content linked to issues. Supports rich text content. Fixed chapter creation schema 2025-09-20';