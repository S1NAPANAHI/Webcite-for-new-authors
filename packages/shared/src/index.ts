// Existing exports
export { supabase, debugSupabaseClient } from './supabaseClient';
// REMOVED: export { supabaseAdmin } from './supabaseAdminClient'; // ❌ SECURITY FIX: Admin client should not be exported to frontend
export type { Database } from './database.types';
export * from './types';
export * from './profile';
export * from './storage';
export * from './subscription';
export * from './userStats';
export * from './wiki';
export * from './product';
export * from './AuthContext';
export * from './CartContext';
export * from './utils';

// NEW: Export safe image utilities
export {
  getSafeImageUrl,
  getSafeBlogImageUrl, 
  getSafeCharacterImageUrl,
  getSafeCoverImageUrl,
  debugImageUrl
} from './utils/imageUtils';