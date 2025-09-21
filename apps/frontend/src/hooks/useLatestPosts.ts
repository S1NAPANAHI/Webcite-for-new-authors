import { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared';

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
  reading_time?: number;
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
            tags,
            reading_time
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);

        if (fetchError) {
          console.error('Error fetching posts:', fetchError);
          // Use mock data if database fails
          setPosts(getMockPosts(limit));
        } else {
          setPosts(data || []);
        }
      } catch (err) {
        console.error('Error fetching latest posts:', err);
        setError('Failed to load latest news');
        // Use mock data as fallback
        setPosts(getMockPosts(limit));
      } finally {
        setLoading(false);
      }
    }

    fetchLatestPosts();
  }, [limit]);

  return { posts, loading, error };
}

// Mock data for development/fallback
function getMockPosts(limit: number): BlogPost[] {
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Ancient Wisdom of Zoroaster: A Journey Through Time',
      excerpt: 'Explore the profound teachings of Zoroaster and their relevance in modern times. Discover how ancient wisdom shapes our understanding of good versus evil.',
      content: 'The teachings of Zoroaster have shaped civilizations for over 3,000 years. In this comprehensive exploration, we delve into the core principles of Zoroastrianism and examine how these ancient beliefs continue to influence modern thought and spirituality.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Dr. Sarah Mirza',
      published_at: new Date(Date.now() - 86400000).toISOString(),
      views: 1247,
      likes_count: 89,
      comments_count: 23,
      slug: 'ancient-wisdom-of-zoroaster',
      tags: ['History', 'Philosophy', 'Religion'],
      reading_time: 8
    },
    {
      id: '2',
      title: 'Fire Temples: Sacred Architecture of the Zoroastrian Faith',
      excerpt: 'An architectural journey through the sacred fire temples that have served as centers of worship for thousands of years.',
      content: 'Fire temples represent the heart of Zoroastrian worship. These sacred structures, with their eternal flames, tell stories of devotion, community, and architectural brilliance spanning millennia.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Prof. Jamshid Rostami',
      published_at: new Date(Date.now() - 172800000).toISOString(),
      views: 2156,
      likes_count: 134,
      comments_count: 67,
      slug: 'fire-temples-sacred-architecture',
      tags: ['Architecture', 'Sacred Sites', 'Culture'],
      reading_time: 12
    },
    {
      id: '3',
      title: 'The Gathas: Poetry of Divine Inspiration',
      excerpt: 'Dive into the beautiful hymns composed by Zoroaster himself, exploring their poetic structure and spiritual significance.',
      content: 'The Gathas represent the oldest part of the Avesta and contain the direct words of Zoroaster. These seventeen hymns offer profound insights into the prophet\'s teachings and relationship with Ahura Mazda.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Dr. Farah Kermani',
      published_at: new Date(Date.now() - 259200000).toISOString(),
      views: 892,
      likes_count: 67,
      comments_count: 31,
      slug: 'gathas-poetry-divine-inspiration',
      tags: ['Scripture', 'Poetry', 'Theology'],
      reading_time: 15
    },
    {
      id: '4',
      title: 'Modern Zoroastrian Communities Around the World',
      excerpt: 'Meet the vibrant Zoroastrian communities that keep ancient traditions alive in our modern world.',
      content: 'From Mumbai to Toronto, London to Tehran, Zoroastrian communities continue to thrive while preserving their ancient heritage. This article explores how modern Zoroastrians navigate tradition and contemporary life.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Reza Dalal',
      published_at: new Date(Date.now() - 345600000).toISOString(),
      views: 1683,
      likes_count: 203,
      comments_count: 89,
      slug: 'modern-zoroastrian-communities',
      tags: ['Community', 'Modern Life', 'Global'],
      reading_time: 10
    },
    {
      id: '5',
      title: 'The Symbolism of Light and Darkness in Zoroastrian Thought',
      excerpt: 'Understanding the fundamental dualism that forms the core of Zoroastrian theology and its impact on world religions.',
      content: 'The eternal struggle between light and darkness, good and evil, forms the foundation of Zoroastrian thought. This exploration examines how this dualistic worldview has influenced major world religions and philosophical systems.',
      featured_image: '/api/placeholder/1200/600',
      author: 'Prof. Cyrus Bahram',
      published_at: new Date(Date.now() - 432000000).toISOString(),
      views: 756,
      likes_count: 45,
      comments_count: 18,
      slug: 'symbolism-light-darkness',
      tags: ['Theology', 'Symbolism', 'Philosophy'],
      reading_time: 7
    }
  ];

  return mockPosts.slice(0, limit);
}