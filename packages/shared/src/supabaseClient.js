import { createClient } from '@supabase/supabase-js';

let supabase;
let supabaseUrl;
let supabaseAnonKey;

if (typeof window !== 'undefined') {
  const getEnvVar = (envVar, fallback) => {
    if (typeof process !== 'undefined' && process.env && process.env[envVar]) {
      return process.env[envVar];
    }
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[`VITE_${envVar}`] || fallback;
    }
    return fallback;
  };

  supabaseUrl = getEnvVar('SUPABASE_URL', '');
  supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY', '');

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(`
      Missing Supabase environment variables. 
      Please check your .env file and make sure 
      SUPABASE_URL and SUPABASE_ANON_KEY are set.
    `);
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export { supabase, supabaseUrl, supabaseAnonKey };
