import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables (Vite will inject these at build time)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('Environment variables check:');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

// Global singleton instance
let supabaseInstance: SupabaseClient | null = null;

// Create singleton instance function
function createSupabaseSingleton(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = `
      Missing Supabase environment variables.
      Please check your .env file and ensure the following are set:
      - VITE_SUPABASE_URL
      - VITE_SUPABASE_ANON_KEY
      
      Current values:
      - VITE_SUPABASE_URL: ${supabaseUrl || 'undefined'}
      - VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'set' : 'undefined'}
    `;
    console.error(errorMessage);
    throw new Error('Missing Supabase environment variables');
  }

  // Return existing instance if already created
  if (supabaseInstance) {
    console.log('✅ Supabase client: Using existing singleton');
    return supabaseInstance;
  }

  console.log('🚀 Supabase client: Creating new singleton instance');
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Use unique storage key to prevent conflicts
      storageKey: 'zoroaster-auth',
    },
  });

  console.log('✅ Supabase client created as singleton');
  return supabaseInstance;
}

// Export the singleton function call
export const supabase = createSupabaseSingleton();

// For backwards compatibility
export default supabase;