import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@zoroaster/ui';
import { Input } from '@zoroaster/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@zoroaster/ui';
import { Plus, Folder, File, ChevronDown, ChevronRight, Trash2, Edit, Menu } from 'lucide-react';
import { supabase } from '@zoroaster/shared';
import { toast } from 'sonner';

type Folder = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  is_expanded?: boolean;
  children?: Folder[];
};

type Page = {
  id: string;
  title: string;
  slug: string;
  folder_id: string | null;
};

export default function WikiAdmin() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [newPageName, setNewPageName] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
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
        
        if (foldersError) throw foldersError;
        
        // Fetch all pages
        const { data: pagesData, error: pagesError } = await supabase
          .from('wiki_pages')
          .select('*')
          .order('title');
        
        if (pagesError) throw pagesError;
        
        setFolders(foldersData || []);
        setPages(pagesData || []);
        
      } catch (error) {
        console.error('Error fetching wiki data:', error);
        toast.error('Failed to load wiki data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Build folder tree structure
  const buildFolderTree = (folders: Folder[]): Folder[] => {
    const folderMap = new Map<string, Folder>();
    const rootFolders: Folder[] = [];
    
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
      } else {
        rootFolders.push(folder);
      }
    });
    
    return rootFolders;
  };

  const handleCreateFolder = async (parentId: string | null = null) => {
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
      
      if (error) throw error;
      
      setFolders([...folders, data]);
      setNewFolderName('');
      setShowNewFolderInput(false);
      toast.success('Folder created successfully');
      
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const handleCreatePage = async (folderId: string | null = null) => {
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
      
      if (error) throw error;
      
      setPages([...pages, data]);
      setNewPageName('');
      setShowNewPageInput(false);
      toast.success('Page created successfully');
      
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('Failed to create page');
    }
  };

  const toggleFolder = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, is_expanded: !folder.is_expanded }
        : folder
    ));
  };

  const renderFolder = (folder: Folder, level: number = 0) => {
    const hasChildren = folder.children && folder.children.length > 0;
    const isExpanded = folder.is_expanded !== false; // Default to expanded
    
    return (
      <div key={folder.id} className="pl-4">
        <div 
          className={`flex items-center py-1 px-2 rounded hover:bg-accent cursor-pointer ${currentFolder === folder.id ? 'bg-accent' : ''}`}
          onClick={() => setCurrentFolder(folder.id === currentFolder ? null : folder.id)}
        >
          {hasChildren ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className="mr-1"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-4 mr-1"></div>
          )}
          <Folder size={16} className="mr-2 text-blue-500" />
          <span className="truncate">{folder.name}</span>
          <div className="ml-auto flex space-x-1">
            <button 
              className="p-1 rounded hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                setShowNewPageInput(true);
                setCurrentFolder(folder.id);
              }}
              title="Add page"
            >
              <Plus size={14} />
            </button>
            <button 
              className="p-1 rounded hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                setShowNewFolderInput(true);
                setCurrentFolder(folder.id);
              }}
              title="Add subfolder"
            >
              <Folder size={14} />
            </button>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="border-l border-border ml-2 pl-2">
            {folder.children?.map(child => renderFolder(child, level + 1))}
          </div>
        )}
        
        {isExpanded && currentFolder === folder.id && (
          <div className="ml-8 mt-1">
            {pages
              .filter(page => page.folder_id === folder.id)
              .map(page => (
                <div 
                  key={page.id}
                  className="flex items-center py-1 px-2 rounded hover:bg-accent cursor-pointer"
                >
                  <File size={14} className="mr-2 text-gray-500" />
                  <span className="truncate">{page.title}</span>
                </div>
              ))
            }
            
            {showNewPageInput && currentFolder === folder.id && (
              <div className="flex items-center mt-1">
                <Input
                  autoFocus
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreatePage(folder.id);
                    } else if (e.key === 'Escape') {
                      setShowNewPageInput(false);
                      setNewPageName('');
                    }
                  }}
                  placeholder="Page name"
                  className="h-8 text-sm"
                />
              </div>
            )}
          </div>
        )}
        
        {showNewFolderInput && currentFolder === folder.id && (
          <div className="ml-8 mt-1">
            <div className="flex items-center">
              <Input
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFolder(folder.id);
                  } else if (e.key === 'Escape') {
                    setShowNewFolderInput(false);
                    setNewFolderName('');
                  }
                }}
                placeholder="Folder name"
                className="h-8 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wiki Management</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowNewFolderInput(true);
              setCurrentFolder(null);
            }}
          >
            <Folder size={16} className="mr-2" />
            New Folder
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowNewPageInput(true);
              setCurrentFolder(null);
            }}
          >
            <File size={16} className="mr-2" />
            New Page
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar - Folder structure */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Wiki Structure</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="space-y-1">
                  {buildFolderTree(folders).map(folder => renderFolder(folder))}
                  
                  {/* Root level new folder input */}
                  {showNewFolderInput && currentFolder === null && (
                    <div className="pl-4">
                      <Input
                        autoFocus
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCreateFolder(null);
                          } else if (e.key === 'Escape') {
                            setShowNewFolderInput(false);
                            setNewFolderName('');
                          }
                        }}
                        placeholder="Folder name"
                        className="h-8 text-sm"
                      />
                    </div>
                  )}
                  
                  {/* Root level new page input */}
                  {showNewPageInput && currentFolder === null && (
                    <div className="pl-4">
                      <Input
                        autoFocus
                        value={newPageName}
                        onChange={(e) => setNewPageName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCreatePage(null);
                          } else if (e.key === 'Escape') {
                            setShowNewPageInput(false);
                            setNewPageName('');
                          }
                        }}
                        placeholder="Page name"
                        className="h-8 text-sm"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="col-span-9">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentFolder 
                  ? `Pages in ${folders.find(f => f.id === currentFolder)?.name || 'Folder'}` 
                  : 'Select a folder or create a new page'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentFolder ? (
                <div className="space-y-2">
                  {pages.filter(page => page.folder_id === currentFolder).length === 0 ? (
                    <div className="text-muted-foreground text-center py-8">
                      No pages in this folder. Create a new page to get started.
                    </div>
                  ) : (
                    pages
                      .filter(page => page.folder_id === currentFolder)
                      .map(page => (
                        <div 
                          key={page.id}
                          className="flex items-center justify-between p-3 border rounded hover:bg-accent cursor-pointer"
                        >
                          <div className="flex items-center">
                            <File size={16} className="mr-3 text-gray-500" />
                            <span>{page.title}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 size={16} className="text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Select a folder to view its contents or create a new page
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
