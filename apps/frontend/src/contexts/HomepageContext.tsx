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

  // Register callbacks for data refresh
  const registerDataRefresh = useCallback((callback: () => void) => {
    dataRefreshCallbacks.current.add(callback);
    console.log('📝 Registered homepage data refresh callback');
    
    // Return cleanup function
    return () => {
      dataRefreshCallbacks.current.delete(callback);
      console.log('🗑️ Unregistered homepage data refresh callback');
    };
  }, []);

  const registerMetricsRefresh = useCallback((callback: () => void) => {
    metricsRefreshCallbacks.current.add(callback);
    console.log('📊 Registered metrics refresh callback');
    
    return () => {
      metricsRefreshCallbacks.current.delete(callback);
      console.log('🗑️ Unregistered metrics refresh callback');
    };
  }, []);

  const registerQuotesRefresh = useCallback((callback: () => void) => {
    quotesRefreshCallbacks.current.add(callback);
    console.log('💬 Registered quotes refresh callback');
    
    return () => {
      quotesRefreshCallbacks.current.delete(callback);
      console.log('🗑️ Unregistered quotes refresh callback');
    };
  }, []);

  // Cache invalidation functions
  const invalidateHomepageData = useCallback(() => {
    console.log('🔄 Invalidating homepage data cache...');
    dataRefreshCallbacks.current.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('❌ Error in data refresh callback:', error);
      }
    });
  }, []);

  const invalidateMetrics = useCallback(() => {
    console.log('📊 Invalidating metrics cache...');
    metricsRefreshCallbacks.current.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('❌ Error in metrics refresh callback:', error);
      }
    });
  }, []);

  const invalidateQuotes = useCallback(() => {
    console.log('💬 Invalidating quotes cache...');
    quotesRefreshCallbacks.current.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('❌ Error in quotes refresh callback:', error);
      }
    });
  }, []);

  const invalidateAll = useCallback(() => {
    console.log('🔄 Invalidating ALL homepage caches...');
    invalidateHomepageData();
    invalidateMetrics();
    invalidateQuotes();
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

// Optional hook that gracefully handles missing context
export const useHomepageContextOptional = (): HomepageContextValue | null => {
  return useContext(HomepageContext);
};

export default HomepageContext;