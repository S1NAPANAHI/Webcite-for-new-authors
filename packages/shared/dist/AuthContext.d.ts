import React from 'react';
import { Session, User } from '@supabase/supabase-js';
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
}
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};
//# sourceMappingURL=AuthContext.d.ts.map