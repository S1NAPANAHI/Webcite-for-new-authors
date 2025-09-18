import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Tables } from '../database.types';

type Page = Tables<'pages'>;

export const usePage = (slug: string) => {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published') // Only fetch published pages
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error(`Error fetching page with slug ${slug}:`, error);
        setError(error.message);
      } else {
        setPage(data);
      }
      setLoading(false);
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  return { page, loading, error };
};