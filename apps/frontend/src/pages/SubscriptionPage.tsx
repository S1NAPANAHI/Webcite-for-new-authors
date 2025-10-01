import React, { useState, useEffect } from 'react';
import { useAuth } from '@zoroaster/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ExternalLink,
  Sparkles,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface SubscriptionData {
  user_id: string;
  email: string;
  is_subscribed: boolean;
  subscription: any;
  profile: any;
  tier: 'free' | 'premium' | 'patron';
  status: string;
  end_date: string | null;
}

export const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');

  // Fetch subscription status
  const { 
    data: subscriptionData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<SubscriptionData>({
    queryKey: ['subscriptionStatus', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const token = localStorage.getItem('supabase.auth.token') || 
                   sessionStorage.getItem('supabase.auth.token');
      
      if (!token) throw new Error('No auth token found');

      const response = await fetch(`${API_BASE}/api/subscription/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }

      return response.json();
    },
    enabled: !!user,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const refreshSubscriptionStatus = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    setRefreshMessage('Syncing with Stripe...');
    
    try {
      const token = localStorage.getItem('supabase.auth.token') || 
                   sessionStorage.getItem('supabase.auth.token');
      
      if (!token) throw new Error('No auth token found');

      const response = await fetch(`${API_BASE}/api/subscription/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh subscription');
      }

      const result = await response.json();
      console.log('✅ Refresh result:', result);
      
      setRefreshMessage('Successfully updated!');
      
      // Refetch the data to get updated status
      await refetch();
      
      // Also invalidate other queries
      queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
      queryClient.invalidateQueries({ queryKey: ['userStats', user.id] });
      
      setTimeout(() => setRefreshMessage(''), 3000);
      
    } catch (error) {
      console.error('❌ Error refreshing subscription:', error);
      setRefreshMessage('Refresh failed. Please try again.');
      setTimeout(() => setRefreshMessage(''), 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'premium':
        return {
          name: 'Premium Subscriber',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-700',
          icon: <Sparkles className="w-6 h-6 text-blue-600" />
        };
      case 'patron':
        return {
          name: 'Patron Subscriber',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          borderColor: 'border-purple-200 dark:border-purple-700',
          icon: <Crown className="w-6 h-6 text-purple-600" />
        };
      default:
        return {
          name: 'Free Tier',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-800/50',
          borderColor: 'border-gray-200 dark:border-gray-700',
          icon: <Shield className="w-6 h-6 text-gray-600" />
        };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          text: 'Active',
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'trialing':
        return {
          text: 'Free Trial',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          icon: <Clock className="w-4 h-4" />
        };
      case 'past_due':
        return {
          text: 'Payment Due',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 dark:bg-orange-900/30',
          icon: <AlertCircle className="w-4 h-4" />
        };
      case 'canceled':
      case 'inactive':
      default:
        return {
          text: 'Inactive',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100 dark:bg-gray-800/50',
          icon: <AlertCircle className="w-4 h-4" />
        };
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-400">Loading your subscription details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Failed to load subscription details</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const tierInfo = getTierInfo(subscriptionData?.tier || 'free');
  const statusInfo = getStatusInfo(subscriptionData?.status || 'inactive');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Subscription Management</h1>
          <p className="text-gray-400">Manage your Zoroastervers subscription and billing</p>
        </div>

        {/* Refresh Message */}
        {refreshMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-900/20 border border-blue-700 text-blue-300 rounded-lg"
          >
            {refreshMessage}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Current Subscription Status */}
          <div className={`${tierInfo.bgColor} ${tierInfo.borderColor} border rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  {tierInfo.icon}
                </div>
                <div>
                  <h2 className={`text-2xl font-semibold ${tierInfo.color}`}>
                    {tierInfo.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    {statusInfo.icon}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={refreshSubscriptionStatus}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>

            {/* Subscription Details */}
            {subscriptionData?.subscription && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Next Billing</span>
                  </div>
                  <p className="font-semibold text-white">
                    {subscriptionData.end_date 
                      ? new Date(subscriptionData.end_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Not applicable'
                    }
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Subscription ID</span>
                  </div>
                  <p className="font-mono text-sm text-white">
                    {subscriptionData.subscription.id || 'N/A'}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Auto-Renewal</span>
                  </div>
                  <p className="font-semibold text-white">
                    {subscriptionData.subscription.cancel_at_period_end ? 'Disabled' : 'Enabled'}
                  </p>
                </div>
              </div>
            )}

            {/* Subscription Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">What's Included:</h3>
                <ul className="space-y-2 text-sm">
                  {subscriptionData?.tier === 'premium' ? (
                    <>
                      <li className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <CheckCircle className="w-4 h-4" />
                        Full access to all Zoroastervers content
                      </li>
                      <li className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <CheckCircle className="w-4 h-4" />
                        Early access to new chapters
                      </li>
                      <li className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <CheckCircle className="w-4 h-4" />
                        Premium reading experience
                      </li>
                      <li className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <CheckCircle className="w-4 h-4" />
                        Support the author directly
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <AlertCircle className="w-4 h-4" />
                        Limited access to free content
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <AlertCircle className="w-4 h-4" />
                        No early access privileges
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {subscriptionData?.tier === 'free' && (
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
                  <h3 className="font-semibold text-primary mb-2">Upgrade to Premium</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Get full access to all content and support the Zoroastervers!
                  </p>
                  <Link 
                    to="/subscriptions"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    <Crown className="w-4 h-4" />
                    View Plans
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/account"
                className="flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Account Dashboard</h3>
                  <p className="text-xs text-gray-400">View your profile and stats</p>
                </div>
              </Link>

              {subscriptionData?.is_subscribed ? (
                <>
                  <Link
                    to="/account/reading"
                    className="flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Start Reading</h3>
                      <p className="text-xs text-gray-400">Access your premium content</p>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      // This would open the Stripe billing portal
                      console.log('Opening billing portal...');
                      alert('Billing portal integration coming soon!');
                    }}
                    className="flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <CreditCard className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Manage Billing</h3>
                      <p className="text-xs text-gray-400">Update payment methods</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/subscriptions"
                    className="flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Crown className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Upgrade Now</h3>
                      <p className="text-xs text-gray-400">Get premium access</p>
                    </div>
                  </Link>

                  <Link
                    to="/"
                    className="flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-gray-500/10 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Browse Free Content</h3>
                      <p className="text-xs text-gray-400">Explore available stories</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Subscription History / Debug Info */}
          {subscriptionData && (
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Subscription Details</h2>
              <div className="text-sm text-gray-300 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <span className="ml-2 font-mono">{subscriptionData.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">User ID:</span>
                    <span className="ml-2 font-mono text-xs">{subscriptionData.user_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Is Subscribed:</span>
                    <span className={`ml-2 font-medium ${
                      subscriptionData.is_subscribed 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {subscriptionData.is_subscribed ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Current Tier:</span>
                    <span className={`ml-2 font-medium ${tierInfo.color}`}>
                      {subscriptionData.tier || 'free'}
                    </span>
                  </div>
                </div>
                
                {subscriptionData.subscription && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-primary hover:text-primary/80 font-medium">
                      View Technical Details
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-900/50 rounded border text-xs overflow-x-auto text-gray-300">
                      {JSON.stringify(subscriptionData, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;