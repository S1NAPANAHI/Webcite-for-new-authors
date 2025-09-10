import { Database } from '../../database.types';
type ProductType = Database['public']['Enums']['product_type'];
type UserRole = Database['public']['Enums']['user_role'];
type SubscriptionStatus = Database['public']['Enums']['subscription_status'];
/**
 * Centralized business rules engine
 */
export declare class BusinessRulesEngine {
    /**
     * Subscription Rules
     */
    static subscription: {
        /**
         * Maximum subscriptions per user based on role
         */
        getMaxSubscriptionsForRole(role: UserRole): number;
        /**
         * Can user subscribe to this product type
         */
        canSubscribeToProductType(userRole: UserRole, productType: ProductType): boolean;
        /**
         * Minimum subscription duration
         */
        getMinimumSubscriptionDuration(productType: ProductType): number;
        /**
         * Can cancel subscription immediately
         */
        canCancelImmediately(subscriptionStatus: SubscriptionStatus, daysSinceStart: number): boolean;
    };
    /**
     * Pricing Rules
     */
    static pricing: {
        /**
         * Minimum price for product type
         */
        getMinimumPrice(productType: ProductType): number;
        /**
         * Maximum price for product type
         */
        getMaximumPrice(productType: ProductType): number;
        /**
         * Valid currencies for region
         */
        getValidCurrencies(region?: string): string[];
        /**
         * Calculate discount limits
         */
        getMaxDiscountPercentage(userRole: UserRole): number;
    };
    /**
     * Content Access Rules
     */
    static content: {
        /**
         * Can user access this content type
         */
        canAccessContent(userRole: UserRole, contentType: string, subscriptionStatus?: string): boolean;
        /**
         * Download limits per user role
         */
        getDownloadLimits(userRole: UserRole): {
            daily: number;
            concurrent: number;
        };
        /**
         * Can user preview content
         */
        canPreviewContent(userRole: UserRole, productType: ProductType): boolean;
    };
    /**
     * User Management Rules
     */
    static user: {
        /**
         * Can user perform this action
         */
        canPerformAction(userRole: UserRole, action: string, targetUserRole?: UserRole): boolean;
        /**
         * Username validation rules
         */
        validateUsername(username: string): {
            isValid: boolean;
            errors: string[];
        };
        /**
         * Profile completeness requirements
         */
        getProfileCompletenessRequirements(_userRole: UserRole): string[];
    };
    /**
     * Beta Program Rules
     */
    static beta: {
        /**
         * Application scoring criteria
         */
        calculateApplicationScore(application: any): number;
        /**
         * Minimum score for approval
         */
        getMinimumApprovalScore(): number;
        /**
         * Can apply for beta program
         */
        canApplyForBeta(_userRole: UserRole, betaStatus: string): boolean;
    };
    /**
     * Validate multiple business rules at once
     */
    static validateRules(rules: Array<() => boolean>, errorMessage: string): void;
}
export {};
//# sourceMappingURL=index.d.ts.map