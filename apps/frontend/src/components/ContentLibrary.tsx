import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, User, Star, ChevronRight, Eye, Lock, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getFileUrl } from '../utils/fileUpload';

interface FileRecord {
  id: string;
  name: string;
  url?: string;
  storage_path?: string;
  alt_text?: string;
}

interface Author {
  id: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
}

interface Chapter {
  id: string;
  title: string;
  slug: string;
  chapter_number: number;
  plain_content: string;
  word_count?: number;
  estimated_read_time?: number;
  is_free: boolean;
  subscription_tier_required: string;
  status: string;
  created_at: string;
  // NEW: Visual assets
  hero_file_id?: string | null;
  banner_file_id?: string | null;
  banner_file?: FileRecord;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  slug: string;
  type: 'issue' | 'series' | 'standalone';
  status: 'draft' | 'published' | 'archived';
  cover_url?: string;
  cover_file_id?: string | null;
  cover_file?: FileRecord;
  published_at: string;
  created_at: string;
  authors: Author[];
  chapters: Chapter[];
  tags: string[];
  reading_stats?: {
    total_chapters: number;
    total_words: number;
    estimated_read_time: number;
    free_chapters: number;
  };
}

interface ContentLibraryProps {
  searchQuery?: string;
  selectedTags?: string[];
  filterType?: 'all' | 'issue' | 'series' | 'standalone';
  sortBy?: 'newest' | 'oldest' | 'title' | 'popular';
}

const ContentLibrary: React.FC<ContentLibraryProps> = ({
  searchQuery = '',
  selectedTags = [],
  filterType = 'all',
  sortBy = 'newest'
}) => {
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [searchQuery, selectedTags, filterType, sortBy]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading content library...');
      
      // Build query for content items
      let query = supabase
        .from('content_items')
        .select(`
          *,
          cover_file:files!cover_file_id(*)
        `)
        .eq('status', 'published');
      
      // Apply filters
      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }
      
      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'oldest':
          query = query.order('published_at', { ascending: true });
          break;
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('published_at', { ascending: false });
          break;
      }
      
      const { data: contentData, error: contentError } = await query;
      
      if (contentError) {
        throw contentError;
      }
      
      console.log('Loaded content items:', contentData);
      
      // Load chapters with banner files for each content item
      const contentWithChapters = await Promise.all(
        (contentData || []).map(async (item) => {
          const { data: chaptersData } = await supabase
            .from('chapters')
            .select(`
              *,
              banner_file:files!banner_file_id(*)
            `)
            .eq('issue_id', item.id)
            .eq('status', 'published')
            .order('chapter_number');
          
          // Process chapters with banner files
          const processedChapters = (chaptersData || []).map(chapter => ({
            ...chapter,
            banner_file: chapter.banner_file?.[0] || null
          }));
          
          // Calculate reading stats
          const totalWords = processedChapters.reduce((sum, ch) => sum + (ch.word_count || 0), 0);
          const totalReadTime = processedChapters.reduce((sum, ch) => sum + (ch.estimated_read_time || 0), 0);
          const freeChapters = processedChapters.filter(ch => ch.is_free).length;
          
          // Load authors
          const { data: authorsData } = await supabase
            .from('content_authors')
            .select(`
              profiles!inner(*)
            `)
            .eq('content_item_id', item.id);
          
          const authors = (authorsData || []).map(ca => ca.profiles).filter(Boolean);
          
          return {
            ...item,
            cover_file: item.cover_file?.[0] || null,
            chapters: processedChapters,
            authors: authors.map(author => ({
              id: author.id,
              display_name: author.display_name || author.username || 'Anonymous',
              bio: author.bio,
              avatar_url: author.avatar_url
            })),
            reading_stats: {
              total_chapters: processedChapters.length,
              total_words: totalWords,
              estimated_read_time: totalReadTime,
              free_chapters: freeChapters
            }
          };
        })
      );
      
      console.log('Final content with chapters:', contentWithChapters);
      setContent(contentWithChapters);
      
    } catch (err) {
      console.error('Error loading content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleReadContent = (item: ContentItem) => {
    const firstChapter = item.chapters[0];
    if (firstChapter) {
      navigate(`/read/${item.slug}/${firstChapter.slug}`);
    } else {
      navigate(`/read/${item.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Content
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={loadContent}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Content Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery || selectedTags.length > 0 || filterType !== 'all'
            ? 'No content matches your current filters. Try adjusting your search criteria.'
            : 'No published content available yet. Check back soon!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((item) => {
        const coverUrl = item.cover_file ? getFileUrl(item.cover_file) : null;
        const firstChapterBanner = item.chapters[0]?.banner_file ? getFileUrl(item.chapters[0].banner_file) : null;
        const backgroundImage = coverUrl || firstChapterBanner;
        
        return (
          <article
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
            onClick={() => handleReadContent(item)}
          >
            {/* FIXED: Cover/Banner Image Display */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
              {backgroundImage ? (
                <>
                  <img
                    src={backgroundImage}
                    alt={item.cover_file?.alt_text || `Cover for ${item.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onLoad={() => console.log(`Cover/banner loaded for ${item.title}`)}
                    onError={(e) => {
                      console.error(`Cover/banner failed to load for ${item.title}`);
                      // Hide the image and show gradient background
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </>
              ) : (
                // Fallback gradient when no image
                <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
              )}
              
              {/* Content type badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                  {item.type === 'issue' ? '📰 Issue' :
                   item.type === 'series' ? '📚 Series' :
                   '📝 Standalone'}
                </span>
              </div>
              
              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 group-hover:text-blue-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/80 text-sm line-clamp-1">
                  by {item.authors.map(a => a.display_name).join(', ')}
                </p>
              </div>
            </div>
            
            {/* Content Info */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>
              
              {/* Stats and Actions */}
              <div className="space-y-3">
                {/* Reading Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      📄 {item.reading_stats?.total_chapters || 0} chapters
                    </span>
                    <span className="flex items-center gap-1">
                      🕰 {item.reading_stats?.estimated_read_time || 0} min
                    </span>
                  </div>
                  
                  {item.reading_stats && item.reading_stats.free_chapters > 0 && (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <Gift className="w-3 h-3" />
                      {item.reading_stats.free_chapters} free
                    </span>
                  )}
                </div>
                
                {/* Chapter List Preview */}
                {item.chapters.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Chapters ({item.chapters.length})
                    </h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {item.chapters.slice(0, 5).map((chapter) => (
                        <div 
                          key={chapter.id} 
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/read/${item.slug}/${chapter.slug}`);
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {/* FIXED: Chapter thumbnail with banner */}
                            <div className="w-8 h-8 rounded overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0">
                              {chapter.banner_file ? (
                                <img
                                  src={getFileUrl(chapter.banner_file)}
                                  alt={chapter.banner_file.alt_text || chapter.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Hide broken image and show gradient fallback
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                  {chapter.chapter_number}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Ch. {chapter.chapter_number}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {chapter.title}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {chapter.estimated_read_time || 1} min
                                </span>
                                
                                {chapter.is_free ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    <Gift className="w-3 h-3" />
                                    FREE
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                    <Lock className="w-3 h-3" />
                                    {chapter.subscription_tier_required.toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                        </div>
                      ))}
                      
                      {item.chapters.length > 5 && (
                        <div className="text-center py-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{item.chapters.length - 5} more chapters
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Action Button */}
                <div className="pt-2">
                  <button 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReadContent(item);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Start Reading</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ContentLibrary;