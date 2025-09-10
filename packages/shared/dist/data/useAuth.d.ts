import { AuthError } from '@supabase/supabase-js';
export declare const useAuth: () => {
    signIn: (email: string, password: string) => Promise<{
        success: boolean;
        error?: never;
    } | {
        success: boolean;
        error: any;
    }>;
    signUp: (email: string, password: string, displayName: string) => Promise<{
        success: boolean;
        error?: never;
    } | {
        success: boolean;
        error: any;
    }>;
    loading: boolean;
    error: AuthError | null;
};
//# sourceMappingURL=useAuth.d.ts.map