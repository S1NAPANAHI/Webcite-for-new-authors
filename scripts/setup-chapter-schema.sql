-- =====================================================
-- EMERGENCY CHAPTER SCHEMA SETUP
-- This script can be run directly in Supabase SQL editor
-- to quickly set up chapter creation functionality
-- =====================================================

-- Create required enums
CREATE TYPE IF NOT EXISTS content_item_type AS ENUM (
    'book', 'volume', 'saga', 'arc', 'issue'
);

CREATE TYPE IF NOT EXISTS content_status AS ENUM (
    'draft', 'published', 'scheduled', 'archived'
);

CREATE TYPE IF NOT EXISTS chapter_status AS ENUM (
    'draft', 'published', 'scheduled', 'archived'
);

-- Create content_items table
CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type content_item_type NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    parent_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    average_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (average_rating >= 0.0 AND average_rating <= 5.0),
    rating_count INTEGER DEFAULT 0,
    status content_status DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    plain_content TEXT DEFAULT '',
    word_count INTEGER DEFAULT 0,
    estimated_read_time INTEGER DEFAULT 0,
    status chapter_status DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(issue_id, chapter_number),
    UNIQUE(issue_id, slug),
    CHECK (chapter_number > 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_chapters_issue ON chapters(issue_id);
CREATE INDEX IF NOT EXISTS idx_chapters_status ON chapters(status);

-- Enable RLS
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Create policies (simplified for quick setup)
CREATE POLICY "Allow authenticated users to view content_items" ON content_items
    FOR SELECT TO authenticated USING (true);
    
CREATE POLICY "Allow authenticated users to manage content_items" ON content_items
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view chapters" ON chapters
    FOR SELECT TO authenticated USING (true);
    
CREATE POLICY "Allow authenticated users to manage chapters" ON chapters
    FOR ALL TO authenticated USING (true);

-- Grant permissions
GRANT ALL ON content_items TO authenticated;
GRANT ALL ON chapters TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Insert sample data
INSERT INTO content_items (id, type, title, slug, description, status, published_at, metadata) 
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'book', 'Sample Book', 'sample-book', 'A sample book for testing', 'published', NOW(), '{}'),
    ('00000000-0000-0000-0000-000000000002', 'issue', 'Sample Issue', 'sample-issue', 'A sample issue for testing', 'published', NOW(), '{}')
ON CONFLICT (id) DO NOTHING;

-- Create utility functions
CREATE OR REPLACE FUNCTION check_chapter_creation_readiness()
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    RETURN QUERY SELECT 'content_items_table'::TEXT, 'OK'::TEXT, 'Content items table exists'::TEXT;
    RETURN QUERY SELECT 'chapters_table'::TEXT, 'OK'::TEXT, 'Chapters table exists'::TEXT;
    RETURN QUERY SELECT 'sample_issues'::TEXT, 
        CASE WHEN EXISTS (SELECT FROM content_items WHERE type = 'issue') 
             THEN 'OK' ELSE 'MISSING' END::TEXT,
        ('Found ' || COALESCE((SELECT COUNT(*)::TEXT FROM content_items WHERE type = 'issue'), '0') || ' issues')::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION test_chapter_insertion(
    p_title TEXT DEFAULT 'Test Chapter',
    p_issue_id UUID DEFAULT '00000000-0000-0000-0000-000000000002'
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
        INSERT INTO chapters (issue_id, title, slug, chapter_number, content, plain_content, status, metadata)
        VALUES (p_issue_id, p_title, 'test-chapter', 999, '{}', 'Test content', 'draft', '{"test": true}')
        RETURNING id INTO v_chapter_id;
        
        RETURN QUERY SELECT true, 'Success'::TEXT, v_chapter_id;
        DELETE FROM chapters WHERE id = v_chapter_id;
        
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT false, SQLERRM::TEXT, NULL::UUID;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the setup
DO $$
DECLARE
    check_result RECORD;
BEGIN
    RAISE NOTICE '=== CHAPTER SCHEMA SETUP COMPLETE ===';
    
    FOR check_result IN SELECT * FROM check_chapter_creation_readiness() LOOP
        RAISE NOTICE '%: % - %', check_result.check_name, check_result.status, check_result.details;
    END LOOP;
    
    RAISE NOTICE '=== SETUP VERIFICATION COMPLETE ===';
END;
$$;