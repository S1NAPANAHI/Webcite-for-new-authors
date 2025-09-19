import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Star,
  Play,
  Bookmark,
  Search,
  Filter,
  Calendar,
  Award,
  Target,
  Zap,
  Heart,
  MoreVertical,
  Archive,
  Trash2,
  Edit,
  Plus,
  Eye,
  Loader,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth, supabase } from '@zoroaster/shared';
import {
  UserLibraryItemWithContent,
  ReadingProgress,
  ContentItemType,
  HIERARCHY_LEVELS
} from '../../types/content';

// Mock reading stats - in real app, calculate from actual data
const mockReadingStats = {
  totalItems: 0,
  itemsCompleted: 0,
  currentStreak: 0,
  totalReadingTime: 0, // minutes
  chaptersRead: 0,
  averageRating: 0,
  thisWeekProgress: 0, // chapters
  favoriteGenre: 'Fantasy'
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 font-medium">{trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

interface LibraryItemCardProps {
  item: UserLibraryItemWithContent;
  onRemove: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateRating: (id: string, rating: number) => void;
}

function LibraryItemCard({ item, onRemove, onToggleFavorite, onUpdateRating }: LibraryItemCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { content_item, overall_progress } = item;
  
  const getNextChapterInfo = () => {
    // Mock logic to determine next chapter to read
    if (overall_progress < 100) {
      return {
        title: 'Chapter 3: The First Test',
        number: 3
      };
    }
    return null;
  };
  
  const nextChapter = getNextChapterInfo();
  
  const renderStars = (rating: number, interactive: boolean = false, onRate?: (r: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return (
        <button
          key={i}
          onClick={() => interactive && onRate && onRate(starValue)}
          className={interactive ? 'hover:scale-110 transition-transform duration-200' : ''}
          disabled={!interactive}
        >
          <Star
            className={`w-4 h-4 ${
              starValue <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      );
    });
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Cover */}
          <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {content_item.cover_image_url ? (
              <img 
                src={content_item.cover_image_url} 
                alt={content_item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {content_item.title}
                  </h3>
                  {item.is_favorite && (
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  )}
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {content_item.description}
                </p>
              </div>
              
              {/* Actions Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-8 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onToggleFavorite(item.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Heart className={`w-4 h-4 ${item.is_favorite ? 'text-red-500 fill-current' : ''}`} />
                        <span>{item.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                      </button>
                      <button
                        onClick={() => setShowMenu(false)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Add Notes</span>
                      </button>
                      <button
                        onClick={() => {
                          onRemove(item.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove from Library</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-1 mb-3">
              {renderStars(
                item.personal_rating || 0, 
                true, 
                (rating) => onUpdateRating(item.id, rating)
              )}
              <span className="text-sm text-gray-600 ml-2">
                {item.personal_rating ? `Your rating: ${item.personal_rating}/5` : 'Rate this'}
              </span>
            </div>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Reading Progress</span>
                <span className="text-gray-900 font-medium">{overall_progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${overall_progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <span className="capitalize">{HIERARCHY_LEVELS[content_item.type].label}</span>
                {content_item.metadata?.chapter_count && (
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{content_item.metadata.chapter_count} chapters</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Added {new Date(item.added_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Link
                to={`/library/${content_item.type}/${content_item.slug}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </Link>
              
              {overall_progress > 0 && (
                <Link
                  to={`/read/${content_item.slug}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>
                    {overall_progress === 100 ? 'Read Again' : 
                     nextChapter ? `Continue: ${nextChapter.title}` : 'Continue Reading'}
                  </span>
                </Link>
              )}
              
              {overall_progress === 0 && (
                <Link
                  to={`/read/${content_item.slug}/chapter/1`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Start Reading</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions Bar */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-600">
            <span>Last read: {item.last_accessed_at ? new Date(item.last_accessed_at).toLocaleDateString() : 'Never'}</span>
            {nextChapter && (
              <span>Next: {nextChapter.title}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {item.personal_notes && (
              <span className="text-indigo-600">Has notes</span>
            )}
            {item.is_favorite && (
              <span className="text-red-600">Favorite</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: Record<string, number>;
}

function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  const filters = [
    { key: 'all', label: 'All', count: counts.all || 0 },
    { key: 'reading', label: 'Currently Reading', count: counts.reading || 0 },
    { key: 'completed', label: 'Completed', count: counts.completed || 0 },
    { key: 'favorites', label: 'Favorites', count: counts.favorites || 0 },
    { key: 'not_started', label: 'Not Started', count: counts.not_started || 0 }
  ];
  
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeFilter === filter.key
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {filter.label}
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
              {filter.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function MyLibraryPage() {
  const { user } = useAuth();
  const [libraryItems, setLibraryItems] = useState<UserLibraryItemWithContent[]>([]);
  const [readingStats, setReadingStats] = useState(mockReadingStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Load user's library from database
  useEffect(() => {
    if (user) {
      loadUserLibrary();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const loadUserLibrary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading user library for:', user?.id);
      
      // Fetch user's library items with content details
      const { data: libraryData, error: libraryError } = await supabase
        .from('user_library')
        .select(`
          id,
          user_id,
          content_item_id,
          added_at,
          last_accessed_at,
          is_favorite,
          personal_rating,
          personal_notes,
          content_items!inner (
            id,
            type,
            title,
            slug,
            description,
            cover_image_url,
            parent_id,
            order_index,
            completion_percentage,
            average_rating,
            rating_count,
            status,
            published_at,
            metadata,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user?.id)
        .eq('content_items.status', 'published')
        .order('added_at', { ascending: false });
      
      if (libraryError) {
        console.error('❌ Error fetching library:', libraryError);
        throw libraryError;
      }
      
      console.log('✅ Library data loaded:', libraryData?.length || 0, 'items');
      
      if (!libraryData || libraryData.length === 0) {
        console.log('📭 No library items found');
        setLibraryItems([]);
        setReadingStats(prev => ({ ...prev, totalItems: 0 }));
        return;
      }
      
      // Transform data to match expected structure
      const transformedItems: UserLibraryItemWithContent[] = libraryData.map(item => ({
        id: item.id,
        user_id: item.user_id,
        content_item_id: item.content_item_id,
        added_at: item.added_at,
        last_accessed_at: item.last_accessed_at,
        is_favorite: item.is_favorite || false,
        personal_rating: item.personal_rating,
        personal_notes: item.personal_notes,
        content_item: Array.isArray(item.content_items) ? item.content_items[0] : item.content_items,
        overall_progress: 0 // TODO: Calculate from reading_progress table
      }));
      
      setLibraryItems(transformedItems);
      
      // Update reading stats
      const completedItems = transformedItems.filter(item => item.overall_progress === 100).length;
      setReadingStats(prev => ({
        ...prev,
        totalItems: transformedItems.length,
        itemsCompleted: completedItems
      }));
      
      console.log('📚 Library items set:', transformedItems.length);
      
    } catch (error) {
      console.error('💥 Error loading user library:', error);
      setError(error instanceof Error ? error.message : 'Failed to load library');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate filter counts
  const filterCounts = {
    all: libraryItems.length,
    reading: libraryItems.filter(item => item.overall_progress > 0 && item.overall_progress < 100).length,
    completed: libraryItems.filter(item => item.overall_progress === 100).length,
    favorites: libraryItems.filter(item => item.is_favorite).length,
    not_started: libraryItems.filter(item => item.overall_progress === 0).length
  };
  
  // Filter items based on active filter and search
  const filteredItems = libraryItems.filter(item => {
    // Search filter
    if (searchQuery && !item.content_item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.content_item.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter
    switch (activeFilter) {
      case 'reading':
        return item.overall_progress > 0 && item.overall_progress < 100;
      case 'completed':
        return item.overall_progress === 100;
      case 'favorites':
        return item.is_favorite;
      case 'not_started':
        return item.overall_progress === 0;
      default:
        return true;
    }
  });
  
  const handleRemoveFromLibrary = async (id: string) => {
    try {
      console.log('➖ Removing from library:', id);
      
      const { error } = await supabase
        .from('user_library')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      console.log('✅ Removed from library successfully');
      setLibraryItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('❌ Error removing from library:', error);
      alert('Failed to remove from library. Please try again.');
    }
  };
  
  const handleToggleFavorite = async (id: string) => {
    try {
      console.log('💖 Toggling favorite:', id);
      
      const item = libraryItems.find(item => item.id === id);
      if (!item) return;
      
      const { error } = await supabase
        .from('user_library')
        .update({ is_favorite: !item.is_favorite })
        .eq('id', id);
      
      if (error) throw error;
      
      console.log('✅ Favorite toggled successfully');
      setLibraryItems(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, is_favorite: !item.is_favorite }
            : item
        )
      );
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
      alert('Failed to update favorite status. Please try again.');
    }
  };
  
  const handleUpdateRating = async (id: string, rating: number) => {
    try {
      console.log('⭐ Updating rating:', id, rating);
      
      const { error } = await supabase
        .from('user_library')
        .update({ personal_rating: rating })
        .eq('id', id);
      
      if (error) throw error;
      
      console.log('✅ Rating updated successfully');
      setLibraryItems(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, personal_rating: rating }
            : item
        )
      );
    } catch (error) {
      console.error('❌ Error updating rating:', error);
      alert('Failed to update rating. Please try again.');
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your reading library.</p>
          <Link 
            to="/login"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <span>Log In</span>
          </Link>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading your library...</h3>
          <p className="text-gray-600">Fetching your reading collection</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Library</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <button
              onClick={loadUserLibrary}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <Link
              to="/library"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <span>Browse Library</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Reading Library</h1>
              <p className="text-gray-600 mt-1">
                Track your reading progress and manage your collection
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={loadUserLibrary}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                title="Refresh library"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <Link
                to="/library"
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Browse Library</span>
              </Link>
            </div>
          </div>
          
          {/* Reading Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Items in Library"
              value={readingStats.totalItems}
              icon={BookOpen}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Current Streak"
              value={`${readingStats.currentStreak} days`}
              icon={Zap}
              color="from-green-500 to-green-600"
              trend={readingStats.currentStreak > 0 ? "+2 this week" : undefined}
            />
            <StatCard
              title="Reading Time"
              value={`${Math.round(readingStats.totalReadingTime / 60)}h`}
              icon={Clock}
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              title="Chapters Read"
              value={readingStats.chaptersRead}
              icon={Target}
              color="from-orange-500 to-orange-600"
              trend={readingStats.chaptersRead > 0 ? "+8 this week" : undefined}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Search and Filters */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="search"
                    placeholder="Search your library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <FilterTabs 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={filterCounts}
          />
          
          {/* Library Items */}
          <div className="p-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No items match your search' : 
                   libraryItems.length === 0 ? 'Your library is empty' : 'No items in this category'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 
                   libraryItems.length === 0 ? 'Start by adding some content to your library' : 'Try a different filter'}
                </p>
                {libraryItems.length === 0 && (
                  <Link
                    to="/library"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Browse Library</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <LibraryItemCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveFromLibrary}
                    onToggleFavorite={handleToggleFavorite}
                    onUpdateRating={handleUpdateRating}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Continue Reading Section */}
        {filteredItems.some(item => item.overall_progress > 0 && item.overall_progress < 100) && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Continue Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems
                .filter(item => item.overall_progress > 0 && item.overall_progress < 100)
                .slice(0, 6)
                .map((item) => {
                  const nextChapter = { title: 'Next Chapter', number: 1 }; // Mock data
                  return (
                    <Link
                      key={item.id}
                      to={`/read/${item.content_item.slug}`}
                      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-indigo-200 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {item.content_item.cover_image_url ? (
                            <img 
                              src={item.content_item.cover_image_url} 
                              alt={item.content_item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 line-clamp-1 mb-1">
                            {item.content_item.title}
                          </h4>
                          {nextChapter && (
                            <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                              Next: {nextChapter.title}
                            </p>
                          )}
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${item.overall_progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.overall_progress}% complete
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}