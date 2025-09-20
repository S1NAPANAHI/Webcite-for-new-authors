-- Fix Timeline System Issues
-- Run this in your Supabase SQL editor to fix current problems

-- 1. Fix integer overflow issue for order_index
ALTER TABLE timeline_events ALTER COLUMN order_index TYPE BIGINT;

-- 2. Create proper timeline_eras table
DROP TABLE IF EXISTS timeline_eras CASCADE;
CREATE TABLE timeline_eras (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    start_date VARCHAR(100),
    end_date VARCHAR(100),
    description TEXT,
    background_color VARCHAR(7) DEFAULT '#6b58c4',
    text_color VARCHAR(7) DEFAULT '#ffffff',
    is_active BOOLEAN DEFAULT true,
    order_index BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add foreign key constraint from events to eras
ALTER TABLE timeline_events 
DROP CONSTRAINT IF EXISTS fk_timeline_events_era;

ALTER TABLE timeline_events 
ADD CONSTRAINT fk_timeline_events_era 
FOREIGN KEY (era) REFERENCES timeline_eras(name) ON UPDATE CASCADE;

-- 4. Insert default eras (can be edited/deleted by admin)
INSERT INTO timeline_eras (name, start_date, end_date, description, background_color, order_index) VALUES
('Ancient Times', 'Beginning of Time', 'Year 500', 'The earliest recorded history', '#4f46e5', 1),
('Classical Period', 'Year 501', 'Year 1500', 'The golden age of civilization', '#f59e0b', 2),
('Medieval Era', 'Year 1501', 'Year 2500', 'The age of kingdoms and empires', '#7c2d12', 3),
('Renaissance', 'Year 2501', 'Year 3500', 'Revival of arts and learning', '#059669', 4),
('Modern Age', 'Year 3501', 'Present', 'The current era', '#8b5cf6', 5)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    background_color = EXCLUDED.background_color,
    order_index = EXCLUDED.order_index;

-- 5. Enable RLS on eras table
ALTER TABLE timeline_eras ENABLE ROW LEVEL SECURITY;

-- Public can read eras
CREATE POLICY IF NOT EXISTS "Anyone can view eras" ON timeline_eras
    FOR SELECT USING (is_active = true);

-- Admins can manage eras
CREATE POLICY IF NOT EXISTS "Admins can manage eras" ON timeline_eras
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 6. Auto-update trigger for eras
CREATE TRIGGER update_timeline_eras_updated_at 
    BEFORE UPDATE ON timeline_eras 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Delete sample data to give admin full control
DELETE FROM timeline_events WHERE title LIKE '%sample%' OR description LIKE '%sample data%';

-- 8. Grant permissions
GRANT ALL ON timeline_eras TO authenticated;
GRANT SELECT ON timeline_eras TO anon;

-- Success
SELECT 'Timeline system fixes applied successfully! You now have full admin control.' as result;