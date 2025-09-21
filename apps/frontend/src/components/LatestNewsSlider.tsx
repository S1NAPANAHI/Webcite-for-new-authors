import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { ArrowRight, Calendar, User, Clock, Eye, BookOpen, TrendingUp, Star, Plus } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author?: string;
  status?: string;
  published_at: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  is_featured?: boolean;
  category?: string;
  reading_time?: number;
  word_count?: number;
}

// Fallback posts for when database is empty or has issues
const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 'fallback-1',
    title: 'Welcome to Zoroasterverse: Your Gateway to Ancient Wisdom',
    slug: 'welcome-to-zoroasterverse',
    excerpt: 'Discover the profound teachings of Zoroaster and explore how this ancient religion continues to inspire modern seekers of truth and wisdom.',
    content: 'Welcome to Zoroasterverse, where ancient wisdom meets modern understanding. Zoroastrianism, one of the world\'s oldest monotheistic religions, offers profound insights into the nature of good and evil, free will, and the cosmic struggle between light and darkness.',
    featured_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&h=600&fit=crop&crop=center',
    author: 'Zoroasterverse Team',
    published_at: new Date().toISOString(),
    views: 856,
    likes_count: 42,
    comments_count: 18,
    is_featured: true,
    category: 'Philosophy',
    reading_time: 8,
    word_count: 1520
  },
  {
    id: 'fallback-2',
    title: 'The Sacred Fire: Symbol of Divine Light and Purity',
    slug: 'sacred-fire-symbol',
    excerpt: 'Fire holds a central place in Zoroastrian worship as a symbol of Ahura Mazda\'s light and the path to truth.',
    content: 'In Zoroastrian tradition, fire is not worshipped itself but serves as a symbol of Ahura Mazda\'s light and purity. Fire temples around the world maintain this sacred flame as a focal point for prayer and meditation.',
    featured_image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop&crop=center',
    author: 'Dr. Farah Kermani',
    published_at: new Date(Date.now() - 86400000).toISOString(),
    views: 1234,
    likes_count: 89,
    comments_count: 34,
    is_featured: false,
    category: 'Religion',
    reading_time: 6,
    word_count: 1200
  },
  {
    id: 'fallback-3',
    title: 'Good Thoughts, Good Words, Good Deeds: The Zoroastrian Way',
    slug: 'good-thoughts-words-deeds',
    excerpt: 'The threefold path of righteousness in Zoroastrianism emphasizes the importance of aligning our thoughts, words, and actions with truth and goodness.',
    content: 'Humata, Hukhta, Hvarshta - Good Thoughts, Good Words, Good Deeds. This fundamental principle of Zoroastrianism guides believers in living a righteous life. It emphasizes personal responsibility and the power of individual choice in the cosmic battle between good and evil.',
    featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=center',
    author: 'Prof. Jamshid Rostami',
    published_at: new Date(Date.now() - 172800000).toISOString(),
    views: 967,
    likes_count: 76,
    comments_count: 29,
    is_featured: false,
    category: 'Philosophy',
    reading_time: 5,
    word_count: 980
  }
];

export default function LatestNewsSlider() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUsingSampleData, setIsUsingSampleData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    console.log('🚀 LatestNewsSlider: Starting fetch...');
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 LatestNewsSlider: Querying blog_posts table directly...');
      
      // Query your EXISTING blog_posts table directly (not the view)
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          content,
          featured_image,
          author,
          status,
          published_at,
          views,
          likes_count,
          comments_count,
          is_featured,
          category,
          reading_time,
          word_count
        `)
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(5);

      console.log('📥 LatestNewsSlider: Database response:', { data, error });

      if (error) {
        console.error('❌ LatestNewsSlider: Database error:', error);
        console.log('🔄 LatestNewsSlider: Using fallback content due to database error');
        setPosts(FALLBACK_POSTS);
        setIsUsingSampleData(true);
        setError(`Database error: ${error.message}`);
        return;
      }

      // Check if we got real published posts
      if (data && data.length > 0) {
        console.log(`✅ LatestNewsSlider: Found ${data.length} real published blog posts!`);
        console.log('📋 LatestNewsSlider: Posts data:', data.map(p => ({ id: p.id, title: p.title, status: p.status, published_at: p.published_at })));
        setPosts(data as BlogPost[]);
        setIsUsingSampleData(false);
      } else {
        console.log('📝 LatestNewsSlider: No published posts found in database, using fallback content');
        setPosts(FALLBACK_POSTS);
        setIsUsingSampleData(true);
      }
      
    } catch (err) {
      console.error('💥 LatestNewsSlider: Critical error:', err);
      // Always ensure we show content, never leave empty
      setPosts(FALLBACK_POSTS);
      setIsUsingSampleData(true);
      setError('Connection error - showing fallback content');
    } finally {
      setLoading(false);
      console.log('🏁 LatestNewsSlider: Fetch completed');
    }
  };

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

  const calculateReadTime = (content?: string, reading_time?: number) => {
    if (reading_time) return reading_time;
    if (!content) return 3;
    const words = content.split(/\s+/).length;
    return Math.max(Math.ceil(words / 200), 1);
  };

  // Loading state
  if (loading) {
    console.log('⏳ LatestNewsSlider: Showing loading state');
    return (
      <div className="flex justify-center py-16 min-h-[400px] items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg font-medium">Loading latest news...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching the most recent articles</p>
        </div>
      </div>
    );
  }

  console.log(`🎨 LatestNewsSlider: Rendering with ${posts.length} posts (sample: ${isUsingSampleData})`);

  // At this point, we ALWAYS have content (either real or fallback)
  return (
    <div className="relative">
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-800 rounded text-sm text-gray-300">
          <strong>Debug Info:</strong> {posts.length} posts loaded, 
          Sample data: {isUsingSampleData ? 'Yes' : 'No'}
          {error && <span className="text-red-400"> | Error: {error}</span>}
        </div>
      )}

      {/* Info message for sample content */}
      {isUsingSampleData && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-600/30 rounded-lg px-4 py-2 text-blue-300 text-sm font-medium">
            <Plus className="w-4 h-4" />
            {error ? 'Showing fallback content due to error' : 'Sample content shown'} - 
            <Link to="/admin/content/blog/new" className="text-blue-200 hover:text-white underline">
              Create your first post
            </Link>
            to see real content here!
          </div>
        </div>
      )}

      {/* Always show the Swiper - guaranteed content */}
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{ 
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-amber-600',
          bulletClass: 'swiper-pagination-bullet !bg-gray-400 !opacity-70'
        }}
        navigation={{
          nextEl: '.news-slider-next',
          prevEl: '.news-slider-prev'
        }}
        loop={posts.length > 1}
        autoplay={{ 
          delay: 5000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true 
        }}
        slidesPerView={1}
        spaceBetween={0}
        className="news-slider max-w-6xl mx-auto"
      >
        {posts.map((post, index) => (
          <SwiperSlide key={post.id}>
            <div className="relative">
              {/* Badges */}
              <div className="absolute top-6 left-6 z-20 flex gap-2">
                {index === 0 && (
                  <span className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg border border-amber-400/20">
                    ✨ LATEST
                  </span>
                )}
                {post.is_featured && (
                  <span className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg border border-blue-400/20">
                    <Star className="w-3 h-3 inline mr-1 fill-current" />
                    FEATURED
                  </span>
                )}
              </div>

              {/* Main card */}
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-1/2 relative">
                    <div className="aspect-video lg:aspect-square">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&h=600&fit=crop&crop=center';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 via-orange-500 to-red-500">
                          <BookOpen className="w-24 h-24 text-white/80" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30"></div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    {/* Category */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-amber-600 rounded-full border border-amber-400/20">
                        📁 {post.category || 'News'}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                      {post.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                      {post.excerpt || (post.content ? post.content.substring(0, 160) + '...' : 'Discover more about this fascinating topic...')}
                    </p>
                    
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {post.author || 'Zoroasterverse Team'}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.published_at)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {calculateReadTime(post.content, post.reading_time)}m read
                      </span>
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {post.views || 0} views
                      </span>
                    </div>
                    
                    {/* CTA Button */}
                    <Link
                      to={isUsingSampleData ? `/blog` : `/blog/${post.slug}`}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 group text-lg"
                    >
                      {isUsingSampleData ? 'Explore Blog' : 'Read Full Article'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="news-slider-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/60 hover:bg-black/80 border border-amber-600/30 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-amber-500">
        <ArrowRight className="w-6 h-6 text-amber-400 rotate-180" />
      </div>
      <div className="news-slider-next absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/60 hover:bg-black/80 border border-amber-600/30 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-amber-500">
        <ArrowRight className="w-6 h-6 text-amber-400" />
      </div>

      {/* Bottom CTA Section */}
      <div className="text-center mt-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-10 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl text-lg group"
        >
          <TrendingUp className="w-6 h-6" />
          Explore All Articles
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <div className="mt-6">
          <p className="text-gray-400 text-sm">
            {isUsingSampleData ? 'Showing fallback content' : `Latest ${posts.length} articles`} from your blog
            {isUsingSampleData && (
              <span className="block mt-2 text-blue-400">
                💡 <Link to="/admin/content/blog/new" className="underline hover:text-blue-300 font-medium">
                  Create your first blog post
                </Link> to show your real content here
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Custom CSS for Swiper */}
      <style jsx global>{`
        .news-slider .swiper-pagination {
          bottom: -50px !important;
        }
        
        .news-slider .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          margin: 0 6px !important;
        }
        
        .news-slider .swiper-pagination-bullet-active {
          background: #d97706 !important;
          transform: scale(1.2);
        }
        
        .news-slider .swiper-navigation {
          color: #d97706 !important;
        }
      `}</style>
    </div>
  );
}