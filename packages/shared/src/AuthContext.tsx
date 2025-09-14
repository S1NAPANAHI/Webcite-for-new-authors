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
  isSubscribed: boolean; // Added isSubscribed
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
  const [isSubscribed, setIsSubscribed] = useState(false); // Added isSubscribed state
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
        setIsSubscribed(false); // Set isSubscribed to false on error
        setIsLoading(false);
        return;
      }

      const currentSession = session;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);

      let currentIsAdmin = false; // Temporary variable to hold isAdmin status
      let currentIsSubscribed = false; // Temporary variable to hold isSubscribed status

      if (currentSession?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          setUserProfile(null);
          currentIsAdmin = false;
          currentIsSubscribed = false;
        } else if (profile) {
          const modifiedProfile = { ...profile }; // Create a copy to avoid direct mutation

          currentIsAdmin = modifiedProfile.role === 'admin'; // Assuming 'role' field determines admin status
          
          // Admin bypasses subscription check
          if (currentIsAdmin) {
            currentIsSubscribed = true;
            modifiedProfile.subscription_status = "Subscribed"; // Set for admin
          } else {
            // For non-admins, determine actual subscription status
            // This part needs to be filled in with actual subscription fetching logic
            // For now, default to false
            currentIsSubscribed = false; 
            modifiedProfile.subscription_status = "Free Tier"; // Default for non-admin
          }
          setUserProfile(modifiedProfile); // Set the modified profile
        }
      } else {
        setUserProfile(null);
        currentIsAdmin = false;
        currentIsSubscribed = false;
      }

      setIsAdmin(currentIsAdmin);
      setIsSubscribed(currentIsSubscribed); // Set isSubscribed state
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
    isSubscribed, // Added isSubscribed to value
    isLoading,
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log('useAuth context:', context);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};