import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_id: string;
  amount: number;
  currency: string;
  interval: string;
  interval_count: number;
  trial_period_days: number;
  features: string[];
}

const SubscriptionDetails = () => {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);

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
      
      // Fetch available plans
      const plansResponse = await fetch(`${API_BASE}/api/subscription/plans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setPlans(plansData.plans || []);
      }

    } catch (err) {
      console.error('Error fetching subscription data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription data');
    }
  };

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) return;

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/subscription/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchSubscriptionData();
      }
    } catch (err) {
      console.error('Error refreshing subscription:', err);
    } finally {
      setRefreshing(false);
    }
  };

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
      }
    } catch (err) {
      console.error('Error opening billing portal:', err);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? It will remain active until the end of your current billing period.')) {
      return;
    }

    setCancellingSubscription(true);
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
        await fetchSubscriptionData();
        alert('Your subscription has been scheduled for cancellation at the end of your current billing period.');
      }
    } catch (err) {
      console.error('Error canceling subscription:', err);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCancellingSubscription(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (user) {
        setLoading(true);
        await fetchSubscriptionData();
        setLoading(false);
      }
    };

    initialize();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view your subscription details.</p>
        </div>
      </div>
    );
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'incomplete': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'patron': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierFeatures = (tier: string) => {
    switch (tier) {
      case 'premium':
        return [
          'Access to premium content',
          'Advanced writing tools',
          'Priority support',
          'Export to multiple formats',
          'Collaboration features'
        ];
      case 'patron':
        return [
          'All Premium features',
          'Exclusive patron content',
          'Early access to new features',
          'Direct author communication',
          'Special patron community access',
          'Personalized writing guidance'
        ];
      default:
        return [
          'Access to free content',
          'Basic writing tools',
          'Community access'
        ];
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/account" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Account
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscription Details</h1>
            <p className="text-gray-600 mt-1">Manage your subscription and view benefits</p>
          </div>
          
          <button
            onClick={handleRefreshStatus}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{refreshing ? 'Refreshing...' : 'Refresh Status'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Subscription */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Subscription</h2>
            
            {subscriptionData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(subscriptionData.subscription_tier)}`}>
                      {subscriptionData.subscription_tier.charAt(0).toUpperCase() + subscriptionData.subscription_tier.slice(1)} Plan
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionData.subscription_status)}`}>
                      {subscriptionData.subscription_status.charAt(0).toUpperCase() + subscriptionData.subscription_status.slice(1)}
                    </span>
                  </div>
                  
                  {subscriptionData.plan_info && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatAmount(subscriptionData.plan_info.amount, subscriptionData.plan_info.currency)}
                      </div>
                      <div className="text-sm text-gray-600">
                        per {subscriptionData.plan_info.interval}
                      </div>
                    </div>
                  )}
                </div>
                
                {subscriptionData.plan_info && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                      <p className="text-gray-900">{subscriptionData.plan_info.product_name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                      <p className="text-gray-900">{subscriptionData.billing_cycle || `Every ${subscriptionData.plan_info.interval}`}</p>
                    </div>
                    
                    {subscriptionData.subscription_end_date && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Next Billing Date</label>
                          <p className="text-gray-900">{new Date(subscriptionData.subscription_end_date).toLocaleDateString()}</p>
                        </div>
                        
                        {subscriptionData.days_remaining !== null && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Days Remaining</label>
                            <p className="text-gray-900 font-semibold">
                              {subscriptionData.days_remaining > 0 ? `${subscriptionData.days_remaining} days` : 'Expired'}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                
                {/* Plan Features */}
                <div className="pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Your Plan Includes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getTierFeatures(subscriptionData.subscription_tier).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No subscription data available</p>
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          {billingData?.invoices && billingData.invoices.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing History</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {billingData.invoices.slice(0, 5).map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(invoice.created)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatAmount(invoice.amount_paid || invoice.amount_due, invoice.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            invoice.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.hosted_invoice_url && (
                            <a 
                              href={invoice.hosted_invoice_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View
                            </a>
                          )}
                          {invoice.invoice_pdf && (
                            <a 
                              href={invoice.invoice_pdf} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              PDF
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Method */}
          {billingData?.payment_method && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                  {billingData.payment_method.card.brand.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    **** **** **** {billingData.payment_method.card.last4}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expires {billingData.payment_method.card.exp_month}/{billingData.payment_method.card.exp_year}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Payment */}
          {billingData?.upcoming_invoice && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Payment</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatAmount(billingData.upcoming_invoice.amount_due, billingData.upcoming_invoice.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Due Date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(billingData.upcoming_invoice.period_end)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Subscription</h3>
            
            <div className="space-y-3">
              {subscriptionData?.subscription_tier === 'free' ? (
                <Link 
                  to="/pricing"
                  className="w-full px-4 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors block"
                >
                  Upgrade Plan
                </Link>
              ) : (
                <>
                  <button
                    onClick={handleManageBilling}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Manage Billing
                  </button>
                  
                  <Link 
                    to="/pricing"
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 text-center rounded-md hover:bg-gray-50 transition-colors block"
                  >
                    Change Plan
                  </Link>
                  
                  {subscriptionData?.is_subscribed && (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={cancellingSubscription}
                      className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      {cancellingSubscription ? 'Cancelling...' : 'Cancel Subscription'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-2">
              <a href="/support" className="block text-sm text-blue-600 hover:text-blue-800">
                Contact Support
              </a>
              <a href="/faq" className="block text-sm text-blue-600 hover:text-blue-800">
                Subscription FAQ
              </a>
              <a href="/billing-help" className="block text-sm text-blue-600 hover:text-blue-800">
                Billing Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;