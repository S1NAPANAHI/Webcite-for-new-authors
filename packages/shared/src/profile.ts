import { supabase } from './supabaseClient';
import { Database } from './database.types';

export type UserProfile = {
  avatar_url: string | null;
  beta_reader_status: string;
  created_at: string;
  display_name: string | null;
  id: string;
  role: string;
  updated_at: string;
  username: string | null;
  website: string | null;
  // Additional fields from user_stats
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
    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
