import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Database, Json } from '../database.types'; // Added Json import

interface ReadingItem {
  added_at: string;
  average_rating: number;
  completed_chapters: number;
  completion_percentage: number;
  content_description: string;
  content_item_id: string;
  content_slug: string;
  content_title: string;
  cover_image_url: string;
  is_favorite: boolean;
  item_type: 'book' | 'article' | 'other'; // Assuming this is the enum
  library_id: string;
  metadata: Json;
  overall_progress: number;
  personal_rating: number;
  rating_count: number;
  total_chapters: number;
  // Custom fields
  author: string; // Placeholder
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
        type GetUserLibraryWithProgressResult = Database['public']['Functions']['get_user_library_with_progress']['Returns'][number];

        const { data, error } = await supabase
          .rpc('get_user_library_with_progress', { user_id: userId })
          .select('added_at, average_rating, completed_chapters, completion_percentage, content_description, content_item_id, content_slug, content_title, cover_image_url, is_favorite, item_type, library_id, metadata, overall_progress, personal_rating, rating_count, total_chapters')
          .order('added_at', { ascending: false });

        if (error) throw error;

        const validData: GetUserLibraryWithProgressResult[] = data || [];

        const mappedData: ReadingItem[] = validData.map(item => ({
          ...item,
          author: 'Unknown', // Add custom field
          item_type: item.item_type as ReadingItem['item_type'],
        }));

        setReadingItems(mappedData);
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
