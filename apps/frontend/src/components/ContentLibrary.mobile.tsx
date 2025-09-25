import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  BookOpen, 
  Clock, 
  User,
  ChevronRight,
  Heart,
  Eye
} from 'lucide-react';
import { cn } from '@zoroaster/shared/utils';

interface ContentItem {
  id: string;
  title: string;
  author: string;
  cover_image?: string;
  type: 'story' | 'book' | 'series';
  chapters: number;
  rating: number;
  views: number;
  likes: number;
  updated_at: string;
  description?: string;
  tags: string[];
  status: 'ongoing' | 'completed' | 'hiatus';
}

interface MobileContentLibraryProps {
  items?: ContentItem[];
  isLoading?: boolean;
  error?: string;
}

const MobileContentLibrary: React.FC<MobileContentLibraryProps> = ({ 
  items = [], 
  isLoading = false, 
  error 
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    const resizeListener = () => checkIsMobile();
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    { value: 'all', label: 'All', count: items.length },
    { value: 'story', label: 'Stories', count: items.filter(i => i.type === 'story').length },
    { value: 'book', label: 'Books', count: items.filter(i => i.type === 'book').length },
    { value: 'series', label: 'Series', count: items.filter(i => i.type === 'series').length },
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'hiatus', label: 'On Hiatus' },
  ];

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const GridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
      {filteredItems.map((item) => (
        <Link
          key={item.id}
          to={`/library/${item.type}/${item.id}`}
          className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 touch-manipulation"
        >
          {/* Cover Image */}
          <div className="aspect-[3/4] bg-muted relative overflow-hidden">
            {item.cover_image ? (
              <img 
                src={item.cover_image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <BookOpen className="w-12 h-12 text-primary/40" />
              </div>
            )}
            
            {/* Status badge */}
            <div className="absolute top-2 right-2">
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm",
                item.status === 'ongoing' && "bg-green-500/80 text-white",
                item.status === 'completed' && "bg-blue-500/80 text-white",
                item.status === 'hiatus' && "bg-yellow-500/80 text-black"
              )}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-3 sm:p-4">
            <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-2 line-clamp-1 flex items-center">
              <User className="w-3 h-3 mr-1" />
              {item.author}
            </p>
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <div className="flex items-center space-x-2">
                <span className="flex items-center">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {item.chapters}
                </span>
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                  {item.rating.toFixed(1)}
                </span>
              </div>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatLastUpdated(item.updated_at)}
              </span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {item.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {item.views.toLocaleString()}
              </span>
              <span className="flex items-center">
                <Heart className="w-3 h-3 mr-1" />
                {item.likes.toLocaleString()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-3 sm:space-y-4">
      {filteredItems.map((item) => (
        <Link
          key={item.id}
          to={`/library/${item.type}/${item.id}`}
          className="group bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all duration-300 touch-manipulation block"
        >
          <div className="flex space-x-4">
            {/* Cover Image */}
            <div className="w-16 h-20 sm:w-20 sm:h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              {item.cover_image ? (
                <img 
                  src={item.cover_image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <BookOpen className="w-6 h-6 text-primary/40" />
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {item.author}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
              </div>
              
              {/* Description */}
              {item.description && (
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
              
              {/* Metadata Row */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {item.chapters} ch
                  </span>
                  <span className="flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                    {item.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {item.views > 1000 ? `${Math.floor(item.views/1000)}k` : item.views}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    item.status === 'ongoing' && "bg-green-500/20 text-green-600 dark:text-green-400",
                    item.status === 'completed' && "bg-blue-500/20 text-blue-600 dark:text-blue-400",
                    item.status === 'hiatus' && "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                  )}>
                    {item.status}
                  </span>
                  <span className="text-xs">
                    {formatLastUpdated(item.updated_at)}
                  </span>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
        <BookOpen className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">No stories found</h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery ? 'Try adjusting your search terms' : 'No content available in this category'}
      </p>
      {searchQuery && (
        <button 
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setSelectedStatus('all');
          }}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors touch-manipulation min-h-[44px]"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">Error Loading Library</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* MOBILE-OPTIMIZED HEADER */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/40">
        <div className="px-4 py-3 mobile-safe-area">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Library</h1>
            
            {/* View Toggle & Filters */}
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-md transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center",
                    viewMode === 'grid' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-md transition-colors touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center",
                    viewMode === 'list' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "p-2 rounded-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center",
                  showFilters ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
                aria-label="Toggle filters"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* MOBILE-OPTIMIZED SEARCH BAR */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search stories, authors, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:bg-background transition-colors touch-manipulation text-base"
            />
          </div>
          
          {/* MOBILE-FRIENDLY FILTERS */}
          {showFilters && (
            <div className="space-y-3 pt-3 border-t border-border/40">
              {/* Category Filters */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Category</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={cn(
                        "px-3 py-2 text-sm rounded-full whitespace-nowrap touch-manipulation min-h-[36px] flex items-center space-x-1 transition-colors",
                        selectedCategory === cat.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <span>{cat.label}</span>
                      <span className="text-xs opacity-70">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Status Filters */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Status</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {statuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setSelectedStatus(status.value)}
                      className={cn(
                        "px-3 py-2 text-sm rounded-full whitespace-nowrap touch-manipulation min-h-[36px] transition-colors",
                        selectedStatus === status.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT AREA WITH LOADING STATES */}
      <div className="px-4 py-6">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-16 h-20 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState />
        ) : (
          // Content based on view mode
          <>
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} {filteredItems.length === 1 ? 'story' : 'stories'}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
              
              {/* Mobile sort dropdown */}
              {isMobile && (
                <select className="text-sm bg-muted border border-border rounded-md px-3 py-1.5 text-foreground touch-manipulation">
                  <option value="updated">Recently Updated</option>
                  <option value="rating">Highest Rated</option>
                  <option value="views">Most Popular</option>
                  <option value="chapters">Most Chapters</option>
                </select>
              )}
            </div>
            
            {viewMode === 'grid' ? <GridView /> : <ListView />}
          </>
        )}
      </div>
    </div>
  );
};

export default MobileContentLibrary;