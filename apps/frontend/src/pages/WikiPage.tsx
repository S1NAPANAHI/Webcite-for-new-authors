import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFolders, fetchPages, fetchWikiPage, WikiPage as WikiPageData, Folder, WikiSectionView as WikiSection } from '@zoroaster/shared';
from '@zoroaster/ui'
import { toast } from 'sonner';

const WikiPage: React.FC = () => {
    const [leftSidebarExpanded, setLeftSidebarExpanded] = useState(true);
    const [rightSidebarExpanded, setRightSidebarExpanded] = useState(true);
    const [currentPageSlug, setCurrentPageSlug] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [pages, setPages] = useState<WikiPageData[]>([]);
    const [currentPage, setCurrentPage] = useState<WikiPageData | null>(null);
    const wikiLayoutRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { slug } = useParams<{ slug?: string }>();

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
                } else if (pagesData.length > 0) {
                    const page = await fetchWikiPage(pagesData[0].slug);
                    setCurrentPage(page);
                    setCurrentPageSlug(pagesData[0].slug);
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

    const buildNavTree = (): any[] => {
        const folderMap = new Map<string, any>();
        const rootItems: any[] = [];

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
            } else {
                rootItems.push(navItem);
            }
        });

        folderMap.forEach(folder => {
            if (folder.parent_id && folderMap.has(folder.parent_id)) {
                const parent = folderMap.get(folder.parent_id);
                if (parent) {
                    parent.children.push(folder);
                }
            } else {
                rootItems.push(folder);
            }
        });

        return rootItems;
    };

    const navItems = buildNavTree();

    const handleNavLinkClick = (slug: string) => {
        navigate(`/wiki/${slug}`);
    };

    const renderSection = (section: WikiSection) => {
        const contentHtml = section.content;
        if (contentHtml) {
            return <div dangerouslySetInnerHTML={{ __html: contentHtml }} />;
        }
        return null;
    };

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
                                    {navItems.map(item => (
                                        <WikiNavItem
                                            key={item.id}
                                            item={item}
                                            onClick={handleNavLinkClick}
                                            isActive={currentPageSlug === item.slug}
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
                            {currentPage.sections?.map((section, index) => (
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
                {rightSidebarExpanded && currentPage?.sections?.length > 0 && (
                    <div className="wiki-right-sidebar">
                        <div className="wiki-right-sidebar-content">
                            <div className="wiki-sidebar-nav">
                                <h3>On This Page</h3>
                                <ul>
                                    {currentPage.sections
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
