import { SupabaseClient } from '@supabase/supabase-js';
import { UpdateUserProfileInput, UserStatsInput, BetaApplicationInput, UpdateUserRoleInput, UserQuery } from '../validators/user.validator';
export declare class UserService {
    private supabase;
    constructor(supabase: SupabaseClient);
    /**
     * Get all users with filtering and pagination
     */
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
    /**
     * Get user profile by ID
     */
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
    /**
     * Update user profile with business rule validation
     */
    updateUserProfile(id: string, input: UpdateUserProfileInput, updatedBy: string): Promise<any>;
    /**
     * Update user role (admin only)
     */
    updateUserRole(input: UpdateUserRoleInput, requestingUserId: string): Promise<any>;
    /**
     * Submit beta application with validation
     */
    submitBetaApplication(input: BetaApplicationInput, userId?: string): Promise<any>;
    /**
     * Update user stats with validation
     */
    updateUserStats(input: UserStatsInput): Promise<any>;
    /**
     * Get user activity with analytics
     */
    getUserActivity(userId: string, limit?: number): Promise<any[]>;
    /**
     * Validate admin access
     */
    private validateAdminAccess;
    /**
     * Validate super admin access
     */
    private validateSuperAdminAccess;
    /**
     * Validate profile access permissions
     */
    private validateProfileAccess;
    /**
     * Validate username uniqueness
     */
    private validateUsernameUniqueness;
    /**
     * Create user profile with business rules
     */
    createUserProfile(userId: string, userEmail: string, userMetadata?: any): Promise<any>;
    /**
     * Get user dashboard data
     */
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
    /**
     * Deactivate user account with business rules
     */
    deactivateUser(userId: string, deactivatedBy: string, reason?: string): Promise<{
        success: boolean;
    }>;
}
