/**
 * ADMIN-ONLY EXPORTS
 * 
 * ⚠️  WARNING: This file should ONLY be imported in server-side/backend code!
 * 
 * This file contains admin-level Supabase client and related utilities
 * that require elevated privileges. Never import this in frontend/browser code.
 * 
 * Usage:
 * - Backend API routes: ✅ import { supabaseAdmin } from '@zoroaster/shared/admin'
 * - Frontend components: ❌ DO NOT IMPORT - Use regular supabase client instead
 */

// Re-export admin client for server-side use
export { supabaseAdmin } from './supabaseAdminClient';

// Add any other admin-only utilities here in the future
// export { adminOnlyFunction } from './adminOnlyUtilities';