import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { FileUploadDialog, FOLDERS } from './FileUploadDialog';
import {
  Search,
  Image as ImageIcon,
  Upload,
  X,
  FolderOpen,
  Filter,
  Check,
  ExternalLink
} from 'lucide-react';

interface FileRecord {
  id: string;
  name: string;
  original_name: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  alt_text?: string;
  folder: string;
  path: string;
  bucket: string;
  created_at: string;
}

interface MediaPickerProps {
  selectedFileId?: string;
  onSelect: (fileId: string, fileUrl: string) => void;
  onClear?: () => void;
  className?: string;
  preferredFolder?: string; // e.g., 'characters' for character portraits
  multiple?: boolean;
  accept?: string; // e.g., 'image/*'
}

const MediaPicker: React.FC<MediaPickerProps> = ({
  selectedFileId,
  onSelect,
  onClear,
  className = '',
  preferredFolder = 'characters',
  multiple = false,
  accept = 'image/*'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState<'all' | typeof FOLDERS[number]>(
    FOLDERS.includes(preferredFolder as any) ? preferredFolder as any : 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string>('');

  // Load selected file info on mount
  useEffect(() => {
    if (selectedFileId) {
      loadSelectedFile(selectedFileId);
    }
  }, [selectedFileId]);

  const loadSelectedFile = async (fileId: string) => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (error) throw error;
      if (data) {
        setSelectedFile(data);
        setSelectedUrl(getFileUrl(data));
      }
    } catch (err) {
      console.error('Error loading selected file:', err);
    }
  };

  const loadFiles = useCallback(async () => {
    if (!isOpen) return;
    
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by image MIME types if accept is 'image/*'
      if (accept === 'image/*') {
        query = query.like('mime_type', 'image%');
      }

      // Apply folder filter
      if (folderFilter !== 'all') {
        query = query.eq('folder', folderFilter);
      }

      const { data, error: filesError } = await query;

      if (filesError) throw filesError;

      setFiles(data || []);
    } catch (err) {
      console.error('Error loading files:', err);
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [isOpen, folderFilter, accept]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Get file URL
  const getFileUrl = (file: FileRecord): string => {
    const { data } = supabase.storage.from(file.bucket).getPublicUrl(file.path);
    return data.publicUrl;
  };

  // Filter files by search query
  const filteredFiles = files.filter(file => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      file.name?.toLowerCase().includes(searchLower) ||
      file.original_name?.toLowerCase().includes(searchLower) ||
      file.alt_text?.toLowerCase().includes(searchLower)
    );
  });

  // Handle file selection
  const handleFileSelect = (file: FileRecord) => {
    const url = getFileUrl(file);
    onSelect(file.id, url);
    setSelectedFile(file);
    setSelectedUrl(url);
    setIsOpen(false);
  };

  // Handle clear selection
  const handleClear = () => {
    if (onClear) onClear();
    setSelectedFile(null);
    setSelectedUrl('');
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    const mb = bytes / 1024 / 1024;
    return mb < 1 
      ? `${Math.round(bytes / 1024)} KB`
      : `${mb.toFixed(1)} MB`;
  };

  return (
    <div className={className}>
      {/* Selected File Preview */}
      {selectedFile && selectedUrl ? (
        <div className="space-y-3">
          <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
            <img 
              src={selectedUrl} 
              alt={selectedFile.alt_text || selectedFile.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <a
                href={selectedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="View full size"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={handleClear}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="font-medium">{selectedFile.name}</div>
            <div className="flex items-center gap-4 text-xs">
              <span>{formatFileSize(selectedFile.size)}</span>
              {selectedFile.width && selectedFile.height && (
                <span>{selectedFile.width} × {selectedFile.height}px</span>
              )}
              <span className="capitalize">{selectedFile.folder}</span>
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Change Image
          </button>
        </div>
      ) : (
        /* Select Image Button */
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary"
        >
          <ImageIcon className="w-8 h-8" />
          <span className="font-medium">Select Image</span>
          <span className="text-sm">Choose from your media library</span>
        </button>
      )}

      {/* Media Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] mx-4 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Select Image
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowUpload(!showUpload)}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload New
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Upload Section (collapsible) */}
            {showUpload && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <FileUploadDialog 
                  onUploaded={() => {
                    loadFiles();
                    setShowUpload(false);
                  }}
                  defaultFolder={preferredFolder as any}
                />
              </div>
            )}

            {/* Filters */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Folder Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={folderFilter}
                    onChange={e => setFolderFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Folders</option>
                    {FOLDERS.map(f => (
                      <option key={f} value={f}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* File Count */}
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  {filteredFiles.length} image{filteredFiles.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading images...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                  <button 
                    onClick={loadFiles}
                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Files Grid */}
              {!loading && !error && (
                <>
                  {filteredFiles.length === 0 ? (
                    <div className="text-center py-12">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                        {searchQuery ? 'No images found' : 'No images yet'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm">
                        {searchQuery 
                          ? 'Try different search terms or check another folder'
                          : 'Upload some images to get started'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredFiles.map(file => {
                        const fileUrl = getFileUrl(file);
                        const isSelected = selectedFileId === file.id;
                        
                        return (
                          <div
                            key={file.id}
                            className={`relative group cursor-pointer bg-white dark:bg-gray-700 rounded-lg border-2 transition-all ${
                              isSelected 
                                ? 'border-primary ring-2 ring-primary/20' 
                                : 'border-gray-200 dark:border-gray-600 hover:border-primary/50'
                            }`}
                            onClick={() => handleFileSelect(file)}
                          >
                            {/* Image */}
                            <div className="aspect-square bg-gray-100 dark:bg-gray-600 rounded-t-lg overflow-hidden">
                              <img
                                src={fileUrl}
                                alt={file.alt_text || file.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                loading="lazy"
                              />
                            </div>

                            {/* Selection Indicator */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4" />
                              </div>
                            )}

                            {/* File Info */}
                            <div className="p-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {file.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                <span>{formatFileSize(file.size)}</span>
                                {file.width && file.height && (
                                  <span>{file.width}×{file.height}</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500 capitalize mt-1">
                                {file.folder}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPicker;