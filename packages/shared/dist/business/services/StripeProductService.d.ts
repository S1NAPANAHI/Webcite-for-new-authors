import Stripe from 'stripe';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';
interface CreateProductRequest {
    name: string;
    description?: string;
    product_type: Database['public']['Enums']['product_type'];
    category_id?: string;
    cover_image_url?: string | null;
    work_id?: string;
    content_grants?: any[];
    track_inventory?: boolean;
    active?: boolean;
    variants: CreateVariantRequest[];
}
interface CreateVariantRequest {
    name?: string;
    sku?: string;
    price_amount: number;
    price_currency?: string;
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
    createProductWithStripe(request: CreateProductRequest, createdBy: string): Promise<{
        product_id: string;
        stripe_product_id: string;
        variants: {
            variant_id: string;
            stripe_price_id: string;
            price_amount: number;
        }[];
    }>;
    attachStripeProduct(request: AttachStripeProductRequest): Promise<{
        product_id: string;
        stripe_product_id: string;
        synced_at: string;
    }>;
    attachStripePrice(request: AttachStripePriceRequest): Promise<{
        variant_id: string;
        stripe_price_id: string;
        price_amount: number;
        currency: string;
        synced_at: string;
    }>;
    private syncStripeVariants;
    importFromStripe(options?: {
        limit?: number;
        created_after?: number;
        active_only?: boolean;
        default_category_id?: string;
    }): Promise<{
        products_synced: number;
        items_failed: number;
        sync_log_id: any;
    }>;
    private syncProductFromStripe;
    private syncPriceFromStripe;
    updateStripeProduct(productId: string, updates: Partial<Stripe.ProductUpdateParams>): Promise<Stripe.Response<Stripe.Product>>;
    createNewPrice(variantId: string, priceData: Omit<Stripe.PriceCreateParams, 'product'>): Promise<Stripe.Response<Stripe.Price>>;
    getProductCatalog(filters?: {
        category_id?: string;
        active_only?: boolean;
        with_variants?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<any[]>;
    getLowStockAlerts(): Promise<any[]>;
    updateInventory(variantId: string, quantityChange: number): Promise<number>;
    getInventoryMovements(variantId: string, limit?: number): Promise<any[]>;
    private generateSlug;
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
//# sourceMappingURL=StripeProductService.d.ts.map