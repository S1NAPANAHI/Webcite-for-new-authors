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
export declare const useWikiStructure: () => {
    folders: Folder[];
    pages: Page[];
    loading: boolean;
    error: string | null;
    fetchData: () => Promise<void>;
    createFolder: (name: string, parentId?: string | null) => Promise<boolean>;
    createPage: (title: string, folderId?: string | null) => Promise<boolean>;
};
export {};
//# sourceMappingURL=useWikiStructure.d.ts.map