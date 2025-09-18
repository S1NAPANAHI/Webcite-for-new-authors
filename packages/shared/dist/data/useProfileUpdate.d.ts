import { UserProfile } from '@zoroaster/shared/profile';
interface UseProfileUpdateResult {
    updateProfile: (userId: string, updates: Partial<UserProfile>) => Promise<{
        success: boolean;
        data?: any;
        error?: string;
    }>;
    fetchProfile: (userId: string) => Promise<{
        success: boolean;
        data?: any;
        error?: string;
    }>;
    loading: boolean;
    error: string | null;
    success: string | null;
}
export declare const useProfileUpdate: () => UseProfileUpdateResult;
export {};
//# sourceMappingURL=useProfileUpdate.d.ts.map