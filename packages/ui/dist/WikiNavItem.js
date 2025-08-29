import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import '@/styles/WikiPage.css';
export const WikiNavItem = ({ item, isActive = false, level = 0, onClick }) => {
    const { title, slug, type, children = [] } = item;
    const hasChildren = children && children.length > 0;
    const paddingLeft = `${level * 16 + 8}px`;
    const handleClick = (e) => {
        e.preventDefault();
        if (onClick) {
            onClick(slug);
        }
    };
    return (_jsxs("div", { className: `wiki-nav-item ${isActive ? 'active' : ''}`, style: { paddingLeft }, children: [_jsxs(Link, { to: `/wiki/${slug}`, className: `nav-link ${type}`, onClick: handleClick, children: [title, hasChildren && (_jsx("span", { className: "nav-toggle", children: isActive ? '▼' : '▶' }))] }), hasChildren && isActive && (_jsx("div", { className: "nav-children", children: children.map((child, index) => (_jsx(WikiNavItem, { item: child, level: level + 1, isActive: isActive, onClick: onClick }, child.slug))) }))] }));
};
