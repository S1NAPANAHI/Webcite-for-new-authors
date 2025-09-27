import { supabase } from './supabaseClient';
import { Tables } from './database.types';

export type Subscription = Tables<'subscriptions'>;

// Enhanced subscription data that includes profile information
export interface EnhancedSubscription {
  id?: string;
  user_id: string;
  plan_id?: string;
  status: string;
  tier: 'free' | 'premium' | 'patron';
  current_period_start?: string;
  current_period_end?: string;
  trial_end?: string;
  cancel_at_period_end?: boolean;
  is_subscribed: boolean;
}

export const getSubscription = async (userId: string): Promise<EnhancedSubscription | null> => {
    try {
        console.log(`🔍 Fetching subscription for user: ${userId}`);
        
        // First, try to get from user profile (this has the most up-to-date info)
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select(`
                id, 
                subscription_status, 
                subscription_tier, 
                subscription_end_date,
                stripe_customer_id
            `)
            .eq('id', userId)
            .single();

        if (profileError) {
            console.error('Error fetching user profile:', profileError);
            
            // If profile fetch fails, return default inactive subscription
            return {
                user_id: userId,
                status: 'inactive',
                tier: 'free',
                is_subscribed: false
            };
        }

        const profile = profileData; // Corrected cast

        // Now try to get detailed subscription data from subscriptions table
        let detailedSubscription = null;
        
        try {
            const { data: subData, error: subError } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (!subError) {
                detailedSubscription = subData;
                console.log('✅ Found detailed subscription data');
            }
        } catch (e) {
            console.log('⚠️  Subscriptions table not available or empty, using profile data only');
        }

        // Determine if user is subscribed based on profile data
        const subscriptionStatus = profile.subscription_status || 'inactive';
        const tier = profile.subscription_tier || 'free';
        const isSubscribed = ['active', 'trialing'].includes(subscriptionStatus) || tier !== 'free';
        
        console.log(`📊 Subscription Status:`);
        console.log(`  - User ID: ${userId}`);
        console.log(`  - Status: ${subscriptionStatus}`);
        console.log(`  - Tier: ${tier}`);
        console.log(`  - Is Subscribed: ${isSubscribed}`);
        console.log(`  - End Date: ${profile.subscription_end_date}`);

        // Return enhanced subscription object
        const result: EnhancedSubscription = {
            user_id: userId,
            status: subscriptionStatus,
            tier: tier as 'free' | 'premium' | 'patron',
            current_period_end: profile.subscription_end_date,
            is_subscribed: isSubscribed,
            // Include detailed subscription data if available
            ...(detailedSubscription && {
                id: detailedSubscription.id,
                plan_id: detailedSubscription.plan_id,
                current_period_start: detailedSubscription.current_period_start,
                trial_end: detailedSubscription.trial_end,
                cancel_at_period_end: detailedSubscription.cancel_at_period_end,
            })
        };

        return result;

    } catch (error) {
        console.error('Unexpected error in getSubscription:', error);
        
        // Return safe default
        return {
            user_id: userId,
            status: 'inactive',
            tier: 'free',
            is_subscribed: false
        };
    }
};

/**
 * Check if user has access to premium content
 */
export const hasSubscriptionAccess = async (userId: string): Promise<boolean> => {
    const subscription = await getSubscription(userId);
    return subscription?.is_subscribed || false;
};

/**
 * Get user's subscription tier
 */
export const getSubscriptionTier = async (userId: string): Promise<'free' | 'premium' | 'patron'> => {
    const subscription = await getSubscription(userId);
    return subscription?.tier || 'free';
};

/**
 * Calculate days remaining until subscription expires
 */
export const getSubscriptionDaysRemaining = (endDate?: string): number | null => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

/**
 * Get subscription tier display information
 */
export const getSubscriptionTierInfo = (tier: string) => {
    switch(tier) {
        case 'premium':
            return {
                name: 'Premium',
                color: 'bg-blue-500',
                textColor: 'text-blue-400',
                price: '$9.99/month',
                description: 'Access to premium content and features'
            };
        case 'patron':
            return {
                name: 'Patron',
                color: 'bg-purple-500',
                textColor: 'text-purple-400',
                price: '$19.99/month',
                description: 'Full access plus exclusive patron benefits'
            };
        default:
            return {
                name: 'Free',
                color: 'bg-gray-500',
                textColor: 'text-gray-400',
                price: '$0/month',
                description: 'Access to free content and basic features'
            };
    }
};

/**
 * Format subscription status for display
 */
export const getSubscriptionStatusInfo = (subscription: EnhancedSubscription | null) => {
    if (!subscription || !subscription.is_subscribed) {
        return {
            displayStatus: 'Free Tier',
            color: 'text-gray-400',
            bgColor: 'bg-gray-500/10',
            isActive: false
        };
    }

    const statusMap = {
        'active': {
            displayStatus: 'Active',
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            isActive: true
        },
        'trialing': {
            displayStatus: 'Trial',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            isActive: true
        },
        'past_due': {
            displayStatus: 'Past Due',
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            isActive: false
        },
        'canceled': {
            displayStatus: 'Canceled',
            color: 'text-red-400',
            bgColor: 'bg-red-500/10',
            isActive: false
        },
        'incomplete': {
            displayStatus: 'Incomplete',
            color: 'text-orange-400',
            bgColor: 'bg-orange-500/10',
            isActive: false
        },
        'incomplete_expired': {
            displayStatus: 'Expired',
            color: 'text-red-400',
            bgColor: 'bg-red-500/10',
            isActive: false
        }
    };

    return statusMap[subscription.status as keyof typeof statusMap] || statusMap['canceled'];
};

/**
 * Force refresh subscription status from backend
 */
export const refreshSubscriptionStatus = async (userId: string): Promise<boolean> => {
    try {
        const API_BASE = import.meta.env['VITE_API_URL'] || 'http://localhost:3001';
        const token = localStorage.getItem('supabase.auth.token') || 
                     sessionStorage.getItem('supabase.auth.token');
        
        if (!token) {
            console.error('No auth token found for refresh');
            return false;
        }

        const response = await fetch(`${API_BASE}/api/subscription/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId })
        });

        if (!response.ok) {
            console.error('Failed to refresh subscription status');
            return false;
        }

        const result = await response.json();
        console.log('✅ Subscription refreshed:', result);
        return result.updated || false;
        
    } catch (error) {
        console.error('Error refreshing subscription status:', error);
        return false;
    }
};