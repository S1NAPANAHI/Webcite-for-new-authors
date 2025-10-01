import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Search, 
  Tag, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Eye, 
  Heart,
  MessageCircle,
  RefreshCw,
  Star
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_url?: string;
  featured_image?: string;
  author?: string;
  status?: string;
  published_at: string;
  created_at: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  tags?: string[];
  is_featured?: boolean;
  category?: string;
}

interface Category {
  name: string;
  count: number;
  slug: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch posts from database
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterAndCategorize();
  }, [posts, searchTerm, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching published blog posts...');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Fetched posts:', data);
      
      // Process posts
      const processedPosts = (data || []).map(post => {
        let tags = [];
        try {
          if (typeof post.tags === 'string' && post.tags.startsWith('[')) {
            tags = JSON.parse(post.tags);
          } else if (Array.isArray(post.tags)) {
            tags = post.tags;
          } else if (typeof post.tags === 'string' && post.tags) {
            tags = [post.tags];
          }
        } catch {
          tags = [];
        }

        return {
          ...post,
          views: post.views || 0,
          likes_count: post.likes_count || 0,
          comments_count: post.comments_count || 0,
          author: post.author || 'Zoroastervers Team',
          featured_image: post.featured_image || post.cover_url,
          tags: tags,
          category: tags.length > 0 ? tags[0] : 'Uncategorized',
          content: typeof post.content === 'string' 
            ? post.content.startsWith('{') || post.content.startsWith('"')
              ? JSON.parse(post.content)
              : post.content
            : post.content || ''
        };
      });
      
      setPosts(processedPosts);
    } catch (err) {
      console.error('❌ Error fetching posts:', err);
      setError('Failed to load blog posts. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndCategorize = () => {
    const categoryMap = new Map<string, number>();
    
    posts.forEach(post => {
      const category = post.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const categoriesArray: Category[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    }));

    categoriesArray.sort((a, b) => b.count - a.count);
    setCategories(categoriesArray);

    let filtered = posts;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        (typeof post.content === 'string' && post.content.toLowerCase().includes(searchLower)) ||
        post.author?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory !== 'All Posts') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handlePostClick = async (postId: string) => {
    try {
      // Fetch current views count
      const { data: currentPost, error: fetchError } = await supabase
        .from('blog_posts')
        .select('views')
        .eq('id', postId)
        .single();

      if (fetchError) {
        console.error('Error fetching current view count:', fetchError);
        return; // Exit if we can't fetch current views
      }

      const currentViews = currentPost?.views || 0;
      const newViews = currentViews + 1;

      // Update with the incremented views count
      await supabase
        .from('blog_posts')
        .update({ views: newViews })
        .eq('id', postId);
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string | any) => {
    if (!content) return 1;
    const textContent = typeof content === 'string' ? content : JSON.stringify(content);
    const words = textContent.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8">
              <div className="text-red-600 dark:text-red-400 text-xl mb-4">⚠️ {error}</div>
              <p className="text-red-600 dark:text-red-400 mb-6">This usually means your database needs to be set up or posts need to be published.</p>
              <div className="space-y-3">
                <button 
                  onClick={fetchPosts}
                  className="block w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
                <a 
                  href="/admin/content/blog" 
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center transition-colors"
                >
                  Go to Admin Panel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* ✅ FIXED: Header with proper dark mode */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Zoroastervers Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 transition-colors">
              Dive deep into ancient wisdom, modern insights, and the rich tapestry of Zoroastrian thought
            </p>
            
            {/* ✅ FIXED: Search with dark mode */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 
                         disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ✅ FIXED: Categories Sidebar with dark mode */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 sticky top-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
                <Tag className="w-5 h-5" />
                Categories
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('All Posts')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'All Posts'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      All Posts
                    </span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      selectedCategory === 'All Posts' 
                        ? 'bg-blue-500 text-blue-100' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
                      {posts.length}
                    </span>
                  </div>
                </button>

                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        {category.name}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === category.name 
                          ? 'bg-blue-500 text-blue-100' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ✅ FIXED: Popular Posts with dark mode */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mt-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
                <TrendingUp className="w-5 h-5" />
                Popular Posts
              </h3>
              
              <div className="space-y-4">
                {posts
                  .sort((a, b) => (b.views || 0) - (a.views || 0))
                  .slice(0, 5)
                  .map((post, index) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      onClick={() => handlePostClick(post.id)}
                      className="block group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {calculateReadTime(post.content)}m
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* ✅ FIXED: Blog Stats with dark mode */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mt-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Blog Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Articles</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Categories</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{categories.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Views</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {posts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* ✅ FIXED: Active Filter with dark mode */}
            {(selectedCategory !== 'All Posts' || searchTerm) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">Showing:</span>
                    {selectedCategory !== 'All Posts' && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                        📁 {selectedCategory}
                      </span>
                    )}
                    {searchTerm && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                        🔍 "{searchTerm}"
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('All Posts');
                      setSearchTerm('');
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                  {filteredPosts.length} of {posts.length} posts match your criteria
                </p>
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
                  {searchTerm || selectedCategory !== 'All Posts' ? 'No posts found' : 'No blog posts yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">
                  {searchTerm || selectedCategory !== 'All Posts' 
                    ? 'Try adjusting your search criteria or browse other categories.' 
                    : 'Check back soon for new content!'}
                </p>
                {(searchTerm || selectedCategory !== 'All Posts') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All Posts');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View All Posts
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured Posts */}
                {selectedCategory === 'All Posts' && !searchTerm && (
                  <>
                    {filteredPosts.filter(post => post.is_featured).slice(0, 1).map((post) => (
                      <article 
                        key={`featured-${post.id}`}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all border dark:border-gray-700"
                      >
                        <div className="grid md:grid-cols-2 gap-0">
                          {post.featured_image && (
                            <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.src = '/api/placeholder/600/400';
                                }}
                              />
                            </div>
                          )}
                          
                          <div className="p-8">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Featured
                              </span>
                              {post.category && (
                                <span className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full">
                                  {post.category}
                                </span>
                              )}
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">
                              <Link 
                                to={`/blog/${post.slug}`}
                                onClick={() => handlePostClick(post.id)}
                                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              >
                                {post.title}
                              </Link>
                            </h2>
                            
                            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 transition-colors">
                              {post.excerpt || (typeof post.content === 'string' ? post.content.substring(0, 200) + '...' : '')}
                            </p>
                            
                            {/* ✅ FIXED: Better metadata spacing */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors">
                              <span className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {post.author}
                              </span>
                              <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.published_at)}
                              </span>
                              <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {calculateReadTime(post.content)} min read
                              </span>
                              <span className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                {post.views || 0}
                              </span>
                              <span className="flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                {post.likes_count || 0}
                              </span>
                            </div>
                            
                            <Link
                              to={`/blog/${post.slug}`}
                              onClick={() => handlePostClick(post.id)}
                              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                            >
                              Read Full Article
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </>
                )}

                {/* ✅ FIXED: Regular Posts Grid with better spacing */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPosts
                    .filter(post => selectedCategory === 'All Posts' && !searchTerm ? !post.is_featured : true)
                    .map((post) => (
                      <article 
                        key={post.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border dark:border-gray-700"
                      >
                        {post.featured_image && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                e.currentTarget.src = '/api/placeholder/400/250';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="p-6">
                          {post.category && (
                            <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full mb-3">
                              {post.category}
                            </span>
                          )}
                          
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            <Link 
                              to={`/blog/${post.slug}`}
                              onClick={() => handlePostClick(post.id)}
                            >
                              {post.title}
                            </Link>
                          </h2>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm transition-colors">
                            {post.excerpt || (typeof post.content === 'string' ? post.content.substring(0, 120) + '...' : 'No preview available')}
                          </p>
                          
                          {/* ✅ FIXED: Better metadata spacing with gap-4 */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 transition-colors">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {post.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {calculateReadTime(post.content)} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {post.likes_count || 0}
                            </span>
                          </div>
                          
                          <Link
                            to={`/blog/${post.slug}`}
                            onClick={() => handlePostClick(post.id)}
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors text-sm group-hover:gap-3"
                          >
                            Read More
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </article>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}