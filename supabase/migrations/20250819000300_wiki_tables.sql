-- Migration: 20250819000300_wiki_tables.sql (Modified for manual execution)

-- Create custom types if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_block_type') THEN
        CREATE TYPE public.content_block_type AS ENUM (
            'heading_1',
            'heading_2',
            'heading_3',
            'paragraph',
            'bullet_list',
            'ordered_list',
            'image',
            'table',
            'quote',
            'code',
            'divider'
        );
    END IF;
END$$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.wiki_folders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text NOT NULL,
    parent_id uuid REFERENCES public.wiki_folders(id) ON DELETE CASCADE,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (parent_id, slug)
);

CREATE TABLE IF NOT EXISTS public.wiki_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    parent_id uuid REFERENCES public.wiki_categories(id) ON DELETE SET NULL,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wiki_pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id uuid REFERENCES public.wiki_folders(id) ON DELETE SET NULL,
    category_id uuid REFERENCES public.wiki_categories(id) ON DELETE SET NULL,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    is_published boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (folder_id, slug)
);

CREATE TABLE IF NOT EXISTS public.wiki_revisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id uuid NOT NULL REFERENCES public.wiki_pages(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    title text NOT NULL,
    content jsonb NOT NULL,
    excerpt text,
    change_summary text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wiki_content_blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id uuid NOT NULL REFERENCES public.wiki_pages(id) ON DELETE CASCADE,
    type content_block_type NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    position integer NOT NULL,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wiki_media (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_type text NOT NULL,
    file_size bigint NOT NULL,
    alt_text text,
    caption text,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_wiki_folders_parent_id ON public.wiki_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_wiki_categories_parent_id ON public.wiki_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_folder_id ON public.wiki_pages(folder_id);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_category_id ON public.wiki_pages(category_id);
CREATE INDEX IF NOT EXISTS idx_wiki_revisions_page_id ON public.wiki_revisions(page_id);
CREATE INDEX IF NOT EXISTS idx_wiki_content_blocks_page_id ON public.wiki_content_blocks(page_id);

-- RLS Policies
ALTER TABLE public.wiki_folders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public wiki folders are viewable by everyone." ON public.wiki_folders;
CREATE POLICY "Public wiki folders are viewable by everyone." ON public.wiki_folders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage their own folders." ON public.wiki_folders;
CREATE POLICY "Authenticated users can manage their own folders." ON public.wiki_folders FOR ALL USING (auth.uid() = created_by);

ALTER TABLE public.wiki_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public wiki categories are viewable by everyone." ON public.wiki_categories;
CREATE POLICY "Public wiki categories are viewable by everyone." ON public.wiki_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage their own categories." ON public.wiki_categories;
CREATE POLICY "Authenticated users can manage their own categories." ON public.wiki_categories FOR ALL USING (auth.uid() = created_by);

ALTER TABLE public.wiki_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published wiki pages are viewable by everyone." ON public.wiki_pages;
CREATE POLICY "Published wiki pages are viewable by everyone." ON public.wiki_pages FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Authenticated users can manage their own pages." ON public.wiki_pages;
CREATE POLICY "Authenticated users can manage their own pages." ON public.wiki_pages FOR ALL USING (auth.uid() = created_by);

ALTER TABLE public.wiki_revisions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view revisions of pages they can access." ON public.wiki_revisions;
CREATE POLICY "Users can view revisions of pages they can access." ON public.wiki_revisions FOR SELECT USING (
  (SELECT is_published FROM public.wiki_pages WHERE id = page_id) = true OR
  (SELECT created_by FROM public.wiki_pages WHERE id = page_id) = auth.uid()
);
DROP POLICY IF EXISTS "Authenticated users can create revisions." ON public.wiki_revisions;
CREATE POLICY "Authenticated users can create revisions." ON public.wiki_revisions FOR INSERT WITH CHECK (auth.uid() = created_by);

ALTER TABLE public.wiki_content_blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view content blocks of pages they can access." ON public.wiki_content_blocks;
CREATE POLICY "Users can view content blocks of pages they can access." ON public.wiki_content_blocks FOR SELECT USING (
  (SELECT is_published FROM public.wiki_pages WHERE id = page_id) = true OR
  (SELECT created_by FROM public.wiki_pages WHERE id = page_id) = auth.uid()
);
DROP POLICY IF EXISTS "Authenticated users can manage their own content blocks." ON public.wiki_content_blocks;
CREATE POLICY "Authenticated users can manage their own content blocks." ON public.wiki_content_blocks FOR ALL USING (auth.uid() = created_by);

ALTER TABLE public.wiki_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public wiki media is viewable by everyone." ON public.wiki_media;
CREATE POLICY "Public wiki media is viewable by everyone." ON public.wiki_media FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage their own media." ON public.wiki_media;
CREATE POLICY "Authenticated users can manage their own media." ON public.wiki_media FOR ALL USING (auth.uid() = created_by);

-- Triggers to update the updated_at timestamp
DROP TRIGGER IF EXISTS update_wiki_folders_updated_at ON public.wiki_folders;
CREATE TRIGGER update_wiki_folders_updated_at
  BEFORE UPDATE ON public.wiki_folders
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wiki_categories_updated_at ON public.wiki_categories;
CREATE TRIGGER update_wiki_categories_updated_at
  BEFORE UPDATE ON public.wiki_categories
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wiki_pages_updated_at ON public.wiki_pages;
CREATE TRIGGER update_wiki_pages_updated_at
  BEFORE UPDATE ON public.wiki_pages
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wiki_content_blocks_updated_at ON public.wiki_content_blocks;
CREATE TRIGGER update_wiki_content_blocks_updated_at
  BEFORE UPDATE ON public.wiki_content_blocks
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();