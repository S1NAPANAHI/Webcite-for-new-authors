import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
export const useHomepageContent = () => {
    const [homepageContent, setHomepageContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            }
            else {
                setHomepageContent(data || []);
            }
            setLoading(false);
        };
        fetchContent();
    }, []);
    return { homepageContent, loading, error };
};
//# sourceMappingURL=useHomepageContent.js.map