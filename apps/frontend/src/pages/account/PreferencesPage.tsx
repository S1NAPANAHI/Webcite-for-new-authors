import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '@zoroaster/shared';
import { toast } from 'react-hot-toast';

interface UserPreferences {
  id: string;
  user_id: string;
  // Reading Preferences
  reading_preferences: {
    preferred_genres: string[];
    content_warnings: boolean;
    auto_bookmark: boolean;
    reading_speed: 'slow' | 'normal' | 'fast';
    font_size: 'small' | 'medium' | 'large';
    theme: 'light' | 'dark' | 'system';
  };
  // Notification Preferences
  notification_preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    marketing_emails: boolean;
    new_releases: boolean;
    chapter_updates: boolean;
    community_activity: boolean;
    weekly_digest: boolean;
  };
  // Privacy Preferences
  privacy_preferences: {
    profile_visibility: 'public' | 'private' | 'friends';
    show_reading_activity: boolean;
    show_achievements: boolean;
    allow_friend_requests: boolean;
    data_collection: boolean;
  };
  // Language and Region
  language: string;
  timezone: string;
  currency: string;
}

const PreferencesPage: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('reading');

  const availableGenres = [
    'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Thriller', 'Horror',
    'Adventure', 'Drama', 'Comedy', 'Historical', 'Contemporary', 'Young Adult'
  ];

  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
    'Australia/Sydney', 'Pacific/Auckland'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
  const languages = [{ code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' }];

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      // Check if user_preferences table exists and fetch, otherwise use defaults
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching preferences:', error);
      }

      if (data) {
        setPreferences(data);
      } else {
        // Create default preferences
        const defaultPreferences: UserPreferences = {
          id: crypto.randomUUID(),
          user_id: user.id,
          reading_preferences: {
            preferred_genres: [],
            content_warnings: true,
            auto_bookmark: true,
            reading_speed: 'normal',
            font_size: 'medium',
            theme: 'system'
          },
          notification_preferences: {
            email_notifications: true,
            push_notifications: true,
            marketing_emails: false,
            new_releases: true,
            chapter_updates: true,
            community_activity: false,
            weekly_digest: true
          },
          privacy_preferences: {
            profile_visibility: 'public',
            show_reading_activity: true,
            show_achievements: true,
            allow_friend_requests: true,
            data_collection: true
          },
          language: 'en',
          timezone: 'UTC',
          currency: 'USD'
        };
        setPreferences(defaultPreferences);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return;

    setSaving(true);
    try {
      const updatedPreferences = { ...preferences, ...updates };
      
      // Try to upsert the preferences
      const { error } = await supabase
        .from('user_preferences')
        .upsert(updatedPreferences, { onConflict: 'user_id' });

      if (error) {
        console.error('Error updating preferences:', error);
        toast.error('Failed to save preferences');
      } else {
        setPreferences(updatedPreferences);
        toast.success('Preferences saved successfully');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleReadingPreferenceChange = (key: keyof UserPreferences['reading_preferences'], value: any) => {
    if (!preferences) return;
    
    const updatedPreferences = {
      ...preferences,
      reading_preferences: {
        ...preferences.reading_preferences,
        [key]: value
      }
    };
    updatePreferences(updatedPreferences);
  };

  const handleNotificationPreferenceChange = (key: keyof UserPreferences['notification_preferences'], value: boolean) => {
    if (!preferences) return;
    
    const updatedPreferences = {
      ...preferences,
      notification_preferences: {
        ...preferences.notification_preferences,
        [key]: value
      }
    };
    updatePreferences(updatedPreferences);
  };

  const handlePrivacyPreferenceChange = (key: keyof UserPreferences['privacy_preferences'], value: any) => {
    if (!preferences) return;
    
    const updatedPreferences = {
      ...preferences,
      privacy_preferences: {
        ...preferences.privacy_preferences,
        [key]: value
      }
    };
    updatePreferences(updatedPreferences);
  };

  const handleGenreToggle = (genre: string) => {
    if (!preferences) return;
    
    const currentGenres = preferences.reading_preferences.preferred_genres;
    const updatedGenres = currentGenres.includes(genre)
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre];
    
    handleReadingPreferenceChange('preferred_genres', updatedGenres);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Preferences</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Preferences</h1>
        <p className="text-gray-600">Customize your reading experience and account settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64">
          <nav className="bg-white rounded-lg shadow-md p-4">
            <ul className="space-y-2">
              {[
                { id: 'reading', label: 'Reading', icon: '📚' },
                { id: 'notifications', label: 'Notifications', icon: '🔔' },
                { id: 'privacy', label: 'Privacy', icon: '🔒' },
                { id: 'language', label: 'Language & Region', icon: '🌍' }
              ].map(section => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{section.icon}</span>
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Reading Preferences */}
            {activeSection === 'reading' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Reading Preferences</h2>
                
                {/* Preferred Genres */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preferred Genres</h3>
                  <p className="text-gray-600 mb-4">Select genres you're interested in to get personalized recommendations</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableGenres.map(genre => (
                      <button
                        key={genre}
                        onClick={() => handleGenreToggle(genre)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          preferences.reading_preferences.preferred_genres.includes(genre)
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reading Settings */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Reading Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Content Warnings</label>
                          <p className="text-sm text-gray-500">Show warnings before sensitive content</p>
                        </div>
                        <button
                          onClick={() => handleReadingPreferenceChange('content_warnings', !preferences.reading_preferences.content_warnings)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.reading_preferences.content_warnings ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.reading_preferences.content_warnings ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Auto Bookmark</label>
                          <p className="text-sm text-gray-500">Automatically save your reading progress</p>
                        </div>
                        <button
                          onClick={() => handleReadingPreferenceChange('auto_bookmark', !preferences.reading_preferences.auto_bookmark)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.reading_preferences.auto_bookmark ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.reading_preferences.auto_bookmark ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reading Speed</label>
                        <select
                          value={preferences.reading_preferences.reading_speed}
                          onChange={(e) => handleReadingPreferenceChange('reading_speed', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="slow">Slow</option>
                          <option value="normal">Normal</option>
                          <option value="fast">Fast</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                        <select
                          value={preferences.reading_preferences.font_size}
                          onChange={(e) => handleReadingPreferenceChange('font_size', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                        <select
                          value={preferences.reading_preferences.theme}
                          onChange={(e) => handleReadingPreferenceChange('theme', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Preferences */}
            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {Object.entries(preferences.notification_preferences).map(([key, value]) => {
                    const labels = {
                      email_notifications: { title: 'Email Notifications', desc: 'Receive notifications via email' },
                      push_notifications: { title: 'Push Notifications', desc: 'Receive notifications in your browser' },
                      marketing_emails: { title: 'Marketing Emails', desc: 'Receive promotional content and offers' },
                      new_releases: { title: 'New Releases', desc: 'Get notified about new books and chapters' },
                      chapter_updates: { title: 'Chapter Updates', desc: 'Get notified when subscribed series update' },
                      community_activity: { title: 'Community Activity', desc: 'Notifications about comments and discussions' },
                      weekly_digest: { title: 'Weekly Digest', desc: 'Summary of your reading activity' }
                    };
                    
                    const label = labels[key as keyof typeof labels];
                    if (!label) return null;
                    
                    return (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <label className="text-sm font-medium text-gray-700">{label.title}</label>
                          <p className="text-sm text-gray-500">{label.desc}</p>
                        </div>
                        <button
                          onClick={() => handleNotificationPreferenceChange(key as keyof UserPreferences['notification_preferences'], !value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Privacy Preferences */}
            {activeSection === 'privacy' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                    <select
                      value={preferences.privacy_preferences.profile_visibility}
                      onChange={(e) => handlePrivacyPreferenceChange('profile_visibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="public">Public - Anyone can see your profile</option>
                      <option value="friends">Friends Only - Only friends can see your profile</option>
                      <option value="private">Private - Only you can see your profile</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'show_reading_activity', title: 'Show Reading Activity', desc: 'Display your reading progress and history' },
                      { key: 'show_achievements', title: 'Show Achievements', desc: 'Display your earned achievements' },
                      { key: 'allow_friend_requests', title: 'Allow Friend Requests', desc: 'Let other users send you friend requests' },
                      { key: 'data_collection', title: 'Analytics & Data Collection', desc: 'Help improve the platform with usage data' }
                    ].map(({ key, title, desc }) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <label className="text-sm font-medium text-gray-700">{title}</label>
                          <p className="text-sm text-gray-500">{desc}</p>
                        </div>
                        <button
                          onClick={() => handlePrivacyPreferenceChange(key as keyof UserPreferences['privacy_preferences'], !preferences.privacy_preferences[key as keyof UserPreferences['privacy_preferences']])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.privacy_preferences[key as keyof UserPreferences['privacy_preferences']] ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.privacy_preferences[key as keyof UserPreferences['privacy_preferences']] ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Language & Region */}
            {activeSection === 'language' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Language & Region</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => updatePreferences({ language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => updatePreferences({ timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => updatePreferences({ currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Saving Indicator */}
            {saving && (
              <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;