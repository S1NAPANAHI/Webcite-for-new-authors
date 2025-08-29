import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, UserPlus, Edit2, Eye, Calendar, Mail, User, Crown, Clock, AlertCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
// Mock supabase client for demonstration
import { supabase } from '@zoroaster/shared';
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
        if (!user.subscriptions || user.subscriptions.length === 0)
            return 'No Subscription';
        const hasActive = user.subscriptions.some(sub => sub.status === 'active' || sub.status === 'trialing');
        return hasActive ? 'Active' : 'Inactive';
    }
    function getStatusIcon(status) {
        switch (status) {
            case 'Active': return _jsx(CheckCircle, { className: "w-4 h-4 text-green-500" });
            case 'Inactive': return _jsx(XCircle, { className: "w-4 h-4 text-red-500" });
            default: return _jsx(AlertCircle, { className: "w-4 h-4 text-gray-400" });
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
        if (!value)
            return '—';
        const d = new Date(value);
        if (Number.isNaN(d.getTime()))
            return '—';
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
            }
            else {
                setIsAdmin(false);
            }
        }
        catch (err) {
            console.error('Error fetching users or checking admin status:', err);
            setError((err instanceof Error ? err.message : String(err)) || 'An unexpected error occurred.');
        }
        finally {
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
            if (aValue < bValue)
                return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue)
                return sortOrder === 'asc' ? 1 : -1;
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
        }
        else {
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
                throw new Error(result.error || 'Failed to add user profile via Edge Function');
            }
            setAddUserMessage('User profile added successfully! Full user creation (auth.users) might require backend.');
            fetchUsersData();
            setTimeout(() => {
                closeAddUserModal();
            }, 600);
        }
        catch (err) {
            console.error('Error adding user:', err);
            setAddUserError((err instanceof Error ? err.message : String(err)) || 'An unexpected error occurred while adding user.');
        }
        finally {
            setAddUserLoading(false);
        }
    };
    const handleSubscriptionSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser)
            return;
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
                throw new Error(result.error || 'Failed to update subscription via Edge Function');
            }
            setSubscriptionMessage('Subscription updated successfully!');
            fetchUsersData();
            setTimeout(() => {
                closeSubscriptionModal();
            }, 600);
        }
        catch (err) {
            console.error('Error managing subscription:', err);
            setSubscriptionError((err instanceof Error ? err.message : String(err)) || 'An unexpected error occurred while managing subscription.');
        }
        finally {
            setSubscriptionLoading(false);
        }
    };
    const handleUserDetailsSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUserForDetails)
            return;
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
                throw new Error(result.error || 'Failed to update user details via Edge Function');
            }
            setUserDetailsMessage('User details updated successfully!');
            fetchUsersData(); // Refresh data
            setTimeout(() => {
                closeUserDetailsModal();
            }, 600);
        }
        catch (err) {
            console.error('Error updating user details:', err);
            setUserDetailsError((err instanceof Error ? err.message : String(err)) || 'An unexpected error occurred while updating user details.');
        }
        finally {
            setUserDetailsLoading(false);
        }
    };
    const handleDeleteUser = async () => {
        if (!userToDelete)
            return;
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
        }
        catch (err) {
            console.error('Error deleting user:', err);
            alert(`Failed to delete user: ${(err instanceof Error ? err.message : String(err))}`);
        }
    };
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortBy(field);
            setSortOrder('asc');
        }
        setCurrentPage(1); // Reset to first page when sorting
    };
    // Pagination handlers
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages)
            return;
        setCurrentPage(page);
    };
    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" }), _jsx("span", { className: "text-gray-600", children: "Loading users and plans..." })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50", children: _jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-6 max-w-md", children: [_jsxs("div", { className: "flex items-center space-x-2 text-red-600 mb-2", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), _jsx("span", { className: "font-semibold", children: "Error" })] }), _jsx("p", { className: "text-red-700", children: error }), _jsx("button", { onClick: fetchUsersData, className: "mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors", children: "Try Again" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "User Management" }), _jsx("p", { className: "text-gray-600", children: "Manage users, subscriptions, and account details" })] }), _jsx("div", { className: "mt-4 sm:mt-0", children: _jsxs("button", { onClick: openAddUserModal, className: "inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors", children: [_jsx(UserPlus, { className: "w-4 h-4 mr-2" }), "Add User"] }) })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx(User, { className: "w-8 h-8 text-blue-500" }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Total Users" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: users.length })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx(CheckCircle, { className: "w-8 h-8 text-green-500" }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Active Subscriptions" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: users.filter(user => getUserStatus(user) === 'Active').length })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Crown, { className: "w-8 h-8 text-purple-500" }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Admin Users" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: users.filter(user => user.role === 'admin').length })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx(AlertCircle, { className: "w-8 h-8 text-gray-400" }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "No Subscription" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: users.filter(user => getUserStatus(user) === 'No Subscription').length })] })] }) })] }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", placeholder: "Search users...", value: searchTerm, onChange: (e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }, className: "pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("select", { value: filterRole, onChange: (e) => {
                                        setFilterRole(e.target.value);
                                        setCurrentPage(1);
                                    }, className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "All Roles" }), _jsx("option", { value: "admin", children: "Admin" }), _jsx("option", { value: "user", children: "User" })] }), _jsxs("select", { value: filterStatus, onChange: (e) => {
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1);
                                    }, className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "Active", children: "Active" }), _jsx("option", { value: "Inactive", children: "Inactive" }), _jsx("option", { value: "No Subscription", children: "No Subscription" })] }), _jsxs("select", { value: itemsPerPage, onChange: (e) => handleItemsPerPageChange(Number(e.target.value)), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: 5, children: "5 per page" }), _jsx("option", { value: 10, children: "10 per page" }), _jsx("option", { value: 25, children: "25 per page" }), _jsx("option", { value: 50, children: "50 per page" })] }), _jsxs("div", { className: "text-sm text-gray-600 flex items-center", children: [_jsx(Filter, { className: "w-4 h-4 mr-2" }), filteredUsers.length, " of ", users.length, " users"] })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: () => handleSort('email'), children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Mail, { className: "w-4 h-4" }), _jsx("span", { children: "Email" }), sortBy === 'email' && (_jsx("span", { className: "text-blue-500", children: sortOrder === 'asc' ? '↑' : '↓' }))] }) }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: () => handleSort('display_name'), children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(User, { className: "w-4 h-4" }), _jsx("span", { children: "Display Name" }), sortBy === 'display_name' && (_jsx("span", { className: "text-blue-500", children: sortOrder === 'asc' ? '↑' : '↓' }))] }) }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Crown, { className: "w-4 h-4" }), _jsx("span", { children: "Role" })] }) }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Subscription Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: () => handleSort('created_at'), children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsx("span", { children: "Created At" }), sortBy === 'created_at' && (_jsx("span", { className: "text-blue-500", children: sortOrder === 'asc' ? '↑' : '↓' }))] }) }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: () => handleSort('last_sign_in'), children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsx("span", { children: "Last Sign In" }), sortBy === 'last_sign_in' && (_jsx("span", { className: "text-blue-500", children: sortOrder === 'asc' ? '↑' : '↓' }))] }) }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsxs("tbody", { className: "bg-white divide-y divide-gray-200", children: [paginatedUsers.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "px-6 py-8 text-center text-sm text-gray-500", children: "No users found." }) })), paginatedUsers.map((user) => {
                                                    const userStatus = getUserStatus(user);
                                                    return (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-8 w-8", children: _jsx("div", { className: "h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center", children: _jsx(User, { className: "w-4 h-4 text-gray-500" }) }) }), _jsx("div", { className: "ml-3", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: user.email }) })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: user.profile?.display_name || '—' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`, children: user.role }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center space-x-2 text-sm", children: [getStatusIcon(userStatus), _jsx("span", { className: "text-gray-900", children: userStatus })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: formatDate(user.created_at) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: user.last_sign_in ? formatDate(user.last_sign_in) : 'Never' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-700", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => openUserDetailsModal(user), className: "inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50", title: "Edit Details", children: [_jsx(Edit2, { className: "w-4 h-4 mr-1" }), "Edit"] }), _jsxs("button", { onClick: () => openSubscriptionModal(user), className: "inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50", title: "Manage Subscription", children: [_jsx(Eye, { className: "w-4 h-4 mr-1" }), "Subscription"] }), _jsxs("button", { onClick: () => openDeleteConfirmModal(user), className: "inline-flex items-center px-2.5 py-1.5 border border-red-300 text-red-700 rounded-md hover:bg-red-50", title: "Delete User", children: [_jsx(Trash2, { className: "w-4 h-4 mr-1" }), "Delete"] })] }) })] }, user.id));
                                                })] })] }) }), _jsxs("div", { className: "px-6 py-4 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-gray-600", children: ["Page ", currentPage, " of ", totalPages] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, className: "px-3 py-1.5 text-sm border rounded-md disabled:opacity-50", children: "Previous" }), Array.from({ length: totalPages }).map((_, idx) => (_jsx("button", { onClick: () => handlePageChange(idx + 1), className: `px-3 py-1.5 text-sm border rounded-md ${currentPage === idx + 1 ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`, children: idx + 1 }, idx))), _jsx("button", { onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages, className: "px-3 py-1.5 text-sm border rounded-md disabled:opacity-50", children: "Next" })] })] })] })] }), showAddUserModal && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: closeAddUserModal }), _jsxs("div", { className: "relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Add New User" }), _jsxs("form", { onSubmit: handleAddUser, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", value: newUserEmail, onChange: (e) => setNewUserEmail(e.target.value), className: "w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "user@example.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Display Name (optional)" }), _jsx("input", { type: "text", value: newUserDisplayName, onChange: (e) => setNewUserDisplayName(e.target.value), className: "w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Jane Doe" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Role" }), _jsxs("select", { value: newUserRole, onChange: (e) => setNewUserRole(e.target.value), className: "w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "user", children: "User" }), _jsx("option", { value: "admin", children: "Admin" }), _jsx("option", { value: "super_admin", children: "Super Admin" })] })] }), addUserError && (_jsxs("div", { className: "text-sm text-red-600 flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), addUserError] })), addUserMessage && (_jsxs("div", { className: "text-sm text-green-600 flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), addUserMessage] })), _jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: closeAddUserModal, className: "px-4 py-2 rounded-md border", children: "Cancel" }), _jsx("button", { type: "submit", disabled: addUserLoading, className: "px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50", children: addUserLoading ? 'Adding…' : 'Add User' })] })] })] })] })), showSubscriptionModal && selectedUser && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: closeSubscriptionModal }), _jsxs("div", { className: "relative bg-white w-full max-w-xl rounded-lg shadow-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-1", children: "Manage Subscription" }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: selectedUser.email }), _jsxs("form", { onSubmit: handleSubscriptionSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Plan" }), _jsxs("select", { value: planId, onChange: (e) => setPlanId(e.target.value), className: "w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "\u2014 Select a plan \u2014" }), _jsx("option", { value: "Monthly", children: "Monthly" }), _jsx("option", { value: "Yearly", children: "Yearly" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), _jsxs("select", { value: subscriptionStatus, onChange: (e) => setSubscriptionStatus(e.target.value), className: "w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "active", children: "active" }), _jsx("option", { value: "trialing", children: "trialing" }), _jsx("option", { value: "canceled", children: "canceled" }), _jsx("option", { value: "paused", children: "paused" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Date" }), _jsx("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Date" }), _jsx("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: "w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] })] }), subscriptionError && (_jsxs("div", { className: "text-sm text-red-600 flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), subscriptionError] })), subscriptionMessage && (_jsxs("div", { className: "text-sm text-green-600 flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), subscriptionMessage] })), _jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: closeSubscriptionModal, className: "px-4 py-2 rounded-md border", children: "Cancel" }), _jsx("button", { type: "submit", disabled: subscriptionLoading, className: "px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50", children: subscriptionLoading ? 'Saving…' : 'Save Changes' })] })] })] })] })), showUserDetailsModal && selectedUserForDetails && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: closeUserDetailsModal }), _jsxs("div", { className: "relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-1", children: "Edit User Details" }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: selectedUserForDetails.email }), _jsxs("form", { onSubmit: handleUserDetailsSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Display Name" }), _jsx("input", { name: "displayName", type: "text", defaultValue: selectedUserForDetails.profile?.display_name || '', className: "w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Jane Doe" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Role" }), _jsxs("select", { name: "role", defaultValue: selectedUserForDetails.role, className: "w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "user", children: "User" }), _jsx("option", { value: "admin", children: "Admin" }), _jsx("option", { value: "super_admin", children: "Super Admin" })] })] }), userDetailsError && (_jsxs("div", { className: "text-sm text-red-600 flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), userDetailsError] })), userDetailsMessage && (_jsxs("div", { className: "text-sm text-green-600 flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), userDetailsMessage] })), _jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: closeUserDetailsModal, className: "px-4 py-2 rounded-md border", children: "Cancel" }), _jsx("button", { type: "submit", disabled: userDetailsLoading, className: "px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50", children: userDetailsLoading ? 'Saving…' : 'Save Changes' })] })] })] })] })), showDeleteConfirmModal && userToDelete && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: closeDeleteConfirmModal }), _jsxs("div", { className: "relative bg-white w-full max-w-md rounded-lg shadow-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "shrink-0 mt-1", children: _jsx(AlertCircle, { className: "w-6 h-6 text-red-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: "Delete user?" }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: ["This will permanently remove ", _jsx("span", { className: "font-mono", children: userToDelete.email }), " and their subscriptions from the local list."] })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-2 mt-6", children: [_jsx("button", { onClick: closeDeleteConfirmModal, className: "px-4 py-2 rounded-md border", children: "Cancel" }), _jsx("button", { onClick: handleDeleteUser, className: "px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700", children: "Delete" })] })] })] }))] }));
};
