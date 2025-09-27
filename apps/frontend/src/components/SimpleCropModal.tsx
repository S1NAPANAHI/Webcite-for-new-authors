import React, { useState, useCallback } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut, Check, Loader2, Crop } from 'lucide-react';

// Simple cropping interface without external dependencies
// This works with your existing file upload system

interface SimpleCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedBlob: Blob) => void;
  aspectRatio?: number; // e.g., 16/9 = 1.777, 1 = square
  title?: string;
  loading?: boolean;
}

const SimpleCropModal: React.FC<SimpleCropModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio = 16/9, // Default to landscape
  title = 'Crop Image',
  loading = false
}) => {
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 300,
    height: 200
  });
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [imageRect, setImageRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Initialize crop area when image loads
  const handleImageLoad = (img: HTMLImageElement) => {
    setImageElement(img);
    const container = img.parentElement;
    if (container) {
      // Get the actual rendered image dimensions and position
      const imgRect = img.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const imageInfo = {
        x: imgRect.left - containerRect.left,
        y: imgRect.top - containerRect.top,
        width: img.offsetWidth,
        height: img.offsetHeight
      };
      
      setImageRect(imageInfo);
      setContainerSize({ width: containerRect.width, height: containerRect.height });
      
      // Set initial crop size based on aspect ratio and center it
      const maxWidth = Math.min(400, imageInfo.width * 0.7);
      const cropWidth = maxWidth;
      const cropHeight = aspectRatio ? cropWidth / aspectRatio : cropWidth * 0.75;
      
      // Center the crop area within the actual image bounds
      const centerX = (imageInfo.width - cropWidth) / 2;
      const centerY = (imageInfo.height - cropHeight) / 2;
      
      setCropData({
        x: Math.max(0, centerX),
        y: Math.max(0, centerY),
        width: cropWidth,
        height: cropHeight
      });
    }
  };

  // Handle cropping
  const handleCrop = async () => {
    if (!imageElement) return;

    try {
      setIsProcessing(true);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Calculate scale factor between displayed image and natural image
      const scaleX = imageElement.naturalWidth / imageElement.offsetWidth;
      const scaleY = imageElement.naturalHeight / imageElement.offsetHeight;

      // Set canvas size to crop dimensions in natural image coordinates
      canvas.width = cropData.width * scaleX;
      canvas.height = cropData.height * scaleY;

      // Draw cropped portion
      ctx.drawImage(
        imageElement,
        cropData.x * scaleX, // Source X
        cropData.y * scaleY, // Source Y  
        cropData.width * scaleX, // Source width
        cropData.height * scaleY, // Source height
        0, // Destination X
        0, // Destination Y
        canvas.width, // Destination width
        canvas.height // Destination height
      );

      // Convert to blob with high quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob);
            onClose();
          }
        },
        'image/jpeg',
        0.95 // High quality
      );
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // FIXED: Proper drag handling with correct boundary calculations
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startCropX = cropData.x;
    const startCropY = cropData.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      if (!imageElement) return;
      
      // Calculate new position
      const newX = startCropX + deltaX;
      const newY = startCropY + deltaY;
      
      // FIXED: Use actual image dimensions, not offset dimensions
      const imageWidth = imageElement.offsetWidth;
      const imageHeight = imageElement.offsetHeight;
      
      // Ensure crop stays within image bounds
      const maxX = Math.max(0, imageWidth - cropData.width);
      const maxY = Math.max(0, imageHeight - cropData.height);
      
      setCropData(prev => ({
        ...prev,
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const startCropX = cropData.x;
    const startCropY = cropData.y;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      if (!imageElement) return;
      
      const newX = startCropX + deltaX;
      const newY = startCropY + deltaY;
      
      const imageWidth = imageElement.offsetWidth;
      const imageHeight = imageElement.offsetHeight;
      
      const maxX = Math.max(0, imageWidth - cropData.width);
      const maxY = Math.max(0, imageHeight - cropData.height);
      
      setCropData(prev => ({
        ...prev,
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      }));
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              ✂️ Drag anywhere to position
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isProcessing || loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crop Area - FIXED POSITIONING */}
        <div className="relative flex-1 p-6 bg-gray-900 overflow-hidden">
          <div className="relative mx-auto max-w-full max-h-full flex items-center justify-center min-h-[500px]">
            <div className="relative inline-block">
              <img
                src={imageUrl}
                alt="Crop preview"
                onLoad={(e) => handleImageLoad(e.target as HTMLImageElement)}
                className="max-w-full max-h-[65vh] object-contain select-none block"
                draggable={false}
                style={{ userSelect: 'none' }}
              />
              
              {/* FIXED: Crop overlay positioned relative to image */}
              {imageElement && (
                <>
                  {/* Enhanced crop selection rectangle */}
                  <div
                    className={`absolute border-2 border-blue-400 bg-transparent cursor-move transition-all duration-150 ${
                      isDragging ? 'border-blue-500 shadow-lg' : 'hover:border-blue-300'
                    }`}
                    style={{
                      left: cropData.x,
                      top: cropData.y,
                      width: cropData.width,
                      height: cropData.height,
                      boxShadow: isDragging 
                        ? '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 4px 20px rgba(59, 130, 246, 0.5)' 
                        : '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                      zIndex: 10
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                  >
                    {/* Enhanced corner handles */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md" />
                    
                    {/* Enhanced center crosshair */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 border-2 border-white rounded-full bg-blue-500 shadow-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                    
                    {/* Grid overlay for better precision */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
                      <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
                      <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
                      <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Enhanced instructions */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm border border-blue-500">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">👆</span>
              <span>Drag the blue rectangle anywhere on the image</span>
            </div>
          </div>
          
          {/* Crop info */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-90 text-white px-3 py-2 rounded-lg text-xs">
            <div>Size: {Math.round(cropData.width)} × {Math.round(cropData.height)}px</div>
            <div>Position: {Math.round(cropData.x)}, {Math.round(cropData.y)}</div>
            <div>Ratio: {aspectRatio === 1 ? '1:1' : aspectRatio === 16/9 ? '16:9' : aspectRatio?.toFixed(2) || 'Free'}</div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {/* Crop size controls */}
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[50px]">Size:</span>
              <input
                type="range"
                min="100"
                max={Math.min(600, imageElement?.offsetWidth || 400)}
                value={cropData.width}
                onChange={(e) => {
                  const width = Number(e.target.value);
                  const height = aspectRatio ? width / aspectRatio : cropData.height;
                  
                  setCropData(prev => {
                    const imageWidth = imageElement?.offsetWidth || 0;
                    const imageHeight = imageElement?.offsetHeight || 0;
                    
                    const maxX = Math.max(0, imageWidth - width);
                    const maxY = Math.max(0, imageHeight - height);
                    
                    return {
                      width,
                      height,
                      x: Math.max(0, Math.min(prev.x, maxX)),
                      y: Math.max(0, Math.min(prev.y, maxY))
                    };
                  });
                }}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-xs text-gray-500 min-w-[4rem] text-right">
                {Math.round(cropData.width)} × {Math.round(cropData.height)}
              </span>
            </div>
          </div>

          {/* Aspect ratio buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Presets:</span>
            <button
              type="button"
              onClick={() => {
                const width = cropData.width;
                const height = width; // Square
                setCropData(prev => ({
                  ...prev,
                  height,
                  y: Math.max(0, Math.min(prev.y, (imageElement?.offsetHeight || 0) - height))
                }));
              }}
              className="px-3 py-1.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Square (1:1)
            </button>
            <button
              type="button"
              onClick={() => {
                const width = cropData.width;
                const height = width / (16/9); // Landscape
                setCropData(prev => ({
                  ...prev,
                  height,
                  y: Math.max(0, Math.min(prev.y, (imageElement?.offsetHeight || 0) - height))
                }));
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                aspectRatio === 16/9 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Landscape (16:9)
            </button>
            <button
              type="button"
              onClick={() => {
                const width = cropData.width;
                const height = width / (3/4); // Portrait
                setCropData(prev => ({
                  ...prev,
                  height,
                  y: Math.max(0, Math.min(prev.y, (imageElement?.offsetHeight || 0) - height))
                }));
              }}
              className="px-3 py-1.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Portrait (3:4)
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {aspectRatio && (
                <span>
                  📐 Current ratio: {aspectRatio === 1 ? '1:1 (Square)' : 
                    aspectRatio === 16/9 ? '16:9 (Landscape)' :
                    aspectRatio === 3/4 ? '3:4 (Portrait)' :
                    aspectRatio.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
                disabled={isProcessing || loading}
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleCrop}
                disabled={isProcessing || loading}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors font-medium shadow-lg"
              >
                {isProcessing || loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {loading ? 'Processing...' : 'Cropping...'}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Apply Crop
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCropModal;