import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  User,
  Calendar,
  Package,
  Crown,
  Book,
  Mail,
  ExternalLink,
  MoreHorizontal,
  FileText,
  CreditCard
} from 'lucide-react';

interface Order {
  id: string;
  user_id?: string;
  provider: string;
  provider_session_id?: string;
  provider_payment_intent_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'expired';
  amount_cents: number;
  currency: string;
  customer_email?: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
  // Joined data
  user?: {
    id: string;
    email: string;
    display_name?: string;
  };
  product?: {
    id: string;
    name: string;
    title: string;
    product_type: string;
  };
  price?: {
    id: string;
    nickname?: string;
    interval?: string;
  };
}

interface Subscription {
  id: string;
  user_id?: string;
  provider: string;
  provider_subscription_id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  current_period_start?: string;
  current_period_end?: string;
  trial_end?: string;
  cancel_at_period_end?: boolean;
  created_at: string;
  updated_at: string;
  metadata?: any;
  // Joined data
  user?: {
    id: string;
    email: string;
    display_name?: string;
  };
  plan?: {
    name: string;
    interval?: string;
  };
}

type OrderStatus = 'all' | 'pending' | 'completed' | 'failed' | 'cancelled' | 'expired';
type SubscriptionStatus = 'all' | 'active' | 'canceled' | 'past_due' | 'trialing';

const OrderManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus>('all');
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] = useState<SubscriptionStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders?include_details=true');
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    }
  };

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/admin/subscriptions?include_details=true');
      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      
      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
    }
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchOrders(), fetchSubscriptions()]);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = 
      subscription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.provider_subscription_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = subscriptionStatusFilter === 'all' || subscription.status === subscriptionStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format currency
  const formatPrice = (amountCents: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color and icon
  const getOrderStatusDisplay = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', icon: CheckCircle };
      case 'pending':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', icon: Clock };
      case 'failed':
        return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', icon: XCircle };
      case 'cancelled':
        return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20', icon: XCircle };
      case 'expired':
        return { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20', icon: AlertTriangle };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20', icon: Clock };
    }
  };

  const getSubscriptionStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', icon: CheckCircle };
      case 'trialing':
        return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20', icon: Clock };
      case 'past_due':
        return { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20', icon: AlertTriangle };
      case 'canceled':
        return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', icon: XCircle };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20', icon: Clock };
    }
  };

  // Handle order actions
  const handleRefundOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to issue a refund for this order?')) return;
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to process refund');
      
      await fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process refund');
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to cancel subscription');
      
      await fetchSubscriptions();
      setSelectedSubscription(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Loading orders and subscriptions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Order Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage customer orders, subscriptions, and payments
          </p>
        </div>
        <button
          onClick={fetchData}
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'subscriptions'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            Subscriptions ({subscriptions.length})
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <select
            value={activeTab === 'orders' ? orderStatusFilter : subscriptionStatusFilter}
            onChange={(e) => {
              if (activeTab === 'orders') {
                setOrderStatusFilter(e.target.value as OrderStatus);
              } else {
                setSubscriptionStatusFilter(e.target.value as SubscriptionStatus);
              }
            }}
            className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Status</option>
            {activeTab === 'orders' ? (
              <>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </>
            ) : (
              <>
                <option value="active">Active</option>
                <option value="trialing">Trialing</option>
                <option value="past_due">Past Due</option>
                <option value="canceled">Canceled</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm || orderStatusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Orders will appear here when customers make purchases'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredOrders.map((order) => {
                const statusDisplay = getOrderStatusDisplay(order.status);
                const StatusIcon = statusDisplay.icon;
                
                return (
                  <div key={order.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Order Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-foreground">
                              Order #{order.id.slice(-8)}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {order.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-foreground">
                              {formatPrice(order.amount_cents, order.currency)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">
                              {order.customer_email || order.user?.email || 'No email'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">
                              {order.product?.title || 'Unknown Product'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground capitalize">
                              {order.provider} Payment
                            </span>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            {order.status === 'completed' && (
                              <button
                                onClick={() => handleRefundOrder(order.id)}
                                className="text-orange-600 hover:text-orange-700 flex items-center gap-2 text-sm font-medium"
                              >
                                <DollarSign className="w-4 h-4" />
                                Refund
                              </button>
                            )}
                          </div>
                          {order.provider_payment_intent_id && (
                            <button
                              onClick={() => window.open(`https://dashboard.stripe.com/payments/${order.provider_payment_intent_id}`, '_blank')}
                              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View in Stripe
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <Crown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No subscriptions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || subscriptionStatusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Subscriptions will appear here when customers subscribe'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSubscriptions.map((subscription) => {
                const statusDisplay = getSubscriptionStatusDisplay(subscription.status);
                const StatusIcon = statusDisplay.icon;
                
                return (
                  <div key={subscription.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Subscription Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <Crown className="w-5 h-5 text-primary" />
                              Subscription #{subscription.id.slice(-8)}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {subscription.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Created {formatDate(subscription.created_at)}
                            </p>
                            {subscription.current_period_end && (
                              <p className="text-sm text-muted-foreground">
                                Next billing: {formatDate(subscription.current_period_end)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Subscription Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">
                              {subscription.user?.email || 'No email'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">
                              {subscription.plan?.interval || 'Unknown'} billing
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground capitalize">
                              {subscription.provider} Subscription
                            </span>
                          </div>
                        </div>

                        {/* Subscription Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedSubscription(subscription)}
                              className="text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                              <button
                                onClick={() => handleCancelSubscription(subscription.id)}
                                className="text-red-600 hover:text-red-700 flex items-center gap-2 text-sm font-medium"
                              >
                                <XCircle className="w-4 h-4" />
                                Cancel
                              </button>
                            )}
                          </div>
                          {subscription.provider_subscription_id && (
                            <button
                              onClick={() => window.open(`https://dashboard.stripe.com/subscriptions/${subscription.provider_subscription_id}`, '_blank')}
                              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View in Stripe
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { OrderManagementPage };