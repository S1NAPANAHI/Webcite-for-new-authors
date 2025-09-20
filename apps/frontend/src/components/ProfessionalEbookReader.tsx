import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Settings, Home, Maximize2, Minimize2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getFileUrl } from '../utils/fileUpload';

interface FileRecord {
  id: string;
  name: string;
  url?: string;
  storage_path?: string;
  alt_text?: string;
}

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
  showHeroImages: boolean; // NEW: Toggle for hero images
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
  // Core state
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Reader settings with hero image toggle
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 'medium',
    fontFamily: 'serif',
    theme: 'light',
    lineHeight: 'normal',
    showHeroImages: true // NEW: Default to showing hero images
  });

  // Load user preferences from localStorage
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

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('ebook-reader-settings', JSON.stringify(settings));
  }, [settings]);

  // Load chapters with file relationships
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
        
        if (issueError) {
          throw new Error(`Issue not found: ${issueError.message}`);
        }
        
        // FIXED: Load chapters with file relationships
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('*')
          .eq('issue_id', issueData.id)
          .eq('status', 'published')
          .order('chapter_number');
        
        if (chaptersError) {
          throw new Error(`Chapters not found: ${chaptersError.message}`);
        }
        
        if (!chaptersData || chaptersData.length === 0) {
          throw new Error('No published chapters found for this issue.');
        }
        
        // FIXED: Load hero and banner files for each chapter
        const chaptersWithFiles = await Promise.all(
          chaptersData.map(async (chapter) => {
            let heroFile = null;
            let bannerFile = null;
            
            // Load hero file if exists
            if (chapter.hero_file_id) {
              const { data: heroData } = await supabase
                .from('files')
                .select('*')
                .eq('id', chapter.hero_file_id)
                .single();
              heroFile = heroData;
            }
            
            // Load banner file if exists
            if (chapter.banner_file_id) {
              const { data: bannerData } = await supabase
                .from('files')
                .select('*')
                .eq('id', chapter.banner_file_id)
                .single();
              bannerFile = bannerData;
            }
            
            return {
              ...chapter,
              hero_file: heroFile,
              banner_file: bannerFile
            };
          })
        );
        
        console.log('Loaded chapters with files:', chaptersWithFiles);
        setChapters(chaptersWithFiles);
        
        // Set initial chapter
        if (chapterSlug) {
          const targetChapter = chaptersWithFiles.find(ch => ch.slug === chapterSlug);
          if (targetChapter) {
            const index = chaptersWithFiles.indexOf(targetChapter);
            setCurrentChapterIndex(index);
            setCurrentChapter(targetChapter);
          } else {
            setCurrentChapter(chaptersWithFiles[0]);
            setCurrentChapterIndex(0);
          }
        } else {
          setCurrentChapter(chaptersWithFiles[0]);
          setCurrentChapterIndex(0);
        }
        
      } catch (err) {
        console.error('Error loading chapters:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chapters');
      } finally {
        setLoading(false);
      }
    };
    
    loadChaptersWithFiles();
  }, [issueSlug, chapterSlug]);

  // Navigation functions
  const goToNextChapter = useCallback(() => {
    if (currentChapterIndex < chapters.length - 1) {
      const nextIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIndex);
      setCurrentChapter(chapters[nextIndex]);
      onChapterChange?.(chapters[nextIndex]);
    }
  }, [currentChapterIndex, chapters, onChapterChange]);

  const goToPreviousChapter = useCallback(() => {
    if (currentChapterIndex > 0) {
      const prevIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(prevIndex);
      setCurrentChapter(chapters[prevIndex]);
      onChapterChange?.(chapters[prevIndex]);
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

  // Theme CSS classes
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

  // Fullscreen handling
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
  const heroImageUrl = settings.showHeroImages && currentChapter.hero_file ? getFileUrl(currentChapter.hero_file) : null;

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
            
            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium mb-2">Font Family</label>
              <div className="grid grid-cols-3 gap-2">
                {(['serif', 'sans', 'mono'] as const).map((family) => (
                  <button
                    key={family}
                    onClick={() => setSettings(prev => ({ ...prev, fontFamily: family }))}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      settings.fontFamily === family
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {family === 'serif' ? 'Serif' : family === 'sans' ? 'Sans' : 'Mono'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'sepia'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSettings(prev => ({ ...prev, theme }))}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      settings.theme === theme
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
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
          {/* FIXED: Hero Image Display */}
          {heroImageUrl && settings.showHeroImages && (
            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
              <img
                src={heroImageUrl}
                alt={currentChapter.hero_file?.alt_text || `Hero image for ${currentChapter.title}`}
                className="w-full h-full object-cover"
                onLoad={() => console.log('Hero image loaded successfully')}
                onError={(e) => {
                  console.error('Hero image failed to load:', e);
                  (e.target as HTMLImageElement).style.display = 'none';
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
                maxHeight: 'none', // Remove height restrictions
                overflow: 'visible'  // Allow natural scrolling
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
                  maxWidth: '65ch', // Optimal reading width
                  margin: '0 auto'   // Center the text
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