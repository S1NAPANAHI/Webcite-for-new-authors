import React from 'react';
import '@/styles/WikiPage.css';
export interface WikiNavItemData {
    title: string;
    slug: string;
    type: 'page' | 'category';
    children?: WikiNavItemData[];
}
export interface WikiNavItemProps {
    item: WikiNavItemData;
    isActive?: boolean;
    level?: number;
    onClick?: (slug: string) => void;
}
export declare const WikiNavItem: React.FC<WikiNavItemProps>;
//# sourceMappingURL=WikiNavItem.d.ts.map