import Stripe from 'stripe';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';
interface CreateProductRequest {
    name: string;
    description?: string;
    product_type: Database['public']['Enums']['product_type'];
    category_id?: string;
    images?: string[];
    work_id?: string;
    content_grants?: any[];
    track_inventory?: boolean;
    active?: boolean;
    variants: CreateVariantRequest[];
}
interface CreateVariantRequest {
    name?: string;
    sku?: string;
    unit_amount: number;
    currency?: string;
    recurring_interval?: 'day' | 'week' | 'month' | 'year';
    recurring_interval_count?: number;
    inventory_quantity?: number;
    attributes?: Record<string, any>;
    is_default?: boolean;
    weight?: number;
    dimensions?: Record<string, any>;
}
interface AttachStripeProductRequest {
    product_id: string;
    stripe_product_id: string;
    sync_variants?: boolean;
}
interface AttachStripePriceRequest {
    variant_id: string;
    stripe_price_id: string;
}
export declare class StripeProductService {
    private supabase;
    private stripe;
    constructor(supabase: SupabaseClient<Database>, stripeSecretKey: string);
    /**
     * Create a new product with variants and sync to Stripe
     */
    createProductWithStripe(request: CreateProductRequest, createdBy: string): Promise<{
        product_id: string;
        stripe_product_id: string;
        variants: {
            variant_id: string;
            stripe_price_id: string;
            unit_amount: number;
        }[];
    }>;
    /**
     * Attach existing Stripe product to Supabase product
     */
    attachStripeProduct(request: AttachStripeProductRequest): Promise<{
        product_id: string;
        stripe_product_id: string;
        synced_at: string;
    }>;
    /**
     * Attach existing Stripe price to variant
     */
    attachStripePrice(request: AttachStripePriceRequest): Promise<{
        variant_id: string;
        stripe_price_id: string;
        unit_amount: number;
        currency: string;
        synced_at: string;
    }>;
    /**
     * Sync Stripe variants (prices) for a product
     */
    private syncStripeVariants;
    /**
     * Import products from Stripe catalog
     */
    importFromStripe(options?: {
        limit?: number;
        created_after?: number;
        active_only?: boolean;
        default_category_id?: string;
    }): Promise<{
        products_synced: number;
        items_failed: number;
        sync_log_id: string;
    }>;
    /**
     * Sync individual product from Stripe to Supabase
     */
    private syncProductFromStripe;
    /**
     * Sync individual price from Stripe to Supabase variant
     */
    private syncPriceFromStripe;
    /**
     * Update Stripe product from Supabase data
     */
    updateStripeProduct(productId: string, updates: Partial<Stripe.ProductUpdateParams>): Promise<Stripe.Response<Stripe.Product>>;
    /**
     * Create new price for existing product (price versioning)
     */
    createNewPrice(variantId: string, priceData: Omit<Stripe.PriceCreateParams, 'product'>): Promise<Stripe.Response<Stripe.Price>>;
    /**
     * Get complete product catalog with variants and Stripe info
     */
    getProductCatalog(filters?: {
        category_id?: string;
        active_only?: boolean;
        with_variants?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<any[]>;
    /**
     * Get low stock alerts
     */
    getLowStockAlerts(): Promise<any[]>;
    /**
     * Update inventory levels
     */
    updateInventory(variantId: string, quantityChange: number, reason: string, referenceType?: string, referenceId?: string, userId?: string): Promise<boolean>;
    /**
     * Get inventory movements history
     */
    getInventoryMovements(variantId: string, limit?: number): Promise<any[]>;
    /**
     * Generate URL-safe slug from text
     */
    private generateSlug;
    /**
     * Validate product has all required Stripe mappings
     */
    validateStripeIntegration(productId: string): Promise<{
        is_valid: boolean;
        issues: string[];
        product_name: string;
        stripe_product_id: string;
        variants_count: number;
        mapped_variants: number;
    }>;
}
export {};
