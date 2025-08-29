import 'react-quill-new/dist/quill.snow.css';
import { WikiPageWithSections } from '../../packages/shared/src/wiki';
interface WikiEditorProps {
    id?: string;
    onUpdatePage?: (page: WikiPageWithSections) => void;
    initialData?: WikiPageWithSections;
}
export declare function WikiEditor({ id, onUpdatePage, initialData }: WikiEditorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WikiEditor.d.ts.map