import { supabase } from './supabaseClient';

export interface UserStats {
  user_id: string;
  books_read: number;
  reading_hours: number;
  achievements: number;
  currently_reading: string;
}

export const initializeUserStats = async (userId: string): Promise<UserStats> => {
  const defaultStats: Omit<UserStats, 'user_id'> = {
    books_read: 0,
    reading_hours: 0,
    achievements: 0,
    currently_reading: 'None',
  };

  const { data, error } = await supabase
    .from('user_stats')
    .upsert(
      { user_id: userId, ...defaultStats },
      { onConflict: 'user_id' }
    )
    .select('*')
    .single();

  if (error) {
    console.error('Error initializing user stats:', error);
    throw error;
  }

  return data;
};

export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // If no row exists yet, initialize it
    if (!data && (!error || (error as any).code === 'PGRST116')) {
      return initializeUserStats(userId);
    }

    if (error) throw error;
    return data as UserStats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};
