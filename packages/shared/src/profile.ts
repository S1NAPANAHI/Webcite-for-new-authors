import { supabase } from './supabaseClient';
import { Tables } from './database.types';

export type UserProfile = Tables<'profiles'> & {
  books_read?: number;
  currently_reading?: string;
  reading_hours?: number;
  reading_streak?: number;
  achievements?: number;
};


export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_stats(*)') // Select all from profiles and join user_stats
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;

    // Flatten the user_stats object into the UserProfile
    if (data && data.user_stats) {
      return { ...data, ...data.user_stats } as UserProfile;
    }
    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
