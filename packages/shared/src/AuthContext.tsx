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
  full_name?: string;
  [key: string]: unknown; // Allow additional properties
}

// User stats type
type UserStats = {
  user_id: string;
  books_read: number;
  reading_hours: number;
  achievements: number;
  currently_reading: string;
  [key: string]: unknown; // For any additional fields
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubscribed: boolean;
  userStats: UserStats; // Added this line
  supabaseClient: SupabaseClient;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setIsSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  error: string | null;
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
  const [userStats, setUserStats] = useState<UserStats>({
    user_id: '',
    books_read: 0,
    reading_hours: 0,
    achievements: 0,
    currently_reading: 'None'
  });
  const [error, setError] = useState<string | null>(null);

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

  // Function to safely fetch subscription with minimal assumptions about the table structure
  const fetchUserSubscription = async (userId: string) => {
    try {
      // Try a minimal query to check if the table exists and is accessible
      const { data: subscription, error } = await supabaseClient
        .from('subscriptions')
        .select('id') // Only request the ID to minimize data transfer
        .eq('user_id', userId)
        .maybeSingle()
        .then(({ data, error }) => {
          // Handle common error cases
          if (error) {
            // No rows found - not an error, just no subscription
            if (error.code === 'PGRST116') {
              return { data: null, error: null };
            }
            // Table or column doesn't exist
            if (error.code === '42P01' || error.code === '42703') {
              console.warn('Subscription table issue:', error.message);
              return { data: null, error: null };
            }
            // For other errors, return them to be handled below
            return { data: null, error };
          }
          return { data, error: null };
        });

      // If we got an error in the .then() handler, log it
      if (error) {
        console.error('Error checking subscription:', error);
        return null;
      }

      // If we got here, the table exists and we have a subscription
      if (subscription) {
        // Now fetch the full subscription data
        const { data: fullSubscription, error: fetchError } = await supabaseClient
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .in('status', ['active', 'trialing', 'past_due', 'unpaid'])
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching full subscription:', fetchError);
          return null;
        }

        return fullSubscription;
      }

      return null;
    } catch (error) {
      console.error('Exception when fetching subscription:', error);
      return null;
    }
  };

  // Fetch user profile and subscription when user changes
  useEffect(() => {
    const fetchUserProfileAndSubscription = async (userId: string) => {
      console.log('AuthContext: fetchUserProfileAndSubscription START for user:', userId);
      try {
        setIsLoading(true);
        
        // Fetch user profile
        console.log('AuthContext: Fetching profile...');
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error('AuthContext: Error fetching profile:', profileError);
          throw new Error('Failed to load user profile');
        }

        if (!profile) {
          console.warn('AuthContext: No profile found for user:', userId);
          setUserProfile(null);
        } else {
          console.log('AuthContext: Profile fetched successfully:', profile);
          setUserProfile(profile);
        }

        // Fetch subscription using the safe function
        console.log('AuthContext: Fetching subscription...');
        const subscription = await fetchUserSubscription(userId);
        setIsSubscribed(!!subscription);
        console.log('AuthContext: Subscription status:', !!subscription);

        // Get user stats with proper error handling
        console.log('AuthContext: Fetching user stats...');
        try {
          const { data: stats } = await supabaseClient
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          const fullName = stats ? (stats as any)['full_name'] : undefined;
          
          setUserStats({
            user_id: userId,
            books_read: stats?.books_read ?? 0,
            reading_hours: stats?.reading_hours ?? 0,
            achievements: stats?.achievements ?? 0,
            currently_reading: stats?.currently_reading ?? 'None',
            ...(stats || {}), // Safely spread stats if it exists
            ...(fullName && { full_name: fullName }) // Handle full_name specially
          });
          console.log('AuthContext: User stats fetched successfully:', stats);
        } catch (error) {
          console.error('AuthContext: Error fetching user stats:', error);
          // Set default stats on error
          setUserStats({
            user_id: userId,
            books_read: 0,
            reading_hours: 0,
            achievements: 0,
            currently_reading: 'None'
          });
        }
        console.log('AuthContext: Setting isLoading(false) - SUCCESS PATH');
        setIsLoading(false);
      } catch (err: any) {
        console.error('AuthContext: Error in fetchUserProfileAndSubscription:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user data');
        console.log('AuthContext: Setting isLoading(false) - ERROR PATH');
        setIsLoading(false);
      }
    };

    // Function to create user profile if it doesn't exist
    // This is intentionally left unimplemented as it's not part of the current scope
    // and would require additional database setup and error handling
    /*
    const createUserProfile = async (_userId: string) => {
      try {
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) {
          console.error('Error getting user info for profile creation:', userError);
          return;
        }

        const { data: newProfile, error: createError } = await supabaseClient
          .from('profiles')
          .insert({
            id: _userId,
            username: user.email?.split('@')[0] || null,
            display_name: user.user_metadata?.['full_name'] || user.email?.split('@')[0] || 'User',
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
    */

    if (user?.id) {
      fetchUserProfileAndSubscription(user.id);
      setIsAuthenticated(true);
    } else {
      setUserProfile(null);
      setIsAdmin(false);
      setIsSubscribed(false);
      setIsAuthenticated(false);
    }
  }, [session, supabaseClient]);

  // Update isAuthenticated based on session
  useEffect(() => {
    setIsAuthenticated(!!session);
    if (session?.user) {
      // Check if user is admin
      const appMetadata = session.user.app_metadata as { role?: string } | undefined;
      const userMetadata = session.user.user_metadata as { role?: string } | undefined;
      const isUserAdmin = appMetadata?.role === 'admin' || 
                        userMetadata?.role === 'admin';
      setIsAdmin(isUserAdmin);
    }
  }, [session]);

  // Create the context value
  const contextValue = {
    user,
    session,
    userProfile,
    isAdmin,
    isAuthenticated,
    isLoading,
    isSubscribed,
    userStats, // Added this line
    error,
    supabaseClient,
    setUserProfile,
    setIsSubscribed,
    setError
  };

  return (
    <AuthContext.Provider value={contextValue}>
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