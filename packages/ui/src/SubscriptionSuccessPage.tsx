import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@zoroaster/shared';
import { useQueryClient } from '@tanstack/react-query';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const SubscriptionSuccessPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<'idle' | 'refreshing' | 'success' | 'error'>('idle');
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);

  // Automatically refresh subscription status when page loads
  useEffect(() => {
    if (user) {
      refreshSubscriptionStatus();
    }
  }, [user]);

  const refreshSubscriptionStatus = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    setRefreshStatus('refreshing');
    
    try {
      console.log('🔄 Refreshing subscription status...');
      
      const token = localStorage.getItem('supabase.auth.token') || 
                   sessionStorage.getItem('supabase.auth.token');
      
      if (!token) {
        console.error('No auth token found');
        setRefreshStatus('error');
        return;
      }

      // First, trigger a manual refresh from Stripe
      const refreshResponse = await fetch(`${API_BASE}/api/subscription/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!refreshResponse.ok) {
        const errorData = await refreshResponse.json();
        console.error('Refresh failed:', errorData);
        setRefreshStatus('error');
        return;
      }

      const refreshData = await refreshResponse.json();
      console.log('✅ Subscription refresh result:', refreshData);
      
      // Then get the updated status
      const statusResponse = await fetch(`${API_BASE}/api/subscription/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('✅ Current subscription status:', statusData);
        setSubscriptionInfo(statusData);
      }

      // Invalidate related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
      queryClient.invalidateQueries({ queryKey: ['userStats', user.id] });
      
      setRefreshStatus('success');
      
    } catch (error) {
      console.error('❌ Error refreshing subscription:', error);
      setRefreshStatus('error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusMessage = () => {
    switch (refreshStatus) {
      case 'refreshing':
        return { text: 'Updating your subscription status...', color: 'text-blue-600' };
      case 'success':
        return { text: 'Subscription status updated successfully!', color: 'text-green-600' };
      case 'error':
        return { text: 'Status update in progress. Please check your account dashboard.', color: 'text-orange-600' };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-green-400 rounded-3xl p-8 md:p-12 shadow-2xl shadow-green-500/25 max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="mx-auto w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 border-4 border-green-200 dark:border-green-700"
        >
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-green-800 bg-clip-text text-transparent mb-4">
          Subscription Successful!
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
          Welcome to the Zoroastervers! You now have access to all premium content.
        </p>

        {/* Status Update Section */}
        <div className="mb-8">
          {statusMessage && (
            <div className={`flex items-center justify-center gap-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-700/50 ${statusMessage.color}`}>
              {refreshStatus === 'refreshing' ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : refreshStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{statusMessage.text}</span>
            </div>
          )}

          {subscriptionInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
            >
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🎉 Your Subscription Details:
              </h3>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p><strong>Tier:</strong> {subscriptionInfo.tier === 'premium' ? '✨ Premium' : subscriptionInfo.tier}</p>
                <p><strong>Status:</strong> {subscriptionInfo.status}</p>
                {subscriptionInfo.end_date && (
                  <p><strong>Next Billing:</strong> {new Date(subscriptionInfo.end_date).toLocaleDateString()}</p>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <motion.a
            href="/account/reading"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Reading
          </motion.a>
          
          <div className="flex gap-4 justify-center mt-6">
            <motion.a
              href="/account"
              whileHover={{ scale: 1.05 }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium underline underline-offset-4"
            >
              View Dashboard
            </motion.a>
            
            {refreshStatus !== 'refreshing' && (
              <motion.button
                onClick={refreshSubscriptionStatus}
                whileHover={{ scale: 1.05 }}
                disabled={isRefreshing}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium underline underline-offset-4 disabled:opacity-50"
              >
                Refresh Status
              </motion.button>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your subscription is now active. If you don't see the premium content immediately,
            try refreshing your account dashboard or wait a few minutes for the system to update.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SubscriptionSuccessPage;