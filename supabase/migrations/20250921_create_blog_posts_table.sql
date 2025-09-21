-- Create blog_posts table for Latest News & Updates homepage section
-- Migration: 20250921_create_blog_posts_table.sql

-- Create blog_posts table with all necessary fields
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    cover_url TEXT, -- Alternative field name support
    author TEXT DEFAULT 'Zoroasterverse Team',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    category TEXT DEFAULT 'News',
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    word_count INTEGER,
    reading_time INTEGER,
    meta_title TEXT,
    meta_description TEXT,
    social_image TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access and authenticated write access
CREATE POLICY "Blog posts are viewable by everyone" ON public.blog_posts 
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage blog posts" ON public.blog_posts 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON public.blog_posts(is_featured);

-- Function to calculate reading time and word count
CREATE OR REPLACE FUNCTION update_post_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate word count
    NEW.word_count := array_length(string_to_array(trim(NEW.content), ' '), 1);
    
    -- Calculate reading time (average 200 words per minute)
    NEW.reading_time := GREATEST(CEIL(NEW.word_count / 200.0), 1);
    
    -- Auto-generate excerpt if not provided
    IF NEW.excerpt IS NULL OR trim(NEW.excerpt) = '' THEN
        NEW.excerpt := LEFT(regexp_replace(NEW.content, '<[^>]*>', '', 'g'), 160) || '...';
    END IF;
    
    -- Auto-generate slug if not provided
    IF NEW.slug IS NULL OR trim(NEW.slug) = '' THEN
        NEW.slug := lower(regexp_replace(regexp_replace(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
    END IF;
    
    -- Set published_at if status changed to published and not already set
    IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') AND NEW.published_at IS NULL THEN
        NEW.published_at := NOW();
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic metadata updates
DROP TRIGGER IF EXISTS trigger_update_post_metadata ON public.blog_posts;
CREATE TRIGGER trigger_update_post_metadata
    BEFORE INSERT OR UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_post_metadata();

-- Insert sample blog posts for testing the homepage slider
INSERT INTO public.blog_posts (
    title, 
    content, 
    excerpt,
    featured_image, 
    author, 
    status, 
    is_featured, 
    category,
    tags
) VALUES 
(
    'The Ancient Wisdom of Zoroaster: A Journey Through Time',
    'The teachings of Zoroaster have shaped civilizations for over 3,000 years. In this comprehensive exploration, we delve into the core principles of Zoroastrianism and examine how these ancient beliefs continue to influence modern thought and spirituality. From the concept of cosmic dualism between good and evil to the emphasis on personal choice and moral responsibility, Zoroastrian philosophy offers profound insights into the human condition and our relationship with the divine.',
    'Explore the profound teachings of Zoroaster and their relevance in modern times. Discover how ancient wisdom shapes our understanding of good versus evil.',
    '/api/placeholder/1200/600',
    'Dr. Sarah Mirza',
    'published',
    true,
    'Philosophy',
    '{Philosophy, Religion, History}'
),
(
    'Fire Temples: Sacred Architecture of the Zoroastrian Faith',
    'Fire temples represent the heart of Zoroastrian worship. These sacred structures, with their eternal flames, tell stories of devotion, community, and architectural brilliance spanning millennia. From the great Atash Bahram temples to smaller community fire temples, each structure reflects the deep spiritual significance of fire in Zoroastrian practice. The architecture itself speaks to centuries of cultural evolution while maintaining core sacred principles.',
    'An architectural journey through the sacred fire temples that have served as centers of worship for thousands of years.',
    '/api/placeholder/1200/600',
    'Prof. Jamshid Rostami',
    'published',
    false,
    'Architecture',
    '{Architecture, Sacred Sites, Culture}'
),
(
    'The Gathas: Poetry of Divine Inspiration',
    'The Gathas represent the oldest part of the Avesta and contain the direct words of Zoroaster. These seventeen hymns offer profound insights into the prophet''s teachings and relationship with Ahura Mazda. Written in an ancient form of Avestan, the Gathas combine theological depth with poetic beauty, creating verses that have inspired believers for millennia. Each hymn reveals layers of meaning about truth, righteousness, and the cosmic order.',
    'Dive into the beautiful hymns composed by Zoroaster himself, exploring their poetic structure and spiritual significance.',
    '/api/placeholder/1200/600',
    'Dr. Farah Kermani',
    'published',
    false,
    'Scripture',
    '{Scripture, Poetry, Theology}'
),
(
    'Modern Zoroastrian Communities Around the World',
    'From Mumbai to Toronto, London to Tehran, Zoroastrian communities continue to thrive while preserving their ancient heritage. This article explores how modern Zoroastrians navigate tradition and contemporary life, maintaining religious practices while adapting to global contexts. We examine community organizations, cultural preservation efforts, and the challenges of maintaining a minority religion in diverse societies.',
    'Meet the vibrant Zoroastrian communities that keep ancient traditions alive in our modern world.',
    '/api/placeholder/1200/600',
    'Reza Dalal',
    'published',
    false,
    'Community',
    '{Community, Modern Life, Global}'
),
(
    'The Symbolism of Light and Darkness in Zoroastrian Thought',
    'The eternal struggle between light and darkness, good and evil, forms the foundation of Zoroastrian thought. This exploration examines how this dualistic worldview has influenced major world religions and philosophical systems. The symbolism extends beyond simple opposition to encompass concepts of truth versus falsehood, order versus chaos, and the cosmic battle between creative and destructive forces.',
    'Understanding the fundamental dualism that forms the core of Zoroastrian theology and its impact on world religions.',
    '/api/placeholder/1200/600',
    'Prof. Cyrus Bahram',
    'published',
    false,
    'Theology',
    '{Theology, Symbolism, Philosophy}'
)
ON CONFLICT (slug) DO NOTHING;