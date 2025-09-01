-- ==============================================================================
-- ADD MISSING FRONTEND TABLES MIGRATION
-- ==============================================================================
-- This migration adds the tables that the frontend code expects but are
-- missing from the unified schema
-- ==============================================================================

-- Homepage content table (for homepage sections)
CREATE TABLE IF NOT EXISTS public.homepage_content (
    id bigserial PRIMARY KEY,
    title text,
    content text NOT NULL,
    section text NOT NULL, -- 'hero', 'about', 'features', etc.
    order_position integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Release items table (for release announcements)
CREATE TABLE IF NOT EXISTS public.release_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    type text NOT NULL, -- 'chapter', 'book', 'announcement', etc.
    status text DEFAULT 'available',
    description text,
    link text, -- Link to the content or announcement
    release_date date NOT NULL,
    is_featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Posts table (for blog posts and news)
CREATE TABLE IF NOT EXISTS public.posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text,
    excerpt text,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured boolean DEFAULT false,
    tags text[] DEFAULT '{}',
    
    -- SEO
    seo_title text,
    seo_description text,
    
    -- Statistics
    views integer DEFAULT 0,
    
    -- Dates
    published_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Daily spins table (for the prophecy spinner feature)
CREATE TABLE IF NOT EXISTS public.daily_spins (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    spin_date date NOT NULL,
    spin_count integer DEFAULT 0 NOT NULL,
    last_spin_at timestamptz,
    PRIMARY KEY (user_id, spin_date)
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_homepage_content_section ON public.homepage_content(section);
CREATE INDEX IF NOT EXISTS idx_homepage_content_active ON public.homepage_content(is_active);

CREATE INDEX IF NOT EXISTS idx_release_items_date ON public.release_items(release_date);
CREATE INDEX IF NOT EXISTS idx_release_items_featured ON public.release_items(is_featured);

CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at);

CREATE INDEX IF NOT EXISTS idx_daily_spins_date ON public.daily_spins(spin_date);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Homepage content (public read, admin write)
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Homepage content viewable by everyone" ON public.homepage_content;
CREATE POLICY "Homepage content viewable by everyone" ON public.homepage_content 
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage homepage content" ON public.homepage_content;
CREATE POLICY "Admins can manage homepage content" ON public.homepage_content 
    FOR ALL USING (public.is_admin(auth.uid()));

-- Release items (public read, admin write)
ALTER TABLE public.release_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Release items viewable by everyone" ON public.release_items;
CREATE POLICY "Release items viewable by everyone" ON public.release_items 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage release items" ON public.release_items;
CREATE POLICY "Admins can manage release items" ON public.release_items 
    FOR ALL USING (public.is_admin(auth.uid()));

-- Posts (public read for published, admin/author write)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published posts viewable by everyone" ON public.posts;
CREATE POLICY "Published posts viewable by everyone" ON public.posts 
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Authors can manage their own posts" ON public.posts;
CREATE POLICY "Authors can manage their own posts" ON public.posts 
    FOR ALL USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
CREATE POLICY "Admins can manage all posts" ON public.posts 
    FOR ALL USING (public.is_admin(auth.uid()));

-- Daily spins (users can only access their own)
ALTER TABLE public.daily_spins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own spins" ON public.daily_spins;
CREATE POLICY "Users can view their own spins" ON public.daily_spins 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own spins" ON public.daily_spins;
CREATE POLICY "Users can manage their own spins" ON public.daily_spins 
    FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- TRIGGERS
-- ==============================================================================

-- Update timestamps
CREATE TRIGGER update_homepage_content_updated_at 
    BEFORE UPDATE ON public.homepage_content 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_release_items_updated_at 
    BEFORE UPDATE ON public.release_items 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON public.posts 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- SAMPLE DATA
-- ==============================================================================

-- Sample homepage content
INSERT INTO public.homepage_content (title, content, section, order_position) VALUES 
('Welcome to Zoroasterverse', 'Experience the epic saga of cosmic proportions', 'hero', 1),
('About the Universe', 'Dive into a world where ancient wisdom meets modern storytelling', 'about', 2),
('Latest Updates', 'Stay up to date with the latest releases and announcements', 'updates', 3)
ON CONFLICT DO NOTHING;

-- Sample release items
INSERT INTO public.release_items (title, type, description, release_date, link) VALUES 
('Welcome Chapter Available', 'chapter', 'The first chapter of our epic journey is now live', CURRENT_DATE, '/read/1'),
('Character Profiles Updated', 'announcement', 'New character profiles added to the wiki', CURRENT_DATE - INTERVAL '1 day', '/wiki/characters'),
('Beta Reader Program Open', 'announcement', 'Applications now open for beta readers', CURRENT_DATE - INTERVAL '2 days', '/beta/application')
ON CONFLICT DO NOTHING;

-- Sample blog posts
INSERT INTO public.posts (author_id, title, slug, content, excerpt, status, published_at) 
SELECT 
    (SELECT id FROM auth.users LIMIT 1), -- Use first available user, or this will be NULL
    'Welcome to Zoroasterverse',
    'welcome-to-zoroasterverse',
    'Welcome to the official Zoroasterverse website! Here you''ll find epic stories, rich lore, and an engaged community of readers.',
    'Welcome to the official Zoroasterverse website! Discover epic stories and rich lore.',
    'published',
    now() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM auth.users)
ON CONFLICT (slug) DO NOTHING;

-- Note: daily_spins will be populated when users actually use the spinner
