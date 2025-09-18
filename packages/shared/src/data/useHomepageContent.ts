import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Tables } from '../database.types';

type HomepageContentItem = Tables<'homepage_content'>;

export const useHomepageContent = () => {
  const [homepageContent, setHomepageContent] = useState<HomepageContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*');

      if (error) {
        console.error('Error fetching homepage content:', error);
        setError(error.message);
      } else {
        setHomepageContent(data || []);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  return { homepageContent, loading, error };
};