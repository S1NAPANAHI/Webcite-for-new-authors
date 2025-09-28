/**
 * Fixed LatestPosts component with comprehensive null safety for image URLs
 * This prevents the "Cannot read properties of null (reading 'replace')" error
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogImageUrl, processBlogPostsImages } from '../../utils/imageUtils';

// Types for better TypeScript support
interface BlogPost {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  slug: string;
  created_at: string;
  updated_at?: string;
  published_at?: string;
  image_url?: string | null;
  cover_image?: string | null;
  featured_image?: string | null;
  author?: {
    id: string;
    name: string;
    avatar_url?: string;
  } | null;
  reading_time?: number;
  published?: boolean;
}

interface LatestPostsProps {
  supabaseClient?: any;
  limit?: number;
  showImages?: boolean;
  showExcerpts?: boolean;
  fallbackMode?: boolean;
  className?: string;
}

// Fallback data for when API fails
const FALLBACK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Welcome to the Zoroasterverse',
    excerpt: 'Discover the ancient wisdom of Zarathustra and explore the rich tapestry of Persian mythology in our literary universe.',
    slug: 'welcome-to-zoroasterverse',
    created_at: new Date().toISOString(),
    image_url: null, // This will use fallback image
    author: {
      id: '1',
      name: 'Sina Panahi'
    }
  },
  {
    id: '2',
    title: 'The Sacred Fire of Truth',
    excerpt: 'Understanding the symbolism and significance of fire in Zoroastrian teachings.',
    slug: 'sacred-fire-of-truth',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    image_url: null,
    author: {
      id: '1',
      name: 'Sina Panahi'
    }
  },
  {
    id: '3',
    title: 'Good Thoughts, Good Words, Good Deeds',
    excerpt: 'The foundational principles that guide every aspect of Zoroastrian life and philosophy.',
    slug: 'good-thoughts-words-deeds',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    image_url: null,
    author: {
      id: '1',
      name: 'Sina Panahi'
    }
  }
];

export const LatestPosts: React.FC<LatestPostsProps> = ({ 
  supabaseClient, 
  limit = 5,
  showImages = true,
  showExcerpts = true,
  fallbackMode = false,
  className = ''
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(fallbackMode);

  console.log('🎨 LatestPosts: Rendering', limit, 'posts (fallback:', useFallback, ', loading:', loading, ')');

  useEffect(() => {
    if (useFallback || !supabaseClient) {
      console.log('🎨 LatestPosts: Using fallback data (no Supabase client or fallback mode)');
      const processedFallback = processBlogPostsImages(FALLBACK_POSTS);
      setPosts(processedFallback);
      setLoading(false);
      return;
    }

    fetchBlogPosts();
  }, [supabaseClient, limit, useFallback]);

  const fetchBlogPosts = async () => {
    console.log('🚀 LatestPosts: Starting comprehensive blog posts fetch...');
    console.log('🔍 LatestPosts: Props analysis:', {
      hasSupabaseClient: !!supabaseClient,
      limit,
      fallbackMode: useFallback
    });

    if (!supabaseClient) {
      console.warn('⚠️ LatestPosts: No Supabase client provided, using fallback');
      const processedFallback = processBlogPostsImages(FALLBACK_POSTS);
      setPosts(processedFallback);
      setLoading(false);
      return;
    }

    try {
      console.log('✅ LatestPosts: Supabase client found! Testing connection...');
      
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabaseClient
        .from('blog_posts')
        .select('count', { count: 'exact', head: true });
      
      if (testError) {
        console.error('❌ LatestPosts: Database connection test failed:', testError);
        throw testError;
      }

      console.log('✅ LatestPosts: Database connection successful, fetching posts...');
      
      // Fetch blog posts with author information
      const { data, error } = await supabaseClient
        .from('blog_posts')
        .select(`
          id,
          title,
          content,
          excerpt,
          slug,
          created_at,
          updated_at,
          published_at,
          image_url,
          cover_image,
          featured_image,
          reading_time,
          published,
          author:profiles(id, full_name)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      console.log('📥 LatestPosts: Database query result:', {
        data: data ? `${data.length} posts` : 'null',
        error: error ? error.message : 'none'
      });

      if (error) {
        console.error('❌ LatestPosts: Database query failed:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ LatestPosts: No posts found in database, using fallback');
        const processedFallback = processBlogPostsImages(FALLBACK_POSTS);
        setPosts(processedFallback);
      } else {
        console.log('🎉 LatestPosts: SUCCESS! Found real blog posts, replacing fallback!');
        
        // Process posts to ensure safe image URLs
        const processedPosts = processBlogPostsImages(data.map(post => ({
          ...post,
          author: post.author ? {
            id: post.author.id,
            name: post.author.full_name || 'Anonymous'
          } : null
        })));
        
        console.log('📝 LatestPosts: Post titles:', processedPosts.map(p => p.title));
        setPosts(processedPosts);
      }

      setError(null);
      console.log('🏁 LatestPosts: Fetch process completed');

    } catch (fetchError: any) {
      console.error('❌ LatestPosts: Fetch failed, using fallback:', fetchError);
      setError(fetchError.message || 'Failed to fetch blog posts');
      
      // Use fallback data when fetch fails
      const processedFallback = processBlogPostsImages(FALLBACK_POSTS);
      setPosts(processedFallback);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  const getPostUrl = (post: BlogPost) => {
    // Try different possible URL patterns
    if (post.slug) {
      return `/blog/${post.slug}`;
    }
    return `/blog/post/${post.id}`;
  };

  const truncateText = (text: string | undefined | null, limit: number = 150): string => {
    if (!text) return 'Click to read more...';
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + '...';
  };

  console.log('🎨 LatestPosts: Rendering', posts.length, 'posts (fallback:', useFallback, ', loading:', loading, ')');

  if (loading) {
    return (
      <div className={`latest-posts ${className}`}>
        <div className="text-center py-8">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-500 bg-white dark:bg-gray-800 dark:text-blue-400 transition ease-in-out duration-150">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading latest posts...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`latest-posts ${className}`}>
      {error && !useFallback && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            ⚠️ Using offline content (connection issue): {error}
          </p>
        </div>
      )}
      
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No blog posts available at the moment.</p>
          <p className="text-sm mt-2">Check back soon for new content!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:gap-8">
          {posts.map((post) => {
            const safeImageUrl = getBlogImageUrl(post.image_url || post.cover_image || post.featured_image);
            
            return (
              <article key={post.id} className="flex flex-col md:flex-row gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                {showImages && (
                  <div className="md:w-1/3 flex-shrink-0">
                    <Link to={getPostUrl(post)} className="block">
                      <img
                        src={safeImageUrl}
                        alt={post.title || 'Blog post image'}
                        className="w-full h-48 md:h-32 object-cover rounded-lg hover:opacity-90 transition-opacity duration-200"
                        onError={(e) => {
                          console.warn('🖼️ LatestPosts: Image load failed for post:', post.title);
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/default-blog-cover.jpg';
                        }}
                      />
                    </Link>
                  </div>
                )}
                
                <div className={`flex-1 ${showImages ? 'md:w-2/3' : 'w-full'}`}>
                  <header className="mb-2">
                    <h3 className="text-xl font-bold mb-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200">
                      <Link to={getPostUrl(post)}>
                        {post.title || 'Untitled Post'}
                      </Link>
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {post.author?.name && (
                        <span className="mr-4">By {post.author.name}</span>
                      )}
                      <time dateTime={post.created_at}>
                        {formatDate(post.created_at)}
                      </time>
                      {post.reading_time && (
                        <span className="ml-4">{post.reading_time} min read</span>
                      )}
                    </div>
                  </header>
                  
                  {showExcerpts && (
                    <div className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {truncateText(post.excerpt || post.content, 150)}
                      </p>
                    </div>
                  )}
                  
                  <footer>
                    <Link 
                      to={getPostUrl(post)} 
                      className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors duration-200"
                    >
                      Read more
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </footer>
                </div>
              </article>
            );
          })}
        </div>
      )}
      
      {posts.length > 0 && (
        <div className="text-center mt-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            View all posts
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LatestPosts;