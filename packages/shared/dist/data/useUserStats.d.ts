export declare const useUserStats: (userId: string | undefined) => {
    userStats: {
        achievements_unlocked: number;
        books_read: number;
        chapters_read: number;
        created_at: string;
        current_streak_days: number;
        last_activity_date: string | null;
        level_reached: number;
        total_reading_minutes: number;
        updated_at: string;
        user_id: string;
    } | null;
    loading: boolean;
    error: string | null;
};
//# sourceMappingURL=useUserStats.d.ts.map