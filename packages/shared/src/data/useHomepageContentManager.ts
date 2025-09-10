import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { TablesInsert } from '../database.types';

type HomepageContentInsert = TablesInsert<'homepage_content'>;

export const useHomepageContentManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createContent = useCallback(async (contentData: HomepageContentInsert) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { error } = await supabase
        .from('homepage_content')
        .insert([contentData]);

      if (error) {
        throw error;
      }
      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error('Error creating homepage content:', err);
      setError(err.message);
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createContent,
    loading,
    error,
    success,
  };
};