// create once, re-use everywhere - Singleton Supabase Client
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ensure only one instance exists globally
let supabaseInstance: SupabaseClient | null = null;

// Get or create the Supabase client instance
export const getSupabaseClient = (): SupabaseClient => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    throw new Error('Missing required Supabase configuration');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  console.log('✅ Supabase client created as singleton');
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();