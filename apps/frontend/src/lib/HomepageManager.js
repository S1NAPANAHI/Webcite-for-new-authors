// REACT HOOK ERROR #321 FIX - Non-hook-based homepage manager to avoid React error #321
// This class-based approach separates business logic from React hooks to prevent hook violations

/**
 * Non-hook-based homepage manager to avoid React error #321
 * 
 * This class provides homepage management functionality without using React hooks,
 * eliminating the "Invalid hook call" errors that occur when hooks are called
 * outside the body of a function component.
 */
class HomepageManager {
  constructor() {
    this.listeners = new Set();
    this.data = {
      isLoading: false,
      lastRefresh: null,
      error: null,
      content: null,
      metrics: null,
      quotes: []
    };
    
    console.log('🏠 HomepageManager initialized (non-hook version)');
  }

  /**
   * Subscribe to homepage data changes
   * @param {Function} callback - Callback function to call when data changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    if (typeof callback !== 'function') {
      console.error('❌ HomepageManager.subscribe: callback must be a function');
      return () => {};
    }

    this.listeners.add(callback);
    console.log('📝 Subscribed to homepage changes, total listeners:', this.listeners.size);
    
    // Return unsubscribe function
    return () => {
      const wasDeleted = this.listeners.delete(callback);
      if (wasDeleted) {
        console.log('🗑️ Unsubscribed from homepage changes, remaining listeners:', this.listeners.size);
      }
    };
  }

  /**
   * Notify all listeners of data changes
   */
  notify() {
    console.log('📢 Notifying', this.listeners.size, 'listeners of homepage changes');
    
    this.listeners.forEach(callback => {
      try {
        // Use requestAnimationFrame for better performance and to avoid timing issues
        requestAnimationFrame(() => {
          try {
            callback({ ...this.data }); // Pass a copy to prevent mutations
          } catch (error) {
            console.error('❌ Error in homepage listener callback:', error);
          }
        });
      } catch (error) {
        console.error('❌ Error preparing homepage listener callback:', error);
      }
    });
  }

  /**
   * Refresh homepage data
   * @returns {Promise<void>}
   */
  async refreshData() {
    console.log('🔄 Homepage refresh started');
    
    this.data.isLoading = true;
    this.data.error = null;
    this.notify();

    try {
      // Simulate API call - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update data
      this.data.lastRefresh = new Date();
      this.data.content = {
        hero_title: 'Welcome to Zoroaster',
        hero_subtitle: 'Your Literary Journey Begins Here',
        hero_description: 'Discover amazing stories and connect with fellow readers',
        updated_at: new Date().toISOString()
      };
      
      console.log('✅ Homepage refresh completed');
    } catch (error) {
      this.data.error = error.message || 'Failed to refresh homepage data';
      console.error('❌ Homepage refresh failed:', error);
    } finally {
      this.data.isLoading = false;
      this.notify();
    }
  }

  /**
   * Refresh metrics data
   * @returns {Promise<void>}
   */
  async refreshMetrics() {
    console.log('📊 Metrics refresh started');
    
    this.data.isLoading = true;
    this.data.error = null;
    this.notify();

    try {
      // Simulate metrics API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.data.metrics = {
        words_written: Math.floor(Math.random() * 100000) + 50000,
        beta_readers: Math.floor(Math.random() * 50) + 10,
        average_rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
        books_published: Math.floor(Math.random() * 10) + 1,
        updated_at: new Date().toISOString()
      };
      
      console.log('✅ Metrics refresh completed:', this.data.metrics);
    } catch (error) {
      this.data.error = error.message || 'Failed to refresh metrics';
      console.error('❌ Metrics refresh failed:', error);
    } finally {
      this.data.isLoading = false;
      this.notify();
    }
  }

  /**
   * Refresh quotes data
   * @returns {Promise<void>}
   */
  async refreshQuotes() {
    console.log('💬 Quotes refresh started');
    
    this.data.isLoading = true;
    this.data.error = null;
    this.notify();

    try {
      // Simulate quotes API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      this.data.quotes = [
        {
          id: 1,
          quote_text: 'The light of wisdom shines brightest in the darkness of ignorance.',
          author: 'Zoroastrian Wisdom',
          display_order: 1
        },
        {
          id: 2,
          quote_text: 'Good thoughts, good words, good deeds - the foundation of a noble life.',
          author: 'Ancient Teaching',
          display_order: 2
        }
      ];
      
      console.log('✅ Quotes refresh completed:', this.data.quotes.length, 'quotes');
    } catch (error) {
      this.data.error = error.message || 'Failed to refresh quotes';
      console.error('❌ Quotes refresh failed:', error);
    } finally {
      this.data.isLoading = false;
      this.notify();
    }
  }

  /**
   * Refresh all data
   * @returns {Promise<void>}
   */
  async refreshAll() {
    console.log('🔄 Refreshing ALL homepage data...');
    
    try {
      await Promise.all([
        this.refreshData(),
        this.refreshMetrics(), 
        this.refreshQuotes()
      ]);
      console.log('✅ All homepage data refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing all homepage data:', error);
      this.data.error = 'Failed to refresh some homepage data';
      this.notify();
    }
  }

  /**
   * Get current data snapshot
   * @returns {Object} Current data state
   */
  getData() {
    return { ...this.data }; // Return a copy to prevent mutations
  }

  /**
   * Update data manually (for testing or external updates)
   * @param {Object} newData - New data to merge
   */
  updateData(newData) {
    if (typeof newData === 'object' && newData !== null) {
      this.data = { ...this.data, ...newData };
      this.notify();
      console.log('📝 Homepage data updated manually:', newData);
    } else {
      console.error('❌ Invalid data provided to updateData:', newData);
    }
  }

  /**
   * Clear all data and reset to initial state
   */
  reset() {
    this.data = {
      isLoading: false,
      lastRefresh: null,
      error: null,
      content: null,
      metrics: null,
      quotes: []
    };
    this.notify();
    console.log('🔄 Homepage manager reset to initial state');
  }

  /**
   * Get current loading state
   * @returns {boolean}
   */
  isLoading() {
    return this.data.isLoading;
  }

  /**
   * Get current error state
   * @returns {string|null}
   */
  getError() {
    return this.data.error;
  }

  /**
   * Clear current error
   */
  clearError() {
    if (this.data.error) {
      this.data.error = null;
      this.notify();
      console.log('🧹 Cleared homepage error');
    }
  }

  /**
   * Destroy the manager and clean up all listeners
   */
  destroy() {
    console.log('🗑️ Destroying homepage manager...');
    this.listeners.clear();
    this.data = null;
    console.log('✅ Homepage manager destroyed');
  }
}

// Create and export singleton instance
export const homepageManager = new HomepageManager();

// For debugging purposes - make it available globally in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.homepageManager = homepageManager;
  console.log('🔧 HomepageManager available globally as window.homepageManager in development mode');
}

export default HomepageManager;