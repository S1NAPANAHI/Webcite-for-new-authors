import React, { useState, useEffect } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { 
  Layout, 
  StarsBackground,
  LoadingSkeleton,
  GlowButton,
  OrnateDivider,
  MagicalParticles,
  // Admin components - YouTube-like side navigation
  AdminProtectedRoute,
  AdminSideNavProvider,
  AdminSideNav,
  AdminSideNavToggle,
  SimpleDashboardPage,
  // Import LoginPage from UI package
  LoginPage,
  // Use UI HomePage temporarily to fix build
  HomePage
} from '@zoroaster/ui';
import { useAuth } from '@zoroaster/shared';
import { SubscriptionPage, SubscriptionSuccessPage, LibraryPage, BlogPage } from '@zoroaster/ui';
import { WikiPage, WikiPageWithSections, fetchWikiPage } from '@zoroaster/shared';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { supabase } from '@zoroaster/shared/supabaseClient';
// import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // Temporarily disabled
// import BetaApplicationsManager from './admin/BetaApplicationsManager'; // Temporarily disabled
import BetaApplication from './components/BetaApplication/BetaApplication';
import { CartProvider } from '@zoroaster/shared';

// Your LOCAL page components (temporarily disabled to fix Vercel build)
// All local pages replaced with placeholders until module resolution is fixed
// import StorePage from './pages/StorePage';
// import LocalWikiPage from './pages/WikiPage'; 
// import BlogPostPage from './pages/BlogPostPage';
// import GenericPage from './pages/GenericPage';
import ProfileDashboard from './pages/ProfileDashboard';
import AboutPage from './pages/AboutPage';
// import ArtistCollaborationPage from './pages/ArtistCollaborationPage';
// import Timelines from './pages/Timelines';
// import StripeTest from './pages/StripeTest';
// import SubscriptionSuccess from './pages/SubscriptionSuccess';
// import SubscriptionsPage from './pages/SubscriptionsPage';
// import AboutPage from './pages/AboutPage';

// Components (also temporarily disabled)
// import PayPalButton from './components/PayPalButton/PayPalButton';

// Admin pages
import SubscriptionManagementPage from './admin/SubscriptionManagementPage';
import { ProductManagementPage, OrderManagementPage, InventoryManagementPage, WorksManagementPage, MediaUploadPage } from '@zoroaster/ui';

// Placeholder components for routes that don't have implementations yet
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-4xl font-bold mb-4">{title}</h1>
    <p className="text-gray-600">This page is under construction.</p>
  </div>
);

// Simple admin placeholder page - no wrapper needed
const AdminPlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-6 text-center">
    <h1 className="text-4xl font-bold mb-4">{title}</h1>
    <p className="text-gray-600">This admin page is under construction.</p>
  </div>
);


const CharactersPage = () => <PlaceholderPage title="Characters" />;
const LocationsPage = () => <PlaceholderPage title="Locations" />;
const GlossaryPage = () => <PlaceholderPage title="Glossary" />;
const ReviewsPage = () => <PlaceholderPage title="Reviews" />;

const NotFoundPage = () => <PlaceholderPage title="Page Not Found" />;
const BetaPortalPage = () => <PlaceholderPage title="Beta Portal" />;
const BetaApplicationStatusPage = () => <PlaceholderPage title="Beta Application Status" />;
const WorkReaderPage = () => <PlaceholderPage title="Work Reader" />;
const BetaReaderHandbookPage = () => <PlaceholderPage title="Beta Reader Handbook" />;
const OperationalTimelinePage = () => <PlaceholderPage title="Operational Timeline" />;
const ViewNDAPage = () => <PlaceholderPage title="NDA" />;
const BetaFeedbackPage = () => <PlaceholderPage title="Beta Feedback" />;
const AdminStorePage = () => <PlaceholderPage title="Admin Store" />;

// Layout wrapper that handles authentication
const AuthenticatedLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [betaApplicationStatus, setBetaApplicationStatus] = useState('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <StarsBackground />
      <Layout 
        isAuthenticated={isAuthenticated}
        betaApplicationStatus={betaApplicationStatus}
        onLogout={handleLogout}
      />
    </>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState<WikiPageWithSections | null>(null);
  const params = useParams();
  const { supabaseClient, user } = useAuth();

  React.useEffect(() => {
    if (params.pageSlug) {
      fetchWikiPage(params.pageSlug).then(setCurrentPage);
    }
  }, [params.pageSlug]);

  return (
    <CartProvider className="bg-red-500">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Public and general routes with the main layout */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<PlaceholderPage title="Store" />} />
          <Route path="/checkout" element={<PlaceholderPage title="Checkout" />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/subscriptions" element={<SubscriptionPage />} />
          <Route path="/subscription-success" element={<SubscriptionSuccessPage />} />
          <Route path="/stripe-test" element={<PlaceholderPage title="Stripe Test" />} />
          
          {/* Wiki Routes */}
          <Route path="/wiki">
            <Route index element={<PlaceholderPage title="Wiki" />} />
            <Route path=":folderSlug" element={<PlaceholderPage title="Wiki Folder" />} />
            <Route path=":folderSlug/:pageSlug" element={<PlaceholderPage title="Wiki Page" />} />
          </Route>
          
          <Route path="/timelines" element={<PlaceholderPage title="Timelines" />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/account/*" element={<ProfileDashboard />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<PlaceholderPage title="Blog Post" />} />
          <Route path="/beta/application" element={<BetaApplication supabaseClient={supabaseClient} user={user} />} />
          <Route path="/artist-collaboration" element={<PlaceholderPage title="Artist Collaboration" />} />
          <Route path="/read/:workId" element={<WorkReaderPage />} />
          <Route path="/beta/status" element={<BetaApplication supabaseClient={supabaseClient} user={user} />} />
          
          <Route path="/beta/handbook" element={<BetaReaderHandbookPage />} />
          <Route path="/beta/timeline" element={<OperationalTimelinePage />} />
          <Route path="/beta/nda" element={<ViewNDAPage />} />
          
          <Route path="/beta/feedback" element={<BetaFeedbackPage />} />
          
          <Route path="/beta/portal" element={<BetaPortalPage />} />
          <Route path="/:slug" element={<PlaceholderPage title="Page" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin routes - YouTube-like side navigation */}
        <Route 
          path="/account/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminSideNavProvider>
                {/* Side navigation components always available */}
                <AdminSideNavToggle />
                <AdminSideNav />
                
                {/* Admin route content */}
                <Routes>
                  <Route index element={<SimpleDashboardPage />} />
                  <Route path="beta-applications" element={<AdminPlaceholderPage title="Beta Applications Management" />} />
                  <Route path="users" element={<AdminPlaceholderPage title="User Management" />} />
                  <Route path="posts" element={<AdminPlaceholderPage title="Posts Management" />} />
                  <Route path="works" element={<WorksManagementPage />} />
                  <Route path="media" element={<MediaUploadPage />} />
                  <Route path="products" element={<ProductManagementPage />} />
                  <Route path="subscriptions" element={<SubscriptionManagementPage />} />
                  <Route path="orders" element={<OrderManagementPage />} />
                  <Route path="inventory" element={<InventoryManagementPage />} />
                  <Route path="analytics" element={<AdminPlaceholderPage title="Analytics" />} />
                  <Route path="timeline/events" element={<AdminPlaceholderPage title="Timeline Events" />} />
                  <Route path="webhooks" element={<AdminPlaceholderPage title="Webhook Management" />} />
                  <Route path="settings" element={<AdminPlaceholderPage title="Admin Settings" />} />
                </Routes>
              </AdminSideNavProvider>
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </CartProvider>
  );
};

export default App;