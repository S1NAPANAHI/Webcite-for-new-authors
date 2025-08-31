import { default as React } from 'react';
import { UserProfile } from '../../shared/src/profile';
interface ProfileTabProps {
    userProfile: UserProfile;
    onProfileUpdate: (updatedProfile: Partial<UserProfile>) => void;
}
export declare const ProfileTab: React.FC<ProfileTabProps>;
export default ProfileTab;
//# sourceMappingURL=ProfileTab.d.ts.map