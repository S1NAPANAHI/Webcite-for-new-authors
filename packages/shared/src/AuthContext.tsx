import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Session, User, SupabaseClient } from '@supabase/supabase-js';
import { getUserStats } from './userStats';
import { getSubscription } from './subscription';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  subscription: any | null;
  isLoading: boolean;
  supabase: SupabaseClient;
}

// Use a module-level variable to ensure a single instance of AuthContext
// This is a workaround for potential duplicate context instances in monorepos
let globalAuthContext: React.Context<AuthContextType | undefined>;

if (typeof window !== 'undefined') {
  // In browser, use a global property to ensure single instance across hot reloads
  if (!(window as any).__ZOROASTER_AUTH_CONTEXT__) {
    (window as any).__ZOROASTER_AUTH_CONTEXT__ = createContext<AuthContextType | undefined>(undefined);
  }
  globalAuthContext = (window as any).__ZOROASTER_AUTH_CONTEXT__;
} else {
  // For server-side rendering or non-browser environments
  globalAuthContext = createContext<AuthContextType | undefined>(undefined);
}

// Use the globalAuthContext instead of a local const
const AuthContext = globalAuthContext;

// Remove the console.log from here, as it's now handled by the global check
// console.log('AuthContext created:', AuthContext);


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
  const [profile, setProfile] = useState<any | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = supabaseClient; // Use the passed supabaseClient

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserProfileAndSubscription(user.id);
    } else {
      setProfile(null);
      setSubscription(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserProfileAndSubscription = async (userId: string) => {
    console.log('AuthContext: fetchUserProfileAndSubscription START for user:', userId);
    setIsLoading(true);
    try {
      // Fetch profile
      console.log('AuthContext: Fetching profile...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }
      setProfile(profileData);

      // Fetch user stats
      const userStats = await getUserStats(userId);
      // console.log('AuthContext: User Stats:', userStats); // Log user stats
      setProfile((prev: any) => ({ ...prev, user_stats: userStats })); // Assuming user_stats is part of profile

      // Fetch subscription
      const userSubscription = await getSubscription(userId);
      // console.log('AuthContext: User Subscription:', userSubscription); // Log user subscription
      setSubscription(userSubscription);

    } catch (error) {
      console.log('AuthContext: Error fetching profile:', error);
      // Handle error, maybe set an error state
      setProfile(null);
      setSubscription(null);
    } finally {
      console.log('AuthContext: Setting isLoading(false) - ERROR PATH');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, user, profile, subscription, isLoading, supabase }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Remove the console.log from here, as it's now handled by the global check
  // console.log('useAuth trying to use context:', AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};