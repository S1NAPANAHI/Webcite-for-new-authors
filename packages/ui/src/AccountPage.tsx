import React, { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { getUserStats } from '@zoroaster/shared/userStats';
import { useAuth } from '@zoroaster/shared/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Award, Settings, Shield, LogOut, ChevronRight, User as UserIcon, Bookmark, Clock, Star, Lock } from 'lucide-react';

// Import sub-components for tabs
import { OverviewTab } from './OverviewTab.js';
import { ProfileTab } from './ProfileTab.js';
import { ReadingTab } from '@zoroaster/ui';
import { AchievementsTab } from '@zoroaster/ui';
import { PreferencesTab } from '@zoroaster/ui';
import { SecurityTab } from '@zoroaster/ui';

// Tab interface for type safety
interface Tab {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export const AccountPage = () => {
  const { user, userProfile: authUserProfile, isLoading: loading, isAuthenticated } = useAuth(); // Use useAuth hook
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null); // Keep local error state for other errors
  const navigate = useNavigate();

  const userProfile = authUserProfile;

  // Redirect if not authenticated and not loading
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // navigate('/login');
    }
  }, [loading, isAuthenticated]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // navigate('/login');
  };

  // This function will now update the userProfile state from useAuth
  const handleProfileUpdate = (updatedProfile: Partial<any>) => {
    // This will trigger a re-fetch in useAuth, or you can directly update the state if useAuth provides a setter
    // For now, we'll rely on useAuth's internal state management after a profile update
    // If you need immediate UI update, you might need to pass a setter from useAuth or re-fetch here.
    // For simplicity, we assume useAuth will handle the state update after a successful profile change.
    // If userProfile is null, we can't update it.
    if (userProfile) {
      // This is a temporary local update for immediate UI feedback.
      // The actual source of truth should be updated via supabase in ProfileTab.
      // useAuth will eventually re-fetch and update its userProfile state.
      // For now, we'll just ensure the ProfileTab can still pass updates.
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-4 text-text-light">Loading your profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full max-w-2xl" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-text-light text-lg mb-4">No profile data found.</p>
          <button
            onClick={() => /* navigate('/login') */ null}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Tab configuration
  const tabs: Tab[] = [
    {
      id: 'overview',
      name: 'Overview',
      icon: <UserIcon size={18} />,
      component: <OverviewTab userProfile={userProfile as any} />
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: <User size={18} />,
      component: <ProfileTab userProfile={userProfile as any} onProfileUpdate={handleProfileUpdate} />
    },
    {
      id: 'reading',
      name: 'Reading',
      icon: <BookOpen size={18} />,
      component: <ReadingTab userProfile={userProfile as any} />
    },
    {
      id: 'achievements',
      name: 'Achievements',
      icon: <Award size={18} />,
      component: <AchievementsTab userProfile={userProfile as any} />
    },
    {
      id: 'preferences',
      name: 'Preferences',
      icon: <Settings size={18} />,
      component: <PreferencesTab userProfile={userProfile as any} />
    },
    {
      id: 'security',
      name: 'Security',
      icon: <Shield size={18} />,
      component: <SecurityTab userProfile={userProfile as any} />
    }
  ];

  // Stats for the overview card
  const stats = [
    { label: 'Books Read', value: userProfile.books_read || 0, icon: <Bookmark size={16} /> },
    { label: 'Reading Goal', value: `${userProfile.reading_goal || 0} books`, icon: <Star size={16} /> },
    { label: 'Reading Streak', value: `${userProfile.reading_streak || 0} days`, icon: <Clock size={16} /> },
    { label: 'Account Security', value: 'Strong', icon: <Lock size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker text-text-light">
      {/* Header */}
      <div className="bg-background-darker/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Account Dashboard</h1>
              <p className="mt-2 text-gray-400">Manage your profile and preferences</p>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-red-600 text-red-400 rounded-md hover:bg-red-600/10 transition-colors duration-200"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-background-light/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800">
              {/* Profile Card */}
              <div className="p-6 text-center border-b border-gray-800">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white">
                    {(userProfile.display_name || userProfile.username || ' ').charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-1 -right-1 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
                    <UserIcon size={16} />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">{userProfile.display_name || userProfile.username}</h2>
                <p className="text-sm text-gray-400">{userProfile.role || 'Member'}</p>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                <ul className="space-y-1">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                          }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{tab.icon}</span>
                          {tab.name}
                        </div>
                        <ChevronRight size={16} className="text-gray-500" />
                      </button>
                    </li>
                  ))}
                  {userProfile.role === 'admin' && (
                    <li>
                      <a
                        href="/admin"
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-amber-400 rounded-lg hover:bg-amber-900/20 transition-colors"
                      >
                        <div className="flex items-center">
                          <Shield size={18} className="mr-3" />
                          Admin Dashboard
                        </div>
                        <ChevronRight size={16} />
                      </a>
                    </li>
                  )}
                </ul>
              </nav>
            </div>

            {/* Stats Card */}
            {activeTab === 'overview' && (
              <div className="mt-6 bg-background-light/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400 mb-4">YOUR STATS</h3>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {stat.icon}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-300">{stat.label}</p>
                        <p className="text-lg font-semibold text-white">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-background-light/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-6">
                {tabs.find(tab => tab.id === activeTab)?.component}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};


