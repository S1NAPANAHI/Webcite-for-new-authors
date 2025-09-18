import React from 'react';
import { Link } from 'react-router-dom';
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

export const WikiNavItem: React.FC<WikiNavItemProps> = ({
    item,
    isActive = false,
    level = 0,
    onClick
}) => {
    const { title, slug, type, children = [] } = item;
    const hasChildren = children && children.length > 0;
    const paddingLeft = `${level * 16 + 8}px`;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onClick) {
            onClick(slug);
        }
    };

    return (
        <div className={`wiki-nav-item ${isActive ? 'active' : ''}`} style={{ paddingLeft }}>
            <Link 
                to={`/wiki/${slug}`} 
                className={`nav-link ${type}`}
                onClick={handleClick}
            >
                {title}
                {hasChildren && (
                    <span className="nav-toggle">
                        {isActive ? '▼' : '▶'}
                    </span>
                )}
            </Link>
            
            {hasChildren && isActive && (
                <div className="nav-children">
                    {children.map((child, index) => (
                        <WikiNavItem 
                            key={child.slug}
                            item={child}
                            level={level + 1}
                            isActive={isActive}
                            onClick={onClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


