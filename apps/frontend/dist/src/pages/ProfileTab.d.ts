import React from 'react';
import { UserProfile } from '@zoroaster/shared/profile';
interface ProfileTabProps {
    userProfile: UserProfile;
    onProfileUpdate: (updatedProfile: Partial<UserProfile>) => void;
}
declare const ProfileTab: React.FC<ProfileTabProps>;
export default ProfileTab;
//# sourceMappingURL=ProfileTab.d.ts.map