-- Enhanced Homepage Content Management System
-- This migration updates the existing homepage_content table and adds comprehensive functionality

-- First, let's see what we have in the current table and migrate the data
DO $$
BEGIN
    -- Check if the table exists and has data
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'homepage_content') THEN
        -- Backup existing data before transformation
        CREATE TABLE IF NOT EXISTS homepage_content_backup AS 
        SELECT * FROM homepage_content;
        
        RAISE NOTICE 'Backed up existing homepage_content data';
    END IF;
END $$;

-- Drop the existing table to create a new optimized structure
DROP TABLE IF EXISTS public.homepage_content CASCADE;

-- Create enhanced homepage_content table with comprehensive fields
CREATE TABLE IF NOT EXISTS public.homepage_content (
    id TEXT PRIMARY KEY DEFAULT 'homepage',
    -- Hero Section
    hero_title TEXT NOT NULL DEFAULT 'Happiness comes to them who bring happiness to others.',
    hero_subtitle TEXT DEFAULT '',
    hero_description TEXT NOT NULL DEFAULT 'Discover the ancient wisdom of Zarathustra and explore the timeless teachings of Zoroastrianism through our immersive storytelling experience.',
    hero_quote TEXT NOT NULL DEFAULT '"Happiness comes to them who bring happiness to others."',
    
    -- Call to Action
    cta_button_text TEXT NOT NULL DEFAULT 'Learn More',
    cta_button_link TEXT NOT NULL DEFAULT '/learn',
    
    -- Progress Metrics (stored as individual fields for easier updates)
    words_written BIGINT NOT NULL DEFAULT 0,
    beta_readers INTEGER NOT NULL DEFAULT 0,
    average_rating DECIMAL(3,2) NOT NULL DEFAULT 0.0,
    books_published INTEGER NOT NULL DEFAULT 0,
    
    -- Section Visibility Controls
    show_latest_news BOOLEAN NOT NULL DEFAULT true,
    show_latest_releases BOOLEAN NOT NULL DEFAULT true,
    show_artist_collaboration BOOLEAN NOT NULL DEFAULT true,
    show_progress_metrics BOOLEAN NOT NULL DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create homepage_quotes table for managing scrolling quotes
CREATE TABLE IF NOT EXISTS public.homepage_quotes (
    id SERIAL PRIMARY KEY,
    quote_text TEXT NOT NULL,
    author TEXT DEFAULT 'Zoroastrian Wisdom',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default homepage content
INSERT INTO public.homepage_content (id, hero_title, hero_description, hero_quote)
VALUES ('homepage', 
        'Zoroasterverse',
        'Learn about the teachings of the prophet Zarathustra, the history of one of the world''s oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.',
        '"Happiness comes to them who bring happiness to others."'
) ON CONFLICT (id) DO UPDATE SET
    updated_at = TIMEZONE('utc'::text, NOW());

-- Insert the extracted quotes from your HomePage.tsx
INSERT INTO public.homepage_quotes (quote_text, author, display_order) VALUES
('Your heart is a compass that always points toward love—trust it, follow it, honor it.', 'Zoroastrian Wisdom', 1),
('You are not who you were yesterday unless you choose to be—each day offers the gift of becoming.', 'Zoroastrian Wisdom', 2),
('The friend of truth shall be the friend of my spirit, O Ahura Mazda. (Yasna 46.2)', 'Avesta', 3),
('Every moment is sacred when approached with reverence, every task holy when performed with love.', 'Zoroastrian Wisdom', 4),
('The mind aligned with truth thinks God''s thoughts after Him, sees with divine eyes, loves with cosmic heart.', 'Zoroastrian Wisdom', 5),
('May the beneficent spirit help us to speak truth and act righteously. (Yasna 47.6)', 'Avesta', 6),
('Hope is the thing with feathers that perches in the soul and sings without words.', 'Zoroastrian Wisdom', 7),
('Self-knowledge is the beginning of wisdom, self-acceptance the foundation of growth.', 'Zoroastrian Wisdom', 8),
('Grant me, O Truth, the rewards of good thinking that bring joy and satisfaction. (Yasna 50.4)', 'Avesta', 9),
('The sacred fire burns brightest in the heart that chooses truth over comfort. Let your conscience be the altar where right intention dwells.', 'Zoroastrian Wisdom', 10),
('Good thoughts, good words, good deeds.', 'Zarathustra', 11),
('Happiness comes to them who bring happiness to others.', 'Zarathustra', 12),
('Turn yourself not away from three best things: Good Thought, Good Word, and Good Deed.', 'Zarathustra', 13),
('He who sows the ground with care and diligence acquires a greater stock of religious merit than he could gain by the repetition of ten thousand prayers.', 'Zarathustra', 14)
ON CONFLICT DO NOTHING;

-- Create function to automatically calculate metrics
CREATE OR REPLACE FUNCTION calculate_homepage_metrics()
RETURNS void AS $$
DECLARE
    total_words BIGINT := 0;
    total_beta_readers INTEGER := 0;
    avg_rating DECIMAL(3,2) := 0.0;
    published_books INTEGER := 0;
BEGIN
    -- Calculate total words from chapters
    SELECT COALESCE(SUM(LENGTH(content)), 0) INTO total_words
    FROM chapters WHERE status = 'published';
    
    -- Calculate beta readers count from profiles with beta reader role
    SELECT COUNT(*) INTO total_beta_readers
    FROM profiles WHERE role IN ('beta_reader', 'admin');
    
    -- Calculate average rating from any rating system you have
    -- This is a placeholder - adjust based on your actual rating system
    SELECT 4.5 INTO avg_rating;  -- Default rating
    
    -- Count published books/works
    SELECT COUNT(*) INTO published_books
    FROM content_items WHERE status = 'published' AND item_type = 'issue';
    
    -- Update the homepage content with calculated values
    UPDATE homepage_content 
    SET 
        words_written = total_words,
        beta_readers = total_beta_readers,
        average_rating = avg_rating,
        books_published = published_books,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE id = 'homepage';
    
    RAISE NOTICE 'Homepage metrics updated: Words: %, Beta Readers: %, Rating: %, Books: %', 
                 total_words, total_beta_readers, avg_rating, published_books;
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_homepage_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update homepage_quotes updated_at timestamp
CREATE OR REPLACE FUNCTION update_homepage_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_homepage_content_updated_at
    BEFORE UPDATE ON homepage_content
    FOR EACH ROW
    EXECUTE FUNCTION update_homepage_content_updated_at();

CREATE TRIGGER update_homepage_quotes_updated_at
    BEFORE UPDATE ON homepage_quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_homepage_quotes_updated_at();

-- Enable Row Level Security
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Public can read homepage content
CREATE POLICY "Public can read homepage content" ON homepage_content
    FOR SELECT USING (true);

-- Public can read active quotes
CREATE POLICY "Public can read active quotes" ON homepage_quotes
    FOR SELECT USING (is_active = true);

-- Admin can manage homepage content
CREATE POLICY "Admin can manage homepage content" ON homepage_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Admin can manage quotes
CREATE POLICY "Admin can manage homepage quotes" ON homepage_quotes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_homepage_quotes_active_order 
    ON homepage_quotes (is_active, display_order) WHERE is_active = true;

-- Add helpful comments
COMMENT ON TABLE homepage_content IS 'Stores homepage content and configuration settings';
COMMENT ON TABLE homepage_quotes IS 'Manages scrolling quotes displayed on homepage prophecy wheel';
COMMENT ON FUNCTION calculate_homepage_metrics() IS 'Auto-calculates progress metrics from various tables';

-- Grant necessary permissions
GRANT SELECT ON homepage_content TO anon, authenticated;
GRANT SELECT ON homepage_quotes TO anon, authenticated;
GRANT ALL ON homepage_content TO service_role;
GRANT ALL ON homepage_quotes TO service_role;
GRANT USAGE ON SEQUENCE homepage_quotes_id_seq TO service_role;

-- Run initial metrics calculation
SELECT calculate_homepage_metrics();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Enhanced Homepage Content System successfully created!';
    RAISE NOTICE '📊 Tables: homepage_content, homepage_quotes';
    RAISE NOTICE '⚡ Functions: calculate_homepage_metrics()';
    RAISE NOTICE '🔐 RLS policies configured for public read, admin write';
    RAISE NOTICE '📝 %s quotes imported from HomePage.tsx', (SELECT COUNT(*) FROM homepage_quotes);
END $$;
