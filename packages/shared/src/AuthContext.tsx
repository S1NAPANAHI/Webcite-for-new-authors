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

  useEffect(() => {
    const getProfile = async () => {
      setIsLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        if (import.meta.env.DEV) {
          console.error("Error getting session:", sessionError);
        }
        setSession(null);
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        setRole(null);
        setIsSubscribed(false);
        setIsLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);

      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') { // PGRST116 means "0 rows"
            // Profile does not exist, create it
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
              })
              .select('*')
              .single();

            if (insertError) {
              if (import.meta.env.DEV) {
                console.error("Error creating user profile:", insertError);
              }
              setUserProfile(null);
              setRole(null);
              setIsSubscribed(false);
            } else if (newProfile) {
              setUserProfile(newProfile);
              setRole(newProfile.role || 'user');
              const isAdmin = newProfile.role === 'admin' || newProfile.role === 'super_admin';
              setIsSubscribed(isAdmin);
            }
          } else {
            if (import.meta.env.DEV) {
              console.error("Error fetching user profile:", profileError);
            }
            setUserProfile(null);
            setRole(null);
            setIsSubscribed(false);
          }
        } else if (profile) {
          setUserProfile(profile);
          setRole(profile.role || 'user');
          const isAdmin = profile.role === 'admin' || profile.role === 'super_admin';
          setIsSubscribed(isAdmin);
        }
      } else {
        setUserProfile(null);
        setRole(null);
        setIsSubscribed(false);
      }
      setIsLoading(false);
    };

    getProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, _session) => {
        getProfile();
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
    role,
    isSubscribed,
    isLoading,
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Only log in development mode
  if (import.meta.env.DEV && context) {
    console.log('useAuth context:', { 
      isAuthenticated: context.isAuthenticated, 
      role: context.role,
      isLoading: context.isLoading 
    });
  }
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};