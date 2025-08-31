import { ContentItem, ContentType } from '../../../../shared/src/types/content';
interface ContentEditorProps<T extends ContentItem> {
    item?: T;
    contentType: ContentType;
    onSave: (data: T) => void;
    onCancel: () => void;
}
export declare function ContentEditor<T extends ContentItem>({ item, contentType, onSave, onCancel }: ContentEditorProps<T>): import("react/jsx-runtime").JSX.Element;
export default ContentEditor;
//# sourceMappingURL=index.d.ts.map