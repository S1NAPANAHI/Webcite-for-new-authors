import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { WikiNavItem } from '@zoroaster/ui';
import { toast } from 'sonner';

// Define types for Wiki content
interface WikiSection {
    id: string;
    title: string;
    content: any;
    type: 'text' | 'infobox' | 'gallery' | 'timeline' | 'quote' | 'category-list';
}

interface WikiNavItem {
    id: string;
    name: string;
    slug: string;
    type: 'page' | 'folder';
    parent_id: string | null;
    children?: WikiNavItem[];
}

interface WikiPageData {
    id: string;
    title: string;
    slug: string;
    content: WikiSection[];
    updated_at: string;
}

interface CategoryListItem {
    title: string;
    slug: string;
}

interface TocItem {
    id: string;
    title: string;
    level: number;
    children?: TocItem[];
}

const WikiPage: React.FC = () => {
    const [leftSidebarExpanded, setLeftSidebarExpanded] = useState(true);
    const [rightSidebarExpanded, setRightSidebarExpanded] = useState(true);
    const [currentPageSlug, setCurrentPageSlug] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [folders, setFolders] = useState<WikiNavItem[]>([]);
    const [pages, setPages] = useState<WikiPageData[]>([]);
    const [currentPage, setCurrentPage] = useState<WikiPageData | null>(null);
    const wikiLayoutRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { slug } = useParams<{ slug?: string }>();

    // Fetch all folders and pages
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch all folders
                const { data: foldersData, error: foldersError } = await supabase
                    .from('wiki_folders')
                    .select('*')
                    .order('name');
                
                if (foldersError) throw foldersError;
                
                // Fetch all pages with required fields
                const { data: pagesData, error: pagesError } = await supabase
                    .from('wiki_pages')
                    .select('*')
                    .order('title');
                
                if (pagesError) throw pagesError;

                setFolders(foldersData || []);
                setPages(pagesData || []);
                
                // Set current page from URL or default to first page
                if (slug) {
                    setCurrentPageSlug(slug);
                    const page = pagesData?.find(p => p.slug === slug);
                    if (page) {
                        setCurrentPage({
                            ...page,
                            content: Array.isArray(page.content) ? page.content : []
                        });
                    }
                } else if (pagesData?.length > 0) {
                    setCurrentPageSlug(pagesData[0].slug);
                    setCurrentPage({
                        ...pagesData[0],
                        content: Array.isArray(pagesData[0].content) ? pagesData[0].content : []
                    });
                }
                
            } catch (error) {
                console.error('Error fetching wiki data:', error);
                toast.error('Failed to load wiki content');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [slug]);

    // Build navigation tree
    const buildNavTree = (): WikiNavItem[] => {
        const folderMap = new Map<string, WikiNavItem>();
        const rootFolders: WikiNavItem[] = [];
        
        // First pass: create map of all folders
        folders.forEach(folder => {
            const navItem: WikiNavItem = {
                ...folder,
                name: folder.name,
                type: 'folder',
                children: []
            };
            folderMap.set(folder.id, navItem);
        });
        
        // Second pass: build tree structure
        folderMap.forEach(folder => {
            if (folder.parent_id && folderMap.has(folder.parent_id)) {
                const parent = folderMap.get(folder.parent_id);
                if (parent) {
                    parent.children = [...(parent.children || []), folder];
                }
            } else {
                rootFolders.push(folder);
            }
        });
        
        // Add pages to their folders
        pages.forEach(page => {
            const pageNavItem: WikiNavItem = {
                id: page.id,
                name: page.title,
                slug: page.slug,
                type: 'page',
                parent_id: page.folder_id
            };
            
            if (page.folder_id && folderMap.has(page.folder_id)) {
                const folder = folderMap.get(page.folder_id);
                if (folder) {
                    folder.children = [...(folder.children || []), pageNavItem];
                }
            } else {
                rootFolders.push(pageNavItem);
            }
        });
        
        return rootFolders;
    };

    const navItems = buildNavTree();

    // Filter navigation data based on search term
    const filteredNavItems = navItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        if (item.children) {
            const childrenMatch = item.children.some(child => 
                child.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return matchesSearch || childrenMatch;
        }
        return matchesSearch;
    });

    // Handle navigation
    const handleNavLinkClick = (slug: string) => {
        setCurrentPageSlug(slug);
        const page = pages.find(p => p.slug === slug);
        if (page) {
            setCurrentPage({
                ...page,
                content: Array.isArray(page.content) ? page.content : []
            });
            navigate(`/wiki/${slug}`);
        }
        
        // Close left sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            setLeftSidebarExpanded(false);
        }
    };

    // Update the renderSection function to handle different content types
    const renderSection = (section: WikiSection | null) => {
        if (!section) return null;
        
        // Ensure content is properly parsed if it's a string
        let content = section.content;
        if (typeof content === 'string') {
            try {
                content = JSON.parse(content);
            } catch (e) {
                console.error('Error parsing section content:', e);
                content = '';
            }
        }
        
        switch (section.type) {
            case 'text':
                return (
                    <div key={section.id} id={section.id} className="wiki-section">
                        {section.title && <h2 className="wiki-section-title">{section.title}</h2>}
                        <div 
                            className="wiki-text-content"
                            dangerouslySetInnerHTML={{ 
                                __html: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
                            }} 
                        />
                    </div>
                );
            case 'infobox':
                const infoboxData = content;
                return (
                    <div key={section.id} id={section.id} className="wiki-infobox">
                        <div className="wiki-infobox-title">{section.title || 'Information'}</div>
                        <div className="wiki-infobox-content">
                            {typeof infoboxData === 'object' && infoboxData !== null ? (
                                Object.entries(infoboxData).map(([key, value]) => (
                                    <div key={key} className="wiki-infobox-row">
                                        <span className="wiki-infobox-label">{key}:</span> {String(value)}
                                    </div>
                                ))
                            ) : (
                                <div className="wiki-infobox-row">
                                    <span className="wiki-infobox-label">Content:</span> {String(infoboxData)}
                                </div>
                            )}
                        </div>
                    </div>
                );
            // Add other section types as needed
            default:
                return (
                    <div key={section.id} className="wiki-section">
                        {section.title && <h3>{section.title}</h3>}
                        <div className="wiki-raw-content">
                            {JSON.stringify(content, null, 2)}
                        </div>
                    </div>
                );
        }
    };

    // Update the JSX to use the fetched data
    return (
        <div className="wiki-page-container">
            <div className="wiki-layout" ref={wikiLayoutRef}>
                {/* Left Sidebar - Navigation */}
                <div className={`wiki-left-sidebar ${leftSidebarExpanded ? '' : 'collapsed'}`}>
                    <div className="wiki-left-sidebar-content">
                        <div className="wiki-sidebar-nav">
                            <h3>Wiki Navigation</h3>
                            <input 
                                type="text" 
                                placeholder="Search wiki..." 
                                className="wiki-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                <ul>
                                    {filteredNavItems.map(item => (
                                        <WikiNavItem 
                                            key={item.id} 
                                            item={item} 
                                            onNavLinkClick={handleNavLinkClick} 
                                            currentSlug={currentPageSlug}
                                        />
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="wiki-main-content">
                    {loading ? (
                        <div>Loading page content...</div>
                    ) : currentPage ? (
                        <>
                            <h1 className="wiki-page-title">{currentPage.title}</h1>
                            {currentPage.content?.map((section, index) => (
                                <div key={section?.id || index}>
                                    {renderSection(section)}
                                </div>
                            ))}
                        </>
                    ) : (
                        <div>No page selected or page not found.</div>
                    )}
                </div>
                
                {/* Right Sidebar - Table of Contents */}
                {rightSidebarExpanded && currentPage?.content?.length > 0 && (
                    <div className="wiki-right-sidebar">
                        <div className="wiki-right-sidebar-content">
                            <div className="wiki-sidebar-nav">
                                <h3>On This Page</h3>
                                <ul>
                                    {currentPage.content
                                        .filter(section => section?.type === 'heading_1' || section?.type === 'heading_2')
                                        .map((section, index) => (
                                            <li key={section?.id || index}>
                                                <a 
                                                    href={`#${section?.id || ''}`}
                                                    className={section?.type === 'heading_1' ? 'toc-h1' : 'toc-h2'}
                                                >
                                                    {section?.title || 'Untitled Section'}
                                                </a>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WikiPage;
