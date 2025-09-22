-- Drop existing homepage_content table if it exists
DROP TABLE IF EXISTS public.homepage_content CASCADE;

-- Create homepage_content table with the correct schema
CREATE TABLE public.homepage_content (
  id TEXT PRIMARY KEY DEFAULT 'homepage',
  hero_title TEXT NOT NULL DEFAULT 'Zoroasterverse'::TEXT,
  hero_subtitle TEXT NULL DEFAULT ''::TEXT,
  hero_description TEXT NOT NULL DEFAULT 'Learn about the teachings of the prophet Zarathustra, the history of one of the worlds oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.'::TEXT,
  hero_quote TEXT NOT NULL DEFAULT '"Happiness comes to them who bring happiness to others."'::TEXT,
  cta_button_text TEXT NOT NULL DEFAULT 'Learn More'::TEXT,
  cta_button_link TEXT NOT NULL DEFAULT '/blog/about'::TEXT,
  words_written BIGINT NOT NULL DEFAULT 50000,
  beta_readers INTEGER NOT NULL DEFAULT 5,
  average_rating NUMERIC(3, 2) NOT NULL DEFAULT 4.5,
  books_published INTEGER NOT NULL DEFAULT 1,
  show_latest_news BOOLEAN NOT NULL DEFAULT TRUE,
  show_latest_releases BOOLEAN NOT NULL DEFAULT TRUE,
  show_artist_collaboration BOOLEAN NOT NULL DEFAULT TRUE,
  show_progress_metrics BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW()
);

-- Insert default data
INSERT INTO public.homepage_content (
    id,
    hero_title,
    hero_subtitle,
    hero_description,
    hero_quote,
    cta_button_text,
    cta_button_link,
    words_written,
    beta_readers,
    average_rating,
    books_published,
    show_latest_news,
    show_latest_releases,
    show_artist_collaboration,
    show_progress_metrics
) VALUES (
    'homepage',
    'Zoroasterverse',
    '',
    'Learn about the teachings of the prophet Zarathustra, the history of one of the worlds oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.',
    '"Happiness comes to them who bring happiness to others."',
    'Learn More',
    '/blog/about',
    50000,
    5,
    4.5,
    1,
    TRUE,
    TRUE,
    TRUE,
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- Re-create the updated_at trigger function
CREATE OR REPLACE FUNCTION update_homepage_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-create the updated_at trigger
DROP TRIGGER IF EXISTS update_homepage_content_updated_at ON public.homepage_content;
CREATE TRIGGER update_homepage_content_updated_at
BEFORE UPDATE ON public.homepage_content
FOR EACH ROW
EXECUTE FUNCTION update_homepage_content_updated_at();

-- Re-enable Row Level Security (RLS)
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies to ensure a clean slate
DROP POLICY IF EXISTS "Public can read homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Service role full access to homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Authenticated admin can manage homepage content" ON public.homepage_content;

-- Re-create RLS policies
CREATE POLICY "Public can read homepage content" ON public.homepage_content
    FOR SELECT USING (TRUE);

CREATE POLICY "Service role full access to homepage content" ON public.homepage_content
    FOR ALL USING (current_setting('request.jwt.claims', TRUE)::jsonb ->> 'role' = 'service_role');

CREATE POLICY "Authenticated admin can manage homepage content" ON public.homepage_content
    FOR ALL USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Grant necessary permissions
GRANT ALL ON public.homepage_content TO service_role;
GRANT SELECT ON public.homepage_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_content TO authenticated;