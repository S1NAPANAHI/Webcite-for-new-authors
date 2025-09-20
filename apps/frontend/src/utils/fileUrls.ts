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
  if (!fileId) return null;

  try {
    const { data, error } = await supabase
      .from('files')
      .select('url, storage_path, path, bucket, name')
      .eq('id', fileId)
      .single<FileRow & { name: string }>();

    if (error) {
      return null;
    }
    
    if (!data) {
      return null;
    }

    // First try the stored URL
    if (data.url && data.url.trim() !== '') {
      return data.url;
    }
    
    // Then try path or storage_path
    const rawPath = data.path || data.storage_path;
    if (rawPath && rawPath.trim() !== '') {
      const bucket = data.bucket || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'media';
      
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(rawPath);
      const finalUrl = publicUrlData.publicUrl;
      
      return finalUrl ?? null;
    }
    
    return null;
  } catch (err) {
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