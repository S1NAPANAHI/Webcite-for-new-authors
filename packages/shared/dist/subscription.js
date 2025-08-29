import { supabase } from './supabaseClient';
export const getSubscription = async (userId) => {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (error) {
        console.error('Error fetching subscription:', error);
        return null;
    }
    return data;
};
