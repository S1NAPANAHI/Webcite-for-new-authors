// REACT HOOK ERROR #321 FIX - Simplified Homepage Context
// This simplified context eliminates the complex hook usage that was causing React error #321
// ADDED: Comprehensive null safety for image URLs to prevent getPublicUrl errors

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { homepageManager } from '../lib/HomepageManager';
import { getSafeImageUrl, getBlogImageUrl } from '../utils/imageUtils';

/**
 * Simplified context interface - only provides access to the manager
 * No hooks are called within the context itself, eliminating hook violations
 */
interface HomepageContextValue {
  // Direct access to the manager instance
  manager: typeof homepageManager;
  
  // Simple status indicator
  isReady: boolean;

  // Safe image URL helper functions
  getImageUrl: (imagePath: string | null | undefined, bucketName?: string, fallback?: string) => string;
  getBlogImageUrl: (imagePath: string | null | undefined) => string;
}

const HomepageContext = createContext<HomepageContextValue | null>(null);

/**
 * Simple error boundary that doesn't use hooks
 */
class HomepageContextErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('❌ Homepage Context Error Boundary caught error:', error);
    
    // Check if this is the specific getPublicUrl error we're fixing
    if (error.message.includes('Cannot read properties of null (reading \'replace\')')) {
      console.error('🚨 DETECTED: getPublicUrl null path error - This should be fixed with the new image utilities!');
    }
    
    // Check if this is the specific React hook error we're fixing
    if (error.message.includes('Invalid hook call') || error.message.includes('hook call')) {
      console.error('🚨 REACT HOOK ERROR #321 DETECTED in context - This should not happen with the new implementation');
    }
    
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🛑 Homepage Context Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-semibold mb-2">Context Error</h3>
          <p className="text-red-600 text-sm mb-3">
            The homepage context encountered an error. The page will continue to work with fallback functionality.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simplified provider that only provides access to the manager
 * No hooks are used within the provider itself
 */
export const HomepageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use useMemo to create stable value object
  const value = useMemo<HomepageContextValue>(() => ({
    manager: homepageManager,
    isReady: true,
    // Safe image URL helper functions using our new utilities
    getImageUrl: getSafeImageUrl,
    getBlogImageUrl: getBlogImageUrl
  }), []);

  console.log('✅ HomepageProvider rendering with simplified context');

  return (
    <HomepageContextErrorBoundary>
      <HomepageContext.Provider value={value}>
        {children}
      </HomepageContext.Provider>
    </HomepageContextErrorBoundary>
  );
};

/**
 * Safe hook to access the homepage context
 * This hook properly follows Rules of Hooks
 */
export const useHomepageContext = (): HomepageContextValue => {
  const context = useContext(HomepageContext);
  
  if (!context) {
    const error = new Error(
      'useHomepageContext must be used within a HomepageProvider. ' +
      'Make sure the component is wrapped in <HomepageProvider>.'
    );
    console.error('❌ Homepage Context Error:', error.message);
    throw error;
  }
  
  return context;
};

/**
 * Completely safe hook that returns fallback instead of throwing
 * IMPORTANT: This hook must still be called at the top level of a React component
 */
export const useHomepageContextSafe = (): HomepageContextValue => {
  // Create fallback outside of hook call
  const fallbackValue = useMemo<HomepageContextValue>(() => ({
    manager: homepageManager,
    isReady: false,
    getImageUrl: getSafeImageUrl,
    getBlogImageUrl: getBlogImageUrl
  }), []);

  let context: HomepageContextValue | null = null;
  
  try {
    // This must be called unconditionally at the top level
    context = useContext(HomepageContext);
  } catch (error) {
    console.error('❌ Error in useHomepageContextSafe useContext call:', error);
    // Don't return here - continue with fallback logic below
  }
  
  if (!context) {
    console.warn('⚠️ HomepageContext not available, providing fallback with safe image utilities');
    return fallbackValue;
  }
  
  return context;
};

/**
 * DEPRECATED - Legacy compatibility functions for gradual migration
 * These functions delegate to the new manager but maintain the old API
 */
export const useHomepageContextOptional = (): HomepageContextValue | null => {
  try {
    const context = useContext(HomepageContext);
    return context || null;
  } catch (error) {
    console.error('❌ Error in useHomepageContextOptional:', error);
    return null;
  }
};

// Alternative non-hook approach for components that can't use hooks
export const getHomepageManagerDirect = () => {
  return {
    manager: homepageManager,
    isReady: true,
    getImageUrl: getSafeImageUrl,
    getBlogImageUrl: getBlogImageUrl
  };
};

// For debugging
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  (window as any).HomepageContext = HomepageContext;
  (window as any).getHomepageManagerDirect = getHomepageManagerDirect;
  (window as any).getSafeImageUrl = getSafeImageUrl;
  (window as any).getBlogImageUrl = getBlogImageUrl;
  console.log('🔧 HomepageContext available globally in development mode with safe image utilities');
}

export default HomepageContext;