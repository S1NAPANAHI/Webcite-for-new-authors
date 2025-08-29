import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './button';
import { Input } from './input';
import { Plus, Folder as FolderIcon, File, Loader2, ChevronRight } from 'lucide-react';
import { supabase, fetchFolders } from '@zoroaster/shared';
import { toast } from 'sonner';
import { WikiEditor } from './WikiEditor';
import { SortableFolderTree } from './SortableFolderTree';
export function WikiManager() {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [pages, setPages] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [newPageName, setNewPageName] = useState('');
    const [showNewFolderInput, setShowNewFolderInput] = useState(false);
    const [showNewPageInput, setShowNewPageInput] = useState(false);
    const [selectedPage, setSelectedPage] = useState(null);
    const [editingPage, setEditingPage] = useState(null);
    const [editingFolder, setEditingFolder] = useState(null);
    const [editingFolderName, setEditingFolderName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    // Fetch all folders and pages
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch all folders
                const { data: foldersData, error: foldersError } = await supabase
                    .from('wiki_folders')
                    .select('*')
                    .order('name');
                if (foldersError)
                    throw foldersError;
                // Fetch all pages
                const { data: pagesData, error: pagesError } = await supabase
                    .from('wiki_pages')
                    .select(`
            *,
            sections:wiki_sections(*)
          `);
                if (pagesError)
                    throw pagesError;
                // Transform the data to match WikiPageWithSections
                const formattedPages = (pagesData || []).map((page) => ({
                    ...page,
                    sections: (page.sections || []).map((section) => ({
                        ...section,
                        content: section.content || ''
                    }))
                }));
                setFolders(foldersData || []);
                setPages(formattedPages);
            }
            catch (error) {
                console.error('Error fetching wiki data:', error);
                toast.error('Failed to load wiki content');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    // Update the folder creation handler to work at any level
    const handleCreateFolder = async () => {
        if (!newFolderName.trim())
            return;
        try {
            // Ensure we set created_by to satisfy RLS policies
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) {
                toast.error('You must be logged in to create a folder');
                return;
            }
            const { data, error } = await supabase
                .from('wiki_folders')
                .insert([{
                    name: newFolderName.trim(),
                    slug: newFolderName.trim().toLowerCase().replace(/\s+/g, '-'),
                    parent_id: folderId || null,
                    created_by: user.id
                }])
                .select()
                .single();
            if (error)
                throw error;
            // Update local state
            setFolders(prev => [...prev, data]);
            setNewFolderName('');
            setShowNewFolderInput(false);
            // Navigate to the new folder
            navigate(`/account/admin/wiki/folder/${data.id}`);
            toast.success('Folder created successfully');
        }
        catch (error) {
            console.error('Error creating folder:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create folder');
        }
    };
    // Update the page creation handler to properly type the page data and handle the response
    const handleCreatePage = async (folderId) => {
        try {
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) {
                toast.error('You must be logged in to create a page');
                return;
            }
            const { data: page, error } = await supabase
                .from('wiki_pages')
                .insert([
                {
                    title: 'New Page',
                    content: '',
                    folder_id: folderId || null,
                    is_published: false,
                    created_by: user.id,
                    excerpt: '',
                    slug: 'new-page-' + Date.now(),
                    seo_title: 'New Page',
                    seo_description: '',
                    seo_keywords: [],
                    view_count: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    category_id: null
                }
            ])
                .select('*')
                .single();
            if (error)
                throw error;
            // Update local state with the new page
            setPages(prev => [...prev, {
                    ...page,
                    sections: []
                }]);
            // Select the new page for editing
            if (page) {
                setSelectedPage(page.id);
                setEditingPage(page.id);
            }
            setNewPageName('');
            setShowNewPageInput(false);
            toast.success('Page created successfully');
        }
        catch (error) {
            console.error('Error creating page:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create page');
        }
    };
    // Handle editing a page
    const handleEditPage = (page) => {
        setEditingPage(page.id);
        setSelectedPage(page.id);
        // You might want to open a modal or form to edit the page details
        // For now, we'll just select the page and the editor will handle the rest
    };
    // Handle deleting a page
    const handleDeletePage = async (pageId) => {
        if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
            return;
        }
        try {
            setIsLoading(true);
            // First delete the page content blocks
            const { error: contentError } = await supabase
                .from('wiki_content_blocks')
                .delete()
                .eq('page_id', pageId);
            if (contentError)
                throw contentError;
            // Then delete the page itself
            const { error: pageError } = await supabase
                .from('wiki_pages')
                .delete()
                .eq('id', pageId);
            if (pageError)
                throw pageError;
            // Update local state
            setPages(prev => prev.filter(p => p.id !== pageId));
            // If the deleted page was selected, clear the selection
            if (selectedPage === pageId) {
                setSelectedPage(null);
                setEditingPage(null);
            }
            toast.success('Page deleted successfully');
        }
        catch (error) {
            console.error('Error deleting page:', error);
            toast.error('Failed to delete page');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handlePageSaved = async (updatedPage) => {
        try {
            const { data, error } = await supabase
                .from('wiki_pages')
                .upsert({
                ...updatedPage,
                updated_at: new Date().toISOString(),
                updated_by: (await supabase.auth.getUser()).data.user?.id
            })
                .select()
                .single();
            if (error)
                throw error;
            // Update the pages list
            setPages(prev => prev.map(p => p.id === data.id ? { ...p, ...data } : p));
            toast.success('Page saved successfully');
            return data;
        }
        catch (error) {
            console.error('Error saving page:', error);
            toast.error('Failed to save page');
            throw error;
        }
    };
    const handleEditFolder = (folder) => {
        setEditingFolder(folder);
        setEditingFolderName(folder.name);
    };
    const handleUpdateFolder = async () => {
        if (!editingFolder || !editingFolderName.trim())
            return;
        try {
            const { data, error } = await supabase
                .from('wiki_folders')
                .update({
                name: editingFolderName.trim(),
                slug: editingFolderName.trim().toLowerCase().replace(/\s+/g, '-')
            })
                .eq('id', editingFolder.id)
                .select()
                .single();
            if (error)
                throw error;
            setFolders(prev => prev.map(f => f.id === data.id ? data : f));
            setEditingFolder(null);
            setEditingFolderName('');
            toast.success('Folder updated successfully');
        }
        catch (error) {
            console.error('Error updating folder:', error);
            toast.error('Failed to update folder');
        }
    };
    const handleDeleteFolder = async (folderId) => {
        if (!confirm('Are you sure you want to delete this folder and all its contents? This action cannot be undone.')) {
            return;
        }
        try {
            setIsLoading(true);
            // Delete the folder (this will cascade to subfolders and pages due to the foreign key constraints)
            const { error } = await supabase
                .from('wiki_folders')
                .delete()
                .eq('id', folderId);
            if (error)
                throw error;
            // Update local state
            const deleteFolderAndChildren = (folders, targetId) => {
                return folders.reduce((acc, folder) => {
                    if (folder.id === targetId)
                        return acc; // Skip the deleted folder
                    if (folder.parent_id === targetId) {
                        // Skip children of the deleted folder (they're already deleted by the cascade)
                        return acc;
                    }
                    return [...acc, folder];
                }, []);
            };
            setFolders(prev => deleteFolderAndChildren(prev, folderId));
            // If we're currently viewing the deleted folder or its children, navigate up
            if (folderId === folderId || folders.some(f => f.parent_id === folderId && f.id === folderId)) {
                const parentFolder = folders.find(f => f.id === folderId)?.parent_id;
                navigate(parentFolder ? `/account/admin/wiki/folder/${parentFolder}` : '/account/admin/wiki');
            }
            toast.success('Folder and its contents deleted successfully');
        }
        catch (error) {
            console.error('Error deleting folder:', error);
            toast.error('Failed to delete folder. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleReorder = async (reorderedItems) => {
        try {
            setIsLoading(true);
            const updateItems = [];
            const processItems = (items, parentId = null) => {
                items.forEach((item, index) => {
                    const folder = folders.find(f => f.id === item.id);
                    if (folder) {
                        updateItems.push({
                            ...folder,
                            order_index: index,
                            parent_id: parentId,
                        });
                    }
                    if (item.children && item.children.length > 0) {
                        processItems(item.children, item.id);
                    }
                });
            };
            processItems(reorderedItems);
            // We need to remove the 'children' property from the objects before upserting
            const itemsToUpsert = updateItems.map(({ children, ...rest }) => rest);
            // Update the order in the database using a direct update instead of RPC
            const { error } = await supabase
                .from('wiki_folders')
                .upsert(itemsToUpsert, { onConflict: 'id' });
            if (error)
                throw error;
            // Refetch the folders to update the UI
            await fetchFolders();
            toast.success('Folder order updated successfully');
        }
        catch (error) {
            console.error('Error reordering folders:', error);
            toast.error('Failed to update folder order');
        }
        finally {
            setIsLoading(false);
        }
    };
    // Handle moving items (pages or folders) to a different folder
    const handleMoveItem = async (itemId, targetFolderId) => {
        try {
            // Check if the item is a folder or a page
            const isFolder = folders.some(f => f.id === itemId);
            if (isFolder) {
                // Moving a folder
                const { error } = await supabase
                    .from('wiki_folders')
                    .update({ parent_id: targetFolderId })
                    .eq('id', itemId);
                if (error)
                    throw error;
                // Update local state
                setFolders(prev => prev.map(folder => folder.id === itemId
                    ? { ...folder, parent_id: targetFolderId }
                    : folder));
            }
            else {
                // Moving a page
                const { error } = await supabase
                    .from('wiki_pages')
                    .update({ folder_id: targetFolderId })
                    .eq('id', itemId);
                if (error)
                    throw error;
                // Update local state
                setPages(prev => prev.map(page => page.id === itemId
                    ? { ...page, folder_id: targetFolderId }
                    : page));
            }
            toast.success('Item moved successfully');
        }
        catch (error) {
            console.error('Error moving item:', error);
            toast.error('Failed to move item');
        }
    };
    // Update the folder click handler
    const handleFolderClick = (folderId) => {
        // Clear the selected page when navigating to a folder
        setSelectedPage(null);
        setEditingPage(null);
        // Navigate to the folder
        navigate(`/account/admin/wiki/folder/${folderId}`);
    };
    // Update the folder tree building logic
    const folderTree = useMemo(() => {
        const folderMap = new Map();
        const rootItems = [];
        // First pass: create map of all folders
        folders.forEach(folder => {
            folderMap.set(folder.id, { ...folder, children: [] });
        });
        // Second pass: build the tree structure
        folders.forEach(folder => {
            const folderItem = folderMap.get(folder.id);
            if (!folderItem)
                return;
            if (folder.parent_id && folderMap.has(folder.parent_id)) {
                const parent = folderMap.get(folder.parent_id);
                if (parent) {
                    parent.children.push(folderItem);
                }
            }
            else {
                rootItems.push(folderItem);
            }
        });
        // Sort items by order_index
        const sortItems = (items) => {
            return [...items].sort((a, b) => (a.data?.order_index ?? 0) - (b.data?.order_index ?? 0));
        };
        const sortRecursive = (items) => {
            const sorted = sortItems(items);
            return sorted.map(item => ({
                ...item,
                children: item.children ? sortRecursive(item.children) : []
            }));
        };
        return sortRecursive(rootItems);
    }, [folders, folderId]);
    const currentFolder = folders.find(f => f.id === folderId);
    const currentPage = pages.find(p => p.id === selectedPage);
    return (_jsxs("div", { className: "flex h-screen bg-gray-100 dark:bg-gray-900", children: [_jsxs("div", { className: "w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [_jsx("h1", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Wiki Manager" }), _jsxs("div", { className: "flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2 overflow-x-auto", children: [_jsx("button", { onClick: () => navigate('/account/admin/wiki'), className: "hover:text-blue-600 dark:hover:text-blue-400", children: "Home" }), currentFolder && (_jsxs(_Fragment, { children: [_jsx(ChevronRight, { className: "h-4 w-4 mx-1" }), _jsx("span", { className: "font-medium text-blue-600 dark:text-blue-400", children: currentFolder.name })] }))] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-2", children: [_jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "flex-1 justify-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600", onClick: () => handleCreatePage(folderId), children: [_jsx(Plus, { size: 14, className: "mr-2" }), "New Page"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "flex-1 justify-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600", onClick: () => setShowNewFolderInput(!showNewFolderInput), children: [_jsx(FolderIcon, { size: 14, className: "mr-2" }), "New Folder"] })] }), showNewFolderInput && (_jsxs("div", { className: "flex space-x-2 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700", children: [_jsx(Input, { autoFocus: true, value: newFolderName, onChange: (e) => setNewFolderName(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleCreateFolder(), placeholder: "Folder name", className: "h-8 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" }), _jsx(Button, { size: "sm", onClick: handleCreateFolder, disabled: !newFolderName.trim(), className: "bg-blue-600 hover:bg-blue-700 text-white", children: "Add" })] })), showNewPageInput && (_jsxs("div", { className: "flex space-x-2 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700", children: [_jsx(Input, { autoFocus: true, value: newPageName, onChange: (e) => setNewPageName(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter')
                                                    handleCreatePage(folderId); }, placeholder: "Page title", className: "h-8 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" }), _jsx(Button, { size: "sm", onClick: () => handleCreatePage(folderId), disabled: !newPageName.trim(), className: "bg-blue-600 hover:bg-blue-700 text-white", children: "Add" })] }))] }), _jsx("div", { className: "mt-2", children: isLoading ? (_jsx("div", { className: "flex justify-center py-4", children: _jsx(Loader2, { className: "h-4 w-4 animate-spin text-gray-700 dark:text-gray-300" }) })) : (_jsx("div", { className: "text-gray-700 dark:text-gray-300", children: _jsx(SortableFolderTree, { folders: folders, pages: pages, selectedFolder: folderId, selectedPage: selectedPage, onSelect: handleFolderClick, onPageSelect: (pageId) => {
                                            setSelectedPage(pageId);
                                            setEditingPage(pageId);
                                        }, onDeleteFolder: handleDeleteFolder, onEditFolder: handleEditFolder, onDeletePage: handleDeletePage, onEditPage: handleEditPage, onMoveItem: handleMoveItem }) })) })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: currentPage ? (_jsx(WikiEditor, { id: currentPage.id, onUpdatePage: handlePageSaved })) : (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center p-8", children: [_jsx(File, { className: "h-16 w-16 text-gray-400 mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: currentFolder ? `No pages in ${currentFolder.name}` : 'No page selected' }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-6", children: currentFolder
                                ? `Create a new page in this folder using the sidebar.`
                                : `Select a page from the sidebar or create a new one.` }), _jsxs(Button, { onClick: () => handleCreatePage(folderId), className: "bg-blue-600 hover:bg-blue-700 text-white", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "New Page"] })] })) }), editingFolder && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Edit Folder" }), _jsx(Input, { autoFocus: true, value: editingFolderName, onChange: (e) => setEditingFolderName(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleUpdateFolder(), placeholder: "Folder name", className: "mb-4" }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setEditingFolder(null);
                                        setEditingFolderName('');
                                    }, children: "Cancel" }), _jsx(Button, { onClick: handleUpdateFolder, disabled: !editingFolderName.trim(), className: "bg-blue-600 hover:bg-blue-700 text-white", children: "Save Changes" })] })] }) }))] }));
}
