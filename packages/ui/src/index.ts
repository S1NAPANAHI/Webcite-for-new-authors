// MINIMAL ADMIN-SAFE UI PACKAGE EXPORTS
// Only essential components to avoid Supabase import issues

// Essential Admin Components
export { AdminSideNav, AdminSideNavProvider, AdminSideNavToggle, useAdminSideNav } from './AdminSideNav';
export { AdminProtectedRoute } from './AdminProtectedRoute';
export { SimpleDashboardPage } from './SimpleDashboardPage';

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
export { default as ProductManagementPage } from './ProductManagementPage';
export { default as OrderManagementPage } from './OrderManagementPage';
export { default as InventoryManagementPage } from './InventoryManagementPage';
export { default as WorksManagementPage } from './WorksManagementPage';
export { default as MediaUploadPage } from './MediaUploadPage';

// Basic UI Components
export * from './button';
export * from './card';
export * from './input';
export * from './label';
export * from './badge';

// Utils (safe)
export * from './lib/utils';
