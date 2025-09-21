import NewsCarousel from '../components/NewsCarousel';
import { useLatestPosts } from '../hooks/useLatestPosts';
import React, { useState, useEffect } from 'react';
import { HomePage as UIHomePage, type HomepageContentItem, type Post, type ReleaseItem } from '@zoroaster/ui';
import { supabase } from '@zoroaster/shared';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ArrowRight, Calendar, User, Clock, Eye, BookOpen, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  created_at: string;
  views?: number;
  likes_count?: number;
  comments_count?: number;
  tags?: string[];
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
}

// Data fetching functions
const fetchHomepageContent = async (): Promise<HomepageContentItem[]> => {
  const { data, error } = await supabase.from('homepage_content').select('*');
  if (error) throw new Error(error.message);
  return data as HomepageContentItem[];
};

const fetchReleaseItems = async (): Promise<ReleaseItem[]> => {
  const { data, error } = await supabase.from('release_items').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as ReleaseItem[];
};

// ✅ NEW: Fetch latest blog posts for homepage
const fetchLatestBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('🔄 Fetching latest blog posts for homepage...');
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3); // Show latest 3 posts on homepage

  if (error) {
    console.error('❌ Error fetching blog posts:', error);
    throw new Error(error.message);
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
      category: tags.length > 0 ? tags[0] : 'Uncategorized',
      author: post.author || 'Zoroastervers Team',
      featured_image: post.featured_image || post.cover_url
    };
  });

  console.log('✅ Processed blog posts for homepage:', processedPosts);
  return processedPosts;
};

// Homepage wrapper component
const HomePage: React.FC = () => {
  const [spinsLeft, setSpinsLeft] = useState(3);

  // Fetch data using React Query
  const { data: homepageData, isLoading: isLoadingHomepage, isError: isErrorHomepage } = useQuery<HomepageContentItem[]>({ 
    queryKey: ['homepageContent'], 
    queryFn: fetchHomepageContent 
  });
  
  const { data: releaseData, isLoading: isLoadingReleases, isError: isErrorReleases } = useQuery<ReleaseItem[]>({ 
    queryKey: ['releaseItems'], 
    queryFn: fetchReleaseItems 
  });

  // ✅ NEW: Fetch latest blog posts for homepage
  const { data: latestBlogPosts, isLoading: isLoadingBlog, isError: isErrorBlog } = useQuery<BlogPost[]>({
    queryKey: ['homepageBlogPosts'],
    queryFn: fetchLatestBlogPosts,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  // Fetch user's spin count
  useEffect(() => {
    const fetchSpins = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSpinsLeft(0);
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('daily_spins')
        .select('*')
        .eq('user_id', user.id)
        .eq('spin_date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching daily spins:', error);
        setSpinsLeft(0);
        return;
      }

      if (data) {
        setSpinsLeft(3 - data.spin_count);
      } else {
        setSpinsLeft(3);
        // Create a new entry for today
        const { error: insertError } = await supabase
          .from('daily_spins')
          .insert({ user_id: user.id, spin_date: today, spin_count: 0 });
        if (insertError) {
          console.error('Error inserting new daily spin entry:', insertError);
        }
      }
    };

    fetchSpins();
  }, []);

  // Handle spin action
  const handleSpin = async (spinCount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const today = new Date().toISOString().slice(0, 10);
      const { error } = await supabase
        .from('daily_spins')
        .upsert({ user_id: user.id, spin_date: today, spin_count: spinCount }, { onConflict: 'user_id, spin_date' });
      if (error) {
        console.error('Error updating daily spin count:', error);
      }
    }
  };

  const { posts: latestPosts, loading: postsLoading } = useLatestPosts(5);

  // ✅ NEW: Helper functions for blog posts
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

  const isLoading = isLoadingHomepage || postsLoading || isLoadingReleases || isLoadingBlog;
  const isError = isErrorHomepage || false || isErrorReleases || isErrorBlog;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Your existing hero content */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Welcome to <span className="text-amber-600 dark:text-amber-400">Zoroasterverse</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the ancient wisdom of Zoroastrianism and its profound impact on modern thought, 
            philosophy, and spiritual understanding.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/blog"
              className="px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Explore Articles
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-amber-600 text-amber-600 dark:text-amber-400 font-semibold rounded-lg hover:bg-amber-600 hover:text-white transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Featured Latest Post Preview */}
          {latestBlogPosts && latestBlogPosts.length > 0 && (
            <div className="mt-16 max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    ✨ Latest Article
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(latestBlogPosts[0].published_at)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  <Link 
                    to={`/blog/${latestBlogPosts[0].slug}`}
                    className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {latestBlogPosts[0].title}
                  </Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                  {latestBlogPosts[0].excerpt || latestBlogPosts[0].content?.substring(0, 100) + '...'}
                </p>
                <Link
                  to={`/blog/${latestBlogPosts[0].slug}`}
                  className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium"
                >
                  Read Article
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ✅ UPDATED: Latest News & Updates - Real Blog Posts */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest News & Updates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay informed with our latest insights, discoveries, and thoughts from the Zoroasterverse
            </p>
          </div>

          {isLoadingBlog ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : !latestBlogPosts || latestBlogPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No blog posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Check back soon for the latest insights and updates
              </p>
              <Link
                to="/admin/content/blog/new"
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Create First Post
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {latestBlogPosts.map((post, index) => (
                  <article 
                    key={post.id}
                    className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                      index === 0 && latestBlogPosts.length > 1 ? 'lg:col-span-1' : ''
                    }`}
                  >
                    {/* Featured badge for latest post */}
                    {index === 0 && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 text-xs font-semibold text-white bg-amber-600 rounded-full">
                          ✨ Latest
                        </span>
                      </div>
                    )}

                    {/* Cover image */}
                    {post.featured_image ? (
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/400/250';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white" />
                      </div>
                    )}
                    
                    <div className="p-6">
                      {/* Category/First Tag */}
                      {post.tags && post.tags.length > 0 && (
                        <span className="inline-block px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
                          📁 {post.tags[0]}
                        </span>
                      )}
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
                        {post.excerpt || post.content?.substring(0, 120) + '...'}
                      </p>
                      
                      {/* Metadata with proper spacing */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {calculateReadTime(post.content)}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views || 0}
                        </span>
                      </div>
                      
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors text-sm"
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* View All Blog Posts Button */}
              <div className="text-center">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-3 bg-amber-600 text-white px-8 py-4 rounded-lg hover:bg-amber-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  <BookOpen className="w-5 h-5" />
                  Explore All Articles
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  {latestBlogPosts?.length > 0 && `${latestBlogPosts.length} latest articles shown • `}
                  <Link to="/blog" className="text-amber-600 dark:text-amber-400 hover:underline">
                    View all {latestBlogPosts?.length > 3 ? 'articles' : 'content'}
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Your existing sections... */}
      {/* Keep your existing UIHomePage or other sections here */}
      {!isLoading && !isError && (
        <UIHomePage 
          posts={latestPosts} 
          content={homepageData || []} 
          releases={releaseData || []} 
          spinsLeft={spinsLeft} 
          onSpin={handleSpin} 
        />
      )}
    </div>
  );
};

export default HomePage;