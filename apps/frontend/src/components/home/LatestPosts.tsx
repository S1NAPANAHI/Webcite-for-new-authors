/**
 * EMERGENCY FIX: LatestPosts component with comprehensive null safety
 * This prevents getPublicUrl(null) errors by using safe image utilities
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

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        console.log('📰 LatestPosts: Fetching latest blog posts...');
        setLoading(true);
        setError(null);

        const data = await homepageManager.getLatestBlogPosts(5);
        
        if (data.error) {
          console.error('❌ LatestPosts: Database error:', data.error);
          setError(data.error.message || 'Failed to load blog posts');
          setPosts([]);
          return;
        }

        // CRITICAL FIX: Process all posts through safe image utilities
        const safePosts = processBlogPostsImages(data.data || []);
        
        console.log('✅ LatestPosts: Successfully processed posts with safe images:', safePosts.length);
        setPosts(safePosts);
        
      } catch (err) {
        console.error('❌ LatestPosts: Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the latest tales from the Zoroasterverse
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

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Stories</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-red-800 font-semibold mb-2">Unable to Load Posts</h3>
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

  if (!posts || posts.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Stories</h2>
            <p className="text-gray-600">No blog posts available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">
              Check back soon for new content from the Zoroasterverse!
            </p>
          </div>
        </div>
      </section>
    );
  }

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
            // CRITICAL FIX: Use safe image URL function instead of direct getPublicUrl
            const safeImageUrl = getBlogImageUrl(post.featured_image || post.cover_url || post.image_url);
            
            console.log('🖼️ LatestPosts: Rendering post with safe image:', {
              postTitle: post.title,
              originalImage: post.featured_image,
              safeImageUrl: safeImageUrl
            });
            
            return (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    {/* FIXED: Always use safe image URL */}
                    <img
                      src={safeImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.warn('🖼️ LatestPosts: Image failed to load, using fallback:', safeImageUrl);
                        // Fallback to default image if even the safe URL fails
                        (e.target as HTMLImageElement).src = '/images/default-blog-cover.jpg';
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
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    
                    {post.reading_time && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{post.reading_time} min</span>
                      </div>
                    )}
                    
                    {post.views > 0 && (
                      <div className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                    )}
                  </div>
                </CardBody>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    as={Link}
                    to={`/blog/${post.slug}`}
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