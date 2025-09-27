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
}

const SimpleCropModal: React.FC<SimpleCropModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio = 16/9, // Default to landscape
  title = 'Crop Image'
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

  // Initialize crop area when image loads
  const handleImageLoad = (img: HTMLImageElement) => {
    setImageElement(img);
    const container = img.parentElement;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      setContainerSize({ width: containerRect.width, height: containerRect.height });
      
      // Set initial crop size based on aspect ratio
      const cropWidth = Math.min(300, img.naturalWidth * 0.8);
      const cropHeight = aspectRatio ? cropWidth / aspectRatio : cropWidth;
      
      setCropData({
        x: (img.offsetWidth - cropWidth) / 2,
        y: (img.offsetHeight - cropHeight) / 2,
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

      // Calculate scale factor
      const scaleX = imageElement.naturalWidth / imageElement.offsetWidth;
      const scaleY = imageElement.naturalHeight / imageElement.offsetHeight;

      // Set canvas size to crop dimensions
      canvas.width = cropData.width * scaleX;
      canvas.height = cropData.height * scaleY;

      // Draw cropped portion
      ctx.drawImage(
        imageElement,
        cropData.x * scaleX,
        cropData.y * scaleY,
        cropData.width * scaleX,
        cropData.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob);
            onClose();
          }
        },
        'image/jpeg',
        0.9
      );
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCropX = cropData.x;
    const startCropY = cropData.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      setCropData(prev => ({
        ...prev,
        x: Math.max(0, Math.min(startCropX + deltaX, (imageElement?.offsetWidth || 0) - prev.width)),
        y: Math.max(0, Math.min(startCropY + deltaY, (imageElement?.offsetHeight || 0) - prev.height))
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative flex-1 p-6 bg-gray-100 dark:bg-gray-900 overflow-hidden">
          <div className="relative mx-auto max-w-full max-h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Crop preview"
              onLoad={(e) => handleImageLoad(e.target as HTMLImageElement)}
              className="max-w-full max-h-[60vh] object-contain"
              draggable={false}
            />
            
            {/* Crop overlay */}
            {imageElement && (
              <>
                {/* Darkened background */}
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                
                {/* Crop selection rectangle */}
                <div
                  className="absolute border-2 border-blue-500 bg-transparent cursor-move"
                  style={{
                    left: cropData.x,
                    top: cropData.y,
                    width: cropData.width,
                    height: cropData.height,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                  }}
                  onMouseDown={handleMouseDown}
                >
                  {/* Corner handles */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
                  
                  {/* Center crosshair */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-white rounded-full bg-blue-500 opacity-75" />
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Instructions */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm">
            🐆 Drag the blue rectangle to crop
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {/* Crop size controls */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Width:</span>
              <input
                type="range"
                min="100"
                max={imageElement?.offsetWidth || 400}
                value={cropData.width}
                onChange={(e) => {
                  const width = Number(e.target.value);
                  const height = aspectRatio ? width / aspectRatio : cropData.height;
                  setCropData(prev => ({
                    ...prev,
                    width,
                    height,
                    x: Math.max(0, Math.min(prev.x, (imageElement?.offsetWidth || 0) - width)),
                    y: Math.max(0, Math.min(prev.y, (imageElement?.offsetHeight || 0) - height))
                  }));
                }}
                className="w-24"
              />
              <span className="text-xs text-gray-500 min-w-[3rem]">{Math.round(cropData.width)}px</span>
            </div>

            {!aspectRatio && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Height:</span>
                <input
                  type="range"
                  min="50"
                  max={imageElement?.offsetHeight || 300}
                  value={cropData.height}
                  onChange={(e) => {
                    const height = Number(e.target.value);
                    setCropData(prev => ({
                      ...prev,
                      height,
                      y: Math.max(0, Math.min(prev.y, (imageElement?.offsetHeight || 0) - height))
                    }));
                  }}
                  className="w-24"
                />
                <span className="text-xs text-gray-500 min-w-[3rem]">{Math.round(cropData.height)}px</span>
              </div>
            )}
          </div>

          {/* Aspect ratio buttons */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                const width = cropData.width;
                const height = width; // Square
                setCropData(prev => ({ ...prev, height }));
              }}
              className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Square
            </button>
            <button
              type="button"
              onClick={() => {
                const width = cropData.width;
                const height = width / (16/9); // Landscape
                setCropData(prev => ({ ...prev, height }));
              }}
              className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              16:9
            </button>
            <button
              type="button"
              onClick={() => {
                const width = cropData.width;
                const height = width / (3/4); // Portrait
                setCropData(prev => ({ ...prev, height }));
              }}
              className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              3:4
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {aspectRatio && (
                <span>
                  Ratio: {aspectRatio === 1 ? '1:1' : 
                    aspectRatio === 16/9 ? '16:9' :
                    aspectRatio.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleCrop}
                disabled={isProcessing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cropping...
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