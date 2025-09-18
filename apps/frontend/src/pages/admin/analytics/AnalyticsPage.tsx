import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  BookOpen,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { KpiCard } from '../../../admin/components/KpiCard';
import { ChartsSection } from '../../../admin/components/ChartsSection';

// Mock data for analytics
const mockAnalyticsData = {
  overview: {
    totalViews: 15420,
    uniqueVisitors: 8950,
    avgSessionDuration: 285,
    bounceRate: 34.5,
    monthlyGrowth: {
      views: 12.5,
      visitors: 8.3,
      duration: -2.1,
      bounce: -5.2
    }
  },
  chartData: {
    dailyViews: [
      { date: '2025-09-01', views: 450, visitors: 280 },
      { date: '2025-09-02', views: 520, visitors: 310 },
      { date: '2025-09-03', views: 380, visitors: 250 },
      { date: '2025-09-04', views: 680, visitors: 420 },
      { date: '2025-09-05', views: 590, visitors: 360 },
      { date: '2025-09-06', views: 720, visitors: 450 },
      { date: '2025-09-07', views: 640, visitors: 400 }
    ],
    topPages: [
      { path: '/wiki/characters/ahura-mazda', views: 2480, bounce: 25.3 },
      { path: '/blog/writing-guide-persian-mythology', views: 1950, bounce: 18.7 },
      { path: '/timelines/ancient-persia', views: 1680, bounce: 32.1 },
      { path: '/wiki/concepts/zoroastrianism', views: 1420, bounce: 28.9 },
      { path: '/learn/authors-journey', views: 1200, bounce: 22.5 }
    ],
    userBehavior: {
      newUsers: 68.5,
      returningUsers: 31.5,
      mobileUsers: 42.3,
      desktopUsers: 57.7
    }
  }
};

interface TimeRangeOption {
  label: string;
  value: string;
  days: number;
}

const timeRanges: TimeRangeOption[] = [
  { label: 'Last 7 days', value: '7d', days: 7 },
  { label: 'Last 30 days', value: '30d', days: 30 },
  { label: 'Last 90 days', value: '90d', days: 90 },
  { label: 'Last year', value: '1y', days: 365 }
];

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  format?: 'number' | 'percentage' | 'duration';
  icon: React.ElementType;
}

function MetricCard({ title, value, change, format = 'number', icon: Icon }: MetricCardProps) {
  const formatValue = (val: string | number, fmt: string) => {
    if (typeof val === 'string') return val;
    
    switch (fmt) {
      case 'percentage':
        return `${val}%`;
      case 'duration':
        return `${Math.floor(val / 60)}m ${val % 60}s`;
      default:
        return val.toLocaleString();
    }
  };

  const isPositive = change > 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const ChangeTrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Icon className="w-4 h-4 text-gray-600" />
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formatValue(value, format)}
          </p>
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${bgColor} ${changeColor}`}>
            <ChangeTrendIcon className="w-3 h-3" />
            <span className="font-medium">{Math.abs(change)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopPagesCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
        <p className="text-sm text-gray-600">Most visited pages this month</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {mockAnalyticsData.chartData.topPages.map((page, index) => (
            <div key={page.path} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded text-white text-xs font-medium flex items-center justify-center">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm truncate max-w-xs">{page.path}</p>
                  <p className="text-xs text-gray-500">{page.views.toLocaleString()} views</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{page.bounce}%</p>
                <p className="text-xs text-gray-500">Bounce rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserBehaviorCard() {
  const { userBehavior } = mockAnalyticsData.chartData;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">User Behavior</h3>
        <p className="text-sm text-gray-600">User engagement metrics</p>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">New vs Returning Users</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New Users</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{userBehavior.newUsers}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${userBehavior.newUsers}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Returning Users</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{userBehavior.returningUsers}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${userBehavior.returningUsers}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Device Usage</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Desktop</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{userBehavior.desktopUsers}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${userBehavior.desktopUsers}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Mobile</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{userBehavior.mobileUsers}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${userBehavior.mobileUsers}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const { overview } = mockAnalyticsData;

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track your platform's performance and user engagement
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Views"
          value={overview.totalViews}
          change={overview.monthlyGrowth.views}
          icon={Eye}
        />
        <MetricCard
          title="Unique Visitors"
          value={overview.uniqueVisitors}
          change={overview.monthlyGrowth.visitors}
          icon={Users}
        />
        <MetricCard
          title="Avg. Session Duration"
          value={overview.avgSessionDuration}
          change={overview.monthlyGrowth.duration}
          format="duration"
          icon={Activity}
        />
        <MetricCard
          title="Bounce Rate"
          value={overview.bounceRate}
          change={overview.monthlyGrowth.bounce}
          format="percentage"
          icon={TrendingUp}
        />
      </div>

      {/* Creative Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Wiki Entries"
          value={127}
          icon={BookOpen}
          color="from-blue-500 to-blue-600"
        />
        <KpiCard
          title="Characters"
          value={45}
          icon={Users}
          color="from-purple-500 to-purple-600"
        />
        <KpiCard
          title="Timeline Events"
          value={238}
          icon={Calendar}
          color="from-green-500 to-green-600"
        />
        <KpiCard
          title="Artist Projects"
          value={7}
          subtitle="3 active"
          icon={Activity}
          color="from-red-500 to-red-600"
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="lg:col-span-2">
          <TopPagesCard />
        </div>
        
        {/* User Behavior */}
        <div>
          <UserBehaviorCard />
        </div>
      </div>

      {/* Existing Charts Section */}
      <ChartsSection />
    </div>
  );
}