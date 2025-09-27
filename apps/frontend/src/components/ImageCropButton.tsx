import React, { useState, useRef } from 'react';
import { Crop, X, Check, Loader2 } from 'lucide-react';

interface ImageCropButtonProps {
  imageUrl: string;
  onCropComplete: (croppedImageFile: File) => void;
  aspectRatio?: number; // 16/9, 1, 4/3, etc.
  buttonText?: string;
  className?: string;
}

const ImageCropButton: React.FC<ImageCropButtonProps> = ({
  imageUrl,
  onCropComplete,
  aspectRatio = 16/9,
  buttonText = "Crop Image",
  className = ""
}) => {
  const [showCropModal, setShowCropModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, width: 300, height: 169 }); // Default 16:9
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, boxX: 0, boxY: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCropClick = () => {
    setShowCropModal(true);
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      const containerWidth = 600; // Modal width
      const containerHeight = 400; // Modal height
      
      // Calculate initial crop box
      const cropWidth = Math.min(300, img.offsetWidth * 0.6);
      const cropHeight = aspectRatio ? cropWidth / aspectRatio : cropWidth * 0.6;
      
      setCropBox({
        x: (img.offsetWidth - cropWidth) / 2,
        y: (img.offsetHeight - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      boxX: cropBox.x,
      boxY: cropBox.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !imageRef.current) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newX = Math.max(0, Math.min(dragStart.boxX + deltaX, imageRef.current.offsetWidth - cropBox.width));
    const newY = Math.max(0, Math.min(dragStart.boxY + deltaY, imageRef.current.offsetHeight - cropBox.height));
    
    setCropBox(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const applyCrop = async () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    try {
      setIsProcessing(true);
      
      const img = imageRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas context not available');
      
      // Calculate scale factors
      const scaleX = img.naturalWidth / img.offsetWidth;
      const scaleY = img.naturalHeight / img.offsetHeight;
      
      // Set canvas size
      canvas.width = cropBox.width * scaleX;
      canvas.height = cropBox.height * scaleY;
      
      // Draw cropped image
      ctx.drawImage(
        img,
        cropBox.x * scaleX,
        cropBox.y * scaleY,
        cropBox.width * scaleX,
        cropBox.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
      
      // Convert to blob and then to File
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `cropped-image-${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          onCropComplete(file);
          setShowCropModal(false);
        }
      }, 'image/jpeg', 0.9);
      
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Crop Button */}
      <button
        type="button"
        onClick={handleCropClick}
        className={`inline-flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors ${className}`}
        title="Crop and adjust this image"
      >
        <Crop className="w-4 h-4" />
        {buttonText}
      </button>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Crop className="w-5 h-5 text-purple-600" />
                Crop Image
              </h3>
              <button
                onClick={() => setShowCropModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Crop Area */}
            <div className="relative p-6 bg-gray-100 dark:bg-gray-900" style={{ height: '500px' }}>
              <div className="relative h-full flex items-center justify-center overflow-hidden">
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Crop preview"
                  onLoad={handleImageLoad}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
                
                {/* Crop overlay */}
                <div
                  className="absolute border-2 border-purple-500 bg-transparent cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                  style={{
                    left: cropBox.x,
                    top: cropBox.y,
                    width: cropBox.width,
                    height: cropBox.height
                  }}
                  onMouseDown={handleMouseDown}
                >
                  {/* Corner indicators */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white" />
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white" />
                  
                  {/* Info overlay */}
                  <div className="absolute -bottom-8 left-0 bg-purple-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    {Math.round(cropBox.width)} × {Math.round(cropBox.height)}px
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm">
                  📏 Drag the purple area to select what to crop
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              {/* Size controls */}
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Size:</span>
                  <input
                    type="range"
                    min="100"
                    max="500"
                    value={cropBox.width}
                    onChange={(e) => {
                      const width = Number(e.target.value);
                      const height = aspectRatio ? width / aspectRatio : cropBox.height;
                      setCropBox(prev => ({ ...prev, width, height }));
                    }}
                    className="w-32"
                  />
                </div>
                
                {/* Quick aspect ratio buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const width = cropBox.width;
                      setCropBox(prev => ({ ...prev, height: width })); // Square
                    }}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded"
                  >
                    Square
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const width = cropBox.width;
                      setCropBox(prev => ({ ...prev, height: width / (16/9) })); // Landscape
                    }}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded"
                  >
                    16:9
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCropModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyCrop}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
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
      )}
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
};

export default ImageCropButton;