interface ReadingItem {
    id: string;
    title: string;
    author: string;
    progress: number;
    total_pages?: number;
    last_read_at: string;
    cover_image_url?: string;
    type: 'book' | 'article' | 'other';
}
export declare const useReadingHistory: (userId: string) => {
    readingItems: ReadingItem[];
    loading: boolean;
    error: string | null;
};
export {};
//# sourceMappingURL=useReadingHistory.d.ts.map