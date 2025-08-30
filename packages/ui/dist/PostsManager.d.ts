import React from 'react';
type Post = {
    id: string;
    title: string;
    content: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    created_at: string;
    updated_at: string;
    author_id: string;
    views: number;
};
interface PostEditorProps {
    post: Post | null;
    onSave: (post: Post) => void;
    onCancel: () => void;
}
export declare const PostEditor: React.FC<PostEditorProps>;
export declare const PostsManager: React.FC;
export {};
//# sourceMappingURL=PostsManager.d.ts.map