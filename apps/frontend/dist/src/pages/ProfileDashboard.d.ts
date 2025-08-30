import React from 'react';
interface UserStatus {
    isSubscribed: boolean;
    subscriptionTier?: 'free' | 'premium' | 'patron';
    betaReaderStatus: 'not_applied' | 'pending' | 'approved' | 'rejected';
    subscriptionEndDate?: string;
    booksRead: number;
    readingHours: number;
    currentlyReading: string;
    achievements: number;
    username: string;
    onSignOut: () => void;
}
export declare const OverviewContent: React.FC<{
    userId: string;
} & Omit<UserStatus, 'userId'>>;
export declare const ProfileContent: React.FC;
export declare const ReadingContent: React.FC;
export declare const AchievementsContent: React.FC;
export declare const PreferencesContent: React.FC;
export declare const SecurityContent: React.FC;
export declare const AdminContent: React.FC;
declare const ProfileDashboard: () => import("react/jsx-runtime").JSX.Element | null;
export default ProfileDashboard;
//# sourceMappingURL=ProfileDashboard.d.ts.map