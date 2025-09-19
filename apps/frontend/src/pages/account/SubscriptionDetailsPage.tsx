import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, getSubscription, refreshSubscriptionStatus, supabase } from '@zoroaster/shared';
import {
  Crown,
  Calendar,
  CreditCard,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  RefreshCcw,
  Settings,
  ArrowLeft,
  Download
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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

interface BillingData {
  payment_method: {
    id: string;
    type: string;
    card: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
  } | null;
  invoices: Array<{
    id: string;
    amount_paid: number;
    amount_due: number;
    currency: string;
    status: string;
    created: number;
    period_start: number;
    period_end: number;
    hosted_invoice_url?: string;
    invoice_pdf?: string;
  }>;
  upcoming_invoice: {
    amount_due: number;
    currency: string;
    period_start: number;
    period_end: number;
  } | null;
}

interface SubscriptionFeature {
  name: string;
  free: boolean;
  premium: boolean;
  patron: boolean;
  description?: string;
}

const subscriptionFeatures: SubscriptionFeature[] = [
  {
    name: 'Access to Free Content',
    free: true,
    premium: true,
    patron: true,
    description: 'Read publicly available chapters and content'
  },
  {
    name: 'Premium Chapter Access',
    free: false,
    premium: true,
    patron: true,
    description: 'Unlock exclusive premium chapters and early releases'
  },
  {
    name: 'Ad-Free Experience',
    free: false,
    premium: true,
    patron: true,
    description: 'Enjoy reading without any advertisements'
  },
  {
    name: 'Offline Reading',
    free: false,
    premium: true,
    patron: true,
    description: 'Download content for offline reading'
  },
  {
    name: 'Beta Reader Access',
    free: false,
    premium: false,
    patron: true,
    description: 'Get early access to unreleased content and provide feedback'
  },
  {
    name: 'Author Commentary',
    free: false,
    premium: false,
    patron: true,
    description: 'Access exclusive author notes and commentary'
  },
  {
    name: 'Discord Community Access',
    free: false,
    premium: false,
    patron: true,
    description: 'Join the exclusive patron Discord community'
  },
  {
    name: 'Monthly Q&A Sessions',
    free: false,
    premium: false,
    patron: true,
    description: 'Participate in live Q&A sessions with the author'
  },
  {
    name: 'Priority Support',
    free: false,
    premium: false,
    patron: true,
    description: 'Get priority customer support and feature requests'
  }
];

const SubscriptionDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch subscription data from new API
  const fetchSubscriptionData = async () => {
    if (!user) return;

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        setError('Authentication required');
        return;
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      // Fetch subscription status
      const statusResponse = await fetch(`${API_BASE}/api/subscription/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to fetch subscription: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();
      setSubscriptionData(statusData);
      
      // Fetch billing information
      const billingResponse = await fetch(`${API_BASE}/api/subscription/billing`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (billingResponse.ok) {
        const billingInfo = await billingResponse.json();
        setBillingData(billingInfo);
      }

    } catch (err) {
      console.error('Error fetching subscription data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  // Refresh subscription status
  const handleRefreshSubscription = async () => {
    setError('');
    setSuccess('');
    setIsRefreshing(true);
    
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        setError('Authentication required');
        return;
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/subscription/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess('Subscription status refreshed successfully!');
        await fetchSubscriptionData();
      } else {
        throw new Error('Failed to refresh subscription');
      }
    } catch (err) {
      console.error('Error refreshing subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh subscription status');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle billing portal
  const handleManageBilling = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) return;

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/subscription/billing-portal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.url, '_blank');
      } else {
        setError('Failed to open billing portal');
      }
    } catch (err) {
      console.error('Error opening billing portal:', err);
      setError('Failed to open billing portal');
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? It will remain active until the end of your current billing period.')) {
      return;
    }

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) return;

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess('Your subscription has been scheduled for cancellation at the end of your current billing period.');
        await fetchSubscriptionData();
      } else {
        setError('Failed to cancel subscription');
      }
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription');
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const getSubscriptionInfo = (data: SubscriptionData | null) => {
    if (!data || !data.is_subscribed || data.subscription_tier === 'free') {
      return {
        tier: 'free' as const,
        name: 'Free Tier',
        color: 'bg-gray-500',
        textColor: 'text-gray-400',
        status: 'Active',
        price: '$0/month'
      };
    }

    const tier = data.subscription_tier;
    switch (tier) {
      case 'premium':
        return {
          tier: 'premium' as const,
          name: 'Premium',
          color: 'bg-blue-500',
          textColor: 'text-blue-400',
          status: data.subscription_status === 'active' ? 'Active' : 'Inactive',
          price: data.plan_info ? `$${(data.plan_info.amount / 100).toFixed(2)}/${data.plan_info.interval}` : '$9.99/month'
        };
      case 'patron':
        return {
          tier: 'patron' as const,
          name: 'Patron',
          color: 'bg-purple-500',
          textColor: 'text-purple-400',
          status: data.subscription_status === 'active' ? 'Active' : 'Inactive',
          price: data.plan_info ? `$${(data.plan_info.amount / 100).toFixed(2)}/${data.plan_info.interval}` : '$19.99/month'
        };
      default:
        return {
          tier: 'free' as const,
          name: 'Free Tier',
          color: 'bg-gray-500',
          textColor: 'text-gray-400',
          status: 'Active',
          price: '$0/month'
        };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-600 border-t-primary"></div>
          <span className="text-gray-400">Loading subscription details...</span>
        </div>
      </div>
    );
  }

  const subscriptionInfo = getSubscriptionInfo(subscriptionData);
  const daysRemaining = subscriptionData?.days_remaining;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/account"
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Subscription Details</h1>
            <p className="text-gray-400 mt-1">Manage your subscription and view benefits</p>
          </div>
        </div>
        <button
          onClick={handleRefreshSubscription}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors disabled:opacity-50"
        >
          <RefreshCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">
            <X size={16} />
          </button>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-300 rounded-lg flex items-center gap-3">
          <Check size={20} />
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="ml-auto text-green-400 hover:text-green-300">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Current Subscription Card */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${subscriptionInfo.color}/10`}>
              <Crown size={24} className={subscriptionInfo.textColor} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{subscriptionInfo.name}</h2>
              <p className={`text-sm ${subscriptionInfo.textColor}`}>
                {subscriptionInfo.status} • {subscriptionInfo.price}
              </p>
              {subscriptionData?.plan_info?.product_name && (
                <p className="text-sm text-gray-400">{subscriptionData.plan_info.product_name}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {subscriptionInfo.tier !== 'free' && (
              <button 
                onClick={handleManageBilling}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
              >
                <Settings size={16} />
                Manage Billing
              </button>
            )}
            {subscriptionInfo.tier === 'free' && (
              <Link
                to="/subscriptions"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Crown size={16} />
                Upgrade Now
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Calendar size={16} />
              <span className="text-sm">Billing Cycle</span>
            </div>
            <p className="text-white font-medium">
              {subscriptionData?.billing_cycle ||
                (subscriptionData?.plan_info ? 
                  `Every ${subscriptionData.plan_info.interval_count} ${subscriptionData.plan_info.interval}${subscriptionData.plan_info.interval_count > 1 ? 's' : ''}` : 
                  subscriptionInfo.tier === 'free' ? 'No billing cycle' : 'N/A'
                )
              }
            </p>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <CreditCard size={16} />
              <span className="text-sm">Next Payment</span>
            </div>
            <p className="text-white font-medium">
              {subscriptionData?.subscription_end_date && subscriptionData?.is_subscribed
                ? formatDate(subscriptionData.subscription_end_date)
                : subscriptionInfo.tier === 'free'
                ? 'No payment required'
                : 'N/A'
              }
            </p>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <AlertCircle size={16} />
              <span className="text-sm">Days Remaining</span>
            </div>
            <p className="text-white font-medium">
              {daysRemaining !== null && daysRemaining !== undefined
                ? daysRemaining > 0
                  ? `${daysRemaining} days`
                  : 'Expired'
                : subscriptionInfo.tier === 'free'
                ? 'Unlimited'
                : 'N/A'
              }
            </p>
          </div>
        </div>

        {/* Payment Method */}
        {billingData?.payment_method && (
          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-gray-600 rounded flex items-center justify-center text-xs font-bold text-white">
                  {billingData.payment_method.card.brand.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">
                    **** **** **** {billingData.payment_method.card.last4}
                  </p>
                  <p className="text-sm text-gray-400">
                    Expires {billingData.payment_method.card.exp_month}/{billingData.payment_method.card.exp_year}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleManageBilling}
                className="text-sm text-primary hover:text-primary/80"
              >
                Update
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Invoices */}
      {billingData?.invoices && billingData.invoices.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Invoices</h3>
          
          <div className="space-y-3">
            {billingData.invoices.slice(0, 3).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {formatAmount(invoice.amount_paid || invoice.amount_due, invoice.currency)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(invoice.created * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' : 
                    invoice.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {invoice.status}
                  </span>
                  {invoice.hosted_invoice_url && (
                    <a 
                      href={invoice.hosted_invoice_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {invoice.invoice_pdf && (
                    <a 
                      href={invoice.invoice_pdf} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <Download size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Comparison */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Features & Benefits</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-2 text-gray-300 font-medium">Feature</th>
                <th className="text-center py-4 px-2 text-gray-400 font-medium">
                  <div className="flex flex-col items-center">
                    <span>Free</span>
                    <span className="text-xs text-gray-500">$0/month</span>
                  </div>
                </th>
                <th className="text-center py-4 px-2 text-blue-400 font-medium">
                  <div className="flex flex-col items-center">
                    <span>Premium</span>
                    <span className="text-xs text-blue-500">$9.99/month</span>
                  </div>
                </th>
                <th className="text-center py-4 px-2 text-purple-400 font-medium">
                  <div className="flex flex-col items-center">
                    <span>Patron</span>
                    <span className="text-xs text-purple-500">$19.99/month</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptionFeatures.map((feature, index) => (
                <tr key={index} className={`border-b border-gray-700/50 ${subscriptionInfo.tier === 'free' && !feature.free ? 'opacity-50' : ''}`}>
                  <td className="py-4 px-2">
                    <div>
                      <span className="text-white font-medium">{feature.name}</span>
                      {feature.description && (
                        <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="text-center py-4 px-2">
                    {feature.free ? (
                      <Check size={20} className="mx-auto text-green-400" />
                    ) : (
                      <X size={20} className="mx-auto text-gray-600" />
                    )}
                  </td>
                  <td className="text-center py-4 px-2">
                    {feature.premium ? (
                      <Check size={20} className="mx-auto text-green-400" />
                    ) : (
                      <X size={20} className="mx-auto text-gray-600" />
                    )}
                  </td>
                  <td className="text-center py-4 px-2">
                    {feature.patron ? (
                      <Check size={20} className="mx-auto text-green-400" />
                    ) : (
                      <X size={20} className="mx-auto text-gray-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {subscriptionInfo.tier === 'free' && (
          <Link
            to="/subscriptions"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Crown size={18} />
            Upgrade to Premium
          </Link>
        )}
        
        {subscriptionInfo.tier === 'premium' && (
          <Link
            to="/subscriptions"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
          >
            <Crown size={18} />
            Upgrade to Patron
          </Link>
        )}
        
        {subscriptionInfo.tier !== 'free' && (
          <>
            <button 
              onClick={handleManageBilling}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors font-medium"
            >
              <ExternalLink size={18} />
              Billing Portal
            </button>
            
            <button 
              onClick={handleCancelSubscription}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors font-medium"
            >
              <X size={18} />
              Cancel Subscription
            </button>
          </>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-300 mb-3">Need Help?</h4>
        <div className="space-y-3 text-sm text-blue-200">
          <p>• <strong>Billing Issues:</strong> Contact our support team for any billing-related questions</p>
          <p>• <strong>Feature Access:</strong> If you're not seeing premium features, try refreshing your subscription status</p>
          <p>• <strong>Cancellation:</strong> You can cancel your subscription anytime and keep access until the end of your billing period</p>
          <p>• <strong>Refunds:</strong> We offer prorated refunds within 7 days of billing</p>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            Contact Support
          </button>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View FAQ
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailsPage;