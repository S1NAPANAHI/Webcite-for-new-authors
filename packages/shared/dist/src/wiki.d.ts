import { Tables, Enums, Json, TablesInsert } from './database.types';
export type { Tables, Enums, Json, TablesInsert };
interface SupabaseSelectError {
    error: true;
}
export type WikiPageQueryResult = Tables<'wiki_pages'> & {
    user: Tables<'profiles'> | SupabaseSelectError | null;
    category: Tables<'wiki_categories'> | SupabaseSelectError | null;
};
export type Folder = Tables<'wiki_folders'> & {
    children?: Folder[];
};
export declare const fetchFolders: () => Promise<Folder[]>;
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
    category: Tables<'wiki_categories'> | null;
    user: Tables<'profiles'> | null;
    sections?: WikiSectionView[];
}
export interface WikiPageWithSections extends WikiPage {
    sections: WikiSectionView[];
}
export declare const fetchPages: () => Promise<WikiPageWithSections[]>;
export interface WikiCategory extends Tables<'wiki_categories'> {
    page_count?: number;
}
export interface WikiRevision extends Tables<'wiki_revisions'> {
    user?: {
        id: string;
        email?: string;
        user_metadata?: {
            full_name?: string;
            avatar_url?: string;
        };
    };
}
export type WikiMedia = Tables<'wiki_media'>;
export interface FetchWikiPagesOptions {
    search?: string;
    categoryId?: string;
    isPublished?: boolean;
    sortBy?: 'title' | 'created_at' | 'updated_at' | 'view_count' | 'relevance';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}
export interface PaginatedResult<T> {
    data: T[];
    count: number;
    page: number;
    pageSize: number;
    pageCount: number;
}
/**
 * Fetch a single wiki page by ID or slug
 */
export declare const fetchWikiPage: (identifier: string) => Promise<WikiPageWithSections | null>;
/**
 * Fetch multiple wiki pages with filtering and pagination
 */
export declare const fetchWikiPages: ({ search, categoryId, isPublished, sortBy, sortOrder, page, pageSize, }?: FetchWikiPagesOptions) => Promise<PaginatedResult<WikiPage>>;
/**
 * Create a new wiki page
 */
export declare const createWikiPage: (pageData: {
    title: string;
    sections: WikiSectionView[];
    excerpt?: string | null;
    is_published?: boolean;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string[] | null;
    category_id?: string | null;
    user_id: string;
    folder_id?: string | null;
}) => Promise<WikiPage>;
/**
 * Update an existing wiki page
 */
export declare const updateWikiPage: (id: string, updates: {
    title?: string;
    sections?: WikiSectionView[];
    excerpt?: string | null;
    is_published?: boolean;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string[] | null;
    category_id?: string | null;
    folder_id?: string | null;
}) => Promise<WikiPage>;
/**
 * Delete a wiki page
 */
export declare const deleteWikiPage: (id: string) => Promise<void>;
/**
 * Fetch all categories
 */
export declare const fetchCategories: () => Promise<WikiCategory[]>;
/**
 * Create a new category
 */
export declare const createCategory: (categoryData: {
    name: string;
    description?: string | null;
    user_id: string;
}) => Promise<WikiCategory>;
/**
 * Update a category
 */
export declare const updateCategory: (id: string, updates: {
    name?: string;
    description?: string | null;
}) => Promise<WikiCategory>;
/**
 * Delete a category
 */
export declare const deleteCategory: (id: string) => Promise<void>;
/**
 * Upload a file to the wiki media library
 */
export declare const uploadWikiMedia: (file: File, userId: string) => Promise<WikiMedia>;
/**
 * Get the URL for a wiki page
 */
export declare const getWikiPageUrl: (page: {
    slug: string;
}) => string;
/**
 * Get the URL for a wiki category
 */
export declare const getCategoryUrl: (category: {
    slug: string;
}) => string;
/**
 * Get the URL for a wiki tag
 */
export declare const getTagUrl: (tag: {
    id: string;
}) => string;
