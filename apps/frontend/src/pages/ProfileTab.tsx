import React from 'react';
from '@zoroaster/ui'

interface ProfileTabProps {
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: Partial<UserProfile>) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ userProfile, onProfileUpdate }) => {
  return (
    <div className="text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <p>This is where you can manage your profile information.</p>
      {/* Add profile settings form here */}
    </div>
  );
};

export default ProfileTab;