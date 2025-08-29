import React from 'react';
import { UserProfile } from '../../packages/shared/src/profile.js';
interface ProfileTabProps {
    userProfile: UserProfile;
    onProfileUpdate: (updatedProfile: Partial<UserProfile>) => void;
}
export declare const ProfileTab: React.FC<ProfileTabProps>;
export default ProfileTab;
//# sourceMappingURL=ProfileTab.d.ts.map