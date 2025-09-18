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
                    created_at: string;
                    id: string;
                };
                Insert: {
                    action: string;
                    actor_user_id?: string | null;
                    created_at?: string;
                    id?: string;
                };
                Update: {
                    action?: string;
                    actor_user_id?: string | null;
                    created_at?: string;
                    id?: string;
                };
                Relationships: [];
            };
            authors_journey_posts: {
                Row: {
                    author_id: string | null;
                    content: string | null;
                    created_at: string | null;
                    id: string;
                    published_at: string | null;
                    slug: string | null;
                    status: string;
                    title: string;
                    updated_at: string | null;
                };
                Insert: {
                    author_id?: string | null;
                    content?: string | null;
                    created_at?: string | null;
                    id?: string;
                    published_at?: string | null;
                    slug?: string | null;
                    status?: string;
                    title: string;
                    updated_at?: string | null;
                };
                Update: {
                    author_id?: string | null;
                    content?: string | null;
                    created_at?: string | null;
                    id?: string;
                    published_at?: string | null;
                    slug?: string | null;
                    status?: string;
                    title?: string;
                    updated_at?: string | null;
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
            cart_items: {
                Row: {
                    cart_id: string;
                    created_at: string;
                    id: string;
                    product_id: string;
                    quantity: number;
                    updated_at: string;
                    variant_id: string | null;
                };
                Insert: {
                    cart_id: string;
                    created_at?: string;
                    id?: string;
                    product_id: string;
                    quantity?: number;
                    updated_at?: string;
                    variant_id?: string | null;
                };
                Update: {
                    cart_id?: string;
                    created_at?: string;
                    id?: string;
                    product_id?: string;
                    quantity?: number;
                    updated_at?: string;
                    variant_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "cart_items_cart_id_fkey";
                        columns: ["cart_id"];
                        isOneToOne: false;
                        referencedRelation: "shopping_carts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "cart_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "product_catalog";
                        referencedColumns: ["product_id"];
                    },
                    {
                        foreignKeyName: "cart_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "cart_items_variant_id_fkey";
                        columns: ["variant_id"];
                        isOneToOne: false;
                        referencedRelation: "product_variants";
                        referencedColumns: ["id"];
                    }
                ];
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
                        foreignKeyName: "chapters_work_id_fkey";
                        columns: ["work_id"];
                        isOneToOne: false;
                        referencedRelation: "content_with_access";
                        referencedColumns: ["id"];
                    },
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
            comments: {
                Row: {
                    author_email: string | null;
                    author_name: string | null;
                    content: string;
                    created_at: string | null;
                    guide_id: string | null;
                    id: string;
                    parent_comment_id: string | null;
                    post_id: string | null;
                    user_id: string | null;
                };
                Insert: {
                    author_email?: string | null;
                    author_name?: string | null;
                    content: string;
                    created_at?: string | null;
                    guide_id?: string | null;
                    id?: string;
                    parent_comment_id?: string | null;
                    post_id?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    author_email?: string | null;
                    author_name?: string | null;
                    content?: string;
                    created_at?: string | null;
                    guide_id?: string | null;
                    id?: string;
                    parent_comment_id?: string | null;
                    post_id?: string | null;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "comments_guide_id_fkey";
                        columns: ["guide_id"];
                        isOneToOne: false;
                        referencedRelation: "writing_guides";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "comments_parent_comment_id_fkey";
                        columns: ["parent_comment_id"];
                        isOneToOne: false;
                        referencedRelation: "comments";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "comments_post_id_fkey";
                        columns: ["post_id"];
                        isOneToOne: false;
                        referencedRelation: "authors_journey_posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "comments_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "active_subscribers";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "comments_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "comments_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "user_dashboard_stats";
                        referencedColumns: ["user_id"];
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
            downloadable_templates: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    file_path: string | null;
                    id: string;
                    status: string;
                    thumbnail_url: string | null;
                    title: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    file_path?: string | null;
                    id?: string;
                    status?: string;
                    thumbnail_url?: string | null;
                    title: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    file_path?: string | null;
                    id?: string;
                    status?: string;
                    thumbnail_url?: string | null;
                    title?: string;
                    updated_at?: string | null;
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
                        referencedRelation: "content_with_access";
                        referencedColumns: ["id"];
                    },
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
                        foreignKeyName: "friends_friend_id_fkey";
                        columns: ["friend_id"];
                        isOneToOne: false;
                        referencedRelation: "active_subscribers";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "friends_friend_id_fkey";
                        columns: ["friend_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "friends_friend_id_fkey";
                        columns: ["friend_id"];
                        isOneToOne: false;
                        referencedRelation: "user_dashboard_stats";
                        referencedColumns: ["user_id"];
                    },
                    {
                        foreignKeyName: "friends_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "active_subscribers";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "friends_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "friends_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "user_dashboard_stats";
                        referencedColumns: ["user_id"];
                    }
                ];
            };
            homepage_content: {
                Row: {
                    content: string | null;
                    created_at: string;
                    id: string;
                    order_position: number | null;
                    section: string | null;
                    title: string;
                    updated_at: string;
                };
                Insert: {
                    content?: string | null;
                    created_at?: string;
                    id?: string;
                    order_position?: number | null;
                    section?: string | null;
                    title: string;
                    updated_at?: string;
                };
                Update: {
                    content?: string | null;
                    created_at?: string;
                    id?: string;
                    order_position?: number | null;
                    section?: string | null;
                    title?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            inventory_movements: {
                Row: {
                    created_at: string;
                    created_by: string | null;
                    id: string;
                    movement_type: string;
                    product_id: string | null;
                    quantity: number;
                    quantity_after: number;
                    quantity_before: number;
                    reason: string | null;
                    reference_id: string | null;
                    reference_type: string | null;
                    variant_id: string | null;
                };
                Insert: {
                    created_at?: string;
                    created_by?: string | null;
                    id?: string;
                    movement_type: string;
                    product_id?: string | null;
                    quantity: number;
                    quantity_after: number;
                    quantity_before: number;
                    reason?: string | null;
                    reference_id?: string | null;
                    reference_type?: string | null;
                    variant_id?: string | null;
                };
                Update: {
                    created_at?: string;
                    created_by?: string | null;
                    id?: string;
                    movement_type?: string;
                    product_id?: string | null;
                    quantity?: number;
                    quantity_after?: number;
                    quantity_before?: number;
                    reason?: string | null;
                    reference_id?: string | null;
                    reference_type?: string | null;
                    variant_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "inventory_movements_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "product_catalog";
                        referencedColumns: ["product_id"];
                    },
                    {
                        foreignKeyName: "inventory_movements_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "inventory_movements_variant_id_fkey";
                        columns: ["variant_id"];
                        isOneToOne: false;
                        referencedRelation: "product_variants";
                        referencedColumns: ["id"];
                    }
                ];
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
                        referencedRelation: "subscription_details";
                        referencedColumns: ["subscription_id"];
                    },
                    {
                        foreignKeyName: "invoices_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscriptions";
                        referencedColumns: ["id"];
                    }
                ];
            };
            learn_cards: {
                Row: {
                    action_text: string | null;
                    content: string | null;
                    created_at: string;
                    description: string | null;
                    display_order: number | null;
                    id: string;
                    is_active: boolean;
                    section_id: string;
                    sort_order: number | null;
                    title: string;
                    updated_at: string;
                };
                Insert: {
                    action_text?: string | null;
                    content?: string | null;
                    created_at?: string;
                    description?: string | null;
                    display_order?: number | null;
                    id?: string;
                    is_active?: boolean;
                    section_id: string;
                    sort_order?: number | null;
                    title: string;
                    updated_at?: string;
                };
                Update: {
                    action_text?: string | null;
                    content?: string | null;
                    created_at?: string;
                    description?: string | null;
                    display_order?: number | null;
                    id?: string;
                    is_active?: boolean;
                    section_id?: string;
                    sort_order?: number | null;
                    title?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "learn_cards_section_id_fkey";
                        columns: ["section_id"];
                        isOneToOne: false;
                        referencedRelation: "learn_sections";
                        referencedColumns: ["id"];
                    }
                ];
            };
            learn_sections: {
                Row: {
                    created_at: string;
                    description: string | null;
                    id: string;
                    section_type: Database["public"]["Enums"]["learn_section_type"] | null;
                    sort_order: number | null;
                    title: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    section_type?: Database["public"]["Enums"]["learn_section_type"] | null;
                    sort_order?: number | null;
                    title: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    section_type?: Database["public"]["Enums"]["learn_section_type"] | null;
                    sort_order?: number | null;
                    title?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            order_items: {
                Row: {
                    access_granted: boolean | null;
                    access_granted_at: string | null;
                    created_at: string;
                    discount_amount: number | null;
                    id: string;
                    order_id: string;
                    product_id: string;
                    product_name: string;
                    quantity: number;
                    sku: string | null;
                    stripe_price_id: string | null;
                    tax_amount: number | null;
                    total_amount: number;
                    unit_amount: number;
                    variant_id: string | null;
                    variant_name: string | null;
                };
                Insert: {
                    access_granted?: boolean | null;
                    access_granted_at?: string | null;
                    created_at?: string;
                    discount_amount?: number | null;
                    id?: string;
                    order_id: string;
                    product_id: string;
                    product_name: string;
                    quantity?: number;
                    sku?: string | null;
                    stripe_price_id?: string | null;
                    tax_amount?: number | null;
                    total_amount: number;
                    unit_amount: number;
                    variant_id?: string | null;
                    variant_name?: string | null;
                };
                Update: {
                    access_granted?: boolean | null;
                    access_granted_at?: string | null;
                    created_at?: string;
                    discount_amount?: number | null;
                    id?: string;
                    order_id?: string;
                    product_id?: string;
                    product_name?: string;
                    quantity?: number;
                    sku?: string | null;
                    stripe_price_id?: string | null;
                    tax_amount?: number | null;
                    total_amount?: number;
                    unit_amount?: number;
                    variant_id?: string | null;
                    variant_name?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "customer_order_history";
                        referencedColumns: ["order_id"];
                    },
                    {
                        foreignKeyName: "order_items_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "orders";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "product_catalog";
                        referencedColumns: ["product_id"];
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "order_items_variant_id_fkey";
                        columns: ["variant_id"];
                        isOneToOne: false;
                        referencedRelation: "product_variants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            order_notes: {
                Row: {
                    created_at: string;
                    id: string;
                    is_customer_notified: boolean;
                    is_visible_to_customer: boolean;
                    note: string;
                    order_id: string;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    is_customer_notified?: boolean;
                    is_visible_to_customer?: boolean;
                    note: string;
                    order_id: string;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    is_customer_notified?: boolean;
                    is_visible_to_customer?: boolean;
                    note?: string;
                    order_id?: string;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "order_notes_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "customer_order_history";
                        referencedColumns: ["order_id"];
                    },
                    {
                        foreignKeyName: "order_notes_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "orders";
                        referencedColumns: ["id"];
                    }
                ];
            };
            order_refunds: {
                Row: {
                    amount: number;
                    created_at: string;
                    currency: string;
                    id: string;
                    order_id: string;
                    reason: string | null;
                };
                Insert: {
                    amount: number;
                    created_at?: string;
                    currency: string;
                    id?: string;
                    order_id: string;
                    reason?: string | null;
                };
                Update: {
                    amount?: number;
                    created_at?: string;
                    currency?: string;
                    id?: string;
                    order_id?: string;
                    reason?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "order_refunds_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "customer_order_history";
                        referencedColumns: ["order_id"];
                    },
                    {
                        foreignKeyName: "order_refunds_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "orders";
                        referencedColumns: ["id"];
                    }
                ];
            };
            order_shipments: {
                Row: {
                    carrier: string | null;
                    created_at: string;
                    id: string;
                    order_id: string;
                    shipped_at: string | null;
                    tracking_number: string | null;
                };
                Insert: {
                    carrier?: string | null;
                    created_at?: string;
                    id?: string;
                    order_id: string;
                    shipped_at?: string | null;
                    tracking_number?: string | null;
                };
                Update: {
                    carrier?: string | null;
                    created_at?: string;
                    id?: string;
                    order_id?: string;
                    shipped_at?: string | null;
                    tracking_number?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "order_shipments_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "customer_order_history";
                        referencedColumns: ["order_id"];
                    },
                    {
                        foreignKeyName: "order_shipments_order_id_fkey";
                        columns: ["order_id"];
                        isOneToOne: false;
                        referencedRelation: "orders";
                        referencedColumns: ["id"];
                    }
                ];
            };
            orders: {
                Row: {
                    admin_notes: string | null;
                    billing_address: Json;
                    confirmed_at: string | null;
                    created_at: string;
                    currency: string;
                    delivered_at: string | null;
                    discount_amount: number | null;
                    email: string;
                    fulfillment_status: string | null;
                    id: string;
                    notes: string | null;
                    order_number: string;
                    payment_status: string;
                    phone: string | null;
                    promotion_code: string | null;
                    shipped_at: string | null;
                    shipping_address: Json | null;
                    shipping_amount: number | null;
                    status: string;
                    stripe_checkout_session_id: string | null;
                    stripe_customer_id: string | null;
                    stripe_payment_intent_id: string | null;
                    subtotal: number;
                    tax_amount: number | null;
                    total_amount: number;
                    updated_at: string;
                    user_id: string | null;
                };
                Insert: {
                    admin_notes?: string | null;
                    billing_address?: Json;
                    confirmed_at?: string | null;
                    created_at?: string;
                    currency?: string;
                    delivered_at?: string | null;
                    discount_amount?: number | null;
                    email: string;
                    fulfillment_status?: string | null;
                    id?: string;
                    notes?: string | null;
                    order_number: string;
                    payment_status?: string;
                    phone?: string | null;
                    promotion_code?: string | null;
                    shipped_at?: string | null;
                    shipping_address?: Json | null;
                    shipping_amount?: number | null;
                    status?: string;
                    stripe_checkout_session_id?: string | null;
                    stripe_customer_id?: string | null;
                    stripe_payment_intent_id?: string | null;
                    subtotal?: number;
                    tax_amount?: number | null;
                    total_amount?: number;
                    updated_at?: string;
                    user_id?: string | null;
                };
                Update: {
                    admin_notes?: string | null;
                    billing_address?: Json;
                    confirmed_at?: string | null;
                    created_at?: string;
                    currency?: string;
                    delivered_at?: string | null;
                    discount_amount?: number | null;
                    email?: string;
                    fulfillment_status?: string | null;
                    id?: string;
                    notes?: string | null;
                    order_number?: string;
                    payment_status?: string;
                    phone?: string | null;
                    promotion_code?: string | null;
                    shipped_at?: string | null;
                    shipping_address?: Json | null;
                    shipping_amount?: number | null;
                    status?: string;
                    stripe_checkout_session_id?: string | null;
                    stripe_customer_id?: string | null;
                    stripe_payment_intent_id?: string | null;
                    subtotal?: number;
                    tax_amount?: number | null;
                    total_amount?: number;
                    updated_at?: string;
                    user_id?: string | null;
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
                    is_recurring: boolean | null;
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
                    is_recurring?: boolean | null;
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
                    is_recurring?: boolean | null;
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
                        referencedRelation: "product_catalog";
                        referencedColumns: ["product_id"];
                    },
                    {
                        foreignKeyName: "prices_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    }
                ];
            };
            product_categories: {
                Row: {
                    created_at: string;
                    description: string | null;
                    display_order: number;
                    icon_name: string | null;
                    id: string;
                    image_url: string | null;
                    is_active: boolean;
                    is_featured: boolean;
                    level: number;
                    metadata: Json | null;
                    name: string;
                    parent_id: string | null;
                    path: unknown | null;
                    seo_description: string | null;
                    seo_title: string | null;
                    slug: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    display_order?: number;
                    icon_name?: string | null;
                    id?: string;
                    image_url?: string | null;
                    is_active?: boolean;
                    is_featured?: boolean;
                    level?: number;
                    metadata?: Json | null;
                    name: string;
                    parent_id?: string | null;
                    path?: unknown | null;
                    seo_description?: string | null;
                    seo_title?: string | null;
                    slug: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    display_order?: number;
                    icon_name?: string | null;
                    id?: string;
                    image_url?: string | null;
                    is_active?: boolean;
                    is_featured?: boolean;
                    level?: number;
                    metadata?: Json | null;
                    name?: string;
                    parent_id?: string | null;
                    path?: unknown | null;
                    seo_description?: string | null;
                    seo_title?: string | null;
                    slug?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "product_categories_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "product_categories";
                        referencedColumns: ["id"];
                    }
                ];
            };
            product_category_relations: {
                Row: {
                    category_id: string;
                    created_at: string;
                    is_primary: boolean;
                    product_id: string;
                };
                Insert: {
                    category_id: string;
                    created_at?: string;
                    is_primary?: boolean;
                    product_id: string;
                };
                Update: {
                    category_id?: string;
                    created_at?: string;
                    is_primary?: boolean;
                    product_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "product_category_relations_category_id_fkey";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "product_categories";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "product_category_relations_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "product_catalog";
                        referencedColumns: ["product_id"];
                    },
                    {
                        foreignKeyName: "product_category_relations_product_id_fkey";
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
                        referencedRelation: "product_catalog";
                        referencedColumns: ["product_id"];
                    },
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
                    available_for_sale: boolean;
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
                    available_for_sale?: boolean;
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
                    available_for_sale?: boolean;
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
                        referencedRelation: "product_catalog";
                        referencedColumns: ["product_id"];
                    },
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
                    allow_backorders: boolean | null;
                    category_id: string | null;
                    content_grants: Json | null;
                    cover_image_url: string | null;
                    created_at: string;
                    description: string | null;
                    file_key: string | null;
                    file_size_bytes: number | null;
                    file_type: string | null;
                    id: string;
                    images: string[] | null;
                    inventory_quantity: number | null;
                    is_available: boolean;
                    is_bundle: boolean;
                    is_digital: boolean;
                    is_featured: boolean;
                    is_premium: boolean;
                    is_subscription: boolean;
                    isbn: string | null;
                    language_code: string | null;
                    metadata: Json | null;
                    name: string;
                    page_count: number | null;
                    preview_url: string | null;
                    price_cents: number | null;
                    product_type: Database["public"]["Enums"]["product_type"];
                    published_at: string | null;
                    publisher: string | null;
                    requires_shipping: boolean;
                    seo_description: string | null;
                    seo_title: string | null;
                    slug: string;
                    sort_order: number | null;
                    status: string;
                    stripe_product_id: string | null;
                    subtitle: string | null;
                    thumbnail_url: string | null;
                    title: string | null;
                    track_inventory: boolean | null;
                    updated_at: string;
                    word_count: number | null;
                    work_id: string | null;
                };
                Insert: {
                    active?: boolean;
                    allow_backorders?: boolean | null;
                    category_id?: string | null;
                    content_grants?: Json | null;
                    cover_image_url?: string | null;
                    created_at?: string;
                    description?: string | null;
                    file_key?: string | null;
                    file_size_bytes?: number | null;
                    file_type?: string | null;
                    id?: string;
                    images?: string[] | null;
                    inventory_quantity?: number | null;
                    is_available?: boolean;
                    is_bundle?: boolean;
                    is_digital?: boolean;
                    is_featured?: boolean;
                    is_premium?: boolean;
                    is_subscription?: boolean;
                    isbn?: string | null;
                    language_code?: string | null;
                    metadata?: Json | null;
                    name: string;
                    page_count?: number | null;
                    preview_url?: string | null;
                    price_cents?: number | null;
                    product_type: Database["public"]["Enums"]["product_type"];
                    published_at?: string | null;
                    publisher?: string | null;
                    requires_shipping?: boolean;
                    seo_description?: string | null;
                    seo_title?: string | null;
                    slug: string;
                    sort_order?: number | null;
                    status?: string;
                    stripe_product_id?: string | null;
                    subtitle?: string | null;
                    thumbnail_url?: string | null;
                    title?: string | null;
                    track_inventory?: boolean | null;
                    updated_at?: string;
                    word_count?: number | null;
                    work_id?: string | null;
                };
                Update: {
                    active?: boolean;
                    allow_backorders?: boolean | null;
                    category_id?: string | null;
                    content_grants?: Json | null;
                    cover_image_url?: string | null;
                    created_at?: string;
                    description?: string | null;
                    file_key?: string | null;
                    file_size_bytes?: number | null;
                    file_type?: string | null;
                    id?: string;
                    images?: string[] | null;
                    inventory_quantity?: number | null;
                    is_available?: boolean;
                    is_bundle?: boolean;
                    is_digital?: boolean;
                    is_featured?: boolean;
                    is_premium?: boolean;
                    is_subscription?: boolean;
                    isbn?: string | null;
                    language_code?: string | null;
                    metadata?: Json | null;
                    name?: string;
                    page_count?: number | null;
                    preview_url?: string | null;
                    price_cents?: number | null;
                    product_type?: Database["public"]["Enums"]["product_type"];
                    published_at?: string | null;
                    publisher?: string | null;
                    requires_shipping?: boolean;
                    seo_description?: string | null;
                    seo_title?: string | null;
                    slug?: string;
                    sort_order?: number | null;
                    status?: string;
                    stripe_product_id?: string | null;
                    subtitle?: string | null;
                    thumbnail_url?: string | null;
                    title?: string | null;
                    track_inventory?: boolean | null;
                    updated_at?: string;
                    word_count?: number | null;
                    work_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "products_work_id_fkey";
                        columns: ["work_id"];
                        isOneToOne: false;
                        referencedRelation: "content_with_access";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "products_work_id_fkey";
                        columns: ["work_id"];
                        isOneToOne: false;
                        referencedRelation: "works";
                        referencedColumns: ["id"];
                    }
                ];
            };
            professional_services: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    details: Json | null;
                    id: string;
                    is_available: boolean | null;
                    price: number | null;
                    service_type: string;
                    title: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    details?: Json | null;
                    id?: string;
                    is_available?: boolean | null;
                    price?: number | null;
                    service_type: string;
                    title: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    details?: Json | null;
                    id?: string;
                    is_available?: boolean | null;
                    price?: number | null;
                    service_type?: string;
                    title?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            profiles: {
                Row: {
                    achievements_count: number | null;
                    avatar_url: string | null;
                    beta_reader_approved_at: string | null;
                    beta_reader_status: Database["public"]["Enums"]["beta_reader_status"];
                    bio: string | null;
                    books_completed: number | null;
                    cancel_at_period_end: boolean | null;
                    chapters_read: number | null;
                    created_at: string;
                    current_period_end: string | null;
                    currently_reading: string | null;
                    display_name: string | null;
                    email: string;
                    email_notifications: boolean | null;
                    favorite_genre: string | null;
                    full_name: string | null;
                    id: string;
                    last_active_at: string | null;
                    location: string | null;
                    marketing_emails: boolean | null;
                    profile_visibility: Database["public"]["Enums"]["profile_visibility"];
                    reading_goal: number | null;
                    reading_streak: number | null;
                    reviews_written: number | null;
                    role: Database["public"]["Enums"]["user_role"];
                    show_achievements: boolean | null;
                    show_reading_progress: boolean | null;
                    stripe_customer_id: string | null;
                    subscription_status: string | null;
                    subscription_tier: string | null;
                    total_reading_time: number | null;
                    updated_at: string;
                    username: string;
                    website: string | null;
                };
                Insert: {
                    achievements_count?: number | null;
                    avatar_url?: string | null;
                    beta_reader_approved_at?: string | null;
                    beta_reader_status?: Database["public"]["Enums"]["beta_reader_status"];
                    bio?: string | null;
                    books_completed?: number | null;
                    cancel_at_period_end?: boolean | null;
                    chapters_read?: number | null;
                    created_at?: string;
                    current_period_end?: string | null;
                    currently_reading?: string | null;
                    display_name?: string | null;
                    email: string;
                    email_notifications?: boolean | null;
                    favorite_genre?: string | null;
                    full_name?: string | null;
                    id: string;
                    last_active_at?: string | null;
                    location?: string | null;
                    marketing_emails?: boolean | null;
                    profile_visibility?: Database["public"]["Enums"]["profile_visibility"];
                    reading_goal?: number | null;
                    reading_streak?: number | null;
                    reviews_written?: number | null;
                    role?: Database["public"]["Enums"]["user_role"];
                    show_achievements?: boolean | null;
                    show_reading_progress?: boolean | null;
                    stripe_customer_id?: string | null;
                    subscription_status?: string | null;
                    subscription_tier?: string | null;
                    total_reading_time?: number | null;
                    updated_at?: string;
                    username: string;
                    website?: string | null;
                };
                Update: {
                    achievements_count?: number | null;
                    avatar_url?: string | null;
                    beta_reader_approved_at?: string | null;
                    beta_reader_status?: Database["public"]["Enums"]["beta_reader_status"];
                    bio?: string | null;
                    books_completed?: number | null;
                    cancel_at_period_end?: boolean | null;
                    chapters_read?: number | null;
                    created_at?: string;
                    current_period_end?: string | null;
                    currently_reading?: string | null;
                    display_name?: string | null;
                    email?: string;
                    email_notifications?: boolean | null;
                    favorite_genre?: string | null;
                    full_name?: string | null;
                    id?: string;
                    last_active_at?: string | null;
                    location?: string | null;
                    marketing_emails?: boolean | null;
                    profile_visibility?: Database["public"]["Enums"]["profile_visibility"];
                    reading_goal?: number | null;
                    reading_streak?: number | null;
                    reviews_written?: number | null;
                    role?: Database["public"]["Enums"]["user_role"];
                    show_achievements?: boolean | null;
                    show_reading_progress?: boolean | null;
                    stripe_customer_id?: string | null;
                    subscription_status?: string | null;
                    subscription_tier?: string | null;
                    total_reading_time?: number | null;
                    updated_at?: string;
                    username?: string;
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
                        referencedRelation: "product_catalog";
                        referencedColumns: ["product_id"];
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
                    link: string | null;
                    release_date: string | null;
                    title: string;
                    type: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    link?: string | null;
                    release_date?: string | null;
                    title: string;
                    type: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    link?: string | null;
                    release_date?: string | null;
                    title?: string;
                    type?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            shopping_carts: {
                Row: {
                    created_at: string;
                    expires_at: string | null;
                    id: string;
                    session_id: string | null;
                    updated_at: string;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string;
                    expires_at?: string | null;
                    id?: string;
                    session_id?: string | null;
                    updated_at?: string;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string;
                    expires_at?: string | null;
                    id?: string;
                    session_id?: string | null;
                    updated_at?: string;
                    user_id?: string | null;
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
            stripe_sync_logs: {
                Row: {
                    completed_at: string | null;
                    duration_seconds: number | null;
                    error_details: string | null;
                    id: string;
                    items_failed: number | null;
                    items_processed: number | null;
                    items_synced: number | null;
                    result: Json | null;
                    started_at: string;
                    status: string;
                    sync_type: string;
                };
                Insert: {
                    completed_at?: string | null;
                    duration_seconds?: number | null;
                    error_details?: string | null;
                    id?: string;
                    items_failed?: number | null;
                    items_processed?: number | null;
                    items_synced?: number | null;
                    result?: Json | null;
                    started_at?: string;
                    status: string;
                    sync_type: string;
                };
                Update: {
                    completed_at?: string | null;
                    duration_seconds?: number | null;
                    error_details?: string | null;
                    id?: string;
                    items_failed?: number | null;
                    items_processed?: number | null;
                    items_synced?: number | null;
                    result?: Json | null;
                    started_at?: string;
                    status?: string;
                    sync_type?: string;
                };
                Relationships: [];
            };
            stripe_webhook_events: {
                Row: {
                    created_at: string;
                    data: Json;
                    error_message: string | null;
                    event_type: string;
                    id: string;
                    processed: boolean | null;
                    stripe_event_id: string;
                };
                Insert: {
                    created_at?: string;
                    data: Json;
                    error_message?: string | null;
                    event_type: string;
                    id?: string;
                    processed?: boolean | null;
                    stripe_event_id: string;
                };
                Update: {
                    created_at?: string;
                    data?: Json;
                    error_message?: string | null;
                    event_type?: string;
                    id?: string;
                    processed?: boolean | null;
                    stripe_event_id?: string;
                };
                Relationships: [];
            };
            subscription_discounts: {
                Row: {
                    amount_off: number | null;
                    coupon_id: string | null;
                    created_at: string;
                    currency: string | null;
                    duration: Database["public"]["Enums"]["subscription_discount_duration"];
                    duration_in_months: number | null;
                    end_date: string | null;
                    id: string;
                    metadata: Json | null;
                    percent_off: number | null;
                    start_date: string;
                    subscription_id: string;
                    updated_at: string;
                };
                Insert: {
                    amount_off?: number | null;
                    coupon_id?: string | null;
                    created_at?: string;
                    currency?: string | null;
                    duration: Database["public"]["Enums"]["subscription_discount_duration"];
                    duration_in_months?: number | null;
                    end_date?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    percent_off?: number | null;
                    start_date: string;
                    subscription_id: string;
                    updated_at?: string;
                };
                Update: {
                    amount_off?: number | null;
                    coupon_id?: string | null;
                    created_at?: string;
                    currency?: string | null;
                    duration?: Database["public"]["Enums"]["subscription_discount_duration"];
                    duration_in_months?: number | null;
                    end_date?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    percent_off?: number | null;
                    start_date?: string;
                    subscription_id?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "subscription_discounts_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscription_details";
                        referencedColumns: ["subscription_id"];
                    },
                    {
                        foreignKeyName: "subscription_discounts_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscriptions";
                        referencedColumns: ["id"];
                    }
                ];
            };
            subscription_invoice_items: {
                Row: {
                    amount: number;
                    created_at: string;
                    currency: string;
                    description: string | null;
                    id: string;
                    invoice_id: string;
                    metadata: Json | null;
                    price_id: string | null;
                    product_id: string;
                    quantity: number;
                    subscription_id: string;
                    subscription_item_id: string | null;
                    unit_amount: number | null;
                    updated_at: string;
                    variant_id: string | null;
                };
                Insert: {
                    amount: number;
                    created_at?: string;
                    currency?: string;
                    description?: string | null;
                    id?: string;
                    invoice_id: string;
                    metadata?: Json | null;
                    price_id?: string | null;
                    product_id: string;
                    quantity?: number;
                    subscription_id: string;
                    subscription_item_id?: string | null;
                    unit_amount?: number | null;
                    updated_at?: string;
                    variant_id?: string | null;
                };
                Update: {
                    amount?: number;
                    created_at?: string;
                    currency?: string;
                    description?: string | null;
                    id?: string;
                    invoice_id?: string;
                    metadata?: Json | null;
                    price_id?: string | null;
                    product_id?: string;
                    quantity?: number;
                    subscription_id?: string;
                    subscription_item_id?: string | null;
                    unit_amount?: number | null;
                    updated_at?: string;
                    variant_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "subscription_invoice_items_invoice_id_fkey";
                        columns: ["invoice_id"];
                        isOneToOne: false;
                        referencedRelation: "subscription_invoices";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "subscription_invoice_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "product_catalog";
                        referencedColumns: ["product_id"];
                    },
                    {
                        foreignKeyName: "subscription_invoice_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "subscription_invoice_items_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscription_details";
                        referencedColumns: ["subscription_id"];
                    },
                    {
                        foreignKeyName: "subscription_invoice_items_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscriptions";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "subscription_invoice_items_subscription_item_id_fkey";
                        columns: ["subscription_item_id"];
                        isOneToOne: false;
                        referencedRelation: "subscription_items";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "subscription_invoice_items_variant_id_fkey";
                        columns: ["variant_id"];
                        isOneToOne: false;
                        referencedRelation: "product_variants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            subscription_invoices: {
                Row: {
                    amount_due: number;
                    amount_paid: number | null;
                    amount_remaining: number | null;
                    billing_reason: string | null;
                    created_at: string;
                    currency: string;
                    hosted_invoice_url: string | null;
                    id: string;
                    invoice_number: string;
                    invoice_pdf_url: string | null;
                    metadata: Json | null;
                    paid_at: string | null;
                    payment_intent_id: string | null;
                    payment_status: Database["public"]["Enums"]["payment_status"] | null;
                    period_end: string;
                    period_start: string;
                    status: Database["public"]["Enums"]["invoice_status"];
                    subscription_id: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    amount_due: number;
                    amount_paid?: number | null;
                    amount_remaining?: number | null;
                    billing_reason?: string | null;
                    created_at?: string;
                    currency?: string;
                    hosted_invoice_url?: string | null;
                    id?: string;
                    invoice_number: string;
                    invoice_pdf_url?: string | null;
                    metadata?: Json | null;
                    paid_at?: string | null;
                    payment_intent_id?: string | null;
                    payment_status?: Database["public"]["Enums"]["payment_status"] | null;
                    period_end: string;
                    period_start: string;
                    status?: Database["public"]["Enums"]["invoice_status"];
                    subscription_id: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    amount_due?: number;
                    amount_paid?: number | null;
                    amount_remaining?: number | null;
                    billing_reason?: string | null;
                    created_at?: string;
                    currency?: string;
                    hosted_invoice_url?: string | null;
                    id?: string;
                    invoice_number?: string;
                    invoice_pdf_url?: string | null;
                    metadata?: Json | null;
                    paid_at?: string | null;
                    payment_intent_id?: string | null;
                    payment_status?: Database["public"]["Enums"]["payment_status"] | null;
                    period_end?: string;
                    period_start?: string;
                    status?: Database["public"]["Enums"]["invoice_status"];
                    subscription_id?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "subscription_invoices_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscription_details";
                        referencedColumns: ["subscription_id"];
                    },
                    {
                        foreignKeyName: "subscription_invoices_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscriptions";
                        referencedColumns: ["id"];
                    }
                ];
            };
            subscription_items: {
                Row: {
                    created_at: string;
                    currency: string;
                    id: string;
                    metadata: Json | null;
                    price_id: string | null;
                    product_id: string;
                    quantity: number;
                    subscription_id: string;
                    unit_amount: number;
                    updated_at: string;
                    variant_id: string | null;
                };
                Insert: {
                    created_at?: string;
                    currency?: string;
                    id?: string;
                    metadata?: Json | null;
                    price_id?: string | null;
                    product_id: string;
                    quantity?: number;
                    subscription_id: string;
                    unit_amount: number;
                    updated_at?: string;
                    variant_id?: string | null;
                };
                Update: {
                    created_at?: string;
                    currency?: string;
                    id?: string;
                    metadata?: Json | null;
                    price_id?: string | null;
                    product_id?: string;
                    quantity?: number;
                    subscription_id?: string;
                    unit_amount?: number;
                    updated_at?: string;
                    variant_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "subscription_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "product_catalog";
                        referencedColumns: ["product_id"];
                    },
                    {
                        foreignKeyName: "subscription_items_product_id_fkey";
                        columns: ["product_id"];
                        isOneToOne: false;
                        referencedRelation: "products";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "subscription_items_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscription_details";
                        referencedColumns: ["subscription_id"];
                    },
                    {
                        foreignKeyName: "subscription_items_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscriptions";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "subscription_items_variant_id_fkey";
                        columns: ["variant_id"];
                        isOneToOne: false;
                        referencedRelation: "product_variants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            subscription_notes: {
                Row: {
                    created_at: string;
                    id: string;
                    is_system_note: boolean;
                    is_visible_to_customer: boolean;
                    note: string;
                    subscription_id: string;
                    updated_at: string;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    is_system_note?: boolean;
                    is_visible_to_customer?: boolean;
                    note: string;
                    subscription_id: string;
                    updated_at?: string;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    is_system_note?: boolean;
                    is_visible_to_customer?: boolean;
                    note?: string;
                    subscription_id?: string;
                    updated_at?: string;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "subscription_notes_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscription_details";
                        referencedColumns: ["subscription_id"];
                    },
                    {
                        foreignKeyName: "subscription_notes_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscriptions";
                        referencedColumns: ["id"];
                    }
                ];
            };
            subscription_plans: {
                Row: {
                    billing_interval: string;
                    created_at: string;
                    currency: string;
                    description: string | null;
                    features: Json | null;
                    id: string;
                    interval_count: number;
                    is_active: boolean;
                    metadata: Json | null;
                    name: string;
                    price_amount: number;
                    privileges: Json | null;
                    sort_order: number | null;
                    stripe_price_id: string | null;
                    stripe_product_id: string | null;
                    trial_period_days: number | null;
                    updated_at: string;
                };
                Insert: {
                    billing_interval: string;
                    created_at?: string;
                    currency?: string;
                    description?: string | null;
                    features?: Json | null;
                    id?: string;
                    interval_count?: number;
                    is_active?: boolean;
                    metadata?: Json | null;
                    name: string;
                    price_amount: number;
                    privileges?: Json | null;
                    sort_order?: number | null;
                    stripe_price_id?: string | null;
                    stripe_product_id?: string | null;
                    trial_period_days?: number | null;
                    updated_at?: string;
                };
                Update: {
                    billing_interval?: string;
                    created_at?: string;
                    currency?: string;
                    description?: string | null;
                    features?: Json | null;
                    id?: string;
                    interval_count?: number;
                    is_active?: boolean;
                    metadata?: Json | null;
                    name?: string;
                    price_amount?: number;
                    privileges?: Json | null;
                    sort_order?: number | null;
                    stripe_price_id?: string | null;
                    stripe_product_id?: string | null;
                    trial_period_days?: number | null;
                    updated_at?: string;
                };
                Relationships: [];
            };
            subscription_usage: {
                Row: {
                    created_at: string;
                    feature_name: string;
                    id: string;
                    period_end: string;
                    period_start: string;
                    subscription_id: string;
                    usage_count: number | null;
                    usage_limit: number | null;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    feature_name: string;
                    id?: string;
                    period_end: string;
                    period_start: string;
                    subscription_id: string;
                    usage_count?: number | null;
                    usage_limit?: number | null;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    feature_name?: string;
                    id?: string;
                    period_end?: string;
                    period_start?: string;
                    subscription_id?: string;
                    usage_count?: number | null;
                    usage_limit?: number | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "subscription_usage_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscription_details";
                        referencedColumns: ["subscription_id"];
                    },
                    {
                        foreignKeyName: "subscription_usage_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscriptions";
                        referencedColumns: ["id"];
                    }
                ];
            };
            subscription_usage_records: {
                Row: {
                    created_at: string;
                    id: string;
                    metadata: Json | null;
                    quantity: number;
                    subscription_id: string;
                    subscription_item_id: string;
                    timestamp: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    quantity: number;
                    subscription_id: string;
                    subscription_item_id: string;
                    timestamp: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    metadata?: Json | null;
                    quantity?: number;
                    subscription_id?: string;
                    subscription_item_id?: string;
                    timestamp?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "subscription_usage_records_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscription_details";
                        referencedColumns: ["subscription_id"];
                    },
                    {
                        foreignKeyName: "subscription_usage_records_subscription_id_fkey";
                        columns: ["subscription_id"];
                        isOneToOne: false;
                        referencedRelation: "subscriptions";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "subscription_usage_records_subscription_item_id_fkey";
                        columns: ["subscription_item_id"];
                        isOneToOne: false;
                        referencedRelation: "subscription_items";
                        referencedColumns: ["id"];
                    }
                ];
            };
            subscriptions: {
                Row: {
                    billing_cycle_anchor: string | null;
                    cancel_at_period_end: boolean | null;
                    canceled_at: string | null;
                    collection_method: Database["public"]["Enums"]["collection_method"] | null;
                    created_at: string;
                    current_period_end: string | null;
                    current_period_start: string | null;
                    days_until_due: number | null;
                    ended_at: string | null;
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
                    user_id: string;
                };
                Insert: {
                    billing_cycle_anchor?: string | null;
                    cancel_at_period_end?: boolean | null;
                    canceled_at?: string | null;
                    collection_method?: Database["public"]["Enums"]["collection_method"] | null;
                    created_at?: string;
                    current_period_end?: string | null;
                    current_period_start?: string | null;
                    days_until_due?: number | null;
                    ended_at?: string | null;
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
                    user_id: string;
                };
                Update: {
                    billing_cycle_anchor?: string | null;
                    cancel_at_period_end?: boolean | null;
                    canceled_at?: string | null;
                    collection_method?: Database["public"]["Enums"]["collection_method"] | null;
                    created_at?: string;
                    current_period_end?: string | null;
                    current_period_start?: string | null;
                    days_until_due?: number | null;
                    ended_at?: string | null;
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
                    user_id?: string;
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
            user_activities: {
                Row: {
                    activity_type: string;
                    cover_image_url: string | null;
                    created_at: string;
                    entity_id: string | null;
                    entity_type: string | null;
                    id: string;
                    ip_address: unknown | null;
                    item_title: string | null;
                    metadata: Json | null;
                    progress: number | null;
                    status: string | null;
                    timestamp: string;
                    total_progress: number | null;
                    user_agent: string | null;
                    user_id: string;
                };
                Insert: {
                    activity_type: string;
                    cover_image_url?: string | null;
                    created_at?: string;
                    entity_id?: string | null;
                    entity_type?: string | null;
                    id?: string;
                    ip_address?: unknown | null;
                    item_title?: string | null;
                    metadata?: Json | null;
                    progress?: number | null;
                    status?: string | null;
                    timestamp?: string;
                    total_progress?: number | null;
                    user_agent?: string | null;
                    user_id: string;
                };
                Update: {
                    activity_type?: string;
                    cover_image_url?: string | null;
                    created_at?: string;
                    entity_id?: string | null;
                    entity_type?: string | null;
                    id?: string;
                    ip_address?: unknown | null;
                    item_title?: string | null;
                    metadata?: Json | null;
                    progress?: number | null;
                    status?: string | null;
                    timestamp?: string;
                    total_progress?: number | null;
                    user_agent?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            user_reading_history: {
                Row: {
                    content_id: string;
                    content_type: string;
                    created_at: string;
                    id: string;
                    is_completed: boolean;
                    last_read_at: string;
                    last_read_position: Json | null;
                    progress: number;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    content_id: string;
                    content_type: string;
                    created_at?: string;
                    id?: string;
                    is_completed?: boolean;
                    last_read_at?: string;
                    last_read_position?: Json | null;
                    progress?: number;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    content_id?: string;
                    content_type?: string;
                    created_at?: string;
                    id?: string;
                    is_completed?: boolean;
                    last_read_at?: string;
                    last_read_position?: Json | null;
                    progress?: number;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
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
                        foreignKeyName: "user_roles_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "active_subscribers";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "user_roles_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "user_roles_user_id_fkey";
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
                    currently_reading: string | null;
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
                    currently_reading?: string | null;
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
                    currently_reading?: string | null;
                    last_activity_date?: string | null;
                    level_reached?: number;
                    total_reading_minutes?: number;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_stats_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: true;
                        referencedRelation: "active_subscribers";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "user_stats_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: true;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "user_stats_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: true;
                        referencedRelation: "user_dashboard_stats";
                        referencedColumns: ["user_id"];
                    }
                ];
            };
            video_tutorials: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    duration_seconds: number | null;
                    id: string;
                    status: string;
                    thumbnail_url: string | null;
                    title: string;
                    updated_at: string | null;
                    video_url: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    duration_seconds?: number | null;
                    id?: string;
                    status?: string;
                    thumbnail_url?: string | null;
                    title: string;
                    updated_at?: string | null;
                    video_url?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    duration_seconds?: number | null;
                    id?: string;
                    status?: string;
                    thumbnail_url?: string | null;
                    title?: string;
                    updated_at?: string | null;
                    video_url?: string | null;
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
                        referencedRelation: "wiki_items";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "wiki_content_blocks_page_id_fkey";
                        columns: ["page_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_latest_revisions_view";
                        referencedColumns: ["wiki_item_id"];
                    },
                    {
                        foreignKeyName: "wiki_content_blocks_page_id_fkey";
                        columns: ["page_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_search_view";
                        referencedColumns: ["wiki_item_id"];
                    }
                ];
            };
            wiki_items: {
                Row: {
                    category_id: string | null;
                    content: string | null;
                    created_at: string;
                    created_by: string | null;
                    depth: number | null;
                    excerpt: string | null;
                    full_path: string | null;
                    id: string;
                    is_published: boolean | null;
                    name: string;
                    parent_id: string | null;
                    properties: Json | null;
                    slug: string;
                    status: string | null;
                    tags: string[] | null;
                    type: string;
                    updated_at: string;
                    view_count: number | null;
                    visibility: string | null;
                };
                Insert: {
                    category_id?: string | null;
                    content?: string | null;
                    created_at?: string;
                    created_by?: string | null;
                    depth?: number | null;
                    excerpt?: string | null;
                    full_path?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    name: string;
                    parent_id?: string | null;
                    properties?: Json | null;
                    slug: string;
                    status?: string | null;
                    tags?: string[] | null;
                    type: string;
                    updated_at?: string;
                    view_count?: number | null;
                    visibility?: string | null;
                };
                Update: {
                    category_id?: string | null;
                    content?: string | null;
                    created_at?: string;
                    created_by?: string | null;
                    depth?: number | null;
                    excerpt?: string | null;
                    full_path?: string | null;
                    id?: string;
                    is_published?: boolean | null;
                    name?: string;
                    parent_id?: string | null;
                    properties?: Json | null;
                    slug?: string;
                    status?: string | null;
                    tags?: string[] | null;
                    type?: string;
                    updated_at?: string;
                    view_count?: number | null;
                    visibility?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "wiki_items_category_id_fkey";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_categories";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "wiki_items_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_items";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "wiki_items_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_latest_revisions_view";
                        referencedColumns: ["wiki_item_id"];
                    },
                    {
                        foreignKeyName: "wiki_items_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_search_view";
                        referencedColumns: ["wiki_item_id"];
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
                    wiki_item_id: string | null;
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
                    wiki_item_id?: string | null;
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
                    wiki_item_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "wiki_media_wiki_item_id_fkey";
                        columns: ["wiki_item_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_items";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "wiki_media_wiki_item_id_fkey";
                        columns: ["wiki_item_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_latest_revisions_view";
                        referencedColumns: ["wiki_item_id"];
                    },
                    {
                        foreignKeyName: "wiki_media_wiki_item_id_fkey";
                        columns: ["wiki_item_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_search_view";
                        referencedColumns: ["wiki_item_id"];
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
                        referencedRelation: "wiki_items";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "wiki_revisions_page_id_fkey";
                        columns: ["page_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_latest_revisions_view";
                        referencedColumns: ["wiki_item_id"];
                    },
                    {
                        foreignKeyName: "wiki_revisions_page_id_fkey";
                        columns: ["page_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_search_view";
                        referencedColumns: ["wiki_item_id"];
                    }
                ];
            };
            works: {
                Row: {
                    author_id: string | null;
                    cover_image_url: string | null;
                    created_at: string;
                    description: string | null;
                    id: string;
                    is_featured: boolean | null;
                    is_free: boolean | null;
                    is_premium: boolean | null;
                    order_in_parent: number | null;
                    parent_id: string | null;
                    release_date: string | null;
                    status: Database["public"]["Enums"]["work_status"];
                    title: string;
                    type: Database["public"]["Enums"]["work_type"];
                    updated_at: string;
                };
                Insert: {
                    author_id?: string | null;
                    cover_image_url?: string | null;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    is_featured?: boolean | null;
                    is_free?: boolean | null;
                    is_premium?: boolean | null;
                    order_in_parent?: number | null;
                    parent_id?: string | null;
                    release_date?: string | null;
                    status?: Database["public"]["Enums"]["work_status"];
                    title: string;
                    type: Database["public"]["Enums"]["work_type"];
                    updated_at?: string;
                };
                Update: {
                    author_id?: string | null;
                    cover_image_url?: string | null;
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    is_featured?: boolean | null;
                    is_free?: boolean | null;
                    is_premium?: boolean | null;
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
                        referencedRelation: "content_with_access";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "works_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "works";
                        referencedColumns: ["id"];
                    }
                ];
            };
            writing_guides: {
                Row: {
                    content: string | null;
                    created_at: string | null;
                    id: string;
                    published_at: string | null;
                    slug: string | null;
                    status: string;
                    title: string;
                    updated_at: string | null;
                };
                Insert: {
                    content?: string | null;
                    created_at?: string | null;
                    id?: string;
                    published_at?: string | null;
                    slug?: string | null;
                    status?: string;
                    title: string;
                    updated_at?: string | null;
                };
                Update: {
                    content?: string | null;
                    created_at?: string | null;
                    id?: string;
                    published_at?: string | null;
                    slug?: string | null;
                    status?: string;
                    title?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
        };
        Views: {
            active_subscribers: {
                Row: {
                    current_period_end: string | null;
                    display_name: string | null;
                    id: string | null;
                    plan_id: string | null;
                    status: Database["public"]["Enums"]["subscription_status"] | null;
                    subscription_tier: string | null;
                    username: string | null;
                };
                Relationships: [];
            };
            analytics_summary: {
                Row: {
                    active_subscribers: number | null;
                    published_chapters: number | null;
                    published_works: number | null;
                    total_content_views: number | null;
                    total_members: number | null;
                    wiki_pages: number | null;
                };
                Relationships: [];
            };
            content_with_access: {
                Row: {
                    author_id: string | null;
                    cover_image_url: string | null;
                    created_at: string | null;
                    description: string | null;
                    id: string | null;
                    is_featured: boolean | null;
                    is_free: boolean | null;
                    is_premium: boolean | null;
                    order_in_parent: number | null;
                    parent_id: string | null;
                    release_date: string | null;
                    status: Database["public"]["Enums"]["work_status"] | null;
                    title: string | null;
                    type: Database["public"]["Enums"]["work_type"] | null;
                    updated_at: string | null;
                    user_has_access: boolean | null;
                };
                Insert: {
                    author_id?: string | null;
                    cover_image_url?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string | null;
                    is_featured?: boolean | null;
                    is_free?: boolean | null;
                    is_premium?: boolean | null;
                    order_in_parent?: number | null;
                    parent_id?: string | null;
                    release_date?: string | null;
                    status?: Database["public"]["Enums"]["work_status"] | null;
                    title?: string | null;
                    type?: Database["public"]["Enums"]["work_type"] | null;
                    updated_at?: string | null;
                    user_has_access?: never;
                };
                Update: {
                    author_id?: string | null;
                    cover_image_url?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string | null;
                    is_featured?: boolean | null;
                    is_free?: boolean | null;
                    is_premium?: boolean | null;
                    order_in_parent?: number | null;
                    parent_id?: string | null;
                    release_date?: string | null;
                    status?: Database["public"]["Enums"]["work_status"] | null;
                    title?: string | null;
                    type?: Database["public"]["Enums"]["work_type"] | null;
                    updated_at?: string | null;
                    user_has_access?: never;
                };
                Relationships: [
                    {
                        foreignKeyName: "works_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "content_with_access";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "works_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "works";
                        referencedColumns: ["id"];
                    }
                ];
            };
            customer_order_history: {
                Row: {
                    admin_notes: string | null;
                    billing_address: Json | null;
                    confirmed_at: string | null;
                    created_at: string | null;
                    currency: string | null;
                    delivered_at: string | null;
                    discount_amount: number | null;
                    email: string | null;
                    fulfillment_status: string | null;
                    notes: string | null;
                    order_id: string | null;
                    order_items: Json | null;
                    order_number: string | null;
                    payment_status: string | null;
                    phone: string | null;
                    promotion_code: string | null;
                    shipped_at: string | null;
                    shipping_address: Json | null;
                    shipping_amount: number | null;
                    status: string | null;
                    subtotal: number | null;
                    tax_amount: number | null;
                    total_amount: number | null;
                    updated_at: string | null;
                    user_id: string | null;
                };
                Relationships: [];
            };
            detailed_audit_log: {
                Row: {
                    action: string | null;
                    actor_display_name: string | null;
                    actor_user_id: string | null;
                    actor_username: string | null;
                    created_at: string | null;
                    id: string | null;
                };
                Relationships: [];
            };
            product_catalog: {
                Row: {
                    categories: Json | null;
                    created_at: string | null;
                    description: string | null;
                    featured: boolean | null;
                    in_stock: boolean | null;
                    max_price: number | null;
                    metadata: Json | null;
                    min_price: number | null;
                    product_id: string | null;
                    product_name: string | null;
                    slug: string | null;
                    status: string | null;
                    updated_at: string | null;
                    variants: Json | null;
                };
                Insert: {
                    categories?: never;
                    created_at?: string | null;
                    description?: string | null;
                    featured?: boolean | null;
                    in_stock?: never;
                    max_price?: never;
                    metadata?: Json | null;
                    min_price?: never;
                    product_id?: string | null;
                    product_name?: string | null;
                    slug?: string | null;
                    status?: string | null;
                    updated_at?: string | null;
                    variants?: never;
                };
                Update: {
                    categories?: never;
                    created_at?: string | null;
                    description?: string | null;
                    featured?: boolean | null;
                    in_stock?: never;
                    max_price?: never;
                    metadata?: Json | null;
                    min_price?: never;
                    product_id?: string | null;
                    product_name?: string | null;
                    slug?: string | null;
                    status?: string | null;
                    updated_at?: string | null;
                    variants?: never;
                };
                Relationships: [];
            };
            subscription_analytics: {
                Row: {
                    active_features: number | null;
                    active_subscriptions: number | null;
                    canceled_subscriptions: number | null;
                    churned_subscriptions: number | null;
                    date: string | null;
                    mrr: number | null;
                    new_subscriptions: number | null;
                    total_usage: number | null;
                    trial_conversions: number | null;
                    trialing_subscriptions: number | null;
                };
                Relationships: [];
            };
            subscription_details: {
                Row: {
                    billing_cycle_anchor: string | null;
                    billing_interval: string | null;
                    cancel_at_period_end: boolean | null;
                    canceled_at: string | null;
                    created_at: string | null;
                    current_period_end: string | null;
                    current_period_start: string | null;
                    days_until_due: number | null;
                    ended_at: string | null;
                    interval_count: number | null;
                    invoices: Json | null;
                    is_canceling: boolean | null;
                    is_in_trial: boolean | null;
                    is_trialing: boolean | null;
                    is_up_for_renewal_soon: boolean | null;
                    metadata: Json | null;
                    next_payment: Json | null;
                    plan_amount: number | null;
                    plan_currency: string | null;
                    plan_description: string | null;
                    plan_id: string | null;
                    plan_metadata: Json | null;
                    plan_name: string | null;
                    profile_name: string | null;
                    status: Database["public"]["Enums"]["subscription_status"] | null;
                    subscription_id: string | null;
                    trial_end: string | null;
                    trial_period_days: number | null;
                    trial_start: string | null;
                    updated_at: string | null;
                    usage_metrics: Json | null;
                    user_email: string | null;
                    user_id: string | null;
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
            wiki_latest_revisions_view: {
                Row: {
                    content_block_count: number | null;
                    content_preview: string | null;
                    parent_id: string | null;
                    revised_at: string | null;
                    revised_by: string | null;
                    revision_id: string | null;
                    revision_summary: string | null;
                    revision_title: string | null;
                    slug: string | null;
                    status: string | null;
                    title: string | null;
                    wiki_item_id: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "wiki_items_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_items";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "wiki_items_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_latest_revisions_view";
                        referencedColumns: ["wiki_item_id"];
                    },
                    {
                        foreignKeyName: "wiki_items_parent_id_fkey";
                        columns: ["parent_id"];
                        isOneToOne: false;
                        referencedRelation: "wiki_search_view";
                        referencedColumns: ["wiki_item_id"];
                    }
                ];
            };
            wiki_page_tree_view: {
                Row: {
                    breadcrumb: string | null;
                    created_at: string | null;
                    created_by: string | null;
                    full_slug: string | null;
                    full_title: string | null;
                    id: string | null;
                    level: number | null;
                    parent_id: string | null;
                    path: string[] | null;
                    slug: string | null;
                    slug_path: string[] | null;
                    status: string | null;
                    title: string | null;
                    updated_at: string | null;
                    url_path: string | null;
                };
                Relationships: [];
            };
            wiki_search_view: {
                Row: {
                    created_at: string | null;
                    revised_at: string | null;
                    revised_by: string | null;
                    revision_id: string | null;
                    search_vector: unknown | null;
                    slug: string | null;
                    status: string | null;
                    title: string | null;
                    updated_at: string | null;
                    wiki_item_id: string | null;
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
            create_order: {
                Args: {
                    p_billing_address: Json;
                    p_customer_email: string;
                    p_customer_note?: string;
                    p_items: Json[];
                    p_payment_method?: string;
                    p_shipping_address: Json;
                    p_shipping_amount?: number;
                    p_user_id: string;
                };
                Returns: string;
            };
            create_product_with_variants: {
                Args: {
                    p_product_data: Json;
                    p_variants_data?: Json;
                };
                Returns: Json;
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
            generate_order_number: {
                Args: Record<PropertyKey, never>;
                Returns: string;
            };
            generate_slug: {
                Args: {
                    input_text: string;
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
                    available_for_sale: boolean;
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
            get_product_price_range: {
                Args: {
                    p_product_id: string;
                };
                Returns: Json;
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
            has_active_subscription: {
                Args: {
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
            restore_inventory_for_order: {
                Args: {
                    p_order_id: string;
                };
                Returns: undefined;
            };
            text2ltree: {
                Args: {
                    "": string;
                };
                Returns: unknown;
            };
            update_inventory: {
                Args: {
                    p_operation?: string;
                    p_quantity_change: number;
                    p_variant_id: string;
                };
                Returns: number;
            };
            update_order_status: {
                Args: {
                    p_note?: string;
                    p_order_id: string;
                    p_status: Database["public"]["Enums"]["order_status"];
                };
                Returns: undefined;
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
            beta_reader_status: "not_applied" | "pending" | "approved" | "rejected";
            collection_method: "charge_automatically" | "send_invoice";
            content_block_type: "heading_1" | "heading_2" | "heading_3" | "paragraph" | "bullet_list" | "ordered_list" | "image" | "table" | "quote" | "code" | "divider";
            content_status: "planning" | "writing" | "editing" | "published" | "on_hold" | "archived";
            discount_type: "percentage" | "fixed_amount" | "free_shipping";
            fulfillment_status: "unfulfilled" | "fulfilled" | "partial" | "shipped" | "delivered" | "returned" | "cancelled";
            invoice_status: "draft" | "open" | "paid" | "void" | "uncollectible";
            learn_section_type: "authors_journey" | "educational_resources" | "professional_services";
            order_status: "draft" | "pending" | "processing" | "on_hold" | "completed" | "cancelled" | "refunded" | "failed";
            payment_method: "credit_card" | "paypal" | "bank_transfer" | "crypto" | "apple_pay" | "google_pay" | "stripe" | "other";
            payment_status: "paid" | "unpaid" | "no_payment_required" | "failed" | "processing" | "requires_payment_method" | "requires_confirmation" | "requires_action" | "canceled";
            product_type: "single_issue" | "bundle" | "chapter_pass" | "arc_pass" | "subscription" | "arc_bundle" | "saga_bundle" | "volume_bundle" | "book_bundle" | "subscription_tier";
            profile_visibility: "public" | "private" | "friends_only";
            refund_status: "pending" | "processing" | "succeeded" | "failed" | "cancelled";
            subscription_discount_duration: "forever" | "once" | "repeating";
            subscription_status: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "paused";
            user_role: "admin" | "support" | "accountant" | "user" | "super_admin" | "beta_reader";
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
            readonly beta_reader_status: readonly ["not_applied", "pending", "approved", "rejected"];
            readonly collection_method: readonly ["charge_automatically", "send_invoice"];
            readonly content_block_type: readonly ["heading_1", "heading_2", "heading_3", "paragraph", "bullet_list", "ordered_list", "image", "table", "quote", "code", "divider"];
            readonly content_status: readonly ["planning", "writing", "editing", "published", "on_hold", "archived"];
            readonly discount_type: readonly ["percentage", "fixed_amount", "free_shipping"];
            readonly fulfillment_status: readonly ["unfulfilled", "fulfilled", "partial", "shipped", "delivered", "returned", "cancelled"];
            readonly invoice_status: readonly ["draft", "open", "paid", "void", "uncollectible"];
            readonly learn_section_type: readonly ["authors_journey", "educational_resources", "professional_services"];
            readonly order_status: readonly ["draft", "pending", "processing", "on_hold", "completed", "cancelled", "refunded", "failed"];
            readonly payment_method: readonly ["credit_card", "paypal", "bank_transfer", "crypto", "apple_pay", "google_pay", "stripe", "other"];
            readonly payment_status: readonly ["paid", "unpaid", "no_payment_required", "failed", "processing", "requires_payment_method", "requires_confirmation", "requires_action", "canceled"];
            readonly product_type: readonly ["single_issue", "bundle", "chapter_pass", "arc_pass", "subscription", "arc_bundle", "saga_bundle", "volume_bundle", "book_bundle", "subscription_tier"];
            readonly profile_visibility: readonly ["public", "private", "friends_only"];
            readonly refund_status: readonly ["pending", "processing", "succeeded", "failed", "cancelled"];
            readonly subscription_discount_duration: readonly ["forever", "once", "repeating"];
            readonly subscription_status: readonly ["incomplete", "incomplete_expired", "trialing", "active", "past_due", "canceled", "unpaid", "paused"];
            readonly user_role: readonly ["admin", "support", "accountant", "user", "super_admin", "beta_reader"];
            readonly wiki_content_type: readonly ["heading_1", "heading_2", "heading_3", "paragraph", "bullet_list", "ordered_list", "image", "video", "audio", "table", "quote", "code", "divider", "file_attachment"];
            readonly work_status: readonly ["planning", "writing", "editing", "published", "on_hold"];
            readonly work_type: readonly ["book", "volume", "saga", "arc", "issue"];
        };
    };
};
export {};
//# sourceMappingURL=database.types.d.ts.map