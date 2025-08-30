"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';
// Get environment variables with fallbacks
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
// Debug log to check if environment variables are loaded
if (process.env.VITE_DEBUG === 'true') {
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
let supabase;
try {
    // Create the Supabase client with minimal configuration
    exports.supabase = supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
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
}
catch (error) {
    console.error('Error initializing Supabase client:', error);
    throw error;
}
exports.default = supabase;
