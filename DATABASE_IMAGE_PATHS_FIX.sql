-- 🗄️ DATABASE FIX: Update null/empty image paths with proper fallback images
-- This resolves the getSafeImageUrl warnings and MediaPicker display issues

-- ============================================================================
-- PART 1: Fix Character Images
-- ============================================================================

-- First, let's see what we have
SELECT 'BEFORE CHARACTER UPDATE:' as status;
SELECT 
  COUNT(*) as total_characters,
  COUNT(image_path) as with_image_path,
  COUNT(*) - COUNT(image_path) as missing_image_path
FROM characters;

-- List characters with null/empty image paths
SELECT name, image_path 
FROM characters 
WHERE image_path IS NULL OR image_path = '' OR TRIM(image_path) = '';

-- Update characters with missing image paths
UPDATE characters 
SET image_path = 'characters/default-character.jpg'
WHERE image_path IS NULL OR image_path = '' OR TRIM(image_path) = '';

-- Verify character update
SELECT 'AFTER CHARACTER UPDATE:' as status;
SELECT 
  COUNT(*) as total_characters,
  COUNT(image_path) as with_image_path,
  COUNT(*) - COUNT(image_path) as missing_image_path
FROM characters;

-- ============================================================================
-- PART 2: Fix Blog Post Images  
-- ============================================================================

-- Check blog post images before update
SELECT 'BEFORE BLOG POST UPDATE:' as status;
SELECT 
  COUNT(*) as total_blog_posts,
  COUNT(featured_image) as with_featured_image,
  COUNT(*) - COUNT(featured_image) as missing_featured_image
FROM blog_posts;

-- Update blog posts with missing featured images
UPDATE blog_posts 
SET featured_image = 'blog/default-blog-cover.jpg'
WHERE featured_image IS NULL OR featured_image = '' OR TRIM(featured_image) = '';

-- Also update cover_url if it exists and is empty
UPDATE blog_posts 
SET cover_url = 'blog/default-blog-cover.jpg'
WHERE cover_url IS NULL OR cover_url = '' OR TRIM(cover_url) = '';

-- Verify blog post update
SELECT 'AFTER BLOG POST UPDATE:' as status;
SELECT 
  COUNT(*) as total_blog_posts,
  COUNT(featured_image) as with_featured_image,
  COUNT(cover_url) as with_cover_url,
  COUNT(*) - COUNT(featured_image) as missing_featured_image
FROM blog_posts;

-- ============================================================================
-- PART 3: Fix Files Table (if exists)
-- ============================================================================

-- Check if files table exists and has records without proper paths
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'files') THEN
        -- Check files with null/empty paths
        RAISE NOTICE 'BEFORE FILES UPDATE:';
        PERFORM COUNT(*) FROM files;
        
        -- Update files with missing paths (this shouldn't normally happen, but just in case)
        UPDATE files 
        SET path = COALESCE(folder || '/' || name, 'media/default-file')
        WHERE path IS NULL OR path = '' OR TRIM(path) = '';
        
        RAISE NOTICE 'FILES UPDATE COMPLETED';
    ELSE
        RAISE NOTICE 'Files table does not exist - skipping';
    END IF;
END
$$;

-- ============================================================================
-- PART 4: Final Verification
-- ============================================================================

-- Final status check
SELECT '=== FINAL STATUS CHECK ===' as status;

-- Character image status
SELECT 
  'characters' as table_name,
  COUNT(*) as total_records,
  COUNT(image_path) as with_image_path,
  COUNT(*) - COUNT(image_path) as still_missing
FROM characters
UNION ALL
-- Blog post image status  
SELECT 
  'blog_posts' as table_name,
  COUNT(*) as total_records,
  COUNT(featured_image) as with_featured_image,
  COUNT(*) - COUNT(featured_image) as still_missing
FROM blog_posts;

-- Show sample of updated records
SELECT 'SAMPLE UPDATED CHARACTERS:' as info;
SELECT name, image_path FROM characters LIMIT 10;

SELECT 'SAMPLE UPDATED BLOG POSTS:' as info;
SELECT title, featured_image FROM blog_posts LIMIT 5;

-- ============================================================================
-- PART 5: Create default image records (optional)
-- ============================================================================

-- Insert default image files if they don't exist in the files table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'files') THEN
        -- Insert default character image record if it doesn't exist
        INSERT INTO files (id, name, original_name, mime_type, size, folder, path, bucket, created_at)
        SELECT 
            gen_random_uuid(),
            'default-character.jpg',
            'default-character.jpg', 
            'image/jpeg',
            50000, -- approximate size
            'characters',
            'characters/default-character.jpg',
            'media',
            NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM files WHERE path = 'characters/default-character.jpg'
        );
        
        -- Insert default blog cover image record if it doesn't exist
        INSERT INTO files (id, name, original_name, mime_type, size, folder, path, bucket, created_at)
        SELECT 
            gen_random_uuid(),
            'default-blog-cover.jpg',
            'default-blog-cover.jpg',
            'image/jpeg', 
            75000, -- approximate size
            'blog',
            'blog/default-blog-cover.jpg',
            'media',
            NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM files WHERE path = 'blog/default-blog-cover.jpg'
        );
        
        RAISE NOTICE 'Default image records created/verified';
    END IF;
END
$$;

SELECT '🎉 DATABASE IMAGE PATH FIX COMPLETED! 🎉' as success_message;
SELECT 'All null/empty image paths have been updated with proper fallback images.' as details;
SELECT 'The getSafeImageUrl warnings should now be resolved.' as expected_result;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================================

/*
IF YOU NEED TO ROLLBACK THESE CHANGES:

-- Rollback character updates
UPDATE characters 
SET image_path = NULL 
WHERE image_path = 'characters/default-character.jpg';

-- Rollback blog post updates
UPDATE blog_posts 
SET featured_image = NULL 
WHERE featured_image = 'blog/default-blog-cover.jpg';

UPDATE blog_posts 
SET cover_url = NULL 
WHERE cover_url = 'blog/default-blog-cover.jpg';

-- Remove default file records (if added)
DELETE FROM files WHERE path IN (
  'characters/default-character.jpg',
  'blog/default-blog-cover.jpg'
) AND name LIKE 'default-%';
*/