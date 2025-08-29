import React from 'react';
interface Column {
    key: string;
    label: string;
    render?: (item: any) => React.ReactNode;
}
interface ContentTableProps {
    contentType: string;
    items: any[];
    title: string;
    columns: Column[];
    createActionLabel: string;
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onCreateNew: () => void;
}
export declare const ContentTable: React.FC<ContentTableProps>;
export {};
//# sourceMappingURL=ContentTable.d.ts.map