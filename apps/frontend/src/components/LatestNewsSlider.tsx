import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { ArrowRight, Calendar, User, Clock, Eye, BookOpen, TrendingUp, Star } from 'lucide-react';

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
      <div className="flex justify-center py-12 min-h-[300px] items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-300 text-sm">Loading latest news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchLatestPosts}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No news yet!
        </h3>
        <p className="text-gray-400 mb-6">
          Blog updates will appear here once you publish your first post.
        </p>
        <Link
          to="/admin/content/blog/new"
          className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
        >
          Create First Post
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{ 
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-amber-600',
          bulletClass: 'swiper-pagination-bullet !bg-gray-400 !opacity-70'
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }}
        loop={posts.length > 1}
        autoplay={{ 
          delay: 6000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true 
        }}
        slidesPerView={1}
        spaceBetween={0}
        className="news-slider"
        style={{
          '--swiper-navigation-color': '#d97706',
          '--swiper-pagination-color': '#d97706',
        } as React.CSSProperties}
      >
        {posts.map((post, index) => (
          <SwiperSlide key={post.id}>
            <div className="relative">
              {/* Featured/Latest badges */}
              <div className="absolute top-6 left-6 z-10 flex gap-2">
                {index === 0 && (
                  <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 rounded-full shadow-lg">
                    ✨ LATEST
                  </span>
                )}
                {post.is_featured && (
                  <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
                    <Star className="w-3 h-3 inline mr-1 fill-current" />
                    FEATURED
                  </span>
                )}
              </div>

              <div className="flex flex-col lg:flex-row gap-0 bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                {/* Cover Image */}
                <div className="lg:w-1/2 relative">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-80 lg:h-96 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/600/400';
                      }}
                    />
                  ) : (
                    <div className="w-full h-80 lg:h-96 flex items-center justify-center bg-gradient-to-br from-amber-500 via-orange-500 to-red-500">
                      <BookOpen className="w-20 h-20 text-white opacity-80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  {/* Category Tag */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-amber-300 bg-amber-900/30 border border-amber-700 rounded-full">
                      📁 {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed line-clamp-3">
                    {post.excerpt || post.content?.substring(0, 150) + '...'}
                  </p>
                  
                  {/* Metadata with better spacing */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.published_at)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {calculateReadTime(post.content)}m read
                    </span>
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {post.views || 0} views
                    </span>
                  </div>
                  
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-3 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl group"
                  >
                    Read Full Article
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="swiper-button-prev !text-amber-600 !text-2xl !font-bold after:!font-black"></div>
      <div className="swiper-button-next !text-amber-600 !text-2xl !font-bold after:!font-black"></div>

      {/* View All Button */}
      <div className="text-center mt-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl text-lg"
        >
          <TrendingUp className="w-5 h-5" />
          Explore All Articles
          <ArrowRight className="w-5 h-5" />
        </Link>
        
        {posts.length > 0 && (
          <p className="text-gray-400 text-sm mt-3">
            Showing {posts.length} latest articles • 
            <Link to="/blog" className="text-amber-400 hover:text-amber-300 hover:underline ml-1">
              View all posts
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}