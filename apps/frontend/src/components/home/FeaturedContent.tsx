/**
 * BULLETPROOF FeaturedContent component with comprehensive error handling
 * This prevents ALL database errors, null data errors, and image processing errors
 * 
 * CRITICAL FIXES:
 * - Handles database query failures (400 Bad Request) gracefully for both blogs and works
 * - Prevents getPublicUrl(null) errors with safe image utilities
 * - Robust null/undefined data handling
 * - Enhanced error boundaries and fallback states
 * - Graceful degradation when works table doesn't exist
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Chip } from '@nextui-org/react';
import { CalendarIcon, BookOpenIcon, UserIcon } from '@heroicons/react/24/outline';
import { homepageManager } from '../../lib/HomepageManager';
import { getBlogImageUrl, getCoverImageUrl, processBlogPostsImages } from '../../utils/imageUtils';

interface FeaturedItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  description?: string; // For works
  featured_image?: string | null;
  cover_url?: string | null;
  image_url?: string | null;
  cover_image?: string | null; // For works
  author?: string;
  category?: string;
  genre?: string; // For works
  published_at?: string;
  type: 'blog' | 'work' | 'chapter';
  views?: number;
  reading_time?: number;
}

const FeaturedContent: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasTriedFetch, setHasTriedFetch] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  const fetchFeaturedContent = async (attempt: number = 1) => {
    try {
      console.log(`✨ FeaturedContent (attempt ${attempt}): Fetching featured content...`);
      setLoading(true);
      setError(null);

      // CRITICAL: Check if homepageManager has the required methods
      if (typeof homepageManager?.getFeaturedBlogPosts !== 'function') {
        throw new Error('HomepageManager getFeaturedBlogPosts method not available');
      }

      let allFeaturedItems: FeaturedItem[] = [];
      let debugData: any = {
        attempt,
        blogPosts: { attempted: false, success: false, count: 0, error: null },
        works: { attempted: false, success: false, count: 0, error: null }
      };

      // BULLETPROOF: Get featured blog posts with comprehensive error handling
      try {
        debugData.blogPosts.attempted = true;
        console.log('📰 FeaturedContent: Fetching featured blog posts...');
        
        const blogResponse = await homepageManager.getFeaturedBlogPosts(3);
        
        if (blogResponse && !blogResponse.error && blogResponse.data) {
          // CRITICAL FIX: Process blog posts through safe image utilities
          let safeBlogPosts: FeaturedItem[] = [];
          try {
            const processedPosts = processBlogPostsImages(blogResponse.data);
            safeBlogPosts = processedPosts.map(post => ({
              ...post,
              type: 'blog' as const,
              excerpt: post.excerpt || post.content?.substring(0, 150) + '...'
            }));
            debugData.blogPosts.success = true;
            debugData.blogPosts.count = safeBlogPosts.length;
            console.log('✅ FeaturedContent: Successfully processed blog posts:', safeBlogPosts.length);
          } catch (imageError) {
            console.warn('⚠️ FeaturedContent: Error processing blog post images:', imageError);
            safeBlogPosts = (blogResponse.data || []).map((post: any) => ({
              ...post,
              type: 'blog' as const,
              featured_image: '/images/default-blog-cover.jpg',
              cover_url: '/images/default-blog-cover.jpg'
            }));
          }
          allFeaturedItems.push(...safeBlogPosts);
        } else if (blogResponse?.error) {
          debugData.blogPosts.error = blogResponse.error.message || 'Blog posts query failed';
          console.warn('⚠️ FeaturedContent: Blog posts error:', blogResponse.error);
        } else {
          debugData.blogPosts.error = 'No blog posts data returned';
          console.warn('⚠️ FeaturedContent: No blog posts data returned');
        }
      } catch (blogError) {
        debugData.blogPosts.error = blogError instanceof Error ? blogError.message : 'Blog posts fetch failed';
        console.error('❌ FeaturedContent: Blog posts fetch error:', blogError);
      }

      // BULLETPROOF: Get featured works with graceful degradation
      try {
        debugData.works.attempted = true;
        console.log('📚 FeaturedContent: Attempting to fetch featured works...');
        
        if (typeof homepageManager.getFeaturedWorks === 'function') {
          const worksResponse = await homepageManager.getFeaturedWorks(2);
          
          if (worksResponse && !worksResponse.error && worksResponse.data && Array.isArray(worksResponse.data)) {
            let safeWorks: FeaturedItem[] = [];
            try {
              safeWorks = worksResponse.data.map((work: any) => ({
                ...work,
                type: 'work' as const,
                excerpt: work.description || work.excerpt,
                category: work.genre || work.category,
                // CRITICAL FIX: Use safe cover image utility for works
                cover_url: getCoverImageUrl(work.cover_url || work.cover_image || work.image_url),
                image_url: getCoverImageUrl(work.cover_url || work.cover_image || work.image_url),
                featured_image: getCoverImageUrl(work.cover_url || work.cover_image || work.image_url)
              }));
              debugData.works.success = true;
              debugData.works.count = safeWorks.length;
              console.log('✅ FeaturedContent: Successfully processed works:', safeWorks.length);
            } catch (worksImageError) {
              console.warn('⚠️ FeaturedContent: Error processing work images:', worksImageError);
              safeWorks = worksResponse.data.map((work: any) => ({
                ...work,
                type: 'work' as const,
                cover_url: '/images/default-book-cover.jpg',
                image_url: '/images/default-book-cover.jpg'
              }));
            }
            allFeaturedItems.push(...safeWorks);
          } else if (worksResponse?.error) {
            debugData.works.error = worksResponse.error.message || 'Works query failed';
            console.warn('⚠️ FeaturedContent: Works error (non-critical):', worksResponse.error);
          } else {
            debugData.works.error = 'No works data returned';
            console.log('ℹ️ FeaturedContent: No works data returned (this is normal if works table doesn\'t exist)');
          }
        } else {
          debugData.works.error = 'getFeaturedWorks method not available';
          console.log('ℹ️ FeaturedContent: Works feature not available (this is normal)');
        }
      } catch (worksError) {
        debugData.works.error = worksError instanceof Error ? worksError.message : 'Works fetch failed';
        console.warn('⚠️ FeaturedContent: Works fetch error (non-critical):', worksError);
      }

      // BULLETPROOF: Process and validate final data
      let finalItems: FeaturedItem[] = [];
      if (Array.isArray(allFeaturedItems) && allFeaturedItems.length > 0) {
        try {
          // Shuffle and limit to 6 items
          finalItems = allFeaturedItems
            .filter(item => item && item.id && item.title) // Filter out invalid items
            .sort(() => Math.random() - 0.5) // Shuffle
            .slice(0, 6); // Limit to 6 items
          
          console.log('✅ FeaturedContent: Successfully processed featured items:', finalItems.length);
        } catch (processingError) {
          console.error('❌ FeaturedContent: Error processing final items:', processingError);
          finalItems = [];
        }
      }

      setFeaturedItems(finalItems);
      setDebugInfo(debugData);
      setHasTriedFetch(true);

      // If we have no items and this is the first attempt, consider it a soft error
      if (finalItems.length === 0 && attempt === 1) {
        if (debugData.blogPosts.error && debugData.works.error) {
          throw new Error(`No content available: Blog posts - ${debugData.blogPosts.error}`);
        }
      }
      
    } catch (err) {
      console.error(`❌ FeaturedContent (attempt ${attempt}): Error:`, err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to load featured content';
      
      // Enhanced error handling with retry logic
      if (attempt < 3 && !errorMessage.includes('not available') && !errorMessage.includes('No content available')) {
        console.log(`🔄 FeaturedContent: Retrying in 2 seconds (attempt ${attempt + 1}/3)...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchFeaturedContent(attempt + 1);
        }, 2000);
        return; // Don't set error state yet, we're retrying
      }
      
      setError(errorMessage);
      setFeaturedItems([]);
      setHasTriedFetch(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const handleRetry = () => {
    setRetryCount(0);
    setHasTriedFetch(false);
    setDebugInfo({});
    fetchFeaturedContent();
  };

  const getItemImage = (item: FeaturedItem): string => {
    try {
      // CRITICAL FIX: Use appropriate safe image utility based on item type
      if (item.type === 'work') {
        return getCoverImageUrl(item.cover_url || item.image_url || item.featured_image || item.cover_image);
      } else {
        return getBlogImageUrl(item.featured_image || item.cover_url || item.image_url);
      }
    } catch (imageError) {
      console.warn('🖼️ FeaturedContent: Error getting image for item:', item.title, imageError);
      return item.type === 'work' ? '/images/default-book-cover.jpg' : '/images/default-blog-cover.jpg';
    }
  };

  const getItemLink = (item: FeaturedItem): string => {
    if (!item.slug && !item.id) {
      return '#';
    }
    
    switch (item.type) {
      case 'blog':
        return `/blog/${item.slug || item.id}`;
      case 'work':
        return `/library/work/${item.slug || item.id}`;
      case 'chapter':
        return `/library/chapter/${item.slug || item.id}`;
      default:
        return `/blog/${item.slug || item.id}`;
    }
  };

  const getItemTypeLabel = (item: FeaturedItem): string => {
    switch (item.type) {
      case 'blog':
        return 'Blog Post';
      case 'work':
        return 'Story';
      case 'chapter':
        return 'Chapter';
      default:
        return 'Content';
    }
  };

  const getItemIcon = (item: FeaturedItem) => {
    switch (item.type) {
      case 'work':
      case 'chapter':
        return <BookOpenIcon className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    try {
      if (!dateString) return null;
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.warn('📅 FeaturedContent: Error formatting date:', dateString, error);
      return null;
    }
  };

  // Loading state with skeleton
  if (loading && !hasTriedFetch) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Content</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discovering highlighted stories and insights from the Zoroastervers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-80 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
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

  // Error state with retry and debug info
  if (error) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Featured Content</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-lg mx-auto">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-red-800 font-semibold mb-2 text-lg">Unable to Load Featured Content</h3>
              <p className="text-red-600 text-sm mb-6 leading-relaxed">{error}</p>
              
              {retryCount > 0 && (
                <p className="text-red-500 text-xs mb-4">
                  Failed after {retryCount + 1} attempts
                </p>
              )}
              
              {debugInfo.blogPosts && (
                <div className="text-xs text-red-400 mb-4 text-left bg-red-100 p-2 rounded">
                  <div>Blog Posts: {debugInfo.blogPosts.attempted ? (debugInfo.blogPosts.success ? `✅ ${debugInfo.blogPosts.count}` : `❌ ${debugInfo.blogPosts.error}`) : 'Not attempted'}</div>
                  <div>Works: {debugInfo.works.attempted ? (debugInfo.works.success ? `✅ ${debugInfo.works.count}` : `⚠️ ${debugInfo.works.error}`) : 'Not attempted'}</div>
                </div>
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

  // Empty state - no featured content available
  if (!featuredItems || featuredItems.length === 0) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Featured Content</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-gray-700 font-semibold mb-2">No Featured Content</h3>
              <p className="text-gray-600 text-sm mb-6">No featured content is available at the moment.</p>
              <p className="text-gray-500 text-xs mb-4">
                Check back soon for highlighted stories and updates!
              </p>
              
              {debugInfo.blogPosts && (
                <div className="text-xs text-gray-400 mb-4 text-left bg-gray-100 p-2 rounded">
                  <div>Blog Posts: {debugInfo.blogPosts.attempted ? (debugInfo.blogPosts.success ? `✅ ${debugInfo.blogPosts.count}` : `❌ ${debugInfo.blogPosts.error}`) : 'Not attempted'}</div>
                  <div>Works: {debugInfo.works.attempted ? (debugInfo.works.success ? `✅ ${debugInfo.works.count}` : `⚠️ ${debugInfo.works.error}`) : 'Not attempted'}</div>
                </div>
              )}
              
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

  // Success state - render featured content
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Content</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover highlighted stories and insights from the world of ancient Persia
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => {
            // BULLETPROOF: Safe image URL handling with multiple fallbacks
            const safeImageUrl = getItemImage(item);
            const safeLink = getItemLink(item);
            
            console.log('🖼️ FeaturedContent: Rendering item with safe image:', {
              itemId: item.id,
              itemTitle: item.title,
              itemType: item.type,
              originalImage: item.featured_image || item.cover_url,
              safeImageUrl: safeImageUrl,
              safeLink: safeLink
            });
            
            return (
              <Card 
                key={`${item.type}-${item.id}`} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    {/* BULLETPROOF: Always use safe image URL with comprehensive error handling */}
                    <img
                      src={safeImageUrl}
                      alt={item.title || `${getItemTypeLabel(item)} image`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.warn('🖼️ FeaturedContent: Image failed to load, using fallback:', safeImageUrl);
                        // Ultimate fallback based on item type
                        const target = e.target as HTMLImageElement;
                        const fallback = item.type === 'work' 
                          ? '/images/default-book-cover.jpg' 
                          : '/images/default-blog-cover.jpg';
                        if (target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                      onLoad={() => {
                        console.log('✅ FeaturedContent: Image loaded successfully for:', item.title);
                      }}
                    />
                    
                    <div className="absolute top-3 left-3">
                      <Chip 
                        className="bg-primary/90 text-white flex items-center gap-1" 
                        size="sm"
                        startContent={getItemIcon(item)}
                      >
                        {getItemTypeLabel(item)}
                      </Chip>
                    </div>
                    
                    {(item.category || item.genre) && (
                      <div className="absolute top-3 right-3">
                        <Chip 
                          className="bg-white/90 text-gray-800" 
                          size="sm"
                        >
                          {item.category || item.genre}
                        </Chip>
                      </div>
                    )}
                  </div>
                  
                  <CardBody className="p-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title || 'Untitled Content'}
                    </h3>
                    
                    {(item.excerpt || item.description) && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {item.excerpt || item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        {item.author && (
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-20">{item.author}</span>
                          </span>
                        )}
                        
                        {item.published_at && (
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                            <span>{formatDate(item.published_at)}</span>
                          </span>
                        )}
                      </div>
                      
                      {item.reading_time && (
                        <span className="flex-shrink-0">{item.reading_time} min read</span>
                      )}
                    </div>
                    
                    <div className="mt-auto">
                      <Button 
                        as={Link}
                        to={safeLink}
                        variant="flat" 
                        color="primary" 
                        size="sm"
                        className="w-full"
                        disabled={safeLink === '#'}
                      >
                        {item.type === 'blog' ? 'Read Article' : 'Explore Story'}
                      </Button>
                    </div>
                  </CardBody>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;