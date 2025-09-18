import { useState } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const signIn = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error)
                throw error;
            return { success: true };
        }
        catch (err) {
            setError(err);
            return { success: false, error: err };
        }
        finally {
            setLoading(false);
        }
    };
    const signUp = async (email, password, displayName) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: displayName,
                    },
                },
            });
            if (error)
                throw error;
            return { success: true };
        }
        catch (err) {
            setError(err);
            return { success: false, error: err };
        }
        finally {
            setLoading(false);
        }
    };
    return { signIn, signUp, loading, error };
};
//# sourceMappingURL=useAuth.js.map