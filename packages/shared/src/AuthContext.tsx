import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient'; // Assuming supabase is exported from here
import { Session, User } from '@supabase/supabase-js';

// UserProfile type definition
interface UserProfile {
  id: string;
  username: string;
  display_name: string;
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
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        setUserProfile(profile);
        setIsAdmin(profile?.role === 'admin' || profile?.role === 'super_admin');
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
        setIsAdmin(false);
      }
    };

    if (user?.id) {
      fetchUserProfile(user.id);
      setIsAuthenticated(true);
    } else {
      setUserProfile(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userProfile,
      isAdmin,
      isAuthenticated,
      loading 
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
