import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { AdminLayout } from './AdminLayout';
import {
  Users,
  DollarSign,
  Eye,
  CheckSquare,
  LineChart,
  PieChart,
  List,
  AlertCircle,
  Inbox,
  Package,
  ShoppingCart,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// --- Data Fetching Functions ---

// 1. Fetch Key Metrics (Enhanced with E-commerce)
const fetchKeyMetrics = async () => {
  const { count: totalUsers } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
  const { count: activeSubscribers } = await supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active');
  const { data: viewsData, error: viewsError } = await supabase.from('pages').select('view_count');
  
  // Enhanced revenue calculation from orders
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('total_amount, status')
    .eq('status', 'completed');
    
  // Get product and order counts
  const { count: totalProducts } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('active', true);
  const { count: totalOrders } = await supabase.from('orders').select('id', { count: 'exact', head: true });
  const { count: pendingOrders } = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending');

  if (viewsError || ordersError) {
    console.error('Error fetching key metrics:', { viewsError, ordersError });
  }

  const totalViews = viewsData?.reduce((acc, page) => acc + (page.view_count || 0), 0) || 0;
  const totalRevenue = ordersData?.reduce((acc, order) => acc + order.total_amount, 0) || 0;

  return {
    totalUsers: totalUsers || 0,
    activeSubscribers: activeSubscribers || 0,
    totalRevenue,
    totalViews,
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    pendingOrders: pendingOrders || 0,
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

    if (error) throw new Error(error.message);

    const dailyCounts = data.reduce((acc, record) => {
        const date = new Date(record.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};


// 3. Fetch Subscription Status Breakdown
const fetchSubscriptionStatus = async () => {
  const { data, error } = await supabase.from('subscriptions').select('status');
  if (error) throw new Error(error.message);

  const statusCounts = data.reduce((acc, sub) => {
    const status = sub.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
};

// 4. Fetch Recent Activities
const fetchRecentActivity = async () => {
  const { data, error } = await supabase
    .from('detailed_audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  if (error) throw new Error(error.message);
  return data;
};

// --- Reusable Components ---

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex items-center space-x-4 hover:border-blue-500/50 transition-colors">
    <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, icon: Icon }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
    <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 mr-2 text-gray-400"/>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <div className="h-72">
      {children}
    </div>
  </div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
    </div>
);

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
    <div className="flex justify-center items-center h-full text-red-400">
        <AlertCircle className="w-6 h-6 mr-2"/>
        <p>Error loading data: {message}</p>
    </div>
);

interface EmptyStateProps {
  message: string;
  icon?: React.ElementType;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon: Icon = Inbox }) => (
    <div className="flex flex-col justify-center items-center h-full text-gray-500">
        <Icon className="w-12 h-12 mb-4" />
        <p className="font-semibold">No Data Available</p>
        <p className="text-sm">{message}</p>
    </div>
);

// --- Main Dashboard Page ---

export const DashboardPage: React.FC = () => {
  const { data: metrics, isLoading: loadingMetrics } = useQuery({ queryKey: ['keyMetrics'], queryFn: fetchKeyMetrics });
  const { data: usersOverTime, isLoading: loadingUsers, error: usersError } = useQuery({ queryKey: ['usersOverTime'], queryFn: fetchUsersOverTime });
  const { data: subStatus, isLoading: loadingSubs, error: subsError } = useQuery({ queryKey: ['subscriptionStatus'], queryFn: fetchSubscriptionStatus });
  const { data: recentActivity, isLoading: loadingActivity, error: activityError } = useQuery({ queryKey: ['recentActivity'], queryFn: fetchRecentActivity });

  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">An overview of your website's performance.</p>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingMetrics ? (
          <p className="text-gray-900 dark:text-white">Loading metrics...</p>
        ) : (
          <>
            <StatCard title="Total Users" value={metrics?.totalUsers.toLocaleString() ?? '0'} icon={Users} color="blue" />
            <StatCard title="Active Subscribers" value={metrics?.activeSubscribers.toLocaleString() ?? '0'} icon={CheckSquare} color="green" />
            <StatCard title="Total Revenue" value={`$${metrics?.totalRevenue.toFixed(2) ?? '0.00'}`} icon={DollarSign} color="yellow" />
            <StatCard title="Total Page Views" value={metrics?.totalViews.toLocaleString() ?? '0'} icon={Eye} color="purple" />
          </>
        )}
      </div>

      {/* E-commerce Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {loadingMetrics ? (
          <p className="text-gray-900 dark:text-white">Loading e-commerce metrics...</p>
        ) : (
          <>
            <StatCard title="Active Products" value={metrics?.totalProducts.toLocaleString() ?? '0'} icon={Package} color="blue" />
            <StatCard title="Total Orders" value={metrics?.totalOrders.toLocaleString() ?? '0'} icon={ShoppingCart} color="green" />
            <StatCard title="Pending Orders" value={metrics?.pendingOrders.toLocaleString() ?? '0'} icon={AlertCircle} color="orange" />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="New Users (Last 30 Days)" icon={LineChart}>
          {loadingUsers ? <LoadingSpinner/> : usersError ? <ErrorDisplay message={usersError.message} /> : usersOverTime && usersOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={usersOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                <YAxis stroke="#A0AEC0" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                <Legend wrapperStyle={{ fontSize: 14 }}/>
                <Line type="monotone" dataKey="count" name="New Users" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No new user data to display for this period." />
          )}
        </ChartContainer>

        <ChartContainer title="Subscription Status" icon={PieChart}>
          {loadingSubs ? <LoadingSpinner/> : subsError ? <ErrorDisplay message={subsError.message} /> : subStatus && subStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={subStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {subStatus?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                <Legend wrapperStyle={{ fontSize: 14 }}/>
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
              <EmptyState message="No subscription data available." />
          )}
        </ChartContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
              <List className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300"/>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="space-y-4">
              {loadingActivity ? <LoadingSpinner/> : activityError ? <ErrorDisplay message={activityError.message} /> : recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-center justify-between text-sm">
                          <p className="text-gray-700 dark:text-gray-300">
                              <span className="font-semibold text-blue-600 dark:text-blue-400">{activity.actor_display_name || activity.actor_username || 'A user'}</span> {activity.action?.toLowerCase()}.
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">{activity.created_at ? new Date(activity.created_at).toLocaleString() : ''}</p>
                      </div>
                  ))
              ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">No recent activity found.</p>
              )}
          </div>
      </div>
    </div>
  );
};