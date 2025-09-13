import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate, Outlet, Routes, Route, useLocation, Link } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { supabase, getUserStats, getSubscription, useAuth } from '@zoroaster/shared';
import type { UserStats, Subscription } from '@zoroaster/shared';
import {
  BookOpen,
  Clock,
  Shield,
  Settings,
  Award,
  Home,
  LogOut,
  ChevronRight,
  User as UserIcon,
  Bookmark as BookmarkIcon,
  Crown,
  CheckCircle
} from 'lucide-react';


interface UserStatus {
  isSubscribed: boolean;
  subscriptionTier?: 'free' | 'premium' | 'patron';
  betaReaderStatus: 'not_applied' | 'pending' | 'approved' | 'rejected';
  subscriptionEndDate?: string;
  booksRead: number;
  readingHours: number;
  currentlyReading: string;
  achievements: number;
  username: string;
  onSignOut: () => void;
}

export const OverviewContent: React.FC<{ userId: string } & Omit<UserStatus, 'userId'>> = ({
  userId,
  isSubscribed,
  subscriptionTier = 'free',
  betaReaderStatus,
  subscriptionEndDate,
  booksRead,
  readingHours,
  currentlyReading,
  achievements,
  username,
  onSignOut
}) => {
  // Fetch user activities
  const { data: activities, isLoading: isLoadingActivities, isError: isErrorActivities } = useQuery({
    queryKey: ['userActivities', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoadingActivities) {
    return <div className="text-gray-100">Loading activities...</div>;
  }

  if (isErrorActivities) {
    return <div className="text-red-400">Error loading activities.</div>;
  }

  // Stats for the overview card
  const stats = [
    { label: 'Books Read', value: booksRead, icon: <BookOpen size={20} className="text-indigo-400" /> },
    { label: 'Reading Hours', value: `${readingHours}h`, icon: <Clock size={20} className="text-green-400" /> },
    { label: 'Currently Reading', value: currentlyReading || 'None', icon: <BookmarkIcon size={20} className="text-blue-400" /> },
    { label: 'Achievements', value: achievements, icon: <Award size={20} className="text-yellow-400" /> }
  ];

  // Format subscription end date if exists
  const formattedEndDate = subscriptionEndDate
    ? new Date(subscriptionEndDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  // Get subscription tier display name and color
  const getSubscriptionTierInfo = (tier: string) => {
    switch(tier) {
      case 'premium':
        return { name: 'Premium', color: 'bg-blue-500' };
      case 'patron':
        return { name: 'Patron', color: 'bg-purple-500' };
      default:
        return { name: 'Free', color: 'bg-gray-500' };
    }
  };

  const subscriptionInfo = getSubscriptionTierInfo(subscriptionTier);

  // Get beta reader status display info
  const getBetaReaderStatusInfo = (status: string) => {
    switch(status) {
      case 'approved':
        return { text: 'Beta Reader', color: 'bg-green-500', icon: <CheckCircle size={16} /> };
      case 'pending':
        return { text: 'Application Pending', color: 'bg-yellow-500', icon: <Clock size={16} /> };
      case 'rejected':
        return { text: 'Application Rejected', color: 'bg-red-500', icon: <Shield size={16} /> };
      default:
        return { text: 'Not Applied', color: 'bg-gray-500', icon: <UserIcon size={16} /> };
    }
  };

  const betaReaderInfo = getBetaReaderStatusInfo(betaReaderStatus);

  return (
    <div className="space-y-6">
      {/* Header with Welcome and Sign Out */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Account Dashboard</h1>
          <p className="text-gray-400">Welcome back, {username || 'User'}</p>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subscription Status */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Subscription Status</h3>
              <div className="flex items-center mt-2">
                <span className={`w-3 h-3 rounded-full mr-2 ${subscriptionInfo.color}`}></span>
                <span className="text-white">{subscriptionInfo.name} Tier</span>
              </div>
              {isSubscribed && subscriptionEndDate && (
                <p className="text-sm text-gray-400 mt-1">Renews on {formattedEndDate}</p>
              )}
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <Crown size={24} className="text-yellow-400" />
            </div>
          </div>
          {!isSubscribed && (
            <button className="mt-4 w-full py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium">
              Upgrade Plan
            </button>
          )}
        </div>

        {/* Beta Reader Status */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Beta Reader Program</h3>
              <div className="flex items-center mt-2">
                <span className={`w-3 h-3 rounded-full mr-2 ${betaReaderInfo.color}`}></span>
                <span className="text-white">{betaReaderInfo.text}</span>
              </div>
              {betaReaderStatus === 'not_applied' && (
                <p className="text-sm text-gray-400 mt-1">Apply to get early access to new content</p>
              )}
              {betaReaderStatus === 'pending' && (
                <p className="text-sm text-yellow-400 mt-1">We'll review your application soon</p>
              )}
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              {betaReaderInfo.icon}
            </div>
          </div>
          {betaReaderStatus === 'approved' ? (
            <Link to="/beta/portal" className="mt-4 w-full py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <BookOpen size={16} />
              Go to Beta Portal
            </Link>
          ) : (
            <Link to={betaReaderStatus === 'not_applied' ? '/beta/application' : '/beta/status'} className="mt-4 w-full block text-center py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium">
              {betaReaderStatus === 'not_applied' ? 'Apply Now' : 'View Application Status'}
            </Link>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-background-light/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-background-light/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-800/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    {activity.cover_image_url ? (
                      <img
                        src={activity.cover_image_url}
                        alt={activity.item_title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-green-600/20' : 'bg-indigo-600/20'
                      }`}>
                        {activity.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-indigo-400" />
                        )}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-white">{activity.item_title}</h3>
                      <p className="text-sm text-gray-400">
                        {activity.status === 'completed' ? 'Completed' : 'In Progress'}
                      </p>
                    </div>
                  </div>
                  {activity.status !== 'completed' && (
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${(activity.progress / (activity.total_progress || 100)) * 100}%` }}
                        />
                      </div>
                      <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        Resume
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileContent: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    website: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Profile updated:', formData);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 mt-1">Manage your personal information and account settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800/50 rounded-xl p-6 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-12 h-12 text-gray-400" />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-lg transform translate-y-1/3 group-hover:translate-y-0 transition-transform duration-200"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Profile Photo</h3>
              <p className="text-sm text-gray-400">JPG, GIF or PNG. Max size of 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your location"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

// Mock data for reading history
const readingHistory = [
  {
    id: 1,
    title: "The Gathas of Zarathushtra",
    author: "Zarathushtra",
    cover: "/covers/gathas.jpg",
    progress: 75,
    lastRead: "2 days ago",
    totalPages: 320,
    currentPage: 240,
    category: "Religious Text"
  },
  {
    id: 2,
    title: "The Denkard",
    author: "Various Authors",
    cover: "/covers/denkard.jpg",
    progress: 30,
    lastRead: "1 week ago",
    totalPages: 450,
    currentPage: 135,
    category: "Religious Text"
  },
  {
    id: 3,
    title: "Zoroastrianism: An Introduction",
    author: "Jenny Rose",
    cover: "/covers/zoroastrianism-intro.jpg",
    progress: 100,
    lastRead: "3 weeks ago",
    totalPages: 280,
    currentPage: 280,
    category: "Non-Fiction"
  }
];

export const ReadingContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'reading' | 'completed'>('all');

  const filteredBooks = readingHistory.filter(book => {
    if (activeTab === 'all') return true;
    if (activeTab === 'reading') return book.progress < 100;
    return book.progress === 100;
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Reading History</h1>
        <p className="text-gray-400 mt-1">Track your reading progress and history.</p>
      </div>

      <div className="flex space-x-2 mb-6 p-1 bg-gray-800/50 rounded-lg">
        {[
          { id: 'all', label: 'All Books' },
          { id: 'reading', label: 'Currently Reading' },
          { id: 'completed', label: 'Completed' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div key={book.id} className="bg-gray-800/50 rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 flex-shrink-0">
                    <div className="aspect-[2/3] bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/150x225?text=No+Cover';
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col h-full">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-white">{book.title}</h3>
                            <p className="text-gray-400">{book.author}</p>
                          </div>
                          <span className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                            {book.category}
                          </span>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Progress: {book.progress}%</span>
                            <span>Page {book.currentPage} of {book.totalPages}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${book.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                        <span className="text-sm text-gray-400">Last read {book.lastRead}</span>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 text-sm font-medium text-white bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
                            {book.progress < 100 ? 'Continue Reading' : 'Read Again'}
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl">
            <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No books found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {activeTab === 'all'
                ? "You haven't added any books to your library yet."
                : activeTab === 'reading'
                ? "You don't have any books in progress."
                : "You haven't completed any books yet."}
            </p>
            <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors">
              Browse Library
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data for achievements
const achievements = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first reading session',
    icon: '🏆',
    progress: 100,
    unlocked: true,
    date: '2023-10-15',
    rarity: 'common'
  },
  {
    id: 2,
    title: 'Book Worm',
    description: 'Read for 10 hours',
    icon: '📚',
    progress: 75,
    unlocked: false,
    date: null,
    rarity: 'uncommon'
  },
  {
    id: 3,
    title: 'Zoroastrian Scholar',
    description: 'Read all core Zoroastrian texts',
    icon: '📜',
    progress: 30,
    unlocked: false,
    date: null,
    rarity: 'rare'
  },
  {
    id: 4,
    title: 'Daily Devotee',
    description: 'Read for 7 days in a row',
    icon: '🔥',
    progress: 42,
    unlocked: false,
    date: null,
    rarity: 'uncommon'
  },
  {
    id: 5,
    title: 'Knowledge Seeker',
    description: 'Complete 50 reading sessions',
    icon: '🔍',
    progress: 100,
    unlocked: true,
    date: '2023-11-02',
    rarity: 'rare'
  },
  {
    id: 6,
    title: 'Wisdom Keeper',
    description: 'Achieve 100% completion on any text',
    icon: '🧠',
    progress: 0,
    unlocked: false,
    date: null,
    rarity: 'epic'
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-500/20 border-gray-500';
    case 'uncommon': return 'bg-emerald-500/20 border-emerald-500';
    case 'rare': return 'bg-blue-500/20 border-blue-500';
    case 'epic': return 'bg-purple-500/20 border-purple-500';
    case 'legendary': return 'bg-amber-500/20 border-amber-500';
    default: return 'bg-gray-500/20 border-gray-500';
  }
};

export const AchievementsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filteredAchievements = achievements.filter(achievement => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unlocked') return achievement.unlocked;
    return !achievement.unlocked;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <p className="text-gray-400 mt-1">Track your progress and unlock new milestones.</p>
      </div>

      {/* Progress Summary */}
      <div className="bg-gray-800/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-white">Achievement Progress</h3>
            <p className="text-gray-400">
              {unlockedCount} of {totalAchievements} achievements unlocked
            </p>
          </div>
          <div className="w-full md:w-64">
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-sm text-right text-gray-400 mt-1">{completionPercentage}% Complete</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 p-1 bg-gray-800/50 rounded-lg">
        {[
          { id: 'all', label: 'All Achievements' },
          { id: 'unlocked', label: 'Unlocked' },
          { id: 'locked', label: 'Locked' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map(achievement => (
            <div
              key={achievement.id}
              className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                achievement.unlocked
                  ? getRarityColor(achievement.rarity)
                  : 'bg-gray-800/30 border-gray-700 opacity-60'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-semibold ${
                    achievement.unlocked ? 'text-white' : 'text-gray-400'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {achievement.description}
                  </p>

                  {!achievement.unlocked && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        {achievement.progress}% complete
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {achievement.unlocked && achievement.date && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-400">
                    Unlocked on {new Date(achievement.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {achievement.unlocked && (
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl">
          <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">
            {activeTab === 'unlocked'
              ? "You haven't unlocked any achievements yet"
              : "No locked achievements found"}
          </h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {activeTab === 'unlocked'
              ? "Start reading and completing texts to unlock achievements!"
              : "You've unlocked all available achievements! More coming soon."}
          </p>
        </div>
      )}
    </div>
  );
};

export const PreferencesContent: React.FC = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: 'medium',
    notifications: true,
    emailNotifications: true,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    readingMode: 'paginated',
    autoSave: true,
    showProgress: true,
    showWordCount: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings to server
    console.log('Saving settings:', settings);
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all preferences to default?')) {
      setSettings({
        theme: 'dark',
        fontSize: 'medium',
        notifications: true,
        emailNotifications: true,
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        readingMode: 'paginated',
        autoSave: true,
        showProgress: true,
        showWordCount: true
      });
    }
  };

  const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <div className="space-y-4 pl-4 border-l-2 border-gray-700">
        {children}
      </div>
    </div>
  );

  const SettingRow: React.FC<{ label: string; description?: string; children: React.ReactNode }> =
    ({ label, description, children }) => (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-gray-700/50 last:border-0">
        <div className="flex-1">
          <label className="text-sm font-medium text-white">{label}</label>
          {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
        </div>
        <div className="sm:w-48">
          {children}
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Preferences</h1>
        <p className="text-gray-400 mt-1">Customize your experience on our platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <SettingSection title="Appearance">
          <SettingRow
            label="Theme"
            description="Choose between light and dark themes"
          >
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </SettingRow>

          <SettingRow
            label="Font Size"
            description="Adjust the text size across the application"
          >
            <select
              name="fontSize"
              value={settings.fontSize}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </SettingRow>
        </SettingSection>

        <SettingSection title="Notifications">
          <SettingRow
            label="Enable Notifications"
            description="Receive browser notifications"
          >
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="notifications"
                id="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="notifications"
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notifications ? 'bg-primary' : 'bg-gray-600'}`}
              ></label>
            </div>
          </SettingRow>

          <SettingRow
            label="Email Notifications"
            description="Receive notifications via email"
          >
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="emailNotifications"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="emailNotifications"
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.emailNotifications ? 'bg-primary' : 'bg-gray-600'}`}
              ></label>
            </div>
          </SettingRow>
        </SettingSection>

        <SettingSection title="Reading">
          <SettingRow
            label="Reading Mode"
            description="Choose how content is displayed"
          >
            <select
              name="readingMode"
              value={settings.readingMode}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="paginated">Paginated</option>
              <option value="scrolling">Scrolling</option>
            </select>
          </SettingRow>

          <SettingRow
            label="Auto-save Progress"
            description="Automatically save your reading progress"
          >
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="autoSave"
                id="autoSave"
                checked={settings.autoSave}
                onChange={handleChange}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="autoSave"
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.autoSave ? 'bg-primary' : 'bg-gray-600'}`}
              ></label>
            </div>
          </SettingRow>

          <SettingRow
            label="Show Reading Progress"
            description="Display progress indicators while reading"
          >
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="showProgress"
                id="showProgress"
                checked={settings.showProgress}
                onChange={handleChange}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="showProgress"
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.showProgress ? 'bg-primary' : 'bg-gray-600'}`}
              ></label>
            </div>
          </SettingRow>

          <SettingRow
            label="Show Word Count"
            description="Display word count for texts"
          >
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="showWordCount"
                id="showWordCount"
                checked={settings.showWordCount}
                onChange={handleChange}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="showWordCount"
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.showWordCount ? 'bg-primary' : 'bg-gray-600'}`}
              ></label>
            </div>
          </SettingRow>
        </SettingSection>

        <SettingSection title="Language & Region">
          <SettingRow
            label="Language"
            description="Select your preferred language"
          >
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="fa">فارسی</option>
              <option value="gu">ગુજરાતી</option>
            </select>
          </SettingRow>

          <SettingRow
            label="Time Zone"
            description="Set your local time zone"
          >
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tehran">Tehran (IRST)</option>
              <option value="Asia/Kolkata">Mumbai (IST)</option>
            </select>
          </SettingRow>
        </SettingSection>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium border border-gray-600 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #68D391;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #68D391;
        }
      `}</style>
    </div>
  );
};

export const SecurityContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'activity'>('overview');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock data for active sessions
  const activeSessions = [
    {
      id: '1',
      device: 'Windows 10, Chrome',
      location: 'New York, US',
      ip: '192.168.1.1',
      lastActive: '2 hours ago',
      current: true
    },
    {
      id: '2',
      device: 'iPhone 13, Safari',
      location: 'San Francisco, US',
      ip: '203.0.113.1',
      lastActive: '1 week ago',
      current: false
    },
    {
      id: '3',
      device: 'MacBook Pro, Safari',
      location: 'London, UK',
      ip: '198.51.100.1',
      lastActive: '2 weeks ago',
      current: false
    }
  ];

  // Mock security events
  const securityEvents = [
    {
      id: '1',
      type: 'login',
      description: 'Successful login from New York, US',
      device: 'Windows 10, Chrome',
      ip: '192.168.1.1',
      timestamp: '2023-11-15T14:30:00Z',
      status: 'success'
    },
    {
      id: '2',
      type: 'password_change',
      description: 'Password changed',
      device: 'iPhone 13, Safari',
      ip: '203.0.113.1',
      timestamp: '2023-11-10T09:15:00Z',
      status: 'info'
    },
    {
      id: '3',
      type: 'failed_login',
      description: 'Failed login attempt',
      device: 'Unknown',
      ip: '198.51.100.1',
      timestamp: '2023-11-05T18:45:00Z',
      status: 'warning'
    }
  ];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      // Simulate 2FA setup
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(true);

      // Generate backup codes
      const codes = Array.from({ length: 10 }, () =>
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      setBackupCodes(codes);
      setShowBackupCodes(true);

      setSuccess('Two-factor authentication has been enabled');
    } catch (err) {
      setError('Failed to enable two-factor authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTwoFactorEnabled(false);
        setBackupCodes([]);
        setSuccess('Two-factor authentication has been disabled');
      } catch (err) {
        setError('Failed to disable two-factor authentication');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const revokeSession = async () => {
    if (window.confirm('Are you sure you want to revoke this session?')) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setSuccess('Session has been revoked');
      } catch (err) {
        setError('Failed to revoke session');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Security Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account security and privacy settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 p-1 bg-gray-800/50 rounded-lg">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'sessions', label: 'Active Sessions' },
          { id: 'activity', label: 'Security Activity' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-300 rounded-lg">
          {success}
        </div>
      )}

      {/* Backup Codes Modal */}
      {showBackupCodes && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Save Your Backup Codes</h3>
              <button
                onClick={() => setShowBackupCodes(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Save these backup codes in a safe place. You can use them to access your account if you lose access to your authenticator app.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {backupCodes.map((code, index) => (
                <div key={index} className="bg-gray-700/50 p-2 rounded text-center font-mono">
                  {code}
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowBackupCodes(false)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                I've saved my codes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Change Password */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {twoFactorEnabled
                    ? 'Two-factor authentication is currently enabled.'
                    : 'Add an extra layer of security to your account.'}
                </p>
              </div>
              {twoFactorEnabled ? (
                <button
                  onClick={handleDisable2FA}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Disabling...' : 'Disable 2FA'}
                </button>
              ) : (
                <button
                  onClick={handleEnable2FA}
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Enabling...' : 'Enable 2FA'}
                </button>
              )}
            </div>

            {twoFactorEnabled && backupCodes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => setShowBackupCodes(true)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  View Backup Codes
                </button>
              </div>
            )}
          </div>

          {/* Security Tips */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Security Tips</h3>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex items-start">
                <span className="mr-2">🔒</span>
                <span>Use a strong, unique password that you don't use elsewhere.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔑</span>
                <span>Enable two-factor authentication for added security.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">👀</span>
                <span>Regularly review your active sessions and revoke any that look suspicious.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>Make sure your email account is secure, as it can be used to reset your password.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Active Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="bg-gray-800/50 rounded-xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
            <p className="text-sm text-gray-400 mb-6">
              This is a list of devices that have logged into your account. Revoke any sessions that you don't recognize.
            </p>

            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg ${
                    session.current ? 'bg-primary/10 border border-primary/30' : 'bg-gray-700/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-white">{session.device}</span>
                        {session.current && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                            Current Session
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {session.location} • {session.ip}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Last active: {session.lastActive}
                      </div>
                    </div>
                    {!session.current && (
                      <button
                        onClick={revokeSession}
                        disabled={isLoading}
                        className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-gray-800/50 rounded-xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Security Activity</h3>
            <p className="text-sm text-gray-400 mb-6">
              Review recent security events related to your account.
            </p>

            <div className="space-y-4">
              {securityEvents.map((event) => (
                <div key={event.id} className="p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      event.status === 'success' ? 'bg-green-500' :
                      event.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-white">{event.description}</h4>
                        <span className="text-xs text-gray-500">
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {event.device} • {event.ip}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



const ProfileDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const { user, userProfile, isAdmin, isLoading, isAuthenticated } = useAuth();

  const [displayProfile, setDisplayProfile] = useState({
    isSubscribed: false,
    subscriptionTier: 'free' as 'free' | 'premium' | 'patron',
    betaReaderStatus: 'not_applied' as 'not_applied' | 'pending' | 'approved' | 'rejected',
    subscriptionEndDate: undefined,
    booksRead: 0,
    readingHours: 0,
    currentlyReading: '',
    achievements: 0,
    username: 'User',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Update active tab based on URL
  useEffect(() => {
    const path = location.pathname.split('/').pop() || 'overview';
    setActiveTab(path === 'account' ? 'overview' : path);
  }, [location]);

  // Tab configuration
  const baseTabs = [
    { id: 'overview', name: 'Overview', icon: <Home size={18} />, path: '/account' },
    { id: 'profile', name: 'Profile', icon: <UserIcon size={18} />, path: '/account/profile' },
    { id: 'reading', name: 'Reading', icon: <BookOpen size={18} />, path: '/account/reading' },
    { id: 'achievements', name: 'Achievements', icon: <Award size={18} />, path: '/account/achievements' },
    { id: 'preferences', name: 'Preferences', icon: <Settings size={18} />, path: '/account/preferences' },
    { id: 'security', name: 'Security', icon: <Shield size={18} />, path: '/account/security' },
  ];

  // Add admin panel for admin users
  const adminTabs = isAdmin ? [
    { id: 'admin', name: 'Admin Control Panel', icon: <Crown size={18} />, path: '/account/admin' },
  ] : [];

  const tabs = useMemo(() => [...baseTabs, ...adminTabs], [isAdmin]);

  const { data: userStats, isLoading: isLoadingStats } = useQuery<UserStats | null>({
    queryKey: ['userStats', user?.id],
    queryFn: () => getUserStats(user!.id),
    enabled: !!user?.id,
  });

  const { data: subscription, isLoading: isLoadingSubscription } = useQuery<Subscription | null>({
    queryKey: ['subscription', user?.id],
    queryFn: () => getSubscription(user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (userProfile) {
      setDisplayProfile(prev => ({
        ...prev,
        username: userProfile.username || user?.email?.split('@')[0] || 'User',
        betaReaderStatus: (userProfile as any).beta_reader_status || 'not_applied',
      }));
    }
    if (userStats) {
      setDisplayProfile(prev => ({
        ...prev,
        booksRead: userStats.books_read || 0,
        readingHours: userStats.reading_hours || 0,
        currentlyReading: userStats.currently_reading || '',
        achievements: userStats.achievements || 0,
      }));
    }
    if (subscription) {
      setDisplayProfile(prev => ({
        ...prev,
        isSubscribed: true,
        subscriptionTier: subscription.plan_id as any,
        subscriptionEndDate: subscription.current_period_end,
      }));
    }
  }, [user, userProfile, userStats, subscription]);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (isLoading || (isAuthenticated && (!userProfile || isLoadingStats || isLoadingSubscription))) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Redirect is handled by useEffect
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker text-text-light">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-background-light/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800">
              {/* Profile Card */}
              <div className="p-6 text-center border-b border-gray-800">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-1 -right-1 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
                    <UserIcon size={16} />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">{userProfile?.display_name || userProfile?.username}</h2>
                <p className="text-sm text-gray-400">{isAdmin ? 'Admin' : 'Member'}</p>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                <ul className="space-y-1">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <NavLink
                        to={tab.path}
                        end={tab.path === '/account'}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                          }`
                        }
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{tab.icon}</span>
                          {tab.name}
                        </div>
                        <ChevronRight size={16} className="text-gray-500" />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Stats Card - Only show on overview */}
            {activeTab === 'overview' && (
              <div className="mt-6 bg-background-light/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400 mb-4">YOUR STATS</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <BookOpen size={16} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Books Read</p>
                      <p className="text-lg font-semibold text-white">{displayProfile.booksRead}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                      <Clock size={16} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Reading Hours</p>
                      <p className="text-lg font-semibold text-white">{displayProfile.readingHours}h</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <BookmarkIcon size={16} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-300">Currently Reading</p>
                      <p className="text-lg font-semibold text-white">{displayProfile.currentlyReading || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-background-light/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-6">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <OverviewContent
                        userId={user.id}
                        isSubscribed={displayProfile.isSubscribed}
                        subscriptionTier={displayProfile.subscriptionTier}
                        betaReaderStatus={displayProfile.betaReaderStatus}
                        subscriptionEndDate={displayProfile.subscriptionEndDate}
                        booksRead={displayProfile.booksRead}
                        readingHours={displayProfile.readingHours}
                        currentlyReading={displayProfile.currentlyReading}
                        achievements={displayProfile.achievements}
                        username={displayProfile.username}
                        onSignOut={handleLogout}
                      />
                    }
                  />
                  <Route path="profile" element={<ProfileContent />} />
                  <Route element={<ProtectedRoute requireSubscription={true} />}>
                    <Route path="reading" element={<ReadingContent />} />
                  </Route>
                  <Route path="achievements" element={<AchievementsContent />} />
                  <Route path="preferences" element={<PreferencesContent />} />
                  <Route path="security" element={<SecurityContent />} />
                  {isAdmin && <Route path="admin/*" element={<AdminDashboard />} />}
                </Routes>
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
