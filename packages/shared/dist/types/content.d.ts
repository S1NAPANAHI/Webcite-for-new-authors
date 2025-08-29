export type ContentStatus = 'draft' | 'published' | 'archived';
export interface BaseContent {
    id: string;
    status: ContentStatus;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}
export interface Post extends BaseContent {
    title: string;
    content?: string;
    slug: string;
    excerpt?: string;
    featured_image?: string;
    author_id?: string;
    category_id?: string;
    tags?: string[];
}
export interface Page extends Post {
    parent_id?: string;
    is_homepage?: boolean;
    template?: string;
    menu_order?: number;
}
export interface StoreItem extends BaseContent {
    name: string;
    description: string;
    price: number;
    category: 'digital' | 'physical' | 'service' | 'other';
    sku?: string;
    stock_quantity?: number;
    image_url?: string;
}
export interface LibraryItem extends BaseContent {
    title: string;
    description: string;
    category: 'tutorial' | 'guide' | 'template' | 'other';
    file_url: string;
    file_type?: string;
    file_size?: number;
    thumbnail_url?: string;
}
export interface Character extends BaseContent {
    name: string;
    role: string;
    description: string;
    backstory: string;
    image_url?: string;
    birth_date?: string;
    death_date?: string | null;
    species?: string;
    occupation?: string[];
    relationships?: Record<string, string>;
}
export interface NestedEvent {
    id?: string;
    date: string;
    title: string;
    description: string;
    order?: number;
}
export interface TimelineEvent extends BaseContent {
    title: string;
    date: string;
    era: 'ancient' | 'medieval' | 'modern' | 'future';
    description: string;
    details?: string | null;
    background_image?: string | null;
    is_published: boolean;
    nested_events?: NestedEvent[];
}
export interface BetaUser extends BaseContent {
    name: string;
    email: string;
    message: string;
}
export type ContentItem = Post | Page | StoreItem | LibraryItem | Character | TimelineEvent | BetaUser;
export type ContentType = 'posts' | 'pages' | 'storeItems' | 'libraryItems' | 'characters' | 'timelineEvents' | 'betaUsers';
export type FormData<T extends ContentItem> = Omit<T, 'id' | 'created_at' | 'updated_at' | 'created_by'>;
