import React, { useState } from 'react';
import { Image, Upload, X, Eye } from 'lucide-react';
import { FileRecord, getFileUrl, getThumbnailUrl } from '../utils/fileUpload';
import FilePickerModal from './FilePicker/FilePickerModal';

interface ImageInputProps {
  label?: string;
  value?: string | FileRecord | null;
  onChange: (file: FileRecord | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  allowedTypes?: string[];
  showPreview?: boolean;
  previewSize?: 'small' | 'medium' | 'large';
  required?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select an image...',
  className = '',
  disabled = false,
  allowedTypes = ['images'],
  showPreview = true,
  previewSize = 'medium',
  required = false
}) => {
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Convert value to FileRecord if it's a string ID
  React.useEffect(() => {
    const loadFileRecord = async () => {
      if (typeof value === 'string' && value) {
        // If value is a URL, use it directly
        if (value.startsWith('http')) {
          setPreviewUrl(value);
          return;
        }
        
        // If value is a file ID, fetch the file record
        try {
          const { getFileById } = await import('../utils/fileUpload');
          const file = await getFileById(value);
          if (file) {
            setPreviewUrl(getFileUrl(file));
          }
        } catch (error) {
          console.warn('Could not load file:', error);
          setPreviewUrl(null);
        }
      } else if (value && typeof value === 'object') {
        setPreviewUrl(getFileUrl(value));
      } else {
        setPreviewUrl(null);
      }
    };

    loadFileRecord();
  }, [value]);

  const handleFileSelect = (file: FileRecord) => {
    onChange(file);
    setShowFilePicker(false);
  };

  const handleRemove = () => {
    onChange(null);
    setPreviewUrl(null);
  };

  const handleViewImage = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const getPreviewDimensions = () => {
    switch (previewSize) {
      case 'small': return 'w-20 h-20';
      case 'large': return 'w-32 h-32';
      default: return 'w-24 h-24';
    }
  };

  const currentFileName = typeof value === 'object' && value?.name 
    ? value.name 
    : typeof value === 'string' && value.startsWith('http')
    ? 'External image'
    : value
    ? 'Selected file'
    : null;

  return (
    <div className={`image-input ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex items-start gap-4">
        {/* Preview */}
        {showPreview && previewUrl && (
          <div className={`relative ${getPreviewDimensions()} flex-shrink-0`}>
            <img
              src={previewUrl}
              alt={currentFileName || 'Preview'}
              className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-600"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
              <button
                type="button"
                onClick={handleViewImage}
                className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                title="View full size"
              >
                <Eye size={14} className="text-gray-700" />
              </button>
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => setShowFilePicker(true)}
              disabled={disabled}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {value ? (
                <>
                  <Image size={16} />
                  Replace
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Select Image
                </>
              )}
            </button>
            
            {value && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="inline-flex items-center gap-1 px-2 py-2 text-sm text-red-600 hover:text-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove image"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {currentFileName && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={currentFileName}>
              {currentFileName}
            </p>
          )}
          
          {!value && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {placeholder}
            </p>
          )}
        </div>
      </div>
      
      {/* File Picker Modal */}
      <FilePickerModal
        isOpen={showFilePicker}
        onClose={() => setShowFilePicker(false)}
        onSelect={handleFileSelect}
        allowedTypes={allowedTypes}
        title={`Select ${allowedTypes.includes('images') ? 'Image' : 'File'}`}
      />
    </div>
  );
};

export default ImageInput;