import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '@zoroaster/shared';
import { BookOpen, ArrowLeft, Save, AlertCircle, Loader2, Lock, Crown, Gift } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Issue {
  id: string;
  title: string;
  slug: string;
}

interface ChapterFormData {
  title: string;
  slug: string;
  issue_id: string;
  content: any; // JSONB rich content
  plain_content: string; // Plain text for search
  chapter_number: number;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  // New subscription fields
  is_free: boolean;
  subscription_tier_required: 'free' | 'premium' | 'patron';
  free_chapter_order: number | null;
}

const ChapterEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id, issueId } = useParams<{ id?: string; issueId?: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);
  const [editorContent, setEditorContent] = useState<string>(''); // Direct HTML content
  
  const [formData, setFormData] = useState<ChapterFormData>({
    title: '',
    slug: '',
    issue_id: issueId || '',
    content: { type: 'doc', content: [] },
    plain_content: '',
    chapter_number: 1,
    status: 'draft',
    // New subscription fields with smart defaults
    is_free: true, // Default to free for first chapters
    subscription_tier_required: 'free',
    free_chapter_order: null
  });

  // Load issues for dropdown
  useEffect(() => {
    const loadIssues = async () => {
      try {
        setError(null);
        setLoading(true);
        console.log('Loading issues...');

        // Load from content_items with type 'issue'
        const { data: issuesData, error: issuesError } = await supabase
          .from('content_items')
          .select('id, title, slug')
          .eq('type', 'issue')
          .in('status', ['published', 'draft']) // Allow both published and draft
          .order('title');

        console.log('Issues query result:', { issuesData, issuesError });

        if (issuesError) {
          console.error('Error loading issues:', issuesError);
          setError(`Failed to load issues: ${issuesError.message}`);
          setIssues([]);
        } else if (!issuesData || issuesData.length === 0) {
          console.log('No issues found');
          setError('No issues found. Please create an issue first.');
          setIssues([]);
        } else {
          console.log('Found issues:', issuesData);
          setIssues(issuesData);
          
          // If creating a new chapter and we have issues, set the first one as default
          if (!id && !issueId && issuesData.length > 0) {
            setFormData(prev => ({ ...prev, issue_id: issuesData[0].id }));
          }
        }
        
      } catch (err) {
        console.error('Unexpected error loading issues:', err);
        setError(`An unexpected error occurred while loading issues: ${(err as Error).message}`);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    // Only load if user is authenticated
    if (!authLoading && user) {
      loadIssues();
    } else if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate, id, issueId]);

  // Load existing chapter if editing
  useEffect(() => {
    const loadChapter = async () => {
      if (!id) return; // Skip if creating new chapter
      
      try {
        setError(null);
        setLoading(true);

        const { data: chapterData, error: chapterError } = await supabase
          .from('chapters')
          .select('*')
          .eq('id', id)
          .single();

        if (chapterError) {
          console.error('Error loading chapter:', chapterError);
          setError('Failed to load chapter. Please try again.');
          return;
        }

        if (chapterData) {
          console.log('Loaded chapter data:', chapterData);
          
          // Extract HTML content for editor
          let htmlContent = '';
          try {
            // Try to extract content from various possible formats
            if (chapterData.plain_content) {
              htmlContent = chapterData.plain_content;
            } else if (chapterData.content && typeof chapterData.content === 'string') {
              htmlContent = chapterData.content;
            } else if (chapterData.content && chapterData.content.content) {
              // Try to extract from JSON structure
              const firstParagraph = chapterData.content.content[0];
              if (firstParagraph && firstParagraph.content && firstParagraph.content[0]) {
                htmlContent = firstParagraph.content[0].text || '';
              }
            }
          } catch (e) {
            console.log('Error extracting content:', e);
            htmlContent = '';
          }
          
          setEditorContent(htmlContent);
          
          setFormData({
            title: chapterData.title || '',
            slug: chapterData.slug || '',
            issue_id: chapterData.issue_id || '',
            content: chapterData.content || { type: 'doc', content: [] },
            plain_content: chapterData.plain_content || '',
            chapter_number: chapterData.chapter_number || 1,
            status: chapterData.status || 'draft',
            // Load subscription fields with fallbacks
            is_free: chapterData.is_free ?? (chapterData.chapter_number <= 2), // Default first 2 chapters to free
            subscription_tier_required: chapterData.subscription_tier_required || 'free',
            free_chapter_order: chapterData.free_chapter_order || null
          });
        }
        
      } catch (err) {
        console.error('Unexpected error loading chapter:', err);
        setError('An unexpected error occurred while loading chapter.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user && id) {
      loadChapter();
    }
  }, [id, user, authLoading]);

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

  // Smart defaults for subscription settings based on chapter number
  useEffect(() => {
    const chapterNum = formData.chapter_number;
    
    // Auto-set subscription defaults for new chapters
    if (!id && chapterNum) {
      setFormData(prev => ({
        ...prev,
        is_free: chapterNum <= 2,
        subscription_tier_required: chapterNum <= 2 ? 'free' : 'premium',
        free_chapter_order: chapterNum <= 2 ? chapterNum : null
      }));
    }
  }, [formData.chapter_number, id]);

  // Handle content change from ReactQuill - using useCallback to prevent re-renders
  const handleContentChange = useCallback((htmlContent: string) => {
    console.log('Content changed, length:', htmlContent.length);
    
    // Update editor content state
    setEditorContent(htmlContent);
    
    // Convert HTML to plain text for search
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Create simple content structure
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
    
    // Update form data with debouncing to prevent excessive updates
    setFormData(prev => ({
      ...prev,
      content: contentJson,
      plain_content: plainText
    }));
  }, []);

  // Handle free chapter toggle
  const handleFreeToggle = (isFree: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_free: isFree,
      subscription_tier_required: isFree ? 'free' : 'premium',
      free_chapter_order: isFree ? (prev.chapter_number <= 10 ? prev.chapter_number : null) : null
    }));
  };

  // Calculate word count and estimated read time
  const wordCount = formData.plain_content.split(/\s+/).filter(word => word.length > 0).length;
  const estimatedReadTime = Math.max(1, Math.round(wordCount / 200));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || saving) return;

    try {
      setSaving(true);
      setError(null);

      // Validation
      if (!formData.title.trim()) {
        setError('Chapter title is required.');
        return;
      }

      if (!formData.issue_id) {
        setError('Please select an issue for this chapter.');
        return;
      }

      if (!formData.plain_content.trim()) {
        setError('Chapter content is required.');
        return;
      }

      // Prepare chapter data with subscription fields
      const chapterData = {
        title: formData.title.trim(),
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        issue_id: formData.issue_id,
        content: formData.content, // JSONB rich content
        plain_content: formData.plain_content, // Plain text for search
        chapter_number: formData.chapter_number,
        status: formData.status,
        // Add subscription fields
        is_free: formData.is_free,
        subscription_tier_required: formData.subscription_tier_required,
        free_chapter_order: formData.is_free ? formData.free_chapter_order : null,
        metadata: { created_by: user.id }
      };

      console.log('Submitting chapter data:', chapterData);

      let result;
      if (id) {
        // Update existing chapter
        result = await supabase
          .from('chapters')
          .update(chapterData)
          .eq('id', id);
      } else {
        // Create new chapter
        result = await supabase
          .from('chapters')
          .insert([chapterData]);
      }

      if (result.error) {
        console.error('Error saving chapter:', result.error);
        setError(`Failed to save chapter: ${result.error.message}`);
        return;
      }

      console.log('Chapter saved successfully:', result);
      
      // Success - redirect to chapters list
      navigate('/admin/content/chapters');
      
    } catch (err) {
      console.error('Unexpected error saving chapter:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Show loading while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading issues...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error with retry option
  if (error && issues.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/content/chapters')}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              {id ? 'Edit Chapter' : 'Create New Chapter'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {id ? 'Update your chapter' : 'Add a new chapter to your story'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chapter Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Chapter 1: The Beginning"
                  required
                />
              </div>

              {/* Chapter Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chapter Number *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.chapter_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, chapter_number: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* Issue Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issue * {issues.length > 0 && `(${issues.length} available)`}
                </label>
                <select
                  value={formData.issue_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, issue_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select an issue...</option>
                  {issues.map((issue) => (
                    <option key={issue.id} value={issue.id}>
                      {issue.title}
                    </option>
                  ))}
                </select>
                {issues.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">No issues found. Please create an issue first.</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ChapterFormData['status'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Slug */}
              <div className="md:col-span-2">
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
                <p className="text-xs text-gray-500 mt-1">
                  This will be used in URLs: /read/{'{issue-slug}'}/{formData.slug || 'chapter-slug'}
                </p>
              </div>
            </div>
          </div>

          {/* NEW: Subscription Access Control */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-yellow-600" />
              Subscription Access Control
            </h3>
            
            <div className="space-y-6">
              {/* Free Chapter Toggle */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="is_free"
                  checked={formData.is_free}
                  onChange={(e) => handleFreeToggle(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label htmlFor="is_free" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    This is a FREE chapter
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Free chapters can be read by anyone without a subscription. Usually the first 1-2 chapters of each issue.
                  </p>
                </div>
              </div>

              {/* Subscription Tier Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subscription Tier Required
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: 'free', label: 'Free', icon: Gift, desc: 'Available to all users', color: 'green' },
                    { value: 'premium', label: 'Premium', icon: Crown, desc: 'Requires premium subscription', color: 'yellow' },
                    { value: 'patron', label: 'Patron', icon: Crown, desc: 'Exclusive patron content', color: 'purple' }
                  ] as const).map(({ value, label, icon: Icon, desc, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, subscription_tier_required: value }))}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                        formData.subscription_tier_required === value
                          ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20`
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      disabled={formData.is_free && value !== 'free'}
                    >
                      <div className={`flex items-center gap-2 mb-2 ${
                        formData.subscription_tier_required === value
                          ? `text-${color}-700 dark:text-${color}-300`
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{label}</span>
                      </div>
                      <p className={`text-xs ${
                        formData.subscription_tier_required === value
                          ? `text-${color}-600 dark:text-${color}-400`
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {desc}
                      </p>
                      {formData.is_free && value !== 'free' && (
                        <p className="text-xs text-gray-400 mt-1">
                          (Disabled - free chapters must use 'free' tier)
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free Chapter Order (only shown for free chapters) */}
              {formData.is_free && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Free Chapter Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.free_chapter_order || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      free_chapter_order: e.target.value ? parseInt(e.target.value) : null 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="1, 2, 3... (order of free chapters)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The order of this chapter among free chapters (1st free chapter, 2nd free chapter, etc.)
                  </p>
                </div>
              )}

              {/* Access Preview */}
              <div className={`p-4 rounded-lg border-2 border-dashed ${
                formData.is_free 
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                  : 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {formData.is_free ? (
                    <>
                      <Gift className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200">FREE Chapter</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-200">
                        {formData.subscription_tier_required.toUpperCase()} Chapter
                      </span>
                    </>
                  )}
                </div>
                <p className={`text-sm ${
                  formData.is_free 
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-yellow-700 dark:text-yellow-300'
                }`}>
                  {formData.is_free 
                    ? 'This chapter will be available to all users without a subscription'
                    : `This chapter will require a ${formData.subscription_tier_required} subscription to read`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Chapter Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Chapter Content</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chapter Content *
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
                <ReactQuill
                  ref={quillRef}
                  value={editorContent}
                  onChange={handleContentChange}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['blockquote', 'code-block'],
                      ['link'],
                      ['clean']
                    ],
                  }}
                  formats={[
                    'header',
                    'bold', 'italic', 'underline', 'strike',
                    'list', 'bullet',
                    'blockquote', 'code-block',
                    'link'
                  ]}
                  style={{ minHeight: '300px' }}
                  placeholder="Write your chapter content here..."
                  theme="snow"
                />
              </div>
              
              {/* Word count and read time */}
              {wordCount > 0 && (
                <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{wordCount} words</span>
                  <span>~{estimatedReadTime} min read</span>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Advanced Settings</h3>
            
            {/* Slug */}
            <div className="mb-6">
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
              <p className="text-xs text-gray-500 mt-1">
                This will be used in URLs: /read/{'{issue-slug}'}/{formData.slug || 'chapter-slug'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/content/chapters')}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.title || !formData.issue_id || !formData.plain_content}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {id ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {id ? 'Update Chapter' : 'Create Chapter'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChapterEditor;