// apps/frontend/src/utils/fileUrls.ts
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

type FileRow = {
  id: string;
  url: string | null;
  storage_path: string | null;
  path: string | null;
  bucket: string | null;
};

export async function getFileUrlById(fileId?: string | null): Promise<string | null> {
  if (!fileId) {
    console.log('🔍 getFileUrlById: No file ID provided');
    return null;
  }

  console.log(`🔍 getFileUrlById: Looking up file ${fileId}`);

  try {
    const { data, error } = await supabase
      .from('files')
      .select('url, storage_path, path, bucket, name')
      .eq('id', fileId)
      .single<FileRow & { name: string }>();

    if (error) {
      console.error(`❌ getFileUrlById: Database error for ${fileId}:`, error);
      return null;
    }
    
    if (!data) {
      console.warn(`⚠️ getFileUrlById: No file found for ID ${fileId}`);
      return null;
    }

    console.log(`📁 getFileUrlById: File found:`, {
      id: fileId,
      name: data.name,
      url: data.url,
      path: data.path,
      storage_path: data.storage_path,
      bucket: data.bucket
    });

    // First try the stored URL
    if (data.url && data.url.trim() !== '') {
      console.log(`✅ getFileUrlById: Using stored URL for ${fileId}:`, data.url);
      return data.url;
    }
    
    // Then try path or storage_path
    const rawPath = data.path || data.storage_path;
    if (rawPath && rawPath.trim() !== '') {
      const bucket = data.bucket || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'media';
      console.log(`🔗 getFileUrlById: Generating public URL:`, {
        bucket,
        path: rawPath
      });
      
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(rawPath);
      const finalUrl = publicUrlData.publicUrl;
      
      console.log(`✅ getFileUrlById: Generated URL for ${fileId}:`, finalUrl);
      return finalUrl ?? null;
    }
    
    console.warn(`⚠️ getFileUrlById: No usable path found for ${fileId}`);
    return null;
  } catch (err) {
    console.error(`❌ getFileUrlById: Exception for ${fileId}:`, err);
    return null;
  }
}

// React hook version
export function useFileUrl(fileId?: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    if (!fileId) {
      console.log('🔍 useFileUrl: No file ID provided');
      setUrl(null);
      setError(null);
      setLoading(false);
      return;
    }
    
    console.log(`🪝 useFileUrl: Hook called for file ${fileId}`);
    setLoading(true);
    setError(null);
    
    (async () => {
      try {
        const resolvedUrl = await getFileUrlById(fileId);
        if (mounted) {
          console.log(`🪝 useFileUrl: Hook resolved URL for ${fileId}:`, resolvedUrl);
          setUrl(resolvedUrl);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error(`🪝 useFileUrl: Hook error for ${fileId}:`, err);
          setError(err instanceof Error ? err.message : 'Failed to load file URL');
          setLoading(false);
        }
      }
    })();
    
    return () => { 
      mounted = false; 
    };
  }, [fileId]);
  
  return { url, loading, error };
}

// Utility to generate file URLs from file records
export function generateFileUrl(file: {
  url?: string | null;
  path?: string | null;
  storage_path?: string | null;
  bucket?: string | null;
  name?: string;
}): string | null {
  console.log('🔗 generateFileUrl: Processing file:', {
    name: file.name,
    url: file.url,
    path: file.path,
    storage_path: file.storage_path,
    bucket: file.bucket
  });
  
  // First try the stored URL
  if (file.url && file.url.trim() !== '') {
    console.log('✅ generateFileUrl: Using stored URL:', file.url);
    return file.url;
  }
  
  // Then try path or storage_path
  const rawPath = file.path || file.storage_path;
  if (rawPath && rawPath.trim() !== '') {
    const bucket = file.bucket || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'media';
    console.log('🏗️ generateFileUrl: Building public URL:', {
      bucket,
      path: rawPath
    });
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(rawPath);
    const finalUrl = data.publicUrl;
    
    console.log('✅ generateFileUrl: Generated URL:', finalUrl);
    return finalUrl ?? null;
  }
  
  console.warn('⚠️ generateFileUrl: No usable path found for file:', file.name);
  return null;
}