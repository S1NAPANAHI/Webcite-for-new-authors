import React, { useEffect } from 'react';
import { Route, Routes, Outlet, useParams, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  LoadingSkeleton,
  LoginPage,
  HomePage
} from '@zoroaster/ui';
import { AuthProvider, useAuth, supabase } from '@zoroaster/shared';
import { SubscriptionPage, SubscriptionSuccessPage, LibraryPage, BlogPage, TimelinesPage } from '@zoroaster/ui';
import AdminLayout from './components/admin/AdminLayout';
import LearnPage from './pages/LearnPage';
import AuthorJourneyPostPage from './pages/learn/AuthorJourneyPostPage';
import WritingGuidePage from './pages/learn/WritingGuidePage';
import type { WikiPage, WikiPageWithSections } from '@zoroaster/shared';
import { fetchWikiPage } from '@zoroaster/shared';
import { WikiViewer } from '@zoroaster/ui';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import BetaApplication from './components/BetaApplication/BetaApplication';
import { CartProvider } from '@zoroaster/shared';
import ProfileDashboard from './pages/ProfileDashboard';
import AboutPage from './pages/AboutPage';
import ArtistCollaborationPage from './pages/ArtistCollaborationPage';
import SubscriptionManagementPage from './admin/SubscriptionManagementPage';
import { InventoryManagementPage, MediaUploadPage } from '@zoroaster/ui';
import WorksManagementPage from './pages/admin/content/WorksManager';
import ProductManagementPage from './pages/admin/commerce/ProductManagementPage';
import OrderManagementPage from './pages/admin/commerce/OrderManagementPage';
import CustomerManagementPage from './pages/admin/commerce/CustomerManagementPage';
import LearnPageAdmin from './pages/admin/LearnPageAdmin';
import AdminEditorTestPage from './pages/AdminEditorTestPage';
import BookUploadForm from './admin/components/BookUploadForm';
import AdminDashboard from './pages/AdminDashboard';
import PagesManager from './pages/admin/content/PagesManager';
import BlogManager from './pages/admin/content/BlogManager';
import BlogPostEditor from './pages/admin/content/BlogPostEditor';
import AnalyticsPage from './pages/admin/analytics/AnalyticsPage';
import ChaptersManager from './pages/admin/content/ChaptersManager';
import ChapterEditor from './pages/admin/content/ChapterEditor';
import WorksManager from './pages/admin/content/WorksManager';
import WorkEditor from './pages/admin/content/WorkEditor';
import BetaApplicationsManager from './pages/admin/beta/BetaApplicationsManager';
import WikiManager from './pages/admin/world/WikiManager';
import TimelineManager from './pages/admin/world/TimelineManager';
import CharacterManager from './pages/admin/world/CharacterManager';
// New imports for hierarchical content system
import LibraryPageNew from './pages/LibraryPage';
import ContentItemDetailPage from './pages/ContentItemDetailPage';
import MyLibraryPage from './pages/account/MyLibraryPage';
import ChapterReaderPage from './pages/ChapterReaderPage';
// NEW: File Manager Import
import FileManagerPage from './pages/FileManagerPage';
// UPDATED: Clean Background System
import CleanBackground from './components/CleanBackground';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-4xl font-bold mb-4 text-foreground">{title}</h1>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
);

const NotFoundPage = () => <PlaceholderPage title="Page Not Found" />;

const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  console.log('PublicLayout', { isAuthenticated });

  return (
    <CleanBackground>
      <Layout 
        isAuthenticated={isAuthenticated}
        betaApplicationStatus={"none"}
        onLogout={() => supabase.auth.signOut()}
      >
        <Outlet />
      </Layout>
    </CleanBackground>
  );
};

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, userProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  console.log('ProtectedLayout', { isAuthenticated, userProfile, isAdmin });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <CleanBackground>
      <Layout 
        isAuthenticated={isAuthenticated}
        betaApplicationStatus={"none"}
        onLogout={() => supabase.auth.signOut()}
      >
        <Outlet />
      </Layout>
    </CleanBackground>
  );
};

import { Toaster } from 'react-hot-toast';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CheckoutPage from './pages/CheckoutPage';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const AppContent: React.FC = () => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const params = useParams();
  const [currentPage, setCurrentPage] = React.useState<WikiPageWithSections | null>(null);

  React.useEffect(() => {
    if (params.pageSlug) {
      fetchWikiPage(params.pageSlug).then(setCurrentPage);
    }
  }, [params.pageSlug]);

  if (isLoading) {
    return (
      <CleanBackground>
        <LoadingSkeleton />
      </CleanBackground>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={
        <CleanBackground>
          <LoginPage />
        </CleanBackground>
      } />
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
        
        {/* New Library Routes */}
        <Route path="/library" element={<LibraryPageNew />} />
        <Route path="/library/:type/:slug" element={<ContentItemDetailPage />} />
        
        {/* Chapter Reader Routes - FIXED: Clean URL structure with proper parameter names */}
        <Route path="/read/:issueSlug/chapter/:chapterSlug" element={<ChapterReaderPage />} />
        <Route path="/read/:issueSlug/:chapterSlug" element={<ChapterReaderPage />} />
        
        {/* Legacy support for old UUID-based URLs - redirect to clean URLs */}
        <Route path="/read/:issueSlug/:chapterUuid" element={<ChapterReaderPage />} />
        
        <Route path="/:slug" element={<PlaceholderPage title="Page" />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/account/*" element={<ProfileDashboard />} />
        <Route path="/account/reading" element={<MyLibraryPage />} />
        <Route path="/library-old" element={<LibraryPage />} />
        <Route path="/subscriptions" element={<SubscriptionPage />} />
        <Route path="/subscription-success" element={<SubscriptionSuccessPage />} />
        <Route path="/checkout" element={<Elements stripe={stripePromise}><CheckoutPage /></Elements>} />
        <Route path="/beta/application" element={<BetaApplication supabaseClient={supabase} user={user} />} />
        <Route path="/beta/status" element={<BetaApplication supabaseClient={supabase} user={user} />} />
        <Route path="/beta/handbook" element={<PlaceholderPage title="Beta Reader Handbook" />} />
        <Route path="/beta/timeline" element={<PlaceholderPage title="Operational Timeline" />} />
        <Route path="/beta/nda" element={<PlaceholderPage title="NDA" />} />
        <Route path="/beta/feedback" element={<PlaceholderPage title="Beta Feedback" />} />
        <Route path="/beta/portal" element={<PlaceholderPage title="Beta Portal" />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <CleanBackground>
            <AdminLayout />
          </CleanBackground>
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        
        <Route path="content/pages" element={<PagesManager />} />
        <Route path="content/blog" element={<BlogManager />} />
        <Route path="content/blog/new" element={<BlogPostEditor />} />
        <Route path="content/blog/:id/edit" element={<BlogPostEditor />} />
        
        {/* UPDATED: File Manager Route - replaces old MediaUploadPage */}
        <Route path="content/files" element={<FileManagerPage />} />
        
        <Route path="content/chapters" element={<ChaptersManager />} />
        <Route path="content/chapters/new" element={<ChapterEditor />} />
        <Route path="content/chapters/:id/edit" element={<ChapterEditor />} />
        <Route path="content/chapters/issue/:issueId/new" element={<ChapterEditor />} />
        <Route path="content/homepage" element={<PlaceholderPage title="Homepage" />} />
        <Route path="content/about" element={<PlaceholderPage title="About" />} />

        <Route path="world/wiki" element={<WikiManager />} />
        <Route path="world/timelines" element={<TimelineManager />} />
        <Route path="world/characters" element={<CharacterManager />} />
        <Route path="world/artists" element={<PlaceholderPage title="Artist Collab" />} />

        {/* Updated Works Routes */}
        <Route path="content/works" element={<WorksManager />} />
        <Route path="content/works/new" element={<WorkEditor />} />
        <Route path="content/works/:id/edit" element={<WorkEditor />} />

        <Route path="commerce/shop" element={<PlaceholderPage title="Shop" />} />
        <Route path="commerce/orders" element={<OrderManagementPage />} />
        <Route path="commerce/customers" element={<CustomerManagementPage />} />
        
        <Route path="beta/applications" element={<BetaApplicationsManager />} />
        <Route path="beta/managers" element={<PlaceholderPage title="Managers" />} />
        <Route path="beta/activity" element={<PlaceholderPage title="Activity" />} />

        <Route path="settings/users" element={<PlaceholderPage title="Users" />} />
        <Route path="settings/roles" element={<PlaceholderPage title="Roles" />} />
        <Route path="settings/integrations" element={<PlaceholderPage title="Integrations" />} />
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