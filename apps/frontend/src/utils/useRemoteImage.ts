import { useEffect, useState } from 'react';
import { getFileUrlById } from './fileUrls';

interface RemoteImageState {
  url: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Resolves a `files.id` and returns a public URL once –-
 * handles the 3 states so the consumer can avoid rendering
 * <img src=""> before the URL exists.
 */
export function useRemoteImage(fileId?: string | null): RemoteImageState {
  const [state, setState] = useState<RemoteImageState>({
    url: null,
    loading: !!fileId,
    error: null,
  });

  useEffect(() => {
    if (!fileId) {
      setState({ url: null, loading: false, error: null });
      return;
    }

    let mounted = true;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    getFileUrlById(fileId)
      .then((resolvedUrl) => {
        if (mounted) {
          setState({ url: resolvedUrl, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (mounted) {
          setState({ 
            url: null, 
            loading: false, 
            error: err?.message ?? 'Failed to load image'
          });
        }
      });
      
    return () => {
      mounted = false;
    };
  }, [fileId]);

  return state;
}