// Main exports for the shared package
export * from './services/content';
export * from './services/admin';
export * from './hooks/useLibrary';
export * from './lib/supabase'; // Export the shared supabase client
export * from './database.types'; // Export the auto-generated types
export * from './CartContext'; // Export useCart hook
export * from './subscription'; // Export getSubscription function
export * from './userStats'; // Export getUserStats function
export * from './wiki'; // Export fetchWikiPage function
export * from './AuthContext'; // Export AuthProvider
// Re-export specific types or instances if needed
export { supabase } from './lib/supabase';
//# sourceMappingURL=index.js.map