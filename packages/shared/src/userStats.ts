import { supabase } from './supabaseClient';

// Define the database schema interface
interface UserStatsDB {
  user_id: string;
  books_read?: number;
  reading_hours?: number;
  achievements?: number;
  currently_reading?: string;
  created_at?: string;
  updated_at?: string;
  // Additional fields that might exist in the database
  achievements_unlocked?: number;
  chapters_read?: number;
  current_streak_days?: number;
  last_activity_date?: string | null;
  level_reached?: number;
  total_reading_minutes?: number;
}

// Define the application interface
export type UserStats = {
  user_id: string;
  books_read: number;
  reading_hours: number;
  achievements: number;
  currently_reading: string;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown; // Allow additional properties
};

// Type for database insert/update operations
interface UserStatsInsert {
  user_id: string;
  books_read?: number;
  reading_hours?: number;
  achievements?: number;
  currently_reading?: string;
  created_at?: string;
  updated_at?: string;
  achievements_unlocked?: number;
  chapters_read?: number;
  current_streak_days?: number;
  last_activity_date?: string | null;
  level_reached?: number;
  total_reading_minutes?: number;
}

// Cache for user stats to reduce database calls
const statsCache = new Map<string, UserStats>();

/**
 * Creates default stats for a new user
 */
const createDefaultStats = (userId: string): UserStats => ({
  user_id: userId,
  books_read: 0,
  reading_hours: 0,
  achievements: 0,
  currently_reading: 'None'
});

/**
 * Converts database user stats to application user stats
 */
const mapDbToAppStats = (dbStats: UserStatsDB | null, userId: string): UserStats => {
  if (!dbStats) {
    return createDefaultStats(userId);
  }

  const result: UserStats = {
    user_id: dbStats.user_id || userId,
    books_read: dbStats.books_read ?? 0,
    reading_hours: dbStats.reading_hours ?? 0,
    achievements: dbStats.achievements ?? dbStats.achievements_unlocked ?? 0,
    currently_reading: dbStats.currently_reading ?? 'None'
  };

  // Only include defined optional fields
  if (dbStats.created_at !== undefined && dbStats.created_at !== null) {
    result.created_at = dbStats.created_at;
  }
  if (dbStats.updated_at !== undefined && dbStats.updated_at !== null) {
    result.updated_at = dbStats.updated_at;
  }

  return result;
};

/**
 * Safely gets user stats, falling back to default values if needed
 */
export const getUserStats = async (userId: string): Promise<UserStats> => {
  // Return cached stats if available
  if (statsCache.has(userId)) {
    return statsCache.get(userId)!;
  }

  try {
    // Try to get stats from the database
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // If we got data, cache and return it
    if (data) {
      const stats = mapDbToAppStats(data as UserStatsDB, userId);
      statsCache.set(userId, stats);
      return stats;
    }

    // Handle specific error cases
    if (error) {
      console.error('Error getting user stats:', error);
      
      // Check if the table exists by making a simple query
      const { error: tableCheckError } = await supabase
        .from('user_stats')
        .select('id')
        .limit(1);
        
      if (tableCheckError) {
        console.error('Cannot access user_stats table:', tableCheckError);
      }
      
      // If it's just that the user has no stats yet, initialize them
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return initializeUserStats(userId);
      }
    }

    // If we get here, either there was no error (but no data) or we couldn't recover
    return createDefaultStats(userId);
    
  } catch (error) {
    console.error('Unexpected error in getUserStats:', error);
    return createDefaultStats(userId);
  }
};

/**
 * Initializes user stats in the database
 */
export const initializeUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const defaultStats = createDefaultStats(userId);
    
    // Try to insert the new stats
    const { data, error } = await supabase
      .from('user_stats')
      .insert({
        user_id: userId,
        books_read: 0,
        reading_hours: 0,
        achievements: 0,
        currently_reading: 'None',
      } as UserStatsInsert)
      .select()
      .single();

    // If successful, cache and return
    if (data) {
      const mappedStats = mapDbToAppStats(data as UserStatsDB, userId);
      statsCache.set(userId, mappedStats);
      return mappedStats;
    }

    // If the row already exists, try to fetch it
    if (error?.code === '23505') { // Unique violation
      return getUserStats(userId);
    }

    // For other errors, log and return defaults
    console.error('Error initializing user stats:', error);
    return defaultStats;
    
  } catch (error) {
    console.error('Unexpected error in initializeUserStats:', error);
    return createDefaultStats(userId);
  }
};

/**
 * Updates user stats in the database
 */
export const updateUserStats = async (
  userId: string, 
  updates: Partial<Omit<UserStats, 'user_id'>>
): Promise<UserStats> => {
  try {
    // Ensure we have the latest stats
    const currentStats = await getUserStats(userId);
    
    // Merge updates with current stats
    const updatedStats: UserStats = {
      ...currentStats,
      ...updates,
      user_id: userId, // Ensure user_id is preserved
    };

    // Prepare data for upsert
    const upsertData: UserStatsInsert = {
      user_id: updatedStats.user_id,
      books_read: updatedStats.books_read,
      reading_hours: updatedStats.reading_hours,
      achievements: updatedStats.achievements,
      currently_reading: updatedStats.currently_reading,
      updated_at: new Date().toISOString()
    };
    
    // Only include created_at if it exists
    if (updatedStats.created_at) {
      upsertData.created_at = updatedStats.created_at;
    }

    // Update the database
    const { data, error } = await supabase
      .from('user_stats')
      .upsert(upsertData)
      .select()
      .single();

    if (error) throw error;
    
    // Update cache
    const mappedStats = mapDbToAppStats(data as UserStatsDB, userId);
    statsCache.set(userId, mappedStats);
    return mappedStats;
    
  } catch (error) {
    console.error('Error updating user stats:', error);
    // Return current stats from cache if available
    return statsCache.get(userId) || createDefaultStats(userId);
  }
};
