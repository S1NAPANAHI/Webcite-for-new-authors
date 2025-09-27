-- Learn Page Database Enhancements
-- Run these queries in your Supabase SQL editor to add enhanced functionality

-- Add enhanced columns to authors_journey_posts
ALTER TABLE authors_journey_posts 
ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS estimated_reading_time INTEGER,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add enhanced columns to writing_guides
ALTER TABLE writing_guides 
ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS estimated_reading_time INTEGER,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add enhanced columns to video_tutorials
ALTER TABLE video_tutorials 
ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS duration INTEGER, -- in minutes
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add enhanced columns to downloadable_templates
ALTER TABLE downloadable_templates 
ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS file_size INTEGER, -- in bytes
ADD COLUMN IF NOT EXISTS file_type TEXT,
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS preview_image_url TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add enhanced columns to professional_services
ALTER TABLE professional_services 
ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS duration_hours INTEGER,
ADD COLUMN IF NOT EXISTS inquiry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS booking_url TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_authors_journey_posts_status ON authors_journey_posts(status);
CREATE INDEX IF NOT EXISTS idx_authors_journey_posts_category ON authors_journey_posts(category);
CREATE INDEX IF NOT EXISTS idx_authors_journey_posts_difficulty ON authors_journey_posts(difficulty);
CREATE INDEX IF NOT EXISTS idx_authors_journey_posts_view_count ON authors_journey_posts(view_count DESC);

CREATE INDEX IF NOT EXISTS idx_writing_guides_status ON writing_guides(status);
CREATE INDEX IF NOT EXISTS idx_writing_guides_category ON writing_guides(category);
CREATE INDEX IF NOT EXISTS idx_writing_guides_difficulty ON writing_guides(difficulty);
CREATE INDEX IF NOT EXISTS idx_writing_guides_view_count ON writing_guides(view_count DESC);

CREATE INDEX IF NOT EXISTS idx_video_tutorials_status ON video_tutorials(status);
CREATE INDEX IF NOT EXISTS idx_video_tutorials_category ON video_tutorials(category);
CREATE INDEX IF NOT EXISTS idx_video_tutorials_difficulty ON video_tutorials(difficulty);
CREATE INDEX IF NOT EXISTS idx_video_tutorials_view_count ON video_tutorials(view_count DESC);

CREATE INDEX IF NOT EXISTS idx_downloadable_templates_status ON downloadable_templates(status);
CREATE INDEX IF NOT EXISTS idx_downloadable_templates_category ON downloadable_templates(category);
CREATE INDEX IF NOT EXISTS idx_downloadable_templates_difficulty ON downloadable_templates(difficulty);
CREATE INDEX IF NOT EXISTS idx_downloadable_templates_download_count ON downloadable_templates(download_count DESC);

CREATE INDEX IF NOT EXISTS idx_professional_services_available ON professional_services(is_available);
CREATE INDEX IF NOT EXISTS idx_professional_services_category ON professional_services(category);

-- Create view tracking function
CREATE OR REPLACE FUNCTION increment_view_count(table_name text, content_id uuid)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET view_count = COALESCE(view_count, 0) + 1 WHERE id = $1', table_name)
  USING content_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get content analytics
CREATE OR REPLACE FUNCTION get_learn_analytics()
RETURNS json AS $$
DECLARE
  result json;
  total_views integer;
  total_content integer;
  category_breakdown json;
  difficulty_breakdown json;
BEGIN
  -- Calculate total views across all content types
  SELECT COALESCE(
    (SELECT SUM(COALESCE(view_count, 0)) FROM authors_journey_posts WHERE status = 'published') +
    (SELECT SUM(COALESCE(view_count, 0)) FROM writing_guides WHERE status = 'published') +
    (SELECT SUM(COALESCE(view_count, 0)) FROM video_tutorials WHERE status = 'published') +
    (SELECT SUM(COALESCE(download_count, 0)) FROM downloadable_templates WHERE status = 'published'),
    0
  ) INTO total_views;

  -- Calculate total content count
  SELECT COALESCE(
    (SELECT COUNT(*) FROM authors_journey_posts WHERE status = 'published') +
    (SELECT COUNT(*) FROM writing_guides WHERE status = 'published') +
    (SELECT COUNT(*) FROM video_tutorials WHERE status = 'published') +
    (SELECT COUNT(*) FROM downloadable_templates WHERE status = 'published') +
    (SELECT COUNT(*) FROM professional_services WHERE is_available = true),
    0
  ) INTO total_content;

  -- Get category breakdown
  SELECT json_object_agg(category, count) INTO category_breakdown
  FROM (
    SELECT category, COUNT(*) as count
    FROM (
      SELECT category FROM authors_journey_posts WHERE status = 'published' AND category IS NOT NULL
      UNION ALL
      SELECT category FROM writing_guides WHERE status = 'published' AND category IS NOT NULL
      UNION ALL
      SELECT category FROM video_tutorials WHERE status = 'published' AND category IS NOT NULL
      UNION ALL
      SELECT category FROM downloadable_templates WHERE status = 'published' AND category IS NOT NULL
      UNION ALL
      SELECT category FROM professional_services WHERE is_available = true AND category IS NOT NULL
    ) categories
    GROUP BY category
  ) cat_counts;

  -- Get difficulty breakdown
  SELECT json_object_agg(difficulty, count) INTO difficulty_breakdown
  FROM (
    SELECT difficulty, COUNT(*) as count
    FROM (
      SELECT difficulty FROM authors_journey_posts WHERE status = 'published' AND difficulty IS NOT NULL
      UNION ALL
      SELECT difficulty FROM writing_guides WHERE status = 'published' AND difficulty IS NOT NULL
      UNION ALL
      SELECT difficulty FROM video_tutorials WHERE status = 'published' AND difficulty IS NOT NULL
      UNION ALL
      SELECT difficulty FROM downloadable_templates WHERE status = 'published' AND difficulty IS NOT NULL
      UNION ALL
      SELECT difficulty FROM professional_services WHERE is_available = true AND difficulty IS NOT NULL
    ) difficulties
    GROUP BY difficulty
  ) diff_counts;

  -- Build result
  result := json_build_object(
    'totalViews', total_views,
    'totalContent', total_content,
    'categoryBreakdown', COALESCE(category_breakdown, '{}'),
    'difficultyBreakdown', COALESCE(difficulty_breakdown, '{}')
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data to populate the Learn page
INSERT INTO authors_journey_posts (title, slug, content, status, difficulty, category, author, estimated_reading_time)
VALUES 
  ('Getting Started as a New Author', 'getting-started-new-author', 
   '<p>Every writer begins somewhere. This comprehensive guide will walk you through the essential first steps of your writing journey.</p><h2>Finding Your Voice</h2><p>The most important thing you can do as a new author is discover your unique voice...</p>', 
   'published', 'beginner', 'Getting Started', 'Sina Panahi', 8),
  ('Advanced Character Development Techniques', 'advanced-character-development', 
   '<p>Creating compelling characters goes beyond basic traits. Learn sophisticated techniques for character development.</p><h2>Psychological Depth</h2><p>Characters need internal conflicts that drive the story...</p>', 
   'published', 'advanced', 'Character Development', 'Sina Panahi', 12),
  ('World Building for Fantasy Writers', 'world-building-fantasy', 
   '<p>Fantasy worlds require careful construction. This guide covers everything from magic systems to political structures.</p>', 
   'published', 'intermediate', 'World Building', 'Sina Panahi', 15)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO writing_guides (title, slug, content, status, difficulty, category, author, estimated_reading_time)
VALUES 
  ('Show vs Tell: A Practical Guide', 'show-vs-tell-guide', 
   '<p>One of the fundamental skills every writer must master is the balance between showing and telling.</p>', 
   'published', 'beginner', 'Writing Techniques', 'Sina Panahi', 6),
  ('Mastering Dialogue Tags and Formatting', 'dialogue-tags-formatting', 
   '<p>Professional dialogue formatting can make or break your manuscript. Learn industry standards.</p>', 
   'published', 'intermediate', 'Writing Techniques', 'Sina Panahi', 4),
  ('Advanced Plot Structure Techniques', 'advanced-plot-structure', 
   '<p>Beyond the three-act structure: exploring complex narrative frameworks for experienced writers.</p>', 
   'published', 'advanced', 'Plot Development', 'Sina Panahi', 20)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO video_tutorials (title, description, video_url, status, difficulty, category, duration, author)
VALUES 
  ('Creating Your First Character Profile', 'Step-by-step video guide for character creation', 'https://example.com/video1', 
   'published', 'beginner', 'Character Development', 15, 'Sina Panahi'),
  ('Advanced World Building Workshop', 'Deep dive into creating immersive fictional worlds', 'https://example.com/video2', 
   'published', 'advanced', 'World Building', 45, 'Sina Panahi')
ON CONFLICT (title) DO NOTHING;

INSERT INTO downloadable_templates (title, description, file_path, status, difficulty, category, file_type, author)
VALUES 
  ('Character Development Worksheet', 'Comprehensive template for developing fictional characters', '/templates/character-worksheet.pdf', 
   'published', 'beginner', 'Templates', 'pdf', 'Sina Panahi'),
  ('Plot Outline Template', 'Professional plot structure template', '/templates/plot-outline.docx', 
   'published', 'intermediate', 'Templates', 'docx', 'Sina Panahi'),
  ('World Building Bible Template', 'Complete template for fantasy world creation', '/templates/world-building.pdf', 
   'published', 'advanced', 'Templates', 'pdf', 'Sina Panahi')
ON CONFLICT (title) DO NOTHING;

INSERT INTO professional_services (title, description, price, is_available, category, duration_hours, contact_email)
VALUES 
  ('Manuscript Evaluation', 'Professional review of your manuscript with detailed feedback', 299.99, true, 
   'Editing Services', 5, 'services@zoroastervers.com'),
  ('One-on-One Writing Coaching', 'Personalized coaching sessions for developing writers', 149.99, true, 
   'Coaching', 2, 'coaching@zoroastervers.com'),
  ('World Building Consultation', 'Expert guidance for fantasy world creation', 199.99, true, 
   'Consultation', 3, 'worldbuilding@zoroastervers.com')
ON CONFLICT (title) DO NOTHING;

-- Create Row Level Security policies for admin access
ALTER TABLE authors_journey_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloadable_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_services ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published content
CREATE POLICY IF NOT EXISTS "Public can view published authors_journey_posts" 
ON authors_journey_posts FOR SELECT 
USING (status = 'published');

CREATE POLICY IF NOT EXISTS "Public can view published writing_guides" 
ON writing_guides FOR SELECT 
USING (status = 'published');

CREATE POLICY IF NOT EXISTS "Public can view published video_tutorials" 
ON video_tutorials FOR SELECT 
USING (status = 'published');

CREATE POLICY IF NOT EXISTS "Public can view published downloadable_templates" 
ON downloadable_templates FOR SELECT 
USING (status = 'published');

CREATE POLICY IF NOT EXISTS "Public can view available professional_services" 
ON professional_services FOR SELECT 
USING (is_available = true);

-- Allow admin full access
CREATE POLICY IF NOT EXISTS "Admins can manage authors_journey_posts" 
ON authors_journey_posts FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Admins can manage writing_guides" 
ON writing_guides FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Admins can manage video_tutorials" 
ON video_tutorials FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Admins can manage downloadable_templates" 
ON downloadable_templates FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Admins can manage professional_services" 
ON professional_services FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

-- Create triggers to update view counts
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_authors_journey_posts_updated_at') THEN
        CREATE TRIGGER update_authors_journey_posts_updated_at 
        BEFORE UPDATE ON authors_journey_posts 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_writing_guides_updated_at') THEN
        CREATE TRIGGER update_writing_guides_updated_at 
        BEFORE UPDATE ON writing_guides 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_video_tutorials_updated_at') THEN
        CREATE TRIGGER update_video_tutorials_updated_at 
        BEFORE UPDATE ON video_tutorials 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_downloadable_templates_updated_at') THEN
        CREATE TRIGGER update_downloadable_templates_updated_at 
        BEFORE UPDATE ON downloadable_templates 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_professional_services_updated_at') THEN
        CREATE TRIGGER update_professional_services_updated_at 
        BEFORE UPDATE ON professional_services 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END$$;

-- Comments for documentation
COMMENT ON COLUMN authors_journey_posts.difficulty IS 'Content difficulty level: beginner, intermediate, advanced';
COMMENT ON COLUMN authors_journey_posts.category IS 'Content category for filtering';
COMMENT ON COLUMN authors_journey_posts.estimated_reading_time IS 'Estimated reading time in minutes';
COMMENT ON COLUMN authors_journey_posts.view_count IS 'Number of times this content has been viewed';
COMMENT ON COLUMN authors_journey_posts.featured_image_url IS 'URL for the featured image/thumbnail';
COMMENT ON COLUMN authors_journey_posts.meta_description IS 'SEO meta description';
COMMENT ON COLUMN authors_journey_posts.tags IS 'Array of tags for the content';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
