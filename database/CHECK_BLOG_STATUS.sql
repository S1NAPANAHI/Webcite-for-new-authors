-- 🔍 BLOG POSTS STATUS CHECK
-- Run this in Supabase SQL Editor to diagnose your blog issues

-- 1. Check if blog_posts table exists and its structure
SELECT 'Checking blog_posts table structure...' as step;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
ORDER BY ordinal_position;

-- 2. Check all your blog posts and their status
SELECT '📊 Checking all your blog posts...' as step;

SELECT 
    id,
    title,
    slug,
    status,
    author,
    author_id,
    published_at,
    created_at,
    CASE 
        WHEN status = 'published' THEN '✅ Will show on /blog'
        WHEN status = 'draft' THEN '⚠️ Hidden (draft)'
        ELSE '❌ Not visible'
    END as visibility
FROM blog_posts 
ORDER BY created_at DESC;

-- 3. Count posts by status
SELECT '📈 Post counts by status:' as step;

SELECT 
    status,
    COUNT(*) as count,
    CASE 
        WHEN status = 'published' THEN '✅ Visible on blog page'
        WHEN status = 'draft' THEN '⚠️ Hidden from blog page'
        ELSE '❌ Not visible on blog page'
    END as note
FROM blog_posts 
GROUP BY status;

-- 4. Check for missing required columns
SELECT '🔍 Checking for missing columns...' as step;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'author_id') 
        THEN '✅ author_id exists' 
        ELSE '❌ author_id MISSING - This causes the save error!'
    END as author_id_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'cover_url') 
        THEN '✅ cover_url exists' 
        ELSE '⚠️ cover_url missing'
    END as cover_url_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'status') 
        THEN '✅ status exists' 
        ELSE '❌ status MISSING - This causes issues!'
    END as status_column_status;

-- 5. Show posts that should appear on /blog
SELECT '🌍 Posts that should appear on /blog page:' as step;

SELECT 
    title,
    slug,
    author,
    published_at,
    views,
    '✅ This post should be visible on /blog' as note
FROM blog_posts 
WHERE status = 'published'
ORDER BY published_at DESC NULLS LAST;

-- 6. Quick fix suggestions
SELECT '🔧 QUICK FIXES:' as step;

SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') = 0
        THEN '⚠️ No published posts! Run: UPDATE blog_posts SET status = ''published'', published_at = NOW();'
        ELSE '✅ You have published posts - they should show on /blog'
    END as quick_fix_1,
    
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'author_id')
        THEN '❌ CRITICAL: Run the IMMEDIATE_FIX.sql to add missing columns!'
        ELSE '✅ Database structure looks good'
    END as quick_fix_2;

-- 7. If you want to publish all your current posts, uncomment this:
-- UPDATE blog_posts SET status = 'published', published_at = NOW() WHERE status != 'published';
-- SELECT 'All posts published! 🎉' as result;

SELECT '🏁 Diagnosis complete! Check the results above.' as final_result;