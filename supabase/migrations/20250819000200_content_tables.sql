-- Migration: 20250819000200_content_tables.sql (Modified for manual execution)

-- Create custom types if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_type') THEN
        CREATE TYPE public.work_type AS ENUM (
            'book',
            'volume',
            'saga',
            'arc',
            'issue'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_status') THEN
        CREATE TYPE public.work_status AS ENUM (
            'planning',
            'writing',
            'editing',
            'published',
            'on_hold'
        );
    END IF;
END$$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.works (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    type work_type NOT NULL,
    parent_id uuid REFERENCES public.works(id) ON DELETE CASCADE,
    order_in_parent integer,
    description text,
    status work_status DEFAULT 'planning'::public.work_status NOT NULL,
    release_date date,
    cover_image_url text,
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chapters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id uuid NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
    title text NOT NULL,
    chapter_number integer NOT NULL,
    file_path text NOT NULL,
    is_published boolean DEFAULT false,
    word_count integer,
    estimated_read_time integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL REFERENCES auth.users ON DELETE SET NULL,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text,
    status character varying(20) DEFAULT 'draft'::character varying,
    views integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text,
    status character varying(20) DEFAULT 'draft'::character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.characters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    title text,
    description text,
    traits text[],
    image_url text,
    silhouette_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_works_parent_id ON public.works(parent_id);
CREATE INDEX IF NOT EXISTS idx_works_type ON public.works(type);
CREATE INDEX IF NOT EXISTS idx_chapters_work_id ON public.chapters(work_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);

-- RLS Policies
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public works are viewable by everyone." ON public.works;
CREATE POLICY "Public works are viewable by everyone." ON public.works FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage works." ON public.works;
CREATE POLICY "Admins can manage works." ON public.works FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published chapters are viewable by everyone." ON public.chapters;
CREATE POLICY "Published chapters are viewable by everyone." ON public.chapters FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Admins can manage chapters." ON public.chapters;
CREATE POLICY "Admins can manage chapters." ON public.chapters FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published posts are viewable by everyone." ON public.posts;
CREATE POLICY "Published posts are viewable by everyone." ON public.posts FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Authors can manage their own posts." ON public.posts;
CREATE POLICY "Authors can manage their own posts." ON public.posts FOR ALL USING (auth.uid() = author_id);
DROP POLICY IF EXISTS "Admins can manage all posts." ON public.posts;
CREATE POLICY "Admins can manage all posts." ON public.posts FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published pages are viewable by everyone." ON public.pages;
CREATE POLICY "Published pages are viewable by everyone." ON public.pages FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admins can manage all pages." ON public.pages;
CREATE POLICY "Admins can manage all pages." ON public.pages FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Characters are viewable by everyone." ON public.characters;
CREATE POLICY "Characters are viewable by everyone." ON public.characters FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage characters." ON public.characters;
CREATE POLICY "Admins can manage characters." ON public.characters FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

-- Triggers to update the updated_at timestamp
DROP TRIGGER IF EXISTS update_works_updated_at ON public.works;
CREATE TRIGGER update_works_updated_at
  BEFORE UPDATE ON public.works
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_chapters_updated_at ON public.chapters;
CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_characters_updated_at ON public.characters;
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();