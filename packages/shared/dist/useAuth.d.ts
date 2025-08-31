import { User } from '@supabase/supabase-js';
import { UserProfile } from './profile';
interface AuthState {
    user: User | null;
    userProfile: UserProfile | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
}
export declare const useAuth: () => AuthState;
export {};
