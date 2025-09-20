import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { useAuth } from '@zoroaster/shared/AuthContext';
import { XCircle, Info, Star, ChevronDown, Search, Filter, Grid, List } from 'lucide-react';
// import './LibraryPage.css'; // Import the external CSS file

// Define types for work and user_library_item
type Work = {
  id: string;
  title: string;
  type: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  parent_id?: string;
  order_in_parent?: number;
  description?: string;
  status: 'planning' | 'writing' | 'editing' | 'published' | 'on_hold';
  progress_percentage?: number;
  release_date?: string;
  estimated_release?: string;
  cover_image_url?: string;
  sample_url?: string;
  sample_content?: string; // Added for direct text content
  is_purchasable?: boolean;
  is_featured?: boolean;
  word_count?: number;
  target_word_count?: number;
  rating?: number; // Added for ratings
  reviews_count?: number; // Added for ratings
  epub_url?: string | null;
  pdf_url?: string | null;
  mobi_url?: string | null;
};

type UserLibraryItem = {
  id: string; // purchase ID
  user_id: string;
  product_id: string;
  purchased_at: string;
  status: string; // purchase status
  product_title: string;
  product_description?: string;
  product_type: 'single_issue' | 'bundle' | 'chapter_pass' | 'arc_pass';
  work_id?: string; // if the product is associated with a work
};

// --- Supabase Data Functions ---
const fetchAllWorks = async (): Promise<Work[]> => {
  const { data, error } = await supabase
    .from('content_works') // Changed from 'works' to 'content_works'
    .select(`
      id,
      title,
      type,
      parent_id,
      order_in_parent,
      description,
      status,
      progress_percentage,
      release_date,
      estimated_release,
      cover_image_url,
      sample_content,
      is_purchasable,
      is_featured,
      word_count,
      target_word_count,
      rating,
      reviews_count,
      products!inner(file_key) // Join with products to get file_key
    `)
    .order('order_in_parent', { ascending: true });

  if (error) {
    console.error('fetchAllWorks Supabase Error:', error); // Added log
    throw new Error(error.message);
  }

  console.log('fetchAllWorks Supabase Data:', data); // Added log

  return data.map(d => ({
    ...d,
    epub_file_key: d.products[0]?.file_key || null, // Map file_key from products to epub_file_key
    // Assuming epub_url, pdf_url, mobi_url are derived from epub_file_key or not directly available here
    // If these URLs are stored directly in content_works, they should be selected above.
  })) as Work[];
};

const fetchUserLibraryItems = async (userId: string): Promise<UserLibraryItem[]> => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      id,
      user_id,
      product_id,
      purchased_at,
      status,
      products (
        name,
        description,
        product_type,
        work_id,
        file_key
      )
    `)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return data.map(purchase => ({
    id: purchase.id,
    user_id: purchase.user_id,
    product_id: purchase.product_id,
    purchased_at: purchase.purchased_at,
    status: purchase.status,
    product_title: purchase.products?.name || 'Unknown Product',
    product_description: purchase.products?.description,
    product_type: purchase.products?.product_type || 'single_issue',
    work_id: purchase.products?.work_id,
    epub_file_key: purchase.products?.file_key || null, // Map to epub_file_key
  })) as UserLibraryItem[];
};

const fetchUserRating = async (userId: string, workId: string) => {
  if (!userId || !workId) return null;
  const { data, error } = await supabase
    .from('user_ratings')
    .select('rating')
    .eq('user_id', userId)
    .eq('work_id', workId)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message); // PGRST116 means no rows found
  return data ? data.rating : null;
};

const upsertUserRating = async (userId: string, workId: string, rating: number) => {
  const { data, error } = await supabase
    .from('user_ratings')
    .upsert({ user_id: userId, work_id: workId, rating: rating }, { onConflict: 'user_id,work_id' })
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};

// --- Work Card Component (Mobile-Enhanced Design) ---
export const WorkCard: React.FC<{ work: Work; userLibraryItem?: UserLibraryItem; queryClient: any }> = ({ work, userLibraryItem, queryClient }) => {
  const { user } = useAuth(); // Get current user for rating
  const [userCurrentRating, setUserCurrentRating] = useState<number | null>(null);
  const [isSampleExpanded, setIsSampleExpanded] = useState(false);
  const [showSample, setShowSample] = useState(false);

  const addToLibraryMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error('User not logged in.');
      // For free books, we need a default price_id. This assumes a default price_id exists for free products.
      // In a real scenario, you might fetch this from the product details or have a dedicated free_price_id.
      const defaultFreePriceId = 'free-product-price-id'; // REPLACE WITH ACTUAL FREE PRICE ID
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: productId,
          price_id: defaultFreePriceId, // Use a default price ID for free products
          status: 'completed',
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to library.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLibraryItems', user?.id] });
      // toast.success('Book added to your library!');
    },
    onError: (error) => {
      // toast.error(`Error adding to library: ${error.message}`);
    },
  });

  const handleAddToLibrary = (productId: string) => {
    if (!user) {
      // toast.error('Please log in to add books to your library.');
      return;
    }
    addToLibraryMutation.mutate(productId);
  };

  // Fetch user's specific rating for this work
  const { data: fetchedUserRating } = useQuery({
    queryKey: ['userRating', user?.id, work.id],
    queryFn: () => fetchUserRating(user?.id || '', work.id),
    enabled: !!user?.id, // Only run if user is logged in
  });

  useEffect(() => {
    if (fetchedUserRating !== undefined) {
      setUserCurrentRating(fetchedUserRating);
    }
  }, [fetchedUserRating]);

  const upsertRatingMutation = useMutation({
    mutationFn: ({ userId, workId, rating }: { userId: string; workId: string; rating: number }) => upsertUserRating(userId, workId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRating', user?.id, work.id] }); // Invalidate specific user rating
      queryClient.invalidateQueries({ queryKey: ['allWorks'] }); // Invalidate all works to update average rating/count
    },
    onError: (err) => {
      alert(`Error submitting rating: ${err.message}`);
    }
  });

  const handleStarClick = (ratingValue: number) => {
    if (!user) {
      alert("Please log in to submit a rating.");
      return;
    }
    if (user.id) {
      upsertRatingMutation.mutate({ userId: user.id, workId: work.id, rating: ratingValue });
    }
  };

  const progressPercentage = work.word_count && work.target_word_count
    ? Math.min(100, Math.round((work.word_count / work.target_word_count) * 100))
    : work.progress_percentage || 0;

  const authorName = "S. Azar"; // Hardcoded for now

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden" data-book-id={work.id} aria-label={`Book card: ${work.title} by ${authorName}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Book Cover */}
        <div className="relative w-full sm:w-48 h-64 sm:h-auto flex-shrink-0">
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white p-4"
            role="img" 
            aria-label={`Book cover: ${work.title} by ${authorName}`} 
            style={{ 
              background: work.cover_image_url ? `url(${work.cover_image_url}) center center / cover` : 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
            }}
          >
            {!work.cover_image_url && (
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold mb-2">{work.title}</div>
                <div className="text-sm opacity-90">{authorName}</div>
              </div>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">{work.title}</h3>
            <div className="text-gray-600 dark:text-gray-400">{authorName}</div>
          </div>

          {/* Release Date */}
          {(work.release_date || work.estimated_release) && (
            <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              {work.release_date ? (
                <span>Released: {new Date(work.release_date).toLocaleDateString()}</span>
              ) : (
                <span>Estimated Release: {work.estimated_release}</span>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {(work.status === 'planning' || work.status === 'writing' || work.status === 'editing') && (
            <div className="mb-4" aria-label="Author writing progress">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progressPercentage}% written</span>
                <span className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercentage} aria-label="Author writing progress">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base">
            {work.description || 'No description available.'}
          </p>

          {/* Rating */}
          <div className="mb-4" aria-label={`Rating ${work.rating?.toFixed(1) || '0.0'} out of 5 based on ${work.reviews_count || 0} reviews`}>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 cursor-pointer transition-colors ${
                      i < (userCurrentRating !== null ? userCurrentRating : Math.floor(work.rating || 0)) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    onClick={() => handleStarClick(i + 1)}
                    onMouseEnter={() => user && setUserCurrentRating(i + 1)}
                    onMouseLeave={() => user && setUserCurrentRating(fetchedUserRating ?? null)}
                    style={{ cursor: user ? 'pointer' : 'default' }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{work.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">• {work.reviews_count || 0} reviews</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {userLibraryItem && work.epub_file_key ? (
              <a
                href={`/apps/frontend/src/reader/reader.html?book=${work.epub_file_key}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 min-h-[44px]"
                target="_blank" // Open in new tab
                rel="noopener noreferrer"
              >
                Open Book
              </a>
            ) : (
              <button className="flex-1 sm:flex-none px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 min-h-[44px]">
                Buy Now
              </button>
            )}
            
            {/* Sample Toggle Button */}
            {work.sample_content && (
              <button 
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200 min-h-[44px]"
                onClick={() => setIsSampleExpanded(!isSampleExpanded)}
                aria-expanded={isSampleExpanded}
              >
                <span>Read Sample</span>
                <ChevronDown 
                  className={`ml-2 w-4 h-4 transition-transform duration-200 ${isSampleExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Sample Card */}
      {isSampleExpanded && work.sample_content && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-4 sm:p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Sample from "{work.title}"</h4>
          </div>
          <div className="prose prose-sm sm:prose dark:prose-invert max-w-none mb-4">
            <p className="text-gray-700 dark:text-gray-300">{work.sample_content}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {userLibraryItem ? (
              <button className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 min-h-[44px]">
                Continue Reading
              </button>
            ) : (
              <button className="flex-1 sm:flex-none px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 min-h-[44px]">
                Buy Now
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

// --- Main Library Page Component (Mobile-Enhanced) ---
export const LibraryPage: React.FC = () => {
  const { user } = useAuth(); // Get current user from AuthContext
  const queryClient = useQueryClient();

  // Fetch all works
  const { data: allWorks, isLoading: isLoadingWorks, isError: isErrorWorks, error: errorWorks } = useQuery<Work[]>({
    queryKey: ['allWorks'],
    queryFn: fetchAllWorks,
  });

  // Conditionally fetch user library items if user is logged in
  const { data: userLibraryItems, isLoading: isLoadingUserLibrary, isError: isErrorUserLibrary, error: errorUserLibrary } = useQuery<UserLibraryItem[]>({
    queryKey: ['userLibraryItems', user?.id],
    queryFn: () => fetchUserLibraryItems(user?.id || ''),
    enabled: !!user?.id, // Only run query if user is logged in
  });

  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredWorks = allWorks?.filter(work => {
    const matchesType = filterType === 'All' || work.type === filterType.toLowerCase();
    const matchesStatus = filterStatus === 'All' || work.status === filterStatus.toLowerCase();
    const matchesSearch = !searchTerm || 
      work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  }) || [];

  if (isLoadingWorks || isLoadingUserLibrary) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your library...</p>
        </div>
      </div>
    );
  }
  
  if (isErrorWorks) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading works: {errorWorks?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (isErrorUserLibrary) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading user library: {errorUserLibrary?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile-friendly header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Library
            </h1>
            
            {/* Mobile-optimized search and filters */}
            <div className="space-y-4">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your library..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
                />
              </div>

              {/* Filters row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:hidden flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium min-h-[44px]"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Desktop filters or mobile expanded */}
                  <div className={`flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 ${showFilters ? 'block' : 'hidden sm:flex'}`}>
                    {/* Type filter */}
                    <div className="relative">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[120px] min-h-[44px]"
                      >
                        <option value="All">All Types</option>
                        <option value="Book">Books</option>
                        <option value="Volume">Volumes</option>
                        <option value="Saga">Sagas</option>
                        <option value="Arc">Arcs</option>
                        <option value="Issue">Issues</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Status filter */}
                    <div className="relative">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[140px] min-h-[44px]"
                      >
                        <option value="All">All Status</option>
                        <option value="Published">Published</option>
                        <option value="Planning">Planning</option>
                        <option value="Writing">Writing</option>
                        <option value="Editing">Editing</option>
                        <option value="On_hold">On Hold</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* View mode toggle */}
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors duration-200 min-h-[40px] min-w-[40px] ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors duration-200 min-h-[40px] min-w-[40px] ${
                      viewMode === 'list' 
                        ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {showInfoBanner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info size={20} />
              <p className="text-sm">Files may include a purchaser-specific watermark. Download limits: 5 per format.</p>
            </div>
            <button onClick={() => setShowInfoBanner(false)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <XCircle size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {filteredWorks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No matching content' : 'No content available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search or filters' 
                : 'Start by creating some content in the admin panel'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredWorks.length} {filteredWorks.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            <div className="space-y-6">
              {filteredWorks.map((work) => {
                const userLibraryItem = userLibraryItems?.find(item => item.work_id === work.id);
                return (
                  <WorkCard
                    key={work.id}
                    work={work}
                    userLibraryItem={userLibraryItem}
                    queryClient={queryClient}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};