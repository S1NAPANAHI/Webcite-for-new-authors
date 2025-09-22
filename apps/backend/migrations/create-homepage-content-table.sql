-- Create homepage_content table if it doesn't exist
-- This table stores all homepage configuration including section visibility settings

CREATE TABLE IF NOT EXISTS homepage_content (
    id TEXT PRIMARY KEY DEFAULT 'homepage',
    
    -- Hero Section Content
    hero_title TEXT DEFAULT 'Zoroasterverse',
    hero_subtitle TEXT,
    hero_description TEXT DEFAULT 'Learn about the teachings of the prophet Zarathustra, the history of one of the world''s oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.',
    hero_quote TEXT DEFAULT '"Happiness comes to them who bring happiness to others."',
    
    -- Call-to-Action
    cta_button_text TEXT DEFAULT 'Learn More',
    cta_button_link TEXT DEFAULT '/blog/about',
    
    -- Progress Metrics
    words_written INTEGER DEFAULT 50000,
    beta_readers INTEGER DEFAULT 5,
    average_rating DECIMAL(3,2) DEFAULT 4.5,
    books_published INTEGER DEFAULT 1,
    
    -- Section Visibility Settings (CRITICAL FOR FIXING THE ISSUE)
    show_latest_news BOOLEAN DEFAULT true,
    show_latest_releases BOOLEAN DEFAULT true,
    show_artist_collaboration BOOLEAN DEFAULT true,
    show_progress_metrics BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default homepage content if it doesn't exist
INSERT INTO homepage_content (id) 
VALUES ('homepage') 
ON CONFLICT (id) DO NOTHING;

-- Create homepage_quotes table if it doesn't exist
CREATE TABLE IF NOT EXISTS homepage_quotes (
    id SERIAL PRIMARY KEY,
    quote_text TEXT NOT NULL,
    author TEXT DEFAULT 'Zoroastrian Wisdom',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert some default quotes if the table is empty
INSERT INTO homepage_quotes (quote_text, author, display_order, is_active)
SELECT * FROM (
    VALUES 
    ('Your heart is a compass that always points toward love—trust it, follow it, honor it.', 'Zoroastrian Wisdom', 1, true),
    ('The friend of truth shall be the friend of my spirit, O Ahura Mazda. (Yasna 46.2)', 'Yasna 46.2', 2, true),
    ('Every moment is sacred when approached with reverence, every task holy when performed with love.', 'Zoroastrian Wisdom', 3, true),
    ('May the beneficent spirit help us to speak truth and act righteously. (Yasna 47.6)', 'Yasna 47.6', 4, true),
    ('Grant me, O Truth, the rewards of good thinking that bring joy and satisfaction. (Yasna 50.4)', 'Yasna 50.4', 5, true),
    ('Good Thoughts, Good Words, Good Deeds - the threefold path of righteousness.', 'Zoroastrian Teaching', 6, true),
    ('The sacred fire burns brightest in the heart that chooses truth over comfort.', 'Zoroastrian Wisdom', 7, true),
    ('Happiness comes to them who bring happiness to others.', 'Zoroastrian Proverb', 8, true)
) AS t(quote_text, author, display_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM homepage_quotes);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_homepage_quotes_active_order ON homepage_quotes(is_active, display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_homepage_content_updated ON homepage_content(updated_at);

-- Update timestamp trigger for homepage_content
CREATE OR REPLACE FUNCTION update_homepage_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_homepage_content_updated_at_trigger ON homepage_content;
CREATE TRIGGER update_homepage_content_updated_at_trigger
    BEFORE UPDATE ON homepage_content
    FOR EACH ROW
    EXECUTE FUNCTION update_homepage_content_updated_at();

-- Update timestamp trigger for homepage_quotes
CREATE OR REPLACE FUNCTION update_homepage_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_homepage_quotes_updated_at_trigger ON homepage_quotes;
CREATE TRIGGER update_homepage_quotes_updated_at_trigger
    BEFORE UPDATE ON homepage_quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_homepage_quotes_updated_at();

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON homepage_content TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON homepage_quotes TO authenticated;
-- GRANT USAGE, SELECT ON SEQUENCE homepage_quotes_id_seq TO authenticated;

COMMIT;