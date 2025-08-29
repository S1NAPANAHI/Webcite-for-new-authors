import { WikiPageWithSections } from '@zoroaster/shared';
interface WikiViewerProps {
    page: WikiPageWithSections;
    onEdit?: () => void;
}
export declare function WikiViewer({ page, onEdit }: WikiViewerProps): import("react/jsx-runtime").JSX.Element;
export default WikiViewer;
