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
  isAdmin: boolean;
  isLoading: boolean;
  supabase: SupabaseClient;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = supabaseClient;

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setIsLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setSession(null);
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const currentSession = session;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);

      // Temporarily removed profile fetching and isAdmin logic for debugging
      setUserProfile(null);
      setIsAdmin(false);

      setIsLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, _session) => {
        fetchSessionAndProfile();
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = {
    session,
    user,
    userProfile,
    isAuthenticated,
    isAdmin,
    isLoading,
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};