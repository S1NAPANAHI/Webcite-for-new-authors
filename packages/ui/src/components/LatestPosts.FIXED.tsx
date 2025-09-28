/**
 * CRITICAL FIX: LatestPosts component - NO direct getPublicUrl calls
 * This prevents the "Cannot read properties of null (reading 'replace')" error
 * ALL image URLs are processed through safe utilities ONLY
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import { supabase } from '../lib/supabaseClient';
import { getSafeImageUrl } from '@zoroaster/shared';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Blog post interface
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string | null;
  cover_url?: string | null;
  image_url?: string | null;
  author?: string;
  category?: string;
  published_at: string;
  views?: number;
  reading_time?: number;
  status?: string;
}

// Component props
interface LatestPostsProps {
  limit?: number;
  supabaseClient?: any;
}

// SAFE fallback posts with external URLs (no getPublicUrl needed)
const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 'sample-1',
    title: 'Welcome to Zoroasterverse: Your Gateway to Ancient Wisdom',
    slug: 'welcome-to-zoroasterverse',
    excerpt: 'Discover the profound teachings of Zoroaster and explore how this ancient religion continues to inspire modern seekers of truth and wisdom.',
    content: 'Welcome to Zoroasterverse, where ancient wisdom meets modern understanding.',
    featured_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&h=800&fit=crop&crop=center',
    author: 'Zoroasterverse Team',
    category: 'Philosophy',
    published_at: new Date().toISOString(),
    views: 856,
    reading_time: 8
  },
  {
    id: 'sample-2',
    title: 'The Sacred Fire: Symbol of Divine Light and Purity',
    slug: 'sacred-fire-divine-light',
    excerpt: 'Fire holds a central place in Zoroastrian worship as a symbol of Ahura Mazda\'s light and the path to truth.',
    content: 'In Zoroastrian tradition, fire serves as a symbol of purity and divine presence.',
    featured_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop&crop=center',
    author: 'Dr. Farah Kermani',
    category: 'Religion',
    published_at: new Date(Date.now() - 86400000).toISOString(),
    views: 1234,
    reading_time: 6
  },
  {
    id: 'sample-3',
    title: 'Good Thoughts, Good Words, Good Deeds: The Zoroastrian Way',
    slug: 'good-thoughts-words-deeds',
    excerpt: 'The threefold path of righteousness in Zoroastrianism emphasizes the importance of aligning our thoughts, words, and actions with truth.',
    content: 'Humata, Hukhta, Hvarshta - the foundation of Zoroastrian ethics.',
    featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=center',
    author: 'Prof. Jamshid Rostami',
    category: 'Philosophy',
    published_at: new Date(Date.now() - 172800000).toISOString(),
    views: 967,
    reading_time: 5
  },
  {
    id: 'sample-4',
    title: 'Modern Applications of Ancient Wisdom',
    slug: 'modern-applications-ancient-wisdom',
    excerpt: 'How Zoroastrian principles can guide us in contemporary challenges and ethical decision-making.',
    content: 'Ancient wisdom for modern times.',
    featured_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center',
    author: 'Sarah Mitchell',
    category: 'Modern Life',
    published_at: new Date(Date.now() - 259200000).toISOString(),
    views: 743,
    reading_time: 7
  },
  {
    id: 'sample-5',
    title: 'The History of Zoroastrianism',
    slug: 'history-of-zoroastrianism',
    excerpt: 'Tracing the origins and evolution of one of the world\'s oldest monotheistic religions.',
    content: 'A journey through time exploring Zoroastrian history.',
    featured_image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&h=800&fit=crop&crop=center',
    author: 'Dr. Rostam Yazdi',
    category: 'History',
    published_at: new Date(Date.now() - 345600000).toISOString(),
    views: 1156,
    reading_time: 10
  }
];

/**
 * CRITICAL: Safe image processing function
 * This function NEVER calls getPublicUrl directly - only uses the safe utility
 */
function processBlogPostSafely(post: any): BlogPost {
  // Use ONLY the safe image utility - never direct getPublicUrl calls
  const safeImageUrl = getSafeImageUrl(
    post.featured_image || post.cover_url || post.image_url,
    'media', // bucket name
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center' // fallback
  );
  
  console.log('🛡️ Safe image processing:', {
    title: post.title,
    originalPaths: {
      featured_image: post.featured_image,
      cover_url: post.cover_url,
      image_url: post.image_url
    },
    processedSafeUrl: safeImageUrl,
    method: 'getSafeImageUrl (no direct getPublicUrl)'
  });
  
  return {
    ...post,
    featured_image: safeImageUrl,
    cover_url: safeImageUrl,
    image_url: safeImageUrl
  };
}

// Main component
export const LatestPosts: React.FC<LatestPostsProps> = ({ 
  limit = 5, 
  supabaseClient 
}) => {
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);
  const [debugInfo, setDebugInfo] = useState('Initializing...');
  const [isDark, setIsDark] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') ||
                        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isDarkMode);
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log('🚀 LatestPosts: Starting comprehensive blog posts fetch...');
      console.log('🔍 LatestPosts: Props analysis:', {
        hasSupabaseClient: !!supabaseClient,
        supabaseClientType: typeof supabaseClient,
        limit,
        windowHasSupabase: !!(typeof window !== 'undefined' && (window as any).__supabase)
      });
      
      try {
        // Start with fallback posts for guaranteed content
        setPosts(FALLBACK_POSTS.slice(0, limit));
        setUsingFallback(true);
        setDebugInfo('Starting with fallback posts');
        
        const client = supabaseClient || supabase;
        
        if (!client) {
          console.log('❌ LatestPosts: No Supabase client available anywhere');
          setDebugInfo('No Supabase client available');
          setLoading(false);
          return;
        }

        console.log('✅ LatestPosts: Supabase client found! Testing connection...');
        setDebugInfo('Supabase client found, querying database...');

        // Database query
        const { data, error } = await client
          .from('blog_posts')
          .select(`
            id,
            title,
            slug,
            excerpt,
            content,
            featured_image,
            cover_url,
            image_url,
            author,
            category,
            published_at,
            views,
            reading_time,
            status
          `)
          .eq('status', 'published')
          .not('published_at', 'is', null)
          .order('published_at', { ascending: false })
          .limit(limit);

        console.log('📥 LatestPosts: Database query result:', {
          hasData: !!data,
          dataLength: data?.length || 0,
          hasError: !!error,
          errorMessage: error?.message
        });

        if (error) {
          console.error('❌ LatestPosts: Database error:', error);
          setDebugInfo(`Database error: ${error.message}`);
          // Keep fallback posts
        } else if (data && data.length > 0) {
          console.log('🎉 LatestPosts: SUCCESS! Found real blog posts, processing safely!');
          
          // CRITICAL: Process ALL posts through the safe function
          const processedPosts = data.map(processBlogPostSafely);
          
          console.log('✅ LatestPosts: All posts processed safely, updating state');
          setPosts(processedPosts as BlogPost[]);
          setUsingFallback(false);
          setDebugInfo(`Successfully loaded ${data.length} real posts with SAFE image processing`);
        } else {
          console.log('⚠️ LatestPosts: No published posts found in database');
          setDebugInfo('No published posts found');
          // Keep fallback posts
        }
      } catch (error) {
        console.error('💥 LatestPosts: Critical error:', error);
        setDebugInfo(`Critical error: ${(error as Error).message}`);
        // Keep fallback posts - they're already safe
      } finally {
        setLoading(false);
        console.log('🏁 LatestPosts: Fetch process completed');
      }
    };

    fetchPosts();
  }, [supabaseClient, limit]);

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  // Calculate reading time
  const getReadingTime = (content: string, reading_time?: number) => {
    if (reading_time) return reading_time;
    const words = content.split(/\s+/).length;
    return Math.max(Math.ceil(words / 200), 1);
  };

  console.log(`🎨 LatestPosts: Rendering ${posts.length} posts (fallback: ${usingFallback}, loading: ${loading})`);

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading latest articles...</p>
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>{debugInfo}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className={`mb-6 p-4 rounded-lg text-sm border ${
          isDark ? 'bg-yellow-900/20 border-yellow-700 text-yellow-200' : 'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          <strong>🔍 LatestPosts Debug:</strong> {posts.length} posts loaded, 
          Using fallback: {usingFallback ? 'Yes' : 'No'}, 
          Status: {debugInfo}
        </div>
      )}
      
      {/* Status banner for fallback content */}
      {usingFallback && (
        <div className="mb-8 text-center">
          <div className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm border ${
            isDark ? 'bg-blue-900/20 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            💡 Sample content shown - You have real blog posts available!
            <Link to="/blog" className={`${isDark ? 'text-blue-300 hover:text-blue-100' : 'text-blue-600 hover:text-blue-800'} underline font-medium ml-2`}>
              View your blog →
            </Link>
          </div>
        </div>
      )}
      
      {/* Single-Card Carousel Container */}
      <div className="relative max-w-4xl mx-auto">
        <div className={`rounded-xl shadow-2xl overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay, A11y]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              nextEl: '.custom-next-btn',
              prevEl: '.custom-prev-btn',
            }}
            pagination={{
              el: '.custom-pagination',
              clickable: true,
              bulletClass: `inline-block w-2 h-2 rounded-full mx-1 cursor-pointer transition-all duration-300 ${
                isDark ? 'bg-gray-600' : 'bg-gray-300'
              }`,
              bulletActiveClass: `${
                isDark ? 'bg-orange-500 w-6' : 'bg-orange-600 w-6'
              }`
            }}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            className="single-card-slider"
          >
            {posts.map((post, index) => {
              const readingTime = getReadingTime(post.content, post.reading_time);
              
              // SAFE: Posts are already processed through safe utilities
              const imageUrl = post.featured_image || post.cover_url || post.image_url || 
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center';
              
              console.log('🖼️ LatestPosts: Slide', index, 'image processing:', {
                postTitle: post.title,
                finalImageUrl: imageUrl,
                isAlreadyProcessed: true
              });
              
              return (
                <SwiperSlide key={post.id}>
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section - Left side */}
                    <div className="relative md:w-1/2 h-64 md:h-96 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={post.title || 'Blog post image'}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        style={{
                          minWidth: '100%',
                          minHeight: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        onLoad={() => {
                          console.log('✅ LatestPosts: Image loaded successfully for:', post.title);
                        }}
                        onError={(e) => {
                          console.warn('⚠️ LatestPosts: Image error, using fallback for:', post.title);
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center';
                        }}
                      />
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category || 'Featured'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Section - Right side */}
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                      <div className="space-y-4">
                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {post.author || 'Zoroasterverse Team'}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {readingTime} min read
                          </span>
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        
                        {/* Title */}
                        <h3 className={`text-2xl md:text-3xl font-bold leading-tight ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {post.title}
                        </h3>
                        
                        {/* Excerpt */}
                        <p className={`text-lg leading-relaxed ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </p>
                        
                        {/* Read more button */}
                        <div className="pt-4">
                          <Link
                            to={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                          >
                            Read Full Article
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                        </div>
                        
                        {/* Stats */}
                        {post.views && (
                          <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {post.views.toLocaleString()} views
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          
          {/* Custom Navigation */}
          <div className="custom-prev-btn absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg cursor-pointer transition-all duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="custom-next-btn absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg cursor-pointer transition-all duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Custom Pagination */}
        <div className="custom-pagination flex justify-center mt-6"></div>
      </div>
    </div>
  );
};