import { createClient } from '@supabase/supabase-js';
// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Validate environment variables in browser only (this check will now pass if hardcoded values are valid)
if (isBrowser && (!supabaseUrl || !supabaseAnonKey)) {
    const errorMessage = `
    Missing Supabase environment variables.
    Please check your .env file and ensure the following are set:
    - VITE_SUPABASE_URL
    - VITE_SUPABASE_ANON_KEY
  `;
    console.error(errorMessage);
    throw new Error(errorMessage);
}
// Global variable to hold the Supabase client instance
let supabaseInstance = null;
/**
 * Get or create the Supabase client instance
 * Ensures only one instance is created
 */
const getSupabase = () => {
    // Use a global variable to ensure a single instance across hot reloads and multiple module evaluations
    if (typeof window !== 'undefined' && window.__SUPABASE_CLIENT_INSTANCE__) {
        return window.__SUPABASE_CLIENT_INSTANCE__;
    }
    if (supabaseInstance) {
        return supabaseInstance;
    }
    // This check will now pass if hardcoded values are valid
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and Anon Key are required');
    }
    // Create a new instance with proper typing and configuration
    const newInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: isBrowser,
            storage: isBrowser ? window.localStorage : undefined,
        },
        global: {
            // Get the latest record instead of from local cache
            fetch: (url, options) => {
                const actualOptions = options || {};
                const { headers = {}, ...restOptions } = actualOptions;
                return fetch(url, {
                    ...restOptions,
                    headers: {
                        ...headers,
                        'Cache-Control': 'no-cache',
                    },
                });
            },
        }
    });
    supabaseInstance = newInstance;
    if (typeof window !== 'undefined') {
        window.__SUPABASE_CLIENT_INSTANCE__ = newInstance;
    }
    return supabaseInstance;
};
// Export the singleton instance
export const supabase = getSupabase();
export default supabase;
//# sourceMappingURL=supabaseClient.js.map