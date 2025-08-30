import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '@zoroaster/shared';
import { Crown, Calendar, CreditCard, BookOpen, AlertCircle, CheckCircle, X, Loader2 } from 'lucide-react';
const SubscriptionManager = () => {
    const { user, isAuthenticated } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(null);
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCancelSubscription = async (subscriptionId) => {
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
        }
        finally {
            setIsCanceling(false);
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const formatPrice = (price, interval) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price / 100);
    };
    const getStatusColor = (status) => {
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
    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return _jsx(CheckCircle, { className: "w-4 h-4" });
            case 'canceled':
                return _jsx(X, { className: "w-4 h-4" });
            case 'past_due':
                return _jsx(AlertCircle, { className: "w-4 h-4" });
            case 'unpaid':
                return _jsx(AlertCircle, { className: "w-4 h-4" });
            default:
                return _jsx(AlertCircle, { className: "w-4 h-4" });
        }
    };
    if (!isAuthenticated) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Crown, { className: "w-8 h-8 text-gray-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Sign in to view subscriptions" }), _jsx("p", { className: "text-gray-600", children: "Please sign in to manage your subscription." })] }));
    }
    if (isLoading) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" }), _jsx("p", { className: "text-gray-600", children: "Loading your subscriptions..." })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(AlertCircle, { className: "w-8 h-8 text-red-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Error loading subscriptions" }), _jsx("p", { className: "text-gray-600 mb-4", children: error }), _jsx("button", { onClick: fetchSubscriptions, className: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors", children: "Try Again" })] }));
    }
    if (subscriptions.length === 0) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Crown, { className: "w-8 h-8 text-gray-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No active subscriptions" }), _jsx("p", { className: "text-gray-600 mb-4", children: "You don't have any active subscriptions at the moment." }), _jsxs("a", { href: "/subscriptions", className: "bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2", children: [_jsx(BookOpen, { className: "w-5 h-5" }), "Browse Plans"] })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Your Subscriptions" }), _jsx("a", { href: "/subscriptions", className: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm", children: "View All Plans" })] }), subscriptions.map((subscription) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center", children: _jsx(Crown, { className: "w-5 h-5 text-purple-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: subscription.plan_name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`, children: _jsxs("span", { className: "flex items-center gap-1", children: [getStatusIcon(subscription.status), subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)] }) }), subscription.cancel_at_period_end && (_jsx("span", { className: "px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium", children: "Canceling" }))] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: formatPrice(subscription.plan_price, subscription.plan_interval) }), _jsxs("div", { className: "text-sm text-gray-500", children: ["per ", subscription.plan_interval] })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsxs("span", { children: [_jsx("strong", { children: "Current period:" }), " ", formatDate(subscription.current_period_start), " - ", formatDate(subscription.current_period_end)] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(CreditCard, { className: "w-4 h-4" }), _jsxs("span", { children: [_jsx("strong", { children: "ID:" }), " ", subscription.stripe_subscription_id.slice(-8)] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("a", { href: "/library", className: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2", children: [_jsx(BookOpen, { className: "w-4 h-4" }), "Access Library"] }), subscription.status === 'active' && !subscription.cancel_at_period_end && (_jsx("button", { onClick: () => setShowCancelModal(subscription.id), className: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2", children: "Cancel Subscription" })), subscription.cancel_at_period_end && (_jsxs("span", { className: "text-sm text-gray-500", children: ["Subscription will end on ", formatDate(subscription.current_period_end)] }))] })] }, subscription.id))), showCancelModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-2xl max-w-md w-full p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Cancel Subscription?" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Your subscription will remain active until the end of the current billing period. You can reactivate it at any time." }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setShowCancelModal(null), className: "flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors", disabled: isCanceling, children: "Keep Subscription" }), _jsx("button", { onClick: () => handleCancelSubscription(showCancelModal), disabled: isCanceling, className: "flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2", children: isCanceling ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), "Canceling..."] })) : ('Cancel Subscription') })] })] }) }))] }));
};
export default SubscriptionManager;
//# sourceMappingURL=SubscriptionManager.js.map