import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '@zoroaster/shared';
import { BookOpen, ArrowLeft, Save, AlertCircle, Loader2, CheckCircle, Info } from 'lucide-react';
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
}

interface SchemaCheck {
  check_name: string;
  status: string;
  details: string;
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
  const [schemaChecks, setSchemaChecks] = useState<SchemaCheck[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  const [formData, setFormData] = useState<ChapterFormData>({
    title: '',
    slug: '',
    issue_id: issueId || '',
    content: { type: 'doc', content: [] }, // Initialize with empty Quill-compatible JSON
    plain_content: '',
    chapter_number: 1,
    status: 'draft'
  });

  // Enhanced validation function
  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'Chapter title is required.';
    }
    
    if (formData.title.trim().length < 3) {
      return 'Chapter title must be at least 3 characters long.';
    }

    if (!formData.issue_id) {
      return 'Please select an issue for this chapter.';
    }

    if (!formData.plain_content.trim()) {
      return 'Chapter content is required.';
    }
    
    if (formData.plain_content.trim().length < 10) {
      return 'Chapter content must be at least 10 characters long.';
    }
    
    if (formData.chapter_number < 1) {
      return 'Chapter number must be at least 1.';
    }
    
    return null;
  };

  // Run schema diagnostics
  useEffect(() => {
    const runDiagnostics = async () => {
      if (user) {
        try {
          console.log('=== RUNNING SCHEMA DIAGNOSTICS ===');
          
          // Check if diagnostic function exists
          const { data: diagnostics, error: diagError } = await supabase
            .rpc('check_chapter_creation_readiness');
          
          if (diagError) {
            console.error('Diagnostics function error:', diagError);
          } else {
            console.log('Schema diagnostics:', diagnostics);
            setSchemaChecks(diagnostics || []);
          }
          
          // Test chapter insertion
          const { data: testResult, error: testError } = await supabase
            .rpc('test_chapter_insertion', {
              p_title: 'Test Chapter - ' + new Date().toISOString(),
              p_issue_id: '00000000-0000-0000-0000-000000000005'
            });
            
          if (testError) {
            console.error('Test insertion error:', testError);
          } else {
            console.log('Test insertion result:', testResult);
          }
          
        } catch (err) {
          console.error('Diagnostics error:', err);
        }
      }
    };
    
    runDiagnostics();
  }, [user]);

  // Load issues for dropdown with better error handling
  useEffect(() => {
    const loadIssues = async () => {
      try {
        setError(null);
        setLoading(true);
        console.log('Starting to load issues...');

        // First check if content_items table exists
        const { data: tableCheck } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_name', 'content_items')
          .eq('table_schema', 'public');
          
        if (!tableCheck || tableCheck.length === 0) {
          setError('Database schema not ready. Please run migrations first.');
          return;
        }

        // Load from content_items with type 'issue'
        const { data: issuesData, error: issuesError } = await supabase
          .from('content_items')
          .select('id, title, slug, status, created_at')
          .eq('type', 'issue')
          .in('status', ['published', 'draft']) // Include drafts too for testing
          .order('created_at', { ascending: false });

        console.log('Issues query result:', { issuesData, issuesError });

        if (issuesError) {
          console.error('Error loading issues:', issuesError);
          setError(`Failed to load issues: ${issuesError.message}`);
          
          // Try to provide helpful debugging info
          if (issuesError.code === 'PGRST116') {
            setError('The content_items table or columns may not exist. Please check your database schema.');
          } else if (issuesError.code === 'PGRST301') {
            setError('Authentication issue. Please ensure you are logged in with proper permissions.');
          }
          
          setIssues([]);
        } else if (!issuesData || issuesData.length === 0) {
          console.log('No issues found');
          setError('No issues found. Please create an issue first before creating chapters.');
          setIssues([]);
        } else {
          console.log('Found issues:', issuesData);
          setIssues(issuesData);
          
          // If creating a new chapter and we have issues, set the first one as default if no issueId in URL
          if (!id && !issueId && issuesData.length > 0) {
            setFormData(prev => ({ ...prev, issue_id: issuesData[0].id }));
          }
          
          // Show success message if issues loaded
          setSuccess(`Successfully loaded ${issuesData.length} issue(s).`);
          setTimeout(() => setSuccess(null), 3000);
        }
        
      } catch (err: any) {
        console.error('Unexpected error loading issues:', err);
        setError(`An unexpected error occurred: ${err.message || 'Unknown error'}`);
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
          if (chapterError.code === 'PGRST116') {
            setError('The chapters table may not exist. Please check your database schema.');
          } else {
            setError('Failed to load chapter. Please try again.');
          }
          return;
        }

        if (chapterData) {
          console.log('Loaded chapter data:', chapterData);
          setFormData({
            title: chapterData.title || '',
            slug: chapterData.slug || '',
            issue_id: chapterData.issue_id || '',
            content: chapterData.content || { type: 'doc', content: [] },
            plain_content: chapterData.plain_content || '',
            chapter_number: chapterData.chapter_number || 1,
            status: chapterData.status || 'draft'
          });
        }
        
      } catch (err: any) {
        console.error('Unexpected error loading chapter:', err);
        setError(`An unexpected error occurred while loading chapter: ${err.message || 'Unknown error'}`);
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

  // Handle content change from ReactQuill
  const handleContentChange = (htmlContent: string) => {
    // Convert HTML to plain text for search
    const plainText = htmlContent.replace(/<[^>]*>/g, '').trim();
    
    // Store as simple JSON structure for now - you might want to use a proper rich text format
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

  // Calculate word count and estimated read time
  const wordCount = formData.plain_content.split(/\s+/).filter(word => word.length > 0).length;
  const estimatedReadTime = Math.max(1, Math.round(wordCount / 200));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || saving) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Enhanced validation
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      // Check if issue exists
      const { data: issueExists } = await supabase
        .from('content_items')
        .select('id')
        .eq('id', formData.issue_id)
        .eq('type', 'issue')
        .single();
        
      if (!issueExists) {
        setError('Selected issue does not exist or is not valid.');
        return;
      }

      // Prepare chapter data to match the actual database schema
      const chapterData = {
        title: formData.title.trim(),
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        issue_id: formData.issue_id,
        content: formData.content, // JSONB rich content
        plain_content: formData.plain_content, // Plain text for search
        chapter_number: formData.chapter_number,
        word_count: wordCount,
        estimated_read_time: estimatedReadTime,
        status: formData.status,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        metadata: { 
          created_by: user.id,
          editor_version: 'improved',
          created_at: new Date().toISOString()
        }
      };

      console.log('Submitting chapter data:', chapterData);

      let result;
      if (id) {
        // Update existing chapter
        result = await supabase
          .from('chapters')
          .update(chapterData)
          .eq('id', id)
          .select()
          .single();
      } else {
        // Create new chapter
        result = await supabase
          .from('chapters')
          .insert([chapterData])
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving chapter:', result.error);
        
        // Provide more specific error messages
        if (result.error.code === '23505') {
          if (result.error.message.includes('unique_chapter_number')) {
            setError(`Chapter number ${formData.chapter_number} already exists for this issue. Please use a different number.`);
          } else if (result.error.message.includes('unique_chapter_slug')) {
            setError(`A chapter with this URL slug already exists for this issue. Please modify the title to generate a unique slug.`);
          } else {
            setError('A chapter with these details already exists. Please check the chapter number and title.');
          }
        } else if (result.error.code === '23503') {
          setError('The selected issue is not valid or has been deleted.');
        } else if (result.error.code === 'PGRST116') {
          setError('Database table not found. Please ensure your database schema is up to date.');
        } else {
          setError(`Failed to save chapter: ${result.error.message}`);
        }
        return;
      }

      console.log('Chapter saved successfully:', result.data);
      
      setSuccess(id ? 'Chapter updated successfully!' : 'Chapter created successfully!');
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/admin/content/chapters');
      }, 1500);
      
    } catch (err: any) {
      console.error('Unexpected error saving chapter:', err);
      setError(`An unexpected error occurred: ${err.message || 'Please try again.'}`);
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
            <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get HTML content for the editor - extract text from JSON structure
  const getHtmlContent = () => {
    if (!formData.content || !formData.content.content) return '';
    
    // Simple extraction - you might want to implement proper JSON-to-HTML conversion
    try {
      const firstParagraph = formData.content.content[0];
      if (firstParagraph && firstParagraph.content && firstParagraph.content[0]) {
        return firstParagraph.content[0].text || '';
      }
    } catch (e) {
      console.log('Error extracting HTML content:', e);
    }
    
    return formData.plain_content || '';
  };

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
          
          {/* Diagnostics Toggle */}
          <div className="ml-auto">
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Show diagnostics"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Diagnostics Panel */}
        {showDiagnostics && schemaChecks.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Schema Diagnostics
            </h3>
            <div className="space-y-2">
              {schemaChecks.map((check, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {check.status === 'OK' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    check.status === 'OK' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                  }`}>
                    {check.check_name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">- {check.details}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Success
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
                  minLength={3}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200 characters</p>
              </div>

              {/* Chapter Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chapter Number *
                </label>
                <input
                  type="number"
                  min="1"
                  max="9999"
                  value={formData.chapter_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, chapter_number: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must be unique within the selected issue</p>
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
                  pattern="[a-z0-9-]+"
                />
                <p className="text-xs text-gray-500 mt-1">Must be unique within the selected issue. Only lowercase letters, numbers, and hyphens.</p>
              </div>
            </div>

            {/* Content Editor */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chapter Content *
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <ReactQuill
                  value={getHtmlContent()}
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
                />
              </div>
              
              {/* Word count and read time */}
              {wordCount > 0 && (
                <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{wordCount} words</span>
                  <span>~{estimatedReadTime} min read</span>
                  <span className={wordCount < 100 ? 'text-red-500' : wordCount > 5000 ? 'text-yellow-500' : 'text-green-500'}>
                    {wordCount < 100 ? 'Very short' : wordCount > 5000 ? 'Very long' : 'Good length'}
                  </span>
                </div>
              )}
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
              disabled={saving || !formData.title || !formData.issue_id || !formData.plain_content || validateForm() !== null}
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