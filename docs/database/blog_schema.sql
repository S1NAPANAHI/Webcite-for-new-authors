-- Blog Posts Table Schema for Supabase
-- Run this SQL in your Supabase SQL editor to set up the blog system

-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  tags TEXT[],
  reading_time INTEGER,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_is_featured ON blog_posts(is_featured) WHERE is_featured = true;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public can view published posts
CREATE POLICY "Blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Authenticated users can manage blog posts (admin only in practice)
CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample blog posts for development
INSERT INTO blog_posts (
  title, 
  slug, 
  excerpt, 
  content, 
  featured_image,
  author, 
  status, 
  is_featured,
  views, 
  likes_count, 
  comments_count,
  tags,
  reading_time,
  published_at
) VALUES 
(
  'The Ancient Wisdom of Zoroaster: A Journey Through Time',
  'ancient-wisdom-of-zoroaster',
  'Explore the profound teachings of Zoroaster and their relevance in modern times. Discover how ancient wisdom shapes our understanding of good versus evil.',
  'The teachings of Zoroaster have shaped civilizations for over 3,000 years. In this comprehensive exploration, we delve into the core principles of Zoroastrianism and examine how these ancient beliefs continue to influence modern thought and spirituality.\n\nFrom the concept of free will to the eternal struggle between light and darkness, Zoroastrian philosophy offers profound insights into the human condition and our relationship with the divine. The prophet Zoroaster, also known as Zarathustra, lived sometime between 628-551 BCE in ancient Persia, and his teachings formed the foundation of one of the world''s oldest monotheistic religions.\n\nThe core principle of "Good Thoughts, Good Words, Good Deeds" (Humata, Hukhta, Hvarshta) remains as relevant today as it was over three millennia ago. This ethical framework provides a simple yet profound guide for living a righteous life, emphasizing the power of individual choice in the cosmic battle between good and evil.',
  '/api/placeholder/1200/600',
  'Dr. Sarah Mirza',
  'published',
  true,
  1247,
  89,
  23,
  ARRAY['History', 'Philosophy', 'Religion'],
  8,
  NOW() - INTERVAL '1 day'
),
(
  'Fire Temples: Sacred Architecture of the Zoroastrian Faith',
  'fire-temples-sacred-architecture',
  'An architectural journey through the sacred fire temples that have served as centers of worship for thousands of years.',
  'Fire temples represent the heart of Zoroastrian worship. These sacred structures, with their eternal flames, tell stories of devotion, community, and architectural brilliance spanning millennia.\n\nFrom the great fire of Yazd to the Atash Bahrams of Mumbai, each temple carries unique historical significance. The eternal flames housed within these sacred spaces have burned continuously for centuries, some for over a thousand years, representing the eternal light of Ahura Mazda.\n\nThe architecture of fire temples reflects both practical needs and spiritual symbolism. The inner sanctum, where the sacred fire burns, is carefully designed to maintain purity while allowing the faithful to offer prayers and make offerings.',
  '/api/placeholder/1200/600',
  'Prof. Jamshid Rostami',
  'published',
  true,
  2156,
  134,
  67,
  ARRAY['Architecture', 'Sacred Sites', 'Culture'],
  12,
  NOW() - INTERVAL '2 days'
),
(
  'The Gathas: Poetry of Divine Inspiration',
  'gathas-poetry-divine-inspiration',
  'Dive into the beautiful hymns composed by Zoroaster himself, exploring their poetic structure and spiritual significance.',
  'The Gathas represent the oldest part of the Avesta and contain the direct words of Zoroaster. These seventeen hymns offer profound insights into the prophet''s teachings and relationship with Ahura Mazda.\n\nTheir poetic beauty and theological depth continue to inspire scholars and believers alike. Each Gatha reveals different aspects of Zoroastrian thought, from the nature of the divine to humanity''s role in the cosmic order.\n\nThe language of the Gathas is both archaic and profound, requiring careful study to unlock their full meaning. Modern scholars have worked tirelessly to preserve and interpret these ancient texts for contemporary readers.',
  '/api/placeholder/1200/600',
  'Dr. Farah Kermani',
  'published',
  true,
  892,
  67,
  31,
  ARRAY['Scripture', 'Poetry', 'Theology'],
  15,
  NOW() - INTERVAL '3 days'
),
(
  'Modern Zoroastrian Communities Around the World',
  'modern-zoroastrian-communities',
  'Meet the vibrant Zoroastrian communities that keep ancient traditions alive in our modern world.',
  'From Mumbai to Toronto, London to Tehran, Zoroastrian communities continue to thrive while preserving their ancient heritage. This article explores how modern Zoroastrians navigate tradition and contemporary life.\n\nDespite their small numbers, Zoroastrian communities have made significant contributions to their adopted countries while maintaining their unique identity. The Parsi community in India, descendants of Persian Zoroastrians, exemplifies this balance between tradition and modernity.\n\nIn North America and Europe, younger generations of Zoroastrians face the challenge of preserving their faith while fully participating in multicultural societies.',
  '/api/placeholder/1200/600',
  'Reza Dalal',
  'published',
  false,
  1683,
  203,
  89,
  ARRAY['Community', 'Modern Life', 'Global'],
  10,
  NOW() - INTERVAL '4 days'
),
(
  'The Symbolism of Light and Darkness in Zoroastrian Thought',
  'symbolism-light-darkness',
  'Understanding the fundamental dualism that forms the core of Zoroastrian theology and its impact on world religions.',
  'The eternal struggle between light and darkness, good and evil, forms the foundation of Zoroastrian thought. This exploration examines how this dualistic worldview has influenced major world religions and philosophical systems.\n\nIn Zoroastrian cosmology, Ahura Mazda represents absolute goodness and light, while Angra Mainyu embodies evil and darkness. This cosmic battle is not just theological but deeply practical, calling each person to choose their side through thoughts, words, and deeds.\n\nThis dualistic framework has profoundly influenced Christianity, Islam, and other monotheistic traditions, making Zoroastrianism one of history''s most influential religions despite its relatively small following today.',
  '/api/placeholder/1200/600',
  'Prof. Cyrus Bahram',
  'published',
  false,
  756,
  45,
  18,
  ARRAY['Theology', 'Symbolism', 'Philosophy'],
  7,
  NOW() - INTERVAL '5 days'
);

-- Blog Comments Table (optional, for future use)
CREATE TABLE blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_comments_post_id ON blog_comments(blog_post_id);
CREATE INDEX idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX idx_blog_comments_approved ON blog_comments(is_approved) WHERE is_approved = true;

-- Blog Likes Table (optional, for future use)
CREATE TABLE blog_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blog_post_id, user_id)
);

CREATE INDEX idx_blog_likes_post_id ON blog_likes(blog_post_id);
CREATE INDEX idx_blog_likes_user_id ON blog_likes(user_id);

-- Enable RLS for comments and likes tables
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;

-- Policies for comments (users can manage their own comments)
CREATE POLICY "Users can view approved comments"
  ON blog_comments FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Users can manage their own comments"
  ON blog_comments FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for likes (users can manage their own likes)
CREATE POLICY "Users can view all likes"
  ON blog_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own likes"
  ON blog_likes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update likes_count when likes are added/removed
CREATE OR REPLACE FUNCTION update_blog_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE blog_posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.blog_post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE blog_posts 
    SET likes_count = GREATEST(likes_count - 1, 0) 
    WHERE id = OLD.blog_post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_blog_likes_count
  AFTER INSERT OR DELETE ON blog_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_likes_count();

-- Function to automatically update comments_count when comments are added/removed
CREATE OR REPLACE FUNCTION update_blog_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_approved = true THEN
    UPDATE blog_posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.blog_post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.is_approved = true THEN
    UPDATE blog_posts 
    SET comments_count = GREATEST(comments_count - 1, 0) 
    WHERE id = OLD.blog_post_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_approved = false AND NEW.is_approved = true THEN
      UPDATE blog_posts 
      SET comments_count = comments_count + 1 
      WHERE id = NEW.blog_post_id;
    ELSIF OLD.is_approved = true AND NEW.is_approved = false THEN
      UPDATE blog_posts 
      SET comments_count = GREATEST(comments_count - 1, 0) 
      WHERE id = NEW.blog_post_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_blog_comments_count
  AFTER INSERT OR UPDATE OR DELETE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_comments_count();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON blog_posts TO anon;
GRANT ALL ON blog_posts TO authenticated;
GRANT ALL ON blog_comments TO authenticated;
GRANT ALL ON blog_likes TO authenticated;

-- Optional: Create a view for published blog posts with author info
CREATE OR REPLACE VIEW published_blog_posts AS
SELECT 
  bp.*,
  COALESCE(bp.author, 'Zoroasterverse Team') as display_author
FROM blog_posts bp
WHERE bp.status = 'published'
ORDER BY bp.published_at DESC;

-- Grant select permission on the view
GRANT SELECT ON published_blog_posts TO anon, authenticated;