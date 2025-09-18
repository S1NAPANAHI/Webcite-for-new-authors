import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
export const useReleaseItems = () => {
    const [releaseItems, setReleaseItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchReleaseItems = async () => {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from('release_items')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching release items:', error);
                setError(error.message);
            }
            else {
                setReleaseItems(data || []);
            }
            setLoading(false);
        };
        fetchReleaseItems();
    }, []);
    return { releaseItems, loading, error };
};
//# sourceMappingURL=useReleaseItems.js.map