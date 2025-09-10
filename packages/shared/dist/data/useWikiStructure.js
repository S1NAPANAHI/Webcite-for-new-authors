import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
export const useWikiStructure = () => {
    const [folders, setFolders] = useState([]);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: foldersData, error: foldersError } = await supabase
                .from('wiki_folders')
                .select('*')
                .order('name');
            if (foldersError)
                throw foldersError;
            const { data: pagesData, error: pagesError } = await supabase
                .from('wiki_pages')
                .select('*')
                .order('title');
            if (pagesError)
                throw pagesError;
            setFolders(foldersData || []);
            setPages(pagesData || []);
        }
        catch (err) {
            console.error('Error fetching wiki data:', err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const createFolder = useCallback(async (name, parentId = null) => {
        try {
            const { data, error } = await supabase
                .from('wiki_folders')
                .insert([{
                    name: name.trim(),
                    slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
                    parent_id: parentId
                }])
                .select()
                .single();
            if (error)
                throw error;
            setFolders(prev => [...prev, data]);
            return true;
        }
        catch (err) {
            console.error('Error creating folder:', err);
            setError(err.message);
            return false;
        }
    }, []);
    const createPage = useCallback(async (title, folderId = null) => {
        try {
            const { data, error } = await supabase
                .from('wiki_pages')
                .insert([{
                    title: title.trim(),
                    slug: title.trim().toLowerCase().replace(/\s+/g, '-'),
                    folder_id: folderId,
                    content: '',
                }])
                .select()
                .single();
            if (error)
                throw error;
            setPages(prev => [...prev, data]);
            return true;
        }
        catch (err) {
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
//# sourceMappingURL=useWikiStructure.js.map