import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '@zoroaster/shared';
import { BookOpen, ArrowLeft, Save, AlertCircle, Loader2, Lock, Crown, Gift, Image as ImageIcon, Layout, Eye } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageInput from '../../../components/ImageInput';
import { FileRecord } from '../../../utils/fileUpload';

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
  // NEW: Visual assets
  hero_file_id?: string | null;
  banner_file_id?: string | null;
  word_count?: number;
  estimated_read_time?: number;
}

interface ChapterWithFiles extends ChapterFormData {
  id: string;
  hero_file?: FileRecord;
  banner_file?: FileRecord;
  created_at: string;
  updated_at: string;
}

const ChapterEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id, issueId } = useParams<{ id?: string; issueId?: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);
  const [editorContent, setEditorContent] = useState<string>(''); // Direct HTML content
  
  // NEW: Hero and Banner file states
  const [heroFile, setHeroFile] = useState<FileRecord | null>(null);
  const [bannerFile, setBannerFile] = useState<FileRecord | null>(null);
  
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
    free_chapter_order: null,
    // NEW: Visual assets
    hero_file_id: null,
    banner_file_id: null
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

        // Load chapter with related files
        const { data: chapterData, error: chapterError } = await supabase
          .from('chapters')
          .select(`
            *,
            hero_file:files!hero_file_id(*),
            banner_file:files!banner_file_id(*)
          `)
          .eq('id', id)
          .single();

        if (chapterError) {
          console.error('Error loading chapter:', chapterError);
          setError('Failed to load chapter. Please try again.');
          return;
        }

        if (chapterData) {
          console.log('Loaded chapter data:', chapterData);
          
          // Set file records
          if (chapterData.hero_file && Array.isArray(chapterData.hero_file) && chapterData.hero_file[0]) {
            setHeroFile(chapterData.hero_file[0]);
          }
          
          if (chapterData.banner_file && Array.isArray(chapterData.banner_file) && chapterData.banner_file[0]) {
            setBannerFile(chapterData.banner_file[0]);
          }
          
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
            free_chapter_order: chapterData.free_chapter_order || null,
            // NEW: Load visual assets
            hero_file_id: chapterData.hero_file_id,
            banner_file_id: chapterData.banner_file_id,
            word_count: chapterData.word_count,
            estimated_read_time: chapterData.estimated_read_time
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
    
    // Calculate stats
    const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
    const readTime = Math.max(1, Math.round(wordCount / 200)); // 200 words per minute
    
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
      plain_content: plainText,
      word_count: wordCount,
      estimated_read_time: readTime
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

  // NEW: Handle hero image change
  const handleHeroChange = (fileRecord: FileRecord | null, url: string | null) => {
    setHeroFile(fileRecord);
    setFormData(prev => ({
      ...prev,
      hero_file_id: fileRecord?.id || null
    }));
  };

  // NEW: Handle banner image change
  const handleBannerChange = (fileRecord: FileRecord | null, url: string | null) => {
    setBannerFile(fileRecord);
    setFormData(prev => ({
      ...prev,
      banner_file_id: fileRecord?.id || null
    }));
  };

  const handlePreview = () => {
    const selectedIssue = issues.find(i => i.id === formData.issue_id);
    if (selectedIssue && formData.slug) {
      const previewUrl = `/read/${selectedIssue.slug}/${formData.slug}`;
      window.open(previewUrl, '_blank');
    }
  };

  // Calculate word count and estimated read time
  const wordCount = formData.word_count || formData.plain_content.split(/\s+/).filter(word => word.length > 0).length;
  const estimatedReadTime = formData.estimated_read_time || Math.max(1, Math.round(wordCount / 200));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || saving) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

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

      // Prepare chapter data with subscription fields and visual assets
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
        // NEW: Add visual assets
        hero_file_id: formData.hero_file_id,
        banner_file_id: formData.banner_file_id,
        word_count: wordCount,
        estimated_read_time: estimatedReadTime,
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
      setSuccess(`Chapter ${id ? 'updated' : 'created'} successfully!`);
      
      // Navigate back to chapters list after success
      setTimeout(() => {
        navigate('/admin/content/chapters');
      }, 1500);
      
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
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">Loading chapter editor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error with retry option
  if (error && issues.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/content/chapters')}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              {id ? 'Edit Chapter' : 'Create New Chapter'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {id ? 'Update your chapter content and settings' : 'Add a new chapter to your story'}
            </p>
            
            {/* Live Stats */}
            {wordCount > 0 && (
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>📝 {wordCount.toLocaleString()} words</span>
                <span>•</span>
                <span>🕰 ~{estimatedReadTime} min read</span>
                {formData.is_free && <span>• 🎁 FREE</span>}
                {!formData.is_free && <span>• 👑 {formData.subscription_tier_required.toUpperCase()}</span>}
              </div>
            )}
          </div>
          
          {/* Header Actions */}
          {id && formData.issue_id && formData.slug && (
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
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
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
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Success
                </h3>
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  📝 Chapter Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chapter Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., The Beginning"
                      required
                    />
                  </div>

                  {/* Chapter Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chapter # *
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
                  <div className="md:col-span-2">
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
                      <option value="draft">📝 Draft</option>
                      <option value="published">✅ Published</option>
                      <option value="scheduled">📅 Scheduled</option>
                      <option value="archived">📦 Archived</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Chapter Content */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">✏️ Chapter Content</h3>
                
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
                      style={{ minHeight: '400px' }}
                      placeholder="Write your chapter content here...\n\nUse the toolbar above to format your text with headings, bold, italic, lists, and more."
                      theme="snow"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Use the formatting toolbar to style your chapter. Word count and reading time are calculated automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Column (1/3 width) */}
            <div className="space-y-6">
              {/* NEW: Visual Assets Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🎨 Visual Assets
                </h3>
                
                <div className="space-y-6">
                  <ImageInput
                    label="Hero Image"
                    value={heroFile}
                    onChange={handleHeroChange}
                    placeholder="Chapter opening artwork"
                    allowedTypes={['images']}
                  />
                  <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                    🎨 <strong>Hero Image:</strong> Displayed at the very beginning of the chapter when reading. Creates an immersive opening experience.
                  </div>

                  <ImageInput
                    label="Banner Image"
                    value={bannerFile}
                    onChange={handleBannerChange}
                    placeholder="Library card background"
                    allowedTypes={['images']}
                  />
                  <div className="text-xs text-purple-600 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
                    🇿 <strong>Banner Image:</strong> Used as the background for chapter cards in the library. Should be landscape orientation (16:9 or similar).
                  </div>
                </div>
              </div>

              {/* Subscription Access Control */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-dashed border-yellow-300 dark:border-yellow-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-yellow-600" />
                  Access Control
                </h3>
                
                <div className="space-y-4">
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
                  {!formData.is_free && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Required Subscription Tier
                      </label>
                      <div className="space-y-2">
                        {([                       
                          { value: 'premium', label: 'Premium', icon: Crown, desc: '👑 $9.99/mo subscribers', color: 'yellow' },
                          { value: 'patron', label: 'Patron', icon: Crown, desc: '💜 $19.99/mo supporters', color: 'purple' }
                        ] as const).map(({ value, label, icon: Icon, desc, color }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, subscription_tier_required: value }))}
                            className={`w-full p-3 border-2 rounded-lg transition-all duration-200 text-left flex items-center gap-3 ${
                              formData.subscription_tier_required === value
                                ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20`
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`} />
                            <div>
                              <div className="font-medium text-sm">{label}</div>
                              <div className="text-xs opacity-70">{desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                        placeholder="1, 2, 3... (order among free chapters)"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The position of this chapter among free chapters (1st free, 2nd free, etc.)
                      </p>
                    </div>
                  )}

                  {/* Access Preview */}
                  <div className={`p-3 rounded-lg border-2 border-dashed ${
                    formData.is_free 
                      ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                      : 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {formData.is_free ? (
                        <>
                          <Gift className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-800 dark:text-green-200">FREE Chapter</span>
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800 dark:text-yellow-200">
                            {formData.subscription_tier_required.toUpperCase()} Chapter
                          </span>
                        </>
                      )}
                    </div>
                    <p className={`text-xs ${
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
              
              {/* URL Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔗 URL Settings</h3>
                
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
                  
                  {formData.slug && issues.find(i => i.id === formData.issue_id) && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                      <strong>Preview URL:</strong> 
                      <code className="ml-1 text-blue-600 dark:text-blue-400">
                        /read/{issues.find(i => i.id === formData.issue_id)?.slug}/{formData.slug}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar Column (1/3 width) */}
            <div className="space-y-6">
              {/* Chapter Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 Statistics</h3>
                
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">Access Level:</span>
                    <span className={`font-medium ${
                      formData.is_free ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {formData.is_free ? '🎁 Free' : `👑 ${formData.subscription_tier_required}`}
                    </span>
                  </div>
                  
                  {heroFile && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Hero Image:</span>
                      <span className="font-medium text-purple-600">🎨 Set</span>
                    </div>
                  )}
                  
                  {bannerFile && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Banner Image:</span>
                      <span className="font-medium text-indigo-600">🇿 Set</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formData.is_free ? (
                  <span className="text-green-600">
                    🎁 This chapter will be <strong>free</strong> for all readers
                  </span>
                ) : (
                  <span className="text-yellow-600">
                    👑 This chapter requires a <strong>{formData.subscription_tier_required}</strong> subscription
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/content/chapters')}
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={saving || !formData.title || !formData.issue_id || !formData.plain_content}
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
                      {id ? 'Update Chapter' : 'Create Chapter'}
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

export default ChapterEditor;