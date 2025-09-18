import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
export const useBetaApplication = (user) => {
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchApplication = useCallback(async () => {
        setLoading(true);
        setError(null);
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('beta_applications')
                .select('*')
                .eq('user_id', user.id)
                .single();
            if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
                throw error;
            }
            setApplicationStatus(data || null);
        }
        catch (err) {
            console.error('Error fetching beta application:', err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [user]);
    useEffect(() => {
        fetchApplication();
    }, [fetchApplication]);
    const submitApplication = useCallback(async (applicationToSave) => {
        setError(null);
        try {
            const { error } = await supabase
                .from('beta_applications')
                .insert([applicationToSave]);
            if (error) {
                throw error;
            }
            // Re-fetch application status after submission
            await fetchApplication();
            return true;
        }
        catch (err) {
            console.error('Error saving beta application:', err);
            setError(err.message);
            return false;
        }
    }, [fetchApplication]);
    return {
        applicationStatus,
        loading,
        error,
        submitApplication,
        fetchApplication, // Expose fetch function for manual refresh if needed
    };
};
//# sourceMappingURL=useBetaApplication.js.map