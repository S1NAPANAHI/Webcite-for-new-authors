import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, useAuth } from '@zoroaster/shared';
import { AdvancedEditor } from '../../../components/editor/AdvancedEditor';
import { 
  Save, 
  Eye, 
  Upload, 
  X, 
  Plus, 
  Settings, 
  Image as ImageIcon, 
  Tag, 
  User,
  Star,
  Link as LinkIcon,
  Search,
  Grid,
  List
} from 'lucide-react';

interface FileRecord {
  id: string;
  name: string;
  original_name: string;
  url?: string;
  path?: string;
  storage_path?: string;
  bucket?: string;
  type?: string;
  mime_type?: string;
  width?: number;
  height?: number;
  folder?: string;
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

const BlogPostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Basic post data
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [coverUrl, setCoverUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  
  // New features
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<BlogTag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<string[]>([]);
  const [availablePosts, setAvailablePosts] = useState<any[]>([]);
  
  // Media picker
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<FileRecord[]>([]);
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaViewMode, setMediaViewMode] = useState<'grid' | 'list'>('grid');
  
  // Meta
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSEOSettings, setShowSEOSettings] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    loadInitialData();
    if (id && id !== 'new') {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadInitialData = async () => {
    await Promise.all([
      loadTags(),
      loadAvailablePosts(),
      loadMediaFiles()
    ]);
  };

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setAvailableTags(data || []);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadAvailablePosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug')
        .eq('status', 'published')
        .order('title');
      
      if (error) throw error;
      setAvailablePosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadMediaFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .or('mime_type.like.image%,type.eq.images')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMediaFiles(data || []);
    } catch (error) {
      console.error('Error loading media files:', error);
    }
  };

  const fetchPost = async () => {
    if (!id || id === 'new') return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_post_tags(tag_id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || '');
        setContent(data.content ? (typeof data.content === 'string' ? JSON.parse(data.content) : data.content) : '');
        setStatus(data.status);
        setCoverUrl(data.cover_url || data.featured_image || '');
        setAuthor(data.author || '');
        setIsFeatured(data.is_featured || false);
        setMetaTitle(data.meta_title || '');
        setMetaDescription(data.meta_description || '');
        
        // Load tags
        if (data.blog_post_tags) {
          setSelectedTags(data.blog_post_tags.map((bt: any) => bt.tag_id));
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const createNewTag = async () => {
    if (!newTagName.trim()) return;

    try {
      setIsCreatingTag(true);
      const tagSlug = generateSlug(newTagName);
      
      const { data, error } = await supabase
        .from('blog_tags')
        .insert({ name: newTagName, slug: tagSlug })
        .select()
        .single();

      if (error) throw error;

      setAvailableTags(prev => [...prev, data]);
      setSelectedTags(prev => [...prev, data.id]);
      setNewTagName('');
    } catch (error) {
      console.error('Error creating tag:', error);
      alert('Failed to create tag');
    } finally {
      setIsCreatingTag(false);
    }
  };

  const getFileUrl = (file: FileRecord): string => {
    if (file.url) return file.url;
    
    if (file.path || file.storage_path) {
      const path = file.path || file.storage_path;
      const bucket = file.bucket || 'media';
      const { data } = supabase.storage.from(bucket).getPublicUrl(path!);
      return data.publicUrl;
    }
    
    return '';
  };

  const saveBlogPost = async (publishNow = false) => {
    setSaving(true);

    try {
      if (!user) throw new Error('Not authenticated');

      const postData = {
        title,
        slug,
        content: JSON.stringify(content),
        excerpt,
        cover_url: coverUrl || null,
        featured_image: coverUrl || null, // Sync both fields
        author: author || user.email || 'Zoroasterverse Team',
        author_id: user.id,
        status: publishNow ? 'published' : status,
        published_at: publishNow ? new Date().toISOString() : null,
        is_featured: isFeatured,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        updated_at: new Date().toISOString()
      };

      let postId = id;
      let response;
      
      if (id && id !== 'new') {
        response = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id)
          .select()
          .single();
      } else {
        response = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();
        
        if (response.data) {
          postId = response.data.id;
        }
      }

      if (response.error) throw response.error;

      // Handle tags
      if (postId && postId !== 'new') {
        // First, delete existing tag relationships
        await supabase
          .from('blog_post_tags')
          .delete()
          .eq('blog_post_id', postId);

        // Then, insert new tag relationships
        if (selectedTags.length > 0) {
          const tagRelations = selectedTags.map(tagId => ({
            blog_post_id: postId,
            tag_id: tagId
          }));

          const { error: tagError } = await supabase
            .from('blog_post_tags')
            .insert(tagRelations);

          if (tagError) {
            console.warn('Error saving tags:', tagError);
          }
        }
      }

      navigate('/admin/content/blog');
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const filteredMediaFiles = mediaFiles.filter(file => 
    !mediaSearch || 
    file.name.toLowerCase().includes(mediaSearch.toLowerCase()) ||
    file.original_name?.toLowerCase().includes(mediaSearch.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {id && id !== 'new' ? 'Edit Blog Post' : 'New Blog Post'}
        </h1>

        <div className="flex space-x-3">
          <button
            onClick={() => saveBlogPost(false)}
            disabled={saving || !title}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </button>
          <button
            onClick={() => saveBlogPost(true)}
            disabled={saving || !title || !content}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            {id && id !== 'new' ? 'Update & Publish' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter blog post title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="url-friendly-slug"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Author name (defaults to your email)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the blog post..."
                />
              </div>

              {/* Featured Image Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                {coverUrl ? (
                  <div className="relative">
                    <img
                      src={coverUrl}
                      alt="Featured image"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setCoverUrl('')}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowMediaPicker(true)}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span>Choose from Media Library</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <AdvancedEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your blog post..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Publish Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="featured" className="text-sm text-gray-700 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Featured Post
                </label>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </h3>
            
            {/* Create New Tag */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="New tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && createNewTag()}
              />
              <button
                onClick={createNewTag}
                disabled={!newTagName.trim() || isCreatingTag}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {isCreatingTag ? '...' : <Plus className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Tag Selection */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableTags.map(tag => (
                <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTags(prev => [...prev, tag.id]);
                      } else {
                        setSelectedTags(prev => prev.filter(id => id !== tag.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Related Articles
            </h3>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availablePosts
                .filter(post => post.id !== id)
                .map(post => (
                <label key={post.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={relatedArticles.includes(post.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRelatedArticles(prev => [...prev, post.id]);
                      } else {
                        setRelatedArticles(prev => prev.filter(id => id !== post.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{post.title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg border p-6">
            <button
              onClick={() => setShowSEOSettings(!showSEOSettings)}
              className="w-full flex items-center justify-between text-lg font-medium text-gray-900 mb-4"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                SEO Settings
              </div>
            </button>
            
            {showSEOSettings && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Custom SEO title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Custom meta description for search engines"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Choose Image</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMediaViewMode('grid')}
                    className={`p-2 rounded ${mediaViewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setMediaViewMode('list')}
                    className={`p-2 rounded ${mediaViewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowMediaPicker(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {filteredMediaFiles.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No images found</p>
                  <p className="text-sm text-gray-500">Upload some images to your media library first</p>
                </div>
              ) : mediaViewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredMediaFiles.map(file => {
                    const fileUrl = getFileUrl(file);
                    return (
                      <button
                        key={file.id}
                        onClick={() => {
                          setCoverUrl(fileUrl);
                          setShowMediaPicker(false);
                        }}
                        className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                      >
                        <img
                          src={fileUrl}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs truncate">{file.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMediaFiles.map(file => {
                    const fileUrl = getFileUrl(file);
                    return (
                      <button
                        key={file.id}
                        onClick={() => {
                          setCoverUrl(fileUrl);
                          setShowMediaPicker(false);
                        }}
                        className="w-full flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                      >
                        <img
                          src={fileUrl}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.width && file.height && `${file.width}×${file.height} • `}
                            {file.folder || 'misc'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostEditor;