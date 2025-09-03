import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User, SupabaseClient } from '@supabase/supabase-js';

// UserProfile type definition
interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio?: string;
  location?: string;
  favorite_genre?: string;
  reading_goal?: number;
  role?: string;
  books_read?: number;
  currently_reading?: string;
  reading_hours?: number;
  reading_streak?: number;
  achievements_count?: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubscribed: boolean;
  supabaseClient: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ 
  children: React.ReactNode;
  supabaseClient: SupabaseClient;
}> = ({ children, supabaseClient }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    // Initial session check
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabaseClient]);

  // Fetch user profile and subscription when user changes
  useEffect(() => {
    const fetchUserProfileAndSubscription = async (userId: string) => {
      try {
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            await createUserProfile(userId);
            return;
          }
          throw profileError;
        }
        
        setUserProfile(profile as UserProfile);
        setIsAdmin(!!(profile?.role === 'admin' || profile?.role === 'super_admin'));

        const { data: subscription, error: subscriptionError } = await supabaseClient.rpc('get_user_active_subscription', { user_uuid: userId });

        if (subscriptionError) {
          throw subscriptionError;
        }

        setIsSubscribed(!!subscription);

      } catch (error) {
        console.error('Error fetching user profile or subscription:', error);
        setUserProfile(null);
        setIsAdmin(false);
        setIsSubscribed(false);
      }
    };

    const createUserProfile = async (userId: string) => {
      try {
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) {
          console.error('Error getting user info for profile creation:', userError);
          return;
        }

        const { data: newProfile, error: createError } = await supabaseClient
          .from('profiles')
          .insert({
            id: userId,
            username: user.email?.split('@')[0] || null,
            display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email,
            role: 'user',
            subscription_status: 'inactive',
            beta_reader_status: 'none'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          setUserProfile(null);
          setIsAdmin(false);
        } else {
          setUserProfile(newProfile as UserProfile);
          setIsAdmin(!!(newProfile?.role === 'admin' || newProfile?.role === 'super_admin'));
        }
      } catch (error) {
        console.error('Error in createUserProfile:', error);
        setUserProfile(null);
        setIsAdmin(false);
      }
    };

    if (user?.id) {
      fetchUserProfileAndSubscription(user.id);
      setIsAuthenticated(true);
    } else {
      setUserProfile(null);
      setIsAdmin(false);
      setIsSubscribed(false);
      setIsAuthenticated(false);
    }
  }, [user, supabaseClient]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userProfile,
      isAdmin,
      isAuthenticated,
      isLoading,
      isSubscribed,
      supabaseClient
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};