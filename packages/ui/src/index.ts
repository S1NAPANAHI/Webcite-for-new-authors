// MINIMAL ADMIN-SAFE UI PACKAGE EXPORTS
// Only essential components to avoid Supabase import issues

// Essential Admin Components
export { AdminSideNav, AdminSideNavProvider, AdminSideNavToggle, useAdminSideNav } from './AdminSideNav';
export { AdminProtectedRoute } from './AdminProtectedRoute';
export { SimpleDashboardPage } from './SimpleDashboardPage';
export { AdminLayout } from './AdminLayout'; // Added AdminLayout
export { KpiCard } from './KpiCard'; // Added KpiCard
export { ChartsGrid } from './ChartsGrid'; // Added ChartsGrid

// Essential UI Components
export { Layout } from './Layout';
export { Navbar } from './Navbar';
export { Footer } from './Footer';
export { HomePage } from './HomePage';
export type { HomepageContentItem, Post, ReleaseItem } from './HomePage';
export { GlowButton } from './GlowButton';
export { OrnateDivider } from './OrnateDivider';
export { MagicalParticles } from './MagicalParticles';
export { LoadingSkeleton } from './LoadingSkeleton';
export { StarsBackground } from './StarsBackground';
export { WikiNavItem } from './WikiNavItem';
export { CartIcon } from './CartIcon';
export { default as LoginPage } from './LoginPage';
export { default as ProductManagementPage } from './ProductManagementPage';
export { default as OrderManagementPage } from './OrderManagementPage';
export { default as InventoryManagementPage } from './InventoryManagementPage';
export { default as WorksManagementPage } from './WorksManagementPage';
export { default as MediaUploadPage } from './MediaUploadPage';
export { default as SubscriptionPage } from './SubscriptionPage';
export { default as SubscriptionSuccessPage } from './SubscriptionSuccessPage';
export { LibraryPage } from './LibraryPage';
export { BlogPage } from './BlogPage';
export { TimelinesPage } from './TimelinesPage';
export { WikiViewer } from './WikiViewer';

// Basic UI Components (verified to exist)
export * from './button';
export * from './card';
export * from './input';
export * from './label';
export * from './badge';
export * from './textarea';
export * from './select';
export * from './dialog';
export * from './switch';
export * from './table';
export * from './alert';
export * from './use-toast';
export * from './alert-dialog';
export * from './skeleton';
export * from './tabs';
export * from './tooltip';

// Utils (safe)
export * from './lib/utils';

// ─────────────────────────────────────────────────────────────
//  Expose the singleton Supabase client so that other packages
//  can simply `import { supabase } from "@zoroaster/ui";`
// ─────────────────────────────────────────────────────────────
export { supabase } from './lib/supabaseClient';