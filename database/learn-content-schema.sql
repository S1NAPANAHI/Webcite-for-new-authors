-- Learn Content Management System Database Schema
-- Run this in your Supabase SQL Editor

-- Learn Content Table
CREATE TABLE IF NOT EXISTS learn_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE learn_content ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published content
CREATE POLICY "Public read access to published learn content" ON learn_content
  FOR SELECT USING (status = 'published');

-- Policy for authenticated admin access
CREATE POLICY "Admin full access to learn content" ON learn_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_learn_content_updated_at BEFORE UPDATE ON learn_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO learn_content (title, content, category, difficulty, status) VALUES 
(
  'Introduction to Zoroastrianism',
  'Zoroastrianism is one of the world''s oldest monotheistic religions, founded by the prophet Zoroaster in ancient Persia. This ancient faith has profoundly influenced many other world religions and continues to be practiced today by Parsi communities around the world.

The core teaching of Zoroastrianism centers around the worship of Ahura Mazda, the "Wise Lord," who is the supreme deity. Zoroaster taught that there is a cosmic battle between good and evil, light and darkness, truth and falsehood.

Key principles include:
- Good Thoughts (Humata)
- Good Words (Hukhta)  
- Good Deeds (Hvarshta)

These three pillars form the foundation of Zoroastrian ethics and guide believers in their daily lives.',
  'Basics',
  'beginner',
  'published'
),
(
  'The Avesta: Sacred Texts',
  'The Avesta is the primary collection of sacred texts of Zoroastrianism. It contains the liturgical texts and hymns used in Zoroastrian worship, including the Gathas, which are believed to be the direct teachings of Zoroaster himself.

The Avesta is written in the Avestan language, an ancient Iranian language closely related to Sanskrit. The texts cover various aspects of Zoroastrian theology, cosmology, and ritual practices.

Main sections include:
- Yasna: Contains the Gathas and liturgical texts
- Visperad: Liturgical extensions to the Yasna
- Vendidad: Laws and purification rituals
- Yashts: Hymns to various divine beings
- Khordeh Avesta: "Little Avesta" for daily prayers',
  'Sacred Texts',
  'intermediate',
  'published'
),
(
  'Fire Temples and Sacred Fire',
  'Fire holds a sacred place in Zoroastrian worship as a symbol of Ahura Mazda''s light and purity. Fire temples, called Atash Bahram or Agiary, are the centers of Zoroastrian religious life where the sacred fire is maintained.

There are different grades of fire temples:
- Atash Bahram: The highest grade, with fire consecrated through elaborate rituals
- Atash Adaran: Mid-level temples  
- Atash Dadgah: Local community fire temples

The sacred fire is never allowed to be extinguished and is tended continuously by priests. Zoroastrians face the fire during prayer as a focal point for devotion, though they worship Ahura Mazda, not the fire itself.

Fire represents:
- Divine light and wisdom
- Purity and truth
- The presence of Ahura Mazda
- Protection against evil',
  'Practices',
  'beginner',
  'published'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learn_content_status ON learn_content(status);
CREATE INDEX IF NOT EXISTS idx_learn_content_category ON learn_content(category);
CREATE INDEX IF NOT EXISTS idx_learn_content_difficulty ON learn_content(difficulty);
CREATE INDEX IF NOT EXISTS idx_learn_content_created_at ON learn_content(created_at);
CREATE INDEX IF NOT EXISTS idx_learn_content_tags ON learn_content USING gin(tags);
