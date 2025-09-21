import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import { supabase } from '../lib/supabaseClient';

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
  featured_image?: string;
  cover_url?: string;
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

// Professional fallback posts
const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 'sample-1',
    title: 'Welcome to Zoroasterverse: Your Gateway to Ancient Wisdom',
    slug: 'welcome-to-zoroasterverse',
    excerpt: 'Discover the profound teachings of Zoroaster and explore how this ancient religion continues to inspire modern seekers of truth and wisdom.',
    content: 'Welcome to Zoroasterverse, where ancient wisdom meets modern understanding.',
    featured_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
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
    featured_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
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
    featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
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
    featured_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
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
    featured_image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop',
    author: 'Dr. Rostam Yazdi',
    category: 'History',
    published_at: new Date(Date.now() - 345600000).toISOString(),
    views: 1156,
    reading_time: 10
  }
];

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
        
        // Try multiple ways to get Supabase client
        let client = supabaseClient || supabase;
        console.log('📋 LatestPosts: Supabase from prop/singleton:', !!client);
        
        // Try global window
        if (!client && typeof window !== 'undefined') {
          client = (window as any).__supabase || (window as any).supabase;
          console.log('📋 LatestPosts: Supabase from window:', !!client);
        }
        
        // Try dynamic import as last resort
        if (!client) {
          try {
            const sharedModule = await import('@zoroaster/shared');
            client = sharedModule.supabase;
            console.log('📋 LatestPosts: Supabase from import:', !!client);
          } catch (importError) {
            console.log('⚠️ LatestPosts: Could not import from @zoroaster/shared:', importError);
          }
        }
        
        if (!client) {
          console.log('❌ LatestPosts: No Supabase client available anywhere');
          setDebugInfo('No Supabase client available');
          setLoading(false);
          return;
        }

        console.log('✅ LatestPosts: Supabase client found! Testing connection...');
        setDebugInfo('Supabase client found, querying database...');

        // Query the blog_posts table
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
          errorMessage: error?.message,
          firstPostTitle: data?.[0]?.title,
          firstPostStatus: data?.[0]?.status
        });

        if (error) {
          console.error('❌ LatestPosts: Database error:', error);
          setDebugInfo(`Database error: ${error.message}`);
          // Keep fallback posts
        } else if (data && data.length > 0) {
          console.log('🎉 LatestPosts: SUCCESS! Found real blog posts, replacing fallback!');
          console.log('📝 LatestPosts: Post titles:', data.map(p => p.title));
          setPosts(data as BlogPost[]);
          setUsingFallback(false);
          setDebugInfo(`Successfully loaded ${data.length} real posts`);
        } else {
          console.log('⚠️ LatestPosts: No published posts found in database');
          setDebugInfo('No published posts found');
          // Keep fallback posts
        }
      } catch (error) {
        console.error('💥 LatestPosts: Critical error:', error);
        setDebugInfo(`Critical error: ${(error as Error).message}`);
        // Keep fallback posts
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
    <div>
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
      
      {/* Swiper Carousel */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            nextEl: '.custom-swiper-button-next',
            prevEl: '.custom-swiper-button-prev',
          }}
          pagination={{
            el: '.custom-swiper-pagination',
            clickable: true,
            bulletClass: `swiper-pagination-bullet ${
              isDark ? 'bg-gray-600' : 'bg-gray-300'
            }`,
            bulletActiveClass: `swiper-pagination-bullet-active ${
              isDark ? 'bg-orange-500' : 'bg-orange-600'
            }`
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
            1280: {
              slidesPerView: Math.min(posts.length, 4),
              spaceBetween: 32,
            }
          }}
          className="latest-posts-swiper"
        >
          {posts.map((post, index) => {
            const readingTime = getReadingTime(post.content, post.reading_time);
            const imageUrl = post.featured_image || post.cover_url;
            
            return (
              <SwiperSlide key={post.id}>
                <article className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 group cursor-pointer h-full ${
                  isDark ? 'bg-gray-800 hover:shadow-2xl hover:shadow-orange-500/10' : 'bg-white hover:shadow-xl'
                }`}>
                  {/* Featured Image */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-400 to-red-500">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    
                    {/* Latest badge */}
                    {index === 0 && !usingFallback && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ✨ LATEST
                      </div>
                    )}
                    
                    {/* Category badge */}
                    {post.category && (
                      <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className={`text-sm mb-4 line-clamp-3 flex-1 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {post.excerpt || (post.content.length > 120 ? post.content.substring(0, 120) + '...' : post.content)}
                    </p>

                    {/* Meta info */}
                    <div className={`flex flex-wrap items-center gap-2 text-xs mb-4 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span className="flex items-center gap-1">
                        👤 {post.author || 'Zoroasterverse Team'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        📅 {formatDate(post.published_at)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        ⏱️ {readingTime}m read
                      </span>
                      {post.views && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            👁️ {post.views} views
                          </span>
                        </>
                      )}
                    </div>

                    {/* Read more link */}
                    <Link 
                      to={usingFallback ? '/blog' : `/blog/${post.slug}`}
                      className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors group-hover:underline"
                    >
                      {usingFallback ? 'Explore Blog' : 'Read Full Article'}
                      <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <div className={`custom-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
          isDark ? 'bg-gray-800 text-orange-400 hover:bg-gray-700 border border-gray-600' : 'bg-white text-orange-600 hover:bg-orange-50 shadow-lg'
        }`}>
          ←
        </div>
        <div className={`custom-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
          isDark ? 'bg-gray-800 text-orange-400 hover:bg-gray-700 border border-gray-600' : 'bg-white text-orange-600 hover:bg-orange-50 shadow-lg'
        }`}>
          →
        </div>

        {/* Custom Pagination */}
        <div className="custom-swiper-pagination flex justify-center mt-8"></div>
      </div>
      
      {/* Explore all articles CTA */}
      <div className="text-center mt-12">
        <Link 
          to="/blog"
          className={`inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            isDark ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white' : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white'
          }`}
        >
          🔥 Explore All Articles
          <span>→</span>
        </Link>
        
        <p className={`mt-4 text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {usingFallback ? 'Sample content shown' : `Latest ${posts.length} articles`} from your blog
          {usingFallback && (
            <span className={`block mt-2 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              💡 You have real blog posts! They'll appear here once the data connection is established.
            </span>
          )}
        </p>
      </div>

      {/* Custom CSS for dark mode Swiper */}
      <style jsx>{`
        .latest-posts-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          margin: 0 6px;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .latest-posts-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
        }
        ${isDark ? `
          .latest-posts-swiper .swiper-pagination-bullet {
            background: #4B5563 !important;
          }
          .latest-posts-swiper .swiper-pagination-bullet-active {
            background: #F97316 !important;
          }
        ` : `
          .latest-posts-swiper .swiper-pagination-bullet {
            background: #D1D5DB !important;
          }
          .latest-posts-swiper .swiper-pagination-bullet-active {
            background: #EA580C !important;
          }
        `}
      `}</style>
    </div>
  );
};

export default LatestPosts;