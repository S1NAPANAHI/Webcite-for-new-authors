import { Tables } from '../database.types';
type Folder = Tables<'wiki_folders'> & {
    is_expanded?: boolean;
    children?: Folder[];
};
export declare const useWikiStructure: () => {
    folders: Folder[];
    pages: {
        category_id: string | null;
        content: string | null;
        created_at: string;
        created_by: string | null;
        excerpt: string | null;
        folder_id: string | null;
        id: string;
        is_published: boolean | null;
        slug: string;
        title: string;
        updated_at: string;
        view_count: number | null;
    }[];
    loading: boolean;
    error: string | null;
    fetchData: () => Promise<void>;
    createFolder: (name: string, parentId?: string | null) => Promise<boolean>;
    createPage: (title: string, folderId?: string | null) => Promise<boolean>;
};
export {};
//# sourceMappingURL=useWikiStructure.d.ts.map