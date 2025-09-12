import React from 'react';
import { Route, Routes, Outlet, useParams, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  StarsBackground,
  LoadingSkeleton,
  // Import LoginPage from UI package
  LoginPage,
  // Use UI HomePage temporarily to fix build
  HomePage
} from '@zoroaster/ui';
import { AuthProvider, useAuth, supabase } from '@zoroaster/shared';
import { SubscriptionPage, SubscriptionSuccessPage, LibraryPage, BlogPage, TimelinesPage } from '@zoroaster/ui';
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

// Placeholder components for routes that don't have implementations yet
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-4xl font-bold mb-4">{title}</h1>
    <p className="text-gray-600">This page is under construction.</p>
  </div>
);

const NotFoundPage = () => <PlaceholderPage title="Page Not Found" />;

// Layout wrapper that handles authentication
const AuthenticatedLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <LoadingSkeleton />;
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

const AppContent: React.FC = () => {
  const { supabaseClient, user } = useAuth();
  const params = useParams();
  const [currentPage, setCurrentPage] = React.useState<WikiPageWithSections | null>(null);

  React.useEffect(() => {
    if (params.pageSlug) {
      fetchWikiPage(params.pageSlug).then(setCurrentPage);
    }
  }, [params.pageSlug]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AuthenticatedLayout />}>
        <Route path="/auth/callback" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<PlaceholderPage title="Store" />} />
        <Route path="/checkout" element={<PlaceholderPage title="Checkout" />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/subscriptions" element={<SubscriptionPage />} />
        <Route path="/subscription-success" element={<SubscriptionSuccessPage />} />
        <Route path="/stripe-test" element={<PlaceholderPage title="Stripe Test" />} />
        
        <Route path="/wiki">
          <Route index element={<WikiViewer />} />
          <Route path=":folderSlug" element={<WikiViewer />} />
          <Route path=":folderSlug/:pageSlug" element={<WikiViewer />} />
        </Route>
        
        <Route path="/timelines" element={<TimelinesPage />} />
        
        <Route path="/locations" element={<PlaceholderPage title="Locations" />} />
        <Route path="/glossary" element={<PlaceholderPage title="Glossary" />} />
        <Route path="/reviews" element={<PlaceholderPage title="Reviews" />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/account/*" element={<ProfileDashboard />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<PlaceholderPage title="Blog Post" />} />
        <Route path="/beta/application" element={<BetaApplication supabaseClient={supabaseClient} user={user} />} />
        <Route path="/artist-collaboration" element={<ArtistCollaborationPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/authors-journey/:slug" element={<AuthorJourneyPostPage />} />
        <Route path="/learn/writing-guides/:slug" element={<WritingGuidePage />} />
        <Route path="/read/:workId" element={<PlaceholderPage title="Work Reader" />} />
        <Route path="/beta/status" element={<BetaApplication supabaseClient={supabaseClient} user={user} />} />
        
        <Route path="/beta/handbook" element={<PlaceholderPage title="Beta Reader Handbook" />} />
        <Route path="/beta/timeline" element={<PlaceholderPage title="Operational Timeline" />} />
        <Route path="/beta/nda" element={<PlaceholderPage title="NDA" />} />
        
        <Route path="/beta/feedback" element={<PlaceholderPage title="Beta Feedback" />} />
        
        <Route path="/beta/portal" element={<PlaceholderPage title="Beta Portal" />} />
        <Route path="/:slug" element={<PlaceholderPage title="Page" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider supabaseClient={supabase}>
      <CartProvider className="bg-red-500">
        <Toaster />
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;