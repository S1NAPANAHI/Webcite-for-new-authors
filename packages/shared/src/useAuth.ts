import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Define the User type locally to avoid import issues
interface User {
  id: string;
  email?: string;
  user_metadata?: any;
}

// Define the UserProfile type
interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  location?: string;
  favorite_genre?: string;
  reading_goal?: number;
  role?: string; // Add role to UserProfile
  books_read?: number;
  currently_reading?: string;
  reading_hours?: number;
  reading_streak?: number;
  achievements_count?: number;
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null; // Add userProfile
  isAuthenticated: boolean;
  isAdmin: boolean; // Add isAdmin
  isLoading: boolean;
}

export const useAuth = (): AuthState & { 
  loading: boolean; 
  isAuthenticated: boolean; 
  isAdmin: boolean;
  userProfile: UserProfile | null;
} => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setIsLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);

        try {
          console.log('🔍 [useAuth] Fetching user profile for ID:', session.user.id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('❌ [useAuth] Error fetching user profile:', profileError);
            setUserProfile(null);
            setIsAdmin(false);
          } else if (profile) {
            console.log('✅ [useAuth] Retrieved profile:', profile);
            setUserProfile(profile as UserProfile);
            const adminRoles = ['admin', 'super_admin'];
            const userRole = profile.role?.toLowerCase();
            const isUserAdmin = userRole && adminRoles.includes(userRole);
            setIsAdmin(isUserAdmin);
             console.log('🔑 [useAuth] Role check:', {
              userId: profile.id,
              role: userRole,
              isAdmin: isUserAdmin,
            });
          } else {
            console.error('❌ [useAuth] No profile data returned for user ID:', session.user.id);
            setUserProfile(null);
            setIsAdmin(false);
          }
        } catch (e) {
            console.error("Catastrophic error fetching profile:", e);
            setUserProfile(null);
            setIsAdmin(false);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 [useAuth] Auth state changed, event:', event);
        fetchSessionAndProfile();
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    userProfile,
    isAuthenticated,
    isAdmin,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
  };
};