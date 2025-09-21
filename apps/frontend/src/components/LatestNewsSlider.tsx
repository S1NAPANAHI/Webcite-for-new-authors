import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { ArrowRight, Calendar, User, Clock, Eye, BookOpen, TrendingUp } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_url?: string;
  featured_image?: string;
  author?: string;
  status?: string;
  published_at: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  tags?: string[];
  is_featured?: boolean;
}

export default function LatestNewsSlider() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching latest blog posts for homepage slider...');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(5); // Show latest 5 posts in slider

      if (error) {
        console.error('❌ Error fetching blog posts:', error);
        throw error;
      }

      // Process posts
      const processedPosts = (data || []).map(post => {
        let tags = [];
        try {
          if (typeof post.tags === 'string' && post.tags.startsWith('[')) {
            tags = JSON.parse(post.tags);
          } else if (Array.isArray(post.tags)) {
            tags = post.tags;
          } else if (typeof post.tags === 'string' && post.tags) {
            tags = [post.tags];
          }
        } catch {
          tags = [];
        }

        return {
          ...post,
          tags,
          category: tags.length > 0 ? tags[0] : 'News',
          author: post.author || 'Zoroastervers Team',
          featured_image: post.featured_image || post.cover_url
        };
      });
      
      setPosts(processedPosts);
      console.log(`✅ Loaded ${processedPosts.length} posts for homepage slider`);
      
    } catch (err) {
      console.error('❌ Error in fetchLatestPosts:', err);
      setError('Failed to load latest posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    if (!content) return 1;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12 min-h-[300px] items-center": 