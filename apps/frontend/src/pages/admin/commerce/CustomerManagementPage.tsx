import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Customer {
  id: string;
  username: string;
  full_name?: string;
  email: string;
  role: string;
  subscription_status: string;
  subscription_type?: string;
  stripe_customer_id?: string;
  total_reading_minutes: number;
  books_completed: number;
  chapters_read: number;
  recent_activity_count: number;
  created_at: string;
  updated_at: string;
  last_active_at?: string;
}

interface CustomerDetails extends Customer {
  statistics: {
    total_reading_minutes: number;
    books_completed: number;
    chapters_read: number;
    total_bookmarks: number;
    total_notes: number;
  };
  recent_orders: Array<{
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
  }>;
  subscription_details?: any;
}

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<CustomerDetails | null>(null);
  const [editingRole, setEditingRole] = useState<{id: string, role: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterSubscription, setFilterSubscription] = useState<string>('all');

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching customers from API...');
      const { data } = await axios.get('/api/commerce/customers');
      console.log('Received customers data:', data);
      
      // Ensure we have a valid array - this is the key fix for the original error
      const customerData = Array.isArray(data?.customers) ? data.customers : [];
      setCustomers(customerData);
      
      if (customerData.length === 0) {
        console.warn('No customers found in API response');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch customers.';
      
      // If API endpoint doesn't exist yet, show helpful message
      if (err.response?.status === 404 || errorMessage.includes('Cannot GET')) {
        setError('The customer management API is not available yet. The backend needs to be redeployed with the new commerce routes.');
      } else {
        setError(errorMessage);
      }
      
      // Set empty array to prevent map errors
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openViewModal = async (customerId: string) => {
    try {
      console.log('Fetching customer details for:', customerId);
      const { data } = await axios.get(`/api/commerce/customers/${customerId}`);
      setViewingCustomer(data);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching customer details:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch customer details.';
      setError(errorMessage);
    }
  };

  const updateCustomerRole = async (customerId: string, newRole: string) => {
    try {
      await axios.put(`/api/commerce/customers/${customerId}/role`, { role: newRole });
      setEditingRole(null);
      fetchCustomers(); // Refresh the list
    } catch (err) {
      console.error('Error updating customer role:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update customer role.';
      setError(errorMessage);
    }
  };

  // Filter customers based on search and filters - Added safety check
  const filteredCustomers = Array.isArray(customers) ? customers.filter(customer => {
    const matchesSearch = !searchTerm || 
      customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || customer.role === filterRole;
    const matchesSubscription = filterSubscription === 'all' || customer.subscription_status === filterSubscription;
    
    return matchesSearch && matchesRole && matchesSubscription;
  }) : [];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-purple-100 text-purple-800';
      case 'beta_user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-yellow-100 text-yellow-800';
      case 'past_due': return 'bg-orange-100 text-orange-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-red-500">
              <h3 className="text-sm font-medium">Error Loading Customers</h3>
              <p className="mt-1 text-sm">{error}</p>
              <div className="mt-4 space-x-2">
                <button 
                  onClick={fetchCustomers}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  Try Again
                </button>
                {error.includes('backend needs to be redeployed') && (
                  <a 
                    href="https://dashboard.render.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                  >
                    Go to Render Dashboard
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
        <p className="text-gray-600">Manage users, subscriptions, and roles</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="beta_user">Beta User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subscription</label>
            <select
              value={filterSubscription}
              onChange={(e) => setFilterSubscription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subscriptions</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="inactive">Inactive</option>
              <option value="canceled">Canceled</option>
              <option value="past_due">Past Due</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchCustomers}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredCustomers.length} of {customers.length} customers
        </p>
      </div>

      {/* Customer Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredCustomers.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Since
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.full_name || customer.username || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRole?.id === customer.id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={editingRole.role}
                          onChange={(e) => setEditingRole({...editingRole, role: e.target.value})}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="user">User</option>
                          <option value="beta_user">Beta User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => updateCustomerRole(customer.id, editingRole.role)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRole(null)}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(customer.role)}`}>
                          {customer.role}
                        </span>
                        <button
                          onClick={() => setEditingRole({id: customer.id, role: customer.role})}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionStatusColor(customer.subscription_status)}`}>
                        {customer.subscription_status || 'inactive'}
                      </span>
                      {customer.subscription_type && (
                        <span className="text-xs text-gray-500">
                          {customer.subscription_type}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col space-y-1">
                      <span>{customer.chapters_read || 0} chapters read</span>
                      <span className="text-xs text-gray-500">
                        {customer.recent_activity_count || 0} recent activities
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openViewModal(customer.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">No customers found</h3>
              <p>No customers match your current search criteria, or the customer data hasn't loaded yet.</p>
            </div>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {showViewModal && viewingCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Details: {viewingCustomer.full_name || viewingCustomer.username}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Username:</strong> {viewingCustomer.username}</p>
                  <p><strong>Full Name:</strong> {viewingCustomer.full_name || 'Not provided'}</p>
                  <p><strong>Email:</strong> {viewingCustomer.email}</p>
                  <p><strong>Role:</strong> 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(viewingCustomer.role)}`}>
                      {viewingCustomer.role}
                    </span>
                  </p>
                  <p><strong>Member Since:</strong> {new Date(viewingCustomer.created_at).toLocaleString()}</p>
                  <p><strong>Last Active:</strong> {viewingCustomer.last_active_at ? new Date(viewingCustomer.last_active_at).toLocaleString() : 'Never'}</p>
                </div>
              </div>

              {/* Subscription Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Subscription</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Status:</strong>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionStatusColor(viewingCustomer.subscription_status)}`}>
                      {viewingCustomer.subscription_status || 'inactive'}
                    </span>
                  </p>
                  <p><strong>Type:</strong> {viewingCustomer.subscription_type || 'free'}</p>
                  <p><strong>Stripe Customer ID:</strong> {viewingCustomer.stripe_customer_id || 'Not linked'}</p>
                </div>
              </div>

              {/* Reading Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Reading Statistics</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Total Reading Minutes:</strong> {viewingCustomer.statistics?.total_reading_minutes || 0}</p>
                  <p><strong>Books Completed:</strong> {viewingCustomer.statistics?.books_completed || 0}</p>
                  <p><strong>Chapters Read:</strong> {viewingCustomer.statistics?.chapters_read || 0}</p>
                  <p><strong>Total Bookmarks:</strong> {viewingCustomer.statistics?.total_bookmarks || 0}</p>
                  <p><strong>Total Notes:</strong> {viewingCustomer.statistics?.total_notes || 0}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h3>
                {viewingCustomer.recent_orders && viewingCustomer.recent_orders.length > 0 ? (
                  <div className="space-y-2">
                    {viewingCustomer.recent_orders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center text-sm">
                        <span>Order #{order.id.slice(-8)}</span>
                        <span className="text-green-600">${(order.total_amount / 100).toFixed(2)}</span>
                        <span className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent orders</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagementPage;