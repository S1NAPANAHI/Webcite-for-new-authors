import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '@zoroaster/shared';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'reading' | 'writing' | 'community' | 'special';
  earned_at?: string;
  progress?: number;
  max_progress?: number;
  is_unlocked: boolean;
}

interface UserStats {
  total_reading_time: number;
  books_completed: number;
  chapters_read: number;
  comments_made: number;
  likes_given: number;
  account_age_days: number;
  subscription_months: number;
  profile_completion: number;
}

const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchAchievements();
    fetchUserStats();
  }, [user]);

  const fetchAchievements = async () => {
    if (!user) return;

    try {
      // Since we don't have a dedicated achievements table yet, we'll simulate achievements
      // based on user activity. In a real implementation, you'd fetch from an achievements table.
      const simulatedAchievements: Achievement[] = [
        {
          id: '1',
          name: 'First Steps',
          description: 'Created your account and set up your profile',
          icon: '👋',
          category: 'special',
          is_unlocked: true,
          earned_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Bookworm',
          description: 'Read 5 chapters',
          icon: '📚',
          category: 'reading',
          progress: 3,
          max_progress: 5,
          is_unlocked: false
        },
        {
          id: '3',
          name: 'Speed Reader',
          description: 'Read for 10 hours total',
          icon: '⚡',
          category: 'reading',
          progress: 7,
          max_progress: 10,
          is_unlocked: false
        },
        {
          id: '4',
          name: 'Community Member',
          description: 'Make your first comment',
          icon: '💬',
          category: 'community',
          is_unlocked: true,
          earned_at: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Loyal Reader',
          description: 'Maintain a subscription for 3 months',
          icon: '⭐',
          category: 'special',
          progress: 2,
          max_progress: 3,
          is_unlocked: false
        },
        {
          id: '6',
          name: 'Marathon Reader',
          description: 'Complete an entire book series',
          icon: '🏃‍♂️',
          category: 'reading',
          is_unlocked: false
        },
        {
          id: '7',
          name: 'Supportive',
          description: 'Give 50 likes to posts and comments',
          icon: '❤️',
          category: 'community',
          progress: 23,
          max_progress: 50,
          is_unlocked: false
        },
        {
          id: '8',
          name: 'Early Adopter',
          description: 'Joined during the beta period',
          icon: '🚀',
          category: 'special',
          is_unlocked: true,
          earned_at: new Date().toISOString()
        }
      ];

      setAchievements(simulatedAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch user statistics from various tables
      // This is a simplified version - in reality you'd aggregate from multiple tables
      const stats: UserStats = {
        total_reading_time: 420, // minutes
        books_completed: 2,
        chapters_read: 34,
        comments_made: 12,
        likes_given: 23,
        account_age_days: 45,
        subscription_months: 2,
        profile_completion: 85
      };

      setUserStats(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reading': return '📖';
      case 'writing': return '✍️';
      case 'community': return '👥';
      case 'special': return '🏆';
      default: return '🎯';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const unlockedCount = achievements.filter(a => a.is_unlocked).length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p className="text-gray-600">
          You've unlocked {unlockedCount} of {totalCount} achievements
        </p>
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
            
            {userStats && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reading time</span>
                  <span className="font-medium">{formatTime(userStats.total_reading_time)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Books completed</span>
                  <span className="font-medium">{userStats.books_completed}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chapters read</span>
                  <span className="font-medium">{userStats.chapters_read}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Comments made</span>
                  <span className="font-medium">{userStats.comments_made}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Likes given</span>
                  <span className="font-medium">{userStats.likes_given}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account age</span>
                  <span className="font-medium">{userStats.account_age_days} days</span>
                </div>
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            
            <div className="space-y-2">
              {[
                { key: 'all', label: 'All Achievements', icon: '🎯' },
                { key: 'reading', label: 'Reading', icon: '📖' },
                { key: 'writing', label: 'Writing', icon: '✍️' },
                { key: 'community', label: 'Community', icon: '👥' },
                { key: 'special', label: 'Special', icon: '🏆' }
              ].map(category => {
                const count = category.key === 'all' 
                  ? achievements.length 
                  : achievements.filter(a => a.category === category.key).length;
                
                return (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${
                      selectedCategory === category.key
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </span>
                    <span className="text-sm">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAchievements.map(achievement => (
              <div
                key={achievement.id}
                className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg ${
                  achievement.is_unlocked 
                    ? 'ring-2 ring-green-200 border-green-200' 
                    : 'opacity-75'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    achievement.is_unlocked 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {achievement.is_unlocked ? 'Unlocked' : 'Locked'}
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {achievement.name}
                </h4>
                
                <p className="text-gray-600 text-sm mb-4">
                  {achievement.description}
                </p>
                
                {achievement.progress !== undefined && achievement.max_progress && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">
                        {achievement.progress} / {achievement.max_progress}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((achievement.progress / achievement.max_progress) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {achievement.earned_at && (
                  <div className="text-xs text-green-600 font-medium">
                    Unlocked {new Date(achievement.earned_at).toLocaleDateString()}
                  </div>
                )}
                
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <span className="mr-1">{getCategoryIcon(achievement.category)}</span>
                  <span className="capitalize">{achievement.category}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No achievements in this category
              </h3>
              <p className="text-gray-600">
                Check other categories or keep using the platform to unlock more achievements!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;