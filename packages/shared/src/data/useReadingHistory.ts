import { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';

interface ReadingItem {
  id: string;
  title: string;
  author: string;
  progress: number; // Percentage or pages read
  total_pages?: number; // Total pages if progress is pages
  last_read_at: string; // ISO date string
  cover_image_url?: string;
  type: 'book' | 'article' | 'other';
}

export const useReadingHistory = (userId: string) => {
  const [readingItems, setReadingItems] = useState<ReadingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadingHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assuming a 'user_reading_history' table in Supabase
        // with RLS enabled for user_id
        const { data, error } = await supabase
          .from('user_reading_history')
          .select('id, title, author, progress, total_pages, last_read_at, cover_image_url, type')
          .eq('user_id', userId)
          .order('last_read_at', { ascending: false });

        if (error) throw error;

        setReadingItems(data as ReadingItem[]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch reading history');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchReadingHistory();
    }
  }, [userId]);

  return { readingItems, loading, error };
};
