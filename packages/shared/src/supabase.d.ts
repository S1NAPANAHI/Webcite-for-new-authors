import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

declare global {
  // Extend the Window interface to include ENV variables for browser
  interface Window {
    ENV: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
      VITE_SUPABASE_SERVICE_ROLE_KEY?: string;
    };
  }

  // Declare the type for the supabase client
  const supabase: SupabaseClient<Database>;
  
  // For Node.js environment
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY?: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

// Export types for better type inference
export type { Database };
export type SupabaseClientType = SupabaseClient<Database>;

// Make it a module
export {};
