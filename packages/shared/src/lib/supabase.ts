import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Global singleton instance
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

// Create singleton Supabase client to prevent multiple GoTrueClient instances
export const createSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase URL or anonymous key is missing');
    console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
    throw new Error('Supabase configuration is incomplete');
  }

  try {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Single auth instance configuration
        persistSession: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Use a unique storage key to avoid conflicts
        storageKey: 'zoroaster-auth-token'
      },
      // Additional client options for stability
      global: {
        headers: {
          'X-Client-Info': 'zoroaster-web-client'
        }
      }
    });
    
    console.log('✅ Supabase client created as singleton');
    return supabaseInstance;
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    throw error;
  }
};

// Export the singleton instance
export const supabase = createSupabaseClient();

// Default export
export default supabase;