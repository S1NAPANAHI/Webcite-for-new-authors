import React from 'react';

interface PreferencesTabProps {
  userProfile: any; // Replace 'any' with a proper UserProfile type later
}

export const PreferencesTab: React.FC<PreferencesTabProps> = ({ userProfile }) => {
  return (
    <div>
      <h2 className="section-title text-2xl font-semibold text-secondary mb-4 border-b-2 border-primary-dark pb-2">Preferences</h2>
      
      <div className="bg-background-dark/50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-secondary mb-4">Reading Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input type="checkbox" id="darkMode" className="form-checkbox h-5 w-5 text-secondary rounded" defaultChecked />
            <label htmlFor="darkMode" className="ml-2 text-text-light">Dark mode</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="autoBookmark" className="form-checkbox h-5 w-5 text-secondary rounded" />
            <label htmlFor="autoBookmark" className="ml-2 text-text-light">Auto-bookmark progress</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="readingReminders" className="form-checkbox h-5 w-5 text-secondary rounded" defaultChecked />
            <label htmlFor="readingReminders" className="ml-2 text-text-light">Reading reminders</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="spoilerWarnings" className="form-checkbox h-5 w-5 text-secondary rounded" defaultChecked />
            <label htmlFor="spoilerWarnings" className="ml-2 text-text-light">Spoiler warnings</label>
          </div>
        </div>
      </div>

      <div className="bg-background-dark/50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-secondary mb-4">Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input type="checkbox" id="newReleases" className="form-checkbox h-5 w-5 text-secondary rounded" defaultChecked />
            <label htmlFor="newReleases" className="ml-2 text-text-light">New releases</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="blogUpdates" className="form-checkbox h-5 w-5 text-secondary rounded" defaultChecked />
            <label htmlFor="blogUpdates" className="ml-2 text-text-light">Blog updates</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="communityUpdates" className="form-checkbox h-5 w-5 text-secondary rounded" />
            <label htmlFor="communityUpdates" className="ml-2 text-text-light">Community updates</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="betaInvites" className="form-checkbox h-5 w-5 text-secondary rounded" defaultChecked />
            <label htmlFor="betaInvites" className="ml-2 text-text-light">Beta reader invites</label>
          </div>
        </div>
      </div>
      
      <button className="bg-secondary hover:bg-secondary-dark text-background-dark font-bold py-2 px-4 rounded-md transition-colors duration-300">
        Save Preferences
      </button>
    </div>
  );
};


