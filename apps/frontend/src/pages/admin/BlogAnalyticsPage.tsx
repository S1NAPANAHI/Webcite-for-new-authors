import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  viewsChange: number;
  likesChange: number;
  commentsChange: number;
  sharesChange: number;
  topPosts: Array<{
    id: string;
    title: string;
    slug: string;
    views: number;
    likes: number;
    comments: number;
    published_at: string;
  }>;
  viewsByDate: Array<{
    date: string;
    views: number;
  }>;
  topCategories: Array<{
    name: string;
    posts_count: number;
    total_views: number;
  }>;
  readerEngagement: {
    averageReadingTime: number;
    bounceRate: number;
    returnReaders: number;
  };
}

export default function BlogAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const endDate = new Date();
      const startDate = new Date();
      
      // Calculate date range
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Fetch multiple analytics queries in parallel
      const [
        postsResponse,
        viewsResponse,
        likesResponse,
        commentsResponse,
        sharesResponse,
        categoriesResponse
      ] = await Promise.all([
        // Top posts with stats
        supabase
          .from('blog_posts')
          .select('id, title, slug, views, likes_count, comments_count, published_at')
          .eq('status', 'published')
          .order('views', { ascending: false })
          .limit(10),
        
        // Views data
        supabase
          .from('blog_views')
          .select('viewed_at, blog_post_id')
          .gte('viewed_at', startDate.toISOString())
          .lte('viewed_at', endDate.toISOString()),
        
        // Likes data
        supabase
          .from('blog_likes')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Comments data
        supabase
          .from('blog_comments')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Shares data
        supabase
          .from('blog_shares')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Categories with stats
        supabase
          .from('blog_categories')
          .select(`
            name,
            posts_count,
            blog_posts!inner(views)
          `)
          .order('posts_count', { ascending: false })
      ]);

      // Process the data
      const topPosts = postsResponse.data || [];
      const totalViews = viewsResponse.data?.length || 0;
      const totalLikes = likesResponse.data?.length || 0;
      const totalComments = commentsResponse.data?.length || 0;
      const totalShares = sharesResponse.data?.length || 0;

      // Calculate previous period for comparison
      const prevStartDate = new Date(startDate);
      const prevEndDate = new Date(startDate);
      const periodDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      prevStartDate.setDate(prevStartDate.getDate() - periodDays);

      const [
        prevViewsResponse,
        prevLikesResponse,
        prevCommentsResponse,
        prevSharesResponse
      ] = await Promise.all([
        supabase.from('blog_views').select('viewed_at').gte('viewed_at', prevStartDate.toISOString()).lte('viewed_at', prevEndDate.toISOString()),
        supabase.from('blog_likes').select('created_at').gte('created_at', prevStartDate.toISOString()).lte('created_at', prevEndDate.toISOString()),
        supabase.from('blog_comments').select('created_at').gte('created_at', prevStartDate.toISOString()).lte('created_at', prevEndDate.toISOString()),
        supabase.from('blog_shares').select('created_at').gte('created_at', prevStartDate.toISOString()).lte('created_at', prevEndDate.toISOString())
      ]);

      const prevViews = prevViewsResponse.data?.length || 0;
      const prevLikes = prevLikesResponse.data?.length || 0;
      const prevComments = prevCommentsResponse.data?.length || 0;
      const prevShares = prevSharesResponse.data?.length || 0;

      // Calculate percentage changes
      const viewsChange = prevViews > 0 ? ((totalViews - prevViews) / prevViews) * 100 : 0;
      const likesChange = prevLikes > 0 ? ((totalLikes - prevLikes) / prevLikes) * 100 : 0;
      const commentsChange = prevComments > 0 ? ((totalComments - prevComments) / prevComments) * 100 : 0;
      const sharesChange = prevShares > 0 ? ((totalShares - prevShares) / prevShares) * 100 : 0;

      // Process views by date
      const viewsByDate = processViewsByDate(viewsResponse.data || [], startDate, endDate);

      // Process categories data
      const topCategories = (categoriesResponse.data || []).map((cat: any) => ({
        name: cat.name,
        posts_count: cat.posts_count,
        total_views: cat.blog_posts?.reduce((sum: number, post: any) => sum + (post.views || 0), 0) || 0
      }));

      setAnalyticsData({
        totalViews,
        totalLikes,
        totalComments,
        totalShares,
        viewsChange,
        likesChange,
        commentsChange,
        sharesChange,
        topPosts: topPosts.map(post => ({
          ...post,
          views: post.views || 0,
          likes: post.likes_count || 0,
          comments: post.comments_count || 0
        })),
        viewsByDate,
        topCategories,
        readerEngagement: {
          averageReadingTime: 180, // Mock data - would need more complex calculation
          bounceRate: 35,
          returnReaders: 65
        }
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const processViewsByDate = (views: any[], startDate: Date, endDate: Date) => {
    const dateMap = new Map();
    const currentDate = new Date(startDate);
    
    // Initialize all dates with 0 views
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dateMap.set(dateStr, 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count views per date
    views.forEach(view => {
      const dateStr = new Date(view.viewed_at).toISOString().split('T')[0];
      if (dateMap.has(dateStr)) {
        dateMap.set(dateStr, dateMap.get(dateStr) + 1);
      }
    });

    return Array.from(dateMap.entries()).map(([date, views]) => ({ date, views }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || 'Failed to load analytics'}</p>
          <button 
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/admin/blog"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Blog Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your blog performance and reader engagement
          </p>
        </div>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-foreground"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Views"
          value={analyticsData.totalViews.toLocaleString()}
          change={analyticsData.viewsChange}
          icon={Eye}
          color="blue"
        />
        <MetricCard
          title="Total Likes"
          value={analyticsData.totalLikes.toLocaleString()}
          change={analyticsData.likesChange}
          icon={Heart}
          color="red"
        />
        <MetricCard
          title="Total Comments"
          value={analyticsData.totalComments.toLocaleString()}
          change={analyticsData.commentsChange}
          icon={MessageCircle}
          color="green"
        />
        <MetricCard
          title="Total Shares"
          value={analyticsData.totalShares.toLocaleString()}
          change={analyticsData.sharesChange}
          icon={Share2}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Views Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Views Over Time
          </h3>
          <div className="h-64 flex items-end gap-1">
            {analyticsData.viewsByDate.map((day, index) => {
              const maxViews = Math.max(...analyticsData.viewsByDate.map(d => d.views));
              const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary rounded-t min-h-[4px] transition-all hover:bg-primary/80 cursor-pointer"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={`${formatDate(day.date)}: ${day.views} views`}
                  />
                  <span className="text-xs text-muted-foreground mt-2 transform rotate-45">
                    {formatDate(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Top Categories
          </h3>
          <div className="space-y-4">
            {analyticsData.topCategories.slice(0, 5).map((category, index) => {
              const maxViews = Math.max(...analyticsData.topCategories.map(c => c.total_views));
              const percentage = maxViews > 0 ? (category.total_views / maxViews) * 100 : 0;
              
              return (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {category.total_views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reader Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {Math.round(analyticsData.readerEngagement.averageReadingTime / 60)}m
          </div>
          <div className="text-sm text-muted-foreground">Average Reading Time</div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {analyticsData.readerEngagement.bounceRate}%
          </div>
          <div className="text-sm text-muted-foreground">Bounce Rate</div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {analyticsData.readerEngagement.returnReaders}%
          </div>
          <div className="text-sm text-muted-foreground">Return Readers</div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Top Performing Posts
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-3 font-semibold text-foreground">Title</th>
                <th className="text-left p-3 font-semibold text-foreground">Views</th>
                <th className="text-left p-3 font-semibold text-foreground">Likes</th>
                <th className="text-left p-3 font-semibold text-foreground">Comments</th>
                <th className="text-left p-3 font-semibold text-foreground">Published</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topPosts.map((post, index) => (
                <tr key={post.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted rounded flex items-center justify-center text-sm font-medium text-muted-foreground">
                        {index + 1}
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                        target="_blank"
                      >
                        {post.title}
                      </Link>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-foreground">
                      <Eye className="w-4 h-4 text-blue-600" />
                      {post.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-foreground">
                      <Heart className="w-4 h-4 text-red-600" />
                      {post.likes.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-foreground">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      {post.comments.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground text-sm">
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  const isPositive = change >= 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}