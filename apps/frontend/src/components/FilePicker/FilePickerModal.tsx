import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Upload, 
  Search, 
  Grid, 
  List,
  Image,
  FileText,
  Music,
  Video,
  File,
  Check
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { 
  FileRecord, 
  uploadFile, 
  fetchFiles, 
  FileListOptions,
  getThumbnailUrl,
  getFileUrl,
  getFileCategory,
  ALLOWED_FILE_TYPES
} from '../../utils/fileUpload';

interface FilePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: FileRecord) => void;
  allowedTypes?: string[];
  title?: string;
  multiple?: boolean;
}

const FilePickerModal: React.FC<FilePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = ['images'],
  title = 'Select File',
  multiple = false
}) => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const getAllowedMimetypes = () => {
    return allowedTypes.flatMap(type => 
      ALLOWED_FILE_TYPES[type as keyof typeof ALLOWED_FILE_TYPES] || []
    );
  };

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const allowedMimetypes = getAllowedMimetypes();
      
      const result = await fetchFiles({
        search: searchTerm || undefined,
        limit: 100,
        orderBy: 'created_at',
        orderDirection: 'desc'
      });
      
      // Filter by allowed types
      const filteredFiles = result.files.filter(file => 
        allowedMimetypes.length === 0 || allowedMimetypes.includes(file.mimetype)
      );
      
      setFiles(filteredFiles);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, allowedTypes]);

  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen, loadFiles]);

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    try {
      const uploadPromises = acceptedFiles.map(file => uploadFile(file));
      const uploadedFiles = await Promise.all(uploadPromises);
      
      // Add to files list
      setFiles(prev => [...uploadedFiles, ...prev]);
      
      // Auto-select if single file
      if (!multiple && uploadedFiles.length === 1) {
        onSelect(uploadedFiles[0]);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [multiple, onSelect, onClose]);

  const allowedMimetypes = getAllowedMimetypes();
  const acceptTypes = allowedMimetypes.reduce((acc, type) => ({
    ...acc,
    [type]: []
  }), {});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: acceptTypes,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleFileSelect = (file: FileRecord) => {
    if (multiple) {
      setSelectedFiles(prev => {
        const next = new Set(prev);
        if (next.has(file.id)) {
          next.delete(file.id);
        } else {
          next.add(file.id);
        }
        return next;
      });
    } else {
      onSelect(file);
      onClose();
    }
  };

  const handleConfirmSelection = () => {
    if (multiple && selectedFiles.size > 0) {
      const selected = files.filter(f => selectedFiles.has(f.id));
      selected.forEach(onSelect);
      onClose();
    }
  };

  const getFileIcon = (mimetype: string) => {
    const category = getFileCategory(mimetype);
    switch (category) {
      case 'images': return <Image size={16} />;
      case 'documents': return <FileText size={16} />;
      case 'audio': return <Music size={16} />;
      case 'video': return <Video size={16} />;
      default: return <File size={16} />;
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 border-radius-lg w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden rounded-xl shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                className={`p-2 text-sm transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </button>
              <button
                className={`p-2 text-sm transition-colors border-l border-gray-300 dark:border-gray-600 ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div
          {...getRootProps()}
          className={`m-6 border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isDragActive
              ? 'Drop files here...'
              : 'Drag & drop files here, or click to upload'
            }
          </p>
          {uploading && (
            <div className="mt-2 text-blue-600 dark:text-blue-400 font-medium">
              Uploading...
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500 dark:text-gray-400">Loading files...</div>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <Upload size={48} className="mb-4" />
              <h3 className="text-lg font-medium mb-2">No files found</h3>
              <p className="text-sm">Upload files to get started</p>
            </div>
          ) : (
            <div className={`grid gap-4 pb-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6' 
                : 'grid-cols-1'
            }`}>
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`relative border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedFiles.has(file.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  } ${viewMode === 'list' ? 'p-4' : 'p-2'}`}
                  onClick={() => handleFileSelect(file)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 overflow-hidden">
                        {file.mimetype.startsWith('image/') ? (
                          <img
                            src={getThumbnailUrl(file)}
                            alt={file.alt_text || file.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {getFileIcon(file.mimetype)}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-700 dark:text-gray-300 truncate" title={file.name}>
                        {file.name}
                      </div>
                      {file.width && file.height && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {file.width} × {file.height}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        {file.mimetype.startsWith('image/') ? (
                          <img
                            src={getThumbnailUrl(file)}
                            alt={file.alt_text || file.name}
                            className="w-full h-full object-cover rounded-lg"
                            loading="lazy"
                          />
                        ) : (
                          <div className="text-gray-400">
                            {getFileIcon(file.mimetype)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {file.mimetype}
                          {file.width && file.height && ` • ${file.width}×${file.height}`}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {multiple && selectedFiles.has(file.id) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      <Check size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {multiple && selectedFiles.size > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={handleConfirmSelection}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Select {selectedFiles.size} file{selectedFiles.size > 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default FilePickerModal;