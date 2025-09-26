// Export authentication context and hooks
export { AuthProvider, useAuth } from './AuthContext';

// Export Supabase client singleton
export { supabase, debugSupabaseClient } from './supabaseClient';

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

// Only export admin client on server-side to prevent browser errors
const isBrowser = typeof window !== 'undefined';
if (!isBrowser) {
  // Server-side only exports
  export * from './supabaseAdminClient';
}
