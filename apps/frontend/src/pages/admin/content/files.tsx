import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { FileUploadDialog, FOLDERS } from '../../../components/admin/FileUploadDialog';
import { 
  FolderOpen, 
  Image as ImageIcon, 
  MoreVertical, 
  Trash2, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

interface FileRecord {
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
  path?: string;
  bucket?: string;
  created_at?: string;
  updated_at?: string;
}

type FolderFilter = 'all' | typeof FOLDERS[number];

const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState<FolderFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load files from database
  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply folder filter
      if (folderFilter !== 'all') {
        query = query.eq('folder', folderFilter);
      }
      
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
  
  useEffect(() => {
    loadFiles();
  }, [folderFilter]);
  
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
  
  // Get file URL for display
  const getFileUrl = (file: FileRecord): string => {
    if (file.url) return file.url;
    
    if (file.path || file.storage_path) {
      const path = file.path || file.storage_path;
      const bucket = file.bucket || 'media';
      const { data } = supabase.storage.from(bucket).getPublicUrl(path!);
      return data.publicUrl;
    }
    
    return '';
  };
  
  // Delete file
  const deleteFile = async (file: FileRecord) => {
    if (!confirm(`Delete "${file.name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      // Delete from storage if path exists
      if (file.path || file.storage_path) {
        const path = file.path || file.storage_path;
        const bucket = file.bucket || 'media';
        const { error: storageError } = await supabase.storage
          .from(bucket)
          .remove([path!]);
        
        if (storageError) {
          console.warn('Failed to delete from storage:', storageError);
        }
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id);
      
      if (dbError) throw dbError;
      
      // Refresh list
      loadFiles();
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Failed to delete file: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };
  
  // Format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown';
    const mb = bytes / 1024 / 1024;
    return mb < 1 
      ? `${Math.round(bytes / 1024)} KB`
      : `${mb.toFixed(1)} MB`;
  };
  
  // Format date
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString();
  };
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <FolderOpen className="w-6 h-6" />
            File Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage images, videos, and other media files for your content
          </p>
        </div>
        
        {/* Upload Section */}
        <div className="mb-8">
          <FileUploadDialog onUploaded={loadFiles} />
        </div>
        
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Folder Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={folderFilter}
                onChange={e => setFolderFilter(e.target.value as FolderFilter)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Folders</option>
                {FOLDERS.map(f => (
                  <option key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* File Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
              {folderFilter !== 'all' && ` in ${folderFilter}`}
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-64"
            />
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading files...</span>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
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
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  {searchQuery ? 'No files found' : 'No files yet'}
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">
                  {searchQuery 
                    ? 'Try different search terms or check another folder'
                    : 'Upload some files to get started'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFiles.map(file => {
                  const fileUrl = getFileUrl(file);
                  const isImage = file.mime_type?.startsWith('image/') || file.type === 'images';
                  
                  return (
                    <div
                      key={file.id}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* File Preview */}
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        {isImage && fileUrl ? (
                          <img
                            src={fileUrl}
                            alt={file.alt_text || file.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* File Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1 mr-2">
                            {file.name || file.original_name || 'Unnamed'}
                          </h3>
                          
                          {/* Actions Menu */}
                          <div className="relative group">
                            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[120px]">
                              {fileUrl && (
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View
                                </a>
                              )}
                              <button
                                onClick={() => deleteFile(file)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* File Details */}
                        <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span>{formatFileSize(file.size)}</span>
                          </div>
                          
                          {file.width && file.height && (
                            <div className="flex justify-between">
                              <span>Dimensions:</span>
                              <span>{file.width} × {file.height}px</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between">
                            <span>Folder:</span>
                            <span className="capitalize">{file.folder || 'misc'}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Uploaded:</span>
                            <span>{formatDate(file.created_at)}</span>
                          </div>
                        </div>
                        
                        {/* Folder Badge */}
                        {file.folder && file.folder !== 'misc' && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                              {file.folder}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FilesPage;