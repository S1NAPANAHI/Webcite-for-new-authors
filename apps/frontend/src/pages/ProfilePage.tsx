import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@zoroaster/shared';

// Import sub-components for tabs (will be created later)
// import OverviewTab from '../../components/profile/OverviewTab';
// import ProfileTab from '../../components/profile/ProfileTab';
// Removed corrupted import
// import AchievementsTab from '../../components/profile/AchievementsTab';
// import PreferencesTab from '../../components/profile/PreferencesTab';
// import SecurityTab from '../../components/profile/SecurityTab';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { user, userProfile, isLoading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // No need for a separate timeout useEffect here, as isLoading and error are managed by AuthContext
  // and the rendering logic below handles them.

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-text-light">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-400 p-4 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-secondary text-background-dark rounded-md hover:bg-opacity-90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="flex justify-center items-center min-h-screen text-text-light">No profile data found.</div>;
  }

