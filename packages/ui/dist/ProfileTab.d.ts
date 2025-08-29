import React from 'react';
import { UserProfile } from '@zoroaster/shared';
interface ProfileTabProps {
    userProfile: UserProfile;
    onProfileUpdate: (updatedProfile: Partial<UserProfile>) => void;
}
export declare const ProfileTab: React.FC<ProfileTabProps>;
export default ProfileTab;
