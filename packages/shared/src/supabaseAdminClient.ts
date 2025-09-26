import { createClient } from '@supabase/supabase-js';

// CRITICAL FIX: Admin client should only be used server-side
// Don't initialize it in browser context
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  console.warn('⚠️ Supabase admin client should not be used in browser context');
}

const supabaseUrl = typeof process !== 'undefined' && process.env 
  ? process.env.SUPABASE_URL 
  : import.meta.env?.VITE_SUPABASE_URL;

const supabaseServiceRoleKey = typeof process !== 'undefined' && process.env
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : import.meta.env?.['VITE_SUPABASE_SERVICE_ROLE_KEY'];

// Only create admin client if we have the required variables and we're not in browser
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

if (!isBrowser && supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
} else if (!isBrowser) {
  console.error('Missing Supabase admin environment variables for server-side usage');
}

// Export a getter function instead of direct client
export const getSupabaseAdmin = () => {
  if (isBrowser) {
    throw new Error('Supabase admin client cannot be used in browser context for security reasons');
  }
  
  if (!supabaseAdmin) {
    throw new Error(`
      Missing Supabase admin environment variables. 
      Please check your .env file and make sure 
      SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
    `);
  }
  
  return supabaseAdmin;
};

// For backwards compatibility - but this will throw in browser
export const supabaseAdmin = isBrowser ? null : supabaseAdmin;

// Default export
export default isBrowser ? null : supabaseAdmin;
