-- Enhanced Blog System Schema for Zoroasterverse
-- Run this in your Supabase SQL editor

-- First, ensure we have the basic blog posts table (update if needed)
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add additional fields to existing blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS social_image TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS word_count INTEGER;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_order INTEGER;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time INTEGER;

-- Create blog_categories table for better organization
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

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    posts_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_post_tags junction table
CREATE TABLE IF NOT EXISTS blog_post_tags (
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, tag_id)
);

-- Create blog_likes for tracking user likes
CREATE TABLE IF NOT EXISTS blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blog_post_id, user_id)
);

-- Create blog_comments table
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

-- Create blog_views for detailed analytics
CREATE TABLE IF NOT EXISTS blog_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    reading_time INTEGER, -- seconds spent reading
    scroll_percentage INTEGER DEFAULT 0
);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- Create blog_shares for tracking shares
CREATE TABLE IF NOT EXISTS blog_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    platform TEXT NOT NULL, -- 'twitter', 'facebook', 'linkedin', 'copy'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_views_post_id ON blog_views(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_user_id ON blog_views(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_created_at ON blog_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id ON blog_post_tags(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag_id ON blog_post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_blog_shares_post_id ON blog_shares(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON blog_likes(blog_post_id);

-- Enable RLS on all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_shares ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Blog posts are viewable by everyone, manageable by authenticated users
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Categories and tags are viewable by everyone
CREATE POLICY "Categories are viewable by everyone" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Tags are viewable by everyone" ON blog_tags FOR SELECT USING (true);
CREATE POLICY "Post tags are viewable by everyone" ON blog_post_tags FOR SELECT USING (true);

-- Views are trackable by everyone, viewable by admins
CREATE POLICY "Views are trackable by everyone" ON blog_views FOR INSERT USING (true);
CREATE POLICY "Views are viewable by authenticated users" ON blog_views FOR SELECT TO authenticated USING (true);

-- Likes are manageable by authenticated users
CREATE POLICY "Users can manage their own likes" ON blog_likes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Likes are viewable by everyone" ON blog_likes FOR SELECT USING (true);

-- Comments are viewable by everyone, manageable by users
CREATE POLICY "Comments are viewable by everyone" ON blog_comments FOR SELECT USING (true);
CREATE POLICY "Users can manage their own comments" ON blog_comments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Comment likes are manageable by authenticated users
CREATE POLICY "Comment likes are viewable by everyone" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own comment likes" ON comment_likes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Shares are trackable by everyone
CREATE POLICY "Shares are trackable by everyone" ON blog_shares FOR INSERT USING (true);
CREATE POLICY "Shares are viewable by authenticated users" ON blog_shares FOR SELECT TO authenticated USING (true);

-- Admin policies (you may want to restrict these to admin role)
CREATE POLICY "Admins can manage categories" ON blog_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage tags" ON blog_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can manage post tags" ON blog_post_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Functions for automatic counts
CREATE OR REPLACE FUNCTION update_category_posts_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_categories SET posts_count = posts_count + 1 WHERE name = NEW.category;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.category IS DISTINCT FROM NEW.category THEN
            UPDATE blog_categories SET posts_count = posts_count - 1 WHERE name = OLD.category;
            UPDATE blog_categories SET posts_count = posts_count + 1 WHERE name = NEW.category;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blog_categories SET posts_count = posts_count - 1 WHERE name = OLD.category;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_tag_posts_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_tags SET posts_count = posts_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blog_tags SET posts_count = posts_count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_shares_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_posts SET shares_count = shares_count + 1 WHERE id = NEW.blog_post_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blog_comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_posts SET likes_count = likes_count + 1 WHERE id = NEW.blog_post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blog_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.blog_post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_posts SET comments_count = comments_count + 1 WHERE id = NEW.blog_post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blog_posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.blog_post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blog_posts SET views = views + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate reading time
CREATE OR REPLACE FUNCTION update_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reading_time := CEIL(array_length(string_to_array(NEW.content, ' '), 1) / 200.0);
    NEW.word_count := array_length(string_to_array(NEW.content, ' '), 1);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_category_posts_count 
    AFTER INSERT OR UPDATE OR DELETE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_category_posts_count();

CREATE TRIGGER trigger_update_tag_posts_count 
    AFTER INSERT OR DELETE ON blog_post_tags 
    FOR EACH ROW EXECUTE FUNCTION update_tag_posts_count();

CREATE TRIGGER trigger_update_shares_count 
    AFTER INSERT ON blog_shares 
    FOR EACH ROW EXECUTE FUNCTION update_shares_count();

CREATE TRIGGER trigger_update_comment_likes_count 
    AFTER INSERT OR DELETE ON comment_likes 
    FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

CREATE TRIGGER trigger_update_post_likes_count 
    AFTER INSERT OR DELETE ON blog_likes 
    FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

CREATE TRIGGER trigger_update_post_comments_count 
    AFTER INSERT OR DELETE ON blog_comments 
    FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

CREATE TRIGGER trigger_update_reading_time 
    BEFORE INSERT OR UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_reading_time();

-- Insert sample categories and tags
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

-- Create comprehensive view for blog posts with all related data
CREATE OR REPLACE VIEW blog_posts_with_stats AS
SELECT 
    bp.*,
    bc.name as category_name,
    bc.color as category_color,
    COALESCE(bp.author, 'Zoroasterverse Team') as display_author,
    ARRAY_AGG(DISTINCT bt.name) FILTER (WHERE bt.name IS NOT NULL) as tag_names,
    ARRAY_AGG(DISTINCT bt.slug) FILTER (WHERE bt.slug IS NOT NULL) as tag_slugs
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category = bc.name
LEFT JOIN blog_post_tags bpt ON bp.id = bpt.blog_post_id
LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
GROUP BY bp.id, bc.name, bc.color;

-- Grant access to the view
GRANT SELECT ON blog_posts_with_stats TO anon, authenticated;