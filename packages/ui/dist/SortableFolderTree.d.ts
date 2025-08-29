import { WikiPage, Folder as WikiFolder } from '@zoroaster/shared';
type SortableFolderTreeProps = {
    folders: WikiFolder[];
    pages: WikiPage[];
    selectedFolder?: string | null;
    selectedPage: string;
    onSelect: (folderId: string) => void;
    onPageSelect: (pageId: string) => void;
    onDeleteFolder: (folderId: string) => void;
    onEditFolder: (folder: WikiFolder) => void;
    onDeletePage: (pageId: string) => void;
    onEditPage: (page: WikiPage) => void;
    onMoveItem?: (itemId: string, folderId: string | null) => void;
};
export declare function SortableFolderTree({ folders, pages, selectedFolder, selectedPage, onSelect, onPageSelect, onDeleteFolder, onEditFolder, onDeletePage, onEditPage, }: SortableFolderTreeProps): import("react/jsx-runtime").JSX.Element;
export {};
