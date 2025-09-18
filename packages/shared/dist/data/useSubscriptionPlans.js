import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
export const useSubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchPlans = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('subscription_plans')
                .select('*')
                .eq('is_active', true)
                .order('sort_order');
            if (error) {
                throw error;
            }
            setPlans(data || []);
        }
        catch (err) {
            console.error('Error fetching subscription plans:', err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);
    return { plans, loading, error };
};
//# sourceMappingURL=useSubscriptionPlans.js.map