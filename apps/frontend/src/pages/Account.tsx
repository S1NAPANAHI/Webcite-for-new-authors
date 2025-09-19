import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getSubscription, getSubscriptionStatusInfo, getSubscriptionDaysRemaining, refreshSubscriptionStatus } from '../../../packages/shared/src/subscription';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  subscription_status?: string;
  subscription_tier?: string;
  subscription_end_date?: string;
}

interface SubscriptionData {
  user_id: string;
  email: string;
  subscription_status: string;
  subscription_tier: string;
  subscription_end_date?: string;
  is_subscribed: boolean;
  has_premium_access: boolean;
  subscription_valid: boolean;
  days_remaining?: number;
  plan_info?: {
    price_id: string;
    amount: number;
    currency: string;
    interval: string;
    interval_count: number;
    product_name: string;
  };
  billing_cycle?: string;
}

const Account = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          email,
          display_name,
          avatar_url,
          bio,
          subscription_status,
          subscription_tier,
          subscription_end_date
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    }
  };

  const fetchSubscriptionData = async () => {
    if (!user) return;

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        console.error('No access token available');
        return;
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/subscription/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SubscriptionData = await response.json();
      setSubscriptionData(data);
      
      console.log('✅ Subscription data loaded:', data);
    } catch (err) {
      console.error('Error fetching subscription data:', err);
      // Fallback to using the shared utility
      try {
        const subscription = await getSubscription(user.id);
        if (subscription) {
          setSubscriptionData({
            user_id: user.id,
            email: user.email || '',
            subscription_status: subscription.status,
            subscription_tier: subscription.tier,
            subscription_end_date: subscription.current_period_end,
            is_subscribed: subscription.is_subscribed,
            has_premium_access: subscription.is_subscribed && subscription.tier !== 'free',
            subscription_valid: subscription.is_subscribed,
            days_remaining: getSubscriptionDaysRemaining(subscription.current_period_end)
          });
        }
      } catch (fallbackErr) {
        console.error('Fallback subscription fetch failed:', fallbackErr);
      }
    }
  };

  const handleRefreshStatus = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      console.log('🔄 Refreshing subscription status...');
      
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        console.error('No access token available');
        return;
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/subscription/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Subscription refreshed:', result);
      
      // Refresh data
      await Promise.all([
        fetchUserProfile(),
        fetchSubscriptionData()
      ]);
      
    } catch (err) {
      console.error('Error refreshing subscription:', err);
      // Fallback to shared utility
      try {
        await refreshSubscriptionStatus(user.id);
        await Promise.all([
          fetchUserProfile(),
          fetchSubscriptionData()
        ]);
      } catch (fallbackErr) {
        console.error('Fallback refresh failed:', fallbackErr);
        setError('Failed to refresh subscription status');
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        setLoading(true);
        await Promise.all([
          fetchUserProfile(),
          fetchSubscriptionData()
        ]);
        setLoading(false);
      }
    };

    initializeData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Please log in to view your account.</p>
        </div>
      </div>
    );
  }

  // Calculate subscription display data
  const statusInfo = getSubscriptionStatusInfo(subscriptionData ? {
    user_id: subscriptionData.user_id,
    status: subscriptionData.subscription_status,
    tier: subscriptionData.subscription_tier,
    current_period_end: subscriptionData.subscription_end_date,
    is_subscribed: subscriptionData.is_subscribed
  } : null);

  const daysRemaining = subscriptionData?.days_remaining;
  const hasActiveSubscription = subscriptionData?.is_subscribed || false;
  const subscriptionTier = subscriptionData?.subscription_tier || 'free';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
        <p className="text-gray-600">Manage your account settings and subscription</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {profile.display_name?.[0] || profile.username[0] || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {profile.display_name || profile.username}
                  </h3>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <p className="text-gray-900">{profile.username}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>
              
              {profile.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <p className="text-gray-900">{profile.bio}</p>
                </div>
              )}
              
              <div className="flex space-x-4 pt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Edit Profile
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Account Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Activity</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Account created</span>
                <span className="text-gray-900">-</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Last login</span>
                <span className="text-gray-900">Today</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Profile completeness</span>
                <span className="text-green-600 font-medium">85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Subscription Status</h3>
              <button
                onClick={handleRefreshStatus}
                disabled={refreshing}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
                title="Refresh subscription status"
              >
                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                  {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
                </div>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                  {statusInfo.displayStatus}
                </div>
              </div>
              
              {subscriptionData?.plan_info && (
                <div className="text-sm text-gray-600">
                  <p><strong>Plan:</strong> {subscriptionData.plan_info.product_name}</p>
                  <p><strong>Price:</strong> ${(subscriptionData.plan_info.amount / 100).toFixed(2)} {subscriptionData.plan_info.currency.toUpperCase()}</p>
                  {subscriptionData.billing_cycle && (
                    <p><strong>Billing:</strong> Every {subscriptionData.billing_cycle}</p>
                  )}
                </div>
              )}
              
              {hasActiveSubscription && daysRemaining !== null && (
                <div className="text-sm">
                  {daysRemaining > 0 ? (
                    <p className="text-green-600">
                      <strong>{daysRemaining}</strong> days remaining
                    </p>
                  ) : (
                    <p className="text-red-600">
                      <strong>Expired</strong>
                    </p>
                  )}
                </div>
              )}
              
              {subscriptionData?.subscription_end_date && (
                <div className="text-sm text-gray-600">
                  <p><strong>Renewal Date:</strong></p>
                  <p>{new Date(subscriptionData.subscription_end_date).toLocaleDateString()}</p>
                </div>
              )}
              
              <div className="pt-3 border-t border-gray-100">
                <Link
                  to="/account/subscription"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Link
                to="/settings"
                className="block w-full px-4 py-2 text-left text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                Account Settings
              </Link>
              
              <Link
                to="/account/subscription"
                className="block w-full px-4 py-2 text-left text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                Manage Subscription
              </Link>
              
              <Link
                to="/billing"
                className="block w-full px-4 py-2 text-left text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                Billing History
              </Link>
              
              <button className="block w-full px-4 py-2 text-left text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;