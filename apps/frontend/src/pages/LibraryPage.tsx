import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Star,
  BookOpen,
  Plus,
  Check,
  Eye,
  Calendar,
  User,
  Bookmark,
  ArrowRight,
  Grid,
  List,
  SortAsc,
  SortDesc,
  FileText,
  BarChart3,
  AlertCircle,
  Loader,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth, supabase } from '@zoroaster/shared';
import {
  ContentItem,
  ContentItemWithChildren,
  ContentItemType,
  HIERARCHY_LEVELS,
  STATUS_COLORS,
  LibraryCardData
} from '../types/content';
import { useFileUrl } from '../utils/fileUrls';

interface LibraryCardProps {
  data: LibraryCardData;
  onAddToLibrary: (itemId: string) => void;
  onRemoveFromLibrary: (itemId: string) => void;
  viewType: 'grid' | 'list';
}

function LibraryCard({ data, onAddToLibrary, onRemoveFromLibrary, viewType }: LibraryCardProps) {
  const { item, overallProgress, inUserLibrary } = data;
  const [isHovered, setIsHovered] = useState(false);
  
  // FIXED: Use the file URL utility to resolve cover images
  const coverUrlFromFile = useFileUrl(item.cover_file_id);
  const coverUrl = coverUrlFromFile || item.cover_image_url || null;
  
  console.log('🎨 LIBRARY CARD COVER DEBUG:', {
    id: item.id,
    title: item.title,
    cover_file_id: item.cover_file_id,
    cover_image_url: item.cover_image_url,
    resolved_from_file: coverUrlFromFile,
    final_cover_url: coverUrl
  });
  
  const getTypeColor = (type: ContentItemType) => {
    const colors = {
      book: 'bg-blue-500',
      volume: 'bg-green-500',
      saga: 'bg-purple-500',
      arc: 'bg-orange-500',
      issue: 'bg-red-500'
    };
    return colors[type];
  };
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-muted-foreground'
        }`}
      />
    ));
  };
  
  if (viewType === 'list') {
    return (
      <div className="bg-card text-card-foreground rounded-lg border border-border p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center space-x-6">
          {/* Cover Image */}
          <div className="w-16 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
            {coverUrl ? (
              <img 
                src={coverUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onLoad={() => console.log('✅ List view cover loaded:', coverUrl)}
                onError={(e) => {
                  console.error('❌ List view cover failed to load:', coverUrl);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const container = target.parentElement;
                  if (container) {
                    container.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>';
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground truncate">{item.title}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    getTypeColor(item.type)
                  } text-white`}>
                    {HIERARCHY_LEVELS[item.type].label}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{item.description || 'No description'}</p>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    {renderStars(item.average_rating)}
                    <span className="ml-1">{item.average_rating.toFixed(1)} ({item.rating_count})</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="w-4 h-4 text-green-500" />
                    <span>{item.completion_percentage}% complete</span>
                  </div>
                  
                  {item.total_chapters && (
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{item.total_chapters} chapters</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Link
                  to={`/library/${item.type}/${item.slug}`}
                  className="px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-lg transition-colors duration-200"
                >
                  View Details
                </Link>
                
                <button
                  onClick={() => inUserLibrary ? onRemoveFromLibrary(item.id) : onAddToLibrary(item.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
                    inUserLibrary
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {inUserLibrary ? (
                    <><Check className="w-4 h-4 inline mr-1" />In Library</>
                  ) : (
                    <><Plus className="w-4 h-4 inline mr-1" />Add to Library</>
                  )}
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            {overallProgress > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Your Progress</span>
                  <span className="text-foreground font-medium">{overallProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Grid view
  return (
    <div 
      className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-200 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {coverUrl ? (
          <img 
            src={coverUrl} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            onLoad={() => console.log('✅ Grid view cover loaded:', coverUrl)}
            onError={(e) => {
              console.error('❌ Grid view cover failed to load:', coverUrl);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const container = target.parentElement;
              if (container) {
                container.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-12 h-12 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>';
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            getTypeColor(item.type)
          } text-white shadow-sm`}>
            {HIERARCHY_LEVELS[item.type].label}
          </span>
        </div>
        
        {/* Completion Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-xs font-medium text-foreground">{item.completion_percentage}%</span>
          </div>
        </div>
        
        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-3 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Link
            to={`/library/${item.type}/${item.slug}`}
            className="px-4 py-2 bg-background text-foreground rounded-lg hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Link>
          
          {overallProgress > 0 && (
            <Link
              to={`/read/${item.slug}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Continue</span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1 mb-1">
            {item.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {item.description || 'No description available'}
          </p>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          {renderStars(item.average_rating)}
          <span className="text-sm text-muted-foreground ml-2">
            {item.average_rating.toFixed(1)} ({item.rating_count} reviews)
          </span>
        </div>
        
        {/* Progress Bar (if user has started reading) */}
        {overallProgress > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Your Progress</span>
              <span className="text-foreground font-medium">{overallProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-3">
            {item.total_chapters && (
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{item.total_chapters} chapters</span>
              </div>
            )}
            
            {item.estimated_read_time && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{item.estimated_read_time} min read</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Button */}
        <button
          onClick={() => inUserLibrary ? onRemoveFromLibrary(item.id) : onAddToLibrary(item.id)}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            inUserLibrary
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
          }`}
        >
          {inUserLibrary ? (
            <><Check className="w-4 h-4" />In Your Library</>
          ) : (
            <><Plus className="w-4 h-4" />Add to Library</>
          )}
        </button>
      </div>
    </div>
  );
}

interface FilterSidebarProps {
  selectedType: ContentItemType | 'all';
  onTypeChange: (type: ContentItemType | 'all') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortDirection: 'asc' | 'desc';
  onSortDirectionChange: (direction: 'asc' | 'desc') => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  completionFilter: 'all' | 'completed' | 'in_progress' | 'not_started';
  onCompletionFilterChange: (filter: 'all' | 'completed' | 'in_progress' | 'not_started') => void;
}

function FilterSidebar({ 
  selectedType, 
  onTypeChange, 
  sortBy, 
  onSortChange,
  sortDirection,
  onSortDirectionChange,
  minRating,
  onMinRatingChange,
  completionFilter,
  onCompletionFilterChange
}: FilterSidebarProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border p-6 h-fit transition-colors duration-300">
      <h3 className="text-lg font-semibold text-foreground mb-4">Filters</h3>
      
      {/* Content Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Content Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as any)}
          className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-background text-foreground transition-colors duration-200"
        >
          <option value="all">All Types</option>
          <option value="book">Books</option>
          <option value="volume">Volumes</option>
          <option value="saga">Sagas</option>
          <option value="arc">Arcs</option>
          <option value="issue">Issues</option>
        </select>
      </div>
      
      {/* Minimum Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Minimum Rating
        </label>
        <div className="flex items-center space-x-2">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              onClick={() => onMinRatingChange(i + 1)}
              className={`p-1 rounded transition-colors duration-200 ${
                (i + 1) <= minRating ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'
              }`}
            >
              <Star className={`w-5 h-5 ${(i + 1) <= minRating ? 'fill-current' : ''}`} />
            </button>
          ))}
          <button
            onClick={() => onMinRatingChange(0)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Completion Status */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Completion Status
        </label>
        <select
          value={completionFilter}
          onChange={(e) => onCompletionFilterChange(e.target.value as any)}
          className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-background text-foreground transition-colors duration-200"
        >
          <option value="all">All</option>
          <option value="completed">Completed (100%)</option>
          <option value="in_progress">In Progress</option>
          <option value="not_started">Not Started</option>
        </select>
      </div>
      
      {/* Sort Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2 bg-background text-foreground transition-colors duration-200"
        >
          <option value="created_at">Date Added</option>
          <option value="title">Title</option>
          <option value="average_rating">Rating</option>
          <option value="completion_percentage">Completion</option>
          <option value="updated_at">Last Updated</option>
        </select>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onSortDirectionChange('asc')}
            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors duration-200 flex items-center justify-center space-x-1 ${
              sortDirection === 'asc'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-background border-border text-foreground hover:bg-muted'
            }`}
          >
            <SortAsc className="w-4 h-4" />
            <span>Asc</span>
          </button>
          <button
            onClick={() => onSortDirectionChange('desc')}
            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors duration-200 flex items-center justify-center space-x-1 ${
              sortDirection === 'desc'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-background border-border text-foreground hover:bg-muted'
            }`}
          >
            <SortDesc className="w-4 h-4" />
            <span>Desc</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const { user } = useAuth();
  const [libraryData, setLibraryData] = useState<LibraryCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
  // Filter states
  const [selectedType, setSelectedType] = useState<ContentItemType | 'all'>('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [minRating, setMinRating] = useState(0);
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'in_progress' | 'not_started'>('all');
  
  // Load data on component mount and when filters change
  useEffect(() => {
    loadLibraryData();
  }, [selectedType, sortBy, sortDirection, minRating, completionFilter]);
  
  const loadLibraryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading library data from Supabase...');
      
      // FIXED: Query content_items directly with proper cover_file_id selection
      let query = supabase
        .from('content_items')
        .select(`
          id,
          title,
          slug,
          type,
          description,
          cover_file_id,
          cover_image_url,
          average_rating,
          rating_count,
          completion_percentage,
          status,
          created_at,
          updated_at,
          metadata
        `)
        .eq('status', 'published');
      
      // Apply filters
      if (selectedType !== 'all') {
        query = query.eq('type', selectedType);
      }
      
      if (minRating > 0) {
        query = query.gte('average_rating', minRating);
      }
      
      if (completionFilter !== 'all') {
        switch (completionFilter) {
          case 'completed':
            query = query.eq('completion_percentage', 100);
            break;
          case 'in_progress':
            query = query.gt('completion_percentage', 0).lt('completion_percentage', 100);
            break;
          case 'not_started':
            query = query.eq('completion_percentage', 0);
            break;
        }
      }
      
      // Apply sorting
      query = query.order(sortBy, { ascending: sortDirection === 'asc' });
      
      console.log('📡 Executing Supabase query...');
      const { data: contentItems, error: fetchError } = await query;
      
      if (fetchError) {
        console.error('❌ Supabase error:', fetchError);
        throw fetchError;
      }
      
      console.log('✅ Received content items:', contentItems?.length || 0, 'items');
      console.log('📋 Content items data:', contentItems);
      
      // Debug: Log cover image info for first few items
      if (contentItems && contentItems.length > 0) {
        console.log('🎨 COVER DEBUG - First 3 items:');
        contentItems.slice(0, 3).forEach((item, index) => {
          console.log(`   ${index + 1}. "${item.title}"`);
          console.log(`      cover_file_id: ${item.cover_file_id || 'NONE'}`);
          console.log(`      cover_image_url: ${item.cover_image_url || 'NONE'}`);
        });
      }
      
      if (!contentItems || contentItems.length === 0) {
        console.log('📷 No content items found - setting empty array');
        setLibraryData([]);
        return;
      }
      
      // Get user's library items if authenticated
      let userLibraryItemIds: string[] = [];
      if (user) {
        console.log('👤 User authenticated, checking user library...');
        try {
          const { data: libraryItems, error: libraryError } = await supabase
            .from('user_library')
            .select('content_item_id')
            .eq('user_id', user.id);
          
          if (libraryError) {
            console.error('❌ Library error:', libraryError);
          } else {
            userLibraryItemIds = libraryItems?.map(item => item.content_item_id) || [];
            console.log('📚 User has', userLibraryItemIds.length, 'items in library');
          }
        } catch (err) {
          console.warn('⚠️ Failed to load user library:', err);
        }
      }
      
      // Transform data for library cards
      const transformedData: LibraryCardData[] = contentItems.map(item => ({
        item: {
          ...item,
          // Extract metadata fields for easier access
          total_chapters: item.metadata?.total_chapters,
          estimated_read_time: item.metadata?.estimated_read_time
        } as ContentItem,
        overallProgress: 0, // TODO: Calculate actual progress from reading_progress table
        inUserLibrary: userLibraryItemIds.includes(item.id)
      }));
      
      console.log('🎯 Final transformed data:', transformedData.length, 'items');
      setLibraryData(transformedData);
      
    } catch (error) {
      console.error('💥 Error loading library data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load library data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToLibrary = async (itemId: string) => {
    if (!user) {
      alert('Please sign in to add items to your library');
      return;
    }
    
    try {
      console.log('➕ Adding to library:', itemId);
      const { error } = await supabase
        .from('user_library')
        .insert({
          user_id: user.id,
          content_item_id: itemId
        });
      
      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - already in library
          console.log('ℹ️ Item already in library');
          return;
        }
        throw error;
      }
      
      console.log('✅ Added to library successfully');
      
      // Update local state
      setLibraryData(prev => 
        prev.map(item => 
          item.item.id === itemId 
            ? { ...item, inUserLibrary: true }
            : item
        )
      );
    } catch (error) {
      console.error('❌ Error adding to library:', error);
      alert('Failed to add to library. Please try again.');
    }
  };
  
  const handleRemoveFromLibrary = async (itemId: string) => {
    if (!user) return;
    
    try {
      console.log('➖ Removing from library:', itemId);
      const { error } = await supabase
        .from('user_library')
        .delete()
        .eq('user_id', user.id)
        .eq('content_item_id', itemId);
      
      if (error) throw error;
      
      console.log('✅ Removed from library successfully');
      
      // Update local state
      setLibraryData(prev => 
        prev.map(item => 
          item.item.id === itemId 
            ? { ...item, inUserLibrary: false, overallProgress: 0 }
            : item
        )
      );
    } catch (error) {
      console.error('❌ Error removing from library:', error);
      alert('Failed to remove from library. Please try again.');
    }
  };
  
  // Filter library data based on search
  const filteredData = libraryData.filter(data => {
    const { item } = data;
    
    // Search filter
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="min-h-screen bg-background py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Zoroastervers Library</h1>
            <p className="text-muted-foreground mt-1">
              Discover and read epic tales from the world of ancient Persia
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            <button
              onClick={loadLibraryData}
              disabled={loading}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
              title="Refresh library data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="search"
                placeholder="Search library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64 bg-background text-foreground transition-colors duration-200"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex border border-border rounded-lg">
              <button
                onClick={() => setViewType('grid')}
                className={`px-3 py-2 text-sm rounded-l-lg transition-colors duration-200 ${
                  viewType === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-background text-foreground hover:bg-muted'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`px-3 py-2 text-sm rounded-r-lg border-l transition-colors duration-200 ${
                  viewType === 'list'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-background text-foreground hover:bg-muted border-border'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-80 flex-shrink-0">
            <FilterSidebar
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortDirection={sortDirection}
              onSortDirectionChange={setSortDirection}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              completionFilter={completionFilter}
              onCompletionFilterChange={setCompletionFilter}
            />
          </div>
          
          {/* Content Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Loading library...</h3>
                  <p className="text-muted-foreground">Fetching your content from the database</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Error Loading Library</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <div className="space-y-2">
                    <button
                      onClick={loadLibraryData}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Try Again
                    </button>
                    <p className="text-sm text-muted-foreground">Check browser console for detailed error info</p>
                  </div>
                </div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {libraryData.length === 0 ? 'No content found in database' : 'No content matches your filters'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {libraryData.length === 0 
                    ? 'Create and publish content in the admin area to see it here'
                    : 'Try adjusting your search or filters'
                  }
                </p>
                <button
                  onClick={loadLibraryData}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Library</span>
                </button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {filteredData.length} of {libraryData.length} items
                </div>
                
                {/* Content Grid/List */}
                <div className={`${
                  viewType === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-4'
                }`}>
                  {filteredData.map((data) => (
                    <LibraryCard
                      key={data.item.id}
                      data={data}
                      onAddToLibrary={handleAddToLibrary}
                      onRemoveFromLibrary={handleRemoveFromLibrary}
                      viewType={viewType}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}