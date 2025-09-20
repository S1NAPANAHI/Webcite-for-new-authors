import { supabase } from '../lib/supabase';

export interface FileRecord {
  id: string;
  bucket: string;
  path: string;
  name: string;
  original_name: string | null;
  mimetype: string;
  size: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  tags: string[];
  created_at: string;
  uploaded_by: string | null;
}

export interface FileUploadOptions {
  name?: string;
  altText?: string;
  tags?: string[];
}

export class FileUploadError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FileUploadError';
  }
}

export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  documents: ['application/pdf', 'text/plain'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  video: ['video/mp4', 'video/webm', 'video/quicktime']
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function isValidFileType(mimetype: string): boolean {
  return Object.values(ALLOWED_FILE_TYPES).flat().includes(mimetype);
}

export function getFileCategory(mimetype: string): string {
  for (const [category, types] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (types.includes(mimetype)) {
      return category;
    }
  }
  return 'other';
}

export async function uploadFile(
  file: File, 
  options: FileUploadOptions = {}
): Promise<FileRecord> {
  // Validate file
  if (!isValidFileType(file.type)) {
    throw new FileUploadError(`File type ${file.type} not supported`);
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new FileUploadError(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }

  try {
    // Generate unique path
    const fileId = crypto.randomUUID();
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const path = `${year}/${month}/${fileId}.${ext}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new FileUploadError(`Upload failed: ${uploadError.message}`);
    }

    // Get image dimensions if it's an image
    let width: number | null = null;
    let height: number | null = null;
    
    if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
      try {
        const dimensions = await getImageDimensions(file);
        width = dimensions.width;
        height = dimensions.height;
      } catch (error) {
        console.warn('Could not get image dimensions:', error);
      }
    }

    // Insert file record
    const { data: fileRecord, error: dbError } = await supabase
      .from('files')
      .insert({
        id: fileId,
        bucket: 'media',
        path: path,
        name: options.name || file.name,
        original_name: file.name,
        mimetype: file.type,
        size: file.size,
        width,
        height,
        alt_text: options.altText || null,
        tags: options.tags || []
      })
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('media').remove([path]);
      throw new FileUploadError(`Database error: ${dbError.message}`);
    }

    return fileRecord;
  } catch (error) {
    if (error instanceof FileUploadError) {
      throw error;
    }
    throw new FileUploadError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteFile(fileId: string): Promise<void> {
  // Get file record
  const { data: file, error: fetchError } = await supabase
    .from('files')
    .select('path')
    .eq('id', fileId)
    .single();

  if (fetchError || !file) {
    throw new FileUploadError('File not found');
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('media')
    .remove([file.path]);

  if (storageError) {
    throw new FileUploadError(`Storage deletion failed: ${storageError.message}`);
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('files')
    .delete()
    .eq('id', fileId);

  if (dbError) {
    throw new FileUploadError(`Database deletion failed: ${dbError.message}`);
  }
}

export function getFileUrl(file: FileRecord, options?: { width?: number; height?: number }): string {
  const { data } = supabase.storage
    .from(file.bucket)
    .getPublicUrl(file.path, {
      transform: options ? {
        width: options.width,
        height: options.height,
        resize: 'contain'
      } : undefined
    });
  
  return data.publicUrl;
}

export function getThumbnailUrl(file: FileRecord): string {
  if (!file.mimetype.startsWith('image/')) {
    return '/api/file-icons/' + getFileCategory(file.mimetype) + '.svg';
  }
  return getFileUrl(file, { width: 200, height: 200 });
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Could not load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

// Fetch files with filtering and pagination
export interface FileFilters {
  category?: string;
  mimetype?: string;
  tags?: string[];
  search?: string;
}

export interface FileListOptions extends FileFilters {
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'name' | 'size';
  orderDirection?: 'asc' | 'desc';
}

export async function fetchFiles(options: FileListOptions = {}): Promise<{
  files: FileRecord[];
  total: number;
  hasMore: boolean;
}> {
  let query = supabase
    .from('files')
    .select('*', { count: 'exact' });

  // Apply filters
  if (options.category) {
    const allowedTypes = ALLOWED_FILE_TYPES[options.category as keyof typeof ALLOWED_FILE_TYPES] || [];
    if (allowedTypes.length > 0) {
      query = query.in('mimetype', allowedTypes);
    }
  }

  if (options.mimetype) {
    query = query.eq('mimetype', options.mimetype);
  }

  if (options.search) {
    query = query.or(`name.ilike.%${options.search}%, original_name.ilike.%${options.search}%`);
  }

  if (options.tags && options.tags.length > 0) {
    query = query.overlaps('tags', options.tags);
  }

  // Apply ordering
  const orderBy = options.orderBy || 'created_at';
  const direction = options.orderDirection || 'desc';
  query = query.order(orderBy, { ascending: direction === 'asc' });

  // Apply pagination
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new FileUploadError(`Fetch failed: ${error.message}`);
  }

  return {
    files: data || [],
    total: count || 0,
    hasMore: (data?.length || 0) === limit
  };
}

// Utility function to get file by ID
export async function getFileById(id: string): Promise<FileRecord | null> {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}