import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
export const useSubscriptionStatus = (userId) => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchSubscription = useCallback(async () => {
        setLoading(true);
        setError(null);
        if (!userId) {
            setSubscription(null);
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .in('status', ['active', 'trialing'])
                .single();
            if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
                throw error;
            }
            setSubscription(data || null);
        }
        catch (err) {
            console.error('Error fetching subscription:', err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [userId]);
    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);
    return { subscription, loading, error };
};
//# sourceMappingURL=useSubscriptionStatus.js.map