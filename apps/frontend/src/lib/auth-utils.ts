/**
 * Authentication utility functions for handling storage and token issues
 */

/**
 * Clear all authentication-related storage to fix refresh token issues
 * Call this when experiencing "Invalid Refresh Token" errors
 */
export function clearAuthStorage(): void {
  console.log('🧹 Clearing authentication storage...');
  
  // Clear all auth-related localStorage keys
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.includes('supabase') || 
      key.includes('auth') || 
      key.includes('zoroaster') ||
      key.includes('sb-') // Supabase default prefix
    )) {
      keysToRemove.push(key);
    }
  }
  
  console.log('🗝\ufe0f Keys to remove:', keysToRemove);
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Removed: ${key}`);
  });
  
  // Also clear session storage
  sessionStorage.clear();
  console.log('✅ Session storage cleared');
  
  console.log('✨ Auth storage cleanup complete');
}

/**
 * Check if there are conflicting auth tokens in storage
 */
export function diagnoseAuthStorage(): void {
  console.log('🔍 Diagnosing authentication storage...');
  
  const authKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.includes('supabase') || 
      key.includes('auth') || 
      key.includes('zoroaster') ||
      key.includes('sb-')
    )) {
      authKeys.push(key);
    }
  }
  
  console.log('Found auth-related keys:', authKeys);
  
  authKeys.forEach(key => {
    const value = localStorage.getItem(key);
    try {
      const parsed = JSON.parse(value || '{}');
      console.log(`${key}:`, parsed);
    } catch {
      console.log(`${key}: ${value}`);
    }
  });
}

/**
 * Reset authentication state completely
 * Use this as a last resort when all else fails
 */
export function resetAuthState(): void {
  console.log('🔄 Resetting authentication state...');
  
  clearAuthStorage();
  
  // Clear any cached user data
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        if (cacheName.includes('auth') || cacheName.includes('user')) {
          caches.delete(cacheName);
          console.log(`✅ Cleared cache: ${cacheName}`);
        }
      });
    });
  }
  
  console.log('✨ Auth state reset complete. Please refresh the page.');
}

/**
 * Call this in development to debug auth issues
 */
export function debugAuthState(): void {
  console.group('🔍 Authentication Debug Info');
  
  console.log('Current URL:', window.location.href);
  console.log('User Agent:', navigator.userAgent);
  
  diagnoseAuthStorage();
  
  // Check if Supabase client is available
  if ((window as any).supabase) {
    console.log('✅ Supabase client available on window');
    const client = (window as any).supabase;
    client.auth.getSession().then((session: any) => {
      console.log('Current session:', session);
    }).catch((error: any) => {
      console.error('Session error:', error);
    });
  } else {
    console.log('❌ Supabase client not found on window');
  }
  
  console.groupEnd();
}

// Export a convenience function to call from browser console
if (typeof window !== 'undefined') {
  (window as any).clearAuthStorage = clearAuthStorage;
  (window as any).debugAuthState = debugAuthState;
  (window as any).resetAuthState = resetAuthState;
  console.log('🤖 Auth utilities attached to window: clearAuthStorage(), debugAuthState(), resetAuthState()');
}