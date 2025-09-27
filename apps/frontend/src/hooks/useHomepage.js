// REACT HOOK ERROR #321 FIX - Safe React integration hook
// This hook properly integrates with the non-hook manager to eliminate hook violations

import { useState, useEffect } from 'react';
import { homepageManager } from '../lib/HomepageManager';

/**
 * Safe hook that properly integrates with the non-hook manager
 * 
 * This hook follows the Rules of Hooks and only calls hooks at the top level
 * of the function component, eliminating React error #321.
 * 
 * @returns {Object} Homepage state and methods
 */
export function useHomepage() {
  // Initialize state with current data from the manager
  const [data, setData] = useState(() => {
    try {
      return homepageManager.getData();
    } catch (error) {
      console.error('❌ Error getting initial homepage data:', error);
      return {
        isLoading: false,
        lastRefresh: null,
        error: 'Failed to initialize homepage data',
        content: null,
        metrics: null,
        quotes: []
      };
    }
  });

  // Subscribe to manager updates
  useEffect(() => {
    console.log('📝 Setting up homepage data subscription');
    
    let cleanup;
    
    try {
      // Subscribe to data changes
      cleanup = homepageManager.subscribe((newData) => {
        console.log('🔄 Homepage data updated from manager:', {
          hasContent: !!newData.content,
          hasMetrics: !!newData.metrics,
          quotesCount: newData.quotes?.length || 0,
          isLoading: newData.isLoading,
          error: newData.error
        });
        
        // Update state with new data
        setData({ ...newData });
      });
      
      console.log('✅ Homepage subscription established');
    } catch (error) {
      console.error('❌ Error setting up homepage subscription:', error);
      
      // Set error state if subscription failed
      setData(prev => ({
        ...prev,
        error: 'Failed to establish homepage data connection'
      }));
    }

    // Cleanup function
    return () => {
      try {
        if (cleanup && typeof cleanup === 'function') {
          cleanup();
          console.log('🗑️ Homepage subscription cleaned up');
        }
      } catch (error) {
        console.error('❌ Error during homepage subscription cleanup:', error);
      }
    };
  }, []); // Empty dependency array - only run once

  // Provide safe methods that delegate to the manager
  const methods = {
    /**
     * Refresh all homepage data
     */
    refreshData: async () => {
      try {
        console.log('🔄 Refreshing homepage data via hook...');
        await homepageManager.refreshData();
      } catch (error) {
        console.error('❌ Error refreshing homepage data:', error);
      }
    },

    /**
     * Refresh metrics data
     */
    refreshMetrics: async () => {
      try {
        console.log('📊 Refreshing metrics via hook...');
        await homepageManager.refreshMetrics();
      } catch (error) {
        console.error('❌ Error refreshing metrics:', error);
      }
    },

    /**
     * Refresh quotes data
     */
    refreshQuotes: async () => {
      try {
        console.log('💬 Refreshing quotes via hook...');
        await homepageManager.refreshQuotes();
      } catch (error) {
        console.error('❌ Error refreshing quotes:', error);
      }
    },

    /**
     * Refresh all data
     */
    refreshAll: async () => {
      try {
        console.log('🔄 Refreshing all homepage data via hook...');
        await homepageManager.refreshAll();
      } catch (error) {
        console.error('❌ Error refreshing all homepage data:', error);
      }
    },

    /**
     * Clear current error
     */
    clearError: () => {
      try {
        homepageManager.clearError();
      } catch (error) {
        console.error('❌ Error clearing homepage error:', error);
      }
    },

    /**
     * Update data manually (for testing)
     */
    updateData: (newData) => {
      try {
        homepageManager.updateData(newData);
      } catch (error) {
        console.error('❌ Error updating homepage data:', error);
      }
    },

    /**
     * Reset to initial state
     */
    reset: () => {
      try {
        homepageManager.reset();
      } catch (error) {
        console.error('❌ Error resetting homepage data:', error);
      }
    }
  };

  // Return combined state and methods
  return {
    // Data properties
    isLoading: data.isLoading || false,
    error: data.error || null,
    lastRefresh: data.lastRefresh || null,
    content: data.content || null,
    metrics: data.metrics || null,
    quotes: data.quotes || [],
    
    // Raw data object (for debugging)
    data,
    
    // Methods
    ...methods
  };
}

/**
 * Safe hook with fallback values - never throws errors
 * 
 * This hook provides a completely safe alternative that returns
 * fallback values if anything goes wrong.
 * 
 * @returns {Object} Homepage state and methods with guaranteed fallback values
 */
export function useHomepageSafe() {
  try {
    return useHomepage();
  } catch (error) {
    console.error('❌ Error in useHomepage, returning fallback:', error);
    
    // Return safe fallback state and methods
    return {
      isLoading: false,
      error: 'Homepage service unavailable',
      lastRefresh: null,
      content: null,
      metrics: null,
      quotes: [],
      data: {
        isLoading: false,
        error: 'Homepage service unavailable',
        lastRefresh: null,
        content: null,
        metrics: null,
        quotes: []
      },
      
      // Fallback methods that do nothing but log
      refreshData: async () => {
        console.log('🔄 Fallback: refreshData called');
      },
      refreshMetrics: async () => {
        console.log('📊 Fallback: refreshMetrics called');
      },
      refreshQuotes: async () => {
        console.log('💬 Fallback: refreshQuotes called');
      },
      refreshAll: async () => {
        console.log('🔄 Fallback: refreshAll called');
      },
      clearError: () => {
        console.log('🧹 Fallback: clearError called');
      },
      updateData: (newData) => {
        console.log('📝 Fallback: updateData called with:', newData);
      },
      reset: () => {
        console.log('🔄 Fallback: reset called');
      }
    };
  }
}

export default useHomepage;