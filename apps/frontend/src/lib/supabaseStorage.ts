import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'editor-images';

export const uploadImageToSupabase = async (file: File): Promise<string | null> => {
  if (!file) {
    console.error('No file provided for upload.');
    return null;
  }

  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error.message);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Unexpected error during image upload:', err);
    return null;
  }
};
