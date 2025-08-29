import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Input } from '@zoroaster/ui';
import { X, BookOpen, FileIcon, Folder as FolderIcon, Menu as MenuIcon, Search, ChevronRight } from 'lucide-react';
import { supabase } from '@zoroaster/shared';
import { toast } from 'sonner';
// Helper type guard functions
const isWikiPage = (item) => {
    return item.resultType === 'page';
};
const isFolder = (item) => {
    return item.resultType === 'folder';
};
export function WikiViewer({ page, onEdit }) {
    const { folderSlug, pageSlug } = useParams();
    const [pages, setPages] = useState([]);
    const [folders, setFolders] = useState([]);
    const [currentPage, setCurrentPage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toc, setToc] = useState([]);
    const searchTimeoutRef = useRef(null);
    const contentRef = useRef(null);
    const content = page.excerpt || '';
    // Handle search functionality
    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            setIsSearching(true);
            // Search in wiki_pages (title and excerpt)
            const { data: pagesData, error: pagesError } = await supabase
                .from('wiki_pages')
                .select(`
          *,
          content, seo_title, seo_description, seo_keywords, sections,
          category:wiki_categories(*),
          user:profiles(*)
        `)
                .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`);
            if (pagesError)
                throw pagesError;
            const results = (pagesData || []).map((page) => {
                // Explicitly handle user and category types
                let userProfile = null;
                if (page.user && typeof page.user === 'object' && !('error' in page.user)) {
                    userProfile = page.user;
                }
                let pageCategory = null;
                if (page.category && typeof page.category === 'object' && !('error' in page.category)) {
                    pageCategory = page.category;
                }
                return {
                    ...page,
                    resultType: 'page',
                    sections: page.sections || [],
                    content: page.content || '',
                    excerpt: page.excerpt || '',
                    is_published: page.is_published ?? true,
                    category_id: page.category_id ?? null,
                    folder_id: page.folder_id ?? null,
                    created_at: page.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by: page.created_by || '',
                    view_count: page.view_count || 0,
                    slug: page.slug || '',
                    seo_title: page.seo_title || null,
                    seo_description: page.seo_description || null,
                    seo_keywords: page.seo_keywords || [],
                    category: pageCategory, // Assign the correctly typed category
                    user: userProfile, // Assign the correctly typed user
                };
            });
            setSearchResults(results);
        }
        catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to perform search');
        }
        finally {
            setIsSearching(false);
        }
    };
    // Fetch all folders and pages
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch all pages
                const { data: pagesData, error: pagesError } = await supabase
                    .from('wiki_pages')
                    .select('*, content, seo_title, seo_description, seo_keywords, sections, category:wiki_categories(*), user:profiles(*)') // Include these fields
                    .order('title');
                if (pagesError)
                    throw pagesError;
                // Explicitly handle user and category for each page
                const processedPages = (pagesData || []).map((page) => {
                    let userProfile = null;
                    if (page.user && typeof page.user === 'object' && !('error' in page.user)) {
                        userProfile = page.user;
                    }
                    let pageCategory = null;
                    if (page.category && typeof page.category === 'object' && !('error' in page.category)) {
                        pageCategory = page.category;
                    }
                    return {
                        ...page,
                        sections: page.sections || [],
                        content: page.content || '',
                        seo_title: page.seo_title || '',
                        seo_description: page.seo_description || '',
                        seo_keywords: page.seo_keywords || [],
                        category: pageCategory,
                        user: userProfile,
                        resultType: 'page', // Add resultType here
                    };
                });
                setPages(processedPages);
            }
            catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load wiki pages');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [pageSlug]);
    // Build folder tree structure
    const buildFolderTree = (folders) => {
        const folderMap = new Map();
        const rootFolders = [];
        // First pass: create map of all folders
        folders.forEach(folder => {
            folderMap.set(folder.id, { ...folder, children: [] });
        });
        // Second pass: build tree structure
        folderMap.forEach(folder => {
            if (folder.parent_id && folderMap.has(folder.parent_id)) {
                const parent = folderMap.get(folder.parent_id);
                if (parent) {
                    parent.children = [...(parent.children || []), folder];
                }
            }
            else {
                rootFolders.push(folder);
            }
        });
        return rootFolders;
    };
    // Generate table of contents from page content
    const generateToc = (sections = []) => {
        const headers = sections
            .filter(block => block?.type?.startsWith?.('heading_'))
            .map(block => {
            const level = parseInt(block.type.split('_')[1] || '1');
            return {
                id: `heading-${block.id}`,
                text: block.content?.text || '',
                level: isNaN(level) ? 1 : level
            };
        });
        setToc(headers);
    };
    // Render content blocks
    const renderContentBlock = (block) => {
        if (!block)
            return null;
        switch (block.type) {
            case 'heading_1':
            case 'heading_2':
            case 'heading_3':
                const level = parseInt(block.type.split('_')[1]);
                const Tag = `h${level}`;
                return _jsx(Tag, { id: `heading-${block.id}`, className: "mt-6 mb-4 font-semibold", children: block.content?.text });
            case 'paragraph':
                return _jsx("p", { className: "mb-4 leading-relaxed", children: block.content?.text });
            case 'bullet_list':
                return (_jsx("ul", { className: "list-disc pl-6 mb-4 space-y-1", children: block.content?.items?.map((item, i) => (_jsx("li", { children: item }, i))) }));
            case 'ordered_list':
                return (_jsx("ol", { className: "list-decimal pl-6 mb-4 space-y-1", children: block.content?.items?.map((item, i) => (_jsx("li", { children: item }, i))) }));
            case 'quote':
                return (_jsx("blockquote", { className: "border-l-4 border-gray-300 pl-4 py-1 my-4 text-gray-600 italic", children: block.content?.text }));
            case 'code':
                return (_jsx("pre", { className: "bg-gray-100 p-4 rounded-md my-4 overflow-x-auto", children: _jsx("code", { children: block.content?.code }) }));
            case 'image':
                return (_jsxs("div", { className: "my-6", children: [_jsx("img", { src: block.content?.url, alt: block.content?.alt || '', className: "max-w-full h-auto rounded-md" }), block.content?.caption && (_jsx("p", { className: "text-sm text-gray-500 text-center mt-2", children: block.content.caption }))] }));
            default:
                return null;
        }
    };
    // Render the folder tree
    const renderFolderTree = (folders, level = 0) => {
        return folders.map(folder => (_jsxs("div", { className: "pl-2", children: [_jsxs("div", { className: "flex items-center py-1 px-2 rounded hover:bg-accent cursor-pointer", children: [_jsx(ChevronRight, { size: 16, className: "mr-1 text-muted-foreground" }), _jsx(FolderIcon, { size: 14, className: "mr-2 text-blue-500" }), _jsx("span", { className: "text-sm", children: folder.name })] }), folder.children && folder.children.length > 0 && (_jsx("div", { className: "pl-4 border-l border-border ml-1", children: renderFolderTree(folder.children, level + 1) })), _jsx("div", { className: "pl-6", children: pages
                        .filter(page => page.folder_id === folder.id)
                        .map(page => (_jsxs(Link, { to: `/wiki/${folder.slug}/${page.slug}`, className: `flex items-center py-1 px-2 rounded text-sm ${pageSlug === page.slug ? 'bg-accent font-medium' : 'text-muted-foreground hover:bg-accent'}`, children: [_jsx(FileIcon, { size: 12, className: "mr-2 text-gray-500" }), _jsx("span", { className: "truncate", children: page.title })] }, page.id))) })] }, folder.id)));
    };
    // Search functionality with debounce
    useEffect(() => {
        const search = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                await handleSearch(searchQuery);
            }
            catch (error) {
                console.error('Search error:', error);
                toast.error('Failed to perform search');
            }
            finally {
                setIsSearching(false);
            }
        };
        if (searchTimeoutRef.current !== null) {
            window.clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }
        const timer = window.setTimeout(search, 500);
        searchTimeoutRef.current = timer;
        return () => {
            if (searchTimeoutRef.current !== null) {
                window.clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = null;
            }
        };
    }, [searchQuery]);
    // Clear search when navigating
    useEffect(() => {
        setSearchQuery('');
        setSearchResults([]);
    }, [folderSlug, pageSlug]);
    if (!page) {
        return _jsx("div", { children: "Loading..." });
    }
    return (_jsxs("div", { className: "flex h-screen bg-background", children: [leftSidebarOpen && (_jsxs("div", { className: "w-64 bg-card border-r border-border flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-border", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h2", { className: "font-semibold flex items-center", children: [_jsx(BookOpen, { size: 16, className: "mr-2" }), "Wiki"] }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", onClick: () => setLeftSidebarOpen(false), children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 16, className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { type: "search", placeholder: "Search wiki...", className: "w-full pl-8 h-8 text-sm", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-2", children: loading ? (_jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Loading..." })) : (renderFolderTree(buildFolderTree(folders))) }), searchQuery && (_jsxs("div", { className: "mt-2 border-t border-border pt-2", children: [_jsx("div", { className: "text-xs font-medium text-muted-foreground mb-2 px-2", children: isSearching ? 'Searching...' : `Found ${searchResults.length} results` }), !isSearching && searchResults.length === 0 ? (_jsxs("div", { className: "text-xs text-muted-foreground px-2 py-1", children: ["No results found for \"", searchQuery, "\""] })) : (_jsx("div", { className: "space-y-1 max-h-60 overflow-y-auto", children: searchResults.map((result) => (_jsx(Link, { to: result.resultType === 'page'
                                        ? `/wiki/${result.folder_id ? `${result.folder_id}/` : ''}${result.slug}`
                                        : `/wiki/folder/${result.id}`, className: "flex items-center px-2 py-1.5 text-sm rounded hover:bg-accent", onClick: () => setSearchQuery(''), children: isWikiPage(result) ? (_jsxs("div", { className: "flex items-center", children: [_jsx(FileIcon, { className: "h-4 w-4 mr-2 text-gray-500" }), _jsx("span", { children: result.title })] })) : isFolder(result) ? (_jsxs("div", { className: "flex items-center", children: [_jsx(FolderIcon, { className: "h-4 w-4 mr-2 text-yellow-500" }), _jsx("span", { children: result.name })] })) : null }, `${result.resultType}-${result.id}`))) }))] }))] })), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "h-14 border-b border-border flex items-center px-4", children: [!leftSidebarOpen && (_jsx(Button, { variant: "ghost", size: "icon", className: "mr-2", onClick: () => setLeftSidebarOpen(true), children: _jsx(MenuIcon, { size: 18 }) })), _jsx("div", { className: "flex-1", children: _jsx("h1", { className: "font-semibold", children: currentPage?.title || 'Welcome to the Wiki' }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setRightSidebarOpen(!rightSidebarOpen), children: _jsx(MenuIcon, { size: 18 }) })] }), _jsx("main", { ref: contentRef, className: "flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full", children: currentPage ? (_jsxs("article", { className: "prose max-w-none", children: [currentPage.sections?.map((block) => (_jsx("div", { children: renderContentBlock(block) }, block.id))), _jsxs("div", { className: "mt-12 pt-6 border-t border-border text-sm text-muted-foreground", children: ["Last updated: ", new Date(currentPage.updated_at).toLocaleDateString()] })] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center text-muted-foreground", children: [_jsx(BookOpen, { size: 48, className: "mb-4 text-muted-foreground/50" }), _jsx("h2", { className: "text-xl font-medium mb-2", children: "Welcome to the Wiki" }), _jsx("p", { className: "max-w-md", children: "Select a page from the sidebar or create a new one to get started." })] })) })] }), rightSidebarOpen && (_jsxs("div", { className: "w-64 border-l border-border bg-card overflow-y-auto", children: [_jsx("div", { className: "p-4 border-b border-border", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-medium", children: "Table of Contents" }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", onClick: () => setRightSidebarOpen(false), children: _jsx(X, { size: 16 }) })] }) }), _jsx("div", { className: "p-4", children: toc.length > 0 ? (_jsx("nav", { className: "space-y-1", children: toc.map((item, index) => (_jsx("a", { href: `#${item.id}`, className: `block py-1 text-sm ${item.level === 1 ? 'font-medium' : 'text-muted-foreground'} hover:text-foreground`, style: { marginLeft: `${(item.level - 1) * 8}px` }, children: item.text }, index))) })) : (_jsx("p", { className: "text-sm text-muted-foreground", children: "No headings found" })) })] })), _jsxs("div", { className: "prose dark:prose-invert max-w-none", children: [_jsx("h1", { children: page.title }), page.sections?.length ? (_jsx("div", { className: "space-y-6", children: page.sections
                            ?.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
                            .map((section) => (_jsxs("div", { className: "section", children: [section.title && (_jsx("h2", { className: "text-2xl font-semibold mb-2", children: section.title })), _jsx("div", { className: "prose dark:prose-invert max-w-none", dangerouslySetInnerHTML: { __html: section.content || '' } })] }, section.id))) })) : (_jsx("div", { className: "prose dark:prose-invert max-w-none", dangerouslySetInnerHTML: { __html: page.excerpt || '' } }))] })] }));
}
export default WikiViewer;
