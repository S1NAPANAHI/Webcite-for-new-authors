import React, { createContext, useContext, useCallback, useRef } from 'react';

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
}

const HomepageContext = createContext<HomepageContextValue | null>(null);

export const HomepageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use refs to store callbacks to avoid stale closures
  const dataRefreshCallbacks = useRef<Set<() => void>>(new Set());
  const metricsRefreshCallbacks = useRef<Set<() => void>>(new Set());
  const quotesRefreshCallbacks = useRef<Set<() => void>>(new Set());

  // CRITICAL FIX: Enhanced callback execution with error boundaries
  const executeCallbacks = useCallback((callbacks: Set<() => void>, type: string) => {
    console.log(`🔄 Executing ${callbacks.size} ${type} callbacks...`);
    
    callbacks.forEach(callback => {
      try {
        // CRITICAL FIX: Use setTimeout to defer callback execution and avoid hook timing issues
        setTimeout(() => {
          try {
            callback();
          } catch (error) {
            console.error(`❌ Error in deferred ${type} callback:`, error);
          }
        }, 0);
      } catch (error) {
        console.error(`❌ Error preparing ${type} callback:`, error);
      }
    });
  }, []);

  // Register callbacks for data refresh
  const registerDataRefresh = useCallback((callback: () => void) => {
    dataRefreshCallbacks.current.add(callback);
    console.log('📝 Registered homepage data refresh callback');
    
    // Return cleanup function with enhanced error handling
    return () => {
      try {
        dataRefreshCallbacks.current.delete(callback);
        console.log('🗑️ Unregistered homepage data refresh callback');
      } catch (error) {
        console.error('❌ Error unregistering data refresh callback:', error);
      }
    };
  }, []);

  const registerMetricsRefresh = useCallback((callback: () => void) => {
    metricsRefreshCallbacks.current.add(callback);
    console.log('📊 Registered metrics refresh callback');
    
    return () => {
      try {
        metricsRefreshCallbacks.current.delete(callback);
        console.log('🗑️ Unregistered metrics refresh callback');
      } catch (error) {
        console.error('❌ Error unregistering metrics refresh callback:', error);
      }
    };
  }, []);

  const registerQuotesRefresh = useCallback((callback: () => void) => {
    quotesRefreshCallbacks.current.add(callback);
    console.log('💬 Registered quotes refresh callback');
    
    return () => {
      try {
        quotesRefreshCallbacks.current.delete(callback);
        console.log('🗑️ Unregistered quotes refresh callback');
      } catch (error) {
        console.error('❌ Error unregistering quotes refresh callback:', error);
      }
    };
  }, []);

  // CRITICAL FIX: Enhanced cache invalidation functions with better error handling
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
    registerQuotesRefresh
  };

  return (
    <HomepageContext.Provider value={value}>
      {children}
    </HomepageContext.Provider>
  );
};

// Hook to use the homepage context
export const useHomepageContext = (): HomepageContextValue => {
  const context = useContext(HomepageContext);
  if (!context) {
    throw new Error('useHomepageContext must be used within a HomepageProvider');
  }
  return context;
};

// CRITICAL FIX: Enhanced optional hook with better error handling
export const useHomepageContextOptional = (): HomepageContextValue | null => {
  try {
    return useContext(HomepageContext);
  } catch (error) {
    console.error('❌ Error accessing homepage context:', error);
    return null;
  }
};

export default HomepageContext;