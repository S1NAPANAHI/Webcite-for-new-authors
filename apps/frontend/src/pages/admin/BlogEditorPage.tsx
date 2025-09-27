import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  Eye,
  ArrowLeft,
  Upload,
  X,
  Plus,
  Settings,
  Calendar,
  Globe,
  Users,
  Star,
  Image as ImageIcon,
  Tag,
  Folder,
  Type,
  AlignLeft,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { useBlogMetadata } from '../../hooks/useBlogData';
import { supabase } from '../../lib/supabase';
// Import the advanced image cropping component
import ImageInputWithCropping, { CROP_PRESETS, FileRecord } from '../../components/ImageInputWithCropping';

interface BlogPostData {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  social_image?: string;
  meta_title?: string;
  meta_description?: string;
  category_id?: string;
  author_id?: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  published_at?: string;
  tag_ids: string[];
}

export default function BlogEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== 'new';

  const [formData, setFormData] = useState<BlogPostData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    is_featured: false,
    tag_ids: []
  });

  // Image state management
  const [featuredImageFile, setFeaturedImageFile] = useState<FileRecord | null>(null);
  const [socialImageFile, setSocialImageFile] = useState<FileRecord | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSEOSettings, setShowSEOSettings] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const { categories, tags } = useBlogMetadata();

  useEffect(() => {
    getCurrentUser();
    if (isEditing) {
      loadPost();
    }
  }, [id]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    if (user && !formData.author_id) {
      setFormData(prev => ({ ...prev, author_id: user.id }));
    }
  };

  const loadPost = async () => {
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

      const tagIds = data.blog_post_tags?.map((bt: any) => bt.tag_id) || [];
      setSelectedTags(tagIds);
      
      setFormData({
        ...data,
        tag_ids: tagIds
      });

      // Load existing images if they exist
      if (data.featured_image) {
        // Try to find the file record for existing images
        // This is a fallback for existing blog posts
        setFeaturedImageFile({
          id: 'legacy-featured',
          name: 'Featured Image',
          original_name: 'featured-image.jpg',
          url: data.featured_image,
          type: 'images',
          mime_type: 'image/jpeg'
        } as FileRecord);
      }

      if (data.social_image) {
        setSocialImageFile({
          id: 'legacy-social',
          name: 'Social Image',
          original_name: 'social-image.jpg',
          url: data.social_image,
          type: 'images',
          mime_type: 'image/jpeg'
        } as FileRecord);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      alert('Failed to load post');
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditing || !prev.slug ? generateSlug(title) : prev.slug
    }));
  };

  // Handle image changes from the cropping component
  const handleFeaturedImageChange = (fileRecord: FileRecord | null, url: string | null) => {
    setFeaturedImageFile(fileRecord);
    setFormData(prev => ({ ...prev, featured_image: url || undefined }));
  };

  const handleSocialImageChange = (fileRecord: FileRecord | null, url: string | null) => {
    setSocialImageFile(fileRecord);
    setFormData(prev => ({ ...prev, social_image: url || undefined }));
  };

  // Handle processed images from cropping
  const handleFeaturedImageProcessed = async (croppedBlob: Blob, originalFile: FileRecord) => {
    try {
      setUploading(true);
      
      // Upload cropped image to media bucket in blog-images folder
      const timestamp = Date.now();
      const fileName = `featured-${timestamp}.jpg`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, croppedBlob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Update form data and file record
      setFormData(prev => ({ ...prev, featured_image: publicUrl }));
      setFeaturedImageFile({
        ...originalFile,
        id: `cropped-${timestamp}`,
        name: fileName,
        url: publicUrl,
        storage_path: filePath
      });
    } catch (error) {
      console.error('Error uploading featured image:', error);
      alert('Failed to upload featured image');
    } finally {
      setUploading(false);
    }
  };

  const handleSocialImageProcessed = async (croppedBlob: Blob, originalFile: FileRecord) => {
    try {
      setUploading(true);
      
      // Upload cropped image to media bucket in blog-images folder
      const timestamp = Date.now();
      const fileName = `social-${timestamp}.jpg`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, croppedBlob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Update form data and file record
      setFormData(prev => ({ ...prev, social_image: publicUrl }));
      setSocialImageFile({
        ...originalFile,
        id: `cropped-${timestamp}`,
        name: fileName,
        url: publicUrl,
        storage_path: filePath
      });
    } catch (error) {
      console.error('Error uploading social image:', error);
      alert('Failed to upload social image');
    } finally {
      setUploading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const createNewTag = async () => {
    if (!newTagName.trim()) return;

    try {
      setIsCreatingTag(true);
      const slug = generateSlug(newTagName);
      
      const { data, error } = await supabase
        .from('blog_tags')
        .insert({ name: newTagName, slug })
        .select()
        .single();

      if (error) throw error;

      setSelectedTags(prev => [...prev, data.id]);
      setNewTagName('');
    } catch (error) {
      console.error('Error creating tag:', error);
      alert('Failed to create tag');
    } finally {
      setIsCreatingTag(false);
    }
  };

  const saveBlogPost = async (status?: 'draft' | 'published') => {
    try {
      setLoading(true);

      const saveData = {
        ...formData,
        status: status || formData.status,
        published_at: status === 'published' ? new Date().toISOString() : formData.published_at,
        updated_at: new Date().toISOString()
      };

      // Remove tag_ids from the main data as it's handled separately
      const { tag_ids, ...postData } = saveData;

      let postId = formData.id;

      if (isEditing && postId) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId);

        if (error) throw error;
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        postId = data.id;
        setFormData(prev => ({ ...prev, id: postId }));
      }

      // Handle tags
      if (postId) {
        // Delete existing tag relationships
        await supabase
          .from('blog_post_tags')
          .delete()
          .eq('blog_post_id', postId);

        // Insert new tag relationships
        if (selectedTags.length > 0) {
          const tagRelations = selectedTags.map(tagId => ({
            blog_post_id: postId,
            tag_id: tagId
          }));

          const { error: tagError } = await supabase
            .from('blog_post_tags')
            .insert(tagRelations);

          if (tagError) throw tagError;
        }
      }

      if (status === 'published') {
        navigate('/admin/blog');
      } else {
        // If it's a new post, redirect to edit mode
        if (!isEditing && postId) {
          navigate(`/admin/blog/edit/${postId}`);
        }
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  const insertTextAtCursor = (textareaRef: React.RefObject<HTMLTextAreaElement>, text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;
    
    const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
    
    setFormData(prev => ({ ...prev, content: newValue }));
    
    // Reset cursor position
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const formatButtons = [
    { icon: Bold, text: '**text**', label: 'Bold' },
    { icon: Italic, text: '*text*', label: 'Italic' },
    { icon: Heading1, text: '# ', label: 'Heading 1' },
    { icon: Heading2, text: '## ', label: 'Heading 2' },
    { icon: Heading3, text: '### ', label: 'Heading 3' },
    { icon: LinkIcon, text: '[text](url)', label: 'Link' },
    { icon: List, text: '- ', label: 'Bullet List' },
    { icon: ListOrdered, text: '1. ', label: 'Numbered List' },
    { icon: Quote, text: '> ', label: 'Quote' },
    { icon: Code, text: '`code`', label: 'Inline Code' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/blog"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-semibold text-foreground">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            
            <button
              onClick={() => saveBlogPost('draft')}
              disabled={loading || !formData.title.trim()}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>

            <button
              onClick={() => saveBlogPost('published')}
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Globe className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Editor */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Post title..."
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-3xl font-bold bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
              />
            </div>

            {/* Slug */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">URL:</span>
              <span className="text-muted-foreground">/blog/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="bg-transparent border-b border-muted text-foreground outline-none focus:border-primary"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Excerpt
              </label>
              <textarea
                placeholder="Brief description of your post..."
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full h-20 p-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Featured Image - Enhanced with Advanced Cropping */}
            <ImageInputWithCropping
              label="Featured Image"
              value={featuredImageFile}
              onChange={handleFeaturedImageChange}
              placeholder="Select a featured image for your blog post"
              enableCropping={true}
              cropConfig={CROP_PRESETS.landscape} // 16:9 ratio perfect for blog headers
              cropPresets={['landscape', 'square', 'free']}
              onImageProcessed={handleFeaturedImageProcessed}
              showPreview={true}
              previewSize="large"
              className="w-full"
            />
            
            {uploading && (
              <div className="text-center py-2">
                <div className="inline-flex items-center gap-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Processing image...</span>
                </div>
              </div>
            )}

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Content
              </label>
              
              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 p-2 border border-border rounded-t-lg bg-muted/20">
                {formatButtons.map(({ icon: Icon, text, label }) => (
                  <button
                    key={label}
                    onClick={() => insertTextAtCursor(contentRef, text)}
                    title={label}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              
              <textarea
                ref={contentRef}
                placeholder="Write your post content in Markdown..."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full h-96 p-4 bg-card border border-border border-t-0 rounded-b-lg text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary resize-y"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border bg-card p-6 space-y-6">
          {/* Publish Settings */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Publish Settings</h3>
            
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full p-2 bg-background border border-border rounded-lg text-foreground"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Featured Post */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="rounded border-border"
                />
                <label htmlFor="featured" className="text-sm text-foreground flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Featured Post
                </label>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Category</h3>
            <select
              value={formData.category_id || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value || undefined }))}
              className="w-full p-2 bg-background border border-border rounded-lg text-foreground"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Tags</h3>
            
            {/* Create New Tag */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="New tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1 p-2 text-sm bg-background border border-border rounded-lg text-foreground"
                onKeyPress={(e) => e.key === 'Enter' && createNewTag()}
              />
              <button
                onClick={createNewTag}
                disabled={!newTagName.trim() || isCreatingTag}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
              >
                {isCreatingTag ? '...' : '+'}
              </button>
            </div>
            
            {/* Tag Selection */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {tags.map(tag => (
                <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">{tag.name}</span>
                  <span className="text-xs text-muted-foreground">({tag.posts_count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* SEO Settings */}
          <div>
            <button
              onClick={() => setShowSEOSettings(!showSEOSettings)}
              className="flex items-center gap-2 text-sm font-medium text-foreground mb-2 hover:text-primary transition-colors"
            >
              <Settings className="w-4 h-4" />
              SEO Settings
            </button>
            
            {showSEOSettings && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    className="w-full p-2 text-sm bg-background border border-border rounded-lg text-foreground"
                    placeholder="Custom meta title"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.meta_description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    className="w-full h-20 p-2 text-sm bg-background border border-border rounded-lg text-foreground resize-none"
                    placeholder="Custom meta description"
                  />
                </div>
                
                {/* Social Image - Enhanced with Advanced Cropping */}
                <ImageInputWithCropping
                  label="Social Media Image"
                  value={socialImageFile}
                  onChange={handleSocialImageChange}
                  placeholder="Select an image for social media sharing"
                  enableCropping={true}
                  cropConfig={CROP_PRESETS.square} // 1:1 ratio perfect for social media
                  cropPresets={['square', 'landscape']}
                  onImageProcessed={handleSocialImageProcessed}
                  showPreview={true}
                  previewSize="small"
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <article className="prose prose-lg max-w-none">
                {formData.featured_image && (
                  <img
                    src={formData.featured_image}
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <h1 className="text-3xl font-bold text-foreground mb-4">{formData.title || 'Untitled Post'}</h1>
                {formData.excerpt && (
                  <p className="text-lg text-muted-foreground mb-6">{formData.excerpt}</p>
                )}
                <div className="text-foreground whitespace-pre-wrap">
                  {formData.content || 'No content yet...'}
                </div>
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}