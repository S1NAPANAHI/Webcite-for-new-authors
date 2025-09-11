import React, { ReactNode } from 'react';
import { Session, User, SupabaseClient } from '@supabase/supabase-js';
interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: any | null;
    subscription: any | null;
    isLoading: boolean;
    supabase: SupabaseClient;
}
interface AuthProviderProps {
    children: ReactNode;
    supabaseClient: SupabaseClient;
}
export declare const AuthProvider: React.FC<AuthProviderProps>;
export declare const useAuth: () => AuthContextType;
export {};
//# sourceMappingURL=AuthContext.d.ts.map