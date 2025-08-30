import React, { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { UserProfile } from '../../packages/shared/src/profile.js'; // Import UserProfile

interface ProfileTabProps {
  userProfile: UserProfile; // Use the imported UserProfile type
  onProfileUpdate: (updatedProfile: Partial<UserProfile>) => void; // Use Partial<UserProfile> for updates
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ userProfile, onProfileUpdate }) => {
  const [displayName, setDisplayName] = useState(userProfile.display_name || '');
  const [bio, setBio] = useState(userProfile.bio || '');
  const [location, setLocation] = useState(userProfile.location || '');
  const [favoriteGenre, setFavoriteGenre] = useState(userProfile.favorite_genre || '');
  const [readingGoal, setReadingGoal] = useState(userProfile.reading_goal || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDisplayName(userProfile.display_name || '');
    setBio(userProfile.bio || '');
    setLocation(userProfile.location || '');
    setFavoriteGenre(userProfile.favorite_genre || '');
    setReadingGoal(userProfile.reading_goal || 0);
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updates = {
      display_name: displayName,
      bio,
      location,
      favorite_genre: favoriteGenre,
      reading_goal: readingGoal,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userProfile.id);

    if (error) {
      console.error('Error updating profile:', error.message);
      alert('Error updating profile!');
    } else {
      alert('Profile updated successfully!');
      onProfileUpdate({ ...userProfile, ...updates }); // Update parent state
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="section-title text-2xl font-semibold text-secondary mb-4 border-b-2 border-primary-dark pb-2">Edit Profile</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label className="block text-text-light text-sm font-bold mb-2">Username</label>
            <input type="text" className="w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light" value={userProfile.username} readOnly />
          </div>
          <div className="form-group">
            <label className="block text-text-light text-sm font-bold mb-2">Display Name</label>
            <input type="text" className="w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="block text-text-light text-sm font-bold mb-2">Email</label>
            <input type="email" className="w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light" value={userProfile.email || 'N/A'} readOnly />
          </div>
          <div className="form-group">
            <label className="block text-text-light text-sm font-bold mb-2">Location</label>
            <input type="text" className="w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>
        
        <div className="form-group mb-4">
          <label className="block text-text-light text-sm font-bold mb-2">Bio</label>
          <textarea className="w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light h-24 resize-y" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-group">
            <label className="block text-text-light text-sm font-bold mb-2">Favorite Genre</label>
            <input type="text" className="w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light" value={favoriteGenre} onChange={(e) => setFavoriteGenre(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="block text-text-light text-sm font-bold mb-2">Reading Goal (Books/Year)</label>
            <input type="number" className="w-full p-2 rounded-md bg-background-dark border border-primary-dark text-text-light" value={readingGoal} onChange={(e) => setReadingGoal(parseInt(e.target.value))} />
          </div>
        </div>
        
        <button type="submit" className="bg-secondary hover:bg-secondary-dark text-background-dark font-bold py-2 px-4 rounded-md transition-colors duration-300" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileTab;
