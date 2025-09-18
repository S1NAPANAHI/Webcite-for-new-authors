import { useEffect, useState } from 'react';
import { useAuth } from '@zoroaster/shared/hooks/useAuth';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  FileText, 
  ShoppingCart,
  DollarSign,
  Activity,
  Calendar,
  Plus,
  Eye,
  Edit,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardData {
  books: any[];
  chapters: any[];
  users: any[];
  blogPosts: any[];
  orders: any[];
}

interface KPIData {
  totalBooks: number;
  totalChapters: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  activeUsers: number;
}

const mockDashboardData: DashboardData = {
  books: [
    { id: 'book1', title: 'The Chronicles of Ahura', state: 'published', created_at: new Date(Date.now() - 86400000).toISOString(), views: 1250 },
    { id: 'book2', title: 'Shadows of Ahriman', state: 'draft', created_at: new Date(Date.now() - 172800000).toISOString(), views: 890 },
    { id: 'book3', title: 'The Fire Temple', state: 'published', created_at: new Date(Date.now() - 259200000).toISOString(), views: 2100 },
  ],
  chapters: [
    { id: 'chap1', title: 'The Beginning of Light', state: 'published', created_at: new Date().toISOString(), book: 'The Chronicles of Ahura' },
    { id: 'chap2', title: 'Ancient Prophecies', state: 'draft', created_at: new Date(Date.now() - 86400000).toISOString(), book: 'Shadows of Ahriman' },
    { id: 'chap3', title: 'The Sacred Flame', state: 'published', created_at: new Date(Date.now() - 172800000).toISOString(), book: 'The Fire Temple' },
  ],
  users: [
    { id: 'user1', email: 'admin@zoroasterverse.com', subscription_status: 'admin', created_at: new Date(Date.now() - 2592000000).toISOString(), last_active: new Date().toISOString() },
    { id: 'user2', email: 'premium@reader.com', subscription_status: 'premium', created_at: new Date(Date.now() - 1296000000).toISOString(), last_active: new Date(Date.now() - 86400000).toISOString() },
    { id: 'user3', email: 'beta@tester.com', subscription_status: 'beta', created_at: new Date(Date.now() - 604800000).toISOString(), last_active: new Date(Date.now() - 3600000).toISOString() },
  ],
  blogPosts: [
    { id: 'post1', title: 'Writing in the Zoroastrian World', status: 'published', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'post2', title: 'Character Development Guide', status: 'draft', created_at: new Date().toISOString() },
  ],
  orders: [
    { id: 'order1', amount: 29.99, status: 'completed', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'order2', amount: 19.99, status: 'pending', created_at: new Date().toISOString() },
  ],
};

interface KPICardProps {
  title: string;
  value: number | string;
  trend?: number;
  icon: React.ElementType;
  color: string;
  format?: 'number' | 'currency' | 'percentage';
}

function KPICard({ title, value, trend, icon: Icon, color, format = 'number' }: KPICardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendColor = (trend?: number) => {
    if (!trend) return 'text-gray-500';
    return trend > 0 ? 'text-green-500' : 'text-red-500';
  };

  const TrendIcon = trend && trend > 0 ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formatValue(value)}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor(trend)}`}>
              <TrendIcon className="w-4 h-4" />
              <span>{Math.abs(trend)}%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

function QuickAction({ title, description, icon: Icon, href, color }: QuickActionProps) {
  return (
    <Link
      to={href}
      className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{title}</h4>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    // Simulate loading delay
    setTimeout(() => {
      setData(mockDashboardData);
      setKpiData({
        totalBooks: mockDashboardData.books.length,
        totalChapters: mockDashboardData.chapters.length,
        totalUsers: mockDashboardData.users.length,
        totalRevenue: mockDashboardData.orders.reduce((sum, order) => sum + order.amount, 0),
        monthlyGrowth: 12.5,
        activeUsers: mockDashboardData.users.filter(user => 
          new Date(user.last_active) > new Date(Date.now() - 86400000 * 7)
        ).length
      });
      setLoading(false);
    }, 1000);
  }, [isAdmin, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Activity className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You must be an admin to view this page.</p>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'New Blog Post',
      description: 'Create a new blog post',
      icon: Plus,
      href: '/admin/content/blog/new',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'New Chapter',
      description: 'Add a chapter to your work',
      icon: FileText,
      href: '/admin/content/chapters/new',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Manage Users',
      description: 'View and manage users',
      icon: Users,
      href: '/admin/settings/users',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'View Analytics',
      description: 'Check detailed analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, Admin
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your Zoroasterverse platform today.
          </p>
        </div>
        <div className="text-sm text-gray-500 flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Books"
          value={kpiData?.totalBooks || 0}
          trend={8.2}
          icon={BookOpen}
          color="from-blue-500 to-blue-600"
        />
        <KPICard
          title="Total Chapters"
          value={kpiData?.totalChapters || 0}
          trend={15.3}
          icon={FileText}
          color="from-green-500 to-green-600"
        />
        <KPICard
          title="Active Users"
          value={kpiData?.activeUsers || 0}
          trend={12.5}
          icon={Users}
          color="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Revenue"
          value={kpiData?.totalRevenue || 0}
          trend={23.1}
          icon={DollarSign}
          color="from-orange-500 to-orange-600"
          format="currency"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickAction key={action.href} {...action} />
          ))}
        </div>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Books */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Books</h3>
            <Link 
              to="/admin/content/works" 
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data?.books?.slice(0, 3).map((book: any) => (
                <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{book.title}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        book.state === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {book.state}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{book.views}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <Link 
              to="/admin/settings/users" 
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data?.users?.slice(0, 3).map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{user.email}</h4>
                      <p className="text-sm text-gray-500 capitalize">{user.subscription_status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      Last active: {new Date(user.last_active).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Chapters</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data?.chapters?.map((chapter: any) => (
              <div key={chapter.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{chapter.book}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    chapter.state === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {chapter.state}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(chapter.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}