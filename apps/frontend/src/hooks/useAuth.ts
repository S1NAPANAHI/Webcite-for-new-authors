import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../packages/shared/src/lib/supabase';
import { Database } from '../../packages/shared/src/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Fallback auth state for when context is not available
    const [authState, setAuthState] = useState<AuthState>({
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false
    });

    useEffect(() => {
      // Get initial session
      const getInitialSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }

        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setAuthState({
            user: session.user,
            profile: profile || null,
            isLoading: false,
            isAuthenticated: true
          });
        } else {
          setAuthState({
            user: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false
          });
        }
      };

      getInitialSession();

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            // Fetch user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            setAuthState({
              user: session.user,
              profile: profile || null,
              isLoading: false,
              isAuthenticated: true
            });
          } else {
            setAuthState({
              user: null,
              profile: null,
              isLoading: false,
              isAuthenticated: false
            });
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }, []);

    const signIn = async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
    };

    const signUp = async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
    };

    const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    };

    const refreshSession = async () => {
      const { error } = await supabase.auth.refreshSession();
      if (error) throw error;
    };

    return {
      ...authState,
      signIn,
      signUp,
      signOut,
      refreshSession
    };
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};