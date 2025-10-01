import { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author?: string;
  published_at: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  slug: string;
  tag_names?: string[];
  reading_time?: number;
  category?: string;
  category_name?: string;
  category_color?: string;
  is_featured?: boolean;
}

// Guaranteed fallback posts using your existing schema structure
const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 'fallback-1',
    title: 'Welcome to Zoroastervers',
    slug: 'welcome-to-zoroastervers',
    excerpt: 'Discover the ancient wisdom of Zoroastrianism and its profound impact on modern spirituality and philosophy.',
    content: 'Welcome to Zoroastervers, your gateway to understanding one of the world\'s oldest monotheistic religions. Here, we explore the rich history, profound philosophy, and enduring wisdom of Zoroastrianism.',
    featured_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=400&fit=crop',
    author: 'Zoroastervers Team',
    published_at: new Date().toISOString(),
    views: 234,
    likes_count: 12,
    comments_count: 5,
    tag_names: ['Philosophy', 'Religion'],
    reading_time: 5,
    category: 'Philosophy',
    category_name: 'Philosophy',
    category_color: '#8b5cf6',
    is_featured: true
  },
  {
    id: 'fallback-2',
    title: 'The Sacred Fire: Symbol of Divine Light',
    slug: 'sacred-fire-divine-light',
    excerpt: 'Fire holds a central place in Zoroastrian worship, representing the light of Ahura Mazda and the path to truth.',
    content: 'In Zoroastrian tradition, fire is not worshipped itself but serves as a symbol of Ahura Mazda\'s light and purity. Fire temples around the world maintain this sacred flame as a focal point for prayer and meditation.',
    featured_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
    author: 'Zoroastervers Team',
    published_at: new Date(Date.now() - 86400000).toISOString(),
    views: 456,
    likes_count: 28,
    comments_count: 12,
    tag_names: ['Fire', 'Worship', 'Religion'],
    reading_time: 7,
    category: 'Religion',
    category_name: 'Religion',
    category_color: '#10b981',
    is_featured: false
  },
  {
    id: 'fallback-3',
    title: 'Good Thoughts, Good Words, Good Deeds',
    slug: 'good-thoughts-words-deeds',
    excerpt: 'The threefold path of righteousness that guides Zoroastrians in living a life aligned with truth and goodness.',
    content: 'Humata, Hukhta, Hvarshta - the foundation of Zoroastrian ethics. This principle emphasizes the importance of righteousness in thought, speech, and action as the path to spiritual fulfillment.',
    featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    author: 'Zoroastervers Team',
    published_at: new Date(Date.now() - 172800000).toISOString(),
    views: 678,
    likes_count: 45,
    comments_count: 19,
    tag_names: ['Ethics', 'Philosophy', 'Practice'],
    reading_time: 6,
    category: 'Philosophy',
    category_name: 'Philosophy',
    category_color: '#8b5cf6',
    is_featured: false
  }
];

export function useLatestPosts(limit: number = 5) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 useLatestPosts: Fetching from existing blog schema...');

        // Use your existing blog_posts_with_stats view which includes all related data
        const { data, error: fetchError } = await supabase
          .from('blog_posts_with_stats')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);

        if (fetchError) {
          console.error('useLatestPosts: Database error, using fallback posts:', fetchError);
          setPosts(FALLBACK_POSTS.slice(0, limit));
        } else if (data && data.length > 0) {
          console.log(`useLatestPosts: Found ${data.length} real posts from existing schema`);
          setPosts(data as BlogPost[]);
        } else {
          console.log('useLatestPosts: No published posts, using fallback content');
          setPosts(FALLBACK_POSTS.slice(0, limit));
        }
      } catch (err) {
        console.error('useLatestPosts: Critical error, using fallback:', err);
        setError('Failed to load latest news');
        // Always provide fallback content
        setPosts(FALLBACK_POSTS.slice(0, limit));
      } finally {
        setLoading(false);
      }
    }

    fetchLatestPosts();
  }, [limit]);

  return { posts, loading, error };
}
