// Export authentication context and hooks
export { AuthProvider, useAuth } from './AuthContext';

// Export Supabase client singleton
export { supabase, debugSupabaseClient } from './supabaseClient';
export { default as supabaseAdminClient } from './supabaseAdminClient';

// Export auth utilities for debugging
export * from './lib/auth-utils';

// Export cart context
export { CartProvider, useCart } from './CartContext';

// Export types
export type { UserProfile } from './profile';
export type { Database } from './database.types';

// Export API functions
export * from './api/homepage';
export * from './api/content';
export * from './subscription';
export * from './storage';
export * from './userStats';
export * from './wiki';

// Export utilities
export * from './utils';
