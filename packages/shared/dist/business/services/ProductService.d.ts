import { SupabaseClient } from '@supabase/supabase-js';
import { CreateProductInput, UpdateProductInput, ProductQuery } from '../validators/product.validator';
export declare class ProductService {
    private supabase;
    constructor(supabase: SupabaseClient);
    /**
     * Get all products with optional filtering
     */
    getProducts(query: ProductQuery): Promise<{
        products: {
            id: any;
            name: any;
            description: any;
            product_type: any;
            active: any;
            work_id: any;
            content_grants: any;
            created_at: any;
            updated_at: any;
            prices: {
                id: any;
                currency: any;
                unit_amount: any;
                interval: any;
                nickname: any;
                trial_days: any;
                active: any;
            }[];
        }[];
        pagination: {
            limit: number;
            offset: number;
            total: number;
        };
    }>;
    /**
     * Get a product by ID
     */
    getProductById(id: string): Promise<{
        id: any;
        name: any;
        description: any;
        product_type: any;
        active: any;
        work_id: any;
        content_grants: any;
        created_at: any;
        updated_at: any;
        prices: {
            id: any;
            currency: any;
            unit_amount: any;
            interval: any;
            nickname: any;
            trial_days: any;
            active: any;
        }[];
        work: {
            id: any;
            title: any;
            description: any;
            type: any;
            status: any;
        }[];
    }>;
    /**
     * Create a new product with prices
     */
    createProduct(input: CreateProductInput, createdBy: string): Promise<any>;
    /**
     * Update an existing product
     */
    updateProduct(id: string, input: UpdateProductInput, updatedBy: string): Promise<{
        id: any;
        name: any;
        description: any;
        product_type: any;
        active: any;
        work_id: any;
        content_grants: any;
        created_at: any;
        updated_at: any;
        prices: {
            id: any;
            currency: any;
            unit_amount: any;
            interval: any;
            nickname: any;
            trial_days: any;
            active: any;
        }[];
    }>;
    /**
     * Delete a product (soft delete by setting active = false)
     */
    deleteProduct(id: string, deletedBy: string): Promise<any>;
    /**
     * Get products by type with business logic
     */
    getProductsByType(productType: string, activeOnly?: boolean): Promise<{
        id: any;
        name: any;
        description: any;
        product_type: any;
        active: any;
        work_id: any;
        content_grants: any;
        created_at: any;
        updated_at: any;
        prices: {
            id: any;
            currency: any;
            unit_amount: any;
            interval: any;
            nickname: any;
            trial_days: any;
            active: any;
        }[];
    }[]>;
    /**
     * Validate product access permissions
     */
    validateProductAccess(productId: string, userId: string): Promise<boolean>;
    /**
     * Get recommended products based on user's purchase history
     */
    getRecommendedProducts(userId: string, limit?: number): Promise<{
        id: any;
        name: any;
        description: any;
        product_type: any;
        active: any;
        work_id: any;
        content_grants: any;
        created_at: any;
        updated_at: any;
        prices: {
            id: any;
            currency: any;
            unit_amount: any;
            interval: any;
            nickname: any;
            trial_days: any;
            active: any;
        }[];
    }[]>;
    /**
     * Validate pricing rules for a product
     */
    private validatePricingRules;
    /**
     * Update product availability based on work status
     */
    updateProductAvailability(workId: string, workStatus: string): Promise<void>;
    /**
     * Calculate product metrics and analytics
     */
    getProductAnalytics(productId: string, startDate?: string, endDate?: string): Promise<{
        sales: {
            totalSales: number;
            totalRevenue: number;
            averageOrderValue: number;
        };
        reviews: {
            totalReviews: number;
            averageRating: number;
        };
    }>;
}
//# sourceMappingURL=ProductService.d.ts.map