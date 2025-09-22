// Simple cache busting utility for homepage updates
// This ensures that when admin makes changes, the homepage refreshes to show them

// Cache busting timestamp
let lastHomepageUpdate = Date.now();

// Event listeners for cross-tab communication
const STORAGE_KEY = 'homepage_last_update';
const UPDATE_EVENT = 'homepage_updated';

// Function to trigger homepage cache invalidation
export const triggerHomepageUpdate = () => {
  const timestamp = Date.now();
  lastHomepageUpdate = timestamp;
  
  // Store in localStorage for cross-tab communication
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, timestamp.toString());
      
      // Dispatch custom event for same-tab communication
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT, {
        detail: { timestamp }
      }));
      
      console.log('🔄 Homepage update triggered:', timestamp);
    } catch (error) {
      console.warn('Failed to set homepage update timestamp:', error);
    }
  }
};

// Function to check if homepage needs to be refreshed
export const shouldRefreshHomepage = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const storedTimestamp = localStorage.getItem(STORAGE_KEY);
    if (!storedTimestamp) return false;
    
    const stored = parseInt(storedTimestamp, 10);
    return stored > lastHomepageUpdate;
  } catch (error) {
    console.warn('Failed to check homepage refresh status:', error);
    return false;
  }
};

// Function to mark homepage as refreshed
export const markHomepageRefreshed = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const storedTimestamp = localStorage.getItem(STORAGE_KEY);
    if (storedTimestamp) {
      lastHomepageUpdate = parseInt(storedTimestamp, 10);
      console.log('🔄 Homepage marked as refreshed:', lastHomepageUpdate);
    }
  } catch (error) {
    console.warn('Failed to mark homepage as refreshed:', error);
  }
};

// Hook for listening to homepage updates
export const useHomepageUpdateListener = (callback: () => void) => {
  if (typeof window === 'undefined') return;
  
  // Listen for storage changes (cross-tab)
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      console.log('🔄 Homepage update detected via storage:', event.newValue);
      callback();
    }
  };
  
  // Listen for custom events (same-tab)
  const handleUpdateEvent = (event: CustomEvent) => {
    console.log('🔄 Homepage update detected via event:', event.detail);
    callback();
  };
  
  // Add event listeners
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener(UPDATE_EVENT, handleUpdateEvent as EventListener);
  
  // Check on mount if refresh is needed
  if (shouldRefreshHomepage()) {
    console.log('🔄 Homepage refresh needed on mount');
    setTimeout(callback, 100); // Small delay to ensure component is mounted
    markHomepageRefreshed();
  }
  
  // Cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener(UPDATE_EVENT, handleUpdateEvent as EventListener);
  };
};

// Add cache busting to fetch requests
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
};

// Clear all homepage related cache
export const clearHomepageCache = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear localStorage cache
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('homepage') || key.includes('Homepage')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage cache
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.includes('homepage') || key.includes('Homepage')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('🧹 Homepage cache cleared');
  } catch (error) {
    console.warn('Failed to clear homepage cache:', error);
  }
};

export default {
  triggerHomepageUpdate,
  shouldRefreshHomepage,
  markHomepageRefreshed,
  useHomepageUpdateListener,
  addCacheBuster,
  clearHomepageCache
};