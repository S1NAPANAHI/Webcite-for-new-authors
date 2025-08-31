import { ContentItem } from '../../shared/src/types/content';
type ContentType = 'posts' | 'pages' | 'storeItems' | 'libraryItems' | 'characters' | 'timelineEvents' | 'betaUsers';
interface ContentEditorProps<T extends ContentItem> {
    item?: T;
    contentType: ContentType;
    onSave: (data: T) => void;
    onCancel: () => void;
}
export declare function ContentEditor<T extends ContentItem>({ item, contentType, onSave, onCancel }: ContentEditorProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ContentEditor.d.ts.map