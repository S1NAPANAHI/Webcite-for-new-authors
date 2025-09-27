import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '@zoroaster/shared';
import { BookOpen, ArrowLeft, Save, AlertCircle, Loader2, Lock, Crown, Gift, Eye, FileText } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageInput from '../../../components/ImageInput';
import { FileRecord } from '../../../utils/fileUpload';

// HTML sanitization function to preserve paragraph structure
const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary div to work with the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
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
  html_content: string; // NEW: HTML content for proper rendering
  chapter_number: number;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  // New subscription fields
  is_free: boolean;
  subscription_tier_required: 'free' | 'premium' | 'patron';
  free_chapter_order: number | null;
  // Visual assets
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
  const [showPreview, setShowPreview] = useState(false); // Toggle for content preview
  
  // Hero and Banner file states
  const [heroFile, setHeroFile] = useState<FileRecord | null>(null);
  const [bannerFile, setBannerFile] = useState<FileRecord | null>(null);
  
  const [formData, setFormData] = useState<ChapterFormData>({
    title: '',
    slug: '',
    issue_id: issueId || '',
    content: { type: 'doc', content: [] },
    plain_content: '',
    html_content: '', // NEW: Initialize HTML content
    chapter_number: 1,
    status: 'draft',
    is_free: true, // Default to free for first chapters
    subscription_tier_required: 'free',
    free_chapter_order: null,
    hero_file_id: null,
    banner_file_id: null
  });

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

  // Load issues for dropdown
  useEffect(() => {
    const loadIssues = async () => {
      try {
        setError(null);
        setLoading(true);
        console.log('Loading issues...');

        const { data: issuesData, error: issuesError } = await supabase
          .from('content_items')
          .select('id, title, slug')
          .eq('type', 'issue')
          .in('status', ['published', 'draft'])
          .order('title');

        if (issuesError) {
          console.error('Error loading issues:', issuesError);
          setError(`Failed to load issues: ${issuesError.message}`);
          setIssues([]);
        } else if (!issuesData || issuesData.length === 0) {
          setError('No issues found. Please create an issue first.');
          setIssues([]);
        } else {
          setIssues(issuesData);
          
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

    if (!authLoading && user) {
      loadIssues();
    } else if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate, id, issueId]);

  // Load existing chapter with proper content handling
  useEffect(() => {
    const loadChapter = async () => {
      if (!id) return;
      
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
          // Load hero file if exists
          if (chapterData.hero_file_id) {
            const { data: heroFileData, error: heroError } = await supabase
              .from('files')
              .select('*')
              .eq('id', chapterData.hero_file_id)
              .single();
              
            if (!heroError && heroFileData) {
              setHeroFile(heroFileData);
            }
          }
          
          // Load banner file if exists
          if (chapterData.banner_file_id) {
            const { data: bannerFileData, error: bannerError } = await supabase
              .from('files')
              .select('*')
              .eq('id', chapterData.banner_file_id)
              .single();
              
            if (!bannerError && bannerFileData) {
              setBannerFile(bannerFileData);
            }
          }
          
          // Handle content loading with better HTML support
          let htmlContent = '';
          
          if (chapterData.html_content) {
            // Use stored HTML content if available
            htmlContent = chapterData.html_content;
          } else if (chapterData.plain_content) {
            // Convert plain text to HTML paragraphs
            htmlContent = textToParagraphs(chapterData.plain_content);
          } else if (typeof chapterData.content === 'string') {
            htmlContent = chapterData.content;
          }
          
          // Sanitize the content to ensure proper paragraph structure
          htmlContent = sanitizeHtml(htmlContent);
          setEditorContent(htmlContent);
          
          setFormData({
            title: chapterData.title || '',
            slug: chapterData.slug || '',
            issue_id: chapterData.issue_id || '',
            content: chapterData.content || { type: 'doc', content: [] },
            plain_content: chapterData.plain_content || '',
            html_content: htmlContent,
            chapter_number: chapterData.chapter_number || 1,
            status: chapterData.status || 'draft',
            is_free: chapterData.is_free ?? (chapterData.chapter_number <= 2),
            subscription_tier_required: chapterData.subscription_tier_required || 'free',
            free_chapter_order: chapterData.free_chapter_order || null,
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

  // Smart defaults for subscription settings
  useEffect(() => {
    const chapterNum = formData.chapter_number;
    
    if (!id && chapterNum) {
      setFormData(prev => ({
        ...prev,
        is_free: chapterNum <= 2,
        subscription_tier_required: chapterNum <= 2 ? 'free' : 'premium',
        free_chapter_order: chapterNum <= 2 ? chapterNum : null
      }));
    }
  }, [formData.chapter_number, id]);

  // Enhanced content change handler with proper HTML processing
  const handleContentChange = useCallback((htmlContent: string) => {
    // Sanitize and ensure proper paragraph structure
    const sanitizedHtml = sanitizeHtml(htmlContent);
    setEditorContent(sanitizedHtml);
    
    // Convert HTML to plain text for search
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedHtml;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Calculate stats
    const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
    const readTime = Math.max(1, Math.round(wordCount / 200));
    
    // Create content structure
    const contentJson = {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{
          type: 'text',
          text: plainText
        }]
      }]
    };
    
    setFormData(prev => ({
      ...prev,
      content: contentJson,
      plain_content: plainText,
      html_content: sanitizedHtml, // Store the HTML content
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

  // Handle hero image change
  const handleHeroChange = (fileRecord: FileRecord | null, url: string | null) => {
    setHeroFile(fileRecord);
    setFormData(prev => ({
      ...prev,
      hero_file_id: fileRecord?.id || null
    }));
  };

  // Handle banner image change
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

  // Calculate stats
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

      if (!formData.html_content.trim() && !formData.plain_content.trim()) {
        setError('Chapter content is required.');
        return;
      }

      // Prepare chapter data with HTML content
      const chapterData = {
        title: formData.title.trim(),
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        issue_id: formData.issue_id,
        content: formData.content,
        plain_content: formData.plain_content,
        html_content: formData.html_content, // Store HTML content
        chapter_number: formData.chapter_number,
        status: formData.status,
        is_free: formData.is_free,
        subscription_tier_required: formData.subscription_tier_required,
        free_chapter_order: formData.is_free ? formData.free_chapter_order : null,
        hero_file_id: formData.hero_file_id,
        banner_file_id: formData.banner_file_id,
        word_count: wordCount,
        estimated_read_time: estimatedReadTime,
        metadata: { created_by: user.id }
      };

      let result;
      if (id) {
        result = await supabase
          .from('chapters')
          .update(chapterData)
          .eq('id', id)
          .select();
      } else {
        result = await supabase
          .from('chapters')
          .insert([chapterData])
          .select();
      }

      if (result.error) {
        setError(`Failed to save chapter: ${result.error.message}`);
        return;
      }

      setSuccess(`Chapter ${id ? 'updated' : 'created'} successfully with proper paragraph formatting!`);
      
      setTimeout(() => {
        navigate('/admin/content/chapters');
      }, 2000);
      
    } catch (err) {
      console.error('Unexpected error saving chapter:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Loading states
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

  // Error state
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
      {/* Add global styles for proper paragraph spacing */}
      <style jsx global>{`
        .chapter-content-preview p {
          margin: 1.2em 0 !important;
          line-height: 1.7 !important;
        }
        .chapter-content-preview p:first-child {
          margin-top: 0 !important;
        }
        .chapter-content-preview p:last-child {
          margin-bottom: 0 !important;
        }
        .chapter-content-preview blockquote {
          margin: 1.5em 0 !important;
          padding-left: 1em !important;
          border-left: 3px solid #e5e7eb !important;
          font-style: italic !important;
        }
        .chapter-content-preview ul,
        .chapter-content-preview ol {
          margin: 1em 0 !important;
          padding-left: 1.5em !important;
        }
        .chapter-content-preview li {
          margin: 0.5em 0 !important;
        }
        .chapter-content-preview h1,
        .chapter-content-preview h2,
        .chapter-content-preview h3 {
          margin: 1.5em 0 0.5em 0 !important;
          font-weight: bold !important;
        }
        .chapter-content-preview h1 { font-size: 1.5em !important; }
        .chapter-content-preview h2 { font-size: 1.3em !important; }
        .chapter-content-preview h3 { font-size: 1.1em !important; }
        
        /* Reader styles - apply same spacing to published content */
        .chapter-content-render p {
          margin: 1.2em 0 !important;
          line-height: 1.7 !important;
        }
        .chapter-content-render p:first-child {
          margin-top: 0 !important;
        }
        .chapter-content-render p:last-child {
          margin-bottom: 0 !important;
        }
        .chapter-content-render blockquote {
          margin: 1.5em 0 !important;
          padding-left: 1em !important;
          border-left: 3px solid #e5e7eb !important;
          font-style: italic !important;
        }
        .chapter-content-render ul,
        .chapter-content-render ol {
          margin: 1em 0 !important;
          padding-left: 1.5em !important;
        }
        .chapter-content-render li {
          margin: 0.5em 0 !important;
        }
        .chapter-content-render h1,
        .chapter-content-render h2,
        .chapter-content-render h3 {
          margin: 1.5em 0 0.5em 0 !important;
          font-weight: bold !important;
        }
        .chapter-content-render h1 { font-size: 1.5em !important; }
        .chapter-content-render h2 { font-size: 1.3em !important; }
        .chapter-content-render h3 { font-size: 1.1em !important; }
      `}</style>
      
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
              {id ? 'Update your chapter with proper paragraph spacing' : 'Create a new chapter with enhanced formatting'}
            </p>
            
            {/* Live Stats */}
            {wordCount > 0 && (
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>📝 {wordCount.toLocaleString()} words</span>
                <span>•</span>
                <span>🕰 ~{estimatedReadTime} min read</span>
                <span>•</span>
                <span>📄 {(editorContent.match(/<p>/g) || []).length} paragraphs</span>
                {formData.is_free && <span>• 🎁 FREE</span>}
                {!formData.is_free && <span>• 👑 {formData.subscription_tier_required.toUpperCase()}</span>}
                {heroFile && <span>• 🎨 Hero</span>}
                {bannerFile && <span>• 🏞️ Banner</span>}
              </div>
            )}
          </div>
          
          {/* Header Actions */}
          <div className="flex gap-2">
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
            {id && formData.issue_id && formData.slug && (
              <button
                type="button"
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Live Preview
              </button>
            )}
          </div>
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
              
              {/* Chapter Content Editor */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">✏️ Chapter Content</h3>
                
                {/* Content Tips */}
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">📖 Formatting Tips for Perfect Paragraph Spacing</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Press <kbd className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">Enter</kbd> once to create a line break within a paragraph</li>
                    <li>• Press <kbd className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">Enter</kbd> twice to create a new paragraph with proper spacing</li>
                    <li>• Use the toolbar to add headings, bold text, italics, lists, and quotes</li>
                    <li>• Toggle preview below to see exactly how readers will see your content</li>
                    <li>• Content automatically saves with proper HTML paragraph formatting</li>
                  </ul>
                </div>
                
                <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                  {/* Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chapter Content *
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
                      <ReactQuill
                        ref={quillRef}
                        value={editorContent}
                        onChange={handleContentChange}
                        modules={quillModules}
                        formats={quillFormats}
                        style={{ minHeight: '400px' }}
                        placeholder="Write your chapter content here...\n\nPress Enter twice to create paragraphs with proper spacing.\nUse the toolbar above for formatting."
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
                            __html: editorContent || '<p class="text-gray-400 italic">Start typing to see your content preview with proper paragraph spacing...</p>'
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
                  Word count: <strong>{wordCount}</strong> • Reading time: <strong>~{estimatedReadTime} min</strong> • Paragraphs: <strong>{(editorContent.match(/<p>/g) || []).length}</strong>
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Visual Assets */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🎨 Visual Assets
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <ImageInput
                      label="Hero Image"
                      value={heroFile}
                      onChange={handleHeroChange}
                      placeholder="Chapter opening artwork"
                      allowedTypes={['images']}
                    />
                    <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mt-2">
                      🎨 <strong>Hero Image:</strong> Displayed at the very beginning of the chapter when reading.
                    </div>
                  </div>

                  <div>
                    <ImageInput
                      label="Banner Image"
                      value={bannerFile}
                      onChange={handleBannerChange}
                      placeholder="Library card background"
                      allowedTypes={['images']}
                    />
                    <div className="text-xs text-purple-600 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md mt-2">
                      🏞️ <strong>Banner Image:</strong> Used as the background for chapter cards in the library.
                    </div>
                  </div>
                </div>
              </div>

              {/* Access Control */}
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
                        Free chapters can be read by anyone without a subscription.
                      </p>
                    </div>
                  </div>

                  {/* Subscription Tier */}
                  {!formData.is_free && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Required Subscription Tier
                      </label>
                      <div className="space-y-2">
                        {([
                          { value: 'premium', label: 'Premium', desc: '👑 $9.99/mo subscribers', color: 'yellow' },
                          { value: 'patron', label: 'Patron', desc: '💜 $19.99/mo supporters', color: 'purple' }
                        ] as const).map(({ value, label, desc, color }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, subscription_tier_required: value }))}
                            className={`w-full p-3 border-2 rounded-lg transition-all text-left flex items-center gap-3 ${
                              formData.subscription_tier_required === value
                                ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20`
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                            }`}
                          >
                            <Crown className={`w-4 h-4 ${color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`} />
                            <div>
                              <div className="font-medium text-sm">{label}</div>
                              <div className="text-xs opacity-70">{desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Free Chapter Order */}
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
                        placeholder="1, 2, 3..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Content Statistics</h3>
                
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
                    <span className="font-medium text-green-600">{(editorContent.match(/<p>/g) || []).length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Format:</span>
                    <span className="font-medium text-green-600">✅ Proper Spacing</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Access Level:</span>
                    <span className={`font-medium ${
                      formData.is_free ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {formData.is_free ? '🎁 Free' : `👑 ${formData.subscription_tier_required}`}
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
                <div className="text-green-600 font-medium mb-1">
                  ✅ Content will be saved with proper paragraph spacing for readers
                </div>
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
                  disabled={saving || !formData.title || !formData.issue_id || (!formData.html_content && !formData.plain_content)}
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