import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
export const useUserSubscription = () => {
    const { user } = useAuth();
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchSubscription = useCallback(async () => {
        setLoading(true);
        setError(null);
        if (!user) {
            setCurrentSubscription(null);
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .in('status', ['active', 'trialing'])
                .maybeSingle();
            if (error) {
                throw error;
            }
            setCurrentSubscription(data);
        }
        catch (err) {
            console.error('Error fetching user subscription:', err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [user]);
    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);
    return { currentSubscription, loading, error, fetchSubscription };
};
//# sourceMappingURL=useUserSubscription.js.map