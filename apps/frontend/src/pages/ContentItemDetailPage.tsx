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
  Download
} from 'lucide-react';
import { useAuth } from '@zoroaster/shared';
import {
  ContentItemWithChildren,
  Chapter,
  ContentItemType,
  HIERARCHY_LEVELS,
  ReadingProgress
} from '../types/content';

// Mock detailed item data
const mockItemDetail: ContentItemWithChildren = {
  id: '5',
  type: 'issue',
  title: 'Issue #1: The Calling',
  slug: 'issue-1-the-calling',
  description: 'The journey begins with a mysterious calling. Darius receives visions that will change his life forever and set him on the path of his destiny. In this opening issue, we witness the moment when an ordinary young man discovers that he is destined for something far greater than he ever imagined.',
  cover_image_url: '/api/placeholder/400/600',
  parent_id: '4',
  order_index: 1,
  completion_percentage: 75,
  average_rating: 4.8,
  rating_count: 32,
  status: 'published',
  published_at: '2025-02-10T00:00:00Z',
  metadata: { 
    chapter_count: 4, 
    estimated_read_time: 60,
    total_words: 12000,
    genre_tags: ['Fantasy', 'Mythology', 'Persian', 'Epic']
  },
  created_at: '2025-01-20T00:00:00Z',
  updated_at: '2025-09-18T00:00:00Z',
  chapters: [
    {
      id: 'ch1',
      issue_id: '5',
      title: 'The Dream of Fire',
      slug: 'the-dream-of-fire',
      content: {},
      plain_content: 'In the depths of night, Darius received a vision of flames...',
      chapter_number: 1,
      word_count: 3200,
      estimated_read_time: 16,
      status: 'published',
      published_at: '2025-02-10T00:00:00Z',
      metadata: {},
      created_at: '2025-02-01T00:00:00Z',
      updated_at: '2025-02-10T00:00:00Z'
    },
    {
      id: 'ch2',
      issue_id: '5',
      title: 'The Sacred Grove',
      slug: 'the-sacred-grove',
      content: {},
      plain_content: 'The ancient grove held secrets older than memory...',
      chapter_number: 2,
      word_count: 2800,
      estimated_read_time: 14,
      status: 'published',
      published_at: '2025-02-15T00:00:00Z',
      metadata: {},
      created_at: '2025-02-05T00:00:00Z',
      updated_at: '2025-02-15T00:00:00Z'
    },
    {
      id: 'ch3',
      issue_id: '5',
      title: 'The First Test',
      slug: 'the-first-test',
      content: {},
      plain_content: 'Darius faced his first trial with courage in his heart...',
      chapter_number: 3,
      word_count: 3500,
      estimated_read_time: 17,
      status: 'published',
      published_at: '2025-02-20T00:00:00Z',
      metadata: {},
      created_at: '2025-02-10T00:00:00Z',
      updated_at: '2025-02-20T00:00:00Z'
    },
    {
      id: 'ch4',
      issue_id: '5',
      title: 'Revelation',
      slug: 'revelation',
      content: {},
      plain_content: 'The truth was revealed in ways Darius never expected...',
      chapter_number: 4,
      word_count: 2500,
      estimated_read_time: 13,
      status: 'draft',
      published_at: null,
      metadata: {},
      created_at: '2025-02-15T00:00:00Z',
      updated_at: '2025-09-18T00:00:00Z'
    }
  ]
};

// Mock user progress data
const mockUserProgress: Record<string, ReadingProgress> = {
  'ch1': {
    id: 'prog1',
    user_id: 'user1',
    chapter_id: 'ch1',
    progress_percentage: 100,
    last_read_at: '2025-09-15T00:00:00Z',
    completed: true,
    reading_time_minutes: 18,
    bookmarks: [],
    notes: []
  },
  'ch2': {
    id: 'prog2',
    user_id: 'user1',
    chapter_id: 'ch2',
    progress_percentage: 60,
    last_read_at: '2025-09-16T00:00:00Z',
    completed: false,
    reading_time_minutes: 10,
    bookmarks: [{ id: 'bm1', position: 45, label: 'Interesting point', created_at: '2025-09-16T00:00:00Z' }],
    notes: []
  }
};

interface ChapterCardProps {
  chapter: Chapter;
  progress?: ReadingProgress;
  onStartReading: (chapterId: string) => void;
  canRead: boolean;
}

function ChapterCard({ chapter, progress, onStartReading, canRead }: ChapterCardProps) {
  const isCompleted = progress?.completed || false;
  const progressPercentage = progress?.progress_percentage || 0;
  const canReadChapter = canRead && chapter.status === 'published';
  
  return (
    <div className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
      canReadChapter ? 'hover:shadow-md hover:border-indigo-200' : 'opacity-60'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-500">Chapter {chapter.chapter_number}</span>
            {isCompleted && (
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            {chapter.status === 'draft' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Coming Soon
              </span>
            )}
          </div>
          
          <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {chapter.title}
          </h4>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {chapter.plain_content}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>{chapter.word_count.toLocaleString()} words</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{chapter.estimated_read_time} min read</span>
            </div>
            {progress?.last_read_at && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Read {new Date(progress.last_read_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {progressPercentage > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-900 font-medium">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <div className="ml-4">
          {canReadChapter ? (
            <button
              onClick={() => onStartReading(chapter.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                progressPercentage > 0
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {progressPercentage > 0 ? (
                <><Play className="w-4 h-4" />Continue</>
              ) : (
                <><BookOpen className="w-4 h-4" />Start Reading</>
              )}
            </button>
          ) : (
            <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">
              {chapter.status === 'draft' ? 'Coming Soon' : 'Locked'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface BreadcrumbProps {
  item: ContentItemWithChildren;
}

function Breadcrumb({ item }: BreadcrumbProps) {
  // Mock breadcrumb data - in real app, you'd fetch the full hierarchy
  const breadcrumbs = [
    { title: 'Library', href: '/library' },
    { title: 'The Chronicles of Ahura', href: '/library/book/chronicles-of-ahura' },
    { title: 'Volume I: The Awakening', href: '/library/volume/volume-1-awakening' },
    { title: 'The Fire Temple Saga', href: '/library/saga/fire-temple-saga' },
    { title: 'The First Trial Arc', href: '/library/arc/first-trial-arc' },
    { title: item.title, href: '', current: true }
  ];
  
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

export default function ContentItemDetailPage() {
  const { type, slug } = useParams<{ type: string; slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState<ContentItemWithChildren | null>(mockItemDetail);
  const [userProgress, setUserProgress] = useState<Record<string, ReadingProgress>>(mockUserProgress);
  const [inUserLibrary, setInUserLibrary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  
  useEffect(() => {
    // In real app, fetch item details based on type and slug
    // Also check if it's in user's library and get progress data
    setLoading(true);
    setTimeout(() => {
      setInUserLibrary(true); // Mock: item is in user's library
      setLoading(false);
    }, 1000);
  }, [type, slug]);
  
  const handleAddToLibrary = async () => {
    if (!user || !item) return;
    
    try {
      // API call to add to library
      console.log('Adding to library:', item.id);
      setInUserLibrary(true);
    } catch (error) {
      console.error('Error adding to library:', error);
    }
  };
  
  const handleRemoveFromLibrary = async () => {
    if (!user || !item) return;
    
    try {
      // API call to remove from library
      console.log('Removing from library:', item.id);
      setInUserLibrary(false);
    } catch (error) {
      console.error('Error removing from library:', error);
    }
  };
  
  const handleStartReading = (chapterId: string) => {
    navigate(`/read/${item?.slug}/${chapterId}`);
  };
  
  const handleRateContent = async (rating: number) => {
    if (!user || !item) return;
    
    try {
      // API call to rate content
      console.log('Rating content:', item.id, rating);
      setUserRating(rating);
    } catch (error) {
      console.error('Error rating content:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Content Not Found</h2>
          <p className="text-gray-600 mb-4">The requested content could not be found.</p>
          <Link 
            to="/library"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </Link>
        </div>
      </div>
    );
  }
  
  const publishedChapters = item.chapters?.filter(chapter => chapter.status === 'published') || [];
  const totalChapters = item.chapters?.length || 0;
  const completedChapters = Object.values(userProgress).filter(p => p.completed).length;
  const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb item={item} />
        
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
                
                {/* Main Action Button */}
                <div className="space-y-3">
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
                  
                  {/* Continue Reading (if in progress) */}
                  {inUserLibrary && overallProgress > 0 && (
                    <Link
                      to={`/read/${item.slug}`}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Play className="w-5 h-5" />
                      <span>Continue Reading ({overallProgress}%)</span>
                    </Link>
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
                      {new Date(item.published_at!).toLocaleDateString()}
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
                  {item.chapters.map((chapter) => (
                    <ChapterCard
                      key={chapter.id}
                      chapter={chapter}
                      progress={userProgress[chapter.id]}
                      onStartReading={handleStartReading}
                      canRead={inUserLibrary || !user} // Can read if in library or not logged in (preview)
                    />
                  ))}
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