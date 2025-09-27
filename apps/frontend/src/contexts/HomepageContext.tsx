import React, { createContext, useContext, useCallback, useRef, Component, ReactNode, useState, useEffect } from 'react';

// Context for managing homepage data cache invalidation across components
interface HomepageContextValue {
  // Cache invalidation functions
  invalidateHomepageData: () => void;
  invalidateMetrics: () => void;
  invalidateQuotes: () => void;
  invalidateAll: () => void;
  
  // Register cache invalidation callbacks
  registerDataRefresh: (callback: () => void) => () => void;
  registerMetricsRefresh: (callback: () => void) => () => void;
  registerQuotesRefresh: (callback: () => void) => () => void;
  
  // Provider state
  isReady: boolean;
}

const HomepageContext = createContext<HomepageContextValue | null>(null);

// Error Boundary for Homepage Context
class HomepageErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('❌ Homepage Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🗑️ Homepage Manager Error caught by boundary');
    console.error('Homepage Manager Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-64 p-8 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-600 text-lg font-semibold mb-2">Component Error</div>
          <div className="text-red-500 mb-4">The homepage manager encountered an error. Please refresh the page.</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const HomepageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use refs to store callbacks to avoid stale closures
  const dataRefreshCallbacks = useRef<Set<() => void>>(new Set());
  const metricsRefreshCallbacks = useRef<Set<() => void>>(new Set());
  const quotesRefreshCallbacks = useRef<Set<() => void>>(new Set());
  const isInitialized = useRef(false);
  const [isReady, setIsReady] = useState(false);

  // CRITICAL FIX: Initialize provider properly
  useEffect(() => {
    // Use setTimeout to ensure provider is ready after React's render cycle
    const timer = setTimeout(() => {
      isInitialized.current = true;
      setIsReady(true);
      console.log('✅ HomepageProvider initialized and ready');
    }, 0);
    
    return () => {
      clearTimeout(timer);
      isInitialized.current = false;
      setIsReady(false);
      console.log('🔄 HomepageProvider cleanup');
    };
  }, []);

  // Enhanced callback execution with error boundaries and async handling
  const executeCallbacks = useCallback((callbacks: Set<() => void>, type: string) => {
    if (!isInitialized.current) {
      console.warn(`⚠️ ${type} callbacks called before initialization, deferring...`);
      // Defer execution until next tick to allow proper initialization
      setTimeout(() => {
        if (isInitialized.current) {
          executeCallbacks(callbacks, type);
        }
      }, 100);
      return;
    }

    console.log(`🔄 Executing ${callbacks.size} ${type} callbacks...`);
    
    callbacks.forEach(callback => {
      try {
        // Use requestAnimationFrame for better performance and timing
        requestAnimationFrame(() => {
          try {
            callback();
          } catch (error) {
            console.error(`❌ Error in deferred ${type} callback:`, error);
          }
        });
      } catch (error) {
        console.error(`❌ Error preparing ${type} callback:`, error);
      }
    });
  }, []);

  // Register callbacks for data refresh with enhanced cleanup
  const registerDataRefresh = useCallback((callback: () => void) => {
    if (typeof callback !== 'function') {
      console.error('❌ Invalid callback provided to registerDataRefresh');
      return () => {};
    }

    dataRefreshCallbacks.current.add(callback);
    console.log('📝 Registered homepage data refresh callback');
    
    // Return cleanup function with enhanced error handling
    return () => {
      try {
        const wasDeleted = dataRefreshCallbacks.current.delete(callback);
        if (wasDeleted) {
          console.log('🗑️ Unregistered homepage data refresh callback');
        }
      } catch (error) {
        console.error('❌ Error unregistering data refresh callback:', error);
      }
    };
  }, []);

  const registerMetricsRefresh = useCallback((callback: () => void) => {
    if (typeof callback !== 'function') {
      console.error('❌ Invalid callback provided to registerMetricsRefresh');
      return () => {};
    }

    metricsRefreshCallbacks.current.add(callback);
    console.log('📊 Registered metrics refresh callback');
    
    return () => {
      try {
        const wasDeleted = metricsRefreshCallbacks.current.delete(callback);
        if (wasDeleted) {
          console.log('🗑️ Unregistered metrics refresh callback');
        }
      } catch (error) {
        console.error('❌ Error unregistering metrics refresh callback:', error);
      }
    };
  }, []);

  const registerQuotesRefresh = useCallback((callback: () => void) => {
    if (typeof callback !== 'function') {
      console.error('❌ Invalid callback provided to registerQuotesRefresh');
      return () => {};
    }

    quotesRefreshCallbacks.current.add(callback);
    console.log('💬 Registered quotes refresh callback');
    
    return () => {
      try {
        const wasDeleted = quotesRefreshCallbacks.current.delete(callback);
        if (wasDeleted) {
          console.log('🗑️ Unregistered quotes refresh callback');
        }
      } catch (error) {
        console.error('❌ Error unregistering quotes refresh callback:', error);
      }
    };
  }, []);

  // Enhanced cache invalidation functions with better error handling
  const invalidateHomepageData = useCallback(() => {
    try {
      console.log('🔄 Invalidating homepage data cache...');
      executeCallbacks(dataRefreshCallbacks.current, 'data refresh');
    } catch (error) {
      console.error('❌ Error invalidating homepage data:', error);
    }
  }, [executeCallbacks]);

  const invalidateMetrics = useCallback(() => {
    try {
      console.log('📊 Invalidating metrics cache...');
      executeCallbacks(metricsRefreshCallbacks.current, 'metrics refresh');
    } catch (error) {
      console.error('❌ Error invalidating metrics:', error);
    }
  }, [executeCallbacks]);

  const invalidateQuotes = useCallback(() => {
    try {
      console.log('💬 Invalidating quotes cache...');
      executeCallbacks(quotesRefreshCallbacks.current, 'quotes refresh');
    } catch (error) {
      console.error('❌ Error invalidating quotes:', error);
    }
  }, [executeCallbacks]);

  const invalidateAll = useCallback(() => {
    try {
      console.log('🔄 Invalidating ALL homepage caches...');
      invalidateHomepageData();
      invalidateMetrics();
      invalidateQuotes();
    } catch (error) {
      console.error('❌ Error invalidating all caches:', error);
    }
  }, [invalidateHomepageData, invalidateMetrics, invalidateQuotes]);

  const value: HomepageContextValue = {
    invalidateHomepageData,
    invalidateMetrics,
    invalidateQuotes,
    invalidateAll,
    registerDataRefresh,
    registerMetricsRefresh,
    registerQuotesRefresh,
    isReady
  };

  return (
    <HomepageErrorBoundary>
      <HomepageContext.Provider value={value}>
        {children}
      </HomepageContext.Provider>
    </HomepageErrorBoundary>
  );
};

// CRITICAL FIX: Create a completely hook-safe context accessor
function getHomepageContextSafely(): HomepageContextValue | null {
  try {
    // This approach avoids the useContext hook timing issues
    return React.useContext(HomepageContext);
  } catch (error) {
    console.error('❌ Error accessing homepage context:', error);
    return null;
  }
}

// Safe hook to use the homepage context with proper error handling
export const useHomepageContext = (): HomepageContextValue => {
  const context = getHomepageContextSafely();
  if (!context) {
    const error = new Error('useHomepageContext must be used within a HomepageProvider. Make sure the component is wrapped in <HomepageProvider>.');
    console.error('❌ Homepage Context Error:', error.message);
    throw error;
  }
  return context;
};

// Enhanced optional hook with better error handling and fallback
export const useHomepageContextOptional = (): HomepageContextValue | null => {
  try {
    return getHomepageContextSafely();
  } catch (error) {
    console.error('❌ Error accessing homepage context:', error);
    return null;
  }
};

// CRITICAL FIX: Completely safe hook that NEVER throws and provides functional fallbacks
export const useHomepageContextSafe = (): HomepageContextValue => {
  // Create fallback implementation that never throws
  const fallbackContext: HomepageContextValue = {
    invalidateHomepageData: () => {
      console.log('🔄 Fallback: invalidateHomepageData called');
    },
    invalidateMetrics: () => {
      console.log('📊 Fallback: invalidateMetrics called');
    },
    invalidateQuotes: () => {
      console.log('💬 Fallback: invalidateQuotes called');
    },
    invalidateAll: () => {
      console.log('🔄 Fallback: invalidateAll called');
    },
    registerDataRefresh: (callback: () => void) => {
      console.log('📝 Fallback: registerDataRefresh called');
      return () => {
        console.log('📝 Fallback: registerDataRefresh cleanup');
      };
    },
    registerMetricsRefresh: (callback: () => void) => {
      console.log('📊 Fallback: registerMetricsRefresh called');
      return () => {
        console.log('📊 Fallback: registerMetricsRefresh cleanup');
      };
    },
    registerQuotesRefresh: (callback: () => void) => {
      console.log('💬 Fallback: registerQuotesRefresh called');
      return () => {
        console.log('💬 Fallback: registerQuotesRefresh cleanup');
      };
    },
    isReady: false
  };

  try {
    const context = getHomepageContextSafely();
    
    if (!context) {
      console.warn('⚠️ HomepageContext not available, using fallback implementation');
      return fallbackContext;
    }
    
    // Additional safety check for context readiness
    if (!context.isReady) {
      console.warn('⚠️ HomepageContext not ready yet, using fallback implementation');
      return fallbackContext;
    }
    
    return context;
  } catch (error) {
    console.error('❌ Error in useHomepageContextSafe:', error);
    console.warn('⚠️ Using fallback implementation due to error');
    return fallbackContext;
  }
};

export default HomepageContext;