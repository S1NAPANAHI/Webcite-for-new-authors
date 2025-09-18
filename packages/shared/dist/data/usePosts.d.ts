export declare const usePosts: () => {
    posts: {
        author_id: string;
        content: string | null;
        created_at: string;
        excerpt: string | null;
        id: string;
        is_featured: boolean | null;
        published_at: string | null;
        seo_description: string | null;
        seo_keywords: string[] | null;
        seo_title: string | null;
        slug: string;
        status: string | null;
        tags: string[] | null;
        title: string;
        updated_at: string;
        views: number | null;
    }[];
    loading: boolean;
    error: string | null;
};
export declare const usePost: (slug: string) => {
    post: {
        author_id: string;
        content: string | null;
        created_at: string;
        excerpt: string | null;
        id: string;
        is_featured: boolean | null;
        published_at: string | null;
        seo_description: string | null;
        seo_keywords: string[] | null;
        seo_title: string | null;
        slug: string;
        status: string | null;
        tags: string[] | null;
        title: string;
        updated_at: string;
        views: number | null;
    } | null;
    loading: boolean;
    error: string | null;
};
//# sourceMappingURL=usePosts.d.ts.map