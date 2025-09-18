import { createClient } from '@supabase/supabase-js';

const supabaseUrl = typeof process !== 'undefined' && process.env 
  ? process.env.SUPABASE_URL 
  : import.meta.env.VITE_SUPABASE_URL;

const supabaseServiceRoleKey = typeof process !== 'undefined' && process.env
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : import.meta.env['VITE_SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(`
    Missing Supabase admin environment variables. 
    Please check your .env file and make sure 
    SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
  `);
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
