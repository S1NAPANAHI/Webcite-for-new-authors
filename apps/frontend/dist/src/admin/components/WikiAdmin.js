import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button } from '@zoroaster/ui';
import { Input } from '@zoroaster/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@zoroaster/ui';
import { Plus, Folder, File, ChevronDown, ChevronRight, Trash2, Edit } from 'lucide-react';
import { supabase } from '@zoroaster/shared';
import { toast } from 'sonner';
export default function WikiAdmin() {
    const [folders, setFolders] = useState([]);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newFolderName, setNewFolderName] = useState('');
    const [newPageName, setNewPageName] = useState('');
    const [currentFolder, setCurrentFolder] = useState(null);
    const [showNewFolderInput, setShowNewFolderInput] = useState(false);
    const [showNewPageInput, setShowNewPageInput] = useState(false);
    // Fetch all folders and pages
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
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
                    .select('*')
                    .order('title');
                if (pagesError)
                    throw pagesError;
                setFolders(foldersData || []);
                setPages(pagesData || []);
            }
            catch (error) {
                console.error('Error fetching wiki data:', error);
                toast.error('Failed to load wiki data');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    // Build folder tree structure
    const buildFolderTree = (folders) => {
        const folderMap = new Map();
        const rootFolders = [];
        // First pass: create map of all folders
        folders.forEach(folder => {
            folderMap.set(folder.id, { ...folder, children: [] });
        });
        // Second pass: build tree structure
        folderMap.forEach(folder => {
            if (folder.parent_id && folderMap.has(folder.parent_id)) {
                const parent = folderMap.get(folder.parent_id);
                if (parent) {
                    parent.children = [...(parent.children || []), folder];
                }
            }
            else {
                rootFolders.push(folder);
            }
        });
        return rootFolders;
    };
    const handleCreateFolder = async (parentId = null) => {
        if (!newFolderName.trim()) {
            toast.error('Please enter a folder name');
            return;
        }
        try {
            const { data, error } = await supabase
                .from('wiki_folders')
                .insert([{
                    name: newFolderName.trim(),
                    slug: newFolderName.trim().toLowerCase().replace(/\s+/g, '-'),
                    parent_id: parentId
                }])
                .select()
                .single();
            if (error)
                throw error;
            setFolders([...folders, data]);
            setNewFolderName('');
            setShowNewFolderInput(false);
            toast.success('Folder created successfully');
        }
        catch (error) {
            console.error('Error creating folder:', error);
            toast.error('Failed to create folder');
        }
    };
    const handleCreatePage = async (folderId = null) => {
        if (!newPageName.trim()) {
            toast.error('Please enter a page name');
            return;
        }
        try {
            const { data, error } = await supabase
                .from('wiki_pages')
                .insert([{
                    title: newPageName.trim(),
                    slug: newPageName.trim().toLowerCase().replace(/\s+/g, '-'),
                    folder_id: folderId,
                    content: '',
                }])
                .select()
                .single();
            if (error)
                throw error;
            setPages([...pages, data]);
            setNewPageName('');
            setShowNewPageInput(false);
            toast.success('Page created successfully');
        }
        catch (error) {
            console.error('Error creating page:', error);
            toast.error('Failed to create page');
        }
    };
    const toggleFolder = (folderId) => {
        setFolders(folders.map(folder => folder.id === folderId
            ? { ...folder, is_expanded: !folder.is_expanded }
            : folder));
    };
    const renderFolder = (folder, level = 0) => {
        const hasChildren = folder.children && folder.children.length > 0;
        const isExpanded = folder.is_expanded !== false; // Default to expanded
        return (_jsxs("div", { className: "pl-4", children: [_jsxs("div", { className: `flex items-center py-1 px-2 rounded hover:bg-accent cursor-pointer ${currentFolder === folder.id ? 'bg-accent' : ''}`, onClick: () => setCurrentFolder(folder.id === currentFolder ? null : folder.id), children: [hasChildren ? (_jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                toggleFolder(folder.id);
                            }, className: "mr-1", children: isExpanded ? _jsx(ChevronDown, { size: 16 }) : _jsx(ChevronRight, { size: 16 }) })) : (_jsx("div", { className: "w-4 mr-1" })), _jsx(Folder, { size: 16, className: "mr-2 text-blue-500" }), _jsx("span", { className: "truncate", children: folder.name }), _jsxs("div", { className: "ml-auto flex space-x-1", children: [_jsx("button", { className: "p-1 rounded hover:bg-muted", onClick: (e) => {
                                        e.stopPropagation();
                                        setShowNewPageInput(true);
                                        setCurrentFolder(folder.id);
                                    }, title: "Add page", children: _jsx(Plus, { size: 14 }) }), _jsx("button", { className: "p-1 rounded hover:bg-muted", onClick: (e) => {
                                        e.stopPropagation();
                                        setShowNewFolderInput(true);
                                        setCurrentFolder(folder.id);
                                    }, title: "Add subfolder", children: _jsx(Folder, { size: 14 }) })] })] }), isExpanded && hasChildren && (_jsx("div", { className: "border-l border-border ml-2 pl-2", children: folder.children?.map(child => renderFolder(child, level + 1)) })), isExpanded && currentFolder === folder.id && (_jsxs("div", { className: "ml-8 mt-1", children: [pages
                            .filter(page => page.folder_id === folder.id)
                            .map(page => (_jsxs("div", { className: "flex items-center py-1 px-2 rounded hover:bg-accent cursor-pointer", children: [_jsx(File, { size: 14, className: "mr-2 text-gray-500" }), _jsx("span", { className: "truncate", children: page.title })] }, page.id))), showNewPageInput && currentFolder === folder.id && (_jsx("div", { className: "flex items-center mt-1", children: _jsx(Input, { autoFocus: true, value: newPageName, onChange: (e) => setNewPageName(e.target.value), onKeyDown: (e) => {
                                    if (e.key === 'Enter') {
                                        handleCreatePage(folder.id);
                                    }
                                    else if (e.key === 'Escape') {
                                        setShowNewPageInput(false);
                                        setNewPageName('');
                                    }
                                }, placeholder: "Page name", className: "h-8 text-sm" }) }))] })), showNewFolderInput && currentFolder === folder.id && (_jsx("div", { className: "ml-8 mt-1", children: _jsx("div", { className: "flex items-center", children: _jsx(Input, { autoFocus: true, value: newFolderName, onChange: (e) => setNewFolderName(e.target.value), onKeyDown: (e) => {
                                if (e.key === 'Enter') {
                                    handleCreateFolder(folder.id);
                                }
                                else if (e.key === 'Escape') {
                                    setShowNewFolderInput(false);
                                    setNewFolderName('');
                                }
                            }, placeholder: "Folder name", className: "h-8 text-sm" }) }) }))] }, folder.id));
    };
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Wiki Management" }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
                                    setShowNewFolderInput(true);
                                    setCurrentFolder(null);
                                }, children: [_jsx(Folder, { size: 16, className: "mr-2" }), "New Folder"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
                                    setShowNewPageInput(true);
                                    setCurrentFolder(null);
                                }, children: [_jsx(File, { size: 16, className: "mr-2" }), "New Page"] })] })] }), _jsxs("div", { className: "grid grid-cols-12 gap-6", children: [_jsx("div", { className: "col-span-3", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Wiki Structure" }) }), _jsx(CardContent, { children: loading ? (_jsx("div", { children: "Loading..." })) : (_jsxs("div", { className: "space-y-1", children: [buildFolderTree(folders).map(folder => renderFolder(folder)), showNewFolderInput && currentFolder === null && (_jsx("div", { className: "pl-4", children: _jsx(Input, { autoFocus: true, value: newFolderName, onChange: (e) => setNewFolderName(e.target.value), onKeyDown: (e) => {
                                                        if (e.key === 'Enter') {
                                                            handleCreateFolder(null);
                                                        }
                                                        else if (e.key === 'Escape') {
                                                            setShowNewFolderInput(false);
                                                            setNewFolderName('');
                                                        }
                                                    }, placeholder: "Folder name", className: "h-8 text-sm" }) })), showNewPageInput && currentFolder === null && (_jsx("div", { className: "pl-4", children: _jsx(Input, { autoFocus: true, value: newPageName, onChange: (e) => setNewPageName(e.target.value), onKeyDown: (e) => {
                                                        if (e.key === 'Enter') {
                                                            handleCreatePage(null);
                                                        }
                                                        else if (e.key === 'Escape') {
                                                            setShowNewPageInput(false);
                                                            setNewPageName('');
                                                        }
                                                    }, placeholder: "Page name", className: "h-8 text-sm" }) }))] })) })] }) }), _jsx("div", { className: "col-span-9", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: currentFolder
                                            ? `Pages in ${folders.find(f => f.id === currentFolder)?.name || 'Folder'}`
                                            : 'Select a folder or create a new page' }) }), _jsx(CardContent, { children: currentFolder ? (_jsx("div", { className: "space-y-2", children: pages.filter(page => page.folder_id === currentFolder).length === 0 ? (_jsx("div", { className: "text-muted-foreground text-center py-8", children: "No pages in this folder. Create a new page to get started." })) : (pages
                                            .filter(page => page.folder_id === currentFolder)
                                            .map(page => (_jsxs("div", { className: "flex items-center justify-between p-3 border rounded hover:bg-accent cursor-pointer", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(File, { size: 16, className: "mr-3 text-gray-500" }), _jsx("span", { children: page.title })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Edit, { size: 16 }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Trash2, { size: 16, className: "text-destructive" }) })] })] }, page.id)))) })) : (_jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Select a folder to view its contents or create a new page" })) })] }) })] })] }));
}
//# sourceMappingURL=WikiAdmin.js.map