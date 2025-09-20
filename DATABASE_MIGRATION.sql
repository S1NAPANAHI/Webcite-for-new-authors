-- DATABASE MIGRATION: Add folder and bucket support to files table
-- Run this once in your Supabase SQL Editor

-- 1. Add new columns to files table
ALTER TABLE files 
  ADD COLUMN IF NOT EXISTS folder TEXT DEFAULT 'misc',
  ADD COLUMN IF NOT EXISTS bucket TEXT DEFAULT 'media',
  ADD COLUMN IF NOT EXISTS path TEXT; -- New path field that will be the primary storage path

-- 2. Migrate existing storage_path data to path field
UPDATE files 
SET path = storage_path 
WHERE path IS NULL AND storage_path IS NOT NULL;

-- 3. Update folder based on existing paths (backfill)
UPDATE files 
SET folder = 'banners' 
WHERE folder = 'misc' 
  AND (path ILIKE '%/banners/%' OR path ILIKE 'banners/%' OR storage_path ILIKE '%/banners/%' OR storage_path ILIKE 'banners/%');

UPDATE files 
SET folder = 'heroes' 
WHERE folder = 'misc' 
  AND (path ILIKE '%/heroes/%' OR path ILIKE 'heroes/%' OR storage_path ILIKE '%/heroes/%' OR storage_path ILIKE 'heroes/%');

UPDATE files 
SET folder = 'covers' 
WHERE folder = 'misc' 
  AND (path ILIKE '%/covers/%' OR path ILIKE 'covers/%' OR storage_path ILIKE '%/covers/%' OR storage_path ILIKE 'covers/%');

UPDATE files 
SET folder = 'characters' 
WHERE folder = 'misc' 
  AND (path ILIKE '%/characters/%' OR path ILIKE 'characters/%' OR storage_path ILIKE '%/characters/%' OR storage_path ILIKE 'characters/%');

UPDATE files 
SET folder = 'backgrounds' 
WHERE folder = 'misc' 
  AND (path ILIKE '%/backgrounds/%' OR path ILIKE 'backgrounds/%' OR storage_path ILIKE '%/backgrounds/%' OR storage_path ILIKE 'backgrounds/%');

-- 4. Add index for better performance
CREATE INDEX IF NOT EXISTS idx_files_folder ON files(folder);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(type);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);

-- 5. Add reading_progress table if it doesn't exist (fixes the 400 error)
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reading_time_minutes INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  current_page INTEGER DEFAULT 1,
  total_pages INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, chapter_id)
);

-- Enable RLS on reading_progress
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reading_progress
DROP POLICY IF EXISTS "Users can view own reading progress" ON reading_progress;
CREATE POLICY "Users can view own reading progress" ON reading_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reading progress" ON reading_progress;
CREATE POLICY "Users can insert own reading progress" ON reading_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reading progress" ON reading_progress;
CREATE POLICY "Users can update own reading progress" ON reading_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for reading_progress
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_chapter_id ON reading_progress(chapter_id);

-- 6. Verify migration
SELECT 
  COUNT(*) as total_files,
  COUNT(CASE WHEN folder = 'banners' THEN 1 END) as banners,
  COUNT(CASE WHEN folder = 'heroes' THEN 1 END) as heroes,
  COUNT(CASE WHEN folder = 'covers' THEN 1 END) as covers,
  COUNT(CASE WHEN folder = 'characters' THEN 1 END) as characters,
  COUNT(CASE WHEN folder = 'backgrounds' THEN 1 END) as backgrounds,
  COUNT(CASE WHEN folder = 'misc' THEN 1 END) as misc
FROM files;

-- Migration complete!
-- 
-- What this migration does:
-- 1. Adds folder and bucket columns to organize files
-- 2. Adds path column as the new primary storage path field
-- 3. Migrates existing storage_path data to the new path field
-- 4. Backfills folder based on existing file paths
-- 5. Creates the missing reading_progress table to fix 400 errors
-- 6. Adds proper indexes and RLS policies
--
-- After running this, your file uploader will save files in the correct folders
-- and your existing images should appear in the chapter cards and ebook reader.