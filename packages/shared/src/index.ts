// Export authentication context and hooks
export { AuthProvider, useAuth } from './AuthContext';

// Export Supabase client singleton
export { supabase, debugSupabaseClient } from './supabaseClient';

// Export admin client safely (server-side only)
export { getSupabaseAdmin, supabaseAdmin } from './supabaseAdminClient';
// For backwards compatibility with conditional export
const isBrowser = typeof window !== 'undefined';
export const supabaseAdminDefault = isBrowser ? null : require('./supabaseAdminClient').default;
export { supabaseAdminDefault as default };

// Export auth utilities for debugging
export * from './lib/auth-utils';

// Export cart context
export { CartProvider, useCart } from './CartContext';

// Export types
export type { UserProfile } from './profile';
export type { Database } from './database.types';

// Export functions that exist
export * from './subscription';
export * from './storage';
export * from './userStats';
export * from './wiki';

// Export utilities
export * from './utils';
