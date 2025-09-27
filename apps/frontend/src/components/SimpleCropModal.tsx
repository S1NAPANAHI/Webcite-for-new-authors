import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, Loader2, Crop } from 'lucide-react';

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SimpleCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedBlob: Blob) => void;
  aspectRatio?: number;
  title?: string;
  loading?: boolean;
}

const SimpleCropModal: React.FC<SimpleCropModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio = 16/9,
  title = 'Crop Image',
  loading = false
}) => {
  const [cropData, setCropData] = useState<CropData>({ x: 50, y: 50, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate scaled dimensions to fit modal while showing full image
  const calculateImageDimensions = useCallback(() => {
    if (!imageElement) return { width: 0, height: 0, scale: 1 };
    
    // Modal content area constraints
    const maxWidth = Math.min(900, window.innerWidth - 120);
    const maxHeight = Math.min(600, window.innerHeight - 300);
    
    const scaleX = maxWidth / imageElement.naturalWidth;
    const scaleY = maxHeight / imageElement.naturalHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't upscale beyond natural size
    
    return {
      width: imageElement.naturalWidth * scale,
      height: imageElement.naturalHeight * scale,
      scale
    };
  }, [imageElement]);

  // Initialize image and crop area
  useEffect(() => {
    if (isOpen && imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Handle CORS for external images
      img.onload = () => {
        console.log('Image loaded successfully:', {
          natural: { width: img.naturalWidth, height: img.naturalHeight },
          src: imageUrl
        });
        
        setImageElement(img);
        
        // Calculate display dimensions
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        
        const maxWidth = Math.min(900, window.innerWidth - 120);
        const maxHeight = Math.min(600, window.innerHeight - 300);
        
        const scaleX = maxWidth / naturalWidth;
        const scaleY = maxHeight / naturalHeight;
        const scale = Math.min(scaleX, scaleY, 1);
        
        const displayWidth = naturalWidth * scale;
        const displayHeight = naturalHeight * scale;
        
        // Set initial crop area (centered, respecting aspect ratio)
        const cropWidth = Math.min(300, displayWidth * 0.6);
        const cropHeight = aspectRatio ? cropWidth / aspectRatio : cropWidth * 0.75;
        
        setCropData({
          x: (displayWidth - cropWidth) / 2,
          y: (displayHeight - cropHeight) / 2,
          width: cropWidth,
          height: Math.min(cropHeight, displayHeight * 0.6)
        });
        
        console.log('Initial crop data set:', {
          display: { width: displayWidth, height: displayHeight },
          crop: { width: cropWidth, height: cropHeight },
          scale: scale
        });
      };
      
      img.onerror = () => {
        console.error('Failed to load image:', imageUrl);
        alert('Failed to load image. Please try again.');
      };
      
      img.src = imageUrl;
    }
  }, [isOpen, imageUrl, aspectRatio]);

  const handleMouseDown = (e: React.MouseEvent, action: 'drag' | 'resize', handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    if (action === 'drag') {
      setIsDragging(true);
    } else if (action === 'resize') {
      setIsResizing(true);
      setResizeHandle(handle || null);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !imageElement) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const { width: imgWidth, height: imgHeight } = calculateImageDimensions();
    
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = currentX - dragStart.x;
      const deltaY = currentY - dragStart.y;
      
      setCropData(prev => {
        const newX = Math.max(0, Math.min(prev.x + deltaX, imgWidth - prev.width));
        const newY = Math.max(0, Math.min(prev.y + deltaY, imgHeight - prev.height));
        return { ...prev, x: newX, y: newY };
      });
      
      setDragStart({ x: currentX, y: currentY });
    } else if (isResizing && resizeHandle) {
      setCropData(prev => {
        let newData = { ...prev };
        const minSize = 50;
        
        switch (resizeHandle) {
          case 'nw': // Top-left
            const nwNewX = Math.max(0, Math.min(currentX, prev.x + prev.width - minSize));
            const nwNewY = Math.max(0, Math.min(currentY, prev.y + prev.height - minSize));
            newData.width = prev.x + prev.width - nwNewX;
            newData.height = prev.y + prev.height - nwNewY;
            newData.x = nwNewX;
            newData.y = nwNewY;
            break;
          case 'ne': // Top-right
            const neNewY = Math.max(0, Math.min(currentY, prev.y + prev.height - minSize));
            newData.width = Math.max(minSize, Math.min(currentX - prev.x, imgWidth - prev.x));
            newData.height = prev.y + prev.height - neNewY;
            newData.y = neNewY;
            break;
          case 'sw': // Bottom-left
            const swNewX = Math.max(0, Math.min(currentX, prev.x + prev.width - minSize));
            newData.width = prev.x + prev.width - swNewX;
            newData.height = Math.max(minSize, Math.min(currentY - prev.y, imgHeight - prev.y));
            newData.x = swNewX;
            break;
          case 'se': // Bottom-right
            newData.width = Math.max(minSize, Math.min(currentX - prev.x, imgWidth - prev.x));
            newData.height = Math.max(minSize, Math.min(currentY - prev.y, imgHeight - prev.y));
            break;
        }
        
        // Apply aspect ratio if specified
        if (aspectRatio && resizeHandle) {
          if (resizeHandle === 'se' || resizeHandle === 'nw') {
            newData.height = newData.width / aspectRatio;
          } else if (resizeHandle === 'ne' || resizeHandle === 'sw') {
            newData.width = newData.height * aspectRatio;
          }
        }
        
        // Ensure bounds
        if (newData.x + newData.width > imgWidth) {
          newData.width = imgWidth - newData.x;
          if (aspectRatio) newData.height = newData.width / aspectRatio;
        }
        if (newData.y + newData.height > imgHeight) {
          newData.height = imgHeight - newData.y;
          if (aspectRatio) newData.width = newData.height * aspectRatio;
        }
        
        return newData;
      });
    }
  }, [isDragging, isResizing, resizeHandle, dragStart, imageElement, calculateImageDimensions, aspectRatio]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // ENHANCED CROP FUNCTION WITH MULTIPLE FALLBACKS
  const handleCrop = async () => {
    if (!imageElement) {
      console.error('No image element available for cropping');
      alert('Image not loaded properly. Please try again.');
      return;
    }

    // Validate crop data
    if (cropData.width <= 0 || cropData.height <= 0) {
      console.error('Invalid crop dimensions:', cropData);
      alert('Invalid crop area. Please adjust the crop selection.');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Starting crop process...');
      
      const { scale } = calculateImageDimensions();
      console.log('Scale factor:', scale);
      
      // Calculate actual crop coordinates in original image
      const actualCropX = cropData.x / scale;
      const actualCropY = cropData.y / scale;
      const actualCropWidth = cropData.width / scale;
      const actualCropHeight = cropData.height / scale;
      
      console.log('Crop coordinates:', {
        display: cropData,
        actual: { x: actualCropX, y: actualCropY, width: actualCropWidth, height: actualCropHeight },
        imageNatural: { width: imageElement.naturalWidth, height: imageElement.naturalHeight }
      });
      
      // Validate coordinates are within image bounds
      if (actualCropX < 0 || actualCropY < 0 || 
          actualCropX + actualCropWidth > imageElement.naturalWidth ||
          actualCropY + actualCropHeight > imageElement.naturalHeight) {
        throw new Error('Crop coordinates exceed image boundaries');
      }
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { 
        alpha: true,
        willReadFrequently: false
      });
      
      if (!ctx) {
        throw new Error('Could not create canvas 2D context');
      }
      
      console.log('Canvas context created successfully');
      
      // Set canvas dimensions to actual crop size
      canvas.width = Math.round(actualCropWidth);
      canvas.height = Math.round(actualCropHeight);
      
      console.log('Canvas dimensions set:', { width: canvas.width, height: canvas.height });
      
      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Clear canvas and draw cropped image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        imageElement,
        Math.round(actualCropX),
        Math.round(actualCropY),
        Math.round(actualCropWidth),
        Math.round(actualCropHeight),
        0,
        0,
        canvas.width,
        canvas.height
      );
      
      console.log('Image drawn to canvas');
      
      // Try multiple conversion methods
      const convertToBlob = (): Promise<Blob> => {
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 3;
          
          const tryConversion = (format: string, quality: number) => {
            attempts++;
            console.log(`Conversion attempt ${attempts}: ${format} at ${quality} quality`);
            
            canvas.toBlob(
              (blob) => {
                if (blob && blob.size > 0) {
                  console.log(`✅ Conversion successful: ${blob.size} bytes, ${format}`);
                  resolve(blob);
                } else if (attempts < maxAttempts) {
                  console.log(`❌ Conversion failed, trying next method...`);
                  // Try different formats
                  if (format === 'image/jpeg') {
                    tryConversion('image/png', 1.0);
                  } else if (format === 'image/png') {
                    tryConversion('image/webp', 0.9);
                  } else {
                    reject(new Error('All blob conversion methods failed'));
                  }
                } else {
                  reject(new Error('Maximum conversion attempts reached'));
                }
              },
              format,
              quality
            );
          };
          
          // Start with JPEG at high quality
          tryConversion('image/jpeg', 0.95);
        });
      };
      
      const blob = await convertToBlob();
      
      console.log('✅ Crop completed successfully:', {
        blobSize: blob.size,
        blobType: blob.type
      });
      
      onCropComplete(blob);
      onClose();
      
    } catch (error) {
      console.error('❌ Detailed crop error:', error);
      console.log('Debug info:', {
        cropData,
        imageElement: imageElement ? {
          naturalWidth: imageElement.naturalWidth,
          naturalHeight: imageElement.naturalHeight,
          src: imageElement.src
        } : null,
        canvasSupport: !!document.createElement('canvas').getContext
      });
      
      // Provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes('canvas')) {
          alert('Canvas not supported in your browser. Please try a modern browser.');
        } else if (error.message.includes('context')) {
          alert('Graphics rendering unavailable. Please refresh the page and try again.');
        } else if (error.message.includes('boundaries')) {
          alert('Crop area is outside image bounds. Please adjust your selection.');
        } else if (error.message.includes('conversion')) {
          alert('Image conversion failed. The image might be corrupted or too large.');
        } else {
          alert(`Crop failed: ${error.message}`);
        }
      } else {
        alert('Unknown cropping error. Please try refreshing the page.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const { width: displayWidth, height: displayHeight } = calculateImageDimensions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-h-[95vh] overflow-hidden flex flex-col" style={{ maxWidth: '95vw' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              ✂️ Drag to move • Corners to resize
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

        {/* Crop Area - FULL IMAGE VISIBILITY */}
        <div className="flex-1 p-6 bg-gray-900 overflow-auto flex items-center justify-center">
          <div className="relative">
            <div 
              ref={containerRef}
              className="relative border border-gray-600 rounded-lg overflow-hidden bg-gray-800"
              style={{ 
                width: displayWidth,
                height: displayHeight,
                minWidth: displayWidth,
                minHeight: displayHeight
              }}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop preview"
                className="block w-full h-full object-contain select-none"
                style={{ 
                  width: displayWidth,
                  height: displayHeight,
                  userSelect: 'none'
                }}
                draggable={false}
              />
              
              {/* Crop overlay with resize handles */}
              {imageElement && (
                <div
                  className={`absolute border-2 cursor-move transition-all duration-150 ${
                    isDragging || isResizing ? 'border-blue-400 shadow-lg' : 'border-blue-500 hover:border-blue-300'
                  }`}
                  style={{
                    left: cropData.x,
                    top: cropData.y,
                    width: cropData.width,
                    height: cropData.height,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                    zIndex: 10
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'drag')}
                >
                  
                  {/* Corner resize handles */}
                  <div
                    className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-nw-resize shadow-md hover:bg-blue-600 transition-colors"
                    style={{ top: -6, left: -6 }}
                    onMouseDown={(e) => handleMouseDown(e, 'resize', 'nw')}
                  />
                  <div
                    className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-ne-resize shadow-md hover:bg-blue-600 transition-colors"
                    style={{ top: -6, right: -6 }}
                    onMouseDown={(e) => handleMouseDown(e, 'resize', 'ne')}
                  />
                  <div
                    className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-sw-resize shadow-md hover:bg-blue-600 transition-colors"
                    style={{ bottom: -6, left: -6 }}
                    onMouseDown={(e) => handleMouseDown(e, 'resize', 'sw')}
                  />
                  <div
                    className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-se-resize shadow-md hover:bg-blue-600 transition-colors"
                    style={{ bottom: -6, right: -6 }}
                    onMouseDown={(e) => handleMouseDown(e, 'resize', 'se')}
                  />
                  
                  {/* Center indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md">
                      <div className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5"></div>
                    </div>
                  </div>
                  
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info and Controls */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          
          {/* Live info display */}
          <div className="flex justify-between items-center mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              Position: ({Math.round(cropData.x)}, {Math.round(cropData.y)})
            </div>
            <div>
              Size: {Math.round(cropData.width)} × {Math.round(cropData.height)}px
            </div>
            <div>
              Ratio: {aspectRatio === 1 ? '1:1' : aspectRatio === 16/9 ? '16:9' : aspectRatio?.toFixed(2) || 'Free'}
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
            <div className="font-medium mb-1">How to use:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>• Drag blue area to move</div>
              <div>• Drag corners to resize</div>
              <div>• Image auto-scaled to fit</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {imageElement && (
                <span>
                  📷 Original: {imageElement.naturalWidth}×{imageElement.naturalHeight}px
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
                disabled={isProcessing || loading || !imageElement}
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