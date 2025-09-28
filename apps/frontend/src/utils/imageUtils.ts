/**
 * FIXED: Comprehensive image URL utilities with strict null safety
 * This prevents the "Cannot read properties of null (reading 'replace')" error
 * by checking for null/undefined BEFORE calling supabase.storage getPublicUrl()
 */

import { supabase } from '../lib/supabase';

/**
 * Safely get image URL from Supabase storage with fallback handling
 * FIXED: Added strict null checks BEFORE calling getPublicUrl
 * @param imagePath - The path to the image in storage (can be null/undefined)
 * @param bucketName - The storage bucket name (default: 'media')
 * @param fallbackImage - Fallback image path (default: '/images/default-blog-cover.jpg')
 * @returns Safe image URL or fallback
 */
export function getSafeImageUrl(
  imagePath: string | null | undefined,
  bucketName: string = 'media',
  fallbackImage: string = '/images/default-blog-cover.jpg'
): string {
  // CRITICAL FIX: Check for null, undefined, or empty string BEFORE calling getPublicUrl
  if (!imagePath || imagePath === null || imagePath === undefined || imagePath.trim() === '') {
    console.warn('🖼️ Image path is null/undefined, using fallback:', fallbackImage);
    return fallbackImage;
  }

  try {
    // FIXED: Only call getPublicUrl if we have a valid path
    const { data } = supabase.storage.from(bucketName).getPublicUrl(imagePath);
    
    if (data?.publicUrl) {
      return data.publicUrl;
    } else {
      console.warn('🖼️ No public URL returned from Supabase, using fallback for path:', imagePath);
      return fallbackImage;
    }
  } catch (error) {
    console.error('🖼️ Error getting image URL for path:', imagePath, error);
    return fallbackImage;
  }
}

/**
 * Get blog post image URL with blog-specific fallback
 * @param imagePath - The image path from blog post data
 * @returns Safe image URL with blog fallback
 */
export function getBlogImageUrl(imagePath: string | null | undefined): string {
  return getSafeImageUrl(imagePath, 'media', '/images/default-blog-cover.jpg');
}

/**
 * Get user avatar URL with avatar-specific fallback
 * @param imagePath - The avatar path from user data
 * @returns Safe avatar URL with avatar fallback
 */
export function getAvatarUrl(imagePath: string | null | undefined): string {
  return getSafeImageUrl(imagePath, 'media', '/images/default-avatar.png');
}

/**
 * Get work/book cover image URL with cover-specific fallback
 * @param imagePath - The cover image path from work data
 * @returns Safe cover URL with cover fallback
 */
export function getCoverImageUrl(imagePath: string | null | undefined): string {
  return getSafeImageUrl(imagePath, 'media', '/images/default-book-cover.jpg');
}

/**
 * Process an array of blog posts and ensure all have safe image URLs
 * FIXED: Added null checks and error handling
 * @param posts - Array of blog posts
 * @returns Array with safe image URLs
 */
export function processBlogPostsImages(posts: any[]): any[] {
  if (!Array.isArray(posts)) {
    console.warn('📝 processBlogPostsImages: posts is not an array:', posts);
    return [];
  }

  return posts.map(post => {
    try {
      // FIXED: Safely process image fields with proper null checks
      const featuredImage = getBlogImageUrl(post.featured_image);
      const coverImage = getBlogImageUrl(post.cover_url || post.cover_image);
      
      return {
        ...post,
        featured_image: featuredImage,
        cover_url: coverImage,
        cover_image: coverImage, // For compatibility
        // Ensure we have safe fallbacks for all image fields
        image_url: featuredImage // Legacy support
      };
    } catch (error) {
      console.error('🖼️ Error processing images for post:', post.title, error);
      return {
        ...post,
        featured_image: '/images/default-blog-cover.jpg',
        cover_url: '/images/default-blog-cover.jpg',
        cover_image: '/images/default-blog-cover.jpg',
        image_url: '/images/default-blog-cover.jpg'
      };
    }
  });
}

/**
 * Check if an image URL is valid (not a fallback)
 * @param imageUrl - The image URL to check
 * @returns Whether the URL is a valid Supabase storage URL
 */
export function isValidImageUrl(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return false;
  
  // Check if it's a Supabase storage URL (contains supabase.co and storage)
  return imageUrl.includes('supabase.co') && imageUrl.includes('/storage/v1/object/public/');
}

/**
 * Get image URL with retry mechanism for failed loads
 * @param imagePath - The image path
 * @param bucketName - Storage bucket name
 * @param maxRetries - Maximum retry attempts
 * @returns Promise resolving to safe image URL
 */
export async function getImageUrlWithRetry(
  imagePath: string | null | undefined,
  bucketName: string = 'media',
  maxRetries: number = 3
): Promise<string> {
  const fallback = '/images/default-blog-cover.jpg';
  
  // FIXED: Check for null/undefined immediately
  if (!imagePath) {
    return fallback;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const imageUrl = getSafeImageUrl(imagePath, bucketName, fallback);
      
      // If it's already a fallback, return it
      if (!isValidImageUrl(imageUrl)) {
        return imageUrl;
      }
      
      // Test if the image actually loads
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (response.ok) {
        return imageUrl;
      }
      
      console.warn(`🖼️ Image load attempt ${attempt} failed for:`, imageUrl);
    } catch (error) {
      console.warn(`🖼️ Image URL retry attempt ${attempt} failed:`, error);
    }
    
    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  console.error('🖼️ All image URL attempts failed for:', imagePath);
  return fallback;
}

/**
 * Preload an image URL to check if it's accessible
 * @param imageUrl - The image URL to preload
 * @returns Promise resolving to whether the image loaded successfully
 */
export function preloadImage(imageUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!imageUrl || !isValidImageUrl(imageUrl)) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
    
    // Timeout after 10 seconds
    setTimeout(() => resolve(false), 10000);
  });
}

export default {
  getSafeImageUrl,
  getBlogImageUrl,
  getAvatarUrl,
  getCoverImageUrl,
  processBlogPostsImages,
  isValidImageUrl,
  getImageUrlWithRetry,
  preloadImage
};