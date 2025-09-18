import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
export const useUserStats = (userId) => {
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchUserStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        if (!userId) {
            setUserStats(null);
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_id', userId)
                .single();
            if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
                throw error;
            }
            setUserStats(data || null);
        }
        catch (err) {
            console.error('Error fetching user stats:', err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [userId]);
    useEffect(() => {
        fetchUserStats();
    }, [fetchUserStats]);
    return { userStats, loading, error };
};
//# sourceMappingURL=useUserStats.js.map