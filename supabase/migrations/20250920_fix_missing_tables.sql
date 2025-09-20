-- Fix missing tables and RLS policies that are causing 406 errors

-- Create user_library table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Ensure a user can't add the same item twice
  CONSTRAINT user_library_unique_user_content UNIQUE (user_id, content_item_id)
);

-- Create content_ratings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.content_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Ensure a user can't rate the same item twice
  CONSTRAINT content_ratings_unique_user_content UNIQUE (user_id, content_item_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_library_user_id ON public.user_library(user_id);
CREATE INDEX IF NOT EXISTS idx_user_library_content_item_id ON public.user_library(content_item_id);
CREATE INDEX IF NOT EXISTS idx_user_library_added_at ON public.user_library(added_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_ratings_user_id ON public.content_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_content_ratings_content_item_id ON public.content_ratings(content_item_id);
CREATE INDEX IF NOT EXISTS idx_content_ratings_rating ON public.content_ratings(rating);
CREATE INDEX IF NOT EXISTS idx_content_ratings_created_at ON public.content_ratings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_ratings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can manage their own library" ON public.user_library;
DROP POLICY IF EXISTS "Users can view their own library" ON public.user_library;
DROP POLICY IF EXISTS "Users can manage their own ratings" ON public.content_ratings;
DROP POLICY IF EXISTS "Users can view their own ratings" ON public.content_ratings;
DROP POLICY IF EXISTS "Public can view ratings" ON public.content_ratings;

-- Create RLS policies for user_library
CREATE POLICY "Users can manage their own library" ON public.user_library
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for content_ratings
CREATE POLICY "Users can manage their own ratings" ON public.content_ratings
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow public viewing of ratings (for average calculations)
CREATE POLICY "Public can view ratings" ON public.content_ratings
  FOR SELECT 
  USING (true);

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS handle_user_library_updated_at ON public.user_library;
CREATE TRIGGER handle_user_library_updated_at
  BEFORE UPDATE ON public.user_library
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_content_ratings_updated_at ON public.content_ratings;
CREATE TRIGGER handle_content_ratings_updated_at
  BEFORE UPDATE ON public.content_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add cover_file_id column to content_items if it doesn't exist
ALTER TABLE public.content_items 
ADD COLUMN IF NOT EXISTS cover_file_id UUID REFERENCES public.files(id) ON DELETE SET NULL;

-- Add index for cover_file_id
CREATE INDEX IF NOT EXISTS idx_content_items_cover_file_id ON public.content_items(cover_file_id);

COMMIT;