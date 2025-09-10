import { supabase } from './supabaseClient';
// Helper function to get the URL for a file in storage
export const getStorageFileUrl = (bucket, filePath) => {
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
    return data.publicUrl;
};
// Helper function to upload a file to storage
export const uploadFile = async (bucket, filePath, file, options = {}) => {
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
export const deleteFile = async (bucket, filePath) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);
    if (error) {
        throw error;
    }
    return data;
};
//# sourceMappingURL=storage.js.map