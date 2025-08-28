import React, { useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core/dist/types';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Folder, File, GripVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@zoroaster/ui';
import { cn } from '@zoroaster/shared';

import { Folder as SharedFolder, WikiPage } from '@zoroaster/shared';

type Folder = SharedFolder;

type Page = WikiPage;

type SortableFolderTreeProps = {
  folders: Folder[];
  pages: Page[];
  selectedFolder?: string | null;
  selectedPage?: string | null;
  onSelect: (folderId: string) => void;
  onPageSelect: (pageId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onEditFolder: (folder: Folder) => void;
  onDeletePage: (pageId: string) => void;
  onEditPage: (pageId: string) => void;
  onMoveItem: (itemId: string, folderId: string | null) => void;
};

export function SortableFolderTree({
  folders,
  pages,
  selectedFolder,
  selectedPage,
  onSelect,
  onPageSelect,
  onDeleteFolder,
  onEditFolder,
  onDeletePage,
  onEditPage,
  onMoveItem,
}: SortableFolderTreeProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Build the folder tree structure
  const folderTree = useMemo(() => {
    const folderMap = new Map<string, any>();
    const rootFolders: any[] = [];

    // First pass: create map of folders
    folders.forEach(folder => {
      folderMap.set(folder.id, {
        ...folder,
        children: [],
        pages: [],
      });
    });

    // Second pass: build tree
    folders.forEach(folder => {
      const node = folderMap.get(folder.id);
      if (folder.parent_id && folderMap.has(folder.parent_id)) {
        folderMap.get(folder.parent_id).children.push(node);
      } else {
        rootFolders.push(node);
      }
    });

    // Add pages to their respective folders
    pages.forEach(page => {
      if (page.folder_id && folderMap.has(page.folder_id)) {
        folderMap.get(page.folder_id).pages.push({
          id: page.id,
          type: 'page',
          title: page.title,
          slug: page.slug,
        });
      } else if (!page.folder_id) {
        // Add to root pages if no folder
        rootFolders.push({
          id: page.id,
          type: 'page',
          title: page.title,
          slug: page.slug,
        });
      }
    });

    return rootFolders;
  }, [folders, pages]);

  const renderFolder = (folder: any, depth = 0) => {
    return (
      <div key={folder.id} className="space-y-1">
        <div 
          className={cn(
            'flex items-center justify-between p-2 rounded-md cursor-pointer',
            selectedFolder === folder.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
          onClick={() => onSelect(folder.id)}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Folder className="h-4 w-4 text-blue-500" />
            <span className="truncate">{folder.name}</span>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onEditFolder(folder);
              }}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFolder(folder.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {folder.children.length > 0 && (
          <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
            {folder.children.map((child: any) => renderFolder(child, depth + 1))}
          </div>
        )}
        
        {folder.pages.length > 0 && (
          <div className="pl-4">
            {folder.pages.map((page: any) => (
              <div 
                key={page.id}
                className={cn(
                  'flex items-center justify-between p-2 rounded-md cursor-pointer',
                  selectedPage === page.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                onClick={() => onPageSelect(page.id)}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{page.title}</span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPage(page.id);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(page.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {folderTree.map((item) => 
        item.type === 'page' ? (
          <div 
            key={item.id}
            className={cn(
              'flex items-center justify-between p-2 rounded-md cursor-pointer',
              selectedPage === item.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
            onClick={() => onPageSelect(item.id)}
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <File className="h-4 w-4 text-gray-500" />
              <span className="truncate">{item.title}</span>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditPage(item.id);
                }}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePage(item.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          renderFolder(item)
        )
      )}
    </div>
  );
}
