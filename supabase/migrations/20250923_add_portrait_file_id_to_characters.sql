-- Add portrait_file_id column to characters table for media bucket integration
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS portrait_file_id uuid REFERENCES public.files(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS characters_portrait_file_id_idx ON public.characters(portrait_file_id);

-- Comment for documentation
COMMENT ON COLUMN public.characters.portrait_file_id IS 'Reference to file in media bucket for character portrait. Optional - portrait_url is kept for backward compatibility.';

-- Update characters view to include file information (if exists)
CREATE OR REPLACE VIEW characters_with_portraits AS
SELECT 
  c.*,
  f.name as portrait_file_name,
  f.path as portrait_file_path,
  f.bucket as portrait_file_bucket,
  f.width as portrait_file_width,
  f.height as portrait_file_height,
  f.alt_text as portrait_file_alt_text,
  CASE 
    WHEN f.id IS NOT NULL THEN 
      format('https://%s.supabase.co/storage/v1/object/public/%s/%s',
        current_setting('app.settings.project_id', true),
        f.bucket,
        f.path
      )
    ELSE c.portrait_url
  END as portrait_display_url
FROM public.characters c
LEFT JOIN public.files f ON c.portrait_file_id = f.id;

-- Grant permissions
GRANT SELECT ON characters_with_portraits TO anon, authenticated;

-- Add helpful function to get character portrait URL
CREATE OR REPLACE FUNCTION get_character_portrait_url(character_row public.characters)
RETURNS text AS $$
DECLARE
  file_record public.files;
BEGIN
  -- If portrait_file_id is set, get URL from files table
  IF character_row.portrait_file_id IS NOT NULL THEN
    SELECT * INTO file_record FROM public.files WHERE id = character_row.portrait_file_id;
    
    IF file_record.id IS NOT NULL THEN
      RETURN format('https://%s.supabase.co/storage/v1/object/public/%s/%s',
        current_setting('app.settings.project_id', true),
        file_record.bucket,
        file_record.path
      );
    END IF;
  END IF;
  
  -- Fallback to portrait_url
  RETURN character_row.portrait_url;
END;
$$ LANGUAGE plpgsql STABLE;