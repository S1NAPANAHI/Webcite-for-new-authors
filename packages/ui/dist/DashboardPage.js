import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../packages/shared/src/supabaseClient.js';
import { Users, DollarSign, Eye, CheckSquare, LineChart, PieChart, List, AlertCircle, Inbox, } from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLineChart, PieChart as RechartsPieChart, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';
// --- Data Fetching Functions ---
// 1. Fetch Key Metrics
const fetchKeyMetrics = async () => {
    const { count: totalUsers } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    const { count: activeSubscribers } = await supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active');
    const { data: viewsData, error: viewsError } = await supabase.from('pages').select('view_count');
    const { data: revenueData, error: revenueError } = await supabase.from('purchases').select('price_id'); // Simplified for now
    if (viewsError || revenueError) {
        console.error('Error fetching key metrics:', { viewsError, revenueError });
    }
    const totalViews = viewsData?.reduce((acc, page) => acc + (page.view_count || 0), 0) || 0;
    const totalRevenue = (revenueData?.length || 0) * 10; // Placeholder
    return {
        totalUsers: totalUsers || 0,
        activeSubscribers: activeSubscribers || 0,
        totalRevenue,
        totalViews,
    };
};
// 2. Fetch New Users in the last 30 days
const fetchUsersOverTime = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());
    if (error)
        throw new Error(error.message);
    const dailyCounts = data.reduce((acc, record) => {
        const date = new Date(record.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(dailyCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
// 3. Fetch Subscription Status Breakdown
const fetchSubscriptionStatus = async () => {
    const { data, error } = await supabase.from('subscriptions').select('status');
    if (error)
        throw new Error(error.message);
    const statusCounts = data.reduce((acc, sub) => {
        const status = sub.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
};
// 4. Fetch Recent Activities
const fetchRecentActivity = async () => {
    const { data, error } = await supabase
        .from('detailed_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
    if (error)
        throw new Error(error.message);
    return data;
};
// --- Reusable Components ---
const StatCard = ({ title, value, icon: Icon, color }) => (_jsxs("div", { className: "bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex items-center space-x-4 hover:border-blue-500/50 transition-colors", children: [_jsx("div", { className: `p-3 rounded-lg bg-${color}-500/20 text-${color}-400`, children: _jsx(Icon, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: title }), _jsx("p", { className: "text-2xl font-bold text-white", children: value })] })] }));
const ChartContainer = ({ title, children, icon: Icon }) => (_jsxs("div", { className: "bg-gray-800/50 p-6 rounded-xl border border-gray-700", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(Icon, { className: "w-5 h-5 mr-2 text-gray-400" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: title })] }), _jsx("div", { className: "h-72", children: children })] }));
const LoadingSpinner = () => (_jsx("div", { className: "flex justify-center items-center h-full", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" }) }));
const ErrorDisplay = ({ message }) => (_jsxs("div", { className: "flex justify-center items-center h-full text-red-400", children: [_jsx(AlertCircle, { className: "w-6 h-6 mr-2" }), _jsxs("p", { children: ["Error loading data: ", message] })] }));
const EmptyState = ({ message, icon: Icon = Inbox }) => (_jsxs("div", { className: "flex flex-col justify-center items-center h-full text-gray-500", children: [_jsx(Icon, { className: "w-12 h-12 mb-4" }), _jsx("p", { className: "font-semibold", children: "No Data Available" }), _jsx("p", { className: "text-sm", children: message })] }));
// --- Main Dashboard Page ---
export const DashboardPage = () => {
    const { data: metrics, isLoading: loadingMetrics } = useQuery({ queryKey: ['keyMetrics'], queryFn: fetchKeyMetrics });
    const { data: usersOverTime, isLoading: loadingUsers, error: usersError } = useQuery({ queryKey: ['usersOverTime'], queryFn: fetchUsersOverTime });
    const { data: subStatus, isLoading: loadingSubs, error: subsError } = useQuery({ queryKey: ['subscriptionStatus'], queryFn: fetchSubscriptionStatus });
    const { data: recentActivity, isLoading: loadingActivity, error: activityError } = useQuery({ queryKey: ['recentActivity'], queryFn: fetchRecentActivity });
    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("header", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Admin Dashboard" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "An overview of your website's performance." })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: loadingMetrics ? (_jsx("p", { className: "text-gray-900 dark:text-white", children: "Loading metrics..." })) : (_jsxs(_Fragment, { children: [_jsx(StatCard, { title: "Total Users", value: metrics?.totalUsers.toLocaleString(), icon: Users, color: "blue" }), _jsx(StatCard, { title: "Active Subscribers", value: metrics?.activeSubscribers.toLocaleString(), icon: CheckSquare, color: "green" }), _jsx(StatCard, { title: "Total Revenue", value: `$${metrics?.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "yellow" }), _jsx(StatCard, { title: "Total Page Views", value: metrics?.totalViews.toLocaleString(), icon: Eye, color: "purple" })] })) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(ChartContainer, { title: "New Users (Last 30 Days)", icon: LineChart, children: loadingUsers ? _jsx(LoadingSpinner, {}) : usersError ? _jsx(ErrorDisplay, { message: usersError.message }) : usersOverTime && usersOverTime.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RechartsLineChart, { data: usersOverTime, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#4A5568" }), _jsx(XAxis, { dataKey: "date", stroke: "#A0AEC0", tick: { fontSize: 12 } }), _jsx(YAxis, { stroke: "#A0AEC0", tick: { fontSize: 12 } }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#1A202C', border: '1px solid #4A5568' } }), _jsx(Legend, { wrapperStyle: { fontSize: 14 } }), _jsx(Line, { type: "monotone", dataKey: "count", name: "New Users", stroke: "#3B82F6", strokeWidth: 2, dot: { r: 4 }, activeDot: { r: 8 } })] }) })) : (_jsx(EmptyState, { message: "No new user data to display for this period." })) }), _jsx(ChartContainer, { title: "Subscription Status", icon: PieChart, children: loadingSubs ? _jsx(LoadingSpinner, {}) : subsError ? _jsx(ErrorDisplay, { message: subsError.message }) : subStatus && subStatus.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RechartsPieChart, { children: [_jsx(Pie, { data: subStatus, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 100, fill: "#8884d8", labelLine: false, label: ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`, children: subStatus?.map((entry, index) => (_jsx(Cell, { fill: PIE_COLORS[index % PIE_COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: { backgroundColor: '#1A202C', border: '1px solid #4A5568' } }), _jsx(Legend, { wrapperStyle: { fontSize: 14 } })] }) })) : (_jsx(EmptyState, { message: "No subscription data available." })) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(List, { className: "w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Recent Activity" })] }), _jsx("div", { className: "space-y-4", children: loadingActivity ? _jsx(LoadingSpinner, {}) : activityError ? _jsx(ErrorDisplay, { message: activityError.message }) : recentActivity && recentActivity.length > 0 ? (recentActivity.map(activity => (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("p", { className: "text-gray-700 dark:text-gray-300", children: [_jsx("span", { className: "font-semibold text-blue-600 dark:text-blue-400", children: activity.actor_display_name || activity.actor_username || 'A user' }), " ", activity.action?.toLowerCase(), "."] }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: new Date(activity.created_at).toLocaleString() })] }, activity.id)))) : (_jsx("p", { className: "text-center text-gray-500 dark:text-gray-400 py-8", children: "No recent activity found." })) })] })] }));
};
export default DashboardPage;
//# sourceMappingURL=DashboardPage.js.map