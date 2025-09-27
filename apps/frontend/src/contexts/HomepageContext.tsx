// REACT HOOK ERROR #321 FIX - Simplified Homepage Context
// This simplified context eliminates the complex hook usage that was causing React error #321

import React, { createContext, useContext, ReactNode } from 'react';
import { homepageManager } from '../lib/HomepageManager';

/**
 * Simplified context interface - only provides access to the manager
 * No hooks are called within the context itself, eliminating hook violations
 */
interface HomepageContextValue {
  // Direct access to the manager instance
  manager: typeof homepageManager;
  
  // Simple status indicator
  isReady: boolean;
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
  const value: HomepageContextValue = {
    manager: homepageManager,
    isReady: true
  };

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
 * Completely safe hook that never throws errors
 */
export const useHomepageContextSafe = (): HomepageContextValue => {
  try {
    const context = useContext(HomepageContext);
    
    if (!context) {
      console.warn('⚠️ HomepageContext not available, providing fallback');
      
      // Return a safe fallback that provides the manager
      return {
        manager: homepageManager,
        isReady: false
      };
    }
    
    return context;
  } catch (error) {
    console.error('❌ Error in useHomepageContextSafe:', error);
    console.warn('⚠️ Providing fallback context due to error');
    
    // Return fallback context
    return {
      manager: homepageManager,
      isReady: false
    };
  }
};

/**
 * DEPRECATED - Legacy compatibility functions for gradual migration
 * These functions delegate to the new manager but maintain the old API
 */
export const useHomepageContextOptional = (): HomepageContextValue | null => {
  try {
    return useHomepageContextSafe();
  } catch (error) {
    console.error('❌ Error in useHomepageContextOptional:', error);
    return null;
  }
};

// For debugging
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.HomepageContext = HomepageContext;
  console.log('🔧 HomepageContext available globally in development mode');
}

export default HomepageContext;