import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Session, User, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from './profile';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  role: string | null;
  isSubscribed: boolean;
  isLoading: boolean;
  supabase: SupabaseClient;
  signOut: () => Promise<void>; // Add explicit signOut function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  supabaseClient: SupabaseClient;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  supabaseClient,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = supabaseClient;

  // CRITICAL: Fixed authentication state management
  const updateAuthState = async (currentSession: Session | null) => {
    console.log('🔄 AuthContext: Updating auth state', { 
      hasSession: !!currentSession, 
      userId: currentSession?.user?.id,
      userEmail: currentSession?.user?.email 
    });

    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setIsAuthenticated(!!currentSession);

    if (currentSession?.user) {
      console.log('👤 AuthContext: User authenticated, fetching profile...');
      
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Profile fetch timeout')), 10000); // 10 second timeout
        });

        const profilePromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        const { data: profile, error: profileError } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        if (profileError) {
          console.log('⚠️ AuthContext: Profile fetch error:', profileError);
          
          if (profileError.code === 'PGRST116') { // No rows found
            console.log('🆕 AuthContext: Creating missing profile for user');
            
            // FIXED: Use bracket notation for user metadata access
            const displayName = currentSession.user.user_metadata?.['display_name'] || 
                               currentSession.user.email?.split('@')[0] || '';
            
            try {
              const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: currentSession.user.id,
                  email: currentSession.user.email || '',
                  display_name: displayName,
                  role: 'user',
                  beta_reader_status: 'inactive', // Add required field
                  subscription_status: 'free' // Fixed column name
                })
                .select('*')
                .single();

              if (insertError) {
                console.error('❌ AuthContext: Error creating profile:', insertError);
                setUserProfile(null);
                setRole('user'); // Default role
                setIsSubscribed(false);
              } else {
                console.log('✅ AuthContext: Profile created successfully');
                setUserProfile(newProfile);
                setRole(newProfile.role || 'user');
                const isAdmin = newProfile.role === 'admin' || newProfile.role === 'super_admin';
                setIsSubscribed(isAdmin || newProfile.subscription_status === 'premium');
              }
            } catch (insertError) {
              console.error('❌ AuthContext: Error in profile creation:', insertError);
              setUserProfile(null);
              setRole('user');
              setIsSubscribed(false);
            }
          } else {
            console.error('❌ AuthContext: Error fetching profile:', profileError);
            setUserProfile(null);
            setRole('user');
            setIsSubscribed(false);
          }
        } else if (profile) {
          console.log('✅ AuthContext: Profile loaded successfully', { role: profile.role, subscription: profile.subscription_status });
          setUserProfile(profile);
          setRole(profile.role || 'user');
          const isAdmin = profile.role === 'admin' || profile.role === 'super_admin';
          setIsSubscribed(isAdmin || profile.subscription_status === 'premium');
        }
      } catch (error) {
        console.error('❌ AuthContext: Unexpected error in profile fetch:', error);
        // Fix TypeScript error: properly type error
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'Profile fetch timeout') {
          console.error('🕒 AuthContext: Profile fetch timed out - possible database connectivity issue');
        }
        setUserProfile(null);
        setRole('user');
        setIsSubscribed(false);
      }
    } else {
      console.log('🚫 AuthContext: No user session, clearing state');
      setUserProfile(null);
      setRole(null);
      setIsSubscribed(false);
    }

    setIsLoading(false);
    console.log('🏁 AuthContext: Auth state update completed');
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log('🎆 AuthContext: Initializing authentication...');
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('❌ AuthContext: Error getting session:', sessionError);
          if (mounted) {
            await updateAuthState(null);
          }
          return;
        }

        console.log('🔍 AuthContext: Initial session check', { hasSession: !!session });
        if (mounted) {
          await updateAuthState(session);
        }
      } catch (error) {
        console.error('❌ AuthContext: Error in initialization:', error);
        if (mounted) {
          await updateAuthState(null);
        }
      }
    };

    initializeAuth();

    // CRITICAL: Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔊 AuthContext: Auth state changed', { event, hasSession: !!session });
        
        if (mounted) {
          await updateAuthState(session);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  // CRITICAL: Proper logout function with state cleanup
  const signOut = async () => {
    console.log('🚪 AuthContext: Starting logout process...');
    
    try {
      // Clear local state first
      setIsLoading(true);
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      setRole(null);
      setIsSubscribed(false);

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ AuthContext: Error during logout:', error);
        throw error;
      }

      console.log('✅ AuthContext: Logout successful');
      
      // Optional: Clear any remaining auth storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('zoroaster-auth-session');
        console.log('🧹 AuthContext: Cleared auth storage');
      }
      
    } catch (error) {
      console.error('❌ AuthContext: Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    userProfile,
    isAuthenticated,
    role,
    isSubscribed,
    isLoading,
    supabase,
    signOut, // Add signOut to context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Enhanced logging for debugging
  if (context) {
    console.log('🔍 useAuth context:', {
      isAuthenticated: context.isAuthenticated,
      hasUser: !!context.user,
      hasProfile: !!context.userProfile,
      role: context.role,
      isLoading: context.isLoading
    });
  }
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};