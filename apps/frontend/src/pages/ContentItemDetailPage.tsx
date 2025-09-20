import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  BookOpen,
  Calendar,
  User,
  Eye,
  Clock,
  Plus,
  Check,
  Play,
  BarChart3,
  FileText,
  ChevronRight,
  Heart,
  Share2,
  Download,
  Loader,
  Lock,
  Crown
} from 'lucide-react';
import { useAuth, supabase } from '@zoroaster/shared';
import {
  ContentItemWithChildren,
  Chapter,
  ContentItemType,
  HIERARCHY_LEVELS,
  ReadingProgress
} from '../types/content';
import { getChapterReadingUrl, getStartReadingUrl } from '../utils/chapterUtils';
import ChapterCard from '../components/ChapterCard';
import { useFileUrl } from '../utils/fileUrls';

interface ChapterCardProps {
  chapter: Chapter;
  progress?: ReadingProgress;
  onStartReading: (chapterSlug: string) => void;
  canRead: boolean;
  issueSlug: string;
  isAccessible: boolean;
  isFree: boolean;
}

function ChapterCardLocal({ chapter, progress, onStartReading, canRead, issueSlug, isAccessible, isFree }: ChapterCardProps) {
  const isCompleted = progress?.completed || false;
  const progressPercentage = progress?.progress_percentage || 0;
  const canReadChapter = canRead && chapter.status === 'published' && isAccessible;
  
  // DEBUG: Use our updated ChapterCard component instead of this local one
  console.log('\n🎯 RENDERING CHAPTER CARD (ContentItemDetailPage):', {
    id: chapter.id,
    title: chapter.title,
    banner_file_id: chapter.banner_file_id,
    canRead: canReadChapter,
    issueSlug
  });
  
  // Use the global ChapterCard component that has all the debug logging
  return (
    <ChapterCard
      chapter={{
        ...chapter,
        has_access: isAccessible
      }}
      issueSlug={issueSlug}
      className="content-detail-chapter-card"
    />
  );
}

interface BreadcrumbItem {
  title: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  item: ContentItemWithChildren;
  breadcrumbs: BreadcrumbItem[];
}

function Breadcrumb({ breadcrumbs }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          {crumb.current ? (
            <span className="text-gray-900 font-medium">{crumb.title}</span>
          ) : (
            <Link 
              to={crumb.href}
              className="hover:text-indigo-600 transition-colors duration-200"
            >
              {crumb.title}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

interface RatingDisplayProps {
  rating: number;
  reviewCount: number;
  userRating?: number;
  onRate?: (rating: number) => void;
}

function RatingDisplay({ rating, reviewCount, userRating, onRate }: RatingDisplayProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const renderStars = (displayRating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starRating = i + 1;
      const isFilled = starRating <= (interactive ? (hoveredRating || displayRating) : displayRating);
      
      return (
        <button
          key={i}
          onClick={() => interactive && onRate && onRate(starRating)}
          onMouseEnter={() => interactive && setHoveredRating(starRating)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
          className={`${
            interactive 
              ? 'hover:scale-110 transition-transform duration-200 cursor-pointer' 
              : 'cursor-default'
          }`}
          disabled={!interactive}
        >
          <Star
            className={`w-5 h-5 ${
              isFilled
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      );
    });
  };
  
  return (
    <div className="space-y-2">
      {/* Overall Rating */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {renderStars(rating)}
        </div>
        <span className="text-lg font-semibold text-gray-900">{rating.toFixed(1)}</span>
        <span className="text-gray-600">({reviewCount} reviews)</span>
      </div>
      
      {/* User Rating */}
      {onRate && (
        <div className="border-t border-gray-200 pt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Rate this content:</p>
          <div className="flex items-center space-x-1">
            {renderStars(userRating || 0, true)}
            {userRating && (
              <span className="text-sm text-gray-600 ml-2">Your rating: {userRating}/5</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Function to build breadcrumbs from hierarchy
async function buildBreadcrumbs(item: ContentItemWithChildren): Promise<BreadcrumbItem[]> {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Library', href: '/library' }
  ];

  // Build hierarchy by traversing up the parent chain
  const hierarchy: ContentItemWithChildren[] = [];
  let currentItem = item;
  
  // Add current item to hierarchy
  hierarchy.unshift(currentItem);
  
  // Traverse up the parent chain
  while (currentItem.parent_id) {
    try {
      const { data: parentData, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', currentItem.parent_id)
        .single();
        
      if (error || !parentData) {
        console.warn('Could not fetch parent:', currentItem.parent_id, error);
        break;
      }
      
      const parent = parentData as ContentItemWithChildren;
      hierarchy.unshift(parent);
      currentItem = parent;
    } catch (error) {
      console.warn('Error fetching parent hierarchy:', error);
      break;
    }
  }
  
  // Convert hierarchy to breadcrumbs
  hierarchy.forEach((hierarchyItem, index) => {
    const isLast = index === hierarchy.length - 1;
    breadcrumbs.push({
      title: hierarchyItem.title,
      href: isLast ? '' : `/library/${hierarchyItem.type}/${hierarchyItem.slug}`,
      current: isLast
    });
  });
  
  return breadcrumbs;
}

export default function ContentItemDetailPage() {
  const { type, slug } = useParams<{ type: string; slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState<ContentItemWithChildren | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, ReadingProgress>>({});
  const [chapterAccessInfo, setChapterAccessInfo] = useState<Record<string, { hasAccess: boolean; isFree: boolean }>>({});
  const [inUserLibrary, setInUserLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  
  useEffect(() => {
    if (type && slug) {
      loadItemDetails();
    }
  }, [type, slug, user]);
  
  const loadItemDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('\n🔍 CONTENT ITEM DETAIL - Loading item:', { type, slug });
      
      // Fetch the main content item with chapters
      const { data: itemData, error: itemError } = await supabase
        .from('content_items')
        .select(`
          *,
          chapters:chapters(
            id,
            issue_id,
            title,
            slug,
            content,
            plain_content,
            chapter_number,
            word_count,
            estimated_read_time,
            status,
            published_at,
            is_free,
            subscription_tier_required,
            banner_file_id,
            hero_file_id,
            metadata,
            created_at,
            updated_at
          )
        `)
        .eq('type', type)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (itemError) {
        console.error('❌ CONTENT ITEM DETAIL - Error fetching item:', itemError);
        if (itemError.code === 'PGRST116') {
          setError('Content not found');
        } else {
          setError('Failed to load content');
        }
        return;
      }
      
      if (!itemData) {
        console.log('❌ CONTENT ITEM DETAIL - No item found');
        setError('Content not found');
        return;
      }
      
      console.log('✅ CONTENT ITEM DETAIL - Item loaded:', {
        id: itemData.id,
        title: itemData.title,
        chaptersCount: itemData.chapters?.length || 0
      });
      
      // DEBUG: Log all chapters with their banner info
      if (itemData.chapters && itemData.chapters.length > 0) {
        console.log('📚 CONTENT ITEM DETAIL - Chapters loaded:');
        itemData.chapters.forEach((ch, index) => {
          console.log(`   Chapter ${index + 1}: "${ch.title}"`);
          console.log(`     ID: ${ch.id}`);
          console.log(`     Banner file ID: ${ch.banner_file_id || 'NONE'}`);
          console.log(`     Hero file ID: ${ch.hero_file_id || 'NONE'}`);
          console.log(`     Status: ${ch.status}`);
          console.log(`     Free: ${ch.is_free}`);
        });
      }
      
      const loadedItem = itemData as ContentItemWithChildren;
      setItem(loadedItem);
      
      // Build breadcrumbs from the actual hierarchy
      try {
        const crumbs = await buildBreadcrumbs(loadedItem);
        setBreadcrumbs(crumbs);
        console.log('🍞 Breadcrumbs built:', crumbs);
      } catch (breadcrumbError) {
        console.warn('⚠️ Could not build breadcrumbs:', breadcrumbError);
        // Fallback breadcrumbs
        setBreadcrumbs([
          { title: 'Library', href: '/library' },
          { title: loadedItem.title, href: '', current: true }
        ]);
      }
      
      // Check if item is in user's library
      if (user) {
        console.log('👤 Checking if item is in user library...');
        const { data: libraryData, error: libraryError } = await supabase
          .from('user_library')
          .select('id')
          .eq('user_id', user.id)
          .eq('content_item_id', loadedItem.id)
          .single();
        
        if (libraryError && libraryError.code !== 'PGRST116') {
          console.warn('⚠️ Error checking library status:', libraryError);
        } else {
          setInUserLibrary(!!libraryData);
          console.log('📚 In user library:', !!libraryData);
        }
        
        // Load user progress for chapters if this is an issue
        if (loadedItem.type === 'issue' && loadedItem.chapters) {
          const chapterIds = loadedItem.chapters.map(ch => ch.id);
          if (chapterIds.length > 0) {
            const { data: progressData, error: progressError } = await supabase
              .from('reading_progress')
              .select('*')
              .eq('user_id', user.id)
              .in('chapter_id', chapterIds);
              
            if (progressError) {
              console.warn('⚠️ Error loading reading progress:', progressError);
            } else if (progressData) {
              const progressMap: Record<string, ReadingProgress> = {};
              progressData.forEach(p => {
                progressMap[p.chapter_id] = p;
              });
              setUserProgress(progressMap);
              console.log('📖 User progress loaded:', progressMap);
            }
          }
          
          // Get chapter access info using new database function
          const { data: accessibleChapters, error: accessError } = await supabase
            .rpc('get_accessible_chapters_for_issue', {
              p_issue_id: loadedItem.id,
              p_user_id: user.id
            });
            
          if (accessError) {
            console.warn('⚠️ Error loading chapter access info:', accessError);
          } else if (accessibleChapters) {
            const accessMap: Record<string, { hasAccess: boolean; isFree: boolean }> = {};
            accessibleChapters.forEach(ch => {
              accessMap[ch.id] = {
                hasAccess: ch.has_access,
                isFree: ch.is_free
              };
            });
            setChapterAccessInfo(accessMap);
            console.log('🔐 Chapter access info loaded:', accessMap);
          }
        }
        
        // Load user rating
        const { data: ratingData, error: ratingError } = await supabase
          .from('content_ratings')
          .select('rating')
          .eq('user_id', user.id)
          .eq('content_item_id', loadedItem.id)
          .single();
          
        if (ratingError && ratingError.code !== 'PGRST116') {
          console.warn('⚠️ Error loading user rating:', ratingError);
        } else if (ratingData) {
          setUserRating(ratingData.rating);
          console.log('⭐ User rating loaded:', ratingData.rating);
        }
      } else {
        // For non-logged-in users, still get chapter access info
        if (loadedItem.type === 'issue' && loadedItem.chapters) {
          const { data: accessibleChapters, error: accessError } = await supabase
            .rpc('get_accessible_chapters_for_issue', {
              p_issue_id: loadedItem.id,
              p_user_id: null
            });
            
          if (accessError) {
            console.warn('⚠️ Error loading chapter access info for anonymous user:', accessError);
          } else if (accessibleChapters) {
            const accessMap: Record<string, { hasAccess: boolean; isFree: boolean }> = {};
            accessibleChapters.forEach(ch => {
              accessMap[ch.id] = {
                hasAccess: ch.has_access,
                isFree: ch.is_free
              };
            });
            setChapterAccessInfo(accessMap);
            console.log('🔓 Chapter access info loaded for anonymous user:', accessMap);
          }
        }
      }
    } catch (error) {
      console.error('💥 CONTENT ITEM DETAIL - Error loading:', error);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToLibrary = async () => {
    if (!user || !item) return;
    
    try {
      console.log('➕ Adding to library:', item.id);
      const { error } = await supabase
        .from('user_library')
        .insert({
          user_id: user.id,
          content_item_id: item.id
        });
      
      if (error) {
        if (error.code === '23505') {
          // Already in library
          console.log('ℹ️ Item already in library');
          setInUserLibrary(true);
          return;
        }
        throw error;
      }
      
      console.log('✅ Added to library successfully');
      setInUserLibrary(true);
    } catch (error) {
      console.error('❌ Error adding to library:', error);
      alert('Failed to add to library. Please try again.');
    }
  };
  
  const handleRemoveFromLibrary = async () => {
    if (!user || !item) return;
    
    try {
      console.log('➖ Removing from library:', item.id);
      const { error } = await supabase
        .from('user_library')
        .delete()
        .eq('user_id', user.id)
        .eq('content_item_id', item.id);
      
      if (error) throw error;
      
      console.log('✅ Removed from library successfully');
      setInUserLibrary(false);
      setUserProgress({}); // Clear reading progress
    } catch (error) {
      console.error('❌ Error removing from library:', error);
      alert('Failed to remove from library. Please try again.');
    }
  };
  
  const handleStartReading = (chapterSlug: string) => {
    if (!item) return;
    console.log('🚀 Starting reading:', { itemSlug: item.slug, chapterSlug });
    // Use the clean URL structure
    navigate(getChapterReadingUrl(item.slug, chapterSlug));
  };
  
  const handleRateContent = async (rating: number) => {
    if (!user || !item) return;
    
    try {
      console.log('⭐ Rating content:', item.id, rating);
      
      // Upsert user rating
      const { error } = await supabase
        .from('content_ratings')
        .upsert({
          user_id: user.id,
          content_item_id: item.id,
          rating: rating
        });
      
      if (error) throw error;
      
      console.log('✅ Rating saved successfully');
      setUserRating(rating);
    } catch (error) {
      console.error('❌ Error rating content:', error);
      alert('Failed to save rating. Please try again.');
    }
  };
  
  const handleQuickStartReading = async () => {
    if (!item || item.type !== 'issue') return;
    
    try {
      // Use our utility to get the first accessible chapter
      const startUrl = await getStartReadingUrl(item.slug, user?.id);
      
      if (startUrl) {
        navigate(startUrl);
      } else {
        // No accessible chapters - show appropriate message
        if (!user) {
          navigate('/login');
        } else {
          navigate('/subscriptions');
        }
      }
    } catch (error) {
      console.error('❌ Error getting start reading URL:', error);
      // Fallback - go to first chapter
      if (item.chapters && item.chapters.length > 0) {
        const firstChapter = item.chapters.sort((a, b) => a.chapter_number - b.chapter_number)[0];
        navigate(getChapterReadingUrl(item.slug, firstChapter.slug));
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading content...</h3>
          <p className="text-gray-600">Fetching {type} details</p>
        </div>
      </div>
    );
  }
  
  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Content Not Found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error === 'Content not found' 
              ? `The requested ${type} could not be found.` 
              : 'There was an error loading the content.'}
          </p>
          <div className="space-x-3">
            <Link 
              to="/library"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Library</span>
            </Link>
            <button
              onClick={loadItemDetails}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const publishedChapters = item.chapters?.filter(chapter => chapter.status === 'published') || [];
  const totalChapters = item.chapters?.length || 0;
  const completedChapters = Object.values(userProgress).filter(p => p.completed).length;
  const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  
  console.log('\n📊 CONTENT ITEM DETAIL - Render stats:', {
    publishedChapters: publishedChapters.length,
    totalChapters,
    completedChapters,
    overallProgress
  });
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <Breadcrumb item={item} breadcrumbs={breadcrumbs} />
        )}
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cover and Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Cover Image */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-4">
                  {item.cover_image_url ? (
                    <img 
                      src={item.cover_image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Type Badge */}
                <div className="text-center mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {HIERARCHY_LEVELS[item.type].label}
                  </span>
                </div>
                
                {/* Main Action Buttons */}
                <div className="space-y-3">
                  {/* Add/Remove from Library */}
                  {user ? (
                    <button
                      onClick={inUserLibrary ? handleRemoveFromLibrary : handleAddToLibrary}
                      className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                        inUserLibrary
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {inUserLibrary ? (
                        <><Check className="w-5 h-5" />In Your Library</>
                      ) : (
                        <><Plus className="w-5 h-5" />Add to Library</>
                      )}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <User className="w-5 h-5" />
                      <span>Login to Add</span>
                    </Link>
                  )}
                  
                  {/* Start/Continue Reading (for issues with chapters) */}
                  {item.type === 'issue' && publishedChapters.length > 0 && (
                    <>
                      {overallProgress > 0 ? (
                        <button
                          onClick={handleQuickStartReading}
                          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <Play className="w-5 h-5" />
                          <span>Continue Reading ({overallProgress}%)</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleQuickStartReading}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <BookOpen className="w-5 h-5" />
                          <span>Start Reading</span>
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Secondary Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>Favorite</span>
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-gray-900">{item.completion_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chapters</span>
                    <span className="font-medium text-gray-900">{publishedChapters.length}/{totalChapters}</span>
                  </div>
                  {item.metadata?.total_words && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Word Count</span>
                      <span className="font-medium text-gray-900">{item.metadata.total_words.toLocaleString()}</span>
                    </div>
                  )}
                  {item.metadata?.estimated_read_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Read Time</span>
                      <span className="font-medium text-gray-900">{item.metadata.estimated_read_time} min</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published</span>
                    <span className="font-medium text-gray-900">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Not published'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{item.title}</h1>
              <p className="text-xl text-gray-600 leading-relaxed">{item.description}</p>
              
              {/* Tags */}
              {item.metadata?.genre_tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.metadata.genre_tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Rating Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ratings & Reviews</h3>
              <RatingDisplay 
                rating={item.average_rating}
                reviewCount={item.rating_count}
                userRating={userRating}
                onRate={user ? handleRateContent : undefined}
              />
            </div>
            
            {/* Chapters List */}
            {item.type === 'issue' && item.chapters && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Chapters</h3>
                      <p className="text-sm text-gray-600">
                        {publishedChapters.length} of {totalChapters} published
                        {inUserLibrary && ` • ${completedChapters} completed`}
                      </p>
                    </div>
                    
                    {inUserLibrary && overallProgress > 0 && (
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Overall Progress</div>
                        <div className="text-lg font-semibold text-indigo-600">{overallProgress}%</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  {item.chapters
                    .sort((a, b) => a.chapter_number - b.chapter_number)
                    .map((chapter) => {
                      const accessInfo = chapterAccessInfo[chapter.id] || { hasAccess: false, isFree: true };
                      
                      console.log(`\n🎯 RENDERING CHAPTER CARD IN DETAIL PAGE: "${chapter.title}"`);
                      console.log('   Chapter ID:', chapter.id);
                      console.log('   Banner file ID:', chapter.banner_file_id || 'NONE');
                      console.log('   Access info:', accessInfo);
                      
                      return (
                        <ChapterCardLocal
                          key={chapter.id}
                          chapter={chapter}
                          progress={userProgress[chapter.id]}
                          onStartReading={handleStartReading}
                          canRead={inUserLibrary || !user} // Can read if in library or not logged in (preview)
                          issueSlug={item.slug}
                          isAccessible={accessInfo.hasAccess}
                          isFree={accessInfo.isFree}
                        />
                      );
                    })
                  }
                </div>
              </div>
            )}
            
            {/* Child Items (for non-issue types) */}
            {item.type !== 'issue' && item.children && item.children.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {HIERARCHY_LEVELS[item.children[0].type]?.label}s in this {HIERARCHY_LEVELS[item.type].label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.children.length} items available
                  </p>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={`/library/${child.type}/${child.slug}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {child.cover_image_url ? (
                            <img 
                              src={child.cover_image_url} 
                              alt={child.title}
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
                            {child.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {child.description}
                          </p>
                          
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span>{child.average_rating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BarChart3 className="w-3 h-3" />
                              <span>{child.completion_percentage}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}