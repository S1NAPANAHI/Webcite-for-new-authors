import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, User, Star, ChevronRight, Eye, Lock, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ChapterCard from './ChapterCard';
import { generateFileUrl } from '../utils/fileUrls';

interface FileRecord {
  id: string;
  name: string;
  url?: string;
  storage_path?: string;
  path?: string;
  bucket?: string;
  alt_text?: string;
}

// FIXED: Direct file URL generation
const getFileUrl = (file: FileRecord): string => {
  return generateFileUrl(file) || '';
};

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
  hero_file_id?: string | null;
  banner_file_id?: string | null;
  banner_file?: FileRecord;
  has_access?: boolean;
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

  // FIXED: Enhanced content loading with proper file relationships
  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 CONTENT LIBRARY - Loading content...');
      
      // FIXED: Load content items first
      let query = supabase
        .from('content_items')
        .select('*')
        .eq('status', 'published');
      
      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }
      
      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }
      
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
      
      console.log('✅ CONTENT LIBRARY - Loaded content items:', contentData?.length || 0);
      
      // FIXED: Load everything separately for better debugging
      const contentWithDetails = [];
      
      for (const item of contentData || []) {
        console.log(`\n🔍 PROCESSING ISSUE: ${item.title} (${item.slug})`);
        
        // Load cover file if exists
        let coverFile = null;
        if (item.cover_file_id) {
          console.log(`📸 Loading cover file: ${item.cover_file_id}`);
          const { data: coverData, error: coverError } = await supabase
            .from('files')
            .select('*')
            .eq('id', item.cover_file_id)
            .single();
          
          if (coverError) {
            console.warn(`⚠️ Failed to load cover file ${item.cover_file_id}:`, coverError);
          } else {
            console.log(`✅ Cover file loaded:`, coverData?.name);
            coverFile = coverData;
          }
        }
        
        // Load chapters
        console.log(`📚 Loading chapters for issue: ${item.id}`);
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('*')
          .eq('issue_id', item.id)
          .eq('status', 'published')
          .order('chapter_number');
        
        if (chaptersError) {
          console.error(`❌ Failed to load chapters for ${item.title}:`, chaptersError);
        } else {
          console.log(`✅ Loaded ${chaptersData?.length || 0} chapters for ${item.title}`);
          
          // DEBUG: Log first chapter details
          if (chaptersData && chaptersData.length > 0) {
            const firstChapter = chaptersData[0];
            console.log(`🎯 FIRST CHAPTER: "${firstChapter.title}" (Ch. ${firstChapter.chapter_number})`);
            console.log(`   Banner file ID: ${firstChapter.banner_file_id || 'NONE'}`);
            console.log(`   Hero file ID: ${firstChapter.hero_file_id || 'NONE'}`);
          }
        }
        
        // Load banner files for chapters
        const chaptersWithBanners = [];
        
        for (const chapter of chaptersData || []) {
          let bannerFile = null;
          
          if (chapter.banner_file_id) {
            console.log(`🖼️ Loading banner file for "${chapter.title}": ${chapter.banner_file_id}`);
            const { data: bannerData, error: bannerError } = await supabase
              .from('files')
              .select('*')
              .eq('id', chapter.banner_file_id)
              .single();
            
            if (bannerError) {
              console.warn(`⚠️ Failed to load banner file ${chapter.banner_file_id}:`, bannerError);
            } else {
              console.log(`✅ Banner file loaded for "${chapter.title}":`, bannerData?.name);
              console.log(`   Banner path: ${bannerData?.path || bannerData?.storage_path}`);
              const testUrl = generateFileUrl(bannerData);
              console.log(`   Generated URL: ${testUrl}`);
              bannerFile = bannerData;
            }
          } else {
            console.log(`ℹ️ No banner file ID for "${chapter.title}"`);
          }
          
          chaptersWithBanners.push({
            ...chapter,
            banner_file: bannerFile,
            has_access: true // TODO: Implement proper access control
          });
        }
        
        // Load authors (simplified)
        const { data: authorsData } = await supabase
          .from('content_authors')
          .select(`
            profiles!inner(*)
          `)
          .eq('content_item_id', item.id);
        
        const authors = (authorsData || []).map(ca => ca.profiles).filter(Boolean);
        
        // Calculate stats
        const totalWords = chaptersWithBanners.reduce((sum, ch) => sum + (ch.word_count || 0), 0);
        const totalReadTime = chaptersWithBanners.reduce((sum, ch) => sum + (ch.estimated_read_time || 0), 0);
        const freeChapters = chaptersWithBanners.filter(ch => ch.is_free).length;
        
        const processedItem = {
          ...item,
          cover_file: coverFile,
          chapters: chaptersWithBanners,
          authors: authors.map(author => ({
            id: author.id,
            display_name: author.display_name || author.username || 'Anonymous',
            bio: author.bio,
            avatar_url: author.avatar_url
          })),
          reading_stats: {
            total_chapters: chaptersWithBanners.length,
            total_words: totalWords,
            estimated_read_time: totalReadTime,
            free_chapters: freeChapters
          }
        };
        
        console.log(`✅ PROCESSED ISSUE: ${item.title} - ${chaptersWithBanners.length} chapters`);
        contentWithDetails.push(processedItem);
      }
      
      console.log('\n🎉 FINAL CONTENT LIBRARY DATA:', contentWithDetails);
      setContent(contentWithDetails);
      
    } catch (err) {
      console.error('❌ CONTENT LIBRARY ERROR:', err);
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
    <>
      {/* MAIN ISSUES/SERIES CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {content.map((item) => {
          const coverUrl = item.cover_file ? getFileUrl(item.cover_file) : null;
          const firstChapterBanner = item.chapters[0]?.banner_file ? getFileUrl(item.chapters[0].banner_file) : null;
          const backgroundImage = coverUrl || firstChapterBanner;
          
          console.log(`\n🎨 RENDERING ISSUE CARD: ${item.title}`);
          console.log('   Cover URL:', coverUrl);
          console.log('   First chapter banner:', firstChapterBanner);
          console.log('   Using background:', backgroundImage);
          
          return (
            <article
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              onClick={() => navigate(`/library/issue/${item.slug}`)}
            >
              {/* FIXED: Cover/Banner Image Display with Enhanced Debugging */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                {backgroundImage ? (
                  <>
                    <img
                      src={backgroundImage}
                      alt={item.cover_file?.alt_text || `Cover for ${item.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onLoad={() => {
                        console.log(`✅ ISSUE COVER loaded: ${item.title}`);
                      }}
                      onError={(e) => {
                        console.error(`❌ ISSUE COVER failed: ${item.title}`, backgroundImage);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
                )}
                
                {/* DEBUG: Show image status */}
                <div className="absolute top-2 right-2 space-y-1">
                  {backgroundImage && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      📸 IMG
                    </div>
                  )}
                  {!backgroundImage && (
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      ❌ NO IMG
                    </div>
                  )}
                </div>
                
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                    {item.type === 'issue' ? '📰 Issue' :
                     item.type === 'series' ? '📚 Series' :
                     '📝 Standalone'}
                  </span>
                </div>
                
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
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <span>📄 {item.reading_stats?.total_chapters || 0} chapters</span>
                      <span>🕰 {item.reading_stats?.estimated_read_time || 0} min</span>
                    </div>
                    
                    {item.reading_stats && item.reading_stats.free_chapters > 0 && (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <Gift className="w-3 h-3" />
                        {item.reading_stats.free_chapters} free
                      </span>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/library/issue/${item.slug}`);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Chapters</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      
      {/* INDIVIDUAL CHAPTER CARDS SECTION */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📖 All Chapters (Debug Mode)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {content.flatMap(item => 
            item.chapters.map(chapter => {
              console.log(`\n🎯 RENDERING CHAPTER CARD: "${chapter.title}"`);
              console.log(`   Issue: ${item.title} (${item.slug})`);
              console.log(`   Banner file ID: ${chapter.banner_file_id || 'NONE'}`);
              console.log(`   Has banner file object: ${!!chapter.banner_file}`);
              
              return (
                <ChapterCard
                  key={`${item.slug}-${chapter.id}`}
                  chapter={chapter}
                  issueSlug={item.slug}
                  className="debug-chapter-card"
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default ContentLibrary;