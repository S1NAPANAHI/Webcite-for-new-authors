import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Tables } from '../database.types';
import { User } from '@supabase/supabase-js';

type BetaApplication = Tables<'beta_applications'>;

export const useBetaApplication = (user: User | null) => {
  const [applicationStatus, setApplicationStatus] = useState<BetaApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('beta_applications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error;
      }
      setApplicationStatus(data || null);
    } catch (err: any) {
      console.error('Error fetching beta application:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const submitApplication = useCallback(async (applicationToSave: Partial<BetaApplication>) => {
    setError(null);
    try {
      const { error } = await supabase
        .from('beta_applications')
        .insert([applicationToSave as Tables<'beta_applications'>]);

      if (error) {
        throw error;
      }
      // Re-fetch application status after submission
      await fetchApplication();
      return true;
    } catch (err: any) {
      console.error('Error saving beta application:', err);
      setError(err.message);
      return false;
    }
  }, [fetchApplication]);

  return {
    applicationStatus,
    loading,
    error,
    submitApplication,
    fetchApplication, // Expose fetch function for manual refresh if needed
  };
};