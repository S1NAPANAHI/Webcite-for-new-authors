export type UserStats = {
    user_id: string;
    books_read: number;
    reading_hours: number;
    achievements: number;
    currently_reading: string;
    created_at?: string | null;
    updated_at?: string | null;
    [key: string]: unknown;
};
/**
 * Safely gets user stats, falling back to default values if needed
 */
export declare const getUserStats: (userId: string) => Promise<UserStats>;
/**
 * Initializes user stats in the database
 */
export declare const initializeUserStats: (userId: string) => Promise<UserStats>;
/**
 * Updates user stats in the database
 */
export declare const updateUserStats: (userId: string, updates: Partial<Omit<UserStats, "user_id">>) => Promise<UserStats>;
//# sourceMappingURL=userStats.d.ts.map