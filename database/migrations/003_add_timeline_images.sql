-- Add image support to timeline system
-- This migration adds image fields to timeline_eras, timeline_events, and nested events

-- 1. Add image fields to timeline_eras (ages)
ALTER TABLE timeline_eras 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- 2. Ensure timeline_events has image fields (should already exist from types)
ALTER TABLE timeline_events 
ADD COLUMN IF NOT EXISTS background_image TEXT,
ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- 3. Check if timeline_nested_events table exists, if not create it
CREATE TABLE IF NOT EXISTS timeline_nested_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timeline_event_id UUID NOT NULL REFERENCES timeline_events(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date VARCHAR(100),
    image_url TEXT,
    image_alt TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS on nested events if table was just created
ALTER TABLE timeline_nested_events ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for nested events
CREATE POLICY IF NOT EXISTS "Anyone can view nested events" ON timeline_nested_events
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Admins can manage nested events" ON timeline_nested_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 6. Create trigger for nested events updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_timeline_nested_events_updated_at 
    BEFORE UPDATE ON timeline_nested_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Grant permissions on nested events
GRANT ALL ON timeline_nested_events TO authenticated;
GRANT SELECT ON timeline_nested_events TO anon;

-- 8. Insert sample images for existing eras
UPDATE timeline_eras SET 
    image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    image_alt = 'Ancient mystical landscape with golden light'
WHERE name = 'Ancient Times' AND image_url IS NULL;

UPDATE timeline_eras SET 
    image_url = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    image_alt = 'Classical Greek temple with marble columns'
WHERE name = 'Classical Period' AND image_url IS NULL;

UPDATE timeline_eras SET 
    image_url = 'https://images.unsplash.com/photo-1518709268805-4e9042af2ac1?w=800&h=600&fit=crop',
    image_alt = 'Medieval castle on a misty hill'
WHERE name = 'Medieval Era' AND image_url IS NULL;

UPDATE timeline_eras SET 
    image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    image_alt = 'Renaissance art and architecture'
WHERE name = 'Renaissance' AND image_url IS NULL;

UPDATE timeline_eras SET 
    image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    image_alt = 'Modern cityscape with futuristic elements'
WHERE name = 'Modern Age' AND image_url IS NULL;

-- 9. Insert sample events with images (only if no events exist)
INSERT INTO timeline_events (title, description, date, era, background_image, image_alt, order_index, is_published)
SELECT 
    'The Great Awakening',
    'A pivotal moment when the first magical energies were discovered and harnessed by ancient civilizations.',
    'Year 100',
    'Ancient Times',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2ac1?w=1200&h=800&fit=crop',
    'Mystical energy swirling around ancient ruins',
    1,
    true
WHERE NOT EXISTS (SELECT 1 FROM timeline_events WHERE title = 'The Great Awakening');

INSERT INTO timeline_events (title, description, date, era, background_image, image_alt, order_index, is_published)
SELECT 
    'The Foundation Wars',
    'Epic conflicts that shaped the political landscape and established the major kingdoms.',
    'Year 800',
    'Classical Period',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
    'Ancient warriors in battle formation',
    2,
    true
WHERE NOT EXISTS (SELECT 1 FROM timeline_events WHERE title = 'The Foundation Wars');

INSERT INTO timeline_events (title, description, date, era, background_image, image_alt, order_index, is_published)
SELECT 
    'The Dark Eclipse',
    'A mysterious celestial event that brought about significant changes in magic and technology.',
    'Year 1800',
    'Medieval Era',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
    'Solar eclipse over a medieval landscape',
    3,
    true
WHERE NOT EXISTS (SELECT 1 FROM timeline_events WHERE title = 'The Dark Eclipse');

-- 10. Insert sample nested events with images
INSERT INTO timeline_nested_events (timeline_event_id, title, description, date, image_url, image_alt, order_index)
SELECT 
    te.id,
    'Discovery of the First Crystal',
    'The moment when the ancient crystal was first unearthed.',
    'Year 95',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    'Glowing crystal in ancient hands',
    1
FROM timeline_events te 
WHERE te.title = 'The Great Awakening'
AND NOT EXISTS (
    SELECT 1 FROM timeline_nested_events tne 
    WHERE tne.timeline_event_id = te.id 
    AND tne.title = 'Discovery of the First Crystal'
);

INSERT INTO timeline_nested_events (timeline_event_id, title, description, date, image_url, image_alt, order_index)
SELECT 
    te.id,
    'The Crystal''s First Activation',
    'When the crystal was first successfully activated by the ancient mages.',
    'Year 105',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2ac1?w=600&h=400&fit=crop',
    'Crystal emanating magical energy',
    2
FROM timeline_events te 
WHERE te.title = 'The Great Awakening'
AND NOT EXISTS (
    SELECT 1 FROM timeline_nested_events tne 
    WHERE tne.timeline_event_id = te.id 
    AND tne.title = 'The Crystal''s First Activation'
);

-- Success message
SELECT 'Timeline image support added successfully! All ages, events, and sub-events now support images.' as result;