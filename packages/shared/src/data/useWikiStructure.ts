import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

type Folder = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  is_expanded?: boolean;
  children?: Folder[];
};

type Page = {
  id: string;
  title: string;
  slug: string;
  folder_id: string | null;
  created_at: string;
  updated_at: string;
  content: string;
};

export const useWikiStructure = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: foldersData, error: foldersError } = await supabase
        .from('wiki_items')
        .select('id, name, slug, parent_id, created_at, updated_at')
        .eq('type', 'folder')
        .order('name');
      
      if (foldersError) throw foldersError;
      
      const { data: pagesData, error: pagesError } = await supabase
        .from('wiki_pages')
        .select('id, title, slug, folder_id, created_at, updated_at, content')
        .order('title');
      
      if (pagesError) throw pagesError;
      
      setFolders(foldersData || []);
      setPages(pagesData || []);
      
    } catch (err: any) {
      console.error('Error fetching wiki data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createFolder = useCallback(async (name: string, parentId: string | null = null) => {
    try {
      const { data, error } = await supabase
        .from('wiki_items')
        .insert([{
          name: name.trim(),
          slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
          parent_id: parentId,
          type: 'folder', // Specify type as 'folder'
          content: '', // wiki_items requires content
        }])
        .select('id, name, slug, parent_id, created_at, updated_at') // Select specific columns to match Folder type
        .single();
      
      if (error) throw error;
      
      setFolders(prev => [...prev, data]);
      return true;
    } catch (err: any) {
      console.error('Error creating folder:', err);
      setError(err.message);
      return false;
    }
  }, []);

  const createPage = useCallback(async (title: string, folderId: string | null = null) => {
    try {
      const { data, error } = await supabase
        .from('wiki_pages')
        .insert([{
          title: title.trim(),
          slug: title.trim().toLowerCase().replace(/\s+/g, '-'),
          folder_id: folderId,
          content: '',
        }])
        .select('id, title, slug, folder_id, created_at, updated_at, content') // Select specific columns to match Page type
        .single();
      
      if (error) throw error;
      
      setPages(prev => [...prev, data]);
      return true;
    } catch (err: any) {
      console.error('Error creating page:', err);
      setError(err.message);
      return false;
    }
  }, []);

  return {
    folders,
    pages,
    loading,
    error,
    fetchData,
    createFolder,
    createPage,
  };
};