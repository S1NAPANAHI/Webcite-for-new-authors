import React from 'react';
import { Session, User, SupabaseClient } from '@supabase/supabase-js';
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
    [key: string]: unknown;
}
type UserStats = {
    user_id: string;
    books_read: number;
    reading_hours: number;
    achievements: number;
    currently_reading: string;
    [key: string]: unknown;
};
interface AuthContextType {
    user: User | null;
    session: Session | null;
    userProfile: UserProfile | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
    isSubscribed: boolean;
    userStats: UserStats;
    supabaseClient: SupabaseClient;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    setIsSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    error: string | null;
}
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
    supabaseClient: SupabaseClient;
}>;
export declare const useAuth: () => AuthContextType;
export {};
//# sourceMappingURL=AuthContext.d.ts.map