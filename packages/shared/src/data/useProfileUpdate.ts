import { useState } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { UserProfile } from '@zoroaster/shared/profile'; // Assuming UserProfile type is here

interface UseProfileUpdateResult {
  updateProfile: (userId: string, updates: Partial<UserProfile>) => Promise<{ success: boolean; data?: any; error?: string }>;
  fetchProfile: (userId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export const useProfileUpdate = (): UseProfileUpdateResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { data, error } = await supabase
        .from('profiles') // Assuming 'profiles' is your table name
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      setSuccess('Profile updated successfully!');
      return { success: true, data };
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch profile data (optional, but good for pre-filling forms)
  const fetchProfile = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, bio, location, website') // Select specific fields
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, fetchProfile, loading, error, success };
};
