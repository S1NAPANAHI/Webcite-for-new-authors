import React, { useState, useEffect, useCallback } from 'react';
import { Image, Upload, X, Edit3, FileImage, AlertCircle, Loader2, Crop, RotateCw, ZoomIn, ZoomOut, Download, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FileRecord } from '../components/ImageInput';

// For the cropping functionality - you'll need to install this:
// npm install react-easy-crop
import Cropper from 'react-easy-crop';

export interface FileRecord {
  id: string;
  name: string;
  original_name: string;
  type?: string;
  mime_type?: string;
  size?: number;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
  folder?: string;
  url?: string | null;
  thumbnail_url?: string | null;
  storage_path?: string;
  created_at?: string;
  updated_at?: string;
}

// Crop area interface
interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropConfig {
  aspect?: number; // e.g., 16/9, 1, 4/3
  cropShape?: 'rect' | 'round';
  minZoom?: number;
  maxZoom?: number;
  showGrid?: boolean;
}

// Default crop configurations for common use cases
export const CROP_PRESETS = {
  square: { aspect: 1, cropShape: 'rect' as const, showGrid: true },
  landscape: { aspect: 16/9, cropShape: 'rect' as const, showGrid: true },
  portrait: { aspect: 3/4, cropShape: 'rect' as const, showGrid: true },
  banner: { aspect: 3/1, cropShape: 'rect' as const, showGrid: true },
  avatar: { aspect: 1, cropShape: 'round' as const, showGrid: false },
  free: { aspect: undefined, cropShape: 'rect' as const, showGrid: true }
} as const;

interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  cropConfig?: CropConfig;
  title?: string;
}

const CropModal: React.FC<CropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  cropConfig = CROP_PRESETS.free,
  title = 'Crop Image'
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Utility function to create image from canvas
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  // Function to get rotated image
  const getRotatedImage = async (
    imageSrc: string,
    rotation: number
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    const rotRad = (rotation * Math.PI) / 180;

    // Calculate canvas size
    canvas.width = Math.abs(image.width * Math.cos(rotRad)) + Math.abs(image.height * Math.sin(rotRad));
    canvas.height = Math.abs(image.width * Math.sin(rotRad)) + Math.abs(image.height * Math.cos(rotRad));

    // Rotate and draw image
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotRad);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    return canvas.toDataURL('image/png');
  };

  // Function to crop the image
  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    filename = 'cropped-image.jpg'
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    const rotRad = (rotation * Math.PI) / 180;

    // Calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = {
      width: Math.abs(image.width * Math.cos(rotRad)) + Math.abs(image.height * Math.sin(rotRad)),
      height: Math.abs(image.width * Math.sin(rotRad)) + Math.abs(image.height * Math.cos(rotRad))
    };

    // Set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // Translate canvas context to center point of bounding box
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    // Crop the rotated image
    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    // Set canvas size to final desired crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Clear the canvas and paste the cropped image
    ctx.putImageData(data, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob!);
        },
        'image/jpeg',
        0.95 // Quality
      );
    });
  };

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels) return;
    
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onCropComplete(croppedImage);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
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
        <div className="relative flex-1 bg-gray-900" style={{ minHeight: '400px' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={cropConfig.aspect}
            cropShape={cropConfig.cropShape}
            showGrid={cropConfig.showGrid}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteHandler}
            minZoom={cropConfig.minZoom || 0.5}
            maxZoom={cropConfig.maxZoom || 3}
            classes={{
              containerClassName: 'h-full',
              mediaClassName: 'max-h-full'
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {/* Zoom and Rotation Controls */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <ZoomOut className="w-4 h-4 text-gray-500" />
              <input
                type="range"
                value={zoom}
                min={cropConfig.minZoom || 0.5}
                max={cropConfig.maxZoom || 3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-24"
              />
              <ZoomIn className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500 min-w-[3rem]">{zoom.toFixed(1)}x</span>
            </div>

            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-gray-500" />
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={15}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-gray-500 min-w-[3rem]">{rotation}°</span>
            </div>

            {/* Quick rotation buttons */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {cropConfig.aspect && (
                <span>Aspect Ratio: {cropConfig.aspect === 1 ? '1:1' : 
                  cropConfig.aspect === 16/9 ? '16:9' :
                  cropConfig.aspect === 3/4 ? '3:4' :
                  cropConfig.aspect === 3/1 ? '3:1' :
                  cropConfig.aspect.toFixed(2)}
                </span>
              )}
              {cropConfig.cropShape === 'round' && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Circular Crop</span>
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
                onClick={handleApplyCrop}
                disabled={!croppedAreaPixels || isProcessing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
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
    </div>
  );
};

// FIXED: Direct URL generation using the actual URL from database
export const getFileUrl = (file: FileRecord): string => {
  if (file.url) {
    return file.url;
  }
  
  if (file.storage_path) {
    const { data } = supabase.storage.from('media').getPublicUrl(file.storage_path);
    return data.publicUrl;
  }
  
  return '';
};

export const getThumbnailUrl = (file: FileRecord): string => {
  if (file.thumbnail_url) {
    return file.thumbnail_url;
  }
  
  if (file.mime_type?.startsWith('image/') || file.type === 'images') {
    return getFileUrl(file);
  }
  
  const placeholderSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14,2 14,8 20,8"/>
      <circle cx="10" cy="13" r="2"/>
      <path d="m20 17-1.09-1.09a2 2 0 0 0-2.83 0L10 22"/>
    </svg>
  `)}`;
  
  return placeholderSvg;
};

interface FilePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: FileRecord) => void;
  allowedTypes?: string[];
  title?: string;
}

const FilePickerModal: React.FC<FilePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = ['images'],
  title = 'Select Image'
}) => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('files')
        .select('*');
      
      if (allowedTypes.includes('images')) {
        query = query.eq('type', 'images');
      }
      
      query = query
        .order('created_at', { ascending: false })
        .limit(50);
        
      const { data, error: filesError } = await query;
        
      if (filesError) {
        throw filesError;
      }
      
      setFiles(data || []);
    } catch (err) {
      console.error('Error loading files:', err);
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter(file => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      if (!file.name.toLowerCase().includes(searchLower) && 
          !file.original_name?.toLowerCase().includes(searchLower) &&
          !file.alt_text?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    if (selectedFolder !== 'all' && file.folder !== selectedFolder) {
      return false;
    }
    
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search files by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Folders</option>
              <option value="covers">Book Covers</option>
              <option value="heroes">Hero Images</option>
              <option value="banners">Banners</option>
              <option value="characters">Characters</option>
              <option value="misc">Miscellaneous</option>
            </select>
          </div>
        </div>
        
        {/* File Grid */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600 dark:text-gray-400">Loading files...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-red-600">
                <AlertCircle className="w-8 h-8 mx-auto mb-4" />
                <p className="mb-4">{error}</p>
                <button
                  onClick={loadFiles}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <FileImage className="w-8 h-8 mx-auto mb-4" />
                <p>No images found</p>
                <p className="text-sm mt-1">
                  {searchQuery ? 'Try different search terms' : 'Upload images in the File Manager'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => {
                const imageUrl = getFileUrl(file);
                const thumbnailUrl = getThumbnailUrl(file);
                
                return (
                  <div
                    key={file.id}
                    className="group relative border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-400"
                    onClick={() => onSelect(file)}
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <img
                        src={thumbnailUrl || imageUrl}
                        alt={file.alt_text || file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="p-3 bg-white dark:bg-gray-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      {file.width && file.height && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {file.width} × {file.height}px
                        </p>
                      )}
                      {file.folder && file.folder !== 'misc' && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                          {file.folder}
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-blue-600 text-white rounded-lg px-3 py-1 text-sm font-medium">
                          Select Image
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredFiles.length} images available
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ImageInputWithCroppingProps {
  label: string;
  value?: FileRecord | null;
  onChange: (fileRecord: FileRecord | null, url: string | null) => void;
  placeholder?: string;
  required?: boolean;
  allowedTypes?: string[];
  className?: string;
  showPreview?: boolean;
  previewSize?: 'small' | 'medium' | 'large';
  // New cropping props
  enableCropping?: boolean;
  cropConfig?: CropConfig;
  cropPresets?: (keyof typeof CROP_PRESETS)[];
  onImageProcessed?: (processedBlob: Blob, originalFile: FileRecord) => void;
}

const ImageInputWithCropping: React.FC<ImageInputWithCroppingProps> = ({
  label,
  value,
  onChange,
  placeholder = "No image selected",
  required = false,
  allowedTypes = ['images'],
  className = '',
  showPreview = true,
  previewSize = 'medium',
  enableCropping = true,
  cropConfig = CROP_PRESETS.free,
  cropPresets,
  onImageProcessed
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageForCrop, setSelectedImageForCrop] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<FileRecord | null>(null);
  const [imageError, setImageError] = useState(false);
  const [currentCropConfig, setCurrentCropConfig] = useState<CropConfig>(cropConfig);

  const handleFileSelect = async (file: FileRecord) => {
    console.log('File selected for cropping workflow:', file);
    
    if (enableCropping && file.mime_type?.startsWith('image/')) {
      // Start cropping workflow
      const imageUrl = getFileUrl(file);
      setSelectedImageForCrop(imageUrl);
      setPendingFile(file);
      setShowPicker(false);
      setShowCropModal(true);
    } else {
      // Direct selection without cropping
      const url = getFileUrl(file);
      onChange(file, url);
      setImageError(false);
      setShowPicker(false);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!pendingFile) return;

    try {
      console.log('Cropping completed, processing image...');
      
      if (onImageProcessed) {
        // Let the parent handle the processed image
        onImageProcessed(croppedImageBlob, pendingFile);
      } else {
        // Default behavior: upload the cropped image
        await uploadCroppedImage(croppedImageBlob, pendingFile);
      }
      
    } catch (error) {
      console.error('Error processing cropped image:', error);
    } finally {
      setShowCropModal(false);
      setSelectedImageForCrop(null);
      setPendingFile(null);
    }
  };

  const uploadCroppedImage = async (croppedBlob: Blob, originalFile: FileRecord) => {
    try {
      // Generate new filename for cropped version
      const timestamp = Date.now();
      const originalName = originalFile.original_name || originalFile.name;
      const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      const extension = originalName.substring(originalName.lastIndexOf('.')) || '.jpg';
      const croppedFileName = `${nameWithoutExt}-cropped-${timestamp}${extension}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(`images/cropped/${croppedFileName}`, croppedBlob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(uploadData.path);

      // Create file record in database
      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
          name: croppedFileName,
          original_name: croppedFileName,
          type: 'images',
          mime_type: 'image/jpeg',
          folder: originalFile.folder || 'cropped',
          storage_path: uploadData.path,
          url: urlData.publicUrl,
          alt_text: `Cropped version of ${originalFile.alt_text || originalFile.name}`,
          size: croppedBlob.size
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      console.log('Cropped image uploaded successfully:', fileRecord);
      
      // Set the new cropped image as the selected value
      onChange(fileRecord, urlData.publicUrl);
      setImageError(false);
      
    } catch (error) {
      console.error('Error uploading cropped image:', error);
      alert('Failed to save cropped image. Please try again.');
    }
  };

  const handleRemove = () => {
    onChange(null, null);
    setImageError(false);
  };

  const displayUrl = value ? getFileUrl(value) : null;
  const thumbnailUrl = value ? getThumbnailUrl(value) : null;
  const finalImageUrl = thumbnailUrl || displayUrl;

  const getPreviewHeight = () => {
    switch (previewSize) {
      case 'small': return '80px';
      case 'large': return '200px';
      default: return '120px';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {enableCropping && (
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
            ✂️ Cropping Available
          </span>
        )}
      </label>

      {/* Crop Presets (if enabled and presets provided) */}
      {enableCropping && cropPresets && cropPresets.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-xs text-gray-500">Quick presets:</span>
          {cropPresets.map((presetKey) => {
            const preset = CROP_PRESETS[presetKey];
            const isActive = JSON.stringify(currentCropConfig) === JSON.stringify(preset);
            return (
              <button
                key={presetKey}
                type="button"
                onClick={() => setCurrentCropConfig(preset)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {presetKey}
              </button>
            );
          })}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden transition-colors hover:border-gray-400 dark:hover:border-gray-500">
        {finalImageUrl && !imageError && showPreview ? (
          <div className="relative group bg-gray-50 dark:bg-gray-800">
            <img
              src={finalImageUrl}
              alt={value?.alt_text || value?.name || label}
              onError={() => setImageError(true)}
              className="w-full object-cover"
              style={{ height: getPreviewHeight() }}
              loading="lazy"
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  type="button"
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  onClick={() => setShowPicker(true)}
                  title="Change image"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {enableCropping && value && (
                  <button
                    type="button"
                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    onClick={() => {
                      const imageUrl = getFileUrl(value);
                      setSelectedImageForCrop(imageUrl);
                      setPendingFile(value);
                      setShowCropModal(true);
                    }}
                    title="Crop image"
                  >
                    <Crop className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  onClick={handleRemove}
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* File info */}
            {value && (
              <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {value.name}
                    </p>
                    {value.width && value.height && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {value.width} × {value.height}px
                      </p>
                    )}
                  </div>
                  
                  {value.folder && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {value.folder}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setShowPicker(true)}
          >
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <Image className="w-6 h-6 text-gray-400" />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {imageError ? '⚠️ Failed to load image' : placeholder}
                </p>
                
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Select Image
                </button>
                
                {enableCropping && (
                  <p className="text-xs text-purple-600 mt-2 flex items-center justify-center gap-1">
                    <Crop className="w-3 h-3" />
                    Cropping tools available
                  </p>
                )}
              </div>
              
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Choose from your media library
              </p>
            </div>
          </div>
        )}
      </div>

      {/* File Picker Modal */}
      <FilePickerModal
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleFileSelect}
        allowedTypes={allowedTypes}
        title={`Select ${label}`}
      />

      {/* Crop Modal */}
      {enableCropping && selectedImageForCrop && (
        <CropModal
          isOpen={showCropModal}
          onClose={() => {
            setShowCropModal(false);
            setSelectedImageForCrop(null);
            setPendingFile(null);
          }}
          imageSrc={selectedImageForCrop}
          onCropComplete={handleCropComplete}
          cropConfig={currentCropConfig}
          title={`Crop ${label}`}
        />
      )}
    </div>
  );
};

export default ImageInputWithCropping;
export { CropModal, CROP_PRESETS };
export type { CropConfig, Area, ImageInputWithCroppingProps };