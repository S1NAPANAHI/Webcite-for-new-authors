import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
export type { Database };

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';



// Get environment variables with fallbacks
// Use import.meta.env for Vite compatibility, fallback to process.env for other environments
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// Debug log to check if environment variables are loaded
console.log('DEBUG: supabaseUrl (raw):', supabaseUrl);
console.log('DEBUG: supabaseAnonKey (raw):', supabaseAnonKey);


if (import.meta.env?.VITE_DEBUG === 'true' || process.env.VITE_DEBUG === 'true') {
  console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('Supabase Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
}

// Validate environment variables
if ((!supabaseUrl || !supabaseAnonKey) && isBrowser) {
  const errorMessage = `
    Missing Supabase environment variables.
    Please check your .env file and ensure the following are set:
    - VITE_SUPABASE_URL
    - VITE_SUPABASE_ANON_KEY
  `;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// Create a singleton instance of the Supabase client
let supabase: ReturnType<typeof createClient<Database>>;

try {
  // Create the Supabase client with minimal configuration
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: isBrowser ? window.localStorage : undefined,
    }
  });

  // Log initialization in development
  const isDev = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');
  if (isDev && isBrowser) {
    console.log('Supabase client initialized with URL:', supabaseUrl);
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  throw error;
}

export { supabase };
export default supabase;
