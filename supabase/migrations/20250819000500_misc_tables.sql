-- Migration: 20250819000500_misc_tables.sql (Modified for manual execution)

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.user_ratings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    work_id uuid NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, work_id)
);

CREATE TABLE IF NOT EXISTS public.reading_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    progress_percentage numeric(5,2) DEFAULT 0,
    last_position text,
    is_completed boolean DEFAULT false,
    last_read_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, chapter_id)
);

CREATE TABLE IF NOT EXISTS public.news_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text,
    status character varying(20) DEFAULT 'draft'::character varying,
    date date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.release_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    type character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'available'::character varying,
    description text,
    release_date date NOT NULL,
    purchase_link text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.homepage_content (
    id bigserial PRIMARY KEY,
    title text,
    content text,
    section text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.audit_log (
    id bigserial PRIMARY KEY,
    actor_user_id uuid REFERENCES auth.users ON DELETE SET NULL,
    action text NOT NULL,
    target_user_id uuid REFERENCES auth.users ON DELETE SET NULL,
    target_id text,
    target_type text,
    before jsonb,
    after jsonb,
    ip inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.webhook_events (
    id text PRIMARY KEY,
    provider text NOT NULL,
    type text NOT NULL,
    payload jsonb NOT NULL,
    received_at timestamp with time zone DEFAULT now()
);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON public.user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_work_id ON public.user_ratings(work_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON public.reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_chapter_id ON public.reading_progress(chapter_id);

-- RLS Policies
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public user ratings are viewable by everyone." ON public.user_ratings;
CREATE POLICY "Public user ratings are viewable by everyone." ON public.user_ratings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage their own ratings." ON public.user_ratings;
CREATE POLICY "Users can manage their own ratings." ON public.user_ratings FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own reading progress." ON public.reading_progress;
CREATE POLICY "Users can manage their own reading progress." ON public.reading_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published news items are viewable by everyone." ON public.news_items;
CREATE POLICY "Published news items are viewable by everyone." ON public.news_items FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admins can manage news items." ON public.news_items;
CREATE POLICY "Admins can manage news items." ON public.news_items FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.release_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public release items are viewable by everyone." ON public.release_items;
CREATE POLICY "Public release items are viewable by everyone." ON public.release_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage release items." ON public.release_items;
CREATE POLICY "Admins can manage release items." ON public.release_items FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Homepage content is viewable by everyone." ON public.homepage_content;
CREATE POLICY "Homepage content is viewable by everyone." ON public.homepage_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage homepage content." ON public.homepage_content;
CREATE POLICY "Admins can manage homepage content." ON public.homepage_content FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view the audit log." ON public.audit_log;
CREATE POLICY "Admins can view the audit log." ON public.audit_log FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Deny all client access to webhook_events" ON public.webhook_events;
CREATE POLICY "Deny all client access to webhook_events" ON public.webhook_events USING (false);

-- Triggers to update the updated_at timestamp
DROP TRIGGER IF EXISTS update_user_ratings_updated_at ON public.user_ratings;
CREATE TRIGGER update_user_ratings_updated_at
  BEFORE UPDATE ON public.user_ratings
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_items_updated_at ON public.news_items;
CREATE TRIGGER update_news_items_updated_at
  BEFORE UPDATE ON public.news_items
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_release_items_updated_at ON public.release_items;
CREATE TRIGGER update_release_items_updated_at
  BEFORE UPDATE ON public.release_items
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();