import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  Heart,
  MessageCircle,
  Star,
  MoreVertical,
  Settings,
  BarChart3,
  Tags,
  Folder
} from 'lucide-react';
import { useBlogPosts, useBlogMetadata, BlogPost } from '../../hooks/useBlogData';
import { supabase } from '../../lib/supabase';

type FilterStatus = 'all' | 'published' | 'draft' | 'archived';
type SortBy = 'created_at' | 'published_at' | 'views' | 'likes_count' | 'title';

export default function BlogAdminPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('created_at');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { posts, totalCount, loading, error, refetch } = useBlogPosts({
    limit: 20,
    search: searchQuery || undefined,
    sortBy,
    sortOrder: 'desc'
  });

  const { categories, tags } = useBlogMetadata();

  // Filter posts by status locally since we're getting all statuses
  const filteredPosts = posts.filter(post => {
    if (filterStatus === 'all') return true;
    return post.status === filterStatus;
  });

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPosts(
      selectedPosts.length === filteredPosts.length ? [] : filteredPosts.map(p => p.id)
    );
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .in('id', selectedPosts);

      if (error) throw error;

      setSelectedPosts([]);
      setShowDeleteModal(false);
      await refetch();
    } catch (err) {
      console.error('Error deleting posts:', err);
      alert('Failed to delete posts');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (postId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      // Set published_at when publishing
      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', postId);

      if (error) throw error;
      await refetch();
    } catch (err) {
      console.error('Error updating post status:', err);
      alert('Failed to update post status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-50';
      case 'draft': return 'text-yellow-600 bg-yellow-50';
      case 'archived': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog posts, categories, and content
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/blog/categories"
            className="px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors flex items-center gap-2"
          >
            <Folder className="w-4 h-4" />
            Categories
          </Link>
          <Link
            to="/admin/blog/tags"
            className="px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors flex items-center gap-2"
          >
            <Tags className="w-4 h-4" />
            Tags
          </Link>
          <Link
            to="/admin/blog/analytics"
            className="px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
          <Link
            to="/admin/blog/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Posts</p>
              <p className="text-2xl font-bold text-foreground">{totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Published</p>
              <p className="text-2xl font-bold text-foreground">
                {posts.filter(p => p.status === 'published').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Drafts</p>
              <p className="text-2xl font-bold text-foreground">
                {posts.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Edit className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Views</p>
              <p className="text-2xl font-bold text-foreground">
                {posts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option value="created_at">Created Date</option>
            <option value="published_at">Published Date</option>
            <option value="views">Views</option>
            <option value="likes_count">Likes</option>
            <option value="title">Title</option>
          </select>

          {/* Bulk Actions */}
          {selectedPosts.length > 0 && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedPosts.length})
            </button>
          )}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No posts found</p>
            <Link
              to="/admin/blog/new"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="text-left p-4 font-semibold text-foreground">Title</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground">Author</th>
                  <th className="text-left p-4 font-semibold text-foreground">Category</th>
                  <th className="text-left p-4 font-semibold text-foreground">Stats</th>
                  <th className="text-left p-4 font-semibold text-foreground">Date</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <BlogPostRow
                    key={post.id}
                    post={post}
                    isSelected={selectedPosts.includes(post.id)}
                    onSelect={() => handleSelectPost(post.id)}
                    onToggleStatus={handleToggleStatus}
                    getStatusColor={getStatusColor}
                    formatDate={formatDate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Delete {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''}?
            </h3>
            <p className="text-muted-foreground mb-6">
              This action cannot be undone. The posts and all related data will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Blog Post Row Component
function BlogPostRow({ 
  post, 
  isSelected, 
  onSelect, 
  onToggleStatus, 
  getStatusColor, 
  formatDate 
}: {
  post: BlogPost;
  isSelected: boolean;
  onSelect: () => void;
  onToggleStatus: (postId: string, newStatus: string) => void;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="rounded border-border"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-12 h-12 object-cover rounded-lg"
            />
          )}
          <div>
            <Link
              to={`/admin/blog/edit/${post.id}`}
              className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {post.title}
            </Link>
            {post.is_featured && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-yellow-600">Featured</span>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{post.author || 'Zoroastervers'}</span>
        </div>
      </td>
      <td className="p-4">
        {post.category_name && (
          <span 
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `${post.category_color}20`, 
              color: post.category_color 
            }}
          >
            {post.category_name}
          </span>
        )}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {post.views || 0}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {post.likes_count || 0}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {post.comments_count || 0}
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm">
          <div className="text-foreground">
            {post.status === 'published' && post.published_at 
              ? formatDate(post.published_at)
              : formatDate(post.created_at)
            }
          </div>
          <div className="text-muted-foreground text-xs">
            {post.status === 'published' ? 'Published' : 'Created'}
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg p-2 z-10 min-w-[160px]">
              <Link
                to={`/admin/blog/edit/${post.id}`}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <Link
                to={`/blog/${post.slug}`}
                target="_blank"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
              >
                <Eye className="w-4 h-4" />
                View
              </Link>
              {post.status === 'published' ? (
                <button
                  onClick={() => onToggleStatus(post.id, 'draft')}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                  Unpublish
                </button>
              ) : (
                <button
                  onClick={() => onToggleStatus(post.id, 'published')}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Publish
                </button>
              )}
              <hr className="my-2 border-border" />
              <button
                onClick={() => onToggleStatus(post.id, 'archived')}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Archive
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}