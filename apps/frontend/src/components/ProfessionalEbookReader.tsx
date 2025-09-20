import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Settings, Home, Maximize2, Minimize2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FileRecord {
  id: string;
  name: string;
  url?: string;
  storage_path?: string;
  alt_text?: string;
}

// FIXED: Direct file URL generation using Supabase storage
const getFileUrl = (file: FileRecord): string => {
  if (file.url) {
    return file.url;
  }
  
  if (file.storage_path) {
    const { data } = supabase.storage.from('media').getPublicUrl(file.storage_path);
    return data.publicUrl;
  }
  
  return '';
};

interface Chapter {
  id: string;
  title: string;
  content: any;
  plain_content: string;
  chapter_number: number;
  slug: string;
  word_count?: number;
  estimated_read_time?: number;
  // NEW: Visual assets
  hero_file_id?: string | null;
  banner_file_id?: string | null;
  hero_file?: FileRecord;
  banner_file?: FileRecord;
}

interface ReaderSettings {
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  fontFamily: 'serif' | 'sans' | 'mono';
  theme: 'light' | 'dark' | 'sepia';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  showHeroImages: boolean;
}

interface ProfessionalEbookReaderProps {
  issueSlug: string;
  chapterSlug?: string;
  onChapterChange?: (chapter: Chapter) => void;
}

const ProfessionalEbookReader: React.FC<ProfessionalEbookReaderProps> = ({
  issueSlug,
  chapterSlug,
  onChapterChange
}) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 'medium',
    fontFamily: 'serif',
    theme: 'light',
    lineHeight: 'normal',
    showHeroImages: true
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('ebook-reader-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.warn('Could not parse saved settings:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ebook-reader-settings', JSON.stringify(settings));
  }, [settings]);

  // FIXED: Load chapters with proper file loading
  useEffect(() => {
    const loadChaptersWithFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading chapters for issue:', issueSlug);
        
        // First get the issue ID
        const { data: issueData, error: issueError } = await supabase
          .from('content_items')
          .select('id, title')
          .eq('slug', issueSlug)
          .eq('type', 'issue')
          .single();
        
        console.log('Issue query result:', { issueData, issueError });
        
        if (issueError) {
          throw new Error(`Issue not found: ${issueError.message}`);
        }
        
        // FIXED: Load chapters first, then files separately
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('*')
          .eq('issue_id', issueData.id)
          .eq('status', 'published')
          .order('chapter_number');
        
        console.log('Chapters query result:', { chaptersData, chaptersError });
        
        if (chaptersError) {
          throw new Error(`Chapters not found: ${chaptersError.message}`);
        }
        
        if (!chaptersData || chaptersData.length === 0) {
          throw new Error('No published chapters found for this issue.');
        }
        
        // FIXED: Load files for each chapter individually
        const chaptersWithFiles = [];
        
        for (const chapter of chaptersData) {
          console.log(`Processing chapter ${chapter.chapter_number} (${chapter.title})`);
          console.log(`Hero file ID: ${chapter.hero_file_id}`);
          console.log(`Banner file ID: ${chapter.banner_file_id}`);
          
          let heroFile = null;
          let bannerFile = null;
          
          // Load hero file
          if (chapter.hero_file_id) {
            console.log(`Loading hero file: ${chapter.hero_file_id}`);
            const { data: heroData, error: heroError } = await supabase
              .from('files')
              .select('*')
              .eq('id', chapter.hero_file_id)
              .single();
            
            if (heroError) {
              console.warn(`Failed to load hero file ${chapter.hero_file_id}:`, heroError);
            } else {
              console.log(`Hero file loaded:`, heroData);
              heroFile = heroData;
            }
          }
          
          // Load banner file
          if (chapter.banner_file_id) {
            console.log(`Loading banner file: ${chapter.banner_file_id}`);
            const { data: bannerData, error: bannerError } = await supabase
              .from('files')
              .select('*')
              .eq('id', chapter.banner_file_id)
              .single();
            
            if (bannerError) {
              console.warn(`Failed to load banner file ${chapter.banner_file_id}:`, bannerError);
            } else {
              console.log(`Banner file loaded:`, bannerData);
              bannerFile = bannerData;
            }
          }
          
          chaptersWithFiles.push({
            ...chapter,
            hero_file: heroFile,
            banner_file: bannerFile
          });
        }
        
        console.log('Final chapters with files:', chaptersWithFiles);
        setChapters(chaptersWithFiles);
        
        // Set initial chapter
        let targetChapter = chaptersWithFiles[0];
        let targetIndex = 0;
        
        if (chapterSlug) {
          const found = chaptersWithFiles.find(ch => ch.slug === chapterSlug);
          if (found) {
            targetChapter = found;
            targetIndex = chaptersWithFiles.indexOf(found);
          }
        }
        
        console.log('Setting current chapter:', targetChapter);
        console.log('Hero file for current chapter:', targetChapter.hero_file);
        
        setCurrentChapter(targetChapter);
        setCurrentChapterIndex(targetIndex);
        
      } catch (err) {
        console.error('Error loading chapters:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chapters');
      } finally {
        setLoading(false);
      }
    };
    
    loadChaptersWithFiles();
  }, [issueSlug, chapterSlug]);

  const goToNextChapter = useCallback(() => {
    if (currentChapterIndex < chapters.length - 1) {
      const nextIndex = currentChapterIndex + 1;
      const nextChapter = chapters[nextIndex];
      setCurrentChapterIndex(nextIndex);
      setCurrentChapter(nextChapter);
      console.log('Moving to next chapter:', nextChapter.title, 'Hero file:', nextChapter.hero_file);
      onChapterChange?.(nextChapter);
    }
  }, [currentChapterIndex, chapters, onChapterChange]);

  const goToPreviousChapter = useCallback(() => {
    if (currentChapterIndex > 0) {
      const prevIndex = currentChapterIndex - 1;
      const prevChapter = chapters[prevIndex];
      setCurrentChapterIndex(prevIndex);
      setCurrentChapter(prevChapter);
      console.log('Moving to previous chapter:', prevChapter.title, 'Hero file:', prevChapter.hero_file);
      onChapterChange?.(prevChapter);
    }
  }, [currentChapterIndex, chapters, onChapterChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextChapter();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPreviousChapter();
      } else if (e.key === 'Escape') {
        setShowSettings(false);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToNextChapter, goToPreviousChapter]);

  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-yellow-50 text-yellow-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  const getFontClasses = () => {
    const fontSizes = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
      xl: 'text-xl'
    };
    
    const fontFamilies = {
      serif: 'font-serif',
      sans: 'font-sans',
      mono: 'font-mono'
    };
    
    const lineHeights = {
      tight: 'leading-tight',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed'
    };
    
    return `${fontSizes[settings.fontSize]} ${fontFamilies[settings.fontFamily]} ${lineHeights[settings.lineHeight]}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error || !currentChapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Chapter Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || 'The chapter you\'re looking for doesn\'t exist or isn\'t published yet.'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const progress = chapters.length > 0 ? ((currentChapterIndex + 1) / chapters.length) * 100 : 0;
  
  // FIXED: Hero image URL generation with enhanced debugging
  const heroImageUrl = useMemo(() => {
    if (!settings.showHeroImages || !currentChapter.hero_file) {
      console.log('No hero image:', { showHeroImages: settings.showHeroImages, heroFile: currentChapter.hero_file });
      return null;
    }
    
    const url = getFileUrl(currentChapter.hero_file);
    console.log('Generated hero image URL:', url);
    return url;
  }, [settings.showHeroImages, currentChapter.hero_file]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Back to library"
              >
                <Home className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {currentChapter.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chapter {currentChapter.chapter_number} of {chapters.length}
                  {currentChapter.estimated_read_time && (
                    <span className="ml-2">• {currentChapter.estimated_read_time} min read</span>
                  )}
                  {/* DEBUG: Show hero file status */}
                  {currentChapter.hero_file && (
                    <span className="ml-2 text-purple-600">• 🎨 Hero</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Reader settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 z-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 w-80">
          <h3 className="text-lg font-semibold mb-4">Reader Settings</h3>
          
          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <div className="grid grid-cols-4 gap-2">
                {(['small', 'medium', 'large', 'xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSettings(prev => ({ ...prev, fontSize: size }))}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      settings.fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {size === 'xl' ? 'XL' : size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* NEW: Hero Images Toggle */}
            <div>
              <label className="block text-sm font-medium mb-2">Visual Features</label>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showHeroImages"
                  checked={settings.showHeroImages}
                  onChange={(e) => setSettings(prev => ({ ...prev, showHeroImages: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="showHeroImages" className="text-sm flex items-center gap-2">
                  {settings.showHeroImages ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  Show hero images
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Display artwork at the beginning of chapters
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          {/* FIXED: Hero Image Display with Enhanced Debugging */}
          {heroImageUrl && settings.showHeroImages && (
            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
              <img
                src={heroImageUrl}
                alt={currentChapter.hero_file?.alt_text || `Hero image for ${currentChapter.title}`}
                className="w-full h-full object-cover"
                onLoad={() => {
                  console.log('✅ Hero image loaded successfully in reader:', heroImageUrl);
                }}
                onError={(e) => {
                  console.error('❌ Hero image failed to load:', {
                    url: heroImageUrl,
                    heroFile: currentChapter.hero_file,
                    error: e
                  });
                }}
              />
              
              {/* Overlay with chapter info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                    {currentChapter.title}
                  </h2>
                  <p className="text-white/90 text-lg">
                    Chapter {currentChapter.chapter_number}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* DEBUG: Show hero image status */}
          {currentChapter.hero_file && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                🐛 DEBUG: Hero file detected - {currentChapter.hero_file.name}
                <br />URL: {heroImageUrl}
                <br />Show setting: {settings.showHeroImages ? '✅' : '❌'}
              </div>
            </div>
          )}
          
          {/* Chapter Content */}
          <div className="p-8 md:p-12 lg:p-16">
            {/* Chapter Header (when no hero image) */}
            {(!heroImageUrl || !settings.showHeroImages) && (
              <header className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {currentChapter.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Chapter {currentChapter.chapter_number}</span>
                  {currentChapter.word_count && (
                    <>
                      <span>•</span>
                      <span>{currentChapter.word_count.toLocaleString()} words</span>
                    </>
                  )}
                  {currentChapter.estimated_read_time && (
                    <>
                      <span>•</span>
                      <span>{currentChapter.estimated_read_time} min read</span>
                    </>
                  )}
                </div>
              </header>
            )}
            
            {/* FIXED: Chapter Text with Proper Scrolling */}
            <div 
              className={`prose prose-lg max-w-none ${getFontClasses()}`}
              style={{
                maxHeight: 'none',
                overflow: 'visible'
              }}
            >
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: currentChapter.plain_content || 'No content available for this chapter.' 
                }}
                className="chapter-content"
                style={{
                  lineHeight: settings.lineHeight === 'tight' ? 1.4 : 
                             settings.lineHeight === 'relaxed' ? 1.8 : 1.6,
                  maxWidth: '65ch',
                  margin: '0 auto'
                }}
              />
            </div>
          </div>
        </article>
        
        {/* Chapter Navigation */}
        <div className="flex justify-between items-center mt-8 px-4">
          <button
            onClick={goToPreviousChapter}
            disabled={currentChapterIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous Chapter</span>
          </button>
          
          <div className="text-center px-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {currentChapterIndex + 1} / {chapters.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {Math.round(progress)}% complete
            </div>
          </div>
          
          <button
            onClick={goToNextChapter}
            disabled={currentChapterIndex === chapters.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Next Chapter</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalEbookReader;