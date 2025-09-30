import React from 'react';

interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
}

interface CroppedImageProps {
  /** The original image URL from storage */
  src: string;
  /** Crop settings from the database */
  cropSettings?: CropSettings | null;
  /** Alt text for accessibility */
  alt: string;
  /** Additional CSS classes */
  className?: string;
  /** Container width (defaults to full width) */
  width?: number | string;
  /** Container height (defaults to auto-calculated from aspect ratio) */
  height?: number | string;
  /** Aspect ratio for the container (defaults to 16:9 for blog covers) */
  aspectRatio?: number;
  /** Loading state */
  loading?: 'lazy' | 'eager';
  /** Click handler */
  onClick?: () => void;
  /** Whether to show a loading placeholder */
  showPlaceholder?: boolean;
}

/**
 * CroppedImage Component
 * 
 * Displays an image with crop settings applied visually using CSS transforms.
 * No duplicate images are created - the original stays in storage and crop
 * settings are applied client-side for display.
 * 
 * Features:
 * - Applies crop coordinates without creating new image files
 * - Supports 16:9 aspect ratio containers for blog covers
 * - Fallback to original image if no crop settings provided
 * - Responsive and accessible
 * - Loading states and error handling
 * 
 * Usage:
 * ```tsx
 * <CroppedImage 
 *   src={blogPost.cover_url}
 *   cropSettings={blogPost.cover_crop_settings}
 *   alt={blogPost.title}
 *   aspectRatio={16/9}
 *   className="rounded-lg"
 * />
 * ```
 */
const CroppedImage: React.FC<CroppedImageProps> = ({
  src,
  cropSettings,
  alt,
  className = '',
  width = '100%',
  height = 'auto',
  aspectRatio = 16/9, // Default to 16:9 for blog covers
  loading = 'lazy',
  onClick,
  showPlaceholder = true
}) => {
  // If no crop settings, display the original image normally
  if (!cropSettings || !src) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={{ 
          width,
          height: height === 'auto' ? undefined : height,
          aspectRatio: height === 'auto' ? aspectRatio : undefined
        }}
        onClick={onClick}
      >
        {src ? (
          <img 
            src={src}
            alt={alt}
            loading={loading}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.warn('CroppedImage: Failed to load image:', src);
              // Could set a fallback image here
              if (showPlaceholder) {
                (e.target as HTMLImageElement).src = '/images/default-blog-cover.jpg';
              }
            }}
          />
        ) : showPlaceholder ? (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm">No image</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const { x, y, width: cropWidth, height: cropHeight, scale = 1 } = cropSettings;

  // Calculate the image scaling and positioning
  // The crop coordinates are in pixels relative to the original image
  const imageStyle: React.CSSProperties = {
    // Position the image so the cropped area appears at the top-left of the container
    transform: `translate(-${x}px, -${y}px) scale(${scale})`,
    transformOrigin: 'top left',
    // The image should be sized so that the crop area fills the container
    width: 'auto',
    height: 'auto',
    minWidth: '100%',
    minHeight: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width,
        height: height === 'auto' ? undefined : height,
        aspectRatio: height === 'auto' ? aspectRatio : undefined
      }}
      onClick={onClick}
      title={cropSettings ? `Cropped ${Math.round(cropWidth)}×${Math.round(cropHeight)}px from original` : alt}
    >
      {/* Cropped Image */}
      <img 
        src={src}
        alt={alt}
        loading={loading}
        className="select-none"
        style={imageStyle}
        draggable={false}
        onError={(e) => {
          console.warn('CroppedImage: Failed to load cropped image:', src);
          // Fallback behavior
          if (showPlaceholder) {
            const img = e.target as HTMLImageElement;
            img.style.transform = 'none';
            img.style.position = 'static';
            img.className = 'w-full h-full object-cover';
            // Could also set a fallback src here
          }
        }}
        onLoad={() => {
          console.log('CroppedImage: Successfully loaded and applied crop settings');
        }}
      />
      
      {/* Crop Indicator (optional, for development/debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full opacity-75">
          ✂️ 16:9
        </div>
      )}
    </div>
  );
};

export default CroppedImage;

/**
 * Hook for using CroppedImage with blog post data
 * 
 * Example usage:
 * ```tsx
 * const { CroppedCover } = useBlogCover(blogPost);
 * return <CroppedCover className="rounded-lg shadow-md" />;
 * ```
 */
export const useBlogCover = (blogPost: {
  cover_url?: string;
  featured_image?: string;
  cover_crop_settings?: CropSettings | string | null;
  title?: string;
}) => {
  const coverUrl = blogPost.cover_url || blogPost.featured_image || '';
  
  let cropSettings: CropSettings | null = null;
  if (blogPost.cover_crop_settings) {
    try {
      cropSettings = typeof blogPost.cover_crop_settings === 'string' 
        ? JSON.parse(blogPost.cover_crop_settings)
        : blogPost.cover_crop_settings;
    } catch (err) {
      console.warn('Failed to parse crop settings:', err);
    }
  }

  const CroppedCover: React.FC<Omit<CroppedImageProps, 'src' | 'cropSettings' | 'alt'>> = (props) => (
    <CroppedImage
      src={coverUrl}
      cropSettings={cropSettings}
      alt={blogPost.title || 'Blog post cover'}
      {...props}
    />
  );

  return {
    CroppedCover,
    hasCover: !!coverUrl,
    isCropped: !!cropSettings,
    coverUrl,
    cropSettings
  };
};

/**
 * Utility function to check if an image should be displayed as cropped
 */
export const shouldUseCroppedDisplay = (cropSettings?: CropSettings | string | null): boolean => {
  if (!cropSettings) return false;
  
  try {
    const settings = typeof cropSettings === 'string' ? JSON.parse(cropSettings) : cropSettings;
    return !!(settings?.x !== undefined && settings?.y !== undefined && settings?.width && settings?.height);
  } catch {
    return false;
  }
};

/**
 * Type guard for crop settings
 */
export const isCropSettings = (value: any): value is CropSettings => {
  return value && 
    typeof value.x === 'number' && 
    typeof value.y === 'number' && 
    typeof value.width === 'number' && 
    typeof value.height === 'number';
};