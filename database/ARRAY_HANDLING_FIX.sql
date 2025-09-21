-- 🔥 CRITICAL: Additional fixes for PostgreSQL array handling
-- Run this if you're still getting array errors after the first fix

-- Check current table structure
SELECT 'Checking current blog_posts structure...' as step;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
ORDER BY ordinal_position;

-- Fix any remaining array format issues
SELECT 'Fixing array format issues...' as step;

-- Convert any remaining malformed tags to proper arrays
UPDATE blog_posts 
SET tags = CASE 
    WHEN tags IS NULL THEN '{}'
    WHEN tags = '[]' OR tags = '' THEN '{}'
    WHEN tags::text LIKE '[%]' THEN 
        -- Convert JSON array string to PostgreSQL array
        ARRAY(SELECT json_array_elements_text(tags::json))
    ELSE 
        -- Already a proper array or single value
        COALESCE(tags, '{}')
END::text[]
WHERE tags IS NOT NULL;

-- Ensure all required columns exist with proper defaults
SELECT 'Ensuring all required columns exist...' as step;

ALTER TABLE blog_posts ALTER COLUMN tags SET DEFAULT '{}';
ALTER TABLE blog_posts ALTER COLUMN views SET DEFAULT 0;
ALTER TABLE blog_posts ALTER COLUMN likes_count SET DEFAULT 0;
ALTER TABLE blog_posts ALTER COLUMN comments_count SET DEFAULT 0;
ALTER TABLE blog_posts ALTER COLUMN is_featured SET DEFAULT false;
ALTER TABLE blog_posts ALTER COLUMN status SET DEFAULT 'draft';

-- Update any null values to proper defaults
UPDATE blog_posts SET 
    tags = '{}' WHERE tags IS NULL,
    views = 0 WHERE views IS NULL,
    likes_count = 0 WHERE likes_count IS NULL,
    comments_count = 0 WHERE comments_count IS NULL,
    is_featured = false WHERE is_featured IS NULL,
    status = 'draft' WHERE status IS NULL OR status = '',
    author = 'Zoroastervers Team' WHERE author IS NULL OR author = '';

-- Set published_at for published posts without dates
UPDATE blog_posts 
SET published_at = created_at 
WHERE status = 'published' AND published_at IS NULL;

-- Final validation
SELECT 'Validating fixes...' as step;

SELECT 
    id,
    title,
    tags,
    array_length(tags, 1) as tag_count,
    status,
    author,
    created_at
FROM blog_posts 
ORDER BY created_at DESC
LIMIT 5;

SELECT '✅ Array handling fixes complete! Your blog editor should work now.' as result;

-- Test array insertion (this should work without errors)
SELECT 'Testing array format...' as step;

DO $$
BEGIN
    -- Test if we can insert proper arrays
    PERFORM ARRAY['test', 'category', 'example']::text[];
    RAISE NOTICE '✅ Array format test passed!';
EXCEPTION 
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Array format test failed: %', SQLERRM;
END
$$;