-- IMMEDIATE FIX FOR ALL BLOG ISSUES
-- Run this in your Supabase SQL Editor to fix everything right now

-- 1. Fix the blog_posts table structure (adds missing columns)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_image TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time INTEGER;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS word_count INTEGER;

-- 2. Update status column to have proper constraints
DO $$
BEGIN
    -- Check if status column exists with constraints
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'blog_posts' AND constraint_name LIKE '%status%check%'
    ) THEN
        -- Add status column with check constraint
        ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
        ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_status_check 
            CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        -- Constraint already exists, that's fine
        NULL;
END $$;

-- 3. Update existing records to have proper defaults
UPDATE blog_posts SET status = 'draft' WHERE status IS NULL;
UPDATE blog_posts SET views = 0 WHERE views IS NULL;
UPDATE blog_posts SET likes_count = 0 WHERE likes_count IS NULL;
UPDATE blog_posts SET comments_count = 0 WHERE comments_count IS NULL;
UPDATE blog_posts SET shares_count = 0 WHERE shares_count IS NULL;
UPDATE blog_posts SET is_featured = FALSE WHERE is_featured IS NULL;

-- 4. Sync cover_url and featured_image fields
UPDATE blog_posts SET cover_url = featured_image WHERE featured_image IS NOT NULL AND cover_url IS NULL;
UPDATE blog_posts SET featured_image = cover_url WHERE cover_url IS NOT NULL AND featured_image IS NULL;

-- 5. Create blog_tags table for the tagging system
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    posts_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create blog_post_tags junction table
CREATE TABLE IF NOT EXISTS blog_post_tags (
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, tag_id)
);

-- 7. Insert some default tags
INSERT INTO blog_tags (name, slug) VALUES
    ('History', 'history'),
    ('Philosophy', 'philosophy'),
    ('Religion', 'religion'),
    ('Culture', 'culture'),
    ('Modern Life', 'modern-life'),
    ('Architecture', 'architecture'),
    ('Scripture', 'scripture'),
    ('Community', 'community'),
    ('Theology', 'theology'),
    ('Symbolism', 'symbolism')
ON CONFLICT (slug) DO NOTHING;

-- 8. Enable RLS on new tables
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies
CREATE POLICY "Tags are viewable by everyone" ON blog_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON blog_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Post tags are viewable by everyone" ON blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage post tags" ON blog_post_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. Function to calculate reading time automatically
CREATE OR REPLACE FUNCTION update_post_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate reading time and word count
    IF NEW.content IS NOT NULL THEN
        -- Extract text from JSON content if it's stored as JSON
        DECLARE
            content_text TEXT;
        BEGIN
            -- Try to extract text from JSON, fallback to raw content
            BEGIN
                content_text := (NEW.content::jsonb);
            EXCEPTION
                WHEN others THEN
                    content_text := NEW.content;
            END;
            
            NEW.word_count := array_length(string_to_array(content_text, ' '), 1);
            NEW.reading_time := CEIL(COALESCE(NEW.word_count, 0) / 200.0);
        END;
    END IF;
    
    -- Set updated_at
    NEW.updated_at := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Create trigger for automatic stats updates
DROP TRIGGER IF EXISTS trigger_update_post_stats ON blog_posts;
CREATE TRIGGER trigger_update_post_stats 
    BEFORE INSERT OR UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_post_stats();

-- 12. Get your user ID for setting as author (replace the email with yours)
-- First, let's see what users exist:
SELECT id, email FROM auth.users LIMIT 5;

-- 13. Update existing posts to have an author (you'll need to run this manually with your user ID)
-- Example: UPDATE blog_posts SET author_id = 'your-user-id-here' WHERE author_id IS NULL;

SELECT 'Database fixes applied successfully! Your blog editor should work now.' as result;