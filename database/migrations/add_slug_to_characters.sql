-- Add slug column to characters table if it doesn't exist
-- This ensures character profile pages work properly

-- Add slug column (skip if already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'characters' AND column_name = 'slug'
  ) THEN
    ALTER TABLE characters ADD COLUMN slug TEXT;
  END IF;
END $$;

-- Make slug unique (skip if constraint already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'characters' AND constraint_name = 'characters_slug_key'
  ) THEN
    ALTER TABLE characters ADD CONSTRAINT characters_slug_key UNIQUE (slug);
  END IF;
END $$;

-- Generate slugs for existing characters that don't have them
UPDATE characters 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Create index for performance (skip if already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'characters' AND indexname = 'idx_characters_slug'
  ) THEN
    CREATE INDEX idx_characters_slug ON characters(slug);
  END IF;
END $$;

-- Verify the setup
SELECT 
  'SUCCESS: Slug column ready!' as status,
  COUNT(*) as total_characters,
  COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as characters_with_slugs
FROM characters;