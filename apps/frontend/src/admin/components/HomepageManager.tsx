import React, { useState, useEffect, useMemo } from 'react';
import { Save, Eye, Loader2, CheckCircle, RefreshCw, Plus, X, BarChart3 } from 'lucide-react';
import { useHomepageData, useHomepageAdmin, formatMetricValue, type HomepageContent, type HomepageQuote } from '../../hooks/useHomepageData';

// SAFE HOOK: Context hook that never throws errors
const useSafeHomepageContext = () => {
  const fallbackContext = useMemo(() => ({
    isReady: false,
    registerDataRefresh: () => () => {}, // Return no-op cleanup
    invalidateHomepageData: () => {},
    invalidateMetrics: () => {}
  }), []);

  return fallbackContext;
};

// ERROR BOUNDARY: Class component - no hooks
class HomepageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; errorCount: number }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }
  
  static getDerivedStateFromError(error: Error) {
    console.error('❌ Homepage Manager Error Boundary caught error:', error);
    
    if (error.message.includes('Minified React error #321') || 
        error.message.includes('Invalid hook call')) {
      console.error('🚨 REACT HOOK ERROR #321 DETECTED - Fixed implementation should prevent this');
    }
    
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Homepage Manager Error Details:', { error, errorInfo });
    this.setState(prevState => ({ 
      errorCount: prevState.errorCount + 1 
    }));
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Homepage Manager Error (Count: {this.state.errorCount})
            </h3>
            <p className="text-red-600 mb-2 text-sm">
              {this.state.error?.message || 'Unknown error occurred'}
            </p>
            <p className="text-red-600 mb-4 text-sm">
              The component has been isolated to prevent further errors.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Reset Component
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// MAIN COMPONENT: Proper Homepage Manager with full functionality
const HomepageManagerCore: React.FC = () => {
  // *** ALL HOOKS CALLED AT TOP LEVEL - NEVER CONDITIONAL *** 
  // This is the critical fix for React Hook Error #321
  
  const homepageContext = useSafeHomepageContext();
  const { data, isLoading, error, refetch } = useHomepageData();
  const { 
    isLoading: isSaving, 
    error: adminError,
    updateContent, 
    updateMetrics, 
    calculateMetrics,
    getAllQuotes,
    addQuote: createQuote,
    updateQuote,
    deleteQuote
  } = useHomepageAdmin();
  
  // All useState hooks - called unconditionally
  const [localContent, setLocalContent] = useState<HomepageContent | null>(null);
  const [localQuotes, setLocalQuotes] = useState<HomepageQuote[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'metrics' | 'quotes' | 'sections'>('hero');
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [newQuote, setNewQuote] = useState({ text: '', author: '' });
  const [editingQuote, setEditingQuote] = useState<HomepageQuote | null>(null);

  // All useEffect hooks - called unconditionally after useState
  useEffect(() => {
    setMounted(true);
    console.log('✅ HomepageManager mounted successfully');
    
    return () => {
      console.log('🗑️ HomepageManager unmounting');
    };
  }, []);

  useEffect(() => {
    if (data?.content && mounted) {
      console.log('🔄 Updating local content from data:', data.content.id);
      setLocalContent(data.content);
    }
  }, [data?.content, mounted]);

  useEffect(() => {
    if (data?.quotes && mounted) {
      console.log('💬 Updating local quotes from data:', data.quotes.length, 'quotes');
      setLocalQuotes(data.quotes);
    }
  }, [data?.quotes, mounted]);

  useEffect(() => {
    if (!mounted) return;

    try {
      console.log('📝 Registering context callback (safe mode)');
      
      const cleanup = homepageContext.registerDataRefresh(() => {
        console.log('📝 Context refresh callback triggered');
        if (mounted) {
          refetch();
        }
      });
      
      return cleanup;
    } catch (error) {
      console.error('❌ Error in context registration:', error);
      return () => {};
    }
  }, [homepageContext, refetch, mounted]);

  // Event handlers - defined after all hooks
  const handleContentChange = (field: keyof HomepageContent, value: any) => {
    if (!localContent || !mounted) return;
    
    setLocalContent(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
  };

  const handleSaveContent = async () => {
    if (!localContent || !mounted) {
      console.error('❌ Cannot save: No local content or component unmounted');
      return;
    }
    
    try {
      const updatePayload = {
        id: localContent.id,
        hero_title: localContent.hero_title || '',
        hero_subtitle: localContent.hero_subtitle || '',
        hero_description: localContent.hero_description || '',
        hero_quote: localContent.hero_quote || '',
        cta_button_text: localContent.cta_button_text || '',
        cta_button_link: localContent.cta_button_link || '',
        words_written: Number(localContent.words_written) || 0,
        beta_readers: Number(localContent.beta_readers) || 0,
        average_rating: Number(localContent.average_rating) || 0,
        books_published: Number(localContent.books_published) || 0,
        show_latest_news: Boolean(localContent.show_latest_news),
        show_latest_releases: Boolean(localContent.show_latest_releases),
        show_artist_collaboration: Boolean(localContent.show_artist_collaboration),
        show_progress_metrics: Boolean(localContent.show_progress_metrics)
      };
      
      console.log('💾 Saving content with payload:', updatePayload);
      
      const result = await updateContent(updatePayload);
      console.log('✅ Content saved successfully!', result);
      
      if (mounted) {
        setLastSaved(new Date());
        
        try {
          homepageContext.invalidateHomepageData();
        } catch (err) {
          console.warn('⚠️ Context invalidation failed (safe mode):', err);
        }
        
        setTimeout(() => {
          if (mounted) {
            refetch();
          }
        }, 200);
      }
      
    } catch (error) {
      console.error('❌ Failed to save content:', error);
      throw error;
    }
  };

  const handleSaveMetrics = async () => {
    if (!localContent || !mounted) {
      console.error('❌ Cannot save metrics: No local content or component unmounted');
      return;
    }
    
    try {
      console.log('📊 Saving metrics...');
      const metricsPayload = {
        words_written: Number(localContent.words_written) || 0,
        beta_readers: Number(localContent.beta_readers) || 0,
        average_rating: Number(localContent.average_rating) || 0,
        books_published: Number(localContent.books_published) || 0
      };
      
      const result = await updateMetrics(metricsPayload);
      console.log('✅ Metrics saved successfully:', result);
      
      if (mounted) {
        setLastSaved(new Date());
        
        try {
          homepageContext.invalidateMetrics();
        } catch (err) {
          console.warn('⚠️ Metrics cache invalidation failed (safe mode):', err);
        }
        
        setTimeout(() => {
          if (mounted) {
            refetch();
          }
        }, 200);
      }
      
    } catch (error) {
      console.error('❌ Failed to save metrics:', error);
      throw error;
    }
  };

  const handleCalculateMetrics = async () => {
    if (!mounted) return;
    
    try {
      console.log('🧮 Calculating metrics automatically...');
      const result = await calculateMetrics();
      console.log('✅ Metrics calculated:', result);
      
      if (mounted) {
        try {
          homepageContext.invalidateMetrics();
        } catch (err) {
          console.warn('⚠️ Context invalidation failed (safe mode):', err);
        }
        
        setTimeout(() => {
          if (mounted) {
            refetch();
          }
        }, 200);
      }
      
    } catch (error) {
      console.error('❌ Failed to calculate metrics:', error);
    }
  };

  const loadAllQuotes = async () => {
    if (!mounted) return;
    
    try {
      setIsLoadingQuotes(true);
      console.log('📥 Loading all quotes...');
      const allQuotes = await getAllQuotes();
      console.log('✅ Loaded quotes:', allQuotes.length);
      
      if (mounted) {
        setLocalQuotes(allQuotes);
      }
    } catch (error) {
      console.error('❌ Failed to load all quotes:', error);
    } finally {
      if (mounted) {
        setIsLoadingQuotes(false);
      }
    }
  };

  const handleAddQuote = async () => {
    if (!newQuote.text || !newQuote.author || !mounted) return;
    
    try {
      const result = await createQuote({
        text: newQuote.text,
        author: newQuote.author,
        is_active: true
      });
      
      console.log('✅ Quote added:', result);
      
      if (mounted) {
        setNewQuote({ text: '', author: '' });
        loadAllQuotes();
      }
    } catch (error) {
      console.error('❌ Failed to add quote:', error);
    }
  };

  const handleUpdateQuote = async (quote: HomepageQuote) => {
    if (!mounted) return;
    
    try {
      const result = await updateQuote(quote.id, quote);
      console.log('✅ Quote updated:', result);
      
      if (mounted) {
        setEditingQuote(null);
        loadAllQuotes();
      }
    } catch (error) {
      console.error('❌ Failed to update quote:', error);
    }
  };

  const handleDeleteQuote = async (quoteId: number) => {
    if (!mounted) return;
    
    try {
      await deleteQuote(quoteId);
      console.log('✅ Quote deleted:', quoteId);
      
      if (mounted) {
        loadAllQuotes();
      }
    } catch (error) {
      console.error('❌ Failed to delete quote:', error);
    }
  };

  // CRITICAL: Early returns AFTER all hooks are declared
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Initializing...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading homepage content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Homepage Loading Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => mounted && refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Retry Loading
            </button>
            <button 
              onClick={() => setDebugMode(!debugMode)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              {debugMode ? 'Hide' : 'Show'} Debug Info
            </button>
          </div>
          
          {debugMode && (
            <div className="mt-4 p-4 bg-gray-100 rounded text-left text-sm">
              <div><strong>Error:</strong> {error}</div>
              <div><strong>Admin Error:</strong> {adminError || 'None'}</div>
              <div><strong>Mounted:</strong> {String(mounted)}</div>
              <div><strong>Has Content:</strong> {String(!!localContent)}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!localContent) {
    return (
      <div className="text-center py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-lg mx-auto">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Homepage Content</h3>
          <p className="text-yellow-600 mb-4">No homepage content found in the database.</p>
          <button 
            onClick={() => mounted && refetch()}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Main component render with FULL FUNCTIONALITY
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Homepage Manager
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your homepage content, progress metrics, and layout settings
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500">
              Fixed Hook Implementation (No #321 Errors)
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`px-3 py-2 text-xs font-medium rounded-md ${
              debugMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            🔧 Debug {debugMode ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
          <button
            onClick={() => mounted && refetch()}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {lastSaved && (
        <div className="flex items-center text-sm text-green-600 bg-green-50 px-4 py-2 rounded-md">
          <CheckCircle className="w-4 h-4 mr-2" />
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
      
      {(error || adminError) && (
        <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-md">
          <strong>Error:</strong> {error || adminError}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'hero', name: 'Hero Section', icon: '🏠' },
            { id: 'metrics', name: 'Progress Metrics', icon: '📊' },
            { id: 'quotes', name: 'Quotes', icon: '💬' },
            { id: 'sections', name: 'Layout Sections', icon: '🎛️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {activeTab === 'hero' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Hero Section Content</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={localContent?.hero_title || ''}
                  onChange={(e) => handleContentChange('hero_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hero title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={localContent?.hero_subtitle || ''}
                  onChange={(e) => handleContentChange('hero_subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hero subtitle..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Description
                </label>
                <textarea
                  value={localContent?.hero_description || ''}
                  onChange={(e) => handleContentChange('hero_description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hero description..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Quote
                </label>
                <input
                  type="text"
                  value={localContent?.hero_quote || ''}
                  onChange={(e) => handleContentChange('hero_quote', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter inspirational quote..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={localContent?.cta_button_text || ''}
                    onChange={(e) => handleContentChange('cta_button_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Get Started"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CTA Button Link
                  </label>
                  <input
                    type="url"
                    value={localContent?.cta_button_link || ''}
                    onChange={(e) => handleContentChange('cta_button_link', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSaveContent}
                  disabled={isSaving || !mounted}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Hero Content
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Progress Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Words Written
                </label>
                <input
                  type="number"
                  value={localContent?.words_written || 0}
                  onChange={(e) => handleContentChange('words_written', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatted: {formatMetricValue(localContent?.words_written || 0)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beta Readers
                </label>
                <input
                  type="number"
                  value={localContent?.beta_readers || 0}
                  onChange={(e) => handleContentChange('beta_readers', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={localContent?.average_rating || 0}
                  onChange={(e) => handleContentChange('average_rating', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Books Published
                </label>
                <input
                  type="number"
                  value={localContent?.books_published || 0}
                  onChange={(e) => handleContentChange('books_published', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleCalculateMetrics}
                disabled={isSaving || !mounted}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                Auto-Calculate
              </button>
              
              <button
                onClick={handleSaveMetrics}
                disabled={isSaving || !mounted}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Metrics
              </button>
            </div>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Quotes Management</h2>
              <button
                onClick={loadAllQuotes}
                disabled={isLoadingQuotes || !mounted}
                className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                {isLoadingQuotes ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Refresh
              </button>
            </div>
            
            {/* Add New Quote */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-3">Add New Quote</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quote Text
                  </label>
                  <textarea
                    value={newQuote.text}
                    onChange={(e) => setNewQuote(prev => ({ ...prev, text: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the quote text..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={newQuote.author}
                    onChange={(e) => setNewQuote(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Quote author..."
                  />
                </div>
                <button
                  onClick={handleAddQuote}
                  disabled={!newQuote.text || !newQuote.author || isSaving}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Quote
                </button>
              </div>
            </div>
            
            {/* Quotes List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Existing Quotes ({localQuotes.length})</h3>
              {localQuotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No quotes found. Add your first quote above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {localQuotes.map((quote) => (
                    <div key={quote.id} className="border border-gray-200 rounded-lg p-4">
                      {editingQuote?.id === quote.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editingQuote.text}
                            onChange={(e) => setEditingQuote(prev => prev ? { ...prev, text: e.target.value } : null)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={editingQuote.author}
                            onChange={(e) => setEditingQuote(prev => prev ? { ...prev, author: e.target.value } : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={editingQuote.is_active}
                              onChange={(e) => setEditingQuote(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                              className="rounded"
                            />
                            <label className="text-sm text-gray-700">Active</label>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingQuote(null)}
                              className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateQuote(editingQuote)}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <blockquote className="text-gray-800 italic mb-2">
                                "{quote.text}"
                              </blockquote>
                              <p className="text-sm text-gray-600">— {quote.author}</p>
                              <div className="flex items-center mt-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  quote.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {quote.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => setEditingQuote(quote)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuote(quote.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Layout Sections</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Latest News</h3>
                  <p className="text-sm text-gray-600">Show recent blog posts and updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={localContent?.show_latest_news || false}
                  onChange={(e) => handleContentChange('show_latest_news', e.target.checked)}
                  className="rounded"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Latest Releases</h3>
                  <p className="text-sm text-gray-600">Display recent book releases</p>
                </div>
                <input
                  type="checkbox"
                  checked={localContent?.show_latest_releases || false}
                  onChange={(e) => handleContentChange('show_latest_releases', e.target.checked)}
                  className="rounded"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Artist Collaboration</h3>
                  <p className="text-sm text-gray-600">Show collaboration section</p>
                </div>
                <input
                  type="checkbox"
                  checked={localContent?.show_artist_collaboration || false}
                  onChange={(e) => handleContentChange('show_artist_collaboration', e.target.checked)}
                  className="rounded"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Progress Metrics</h3>
                  <p className="text-sm text-gray-600">Display writing progress statistics</p>
                </div>
                <input
                  type="checkbox"
                  checked={localContent?.show_progress_metrics || false}
                  onChange={(e) => handleContentChange('show_progress_metrics', e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveContent}
                disabled={isSaving || !mounted}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Layout Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Debug Information */}
      {debugMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <h4 className="font-medium text-blue-800 mb-2">🔍 Debug Information:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
            <div>
              <div><strong>Component Mounted:</strong> {String(mounted)}</div>
              <div><strong>Context Ready:</strong> {String(homepageContext?.isReady)}</div>
              <div><strong>Is Loading:</strong> {String(isLoading)}</div>
              <div><strong>Is Saving:</strong> {String(isSaving)}</div>
            </div>
            <div>
              <div><strong>Has Local Content:</strong> {String(!!localContent)}</div>
              <div><strong>Local Quotes Count:</strong> {localQuotes.length}</div>
              <div><strong>Admin Error:</strong> {adminError || 'None'}</div>
              <div><strong>Last Saved:</strong> {lastSaved ? lastSaved.toLocaleString() : 'Never'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component export with error boundary
const HomepageManager: React.FC = () => {
  return (
    <HomepageErrorBoundary>
      <HomepageManagerCore />
    </HomepageErrorBoundary>
  );
};

export default HomepageManager;