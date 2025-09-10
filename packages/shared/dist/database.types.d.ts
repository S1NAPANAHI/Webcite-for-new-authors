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
                    communication: string;
                    composite_score: number | null;
                    country: string | null;
                    created_at: string;
                    demographics: string | null;
                    devices: string[] | null;
                    email: string;
                    feedback_philosophy: string;
                    full_name: string;
                    goodreads: string | null;
                    hours_per_week: string;
                    id: string;
                    interest_statement: string;
                    portal_use: string;
                    prior_beta: string | null;
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
                    status: Database["public"]["Enums"]["beta_application_status"];
                    time_zone: string;
                    track_record: string | null;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    access_needs?: string | null;
                    admin_notes?: string | null;
                    beta_commitment: string;
                    communication: string;
                    composite_score?: number | null;
                    country?: string | null;
                    created_at?: string;
                    demographics?: string | null;
                    devices?: string[] | null;
                    email: string;
                    feedback_philosophy: string;
                    full_name: string;
                    goodreads?: string | null;
                    hours_per_week: string;
                    id?: string;
                    interest_statement: string;
                    portal_use: string;
                    prior_beta?: string | null;
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
                    status?: Database["public"]["Enums"]["beta_application_status"];
                    time_zone: string;
                    track_record?: string | null;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    access_needs?: string | null;
                    admin_notes?: string | null;
                    beta_commitment?: string;
                    communication?: string;
                    composite_score?: number | null;
                    country?: string | null;
                    created_at?: string;
                    demographics?: string | null;
                    devices?: string[] | null;
                    email?: string;
                    feedback_philosophy?: string;
                    full_name?: string;
                    goodreads?: string | null;
                    hours_per_week?: string;
                    id?: string;
                    interest_statement?: string;
                    portal_use?: string;
                    prior_beta?: string | null;
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
                    status?: Database["public"]["Enums"]["beta_application_status"];
                    time_zone?: string;
                    track_record?: string | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            chapters: {
                Row: {
                    chapter_number: number;
                    content: string | null;
                    created_at: string;
                    estimated_read_time: number | null;
                    file_path: string | null;
                    id: string;
                    is_free: boolean | null;
                    is_premium: boolean | null;
                    is_published: boolean | null;
                    title: string;
                    updated_at: string;
                    word_count: number | null;
                    work_id: string;
                };
                Insert: {
                    chapter_number: number;
                    content?: string | null;
                    created_at?: string;
                    estimated_read_time?: number | null;
                    file_path?: string | null;
                    id?: string;
                    is_free?: boolean | null;
                    is_premium?: boolean | null;
                    is_published?: boolean | null;
                    title: string;
                    updated_at?: string;
                    word_count?: number | null;
                    work_id: string;
                };
                Update: {
                    chapter_number?: number;
                    content?: string | null;
                    created_at?: string;
                    estimated_read_time?: number | null;
                    file_path?: string | null;
                    id?: string;
                    is_free?: boolean | null;
                    is_premium?: boolean | null;
                    is_published?: boolean | null;
                    title?: string;
                    updated_at?: string;
                    word_count?: number | null;
                    work_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "fk_chapters_work_id";
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
            content_items: {
                Row: {
                    content: string | null;
                    content_type: string | null;
                    created_at: string | null;
                    created_by: string | null;
                    id: string;
                    is_published: boolean | null;
                    metadata: Json | null;
                    name: string;
                    parent_id: string | null;
                    path: string | null;
                    slug: string;
                    sort_order: number | null;
                    type: string;
                    updated_at: string | null;
                };
                Insert: {
                    content?: string | null;
                    content_type?: string | null;
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    metadata?: Json | null;
                    name: string;
                    parent_id?: string | null;
                    path?: string | null;
                    slug: string;
                    sort_order?: number | null;
                    type: string;
                    updated_at?: string | null;
                };
                Update: {
                    content?: string | null;
                    content_type?: string | null;
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    metadata?: Json | null;
                    name?: string;
                    parent_id?: string | null;
                    path?: string | null;
                    slug?: string;
                    sort_order?: number | null;
                    type?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "content_items_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "content_items";
                        referencedColumns: ["id"];
                    }
                ];
            };
            content_versions: {
                Row: {
                    content: string;
                    content_item_id: string | null;
                    created_at: string | null;
                    created_by: string | null;
                    id: string;
                    version_number: number;
                };
                Insert: {
                    content: string;
                    content_item_id?: string | null;
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    version_number: number;
                };
                Update: {
                    content?: string;
                    content_item_id?: string | null;
                    created_at?: string | null;
                    created_by?: string | null;
                    id?: string;
                    version_number?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "content_versions_content_item_id_fkey";
                        columns: ["content_item_id"];
                        isOneToOne: false;
                        referencedRelation: "content_items";
                        referencedColumns: ["id"];
                    }
                ];
            };
            daily_spins: {
                Row: {
                    created_at: string;
                    last_spin_at: string | null;
                    spin_count: number;
                    spin_date: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    last_spin_at?: string | null;
                    spin_count?: number;
                    spin_date: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    last_spin_at?: string | null;
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
                    expires_at: string | null;
                    id: number;
                    is_active: boolean | null;
                    scope: string;
                    source: string;
                    source_id: string | null;
                    starts_at: string | null;
                    user_id: string;
                    work_id: string | null;
                };
                Insert: {
                    created_at?: string;
                    created_by?: string | null;
                    expires_at?: string | null;
                    id?: number;
                    is_active?: boolean | null;
                    scope: string;
                    source: string;
                    source_id?: string | null;
                    starts_at?: string | null;
                    user_id: string;
                    work_id?: string | null;
                };
                Update: {
                    created_at?: string;
                    created_by?: string | null;
                    expires_at?: string | null;
                    id?: number;
                    is_active?: boolean | null;
                    scope?: string;
                    source?: string;
                    source_id?: string | null;
                    starts_at?: string | null;
                    user_id?: string;
                    work_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "entitlements_work_id_fkey";
                        columns: ["work_id"];
                        isOneToOne: false;
                        referencedRelation: "works";
                        referencedColumns: ["id"];
                    }
                ];
            };
            friends: {
                Row: {
                    created_at: string;
                    friend_id: string;
                    status: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    friend_id: string;
                    status?: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    friend_id?: string;
                    status?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "fk_friends_friend_id";
                        columns: ["friend_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "fk_friends_friend_id";
                        columns: ["friend_id"];
                        isOneToOne: false;
                        referencedRelation: "user_dashboard_stats";
                        referencedColumns: ["user_id"];
                    },
                    {
                        foreignKeyName: "fk_friends_user_id";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "fk_friends_user_id";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "user_dashboard_stats";
                        referencedColumns: ["user_id"];
                    }
                ];
            };
            homepage_content: {
                Row: {
                    content: string;
                    created_at: string;
                    id: number;
                    is_active: boolean | null;
                    order_position: number | null;
                    section: string;
                    title: string | null;
                    updated_at: string;
                };
                Insert: {
                    content: string;
                    created_at?: string;
                    id?: number;
                    is_active?: boolean | null;
                    order_position?: number | null;
                    section: string;
                    title?: string | null;
                    updated_at?: string;
                };
                Update: {
                    content?: string;
                    created_at?: string;
                    id?: number;
                    is_active?: boolean | null;
                    order_position?: number | null;
                    section?: string;
                    title?: string | null;
                    updated_at?: string;
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
            orders: {
                Row: {
                    amount_cents: number;
                    created_at: string;
                    currency: string | null;
                    customer_email: string | null;
                    id: string;
                    metadata: Json | null;
                    price_id: string | null;
                    provider: string;
                    provider_payment_intent_id: string | null;
                    provider_session_id: string | null;
                    status: string | null;
                    updated_at: string;
                    user_id: string | null;
                };
                Insert: {
                    amount_cents: number;
                    created_at?: string;
                    currency?: string | null;
                    customer_email?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    price_id?: string | null;
                    provider?: string;
                    provider_payment_intent_id?: string | null;
                    provider_session_id?: string | null;
                    status?: string | null;
                    updated_at?: string;
                    user_id?: string | null;
                };
                Update: {
                    amount_cents?: number;
                    created_at?: string;
                    currency?: string | null;
                    customer_email?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    price_id?: string | null;
                    provider?: string;
                    provider_payment_intent_id?: string | null;
                    provider_session_id?: string | null;
                    status?: string | null;
                    updated_at?: string;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "orders_price_id_fkey";
                        columns: ["price_id"];
                        isOneToOne: false;
                        referencedRelation: "prices";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [];
            };
            posts: {
                Row: {
                    author_id: string;
                    content: string | null;
                    created_at: string;
                    excerpt: string | null;
                    id: string;
                    is_featured: boolean | null;
                    published_at: string | null;
                    seo_description: string | null;
                    seo_keywords: string[] | null;
                    seo_title: string | null;
                    slug: string;
                    status: string | null;
                    tags: string[] | null;
                    title: string;
                    updated_at: string;
                    views: number | null;
                };
                Insert: {
                    author_id: string;
                    content?: string | null;
                    created_at?: string;
                    excerpt?: string | null;
                    id?: string;
                    is_featured?: boolean | null;
                    published_at?: string | null;
                    seo_description?: string | null;
                    seo_keywords?: string[] | null;
                    seo_title?: string | null;
                    slug: string;
                    status?: string | null;
                    tags?: string[] | null;
                    title: string;
                    updated_at?: string;
                    views?: number | null;
                };
                Update: {
                    author_id?: string;
                    content?: string | null;
                    created_at?: string;
                    excerpt?: string | null;
                    id?: string;
                    is_featured?: boolean | null;
                    published_at?: string | null;
                    seo_description?: string | null;
                    seo_keywords?: string[] | null;
                    seo_title?: string | null;
                    slug?: string;
                    status?: string | null;
                    tags?: string[] | null;
                    title?: string;
                    updated_at?: string;
                    views?: number | null;
                };
                Relationships: [];
            };
            prices: {
                Row: {
                    active: boolean;
                    amount_cents: number;
                    created_at: string;
                    currency: string;
                    id: string;
                    interval: string | null;
                    interval_count: number | null;
                    nickname: string | null;
                    price_id: string;
                    product_id: string;
                    provider: string;
                    trial_days: number | null;
                    trial_period_days: number | null;
                    unit_amount: number;
                    updated_at: string;
                };
                Insert: {
                    active?: boolean;
                    amount_cents: number;
                    created_at?: string;
                    currency?: string;
                    id?: string;
                    interval?: string | null;
                    interval_count?: number | null;
                    nickname?: string | null;
                    price_id: string;
                    product_id: string;
                    provider?: string;
                    trial_days?: number | null;
                    trial_period_days?: number | null;
                    unit_amount: number;
                    updated_at?: string;
                };
                Update: {
                    active?: boolean;
                    amount_cents?: number;
                    created_at?: string;
                    currency?: string;
                    id?: string;
                    interval?: string | null;
                    interval_count?: number | null;
                    nickname?: string | null;
                    price_id?: string;
                    product_id?: string;
                    provider?: string;
                    trial_days?: number | null;
                    trial_period_days?: number | null;
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
                    approved_at: string | null;
                    approved_by: string | null;
                    created_at: string;
                    id: string;
                    is_approved: boolean | null;
                    is_verified_purchase: boolean | null;
                    product_id: string;
                    rating: number;
                    review_text: string | null;
                    title: string | null;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    approved_at?: string | null;
                    approved_by?: string | null;
                    created_at?: string;
                    id?: string;
                    is_approved?: boolean | null;
                    is_verified_purchase?: boolean | null;
                    product_id: string;
                    rating: number;
                    review_text?: string | null;
                    title?: string | null;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    approved_at?: string | null;
                    approved_by?: string | null;
                    created_at?: string;
                    id?: string;
                    is_approved?: boolean | null;
                    is_verified_purchase?: boolean | null;
                    product_id?: string;
                    rating?: number;
                    review_text?: string | null;
                    title?: string | null;
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
            product_variants: {
                Row: {
                    available_for_sale: boolean | null;
                    barcode: string | null;
                    barcode_type: string | null;
                    compare_at_amount: number | null;
                    cost_amount: number | null;
                    cost_currency: string | null;
                    created_at: string;
                    depth_cm: number | null;
                    description: string | null;
                    digital_file_name: string | null;
                    digital_file_size_bytes: number | null;
                    digital_file_url: string | null;
                    dimension_unit: string | null;
                    height_cm: number | null;
                    id: string;
                    inventory_management: string | null;
                    inventory_policy: string;
                    inventory_quantity: number;
                    is_active: boolean;
                    is_default: boolean;
                    is_digital: boolean;
                    low_stock_threshold: number | null;
                    metadata: Json | null;
                    name: string;
                    option1: string | null;
                    option2: string | null;
                    option3: string | null;
                    position: number;
                    price_amount: number;
                    price_currency: string;
                    product_id: string;
                    requires_shipping: boolean;
                    sku: string | null;
                    stripe_price_id: string | null;
                    tax_code: string | null;
                    tax_included: boolean | null;
                    track_inventory: boolean;
                    updated_at: string;
                    weight_grams: number | null;
                    weight_unit: string | null;
                    width_cm: number | null;
                };
                Insert: {
                    available_for_sale?: boolean | null;
                    barcode?: string | null;
                    barcode_type?: string | null;
                    compare_at_amount?: number | null;
                    cost_amount?: number | null;
                    cost_currency?: string | null;
                    created_at?: string;
                    depth_cm?: number | null;
                    description?: string | null;
                    digital_file_name?: string | null;
                    digital_file_size_bytes?: number | null;
                    digital_file_url?: string | null;
                    dimension_unit?: string | null;
                    height_cm?: number | null;
                    id?: string;
                    inventory_management?: string | null;
                    inventory_policy?: string;
                    inventory_quantity?: number;
                    is_active?: boolean;
                    is_default?: boolean;
                    is_digital?: boolean;
                    low_stock_threshold?: number | null;
                    metadata?: Json | null;
                    name: string;
                    option1?: string | null;
                    option2?: string | null;
                    option3?: string | null;
                    position?: number;
                    price_amount: number;
                    price_currency?: string;
                    product_id: string;
                    requires_shipping?: boolean;
                    sku?: string | null;
                    stripe_price_id?: string | null;
                    tax_code?: string | null;
                    tax_included?: boolean | null;
                    track_inventory?: boolean;
                    updated_at?: string;
                    weight_grams?: number | null;
                    weight_unit?: string | null;
                    width_cm?: number | null;
                };
                Update: {
                    available_for_sale?: boolean | null;
                    barcode?: string | null;
                    barcode_type?: string | null;
                    compare_at_amount?: number | null;
                    cost_amount?: number | null;
                    cost_currency?: string | null;
                    created_at?: string;
                    depth_cm?: number | null;
                    description?: string | null;
                    digital_file_name?: string | null;
                    digital_file_size_bytes?: number | null;
                    digital_file_url?: string | null;
                    dimension_unit?: string | null;
                    height_cm?: number | null;
                    id?: string;
                    inventory_management?: string | null;
                    inventory_policy?: string;
                    inventory_quantity?: number;
                    is_active?: boolean;
                    is_default?: boolean;
                    is_digital?: boolean;
                    low_stock_threshold?: number | null;
                    metadata?: Json | null;
                    name?: string;
                    option1?: string | null;
                    option2?: string | null;
                    option3?: string | null;
                    position?: number;
                    price_amount?: number;
                    price_currency?: string;
                    product_id?: string;
                    requires_shipping?: boolean;
                    sku?: string | null;
                    stripe_price_id?: string | null;
                    tax_code?: string | null;
                    tax_included?: boolean | null;
                    track_inventory?: boolean;
                    updated_at?: string;
                    weight_grams?: number | null;
                    weight_unit?: string | null;
                    width_cm?: number | null;
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
            products: {
                Row: {
                    active: boolean;
                    cover_image_url: string | null;
                    created_at: string;
                    description: string | null;
                    file_key: string | null;
                    id: string;
                    is_bundle: boolean | null;
                    is_premium: boolean | null;
                    is_subscription: boolean | null;
                    name: string;
                    product_type: Database["public"]["Enums"]["product_type"] | null;
                    published_at: string | null;
                    slug: string;
                    status: string | null;
                    stripe_product_id: string | null;
                    title: string;
                    updated_at: string;
                };
                Insert: {
                    active?: boolean;
                    cover_image_url?: string | null;
                    created_at?: string;
                    description?: string | null;
                    file_key?: string | null;
                    id?: string;
                    is_bundle?: boolean | null;
                    is_premium?: boolean | null;
                    is_subscription?: boolean | null;
                    name: string;
                    product_type?: Database["public"]["Enums"]["product_type"] | null;
                    published_at?: string | null;
                    slug: string;
                    status?: string | null;
                    stripe_product_id?: string | null;
                    title: string;
                    updated_at?: string;
                };
                Update: {
                    active?: boolean;
                    cover_image_url?: string | null;
                    created_at?: string;
                    description?: string | null;
                    file_key?: string | null;
                    id?: string;
                    is_bundle?: boolean | null;
                    is_premium?: boolean | null;
                    is_subscription?: boolean | null;
                    name?: string;
                    product_type?: Database["public"]["Enums"]["product_type"] | null;
                    published_at?: string | null;
                    slug?: string;
                    status?: string | null;
                    stripe_product_id?: string | null;
                    title?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            profiles: {
                Row: {
                    avatar_url: string | null;
                    beta_reader_approved_at: string | null;
                    beta_reader_status: Database["public"]["Enums"]["beta_reader_status"];
                    bio: string | null;
                    cancel_at_period_end: boolean | null;
                    created_at: string;
                    current_period_end: string | null;
                    display_name: string | null;
                    email: string;
                    full_name: string | null;
                    id: string;
                    last_active_at: string | null;
                    role: Database["public"]["Enums"]["user_role"];
                    stripe_customer_id: string | null;
                    subscription_status: string | null;
                    subscription_tier: string | null;
                    updated_at: string;
                    username: string;
                    visibility: Database["public"]["Enums"]["profile_visibility"];
                    website: string | null;
                };
                Insert: {
                    avatar_url?: string | null;
                    beta_reader_approved_at?: string | null;
                    beta_reader_status?: Database["public"]["Enums"]["beta_reader_status"];
                    bio?: string | null;
                    cancel_at_period_end?: boolean | null;
                    created_at?: string;
                    current_period_end?: string | null;
                    display_name?: string | null;
                    email: string;
                    full_name?: string | null;
                    id: string;
                    last_active_at?: string | null;
                    role?: Database["public"]["Enums"]["user_role"];
                    stripe_customer_id?: string | null;
                    subscription_status?: string | null;
                    subscription_tier?: string | null;
                    updated_at?: string;
                    username: string;
                    visibility?: Database["public"]["Enums"]["profile_visibility"];
                    website?: string | null;
                };
                Update: {
                    avatar_url?: string | null;
                    beta_reader_approved_at?: string | null;
                    beta_reader_status?: Database["public"]["Enums"]["beta_reader_status"];
                    bio?: string | null;
                    cancel_at_period_end?: boolean | null;
                    created_at?: string;
                    current_period_end?: string | null;
                    display_name?: string | null;
                    email?: string;
                    full_name?: string | null;
                    id?: string;
                    last_active_at?: string | null;
                    role?: Database["public"]["Enums"]["user_role"];
                    stripe_customer_id?: string | null;
                    subscription_status?: string | null;
                    subscription_tier?: string | null;
                    updated_at?: string;
                    username?: string;
                    visibility?: Database["public"]["Enums"]["profile_visibility"];
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
                        referencedColumns: ["price_id"];
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
                        foreignKeyName: "fk_reading_progress_chapter_id";
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
                    metadata: Json | null;
                    type: string;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string;
                    description: string;
                    id?: string;
                    metadata?: Json | null;
                    type: string;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string;
                    description?: string;
                    id?: string;
                    metadata?: Json | null;
                    type?: string;
                    user_id?: string | null;
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
                    is_featured: boolean | null;
                    link: string | null;
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
                    is_featured?: boolean | null;
                    link?: string | null;
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
                    is_featured?: boolean | null;
                    link?: string | null;
                    purchase_link?: string | null;
                    release_date?: string;
                    status?: string | null;
                    title?: string;
                    type?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            stripe_customers: {
                Row: {
                    created_at: string;
                    email: string | null;
                    id: string;
                    metadata: Json | null;
                    stripe_customer_id: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    email?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    stripe_customer_id: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    email?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    stripe_customer_id?: string;
                    updated_at?: string;
                    user_id?: string;
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
                    plan_id: string | null;
                    plan_price_id: string | null;
                    provider: string;
                    provider_subscription_id: string;
                    status: Database["public"]["Enums"]["subscription_status"];
                    trial_end: string | null;
                    trial_start: string | null;
                    updated_at: string;
                    user_id: string | null;
                };
                Insert: {
                    cancel_at_period_end?: boolean | null;
                    created_at?: string;
                    current_period_end?: string | null;
                    current_period_start?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    plan_id?: string | null;
                    plan_price_id?: string | null;
                    provider?: string;
                    provider_subscription_id: string;
                    status?: Database["public"]["Enums"]["subscription_status"];
                    trial_end?: string | null;
                    trial_start?: string | null;
                    updated_at?: string;
                    user_id?: string | null;
                };
                Update: {
                    cancel_at_period_end?: boolean | null;
                    created_at?: string;
                    current_period_end?: string | null;
                    current_period_start?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    plan_id?: string | null;
                    plan_price_id?: string | null;
                    provider?: string;
                    provider_subscription_id?: string;
                    status?: Database["public"]["Enums"]["subscription_status"];
                    trial_end?: string | null;
                    trial_start?: string | null;
                    updated_at?: string;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "subscriptions_plan_price_id_fkey";
                        columns: ["plan_price_id"];
                        isOneToOne: false;
                        referencedRelation: "prices";
                        referencedColumns: ["id"];
                    }
                ];
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
                        foreignKeyName: "fk_user_ratings_work_id";
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
                    expires_at: string | null;
                    granted_by: string | null;
                    metadata: Json | null;
                    role: Database["public"]["Enums"]["user_role"];
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    expires_at?: string | null;
                    granted_by?: string | null;
                    metadata?: Json | null;
                    role: Database["public"]["Enums"]["user_role"];
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    expires_at?: string | null;
                    granted_by?: string | null;
                    metadata?: Json | null;
                    role?: Database["public"]["Enums"]["user_role"];
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "fk_user_roles_user_id";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "fk_user_roles_user_id";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "user_dashboard_stats";
                        referencedColumns: ["user_id"];
                    }
                ];
            };
            user_stats: {
                Row: {
                    achievements_unlocked: number;
                    books_read: number;
                    chapters_read: number;
                    created_at: string;
                    current_streak_days: number;
                    last_activity_date: string | null;
                    level_reached: number;
                    total_reading_minutes: number;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    achievements_unlocked?: number;
                    books_read?: number;
                    chapters_read?: number;
                    created_at?: string;
                    current_streak_days?: number;
                    last_activity_date?: string | null;
                    level_reached?: number;
                    total_reading_minutes?: number;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    achievements_unlocked?: number;
                    books_read?: number;
                    chapters_read?: number;
                    created_at?: string;
                    current_streak_days?: number;
                    last_activity_date?: string | null;
                    level_reached?: number;
                    total_reading_minutes?: number;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "fk_user_stats_user_id";
                        columns: ["user_id"];
                        isOneToOne: true;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "fk_user_stats_user_id";
                        columns: ["user_id"];
                        isOneToOne: true;
                        referencedRelation: "user_dashboard_stats";
                        referencedColumns: ["user_id"];
                    }
                ];
            };
            webhook_events: {
                Row: {
                    created_at: string;
                    event_id: string;
                    event_type: string;
                    id: string;
                    payload: Json;
                    processed: boolean | null;
                    provider: string;
                    received_at: string | null;
                };
                Insert: {
                    created_at?: string;
                    event_id: string;
                    event_type: string;
                    id?: string;
                    payload: Json;
                    processed?: boolean | null;
                    provider: string;
                    received_at?: string | null;
                };
                Update: {
                    created_at?: string;
                    event_id?: string;
                    event_type?: string;
                    id?: string;
                    payload?: Json;
                    processed?: boolean | null;
                    provider?: string;
                    received_at?: string | null;
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
                    created_at: string;
                    id: string;
                    is_free: boolean | null;
                    is_premium: boolean | null;
                    parent_id: string | null;
                    status: Database["public"]["Enums"]["work_status"];
                    title: string;
                    type: Database["public"]["Enums"]["work_type"];
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    is_free?: boolean | null;
                    is_premium?: boolean | null;
                    parent_id?: string | null;
                    status?: Database["public"]["Enums"]["work_status"];
                    title: string;
                    type?: Database["public"]["Enums"]["work_type"];
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    is_free?: boolean | null;
                    is_premium?: boolean | null;
                    parent_id?: string | null;
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
            user_dashboard_stats: {
                Row: {
                    account_age_days: number | null;
                    achievements_unlocked: number | null;
                    beta_reader_status: Database["public"]["Enums"]["beta_reader_status"] | null;
                    books_read: number | null;
                    chapters_read: number | null;
                    current_streak_days: number | null;
                    display_name: string | null;
                    email: string | null;
                    last_active_at: string | null;
                    last_activity_date: string | null;
                    level_reached: number | null;
                    member_since: string | null;
                    minutes_per_book: number | null;
                    role: Database["public"]["Enums"]["user_role"] | null;
                    subscription_tier: string | null;
                    total_reading_hours: number | null;
                    total_reading_minutes: number | null;
                    user_id: string | null;
                    username: string | null;
                    visibility: Database["public"]["Enums"]["profile_visibility"] | null;
                };
                Relationships: [];
            };
        };
        Functions: {
            _ltree_compress: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            _ltree_gist_options: {
                Args: {
                    "": unknown;
                };
                Returns: undefined;
            };
            add_subscription_note: {
                Args: {
                    p_is_visible_to_customer?: boolean;
                    p_note: string;
                    p_subscription_id: string;
                };
                Returns: string;
            };
            can_manage_user: {
                Args: {
                    p_manager_id: string;
                    p_target_id: string;
                };
                Returns: boolean;
            };
            cleanup_orphaned_wiki_media: {
                Args: Record<PropertyKey, never>;
                Returns: number;
            };
            create_product_with_variants: {
                Args: {
                    p_product_data: Json;
                    p_variants_data?: Json;
                };
                Returns: Json;
            };
            create_subscription_invoice: {
                Args: {
                    p_amount_due: number;
                    p_billing_reason: string;
                    p_currency: string;
                    p_metadata?: Json;
                    p_period_end: string;
                    p_period_start: string;
                    p_status: Database["public"]["Enums"]["invoice_status"];
                    p_subscription_id: string;
                };
                Returns: string;
            };
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
            delete_subscription_note: {
                Args: {
                    p_note_id: string;
                };
                Returns: undefined;
            };
            generate_invoice_number: {
                Args: Record<PropertyKey, never>;
                Returns: string;
            };
            generate_order_number: {
                Args: Record<PropertyKey, never>;
                Returns: string;
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
            get_content_url: {
                Args: {
                    file_path: string;
                };
                Returns: string;
            };
            get_customer_order_history: {
                Args: {
                    p_limit?: number;
                    p_offset?: number;
                    p_user_id: string;
                };
                Returns: {
                    created_at: string;
                    currency: string;
                    id: string;
                    item_count: number;
                    order_number: string;
                    status: Database["public"]["Enums"]["order_status"];
                    total_amount: number;
                    updated_at: string;
                }[];
            };
            get_default_variant: {
                Args: {
                    p_product_id: string;
                };
                Returns: {
                    available_for_sale: boolean | null;
                    barcode: string | null;
                    barcode_type: string | null;
                    compare_at_amount: number | null;
                    cost_amount: number | null;
                    cost_currency: string | null;
                    created_at: string;
                    depth_cm: number | null;
                    description: string | null;
                    digital_file_name: string | null;
                    digital_file_size_bytes: number | null;
                    digital_file_url: string | null;
                    dimension_unit: string | null;
                    height_cm: number | null;
                    id: string;
                    inventory_management: string | null;
                    inventory_policy: string;
                    inventory_quantity: number;
                    is_active: boolean;
                    is_default: boolean;
                    is_digital: boolean;
                    low_stock_threshold: number | null;
                    metadata: Json | null;
                    name: string;
                    option1: string | null;
                    option2: string | null;
                    option3: string | null;
                    position: number;
                    price_amount: number;
                    price_currency: string;
                    product_id: string;
                    requires_shipping: boolean;
                    sku: string | null;
                    stripe_price_id: string | null;
                    tax_code: string | null;
                    tax_included: boolean | null;
                    track_inventory: boolean;
                    updated_at: string;
                    weight_grams: number | null;
                    weight_unit: string | null;
                    width_cm: number | null;
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
            get_member_count: {
                Args: Record<PropertyKey, never>;
                Returns: number;
            };
            get_or_create_cart: {
                Args: {
                    p_session_id?: string;
                    p_user_id?: string;
                };
                Returns: string;
            };
            get_order_details: {
                Args: {
                    p_order_id: string;
                };
                Returns: Json;
            };
            get_order_totals: {
                Args: {
                    p_end_date?: string;
                    p_start_date?: string;
                    p_status?: Database["public"]["Enums"]["order_status"];
                };
                Returns: {
                    net_sales: number;
                    order_count: number;
                    total_discounts: number;
                    total_sales: number;
                    total_shipping: number;
                    total_tax: number;
                }[];
            };
            get_product_availability: {
                Args: {
                    p_product_id: string;
                };
                Returns: boolean;
            };
            get_product_price_range: {
                Args: {
                    p_product_id: string;
                };
                Returns: Json;
            };
            get_products_in_category: {
                Args: {
                    p_category_id: string;
                    p_limit?: number;
                    p_offset?: number;
                    p_sort_by?: string;
                };
                Returns: {
                    category_id: string;
                    category_name: string;
                    is_primary: boolean;
                    min_price: number;
                    product_id: string;
                    product_name: string;
                    product_slug: string;
                }[];
            };
            get_subscription_item_usage: {
                Args: {
                    p_end_date?: string;
                    p_start_date?: string;
                    p_subscription_item_id: string;
                };
                Returns: {
                    period_end: string;
                    period_start: string;
                    subscription_item_id: string;
                    total_usage: number;
                }[];
            };
            get_user_active_subscription: {
                Args: {
                    user_uuid: string;
                };
                Returns: {
                    current_period_end: string;
                    plan_name: string;
                    privileges: Json;
                    status: string;
                    subscription_id: string;
                }[];
            };
            get_user_role: {
                Args: {
                    p_user_id?: string;
                };
                Returns: Database["public"]["Enums"]["user_role"];
            };
            get_user_roles: {
                Args: {
                    p_user_id: string;
                };
                Returns: Database["public"]["Enums"]["user_role"][];
            };
            get_user_subscription_tier: {
                Args: {
                    user_uuid?: string;
                };
                Returns: string;
            };
            get_variant_pricing: {
                Args: {
                    p_include_tax?: boolean;
                    p_variant_id: string;
                };
                Returns: {
                    compare_at_amount: number;
                    discount_amount: number;
                    discount_percent: number;
                    on_sale: boolean;
                    price_amount: number;
                    price_currency: string;
                    tax_amount: number;
                    total_amount: number;
                    variant_id: string;
                }[];
            };
            grant_admin_role: {
                Args: {
                    p_admin_email: string;
                };
                Returns: undefined;
            };
            has_active_subscription: {
                Args: {
                    user_uuid?: string;
                };
                Returns: boolean;
            };
            has_subscription_access: {
                Args: {
                    p_required_tier?: number;
                    p_user_id: string;
                };
                Returns: boolean;
            };
            hash_ltree: {
                Args: {
                    "": unknown;
                };
                Returns: number;
            };
            increment_wiki_page_views: {
                Args: {
                    page_id: string;
                };
                Returns: undefined;
            };
            is_admin: {
                Args: {
                    p_user_id?: string;
                };
                Returns: boolean;
            };
            is_user_admin: {
                Args: {
                    p_user_id?: string;
                };
                Returns: boolean;
            };
            is_variant_in_stock: {
                Args: {
                    p_quantity?: number;
                    p_variant_id: string;
                };
                Returns: boolean;
            };
            lca: {
                Args: {
                    "": unknown[];
                };
                Returns: unknown;
            };
            lquery_in: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            lquery_out: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            lquery_recv: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            lquery_send: {
                Args: {
                    "": unknown;
                };
                Returns: string;
            };
            ltree_compress: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ltree_decompress: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ltree_gist_in: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ltree_gist_options: {
                Args: {
                    "": unknown;
                };
                Returns: undefined;
            };
            ltree_gist_out: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ltree_in: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ltree_out: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ltree_recv: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ltree_send: {
                Args: {
                    "": unknown;
                };
                Returns: string;
            };
            ltree2text: {
                Args: {
                    "": unknown;
                };
                Returns: string;
            };
            ltxtq_in: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ltxtq_out: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ltxtq_recv: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            ltxtq_send: {
                Args: {
                    "": unknown;
                };
                Returns: string;
            };
            nlevel: {
                Args: {
                    "": unknown;
                };
                Returns: number;
            };
            recalculate_order_totals: {
                Args: {
                    p_order_id: string;
                };
                Returns: undefined;
            };
            record_subscription_usage: {
                Args: {
                    p_metadata?: Json;
                    p_quantity: number;
                    p_subscription_id: string;
                    p_subscription_item_id: string;
                    p_timestamp?: string;
                };
                Returns: string;
            };
            restore_inventory_for_order: {
                Args: {
                    p_order_id: string;
                };
                Returns: undefined;
            };
            setup_default_roles: {
                Args: {
                    p_user_id: string;
                };
                Returns: undefined;
            };
            text2ltree: {
                Args: {
                    "": string;
                };
                Returns: unknown;
            };
            track_user_activity: {
                Args: {
                    p_activity_type: Database["public"]["Enums"]["activity_type"];
                    p_description: string;
                    p_metadata?: Json;
                    p_related_content_id?: string;
                    p_related_content_type?: string;
                    p_user_id: string;
                };
                Returns: undefined;
            };
            update_inventory: {
                Args: {
                    p_operation?: string;
                    p_quantity_change: number;
                    p_variant_id: string;
                };
                Returns: number;
            };
            update_subscription_note: {
                Args: {
                    p_is_visible_to_customer?: boolean;
                    p_note: string;
                    p_note_id: string;
                };
                Returns: undefined;
            };
            user_has_any_role: {
                Args: {
                    p_roles: Database["public"]["Enums"]["user_role"][];
                    p_user_id: string;
                };
                Returns: boolean;
            };
            user_has_privilege: {
                Args: {
                    privilege_name: string;
                    user_uuid: string;
                };
                Returns: boolean;
            };
        };
        Enums: {
            activity_type: "chapter_read" | "book_completed" | "review_posted" | "comment_posted" | "wiki_edited" | "profile_updated" | "subscription_started" | "achievement_earned";
            beta_application_status: "pending" | "approved" | "denied";
            beta_reader_status: "not_applied" | "pending" | "approved" | "rejected" | "none";
            collection_method: "charge_automatically" | "send_invoice";
            content_block_type: "heading_1" | "heading_2" | "heading_3" | "paragraph" | "bullet_list" | "ordered_list" | "image" | "table" | "quote" | "code" | "divider";
            content_status: "planning" | "writing" | "editing" | "published" | "on_hold" | "archived";
            content_type: "book" | "volume" | "saga" | "arc" | "issue" | "chapter";
            discount_type: "percentage" | "fixed_amount";
            fulfillment_status: "unfulfilled" | "fulfilled" | "partial" | "shipped" | "delivered" | "returned" | "cancelled" | "label_printed";
            invoice_status: "draft" | "open" | "paid" | "void" | "uncollectible";
            order_status: "draft" | "pending" | "processing" | "on_hold" | "completed" | "cancelled" | "refunded" | "failed";
            payment_method: "credit_card" | "paypal" | "bank_transfer" | "crypto" | "apple_pay" | "google_pay" | "stripe" | "other";
            payment_status: "paid" | "unpaid" | "no_payment_required" | "failed" | "processing" | "requires_payment_method" | "requires_confirmation" | "requires_action" | "canceled";
            product_type: "single_issue" | "bundle" | "chapter_pass" | "arc_pass" | "subscription";
            profile_visibility: "public" | "private" | "friends_only";
            refund_status: "pending" | "processing" | "succeeded" | "failed" | "cancelled";
            subscription_discount_duration: "forever" | "once" | "repeating";
            subscription_status: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "paused";
            user_role: "admin" | "support" | "accountant" | "user" | "super_admin";
            wiki_content_type: "heading_1" | "heading_2" | "heading_3" | "paragraph" | "bullet_list" | "ordered_list" | "image" | "video" | "audio" | "table" | "quote" | "code" | "divider" | "file_attachment";
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
            readonly activity_type: readonly ["chapter_read", "book_completed", "review_posted", "comment_posted", "wiki_edited", "profile_updated", "subscription_started", "achievement_earned"];
            readonly beta_application_status: readonly ["pending", "approved", "denied"];
            readonly beta_reader_status: readonly ["not_applied", "pending", "approved", "rejected", "none"];
            readonly collection_method: readonly ["charge_automatically", "send_invoice"];
            readonly content_block_type: readonly ["heading_1", "heading_2", "heading_3", "paragraph", "bullet_list", "ordered_list", "image", "table", "quote", "code", "divider"];
            readonly content_status: readonly ["planning", "writing", "editing", "published", "on_hold", "archived"];
            readonly content_type: readonly ["book", "volume", "saga", "arc", "issue", "chapter"];
            readonly discount_type: readonly ["percentage", "fixed_amount"];
            readonly fulfillment_status: readonly ["unfulfilled", "fulfilled", "partial", "shipped", "delivered", "returned", "cancelled", "label_printed"];
            readonly invoice_status: readonly ["draft", "open", "paid", "void", "uncollectible"];
            readonly order_status: readonly ["draft", "pending", "processing", "on_hold", "completed", "cancelled", "refunded", "failed"];
            readonly payment_method: readonly ["credit_card", "paypal", "bank_transfer", "crypto", "apple_pay", "google_pay", "stripe", "other"];
            readonly payment_status: readonly ["paid", "unpaid", "no_payment_required", "failed", "processing", "requires_payment_method", "requires_confirmation", "requires_action", "canceled"];
            readonly product_type: readonly ["single_issue", "bundle", "chapter_pass", "arc_pass", "subscription"];
            readonly profile_visibility: readonly ["public", "private", "friends_only"];
            readonly refund_status: readonly ["pending", "processing", "succeeded", "failed", "cancelled"];
            readonly subscription_discount_duration: readonly ["forever", "once", "repeating"];
            readonly subscription_status: readonly ["incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid", "paused"];
            readonly user_role: readonly ["admin", "support", "accountant", "user", "super_admin"];
            readonly wiki_content_type: readonly ["heading_1", "heading_2", "heading_3", "paragraph", "bullet_list", "ordered_list", "image", "video", "audio", "table", "quote", "code", "divider", "file_attachment"];
            readonly work_status: readonly ["planning", "writing", "editing", "published", "on_hold"];
            readonly work_type: readonly ["book", "volume", "saga", "arc", "issue"];
        };
    };
};
export {};
//# sourceMappingURL=database.types.d.ts.map