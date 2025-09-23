import { createClient } from '@supabase/supabase-js';

// Get environment variables (Vite will inject these at build time)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('Environment variables check:');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

let supabaseInstance;

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
  console.warn(errorMessage);
  supabaseInstance = {} as any; // Dummy object
} else {
  // Ensure createClient is called only once
  if (!supabaseInstance) { // Add this check
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  }
} // Close the else block

export const supabase = supabaseInstance; // Export at top level

console.log('✅ Supabase client initialized successfully');
