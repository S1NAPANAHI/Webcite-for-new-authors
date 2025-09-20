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
    console.log('🔍 getFileUrlById: No fileId provided');
    return null;
  }

  try {
    console.log('🔍 getFileUrlById: Fetching file data for ID:', fileId);
    
    const { data, error } = await supabase
      .from('files')
      .select('url, storage_path, path, bucket, name')
      .eq('id', fileId)
      .single<FileRow & { name: string }>();

    if (error) {
      console.warn('⚠️ getFileUrlById: Database error:', error);
      return null;
    }
    
    if (!data) {
      console.warn('⚠️ getFileUrlById: No file data found for ID:', fileId);
      return null;
    }

    console.log('📄 getFileUrlById: File data retrieved:', {
      id: fileId,
      name: data.name,
      url: data.url,
      path: data.path,
      storage_path: data.storage_path,
      bucket: data.bucket
    });

    // First try the stored URL
    if (data.url && data.url.trim() !== '') {
      console.log('✅ getFileUrlById: Using stored URL:', data.url);
      return data.url;
    }
    
    // Then try path or storage_path
    const rawPath = data.path || data.storage_path;
    if (rawPath && rawPath.trim() !== '') {
      const bucket = data.bucket || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'media';
      
      console.log('🔗 getFileUrlById: Generating public URL from storage:', {
        bucket,
        path: rawPath
      });
      
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(rawPath);
      const finalUrl = publicUrlData.publicUrl;
      
      console.log('✅ getFileUrlById: Generated public URL:', finalUrl);
      return finalUrl ?? null;
    }
    
    console.warn('⚠️ getFileUrlById: No valid path found for file:', fileId);
    return null;
  } catch (err) {
    console.error('❌ getFileUrlById: Exception:', err);
    return null;
  }
}

// FIXED: React hook version that returns just the URL string (not an object)
export function useFileUrl(fileId?: string | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    if (!fileId) {
      console.log('🔍 useFileUrl: No fileId provided, setting URL to null');
      setUrl(null);
      return;
    }
    
    console.log('🔍 useFileUrl: Starting resolution for fileId:', fileId);
    
    (async () => {
      try {
        const resolvedUrl = await getFileUrlById(fileId);
        if (mounted) {
          console.log('✅ useFileUrl: Resolved URL:', resolvedUrl);
          setUrl(resolvedUrl);
        }
      } catch (err) {
        if (mounted) {
          console.error('❌ useFileUrl: Failed to resolve URL for fileId:', fileId, err);
          setUrl(null);
        }
      }
    })();
    
    return () => { 
      mounted = false; 
    };
  }, [fileId]);
  
  return url;
}

// Enhanced hook version that returns loading and error states
export function useFileUrlWithState(fileId?: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    if (!fileId) {
      setUrl(null);
      setError(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    (async () => {
      try {
        const resolvedUrl = await getFileUrlById(fileId);
        if (mounted) {
          setUrl(resolvedUrl);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
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
  
  // First try the stored URL
  if (file.url && file.url.trim() !== '') {
    return file.url;
  }
  
  // Then try path or storage_path
  const rawPath = file.path || file.storage_path;
  if (rawPath && rawPath.trim() !== '') {
    const bucket = file.bucket || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'media';
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(rawPath);
    const finalUrl = data.publicUrl;
    
    return finalUrl ?? null;
  }
  
  return null;
}