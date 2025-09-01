// Main exports for the shared package
export * from './supabaseClient';
export * from './AuthContext';
export * from './CartContext';
export * from './profile';
export * from './subscription';
export * from './product';
export * from './wiki';
export * from './userStats';
export * from './utils';
export * from './database.types';

// Business logic exports
export * from './business';

// Export specific utilities
export { supabase } from './supabaseClient';
export type { Database } from './database.types';
