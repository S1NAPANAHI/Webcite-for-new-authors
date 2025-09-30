import React from 'react';
import CroppedImage from '../ui/CroppedImage';

interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
}

interface BlogCoverImageProps {
  /** Blog post object with cover image data */
  blogPost: {
    cover_url?: string;
    featured_image?: string;
    cover_crop_settings?: CropSettings | string | null;
    title: string;
    slug?: string;
  };
  /** Size variant for different contexts */
  size?: 'small' | 'medium' | 'large' | 'hero';
  /** Additional CSS classes */
  className?: string;
  /** Click handler (e.g., to navigate to post) */
  onClick?: () => void;
  /** Whether to show loading placeholder */
  showPlaceholder?: boolean;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
}

/**
 * BlogCoverImage Component
 * 
 * Specialized component for displaying blog post cover images with proper
 * cropping applied. Handles different sizes and contexts throughout the blog.
 * 
 * Features:
 * - Automatic crop settings application
 * - Multiple size variants for different contexts
 * - 16:9 aspect ratio maintained
 * - Loading states and error handling
 * - SEO-friendly alt text generation
 * 
 * Usage:
 * ```tsx
 * // Hero image on blog post page
 * <BlogCoverImage 
 *   blogPost={post} 
 *   size="hero" 
 *   priority={true}
 * />
 * 
 * // Thumbnail in blog list
 * <BlogCoverImage 
 *   blogPost={post} 
 *   size="medium" 
 *   onClick={() => navigate(`/blog/${post.slug}`)}
 * />
 * ```
 */
const BlogCoverImage: React.FC<BlogCoverImageProps> = ({
  blogPost,
  size = 'medium',
  className = '',
  onClick,
  showPlaceholder = true,
  priority = false
}) => {
  // Extract cover image URL from various possible fields
  const coverUrl = blogPost.cover_url || blogPost.featured_image;
  
  // Parse crop settings safely
  let cropSettings: CropSettings | null = null;
  if (blogPost.cover_crop_settings) {
    try {
      cropSettings = typeof blogPost.cover_crop_settings === 'string'
        ? JSON.parse(blogPost.cover_crop_settings)
        : blogPost.cover_crop_settings;
    } catch (err) {
      console.warn('BlogCoverImage: Failed to parse crop settings:', err);
    }
  }

  // Generate SEO-friendly alt text
  const altText = `Cover image for "${blogPost.title}"${cropSettings ? ' (optimized 16:9 crop)' : ''}`;

  // Size configurations
  const sizeConfig = {
    small: {
      containerClass: 'w-full h-32', // Fixed height for consistent grid
      aspectRatio: 16/9
    },
    medium: {
      containerClass: 'w-full h-48', // Standard blog card size
      aspectRatio: 16/9
    },
    large: {
      containerClass: 'w-full h-64 lg:h-80', // Larger featured posts
      aspectRatio: 16/9
    },
    hero: {
      containerClass: 'w-full h-64 lg:h-96', // Hero image on post pages
      aspectRatio: 16/9
    }
  };

  const config = sizeConfig[size];
  const containerClasses = `${config.containerClass} ${className}`;

  // If no image, show placeholder or nothing
  if (!coverUrl) {
    if (!showPlaceholder) return null;
    
    return (
      <div className={`${containerClasses} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium">{blogPost.title}</p>
          <p className="text-xs opacity-75">No cover image</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${containerClasses} group cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
      onClick={onClick}
    >
      <CroppedImage
        src={coverUrl}
        cropSettings={cropSettings}
        alt={altText}
        aspectRatio={config.aspectRatio}
        loading={priority ? 'eager' : 'lazy'}
        className="w-full h-full group-hover:scale-105 transition-transform duration-200"
        showPlaceholder={showPlaceholder}
        onClick={onClick}
      />
      
      {/* Optional overlay for better text readability */}
      {size === 'hero' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      )}
      
      {/* Crop indicator (only in development) */}
      {process.env.NODE_ENV === 'development' && cropSettings && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 text-white text-xs rounded-full backdrop-blur-sm">
          ✂️ 16:9 Cropped
        </div>
      )}
    </div>
  );
};

export default BlogCoverImage;

/**
 * Hook for working with blog cover images
 * 
 * Example:
 * ```tsx
 * const { hasCover, isCropped, CoverComponent } = useBlogCover(blogPost);
 * 
 * return (
 *   <div>
 *     {hasCover && <CoverComponent size="large" />}
 *     {isCropped && <p>This image uses optimized cropping</p>}
 *   </div>
 * );
 * ```
 */
export const useBlogCover = (blogPost: BlogCoverImageProps['blogPost']) => {
  const hasCover = !!(blogPost.cover_url || blogPost.featured_image);
  
  let isCropped = false;
  if (blogPost.cover_crop_settings) {
    try {
      const settings = typeof blogPost.cover_crop_settings === 'string'
        ? JSON.parse(blogPost.cover_crop_settings)
        : blogPost.cover_crop_settings;
      isCropped = !!(settings?.width && settings?.height);
    } catch {
      isCropped = false;
    }
  }

  const CoverComponent: React.FC<Omit<BlogCoverImageProps, 'blogPost'>> = (props) => (
    <BlogCoverImage blogPost={blogPost} {...props} />
  );

  return {
    hasCover,
    isCropped,
    CoverComponent,
    coverUrl: blogPost.cover_url || blogPost.featured_image,
  };
};

/**
 * Utility function to get optimized cover image for sharing
 */
export const getBlogCoverForSharing = (blogPost: BlogCoverImageProps['blogPost']) => {
  const coverUrl = blogPost.cover_url || blogPost.featured_image;
  if (!coverUrl) return null;
  
  return {
    url: coverUrl,
    alt: `Cover image for "${blogPost.title}"`,
    hasCrop: !!blogPost.cover_crop_settings,
    aspectRatio: '16:9'
  };
};