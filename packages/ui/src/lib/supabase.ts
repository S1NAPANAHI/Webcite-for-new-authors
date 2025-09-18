// Re-export the Supabase client from the shared package
// This ensures environment variables are loaded correctly at the app level
export { supabase } from '@zoroaster/shared';
import { supabase } from '@zoroaster/shared';

// Helper function to get the URL for a file in storage
export const getStorageFileUrl = (bucket: string, filePath: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

// Helper function to upload a file to storage
export const uploadFile = async (
  bucket: string, 
  filePath: string, 
  file: File,
  options = {}
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      ...options,
    });

  if (error) {
    throw error;
  }

  return {
    ...data,
    publicUrl: getStorageFileUrl(bucket, filePath),
  };
};

// Helper function to delete a file from storage
export const deleteFile = async (bucket: string, filePath: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    throw error;
  }

  return data;
};
