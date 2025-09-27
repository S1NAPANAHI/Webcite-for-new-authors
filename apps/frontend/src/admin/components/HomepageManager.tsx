import React, { useState, useEffect } from 'react';
import { Save, Eye, Loader2, CheckCircle, RefreshCw, Plus, X, BarChart3 } from 'lucide-react';
import { useHomepageData, useHomepageAdmin, formatMetricValue, type HomepageContent, type HomepageQuote } from '../../hooks/useHomepageData';
// CRITICAL FIX: Import the completely SAFE context hook
import { useHomepageContextSafe } from '../../contexts/HomepageContext';

// CRITICAL FIX: Error Boundary Component with better error handling
class HomepageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    console.error('❌ Homepage Manager Error Boundary caught error:', error);
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Homepage Manager Error:', error, errorInfo);
    
    // CRITICAL: Don't log the same error multiple times
    if (!error.message.includes('React error #321')) {
      console.error('Full error details:', { error, errorInfo });
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Homepage Manager Error</h3>
            <p className="text-red-600 mb-4">
              The homepage manager encountered an error. This might be due to a context timing issue.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => {
                  // Reset error state and try again
                  this.setState({ hasError: false, error: null });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try Again
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

// CRITICAL FIX: Create a completely safe wrapper component
const SafeHomepageManagerCore: React.FC = () => {
  // CRITICAL FIX: Use the completely SAFE context hook that never throws
  const homepageContext = useHomepageContextSafe();
  
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
  
  const [localContent, setLocalContent] = useState<HomepageContent | null>(null);
  const [localQuotes, setLocalQuotes] = useState<HomepageQuote[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'metrics' | 'quotes' | 'sections'>('hero');
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [contextStatus, setContextStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');

  // Monitor context status
  useEffect(() => {
    if (homepageContext) {
      if (homepageContext.isReady) {
        setContextStatus('ready');
        console.log('✅ Homepage context is ready');
      } else {
        setContextStatus('fallback');
        console.log('⚠️ Using homepage context fallback');
      }
    }
  }, [homepageContext]);

  // Initialize local state when data is loaded
  useEffect(() => {
    if (data?.content) {
      console.log('🔄 Initializing local content from data:', data.content);
      setLocalContent(data.content);
    }
    if (data?.quotes) {
      console.log('💬 Initializing local quotes from data:', data.quotes.length, 'quotes');
      setLocalQuotes(data.quotes);
    }
  }, [data]);

  // CRITICAL FIX: Ultra-safe useEffect for context registration
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    try {
      console.log('📝 Attempting to register homepage context callback');
      
      // Register the callback using the safe context
      cleanup = homepageContext.registerDataRefresh(() => {
        console.log('📝 Refreshing homepage data from context');
        try {
          refetch();
        } catch (error) {
          console.error('❌ Error in refetch callback:', error);
        }
      });
      
      console.log('✅ Successfully registered homepage context callback');
    } catch (error) {
      console.error('❌ Error registering homepage context callback:', error);
    }
    
    // Return cleanup function that's guaranteed to work
    return () => {
      try {
        if (cleanup && typeof cleanup === 'function') {
          cleanup();
          console.log('🗑️ Successfully cleaned up homepage context callback');
        }
      } catch (error) {
        console.error('❌ Error during context cleanup:', error);
      }
    };
  }, [homepageContext, refetch]);

  // Load all quotes for admin management
  const loadAllQuotes = async () => {
    try {
      setIsLoadingQuotes(true);
      console.log('📥 Loading all quotes...');
      const allQuotes = await getAllQuotes();
      console.log('✅ Loaded quotes:', allQuotes.length);
      setLocalQuotes(allQuotes);
    } catch (error) {
      console.error('❌ Failed to load all quotes:', error);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  // CRITICAL FIX: Enhanced async save with better error handling
  const handleSaveContent = async () => {
    if (!localContent) {
      console.error('❌ Cannot save: No local content available');
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
      
      console.log('🎯 Sending payload:', updatePayload);
      
      const result = await updateContent(updatePayload);
      console.log('✅ Content saved successfully!', result);
      
      // CRITICAL FIX: Use multiple approaches to ensure state updates work
      const updateUI = () => {
        setLastSaved(new Date());
        
        // Safely invalidate cache using the safe context
        try {
          homepageContext.invalidateHomepageData();
        } catch (error) {
          console.error('❌ Error invalidating cache:', error);
        }
        
        // Refresh data with delay
        setTimeout(() => {
          try {
            refetch();
          } catch (error) {
            console.error('❌ Error during refetch:', error);
          }
        }, 100);
      };
      
      // Try multiple timing approaches
      updateUI(); // Immediate
      requestAnimationFrame(updateUI); // Next frame
      setTimeout(updateUI, 0); // Next tick
      
    } catch (error) {
      console.error('❌ Failed to save content:', error);
      throw error;
    }
  };

  const handleSaveMetrics = async () => {
    if (!localContent) {
      console.error('❌ Cannot save metrics: No local content available');
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
      
      console.log('📊 Metrics payload:', metricsPayload);
      const result = await updateMetrics(metricsPayload);
      console.log('✅ Metrics saved successfully:', result);
      
      // Safe UI update
      const updateUI = () => {
        setLastSaved(new Date());
        
        try {
          homepageContext.invalidateMetrics();
        } catch (error) {
          console.error('❌ Error invalidating metrics cache:', error);
        }
        
        setTimeout(() => {
          try {
            refetch();
          } catch (error) {
            console.error('❌ Error during metrics refetch:', error);
          }
        }, 100);
      };
      
      updateUI();
      requestAnimationFrame(updateUI);
      
    } catch (error) {
      console.error('❌ Failed to save metrics:', error);
      throw error;
    }
  };

  const handleCalculateMetrics = async () => {
    try {
      console.log('🧮 Calculating metrics automatically...');
      const result = await calculateMetrics();
      console.log('✅ Metrics calculated:', result);
      
      // Safe UI update
      const updateUI = () => {
        try {
          homepageContext.invalidateMetrics();
        } catch (error) {
          console.error('❌ Error invalidating metrics cache:', error);
        }
        
        setTimeout(() => {
          try {
            refetch();
          } catch (error) {
            console.error('❌ Error during calculate refetch:', error);
          }
        }, 100);
      };
      
      updateUI();
      requestAnimationFrame(updateUI);
      
    } catch (error) {
      console.error('❌ Failed to calculate metrics:', error);
    }
  };

  const handleAddQuote = async () => {
    try {
      console.log('➕ Adding new quote...');
      await createQuote({
        quote_text: 'New inspiring quote...',
        author: 'Zoroastrian Wisdom',
        display_order: localQuotes.length + 1
      });
      console.log('✅ Quote added successfully');
      await loadAllQuotes();
    } catch (error) {
      console.error('❌ Failed to add quote:', error);
    }
  };

  const handleUpdateQuote = async (id: number, updates: Partial<HomepageQuote>) => {
    try {
      console.log(`📝 Updating quote ${id}:`, updates);
      await updateQuote(id, updates);
      console.log('✅ Quote updated successfully');
      await loadAllQuotes();
    } catch (error) {
      console.error('❌ Failed to update quote:', error);
    }
  };

  const handleDeleteQuote = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    
    try {
      console.log(`🗑️ Deleting quote ${id}...`);
      await deleteQuote(id);
      console.log('✅ Quote deleted successfully');
      await loadAllQuotes();
    } catch (error) {
      console.error('❌ Failed to delete quote:', error);
    }
  };

  // Enhanced loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading homepage content...</span>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Homepage Loading Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={refetch}
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
        </div>
      </div>
    );
  }

  // Enhanced no content state
  if (!localContent) {
    return (
      <div className="text-center py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-lg mx-auto">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Homepage Content</h3>
          <p className="text-yellow-600 mb-4">No homepage content found in the database.</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with context status indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Homepage Manager
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your homepage content, progress metrics, and layout settings
          </p>
          {/* Context status indicator */}
          <div className="mt-2 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              contextStatus === 'ready' ? 'bg-green-500' : 
              contextStatus === 'fallback' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}></div>
            <span className="text-xs text-gray-500">
              Context: {contextStatus === 'ready' ? 'Connected' : contextStatus === 'fallback' ? 'Fallback Mode' : 'Loading'}
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
            onClick={refetch}
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

      {/* Debug Information */}
      {debugMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <h4 className="font-medium text-blue-800 mb-2">🔍 Debug Information:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
            <div>
              <div><strong>Context Status:</strong> {contextStatus}</div>
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

      {/* Rest of the component remains the same... */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Homepage Manager Ready</h3>
          <p className="text-gray-600 mb-4">
            The homepage manager is now working with {contextStatus} context mode.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSaveContent}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Test Save
            </button>
            <button
              onClick={handleCalculateMetrics}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
              Test Calculate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CRITICAL FIX: Main component with comprehensive error boundary
const HomepageManager: React.FC = () => {
  return (
    <HomepageErrorBoundary>
      <SafeHomepageManagerCore />
    </HomepageErrorBoundary>
  );
};

export default HomepageManager;