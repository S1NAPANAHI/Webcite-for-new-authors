import { createClient } from '@supabase/supabase-js';

// CRITICAL: This file should NEVER be imported in browser/frontend code
// It's designed for server-side/backend use only

if (typeof window !== 'undefined') {
  throw new Error(`
    ❌ SECURITY ERROR: Supabase Admin Client detected in browser context!
    
    This file (supabaseAdminClient) should NEVER be imported in frontend/browser code.
    It contains admin credentials that should only be used server-side.
    
    If you're seeing this error:
    1. Check your frontend imports - remove any admin client imports
    2. Use the regular 'supabase' client instead for frontend operations
    3. Move admin operations to your backend/API routes
    
    This is a security protection to prevent admin credentials exposure.
  `);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(`
    Missing Supabase admin environment variables. 
    Please check your .env file and make sure 
    SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
  `);
}

// Server-side only admin client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Default export
export default supabaseAdmin;
