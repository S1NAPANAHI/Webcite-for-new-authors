-- ✅ CORRECTED DATABASE FIX: Update null/empty image paths with proper fallback images
-- This resolves the getSafeImageUrl warnings and MediaPicker display issues
-- CORRECTED: Using actual column names from database schema

-- ============================================================================
-- PART 1: Fix Character Images (CORRECTED COLUMN NAMES)
-- ============================================================================

-- First, let's see what we have for characters
SELECT 'BEFORE CHARACTER UPDATE - Checking actual schema:' as status;
SELECT 
  COUNT(*) as total_characters,
  COUNT(portrait_url) as with_portrait_url,
  COUNT(portrait_file_id) as with_portrait_file_id,
  COUNT(*) - COUNT(portrait_url) as missing_portrait_url,
  COUNT(*) - COUNT(portrait_file_id) as missing_portrait_file_id
FROM characters;

-- List characters with null/empty portrait_url
SELECT name, portrait_url, portrait_file_id 
FROM characters 
WHERE portrait_url IS NULL OR portrait_url = '' OR TRIM(portrait_url) = ''
LIMIT 10;

-- Update characters with missing portrait_url (the main image field)
UPDATE characters 
SET portrait_url = 'characters/default-character.jpg'
WHERE portrait_url IS NULL OR portrait_url = '' OR TRIM(portrait_url) = '';

-- Verify character update
SELECT 'AFTER CHARACTER UPDATE - portrait_url fixed:' as status;
SELECT 
  COUNT(*) as total_characters,
  COUNT(portrait_url) as with_portrait_url,
  COUNT(*) - COUNT(portrait_url) as still_missing_portrait_url
FROM characters;

-- ============================================================================
-- PART 2: Fix Blog Post Images (CONFIRMED CORRECT)
-- ============================================================================

-- Check blog post images before update
SELECT 'BEFORE BLOG POST UPDATE:' as status;
SELECT 
  COUNT(*) as total_blog_posts,
  COUNT(featured_image) as with_featured_image,
  COUNT(cover_url) as with_cover_url,
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
  COUNT(*) - COUNT(featured_image) as still_missing_featured_image
FROM blog_posts;

-- ============================================================================
-- PART 3: Fix Files Table (ensure proper paths)
-- ============================================================================

-- Check if files table has records without proper paths
SELECT 'BEFORE FILES CHECK:' as status;
SELECT 
  COUNT(*) as total_files,
  COUNT(path) as with_path,
  COUNT(storage_path) as with_storage_path,
  COUNT(*) - COUNT(path) as missing_path
FROM files;

-- Show files with missing paths (this shouldn't normally happen)
SELECT name, folder, path, storage_path 
FROM files 
WHERE path IS NULL OR path = '' OR TRIM(path) = ''
LIMIT 5;

-- Fix files with missing paths (use storage_path or construct from folder/name)
UPDATE files 
SET path = COALESCE(
  NULLIF(TRIM(storage_path), ''),
  folder || '/' || name
)
WHERE path IS NULL OR path = '' OR TRIM(path) = '';

-- ============================================================================
-- PART 4: Additional Schema Verification
-- ============================================================================

-- Check content_items table for cover images
SELECT 'CONTENT ITEMS CHECK:' as status;
SELECT 
  COUNT(*) as total_content_items,
  COUNT(cover_image_url) as with_cover_image_url,
  COUNT(cover_file_id) as with_cover_file_id
FROM content_items;

-- Update content_items with missing cover images
UPDATE content_items 
SET cover_image_url = 'content/default-content-cover.jpg'
WHERE cover_image_url IS NULL OR cover_image_url = '' OR TRIM(cover_image_url) = '';

-- ============================================================================
-- PART 5: Final Status Check
-- ============================================================================

-- Final comprehensive status check
SELECT '=== FINAL STATUS CHECK - ALL TABLES ===' as status;

-- Character image status
SELECT 
  'characters' as table_name,
  COUNT(*) as total_records,
  COUNT(portrait_url) as with_portrait_url,
  COUNT(*) - COUNT(portrait_url) as still_missing
FROM characters
UNION ALL
-- Blog post image status  
SELECT 
  'blog_posts' as table_name,
  COUNT(*) as total_records,
  COUNT(featured_image) as with_featured_image,
  COUNT(*) - COUNT(featured_image) as still_missing
FROM blog_posts
UNION ALL
-- Files status
SELECT 
  'files' as table_name,
  COUNT(*) as total_records,
  COUNT(path) as with_path,
  COUNT(*) - COUNT(path) as still_missing
FROM files
UNION ALL
-- Content items status
SELECT 
  'content_items' as table_name,
  COUNT(*) as total_records,
  COUNT(cover_image_url) as with_cover_image_url,
  COUNT(*) - COUNT(cover_image_url) as still_missing
FROM content_items;

-- Show sample of updated records
SELECT 'SAMPLE UPDATED CHARACTERS:' as info;
SELECT name, portrait_url FROM characters WHERE portrait_url LIKE '%default%' LIMIT 10;

SELECT 'SAMPLE UPDATED BLOG POSTS:' as info;
SELECT title, featured_image FROM blog_posts WHERE featured_image LIKE '%default%' LIMIT 5;

-- ============================================================================
-- PART 6: Create default image records (optional but recommended)
-- ============================================================================

-- Insert default image files if they don't exist in the files table
INSERT INTO files (
  id, 
  name, 
  original_name, 
  mime_type, 
  size, 
  folder, 
  path, 
  storage_path,
  bucket,
  type,
  created_at
)
SELECT 
  gen_random_uuid(),
  'default-character.jpg',
  'default-character.jpg', 
  'image/jpeg',
  50000, -- approximate size
  'characters',
  'characters/default-character.jpg',
  'characters/default-character.jpg',
  'media',
  'image',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM files WHERE path = 'characters/default-character.jpg'
);

-- Insert default blog cover image record if it doesn't exist
INSERT INTO files (
  id, 
  name, 
  original_name, 
  mime_type, 
  size, 
  folder, 
  path, 
  storage_path,
  bucket,
  type,
  created_at
)
SELECT 
  gen_random_uuid(),
  'default-blog-cover.jpg',
  'default-blog-cover.jpg',
  'image/jpeg', 
  75000, -- approximate size
  'blog',
  'blog/default-blog-cover.jpg',
  'blog/default-blog-cover.jpg',
  'media',
  'image',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM files WHERE path = 'blog/default-blog-cover.jpg'
);

SELECT '🎉 DATABASE IMAGE PATH FIX COMPLETED! 🎉' as success_message;
SELECT 'All null/empty image paths have been updated with proper fallback images.' as details;
SELECT 'The getSafeImageUrl warnings should now be resolved.' as expected_result;
SELECT '✅ Column names corrected: portrait_url (not image_path) for characters' as correction_note;

-- ============================================================================
-- VERIFICATION QUERIES (run these after to confirm success)
-- ============================================================================

/*
VERIFICATION QUERIES - Run these separately to confirm the fix worked:

-- 1. Check if any characters still have null portrait_url
SELECT COUNT(*) as characters_missing_portrait_url 
FROM characters 
WHERE portrait_url IS NULL OR portrait_url = '';

-- 2. Check if any blog posts still have null featured_image
SELECT COUNT(*) as blog_posts_missing_featured_image 
FROM blog_posts 
WHERE featured_image IS NULL OR featured_image = '';

-- 3. Sample characters with the default image
SELECT name, portrait_url 
FROM characters 
WHERE portrait_url = 'characters/default-character.jpg'
LIMIT 5;
*/

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================================

/*
IF YOU NEED TO ROLLBACK THESE CHANGES:

-- Rollback character updates
UPDATE characters 
SET portrait_url = NULL 
WHERE portrait_url = 'characters/default-character.jpg';

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