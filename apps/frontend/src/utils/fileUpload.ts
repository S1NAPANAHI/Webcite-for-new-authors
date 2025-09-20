import { supabase } from '../lib/supabase';

export interface FileRecord {
  id: string;
  name: string;
  original_name: string;
  type: string;
  mime_type: string;  // FIXED: was mimetype
  size: number;
  width?: number | null;
  height?: number | null;
  storage_path: string;
  url?: string | null;
  thumbnail_url?: string | null;
  folder: string;
  tags: string[];
  alt_text?: string | null;
  description?: string | null;
  created_at: string;
  created_by: string | null;
}

export interface FileUploadOptions {
  name?: string;
  folder?: string;
  altText?: string;
  description?: string;
  tags?: string[];
}

export class FileUploadError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FileUploadError';
  }
}

export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  documents: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'],
  video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi']
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function isValidFileType(mimeType: string): boolean {
  return Object.values(ALLOWED_FILE_TYPES).flat().includes(mimeType);
}

export function getFileCategory(mimeType: string): string {
  for (const [category, types] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (types.includes(mimeType)) {
      return category;
    }
  }
  return 'other';
}

// FIXED: Proper UUID v4 generation (crypto-standard)
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function uploadFile(
  file: File, 
  options: FileUploadOptions = {}
): Promise<FileRecord> {
  console.log('Starting file upload:', { 
    fileName: file.name, 
    size: file.size, 
    type: file.type 
  });

  // Validate file
  if (!isValidFileType(file.type)) {
    throw new FileUploadError(`File type ${file.type} not supported`);
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new FileUploadError(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }

  try {
    // FIXED: Generate proper UUID for file ID
    const fileId = generateUUID();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const cleanName = options.name || file.name.replace(`.${ext}`, '');
    
    // Generate organized storage path
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const folder = options.folder || 'misc';
    const storagePath = `${folder}/${year}/${month}/${fileId}.${ext}`;

    console.log('Generated file ID:', fileId);
    console.log('Storage path:', storagePath);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new FileUploadError(`Storage upload failed: ${uploadError.message}`);
    }

    console.log('File uploaded to storage successfully');

    // Get image dimensions if it's an image
    let width: number | null = null;
    let height: number | null = null;
    
    if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
      try {
        const dimensions = await getImageDimensions(file);
        width = dimensions.width;
        height = dimensions.height;
        console.log('Image dimensions:', { width, height });
      } catch (error) {
        console.warn('Could not get image dimensions:', error);
      }
    }

    // Get file category and public URL
    const fileCategory = getFileCategory(file.type);
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(storagePath);

    console.log('Generated public URL:', urlData.publicUrl);

    // FIXED: Insert file record with proper structure
    const fileRecord = {
      id: fileId,  // Proper UUID
      name: cleanName,
      original_name: file.name,
      type: fileCategory,
      mime_type: file.type,  // FIXED: correct column name
      size: file.size,
      width,
      height,
      storage_path: storagePath,
      url: urlData.publicUrl,
      folder: folder,
      tags: options.tags || [],
      alt_text: options.altText || null,
      description: options.description || null
    };

    console.log('Inserting file record:', fileRecord);

    const { data: insertedFile, error: dbError } = await supabase
      .from('files')
      .insert([fileRecord])
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      console.error('Full error details:', JSON.stringify(dbError, null, 2));
      
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('media').remove([storagePath]);
      throw new FileUploadError(`Database save failed: ${dbError.message}`);
    }

    console.log('File record saved to database successfully:', insertedFile);
    return insertedFile;

  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof FileUploadError) {
      throw error;
    }
    throw new FileUploadError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteFile(fileId: string): Promise<void> {
  console.log('Deleting file:', fileId);

  // Get file record
  const { data: file, error: fetchError } = await supabase
    .from('files')
    .select('storage_path')
    .eq('id', fileId)
    .single();

  if (fetchError || !file) {
    throw new FileUploadError('File not found');
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('media')
    .remove([file.storage_path]);

  if (storageError) {
    console.warn('Storage deletion failed:', storageError);
    // Continue with database deletion even if storage fails
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('files')
    .delete()
    .eq('id', fileId);

  if (dbError) {
    throw new FileUploadError(`Database deletion failed: ${dbError.message}`);
  }

  console.log('File deleted successfully');
}

export function getFileUrl(file: FileRecord, options?: { width?: number; height?: number }): string {
  if (file.url) {
    return file.url;
  }
  
  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(file.storage_path, {
      transform: options ? {
        width: options.width,
        height: options.height,
        resize: 'contain'
      } : undefined
    });
  
  return data.publicUrl;
}

export function getThumbnailUrl(file: FileRecord): string {
  if (file.thumbnail_url) {
    return file.thumbnail_url;
  }
  
  if (!file.mime_type?.startsWith('image/')) {
    return `/icons/file-${file.type}.svg`; // Fallback icon
  }
  
  return getFileUrl(file, { width: 400, height: 300 });
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src); // Clean up
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src); // Clean up
      reject(new Error('Could not load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

// File listing and filtering
export interface FileFilters {
  type?: string;
  folder?: string;
  mime_type?: string;
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
  if (options.type && options.type !== 'all') {
    query = query.eq('type', options.type);
  }

  if (options.folder && options.folder !== 'all') {
    query = query.eq('folder', options.folder);
  }

  if (options.mime_type) {
    query = query.eq('mime_type', options.mime_type);
  }

  if (options.search) {
    query = query.or(`name.ilike.%${options.search}%,original_name.ilike.%${options.search}%,alt_text.ilike.%${options.search}%`);
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
    console.error('Fetch files error:', error);
    throw new FileUploadError(`Fetch failed: ${error.message}`);
  }

  return {
    files: data || [],
    total: count || 0,
    hasMore: (data?.length || 0) === limit
  };
}

export async function updateFileMetadata(
  fileId: string,
  updates: Partial<Pick<FileRecord, 'name' | 'alt_text' | 'description' | 'folder' | 'tags'>>
): Promise<FileRecord> {
  console.log('Updating file metadata:', { fileId, updates });

  const { data: updatedFile, error } = await supabase
    .from('files')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', fileId)
    .select()
    .single();

  if (error) {
    console.error('File update error:', error);
    throw new FileUploadError(`Failed to update file: ${error.message}`);
  }

  console.log('File metadata updated successfully');
  return updatedFile;
}