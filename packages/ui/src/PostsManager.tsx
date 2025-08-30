import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import toast from 'react-hot-toast'; // Import toast
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Search,
  Save,
  X
} from 'lucide-react';
import ReactQuill from 'react-quill-new';


// Define the type for our posts
type Post = {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  author_id: string;
  views: number;
};

// --- Supabase Data Functions ---
const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.from('posts').select('*');
  if (error) throw new Error(error.message);
  return data as Post[];
};

const createPost = async (newPost: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'author_id' | 'views'>): Promise<Post> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('User not authenticated.');

  console.log('Attempting to create post with data:', { ...newPost, author_id: user.id });

  const { data, error } = await supabase.from('posts').insert({ ...newPost, author_id: user.id }).select(); // Add .select() here
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error('Failed to create post: No data returned.');
  return data[0] as Post;
};

const updatePost = async (updatedPost: Post): Promise<Post> => {
  const { data, error } = await supabase.from('posts').update(updatedPost).eq('id', updatedPost.id).select();
  if (error) throw new Error(error.message);
  return data[0] as Post;
};

const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// --- Post Editor Component ---
export const PostEditor = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    status: post?.status || 'draft',
    slug: post?.slug || ''
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Title cannot be empty.');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Slug cannot be empty.');
      return;
    }

    const dataToSave: Partial<Post> = post ? { ...post, ...formData } : formData;

    onSave(dataToSave as Post);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {post ? 'Edit Post' : 'Create New Post'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="post-url-slug"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            className="h-64 mb-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          {/* Note: Posts must be set to 'published' to be visible on the public blog. */}
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Post
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Posts Management Component ---
export const PostsManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: posts, isLoading, isError, error } = useQuery<Post[]>({ queryKey: ['posts'], queryFn: fetchPosts });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsEditing(false);
      setEditingPost(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsEditing(false);
      setEditingPost(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleSavePost = (postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'author_id' | 'views'> & { id?: string }) => {
    if (editingPost) {
      // If editing an existing post, ensure ID is present
      updateMutation.mutate(postData as Post);
    } else {
      // If creating a new post, omit the ID as Supabase will generate it
      const { ...newPostData } = postData;
      createMutation.mutate(newPostData);
    }
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Error loading posts: {error?.message}</div>;

  return (
    <div className="space-y-6">
      {isEditing ? (
        <PostEditor
          post={editingPost}
          onSave={handleSavePost}
          onCancel={() => {
            setIsEditing(false);
            setEditingPost(null);
          }}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
            <button
              onClick={() => {
                setEditingPost(null);
                setIsEditing(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Title</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Author</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Views</th>
                  <th className="text-right py-3 px-6 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{post.title}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : post.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{post.author_id}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{post.views}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setIsEditing(true);
                          }}
                          className="p-1 text-gray-500 hover:text-blue-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-green-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1 text-gray-500 hover:text-red-600"
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
        </>
      )}
    </div>
  );
};


