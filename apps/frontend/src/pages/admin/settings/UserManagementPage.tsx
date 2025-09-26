import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
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
  // Additional user-specific fields
  email_verified?: boolean;
  account_status: 'active' | 'suspended' | 'pending';
  last_login_at?: string;
}

interface UserDetails extends User {
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

type UserFilter = 'all' | 'customers' | 'users_only' | 'subscribers' | 'inactive';

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserDetails | null>(null);
  const [editingRole, setEditingRole] = useState<{id: string, role: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterType, setFilterType] = useState<UserFilter>('all');
  const [filterSubscription, setFilterSubscription] = useState<string>('all');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching unified user data from API...');
      // Try to fetch from a unified endpoint first, fallback to separate endpoints
      let userData: User[] = [];

      try {
        // Attempt unified endpoint
        const { data } = await axios.get('/api/admin/users');
        userData = Array.isArray(data?.users) ? data.users : [];
      } catch (unifiedError) {
        // Fallback: merge data from separate endpoints
        console.log('Unified endpoint not available, trying separate endpoints...');
        
        try {
          // Get website users
          const usersResponse = await axios.get('/api/admin/profiles');
          const websiteUsers = Array.isArray(usersResponse.data?.profiles) ? usersResponse.data.profiles : [];
          
          // Get customer data
          let customerData: any[] = [];
          try {
            const customersResponse = await axios.get('/api/commerce/customers');
            customerData = Array.isArray(customersResponse.data?.customers) ? customersResponse.data.customers : [];
          } catch (customerError) {
            console.warn('Customer data not available:', customerError);
          }

          // Merge the data
          userData = websiteUsers.map((user: any) => {
            const customerInfo = customerData.find(customer => 
              customer.email === user.email || customer.id === user.id
            );
            
            return {
              id: user.id,
              username: user.username || user.email?.split('@')[0],
              full_name: user.full_name,
              email: user.email,
              role: user.role || 'user',
              subscription_status: customerInfo?.subscription_status || 'inactive',
              subscription_type: customerInfo?.subscription_type,
              stripe_customer_id: customerInfo?.stripe_customer_id,
              total_reading_minutes: customerInfo?.total_reading_minutes || 0,
              books_completed: customerInfo?.books_completed || 0,
              chapters_read: customerInfo?.chapters_read || 0,
              recent_activity_count: customerInfo?.recent_activity_count || 0,
              created_at: user.created_at,
              updated_at: user.updated_at,
              last_active_at: user.last_active_at,
              email_verified: user.email_verified,
              account_status: user.account_status || 'active',
              last_login_at: user.last_login_at
            };
          });
          
        } catch (fallbackError) {
          throw fallbackError;
        }
      }
      
      setUsers(userData);
      
      if (userData.length === 0) {
        console.warn('No users found in API response');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch users.';
      
      if (err.response?.status === 404 || errorMessage.includes('Cannot GET')) {
        setError('The user management API is not available yet. The backend needs to be updated with the new unified user management endpoints.');
      } else {
        setError(errorMessage);
      }
      
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openViewModal = async (userId: string) => {
    try {
      console.log('Fetching user details for:', userId);
      // Try unified endpoint first
      let userDetails;
      try {
        const { data } = await axios.get(`/api/admin/users/${userId}`);
        userDetails = data;
      } catch {
        // Fallback to customer endpoint if it exists
        const { data } = await axios.get(`/api/commerce/customers/${userId}`);
        userDetails = data;
      }
      
      setViewingUser(userDetails);
      setShowViewModal(true);
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch user details.';
      setError(errorMessage);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      setEditingRole(null);
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating user role:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update user role.';
      setError(errorMessage);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: 'active' | 'suspended') => {
    try {
      await axios.put(`/api/admin/users/${userId}/status`, { status: newStatus });
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating user status:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update user status.';
      setError(errorMessage);
    }
  };

  // Enhanced filtering logic
  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    const matchesSubscription = filterSubscription === 'all' || user.subscription_status === filterSubscription;
    
    const matchesType = (() => {
      switch (filterType) {
        case 'customers':
          return user.stripe_customer_id || user.subscription_status !== 'inactive';
        case 'users_only':
          return !user.stripe_customer_id && user.subscription_status === 'inactive';
        case 'subscribers':
          return ['active', 'trial'].includes(user.subscription_status);
        case 'inactive':
          return user.account_status === 'suspended' || user.subscription_status === 'canceled';
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesRole && matchesSubscription && matchesType;
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

  const getAccountStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
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
              <h3 className="text-sm font-medium">Error Loading Users</h3>
              <p className="mt-1 text-sm">{error}</p>
              <div className="mt-4 space-x-2">
                <button 
                  onClick={fetchUsers}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  Try Again
                </button>
                {error.includes('backend needs to be updated') && (
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage all users, customers, subscriptions, and roles in one place</p>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as UserFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="customers">Customers Only</option>
              <option value="users_only">Website Users Only</option>
              <option value="subscribers">Active Subscribers</option>
              <option value="inactive">Inactive Users</option>
            </select>
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
              onClick={fetchUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex space-x-4 text-sm">
          <span className="text-gray-500">
            Customers: {users.filter(u => u.stripe_customer_id || u.subscription_status !== 'inactive').length}
          </span>
          <span className="text-gray-500">
            Active Subscribers: {users.filter(u => ['active', 'trial'].includes(u.subscription_status)).length}
          </span>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredUsers.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Status
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || user.username || 'N/A'}
                          {user.stripe_customer_id && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Customer
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRole?.id === user.id ? (
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
                          onClick={() => updateUserRole(user.id, editingRole.role)}
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <button
                          onClick={() => setEditingRole({id: user.id, role: user.role})}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountStatusColor(user.account_status)}`}>
                        {user.account_status || 'active'}
                      </span>
                      {user.account_status !== 'suspended' && (
                        <button
                          onClick={() => updateUserStatus(user.id, 'suspended')}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Suspend
                        </button>
                      )}
                      {user.account_status === 'suspended' && (
                        <button
                          onClick={() => updateUserStatus(user.id, 'active')}
                          className="text-green-600 hover:text-green-800 text-xs"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionStatusColor(user.subscription_status)}`}>
                        {user.subscription_status || 'inactive'}
                      </span>
                      {user.subscription_type && (
                        <span className="text-xs text-gray-500">
                          {user.subscription_type}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col space-y-1">
                      <span>{user.chapters_read || 0} chapters read</span>
                      <span className="text-xs text-gray-500">
                        Last active: {user.last_active_at ? new Date(user.last_active_at).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openViewModal(user.id)}
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
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p>No users match your current search criteria, or the user data hasn't loaded yet.</p>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showViewModal && viewingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                User Details: {viewingUser.full_name || viewingUser.username}
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
                  <p><strong>Username:</strong> {viewingUser.username}</p>
                  <p><strong>Full Name:</strong> {viewingUser.full_name || 'Not provided'}</p>
                  <p><strong>Email:</strong> {viewingUser.email}</p>
                  <p><strong>Role:</strong> 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(viewingUser.role)}`}>
                      {viewingUser.role}
                    </span>
                  </p>
                  <p><strong>Account Status:</strong>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountStatusColor(viewingUser.account_status)}`}>
                      {viewingUser.account_status || 'active'}
                    </span>
                  </p>
                  <p><strong>Member Since:</strong> {new Date(viewingUser.created_at).toLocaleString()}</p>
                  <p><strong>Last Active:</strong> {viewingUser.last_active_at ? new Date(viewingUser.last_active_at).toLocaleString() : 'Never'}</p>
                </div>
              </div>

              {/* Subscription Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Subscription & Billing</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Status:</strong>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionStatusColor(viewingUser.subscription_status)}`}>
                      {viewingUser.subscription_status || 'inactive'}
                    </span>
                  </p>
                  <p><strong>Type:</strong> {viewingUser.subscription_type || 'free'}</p>
                  <p><strong>Stripe Customer ID:</strong> {viewingUser.stripe_customer_id || 'Not linked'}</p>
                  <p><strong>Is Customer:</strong> {viewingUser.stripe_customer_id ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Reading Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Reading Statistics</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Total Reading Minutes:</strong> {viewingUser.statistics?.total_reading_minutes || 0}</p>
                  <p><strong>Books Completed:</strong> {viewingUser.statistics?.books_completed || 0}</p>
                  <p><strong>Chapters Read:</strong> {viewingUser.statistics?.chapters_read || 0}</p>
                  <p><strong>Total Bookmarks:</strong> {viewingUser.statistics?.total_bookmarks || 0}</p>
                  <p><strong>Total Notes:</strong> {viewingUser.statistics?.total_notes || 0}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h3>
                {viewingUser.recent_orders && viewingUser.recent_orders.length > 0 ? (
                  <div className="space-y-2">
                    {viewingUser.recent_orders.map((order) => (
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

export default UserManagementPage;