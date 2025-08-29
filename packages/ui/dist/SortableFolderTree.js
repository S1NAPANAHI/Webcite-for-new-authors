import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Button } from './button';
import { Folder, File, Edit, Trash2 } from 'lucide-react';
import { cn } from './lib/utils.js';
export function SortableFolderTree({ folders, pages, selectedFolder, selectedPage, onSelect, onPageSelect, onDeleteFolder, onEditFolder, onDeletePage, onEditPage,
// onMoveItem is not used but kept in props for future use
 }) {
    const folderTree = useMemo(() => {
        const folderMap = new Map();
        const rootItems = [];
        // First pass: create map of folders
        folders.forEach(folder => {
            const folderItem = {
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
            }
            else if (node) {
                rootItems.push(node);
            }
        });
        // Add pages to their respective folders
        const rootPages = [];
        pages.forEach(page => {
            const pageItem = {
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
                content: page.content, // Use type assertion since content might exist
            };
            if (page.folder_id && folderMap.has(page.folder_id)) {
                const parent = folderMap.get(page.folder_id);
                if (parent) {
                    parent.pages.push(pageItem);
                }
            }
            else if (!page.folder_id) {
                // Add to root pages if no folder
                rootPages.push(pageItem);
            }
        });
        // Return both folders and pages at the root level
        return [...rootItems, ...rootPages];
    }, [folders, pages]);
    const renderItem = (item, depth = 0) => {
        if (!item)
            return null;
        if (item.type === 'page') {
            return (_jsxs("div", { className: cn('flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800', selectedPage === item.id && 'bg-blue-50 dark:bg-blue-900/30'), onClick: () => onPageSelect(item.id), children: [_jsx(File, { className: "h-4 w-4 mr-2 text-gray-500" }), _jsx("span", { className: "truncate", children: item.title })] }, item.id));
        }
        return (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: cn('flex items-center justify-between p-2 rounded-md cursor-pointer', selectedFolder === item.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'), onClick: () => onSelect(item.id), children: [_jsxs("div", { className: "flex items-center space-x-2 flex-1 min-w-0", children: [_jsx(Folder, { className: "h-4 w-4 text-blue-500" }), _jsx("span", { className: "truncate", children: item.name })] }), _jsxs("div", { className: "flex space-x-1", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", onClick: (e) => {
                                        e.stopPropagation();
                                        onEditFolder(item);
                                    }, children: _jsx(Edit, { className: "h-3.5 w-3.5" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 text-red-500 hover:text-red-600", onClick: (e) => {
                                        e.stopPropagation();
                                        onDeleteFolder(item.id);
                                    }, children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) })] })] }), item.children.length > 0 && (_jsx("div", { className: "pl-4 border-l border-gray-200 dark:border-gray-700", children: item.children.map((child) => renderItem(child, depth + 1)) })), item.pages.length > 0 && (_jsx("div", { className: "pl-4", children: item.pages.map((page) => renderItem(page, depth + 1)) }))] }, item.id));
    };
    // Render the folder tree
    return (_jsx("div", { className: "space-y-1", children: folderTree.map((item) => (_jsx("div", { children: renderItem(item, 0) }, item.id))) }));
}
//# sourceMappingURL=SortableFolderTree.js.map