import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFolders, fetchPages, fetchWikiPage } from '@zoroaster/shared';
import { WikiNavItem } from '@zoroaster/ui';
import { toast } from 'sonner';
const WikiPage = () => {
    const [leftSidebarExpanded, setLeftSidebarExpanded] = useState(true);
    const [rightSidebarExpanded, setRightSidebarExpanded] = useState(true);
    const [currentPageSlug, setCurrentPageSlug] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [folders, setFolders] = useState([]);
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(null);
    const wikiLayoutRef = useRef(null);
    const navigate = useNavigate();
    const { slug } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [foldersData, pagesData] = await Promise.all([
                    fetchFolders(),
                    fetchPages(),
                ]);
                setFolders(foldersData);
                setPages(pagesData);
                if (slug) {
                    const page = await fetchWikiPage(slug);
                    setCurrentPage(page);
                    setCurrentPageSlug(slug);
                }
                else if (pagesData.length > 0) {
                    const page = await fetchWikiPage(pagesData[0].slug);
                    setCurrentPage(page);
                    setCurrentPageSlug(pagesData[0].slug);
                }
            }
            catch (error) {
                console.error('Error fetching wiki data:', error);
                toast.error('Failed to load wiki content');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);
    const buildNavTree = () => {
        const folderMap = new Map();
        const rootItems = [];
        folders.forEach(folder => {
            const navItem = {
                id: folder.id,
                title: folder.name,
                slug: folder.slug,
                type: 'folder',
                children: []
            };
            folderMap.set(folder.id, navItem);
        });
        pages.forEach(page => {
            const navItem = {
                id: page.id,
                title: page.title,
                slug: page.slug,
                type: 'page',
            };
            if (page.folder_id && folderMap.has(page.folder_id)) {
                const parent = folderMap.get(page.folder_id);
                if (parent) {
                    parent.children.push(navItem);
                }
            }
            else {
                rootItems.push(navItem);
            }
        });
        folderMap.forEach(folder => {
            if (folder.parent_id && folderMap.has(folder.parent_id)) {
                const parent = folderMap.get(folder.parent_id);
                if (parent) {
                    parent.children.push(folder);
                }
            }
            else {
                rootItems.push(folder);
            }
        });
        return rootItems;
    };
    const navItems = buildNavTree();
    const handleNavLinkClick = (slug) => {
        navigate(`/wiki/${slug}`);
    };
    const renderSection = (section) => {
        const contentHtml = section.content;
        if (contentHtml) {
            return _jsx("div", { dangerouslySetInnerHTML: { __html: contentHtml } });
        }
        return null;
    };
    return (_jsx("div", { className: "wiki-page-container", children: _jsxs("div", { className: "wiki-layout", ref: wikiLayoutRef, children: [_jsx("div", { className: `wiki-left-sidebar ${leftSidebarExpanded ? '' : 'collapsed'}`, children: _jsx("div", { className: "wiki-left-sidebar-content", children: _jsxs("div", { className: "wiki-sidebar-nav", children: [_jsx("h3", { children: "Wiki Navigation" }), _jsx("input", { type: "text", placeholder: "Search wiki...", className: "wiki-search-input", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), loading ? (_jsx("div", { children: "Loading..." })) : (_jsx("ul", { children: navItems.map(item => (_jsx(WikiNavItem, { item: item, onClick: handleNavLinkClick, isActive: currentPageSlug === item.slug }, item.id))) }))] }) }) }), _jsx("div", { className: "wiki-main-content", children: loading ? (_jsx("div", { children: "Loading page content..." })) : currentPage ? (_jsxs(_Fragment, { children: [_jsx("h1", { className: "wiki-page-title", children: currentPage.title }), currentPage.sections?.map((section, index) => (_jsx("div", { children: renderSection(section) }, section?.id || index)))] })) : (_jsx("div", { children: "No page selected or page not found." })) }), rightSidebarExpanded && currentPage?.sections?.length > 0 && (_jsx("div", { className: "wiki-right-sidebar", children: _jsx("div", { className: "wiki-right-sidebar-content", children: _jsxs("div", { className: "wiki-sidebar-nav", children: [_jsx("h3", { children: "On This Page" }), _jsx("ul", { children: currentPage.sections
                                        .filter(section => section?.type === 'heading_1' || section?.type === 'heading_2')
                                        .map((section, index) => (_jsx("li", { children: _jsx("a", { href: `#${section?.id || ''}`, className: section?.type === 'heading_1' ? 'toc-h1' : 'toc-h2', children: section?.title || 'Untitled Section' }) }, section?.id || index))) })] }) }) }))] }) }));
};
export default WikiPage;
//# sourceMappingURL=WikiPage.js.map