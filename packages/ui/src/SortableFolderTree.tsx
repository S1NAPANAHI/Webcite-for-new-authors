import { useMemo } from 'react';
import * as React from 'react';
import { Button } from './button';
import { Folder, File, Edit, Trash2 } from 'lucide-react';
import { cn } from './lib';

type Folder = {
  id: string;
  name: string;
  parent_id: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

type Page = {
  id: string;
  title: string;
  slug: string;
  folder_id: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_published: boolean;
  excerpt?: string | null;
  view_count: number | null;
  content?: string;
};

type SortableFolderTreeProps = {
  folders: Folder[];
  pages: Page[];
  selectedFolder?: string | null;
  selectedPage: string;
  onSelect: (folderId: string) => void;
  onPageSelect: (pageId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onEditFolder: (folder: Folder) => void;
  onMoveItem?: (itemId: string, folderId: string | null) => void; // Made optional since it's not used
};

interface FolderTreeItem {
  id: string;
  name: string;
  parent_id: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_published?: boolean;
  type: 'folder';
  children: FolderTreeItem[];
  pages: PageTreeItem[];
}

interface PageTreeItem {
  id: string;
  title: string;
  slug: string;
  folder_id: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_published: boolean;
  excerpt?: string | null;
  view_count: number | null;
  content?: string;
  type: 'page';
}

export function SortableFolderTree({
  folders,
  pages,
  selectedFolder,
  selectedPage,
  onSelect,
  onPageSelect,
  onDeleteFolder,
  onEditFolder,
  // onMoveItem is not used but kept in props for future use
}: SortableFolderTreeProps) {

  const folderTree: (FolderTreeItem | PageTreeItem)[] = useMemo(() => {
    const folderMap = new Map<string, FolderTreeItem>();
    const rootItems: FolderTreeItem[] = [];

    // First pass: create map of folders
    folders.forEach(folder => {
      const folderItem: FolderTreeItem = {
        ...folder,
        children: [],
        pages: [],
        type: 'folder'
      };
      folderMap.set(folder.id, folderItem);
    });

    // Second pass: build tree
    folders.forEach(folder => {
      const node = folderMap.get(folder.id);
      if (node && folder.parent_id && folderMap.has(folder.parent_id)) {
        const parent = folderMap.get(folder.parent_id);
        if (parent) {
          parent.children.push(node);
        }
      } else if (node) {
        rootItems.push(node);
      }
    });

    // Add pages to their respective folders
    const rootPages: PageTreeItem[] = [];
    pages.forEach(page => {
      const pageItem: PageTreeItem = {
        id: page.id,
        title: page.title,
        slug: page.slug,
        folder_id: page.folder_id,
        category_id: page.category_id,
        created_at: page.created_at,
        updated_at: page.updated_at,
        created_by: page.created_by,
        is_published: page.is_published || false,
        excerpt: page.excerpt || null,
        view_count: page.view_count || 0,
        type: 'page',
        content: (page as any).content, // Use type assertion since content might exist
      };

      if (page.folder_id && folderMap.has(page.folder_id)) {
        const parent = folderMap.get(page.folder_id);
        if (parent) {
          parent.pages.push(pageItem);
        }
      } else if (!page.folder_id) {
        // Add to root pages if no folder
        rootPages.push(pageItem);
      }
    });

    // Return both folders and pages at the root level
    return [...rootItems, ...rootPages] as const;
  }, [folders, pages]);

  const renderItem = (item: FolderTreeItem | PageTreeItem, depth = 0): JSX.Element | null => {
    if (!item) return null;
    
    if (item.type === 'page') {
      return (
        <div 
          key={item.id}
          className={cn(
            'flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800',
            selectedPage === item.id && 'bg-blue-50 dark:bg-blue-900/30',
          )}
          onClick={() => onPageSelect(item.id)}
        >
          <File className="h-4 w-4 mr-2 text-gray-500" />
          <span className="truncate">{item.title}</span>
        </div>
      );
    }

    return (
      <div key={item.id} className="space-y-1">
        <div 
          className={cn(
            'flex items-center justify-between p-2 rounded-md cursor-pointer',
            selectedFolder === item.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
          onClick={() => onSelect(item.id)}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Folder className="h-4 w-4 text-blue-500" />
            <span className="truncate">{item.name}</span>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onEditFolder(item);
              }}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-500 hover:text-red-600"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDeleteFolder(item.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {item.children.length > 0 && (
          <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
            {item.children.map((child: FolderTreeItem) => renderItem(child, depth + 1))}
          </div>
        )}
        
        {item.pages.length > 0 && (
          <div className="pl-4">
            {item.pages.map((page: PageTreeItem) => renderItem(page, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render the folder tree
  return (
    <div className="space-y-1">
      {folderTree.map((item) => (
        <div key={item.id}>
          {renderItem(item, 0)}
        </div>
      ))}
    </div>
  );
}
