import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, useAuth } from '@zoroaster/shared';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../../styles/chapter-content.css'; // Import the paragraph spacing CSS
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
  List,
  Trash2,
  FileText,
  Crop,
  Edit3
} from 'lucide-react';
// Import the enhanced MediaPicker component
import MediaPicker from '../../../components/admin/MediaPicker';

// FIXED: HTML sanitization function with valid CSS selectors
const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  try {
    // Create a temporary div to work with the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // FIXED: Remove empty paragraphs with simpler, valid selectors
    const emptyPs = tempDiv.querySelectorAll('p');
    emptyPs.forEach(p => {
      // Check if paragraph is empty or only contains whitespace
      if (!p.textContent?.trim() && !p.querySelector('img, br, hr')) {
        p.remove();
      }
    });
    
    // Convert any div elements to paragraphs for consistency
    const divs = tempDiv.querySelectorAll('div');
    divs.forEach(div => {
      if (!div.querySelector('p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol')) {
        const p = document.createElement('p');
        p.innerHTML = div.innerHTML;
        div.parentNode?.replaceChild(p, div);
      }
    });
    
    return tempDiv.innerHTML;
  } catch (error) {
    console.warn('Error sanitizing HTML:', error);
    return html; // Return original HTML if sanitization fails
  }
};

// Convert plain text with line breaks to proper HTML paragraphs
const textToParagraphs = (text: string): string => {
  if (!text.trim()) return '<p></p>';
  
  // Split by double line breaks (paragraph breaks)
  const paragraphs = text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .split(/\n\s*\n/) // Split on double line breaks
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  if (paragraphs.length === 0) {
    return '<p></p>';
  }
  
  return paragraphs
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
};

interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
}

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
  const quillRef = useRef<ReactQuill | null>(null);

  // Basic post data
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState(''); // NEW: HTML content for editor
  const [status, setStatus] = useState('draft');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverFileId, setCoverFileId] = useState(''); // NEW: Store selected file ID
  const [coverCropSettings, setCoverCropSettings] = useState<CropSettings | null>(null); // NEW: Store crop settings
  const [author, setAuthor] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // NEW: Preview toggle
  
  // Content stats
  const [wordCount, setWordCount] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  
  // ✅ SIMPLIFIED: Only tags system (category is first tag)
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState<BlogTag[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<string[]>([]);
  const [availablePosts, setAvailablePosts] = useState<any[]>([]);
  
  // Meta
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSEOSettings, setShowSEOSettings] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Enhanced Quill modules with better paragraph handling
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
    clipboard: {
      // Preserve paragraph structure when pasting
      matchVisual: false,
      matchers: [
        // Convert pasted content to proper paragraphs
        [Node.TEXT_NODE, (node: any, delta: any) => {
          const text = node.data || '';
          if (text.includes('\n\n')) {
            // Handle paragraphs separated by double newlines
            const parts = text.split('\n\n');
            const newOps = [];
            for (let i = 0; i < parts.length; i++) {
              if (i > 0) {
                newOps.push({ insert: '\n' }); // Paragraph break
              }
              newOps.push({ insert: parts[i].replace(/\n/g, ' ') });
            }
            return { ops: newOps };
          }
          return delta;
        }]
      ]
    }
  }), []);

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link'
  ];

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
      loadAvailablePosts()
    ]);
  };

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');
      
      if (error && error.code !== 'PGRST116') {
        console.warn('Tags table may not exist yet:', error);
        return;
      }
      setAvailableTags(data || []);
    } catch (error) {
      console.warn('Error loading tags:', error);
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
      console.warn('Error loading posts:', error);
    }
  };

  const fetchPost = async () => {
    if (!id || id === 'new') return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || '');
        
        // Handle content loading with better HTML support
        let loadedHtmlContent = '';
        
        if (data.html_content) {
          // Use stored HTML content if available
          loadedHtmlContent = data.html_content;
        } else if (data.content) {
          // Handle various content formats
          if (typeof data.content === 'string') {
            try {
              // Try to parse as JSON first
              const parsed = JSON.parse(data.content);
              if (typeof parsed === 'string') {
                loadedHtmlContent = textToParagraphs(parsed);
              } else {
                loadedHtmlContent = data.content;
              }
            } catch {
              // If not JSON, treat as HTML or plain text
              if (data.content.includes('<')) {
                loadedHtmlContent = data.content;
              } else {
                loadedHtmlContent = textToParagraphs(data.content);
              }
            }
          }
        }
        
        // Sanitize the content to ensure proper paragraph structure
        loadedHtmlContent = sanitizeHtml(loadedHtmlContent);
        setHtmlContent(loadedHtmlContent);
        setContent(loadedHtmlContent); // Keep for compatibility
        
        setStatus(data.status || 'draft');
        setCoverUrl(data.cover_url || data.featured_image || '');
        
        // NEW: Load cover image metadata if available
        if (data.cover_file_id) {
          setCoverFileId(data.cover_file_id);
        }
        if (data.cover_crop_settings) {
          try {
            const cropSettings = typeof data.cover_crop_settings === 'string' 
              ? JSON.parse(data.cover_crop_settings)
              : data.cover_crop_settings;
            setCoverCropSettings(cropSettings);
          } catch (err) {
            console.warn('Error parsing crop settings:', err);
          }
        }
        
        setAuthor(data.author || '');
        setIsFeatured(data.is_featured || false);
        setMetaTitle(data.meta_title || '');
        setMetaDescription(data.meta_description || '');
        
        // ✅ SIMPLIFIED: Load tags directly
        try {
          let tags = [];
          if (typeof data.tags === 'string' && data.tags.startsWith('[')) {
            tags = JSON.parse(data.tags);
          } else if (Array.isArray(data.tags)) {
            tags = data.tags;
          } else if (typeof data.tags === 'string' && data.tags) {
            tags = [data.tags];
          }
          
          setSelectedTags(tags);
        } catch (error) {
          console.warn('Error parsing post tags:', error);
        }
      }

      // Try to load additional tag relationships if table exists
      try {
        const { data: tagData } = await supabase
          .from('blog_post_tags')
          .select('tag_id')
          .eq('blog_post_id', id);
        
        if (tagData && tagData.length > 0) {
          const additionalTags = tagData.map((bt: any) => bt.tag_id).filter((tid: string) => !selectedTags.includes(tid));
          setSelectedTags(prev => [...prev, ...additionalTags]);
        }
      } catch (tagError) {
        console.warn('Blog post tags table may not exist yet');
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

  // Enhanced content change handler with proper HTML processing
  const handleContentChange = useCallback((htmlContent: string) => {
    // Sanitize and ensure proper paragraph structure
    const sanitizedHtml = sanitizeHtml(htmlContent);
    setHtmlContent(sanitizedHtml);
    setContent(sanitizedHtml); // Keep for compatibility
    
    // Convert HTML to plain text for stats
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedHtml;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Calculate stats
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
    const readTime = Math.max(1, Math.round(words / 200));
    
    setWordCount(words);
    setEstimatedReadTime(readTime);
  }, []);

  // ✅ SIMPLIFIED: Add tag function
  const handleAddTag = () => {
    const tagName = newTagInput.trim();
    if (!tagName) return;
    
    // Don't add duplicate tags
    if (selectedTags.includes(tagName)) {
      setNewTagInput('');
      return;
    }
    
    setSelectedTags(prev => [...prev, tagName]);
    setNewTagInput('');
    
    console.log(`✅ Added tag: ${tagName}`);
  };

  // ✅ SIMPLIFIED: Remove tag function
  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
    console.log(`❌ Removed tag: ${tagToRemove}`);
  };

  // NEW: Handle enhanced media picker selection with crop settings
  const handleCoverImageSelect = (fileId: string, fileUrl: string, cropSettings?: CropSettings) => {
    setCoverFileId(fileId);
    setCoverUrl(fileUrl);
    setCoverCropSettings(cropSettings || null);
    
    console.log('✅ Cover image selected:', {
      fileId,
      fileUrl,
      cropSettings
    });
  };

  // NEW: Handle clearing cover image
  const handleClearCoverImage = () => {
    setCoverFileId('');
    setCoverUrl('');
    setCoverCropSettings(null);
  };

  // 🔥 ENHANCED SAVE: Save function with crop settings and smart image handling
  const saveBlogPost = async (publishNow = false) => {
    setSaving(true);

    try {
      if (!user) throw new Error('Not authenticated');
      if (!title.trim()) throw new Error('Title is required');

      console.log('🔄 Preparing post data with enhanced image handling:', {
        coverFileId,
        coverCropSettings,
        selectedTags
      });

      const postData = {
        title: title.trim(),
        slug: slug || generateSlug(title),
        content: htmlContent, // Store HTML content directly
        html_content: htmlContent, // NEW: Also store in html_content field if supported
        excerpt: excerpt || null,
        cover_url: coverUrl || null,
        featured_image: coverUrl || null,
        cover_file_id: coverFileId || null, // NEW: Store file ID for media picker
        cover_crop_settings: coverCropSettings ? JSON.stringify(coverCropSettings) : null, // NEW: Store crop settings
        author: author || user.email || 'Zoroastervers Team',
        author_id: user.id,
        status: publishNow ? 'published' : status,
        published_at: publishNow ? new Date().toISOString() : (status === 'published' ? new Date().toISOString() : null),
        is_featured: isFeatured,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        tags: selectedTags.length > 0 ? selectedTags : null,
        word_count: wordCount,
        estimated_read_time: estimatedReadTime,
        updated_at: new Date().toISOString()
      };

      console.log('📦 Saving post data with enhanced media handling:', postData);

      let postId = id;
      let response;
      
      if (id && id !== 'new') {
        // Update existing post
        response = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id)
          .select()
          .single();
      } else {
        // Create new post  
        response = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();
        
        if (response.data) {
          postId = response.data.id;
        }
      }

      if (response.error) {
        console.error('❌ Supabase error:', response.error);
        throw response.error;
      }

      console.log('✅ Post saved successfully with enhanced media handling:', response.data);

      // Show success message
      const actionText = publishNow ? 'published' : 'saved';
      const statusText = publishNow ? 'Your post is now live with proper image handling!' : 'Content saved with enhanced media support.';
      
      alert(`✅ Post ${actionText} successfully!\n\n${statusText}`);
      
      // Navigate back to blog manager
      navigate('/admin/content/blog');
      
    } catch (error) {
      console.error('❌ Error saving blog post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`❌ Failed to save blog post:\n\n${errorMessage}\n\nPlease check the console for more details.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <span className="text-gray-600 dark:text-gray-300">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {id && id !== 'new' ? 'Edit Blog Post' : 'New Blog Post'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {id && id !== 'new' ? 'Update your blog post with enhanced media handling' : 'Create a new blog post with visual cropping support'}
          </p>
          
          {/* Live Stats */}
          {wordCount > 0 && (
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>📝 {wordCount.toLocaleString()} words</span>
              <span>•</span>
              <span>🕰 ~{estimatedReadTime} min read</span>
              <span>•</span>
              <span>📄 {(htmlContent.match(/<p>/g) || []).length} paragraphs</span>
              {isFeatured && <span>• ⭐ Featured</span>}
              {coverCropSettings && <span>• ✂️ Cropped Cover</span>}
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showPreview 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={() => saveBlogPost(false)}
            disabled={saving || !title.trim()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => saveBlogPost(true)}
            disabled={saving || !title.trim()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {saving ? 'Publishing...' : (id && id !== 'new' ? 'Update & Publish' : 'Publish')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter blog post title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="url-friendly-slug"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Author name (defaults to ${user?.email || 'your email'})`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the blog post..."
                />
              </div>

              {/* NEW: Enhanced Featured Image Section with MediaPicker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Featured Image
                  <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                    ✂️ Smart Cropping - No Duplicates
                  </span>
                </label>
                
                {/* Enhanced MediaPicker with Cropping */}
                <MediaPicker
                  selectedFileId={coverFileId}
                  selectedCropSettings={coverCropSettings}
                  onSelect={handleCoverImageSelect}
                  onClear={handleClearCoverImage}
                  preferredFolder="blog-images"
                  enableCropping={true}
                  cropAspectRatio={16/9}
                  accept="image/*"
                  className="w-full"
                />
                
                {/* URL Input as fallback */}
                <div className="mt-2">
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Or paste image URL here"
                  />
                </div>
                
                {/* Image Metadata Display */}
                {(coverFileId || coverCropSettings) && (
                  <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">🎯 Smart Image Handling Active</h4>
                    <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                      {coverFileId && <div>• File ID: {coverFileId}</div>}
                      {coverCropSettings && (
                        <div>• Crop: {Math.round(coverCropSettings.width)}×{Math.round(coverCropSettings.height)}px @ ({Math.round(coverCropSettings.x)}, {Math.round(coverCropSettings.y)})</div>
                      )}
                      <div>• Original image preserved in media bucket</div>
                      <div>• Visual cropping applied for display only</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Blog Content Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">✏️ Blog Content</h3>
            
            {/* Content Tips */}
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">📝 Formatting Tips for Perfect Paragraph Spacing</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Press <kbd className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">Enter</kbd> once to create a line break within a paragraph</li>
                <li>• Press <kbd className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">Enter</kbd> twice to create a new paragraph with proper spacing</li>
                <li>• Use the toolbar to add headings, bold text, italics, lists, and quotes</li>
                <li>• Toggle preview to see exactly how readers will see your content</li>
                <li>• Empty paragraphs are automatically removed to prevent spacing issues</li>
              </ul>
            </div>
            
            <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blog Content *
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
                  <ReactQuill
                    ref={quillRef}
                    value={htmlContent}
                    onChange={handleContentChange}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{ minHeight: '400px' }}
                    placeholder="Write your blog post content here...\n\nPress Enter twice to create paragraphs with proper spacing.\nUse the toolbar above for formatting."
                    theme="snow"
                  />
                </div>
              </div>

              {/* Live Preview */}
              {showPreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📖 Reader Preview (Exactly how it will appear)
                  </label>
                  <div className="border border-green-300 dark:border-green-600 rounded-lg p-4 bg-green-50 dark:bg-green-900/10 min-h-[400px] overflow-y-auto">
                    <div 
                      className="chapter-content-preview prose prose-green max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: htmlContent || '<p class="text-gray-400 italic">Start typing to see your blog post preview with proper paragraph spacing...</p>'
                      }}
                    />
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    ✅ This preview shows proper paragraph spacing that readers will see
                  </p>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Content is automatically saved with proper paragraph spacing and formatting. 
              Word count: <strong>{wordCount}</strong> • Reading time: <strong>~{estimatedReadTime} min</strong> • Paragraphs: <strong>{(htmlContent.match(/<p>/g) || []).length}</strong>
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Content Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">📊 Content Statistics</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Word Count:</span>
                <span className="font-medium">{wordCount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Est. Read Time:</span>
                <span className="font-medium">{estimatedReadTime} min</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Paragraphs:</span>
                <span className="font-medium text-green-600">{(htmlContent.match(/<p>/g) || []).length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Format:</span>
                <span className="font-medium text-green-600">✅ Proper Spacing</span>
              </div>
              
              {coverCropSettings && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cover Image:</span>
                  <span className="font-medium text-green-600">✂️ Smart Cropped</span>
                </div>
              )}
            </div>
          </div>

          {/* Publish Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Publish Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">📝 Draft</option>
                  <option value="published">✅ Published</option>
                  <option value="archived">📦 Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Featured Post
                </label>
              </div>
            </div>
          </div>

          {/* ✅ SIMPLIFIED: Tags Only */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags & Categories
            </h3>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              💡 <strong>First tag is the category.</strong> Add tags to organize your content effectively.
            </p>
            
            {/* Add New Tag */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add a tag..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTag}
                disabled={!newTagInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Selected Tags with better spacing */}
            {selectedTags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        index === 0 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-700' 
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      }`}
                    >
                      {index === 0 && '📁'} {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-red-500 hover:text-red-700 ml-1 transition-colors"
                        title="Remove tag"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    📁 <strong>"{selectedTags[0]}"</strong> is your main category.
                    {selectedTags.length > 1 && ` You have ${selectedTags.length - 1} additional tags.`}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Related Articles */}
          {availablePosts.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
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
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{post.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* SEO Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
            <button
              onClick={() => setShowSEOSettings(!showSEOSettings)}
              className="w-full flex items-center justify-between text-lg font-medium text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                SEO Settings
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {showSEOSettings ? 'Hide' : 'Show'}
              </span>
            </button>
            
            {showSEOSettings && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Custom SEO title"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {metaTitle.length}/60 characters
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Custom meta description for search engines"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {metaDescription.length}/160 characters
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostEditor;