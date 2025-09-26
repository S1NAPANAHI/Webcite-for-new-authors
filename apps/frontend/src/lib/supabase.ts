// CRITICAL: Import from shared package to use singleton
// This prevents multiple Supabase client instances
import { supabase as sharedSupabase, debugSupabaseClient } from '@zoroaster/shared';

// Re-export the shared singleton to maintain compatibility
export const supabase = sharedSupabase;
export default supabase;

// Export debug utility for troubleshooting
export { debugSupabaseClient };

// Log to confirm we're using the shared singleton
console.log('✅ Frontend supabase.ts: Using shared singleton client');

// Debug info on module load
if (typeof window !== 'undefined') {
  console.log('🔍 Frontend lib/supabase.ts loaded:', {
    hasSharedClient: !!sharedSupabase,
    hasWindowClient: !!(window as any).__ZOROASTER_SUPABASE_CLIENT__,
    areEqual: sharedSupabase === (window as any).__ZOROASTER_SUPABASE_CLIENT__
  });
}
