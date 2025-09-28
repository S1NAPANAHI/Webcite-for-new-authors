// FIXED: Safe file URL utilities that prevent null path errors
// This prevents the "Cannot read properties of null (reading 'replace')" error

import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { getSafeImageUrl } from './imageUtils';

type FileRow = {
  id: string;
  url: string | null;
  storage_path: string | null;
  path: string | null;
  bucket: string | null;
};

/**
 * SAFE version of getFileUrlById with comprehensive null checking
 * This prevents crashes when file paths are null/undefined
 */
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
    
    // FIXED: Use safe image URL generation for storage paths
    const rawPath = data.path || data.storage_path;
    if (rawPath && rawPath.trim() !== '') {
      const bucket = data.bucket || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'media';
      
      console.log('🔗 getFileUrlById: Generating public URL from storage:', {
        bucket,
        path: rawPath
      });
      
      // Use our safe image URL utility instead of direct getPublicUrl
      const safeUrl = getSafeImageUrl(rawPath, bucket, null);
      
      console.log('✅ getFileUrlById: Generated safe public URL:', safeUrl);
      return safeUrl;
    }
    
    console.warn('⚠️ getFileUrlById: No valid path found for file:', fileId);
    return null;
  } catch (err) {
    console.error('❌ getFileUrlById: Exception:', err);
    return null;
  }
}

/**
 * SAFE React hook version that returns just the URL string (not an object)
 * Includes comprehensive error handling
 */
export function useFileUrl(fileId?: string | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    if (!fileId) {
      console.log('🔍 useFileUrl: No fileId provided, setting URL to null');
      if (mounted) setUrl(null);
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

/**
 * Enhanced hook version that returns loading and error states
 * Safe version with comprehensive error handling
 */
export function useFileUrlWithState(fileId?: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    if (!fileId) {
      if (mounted) {
        setUrl(null);
        setError(null);
        setLoading(false);
      }
      return;
    }
    
    if (mounted) {
      setLoading(true);
      setError(null);
    }
    
    (async () => {
      try {
        const resolvedUrl = await getFileUrlById(fileId);
        if (mounted) {
          setUrl(resolvedUrl);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load file URL';
          console.error('❌ useFileUrlWithState: Error for fileId:', fileId, errorMessage);
          setError(errorMessage);
          setUrl(null);
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

/**
 * SAFE utility to generate file URLs from file records
 * This prevents crashes when paths are null/undefined
 */
export function generateFileUrl(file: {
  url?: string | null;
  path?: string | null;
  storage_path?: string | null;
  bucket?: string | null;
  name?: string;
}): string | null {
  
  // Input validation
  if (!file || typeof file !== 'object') {
    console.warn('⚠️ generateFileUrl: Invalid file object provided:', file);
    return null;
  }
  
  // First try the stored URL
  if (file.url && file.url.trim() !== '') {
    console.log('✅ generateFileUrl: Using stored URL:', file.url);
    return file.url;
  }
  
  // FIXED: Use safe image URL generation for storage paths
  const rawPath = file.path || file.storage_path;
  if (rawPath && rawPath.trim() !== '') {
    const bucket = file.bucket || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'media';
    
    console.log('🔗 generateFileUrl: Generating safe public URL:', {
      bucket,
      path: rawPath,
      fileName: file.name
    });
    
    // Use our safe image URL utility instead of direct getPublicUrl
    try {
      const safeUrl = getSafeImageUrl(rawPath, bucket, null);
      console.log('✅ generateFileUrl: Generated safe URL:', safeUrl);
      return safeUrl;
    } catch (error) {
      console.error('❌ generateFileUrl: Error generating safe URL:', error);
      return null;
    }
  }
  
  console.warn('⚠️ generateFileUrl: No valid path found in file:', file);
  return null;
}

/**
 * SAFE batch file URL generation
 * Process multiple files safely without crashing
 */
export function generateBatchFileUrls(files: Array<{
  id: string;
  url?: string | null;
  path?: string | null;
  storage_path?: string | null;
  bucket?: string | null;
  name?: string;
}>): Array<{ id: string; url: string | null; name?: string }> {
  
  if (!Array.isArray(files)) {
    console.warn('⚠️ generateBatchFileUrls: Invalid files array:', files);
    return [];
  }
  
  return files.map(file => {
    try {
      const url = generateFileUrl(file);
      return {
        id: file.id,
        url,
        name: file.name
      };
    } catch (error) {
      console.error('❌ generateBatchFileUrls: Error processing file:', file.id, error);
      return {
        id: file.id,
        url: null,
        name: file.name
      };
    }
  });
}

/**
 * EMERGENCY FALLBACK: Get any usable URL from a file record
 * This tries everything and never crashes
 */
export function getAnyFileUrl(file: any): string | null {
  if (!file) return null;
  
  try {
    // Try all possible URL fields
    const possibleUrls = [
      file.url,
      file.public_url,
      file.download_url,
      file.signed_url
    ].filter(Boolean);
    
    if (possibleUrls.length > 0) {
      return possibleUrls[0];
    }
    
    // Try to generate from path
    return generateFileUrl(file);
  } catch (error) {
    console.error('❌ getAnyFileUrl: All methods failed:', error);
    return null;
  }
}

/**
 * Check if a file URL is accessible
 * Returns true if the URL loads successfully
 */
export async function validateFileUrl(url: string | null): Promise<boolean> {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// For debugging in development mode
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  (window as any).getFileUrlById = getFileUrlById;
  (window as any).generateFileUrl = generateFileUrl;
  (window as any).getAnyFileUrl = getAnyFileUrl;
  console.log('🔧 File URL utilities available globally in development mode');
}