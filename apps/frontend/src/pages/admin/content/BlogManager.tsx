import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Heart,        // ✅ FIXED: Added missing Heart import
  MessageCircle, 
  Share2,
  Star,
  Calendar,
  User,
  Tag,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Globe,
  FileText,
  BarChart3
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  status: string;
  is_featured?: boolean;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  published_at: string | null;
  created_at: string;
  cover_url?: string;
  featured_image?: string;
  tags?: string[];
  category?: string;
}

interface Category {
  name: string;
  count: number;
  slug: string;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Posts');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterAndCategorize();
  }, [posts, searchTerm, statusFilter, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching blog posts for admin...');
      
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ Error fetching posts:', fetchError);
        throw fetchError;
      }
      
      console.log(`✅ Fetched ${data?.length || 0} posts`);
      
      // Process posts to ensure compatibility
      const processedPosts = (data || []).map(post => {
        // Parse tags if they're JSON strings
        let tags = [];
        try {
          if (typeof post.tags === 'string') {
            tags = JSON.parse(post.tags);
          } else if (Array.isArray(post.tags)) {
            tags = post.tags;
          }
        } catch {
          tags = [];
        }

        return {
          ...post,
          // Ensure counts are numbers
          views: post.views || 0,
          likes_count: post.likes_count || 0,
          comments_count: post.comments_count || 0,
          // Ensure author is available
          author: post.author || 'Zoroastervers Team',
          // Handle image fields
          featured_image: post.featured_image || post.cover_url,
          // Process tags
          tags: tags,
          // Determine category from first tag or default
          category: tags.length > 0 ? tags[0] : 'Uncategorized'
        };
      });
      
      setPosts(processedPosts);
    } catch (error) {
      console.error('❌ Error in fetchPosts:', error);
      setError(error instanceof Error ? error.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const filterAndCategorize = () => {
    // Generate categories from all posts
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

    // Sort by count descending
    categoriesArray.sort((a, b) => b.count - a.count);
    setCategories(categoriesArray);

    // Filter posts
    let filtered = posts;

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.author?.toLowerCase().includes(searchLower) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    // Filter by category
    if (selectedCategory !== 'All Posts') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  const deleteBlogPost = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`)) return;

    try {
      console.log(`🗑️ Deleting post: ${title}`);
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state immediately
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      
      console.log('✅ Post deleted successfully');
      alert('✅ Post deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting post:', error);
      alert('❌ Failed to delete post: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const togglePostStatus = async (id: string, currentStatus: string, title: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const updateData: any = { 
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    
    // Set published_at when publishing
    if (newStatus === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    try {
      console.log(`🔄 Changing status of "${title}" from ${currentStatus} to ${newStatus}`);
      
      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Update local state immediately
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === id 
          ? { ...post, status: newStatus, published_at: updateData.published_at || post.published_at }
          : post
      ));
      
      console.log('✅ Status updated successfully');
      alert(`✅ Post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!\n\n${newStatus === 'published' ? 'It will now appear on your blog page.' : 'It has been removed from your blog page.'}`);
    } catch (error) {
      console.error('❌ Error updating post status:', error);
      alert('❌ Failed to update post status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean, title: string) => {
    try {
      console.log(`⭐ Toggling featured status of "${title}"`);
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          is_featured: !currentFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state immediately
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === id 
          ? { ...post, is_featured: !currentFeatured }
          : post
      ));
      
      console.log('✅ Featured status updated');
      alert(`✅ Post ${!currentFeatured ? 'marked as featured' : 'removed from featured'}!`);
    } catch (error) {
      console.error('❌ Error updating featured status:', error);
      alert('❌ Failed to update featured status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <span className="text-gray-600">Loading posts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Blog Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your blog posts and content</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <Link
              to="/admin/content/blog/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Post
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              ❌ <strong>Error Loading Posts</strong>
            </div>
            <p className="text-red-700 text-sm mb-3">{error}</p>
            <button 
              onClick={fetchPosts}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ✅ RESTORED: Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('All Posts')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'All Posts'
                        ? 'bg-amber-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>All Posts</span>
                      <span className="text-sm font-medium">{posts.length}</span>
                    </div>
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-amber-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <span className="text-sm font-medium">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">Published</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {posts.filter(p => p.status === 'published').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-600">Drafts</span>
                    </div>
                    <span className="font-semibold text-yellow-600">
                      {posts.filter(p => p.status === 'draft').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Featured</span>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {posts.filter(p => p.is_featured).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-600">Total Views</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {posts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              {/* Results Info */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredPosts.length} of {posts.length} posts
                {selectedCategory !== 'All Posts' && ` in "${selectedCategory}"`}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-lg shadow-sm border">
              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {error ? 'Error Loading Posts' : searchTerm || statusFilter !== 'all' || selectedCategory !== 'All Posts' ? 'No posts found' : 'No blog posts yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {error 
                      ? 'There was an issue connecting to your database. Make sure you ran the database fix first.'
                      : searchTerm || statusFilter !== 'all' || selectedCategory !== 'All Posts'
                      ? 'Try adjusting your search criteria or filters.'
                      : 'Create your first blog post to get started.'
                    }
                  </p>
                  <div className="space-x-3">
                    {(searchTerm || statusFilter !== 'all' || selectedCategory !== 'All Posts') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                          setSelectedCategory('All Posts');
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 mr-3"
                      >
                        Clear Filters
                      </button>
                    )}
                    <Link
                      to="/admin/content/blog/new"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create New Post
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        {(post.featured_image || post.cover_url) && (
                          <div className="flex-shrink-0">
                            <img
                              src={post.featured_image || post.cover_url}
                              alt={post.title}
                              className="w-16 h-12 object-cover rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {post.title}
                            </h3>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(post.status)}`}>
                                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                              </span>
                              {post.is_featured && (
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                                  ⭐ Featured
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-sm text-gray-500 mb-2">/blog/{post.slug}</div>

                          {post.excerpt && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {post.excerpt.substring(0, 120)}{post.excerpt.length > 120 ? '...' : ''}
                            </p>
                          )}

                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(post.published_at && post.status === 'published' ? post.published_at : post.created_at)}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1" title="Views">
                                <Eye className="w-4 h-4" />
                                <span>{post.views || 0}</span>
                              </span>
                              <span className="flex items-center gap-1" title="Likes">
                                <Heart className="w-4 h-4" />
                                <span>{post.likes_count || 0}</span>
                              </span>
                              <span className="flex items-center gap-1" title="Comments">
                                <MessageCircle className="w-4 h-4" />
                                <span>{post.comments_count || 0}</span>
                              </span>
                            </div>
                          </div>

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {post.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded-full">
                                  +{post.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            to={`/admin/content/blog/${post.id}/edit`}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                            title="Edit post"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          
                          {post.status === 'published' && (
                            <Link
                              to={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                              title="View published post"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          
                          <button
                            onClick={() => toggleFeatured(post.id, post.is_featured || false, post.title)}
                            className={`p-2 rounded transition-colors ${
                              post.is_featured 
                                ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50' 
                                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                            }`}
                            title={post.is_featured ? 'Remove from featured' : 'Mark as featured'}
                          >
                            <Star className={`w-4 h-4 ${post.is_featured ? 'fill-current' : ''}`} />
                          </button>
                          
                          <button
                            onClick={() => togglePostStatus(post.id, post.status, post.title)}
                            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                              post.status === 'published' 
                                ? 'text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200' 
                                : 'text-green-600 bg-green-50 hover:bg-green-100 border border-green-200'
                            }`}
                            title={post.status === 'published' ? 'Unpublish post' : 'Publish post'}
                          >
                            {post.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          
                          <button
                            onClick={() => deleteBlogPost(post.id, post.title)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                            title="Delete post permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Quick Links */}
            {!error && filteredPosts.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Globe className="w-5 h-5" />
                    <span className="font-medium">Quick Links</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href="/blog"
                      target="_blank"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Blog Page
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <span className="text-blue-400">|</span>
                    <Link
                      to="/admin/content/blog/new"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Create New Post
                      <PlusCircle className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManager;