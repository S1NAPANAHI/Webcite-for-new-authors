import { supabase } from './supabaseClient';
export const getProfile = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, user_stats(*)') // Select all from profiles and join user_stats
            .eq('id', userId)
            .maybeSingle();
        if (error)
            throw error;
        // Flatten the user_stats object into the UserProfile
        return data;
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};
