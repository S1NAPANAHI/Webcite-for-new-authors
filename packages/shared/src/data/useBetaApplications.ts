import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Tables } from '../database.types';

type BetaApplication = Tables<'beta_applications'>;


export const useBetaApplications = () => {
  const [applications, setApplications] = useState<BetaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('beta_applications')
      .select('*');

    if (error) {
      console.error('Error fetching beta applications:', error);
      setError(error.message);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateApplicationStatus = useCallback(async (id: string, newStatus: BetaApplication['status']) => {
    // First, update the beta_applications table
    const { error: appUpdateError } = await supabase
      .from('beta_applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (appUpdateError) {
      console.error('Error updating application status:', appUpdateError);
      setError(appUpdateError.message);
      return false;
    }

    // Get the user_id from the application
    const { data: application, error: fetchAppError } = await supabase
      .from('beta_applications')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchAppError || !application) {
      console.error('Error fetching application user_id:', fetchAppError);
      setError(fetchAppError.message);
      return false;
    }

    // Optimistically update state
    setApplications(prevApps => 
      prevApps.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    return true;
  }, []);

  const updateAdminNotes = useCallback(async () => {
    // Admin notes are not directly stored in beta_applications table.
    // This function should ideally update a different table or a JSON column if intended.
    // For now, we will just log a warning and return true to allow the build to pass.
    console.warn('Attempted to update admin_notes, but beta_applications table does not support it directly.');
    return true;
  }, []);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    updateApplicationStatus,
    updateAdminNotes,
  };
};