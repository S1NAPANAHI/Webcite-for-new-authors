import React from 'react';
type Work = {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    type: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
    parent_id?: string;
    order_in_parent?: number;
    description?: string;
    status: 'planning' | 'writing' | 'editing' | 'published' | 'on_hold';
    progress_percentage?: number;
    release_date?: string;
    estimated_release?: string;
    cover_image_url?: string;
    sample_url?: string;
    sample_content?: string;
    is_purchasable?: boolean;
    is_featured?: boolean;
    word_count?: number;
    target_word_count?: number;
};
interface WorkEditorProps {
    work: Work | null;
    onSave: (work: Work) => void;
    onCancel: () => void;
    allWorks: Work[];
}
export declare const WorkEditor: React.FC<WorkEditorProps>;
export declare const WorksManager: React.FC;
export {};
//# sourceMappingURL=WorksManager.d.ts.map