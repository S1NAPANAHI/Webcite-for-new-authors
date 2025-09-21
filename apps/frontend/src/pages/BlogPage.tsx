import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  MessageCircle, 
  Tag, 
  ChevronRight,
  Clock,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@zoroaster/shared';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  cover_url?: string;
  author?: string;
  published_at: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  slug: string;
  tags?: string[];
  reading_time?: number;
  is_featured?: boolean;
  status?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching blog posts from database...');
      
      // Fetch all published posts
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (fetchError) {
        console.error('❌ Supabase error:', fetchError);
        throw new Error(`Database error: ${fetchError.message}`);
      }

      console.log('✅ Fetched posts:', data);
      
      if (!data || data.length === 0) {
        console.warn('⚠️ No published posts found');
        setPosts([]);
        setFeaturedPosts([]);
        return;
      }

      // Process posts to ensure all fields are available
      const processedPosts = data.map(post => ({
        ...post,
        // Handle image fields (either cover_url or featured_image)
        featured_image: post.featured_image || post.cover_url,
        // Ensure numeric fields are numbers
        views: post.views || 0,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        // Handle content parsing if needed
        content: typeof post.content === 'string' 
          ? post.content.startsWith('{') || post.content.startsWith('"')
            ? JSON.parse(post.content)
            : post.content
          : post.content || '',
        // Ensure author is available
        author: post.author || 'Zoroastervers Team'
      }));
      
      setPosts(processedPosts);
      
      // Set featured posts (posts marked as featured, or top 3 if none featured)
      const featured = processedPosts.filter(post => post.is_featured);
      setFeaturedPosts(featured.length > 0 ? featured.slice(0, 3) : processedPosts.slice(0, 3));
      
    } catch (err) {
      console.error('❌ Error fetching blog data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBlogData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadingTime = (content: string | any) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const textContent = typeof content === 'string' ? content : JSON.stringify(content);
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handlePostClick = async (postId: string) => {
    // Increment view count when clicking a post
    try {
      await supabase
        .from('blog_posts')
        .update({ views: supabase.sql`views + 1` })
        .eq('id', postId);
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  // Filter posts based on search
  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt?.toLowerCase().includes(searchLower) ||
      (typeof post.content === 'string' && post.content.toLowerCase().includes(searchLower)) ||
      post.author?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Zoroasterverse Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Dive deep into the rich mythology, characters, and stories that make up the Zoroasterverse. 
              Discover insights, updates, and behind-the-scenes content from our authors.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                />
              </div>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Posts'}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-2xl mx-auto">
              <div className="text-red-600 text-xl mb-4">❌ {error}</div>
              <p className="text-red-600 mb-6">This usually means:</p>
              <ul className="text-left text-red-600 mb-6 space-y-2">
                <li>• Your blog_posts table needs the database fix</li>
                <li>• No posts have been published yet</li>
                <li>• There's a connection issue</li>
              </ul>
              <div className="space-y-3">
                <button 
                  onClick={fetchBlogData}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mr-4"
                >
                  Try Again
                </button>
                <a 
                  href="/admin/content/blog" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Admin Panel
                </a>
              </div>
            </div>
          </div>
        )}

        {/* No Posts State */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {searchQuery ? `No posts found for "${searchQuery}"` : 'No blog posts yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search terms or clear the search to see all posts.' 
                : 'Create and publish your first blog post in the admin panel to get started!'}
              </p>
            <div className="space-x-4">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Clear Search
                </button>
              )}
              <a
                href="/admin/content/blog/new"
                className="inline-flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create First Post
              </a>
            </div>
          </div>
        )}

        {/* Featured Posts Section */}
        {!loading && !error && featuredPosts.length > 0 && !searchQuery && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-2">
              ⭐ Featured Stories
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.id} post={post} onPostClick={handlePostClick} />
              ))}
            </div>
          </section>
        )}

        {/* All Posts Section */}
        {!loading && !error && filteredPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                {searchQuery ? `Search Results (${filteredPosts.length})` : 'Latest Articles'}
              </h2>
              <p className="text-muted-foreground">
                {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} onPostClick={handlePostClick} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Featured Post Card Component
function FeaturedPostCard({ post, onPostClick }: { post: BlogPost; onPostClick: (id: string) => void }) {
  const getImageUrl = (post: BlogPost) => {
    return post.featured_image || post.cover_url || '/api/placeholder/600/400';
  };

  return (
    <Link 
      to={`/blog/${post.slug}`} 
      className="group" 
      onClick={() => onPostClick(post.id)}
    >
      <article className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="aspect-video bg-muted overflow-hidden">
          <img
            src={getImageUrl(post)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/600/400';
            }}
          />
        </div>
        <div className="p-6">
          {post.is_featured && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full mb-3">
              ⭐ Featured
            </div>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.reading_time || estimateReadingTime(post.content)} min read
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt || (typeof post.content === 'string' ? post.content.substring(0, 150) + '...' : 'No preview available')}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views || 0}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post.likes_count || 0}
              </div>
            </div>
            <span className="text-primary font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
              Read More 
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Regular Blog Post Card Component
function BlogPostCard({ post, onPostClick }: { post: BlogPost; onPostClick: (id: string) => void }) {
  const getImageUrl = (post: BlogPost) => {
    return post.featured_image || post.cover_url || '/api/placeholder/400/250';
  };

  return (
    <Link 
      to={`/blog/${post.slug}`} 
      className="group"
      onClick={() => onPostClick(post.id)}
    >
      <article className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="aspect-video bg-muted overflow-hidden">
          <img
            src={getImageUrl(post)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/400/250';
            }}
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at)}
            </div>
          </div>

          <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt || (typeof post.content === 'string' ? post.content.substring(0, 120) + '...' : 'No preview available')}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views || 0}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post.likes_count || 0}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.reading_time || estimateReadingTime(post.content)}m
              </div>
            </div>
            <span className="text-primary font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
              Read
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'No date';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const estimateReadingTime = (content: string | any) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const textContent = typeof content === 'string' ? content : JSON.stringify(content);
  const wordCount = textContent.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};