import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

// Safe access to Vite env without TypeScript complaining in non-Vite contexts
const viteEnv = (() => {
  try {
    return isBrowser ? (import.meta as any)?.env : undefined;
  } catch {
    return undefined;
  }
})();

// Get environment variables with fallbacks
const supabaseUrl = process.env.VITE_SUPABASE_URL || viteEnv?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || viteEnv?.VITE_SUPABASE_ANON_KEY || '';

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
  const isDev = (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || (!!viteEnv?.DEV);
  if (isDev && isBrowser) {
    console.log('Supabase client initialized with URL:', supabaseUrl);
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  throw error;
}

export { supabase };
export default supabase;
