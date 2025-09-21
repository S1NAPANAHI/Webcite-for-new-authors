import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Star, 
  User, 
  Calendar, 
  BarChart3, 
  RefreshCw,
  ExternalLink,
  Globe,
  FileText
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
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching blog posts for admin...');
      
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('❌ Error fetching posts:', fetchError);
        throw fetchError;
      }
      
      console.log(`✅ Fetched ${data?.length || 0} posts`);
      
      // Process posts to ensure compatibility
      const processedPosts = (data || []).map(post => ({
        ...post,
        // Ensure counts are numbers
        views: post.views || 0,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        // Ensure author is available
        author: post.author || 'Zoroastervers Team',
        // Handle image fields
        featured_image: post.featured_image || post.cover_url
      }));
      
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
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
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
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            ❌ <strong>Error Loading Posts</strong>
          </div>
          <p className="text-red-700 text-sm mb-3">{error}</p>
          <div className="text-red-600 text-sm">
            <p className="mb-2"><strong>This usually means:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The blog_posts table needs the database schema fix</li>
              <li>Missing required columns in the database</li>
              <li>Connection or permission issues</li>
            </ul>
          </div>
          <button 
            onClick={fetchPosts}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Cards */}
      {!error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-semibold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Edit className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {posts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-lg">
        <nav className="-mb-px flex space-x-8 px-6">
          {[
            { key: 'all', label: 'All Posts', count: posts.length },
            { key: 'published', label: 'Published', count: posts.filter(p => p.status === 'published').length },
            { key: 'draft', label: 'Drafts', count: posts.filter(p => p.status === 'draft').length },
            { key: 'archived', label: 'Archived', count: posts.filter(p => p.status === 'archived').length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                filter === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </nav>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {error ? 'Error Loading Posts' : filter === 'all' ? 'No blog posts yet' : `No ${filter} posts`}
            </h3>
            <p className="text-gray-600 mb-6">
              {error 
                ? 'There was an issue connecting to your database. Make sure you ran the database fix first.'
                : filter === 'all' 
                ? 'Create your first blog post to get started.' 
                : `No posts with ${filter} status found.`
              }
            </p>
            <div className="space-x-3">
              {error && (
                <button
                  onClick={fetchPosts}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 mr-3"
                >
                  Try Again
                </button>
              )}
              <Link
                to="/admin/content/blog/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {filter === 'all' ? 'Create First Post' : 'Create New Post'}
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {/* Thumbnail */}
                        {(post.featured_image || post.cover_url) && (
                          <div className="flex-shrink-0 mr-4">
                            <img
                              src={post.featured_image || post.cover_url}
                              alt={post.title}
                              className="w-16 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {post.title}
                            </div>
                            {post.is_featured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" title="Featured post" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">/blog/{post.slug}</div>
                          {post.excerpt && (
                            <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {post.excerpt.substring(0, 100)}{post.excerpt.length > 100 ? '...' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{post.author}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(post.status)}`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                        {post.status !== 'published' && (
                          <div>
                            <button
                              onClick={() => togglePostStatus(post.id, post.status, post.title)}
                              className="text-xs text-green-600 hover:text-green-800 font-medium"
                            >
                              → Publish Now
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1" title="Views">
                          <Eye className="w-3 h-3" />
                          <span>{post.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Likes">
                          <Heart className="w-3 h-3" />
                          <span>{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Comments">
                          <MessageCircle className="w-3 h-3" />
                          <span>{post.comments_count || 0}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <div>
                          <div className="font-medium">
                            {post.published_at && post.status === 'published'
                              ? formatDate(post.published_at)
                              : formatDate(post.created_at)
                            }
                          </div>
                          <div className="text-xs text-gray-400">
                            {post.published_at && post.status === 'published' ? 'Published' : 'Created'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {/* Edit */}
                        <Link
                          to={`/admin/content/blog/${post.id}/edit`}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                          title="Edit post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        
                        {/* View (only for published posts) */}
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
                        
                        {/* Toggle Featured */}
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
                        
                        {/* Toggle Status */}
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
                        
                        {/* Delete */}
                        <button
                          onClick={() => deleteBlogPost(post.id, post.title)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                          title="Delete post permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Quick Links */}
      {!error && posts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
                <Plus className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;