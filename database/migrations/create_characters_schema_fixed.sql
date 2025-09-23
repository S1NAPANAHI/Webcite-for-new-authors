-- Character Management Schema for Zoroasterverse (FIXED VERSION)
-- This creates a comprehensive character management system with relationships, abilities, and appearances

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE character_type AS ENUM (
  'protagonist',
  'antagonist', 
  'supporting',
  'minor',
  'cameo',
  'narrator',
  'mentor',
  'villain',
  'anti-hero'
);

CREATE TYPE character_status AS ENUM (
  'alive',
  'deceased',
  'missing', 
  'unknown',
  'immortal'
);

CREATE TYPE power_level AS ENUM (
  'mortal',
  'enhanced',
  'supernatural',
  'divine',
  'cosmic',
  'omnipotent'
);

CREATE TYPE relationship_type AS ENUM (
  'family',
  'friend',
  'ally',
  'enemy',
  'rival',
  'mentor',
  'student',
  'love_interest',
  'neutral',
  'complex'
);

CREATE TYPE ability_category AS ENUM (
  'magical',
  'physical',
  'mental',
  'social',
  'technological',
  'divine'
);

CREATE TYPE character_importance AS ENUM ('major', 'minor', 'cameo');

-- =============================================================================
-- MAIN CHARACTERS TABLE
-- =============================================================================

CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT, -- Noble titles, nicknames, etc.
  aliases TEXT[], -- Alternative names
  
  -- Description & Appearance
  description TEXT NOT NULL,
  age INTEGER,
  age_description TEXT, -- "Ancient", "Teenage", etc.
  gender TEXT,
  species TEXT DEFAULT 'Human',
  occupation TEXT,
  location TEXT, -- Current location
  origin TEXT, -- Where they're from
  
  -- Character Classification
  character_type character_type NOT NULL DEFAULT 'minor',
  status character_status NOT NULL DEFAULT 'alive',
  power_level power_level NOT NULL DEFAULT 'mortal',
  importance_score INTEGER NOT NULL DEFAULT 50 CHECK (importance_score >= 0 AND importance_score <= 100),
  
  -- Visual & Media
  portrait_file_id UUID, -- References files(id) - FK constraint added later if needed
  portrait_url TEXT, -- External URL fallback
  gallery_file_ids UUID[], -- Additional images
  color_theme TEXT, -- Hex color for theming
  
  -- Physical Description
  height TEXT,
  build TEXT,
  hair_color TEXT,
  eye_color TEXT,
  distinguishing_features TEXT,
  
  -- Personality & Background
  personality_traits TEXT[],
  background_summary TEXT,
  motivations TEXT[],
  fears TEXT[],
  goals TEXT[],
  
  -- Skills & Abilities
  skills TEXT[],
  weaknesses TEXT[],
  
  -- Story Integration
  first_appearance_content_id UUID, -- References content_items(id) - FK constraint added later if needed
  last_appearance_content_id UUID, -- References content_items(id) - FK constraint added later if needed
  character_arc_summary TEXT,
  
  -- Faction & Allegiance
  primary_faction TEXT,
  allegiances TEXT[],
  
  -- Metadata
  is_major_character BOOLEAN DEFAULT FALSE,
  is_pov_character BOOLEAN DEFAULT FALSE, -- Point of view character
  is_spoiler_sensitive BOOLEAN DEFAULT FALSE,
  spoiler_tags TEXT[],
  
  -- SEO & Metadata
  meta_description TEXT,
  meta_keywords TEXT[],
  
  -- Search (FIXED - using regular column with trigger)
  search_vector tsvector,
  
  -- Admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_user_id UUID -- References users(id) - FK constraint added later if needed
);

-- =============================================================================
-- CHARACTER ABILITIES
-- =============================================================================

CREATE TABLE character_abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  power_level power_level NOT NULL DEFAULT 'mortal',
  category ability_category NOT NULL,
  mastery_level INTEGER NOT NULL DEFAULT 5 CHECK (mastery_level >= 1 AND mastery_level <= 10),
  
  -- Metadata
  is_signature_ability BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE, -- For spoiler-sensitive abilities
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- CHARACTER RELATIONSHIPS
-- =============================================================================

CREATE TABLE character_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  related_character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  
  relationship_type relationship_type NOT NULL,
  description TEXT,
  strength INTEGER NOT NULL DEFAULT 0 CHECK (strength >= -10 AND strength <= 10), -- -10 to 10 scale
  is_mutual BOOLEAN DEFAULT FALSE,
  
  -- Timeline
  started_at TEXT, -- When relationship began (can be story reference)
  ended_at TEXT, -- When relationship ended (if applicable)
  
  -- Metadata
  is_spoiler_sensitive BOOLEAN DEFAULT FALSE,
  spoiler_tags TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate relationships
  UNIQUE(character_id, related_character_id)
);

-- =============================================================================
-- CHARACTER APPEARANCES (in content)
-- =============================================================================

CREATE TABLE character_appearances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  content_item_id UUID, -- References content_items(id) - FK constraint added later if needed
  chapter_id UUID, -- References chapters(id) - FK constraint added later if needed
  
  importance character_importance NOT NULL DEFAULT 'minor',
  first_mention_at TEXT, -- Page/chapter reference
  description TEXT, -- Character's role in this content
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- CHARACTER VERSIONS (for character evolution tracking)
-- =============================================================================

CREATE TABLE character_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  
  version_name TEXT NOT NULL, -- "Young Zoroaster", "Prophet Zoroaster", etc.
  description TEXT NOT NULL,
  age_range TEXT,
  time_period TEXT,
  
  -- Version-specific attributes
  portrait_file_id UUID, -- References files(id) - FK constraint added later if needed
  power_level power_level,
  personality_changes TEXT[],
  
  -- Story context
  first_appearance_content_id UUID, -- References content_items(id) - FK constraint added later if needed
  last_appearance_content_id UUID, -- References content_items(id) - FK constraint added later if needed
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Characters
CREATE INDEX idx_characters_slug ON characters(slug);
CREATE INDEX idx_characters_type ON characters(character_type);
CREATE INDEX idx_characters_status ON characters(status);
CREATE INDEX idx_characters_power_level ON characters(power_level);
CREATE INDEX idx_characters_importance ON characters(importance_score);
CREATE INDEX idx_characters_major ON characters(is_major_character);
CREATE INDEX idx_characters_pov ON characters(is_pov_character);
CREATE INDEX idx_characters_faction ON characters(primary_faction);
CREATE INDEX idx_characters_search ON characters USING GIN(search_vector);
CREATE INDEX idx_characters_created_at ON characters(created_at);

-- Abilities
CREATE INDEX idx_character_abilities_character ON character_abilities(character_id);
CREATE INDEX idx_character_abilities_category ON character_abilities(category);
CREATE INDEX idx_character_abilities_power ON character_abilities(power_level);

-- Relationships
CREATE INDEX idx_character_relationships_character ON character_relationships(character_id);
CREATE INDEX idx_character_relationships_related ON character_relationships(related_character_id);
CREATE INDEX idx_character_relationships_type ON character_relationships(relationship_type);
CREATE INDEX idx_character_relationships_strength ON character_relationships(strength);

-- Appearances
CREATE INDEX idx_character_appearances_character ON character_appearances(character_id);
CREATE INDEX idx_character_appearances_content ON character_appearances(content_item_id);
CREATE INDEX idx_character_appearances_chapter ON character_appearances(chapter_id);
CREATE INDEX idx_character_appearances_importance ON character_appearances(importance);

-- Versions
CREATE INDEX idx_character_versions_character ON character_versions(character_id);

-- =============================================================================
-- TRIGGERS & FUNCTIONS
-- =============================================================================

-- Update updated_at on all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Search vector update function (FIXED)
CREATE OR REPLACE FUNCTION update_character_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        coalesce(NEW.name, '') || ' ' ||
        coalesce(NEW.title, '') || ' ' ||
        coalesce(array_to_string(NEW.aliases, ' '), '') || ' ' ||
        coalesce(NEW.description, '') || ' ' ||
        coalesce(NEW.background_summary, '')
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_characters_updated_at 
    BEFORE UPDATE ON characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_search_vector 
    BEFORE INSERT OR UPDATE ON characters
    FOR EACH ROW EXECUTE FUNCTION update_character_search_vector();

CREATE TRIGGER update_character_abilities_updated_at 
    BEFORE UPDATE ON character_abilities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_relationships_updated_at 
    BEFORE UPDATE ON character_relationships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_appearances_updated_at 
    BEFORE UPDATE ON character_appearances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_versions_updated_at 
    BEFORE UPDATE ON character_versions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- RLS (Row Level Security)
-- =============================================================================

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_appearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_versions ENABLE ROW LEVEL SECURITY;

-- Public read access to published characters
CREATE POLICY "Public characters are viewable by everyone" ON characters
    FOR SELECT USING (NOT is_spoiler_sensitive OR current_user = 'admin');

-- Admin full access (adjust based on your auth system)
CREATE POLICY "Admins can do everything with characters" ON characters
    FOR ALL USING (current_user = 'admin');

-- Similar policies for related tables
CREATE POLICY "Public character abilities are viewable" ON character_abilities
    FOR SELECT USING (NOT is_hidden OR current_user = 'admin');

CREATE POLICY "Admins can manage character abilities" ON character_abilities
    FOR ALL USING (current_user = 'admin');

CREATE POLICY "Public character relationships are viewable" ON character_relationships
    FOR SELECT USING (NOT is_spoiler_sensitive OR current_user = 'admin');

CREATE POLICY "Admins can manage character relationships" ON character_relationships
    FOR ALL USING (current_user = 'admin');

CREATE POLICY "Public character appearances are viewable" ON character_appearances
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage character appearances" ON character_appearances
    FOR ALL USING (current_user = 'admin');

CREATE POLICY "Public character versions are viewable" ON character_versions
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage character versions" ON character_versions
    FOR ALL USING (current_user = 'admin');

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================

-- Get character with all relationships and abilities
CREATE OR REPLACE FUNCTION get_character_details(character_slug TEXT)
RETURNS TABLE (
  character_data jsonb,
  abilities_data jsonb,
  relationships_data jsonb,
  appearances_data jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(c.*) as character_data,
    COALESCE(jsonb_agg(DISTINCT ca.*) FILTER (WHERE ca.id IS NOT NULL), '[]'::jsonb) as abilities_data,
    COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
      'id', cr.id,
      'relationship_type', cr.relationship_type,
      'description', cr.description,
      'strength', cr.strength,
      'is_mutual', cr.is_mutual,
      'related_character', jsonb_build_object(
        'id', rc.id,
        'name', rc.name,
        'slug', rc.slug,
        'character_type', rc.character_type,
        'portrait_url', rc.portrait_url
      )
    )) FILTER (WHERE cr.id IS NOT NULL), '[]'::jsonb) as relationships_data,
    COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
      'id', cap.id,
      'importance', cap.importance,
      'description', cap.description,
      'content_item_id', cap.content_item_id,
      'chapter_id', cap.chapter_id
    )) FILTER (WHERE cap.id IS NOT NULL), '[]'::jsonb) as appearances_data
  FROM characters c
  LEFT JOIN character_abilities ca ON c.id = ca.character_id
  LEFT JOIN character_relationships cr ON c.id = cr.character_id
  LEFT JOIN characters rc ON cr.related_character_id = rc.id
  LEFT JOIN character_appearances cap ON c.id = cap.character_id
  WHERE c.slug = character_slug
  GROUP BY c.id;
END;
$$ LANGUAGE plpgsql;

-- Character search function
CREATE OR REPLACE FUNCTION search_characters(
  search_query TEXT DEFAULT NULL,
  character_types character_type[] DEFAULT NULL,
  character_statuses character_status[] DEFAULT NULL,
  power_levels power_level[] DEFAULT NULL,
  min_importance INTEGER DEFAULT NULL,
  max_importance INTEGER DEFAULT NULL,
  is_major_only BOOLEAN DEFAULT NULL,
  is_pov_only BOOLEAN DEFAULT NULL,
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  title TEXT,
  description TEXT,
  character_type character_type,
  status character_status,
  power_level power_level,
  importance_score INTEGER,
  is_major_character BOOLEAN,
  is_pov_character BOOLEAN,
  portrait_url TEXT,
  appearance_count BIGINT,
  relationship_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.slug,
    c.title,
    c.description,
    c.character_type,
    c.status,
    c.power_level,
    c.importance_score,
    c.is_major_character,
    c.is_pov_character,
    c.portrait_url,
    COUNT(DISTINCT cap.id) as appearance_count,
    COUNT(DISTINCT cr.id) as relationship_count
  FROM characters c
  LEFT JOIN character_appearances cap ON c.id = cap.character_id
  LEFT JOIN character_relationships cr ON c.id = cr.character_id
  WHERE 
    (search_query IS NULL OR c.search_vector @@ plainto_tsquery('english', search_query))
    AND (character_types IS NULL OR c.character_type = ANY(character_types))
    AND (character_statuses IS NULL OR c.status = ANY(character_statuses))
    AND (power_levels IS NULL OR c.power_level = ANY(power_levels))
    AND (min_importance IS NULL OR c.importance_score >= min_importance)
    AND (max_importance IS NULL OR c.importance_score <= max_importance)
    AND (is_major_only IS NULL OR c.is_major_character = is_major_only)
    AND (is_pov_only IS NULL OR c.is_pov_character = is_pov_only)
  GROUP BY c.id
  ORDER BY 
    CASE WHEN search_query IS NOT NULL THEN ts_rank(c.search_vector, plainto_tsquery('english', search_query)) END DESC,
    c.importance_score DESC,
    c.name ASC
  LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SAMPLE DATA
-- =============================================================================

-- Insert sample character (Zoroaster)
INSERT INTO characters (
  name,
  slug,
  title,
  aliases,
  description,
  character_type,
  status,
  power_level,
  importance_score,
  species,
  occupation,
  location,
  origin,
  personality_traits,
  primary_faction,
  allegiances,
  is_major_character,
  is_pov_character,
  background_summary
) VALUES (
  'Zoroaster Zarathustra',
  'zoroaster-zarathustra',
  'The Prophet',
  ARRAY['Zarathustra', 'The Blessed One'],
  'The central figure of Zoroastrianism and the founding prophet of the religion. A wise teacher who received divine revelations and established the principles of good thoughts, good words, and good deeds.',
  'protagonist',
  'immortal',
  'divine',
  100,
  'Human (Divinely Blessed)',
  'Prophet, Teacher',
  'The Sacred Flame Temple',
  'Ancient Persia',
  ARRAY['Wise', 'Compassionate', 'Determined', 'Righteous'],
  'Forces of Light',
  ARRAY['Ahura Mazda', 'Followers of Truth'],
  true,
  true,
  'Born into a world of spiritual darkness, Zoroaster received divine visions from Ahura Mazda and became the prophet of a revolutionary new religion based on the eternal struggle between good and evil.'
);

-- Insert sample abilities
INSERT INTO character_abilities (character_id, name, description, power_level, category, mastery_level, is_signature_ability)
SELECT 
  c.id,
  'Divine Revelation',
  'Ability to receive and interpret messages directly from Ahura Mazda',
  'divine',
  'divine',
  10,
  true
FROM characters c WHERE c.slug = 'zoroaster-zarathustra';

INSERT INTO character_abilities (character_id, name, description, power_level, category, mastery_level)
SELECT 
  c.id,
  'Flame Mastery',
  'Control over sacred fire and ability to kindle eternal flames',
  'supernatural',
  'magical',
  9
FROM characters c WHERE c.slug = 'zoroaster-zarathustra';

-- Additional sample characters
INSERT INTO characters (name, slug, title, description, character_type, status, power_level, importance_score, is_major_character) VALUES
('Angra Mainyu', 'angra-mainyu', 'The Destructive Spirit', 'The primary antagonist of Zoroastrianism, representing all that is evil and destructive in the world.', 'antagonist', 'immortal', 'divine', 95, true),
('Spenta Armaiti', 'spenta-armaiti', 'Holy Devotion', 'One of the Amesha Spentas, representing devotion, serenity, and the earth.', 'supporting', 'immortal', 'divine', 80, true),
('King Vishtaspa', 'king-vishtaspa', 'Royal Patron', 'The king who became Zoroaster''s first royal convert and helped spread the faith.', 'supporting', 'deceased', 'mortal', 70, true),
('Jamasp', 'jamasp', 'The Wise Counselor', 'Zoroaster''s cousin and one of his first disciples, known for his wisdom and counsel.', 'supporting', 'deceased', 'mortal', 60, false),
('Hvovi', 'hvovi', 'The Faithful Wife', 'Zoroaster''s devoted wife who supported his mission and bore him children.', 'minor', 'deceased', 'mortal', 55, false);

-- Sample relationships
INSERT INTO character_relationships (character_id, related_character_id, relationship_type, description, strength, is_mutual)
SELECT 
  (SELECT id FROM characters WHERE slug = 'zoroaster-zarathustra'),
  (SELECT id FROM characters WHERE slug = 'angra-mainyu'),
  'enemy',
  'Eternal cosmic adversaries in the battle between good and evil',
  -10,
  true;

INSERT INTO character_relationships (character_id, related_character_id, relationship_type, description, strength, is_mutual)
SELECT 
  (SELECT id FROM characters WHERE slug = 'zoroaster-zarathustra'),
  (SELECT id FROM characters WHERE slug = 'hvovi'),
  'love_interest',
  'Devoted husband and wife partnership in spreading the faith',
  10,
  true;

-- Grant necessary permissions (adjust based on your auth system)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;