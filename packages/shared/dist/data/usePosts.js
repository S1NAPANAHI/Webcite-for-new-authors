import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
export const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from('posts')
                .select('id, title, slug, content, created_at, excerpt')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching posts:', error);
                setError(error.message);
            }
            else {
                setPosts(data || []);
            }
            setLoading(false);
        };
        fetchPosts();
    }, []);
    return { posts, loading, error };
};
export const usePost = (slug) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .single();
            if (error) {
                console.error(`Error fetching post with slug ${slug}:`, error);
                setError(error.message);
            }
            else {
                setPost(data);
            }
            setLoading(false);
        };
        if (slug) {
            fetchPost();
        }
    }, [slug]);
    return { post, loading, error };
};
//# sourceMappingURL=usePosts.js.map