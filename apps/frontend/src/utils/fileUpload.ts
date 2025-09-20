import { supabase } from '../lib/supabase';

export interface FileRecord {
  id: string;
  name: string;
  original_name: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  alt_text?: string;
  description?: string;
  folder: string;
  tags: string[];
  metadata?: any;
  url?: string;
  thumbnail_url?: string;
  storage_path?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const getFileUrl = (file: FileRecord): string => {
  if (file.url) return file.url;
  if (file.storage_path) {
    const { data } = supabase.storage.from('media').getPublicUrl(file.storage_path);
    return data.publicUrl;
  }
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

export const uploadFile = async (
  file: File,
  folder: string = 'misc',
  userId: string
): Promise<FileRecord> => {
  const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const fileName = `${fileId}-${file.name}`;
  const storagePath = `files/${fileName}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // Get file metadata
  let width: number | undefined;
  let height: number | undefined;
  
  if (file.type.startsWith('image/')) {
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        img.onload = () => {
          width = img.naturalWidth;
          height = img.naturalHeight;
          resolve(void 0);
        };
      });
    } catch (e) {
      console.warn('Could not extract image dimensions:', e);
    }
  }

  // Determine file type category
  let typeCategory = 'other';
  if (file.type.startsWith('image/')) typeCategory = 'images';
  else if (file.type.startsWith('video/')) typeCategory = 'videos';
  else if (file.type.startsWith('audio/')) typeCategory = 'audio';
  else if (file.type.includes('pdf') || file.type.includes('document')) typeCategory = 'documents';

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(storagePath);

  // Create file record
  const fileRecord: Omit<FileRecord, 'created_at' | 'updated_at'> = {
    id: fileId,
    name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
    original_name: file.name,
    type: typeCategory,
    size: file.size,
    width,
    height,
    folder,
    tags: [],
    url: urlData.publicUrl,
    storage_path: storagePath,
    created_by: userId,
    metadata: {
      mime_type: file.type,
      upload_source: 'file_manager'
    }
  };

  // Save to database
  const { data: savedFile, error: dbError } = await supabase
    .from('files')
    .insert([fileRecord])
    .select()
    .single();

  if (dbError) {
    // Clean up uploaded file if database save fails
    await supabase.storage.from('media').remove([storagePath]);
    throw new Error(`Database save failed: ${dbError.message}`);
  }

  return savedFile;
};

export const deleteFile = async (fileId: string): Promise<void> => {
  const { data: file, error: fetchError } = await supabase
    .from('files')
    .select('storage_path')
    .eq('id', fileId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch file: ${fetchError.message}`);
  }

  // Delete from storage
  if (file.storage_path) {
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([file.storage_path]);
    
    if (storageError) {
      console.warn('Failed to delete from storage:', storageError);
    }
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('files')
    .delete()
    .eq('id', fileId);

  if (dbError) {
    throw new Error(`Failed to delete from database: ${dbError.message}`);
  }
};

export const updateFileMetadata = async (
  fileId: string,
  updates: Partial<Pick<FileRecord, 'name' | 'alt_text' | 'description' | 'folder' | 'tags'>>
): Promise<FileRecord> => {
  const { data: updatedFile, error } = await supabase
    .from('files')
    .update(updates)
    .eq('id', fileId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update file: ${error.message}`);
  }

  return updatedFile;
};