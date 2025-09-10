import { useState } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
export const useProfileUpdate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const updateProfile = async (userId, updates) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const { data, error } = await supabase
                .from('profiles') // Assuming 'profiles' is your table name
                .update(updates)
                .eq('id', userId);
            if (error)
                throw error;
            setSuccess('Profile updated successfully!');
            return { success: true, data };
        }
        catch (err) {
            setError(err.message || 'Failed to update profile');
            return { success: false, error: err.message };
        }
        finally {
            setLoading(false);
        }
    };
    // Function to fetch profile data (optional, but good for pre-filling forms)
    const fetchProfile = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, bio, location, website') // Select specific fields
                .eq('id', userId)
                .single();
            if (error)
                throw error;
            return { success: true, data };
        }
        catch (err) {
            setError(err.message || 'Failed to fetch profile');
            return { success: false, error: err.message };
        }
        finally {
            setLoading(false);
        }
    };
    return { updateProfile, fetchProfile, loading, error, success };
};
//# sourceMappingURL=useProfileUpdate.js.map