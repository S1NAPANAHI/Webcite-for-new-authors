import React, { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
import {
  Users,
  DollarSign,
  Eye,
  CheckSquare,
  Package,
  ShoppingCart,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Calendar,
  FileText,
  Settings,
} from 'lucide-react';

interface DashboardMetrics {
  totalUsers: number;
  activeSubscribers: number;
  totalRevenue: number;
  totalViews: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{trend}</p>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
        <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
      </div>
    </div>
  </div>
);

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon: Icon, href, color }) => (
  <a 
    href={href}
    className="block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-600 group"
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20 group-hover:bg-${color}-200 dark:group-hover:bg-${color}-900/40 transition-colors`}>
        <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  </a>
);

export const SimpleDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch basic metrics
        const [
          { count: totalUsers },
          { count: activeSubscribers },
          { data: viewsData },
          { data: ordersData },
          { count: totalProducts },
          { count: totalOrders },
          { count: pendingOrders }
        ] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('pages').select('view_count'),
          supabase.from('orders').select('total_amount, status').eq('status', 'completed'),
          supabase.from('products').select('id', { count: 'exact', head: true }).eq('active', true),
          supabase.from('orders').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending')
        ]);

        const totalViews = viewsData?.reduce((acc, page) => acc + (page.view_count || 0), 0) || 0;
        const totalRevenue = ordersData?.reduce((acc, order) => acc + order.total_amount, 0) || 0;

        setMetrics({
          totalUsers: totalUsers || 0,
          activeSubscribers: activeSubscribers || 0,
          totalRevenue,
          totalViews,
          totalProducts: totalProducts || 0,
          totalOrders: totalOrders || 0,
          pendingOrders: pendingOrders || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error Loading Dashboard</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to Zoroasterverse Admin
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your worldbuilding platform with powerful admin tools
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={metrics?.totalUsers.toLocaleString() ?? '0'} 
          icon={Users} 
          color="blue"
          trend="↑ Growing community"
        />
        <StatCard 
          title="Active Subscribers" 
          value={metrics?.activeSubscribers.toLocaleString() ?? '0'} 
          icon={CheckSquare} 
          color="green"
          trend="Premium members"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${metrics?.totalRevenue.toFixed(2) ?? '0.00'}`} 
          icon={DollarSign} 
          color="yellow"
          trend="All-time earnings"
        />
        <StatCard 
          title="Page Views" 
          value={metrics?.totalViews.toLocaleString() ?? '0'} 
          icon={Eye} 
          color="purple"
          trend="Content engagement"
        />
      </div>

      {/* E-commerce Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          title="Active Products" 
          value={metrics?.totalProducts.toLocaleString() ?? '0'} 
          icon={Package} 
          color="indigo"
          trend="Available for sale"
        />
        <StatCard 
          title="Total Orders" 
          value={metrics?.totalOrders.toLocaleString() ?? '0'} 
          icon={ShoppingCart} 
          color="green"
          trend="All-time orders"
        />
        <StatCard 
          title="Pending Orders" 
          value={metrics?.pendingOrders.toLocaleString() ?? '0'} 
          icon={AlertCircle} 
          color="orange"
          trend="Requires attention"
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAction
            title="Manage Users"
            description="View, edit, and manage user accounts"
            icon={Users}
            href="/account/admin/users"
            color="blue"
          />
          <QuickAction
            title="Content Management"
            description="Create and manage posts and pages"
            icon={FileText}
            href="/account/admin/posts"
            color="green"
          />
          <QuickAction
            title="Product Catalog"
            description="Manage your store products"
            icon={Package}
            href="/account/admin/products"
            color="purple"
          />
          <QuickAction
            title="Order Processing"
            description="View and process customer orders"
            icon={ShoppingCart}
            href="/account/admin/orders"
            color="orange"
          />
          <QuickAction
            title="Beta Applications"
            description="Review beta reader applications"
            icon={CheckSquare}
            href="/account/admin/beta-applications"
            color="indigo"
          />
          <QuickAction
            title="Timeline Events"
            description="Manage worldbuilding timeline"
            icon={Calendar}
            href="/account/admin/timeline/events"
            color="red"
          />
          <QuickAction
            title="Works & Chapters"
            description="Manage your literary works"
            icon={BookOpen}
            href="/account/admin/works"
            color="teal"
          />
          <QuickAction
            title="Analytics"
            description="View detailed performance metrics"
            icon={TrendingUp}
            href="/account/admin/analytics"
            color="pink"
          />
          <QuickAction
            title="Settings"
            description="Configure admin preferences"
            icon={Settings}
            href="/account/admin/settings"
            color="gray"
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboardPage;
