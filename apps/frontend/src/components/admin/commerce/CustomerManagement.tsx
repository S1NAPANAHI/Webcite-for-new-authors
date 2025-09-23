import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Crown,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  Edit,
  Ban,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react';
import { supabase } from '@zoroaster/shared';
import type {
  Customer,
  CustomerFilter,
  CustomerSort,
  CustomerStats,
  SubscriptionStatus,
  SubscriptionTier
} from '../../../types/customer';
import {
  SUBSCRIPTION_TIER_CONFIG,
  SUBSCRIPTION_STATUS_CONFIG,
  getCustomerDisplayName,
  formatCustomerJoinDate,
  calculateCustomerLifetimeValue
} from '../../../types/customer';

interface CustomerManagementProps {
  className?: string;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ className = '' }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  
  // UI State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  
  // Filters and Sorting
  const [filters, setFilters] = useState<CustomerFilter>({
    search: '',
    subscription_tier: undefined,
    subscription_status: undefined
  });
  const [sort, setSort] = useState<CustomerSort>({
    field: 'created_at',
    direction: 'desc'
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query
      let query = supabase
        .from('user_subscription_status')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (filters.search) {
        query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`);
      }
      
      if (filters.subscription_tier?.length) {
        query = query.in('subscription_tier', filters.subscription_tier);
      }
      
      if (filters.subscription_status?.length) {
        query = query.in('subscription_status', filters.subscription_status);
      }
      
      if (filters.has_premium_access !== undefined) {
        query = query.eq('has_premium_access', filters.has_premium_access);
      }
      
      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });
      
      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);
      
      const { data, error: fetchError, count } = await query;
      
      if (fetchError) throw fetchError;
      
      setCustomers(data || []);
      setTotalCustomers(count || 0);
      
      console.log('✅ Loaded customers:', data?.length, 'Total:', count);
    } catch (err: any) {
      console.error('❌ Error fetching customers:', err);
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, currentPage, itemsPerPage]);

  const fetchStats = useCallback(async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status, created_at');
      
      if (profilesError) throw profilesError;
      
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      const stats: CustomerStats = {
        total_customers: profiles.length,
        free_users: profiles.filter(p => p.subscription_tier === 'free').length,
        premium_users: profiles.filter(p => p.subscription_tier === 'premium').length,
        patron_users: profiles.filter(p => p.subscription_tier === 'patron').length,
        admin_users: 0, // Would need additional query for admin users
        active_subscriptions: profiles.filter(p => p.subscription_status === 'active').length,
        trial_users: profiles.filter(p => p.subscription_status === 'trialing').length,
        canceled_subscriptions: profiles.filter(p => p.subscription_status === 'canceled').length,
        monthly_recurring_revenue: 0, // Would need actual revenue calculation
        churn_rate: 0, // Would need historical data
        new_customers_this_month: profiles.filter(p => new Date(p.created_at) >= thisMonth).length,
        new_customers_last_month: profiles.filter(p => 
          new Date(p.created_at) >= lastMonth && new Date(p.created_at) < thisMonth
        ).length
      };
      
      setStats(stats);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof CustomerFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSort = (field: CustomerSort['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(c => c.id));
    }
  };

  const openCustomerModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const updateCustomerTier = async (customerId: string, newTier: SubscriptionTier) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_tier: newTier })
        .eq('id', customerId);
      
      if (error) throw error;
      
      // Refresh customers list
      fetchCustomers();
      fetchStats();
      
      console.log('✅ Updated customer tier:', customerId, newTier);
    } catch (err: any) {
      console.error('❌ Error updating customer tier:', err);
      setError(err.message);
    }
  };

  const getStatusIcon = (status: SubscriptionStatus) => {
    const config = SUBSCRIPTION_STATUS_CONFIG[status];
    switch (config.icon) {
      case 'CheckCircle': return <CheckCircle className="w-4 h-4" />;
      case 'XCircle': return <XCircle className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getTierIcon = (tier: SubscriptionTier) => {
    const config = SUBSCRIPTION_TIER_CONFIG[tier];
    switch (config.icon) {
      case 'Crown': return <Crown className="w-4 h-4" />;
      case 'Star': return <Star className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const exportCustomers = () => {
    const csv = customers.map(customer => ({
      name: getCustomerDisplayName(customer),
      email: customer.email,
      tier: customer.subscription_tier,
      status: customer.subscription_status,
      joined: customer.created_at,
      ltv: calculateCustomerLifetimeValue(customer)
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(csv[0]).join(',') + '\n' +
      csv.map(row => Object.values(row).join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(totalCustomers / itemsPerPage);

  if (error) {
    return (
      <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Customers</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchCustomers();
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold text-foreground">{stats.total_customers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-bold text-foreground">{stats.active_subscriptions}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Premium Users</p>
                <p className="text-2xl font-bold text-foreground">{stats.premium_users}</p>
              </div>
              <Crown className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-2xl font-bold text-foreground">{stats.new_customers_this_month}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.subscription_tier?.[0] || ''}
              onChange={(e) => handleFilterChange('subscription_tier', e.target.value ? [e.target.value as SubscriptionTier] : undefined)}
              className="px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
            >
              <option value="">All Tiers</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="patron">Patron</option>
            </select>
            
            <select
              value={filters.subscription_status?.[0] || ''}
              onChange={(e) => handleFilterChange('subscription_status', e.target.value ? [e.target.value as SubscriptionStatus] : undefined)}
              className="px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="trialing">Trial</option>
              <option value="canceled">Canceled</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button
              onClick={exportCustomers}
              disabled={customers.length === 0}
              className="px-4 py-2 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            <button
              onClick={() => {
                fetchCustomers();
                fetchStats();
              }}
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCustomers.length > 0 && (
          <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                {selectedCustomers.length} customer(s) selected
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
                  Upgrade to Premium
                </button>
                <button className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200">
                  Send Email
                </button>
                <button className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border focus:ring-primary/20 text-primary"
                  />
                </th>
                <th 
                  className="p-4 text-left font-medium text-foreground cursor-pointer hover:text-primary transition-colors duration-200"
                  onClick={() => handleSort('email')}
                >
                  Customer
                </th>
                <th 
                  className="p-4 text-left font-medium text-foreground cursor-pointer hover:text-primary transition-colors duration-200"
                  onClick={() => handleSort('subscription_tier')}
                >
                  Tier
                </th>
                <th 
                  className="p-4 text-left font-medium text-foreground cursor-pointer hover:text-primary transition-colors duration-200"
                  onClick={() => handleSort('subscription_status')}
                >
                  Status
                </th>
                <th 
                  className="p-4 text-left font-medium text-foreground cursor-pointer hover:text-primary transition-colors duration-200"
                  onClick={() => handleSort('created_at')}
                >
                  Joined
                </th>
                <th className="p-4 text-left font-medium text-foreground">
                  LTV
                </th>
                <th className="p-4 text-left font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={7} className="p-4">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-muted h-10 w-10"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No customers found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-t border-border hover:bg-muted/25 transition-colors duration-200">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleCustomerSelect(customer.id)}
                        className="rounded border-border focus:ring-primary/20 text-primary"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {getCustomerDisplayName(customer)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white bg-${SUBSCRIPTION_TIER_CONFIG[customer.subscription_tier].color}-500`}>
                          {getTierIcon(customer.subscription_tier)}
                        </div>
                        <span className="font-medium text-foreground">
                          {SUBSCRIPTION_TIER_CONFIG[customer.subscription_tier].label}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`text-${SUBSCRIPTION_STATUS_CONFIG[customer.subscription_status].color}-500`}>
                          {getStatusIcon(customer.subscription_status)}
                        </div>
                        <span className="text-sm text-foreground">
                          {SUBSCRIPTION_STATUS_CONFIG[customer.subscription_status].label}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatCustomerJoinDate(customer.created_at)}
                    </td>
                    <td className="p-4 text-sm text-foreground font-medium">
                      ${calculateCustomerLifetimeValue(customer).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openCustomerModal(customer)}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                          title="More Actions"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCustomers)} of {totalCustomers} customers
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded transition-colors duration-200 ${
                      currentPage === pageNum
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  {getCustomerDisplayName(selectedCustomer)}
                </h2>
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium text-foreground">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Full Name:</span>
                    <p className="font-medium text-foreground">{selectedCustomer.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Joined:</span>
                    <p className="font-medium text-foreground">{formatCustomerJoinDate(selectedCustomer.created_at)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Customer ID:</span>
                    <p className="font-mono text-xs text-foreground">{selectedCustomer.id}</p>
                  </div>
                </div>
              </div>

              {/* Subscription Info */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Subscription Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current Tier:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white bg-${SUBSCRIPTION_TIER_CONFIG[selectedCustomer.subscription_tier].color}-500`}>
                        {getTierIcon(selectedCustomer.subscription_tier)}
                      </div>
                      <span className="font-medium text-foreground">
                        {SUBSCRIPTION_TIER_CONFIG[selectedCustomer.subscription_tier].label}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`text-${SUBSCRIPTION_STATUS_CONFIG[selectedCustomer.subscription_status].color}-500`}>
                        {getStatusIcon(selectedCustomer.subscription_status)}
                      </div>
                      <span className="font-medium text-foreground">
                        {SUBSCRIPTION_STATUS_CONFIG[selectedCustomer.subscription_status].label}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Premium Access:</span>
                    <p className="font-medium text-foreground">{selectedCustomer.has_premium_access ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lifetime Value:</span>
                    <p className="font-medium text-foreground">${calculateCustomerLifetimeValue(selectedCustomer).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selectedCustomer.subscription_tier}
                    onChange={(e) => updateCustomerTier(selectedCustomer.id, e.target.value as SubscriptionTier)}
                    className="px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="patron">Patron</option>
                  </select>
                  
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Email
                  </button>
                  
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2">
                    <Ban className="w-4 h-4" />
                    Suspend
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-border">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;