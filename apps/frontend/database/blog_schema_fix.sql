-- Fix Blog Schema to Match Existing Structure
-- Run this in your Supabase SQL editor to update the existing blog_posts table

-- First, check what columns already exist and add missing ones
-- Add missing columns to blog_posts table if they don't exist
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS social_image TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS word_count INTEGER;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_order INTEGER;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time INTEGER;

-- Update existing author field to author_id if needed
-- This assumes you want to keep the text author field for display purposes
-- and add author_id for proper foreign key relationships

-- Create the remaining tables if they don't exist
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#6366f1',
    posts_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    posts_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_post_tags (
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blog_post_id, user_id)
);

CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    reading_time INTEGER,
    scroll_percentage INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS blog_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    platform TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample categories if they don't exist
INSERT INTO blog_categories (name, slug, description, color) VALUES
    ('History', 'history', 'Historical articles about Zoroastrianism', '#f59e0b'),
    ('Philosophy', 'philosophy', 'Philosophical explorations', '#8b5cf6'),
    ('Religion', 'religion', 'Religious and spiritual content', '#10b981'),
    ('Culture', 'culture', 'Cultural insights and traditions', '#ef4444'),
    ('Modern Life', 'modern-life', 'Contemporary Zoroastrian life', '#06b6d4'),
    ('Architecture', 'architecture', 'Sacred architecture and temples', '#f97316'),
    ('Scripture', 'scripture', 'Sacred texts and interpretations', '#84cc16'),
    ('Community', 'community', 'Community stories and events', '#ec4899')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_tags (name, slug) VALUES
    ('History', 'history'),
    ('Philosophy', 'philosophy'),
    ('Religion', 'religion'),
    ('Architecture', 'architecture'),
    ('Sacred Sites', 'sacred-sites'),
    ('Culture', 'culture'),
    ('Scripture', 'scripture'),
    ('Poetry', 'poetry'),
    ('Theology', 'theology'),
    ('Community', 'community'),
    ('Modern Life', 'modern-life'),
    ('Global', 'global'),
    ('Symbolism', 'symbolism'),
    ('Festivals', 'festivals'),
    ('Traditions', 'traditions'),
    ('Gender Studies', 'gender-studies'),
    ('Leadership', 'leadership'),
    ('Language', 'language'),
    ('Literature', 'literature'),
    ('Environment', 'environment'),
    ('Ethics', 'ethics')
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS on all new tables
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_shares ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Categories are viewable by everyone" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Tags are viewable by everyone" ON blog_tags FOR SELECT USING (true);
CREATE POLICY "Post tags are viewable by everyone" ON blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Views are trackable by everyone" ON blog_views FOR INSERT USING (true);
CREATE POLICY "Views are viewable by authenticated users" ON blog_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage their own likes" ON blog_likes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Likes are viewable by everyone" ON blog_likes FOR SELECT USING (true);
CREATE POLICY "Comments are viewable by everyone" ON blog_comments FOR SELECT USING (true);
CREATE POLICY "Users can manage their own comments" ON blog_comments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Comment likes are viewable by everyone" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own comment likes" ON comment_likes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Shares are trackable by everyone" ON blog_shares FOR INSERT USING (true);
CREATE POLICY "Shares are viewable by authenticated users" ON blog_shares FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage categories" ON blog_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage tags" ON blog_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage post tags" ON blog_post_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create or update functions
CREATE OR REPLACE FUNCTION update_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reading_time := CEIL(array_length(string_to_array(NEW.content, ' '), 1) / 200.0);
    NEW.word_count := array_length(string_to_array(NEW.content, ' '), 1);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reading time
DROP TRIGGER IF EXISTS trigger_update_reading_time ON blog_posts;
CREATE TRIGGER trigger_update_reading_time 
    BEFORE INSERT OR UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_reading_time();

-- Function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts SET views = views + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Create comprehensive view for blog posts with all related data
CREATE OR REPLACE VIEW blog_posts_with_stats AS
SELECT 
    bp.*,
    bc.name as category_name,
    bc.color as category_color,
    bc.slug as category_slug,
    u.email as author_email,
    COALESCE(bp.author, u.email, 'Zoroastervers Team') as display_author,
    ARRAY_AGG(DISTINCT bt.name) FILTER (WHERE bt.name IS NOT NULL) as tag_names,
    ARRAY_AGG(DISTINCT bt.slug) FILTER (WHERE bt.slug IS NOT NULL) as tag_slugs
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN auth.users u ON bp.author_id = u.id
LEFT JOIN blog_post_tags bpt ON bp.id = bpt.blog_post_id
LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
GROUP BY bp.id, bc.name, bc.color, bc.slug, u.email;

-- Grant access to the view
GRANT SELECT ON blog_posts_with_stats TO anon, authenticated;