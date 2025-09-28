import { supabase } from '../supabaseClient';

/**
 * Default fallback image URL when image paths are null or invalid
 */
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center';

/**
 * CRITICAL SAFETY UTILITY: Safely generates public URLs from Supabase storage
 * This function prevents the "Cannot read properties of null (reading 'replace')" error
 * that crashes the entire application when getPublicUrl receives null/undefined paths.
 * 
 * @param imagePath - The path to the image (can be null, undefined, or empty)
 * @param bucketName - The Supabase storage bucket name (defaults to 'media')
 * @param fallbackUrl - Custom fallback URL (optional)
 * @returns A safe, valid image URL that will never crash the app
 */
export function getSafeImageUrl(
  imagePath: string | null | undefined,
  bucketName: string = 'media',
  fallbackUrl: string = DEFAULT_FALLBACK_IMAGE
): string {
  // CRITICAL: Check for null, undefined, or empty string FIRST
  if (!imagePath || imagePath === null || imagePath === undefined || imagePath.trim() === '') {
    console.log('🖼️ getSafeImageUrl: Using fallback for null/undefined/empty path');
    return fallbackUrl;
  }

  // If it's already a full URL (external image), return it directly
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    console.log('🖼️ getSafeImageUrl: Using external URL as-is:', imagePath);
    return imagePath;
  }

  // Generate Supabase storage URL with comprehensive error handling
  try {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(imagePath);
    
    if (data?.publicUrl) {
      console.log('🖼️ getSafeImageUrl: Generated Supabase URL successfully');
      return data.publicUrl;
    } else {
      console.warn('🖼️ getSafeImageUrl: No public URL returned from Supabase, using fallback');
      return fallbackUrl;
    }
  } catch (error) {
    console.error('🖼️ getSafeImageUrl: Error generating Supabase URL, using fallback:', error);
    return fallbackUrl;
  }
}

/**
 * Alternative function for blog post images with specific fallbacks
 */
export function getSafeBlogImageUrl(
  imagePath: string | null | undefined,
  bucketName: string = 'blog-images'
): string {
  const blogFallback = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&h=800&fit=crop&crop=center';
  return getSafeImageUrl(imagePath, bucketName, blogFallback);
}

/**
 * Alternative function for character/profile images with specific fallbacks
 */
export function getSafeCharacterImageUrl(
  imagePath: string | null | undefined,
  bucketName: string = 'character-images'
): string {
  const characterFallback = 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop&crop=center';
  return getSafeImageUrl(imagePath, bucketName, characterFallback);
}

/**
 * Alternative function for cover/book images with specific fallbacks
 */
export function getSafeCoverImageUrl(
  imagePath: string | null | undefined,
  bucketName: string = 'covers'
): string {
  const coverFallback = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=800&fit=crop&crop=center';
  return getSafeImageUrl(imagePath, bucketName, coverFallback);
}

/**
 * Debug utility to test image URL safety
 */
export function debugImageUrl(imagePath: string | null | undefined): void {
  console.log('🔍 Image URL Debug:', {
    originalPath: imagePath,
    isNull: imagePath === null,
    isUndefined: imagePath === undefined,
    isEmpty: imagePath === '',
    isValidString: typeof imagePath === 'string' && imagePath.length > 0,
    safeUrl: getSafeImageUrl(imagePath)
  });
}