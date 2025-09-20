-- ================================================
-- COMPLETE FILES & MEDIA SYSTEM DATABASE MIGRATION
-- ================================================
-- This migration creates the complete file management system
-- for your content management platform.

-- Drop existing objects if they exist (for clean migration)
DROP POLICY IF EXISTS "Admin upload" ON storage.objects;
DROP POLICY IF EXISTS "Public read" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage files" ON public.files;
DROP POLICY IF EXISTS "Public can view files" ON public.files;
DROP VIEW IF EXISTS public.chapters_with_files;
DROP VIEW IF EXISTS public.content_items_with_files;
DROP FUNCTION IF EXISTS get_file_with_url(uuid);
DROP FUNCTION IF EXISTS get_file_url(public.files);
DROP FUNCTION IF EXISTS cleanup_unused_files();
DROP FUNCTION IF EXISTS update_files_updated_at();
DROP TRIGGER IF EXISTS files_updated_at_trigger ON public.files;
DROP TABLE IF EXISTS public.files CASCADE;

-- ================================================
-- 1. CREATE FILES TABLE
-- ================================================
CREATE TABLE public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- File identification
  name text NOT NULL,                    -- Display name (without extension)
  original_name text NOT NULL,           -- Original filename with extension
  
  -- File classification  
  type text NOT NULL DEFAULT 'other',    -- Category: images, videos, audio, documents, other
  mime_type text NOT NULL,               -- MIME type (image/jpeg, video/mp4, etc.)
  
  -- File properties
  size bigint NOT NULL DEFAULT 0,
  width integer,                         -- For images/videos
  height integer,                        -- For images/videos  
  duration integer,                      -- For videos/audio (seconds)
  
  -- Storage information
  storage_path text NOT NULL UNIQUE,     -- Path in Supabase storage
  url text,                             -- Public URL (auto-generated)
  thumbnail_url text,                   -- Thumbnail URL (auto-generated)
  
  -- Organization
  folder text NOT NULL DEFAULT 'misc',  -- Folder: covers, heroes, banners, characters, etc.
  tags text[] DEFAULT '{}',              -- Searchable tags
  
  -- Metadata
  alt_text text,                        -- Accessibility description
  description text,                     -- Detailed description
  metadata jsonb DEFAULT '{}',          -- Additional metadata
  
  -- Timestamps and ownership
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ================================================
-- 2. ADD INDEXES FOR PERFORMANCE
-- ================================================
CREATE INDEX files_created_at_idx ON public.files(created_at DESC);
CREATE INDEX files_type_idx ON public.files(type);
CREATE INDEX files_folder_idx ON public.files(folder);
CREATE INDEX files_created_by_idx ON public.files(created_by);
CREATE INDEX files_tags_gin_idx ON public.files USING GIN(tags);
CREATE INDEX files_name_search_idx ON public.files(name text_pattern_ops);

-- ================================================
-- 3. ADD FILE REFERENCE COLUMNS TO EXISTING TABLES
-- ================================================

-- Add cover file support to content_items
ALTER TABLE public.content_items 
ADD COLUMN IF NOT EXISTS cover_file_id uuid REFERENCES public.files(id) ON DELETE SET NULL;

-- Add hero and banner file support to chapters
ALTER TABLE public.chapters 
ADD COLUMN IF NOT EXISTS hero_file_id uuid REFERENCES public.files(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS banner_file_id uuid REFERENCES public.files(id) ON DELETE SET NULL;

-- Add word count and reading time to chapters (if not exists)
ALTER TABLE public.chapters 
ADD COLUMN IF NOT EXISTS word_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_read_time integer DEFAULT 0;

-- ================================================
-- 4. UTILITY FUNCTIONS
-- ================================================

-- Function to generate file URL
CREATE OR REPLACE FUNCTION get_file_url(file_row public.files)
RETURNS text AS $$
BEGIN
  IF file_row.url IS NOT NULL THEN
    RETURN file_row.url;
  END IF;
  
  IF file_row.storage_path IS NOT NULL THEN
    -- Generate Supabase storage URL
    RETURN format('https://your-project-id.supabase.co/storage/v1/object/public/media/%s', 
                  file_row.storage_path);
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get file with computed URL
CREATE OR REPLACE FUNCTION get_file_with_url(file_id uuid)
RETURNS TABLE(
  id uuid,
  name text,
  url text,
  width integer,
  height integer,
  alt_text text,
  folder text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.name,
    get_file_url(f) as url,
    f.width,
    f.height,
    f.alt_text,
    f.folder
  FROM public.files f
  WHERE f.id = file_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to cleanup unused files (run periodically)
CREATE OR REPLACE FUNCTION cleanup_unused_files()
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Delete files not referenced anywhere and older than 7 days
  WITH unused_files AS (
    DELETE FROM public.files 
    WHERE id NOT IN (
      SELECT cover_file_id FROM public.content_items WHERE cover_file_id IS NOT NULL
      UNION
      SELECT hero_file_id FROM public.chapters WHERE hero_file_id IS NOT NULL
      UNION  
      SELECT banner_file_id FROM public.chapters WHERE banner_file_id IS NOT NULL
    )
    AND created_at < now() - interval '7 days'
    RETURNING 1
  )
  SELECT count(*) INTO deleted_count FROM unused_files;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 5. UPDATE TRIGGER
-- ================================================
CREATE OR REPLACE FUNCTION update_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER files_updated_at_trigger
  BEFORE UPDATE ON public.files
  FOR EACH ROW
  EXECUTE FUNCTION update_files_updated_at();

-- ================================================
-- 6. ENHANCED VIEWS WITH FILE INTEGRATION
-- ================================================

-- Content items with cover files
CREATE VIEW content_items_with_files AS
SELECT 
  ci.*,
  -- Cover file information
  cf.id as cover_file_id,
  cf.name as cover_file_name,
  get_file_url(cf) as cover_file_url,
  cf.width as cover_file_width,
  cf.height as cover_file_height,
  cf.alt_text as cover_file_alt_text
FROM public.content_items ci
LEFT JOIN public.files cf ON ci.cover_file_id = cf.id;

-- Chapters with hero and banner files
CREATE VIEW chapters_with_files AS
SELECT 
  ch.*,
  -- Hero file information
  hf.id as hero_file_id,
  hf.name as hero_file_name,
  get_file_url(hf) as hero_file_url,
  hf.width as hero_file_width,
  hf.height as hero_file_height,
  hf.alt_text as hero_file_alt_text,
  -- Banner file information
  bf.id as banner_file_id,
  bf.name as banner_file_name,
  get_file_url(bf) as banner_file_url,
  bf.width as banner_file_width,
  bf.height as banner_file_height,
  bf.alt_text as banner_file_alt_text
FROM public.chapters ch
LEFT JOIN public.files hf ON ch.hero_file_id = hf.id
LEFT JOIN public.files bf ON ch.banner_file_id = bf.id;

-- ================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ================================================
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Admin users can manage all files
CREATE POLICY "Admins can manage files" ON public.files
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Public can view files (needed for serving images on frontend)
CREATE POLICY "Public can view files" ON public.files
FOR SELECT USING (true);

-- Users can view their own uploaded files
CREATE POLICY "Users can view own files" ON public.files
FOR SELECT USING (created_by = auth.uid());

-- ================================================
-- 8. STORAGE BUCKET SETUP
-- ================================================
-- NOTE: You need to create the 'media' storage bucket in Supabase Dashboard
-- Then add these policies in Dashboard > Storage > media bucket > Policies:

-- Policy 1: "Admin file upload" (INSERT)
-- Target roles: authenticated
-- Policy definition:
/*
(
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
*/

-- Policy 2: "Public file access" (SELECT)
-- Target roles: anon, authenticated  
-- Policy definition: true

-- Policy 3: "Admin file delete" (DELETE)
-- Target roles: authenticated
-- Policy definition:
/*
(
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
*/

-- ================================================
-- 9. GRANT PERMISSIONS
-- ================================================
GRANT SELECT ON public.files TO anon, authenticated;
GRANT ALL ON public.files TO service_role;
GRANT SELECT ON public.content_items_with_files TO anon, authenticated;
GRANT SELECT ON public.chapters_with_files TO anon, authenticated;

-- ================================================
-- 10. SAMPLE DATA INSERTION (OPTIONAL)
-- ================================================
-- Uncomment to add sample folder structure
/*
INSERT INTO public.files (name, original_name, type, mime_type, size, folder, storage_path, created_by) VALUES
('sample-hero', 'sample-hero.jpg', 'images', 'image/jpeg', 150000, 'heroes', 'sample/hero.jpg', '00000000-0000-0000-0000-000000000000'),
('sample-banner', 'sample-banner.jpg', 'images', 'image/jpeg', 200000, 'banners', 'sample/banner.jpg', '00000000-0000-0000-0000-000000000000'),
('sample-cover', 'sample-cover.jpg', 'images', 'image/jpeg', 180000, 'covers', 'sample/cover.jpg', '00000000-0000-0000-0000-000000000000');
*/

-- ================================================
-- MIGRATION COMPLETE!
-- ================================================
-- After running this migration:
-- 1. Create 'media' storage bucket in Supabase Dashboard
-- 2. Add the storage policies mentioned in section 8
-- 3. Test file upload functionality in your app
-- 4. The ImageInput component will now work correctly