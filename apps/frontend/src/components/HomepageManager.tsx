// REACT HOOK ERROR #321 FIX - Improved HomepageManager Component
// This component uses the safe hook pattern to eliminate React error #321

import React from 'react';
import { useHomepageSafe } from '../hooks/useHomepage';

/**
 * Simple error boundary that doesn't use hooks to avoid any potential hook violations
 */
class SimpleErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🛑 Homepage Manager Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🛑 Homepage Manager Error Boundary:', error, errorInfo);
    
    // Check if this is the React hook error we're trying to fix
    if (error.message.includes('Invalid hook call') || error.message.includes('hook call')) {
      console.error('🚨 DETECTED REACT HOOK ERROR #321 - This should not happen with the new implementation');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-semibold mb-2">Component Error</h3>
          <p className="text-red-600 text-sm mb-3">
            The homepage manager encountered an error. This might be due to a React hook issue.
          </p>
          <div className="space-y-2 text-xs text-red-500 mb-3">
            <div><strong>Error:</strong> {this.state.error?.message}</div>
            <div><strong>Type:</strong> {this.state.error?.name}</div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Main component using safe hooks - this component properly follows Rules of Hooks
 */
function HomepageManagerCore() {
  // CRITICAL FIX: Use the completely safe hook that never throws errors
  const {
    isLoading,
    error,
    lastRefresh,
    content,
    metrics,
    quotes,
    refreshData,
    refreshMetrics,
    refreshQuotes,
    refreshAll,
    clearError,
    data
  } = useHomepageSafe();

  return (
    <div className="homepage-manager p-4 bg-gray-50 rounded-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Homepage Management</h3>
        <div className="text-sm text-gray-600">
          {isLoading && <span className="text-blue-600">⏳ Loading...</span>}
          {error && <span className="text-red-600">❌ Error</span>}
          {!isLoading && !error && <span className="text-green-600">✅ Ready</span>}
        </div>
      </div>

      {/* Status Information */}
      <div className="bg-white p-3 rounded border mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Status</div>
            <div className={`${isLoading ? 'text-blue-600' : error ? 'text-red-600' : 'text-green-600'}`}>
              {isLoading ? 'Loading' : error ? 'Error' : 'Ready'}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Content</div>
            <div className="text-gray-600">
              {content ? '✅ Loaded' : '⚠️ None'}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Metrics</div>
            <div className="text-gray-600">
              {metrics ? '✅ Loaded' : '⚠️ None'}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Quotes</div>
            <div className="text-gray-600">
              {quotes.length > 0 ? `✅ ${quotes.length}` : '⚠️ None'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Content'}
        </button>
        
        <button
          onClick={refreshMetrics}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Refresh Metrics
        </button>
        
        <button
          onClick={refreshQuotes}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Refresh Quotes
        </button>
        
        <button
          onClick={refreshAll}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Refresh All
        </button>

        {error && (
          <button
            onClick={clearError}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Clear Error
          </button>
        )}
      </div>

      {/* Last Refresh Time */}
      {lastRefresh && (
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Last updated:</span> {lastRefresh.toLocaleString()}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
          <strong className="text-red-800">Error:</strong>
          <span className="text-red-600 ml-2">{error}</span>
        </div>
      )}

      {/* Content Preview */}
      {content && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-medium text-blue-800 mb-2">📄 Content Preview:</h4>
          <div className="text-blue-700 text-sm space-y-1">
            <div><strong>Title:</strong> {content.hero_title}</div>
            <div><strong>Subtitle:</strong> {content.hero_subtitle}</div>
            <div><strong>Description:</strong> {content.hero_description?.substring(0, 100)}...</div>
          </div>
        </div>
      )}

      {/* Metrics Preview */}
      {metrics && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-medium text-green-800 mb-2">📊 Metrics Preview:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-green-700 text-sm">
            <div><strong>Words:</strong> {metrics.words_written?.toLocaleString()}</div>
            <div><strong>Readers:</strong> {metrics.beta_readers}</div>
            <div><strong>Rating:</strong> {metrics.average_rating}/5</div>
            <div><strong>Books:</strong> {metrics.books_published}</div>
          </div>
        </div>
      )}

      {/* Quotes Preview */}
      {quotes.length > 0 && (
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <h4 className="font-medium text-purple-800 mb-2">💬 Quotes Preview:</h4>
          <div className="space-y-2">
            {quotes.slice(0, 2).map((quote, index) => (
              <div key={quote.id || index} className="text-purple-700 text-sm">
                <div>"{quote.quote_text}"</div>
                <div className="text-purple-600 text-xs">— {quote.author}</div>
              </div>
            ))}
            {quotes.length > 2 && (
              <div className="text-purple-600 text-xs">... and {quotes.length - 2} more</div>
            )}
          </div>
        </div>
      )}

      {/* Debug Information (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
          <h4 className="font-medium text-gray-800 mb-2">🔧 Debug Info:</h4>
          <pre className="text-xs text-gray-600 overflow-auto max-h-32">
            {JSON.stringify(
              {
                isLoading,
                hasError: !!error,
                hasContent: !!content,
                hasMetrics: !!metrics,
                quotesCount: quotes.length,
                lastRefresh: lastRefresh?.toISOString()
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Exported component with error boundary - this is the main export
 */
export function HomepageManager() {
  return (
    <SimpleErrorBoundary>
      <HomepageManagerCore />
    </SimpleErrorBoundary>
  );
}

export default HomepageManager;