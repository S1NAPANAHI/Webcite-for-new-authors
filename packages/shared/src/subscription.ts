import { supabase } from './supabaseClient';
import { Tables } from './database.types';

export type Subscription = Tables<'subscriptions'>;

export const getSubscription = async (userId: string): Promise<Subscription | null> => {
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            if (error.code === 'PGRST116' || error.code === 'PGRST200') {
                // No subscription found or table doesn't exist
                return null;
            }
            console.error('Error fetching subscription:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error in getSubscription:', error);
        return null;
    }
};



