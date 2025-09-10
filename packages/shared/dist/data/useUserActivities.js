import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
export const useUserActivities = (userId) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchActivities = useCallback(async () => {
        setLoading(true);
        setError(null);
        if (!userId) {
            setActivities([]);
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('user_activities')
                .select('*')
                .eq('user_id', userId)
                .order('timestamp', { ascending: false })
                .limit(5);
            if (error) {
                throw error;
            }
            setActivities(data || []);
        }
        catch (err) {
            console.error('Error fetching user activities:', err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [userId]);
    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);
    return { activities, loading, error };
};
//# sourceMappingURL=useUserActivities.js.map