import React, { useEffect } from 'react';
import { Route, Routes, Outlet, useParams, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  StarsBackground,
  LoadingSkeleton,
  LoginPage,
  HomePage
} from '@zoroaster/ui';
import { AuthProvider, useAuth, supabase } from '@zoroaster/shared';
import { SubscriptionPage, SubscriptionSuccessPage, LibraryPage, BlogPage, TimelinesPage, AdminLayout } from '@zoroaster/ui';
import LearnPage from './pages/LearnPage';
import AuthorJourneyPostPage from './pages/learn/AuthorJourneyPostPage';
import WritingGuidePage from './pages/learn/WritingGuidePage';
import type { WikiPage, WikiPageWithSections } from '@zoroaster/shared';
import { fetchWikiPage } from '@zoroaster/shared';
import { WikiViewer } from '@zoroaster/ui';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import BetaApplication from './components/BetaApplication/BetaApplication';
import { CartProvider } from '@zoroaster/shared';
import ProfileDashboard from './pages/ProfileDashboard';
import AboutPage from './pages/AboutPage';
import ArtistCollaborationPage from './pages/ArtistCollaborationPage';
import SubscriptionManagementPage from './admin/SubscriptionManagementPage';
import { ProductManagementPage, OrderManagementPage, InventoryManagementPage, WorksManagementPage, MediaUploadPage } from '@zoroaster/ui';
import LearnPageAdmin from './pages/admin/LearnPageAdmin';
import BookUploadForm from './admin/components/BookUploadForm'; // Added import

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-4xl font-bold mb-4">{title}</h1>
    <p className="text-gray-600">This page is under construction.</p>
  </div>
);

const NotFoundPage = () => <PlaceholderPage title="Page Not Found" />;

const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuth(); // isLoading is handled by AppContent
  console.log('PublicLayout', { isAuthenticated }); // Removed isLoading from log

  return (
    <>
      <StarsBackground />
      <Layout 
        isAuthenticated={isAuthenticated}
        betaApplicationStatus={"none"} // This needs to be updated with real data
        onLogout={() => supabase.auth.signOut()}
      >
        <Outlet />
      </Layout>
    </>
  );
};

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, userProfile, isAdmin } = useAuth(); // isLoading is handled by AppContent
  const navigate = useNavigate();
  console.log('ProtectedLayout', { isAuthenticated, userProfile, isAdmin }); // Removed isLoading from log

  useEffect(() => {
    if (!isAuthenticated) { // isLoading is handled by AppContent
      navigate('/login');
    }
  }, [isAuthenticated, navigate]); // Removed isLoading from dependency array

  if (!isAuthenticated) { // isLoading is handled by AppContent
    return null; // AppContent handles loading, this just redirects if not authenticated
  }

  return (
    <>
      <StarsBackground />
      <Layout 
        isAuthenticated={isAuthenticated}
        betaApplicationStatus={"none"} // This needs to be updated with real data
        onLogout={() => supabase.auth.signOut()}
      >
        <Outlet />
      </Layout>
    </>
  );
};

import { Toaster } from 'react-hot-toast';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CheckoutPage from './pages/CheckoutPage';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const AppContent: React.FC = () => {
  const { isLoading, isAuthenticated, user } = useAuth(); // Get isLoading from useAuth
  const params = useParams();
  const [currentPage, setCurrentPage] = React.useState<WikiPageWithSections | null>(null);

  React.useEffect(() => {
    if (params.pageSlug) {
      fetchWikiPage(params.pageSlug).then(setCurrentPage);
    }
  }, [params.pageSlug]);

  if (isLoading) {
    return <LoadingSkeleton />; // Render loading state while AuthProvider is loading
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<HomePage />} />

      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<PlaceholderPage title="Store" />} />
        <Route path="/wiki" element={<WikiViewer />} />
        <Route path="/wiki/:folderSlug" element={<WikiViewer />} />
        <Route path="/wiki/:folderSlug/:pageSlug" element={<WikiViewer />} />
        <Route path="/timelines" element={<TimelinesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<PlaceholderPage title="Blog Post" />} />
        <Route path="/artist-collaboration" element={<ArtistCollaborationPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/authors-journey/:slug" element={<AuthorJourneyPostPage />} />
        <Route path="/learn/writing-guides/:slug" element={<WritingGuidePage />} />
        <Route path="/:slug" element={<PlaceholderPage title="Page" />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/account/*" element={<ProfileDashboard />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/subscriptions" element={<SubscriptionPage />} />
        <Route path="/subscription-success" element={<SubscriptionSuccessPage />} />
        <Route path="/checkout" element={<Elements stripe={stripePromise}><CheckoutPage /></Elements>} />
        <Route path="/read/:workId" element={<PlaceholderPage title="Work Reader" />} />
        <Route path="/beta/application" element={<BetaApplication supabaseClient={supabase} user={user} />} />
        <Route path="/beta/status" element={<BetaApplication supabaseClient={supabase} user={user} />} />
        <Route path="/beta/handbook" element={<PlaceholderPage title="Beta Reader Handbook" />} />
        <Route path="/beta/timeline" element={<PlaceholderPage title="Operational Timeline" />} />
        <Route path="/beta/nda" element={<PlaceholderPage title="NDA" />} />
        <Route path="/beta/feedback" element={<PlaceholderPage title="Beta Feedback" />} />
        <Route path="/beta/portal" element={<PlaceholderPage title="Beta Portal" />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <CartProvider className="bg-red-500">
      <Toaster />
      <AppContent />
    </CartProvider>
  );
};

export default App;