import { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
export const useReadingHistory = (userId) => {
    const [readingItems, setReadingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                if (error)
                    throw error;
                setReadingItems(data);
            }
            catch (err) {
                setError(err.message || 'Failed to fetch reading history');
            }
            finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchReadingHistory();
        }
    }, [userId]);
    return { readingItems, loading, error };
};
//# sourceMappingURL=useReadingHistory.js.map