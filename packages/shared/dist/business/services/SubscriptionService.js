import { CreateSubscriptionSchema, UpdateSubscriptionSchema, SubscriptionQuerySchema, validateSubscriptionBusinessRules } from '../validators/payment.validator';
import { ResourceNotFoundError, ValidationError, BusinessRuleError, DatabaseError } from '../errors';
export class SubscriptionService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    /**
     * Get all subscriptions with filtering and pagination
     */
    async getSubscriptions(query) {
        try {
            const validatedQuery = SubscriptionQuerySchema.parse(query);
            let supabaseQuery = this.supabase
                .from('subscriptions')
                .select(`
          id, user_id, plan_id, status, current_period_start, current_period_end,
          trial_start, trial_end, cancel_at_period_end, metadata, created_at, updated_at,
          profiles:profiles(id, display_name, username),
          prices:prices(id, currency, unit_amount, interval, nickname)
        `);
            // Apply filters
            if (validatedQuery.status) {
                supabaseQuery = supabaseQuery.eq('status', validatedQuery.status);
            }
            if (validatedQuery.user_id) {
                supabaseQuery = supabaseQuery.eq('user_id', validatedQuery.user_id);
            }
            if (validatedQuery.plan_id) {
                supabaseQuery = supabaseQuery.eq('plan_id', validatedQuery.plan_id);
            }
            // Apply sorting
            const ascending = validatedQuery.sort_order === 'asc';
            supabaseQuery = supabaseQuery.order(validatedQuery.sort_by, { ascending });
            // Apply pagination
            supabaseQuery = supabaseQuery.range(validatedQuery.offset, validatedQuery.offset + validatedQuery.limit - 1);
            const { data: subscriptions, error, count } = await supabaseQuery;
            if (error) {
                throw new DatabaseError('Failed to fetch subscriptions', { supabaseError: error });
            }
            return {
                subscriptions: subscriptions || [],
                pagination: {
                    limit: validatedQuery.limit,
                    offset: validatedQuery.offset,
                    total: count || 0
                }
            };
        }
        catch (error) {
            if (error instanceof ValidationError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while fetching subscriptions');
        }
    }
    /**
     * Get subscription by ID
     */
    async getSubscriptionById(id) {
        try {
            const { data: subscription, error } = await this.supabase
                .from('subscriptions')
                .select(`
          id, user_id, plan_id, status, current_period_start, current_period_end,
          trial_start, trial_end, cancel_at_period_end, metadata, created_at, updated_at,
          profiles:profiles(id, display_name, username, role),
          prices:prices(id, currency, unit_amount, interval, nickname, trial_days)
        `)
                .eq('id', id)
                .single();
            if (error && error.code === 'PGRST116') {
                throw new ResourceNotFoundError('Subscription', id);
            }
            if (error) {
                throw new DatabaseError('Failed to fetch subscription', { supabaseError: error });
            }
            return subscription;
        }
        catch (error) {
            if (error instanceof ResourceNotFoundError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while fetching subscription');
        }
    }
    /**
     * Create a new subscription with business rule validation
     */
    async createSubscription(input, createdBy) {
        try {
            // Validate input
            const validatedInput = CreateSubscriptionSchema.parse(input);
            // Validate business rules
            const businessValidation = validateSubscriptionBusinessRules(validatedInput);
            if (!businessValidation.isValid) {
                throw new BusinessRuleError('Subscription validation failed', {
                    violations: businessValidation.errors
                });
            }
            // Check if user already has an active subscription for this plan
            const existingSubscription = await this.getUserActiveSubscription(validatedInput.user_id, validatedInput.plan_id);
            if (existingSubscription) {
                throw new BusinessRuleError('User already has an active subscription for this plan');
            }
            // Validate plan exists and is active
            const { data: plan, error: planError } = await this.supabase
                .from('prices')
                .select('id, product_id, active, products(active)')
                .eq('id', validatedInput.plan_id)
                .single();
            if (planError || !plan) {
                throw new BusinessRuleError('Invalid plan ID');
            }
            if (!plan.active || !plan.products?.active) {
                throw new BusinessRuleError('Plan is not available for subscription');
            }
            // Check subscription limits for user
            await this.validateSubscriptionLimits(validatedInput.user_id);
            // Create subscription
            const { data: subscription, error } = await this.supabase
                .from('subscriptions')
                .insert({
                ...validatedInput,
                created_at: new Date().toISOString()
            })
                .select()
                .single();
            if (error) {
                throw new DatabaseError('Failed to create subscription', { supabaseError: error });
            }
            // Grant entitlements if subscription is active
            if (subscription.status === 'active') {
                await this.grantSubscriptionEntitlements(subscription.id, subscription.user_id, subscription.plan_id);
            }
            return subscription;
        }
        catch (error) {
            if (error instanceof ValidationError || error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while creating subscription');
        }
    }
    /**
     * Update subscription with business rule validation
     */
    async updateSubscription(id, input, updatedBy) {
        try {
            // Check if subscription exists
            const existingSubscription = await this.getSubscriptionById(id);
            // Validate input
            const validatedInput = UpdateSubscriptionSchema.parse(input);
            // Validate business rules
            const mergedSubscription = { ...existingSubscription, ...validatedInput };
            const businessValidation = validateSubscriptionBusinessRules(mergedSubscription);
            if (!businessValidation.isValid) {
                throw new BusinessRuleError('Subscription validation failed', {
                    violations: businessValidation.errors
                });
            }
            // Handle status changes with business logic
            if (validatedInput.status && validatedInput.status !== existingSubscription.status) {
                await this.handleStatusChange(existingSubscription, validatedInput.status);
            }
            const { data: subscription, error } = await this.supabase
                .from('subscriptions')
                .update({
                ...validatedInput,
                updated_at: new Date().toISOString()
            })
                .eq('id', id)
                .select(`
          id, user_id, plan_id, status, current_period_start, current_period_end,
          trial_start, trial_end, cancel_at_period_end, metadata, created_at, updated_at
        `)
                .single();
            if (error) {
                throw new DatabaseError('Failed to update subscription', { supabaseError: error });
            }
            return subscription;
        }
        catch (error) {
            if (error instanceof ResourceNotFoundError || error instanceof ValidationError ||
                error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while updating subscription');
        }
    }
    /**
     * Cancel subscription with business rules
     */
    async cancelSubscription(id, cancelAtPeriodEnd = true, canceledBy, reason) {
        try {
            const subscription = await this.getSubscriptionById(id);
            // Business rule: Can't cancel already canceled subscriptions
            if (subscription.status === 'canceled') {
                throw new BusinessRuleError('Subscription is already canceled');
            }
            // Business rule: Can't cancel incomplete subscriptions
            if (subscription.status === 'incomplete' || subscription.status === 'incomplete_expired') {
                throw new BusinessRuleError('Cannot cancel incomplete subscriptions');
            }
            const updateData = {
                cancel_at_period_end: cancelAtPeriodEnd,
                updated_at: new Date().toISOString()
            };
            // If immediate cancellation, update status
            if (!cancelAtPeriodEnd) {
                updateData.status = 'canceled';
                // Revoke entitlements immediately
                await this.revokeSubscriptionEntitlements(subscription.id, subscription.user_id);
            }
            // Add cancellation metadata
            updateData.metadata = {
                ...subscription.metadata,
                cancellation: {
                    canceled_by: canceledBy,
                    canceled_at: new Date().toISOString(),
                    reason: reason || 'user_requested',
                    cancel_at_period_end: cancelAtPeriodEnd
                }
            };
            const { data: updatedSubscription, error } = await this.supabase
                .from('subscriptions')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            if (error) {
                throw new DatabaseError('Failed to cancel subscription', { supabaseError: error });
            }
            return updatedSubscription;
        }
        catch (error) {
            if (error instanceof ResourceNotFoundError || error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while canceling subscription');
        }
    }
    /**
     * Reactivate a canceled subscription
     */
    async reactivateSubscription(id, reactivatedBy) {
        try {
            const subscription = await this.getSubscriptionById(id);
            // Business rule: Can only reactivate canceled subscriptions that haven't expired
            if (subscription.status !== 'canceled' && !subscription.cancel_at_period_end) {
                throw new BusinessRuleError('Can only reactivate canceled subscriptions');
            }
            // Check if current period hasn't expired
            if (subscription.current_period_end && new Date(subscription.current_period_end) < new Date()) {
                throw new BusinessRuleError('Cannot reactivate expired subscription');
            }
            const updateData = {
                cancel_at_period_end: false,
                status: 'active',
                updated_at: new Date().toISOString(),
                metadata: {
                    ...subscription.metadata,
                    reactivation: {
                        reactivated_by: reactivatedBy,
                        reactivated_at: new Date().toISOString()
                    }
                }
            };
            const { data: updatedSubscription, error } = await this.supabase
                .from('subscriptions')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            if (error) {
                throw new DatabaseError('Failed to reactivate subscription', { supabaseError: error });
            }
            // Grant entitlements back
            await this.grantSubscriptionEntitlements(subscription.id, subscription.user_id, subscription.plan_id);
            return updatedSubscription;
        }
        catch (error) {
            if (error instanceof ResourceNotFoundError || error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while reactivating subscription');
        }
    }
    /**
     * Get user's active subscription
     */
    async getUserActiveSubscription(userId, planId) {
        try {
            let query = this.supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'active');
            if (planId) {
                query = query.eq('plan_id', planId);
            }
            const { data: subscription, error } = await query.single();
            if (error && error.code !== 'PGRST116') {
                throw new DatabaseError('Failed to check existing subscription');
            }
            return subscription;
        }
        catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            return null;
        }
    }
    /**
     * Validate subscription limits for user
     */
    async validateSubscriptionLimits(userId) {
        try {
            // Business rule: Users can only have 5 active subscriptions max
            const { data: activeSubscriptions, error } = await this.supabase
                .from('subscriptions')
                .select('id')
                .eq('user_id', userId)
                .in('status', ['active', 'trialing'])
                .limit(6); // Check for 6 to see if limit exceeded
            if (error) {
                throw new DatabaseError('Failed to check subscription limits');
            }
            if (activeSubscriptions && activeSubscriptions.length >= 5) {
                throw new BusinessRuleError('User has reached maximum subscription limit (5 active subscriptions)');
            }
            // Check user role limitations
            const { data: profile, error: profileError } = await this.supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();
            if (profileError) {
                throw new DatabaseError('Failed to fetch user profile');
            }
            // Business rule: Basic users limited to 2 active subscriptions
            if (profile.role === 'user' && activeSubscriptions && activeSubscriptions.length >= 2) {
                throw new BusinessRuleError('Basic users are limited to 2 active subscriptions');
            }
        }
        catch (error) {
            if (error instanceof BusinessRuleError || error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while validating subscription limits');
        }
    }
    /**
     * Handle subscription status changes
     */
    async handleStatusChange(subscription, newStatus) {
        try {
            const oldStatus = subscription.status;
            // Grant entitlements when becoming active
            if (newStatus === 'active' && oldStatus !== 'active') {
                await this.grantSubscriptionEntitlements(subscription.id, subscription.user_id, subscription.plan_id);
            }
            // Revoke entitlements when becoming inactive
            if (oldStatus === 'active' && !['active', 'trialing'].includes(newStatus)) {
                await this.revokeSubscriptionEntitlements(subscription.id, subscription.user_id);
            }
            // Send notification emails for status changes
            await this.sendStatusChangeNotification(subscription, oldStatus, newStatus);
        }
        catch (error) {
            console.error('Error handling subscription status change:', error);
            // Don't throw here as it's ancillary to the main operation
        }
    }
    /**
     * Grant entitlements for active subscription
     */
    async grantSubscriptionEntitlements(subscriptionId, userId, planId) {
        try {
            // Get plan details
            const { data: plan, error: planError } = await this.supabase
                .from('prices')
                .select('product_id, products(product_type, content_grants)')
                .eq('id', planId)
                .single();
            if (planError || !plan) {
                console.error('Failed to fetch plan for entitlement granting:', planError);
                return;
            }
            const productType = plan.products?.[0]?.product_type;
            const contentGrants = plan.products?.[0]?.content_grants;
            if (!contentGrants) {
                console.warn('No content grants defined for subscription plan');
                return;
            }
            // Grant entitlements based on content grants
            for (const grant of contentGrants.grants || []) {
                const { data: entitlement, error: entitlementError } = await this.supabase
                    .from('entitlements')
                    .insert({
                    user_id: userId,
                    scope: grant.scope,
                    source: `subscription:${subscriptionId}`,
                    starts_at: new Date().toISOString(),
                    ends_at: null, // Subscription entitlements don't expire unless subscription ends
                    created_by: 'system'
                })
                    .select()
                    .single();
                if (entitlementError) {
                    console.error('Failed to grant entitlement:', entitlementError);
                }
            }
            console.log(`✅ Granted entitlements for subscription ${subscriptionId} to user ${userId}`);
        }
        catch (error) {
            console.error('Error granting subscription entitlements:', error);
        }
    }
    /**
     * Revoke entitlements for inactive subscription
     */
    async revokeSubscriptionEntitlements(subscriptionId, userId) {
        try {
            const { error } = await this.supabase
                .from('entitlements')
                .delete()
                .eq('user_id', userId)
                .eq('source', `subscription:${subscriptionId}`);
            if (error) {
                console.error('Failed to revoke entitlements:', error);
            }
            else {
                console.log(`✅ Revoked entitlements for subscription ${subscriptionId} from user ${userId}`);
            }
        }
        catch (error) {
            console.error('Error revoking subscription entitlements:', error);
        }
    }
    /**
     * Send status change notification
     */
    async sendStatusChangeNotification(subscription, oldStatus, newStatus) {
        try {
            // Import email service (would need to be implemented)
            // const { sendSubscriptionEmail } = require('../../services/emailService');
            const notificationMap = {
                'active': 'subscription_activated',
                'canceled': 'subscription_canceled',
                'past_due': 'payment_failed',
                'trialing': 'trial_started'
            };
            const emailType = notificationMap[newStatus];
            if (emailType) {
                // Send email notification
                console.log(`📧 Should send ${emailType} email for subscription ${subscription.id}`);
            }
        }
        catch (error) {
            console.error('Error sending status change notification:', error);
        }
    }
    /**
     * Get subscription analytics
     */
    async getSubscriptionAnalytics(startDate, endDate) {
        try {
            const dateFilter = startDate && endDate
                ? { gte: startDate, lte: endDate }
                : {};
            // Total subscriptions by status
            const { data: statusCounts, error: statusError } = await this.supabase
                .from('subscriptions')
                .select('status')
                .gte('created_at', startDate || '2020-01-01')
                .lte('created_at', endDate || new Date().toISOString());
            if (statusError) {
                throw new DatabaseError('Failed to fetch subscription status data');
            }
            const statusBreakdown = statusCounts?.reduce((acc, sub) => {
                acc[sub.status] = (acc[sub.status] || 0) + 1;
                return acc;
            }, {}) || {};
            // Calculate MRR (Monthly Recurring Revenue)
            const { data: mrrData, error: mrrError } = await this.supabase
                .from('subscriptions')
                .select(`
          prices:prices(unit_amount, currency, interval)
        `)
                .eq('status', 'active');
            if (mrrError) {
                throw new DatabaseError('Failed to fetch MRR data');
            }
            const mrr = mrrData?.reduce((total, sub) => {
                const price = sub.prices;
                if (price && price[0]?.interval === 'month') {
                    return total + price[0].unit_amount;
                }
                if (price && price[0]?.interval === 'year') {
                    return total + (price[0].unit_amount / 12); // Convert annual to monthly
                }
                return total;
            }, 0) || 0;
            // Calculate churn rate
            const { data: churnData, error: churnError } = await this.supabase
                .from('subscriptions')
                .select('status, updated_at')
                .eq('status', 'canceled')
                .gte('updated_at', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
            const churnCount = churnData?.length || 0;
            const activeCount = statusBreakdown.active || 0;
            const churnRate = activeCount > 0 ? (churnCount / (activeCount + churnCount)) * 100 : 0;
            return {
                overview: {
                    totalSubscriptions: statusCounts?.length || 0,
                    activeSubscriptions: statusBreakdown.active || 0,
                    trialingSubscriptions: statusBreakdown.trialing || 0,
                    canceledSubscriptions: statusBreakdown.canceled || 0,
                    pastDueSubscriptions: statusBreakdown.past_due || 0
                },
                revenue: {
                    monthlyRecurringRevenue: mrr,
                    churnRate: Math.round(churnRate * 100) / 100
                },
                statusBreakdown
            };
        }
        catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while calculating subscription analytics');
        }
    }
    /**
     * Get subscription health metrics for a user
     */
    async getUserSubscriptionHealth(userId) {
        try {
            const { data: subscriptions, error } = await this.supabase
                .from('subscriptions')
                .select(`
          id, status, current_period_end, cancel_at_period_end,
          prices:prices(unit_amount, currency, interval)
        `)
                .eq('user_id', userId);
            if (error) {
                throw new DatabaseError('Failed to fetch user subscriptions');
            }
            const activeSubscriptions = subscriptions?.filter(s => s.status === 'active') || [];
            const expiringSoon = activeSubscriptions.filter(s => {
                if (!s.current_period_end)
                    return false;
                const endDate = new Date(s.current_period_end);
                const now = new Date();
                const daysUntilExpiry = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                return daysUntilExpiry <= 7; // Expiring within 7 days
            });
            const pendingCancellations = activeSubscriptions.filter(s => s.cancel_at_period_end);
            const totalMonthlyValue = activeSubscriptions.reduce((total, sub) => {
                const price = sub.prices;
                if (price?.[0]?.interval === 'month') {
                    return total + (price[0].unit_amount || 0);
                }
                if (price?.[0]?.interval === 'year') {
                    return total + ((price[0].unit_amount || 0) / 12);
                }
                return total;
            }, 0);
            return {
                activeCount: activeSubscriptions.length,
                expiringSoonCount: expiringSoon.length,
                pendingCancellationsCount: pendingCancellations.length,
                totalMonthlyValue,
                healthScore: this.calculateHealthScore(activeSubscriptions.length, expiringSoon.length, pendingCancellations.length)
            };
        }
        catch (error) {
            if (error instanceof DatabaseError) {
                throw error;
            }
            throw new DatabaseError('Unexpected error while fetching subscription health');
        }
    }
    /**
     * Calculate subscription health score (0-100)
     */
    calculateHealthScore(active, expiring, canceling) {
        if (active === 0)
            return 0;
        const baseScore = 100;
        const expiringPenalty = (expiring / active) * 30;
        const cancelingPenalty = (canceling / active) * 50;
        return Math.max(0, Math.round(baseScore - expiringPenalty - cancelingPenalty));
    }
}
