import React, { useState, useEffect } from 'react';
import { Image, Upload, X, Edit3, FileImage, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export interface FileRecord {
  id: string;
  name: string;
  type?: string;
  size?: number;
  width?: number;
  height?: number;
  alt_text?: string;
  folder?: string;
  url?: string;
  thumbnail_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const getFileUrl = (file: FileRecord): string => {
  if (file.url) return file.url;
  if (file.id) {
    const { data } = supabase.storage.from('media').getPublicUrl(`files/${file.id}`);
    return data.publicUrl;
  }
  return '';
};

export const getThumbnailUrl = (file: FileRecord): string => {
  if (file.thumbnail_url) return file.thumbnail_url;
  if (file.id) {
    const { data } = supabase.storage.from('media').getPublicUrl(`thumbnails/${file.id}.webp`);
    return data.publicUrl;
  }
  return getFileUrl(file);
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
      
      const { data, error: filesError } = await supabase
        .from('files')
        .select('*')
        .in('type', allowedTypes)
        .order('created_at', { ascending: false })
        .limit(50);
        
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
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search files by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading files...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-red-600">
                <AlertCircle className="w-8 h-8 mx-auto mb-4" />
                <p>{error}</p>
                <button
                  onClick={loadFiles}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-gray-500">
                <FileImage className="w-8 h-8 mx-auto mb-4" />
                <p>No images found</p>
                <p className="text-sm mt-1">
                  {searchQuery ? 'Try different search terms' : 'Upload images in the File Manager'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="group relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    onSelect(file);
                    onClose();
                  }}
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={getThumbnailUrl(file)}
                      alt={file.alt_text || file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    {file.width && file.height && (
                      <p className="text-xs text-gray-500 mt-1">
                        {file.width} × {file.height}px
                      </p>
                    )}
                    {file.folder && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        {file.folder}
                      </span>
                    )}
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded-lg px-3 py-1 text-sm font-medium text-gray-900">
                        Select
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredFiles.length} images available
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
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
    const url = getFileUrl(file);
    onChange(file, url);
    setImageError(false);
    setShowPicker(false);
  };

  const handleRemove = () => {
    onChange(null, null);
    setImageError(false);
  };

  const displayUrl = value ? getFileUrl(value) : null;
  const thumbnailUrl = value ? getThumbnailUrl(value) : null;

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
      </label>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden transition-colors hover:border-gray-400 dark:hover:border-gray-500">
        {displayUrl && !imageError && showPreview ? (
          <div className="relative group bg-gray-50 dark:bg-gray-800">
            <img
              src={thumbnailUrl || displayUrl}
              alt={value?.alt_text || label}
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
            className="p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setShowPicker(true)}
          >
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Image className="w-6 h-6 text-gray-400" />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {imageError ? 'Failed to load image' : placeholder}
                </p>
                
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Select Image
                </button>
              </div>
              
              <p className="text-xs text-gray-400">
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
    </div>
  );
};

export default ImageInput;