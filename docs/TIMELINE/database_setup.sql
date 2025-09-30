-- COSMIC TIMELINE DATABASE SEEDING SCRIPT
-- Copy and paste this entire script into your Supabase SQL Editor

-- Enable RLS (Row Level Security) for the new tables
-- Run this entire script in one go

BEGIN;

-- Create Ages table
CREATE TABLE IF NOT EXISTS ages (
    id SERIAL PRIMARY KEY,
    age_number INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    glyph TEXT NOT NULL,
    color_code TEXT NOT NULL,
    description TEXT,
    start_year INTEGER,
    end_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    book_number INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    glyph TEXT NOT NULL,
    color_code TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Book-Age relationships table
CREATE TABLE IF NOT EXISTS book_age_spans (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    age_id INTEGER REFERENCES ages(id) ON DELETE CASCADE,
    UNIQUE(book_id, age_id)
);

-- Insert the 9 Ages of Zoroasterverse
INSERT INTO ages (age_number, name, title, glyph, color_code, description, start_year, end_year) VALUES
(1, 'First Age', 'Dawn of Creation', 'sun-disc', '#FFD700', 'The cosmic awakening and the first light piercing the primordial darkness.', -10000, -8000),
(2, 'Second Age', 'Wings of Time', 'wings', '#3B1C6E', 'The age of celestial movements and the establishment of cosmic order.', -8000, -6000),
(3, 'Third Age', 'Rise of Humanity', 'human-figure', '#8B4513', 'The emergence of conscious beings and the first civilizations.', -6000, -4000),
(4, 'Fourth Age', 'Sacred Flames', 'fire-altar', '#DC143C', 'The age of spiritual awakening and the discovery of divine fire.', -4000, -2000),
(5, 'Fifth Age', 'Serpents Wisdom', 'serpent', '#228B22', 'The time of great knowledge and the temptation of forbidden wisdom.', -2000, 0),
(6, 'Sixth Age', 'Horizons Promise', 'horizon-sun', '#FF8C00', 'The age of exploration and the expansion beyond known boundaries.', 0, 2000),
(7, 'Seventh Age', 'Twin Flames', 'twin-flame', '#4169E1', 'The era of duality and the great cosmic balance.', 2000, 4000),
(8, 'Eighth Age', 'Star Paths', 'constellation', '#9932CC', 'The time of celestial navigation and cosmic consciousness.', 4000, 6000),
(9, 'Ninth Age', 'Final Gateway', 'archway', '#B22222', 'The culminating age and the approach to ultimate transformation.', 6000, 8000)
ON CONFLICT (age_number) DO NOTHING;

-- Insert the 5 Books of Chronicles
INSERT INTO books (book_number, title, glyph, color_code, description) VALUES
(1, 'Foundation Chronicles', 'sword', '#708090', 'The origins and early struggles of the cosmic order.'),
(2, 'Archive of Ages', 'archive', '#2F4F4F', 'The collected wisdom and records of all ages.'),
(3, 'Spiral of Time', 'spiral', '#800080', 'The cyclical nature of cosmic events and their interconnections.'),
(4, 'Dragons Testament', 'dragon', '#B8860B', 'The prophecies and the great cosmic dragons role.'),
(5, 'Final Scroll', 'scroll', '#A0522D', 'The ultimate revelations and the end of the cosmic cycle.')
ON CONFLICT (book_number) DO NOTHING;

-- Create book-age relationships (books span multiple ages)
INSERT INTO book_age_spans (book_id, age_id) VALUES
-- Foundation Chronicles (Book 1) spans First 3 ages
(1, 1), (1, 2), (1, 3),
-- Archive of Ages (Book 2) spans all ages  
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9),
-- Spiral of Time (Book 3) spans middle ages
(3, 4), (3, 5), (3, 6),
-- Dragons Testament (Book 4) spans later ages
(4, 6), (4, 7), (4, 8),
-- Final Scroll (Book 5) spans final ages
(5, 8), (5, 9)
ON CONFLICT (book_id, age_id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE ages ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_age_spans ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read on ages" ON ages FOR SELECT USING (true);
CREATE POLICY "Allow public read on books" ON books FOR SELECT USING (true);
CREATE POLICY "Allow public read on book_age_spans" ON book_age_spans FOR SELECT USING (true);

COMMIT;

-- Verify the installation
SELECT 'VERIFICATION RESULTS' as status;
SELECT 'Ages Created:' as table_name, COUNT(*) as count FROM ages
UNION ALL
SELECT 'Books Created:', COUNT(*) FROM books
UNION ALL
SELECT 'Book-Age Relationships:', COUNT(*) FROM book_age_spans;

-- Show sample data
SELECT 'SAMPLE AGE DATA' as info;
SELECT age_number, name, title, glyph, color_code FROM ages ORDER BY age_number LIMIT 3;

SELECT 'SAMPLE BOOK DATA' as info;
SELECT book_number, title, glyph, color_code FROM books ORDER BY book_number LIMIT 3;
