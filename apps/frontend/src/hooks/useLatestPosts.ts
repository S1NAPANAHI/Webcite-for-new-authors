import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author?: string;
  published_at: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  slug: string;
  tags?: string[];
}

export function useLatestPosts(limit: number = 5) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select(`
            id,
            title,
            excerpt,
            content,
            featured_image,
            author,
            published_at,
            views,
            likes_count,
            comments_count,
            slug,
            tags
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);

        if (fetchError) throw fetchError;

        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching latest posts:', err);
        setError('Failed to load latest news');
      } finally {
        setLoading(false);
      }
    }

    fetchLatestPosts();
  }, [limit]);

  return { posts, loading, error };
}