// Temporary exports - only components that don't require Supabase

// Simple components that should work
export { StarsBackground } from './StarsBackground';
export { LoadingSkeleton } from './LoadingSkeleton';
export { GlowButton } from './GlowButton';
export { OrnateDivider } from './OrnateDivider';
export { MagicalParticles } from './MagicalParticles';

// UI Components (these should work as they don't import Supabase directly)
export * from './button';
export * from './card';
export * from './input';
export * from './label';
export * from './select';
export * from './tabs';
export * from './textarea';
export * from './badge';
export * from './alert';
export * from './alert-dialog';
export * from './dialog';
export * from './switch';
export * from './table';

// Utils and hooks that don't require Supabase
export * from './lib/utils';

// Modified Navbar that accepts props instead of importing Supabase directly
export { Navbar } from './Navbar';

// Simple Layout (without complex dependencies)
export { Layout } from './Layout';

// Refactored HomePage that accepts data as props (no Supabase imports)
export { HomePage } from './HomePage';
export type { HomepageContentItem, Post, ReleaseItem } from './HomePage';

// Note: Excluded components that import supabase directly:
// - AdminLayout, AccountPage, etc.
// - All admin components
// - All page components that fetch data
