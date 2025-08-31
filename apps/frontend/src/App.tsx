import React, { useState, useEffect } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { 
  Layout, 
  HomePage,
  AdminStorePage, 
  LibraryPage, 
  SubscriptionPage, 
  SubscriptionSuccessPage, 
  WikiViewer, 
  CharactersPage, 
  LocationsPage, 
  GlossaryPage, 
  ReviewsPage, 
  AccountPage, 
  BlogPage, 
  NotFoundPage, 
  BetaPortalPage, 
  BetaApplicationStatusPage, 
  WorkReaderPage, 
  CheckoutPage, 
  AdminProtectedRoute, 
  AdminLayout, 
  DashboardPage, 
  HomepageContentManager, 
  PostsManager, 
  PagesManager, 
  CharactersManager, 
  WorksManager, 
  AdminUploadPage, 
  UsersManagement, 
  StarsBackground, 
  ChapterUploadPage, 
  WikiManager, 
  WikiEditor,
  TimelineManager,
  BetaReaderHandbookPage,
  OperationalTimelinePage,
  ViewNDAPage,
  BetaFeedbackPage,
  LoginPage
} from '@zoroaster/ui';
import { WikiPage, WikiPageWithSections, fetchWikiPage } from '@zoroaster/shared';  // Import the type
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import BetaApplicationsManager from './admin/BetaApplicationsManager';
import Timelines from './pages/Timelines';
import BetaApplication from './components/BetaApplication/BetaApplication'; // Import the new BetaApplication component

import { CartProvider } from '@zoroaster/shared';

import StorePage from './pages/StorePage'; // This one is local
import LocalWikiPage from './pages/WikiPage'; // This one is local
import BlogPostPage from './pages/BlogPostPage'; // This one is local
import GenericPage from './pages/GenericPage'; // This one is local
import ProfileDashboard from './pages/ProfileDashboard'; // New Profile Dashboard
import ArtistCollaborationPage from './pages/ArtistCollaborationPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState<WikiPageWithSections | null>(null);
  const params = useParams();

  React.useEffect(() => {
    if (params.pageSlug) {
      fetchWikiPage(params.pageSlug).then(setCurrentPage);
    }
  }, [params.pageSlug]);

  return (
    <CartProvider>
      <StarsBackground />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Public and general routes with the main layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/subscriptions" element={<SubscriptionPage />} />
          <Route path="/subscription-success" element={<SubscriptionSuccessPage />} />
          
          {/* Wiki Routes */}
          <Route path="/wiki">
            <Route index element={currentPage ? <WikiViewer page={currentPage} /> : <div>Loading...</div>} />
            <Route path=":folderSlug" element={currentPage ? <WikiViewer page={currentPage} /> : <div>Loading...</div>} />
            <Route path=":folderSlug/:pageSlug" element={currentPage ? <WikiViewer page={currentPage} /> : <div>Loading...</div>} />
          </Route>
          
          <Route path="/timelines" element={<Timelines />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/account/*" element={<ProfileDashboard />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route 
            path="/beta/application" 
            element={
              <ProtectedRoute>
                <BetaApplication />
              </ProtectedRoute>
            } 
          />
          <Route path="/artist-collaboration" element={<ArtistCollaborationPage />} />
          <Route path="/read/:workId" element={<WorkReaderPage />} />
          <Route path="/beta/status" element={<BetaApplicationStatusPage />} />
          
          <Route path="/beta/handbook" element={<BetaReaderHandbookPage />} />
          <Route path="/beta/timeline" element={<OperationalTimelinePage />} />
          <Route path="/beta/nda" element={<ViewNDAPage />} />
          
          <Route path="/beta/feedback" element={<BetaFeedbackPage />} />
          
          <Route 
            path="/beta/portal"
            element={
              <ProtectedRoute>
                <BetaPortalPage />
              </ProtectedRoute>
            }
          />
          <Route path="/:slug" element={<GenericPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin routes with the new AdminLayout */}
        <Route 
          path="/account/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="homepage-content" element={<HomepageContentManager />} />
          <Route path="posts" element={<PostsManager />} />
          <Route path="pages" element={<PagesManager />} />
          <Route path="characters" element={<CharactersManager />} />
          <Route path="works" element={<WorksManager />} />
          <Route path="upload-work" element={<AdminUploadPage />} />
          <Route path="upload-chapter" element={<ChapterUploadPage />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="beta-applications" element={<BetaApplicationsManager />} />
          
          {/* Wiki Management Routes */}
          <Route path="wiki" element={<WikiManager />} />
          <Route path="wiki/folder/:folderId" element={<WikiManager />} />
          <Route path="wiki/new" element={<WikiEditor />} />
          <Route path="wiki/edit/:id" element={<WikiEditor />} />
          
          {/* Timeline Manager Route */}
          <Route path="timeline/events" element={<TimelineManager />} />
          
          {/* Placeholder routes for other sections */}
          <Route path="store" element={<AdminStorePage />} />
          <Route path="library" element={<div>Library Management Coming Soon!</div>} />
          <Route path="characters" element={<div>Characters Management Coming Soon!</div>} />
          <Route path="beta-program" element={<div>Beta Program Management Coming Soon!</div>} />
          <Route path="media" element={<div>Media Management Coming Soon!</div>} />
          <Route path="settings" element={<div>Settings Coming Soon!</div>} />
        </Route>
      </Routes>
    </CartProvider>
  );
};

export default App;
