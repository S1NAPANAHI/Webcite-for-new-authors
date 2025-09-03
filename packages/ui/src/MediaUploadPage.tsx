import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  Book,
  Image,
  Video,
  Music,
  File,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  Search,
  Filter,
  Calendar,
  User,
  FolderOpen,
  Archive
} from 'lucide-react';

interface Work {
  id: string;
  title: string;
  type: string;
  status: string;
}

interface MediaFile {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  upload_date: string;
  uploader: string;
  status: 'uploading' | 'completed' | 'failed';
  file_url?: string;
  thumbnail_url?: string;
  // Chapter-specific fields
  work_id?: string;
  chapter_number?: number;
  chapter_title?: string;
  is_published?: boolean;
}

interface ChapterUploadData {
  work_id: string;
  chapter_title: string;
  chapter_number: number;
  is_published: boolean;
}

const MediaUploadPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
  const [uploadMode, setUploadMode] = useState<'chapter' | 'media'>('chapter');
  const [works, setWorks] = useState<Work[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'chapter' | 'image' | 'video' | 'audio' | 'document'>('all');
  
  // Upload states
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  // Chapter upload form
  const [chapterData, setChapterData] = useState<ChapterUploadData>({
    work_id: '',
    chapter_title: '',
    chapter_number: 1,
    is_published: false
  });

  // Fetch works for chapter upload
  useEffect(() => {
    fetchWorks();
    fetchMediaFiles();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/admin/works');
      if (response.ok) {
        const data = await response.json();
        setWorks(data.works || []);
      }
    } catch (err) {
      console.error('Failed to fetch works:', err);
    }
  };

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data = await response.json();
        setMediaFiles(data.files || []);
      }
    } catch (err) {
      setError('Failed to fetch media files');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(e.dataTransfer.files);
    }
  };

  // Upload chapter
  const handleChapterUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select a file to upload');
      return;
    }

    if (!chapterData.work_id || !chapterData.chapter_title) {
      setError('Please fill in all required chapter information');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      formData.append('title', chapterData.chapter_title);
      formData.append('chapter_number', chapterData.chapter_number.toString());
      formData.append('book_id', chapterData.work_id);
      formData.append('is_published', chapterData.is_published.toString());

      // Get the user's session token
      const { data: { session }, error: sessionError } = await (window as any).supabase?.auth?.getSession();
      if (sessionError || !session) {
        throw new Error('User session not found. Please log in.');
      }

      const response = await fetch('/api/chapters/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to upload chapter.');
      }

      const result = await response.json();
      setSuccess(`Chapter "${chapterData.chapter_title}" uploaded successfully!`);
      
      // Reset form
      setSelectedFiles(null);
      setChapterData({
        work_id: '',
        chapter_title: '',
        chapter_number: 1,
        is_published: false
      });
      
      // Refresh media files
      await fetchMediaFiles();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload chapter');
    } finally {
      setLoading(false);
    }
  };

  // Upload general media
  const handleMediaUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const promises = Array.from(selectedFiles).map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'media');

        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        return response.json();
      });

      await Promise.all(promises);
      setSuccess(`Successfully uploaded ${selectedFiles.length} file(s)`);
      setSelectedFiles(null);
      await fetchMediaFiles();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setLoading(false);
    }
  };

  // Delete media file
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setSuccess('File deleted successfully');
      await fetchMediaFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  // Filter media files
  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.chapter_title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesType = true;
    if (filterType !== 'all') {
      switch (filterType) {
        case 'chapter':
          matchesType = !!(file.work_id && file.chapter_number);
          break;
        case 'image':
          matchesType = file.file_type.startsWith('image/');
          break;
        case 'video':
          matchesType = file.file_type.startsWith('video/');
          break;
        case 'audio':
          matchesType = file.file_type.startsWith('audio/');
          break;
        case 'document':
          matchesType = file.file_type.includes('pdf') || 
                      file.file_type.includes('document') || 
                      file.file_type.includes('text');
          break;
      }
    }
    
    return matchesSearch && matchesType;
  });

  // Get file icon
  const getFileIcon = (file: MediaFile) => {
    if (file.work_id && file.chapter_number) {
      return <Book className="w-5 h-5 text-blue-600" />;
    } else if (file.file_type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-green-600" />;
    } else if (file.file_type.startsWith('video/')) {
      return <Video className="w-5 h-5 text-purple-600" />;
    } else if (file.file_type.startsWith('audio/')) {
      return <Music className="w-5 h-5 text-pink-600" />;
    } else {
      return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Upload className="w-8 h-8 text-primary" />
            Media Upload
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload chapters for subscribers and manage media files for your website
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'upload' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Upload Files
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'library' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Media Library
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="text-green-700 dark:text-green-400">{success}</span>
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-500 hover:text-green-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-400">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Upload Mode Toggle */}
          <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setUploadMode('chapter')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                uploadMode === 'chapter' 
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Book className="w-4 h-4 inline mr-2" />
              Chapter Upload
            </button>
            <button
              onClick={() => setUploadMode('media')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                uploadMode === 'media' 
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Image className="w-4 h-4 inline mr-2" />
              Media Upload
            </button>
          </div>

          {/* Chapter Upload */}
          {uploadMode === 'chapter' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Upload New Chapter</h2>
              
              {/* Chapter Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Work *
                  </label>
                  <select
                    value={chapterData.work_id}
                    onChange={(e) => setChapterData({ ...chapterData, work_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    <option value="">-- Select a Work --</option>
                    {works.map((work) => (
                      <option key={work.id} value={work.id}>
                        {work.title} ({work.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Chapter Number *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={chapterData.chapter_number}
                    onChange={(e) => setChapterData({ ...chapterData, chapter_number: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Chapter Title *
                </label>
                <input
                  type="text"
                  value={chapterData.chapter_title}
                  onChange={(e) => setChapterData({ ...chapterData, chapter_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter chapter title"
                  required
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={chapterData.is_published}
                    onChange={(e) => setChapterData({ ...chapterData, is_published: e.target.checked })}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="is_published" className="ml-2 text-sm font-medium text-foreground">
                    Publish immediately (subscribers will get access)
                  </label>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Drop chapter file here or click to browse
                </h3>
                <p className="text-muted-foreground mb-4">
                  Supported formats: PDF, DOCX, TXT, HTML
                </p>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.docx,.txt,.html"
                  className="hidden"
                  id="chapter-file-input"
                />
                <label
                  htmlFor="chapter-file-input"
                  className="bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Choose File
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles && (
                <div className="mt-4">
                  <h4 className="font-medium text-foreground mb-2">Selected File:</h4>
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                      </div>
                      <button
                        onClick={() => setSelectedFiles(null)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleChapterUpload}
                  disabled={loading || !selectedFiles || !chapterData.work_id || !chapterData.chapter_title}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Uploading Chapter...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Chapter
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Media Upload */}
          {uploadMode === 'media' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Upload Media Files</h2>
              
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-muted-foreground mb-4">
                  Images, videos, documents, and other media files
                </p>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                  id="media-file-input"
                />
                <label
                  htmlFor="media-file-input"
                  className="bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Choose Files
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles && (
                <div className="mt-4">
                  <h4 className="font-medium text-foreground mb-2">Selected Files ({selectedFiles.length}):</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <File className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{file.name}</span>
                          <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleMediaUpload}
                  disabled={loading || !selectedFiles}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Uploading Files...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Media Library Tab */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">All Files</option>
                <option value="chapter">Chapters</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
              </select>
            </div>
            <button
              onClick={fetchMediaFiles}
              className="bg-primary text-white px-4 py-3 rounded-xl hover:bg-primary-dark transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Files Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3">Loading files...</span>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No files found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first file to get started'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
                  {/* File Preview */}
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    {file.thumbnail_url ? (
                      <img
                        src={file.thumbnail_url}
                        alt={file.filename}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        {getFileIcon(file)}
                        <p className="text-xs text-muted-foreground mt-2">
                          {file.file_type.split('/')[1]?.toUpperCase()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-foreground truncate" title={file.filename}>
                      {file.filename}
                    </h3>
                    
                    {/* Chapter Info */}
                    {file.work_id && file.chapter_number && (
                      <div className="text-sm text-muted-foreground">
                        <p>Chapter {file.chapter_number}: {file.chapter_title}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          file.is_published 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {file.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(file.file_size)}</span>
                      <span>{formatDate(file.upload_date)}</span>
                    </div>
                  </div>

                  {/* File Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      {file.file_url && (
                        <button
                          onClick={() => window.open(file.file_url, '_blank')}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View file"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {file.file_url && (
                        <button
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = file.file_url!;
                            a.download = file.filename;
                            a.click();
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUploadPage;
