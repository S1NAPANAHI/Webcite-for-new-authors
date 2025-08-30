// This is a test comment to force a new commit.
import { createClient } from '@supabase/supabase-js';
// These environment variables should be defined in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = [
        'Missing Supabase environment variables.',
        'Please check your .env file and make sure:',
        '1. VITE_SUPABASE_URL is set',
        '2. VITE_SUPABASE_ANON_KEY is set',
        '3. Your .env file is in the root of your frontend directory',
        '4. Your .env file is properly formatted (no spaces around =)',
        '5. You have restarted your development server after making changes',
    ].join('\n');
    throw new Error(errorMessage);
}
// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
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
    },
});
// Debug helper
if (import.meta.env.VITE_DEBUG === 'true') {
    console.group('Supabase Client Initialized');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Anon Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'Not set');
    console.groupEnd();
}
// Example of a type-safe query helper
export async function safeQuery(query) {
    try {
        const { data, error } = await query;
        if (error)
            throw error;
        return { data, error: null };
    }
    catch (error) {
        console.error('Supabase query error:', error);
        return { data: null, error: error };
    }
}
//# sourceMappingURL=supabaseClient.js.map