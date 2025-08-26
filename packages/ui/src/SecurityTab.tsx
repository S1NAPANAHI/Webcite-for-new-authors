import React from 'react';

interface SecurityTabProps {
  userProfile: any; // Replace 'any' with a proper UserProfile type later
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ userProfile }) => {
  return (
    <div>
      <h2 className="section-title text-2xl font-semibold text-secondary mb-4 border-b-2 border-primary-dark pb-2">Security Settings</h2>
      
      <div className="bg-background-dark/50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-secondary mb-4">Change Password</h3>
        <div className="mb-4">
          <label className="block text-text-light text-sm font-bold mb-2">Current Password</label>
          <input type="password" className="w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light" />
        </div>
        <div className="mb-4">
          <label className="block text-text-light text-sm font-bold mb-2">New Password</label>
          <input type="password" className="w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light" />
        </div>
        <div className="mb-6">
          <label className="block text-text-light text-sm font-bold mb-2">Confirm New Password</label>
          <input type="password" className="w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light" />
        </div>
        <button className="bg-secondary hover:bg-secondary-dark text-background-dark font-bold py-2 px-4 rounded-md transition-colors duration-300">
          Update Password
        </button>
      </div>

      <div className="bg-background-dark/50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-secondary mb-4">Account Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input type="checkbox" id="twoFactor" className="form-checkbox h-5 w-5 text-secondary rounded" />
            <label htmlFor="twoFactor" className="ml-2 text-text-light">Enable two-factor authentication</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="loginNotifications" className="form-checkbox h-5 w-5 text-secondary rounded" defaultChecked />
            <label htmlFor="loginNotifications" className="ml-2 text-text-light">Login notifications</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="profilePublic" className="form-checkbox h-5 w-5 text-secondary rounded" defaultChecked />
            <label htmlFor="profilePublic" className="ml-2 text-text-light">Public profile</label>
          </div>
        </div>
      </div>

      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-red-500 mb-4">Danger Zone</h3>
        <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300">
          Delete Account
        </button>
      </div>
    </div>
  );
};


