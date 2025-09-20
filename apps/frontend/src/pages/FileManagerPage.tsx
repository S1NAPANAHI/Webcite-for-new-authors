import React, { useState, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Grid, 
  List, 
  Search, 
  Filter,
  Trash2,
  Download,
  Eye,
  Edit3,
  Image,
  FileText,
  Music,
  Video,
  File,
  Plus
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { 
  FileRecord, 
  uploadFile, 
  deleteFile, 
  fetchFiles, 
  FileListOptions,
  getThumbnailUrl,
  getFileUrl,
  getFileCategory,
  ALLOWED_FILE_TYPES,
  FileUploadError
} from '../utils/fileUpload';

const FileManagerPage: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FileListOptions>({
    limit: 50,
    offset: 0,
    orderBy: 'created_at',
    orderDirection: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFiles({
        ...filters,
        search: searchTerm || undefined
      });
      
      if (filters.offset === 0) {
        setFiles(result.files);
      } else {
        setFiles(prev => [...prev, ...result.files]);
      }
      
      setTotal(result.total);
      setHasMore(result.hasMore);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    const uploadPromises = acceptedFiles.map(file => 
      uploadFile(file).catch(error => ({
        error: error.message,
        file: file.name
      }))
    );

    try {
      const results = await Promise.all(uploadPromises);
      const successful = results.filter(r => !('error' in r)) as FileRecord[];
      const failed = results.filter(r => 'error' in r) as any[];

      if (successful.length > 0) {
        setFiles(prev => [...successful, ...prev]);
        setTotal(prev => prev + successful.length);
      }

      if (failed.length > 0) {
        const errorMessage = failed.map(f => `${f.file}: ${f.error}`).join('\n');
        setError(`Some uploads failed:\n${errorMessage}`);
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      ...ALLOWED_FILE_TYPES.images.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
      ...ALLOWED_FILE_TYPES.documents.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
      ...ALLOWED_FILE_TYPES.audio.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
      ...ALLOWED_FILE_TYPES.video.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleDelete = async (fileIds: string[]) => {
    if (!confirm(`Delete ${fileIds.length} file(s)? This cannot be undone.`)) {
      return;
    }

    try {
      await Promise.all(fileIds.map(deleteFile));
      setFiles(prev => prev.filter(f => !fileIds.includes(f.id)));
      setSelectedFiles(new Set());
      setTotal(prev => prev - fileIds.length);
    } catch (err) {
      setError('Failed to delete files');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters(prev => ({ ...prev, offset: 0 }));
  };

  const handleFilterChange = (newFilters: Partial<FileListOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }));
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setFilters(prev => ({ ...prev, offset: prev.offset! + prev.limit! }));
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(f => f.id)));
    }
  };

  const getFileIcon = (mimetype: string) => {
    const category = getFileCategory(mimetype);
    switch (category) {
      case 'images': return <Image size={20} />;
      case 'documents': return <FileText size={20} />;
      case 'audio': return <Music size={20} />;
      case 'video': return <Video size={20} />;
      default: return <File size={20} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">File Manager</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {total.toLocaleString()} files total
                {selectedFiles.size > 0 && (
                  <span className="ml-2">• {selectedFiles.size} selected</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Category Filter */}
              <select
                value={filters.category || 'all'}
                onChange={(e) => handleFilterChange({ 
                  category: e.target.value === 'all' ? undefined : e.target.value 
                })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All files</option>
                <option value="images">Images</option>
                <option value="documents">Documents</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`p-2 transition-colors border-l border-gray-300 dark:border-gray-600 ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>

              {/* Actions */}
              {selectedFiles.size > 0 && (
                <button
                  onClick={() => handleDelete(Array.from(selectedFiles))}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete ({selectedFiles.size})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex justify-between items-start">
              <pre className="text-red-700 dark:text-red-400 text-sm whitespace-pre-line">{error}</pre>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 flex-shrink-0 ml-4"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={`mb-8 border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <div className={`p-4 rounded-full mb-4 ${
              isDragActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Upload size={32} className={`${
                isDragActive ? 'text-blue-500' : 'text-gray-400'
              }`} />
            </div>
            <p className={`text-lg font-medium mb-2 ${
              isDragActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {isDragActive
                ? 'Drop files here...'
                : 'Drag & drop files here'
              }
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              or click to select files from your computer
            </p>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Supported formats: Images, Documents, Audio, Video (max 50MB each)
            </div>
            {uploading && (
              <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium">
                Uploading files...
              </div>
            )}
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* List Header */}
            {files.length > 0 && (
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedFiles.size === files.length && files.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {files.length} files
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Sort by:</span>
                  <select
                    value={`${filters.orderBy}-${filters.orderDirection}`}
                    onChange={(e) => {
                      const [orderBy, orderDirection] = e.target.value.split('-') as [string, 'asc' | 'desc'];
                      handleFilterChange({ orderBy: orderBy as any, orderDirection });
                    }}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs"
                  >
                    <option value="created_at-desc">Newest first</option>
                    <option value="created_at-asc">Oldest first</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="size-desc">Largest first</option>
                    <option value="size-asc">Smallest first</option>
                  </select>
                </div>
              </div>
            )}

            {/* Files Grid/List */}
            <div className={`p-6 ${
              viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4' 
                : 'space-y-2'
            }`}>
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`relative border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedFiles.has(file.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  } ${viewMode === 'list' ? 'p-4' : 'p-2'}`}
                  onClick={() => toggleFileSelection(file.id)}
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
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </div>
                      {file.width && file.height && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {file.width} × {file.height}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedFiles.has(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      
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
                          {formatFileSize(file.size)} • {file.mimetype.split('/')[1].toUpperCase()}
                          {file.width && file.height && ` • ${file.width}×${file.height}`}
                          
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(file.created_at)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(getFileUrl(file), '_blank');
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="View file"
                        >
                          <Eye size={16} />
                        </button>
                        <a
                          href={getFileUrl(file)}
                          download={file.name}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Download file"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Loading...' : 'Load More Files'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {files.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No files yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Upload your first file to get started
            </p>
          </div>
        )}
        
        {/* Loading State */}
        {loading && files.length === 0 && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading files...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManagerPage;