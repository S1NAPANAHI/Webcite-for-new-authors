export interface UserStats {
    user_id: string;
    books_read: number;
    reading_hours: number;
    achievements: number;
    currently_reading: string;
}
export declare const initializeUserStats: (userId: string) => Promise<UserStats>;
export declare const getUserStats: (userId: string) => Promise<UserStats>;
