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
        const { data: profile, error: profileError } = await supabase
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
            
            // Fallback: try to get from users table if profiles doesn't exist
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select(`
                    id, 
                    subscription_status, 
                    subscription_tier, 
                    subscription_end_date,
                    stripe_customer_id
                `)
                .eq('id', userId)
                .single();
                
            if (userError) {
                console.error('Error fetching from users table too:', userError);
                return {
                    user_id: userId,
                    status: 'inactive',
                    tier: 'free',
                    is_subscribed: false
                };
            }
            
            // Use users table data
            const isSubscribed = ['active', 'trialing'].includes(userData.subscription_status);
            
            return {
                user_id: userId,
                status: userData.subscription_status || 'inactive',
                tier: userData.subscription_tier || 'free',
                current_period_end: userData.subscription_end_date,
                is_subscribed: isSubscribed
            };
        }

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
 * Force refresh subscription status from backend
 */
export const refreshSubscriptionStatus = async (userId: string): Promise<boolean> => {
    try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
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