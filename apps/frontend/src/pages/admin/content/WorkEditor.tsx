import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '@zoroaster/shared';
import { Book, ArrowLeft, Save, AlertCircle, Loader2, Tag, Calendar, Eye } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageInput from '../../../components/ImageInput';
import { FileRecord } from '../../../utils/fileUpload';

interface WorkFormData {
  title: string;
  slug: string;
  description: string;
  content: any; // JSONB rich content
  plain_content: string; // Plain text for search
  type: 'issue' | 'series' | 'standalone';
  status: 'draft' | 'published' | 'archived';
  cover_url?: string;
  cover_file_id?: string | null; // NEW: Cover file relationship
  tags: string[];
  metadata: any;
  published_at?: string;
  scheduled_for?: string;
}

const WorkEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  
  // NEW: Cover image state
  const [coverFile, setCoverFile] = useState<FileRecord | null>(null);
  
  const [formData, setFormData] = useState<WorkFormData>({
    title: '',
    slug: '',
    description: '',
    content: { type: 'doc', content: [] },
    plain_content: '',
    type: 'issue',
    status: 'draft',
    cover_file_id: null, // NEW: Cover file ID
    tags: [],
    metadata: {}
  });

  // Load existing work if editing
  useEffect(() => {
    const loadWork = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setError(null);
        setLoading(true);

        console.log('Loading work with ID:', id);

        // FIXED: Load work with cover file
        const { data: workData, error: workError } = await supabase
          .from('content_items')
          .select('*')
          .eq('id', id)
          .single();

        console.log('Work query result:', { workData, workError });

        if (workError) {
          console.error('Error loading work:', workError);
          setError('Failed to load work. Please try again.');
          return;
        }

        if (workData) {
          console.log('Loaded work data:', workData);
          
          // FIXED: Load cover file if cover_file_id exists
          if (workData.cover_file_id) {
            console.log('Loading cover file with ID:', workData.cover_file_id);
            const { data: coverFileData, error: coverError } = await supabase
              .from('files')
              .select('*')
              .eq('id', workData.cover_file_id)
              .single();
              
            if (!coverError && coverFileData) {
              console.log('Cover file loaded:', coverFileData);
              setCoverFile(coverFileData);
            } else {
              console.warn('Could not load cover file:', coverError);
            }
          }
          
          // Extract content for editor
          let htmlContent = '';
          if (workData.plain_content) {
            htmlContent = workData.plain_content;
          } else if (workData.content && typeof workData.content === 'string') {
            htmlContent = workData.content;
          }
          
          setEditorContent(htmlContent);
          setTagInput(workData.tags?.join(', ') || '');
          
          setFormData({
            title: workData.title || '',
            slug: workData.slug || '',
            description: workData.description || '',
            content: workData.content || { type: 'doc', content: [] },
            plain_content: workData.plain_content || '',
            type: workData.type || 'issue',
            status: workData.status || 'draft',
            cover_url: workData.cover_url,
            cover_file_id: workData.cover_file_id, // NEW: Load cover file ID
            tags: workData.tags || [],
            metadata: workData.metadata || {},
            published_at: workData.published_at,
            scheduled_for: workData.scheduled_for
          });
        }
        
      } catch (err) {
        console.error('Unexpected error loading work:', err);
        setError('An unexpected error occurred while loading work.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user && id) {
      loadWork();
    } else if (!authLoading && !user) {
      navigate('/login');
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [id, user, authLoading, navigate]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // Handle content change
  const handleContentChange = (htmlContent: string) => {
    setEditorContent(htmlContent);
    
    // Convert to plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    const contentJson = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: plainText
            }
          ]
        }
      ]
    };
    
    setFormData(prev => ({
      ...prev,
      content: contentJson,
      plain_content: plainText
    }));
  };

  // NEW: Handle cover image change
  const handleCoverChange = (fileRecord: FileRecord | null, url: string | null) => {
    console.log('Cover image changed:', { fileRecord, url });
    setCoverFile(fileRecord);
    setFormData(prev => ({
      ...prev,
      cover_file_id: fileRecord?.id || null,
      cover_url: url || undefined
    }));
    console.log('Cover file state updated');
  };

  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handlePreview = () => {
    if (formData.slug) {
      window.open(`/read/${formData.slug}`, '_blank');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || saving) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Validation
      if (!formData.title.trim()) {
        setError('Work title is required.');
        return;
      }

      if (!formData.description.trim()) {
        setError('Work description is required.');
        return;
      }

      // FIXED: Prepare work data with cover file
      const workData = {
        title: formData.title.trim(),
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        description: formData.description.trim(),
        content: formData.content,
        plain_content: formData.plain_content,
        type: formData.type,
        status: formData.status,
        cover_url: formData.cover_url, // Keep existing URL field for backward compatibility
        cover_file_id: formData.cover_file_id, // NEW: Cover file relationship
        tags: formData.tags,
        metadata: {
          ...formData.metadata,
          created_by: user.id,
          last_modified_by: user.id,
          last_modified_at: new Date().toISOString()
        },
        published_at: formData.status === 'published' ? new Date().toISOString() : formData.published_at,
        scheduled_for: formData.scheduled_for
      };

      console.log('=== WORK SAVE DEBUG ===');
      console.log('Current cover file state:', coverFile);
      console.log('Form data cover_file_id:', formData.cover_file_id);
      console.log('Submitting work data:', workData);

      let result;
      if (id) {
        // Update existing work
        console.log('Updating existing work with ID:', id);
        result = await supabase
          .from('content_items')
          .update(workData)
          .eq('id', id)
          .select();
      } else {
        // Create new work
        console.log('Creating new work');
        result = await supabase
          .from('content_items')
          .insert([workData])
          .select();
      }

      console.log('Database operation result:', result);

      if (result.error) {
        console.error('Error saving work:', result.error);
        setError(`Failed to save work: ${result.error.message}`);
        return;
      }

      console.log('Work saved successfully:', result.data);
      setSuccess(`Work ${id ? 'updated' : 'created'} successfully! Cover image: ${formData.cover_file_id ? '✓' : '✗'}`);
      
      // Navigate back after success
      setTimeout(() => {
        navigate('/admin/content/works');
      }, 2000);
      
    } catch (err) {
      console.error('Unexpected error saving work:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading work editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/content/works')}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Book className="w-6 h-6 text-blue-600" />
              {id ? 'Edit Work' : 'Create New Work'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {id ? 'Update your work details and content' : 'Create a new issue, series, or standalone work'}
            </p>
          </div>
          
          {/* Header Actions */}
          {id && formData.slug && (
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3">✓</div>
              <div>
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📝 Work Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Work Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., The Chronicles of Tomorrow"
                      required
                    />
                  </div>
                  
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Work Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as WorkFormData['type'] }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="issue">📰 Issue</option>
                      <option value="series">📚 Series</option>
                      <option value="standalone">📝 Standalone</option>
                    </select>
                  </div>
                  
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as WorkFormData['status'] }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="draft">📝 Draft</option>
                      <option value="published">✅ Published</option>
                      <option value="archived">📦 Archived</option>
                    </select>
                  </div>
                  
                  {/* URL Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="auto-generated from title"
                    />
                    
                    {formData.slug && (
                      <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                        <strong>Preview URL:</strong> 
                        <code className="ml-1 text-blue-600 dark:text-blue-400">
                          /read/{formData.slug}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe your work for readers..."
                    required
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">✏️ Work Content</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content & Synopsis
                  </label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
                    <ReactQuill
                      ref={quillRef}
                      value={editorContent}
                      onChange={handleContentChange}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['blockquote', 'link'],
                          ['clean']
                        ],
                      }}
                      formats={['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'blockquote', 'link']}
                      style={{ minHeight: '300px' }}
                      placeholder="Write your work synopsis, introduction, or main content here..."
                      theme="snow"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar Column (1/3 width) */}
            <div className="space-y-6">
              {/* NEW: Cover Image */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🎨 Cover Image
                </h3>
                
                <div className="space-y-4">
                  <ImageInput
                    label="Work Cover"
                    value={coverFile}
                    onChange={handleCoverChange}
                    placeholder="Book/work cover image"
                    allowedTypes={['images']}
                    previewSize="large"
                  />
                  
                  <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                    🎨 <strong>Cover Image:</strong> This will be displayed as the cover for your work in the library and on reading pages. Recommended size: 400x600px or similar portrait aspect ratio.
                  </div>
                  
                  {/* DEBUG: Show current cover file ID */}
                  {formData.cover_file_id && (
                    <div className="text-xs text-green-600 mt-1">
                      ✓ Cover ID: {formData.cover_file_id.substring(0, 8)}...
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                
                <div className="space-y-3">
                  {/* Current Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Add Tag Input */}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Add tags (press Enter or comma)"
                  />
                  <p className="text-xs text-gray-500">
                    Tags help readers discover your content. Press Enter or comma to add.
                  </p>
                </div>
              </div>
              
              {/* Work Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 Work Info</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="font-medium">
                      {formData.type === 'issue' ? '📰 Issue' :
                       formData.type === 'series' ? '📚 Series' :
                       '📝 Standalone'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`font-medium ${
                      formData.status === 'published' ? 'text-green-600' :
                      formData.status === 'draft' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {formData.status === 'published' ? '✅ Published' :
                       formData.status === 'draft' ? '📝 Draft' :
                       '📦 Archived'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
                    <span className="font-medium">{formData.tags.length} tags</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cover Image:</span>
                    <span className={`font-medium ${
                      coverFile ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      {coverFile ? '🎨 Set' : '❌ None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span>
                  {formData.status === 'published' ? '🌟 This work is live and visible to readers' :
                   formData.status === 'draft' ? '📝 This work is saved as a draft' :
                   '📦 This work is archived'}
                </span>
                {/* Debug info */}
                <div className="mt-1 text-xs text-blue-500">
                  Cover: {formData.cover_file_id ? '✓' : '✗'}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/content/works')}
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={saving || !formData.title || !formData.description}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {id ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {id ? 'Update Work' : 'Create Work'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkEditor;