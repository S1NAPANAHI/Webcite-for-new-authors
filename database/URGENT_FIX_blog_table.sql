-- URGENT FIX for current blog_posts table structure
-- Run this FIRST in your Supabase SQL editor to fix the immediate errors

-- Check current table structure and add missing columns
DO $$
BEGIN
    -- Add author_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'author_id') THEN
        ALTER TABLE blog_posts ADD COLUMN author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Add cover_url column if it doesn't exist (for compatibility with current frontend)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'cover_url') THEN
        ALTER TABLE blog_posts ADD COLUMN cover_url TEXT;
    END IF;
    
    -- Add other essential columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'status') THEN
        ALTER TABLE blog_posts ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'views') THEN
        ALTER TABLE blog_posts ADD COLUMN views INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'likes_count') THEN
        ALTER TABLE blog_posts ADD COLUMN likes_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'comments_count') THEN
        ALTER TABLE blog_posts ADD COLUMN comments_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'is_featured') THEN
        ALTER TABLE blog_posts ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Update existing records to have proper status if null
UPDATE blog_posts SET status = 'draft' WHERE status IS NULL;

-- Sync cover_url with featured_image if one exists but not the other
UPDATE blog_posts 
SET cover_url = featured_image 
WHERE featured_image IS NOT NULL AND cover_url IS NULL;

UPDATE blog_posts 
SET featured_image = cover_url 
WHERE cover_url IS NOT NULL AND featured_image IS NULL;

-- Set default author_id for existing posts (use your current user ID)
-- You can find your user ID by running: SELECT id FROM auth.users WHERE email = 'your_email@example.com';
-- UPDATE blog_posts SET author_id = 'your-user-id-here' WHERE author_id IS NULL;

SELECT 'Blog table structure updated successfully!' as result;