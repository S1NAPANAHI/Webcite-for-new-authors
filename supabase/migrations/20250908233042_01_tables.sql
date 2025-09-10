-- Consolidated Table Definitions

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS ltree;

-- profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    display_name text,
    avatar_url text,
    website text,
    full_name text,
    bio text,
    location text,
    favorite_genre text,
    
    -- Subscription info
    subscription_status text DEFAULT 'inactive',
    subscription_tier text,
    stripe_customer_id text UNIQUE,
    current_period_end timestamptz,
    cancel_at_period_end boolean DEFAULT false,
    
    -- User role and permissions
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    
    -- Beta reader status
    beta_reader_status public.beta_reader_status DEFAULT 'not_applied'::public.beta_reader_status NOT NULL,
    beta_reader_approved_at timestamptz,
    
    -- Privacy settings
    profile_visibility public.profile_visibility DEFAULT 'public'::public.profile_visibility NOT NULL,
    show_reading_progress boolean DEFAULT true,
    show_achievements boolean DEFAULT false,
    
    -- Email preferences
    email_notifications boolean DEFAULT true,
    marketing_emails boolean DEFAULT false,
    
    -- Statistics (cached for performance)
    total_reading_time integer DEFAULT 0, -- in minutes
    books_completed integer DEFAULT 0,
    chapters_read integer DEFAULT 0,
    reviews_written integer DEFAULT 0,
    reading_goal integer DEFAULT 0,
    reading_streak integer DEFAULT 0,
    achievements_count integer DEFAULT 0,
    currently_reading text DEFAULT NULL,
    
    -- Timestamps
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    last_active_at timestamptz DEFAULT now(),
    
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
    CONSTRAINT display_name_length CHECK (char_length(display_name) <= 100),
    CONSTRAINT bio_length CHECK (char_length(bio) <= 500),
    CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_\-\.]+$')
);

-- user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role public.user_role NOT NULL,
    granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    expires_at timestamptz,
    metadata jsonb,
    PRIMARY KEY (user_id, role),
    CONSTRAINT valid_expiry CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- user_stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_reading_minutes integer DEFAULT 0 NOT NULL,
    books_read integer DEFAULT 0 NOT NULL,
    chapters_read integer DEFAULT 0 NOT NULL,
    current_streak_days integer DEFAULT 0 NOT NULL,
    achievements_unlocked integer DEFAULT 0 NOT NULL,
    level_reached integer DEFAULT 1 NOT NULL,
    currently_reading text DEFAULT NULL,
    last_activity_date date,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT non_negative_reading_minutes CHECK (total_reading_minutes >= 0),
    CONSTRAINT non_negative_books CHECK (books_read >= 0),
    CONSTRAINT non_negative_chapters CHECK (chapters_read >= 0),
    CONSTRAINT non_negative_streak CHECK (current_streak_days >= 0),
    CONSTRAINT non_negative_achievements CHECK (achievements_unlocked >= 0),
    CONSTRAINT positive_level CHECK (level_reached > 0)
);

-- friends table
CREATE TABLE IF NOT EXISTS public.friends (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    CONSTRAINT chk_friends_status CHECK (status IN ('pending', 'accepted', 'blocked')),
    CONSTRAINT chk_friends_not_self CHECK (user_id != friend_id)
);

-- daily_spins table
CREATE TABLE IF NOT EXISTS public.daily_spins (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    spin_date date NOT NULL,
    spin_count integer DEFAULT 0 NOT NULL,
    last_spin_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, spin_date)
);

-- user_activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB,
    progress INTEGER,
    total_progress INTEGER,
    status TEXT,
    item_title TEXT,
    cover_image_url TEXT,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- user_reading_history table
CREATE TABLE IF NOT EXISTS public.user_reading_history (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL, -- References content.id or work.id depending on your schema
    content_type TEXT NOT NULL, -- 'work', 'chapter', 'article', etc.
    progress FLOAT NOT NULL DEFAULT 0, -- 0 to 1, representing 0% to 100%
    last_read_position JSONB, -- For storing scroll position, etc.
    is_completed BOOLEAN NOT NULL DEFAULT false,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, content_id, content_type)
);

-- beta_applications table
CREATE TABLE IF NOT EXISTS public.beta_applications (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status public.beta_application_status DEFAULT 'pending'::public.beta_application_status NOT NULL,
    admin_notes text,
    full_name text NOT NULL,
    email text NOT NULL,
    time_zone text NOT NULL,
    country text,
    goodreads text,
    beta_commitment text NOT NULL,
    hours_per_week text NOT NULL,
    portal_use text NOT NULL,
    recent_reads text,
    interest_statement text NOT NULL,
    prior_beta text,
    feedback_philosophy text NOT NULL,
    track_record text,
    communication text NOT NULL,
    devices text[],
    access_needs text,
    demographics text,
    stage1_raw_score integer,
    stage1_passed boolean,
    stage1_auto_fail boolean,
    stage2_raw_score integer,
    stage2_passed boolean,
    stage3_raw_score integer,
    stage3_passed boolean,
    stage4_raw_score integer,
    stage4_passed boolean,
    composite_score numeric(5,2),
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_scores CHECK (
        (stage1_raw_score IS NULL OR (stage1_raw_score >= 0 AND stage1_raw_score <= 100)) AND
        (stage2_raw_score IS NULL OR (stage2_raw_score >= 0 AND stage2_raw_score <= 100)) AND
        (stage3_raw_score IS NULL OR (stage3_raw_score >= 0 AND stage3_raw_score <= 100)) AND
        (stage4_raw_score IS NULL OR (stage4_raw_score >= 0 AND stage4_raw_score <= 100)) AND
        (composite_score IS NULL OR (composite_score >= 0 AND composite_score <= 100))
    ),
    CONSTRAINT unique_user_application UNIQUE (user_id)
);

-- works table
CREATE TABLE IF NOT EXISTS public.works (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    title text NOT NULL,
    type public.work_type NOT NULL,
    parent_id uuid REFERENCES public.works(id) ON DELETE CASCADE,
    order_in_parent integer,
    description text,
    status public.work_status DEFAULT 'planning'::public.work_status NOT NULL,
    release_date date,
    cover_image_url text,
    is_featured boolean DEFAULT false,
    is_premium boolean DEFAULT false,
    is_free boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    work_id uuid NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
    title text NOT NULL,
    chapter_number integer NOT NULL,
    content text,
    file_path text,
    is_published boolean DEFAULT false,
    is_premium boolean DEFAULT false,
    is_free boolean DEFAULT true,
    word_count integer,
    estimated_read_time integer,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text,
    excerpt text,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured boolean DEFAULT false,
    tags text[] DEFAULT '{}',
    seo_title text,
    seo_description text,
    seo_keywords text[],
    views integer DEFAULT 0,
    published_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- pages table
CREATE TABLE IF NOT EXISTS public.pages (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    folder_id uuid,
    category_id uuid,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text,
    status text DEFAULT 'draft',
    seo_title text,
    seo_description text,
    seo_keywords text[],
    is_published boolean DEFAULT false,
    published_at timestamptz,
    view_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- characters table
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

-- wiki_categories table
CREATE TABLE IF NOT EXISTS public.wiki_categories (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    parent_id uuid REFERENCES public.wiki_categories(id) ON DELETE SET NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- wiki_items table (consolidated from wiki_folders and wiki_pages)
CREATE TABLE IF NOT EXISTS public.wiki_items (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name text NOT NULL, -- Used for both folder names and page titles
    type text NOT NULL CHECK (type IN ('folder', 'page')), -- 'folder' or 'page'
    slug text NOT NULL,
    parent_id uuid REFERENCES public.wiki_items(id) ON DELETE CASCADE, -- Self-referencing for hierarchy
    content text, -- Only for pages
    excerpt text, -- Only for pages
    is_published boolean DEFAULT false, -- Only for pages
    view_count integer DEFAULT 0, -- Only for pages
    category_id uuid REFERENCES public.wiki_categories(id) ON DELETE SET NULL, -- Only for pages
    full_path text, -- Generated: e.g., 'folder-slug/page-slug'
    depth integer DEFAULT 0, -- Generated: 0 for root, 1 for child, etc.
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')), -- More granular status
    visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'restricted')), -- Access control
    tags text[] DEFAULT '{}', -- For tagging content
    properties jsonb DEFAULT '{}', -- For custom key-value pairs (Obsidian-like properties)
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (parent_id, slug)
);

-- wiki_revisions table
CREATE TABLE IF NOT EXISTS public.wiki_revisions (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    page_id uuid NOT NULL REFERENCES public.wiki_items(id) ON DELETE CASCADE, -- References wiki_items
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    content jsonb NOT NULL,
    excerpt text,
    change_summary text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- wiki_content_blocks table
CREATE TABLE IF NOT EXISTS public.wiki_content_blocks (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    page_id uuid NOT NULL REFERENCES public.wiki_items(id) ON DELETE CASCADE, -- References wiki_items
    type public.content_block_type NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    position integer NOT NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- wiki_media table
CREATE TABLE IF NOT EXISTS public.wiki_media (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    wiki_item_id uuid REFERENCES public.wiki_items(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_type text NOT NULL,
    file_size bigint NOT NULL,
    alt_text text,
    caption text,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- products table
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    title text,
    subtitle text,
    description text,
    product_type public.product_type NOT NULL,
    cover_image_url text,
    thumbnail_url text,
    preview_url text,
    file_key text,
    file_size_bytes bigint,
    file_type text,
    page_count integer,
    word_count integer,
    isbn text,
    publisher text,
    language_code text DEFAULT 'en',
    is_bundle boolean DEFAULT false NOT NULL,
    is_subscription boolean DEFAULT false NOT NULL,
    is_premium boolean DEFAULT false NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_digital boolean DEFAULT true NOT NULL,
    requires_shipping boolean DEFAULT false NOT NULL,
    is_available boolean DEFAULT false NOT NULL,
    active boolean DEFAULT true NOT NULL,
    status text DEFAULT 'draft' NOT NULL,
    published_at timestamptz,
    metadata jsonb DEFAULT '{}'::jsonb,
    seo_title text,
    seo_description text,
    stripe_product_id text UNIQUE,
    images text[] DEFAULT '{}',
    track_inventory BOOLEAN DEFAULT false,
    inventory_quantity INTEGER DEFAULT 0,
    allow_backorders BOOLEAN DEFAULT false,
    price_cents INTEGER,
    sort_order INTEGER DEFAULT 0,
    category_id UUID,
    work_id uuid REFERENCES public.works(id) ON DELETE SET NULL,
    content_grants jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
    CONSTRAINT valid_file_size CHECK (file_size_bytes IS NULL OR file_size_bytes > 0),
    CONSTRAINT valid_page_count CHECK (page_count IS NULL OR page_count > 0),
    CONSTRAINT valid_word_count CHECK (word_count IS NULL OR word_count > 0)
);

-- product_categories table
CREATE TABLE IF NOT EXISTS public.product_categories (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    parent_id uuid REFERENCES public.product_categories(id) ON DELETE CASCADE,
    path ltree,
    level integer DEFAULT 1 NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    image_url text,
    icon_name text,
    metadata jsonb DEFAULT '{}'::jsonb,
    seo_title text,
    seo_description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    CONSTRAINT no_self_reference CHECK (id != parent_id)
);

-- product_category_relations table
CREATE TABLE IF NOT EXISTS public.product_category_relations (
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.product_categories(id) ON DELETE CASCADE,
    is_primary boolean DEFAULT false NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT only_one_primary_per_product 
        EXCLUDE USING btree (product_id WITH =) 
        WHERE (is_primary)
);

-- product_variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku text,
    name text NOT NULL,
    description text,
    price_amount decimal(12, 2) NOT NULL,
    price_currency text DEFAULT 'USD' NOT NULL,
    compare_at_amount decimal(12, 2),
    cost_amount decimal(12, 2),
    cost_currency text DEFAULT 'USD',
    tax_code text,
    tax_included boolean DEFAULT false,
    track_inventory boolean DEFAULT true NOT NULL,
    inventory_quantity integer DEFAULT 0 NOT NULL,
    inventory_policy text DEFAULT 'deny' NOT NULL, -- deny, continue, or allow_notify
    inventory_management text, -- 'shopify', 'manual', etc.
    low_stock_threshold integer DEFAULT 5,
    barcode text,
    barcode_type text,
    weight_grams decimal(10, 2),
    weight_unit text DEFAULT 'g',
    height_cm decimal(10, 2),
    width_cm decimal(10, 2),
    depth_cm decimal(10, 2),
    dimension_unit text DEFAULT 'cm',
    requires_shipping boolean DEFAULT true NOT NULL,
    is_digital boolean DEFAULT false NOT NULL,
    digital_file_url text,
    digital_file_name text,
    digital_file_size_bytes bigint,
    is_active boolean DEFAULT true NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    available_for_sale boolean DEFAULT false NOT NULL,
    option1 text,
    option2 text,
    option3 text,
    position integer DEFAULT 0 NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    stripe_price_id text UNIQUE,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT valid_price CHECK (price_amount >= 0),
    CONSTRAINT valid_compare_at_price CHECK (compare_at_amount IS NULL OR compare_at_amount >= 0),
    CONSTRAINT valid_cost CHECK (cost_amount IS NULL OR cost_amount >= 0),
    CONSTRAINT valid_inventory_quantity CHECK (inventory_quantity >= 0),
    CONSTRAINT valid_inventory_policy CHECK (inventory_policy IN ('deny', 'continue', 'allow_notify')),
    CONSTRAINT valid_currency CHECK (price_currency ~ '^[A-Z]{3}$'),
    CONSTRAINT valid_barcode_type CHECK (barcode_type IS NULL OR barcode_type IN ('UPC', 'EAN', 'ISBN', 'ITF', 'CODE39', 'CODE128', 'QR_CODE')),
    CONSTRAINT unique_sku_per_tenant UNIQUE (sku, product_id)
);

-- prices table
CREATE TABLE IF NOT EXISTS public.prices (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    price_id text NOT NULL UNIQUE,
    provider text NOT NULL DEFAULT 'stripe',
    nickname text,
    currency text NOT NULL DEFAULT 'USD',
    amount_cents integer NOT NULL,
    unit_amount integer NOT NULL,
    interval text,
    interval_count integer DEFAULT 1,
    trial_period_days integer DEFAULT 0,
    trial_days integer DEFAULT 0,
    active boolean DEFAULT true NOT NULL,
    is_recurring BOOLEAN DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- stripe_customers table
CREATE TABLE IF NOT EXISTS public.stripe_customers (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id text NOT NULL UNIQUE,
    email text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider text NOT NULL DEFAULT 'stripe',
    provider_subscription_id text NOT NULL,
    plan_id text,
    plan_price_id uuid REFERENCES public.prices(id),
    status public.subscription_status NOT NULL DEFAULT 'active',
    cancel_at_period_end boolean DEFAULT false,
    current_period_start timestamptz,
    current_period_end timestamptz,
    trial_start timestamptz,
    trial_end timestamptz,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    canceled_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    billing_cycle_anchor timestamptz,
    days_until_due integer,
    collection_method public.collection_method DEFAULT 'charge_automatically',
    CONSTRAINT valid_period CHECK (current_period_end > current_period_start),
    CONSTRAINT valid_trial_period CHECK (
        (trial_start IS NULL AND trial_end IS NULL) OR 
        (trial_start IS NOT NULL AND trial_end IS NOT NULL AND trial_end > trial_start)
    ),
    CONSTRAINT valid_cancellation CHECK (
        (status != 'canceled' AND canceled_at IS NULL AND ended_at IS NULL) OR
        (status = 'canceled' AND canceled_at IS NOT NULL)
    )
);

-- subscription_items table
CREATE TABLE IF NOT EXISTS public.subscription_items (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    price_id text, -- References external price ID (e.g., from Stripe)
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
    unit_amount decimal(12, 2) NOT NULL,
    currency text NOT NULL DEFAULT 'USD',
    quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    stripe_checkout_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    subtotal INTEGER NOT NULL DEFAULT 0,
    tax_amount INTEGER DEFAULT 0,
    shipping_amount INTEGER DEFAULT 0,
    discount_amount INTEGER DEFAULT 0,
    total_amount INTEGER NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'unpaid',
    fulfillment_status TEXT DEFAULT 'unfulfilled',
    email TEXT NOT NULL,
    phone TEXT,
    billing_address JSONB NOT NULL DEFAULT '{}',
    shipping_address JSONB DEFAULT '{}',
    notes TEXT,
    admin_notes TEXT,
    promotion_code TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    confirmed_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    variant_id UUID REFERENCES public.product_variants(id),
    stripe_price_id TEXT,
    product_name TEXT NOT NULL,
    variant_name TEXT,
    sku TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_amount INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    access_granted BOOLEAN DEFAULT false,
    access_granted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
    id text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    price_id text NOT NULL REFERENCES public.prices(price_id) ON DELETE RESTRICT,
    status text NOT NULL,
    purchased_at timestamptz DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

-- invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    total integer NOT NULL,
    currency text NOT NULL,
    hosted_invoice_url text,
    pdf_url text,
    status text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- subscription_invoices table
CREATE TABLE IF NOT EXISTS public.subscription_invoices (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_number text NOT NULL UNIQUE,
    status public.invoice_status NOT NULL DEFAULT 'draft',
    amount_due decimal(12, 2) NOT NULL,
    amount_paid decimal(12, 2) DEFAULT 0,
    amount_remaining decimal(12, 2) GENERATED ALWAYS AS (amount_due - amount_paid) STORED,
    currency text NOT NULL DEFAULT 'USD',
    billing_reason text,
    period_start timestamptz NOT NULL,
    period_end timestamptz NOT NULL,
    payment_intent_id text,
    payment_status public.payment_status DEFAULT 'unpaid',
    paid_at timestamptz,
    invoice_pdf_url text,
    hosted_invoice_url text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT valid_amounts CHECK (amount_due >= 0 AND amount_paid >= 0 AND amount_remaining >= 0),
    CONSTRAINT valid_period CHECK (period_end > period_start)
);

-- subscription_invoice_items table
CREATE TABLE IF NOT EXISTS public.subscription_invoice_items (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    invoice_id uuid NOT NULL REFERENCES public.subscription_invoices(id) ON DELETE CASCADE,
    subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    subscription_item_id uuid REFERENCES public.subscription_items(id) ON DELETE SET NULL,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
    price_id text,
    amount decimal(12, 2) NOT NULL,
    currency text NOT NULL DEFAULT 'USD',
    quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_amount decimal(12, 2) GENERATED ALWAYS AS (amount / NULLIF(quantity, 0)) STORED,
    description text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- subscription_discounts table
CREATE TABLE IF NOT EXISTS public.subscription_discounts (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    coupon_id text,
    amount_off decimal(12, 2),
    percent_off decimal(5, 2) CHECK (percent_off > 0 AND percent_off <= 100),
    currency text,
    duration public.subscription_discount_duration NOT NULL,
    duration_in_months integer,
    start_date timestamptz NOT NULL,
    end_date timestamptz,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT valid_discount CHECK (
        (amount_off IS NOT NULL AND currency IS NOT NULL AND percent_off IS NULL) OR
        (amount_off IS NULL AND percent_off IS NOT NULL)
    ),
    CONSTRAINT valid_duration_months CHECK (
        (duration = 'repeating' AND duration_in_months IS NOT NULL) OR
        (duration != 'repeating' AND duration_in_months IS NULL)
    )
);

-- refunds table
CREATE TABLE IF NOT EXISTS public.refunds (
    id text PRIMARY KEY,
    invoice_id text NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    currency text NOT NULL,
    reason text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- subscription_plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]',
  stripe_product_id TEXT UNIQUE,
  stripe_price_id TEXT UNIQUE,
  price_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd' NOT NULL,
  billing_interval TEXT NOT NULL CHECK (billing_interval IN ('month', 'year')),
  interval_count INTEGER NOT NULL DEFAULT 1,
  trial_period_days INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  privileges JSONB DEFAULT '{}',
  metadata JSONB,
  sort_order INTEGER DEFAULT 0
);

-- subscription_usage_records table
CREATE TABLE IF NOT EXISTS public.subscription_usage_records (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    subscription_item_id uuid NOT NULL REFERENCES public.subscription_items(id) ON DELETE CASCADE,
    quantity bigint NOT NULL,
    timestamp timestamptz NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT valid_quantity CHECK (quantity >= 0)
);

-- subscription_notes table
CREATE TABLE IF NOT EXISTS public.subscription_notes (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    subscription_id uuid NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    note text NOT NULL,
    is_visible_to_customer boolean NOT NULL DEFAULT false,
    is_system_note boolean NOT NULL DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- entitlements table
CREATE TABLE IF NOT EXISTS public.entitlements (
    id bigserial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    work_id uuid REFERENCES public.works(id) ON DELETE CASCADE,
    scope text NOT NULL, -- 'work', 'chapter', 'subscription'
    source text NOT NULL, -- 'purchase', 'subscription', 'admin_grant'
    source_id uuid, -- Reference to subscription, order, etc.
    is_active boolean DEFAULT true,
    starts_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- subscription_usage table
CREATE TABLE IF NOT EXISTS public.subscription_usage (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1,
  usage_limit INTEGER,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL
);

-- promotions table
CREATE TABLE IF NOT EXISTS public.promotions (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    code text NOT NULL UNIQUE,
    description text,
    discount_type public.discount_type NOT NULL,
    discount_value numeric NOT NULL,
    active boolean DEFAULT true NOT NULL,
    start_date timestamptz,
    end_date timestamptz,
    usage_limit integer,
    usage_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT promotions_code_check CHECK (code <> ''),
    CONSTRAINT promotions_discount_value_check CHECK (discount_value > 0)
);

-- stripe_webhook_events table
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed BOOLEAN DEFAULT false,
  data JSONB NOT NULL,
  error_message TEXT
);

-- product_reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title text,
    review_text text,
    is_verified_purchase boolean DEFAULT false,
    is_approved boolean DEFAULT false,
    approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE (user_id, product_id)
);

-- inventory_movements table
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    quantity_before INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    reason TEXT,
    reference_type TEXT,
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- shopping_carts table
CREATE TABLE IF NOT EXISTS public.shopping_carts (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
    CONSTRAINT cart_user_or_session CHECK (
        (user_id IS NOT NULL AND session_id IS NULL) OR
        (user_id IS NULL AND session_id IS NOT NULL)
    )
);

-- cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES public.shopping_carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(cart_id, product_id, variant_id)
);

-- stripe_sync_logs table
CREATE TABLE IF NOT EXISTS public.stripe_sync_logs (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    sync_type TEXT NOT NULL,
    status TEXT NOT NULL,
    result JSONB,
    error_details TEXT,
    items_processed INTEGER DEFAULT 0,
    items_synced INTEGER DEFAULT 0,
    items_failed INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER
);

-- timeline_events table
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

-- timeline_nested_events table
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

-- authors_journey_posts table
CREATE TABLE IF NOT EXISTS public.authors_journey_posts (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    content TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    author_id UUID REFERENCES auth.users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- writing_guides table
CREATE TABLE IF NOT EXISTS public.writing_guides (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    content TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTz,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- video_tutorials table
CREATE TABLE IF NOT EXISTS public.video_tutorials (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- downloadable_templates table
CREATE TABLE IF NOT EXISTS public.downloadable_templates (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT, -- Path to the file in Supabase Storage
    thumbnail_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- professional_services table
CREATE TABLE IF NOT EXISTS public.professional_services (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    service_type TEXT NOT NULL, -- e.g., 'developmental-editing', 'line-editing'
    title TEXT NOT NULL,
    description TEXT,
    is_available BOOLEAN DEFAULT true,
    price NUMERIC(10, 2),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.authors_journey_posts(id) ON DELETE CASCADE, -- For authors_journey_posts
    guide_id UUID REFERENCES public.writing_guides(id) ON DELETE CASCADE, -- For writing_guides
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For replies
    author_name TEXT,
    author_email TEXT,
    CONSTRAINT chk_one_content_id CHECK (num_nonnulls(post_id, guide_id) = 1),
    CONSTRAINT chk_comment_author CHECK (
        (user_id IS NOT NULL AND author_name IS NULL AND author_email IS NULL) OR
        (user_id IS NULL AND author_name IS NOT NULL AND author_email IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS public.order_notes (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    note text NOT NULL,
    is_visible_to_customer boolean DEFAULT false NOT NULL,
    is_customer_notified boolean DEFAULT false NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_shipments (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    tracking_number text,
    carrier text,
    shipped_at timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_refunds (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    currency text NOT NULL,
    reason text,
    created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.audit_log (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    action text NOT NULL,
    actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- learn_sections table
CREATE TABLE IF NOT EXISTS public.learn_sections (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title text NOT NULL,
    description text,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- learn_cards table
CREATE TABLE IF NOT EXISTS public.learn_cards (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    section_id uuid NOT NULL REFERENCES public.learn_sections(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);