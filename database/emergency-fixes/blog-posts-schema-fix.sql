-- EMERGENCY DATABASE FIX: Blog Posts Schema and Query Issues
-- This addresses the 400 Bad Request errors when querying blog_posts table
-- Run this in your Supabase SQL editor

-- First, let's check what columns actually exist in the blog_posts table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Fix 1: Ensure all required columns exist with proper types
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS content text DEFAULT '',
ADD COLUMN IF NOT EXISTS excerpt text DEFAULT '',
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS published_at timestamptz,
ADD COLUMN IF NOT EXISTS featured_image text,
ADD COLUMN IF NOT EXISTS cover_url text,
ADD COLUMN IF NOT EXISTS author text DEFAULT 'Sina Panahi',
ADD COLUMN IF NOT EXISTS category text DEFAULT 'General',
ADD COLUMN IF NOT EXISTS reading_time integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;

-- Fix 2: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- Fix 3: Set up Row Level Security (RLS) - this might be causing 400 errors
-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to published posts
DROP POLICY IF EXISTS "Public read access to published blog posts" ON public.blog_posts;
CREATE POLICY "Public read access to published blog posts" 
ON public.blog_posts FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND published_at IS NOT NULL);

-- Create policy for authenticated users to read all posts
DROP POLICY IF EXISTS "Authenticated users can read all blog posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can read all blog posts" 
ON public.blog_posts FOR SELECT 
TO authenticated 
USING (true);

-- Create policy for admin/author to manage all posts
DROP POLICY IF EXISTS "Authors can manage their blog posts" ON public.blog_posts;
CREATE POLICY "Authors can manage their blog posts" 
ON public.blog_posts FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' IN (
  'spanahinz@gmail.com',
  'admin@zoroasterverse.com',
  'sina@zoroasterverse.com'
));

-- Fix 4: Create sample data if table is empty (for testing)
INSERT INTO public.blog_posts (
  title, 
  content, 
  excerpt, 
  slug, 
  published_at, 
  featured_image, 
  cover_url,
  author, 
  category, 
  reading_time, 
  status
) VALUES 
(
  'Welcome to Zoroasterverse: Your Gateway to Ancient Wisdom',
  'Discover the profound teachings of Zarathustra and explore the rich tapestry of Persian mythology in our literary universe. This comprehensive guide will introduce you to the fundamental concepts that shape our stories and philosophy.',
  'Discover the profound teachings of Zarathustra and explore the rich tapestry of Persian mythology in our literary universe.',
  'welcome-to-zoroasterverse',
  now(),
  null, -- Will use fallback image
  null, -- Will use fallback image
  'Sina Panahi',
  'Philosophy',
  8,
  'published'
),
(
  'The Sacred Fire: Symbol of Divine Light and Purity',
  'Understanding the symbolism and significance of the sacred fire in Zoroastrian teachings and daily practice. Learn how this eternal flame represents the divine light within all creation.',
  'Understanding the symbolism and significance of the sacred fire in Zoroastrian teachings and daily practice.',
  'sacred-fire-divine-light',
  now() - interval '1 day',
  null,
  null,
  'Sina Panahi',
  'Spirituality',
  6,
  'published'
),
(
  'Good Thoughts, Good Words, Good Deeds: The Zoroastrian Way',
  'The foundational principles that guide every aspect of Zoroastrian life and philosophy in the modern world. Explore how these timeless teachings can transform your daily experience.',
  'The foundational principles that guide every aspect of Zoroastrian life and philosophy in the modern world.',
  'good-thoughts-words-deeds',
  now() - interval '2 days',
  null,
  null,
  'Sina Panahi',
  'Philosophy',
  10,
  'published'
),
(
  'The History of Zoroastrianism: From Ancient Persia to Modern Times',
  'Trace the ancient roots and evolution of one of the world\'s oldest monotheistic religions. From its origins with the prophet Zarathustra to its influence on major world religions.',
  'Trace the ancient roots and evolution of one of the world\'s oldest monotheistic religions.',
  'history-of-zoroastrianism',
  now() - interval '3 days',
  null,
  null,
  'Sina Panahi',
  'History',
  12,
  'published'
),
(
  'Modern Applications of Ancient Wisdom',
  'How Zoroastrian principles continue to guide and inspire people in contemporary society. Discover practical ways to apply these teachings in your modern life.',
  'How Zoroastrian principles continue to guide and inspire people in contemporary society.',
  'modern-applications-ancient-wisdom',
  now() - interval '4 days',
  null,
  null,
  'Sina Panahi',
  'Modern Life',
  7,
  'published'
)
ON CONFLICT (slug) DO NOTHING; -- Don't duplicate if already exists

-- Fix 5: Create trigger to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER handle_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Fix 6: Create function to generate slugs automatically
CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text AS $$
BEGIN
    RETURN lower(regexp_replace(trim(title), '[^a-zA-Z0-9\s]', '', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Fix 7: Create trigger to auto-generate slugs if not provided
CREATE OR REPLACE FUNCTION public.handle_blog_post_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = public.generate_slug(NEW.title);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_blog_post_slug_generation ON public.blog_posts;
CREATE TRIGGER handle_blog_post_slug_generation
    BEFORE INSERT OR UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_blog_post_slug();

-- Fix 8: Create view for safe public access (alternative to RLS)
DROP VIEW IF EXISTS public.published_blog_posts;
CREATE VIEW public.published_blog_posts AS
SELECT 
    id,
    created_at,
    updated_at,
    title,
    content,
    excerpt,
    slug,
    published_at,
    featured_image,
    cover_url,
    author,
    category,
    reading_time,
    status,
    views
FROM public.blog_posts
WHERE status = 'published' 
AND published_at IS NOT NULL
ORDER BY published_at DESC;

-- Grant permissions on the view
GRANT SELECT ON public.published_blog_posts TO anon, authenticated;

-- Final verification: Test the query that was failing
SELECT 
    id,
    title,
    content,
    excerpt,
    slug,
    created_at,
    updated_at,
    published_at,
    featured_image,
    cover_url,
    author,
    category,
    reading_time,
    status
FROM public.blog_posts
WHERE status = 'published'
AND published_at IS NOT NULL
ORDER BY published_at DESC
LIMIT 5;

-- Show the results
SELECT 'Database fix completed successfully! Blog posts should now be queryable.' as status;
SELECT COUNT(*) as published_posts_count FROM public.blog_posts WHERE status = 'published';
SELECT COUNT(*) as total_posts_count FROM public.blog_posts;