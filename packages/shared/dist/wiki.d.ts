import { Enums, Json, TablesInsert } from './database.types';
export type { Enums, Json, TablesInsert };
interface WikiFolder {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    created_at: string;
    updated_at: string;
    children?: WikiFolder[];
}
interface WikiCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    page_count?: number;
}
interface Profile {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
}
export interface WikiPage {
    id: string;
    created_at: string;
    created_by: string | null;
    title: string;
    slug: string;
    excerpt: string | null;
    folder_id: string | null;
    is_published: boolean | null;
    category_id: string | null;
    view_count: number | null;
    updated_at: string;
    content?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string[] | null;
    category: WikiCategory | null;
    user: Profile | null;
    sections?: WikiSectionView[];
}
export type WikiSectionView = {
    id: string;
    title: string;
    content: Json | null;
    type: Enums<'content_block_type'>;
    order_index?: number;
    created_at?: string;
    updated_at?: string;
    page_id?: string;
};
export interface WikiPageWithSections extends WikiPage {
    sections: WikiSectionView[];
}
export declare const fetchFolders: () => Promise<WikiFolder[]>;
export declare const fetchWikiPage: (identifier: string) => Promise<WikiPageWithSections | null>;
//# sourceMappingURL=wiki.d.ts.map