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
  PieChart,
  Palette,
  Globe
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
    if (!trend) return 'text-muted-foreground';
    return trend > 0 ? 'text-green-500' : 'text-red-500';
  };

  const TrendIcon = trend && trend > 0 ? TrendingUp : TrendingDown;

  return (
    <div className="glass-card-strong rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground mb-2">
            {formatValue(value)}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 text-sm ${getTrendColor(trend)}`}>
              <TrendIcon className="w-4 h-4" />
              <span>{Math.abs(trend)}%</span>
              <span className="text-muted-foreground">vs last month</span>
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
    <Link to={href} className="group">
      <div className="block p-4 glass-card rounded-lg hover:shadow-sm transition-all duration-200">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h4 className="text-sm font-medium text-foreground truncate">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Activity className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }
  
  const quickActions = [
    {
      title: "New Content",
      description: "Create new books, chapters",
      icon: Plus,
      href: "/admin/content/works/new",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Media Library",
      description: "Manage files & images",
      icon: Palette,
      href: "/admin/content/files",
      color: "from-green-500 to-green-600"
    },
    {
      title: "User Management",
      description: "View and manage users",
      icon: Users,
      href: "/admin/settings/users",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Analytics",
      description: "View detailed stats",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Blog Posts",
      description: "Create & edit blogs",
      icon: FileText,
      href: "/admin/content/blog",
      color: "from-pink-500 to-pink-600"
    },
    {
      title: "World Building",
      description: "Wiki, timelines, characters",
      icon: Globe,
      href: "/admin/world/wiki",
      color: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="glass-card-strong rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your platform overview for today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last login</p>
              <p className="text-foreground font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
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
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <QuickAction key={action.href} {...action} />
          ))}
        </div>
      </div>

      {/* Media Gallery Section */}
      <div className="glass-card-strong rounded-xl">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Media</h3>
            <p className="text-sm text-muted-foreground">Recently uploaded files and images</p>
          </div>
          <Link 
            to="/admin/content/files" 
            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            View all
          </Link>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="group relative aspect-square bg-muted rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 border border-border">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <Palette className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  image_{i + 1}.jpg
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column layout for content overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Content */}
        <div className="glass-card-strong rounded-xl">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Recent Content</h3>
            <Link to="/admin/content/works" className="text-sm text-primary hover:text-primary/80 font-medium">
              View all
            </Link>
          </div>
          <div className="p-6 space-y-3">
            {data?.books?.slice(0, 4).map((book: any) => (
              <div key={book.id} className="flex items-center justify-between p-3 bg-muted/20 hover:bg-muted/30 rounded-lg transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{book.title}</h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      book.state === 'published' 
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                        : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {book.state}
                    </span>
                    <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                      <Eye className="w-3 h-3" />
                      <span>{book.views}</span>
                    </div>
                  </div>
                </div>
                <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="glass-card-strong rounded-xl">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Page Views (Today)</span>
              <span className="font-semibold text-foreground">2,847</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Sessions</span>
              <span className="font-semibold text-foreground">124</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Content Engagement</span>
              <span className="font-semibold text-green-600 dark:text-green-400">+18.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">New Subscriptions</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">7 this week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}