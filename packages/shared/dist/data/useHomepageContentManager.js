import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
export const useHomepageContentManager = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const createContent = useCallback(async (contentData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const { error } = await supabase
                .from('homepage_content')
                .insert([contentData]);
            if (error) {
                throw error;
            }
            setSuccess(true);
            return true;
        }
        catch (err) {
            console.error('Error creating homepage content:', err);
            setError(err.message);
            setSuccess(false);
            return false;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return {
        createContent,
        loading,
        error,
        success,
    };
};
//# sourceMappingURL=useHomepageContentManager.js.map