/**
 * EMERGENCY FIX: BlogPostCard component with comprehensive null safety
 * This prevents getPublicUrl(null) errors by using safe image utilities
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@nextui-org/react';
import { CalendarIcon, EyeIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { getBlogImageUrl } from '../../utils/imageUtils';

interface BlogPost {
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
  published_at: string;
  views?: number;
  reading_time?: number;
  status?: string;
  tags?: string[];
}

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact' | 'featured';
  showImage?: boolean;
  showExcerpt?: boolean;
  showMetadata?: boolean;
  className?: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  variant = 'default',
  showImage = true,
  showExcerpt = true,
  showMetadata = true,
  className = ''
}) => {
  // CRITICAL FIX: Use safe image URL function instead of direct getPublicUrl
  const safeImageUrl = getBlogImageUrl(post.featured_image || post.cover_url || post.image_url);
  
  console.log('🖼️ BlogPostCard: Rendering with safe image:', {
    postTitle: post.title,
    originalImage: post.featured_image,
    safeImageUrl: safeImageUrl
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCardClasses = () => {
    const baseClasses = 'group hover:shadow-lg transition-all duration-300';
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} max-w-sm`;
      case 'featured':
        return `${baseClasses} hover:-translate-y-2 shadow-md`;
      default:
        return `${baseClasses} hover:-translate-y-1`;
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case 'compact':
        return 'h-32';
      case 'featured':
        return 'h-64';
      default:
        return 'h-48';
    }
  };

  const getTitleSize = () => {
    switch (variant) {
      case 'compact':
        return 'text-base font-semibold';
      case 'featured':
        return 'text-2xl font-bold';
      default:
        return 'text-lg font-bold';
    }
  };

  const renderImage = () => {
    if (!showImage) return null;

    return (
      <CardHeader className="p-0">
        <div className={`relative w-full ${getImageHeight()} overflow-hidden rounded-t-lg`}>
          {/* FIXED: Always use safe image URL */}
          <img
            src={safeImageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.warn('🖼️ BlogPostCard: Image failed to load, using fallback:', safeImageUrl);
              // Fallback to default image if even the safe URL fails
              (e.target as HTMLImageElement).src = '/images/default-blog-cover.jpg';
            }}
          />
          
          {/* Category chip overlay */}
          {post.category && (
            <Chip 
              className="absolute top-3 left-3 bg-primary/90 text-white" 
              size={variant === 'compact' ? 'sm' : 'md'}
            >
              {post.category}
            </Chip>
          )}
          
          {/* Status indicator for drafts */}
          {post.status === 'draft' && (
            <Chip 
              className="absolute top-3 right-3 bg-orange-500/90 text-white" 
              size="sm"
            >
              Draft
            </Chip>
          )}
        </div>
      </CardHeader>
    );
  };

  const renderContent = () => {
    const paddingClass = variant === 'compact' ? 'p-3' : 'p-4';
    
    return (
      <CardBody className={paddingClass}>
        {/* Title */}
        <h3 className={`${getTitleSize()} mb-2 group-hover:text-primary transition-colors line-clamp-2`}>
          {post.title}
        </h3>
        
        {/* Excerpt */}
        {showExcerpt && post.excerpt && (
          <p className={`text-gray-600 mb-4 line-clamp-3 ${
            variant === 'compact' ? 'text-xs' : 'text-sm'
          }`}>
            {post.excerpt}
          </p>
        )}
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && variant !== 'compact' && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} size="sm" variant="flat" className="text-xs">
                #{tag}
              </Chip>
            ))}
            {post.tags.length > 3 && (
              <Chip size="sm" variant="flat" className="text-xs">
                +{post.tags.length - 3} more
              </Chip>
            )}
          </div>
        )}
        
        {/* Metadata */}
        {showMetadata && (
          <div className={`flex items-center gap-3 text-gray-500 ${
            variant === 'compact' ? 'text-xs' : 'text-sm'
          }`}>
            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-1">
                <UserIcon className="w-3 h-3" />
                <span>{post.author}</span>
              </div>
            )}
            
            {/* Date */}
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            
            {/* Reading time */}
            {post.reading_time && (
              <div className="flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                <span>{post.reading_time} min</span>
              </div>
            )}
            
            {/* Views */}
            {post.views !== undefined && post.views > 0 && (
              <div className="flex items-center gap-1">
                <EyeIcon className="w-3 h-3" />
                <span>{post.views}</span>
              </div>
            )}
          </div>
        )}
      </CardBody>
    );
  };

  const renderFooter = () => {
    if (variant === 'compact') {
      return (
        <CardFooter className="p-3 pt-0">
          <Button 
            as={Link}
            to={`/blog/${post.slug}`}
            variant="flat" 
            color="primary" 
            size="sm"
            className="w-full"
          >
            Read
          </Button>
        </CardFooter>
      );
    }
    
    return (
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <Button 
            as={Link}
            to={`/blog/${post.slug}`}
            variant={variant === 'featured' ? 'solid' : 'flat'}
            color="primary" 
            size={variant === 'featured' ? 'md' : 'sm'}
          >
            {variant === 'featured' ? 'Read Full Story' : 'Read More'}
          </Button>
          
          {/* Share button for featured variant */}
          {variant === 'featured' && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt || '',
                    url: `/blog/${post.slug}`
                  });
                } else {
                  // Fallback: copy to clipboard
                  navigator.clipboard?.writeText(`${window.location.origin}/blog/${post.slug}`);
                }
              }}
            >
              Share
            </Button>
          )}
        </div>
      </CardFooter>
    );
  };

  return (
    <Card className={`${getCardClasses()} ${className}`}>
      {renderImage()}
      {renderContent()}
      {renderFooter()}
    </Card>
  );
};

export default BlogPostCard;