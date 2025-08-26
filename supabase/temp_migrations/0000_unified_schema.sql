-- Gemini-Generated Unified Schema for Zoroasterverse
-- Version: 1.5
-- Generated on: 2025-08-24
-- This version corrects all previous syntax errors, including function, index, and trigger handling.

--==============================================================
-- 1. EXTENSIONS
--==============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

--==============================================================
-- 2. CUSTOM TYPES (IDEMPOTENT)
--==============================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'support', 'accountant', 'user', 'super_admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE public.subscription_status AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'beta_reader_status') THEN
        CREATE TYPE public.beta_reader_status AS ENUM ('not_applied', 'pending', 'approved', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_type') THEN
        CREATE TYPE public.work_type AS ENUM ('book', 'volume', 'saga', 'arc', 'issue');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_status') THEN
        CREATE TYPE public.work_status AS ENUM ('planning', 'writing', 'editing', 'published', 'on_hold');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_block_type') THEN
        CREATE TYPE public.content_block_type AS ENUM ('heading_1', 'heading_2', 'heading_3', 'paragraph', 'bullet_list', 'ordered_list', 'image', 'table', 'quote', 'code', 'divider');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
        CREATE TYPE public.product_type AS ENUM ('single_issue', 'bundle', 'chapter_pass', 'arc_pass');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'beta_application_status') THEN
        CREATE TYPE public.beta_application_status AS ENUM ('pending', 'approved', 'denied');
    END IF;
END;
$$;

--==============================================================
-- 3. TABLES (IDEMPOTENT)
--==============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username text UNIQUE,
    display_name text,
    avatar_url text,
    website text,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    beta_reader_status public.beta_reader_status DEFAULT 'not_applied'::public.beta_reader_status NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id uuid NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
    role public.user_role NOT NULL,
    granted_by uuid REFERENCES auth.users ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    plan_id text NOT NULL,
    status public.subscription_status NOT NULL,
    cancel_at_period_end boolean DEFAULT false,
    current_period_start timestamptz,
    current_period_end timestamptz,
    trial_start timestamptz,
    trial_end timestamptz,
    metadata jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    books_read integer DEFAULT 0 NOT NULL,
    reading_hours integer DEFAULT 0 NOT NULL,
    achievements integer DEFAULT 0 NOT NULL,
    currently_reading text DEFAULT 'None' NOT NULL
);

CREATE TABLE IF NOT EXISTS public.works (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title text NOT NULL,
    type work_type NOT NULL,
    parent_id uuid REFERENCES public.works(id) ON DELETE CASCADE,
    order_in_parent integer,
    description text,
    status work_status DEFAULT 'planning'::public.work_status NOT NULL,
    release_date date,
    cover_image_url text,
    is_featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chapters (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    work_id uuid NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
    title text NOT NULL,
    chapter_number integer NOT NULL,
    file_path text NOT NULL,
    is_published boolean DEFAULT false,
    word_count integer,
    estimated_read_time integer,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.posts (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    author_id uuid REFERENCES auth.users ON DELETE SET NULL,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text,
    status varchar(20) DEFAULT 'draft'::character varying,
    views integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wiki_folders (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name text NOT NULL,
    slug text NOT NULL,
    parent_id uuid REFERENCES public.wiki_folders(id) ON DELETE CASCADE,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (parent_id, slug)
);

CREATE TABLE IF NOT EXISTS public.wiki_categories (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    parent_id uuid REFERENCES public.wiki_categories(id) ON DELETE SET NULL,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pages (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text,
    status varchar(20) DEFAULT 'draft'::character varying,
    folder_id uuid REFERENCES public.wiki_folders(id) ON DELETE SET NULL,
    category_id uuid REFERENCES public.wiki_categories(id) ON DELETE SET NULL,
    is_published boolean DEFAULT false,
    published_at timestamptz,
    seo_title text,
    seo_description text,
    seo_keywords text[],
    view_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.characters (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name text NOT NULL,
    title text,
    description text,
    traits text[],
    image_url text,
    silhouette_url text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wiki_pages (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    folder_id uuid REFERENCES public.wiki_folders(id) ON DELETE SET NULL,
    category_id uuid REFERENCES public.wiki_categories(id) ON DELETE SET NULL,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    is_published boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (folder_id, slug)
);

CREATE TABLE IF NOT EXISTS public.wiki_revisions (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    page_id uuid NOT NULL REFERENCES public.wiki_pages(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    title text NOT NULL,
    content jsonb NOT NULL,
    excerpt text,
    change_summary text,
    created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wiki_content_blocks (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    page_id uuid NOT NULL REFERENCES public.wiki_pages(id) ON DELETE CASCADE,
    type content_block_type NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    position integer NOT NULL,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wiki_media (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    created_by uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_type text NOT NULL,
    file_size bigint NOT NULL,
    alt_text text,
    caption text,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name text NOT NULL,
    description text,
    product_type product_type,
    active boolean DEFAULT true NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.prices (
    id text PRIMARY KEY,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    nickname text,
    currency text NOT NULL,
    unit_amount integer NOT NULL,
    interval text,
    active boolean DEFAULT true NOT NULL,
    trial_days integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.purchases (
    id text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    price_id text NOT NULL REFERENCES public.prices(id) ON DELETE RESTRICT,
    status text NOT NULL,
    purchased_at timestamptz DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    total integer NOT NULL,
    currency text NOT NULL,
    hosted_invoice_url text,
    pdf_url text,
    status text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.refunds (
    id text PRIMARY KEY,
    invoice_id text NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    currency text NOT NULL,
    reason text,
    created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.entitlements (
    id bigserial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    scope text NOT NULL,
    source text NOT NULL,
    starts_at timestamptz DEFAULT now(),
    ends_at timestamptz,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_ratings (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    work_id uuid NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (user_id, work_id)
);

CREATE TABLE IF NOT EXISTS public.reading_progress (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    progress_percentage numeric(5,2) DEFAULT 0,
    last_position text,
    is_completed boolean DEFAULT false,
    last_read_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (user_id, chapter_id)
);

CREATE TABLE IF NOT EXISTS public.news_items (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title text NOT NULL,
    content text,
    status varchar(20) DEFAULT 'draft'::character varying,
    date date NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.release_items (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title text NOT NULL,
    type varchar(20) NOT NULL,
    status varchar(20) DEFAULT 'available'::character varying,
    description text,
    release_date date NOT NULL,
    purchase_link text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.homepage_content (
    id bigserial PRIMARY KEY,
    title text,
    content text,
    section text,
    created_at timestamptz DEFAULT now() NOT NULL
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
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.webhook_events (
    id text PRIMARY KEY,
    provider text NOT NULL,
    type text NOT NULL,
    payload jsonb NOT NULL,
    received_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_spins (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    spin_date date NOT NULL,
    spin_count integer DEFAULT 0 NOT NULL,
    PRIMARY KEY (user_id, spin_date)
);

CREATE TABLE IF NOT EXISTS public.user_activities (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type text NOT NULL,
    item_id uuid,
    item_title text NOT NULL,
    progress integer,
    total_progress integer,
    status text NOT NULL,
    "timestamp" timestamptz DEFAULT now() NOT NULL,
    cover_image_url text
);

CREATE TABLE IF NOT EXISTS public.recent_activity (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    type text NOT NULL,
    description text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.beta_applications (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT NOW(),
    status beta_application_status DEFAULT 'pending',
    admin_notes TEXT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    time_zone TEXT NOT NULL,
    country TEXT,
    goodreads TEXT,
    beta_commitment TEXT NOT NULL,
    hours_per_week TEXT NOT NULL,
    portal_use TEXT NOT NULL,
    recent_reads TEXT,
    interest_statement TEXT NOT NULL,
    prior_beta TEXT,
    feedback_philosophy TEXT NOT NULL,
    track_record TEXT,
    communication TEXT NOT NULL,
    devices TEXT[],
    access_needs TEXT,
    demographics TEXT,
    stage1_raw_score INTEGER,
    stage1_passed BOOLEAN,
    stage1_auto_fail BOOLEAN,
    q1 TEXT,
    q2 TEXT,
    clarity_feedback TEXT,
    pacing_analysis TEXT,
    taste_alignment TEXT,
    stage2_raw_score INTEGER,
    stage2_passed BOOLEAN,
    worse_passage TEXT,
    passage_a_analysis TEXT,
    passage_b_analysis TEXT,
    priority_fix TEXT,
    stage3_raw_score INTEGER,
    stage3_passed BOOLEAN,
    overall_assessment TEXT,
    chapter_summary TEXT,
    stage4_raw_score INTEGER,
    stage4_passed BOOLEAN,
    composite_score NUMERIC
);

CREATE TABLE IF NOT EXISTS public.timeline_events (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    details TEXT,
    background_image TEXT,
    is_published BOOLEAN DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.timeline_nested_events (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    timeline_event_id UUID NOT NULL REFERENCES public.timeline_events(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW()
);


--==============================================================
-- 4. INDEXES (CORRECTED)
--==============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_works_parent_id ON public.works(parent_id);
CREATE INDEX IF NOT EXISTS idx_works_type ON public.works(type);
CREATE INDEX IF NOT EXISTS idx_chapters_work_id ON public.chapters(work_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_wiki_folders_parent_id ON public.wiki_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_wiki_categories_parent_id ON public.wiki_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_folder_id ON public.wiki_pages(folder_id);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_category_id ON public.wiki_pages(category_id);
CREATE INDEX IF NOT EXISTS idx_wiki_revisions_page_id ON public.wiki_revisions(page_id);
CREATE INDEX IF NOT EXISTS idx_wiki_content_blocks_page_id ON public.wiki_content_blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_prices_product_id ON public.prices(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON public.entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON public.user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_work_id ON public.user_ratings(work_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON public.reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_chapter_id ON public.reading_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_recent_activity_created_at ON public.recent_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_timeline_events_order ON public.timeline_events("order");
CREATE INDEX IF NOT EXISTS idx_timeline_events_published ON public.timeline_events(is_published);
CREATE INDEX IF NOT EXISTS idx_timeline_nested_events_event_id ON public.timeline_nested_events(timeline_event_id);


--==============================================================
-- 5. HELPER FUNCTIONS (IDEMPOTENT)
--==============================================================

DROP FUNCTION IF EXISTS public.get_user_role(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS public.user_role AS $$
DECLARE
  user_role_result public.user_role;
BEGIN
  SELECT role INTO user_role_result FROM public.profiles WHERE id = p_user_id;
  RETURN user_role_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean AS $$
DECLARE
  user_role_result public.user_role;
BEGIN
  SELECT public.get_user_role(p_user_id) INTO user_role_result;
  RETURN user_role_result IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql STABLE SECURITY INVOKER;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (NEW.id, NEW.email, 'user');
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS public.update_profile_beta_status() CASCADE;
CREATE OR REPLACE FUNCTION public.update_profile_beta_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' THEN
        UPDATE public.profiles SET beta_reader_status = 'approved' WHERE id = NEW.user_id;
    ELSIF NEW.status = 'denied' THEN
        UPDATE public.profiles SET beta_reader_status = 'rejected' WHERE id = NEW.user_id;
    ELSE
        UPDATE public.profiles SET beta_reader_status = 'pending' WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS public.handle_timeline_event_user_info() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_timeline_event_user_info()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.created_by = auth.uid();
        NEW.updated_by = auth.uid();
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.updated_by = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND (role = 'admin'::public.user_role OR role = 'super_admin'::public.user_role)
    );
$$;

--==============================================================
-- 6. ROW LEVEL SECURITY (RLS)
--==============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles." ON public.profiles FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage user roles." ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Users can view their own roles." ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscriptions." ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all subscriptions." ON public.subscriptions FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own stats." ON public.user_stats FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public works are viewable by everyone." ON public.works FOR SELECT USING (true);
CREATE POLICY "Admins can manage works." ON public.works FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published chapters are viewable by everyone." ON public.chapters FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage chapters." ON public.chapters FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are viewable by everyone." ON public.posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can manage their own posts." ON public.posts FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all posts." ON public.posts FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published pages are viewable by everyone." ON public.pages FOR SELECT USING (is_published = true OR status = 'published');
CREATE POLICY "Admins can manage all pages." ON public.pages FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Characters are viewable by everyone." ON public.characters FOR SELECT USING (true);
CREATE POLICY "Admins can manage characters." ON public.characters FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.wiki_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public wiki folders are viewable by everyone." ON public.wiki_folders FOR SELECT USING (true);
CREATE POLICY "Admins can manage all folders." ON public.wiki_folders FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.wiki_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public wiki categories are viewable by everyone." ON public.wiki_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage all categories." ON public.wiki_categories FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.wiki_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published wiki pages are viewable by everyone." ON public.wiki_pages FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage all wiki pages." ON public.wiki_pages FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.wiki_revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view revisions of published pages." ON public.wiki_revisions FOR SELECT USING ((SELECT is_published FROM public.wiki_pages WHERE id = page_id));
CREATE POLICY "Admins can manage all revisions." ON public.wiki_revisions FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.wiki_content_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view content_blocks of published pages." ON public.wiki_content_blocks FOR SELECT USING ((SELECT is_published FROM public.wiki_pages WHERE id = page_id));
CREATE POLICY "Admins can manage all content_blocks." ON public.wiki_content_blocks FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.wiki_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public wiki media is viewable by everyone." ON public.wiki_media FOR SELECT USING (true);
CREATE POLICY "Admins can manage all media." ON public.wiki_media FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products." ON public.products FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public prices are viewable by everyone." ON public.prices FOR SELECT USING (true);
CREATE POLICY "Admins can manage prices." ON public.prices FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own purchases." ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all purchases." ON public.purchases FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own invoices." ON public.invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all invoices." ON public.invoices FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all refunds." ON public.refunds FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own entitlements." ON public.entitlements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all entitlements." ON public.entitlements FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public user ratings are viewable by everyone." ON public.user_ratings FOR SELECT USING (true);
CREATE POLICY "Users can manage their own ratings." ON public.user_ratings FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own reading progress." ON public.reading_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published news items are viewable by everyone." ON public.news_items FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage news items." ON public.news_items FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.release_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public release items are viewable by everyone." ON public.release_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage release items." ON public.release_items FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Homepage content is viewable by everyone." ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage homepage content." ON public.homepage_content FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view the audit log." ON public.audit_log FOR SELECT USING (public.is_admin(auth.uid()));

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny all client access to webhook_events" ON public.webhook_events FOR ALL USING (false);

ALTER TABLE public.daily_spins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own daily_spins." ON public.daily_spins FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own user_activities." ON public.user_activities FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.recent_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view recent activity." ON public.recent_activity FOR SELECT USING (true);
CREATE POLICY "Admins can manage recent activity." ON public.recent_activity FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.beta_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own beta application." ON public.beta_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own beta application." ON public.beta_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all beta applications." ON public.beta_applications FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published timeline events are viewable by everyone." ON public.timeline_events FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage timeline events." ON public.timeline_events FOR ALL USING (public.is_admin(auth.uid()));

ALTER TABLE public.timeline_nested_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published nested timeline events are viewable by everyone." ON public.timeline_nested_events FOR SELECT USING ((EXISTS (SELECT 1 FROM public.timeline_events te WHERE te.id = timeline_event_id AND te.is_published = true)));
CREATE POLICY "Admins can manage nested timeline events." ON public.timeline_nested_events FOR ALL USING (public.is_admin(auth.uid()));


--==============================================================
-- 7. TRIGGERS
--==============================================================

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for beta application status change
DROP TRIGGER IF EXISTS update_beta_status_trigger ON public.beta_applications;
CREATE TRIGGER update_beta_status_trigger
  AFTER UPDATE ON public.beta_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_beta_status();
  
-- Trigger for timeline event user info
DROP TRIGGER IF EXISTS handle_timeline_event_user_info_trigger ON public.timeline_events;
CREATE TRIGGER handle_timeline_event_user_info_trigger
  BEFORE INSERT OR UPDATE ON public.timeline_events
  FOR EACH ROW EXECUTE FUNCTION public.handle_timeline_event_user_info();

-- Generic updated_at triggers for all relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON public.works FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON public.characters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wiki_folders_updated_at BEFORE UPDATE ON public.wiki_folders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wiki_categories_updated_at BEFORE UPDATE ON public.wiki_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wiki_pages_updated_at BEFORE UPDATE ON public.wiki_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wiki_content_blocks_updated_at BEFORE UPDATE ON public.wiki_content_blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_prices_updated_at BEFORE UPDATE ON public.prices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_ratings_updated_at BEFORE UPDATE ON public.user_ratings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_items_updated_at BEFORE UPDATE ON public.news_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_release_items_updated_at BEFORE UPDATE ON public.release_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timeline_events_updated_at BEFORE UPDATE ON public.timeline_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timeline_nested_events_updated_at BEFORE UPDATE ON public.timeline_nested_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

--==============================================================
-- END OF UNIFIED SCHEMA
--==============================================================
