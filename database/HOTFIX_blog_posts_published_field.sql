-- HOTFIX: Add missing published field for backward compatibility
-- The LatestPosts component might expect a 'published' boolean field
-- but the table uses 'status' with values 'published', 'draft', 'archived'

-- Add published column as computed field for backward compatibility
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS published BOOLEAN GENERATED ALWAYS AS (status = 'published') STORED;

-- Create index on the new computed column for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);

-- Verify the fix by showing a few sample records
-- This query should now work without errors:
/*
SELECT 
    id, 
    title, 
    status, 
    published, 
    published_at,
    featured_image,
    cover_url
FROM blog_posts 
WHERE published = true 
LIMIT 3;
*/