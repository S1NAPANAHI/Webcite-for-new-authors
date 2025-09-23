import React, { useState, useEffect, useMemo } from 'react';
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
  Crown,
  Book,
  Bookmark,
  Layers,
  Archive
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
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground/60" />}
          {crumb.current ? (
            <span className="text-foreground font-medium">{crumb.title}</span>
          ) : (
            <Link 
              to={crumb.href}
              className="hover:text-primary transition-colors duration-200"
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
                : 'text-muted-foreground/40'
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
        <span className="text-lg font-semibold text-foreground">{rating.toFixed(1)}</span>
        <span className="text-muted-foreground">({reviewCount} reviews)</span>
      </div>
      
      {/* User Rating */}
      {onRate && (
        <div className="border-t border-border pt-3">
          <p className="text-sm font-medium text-foreground mb-2">Rate this content:</p>
          <div className="flex items-center space-x-1">
            {renderStars(userRating || 0, true)}
            {userRating && (
              <span className="text-sm text-muted-foreground ml-2">Your rating: {userRating}/5</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Get appropriate icon for content type
function getContentTypeIcon(type: ContentItemType) {
  switch (type) {
    case 'book': return Book;
    case 'volume': return Bookmark;
    case 'saga': return Layers;
    case 'arc': return Archive;
    case 'issue': return FileText;
    default: return BookOpen;
  }
}

// Enhanced Child Items Display Component
interface ChildItemsGridProps {
  item: ContentItemWithChildren;
  childType: ContentItemType;
}

function ChildItemsGrid({ item, childType }: ChildItemsGridProps) {
  const [childItems, setChildItems] = useState<ContentItemWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const childLevel = HIERARCHY_LEVELS[childType];
  const IconComponent = getContentTypeIcon(childType);
  
  useEffect(() => {
    loadChildItems();
  }, [item.id, childType]);
  
  const loadChildItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`\n🔍 Loading child items of type '${childType}' for parent:`, item.id);
      
      const { data, error } = await supabase
        .from('content_items')
        .select(`
          *,
          chapters:chapters(count)
        `)
        .eq('parent_id', item.id)
        .eq('type', childType)
        .eq('status', 'published')
        .order('order_index', { ascending: true });
      
      if (error) {
        console.error(`❌ Error loading ${childType}s:`, error);
        setError(`Failed to load ${childLevel.label.toLowerCase()}s`);
        return;
      }
      
      console.log(`✅ Loaded ${data?.length || 0} ${childType}s:`, data);
      setChildItems(data || []);
    } catch (err) {
      console.error(`💥 Error loading ${childType}s:`, err);
      setError(`Failed to load ${childLevel.label.toLowerCase()}s`);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 text-primary animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading {childLevel.label.toLowerCase()}s...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-2">{error}</div>
          <button 
            onClick={loadChildItems}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  if (childItems.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center py-12">
          <IconComponent className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No {childLevel.label.toLowerCase()}s yet
          </h3>
          <p className="text-muted-foreground">
            This {HIERARCHY_LEVELS[item.type].label.toLowerCase()} doesn't have any {childLevel.label.toLowerCase()}s published yet.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IconComponent className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              {childLevel.label}s in this {HIERARCHY_LEVELS[item.type].label}
            </h3>
          </div>
          <span className="text-sm text-muted-foreground">
            {childItems.length} {childItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Browse all {childLevel.label.toLowerCase()}s contained within "{item.title}"
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {childItems.map((child) => {
            const coverUrl = child.cover_image_url || (child.cover_file_id ? `/api/files/${child.cover_file_id}` : null);
            const chapterCount = Array.isArray(child.chapters) ? child.chapters.length : (child.chapters as any)?.count || 0;
            
            return (
              <Link
                key={child.id}
                to={`/library/${child.type}/${child.slug}`}
                className="group block bg-background rounded-lg border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {/* Cover Image */}
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  {coverUrl ? (
                    <img 
                      src={coverUrl} 
                      alt={child.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const container = target.parentElement;
                        if (container) {
                          const iconSvg = childType === 'book' ? 
                            '<svg class="w-12 h-12 text-muted-foreground mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>' :
                            childType === 'volume' ?
                            '<svg class="w-12 h-12 text-muted-foreground mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>' :
                            childType === 'saga' ?
                            '<svg class="w-12 h-12 text-muted-foreground mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' :
                            childType === 'arc' ?
                            '<svg class="w-12 h-12 text-muted-foreground mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 15l-1.5 2.5V9.5l7-2 7 2v8L17.5 15 12 17.5z"/></svg>' :
                            '<svg class="w-12 h-12 text-muted-foreground mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>';
                          
                          container.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-muted">
                              <div class="text-center">
                                ${iconSvg}
                                <div class="text-xs text-muted-foreground">${childLevel.label}</div>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <div className="text-center">
                        <IconComponent className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <div className="text-xs text-muted-foreground">{childLevel.label}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 flex-1">
                      {child.title}
                    </h4>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2 mt-1" />
                  </div>
                  
                  {child.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {child.description}
                    </p>
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      {/* Rating */}
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{child.average_rating.toFixed(1)}</span>
                      </div>
                      
                      {/* Completion */}
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-3 h-3" />
                        <span>{child.completion_percentage}%</span>
                      </div>
                      
                      {/* Chapter count for issues */}
                      {child.type === 'issue' && chapterCount > 0 && (
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>{chapterCount} ch</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Published date */}
                    {child.published_at && (
                      <div className="text-xs text-muted-foreground">
                        {new Date(child.published_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {/* Progress bar for completion */}
                  {child.completion_percentage > 0 && (
                    <div className="mt-3">
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-200" 
                          style={{ width: `${child.completion_percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
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
  
  // FIXED: Memoize cover image resolution to prevent infinite re-renders
  const coverUrlFromFile = useFileUrl(item?.cover_file_id);
  const finalCoverUrl = useMemo(() => {
    return coverUrlFromFile || item?.cover_image_url || null;
  }, [coverUrlFromFile, item?.cover_image_url]);
  
  // Determine what type of children this item should have
  const childType = useMemo(() => {
    if (!item) return null;
    
    const currentOrder = HIERARCHY_LEVELS[item.type as ContentItemType]?.order;
    if (currentOrder === undefined) return null;
    
    // Find the next level in the hierarchy
    const nextLevel = Object.entries(HIERARCHY_LEVELS).find(
      ([_, level]) => level.order === currentOrder + 1
    );
    
    return nextLevel ? (nextLevel[0] as ContentItemType) : null;
  }, [item?.type]);
  
  // Only run this effect when the route parameters change or user changes
  useEffect(() => {
    if (type && slug) {
      loadItemDetails();
    }
  }, [type, slug, user?.id]); // Added user?.id to dependency array
  
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
        type: itemData.type,
        cover_image_url: itemData.cover_image_url,
        cover_file_id: itemData.cover_file_id,
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
        try {
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
        } catch (err) {
          console.warn('⚠️ Failed to check library status:', err);
          setInUserLibrary(false);
        }
        
        // Load user progress for chapters if this is an issue
        if (loadedItem.type === 'issue' && loadedItem.chapters) {
          const chapterIds = loadedItem.chapters.map(ch => ch.id);
          if (chapterIds.length > 0) {
            try {
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
            } catch (err) {
              console.warn('⚠️ Failed to load reading progress:', err);
            }
          }
          
          // Get chapter access info using new database function
          try {
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
          } catch (err) {
            console.warn('⚠️ Failed to load chapter access info:', err);
          }
        }
        
        // Load user rating - FIXED: Skip if content_ratings table doesn't exist
        try {
          const { data: ratingData, error: ratingError } = await supabase
            .from('content_ratings')
            .select('rating')
            .eq('user_id', user.id)
            .eq('content_item_id', loadedItem.id)
            .single();
            
          if (ratingError && ratingError.code !== 'PGRST116') {
            console.warn('⚠️ Error loading user rating:', ratingError);
            // If it's a 406 error (table doesn't exist), just skip rating functionality
            if (ratingError.message?.includes('406')) {
              console.log('🚫 Rating system not available - content_ratings table missing');
            }
          } else if (ratingData) {
            setUserRating(ratingData.rating);
            console.log('⭐ User rating loaded:', ratingData.rating);
          }
        } catch (err) {
          console.warn('⚠️ Failed to load user rating:', err);
        }
      } else {
        // For non-logged-in users, still get chapter access info
        if (loadedItem.type === 'issue' && loadedItem.chapters) {
          try {
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
          } catch (err) {
            console.warn('⚠️ Failed to load chapter access info for anonymous user:', err);
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
  
  // Memoize computed values to prevent unnecessary re-renders
  const publishedChapters = useMemo(() => {
    return item?.chapters?.filter(chapter => chapter.status === 'published') || [];
  }, [item?.chapters]);
  
  const totalChapters = useMemo(() => {
    return item?.chapters?.length || 0;
  }, [item?.chapters]);
  
  const completedChapters = useMemo(() => {
    return Object.values(userProgress).filter(p => p.completed).length;
  }, [userProgress]);
  
  const overallProgress = useMemo(() => {
    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  }, [totalChapters, completedChapters]);
  
  if (loading) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Loading content...</h3>
        <p className="text-muted-foreground">Fetching {type} details</p>
      </div>
    </div>
  );
}
  
  if (error || !item) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {error || 'Content Not Found'}
        </h2>
        <p className="text-muted-foreground mb-4">
          {error === 'Content not found' 
              ? `The requested ${type} could not be found.` 
              : 'There was an error loading the content.'}
        </p>
        <div className="space-x-3">
          <Link 
            to="/library"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
  
  console.log('\n📊 CONTENT ITEM DETAIL - Render stats:', {
    publishedChapters: publishedChapters.length,
    totalChapters,
    completedChapters,
    overallProgress,
    childType
  });
  
  console.log('🎨 COVER IMAGE DEBUG:', {
    cover_file_id: item.cover_file_id,
    cover_image_url: item.cover_image_url,
    resolved_from_file: coverUrlFromFile,
    final_cover_url: finalCoverUrl
  });
  
  return (
    <div className="min-h-screen bg-background py-8">
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
              <div className="bg-card rounded-lg border border-border p-6 mb-6">
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                  {finalCoverUrl ? (
                    <img 
                      src={finalCoverUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onLoad={() => console.log('✅ Cover image loaded:', finalCoverUrl)}
                      onError={(e) => {
                        console.error('❌ Cover image failed to load:', finalCoverUrl);
                        // Show fallback icon instead of broken image
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const container = target.parentElement;
                        if (container) {
                          container.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <svg class="w-16 h-16 text-muted-foreground/60" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.21L14.5 17H9z"/>
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-muted-foreground/60" />
                    </div>
                  )}
                </div>
                
                {/* Type Badge */}
                <div className="text-center mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
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
                          : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg'
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
                      className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
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
                    <button className="flex-1 px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200 flex items-center justify-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>Favorite</span>
                    </button>
                    <button className="flex-1 px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200 flex items-center justify-center space-x-1">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium text-foreground">{item.completion_percentage}%</span>
                  </div>
                  {item.type === 'issue' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chapters</span>
                      <span className="font-medium text-foreground">{publishedChapters.length}/{totalChapters}</span>
                    </div>
                  )}
                  {item.metadata?.total_words && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Word Count</span>
                      <span className="font-medium text-foreground">{item.metadata.total_words.toLocaleString()}</span>
                    </div>
                  )}
                  {item.metadata?.estimated_read_time && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Read Time</span>
                      <span className="font-medium text-foreground">{item.metadata.estimated_read_time} min</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published</span>
                    <span className="font-medium text-foreground">
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
              <h1 className="text-4xl font-bold text-foreground mb-4">{item.title}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">{item.description}</p>
              
              {/* Tags */}
              {item.metadata?.genre_tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.metadata.genre_tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Rating Section */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Ratings & Reviews</h3>
              <RatingDisplay 
                rating={item.average_rating}
                reviewCount={item.rating_count}
                userRating={userRating}
                onRate={user ? handleRateContent : undefined}
              />
            </div>
            
            {/* Chapters List (for issues only) */}
            {item.type === 'issue' && item.chapters && (
              <div className="bg-card rounded-lg border border-border">
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Chapters</h3>
                      <p className="text-sm text-muted-foreground">
                        {publishedChapters.length} of {totalChapters} published
                        {inUserLibrary && ` • ${completedChapters} completed`}
                      </p>
                    </div>
                    
                    {inUserLibrary && overallProgress > 0 && (
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Overall Progress</div>
                        <div className="text-lg font-semibold text-primary">{overallProgress}%</div>
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
            
            {/* Child Items - Enhanced hierarchical display */}
            {childType && (
              <ChildItemsGrid 
                item={item} 
                childType={childType}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}