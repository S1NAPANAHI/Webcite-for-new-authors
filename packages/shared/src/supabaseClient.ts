import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export type { Database };

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'];
const supabaseAnonKey = import.meta.env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is not defined. Please check your .env file and restart the server.");
}
if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is not defined. Please check your .env file and restart the server.");
}

// Global singleton instance - ensure only ONE instance across the entire app
let supabaseInstance: ReturnType<typeof createClient<Database>>;

// Create a new instance with proper configuration for authentication
// This will only run once when the module is first loaded
console.log('🚀 Supabase client: Initializing singleton instance...');
supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: isBrowser,
    // Use consistent storage key across all instances
    storageKey: 'zoroaster-auth-session',
    storage: isBrowser ? window.localStorage : undefined,
  },
});
console.log('✅ Supabase singleton client initialized.');

/**
 * Returns the singleton Supabase client instance.
 * This ensures only ONE instance exists across all packages and modules.
 */
const getSupabase = () => {
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabase();

// For backwards compatibility
export default supabase;

// Debug utility to check client state
export const debugSupabaseClient = () => {
  console.log('🔍 Supabase Client Debug Info:', {
    hasModuleInstance: !!supabaseInstance,
    hasWindowInstance: isBrowser && !!(window as any).__ZOROASTER_SUPABASE_CLIENT__,
    isBrowser,
    url: supabaseUrl,
    keyExists: !!supabaseAnonKey,
  });
};
