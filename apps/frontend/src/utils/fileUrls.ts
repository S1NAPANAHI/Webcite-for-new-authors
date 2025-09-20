// apps/frontend/src/utils/fileUrls.ts
import { supabase } from '../lib/supabase';

type FileRow = {
  id: string;
  url: string | null;
  storage_path: string | null;
};

export async function getFileUrlById(fileId?: string | null): Promise<string | null> {
  if (!fileId) return null;

  const { data, error } = await supabase
    .from('files')
    .select('url, storage_path')
    .eq('id', fileId)
    .single<FileRow>();

  if (error || !data) return null;

  if (data.url && data.url.trim() !== '') {
    return data.url;
  }
  if (data.storage_path && data.storage_path.trim() !== '') {
    const { data: pub } = supabase.storage
      .from('media')
      .getPublicUrl(data.storage_path);
    return pub.publicUrl ?? null;
  }
  return null;
}

// Lightweight React hook version (optional)
import { useEffect, useState } from 'react';
export function useFileUrl(fileId?: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await getFileUrlById(fileId);
      if (mounted) setUrl(u);
    })();
    return () => { mounted = false; };
  }, [fileId]);
  return url;
}