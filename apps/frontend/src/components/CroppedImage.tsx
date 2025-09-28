import React, { useState, useRef, useEffect } from 'react';

interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
}

interface CroppedImageProps {
  src: string;
  alt?: string;
  cropSettings?: CropSettings;
  className?: string;
  containerClassName?: string;
  fallbackClassName?: string;
  width?: number;
  height?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean; // For Next.js Image optimization
}

/**
 * CroppedImage component that applies CSS-based cropping to images
 * while preserving the original image files in storage.
 * 
 * This component implements visual cropping using CSS transforms and positioning,
 * avoiding the need to create duplicate cropped image files.
 */
const CroppedImage: React.FC<CroppedImageProps> = ({
  src,
  alt = '',
  cropSettings,
  className = '',
  containerClassName = '',
  fallbackClassName = '',
  width,
  height,
  objectFit = 'cover',
  priority = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load image and get natural dimensions
  useEffect(() => {
    if (!src) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoaded(true);
      setError(false);
    };
    
    img.onerror = () => {
      setError(true);
      setImageLoaded(false);
    };
    
    img.src = src;
  }, [src]);

  // Calculate CSS styles for cropped display
  const getCroppedStyles = () => {
    if (!cropSettings || !imageDimensions) {
      return {
        containerStyle: {},
        imageStyle: {
          width: '100%',
          height: '100%',
          objectFit: objectFit as any
        }
      };
    }

    const container = containerRef.current;
    if (!container) {
      return {
        containerStyle: {},
        imageStyle: {}
      };
    }

    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const containerWidth = width || containerRect.width;
    const containerHeight = height || containerRect.height;

    if (!containerWidth || !containerHeight) {
      return {
        containerStyle: {},
        imageStyle: {}
      };
    }

    // Calculate scale factors
    const scaleX = containerWidth / cropSettings.width;
    const scaleY = containerHeight / cropSettings.height;
    const scale = Math.min(scaleX, scaleY);

    // Calculate image display dimensions
    const displayWidth = imageDimensions.width * scale;
    const displayHeight = imageDimensions.height * scale;

    // Calculate offset to position the crop area
    const offsetX = -cropSettings.x * scale;
    const offsetY = -cropSettings.y * scale;

    return {
      containerStyle: {
        overflow: 'hidden',
        position: 'relative' as const,
        width: containerWidth,
        height: containerHeight
      },
      imageStyle: {
        width: displayWidth,
        height: displayHeight,
        position: 'absolute' as const,
        top: offsetY,
        left: offsetX,
        objectFit: 'none' as const,
        transform: 'none',
        transformOrigin: 'top left'
      }
    };
  };

  // Error state
  if (error) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${containerClassName} ${fallbackClassName}`}>
        <div className="text-gray-500 dark:text-gray-400 text-center p-4">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm">Image failed to load</div>
        </div>
      </div>
    );
  }

  // Loading state
  if (!imageLoaded || !imageDimensions) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center ${containerClassName} ${fallbackClassName}`}>
        <div className="text-gray-400 dark:text-gray-500 text-center p-4">
          <div className="text-2xl mb-2">📸</div>
          <div className="text-sm">Loading image...</div>
        </div>
      </div>
    );
  }

  const { containerStyle, imageStyle } = getCroppedStyles();

  return (
    <div
      ref={containerRef}
      className={`${containerClassName}`}
      style={containerStyle}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className}`}
        style={imageStyle}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
        onError={() => setError(true)}
      />
      
      {/* Debug overlay for development */}
      {process.env.NODE_ENV === 'development' && cropSettings && (
        <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          🔍 Cropped: {Math.round(cropSettings.width)}×{Math.round(cropSettings.height)}
        </div>
      )}
    </div>
  );
};

/**
 * Hook for using cropped images with automatic fallback
 */
export const useCroppedImage = (imageUrl: string, cropSettings?: CropSettings) => {
  return {
    src: imageUrl,
    cropSettings,
    isCropped: !!cropSettings
  };
};

/**
 * Utility function to generate CSS background-image styles for cropped images
 * Useful for hero sections and background images
 */
export const getCroppedBackgroundStyle = (
  imageUrl: string,
  cropSettings?: CropSettings,
  imageDimensions?: { width: number; height: number }
): React.CSSProperties => {
  if (!cropSettings || !imageDimensions) {
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  }

  // Calculate the position percentages
  const bgPosX = (cropSettings.x / imageDimensions.width) * 100;
  const bgPosY = (cropSettings.y / imageDimensions.height) * 100;
  
  // Calculate the size scaling
  const scaleX = imageDimensions.width / cropSettings.width;
  const scaleY = imageDimensions.height / cropSettings.height;
  const scale = Math.max(scaleX, scaleY); // Use max to ensure full coverage
  
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${imageDimensions.width * scale}px ${imageDimensions.height * scale}px`,
    backgroundPosition: `-${bgPosX * scale}% -${bgPosY * scale}%`,
    backgroundRepeat: 'no-repeat'
  };
};

/**
 * Blog-specific cropped image component with optimized styling
 */
export const BlogCroppedImage: React.FC<CroppedImageProps & {
  featured?: boolean;
  rounded?: boolean;
}> = ({ featured = false, rounded = true, ...props }) => {
  const baseClasses = featured
    ? 'w-full h-64 md:h-80 lg:h-96' // Featured image sizing
    : 'w-full h-48'; // Regular image sizing
  
  const roundedClasses = rounded ? 'rounded-lg overflow-hidden' : '';
  const containerClasses = `${baseClasses} ${roundedClasses} bg-gray-100 dark:bg-gray-800`;

  return (
    <CroppedImage
      {...props}
      containerClassName={`${containerClasses} ${props.containerClassName || ''}`}
      fallbackClassName="min-h-[12rem]"
    />
  );
};

export default CroppedImage;