import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@zoroaster/ui';
import { Input } from '@zoroaster/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@zoroaster/ui';
import { Menu, Search, X, ChevronRight, ChevronDown, BookOpen, Folder as FolderIcon, File } from 'lucide-react';
import { supabase } from '@zoroaster/shared';
import { toast } from 'sonner';
import { WikiPage, Folder, WikiSectionView } from '@zoroaster/shared'; // Import types from shared

type ContentBlock = {
  id: string;
  type: string;
  content: any;
};

// Define a discriminated union type for search results
type SearchResultItem = 
  | (WikiPage & { type: 'page' })
  | (Folder & { type: 'folder' });

// Helper type guard functions
const isWikiPage = (item: WikiPage | Folder): item is WikiPage => {
  return 'title' in item;
};

const isFolder = (item: WikiPage | Folder): item is Folder => {
  return 'name' in item && 'children' in item;
};

export function WikiViewer() {
  const { folderSlug, pageSlug } = useParams();
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pages, setPages] = useState<WikiPage[]>([]); 
  const [currentPage, setCurrentPage] = useState<WikiPage | null>(null); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]); 
  const [isSearching, setIsSearching] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const [toc, setToc] = useState<Array<{id: string, text: string, level: number}>>([]);

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
        
        // Fetch all pages
        const { data: pagesData, error: pagesError } = await supabase
          .from('wiki_pages')
          .select('*, sections:wiki_content_blocks(*)') 
          .order('title');
        
        if (pagesError) throw pagesError;
        
        setFolders(foldersData || []);
        setPages(pagesData as WikiPage[] || []); 
        
        // If we have a page slug, load that page
        if (pageSlug) {
          const page = (pagesData as WikiPage[])?.find(p => p.slug === pageSlug); 
          if (page) {
            setCurrentPage(page);
            generateToc(page.sections); 
          }
        }
        
      } catch (error) {
        console.error('Error fetching wiki data:', error);
        toast.error('Failed to load wiki content');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [pageSlug]);

  // Build folder tree structure
  const buildFolderTree = (folders: Folder[]): Folder[] => {
    const folderMap = new Map<string, Folder>();
    const rootFolders: Folder[] = [];
    
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
      } else {
        rootFolders.push(folder);
      }
    });
    
    return rootFolders;
  };

  // Generate table of contents from page content
  const generateToc = (sections?: WikiSectionView[]) => { 
    if (!sections) return [];
    
    const headers = sections
      .filter(block => block.type.startsWith('heading_'))
      .map(block => ({
        id: `heading-${block.id}`,
        text: (block.content as any)?.text || '', 
        level: parseInt(block.type.split('_')[1])
      }));
    
    setToc(headers);
  };

  // Render content blocks
  const renderContentBlock = (block: WikiSectionView) => { 
    switch (block.type) {
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
        const level = parseInt(block.type.split('_')[1]);
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        return <Tag id={`heading-${block.id}`} className="mt-6 mb-4 font-semibold">{(block.content as any)?.text}</Tag>; 
      
      case 'paragraph':
        return <p className="mb-4 leading-relaxed">{(block.content as any)?.text}</p>; 
        
      case 'bullet_list':
        return (
          <ul className="list-disc pl-6 mb-4 space-y-1">
            {(block.content as any)?.items?.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        
      case 'ordered_list':
        return (
          <ol className="list-decimal pl-6 mb-4 space-y-1">
            {(block.content as any)?.items?.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        );
        
      case 'quote':
        return (
          <blockquote className="border-l-4 border-gray-300 pl-4 py-1 my-4 text-gray-600 italic">
            {(block.content as any)?.text} 
          </blockquote>
        );
        
      case 'code':
        return (
          <pre className="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto">
            <code>{(block.content as any)?.code}</code> 
          </pre>
        );
        
      case 'image':
        return (
          <div className="my-6">
            <img 
              src={(block.content as any)?.url} 
              alt={(block.content as any)?.alt || ''} 
              className="max-w-full h-auto rounded-md"
            />
            {(block.content as any)?.caption && ( 
              <p className="text-sm text-gray-500 text-center mt-2">{(block.content as any).caption}</p> 
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  // Render the folder tree
  const renderFolderTree = (folders: Folder[], level = 0) => {
    return folders.map(folder => (
      <div key={folder.id} className="pl-2">
        <div className="flex items-center py-1 px-2 rounded hover:bg-accent cursor-pointer">
          <ChevronRight size={16} className="mr-1 text-muted-foreground" />
          <Folder size={14} className="mr-2 text-blue-500" />
          <span className="text-sm">{folder.name}</span>
        </div>
        
        {folder.children && folder.children.length > 0 && (
          <div className="pl-4 border-l border-border ml-1">
            {renderFolderTree(folder.children, level + 1)}
          </div>
        )}
        
        {/* Show pages in this folder */}
        <div className="pl-6">
          {pages
            .filter(page => page.folder_id === folder.id)
            .map(page => (
              <Link 
                key={page.id} 
                to={`/wiki/${folder.slug}/${page.slug}`}
                className={`flex items-center py-1 px-2 rounded text-sm ${pageSlug === page.slug ? 'bg-accent font-medium' : 'text-muted-foreground hover:bg-accent'}`}
              >
                <File size={12} className="mr-2 text-gray-500" />
                <span className="truncate">{page.title}</span>
              </Link>
            ))}
        </div>
      </div>
    ));
  };

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const query = searchQuery.trim().toLowerCase();
        
        // Search in wiki_pages (title and excerpt)
        const { data: pagesData, error: pagesError } = await supabase
          .from('wiki_pages')
          .select('id, title, slug, folder_id') 
          .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`); 
        
        if (pagesError) throw pagesError;

        // Search in wiki_content_blocks (content)
        const { data: contentBlocksData, error: contentBlocksError } = await supabase
          .from('wiki_content_blocks')
          .select('page_id, content')
          .ilike('content->>text', `%${query}%`); 
        
        if (contentBlocksError) throw contentBlocksError;

        // Get unique page_ids from content block search
        const pageIdsFromContent = new Set(contentBlocksData?.map(cb => cb.page_id));

        // Filter pagesData to include pages found in content blocks
        const pagesFromContent = pages.filter(p => pageIdsFromContent.has(p.id));

        // Combine pages found by title/excerpt and pages found by content, deduplicate
        const combinedPages = [...(pagesData || []), ...pagesFromContent].filter((page, index, self) =>
          index === self.findIndex((p) => p.id === page.id)
        );

        // Search in folders
        const { data: foldersData, error: foldersError } = await supabase
          .from('wiki_folders')
          .select('*')
          .ilike('name', `%${query}%`);
        
        if (foldersError) throw foldersError;
        
        // Combine and deduplicate results
        const results = [
          ...(combinedPages || []).map(p => ({ ...p, type: 'page' as const }) as SearchResultItem),
          ...(foldersData || []).map(f => ({ ...f, type: 'folder' as const }) as SearchResultItem)
        ];
        
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Failed to perform search');
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, pages]); 

  // Clear search when navigating
  useEffect(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, [folderSlug, pageSlug]);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Navigation */}
      {leftSidebarOpen && (
        <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center">
              <BookOpen size={16} className="mr-2" />
              Wiki
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setLeftSidebarOpen(false)}
            >
              <X size={16} />
            </Button>
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search wiki..."
              className="w-full pl-8 h-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            renderFolderTree(buildFolderTree(folders as Folder[]))
          )}
        </div>
        
        {/* Search results */}
        {searchQuery && (
          <div className="mt-2 border-t border-border pt-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
              {isSearching ? 'Searching...' : `Found ${searchResults.length} results`}
            </div>
            
            {!isSearching && searchResults.length === 0 ? (
              <div className="text-xs text-muted-foreground px-2 py-1">
                No results found for "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    to={result.type === 'page' 
                      ? `/wiki/${result.folder_id ? `${result.folder_id}/` : ''}${result.slug}`
                      : `/wiki/folder/${result.id}`}
                    className="flex items-center px-2 py-1.5 text-sm rounded hover:bg-accent"
                    onClick={() => setSearchQuery('')}
                  >
                    {result.type === 'page' ? (
                      <File size={12} className="mr-2 text-blue-500 flex-shrink-0" />
                    ) : (
                      <FolderIcon size={12} className="mr-2 text-yellow-500 flex-shrink-0" />
                    )}
                    <span className="truncate">
                      {result.type === 'page' ? result.title : result.name}
                    </span>
                    {result.type === 'page' && result.folder_id && (
                      <span className="ml-2 text-xs text-muted-foreground truncate">
                        in {folders.find(f => f.id === result.folder_id)?.name || 'unknown'}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center px-4">
          {!leftSidebarOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => setLeftSidebarOpen(true)}
            >
              <Menu size={18} />
            </Button>
          )}
          
          <div className="flex-1">
            <h1 className="font-semibold">
              {currentPage?.title || 'Welcome to the Wiki'}
            </h1>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          >
            <Menu size={18} />
          </Button>
        </header>
        
        {/* Page Content */}
        <main 
          ref={contentRef}
          className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full"
        >
          {currentPage ? (
            <article className="prose max-w-none">
              {currentPage.sections?.map((block: WikiSectionView) => (
                <div key={block.id}>
                  {renderContentBlock(block)}
                </div>
              ))}
              
              <div className="mt-12 pt-6 border-t border-border text-sm text-muted-foreground">
                Last updated: {new Date(currentPage.updated_at).toLocaleDateString()}
              </div>
            </article>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <BookOpen size={48} className="mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-medium mb-2">Welcome to the Wiki</h2>
              <p className="max-w-md">Select a page from the sidebar or create a new one to get started.</p>
            </div>
          )}
        </main>
      </div>
      
      {/* Right Sidebar - Table of Contents */}
      {rightSidebarOpen && (
        <div className="w-64 border-l border-border bg-card overflow-y-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Table of Contents</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => setRightSidebarOpen(false)}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            {toc.length > 0 ? (
              <nav className="space-y-1">
                {toc.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.id}`}
                    className={`block py-1 text-sm ${item.level === 1 ? 'font-medium' : 'text-muted-foreground'} hover:text-foreground`}
                    style={{ marginLeft: `${(item.level - 1) * 8}px` }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            ) : (
              <p className="text-sm text-muted-foreground">No headings found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
