import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, Filter, UserPlus, Edit2, Eye, Calendar, Mail, User, Crown, Clock, 
  AlertCircle, CheckCircle, XCircle, Trash2
} from 'lucide-react';

// Mock supabase client for demonstration
import { supabase } from '../../packages/shared/src/supabaseClient.js';

export const UsersManagement = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  // Modal states
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Form states for subscription management
  const [planId, setPlanId] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('active');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [subscriptionError, setSubscriptionError] = useState('');
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  
  // Form states for user details
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userDetailsMessage, setUserDetailsMessage] = useState('');
  const [userDetailsError, setUserDetailsError] = useState('');
  
  // Form states for adding new user
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserDisplayName, setNewUserDisplayName] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserMessage, setAddUserMessage] = useState('');
  const [addUserError, setAddUserError] = useState('');
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  

  // ---------- Helpers (define BEFORE memos so they are available) ----------
  function getUserStatus(user) {
        if (!user.subscriptions || user.subscriptions.length === 0) return 'No Subscription';
        const hasActive = user.subscriptions.some(sub => sub.status === 'active' || sub.status === 'trialing');
        return hasActive ? 'Active' : 'Inactive';
      }

  function getStatusIcon(status) {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Inactive': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  }

  function getRoleColor(role) {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function formatDate(value) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString();
  }

  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUsersData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users.');
      }

      const combinedUsers = await response.json();
      setUsers(combinedUsers);
      // Assuming the backend handles isAdmin check and returns appropriate data
      // For now, we'll set isAdmin based on the fetched user's role if available in combinedUsers
      if (combinedUsers.length > 0 && (combinedUsers[0].role === 'admin' || combinedUsers[0].role === 'super_admin')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

    } catch (err) {
      console.error('Error fetching users or checking admin status:', err);
      setError((err instanceof Error ? err.message : String(err)) || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    const filtered = users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.profile?.display_name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !filterRole || user.role === filterRole;
      const userStatus = getUserStatus(user);
      const matchesStatus = !filterStatus || userStatus === filterStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'display_name') {
        aValue = a.profile?.display_name || '';
        bValue = b.profile?.display_name || '';
      }
      
      if (sortBy === 'created_at' || sortBy === 'last_sign_in') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  // Pagination logic
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  // Modal handlers
  const openAddUserModal = () => {
    setNewUserEmail('');
    setNewUserDisplayName('');
    setNewUserRole('user');
    setAddUserMessage('');
    setAddUserError('');
    setShowAddUserModal(true);
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const openSubscriptionModal = (user) => {
    setSelectedUser(user);
    const activeSub = user.subscriptions?.find(sub => sub.is_active);

    if (activeSub) {
      setPlanId(activeSub.plan_id || '');
              setSubscriptionStatus(activeSub.status); // Use the actual status from the database
              setStartDate(activeSub.current_period_start ? new Date(activeSub.current_period_start).toISOString().split('T')[0] : '');
            setEndDate(activeSub.current_period_end ? new Date(activeSub.current_period_end).toISOString().split('T')[0] : '');
    } else {
      setPlanId('');
      setSubscriptionStatus('active');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
    }
    
    setSubscriptionMessage('');
    setSubscriptionError('');
    setShowSubscriptionModal(true);
  };

  const closeSubscriptionModal = () => {
    setShowSubscriptionModal(false);
    setSelectedUser(null);
    setSubscriptionLoading(false);
  };

  const openUserDetailsModal = (user) => {
    setSelectedUserForDetails(user);
    setUserDetailsMessage('');
    setUserDetailsError('');
    setShowUserDetailsModal(true);
  };

  const closeUserDetailsModal = () => {
    setShowUserDetailsModal(false);
    setSelectedUserForDetails(null);
    setUserDetailsLoading(false);
  };

  const openDeleteConfirmModal = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmModal(true);
  };

  const closeDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setUserToDelete(null);
  };

  // Form handlers
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserMessage('');
    setAddUserError('');

    try {
      if (!newUserEmail || !/\S+@\S+\.\S+/.test(newUserEmail)) {
        throw new Error('Please enter a valid email address.');
      }

      if (users.some(user => user.email.toLowerCase() === newUserEmail.toLowerCase())) {
        throw new Error('A user with this email already exists in the list.');
      }

      const payload = {
        action: 'addProfile',
        data: {
          username: newUserDisplayName || newUserEmail.split('@')[0],
          email: newUserEmail,
          role: newUserRole,
        },
      };

      const response = await fetch('/functions/v1/manage-user-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error((result as { error: string }).error || 'Failed to add user profile via Edge Function');
      }

      setAddUserMessage('User profile added successfully! Full user creation (auth.users) might require backend.');
      fetchUsersData();

      setTimeout(() => {
        closeAddUserModal();
      }, 600);
    } catch (err) {
      console.error('Error adding user:', err);
      setAddUserError((err instanceof Error ? err.message : String(err)) || 'An unexpected error occurred while adding user.');
    } finally {
      setAddUserLoading(false);
    }
  };

  

  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSubscriptionLoading(true);
    setSubscriptionMessage('');
    setSubscriptionError('');

    try {
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        throw new Error('End date must be after start date.');
      }

      const payload = {
        action: 'updateSubscription',
        userId: selectedUser.id,
        data: {
          plan_id: planId,
          status: subscriptionStatus,
          current_period_start: startDate ? new Date(startDate).toISOString() : null,
          current_period_end: endDate ? new Date(endDate).toISOString() : null,
        },
      };

      const response = await fetch('/functions/v1/manage-user-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error((result as { error: string }).error || 'Failed to update subscription via Edge Function');
      }

      setSubscriptionMessage('Subscription updated successfully!');
      fetchUsersData();

      setTimeout(() => {
        closeSubscriptionModal();
      }, 600);
    } catch (err) {
      console.error('Error managing subscription:', err);
      setSubscriptionError((err instanceof Error ? err.message : String(err)) || 'An unexpected error occurred while managing subscription.');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleUserDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserForDetails) return;

    setUserDetailsLoading(true);
    setUserDetailsMessage('');
    setUserDetailsError('');

    try {
      const formData = new FormData(e.target);
      const displayName = formData.get('displayName');
      const role = formData.get('role');

      const payload = {
        action: 'changeRole', // Reusing changeRole action for simplicity, as it updates role and display_name
        targetUserId: selectedUserForDetails.id,
        newRole: role,
        data: { display_name: displayName }, // Pass display_name as part of data
      };

      const response = await fetch('/functions/v1/manage-user-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error((result as { error: string }).error || 'Failed to update user details via Edge Function');
      }

      setUserDetailsMessage('User details updated successfully!');
      fetchUsersData(); // Refresh data

      setTimeout(() => {
        closeUserDetailsModal();
      }, 600);
    } catch (err) {
      console.error('Error updating user details:', err);
      setUserDetailsError((err instanceof Error ? err.message : String(err)) || 'An unexpected error occurred while updating user details.');
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const payload = {
        action: 'deleteUser',
        targetUserId: userToDelete.id,
      };

      const response = await fetch('/functions/v1/manage-user-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user via Edge Function');
      }

      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      closeDeleteConfirmModal();

      if (paginatedUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      alert(`User ${userToDelete.email} deleted successfully.`);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(`Failed to delete user: ${(err instanceof Error ? err.message : String(err))}`);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading users and plans...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-2 text-red-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Error</span>
          </div>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchUsersData}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">Manage users, subscriptions, and account details</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={openAddUserModal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => getUserStatus(user) === 'Active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Admin Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">No Subscription</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => getUserStatus(user) === 'No Subscription').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="No Subscription">No Subscription</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            
            <div className="text-sm text-gray-600 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                      {sortBy === 'email' && (
                        <span className="text-blue-500">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('display_name')}
                  >
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Display Name</span>
                      {sortBy === 'display_name' && (
                        <span className="text-blue-500">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <Crown className="w-4 h-4" />
                      <span>Role</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Created At</span>
                      {sortBy === 'created_at' && (
                        <span className="text-blue-500">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('last_sign_in')}
                  >
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Last Sign In</span>
                      {sortBy === 'last_sign_in' && (
                        <span className="text-blue-500">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">No users found.</td>
                  </tr>
                )}
                {paginatedUsers.map((user) => {
                  const userStatus = getUserStatus(user);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.profile?.display_name || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm">
                          {getStatusIcon(userStatus)}
                          <span className="text-gray-900">{userStatus}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.last_sign_in ? formatDate(user.last_sign_in) : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openUserDetailsModal(user)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
                            title="Edit Details"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => openSubscriptionModal(user)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
                            title="Manage Subscription"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Subscription
                          </button>
                          <button
                            onClick={() => openDeleteConfirmModal(user)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`px-3 py-1.5 text-sm border rounded-md ${currentPage === idx + 1 ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Modals ---------- */}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeAddUserModal} />
          <div className="relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name (optional)</label>
                <input
                  type="text"
                  value={newUserDisplayName}
                  onChange={(e) => setNewUserDisplayName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {addUserError && (
                <div className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {addUserError}
                </div>
              )}
              {addUserMessage && (
                <div className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {addUserMessage}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={closeAddUserModal} className="px-4 py-2 rounded-md border">Cancel</button>
                <button
                  type="submit"
                  disabled={addUserLoading}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {addUserLoading ? 'Adding…' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeSubscriptionModal} />
          <div className="relative bg-white w-full max-w-xl rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-1">Manage Subscription</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedUser.email}</p>
            <form onSubmit={handleSubscriptionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">— Select a plan —</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={subscriptionStatus}
                    onChange={(e) => setSubscriptionStatus(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">active</option>
                    <option value="trialing">trialing</option>
                    <option value="canceled">canceled</option>
                    <option value="paused">paused</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {subscriptionError && (
                <div className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {subscriptionError}
                </div>
              )}
              {subscriptionMessage && (
                <div className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {subscriptionMessage}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={closeSubscriptionModal} className="px-4 py-2 rounded-md border">Cancel</button>
                <button
                  type="submit"
                  disabled={subscriptionLoading}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {subscriptionLoading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetailsModal && selectedUserForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeUserDetailsModal} />
          <div className="relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-1">Edit User Details</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedUserForDetails.email}</p>

            <form onSubmit={handleUserDetailsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  name="displayName"
                  type="text"
                  defaultValue={selectedUserForDetails.profile?.display_name || ''}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  defaultValue={selectedUserForDetails.role}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {userDetailsError && (
                <div className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {userDetailsError}
                </div>
              )}
              {userDetailsMessage && (
                <div className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {userDetailsMessage}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={closeUserDetailsModal} className="px-4 py-2 rounded-md border">Cancel</button>
                <button
                  type="submit"
                  disabled={userDetailsLoading}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {userDetailsLoading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirmModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeDeleteConfirmModal} />
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-1">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Delete user?</h3>
                <p className="text-sm text-gray-600 mt-1">This will permanently remove <span className="font-mono">{userToDelete.email}</span> and their subscriptions from the local list.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button onClick={closeDeleteConfirmModal} className="px-4 py-2 rounded-md border">Cancel</button>
              <button onClick={handleDeleteUser} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


