/**
 * EMERGENCY FIX: Comprehensive image URL utilities with strict null safety
 * This prevents the "Cannot read properties of null (reading 'replace')" error
 * by checking for null/undefined BEFORE calling supabase.storage getPublicUrl()
 * 
 * Updated: Console warnings now only show in development mode for cleaner production output
 */

import { supabase } from '../lib/supabase';

/**
 * CRITICAL: Safe wrapper for any Supabase getPublicUrl call
 * ALWAYS use this instead of calling getPublicUrl directly
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
  if (typeof imagePath !== 'string' || imagePath.trim() === '') {
    // UPDATED: Only show warnings in development mode to reduce console noise
    if (process.env.NODE_ENV === 'development') {
      console.warn('🖼️ getSafeImageUrl: Invalid imagePath (not a string or empty), using fallback:', imagePath, fallbackImage);
    }
    return fallbackImage;
  }

  try {
    // FIXED: Only call getPublicUrl if we have a valid path
    const { data } = supabase.storage.from(bucketName).getPublicUrl(imagePath);
    
    if (data?.publicUrl) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ getSafeImageUrl: Success for path:', imagePath);
      }
      return data.publicUrl;
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn('🖼️ getSafeImageUrl: No public URL returned from Supabase, using fallback for path:', imagePath);
      }
      return fallbackImage;
    }
  } catch (error) {
    // Always log actual errors, even in production
    console.error('🖼️ getSafeImageUrl: Error getting image URL for path:', imagePath, error);
    return fallbackImage;
  }
}

/**
 * EMERGENCY: Safe wrapper specifically for blog images - use this in ALL blog components
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
 * Get character portrait URL with character-specific fallback
 * @param imagePath - The character image path from character data  
 * @returns Safe character URL with character fallback
 */
export function getCharacterImageUrl(imagePath: string | null | undefined): string {
  return getSafeImageUrl(imagePath, 'media', '/images/default-character.jpg');
}

/**
 * CRITICAL: Process blog posts and ensure ALL have safe image URLs
 * Use this in every component that displays blog post images
 * @param posts - Array of blog posts
 * @returns Array with safe image URLs
 */
export function processBlogPostsImages(posts: any[]): any[] {
  if (!Array.isArray(posts)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('📄 processBlogPostsImages: posts is not an array:', posts);
    }
    return [];
  }

  return posts.map(post => {
    try {
      // FIXED: Safely process ALL possible image fields
      const featuredImage = getBlogImageUrl(post.featured_image as string | null | undefined);
      const coverImage = getBlogImageUrl((post.cover_url || post.cover_image) as string | null | undefined);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🖼️ processBlogPostsImages: Processing post:', post.title, {
          original_featured_image: post.featured_image,
          original_cover_url: post.cover_url,
          safe_featured_image: featuredImage,
          safe_cover_image: coverImage
        });
      }
      
      return {
        ...post,
        featured_image: featuredImage,
        cover_url: coverImage,
        cover_image: coverImage, // For compatibility
        image_url: featuredImage // Legacy support - ALWAYS use safe URL
      };
    } catch (error) {
      console.error('🖼️ processBlogPostsImages: Error processing images for post:', post.title, error);
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
 * Process character records and ensure ALL have safe image URLs
 * @param characters - Array of character records
 * @returns Array with safe image URLs
 */
export function processCharactersImages(characters: any[]): any[] {
  if (!Array.isArray(characters)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('🧙 processCharactersImages: characters is not an array:', characters);
    }
    return [];
  }

  return characters.map(character => {
    try {
      const safeImageUrl = getCharacterImageUrl(character.image_path as string | null | undefined);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🧙 processCharactersImages: Processing character:', character.name, {
          original_image_path: character.image_path,
          safe_image_url: safeImageUrl
        });
      }
      
      return {
        ...character,
        image_path: safeImageUrl,
        image_url: safeImageUrl // Alternative field name
      };
    } catch (error) {
      console.error('🧙 processCharactersImages: Error processing image for character:', character.name, error);
      return {
        ...character,
        image_path: '/images/default-character.jpg',
        image_url: '/images/default-character.jpg'
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
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🖼️ getImageUrlWithRetry: Attempt ${attempt} failed for:`, imageUrl);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`🖼️ getImageUrlWithRetry: Attempt ${attempt} failed:`, error);
      }
    }
    
    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  console.error('🖼️ getImageUrlWithRetry: All attempts failed for:', imagePath);
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

/**
 * Batch process multiple image paths safely
 * @param imagePaths - Array of image paths to process
 * @param bucketName - Storage bucket name
 * @param fallbackImage - Fallback image URL
 * @returns Array of safe image URLs
 */
export function batchProcessImageUrls(
  imagePaths: (string | null | undefined)[],
  bucketName: string = 'media',
  fallbackImage: string = '/images/default-image.jpg'
): string[] {
  return imagePaths.map(path => getSafeImageUrl(path, bucketName, fallbackImage));
}

// EMERGENCY: Default export with all safe functions
export default {
  getSafeImageUrl,
  getBlogImageUrl,
  getAvatarUrl,
  getCoverImageUrl,
  getCharacterImageUrl,
  processBlogPostsImages,
  processCharactersImages,
  isValidImageUrl,
  getImageUrlWithRetry,
  preloadImage,
  batchProcessImageUrls
};