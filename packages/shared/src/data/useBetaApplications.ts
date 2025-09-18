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

  const updateApplicationStatus = useCallback(async (id: string, newStatus: BetaApplication['status'], notes: string) => {
    // First, update the beta_applications table
    const { error: appUpdateError } = await supabase
      .from('beta_applications')
      .update({ status: newStatus, admin_notes: notes })
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

    // const profileStatus: Profile['beta_reader_status'] = newStatus === 'approved' ? 'approved' : 'rejected';

    // Then, update the profiles table
    // const { error: profileUpdateError } = await supabase
    //   .from('profiles')
    //   .update({ beta_reader_status: profileStatus })
    //   .eq('id', application.user_id);

    // if (profileUpdateError) {
    //   console.error('Error updating user profile beta_reader_status:', profileUpdateError);
    //   setError(profileUpdateError.message);
    //   return false;
    // }

    // Optimistically update state
    setApplications(prevApps => 
      prevApps.map(app => 
        app.id === id ? { ...app, status: newStatus, admin_notes: notes } : app
      )
    );
    return true;
  }, []);

  const updateAdminNotes = useCallback(async (appId: string, newNotes: string) => {
    const { error: updateError } = await supabase
      .from('beta_applications')
      .update({ admin_notes: newNotes })
      .eq('id', appId);

    if (updateError) {
      console.error('Error updating admin notes:', updateError);
      setError(updateError.message);
      return false;
    }

    // Optimistically update state
    setApplications(prevApps =>
      prevApps.map(app =>
        app.id === appId ? { ...app, admin_notes: newNotes } : app
      )
    );
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