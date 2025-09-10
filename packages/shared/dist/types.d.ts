export interface WikiPage {
    id: string;
    title: string;
    slug: string;
    content?: string;
    excerpt?: string;
    is_published: boolean;
    view_count: number;
    category_id: string;
    folder_id: string | null;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string[];
    sections?: WikiSectionView[];
}
export interface WikiSectionView {
    id: string;
    title: string;
    content: string;
    order_index: number;
    page_id: string;
    created_at: string;
    updated_at: string;
}
//# sourceMappingURL=types.d.ts.map