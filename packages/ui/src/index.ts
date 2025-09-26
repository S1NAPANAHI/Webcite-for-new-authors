// Export all UI components with mobile-first optimizations

// Layout Components (Mobile-Optimized)
export { Layout } from './Layout';
export { AdminLayout } from './AdminLayout';
export { Navbar } from './Navbar';
export { Footer } from './Footer';

// Page Components (Mobile-Enhanced)
export { HomePage } from './HomePage';
export { LoginPage } from './LoginPage';
export { LibraryPage } from './LibraryPage';
export { AccountPage } from './AccountPage';
export { DashboardPage } from './DashboardPage';
export { SimpleDashboardPage } from './SimpleDashboardPage';
export { BetaApplicationPage } from './BetaApplicationPage';
export { BetaApplicationStatusPage } from './BetaApplicationStatusPage';
export { BetaPortalPage } from './BetaPortalPage';
export { CheckoutPage } from './CheckoutPage';
export { SubscriptionPage } from './SubscriptionPage';
export { SubscriptionSuccessPage } from './SubscriptionSuccessPage';
export { AdminStorePage } from './AdminStorePage';
export { AdminUploadPage } from './AdminUploadPage';
export { ProductManagementPage } from './ProductManagementPage';
export { OrderManagementPage } from './OrderManagementPage';
export { InventoryManagementPage } from './InventoryManagementPage';
export { WorksManagementPage } from './WorksManagementPage';
export { MediaUploadPage } from './MediaUploadPage';
export { ChapterUploadPage } from './ChapterUploadPage';
export { ContentEditor } from './ContentEditor';
export { TimelinesPage } from './TimelinesPage';
export { CharactersManager } from './CharactersManager';
export { WikiManager } from './WikiManager';
export { WikiEditor } from './WikiEditor';
export { WikiViewer } from './WikiViewer';
export { WikiNavItem } from './WikiNavItem';
export { WorkReaderPage } from './WorkReaderPage';
export { UsersManagement } from './UsersManagement';
export { HomepageContentManager } from './HomepageContentManager';
export { PostsManager } from './PostsManager';
export { PagesManager } from './PagesManager';
export { BlogPage } from './BlogPage';
export { GlossaryPage } from './GlossaryPage';
export { LocationsPage } from './LocationsPage';
export { ReviewsPage } from './ReviewsPage';
export { NotFoundPage } from './NotFoundPage';

// Component Pieces
export { AdminSideNav } from './AdminSideNav';
export { AdminNavigationOverlay } from './AdminNavigationOverlay';
export { AdminPageWrapper } from './AdminPageWrapper';
export { AdminProtectedRoute } from './AdminProtectedRoute';
export { ProtectedRoute } from './ProtectedRoute';
export { LoadingSkeleton } from './LoadingSkeleton';
export { GlowButton } from './GlowButton';
export { CartIcon } from './CartIcon';
export { MagicalParticles } from './MagicalParticles';
export { StarsBackground } from './StarsBackground';
export { OrnateDivider } from './OrnateDivider';
export { SortableFolderTree } from './SortableFolderTree';

// Managers
export { ProductManager } from './ProductManager';
export { WorksManager } from './WorksManager';
export { PriceManager } from './PriceManager';

// Account Components
export { OverviewTab } from './OverviewTab';
export { ProfileTab } from './ProfileTab';
export { PreferencesTab } from './PreferencesTab';
export { ReadingTab } from './ReadingTab';
export { SecurityTab } from './SecurityTab';
export { AchievementsTab } from './AchievementsTab';

// Form Components  
export { ProductForm } from './ProductForm';
export { ProductCard } from './ProductCard';
export { SubscriptionCheckout } from './SubscriptionCheckout';

// Content Components
export { ContentTable } from './ContentTable';

// Utility Components
export { KpiCard } from './KpiCard';
export { ChartsGrid } from './ChartsGrid';

// Shadcn Components (Mobile-Enhanced)
export {
  Alert,
  AlertDescription,
  AlertTitle,
} from './alert';

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';

export { Badge, badgeVariants } from './badge';

export { Button, buttonVariants } from './button';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

export { Input } from './input';
export { Label } from './label';

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from './select';

export { Skeleton } from './skeleton';
export { Switch } from './switch';

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './tabs';

export { Textarea } from './textarea';

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

export { useToast } from './use-toast';

// Types
export type { HomepageContentItem, Post, ReleaseItem } from './HomePage';

// Mobile Utility Exports
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const DESKTOP_BREAKPOINT = 1280;

// Mobile-first utility functions
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
};

export const isTabletDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT;
};

export const isDesktopDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= DESKTOP_BREAKPOINT;
};

// Touch detection
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Safe area utilities for notched devices
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined' || !CSS.supports('padding', 'env(safe-area-inset-top)')) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  
  const computedStyle = getComputedStyle(document.documentElement);
  return {
    top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
    right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
    bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
  };
};

// Viewport height fix for mobile browsers
export const getViewportHeight = () => {
  if (typeof window === 'undefined') return 0;
  return window.innerHeight;
};

// Prevent zoom utilities
export const preventZoom = () => {
  if (typeof document === 'undefined') return;
  
  const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
  if (meta) {
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  }
};

export const allowZoom = () => {
  if (typeof document === 'undefined') return;
  
  const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
  if (meta) {
    meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
  }
};

// Mobile performance utilities
export const optimizeForMobile = () => {
  if (typeof document === 'undefined') return;
  
  // Add mobile-optimized classes to body
  document.body.classList.add('mobile-optimized');
  
  // Enable hardware acceleration for smoother scrolling
  document.body.style.transform = 'translateZ(0)';
  document.body.style.webkitTransform = 'translateZ(0)';
  
  // Optimize touch scrolling
  document.body.style.webkitOverflowScrolling = 'touch';
  document.body.style.overflowScrolling = 'touch';
};

// Initialize mobile optimizations
if (typeof window !== 'undefined' && isMobileDevice()) {
  optimizeForMobile();
}