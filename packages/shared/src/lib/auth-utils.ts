/**
 * Authentication Utilities for Debugging and Recovery
 * 
 * These utilities help debug authentication issues and provide
 * emergency recovery functions for broken auth states.
 */

import { supabase } from '../supabaseClient';

/**
 * Debug current authentication state
 * Call this in browser console: debugAuthState()
 */
export const debugAuthState = async () => {
  console.group('🔍 Authentication Debug Info');
  
  try {
    // Check Supabase client
    console.log('Supabase client:', {
      exists: !!supabase,
      hasAuth: !!supabase?.auth,
    });
    
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Current session:', {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      error: sessionError?.message,
    });
    
    // Check browser storage
    if (typeof window !== 'undefined') {
      const authKeys = Object.keys(localStorage).filter(key => 
        key.includes('auth') || key.includes('supabase') || key.includes('zoroaster')
      );
      console.log('Auth-related localStorage keys:', authKeys);
      
      authKeys.forEach(key => {
        const value = localStorage.getItem(key);
        try {
          const parsed = JSON.parse(value || '{}');
          console.log(`${key}:`, parsed);
        } catch {
          console.log(`${key}:`, value);
        }
      });
    }
    
    // Check global window objects
    if (typeof window !== 'undefined') {
      console.log('Window Supabase instances:', {
        hasZoroasterClient: !!(window as any).__ZOROASTER_SUPABASE_CLIENT__,
        hasGenericSupabase: !!(window as any).supabase,
        hasSupabaseClientInstance: !!(window as any).__SUPABASE_CLIENT_INSTANCE__,
      });
    }
    
  } catch (error) {
    console.error('Error in auth debug:', error);
  }
  
  console.groupEnd();
};

/**
 * Clear all authentication-related browser storage
 * Call this in browser console: clearAuthStorage()
 */
export const clearAuthStorage = () => {
  if (typeof window === 'undefined') {
    console.log('🚫 clearAuthStorage: Not in browser environment');
    return;
  }
  
  console.log('🧹 Clearing all auth-related storage...');
  
  // Clear specific auth keys
  const authKeys = [
    'zoroaster-auth-session',
    'zoroaster-auth',
    'supabase.auth.token',
    'sb-auth-token',
  ];
  
  authKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Removed ${key}`);
    }
  });
  
  // Clear any remaining auth-related keys
  const allKeys = Object.keys(localStorage);
  const remainingAuthKeys = allKeys.filter(key => 
    key.includes('auth') || key.includes('supabase') || key.includes('zoroaster')
  );
  
  remainingAuthKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Removed additional key: ${key}`);
  });
  
  // Clear session storage as well
  const sessionKeys = Object.keys(sessionStorage);
  const authSessionKeys = sessionKeys.filter(key => 
    key.includes('auth') || key.includes('supabase') || key.includes('zoroaster')
  );
  
  authSessionKeys.forEach(key => {
    sessionStorage.removeItem(key);
    console.log(`✅ Removed session key: ${key}`);
  });
  
  console.log('✅ Auth storage cleared. Please refresh the page.');
};

/**
 * Emergency auth state reset - use when everything else fails
 * Call this in browser console: resetAuthState()
 */
export const resetAuthState = async () => {
  console.log('⚠️ Starting emergency auth state reset...');
  
  try {
    // Sign out from Supabase (ignore errors)
    await supabase.auth.signOut().catch(e => console.log('SignOut error (expected):', e.message));
    
    // Clear all storage
    clearAuthStorage();
    
    // Clear window objects
    if (typeof window !== 'undefined') {
      delete (window as any).__ZOROASTER_SUPABASE_CLIENT__;
      delete (window as any).supabase;
      delete (window as any).__SUPABASE_CLIENT_INSTANCE__;
      console.log('✅ Cleared window auth objects');
    }
    
    console.log('✅ Emergency reset complete. Please refresh the page.');
    
  } catch (error) {
    console.error('❌ Emergency reset error:', error);
  }
};

/**
 * Check for multiple Supabase client instances
 * Call this in browser console: checkClientInstances()
 */
export const checkClientInstances = () => {
  console.group('🔍 Supabase Client Instances Check');
  
  if (typeof window !== 'undefined') {
    const windowKeys = Object.keys(window).filter(key => 
      key.toLowerCase().includes('supabase') || key.toLowerCase().includes('auth')
    );
    
    console.log('Window properties with supabase/auth:', windowKeys);
    
    windowKeys.forEach(key => {
      console.log(`${key}:`, (window as any)[key]);
    });
  }
  
  console.groupEnd();
};

/**
 * Test authentication functionality
 * Call this in browser console: testAuth('your-email@gmail.com', 'your-password')
 */
export const testAuth = async (email: string, password: string) => {
  console.group('🧪 Testing Authentication');
  
  try {
    console.log('1. Testing sign in...');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    console.log('Sign in result:', {
      success: !error,
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      error: error?.message,
    });
    
    if (data?.session) {
      console.log('2. Testing profile fetch...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
        
      console.log('Profile fetch result:', {
        hasProfile: !!profile,
        role: profile?.role,
        subscription: profile?.subscription_status,
        error: profileError?.message,
      });
    }
    
  } catch (error) {
    console.error('Test auth error:', error);
  }
  
  console.groupEnd();
};

// Make utilities available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuthState = debugAuthState;
  (window as any).clearAuthStorage = clearAuthStorage;
  (window as any).resetAuthState = resetAuthState;
  (window as any).checkClientInstances = checkClientInstances;
  (window as any).testAuth = testAuth;
  
  console.log('🔧 Auth utilities attached to window:', {
    debugAuthState: 'debugAuthState()',
    clearAuthStorage: 'clearAuthStorage()',
    resetAuthState: 'resetAuthState()',
    checkClientInstances: 'checkClientInstances()',
    testAuth: 'testAuth(email, password)'
  });
}
