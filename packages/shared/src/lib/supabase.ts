import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Singleton pattern with global storage to prevent multiple instances
declare global {
  var __SUPABASE_CLIENT__: SupabaseClient<Database> | undefined;
}

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient<Database> = 
  globalThis.__SUPABASE_CLIENT__ ?? 
  (globalThis.__SUPABASE_CLIENT__ = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      storageKey: 'zoroaster_auth', // unique key prevents storage collisions
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }));

export default supabase;