/**
 * BULLETPROOF LatestPosts component with comprehensive error handling
 * This prevents ALL database errors, null data errors, and image processing errors
 * 
 * CRITICAL FIXES:
 * - Handles database query failures (400 Bad Request) gracefully
 * - Prevents getPublicUrl(null) errors with safe image utilities
 * - Robust null/undefined data handling
 * - Enhanced error boundaries and fallback states
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@nextui-org/react';
import { CalendarIcon, EyeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { homepageManager } from '../../lib/HomepageManager';
import { getBlogImageUrl, processBlogPostsImages } from '../../utils/imageUtils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string | null;
  cover_url?: string | null;
  image_url?: string | null;
  author: string;
  category: string;
  published_at: string;
  views: number;
  reading_time: number;
  status: string;
}

const LatestPosts: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasTriedFetch, setHasTriedFetch] = useState(false);

  const fetchLatestPosts = async (attempt: number = 1) => {
    try {
      console.log(`📰 LatestPosts (attempt ${attempt}): Fetching latest blog posts...`);
      setLoading(true);
      setError(null);

      // CRITICAL: Check if homepageManager has the required method
      if (typeof homepageManager?.getLatestBlogPosts !== 'function') {
        throw new Error('HomepageManager getLatestBlogPosts method not available');
      }

      const response = await homepageManager.getLatestBlogPosts(5);
      
      // BULLETPROOF: Handle ALL possible response states
      if (!response) {
        throw new Error('No response from homepage manager');
      }

      if (response.error) {
        console.error('❌ LatestPosts: Database error:', response.error);
        throw new Error(response.error.message || 'Database query failed');
      }

      // CRITICAL: Handle various data states
      let safeData: BlogPost[] = [];
      
      if (response.data === null || response.data === undefined) {
        console.warn('⚠️ LatestPosts: Response data is null/undefined');
        safeData = [];
      } else if (!Array.isArray(response.data)) {
        console.warn('⚠️ LatestPosts: Response data is not an array:', typeof response.data);
        safeData = [];
      } else {
        // CRITICAL FIX: Process all posts through safe image utilities
        try {
          safeData = processBlogPostsImages(response.data);
          console.log('✅ LatestPosts: Successfully processed posts with safe images:', safeData.length);
        } catch (imageError) {
          console.error('❌ LatestPosts: Error processing images, using raw data:', imageError);
          safeData = response.data || [];
        }
      }
      
      setPosts(safeData);
      setHasTriedFetch(true);
      
    } catch (err) {
      console.error(`❌ LatestPosts (attempt ${attempt}): Error:`, err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to load blog posts';
      
      // Enhanced error handling with retry logic
      if (attempt < 3 && !errorMessage.includes('not available')) {
        console.log(`🔄 LatestPosts: Retrying in 2 seconds (attempt ${attempt + 1}/3)...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchLatestPosts(attempt + 1);
        }, 2000);
        return; // Don't set error state yet, we're retrying
      }
      
      setError(errorMessage);
      setPosts([]);
      setHasTriedFetch(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const handleRetry = () => {
    setRetryCount(0);
    setHasTriedFetch(false);
    fetchLatestPosts();
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'No date';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.warn('📅 LatestPosts: Error formatting date:', dateString, error);
      return 'Invalid date';
    }
  };

  // Loading state with skeleton
  if (loading && !hasTriedFetch) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discovering the latest tales from the Zoroastervers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-96 animate-pulse">
                <CardHeader className="p-0">
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                </CardHeader>
                <CardBody className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Stories</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-lg mx-auto">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-red-800 font-semibold mb-2 text-lg">Unable to Load Stories</h3>
              <p className="text-red-600 text-sm mb-6 leading-relaxed">{error}</p>
              {retryCount > 0 && (
                <p className="text-red-500 text-xs mb-4">
                  Failed after {retryCount + 1} attempts
                </p>
              )}
              <div className="space-x-3">
                <Button 
                  color="danger" 
                  variant="flat" 
                  size="sm"
                  onClick={handleRetry}
                  disabled={loading}
                >
                  {loading ? 'Retrying...' : 'Try Again'}
                </Button>
                <Button 
                  as={Link}
                  to="/blog"
                  variant="bordered" 
                  size="sm"
                >
                  Visit Blog
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state - no posts available
  if (!posts || posts.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Stories</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-gray-700 font-semibold mb-2">No Stories Yet</h3>
              <p className="text-gray-600 text-sm mb-6">No blog posts are available at the moment.</p>
              <p className="text-gray-500 text-xs mb-4">
                Check back soon for new content from the Zoroastervers!
              </p>
              <Button 
                as={Link}
                to="/blog"
                color="primary" 
                variant="flat" 
                size="sm"
              >
                Visit Blog Page
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Success state - render posts
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest tales from the ancient world of Zoroaster
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => {
            // BULLETPROOF: Safe image URL handling with multiple fallbacks
            let safeImageUrl: string;
            try {
              safeImageUrl = getBlogImageUrl(
                post.featured_image || post.cover_url || post.image_url
              );
            } catch (imageError) {
              console.warn('🖼️ LatestPosts: Error getting image URL for post:', post.title, imageError);
              safeImageUrl = '/images/default-blog-cover.jpg';
            }
            
            console.log('🖼️ LatestPosts: Rendering post with safe image:', {
              postId: post.id,
              postTitle: post.title,
              originalImage: post.featured_image,
              safeImageUrl: safeImageUrl
            });
            
            return (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    {/* BULLETPROOF: Always use safe image URL with comprehensive error handling */}
                    <img
                      src={safeImageUrl}
                      alt={post.title || 'Blog post image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.warn('🖼️ LatestPosts: Image failed to load, using final fallback:', safeImageUrl);
                        // Ultimate fallback if even the safe URL fails
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/images/default-blog-cover.jpg') {
                          target.src = '/images/default-blog-cover.jpg';
                        }
                      }}
                      onLoad={() => {
                        console.log('✅ LatestPosts: Image loaded successfully for:', post.title);
                      }}
                    />
                    
                    {post.category && (
                      <Chip 
                        className="absolute top-3 left-3 bg-primary/90 text-white" 
                        size="sm"
                      >
                        {post.category}
                      </Chip>
                    )}
                  </div>
                </CardHeader>
                
                <CardBody className="p-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title || 'Untitled Post'}
                  </h3>
                  
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    {post.published_at && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                    )}
                    
                    {post.reading_time && post.reading_time > 0 && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{post.reading_time} min</span>
                      </div>
                    )}
                    
                    {post.views && post.views > 0 && (
                      <div className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4 flex-shrink-0" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </CardBody>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    as={Link}
                    to={`/blog/${post.slug || post.id}`}
                    variant="flat" 
                    color="primary" 
                    size="sm"
                    className="w-full"
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button 
            as={Link}
            to="/blog"
            color="primary" 
            variant="bordered" 
            size="lg"
          >
            View All Stories
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;