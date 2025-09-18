import { SupabaseClient } from '@supabase/supabase-js';
import { UpdateUserProfileInput, UserStatsInput, BetaApplicationInput, UpdateUserRoleInput, UserQuery } from '../validators/user.validator';
export declare class UserService {
    private supabase;
    constructor(supabase: SupabaseClient);
    getUsers(query: UserQuery, requestingUserId: string): Promise<{
        users: {
            id: any;
            username: any;
            display_name: any;
            avatar_url: any;
            website: any;
            role: any;
            beta_reader_status: any;
            created_at: any;
            updated_at: any;
            user_stats: {
                books_read: any;
                reading_hours: any;
                achievements: any;
                currently_reading: any;
            }[];
        }[];
        pagination: {
            limit: number;
            offset: number;
            total: number;
        };
    }>;
    getUserProfile(id: string, requestingUserId?: string): Promise<{
        id: any;
        username: any;
        display_name: any;
        avatar_url: any;
        website: any;
        role: any;
        beta_reader_status: any;
        created_at: any;
        updated_at: any;
        user_stats: {
            books_read: any;
            reading_hours: any;
            achievements: any;
            currently_reading: any;
        }[];
    }>;
    updateUserProfile(id: string, input: UpdateUserProfileInput, _updatedBy: string): Promise<any>;
    updateUserRole(input: UpdateUserRoleInput, requestingUserId: string): Promise<any>;
    submitBetaApplication(input: BetaApplicationInput, userId?: string): Promise<any>;
    updateUserStats(input: UserStatsInput): Promise<any>;
    getUserActivity(userId: string, limit?: number): Promise<any[]>;
    private validateAdminAccess;
    private validateSuperAdminAccess;
    private validateProfileAccess;
    private validateUsernameUniqueness;
    createUserProfile(userId: string, userEmail: string, userMetadata?: any): Promise<any>;
    getUserDashboard(userId: string): Promise<{
        profile: {
            id: any;
            username: any;
            display_name: any;
            avatar_url: any;
            website: any;
            role: any;
            beta_reader_status: any;
            created_at: any;
            updated_at: any;
            user_stats: {
                books_read: any;
                reading_hours: any;
                achievements: any;
                currently_reading: any;
            }[];
        };
        subscriptions: {
            id: any;
            status: any;
            current_period_end: any;
            prices: {
                unit_amount: any;
                currency: any;
                interval: any;
            }[];
        }[];
        recentOrders: {
            id: any;
            status: any;
            purchased_at: any;
            metadata: any;
            products: {
                name: any;
            }[];
            prices: {
                unit_amount: any;
                currency: any;
            }[];
        }[];
        readingProgress: {
            progress_percentage: any;
            last_read_at: any;
            is_completed: any;
            chapters: {
                title: any;
                work_id: any;
                works: {
                    title: any;
                }[];
            }[];
        }[];
    }>;
    deactivateUser(userId: string, deactivatedBy: string, _reason?: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=UserService.d.ts.map