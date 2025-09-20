import React, { useState, useEffect } from 'react';
import { Image, Upload, X, Edit3, FileImage, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

// FIXED: Direct URL generation using the actual URL from database
export const getFileUrl = (file: FileRecord): string => {
  // First try the stored URL
  if (file.url) {
    return file.url;
  }
  
  // Fallback: generate URL from storage path
  if (file.storage_path) {
    const { data } = supabase.storage.from('media').getPublicUrl(file.storage_path);
    return data.publicUrl;
  }
  
  return '';
};

export const getThumbnailUrl = (file: FileRecord): string => {
  // Use thumbnail if available
  if (file.thumbnail_url) {
    return file.thumbnail_url;
  }
  
  // For images, use the main URL (Supabase will auto-optimize)
  if (file.mime_type?.startsWith('image/') || file.type === 'images') {
    return getFileUrl(file);
  }
  
  // Fallback for non-images
  return '/icons/file-placeholder.svg';
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
      
      console.log('Loading files for picker...', { allowedTypes });
      
      let query = supabase
        .from('files')
        .select('*');
      
      // Filter by type
      if (allowedTypes.includes('images')) {
        query = query.eq('type', 'images');
      }
      
      query = query
        .order('created_at', { ascending: false })
        .limit(50);
        
      const { data, error: filesError } = await query;
      
      console.log('Files loaded:', { data, filesError });
        
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
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
                
                console.log(`File ${file.name} URLs:`, { imageUrl, thumbnailUrl, file });
                
                return (
                  <div
                    key={file.id}
                    className="group relative border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-400"
                    onClick={() => {
                      console.log('File selected:', file);
                      onSelect(file);
                    }}
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <img
                        src={thumbnailUrl || imageUrl}
                        alt={file.alt_text || file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onLoad={(e) => {
                          console.log(`Image loaded successfully: ${file.name}`);
                        }}
                        onError={(e) => {
                          console.error(`Failed to load image: ${file.name}`, {
                            src: (e.target as HTMLImageElement).src,
                            file
                          });
                          // Try fallback URL
                          const img = e.target as HTMLImageElement;
                          if (img.src !== imageUrl && imageUrl !== thumbnailUrl) {
                            img.src = imageUrl;
                          }
                        }}
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
                    
                    {/* Hover overlay */}
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

interface ImageInputProps {
  label: string;
  value?: FileRecord | null;
  onChange: (fileRecord: FileRecord | null, url: string | null) => void;
  placeholder?: string;
  required?: boolean;
  allowedTypes?: string[];
  className?: string;
  showPreview?: boolean;
  previewSize?: 'small' | 'medium' | 'large';
}

const ImageInput: React.FC<ImageInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "No image selected",
  required = false,
  allowedTypes = ['images'],
  className = '',
  showPreview = true,
  previewSize = 'medium'
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFileSelect = (file: FileRecord) => {
    console.log('ImageInput: File selected', file);
    
    const url = getFileUrl(file);
    console.log('ImageInput: Generated URL', url);
    
    onChange(file, url);
    setImageError(false);
    setShowPicker(false);
    
    console.log('ImageInput: Selection complete');
  };

  const handleRemove = () => {
    console.log('ImageInput: Removing image');
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

  // Debug logging
  useEffect(() => {
    if (value) {
      console.log('ImageInput: Current value', {
        value,
        displayUrl,
        thumbnailUrl,
        finalImageUrl
      });
    }
  }, [value, displayUrl, thumbnailUrl, finalImageUrl]);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden transition-colors hover:border-gray-400 dark:hover:border-gray-500">
        {finalImageUrl && !imageError && showPreview ? (
          <div className="relative group bg-gray-50 dark:bg-gray-800">
            <img
              src={finalImageUrl}
              alt={value?.alt_text || value?.name || label}
              onError={(e) => {
                console.error('Image failed to load:', {
                  src: (e.target as HTMLImageElement).src,
                  value
                });
                setImageError(true);
              }}
              onLoad={() => {
                console.log('Image loaded successfully in preview');
              }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPicker(true);
                  }}
                  title="Change image"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
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
            onClick={() => {
              console.log('Opening file picker...');
              setShowPicker(true);
            }}
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
        onClose={() => {
          console.log('Closing file picker');
          setShowPicker(false);
        }}
        onSelect={handleFileSelect}
        allowedTypes={allowedTypes}
        title={`Select ${label}`}
      />
    </div>
  );
};

export default ImageInput;