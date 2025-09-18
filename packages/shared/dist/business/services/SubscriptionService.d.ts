import { SupabaseClient } from '@supabase/supabase-js';
import { CreateSubscriptionInput, UpdateSubscriptionInput, SubscriptionQuery } from '../validators/payment.validator';
export declare class SubscriptionService {
    private supabase;
    constructor(supabase: SupabaseClient);
    /**
     * Get all subscriptions with filtering and pagination
     */
    getSubscriptions(query: SubscriptionQuery): Promise<{
        subscriptions: {
            id: any;
            user_id: any;
            plan_id: any;
            status: any;
            current_period_start: any;
            current_period_end: any;
            trial_start: any;
            trial_end: any;
            cancel_at_period_end: any;
            metadata: any;
            created_at: any;
            updated_at: any;
            profiles: {
                id: any;
                display_name: any;
                username: any;
            }[];
            prices: {
                id: any;
                currency: any;
                unit_amount: any;
                interval: any;
                nickname: any;
            }[];
        }[];
        pagination: {
            limit: number;
            offset: number;
            total: number;
        };
    }>;
    /**
     * Get subscription by ID
     */
    getSubscriptionById(id: string): Promise<{
        id: any;
        user_id: any;
        plan_id: any;
        status: any;
        current_period_start: any;
        current_period_end: any;
        trial_start: any;
        trial_end: any;
        cancel_at_period_end: any;
        metadata: any;
        created_at: any;
        updated_at: any;
        profiles: {
            id: any;
            display_name: any;
            username: any;
            role: any;
        }[];
        prices: {
            id: any;
            currency: any;
            unit_amount: any;
            interval: any;
            nickname: any;
            trial_days: any;
        }[];
    }>;
    /**
     * Create a new subscription with business rule validation
     */
    createSubscription(input: CreateSubscriptionInput, _createdBy: string): Promise<any>;
    /**
     * Update subscription with business rule validation
     */
    updateSubscription(id: string, input: UpdateSubscriptionInput, _updatedBy: string): Promise<{
        id: any;
        user_id: any;
        plan_id: any;
        status: any;
        current_period_start: any;
        current_period_end: any;
        trial_start: any;
        trial_end: any;
        cancel_at_period_end: any;
        metadata: any;
        created_at: any;
        updated_at: any;
    }>;
    /**
     * Cancel subscription with business rules
     */
    cancelSubscription(id: string, cancelAtPeriodEnd: boolean | undefined, canceledBy: string, reason?: string): Promise<any>;
    /**
     * Reactivate a canceled subscription
     */
    reactivateSubscription(id: string, reactivatedBy: string): Promise<any>;
    /**
     * Get user's active subscription
     */
    private getUserActiveSubscription;
    /**
     * Validate subscription limits for user
     */
    private validateSubscriptionLimits;
    /**
     * Handle subscription status changes
     */
    private handleStatusChange;
    /**
     * Grant entitlements for active subscription
     */
    private grantSubscriptionEntitlements;
    /**
     * Revoke entitlements for inactive subscription
     */
    private revokeSubscriptionEntitlements;
    /**
     * Send status change notification
     */
    private sendStatusChangeNotification;
    /**
     * Get subscription analytics
     */
    getSubscriptionAnalytics(startDate?: string, endDate?: string): Promise<{
        overview: {
            totalSubscriptions: number;
            activeSubscriptions: any;
            trialingSubscriptions: any;
            canceledSubscriptions: any;
            pastDueSubscriptions: any;
        };
        revenue: {
            monthlyRecurringRevenue: number;
            churnRate: number;
        };
        statusBreakdown: any;
    }>;
    /**
     * Get subscription health metrics for a user
     */
    getUserSubscriptionHealth(userId: string): Promise<{
        activeCount: number;
        expiringSoonCount: number;
        pendingCancellationsCount: number;
        totalMonthlyValue: number;
        healthScore: number;
    }>;
    /**
     * Calculate subscription health score (0-100)
     */
    private calculateHealthScore;
}
//# sourceMappingURL=SubscriptionService.d.ts.map