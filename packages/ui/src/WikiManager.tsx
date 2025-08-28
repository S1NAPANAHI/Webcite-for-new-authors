import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@zoroaster/ui';
import { Input } from '@zoroaster/ui';
import { Plus, Folder as FolderIcon, File, Loader2, ChevronRight } from 'lucide-react';
import { supabase, fetchFolders, fetchPages, WikiPage, Database, Folder, WikiSectionView } from '@zoroaster/shared';
import { toast } from 'sonner';
import { WikiEditor } from '@zoroaster/ui';
import { SortableFolderTree } from '@zoroaster/ui';




export function WikiManager() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pages, setPages] = useState<WikiPage[]>([]); // Changed from Page[] to WikiPage[]
  
  const [newFolderName, setNewFolderName] = useState('');
  const [newPageName, setNewPageName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [showNewPageInput, setShowNewPageInput] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
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
        
        if (foldersError) throw foldersError;
        
        // Fetch all pages
        const { data: pagesData, error: pagesError } = await supabase
          .from('wiki_pages')
          .select('*')
          .order('title');
        
        if (pagesError) throw pagesError;
        
        setFolders(foldersData || []);
        setPages(pagesData as WikiPage[] || []); // Cast pagesData to WikiPage[]
        
      } catch (error) {
        console.error('Error fetching wiki data:', error);
        toast.error('Failed to load wiki content');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  

  // Update the folder creation handler to work at any level
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
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
      
      if (error) throw error;
      
      // Update local state
      setFolders(prev => [...prev, data]);
      setNewFolderName('');
      setShowNewFolderInput(false);
      
      // Navigate to the new folder
      navigate(`/account/admin/wiki/folder/${data.id}`);
      
      toast.success('Folder created successfully');
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create folder');
    }
  };

  // Update the page creation handler to work at any level
  const handleCreatePage = async () => {
    if (!newPageName.trim()) return;
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('You must be logged in to create a page');
      
      // Prepare page data for wiki_pages table
      const pageDataToInsert = {
        title: newPageName.trim(),
        slug: newPageName.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        folder_id: folderId || null,
        is_published: false,
        created_by: user.id, // Add created_by
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        view_count: 0, // Default view count
      };
      
      const { data: newWikiPage, error: pageError } = await supabase
        .from('wiki_pages') // Correct table name
        .insert([pageDataToInsert])
        .select()
        .single();
      
      if (pageError) throw pageError;

      // Insert initial content block (section)
      const initialSection = {
        id: `section-${Date.now()}`,
        type: 'paragraph' as Database["public"]["Enums"]["content_block_type"],
        content: '',
        page_id: newWikiPage.id,
        position: 0,
      };

      const { error: contentBlockError } = await supabase
        .from('wiki_content_blocks')
        .insert([initialSection]);

      if (contentBlockError) throw contentBlockError;
      
      // Update local state
      setPages(prev => [...prev, { ...newWikiPage, sections: [initialSection] }]); // Add sections to local state
      setNewPageName('');
      setShowNewPageInput(false);
      
      // Select the new page
      setSelectedPage(newWikiPage.id);
      setEditingPage(newWikiPage.id);
      
      toast.success('Page created successfully');
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create page');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('wiki_pages')
        .delete()
        .eq('id', pageId);
      
      if (error) throw error;
      
      setPages(prev => prev.filter(page => page.id !== pageId));
      
      if (selectedPage === pageId) {
        setSelectedPage(null);
        setEditingPage(null);
      }
      
      toast.success('Page deleted successfully');
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
    }
  };

  const handlePageSaved = (updatedPage: any) => {
    setPages(prev => 
      prev.map(p => p.id === updatedPage.id ? updatedPage : p)
    );
    setEditingPage(null);
  };

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setEditingFolderName(folder.name);
  };

  const handleUpdateFolder = async () => {
    if (!editingFolder || !editingFolderName.trim()) return;
    
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
      
      if (error) throw error;
      
      setFolders(prev => 
        prev.map(f => f.id === data.id ? data : f)
      );
      setEditingFolder(null);
      setEditingFolderName('');
      toast.success('Folder updated successfully');
    } catch (error) {
      console.error('Error updating folder:', error);
      toast.error('Failed to update folder');
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
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
      
      if (error) throw error;
      
      // Update local state
      const deleteFolderAndChildren = (folders: Folder[], targetId: string): Folder[] => {
        return folders.reduce<Folder[]>((acc, folder) => {
          if (folder.id === targetId) return acc; // Skip the deleted folder
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
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async (reorderedItems: any[]) => {
    try {
      setIsLoading(true);
      
      // Update the order of items in the database
      const updates = reorderedItems.map((item, index) => {
        return item.type === 'folder' 
          ? supabase
              .from('wiki_folders')
              .update({}) // Removed order_index update
              .eq('id', item.id)
          : supabase
              .from('wiki_pages')
              .update({}) // Removed order_index update
              .eq('id', item.id);
      });
      
      await Promise.all(updates);
      
      // Refresh the data
      await Promise.all([
        fetchFolders(),
        fetchPages()
      ]);
      
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error reordering items:', error);
      toast.error('Failed to update order');
    }
  };

  // Handle moving items (pages or folders) to a different folder
  const handleMoveItem = async (itemId: string, targetFolderId: string | null) => {
    try {
      // Check if the item is a folder or a page
      const isFolder = folders.some(f => f.id === itemId);
      
      if (isFolder) {
        // Moving a folder
        const { error } = await supabase
          .from('wiki_folders')
          .update({ parent_id: targetFolderId })
          .eq('id', itemId);
        
        if (error) throw error;
        
        // Update local state
        setFolders(prev => 
          prev.map(folder => 
            folder.id === itemId 
              ? { ...folder, parent_id: targetFolderId } 
              : folder
          )
        );
      } else {
        // Moving a page
        const { error } = await supabase
          .from('wiki_pages')
          .update({ folder_id: targetFolderId })
          .eq('id', itemId);
        
        if (error) throw error;
        
        // Update local state
        setPages(prev => 
          prev.map(page => 
            page.id === itemId 
              ? { ...page, folder_id: targetFolderId } 
              : page
          )
        );
      }
      
      toast.success('Item moved successfully');
    } catch (error) {
      console.error('Error moving item:', error);
      toast.error('Failed to move item');
    }
  };

  // Update the folder click handler
  const handleFolderClick = (folderId: string) => {
    // Clear the selected page when navigating to a folder
    setSelectedPage(null);
    setEditingPage(null);
    // Navigate to the folder
    navigate(`/account/admin/wiki/folder/${folderId}`);
  };

  // Handle editing a page
  const handleEditPage = (pageId: string) => {
    setSelectedPage(pageId);
    setEditingPage(pageId);
  };

  // Update the folder tree building logic
  const folderTree = useMemo(() => {
    const folderMap = new Map<string, any>();
    const rootItems: any[] = [];
    
    // First pass: create map of all folders
    folders.forEach(folder => {
      const folderItem = {
        id: folder.id,
        type: 'folder' as const,
        name: folder.name,
        parentId: folder.parent_id,
        data: folder,
        children: []
      };
      
      folderMap.set(folder.id, folderItem);
      
      // If it's a root folder or we're in the current folder's context, add to root items
      if (!folder.parent_id || folder.parent_id === folderId) {
        rootItems.push(folderItem);
      }
    });
    
    // Second pass: build the hierarchy
    folderMap.forEach(folder => {
      if (folder.parentId && folderMap.has(folder.parentId)) {
        const parent = folderMap.get(folder.parentId);
        if (!parent.children) {
          parent.children = [];
        }
        // Only add if we're in the right context
        if (!folderId || folder.parentId === folderId) {
          parent.children.push(folder);
        }
      }
    });
    
    // Add pages to their respective folders or root
    pages.forEach(page => {
      const pageItem = {
        id: page.id,
        type: 'page' as const,
        name: page.title,
        parentId: page.folder_id,
        data: page
      };
      
      if (page.folder_id) {
        const parent = folderMap.get(page.folder_id);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          // Only add if we're in the right context
          if (!folderId || page.folder_id === folderId) {
            parent.children.push(pageItem);
          }
        } else if (!folderId) {
          // If parent folder doesn't exist but we're at root, add to root
          rootItems.push(pageItem);
        }
      } else if (!folderId) {
        // Add to root if no folder_id and we're at root
        rootItems.push(pageItem);
      }
    });
    
    // Sort items by order_index
    const sortItems = (items: any[]) => {
      if (!items) return [];
      return [...items].sort((a, b) => 
        (a.data?.order_index ?? 0) - (b.data?.order_index ?? 0)
      );
    };
    
    const sortRecursive = (items: any[]) => {
      const sorted = sortItems(items);
      return sorted.map(item => ({
        ...item,
        children: item.children ? sortRecursive(item.children) : []
      }));
    };
    
    return sortRecursive(rootItems);
  }, [folders, pages, folderId]);

  const currentFolder = folders.find(f => f.id === folderId);
  const currentPage = pages.find(p => p.id === selectedPage);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Wiki Manager</h1>
          
          {/* Breadcrumb navigation */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2 overflow-x-auto">
            <button 
              onClick={() => navigate('/account/admin/wiki')}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </button>
            {currentFolder && (
              <>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {currentFolder.name}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {/* Action buttons */}
          <div className="space-y-2 mb-4">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 justify-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => setShowNewPageInput(!showNewPageInput)}
              >
                <Plus size={14} className="mr-2" />
                New Page
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 justify-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => setShowNewFolderInput(!showNewFolderInput)}
              >
                <FolderIcon size={14} className="mr-2" />
                New Folder
              </Button>
            </div>
            
            {showNewFolderInput && (
              <div className="flex space-x-2 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                <Input
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  placeholder="Folder name"
                  className="h-8 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Button 
                  size="sm" 
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add
                </Button>
              </div>
            )}
            
            {showNewPageInput && (
              <div className="flex space-x-2 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                <Input
                  autoFocus
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePage()}
                  placeholder="Page title"
                  className="h-8 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Button 
                  size="sm" 
                  onClick={handleCreatePage}
                  disabled={!newPageName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add
                </Button>
              </div>
            )}
          </div>
          
          {/* Folder tree */}
          <div className="mt-2">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-gray-700 dark:text-gray-300" />
              </div>
            ) : (
              <div className="text-gray-700 dark:text-gray-300">
                <SortableFolderTree
                  folders={folders}
                  pages={pages}
                  selectedFolder={folderId}
                  selectedPage={selectedPage}
                  onSelect={handleFolderClick}
                  onPageSelect={(pageId) => {
                    setSelectedPage(pageId);
                    setEditingPage(pageId);
                  }}
                  onDeleteFolder={handleDeleteFolder}
                  onEditFolder={handleEditFolder}
                  onDeletePage={handleDeletePage}
                  onEditPage={handleEditPage}
                  onMoveItem={handleMoveItem}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentPage ? (
          <WikiEditor 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <File className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {currentFolder ? `No pages in ${currentFolder.name}` : 'No page selected'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {currentFolder 
                ? `Create a new page in this folder using the sidebar.`
                : `Select a page from the sidebar or create a new one.`}
            </p>
            <Button 
              onClick={() => setShowNewPageInput(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Page
            </Button>
          </div>
        )}
      </div>
      
      {/* Edit Folder Modal */}
      {editingFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Folder</h3>
            <Input
              autoFocus
              value={editingFolderName}
              onChange={(e) => setEditingFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateFolder()}
              placeholder="Folder name"
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingFolder(null);
                  setEditingFolderName('');
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateFolder}
                disabled={!editingFolderName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}