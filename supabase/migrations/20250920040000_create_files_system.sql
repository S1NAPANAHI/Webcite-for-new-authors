-- Create files table for media management
CREATE TABLE IF NOT EXISTS public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL DEFAULT 'media',
  path text NOT NULL UNIQUE,
  name text NOT NULL,
  original_name text,
  mimetype text NOT NULL,
  size bigint NOT NULL,
  width integer,
  height integer,
  alt_text text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS files_created_at_idx ON public.files(created_at DESC);
CREATE INDEX IF NOT EXISTS files_mimetype_idx ON public.files(mimetype);
CREATE INDEX IF NOT EXISTS files_uploaded_by_idx ON public.files(uploaded_by);
CREATE INDEX IF NOT EXISTS files_tags_idx ON public.files USING GIN(tags);

-- Add RLS policies
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Admin users can manage all files
CREATE POLICY "Admins can manage files" ON public.files
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Public can view files (for serving images)
CREATE POLICY "Public can view files" ON public.files
FOR SELECT USING (true);

-- Add file reference columns to existing tables
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS cover_file_id uuid REFERENCES public.files(id);
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS hero_file_id uuid REFERENCES public.files(id);
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS banner_file_id uuid REFERENCES public.files(id);

-- Function to get file URL
CREATE OR REPLACE FUNCTION get_file_url(file_row public.files)
RETURNS text AS $$
BEGIN
  IF file_row.id IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN format('https://%s.supabase.co/storage/v1/object/public/%s/%s',
    current_setting('app.settings.project_id', true),
    file_row.bucket,
    file_row.path
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get file with URL
CREATE OR REPLACE FUNCTION get_file_with_url(file_id uuid)
RETURNS TABLE(
  id uuid,
  name text,
  url text,
  width integer,
  height integer,
  alt_text text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.name,
    get_file_url(f) as url,
    f.width,
    f.height,
    f.alt_text
  FROM public.files f
  WHERE f.id = file_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to cleanup unused files (optional, run periodically)
CREATE OR REPLACE FUNCTION cleanup_unused_files()
RETURNS void AS $$
BEGIN
  DELETE FROM public.files 
  WHERE id NOT IN (
    SELECT cover_file_id FROM public.content_items WHERE cover_file_id IS NOT NULL
    UNION
    SELECT hero_file_id FROM public.chapters WHERE hero_file_id IS NOT NULL
    UNION  
    SELECT banner_file_id FROM public.chapters WHERE banner_file_id IS NOT NULL
  )
  AND created_at < now() - interval '7 days';
END;
$$ LANGUAGE plpgsql;

-- Update trigger for files
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

-- Enhanced content_items view with file URLs
CREATE OR REPLACE VIEW content_items_with_files AS
SELECT 
  ci.*,
  cf.name as cover_file_name,
  get_file_url(cf) as cover_file_url,
  cf.width as cover_file_width,
  cf.height as cover_file_height,
  cf.alt_text as cover_file_alt_text
FROM public.content_items ci
LEFT JOIN public.files cf ON ci.cover_file_id = cf.id;

-- Enhanced chapters view with file URLs
CREATE OR REPLACE VIEW chapters_with_files AS
SELECT 
  ch.*,
  hf.name as hero_file_name,
  get_file_url(hf) as hero_file_url,
  hf.width as hero_file_width,
  hf.height as hero_file_height,
  hf.alt_text as hero_file_alt_text,
  bf.name as banner_file_name,
  get_file_url(bf) as banner_file_url,
  bf.width as banner_file_width,
  bf.height as banner_file_height,
  bf.alt_text as banner_file_alt_text
FROM public.chapters ch
LEFT JOIN public.files hf ON ch.hero_file_id = hf.id
LEFT JOIN public.files bf ON ch.banner_file_id = bf.id;

-- Grant permissions
GRANT SELECT ON public.files TO anon, authenticated;
GRANT ALL ON public.files TO service_role;
GRANT SELECT ON content_items_with_files TO anon, authenticated;
GRANT SELECT ON chapters_with_files TO anon, authenticated;

-- Storage bucket policies (add these in Supabase Dashboard > Storage > Policies)
-- Bucket: media
-- Policy 1: "Admin upload" - INSERT for authenticated users with admin role  
-- Policy 2: "Public read" - SELECT for everyone
-- Policy 3: "Admin delete" - DELETE for authenticated users with admin role