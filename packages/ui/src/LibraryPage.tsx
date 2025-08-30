import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { useAuth } from '@zoroaster/shared/AuthContext';
import { XCircle, Info, Star } from 'lucide-react';
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
  const { data, error } = await supabase.from('works').select('*').order('order_in_parent', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Work[];
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
        work_id
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

// --- Work Card Component (New Design) ---
export const WorkCard: React.FC<{ work: Work; userLibraryItem?: UserLibraryItem; queryClient: any }> = ({ work, userLibraryItem, queryClient }) => {
  const { user } = useAuth(); // Get current user for rating
  const [userCurrentRating, setUserCurrentRating] = useState<number | null>(null);
  const [isSampleExpanded, setIsSampleExpanded] = useState(false);
  const [showSample, setShowSample] = useState(false);

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
    <article className="book-card" data-book-id={work.id} aria-label={`Book card: ${work.title} by ${authorName}`}>
      <div className="book-main">
        <div className="cover" role="img" aria-label={`Book cover: ${work.title} by ${authorName}`} style={{ background: work.cover_image_url ? `url(${work.cover_image_url}) center center / cover` : 'var(--teal)' }}>
          {!work.cover_image_url && (
            <div className="cover-content">
              <div className="cover-title">{work.title}</div>
              <div className="cover-author">{authorName}</div>
            </div>
          )}
        </div>

        <div className="details">
          <div className="book-header">
            <h3 className="book-title">{work.title}</h3>
            <div className="author">{authorName}</div>
          </div>

          {/* Release Date */}
          {(work.release_date || work.estimated_release) && (
            <div className="release-info text-sm text-muted mt-1">
              {work.release_date ? (
                <span>Released: {new Date(work.release_date).toLocaleDateString()}</span>
              ) : (
                <span>Estimated Release: {work.estimated_release}</span>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {(work.status === 'planning' || work.status === 'writing' || work.status === 'editing') && (
            <div className="progress" aria-label="Author writing progress">
              <div className="progress-head">
                <span>{progressPercentage}% written</span>
                <span aria-live="polite">{progressPercentage}%</span>
              </div>
              <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercentage} aria-label="Author writing progress">
                <span style={{ width: `${progressPercentage}%` }}></span>
              </div>
            </div>
          )}

          {/* Description */}
          <p className="desc">
            {work.description || 'No description available.'}
          </p>

          {/* Rating */}
          <div className="rating" aria-label={`Rating ${work.rating?.toFixed(1) || '0.0'} out of 5 based on ${work.reviews_count || 0} reviews`}>
            <span className="stars" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`star ${i < (userCurrentRating !== null ? userCurrentRating : Math.floor(work.rating || 0)) ? 'filled' : ''}`}
                  onClick={() => handleStarClick(i + 1)}
                  onMouseEnter={() => user && setUserCurrentRating(i + 1)}
                  onMouseLeave={() => user && setUserCurrentRating(fetchedUserRating !== null ? fetchedUserRating : null)}
                  style={{ cursor: user ? 'pointer' : 'default' }}
                />
              ))}
            </span>
            <span>{work.rating?.toFixed(1) || '0.0'}</span>
            <small>• {work.reviews_count || 0} reviews</small>
          </div>

          {/* Actions */}
          <div className="actions">
            {userLibraryItem ? (
              <>
                <button className="btn primary">Open</button>
              </>
            ) : (
              <button className="btn primary">Buy now</button>
            )}
          </div>

          {/* Sample Toggle Button */}
          {work.sample_content && (
            <button 
              className="sample-toggle-btn" 
              onClick={() => setIsSampleExpanded(!isSampleExpanded)}
              aria-expanded={isSampleExpanded}
            >
              <span>Read Sample</span>
              <svg 
                className={`toggle-arrow ${isSampleExpanded ? 'expanded' : ''}`} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Sample Card */}
      {isSampleExpanded && work.sample_content && (
        <div className="sample-card expanded">
          <div className="sample-header">
            <h4>Sample from "{work.title}"</h4>
          </div>
          <div className="sample-excerpt">
            <p>{work.sample_content}</p>
          </div>
          <div className="sample-actions">
            {userLibraryItem ? (
              <button className="continue-btn">Continue reading</button>
            ) : (
              <button className="buy-btn">Buy now</button>
            )}
          </div>
        </div>
      )}
    </article>
  );
};



// --- Main Library Page Component ---
export const LibraryPage: React.FC = () => {
  const { user } = useAuth(); // Get current user from AuthContext
  const queryClient = useQueryClient();

  // Fetch all works
  const { data: allWorks, isLoading: isLoadingWorks, isError: isErrorWorks, error: errorWorks } = useQuery<Work[]>({ // Changed from any to Work[]
    queryKey: ['allWorks'],
    queryFn: fetchAllWorks,
  });

  // Conditionally fetch user library items if user is logged in
  const { data: userLibraryItems, isLoading: isLoadingUserLibrary, isError: isErrorUserLibrary, error: errorUserLibrary } = useQuery<UserLibraryItem[]>({ // Changed from any to UserLibraryItem[]
    queryKey: ['userLibraryItems', user?.id],
    queryFn: () => fetchUserLibraryItems(user?.id || ''),
    enabled: !!user?.id, // Only run query if user is logged in
  });

  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Mock calendar data for now
  

  const filteredWorks = allWorks?.filter(work => {
    const matchesType = filterType === 'All' || work.type === filterType.toLowerCase();
    const matchesStatus = filterStatus === 'All' || work.status === filterStatus.toLowerCase();
    return matchesType && matchesStatus;
  }) || [];

  if (isLoadingWorks || isLoadingUserLibrary) return <div className="text-center py-8 text-text-light">Loading library...</div>;
  if (isErrorWorks) return <div className="text-center py-8 text-red-400">Error loading works: {errorWorks?.message}</div>;
  if (isErrorUserLibrary) return <div className="text-center py-8 text-red-400">Error loading user library: {errorUserLibrary?.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-background-dark text-text-light min-h-screen">
      <h1 className="text-4xl font-bold text-text-light mb-6">Your Library</h1>

      {showInfoBanner && (
        <div className="bg-blue-900 bg-opacity-30 border border-blue-700 text-blue-200 p-4 rounded-md mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info size={20} />
            <p className="text-sm">Files may include a purchaser-specific watermark. Download limits: 5 per format.</p>
          </div>
          <button onClick={() => setShowInfoBanner(false)} className="text-blue-200 hover:text-white">
            <XCircle size={20} />
          </button>
        </div>
      )}

      {/* Sub-navigation Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilterType('All')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'All' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>All</button>
        <button onClick={() => setFilterType('Book')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'Book' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Books</button>
        <button onClick={() => setFilterType('Volume')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'Volume' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Volumes</button>
        <button onClick={() => setFilterType('Saga')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'Saga' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Sagas</button>
        <button onClick={() => setFilterType('Arc')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'Arc' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Arcs</button>
        <button onClick={() => setFilterType('Issue')} className={`px-4 py-2 rounded-full text-sm font-semibold ${filterType === 'Issue' ? 'bg-primary-DEFAULT text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Issues</button>
        {/* Status Filters */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-full text-sm font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600"
        >
          <option value="All">All Status</option>
          <option value="Published">Published</option>
          <option value="Planning">Planning</option>
          <option value="Writing">Writing</option>
          <option value="Editing">Editing</option>
          <option value="On_hold">On Hold</option>
        </select>
      </div>

      {/* Main content and sidebar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content area (books) */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-6 mb-8">
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
        </div>
      </div>
    </div>
  );
};


