/**
 * EMERGENCY FIX: FeaturedContent component with comprehensive null safety
 * This prevents getPublicUrl(null) errors by using safe image utilities
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
  featured_image?: string | null;
  cover_url?: string | null;
  image_url?: string | null;
  author?: string;
  category?: string;
  published_at?: string;
  type: 'blog' | 'work' | 'chapter';
  views?: number;
  reading_time?: number;
}

const FeaturedContent: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        console.log('✨ FeaturedContent: Fetching featured content...');
        setLoading(true);
        setError(null);

        // Get featured blog posts
        const blogResponse = await homepageManager.getFeaturedBlogPosts(3);
        let featuredBlogPosts: FeaturedItem[] = [];
        
        if (!blogResponse.error && blogResponse.data) {
          // CRITICAL FIX: Process blog posts through safe image utilities
          const safeBlogPosts = processBlogPostsImages(blogResponse.data);
          
          featuredBlogPosts = safeBlogPosts.map(post => ({
            ...post,
            type: 'blog' as const
          }));
          
          console.log('✅ FeaturedContent: Processed blog posts with safe images:', featuredBlogPosts.length);
        } else if (blogResponse.error) {
          console.warn('⚠️ FeaturedContent: Blog posts error:', blogResponse.error);
        }

        // Get featured works/chapters (if available)
        let featuredWorks: FeaturedItem[] = [];
        try {
          const worksResponse = await homepageManager.getFeaturedWorks?.(2);
          if (worksResponse && !worksResponse.error && worksResponse.data) {
            featuredWorks = worksResponse.data.map((work: any) => ({
              ...work,
              type: 'work' as const,
              // CRITICAL FIX: Use safe cover image utility for works
              cover_url: getCoverImageUrl(work.cover_url || work.cover_image),
              image_url: getCoverImageUrl(work.cover_url || work.cover_image)
            }));
            
            console.log('✅ FeaturedContent: Processed works with safe images:', featuredWorks.length);
          }
        } catch (worksError) {
          console.warn('⚠️ FeaturedContent: Works not available or error:', worksError);
        }

        // Combine and shuffle featured content
        const allFeatured = [...featuredBlogPosts, ...featuredWorks]
          .sort(() => Math.random() - 0.5) // Shuffle
          .slice(0, 6); // Limit to 6 items
        
        console.log('✅ FeaturedContent: Successfully loaded featured items:', allFeatured.length);
        setFeaturedItems(allFeatured);
        
      } catch (err) {
        console.error('❌ FeaturedContent: Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load featured content');
        setFeaturedItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  const getItemImage = (item: FeaturedItem): string => {
    // CRITICAL FIX: Use appropriate safe image utility based on item type
    if (item.type === 'work') {
      return getCoverImageUrl(item.cover_url || item.image_url || item.featured_image);
    } else {
      return getBlogImageUrl(item.featured_image || item.cover_url || item.image_url);
    }
  };

  const getItemLink = (item: FeaturedItem): string => {
    switch (item.type) {
      case 'blog':
        return `/blog/${item.slug}`;
      case 'work':
        return `/library/work/${item.slug}`;
      case 'chapter':
        return `/library/chapter/${item.slug}`;
      default:
        return `/blog/${item.slug}`;
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
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Content</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover highlighted stories and insights from the Zoroasterverse
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

  if (error) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Featured Content</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-red-800 font-semibold mb-2">Unable to Load Content</h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <Button 
                color="danger" 
                variant="flat" 
                size="sm"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredItems || featuredItems.length === 0) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Featured Content</h2>
            <p className="text-gray-600">No featured content available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">
              Check back soon for highlighted stories and updates!
            </p>
          </div>
        </div>
      </section>
    );
  }

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
            // CRITICAL FIX: Use safe image function instead of direct getPublicUrl
            const safeImageUrl = getItemImage(item);
            
            console.log('🖼️ FeaturedContent: Rendering item with safe image:', {
              itemTitle: item.title,
              itemType: item.type,
              originalImage: item.featured_image || item.cover_url,
              safeImageUrl: safeImageUrl
            });
            
            return (
              <Card 
                key={`${item.type}-${item.id}`} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    {/* FIXED: Always use safe image URL */}
                    <img
                      src={safeImageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.warn('🖼️ FeaturedContent: Image failed to load, using fallback:', safeImageUrl);
                        // Fallback to appropriate default based on type
                        const fallback = item.type === 'work' 
                          ? '/images/default-book-cover.jpg' 
                          : '/images/default-blog-cover.jpg';
                        (e.target as HTMLImageElement).src = fallback;
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
                    
                    {item.category && (
                      <div className="absolute top-3 right-3">
                        <Chip 
                          className="bg-white/90 text-gray-800" 
                          size="sm"
                        >
                          {item.category}
                        </Chip>
                      </div>
                    )}
                  </div>
                  
                  <CardBody className="p-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    
                    {item.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {item.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        {item.author && (
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-3 h-3" />
                            {item.author}
                          </span>
                        )}
                        
                        {item.published_at && (
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {formatDate(item.published_at)}
                          </span>
                        )}
                      </div>
                      
                      {item.reading_time && (
                        <span>{item.reading_time} min read</span>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        as={Link}
                        to={getItemLink(item)}
                        variant="flat" 
                        color="primary" 
                        size="sm"
                        className="w-full"
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