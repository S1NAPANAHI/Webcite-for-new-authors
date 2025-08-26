import React, { useState, useEffect } from 'react';
import { useAuth } from '@zoroaster/shared';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  Download, 
  BookOpen, 
  AlertCircle, 
  CheckCircle,
  X,
  Loader2
} from 'lucide-react';

interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan_name: string;
  plan_price: number;
  plan_interval: 'month' | 'year';
  stripe_subscription_id: string;
}

const SubscriptionManager: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSubscriptions();
    }
  }, [isAuthenticated, user]);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/subscriptions/user', {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      setIsCanceling(true);
      
      const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Refresh subscriptions
      await fetchSubscriptions();
      setShowCancelModal(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setIsCanceling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, interval: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-100';
      case 'canceled':
        return 'text-red-500 bg-red-100';
      case 'past_due':
        return 'text-yellow-500 bg-yellow-100';
      case 'unpaid':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'canceled':
        return <X className="w-4 h-4" />;
      case 'past_due':
        return <AlertCircle className="w-4 h-4" />;
      case 'unpaid':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to view subscriptions</h3>
        <p className="text-gray-600">Please sign in to manage your subscription.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-gray-600">Loading your subscriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading subscriptions</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchSubscriptions}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No active subscriptions</h3>
        <p className="text-gray-600 mb-4">
          You don't have any active subscriptions at the moment.
        </p>
        <a
          href="/subscriptions"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <BookOpen className="w-5 h-5" />
          Browse Plans
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Subscriptions</h2>
        <a
          href="/subscriptions"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          View All Plans
        </a>
      </div>

      {subscriptions.map((subscription) => (
        <div
          key={subscription.id}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {subscription.plan_name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(subscription.status)}
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </span>
                  {subscription.cancel_at_period_end && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Canceling
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(subscription.plan_price, subscription.plan_interval)}
              </div>
              <div className="text-sm text-gray-500">
                per {subscription.plan_interval}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                <strong>Current period:</strong> {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>
                <strong>ID:</strong> {subscription.stripe_subscription_id.slice(-8)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/library"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Access Library
            </a>
            
            {subscription.status === 'active' && !subscription.cancel_at_period_end && (
              <button
                onClick={() => setShowCancelModal(subscription.id)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
              >
                Cancel Subscription
              </button>
            )}
            
            {subscription.cancel_at_period_end && (
              <span className="text-sm text-gray-500">
                Subscription will end on {formatDate(subscription.current_period_end)}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Subscription?
            </h3>
            <p className="text-gray-600 mb-6">
              Your subscription will remain active until the end of the current billing period. 
              You can reactivate it at any time.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                disabled={isCanceling}
              >
                Keep Subscription
              </button>
              <button
                onClick={() => handleCancelSubscription(showCancelModal)}
                disabled={isCanceling}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isCanceling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  'Cancel Subscription'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
