export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export type Database = {
    __InternalSupabase: {
        PostgrestVersion: "13.0.4";
    };
    public: {
        Tables: {
            audit_log: {
                Row: {
                    action: string;
                    actor_user_id: string | null;
                    after: Json | null;
                    before: Json | null;
                    created_at: string | null;
                    id: number;
                    ip: unknown | null;
                    target_id: string | null;
                    target_type: string | null;
                    target_user_id: string | null;
                    user_agent: string | null;
                };
                Insert: {
                    action: string;
                    actor_user_id?: string | null;
                    after?: Json | null;
                    before?: Json | null;
                    created_at?: string | null;
                    id?: number;
                    ip?: unknown | null;
                    target_id?: string | null;
                    target_type?: string | null;
                    target_user_id?: string | null;
                    user_agent?: string | null;
                };
                Update: {
                    action?: string;
                    actor_user_id?: string | null;
                    after?: Json | null;
                    before?: Json | null;
                    created_at?: string | null;
                    id?: number;
                    ip?: unknown | null;
                    target_id?: string | null;
                    target_type?: string | null;
                    target_user_id?: string | null;
                    user_agent?: string | null;
                };
                Relationships: [];
            };
            beta_applications: {
                Row: {
                    access_needs: string | null;
                    admin_notes: string | null;
                    beta_commitment: string;
                    chapter_summary: string | null;
                    clarity_feedback: string | null;
                    communication: string;
                    composite_score: number | null;
                    country: string | null;
                    created_at: string | null;
                    demographics: string | null;
                    devices: string[] | null;
                    email: string;
                    feedback_philosophy: string;
                    full_name: string;
                    goodreads: string | null;
                    hours_per_week: string;
                    id: string;
                    interest_statement: string;
                    overall_assessment: string | null;
                    pacing_analysis: string | null;
                    passage_a_analysis: string | null;
                    passage_b_analysis: string | null;
                    portal_use: string;
                    prior_beta: string | null;
                    priority_fix: string | null;
                    q1: string | null;
                    q2: string | null;
                    recent_reads: string | null;
                    stage1_auto_fail: boolean | null;
                    stage1_passed: boolean | null;
                    stage1_raw_score: number | null;
                    stage2_passed: boolean | null;
                    stage2_raw_score: number | null;
                    stage3_passed: boolean | null;
                    stage3_raw_score: number | null;
                    stage4_passed: boolean | null;
                    stage4_raw_score: number | null;
                    status: Database["public"]["Enums"]["beta_application_status"] | null;
                    taste_alignment: string | null;
                    time_zone: string;
                    track_record: string | null;
                    user_id: string | null;
                    worse_passage: string | null;
                };
                Insert: {
                    access_needs?: string | null;
                    admin_notes?: string | null;
                    beta_commitment: string;
                    chapter_summary?: string | null;
                    clarity_feedback?: string | null;
                    communication: string;
                    composite_score?: number | null;
                    country?: string | null;
                    created_at?: string | null;
                    demographics?: string | null;
                    devices?: string[] | null;
                    email: string;
                    feedback_philosophy: string;
                    full_name: string;
                    goodreads?: string | null;
                    hours_per_week: string;
                    id?: string;
                    interest_statement: string;
                    overall_assessment?: string | null;
                    pacing_analysis?: string | null;
                    passage_a_analysis?: string | null;
                    passage_b_analysis?: string | null;
                    portal_use: string;
                    prior_beta?: string | null;
                    priority_fix?: string | null;
                    q1?: string | null;
                    q2?: string | null;
                    recent_reads?: string | null;
                    stage1_auto_fail?: boolean | null;
                    stage1_passed?: boolean | null;
                    stage1_raw_score?: number | null;
                    stage2_passed?: boolean | null;
                    stage2_raw_score?: number | null;
                    stage3_passed?: boolean | null;
                    stage3_raw_score?: number | null;
                    stage4_passed?: boolean | null;
                    stage4_raw_score?: number | null;
                    status?: Database["public"]["Enums"]["beta_application_status"] | null;
                    taste_alignment?: string | null;
                    time_zone: string;
                    track_record?: string | null;
                    user_id?: string | null;
                    worse_passage?: string | null;
                };
                Update: {
                    access_needs?: string | null;
                    admin_notes?: string | null;
                    beta_commitment?: string;
                    chapter_summary?: string | null;
                    clarity_feedback?: string | null;
                    communication?: string;
                    composite_score?: number | null;
                    country?: string | null;
                    created_at?: string | null;
                    demographics?: string | null;
                    devices?: string[] | null;
                    email?: string;
                    feedback_philosophy?: string;
                    full_name?: string;
                    goodreads?: string | null;
                    hours_per_week?: string;
                    id?: string;
                    interest_statement?: string;
                    overall_assessment?: string | null;
                    pacing_analysis?: string | null;
                    passage_a_analysis?: string | null;
                    passage_b_analysis?: string | null;
                    portal_use?: string;
                    prior_beta?: string | null;
                    priority_fix?: string | null;
                    q1?: string | null;
                    q2?: string | null;
                    recent_reads?: string | null;
                    stage1_auto_fail?: boolean | null;
                    stage1_passed?: boolean | null;
                    stage1_raw_score?: number | null;
                    stage2_passed?: boolean | null;
                    stage2_raw_score?: number | null;
                    stage3_passed?: boolean | null;
                    stage3_raw_score?: number | null;
                    stage4_passed?: boolean | null;
                    stage4_raw_score?: number | null;
                    status?: Database["public"]["Enums"]["beta_application_status"] | null;
                    taste_alignment?: string | null;
                    time_zone?: string;
                    track_record?: string | null;
                    user_id?: string | null;
                    worse_passage?: string | null;
                };
                Relationships: [];
            };
            chapters: {
                Row: {
                    chapter_number: number;
                    created_at: string;
                    estimated_read_time: number | null;
                    file_path: string;
                    id: string;
                    is_published: boolean | null;
                    title: string;
                    updated_at: string;
                    word_count: number | null;
                    work_id: string;
                };
                Insert: {
                    chapter_number: number;
                    created_at?: string;
                    estimated_read_time?: number | null;
                    file_path: string;
                    id?: string;
                    is_published?: boolean | null;
                    title: string;
                    updated_at?: string;
                    word_count?: number | null;
                    work_id: string;
                };
                Update: {
                    chapter_number?: number;
                    created_at?: string;
                    estimated_read_time?: number | null;
                    file_path?: string;
                    id?: string;
                    is_published?: boolean | null;
                    title?: string;
                    updated_at?: string;
                    word_count?: number | null;
                    work_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "chapters_work_id_fkey";
                        columns: ["work_id"];
                        isOneToOne: false;
                        referencedRelation: "works";
                        referencedColumns: ["id"];
                    }
                ];
            };
            characters: {
                Row: {
                    created_at: string;
                    description: string | null;
                    id: string;
                    image_url: string | null;
                    name: string;
                    silhouette_url: string | null;
                    title: string | null;
                    traits: string[] | null;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    image_url?: string | null;
                    name: string;
                    silhouette_url?: string | null;
                    title?: string | null;
                    traits?: string[] | null;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    image_url?: string | null;
                    name?: string;
                    silhouette_url?: string | null;
                    title?: string | null;
                    traits?: string[] | null;
                    updated_at?: string;
                };
                Relationships: [];
            };
            daily_spins: {
                Row: {
                    spin_count: number;
                    spin_date: string;
                    user_id: string;
                };
                Insert: {
                    spin_count?: number;
                    spin_date: string;
                    user_id: string;
                };
                Update: {
                    spin_count?: number;
                    spin_date?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            entitlements: {
                Row: {
                    created_at: string;
                    created_by: string | null;
                    ends_at: string | null;
                    id: number;
                    scope: string;
                    source: string;
                    starts_at: string | null;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    created_by?: string | null;
                    ends_at?: string | null;
                    id?: number;
                    scope: string;
                    source: string;
                    starts_at?: string | null;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    created_by?: string | null;
                    ends_at?: string | null;
                    id?: number;
                    scope?: string;
                    source?: string;
                    starts_at?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            homepage_content: {
                Row: {
                    content: string | null;
                    created_at: string;
                    id: number;
                    section: string | null;
                    title: string | null;
                };
                Insert: {
                    content?: string | null;
                    created_at?: string;
                    id?: number;
                    section?: string | null;
                    title?: string | null;
                };
                Update: {
                    content?: string | null;
                    created_at?: string;
                    id?: number;
                    section?: string | null;
                    title?: string | null;
                };
                Relationships: [];
            };
            invoices: {
                Row: {
                    created_at: string;
                    currency: string;
                    hosted_invoice_url: string | null;
                    id: string;
                    pdf_url: string | null;
                    status: string;
                    subscription_id: string | null;
                    total: number;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    currency: string;
                    hosted_invoice_url?: string | null;
                    id: string;
                    pdf_url?: string | null;
                    status: string;
                    subscription_id?: string | null;
                    total: number;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    currency?: string;
                    hosted_invoice_url?: string | null;
                    id?: string;
                    pdf_url?: string | null;
                    status?: string;
                    subscription_id?: string | null;
                    total?: number;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "invoices_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscriptions";
                        referencedColumns: ["id"];
                    }
                ];
            };
            news_items: {
                Row: {
                    content: string | null;
                    created_at: string;
                    date: string;
                    id: string;
                    status: string | null;
                    title: string;
                    updated_at: string;
                };
                Insert: {
                    content?: string | null;
                    created_at?: string;
                    date: string;
                    id?: string;
                    status?: string | null;
                    title: string;
                    updated_at?: string;
                };
                Update: {
                    content?: string | null;
                    created_at?: string;
                    date?: string;
                    id?: string;
                    status?: string | null;
                    title?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            pages: {
                Row: {
                    category_id: string | null;
                    content: string | null;
                    created_at: string;
                    folder_id: string | null;
                    id: string;
                    is_published: boolean | null;
                    published_at: string | null;
                    seo_description: string | null;
                    seo_keywords: string[] | null;
                    seo_title: string | null;
                    slug: string;
                    status: string | null;
                    title: string;
                    updated_at: string;
                    view_count: number | null;
                };
                Insert: {
                    category_id?: string | null;
                    content?: string | null;
                    created_at?: string;
                    folder_id?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    published_at?: string | null;
                    seo_description?: string | null;
                    seo_keywords?: string[] | null;
                    seo_title?: string | null;
                    slug: string;
                    status?: string | null;
                    title: string;
                    updated_at?: string;
                    view_count?: number | null;
                };
                Update: {
                    category_id?: string | null;
                    content?: string | null;
                    created_at?: string;
                    folder_id?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    published_at?: string | null;
                    seo_description?: string | null;
                    seo_keywords?: string[] | null;
                    seo_title?: string | null;
                    slug?: string;
                    status?: string | null;
                    title?: string;
                    updated_at?: string;
                    view_count?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "pages_category_id_fkey";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_categories";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "pages_folder_id_fkey";
                        columns: ["folder_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_folders";
                        referencedColumns: ["id"];
                    }
                ];
            };
            posts: {
                Row: {
                    author_id: string | null;
                    content: string | null;
                    created_at: string;
                    id: string;
                    slug: string;
                    status: string | null;
                    title: string;
                    updated_at: string;
                    views: number | null;
                };
                Insert: {
                    author_id?: string | null;
                    content?: string | null;
                    created_at?: string;
                    id?: string;
                    slug: string;
                    status?: string | null;
                    title: string;
                    updated_at?: string;
                    views?: number | null;
                };
                Update: {
                    author_id?: string | null;
                    content?: string | null;
                    created_at?: string;
                    id?: string;
                    slug?: string;
                    status?: string | null;
                    title?: string;
                    updated_at?: string;
                    views?: number | null;
                };
                Relationships: [];
            };
            prices: {
                Row: {
                    active: boolean;
                    created_at: string;
                    currency: string;
                    id: string;
                    interval: string | null;
                    nickname: string | null;
                    product_id: string;
                    trial_days: number | null;
                    unit_amount: number;
                    updated_at: string;
                };
                Insert: {
                    active?: boolean;
                    created_at?: string;
                    currency: string;
                    id: string;
                    interval?: string | null;
                    nickname?: string | null;
                    product_id: string;
                    trial_days?: number | null;
                    unit_amount: number;
                    updated_at?: string;
                };
                Update: {
                    active?: boolean;
                    created_at?: string;
                    currency?: string;
                    id?: string;
                    interval?: string | null;
                    nickname?: string | null;
                    product_id?: string;
                    trial_days?: number | null;
                    unit_amount?: number;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "prices_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    }
                ];
            };
            product_reviews: {
                Row: {
                    created_at: string;
                    id: string;
                    product_id: string;
                    rating: number;
                    review_text: string | null;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    product_id: string;
                    rating: number;
                    review_text?: string | null;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    product_id?: string;
                    rating?: number;
                    review_text?: string | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "product_reviews_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    }
                ];
            };
            products: {
                Row: {
                    active: boolean;
                    content_grants: Json | null;
                    created_at: string;
                    description: string | null;
                    id: string;
                    images: string[] | null;
                    name: string;
                    product_type: Database["public"]["Enums"]["product_type"] | null;
                    slug: string | null;
                    stripe_product_id: string | null;
                    updated_at: string;
                    work_id: string | null;
                };
                Insert: {
                    active?: boolean;
                    content_grants?: Json | null;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    images?: string[] | null;
                    name: string;
                    product_type?: Database["public"]["Enums"]["product_type"] | null;
                    slug?: string | null;
                    stripe_product_id?: string | null;
                    updated_at?: string;
                    work_id?: string | null;
                };
                Update: {
                    active?: boolean;
                    content_grants?: Json | null;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    images?: string[] | null;
                    name?: string;
                    product_type?: Database["public"]["Enums"]["product_type"] | null;
                    slug?: string | null;
                    stripe_product_id?: string | null;
                    updated_at?: string;
                    work_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "products_work_id_fkey";
                        columns: ["work_id"];
                        isOneToOne: false;
                        referencedRelation: "works";
                        referencedColumns: ["id"];
                    }
                ];
            };
            product_variants: {
                Row: {
                    id: string;
                    product_id: string;
                    name: string | null;
                    sku: string | null;
                    unit_amount: number;
                    currency: string;
                    recurring_interval: string | null;
                    recurring_interval_count: number | null;
                    inventory_quantity: number | null;
                    active: boolean;
                    is_default: boolean | null;
                    stripe_price_id: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    product_id: string;
                    name?: string | null;
                    sku?: string | null;
                    unit_amount: number;
                    currency?: string;
                    recurring_interval?: string | null;
                    recurring_interval_count?: number | null;
                    inventory_quantity?: number | null;
                    active?: boolean;
                    is_default?: boolean | null;
                    stripe_price_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    product_id?: string;
                    name?: string | null;
                    sku?: string | null;
                    unit_amount?: number;
                    currency?: string;
                    recurring_interval?: string | null;
                    recurring_interval_count?: number | null;
                    inventory_quantity?: number | null;
                    active?: boolean;
                    is_default?: boolean | null;
                    stripe_price_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "product_variants_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    }
                ];
            };
            stripe_sync_logs: {
                Row: {
                    id: string;
                    sync_type: string;
                    status: string;
                    started_at: string;
                    completed_at: string | null;
                    items_processed: number | null;
                    items_synced: number | null;
                    items_failed: number | null;
                    error_details: string | null;
                    result: Json | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    sync_type: string;
                    status: string;
                    started_at?: string;
                    completed_at?: string | null;
                    items_processed?: number | null;
                    items_synced?: number | null;
                    items_failed?: number | null;
                    error_details?: string | null;
                    result?: Json | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    sync_type?: string;
                    status?: string;
                    started_at?: string;
                    completed_at?: string | null;
                    items_processed?: number | null;
                    items_synced?: number | null;
                    items_failed?: number | null;
                    error_details?: string | null;
                    result?: Json | null;
                    created_at?: string;
                };
                Relationships: [];
            };
            inventory_movements: {
                Row: {
                    id: string;
                    variant_id: string;
                    movement_type: string;
                    quantity_change: number;
                    reason: string;
                    reference_type: string | null;
                    reference_id: string | null;
                    created_by: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    variant_id: string;
                    movement_type: string;
                    quantity_change: number;
                    reason: string;
                    reference_type?: string | null;
                    reference_id?: string | null;
                    created_by?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    variant_id?: string;
                    movement_type?: string;
                    quantity_change?: number;
                    reason?: string;
                    reference_type?: string | null;
                    reference_id?: string | null;
                    created_by?: string | null;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "inventory_movements_variant_id_fkey";
                        columns: ["variant_id"];
                        isOneToOne: false;
                        referencedRelation: "product_variants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            profiles: {
                Row: {
                    avatar_url: string | null;
                    beta_reader_status: Database["public"]["Enums"]["beta_reader_status"];
                    created_at: string;
                    display_name: string | null;
                    id: string;
                    role: Database["public"]["Enums"]["user_role"];
                    updated_at: string;
                    username: string | null | null;
                    website: string | null;
                };
                Insert: {
                    avatar_url?: string | null;
                    beta_reader_status?: Database["public"]["Enums"]["beta_reader_status"];
                    created_at?: string;
                    display_name?: string | null;
                    id: string;
                    role?: Database["public"]["Enums"]["user_role"];
                    updated_at?: string;
                    username?: string | null;
                    website?: string | null;
                };
                Update: {
                    avatar_url?: string | null;
                    beta_reader_status?: Database["public"]["Enums"]["beta_reader_status"];
                    created_at?: string;
                    display_name?: string | null;
                    id?: string;
                    role?: Database["public"]["Enums"]["user_role"];
                    updated_at?: string;
                    username?: string | null;
                    website?: string | null;
                };
                Relationships: [];
            };
            promotions: {
                Row: {
                    active: boolean;
                    code: string;
                    created_at: string;
                    description: string | null;
                    discount_type: Database["public"]["Enums"]["discount_type"];
                    discount_value: number;
                    end_date: string | null;
                    id: string;
                    start_date: string | null;
                    updated_at: string;
                    usage_count: number | null;
                    usage_limit: number | null;
                };
                Insert: {
                    active?: boolean;
                    code: string;
                    created_at?: string;
                    description?: string | null;
                    discount_type: Database["public"]["Enums"]["discount_type"];
                    discount_value: number;
                    end_date?: string | null;
                    id?: string;
                    start_date?: string | null;
                    updated_at?: string;
                    usage_count?: number | null;
                    usage_limit?: number | null;
                };
                Update: {
                    active?: boolean;
                    code?: string;
                    created_at?: string;
                    description?: string | null;
                    discount_type?: Database["public"]["Enums"]["discount_type"];
                    discount_value?: number;
                    end_date?: string | null;
                    id?: string;
                    start_date?: string | null;
                    updated_at?: string;
                    usage_count?: number | null;
                    usage_limit?: number | null;
                };
                Relationships: [];
            };
            purchases: {
                Row: {
                    id: string;
                    metadata: Json | null;
                    price_id: string;
                    product_id: string;
                    purchased_at: string;
                    status: string;
                    user_id: string;
                };
                Insert: {
                    id: string;
                    metadata?: Json | null;
                    price_id: string;
                    product_id: string;
                    purchased_at?: string;
                    status: string;
                    user_id: string;
                };
                Update: {
                    id?: string;
                    metadata?: Json | null;
                    price_id?: string;
                    product_id?: string;
                    purchased_at?: string;
                    status?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "purchases_price_id_fkey";
                        columns: ["price_id"];
                        isOneToOne: false;
                        referencedRelation: "prices";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "purchases_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    }
                ];
            };
            reading_progress: {
                Row: {
                    chapter_id: string;
                    id: string;
                    is_completed: boolean | null;
                    last_position: string | null;
                    last_read_at: string;
                    progress_percentage: number | null;
                    user_id: string;
                };
                Insert: {
                    chapter_id: string;
                    id?: string;
                    is_completed?: boolean | null;
                    last_position?: string | null;
                    last_read_at?: string;
                    progress_percentage?: number | null;
                    user_id: string;
                };
                Update: {
                    chapter_id?: string;
                    id?: string;
                    is_completed?: boolean | null;
                    last_position?: string | null;
                    last_read_at?: string;
                    progress_percentage?: number | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "reading_progress_chapter_id_fkey";
                        columns: ["chapter_id"];
                        isOneToOne: false;
                        referencedRelation: "chapters";
                        referencedColumns: ["id"];
                    }
                ];
            };
            recent_activity: {
                Row: {
                    created_at: string;
                    description: string;
                    id: string;
                    type: string;
                };
                Insert: {
                    created_at?: string;
                    description: string;
                    id?: string;
                    type: string;
                };
                Update: {
                    created_at?: string;
                    description?: string;
                    id?: string;
                    type?: string;
                };
                Relationships: [];
            };
            refunds: {
                Row: {
                    amount: number;
                    created_at: string;
                    currency: string;
                    id: string;
                    invoice_id: string;
                    reason: string | null;
                };
                Insert: {
                    amount: number;
                    created_at?: string;
                    currency: string;
                    id: string;
                    invoice_id: string;
                    reason?: string | null;
                };
                Update: {
                    amount?: number;
                    created_at?: string;
                    currency?: string;
                    id?: string;
                    invoice_id?: string;
                    reason?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "refunds_invoice_id_fkey";
                        columns: ["invoice_id"];
                        isOneToOne: false;
                        referencedRelation: "invoices";
                        referencedColumns: ["id"];
                    }
                ];
            };
            release_items: {
                Row: {
                    created_at: string;
                    description: string | null;
                    id: string;
                    purchase_link: string | null;
                    release_date: string;
                    status: string | null;
                    title: string;
                    type: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    purchase_link?: string | null;
                    release_date: string;
                    status?: string | null;
                    title: string;
                    type: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    purchase_link?: string | null;
                    release_date?: string;
                    status?: string | null;
                    title?: string;
                    type?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            subscriptions: {
                Row: {
                    cancel_at_period_end: boolean | null;
                    created_at: string;
                    current_period_end: string | null;
                    current_period_start: string | null;
                    id: string;
                    metadata: Json | null;
                    plan_id: string;
                    status: Database["public"]["Enums"]["subscription_status"];
                    trial_end: string | null;
                    trial_start: string | null;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    cancel_at_period_end?: boolean | null;
                    created_at?: string;
                    current_period_end?: string | null;
                    current_period_start?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    plan_id: string;
                    status: Database["public"]["Enums"]["subscription_status"];
                    trial_end?: string | null;
                    trial_start?: string | null;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    cancel_at_period_end?: boolean | null;
                    created_at?: string;
                    current_period_end?: string | null;
                    current_period_start?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    plan_id?: string;
                    status?: Database["public"]["Enums"]["subscription_status"];
                    trial_end?: string | null;
                    trial_start?: string | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            timeline_events: {
                Row: {
                    background_image: string | null;
                    created_at: string | null;
                    created_by: string | null;
                    date: string;
                    description: string;
                    details: string | null;
                    id: string;
                    is_published: boolean | null;
                    order: number;
                    title: string;
                    updated_at: string | null;
                    updated_by: string | null;
                };
                Insert: {
                    background_image?: string | null;
                    created_at?: string | null;
                    created_by?: string | null;
                    date: string;
                    description: string;
                    details?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    order?: number;
                    title: string;
                    updated_at?: string | null;
                    updated_by?: string | null;
                };
                Update: {
                    background_image?: string | null;
                    created_at?: string | null;
                    created_by?: string | null;
                    date?: string;
                    description?: string;
                    details?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    order?: number;
                    title?: string;
                    updated_at?: string | null;
                    updated_by?: string | null;
                };
                Relationships: [];
            };
            timeline_nested_events: {
                Row: {
                    created_at: string | null;
                    date: string;
                    description: string;
                    id: string;
                    order: number;
                    timeline_event_id: string;
                    title: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    date: string;
                    description: string;
                    id?: string;
                    order?: number;
                    timeline_event_id: string;
                    title: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    date?: string;
                    description?: string;
                    id?: string;
                    order?: number;
                    timeline_event_id?: string;
                    title?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "timeline_nested_events_timeline_event_id_fkey";
                        columns: ["timeline_event_id"];
                        isOneToOne: false;
                        referencedRelation: "timeline_events";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_activities: {
                Row: {
                    activity_type: string;
                    cover_image_url: string | null;
                    id: string;
                    item_id: string | null;
                    item_title: string;
                    progress: number | null;
                    status: string;
                    timestamp: string;
                    total_progress: number | null;
                    user_id: string;
                };
                Insert: {
                    activity_type: string;
                    cover_image_url?: string | null;
                    id?: string;
                    item_id?: string | null;
                    item_title: string;
                    progress?: number | null;
                    status: string;
                    timestamp?: string;
                    total_progress?: number | null;
                    user_id: string;
                };
                Update: {
                    activity_type?: string;
                    cover_image_url?: string | null;
                    id?: string;
                    item_id?: string | null;
                    item_title?: string;
                    progress?: number | null;
                    status?: string;
                    timestamp?: string;
                    total_progress?: number | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_ratings: {
                Row: {
                    created_at: string;
                    id: string;
                    rating: number;
                    review_text: string | null;
                    updated_at: string;
                    user_id: string;
                    work_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    rating: number;
                    review_text?: string | null;
                    updated_at?: string;
                    user_id: string;
                    work_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    rating?: number;
                    review_text?: string | null;
                    updated_at?: string;
                    user_id?: string;
                    work_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_ratings_work_id_fkey";
                        columns: ["work_id"];
                        isOneToOne: false;
                        referencedRelation: "works";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_roles: {
                Row: {
                    created_at: string;
                    granted_by: string | null;
                    role: Database["public"]["Enums"]["user_role"];
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    granted_by?: string | null;
                    role: Database["public"]["Enums"]["user_role"];
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    granted_by?: string | null;
                    role?: Database["public"]["Enums"]["user_role"];
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_roles_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_stats: {
                Row: {
                    achievements: number;
                    books_read: number;
                    currently_reading: string;
                    reading_hours: number;
                    user_id: string;
                };
                Insert: {
                    achievements?: number;
                    books_read?: number;
                    currently_reading?: string;
                    reading_hours?: number;
                    user_id: string;
                };
                Update: {
                    achievements?: number;
                    books_read?: number;
                    currently_reading?: string;
                    reading_hours?: number;
                    user_id?: string;
                };
                Relationships: [];
            };
            webhook_events: {
                Row: {
                    id: string;
                    payload: Json;
                    provider: string;
                    received_at: string | null;
                    type: string;
                };
                Insert: {
                    id: string;
                    payload: Json;
                    provider: string;
                    received_at?: string | null;
                    type: string;
                };
                Update: {
                    id?: string;
                    payload?: Json;
                    provider?: string;
                    received_at?: string | null;
                    type?: string;
                };
                Relationships: [];
            };
            wiki_categories: {
                Row: {
                    created_at: string;
                    created_by: string | null;
                    description: string | null;
                    id: string;
                    name: string;
                    parent_id: string | null;
                    slug: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    created_by?: string | null;
                    description?: string | null;
                    id?: string;
                    name: string;
                    parent_id?: string | null;
                    slug: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    created_by?: string | null;
                    description?: string | null;
                    id?: string;
                    name?: string;
                    parent_id?: string | null;
                    slug?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "wiki_categories_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_categories";
                        referencedColumns: ["id"];
                    }
                ];
            };
            wiki_content_blocks: {
                Row: {
                    content: Json;
                    created_at: string;
                    created_by: string | null;
                    id: string;
                    page_id: string;
                    position: number;
                    type: Database["public"]["Enums"]["content_block_type"];
                    updated_at: string;
                };
                Insert: {
                    content?: Json;
                    created_at?: string;
                    created_by?: string | null;
                    id?: string;
                    page_id: string;
                    position: number;
                    type: Database["public"]["Enums"]["content_block_type"];
                    updated_at?: string;
                };
                Update: {
                    content?: Json;
                    created_at?: string;
                    created_by?: string | null;
                    id?: string;
                    page_id?: string;
                    position?: number;
                    type?: Database["public"]["Enums"]["content_block_type"];
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "wiki_content_blocks_page_id_fkey";
                        columns: ["page_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_pages";
                        referencedColumns: ["id"];
                    }
                ];
            };
            wiki_folders: {
                Row: {
                    created_at: string;
                    created_by: string | null;
                    id: string;
                    name: string;
                    parent_id: string | null;
                    slug: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    created_by?: string | null;
                    id?: string;
                    name: string;
                    parent_id?: string | null;
                    slug: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    created_by?: string | null;
                    id?: string;
                    name?: string;
                    parent_id?: string | null;
                    slug?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "wiki_folders_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_folders";
                        referencedColumns: ["id"];
                    }
                ];
            };
            wiki_media: {
                Row: {
                    alt_text: string | null;
                    caption: string | null;
                    created_at: string;
                    created_by: string;
                    file_name: string;
                    file_path: string;
                    file_size: number;
                    file_type: string;
                    id: string;
                    is_featured: boolean;
                };
                Insert: {
                    alt_text?: string | null;
                    caption?: string | null;
                    created_at?: string;
                    created_by: string;
                    file_name: string;
                    file_path: string;
                    file_size: number;
                    file_type: string;
                    id?: string;
                    is_featured?: boolean;
                };
                Update: {
                    alt_text?: string | null;
                    caption?: string | null;
                    created_at?: string;
                    created_by?: string;
                    file_name?: string;
                    file_path?: string;
                    file_size?: number;
                    file_type?: string;
                    id?: string;
                    is_featured?: boolean;
                };
                Relationships: [];
            };
            wiki_pages: {
                Row: {
                    category_id: string | null;
                    content: string | null;
                    created_at: string;
                    created_by: string | null;
                    excerpt: string | null;
                    folder_id: string | null;
                    id: string;
                    is_published: boolean | null;
                    seo_description: string | null;
                    seo_keywords: string[] | null;
                    seo_title: string | null;
                    slug: string;
                    title: string;
                    updated_at: string;
                    view_count: number | null;
                };
                Insert: {
                    category_id?: string | null;
                    content?: string | null;
                    created_at?: string;
                    created_by?: string | null;
                    excerpt?: string | null;
                    folder_id?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    seo_description?: string | null;
                    seo_keywords?: string[] | null;
                    seo_title?: string | null;
                    slug: string;
                    title: string;
                    updated_at?: string;
                    view_count?: number | null;
                };
                Update: {
                    category_id?: string | null;
                    content?: string | null;
                    created_at?: string;
                    created_by?: string | null;
                    excerpt?: string | null;
                    folder_id?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    seo_description?: string | null;
                    seo_keywords?: string[] | null;
                    seo_title?: string | null;
                    slug?: string;
                    title?: string;
                    updated_at?: string;
                    view_count?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "wiki_pages_category_id_fkey";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_categories";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "wiki_pages_folder_id_fkey";
                        columns: ["folder_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_folders";
                        referencedColumns: ["id"];
                    }
                ];
            };
            wiki_revisions: {
                Row: {
                    change_summary: string | null;
                    content: Json;
                    created_at: string;
                    created_by: string;
                    excerpt: string | null;
                    id: string;
                    page_id: string;
                    title: string;
                };
                Insert: {
                    change_summary?: string | null;
                    content: Json;
                    created_at?: string;
                    created_by: string;
                    excerpt?: string | null;
                    id?: string;
                    page_id: string;
                    title: string;
                };
                Update: {
                    change_summary?: string | null;
                    content?: Json;
                    created_at?: string;
                    created_by?: string;
                    excerpt?: string | null;
                    id?: string;
                    page_id?: string;
                    title?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "wiki_revisions_page_id_fkey";
                        columns: ["page_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_pages";
                        referencedColumns: ["id"];
                    }
                ];
            };
            works: {
                Row: {
                    cover_image_url: string | null;
                    created_at: string;
                    description: string | null;
                    id: string;
                    is_featured: boolean | null;
                    order_in_parent: number | null;
                    parent_id: string | null;
                    release_date: string | null;
                    status: Database["public"]["Enums"]["work_status"];
                    title: string;
                    type: Database["public"]["Enums"]["work_type"];
                    updated_at: string;
                };
                Insert: {
                    cover_image_url?: string | null;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    is_featured?: boolean | null;
                    order_in_parent?: number | null;
                    parent_id?: string | null;
                    release_date?: string | null;
                    status?: Database["public"]["Enums"]["work_status"];
                    title: string;
                    type: Database["public"]["Enums"]["work_type"];
                    updated_at?: string;
                };
                Update: {
                    cover_image_url?: string | null;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    is_featured?: boolean | null;
                    order_in_parent?: number | null;
                    parent_id?: string | null;
                    release_date?: string | null;
                    status?: Database["public"]["Enums"]["work_status"];
                    title?: string;
                    type?: Database["public"]["Enums"]["work_type"];
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "works_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "works";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {
            detailed_audit_log: {
                Row: {
                    action: string | null;
                    actor_display_name: string | null;
                    actor_user_id: string | null;
                    actor_username: string | null;
                    created_at: string | null;
                    id: number | null;
                };
                Relationships: [];
            };
        };
        Functions: {
            create_wiki_page: {
                Args: {
                    p_category_id: string;
                    p_content: Json;
                    p_excerpt: string;
                    p_seo_description?: string;
                    p_seo_keywords?: string[];
                    p_seo_title?: string;
                    p_slug: string;
                    p_title: string;
                    p_user_id: string;
                };
                Returns: string;
            };
            current_user_is_admin: {
                Args: Record<PropertyKey, never>;
                Returns: boolean;
            };
            generate_slug: {
                Args: {
                    title: string;
                };
                Returns: string;
            };
            get_child_folders: {
                Args: {
                    parent_id: string;
                };
                Returns: {
                    id: string;
                    level: number;
                    name: string;
                    slug: string;
                }[];
            };
            get_folder_path: {
                Args: {
                    folder_id: string;
                };
                Returns: {
                    id: string;
                    level: number;
                    name: string;
                    slug: string;
                }[];
            };
            get_user_role: {
                Args: {
                    p_user_id: string;
                };
                Returns: Database["public"]["Enums"]["user_role"];
            };
            increment_wiki_page_views: {
                Args: {
                    page_id: string;
                };
                Returns: undefined;
            };
            is_admin: {
                Args: Record<PropertyKey, never> | {
                    p_user_id: string;
                };
                Returns: boolean;
            };
            create_product_with_variants: {
                Args: {
                    p_product_data: Json;
                    p_variants_data: Json;
                };
                Returns: {
                    product_id: string;
                    variant_ids: string[];
                };
            };
            update_inventory: {
                Args: {
                    p_variant_id: string;
                    p_quantity_change: number;
                    p_movement_type: string;
                    p_reason: string;
                    p_reference_type?: string;
                    p_reference_id?: string;
                    p_user_id?: string;
                };
                Returns: boolean;
            };
            get_user_active_subscription: {
                Args: {
                    user_uuid: string;
                };
                Returns: Json | null;
            };
        };
        Enums: {
            beta_application_status: "pending" | "approved" | "denied";
            beta_reader_status: "not_applied" | "pending" | "approved" | "rejected";
            content_block_type: "heading_1" | "heading_2" | "heading_3" | "paragraph" | "bullet_list" | "ordered_list" | "image" | "table" | "quote" | "code" | "divider";
            discount_type: "percentage" | "fixed_amount";
            product_type: "single_issue" | "bundle" | "chapter_pass" | "arc_pass";
            subscription_status: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "paused";
            user_role: "admin" | "support" | "accountant" | "user" | "super_admin";
            work_status: "planning" | "writing" | "editing" | "published" | "on_hold";
            work_type: "book" | "volume" | "saga" | "arc" | "issue";
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};
type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];
export type Tables<DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | {
    schema: keyof DatabaseWithoutInternals;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"]) : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
    Row: infer R;
} ? R : never : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
    Row: infer R;
} ? R : never : never;
export type TablesInsert<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | {
    schema: keyof DatabaseWithoutInternals;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
} ? I : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I;
} ? I : never : never;
export type TablesUpdate<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | {
    schema: keyof DatabaseWithoutInternals;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
} ? U : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U;
} ? U : never : never;
export type Enums<DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | {
    schema: keyof DatabaseWithoutInternals;
}, EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"] : never = never> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName] : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions] : never;
export type CompositeTypes<PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | {
    schema: keyof DatabaseWithoutInternals;
}, CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"] : never = never> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName] : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions] : never;
export declare const Constants: {
    readonly public: {
        readonly Enums: {
            readonly beta_application_status: readonly ["pending", "approved", "denied"];
            readonly beta_reader_status: readonly ["not_applied", "pending", "approved", "rejected"];
            readonly content_block_type: readonly ["heading_1", "heading_2", "heading_3", "paragraph", "bullet_list", "ordered_list", "image", "table", "quote", "code", "divider"];
            readonly discount_type: readonly ["percentage", "fixed_amount"];
            readonly product_type: readonly ["single_issue", "bundle", "chapter_pass", "arc_pass"];
            readonly subscription_status: readonly ["incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid", "paused"];
            readonly user_role: readonly ["admin", "support", "accountant", "user", "super_admin"];
            readonly work_status: readonly ["planning", "writing", "editing", "published", "on_hold"];
            readonly work_type: readonly ["book", "volume", "saga", "arc", "issue"];
        };
    };
};
export {};
