import { supabase } from './supabaseClient';
import { Tables } from './database.types';

export type Subscription = Tables<'subscriptions'>;

export const getSubscription = async (userId: string): Promise<Subscription | null> => {
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



