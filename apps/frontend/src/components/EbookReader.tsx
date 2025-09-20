import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@zoroaster/shared';
import { supabase } from '../lib/supabase';
import { useFileUrl } from '../utils/fileUrls';
import './ebook-reader.css';
import {
  Settings,
  Sun,
  Moon,
  Palette,
  Type,
  Bookmark,
  MessageSquare,
  Share2,
  Clock,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Lock,
  Crown
} from 'lucide-react';

interface Chapter {
  id: string;
  issue_id: string;
  title: string;
  slug: string;
  chapter_number: number;
  content: any;
  plain_content: string;
  word_count: number;
  estimated_read_time: number;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: any;
  is_free?: boolean;
  subscription_tier_required?: string;
  has_access?: boolean;
  hero_file_id?: string | null;
  banner_file_id?: string | null;
}

interface NavigationInfo {
  hasPrev: boolean;
  hasNext: boolean;
  prevTitle?: string;
  nextTitle?: string;
  prevHasAccess: boolean;
  nextHasAccess: boolean;
}

interface ReadingSettings {
  theme: 'light' | 'dark' | 'sepia';
  fontSize: 'sm' | 'base' | 'lg' | 'xl' | 'xxl';
  fontFamily: 'serif' | 'sans';
  lineHeight: 'normal' | 'relaxed' | 'loose';
  maxWidth: 'narrow' | 'normal' | 'wide';
}

interface EbookReaderProps {
  chapter: Chapter;
  onChapterChange?: (direction: 'prev' | 'next') => void;
  showNavigation?: boolean;
  navigationInfo?: NavigationInfo;
}

interface ReadingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReadingSettings;
  onSettingsChange: (settings: ReadingSettings) => void;
}

function ReadingSettingsModal({ isOpen, onClose, settings, onSettingsChange }: ReadingSettingsModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reading Settings</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {([['light', Sun, 'Light'], ['dark', Moon, 'Dark'], ['sepia', Palette, 'Sepia']] as const).map(([theme, Icon, label]) => (
                <button
                  key={theme}
                  onClick={() => onSettingsChange({ ...settings, theme })}
                  className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center space-y-1 ${
                    settings.theme === theme
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => onSettingsChange({ ...settings, fontSize: e.target.value as any })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sm">Small</option>
              <option value="base">Normal</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
              <option value="xxl">XXL</option>
            </select>
          </div>
          
          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Family</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => onSettingsChange({ ...settings, fontFamily: e.target.value as any })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="serif">Serif (Traditional)</option>
              <option value="sans">Sans Serif (Modern)</option>
            </select>
          </div>
          
          {/* Line Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Line Spacing</label>
            <select
              value={settings.lineHeight}
              onChange={(e) => onSettingsChange({ ...settings, lineHeight: e.target.value as any })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="relaxed">Comfortable</option>
              <option value="loose">Spacious</option>
            </select>
          </div>
          
          {/* Max Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content Width</label>
            <select
              value={settings.maxWidth}
              onChange={(e) => onSettingsChange({ ...settings, maxWidth: e.target.value as any })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="narrow">Narrow</option>
              <option value="normal">Normal</option>
              <option value="wide">Wide</option>
            </select>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export const EbookReader: React.FC<EbookReaderProps> = ({ 
  chapter, 
  onChapterChange,
  showNavigation = true,
  navigationInfo
}) => {
  const { user } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Get hero image URL using the hook
  const heroUrl = useFileUrl(chapter?.hero_file_id);
  
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    // Load settings from localStorage or use defaults
    const saved = localStorage.getItem('ebookReaderSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading reading settings:', e);
      }
    }
    return {
      theme: 'light',
      fontSize: 'base',
      fontFamily: 'serif',
      lineHeight: 'relaxed',
      maxWidth: 'normal'
    };
  });
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('ebookReaderSettings', JSON.stringify(settings));
  }, [settings]);
  
  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(Math.max(scrollPercent, 0), 100));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Track reading time
  useEffect(() => {
    const interval = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Auto-save reading progress
  useEffect(() => {
    if (!user || !chapter) return;
    
    const saveProgress = setTimeout(async () => {
      try {
        // Save reading progress to database
        const progressData = {
          user_id: user.id,
          chapter_id: chapter.id,
          progress_percentage: Math.round(readingProgress),
          last_read_at: new Date().toISOString(),
          reading_time_minutes: Math.floor(readingTime / 60),
          completed: readingProgress >= 95
        };
        
        const { error } = await supabase
          .from('reading_progress')
          .upsert(progressData);
          
        if (error) {
          console.error('Error saving reading progress:', error);
        }
      } catch (err) {
        console.error('Error saving progress:', err);
      }
    }, 2000); // Debounce saves
    
    return () => clearTimeout(saveProgress);
  }, [readingProgress, readingTime, user, chapter]);
  
  const getThemeClasses = () => {
    const themes = {
      light: 'bg-white text-gray-900',
      dark: 'bg-gray-900 text-gray-100',
      sepia: 'bg-amber-50 text-amber-900'
    };
    return themes[settings.theme];
  };
  
  const getFontClasses = () => {
    const fontSizes = {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      xxl: 'text-2xl'
    };
    
    const fontFamilies = {
      serif: 'font-serif',
      sans: 'font-sans'
    };
    
    const lineHeights = {
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose'
    };
    
    const maxWidths = {
      narrow: 'max-w-2xl',
      normal: 'max-w-4xl',
      wide: 'max-w-6xl'
    };
    
    return `${fontSizes[settings.fontSize]} ${fontFamilies[settings.fontFamily]} ${lineHeights[settings.lineHeight]} ${maxWidths[settings.maxWidth]}`;
  };
  
  const renderContent = (content: any) => {
    if (!content) return <p className="text-gray-500">No content available</p>;
    
    // Handle different content formats
    if (typeof content === 'string') {
      // Plain text content
      return content.split('\n').map((paragraph: string, index: number) => (
        <p key={index} className="mb-4">
          {paragraph}
        </p>
      ));
    }
    
    if (content.type === 'doc' && content.content) {
      // Structured JSON content (from rich text editor)
      return content.content.map((node: any, index: number) => {
        if (node.type === 'paragraph' && node.content) {
          return (
            <p key={index} className="mb-4">
              {node.content.map((textNode: any, textIndex: number) => {
                if (textNode.type === 'text') {
                  let text = <span key={textIndex}>{textNode.text}</span>;
                  
                  // Apply text marks (bold, italic, etc.)
                  if (textNode.marks) {
                    textNode.marks.forEach((mark: any) => {
                      if (mark.type === 'bold') {
                        text = <strong key={textIndex}>{textNode.text}</strong>;
                      } else if (mark.type === 'italic') {
                        text = <em key={textIndex}>{textNode.text}</em>;
                      }
                    });
                  }
                  
                  return text;
                }
                return null;
              })}
            </p>
          );
        }
        
        if (node.type === 'heading' && node.content) {
          const level = node.attrs?.level || 1;
          const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
          const headingClasses = {
            1: 'text-3xl font-bold mb-6 mt-8',
            2: 'text-2xl font-bold mb-4 mt-6',
            3: 'text-xl font-bold mb-3 mt-5'
          }[level] || 'text-lg font-bold mb-3 mt-4';
          
          return (
            <HeadingTag key={index} className={headingClasses}>
              {node.content.map((textNode: any) => textNode.text).join('')}
            </HeadingTag>
          );
        }
        
        if (node.type === 'blockquote' && node.content) {
          return (
            <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic mb-4 text-gray-700">
              {node.content.map((textNode: any) => textNode.text).join('')}
            </blockquote>
          );
        }
        
        return null;
      });
    }
    
    // Fallback: render as plain text if format is unknown
    if (chapter.plain_content) {
      return chapter.plain_content.split('\n').map((paragraph: string, index: number) => (
        <p key={index} className="mb-4">
          {paragraph}
        </p>
      ));
    }
    
    return <p className="text-gray-500">Content format not supported</p>;
  };
  
  const handleBookmark = async () => {
    if (!user) return;
    
    try {
      // Toggle bookmark status (you'll implement this)
      setIsBookmarked(!isBookmarked);
      console.log('Bookmark toggled for chapter:', chapter.id);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };
  
  const handleNavigation = (direction: 'prev' | 'next') => {
    if (!onChapterChange || !navigationInfo) return;
    
    const hasAccess = direction === 'prev' ? navigationInfo.prevHasAccess : navigationInfo.nextHasAccess;
    
    if (hasAccess) {
      onChapterChange(direction);
    } else {
      // Show a toast or modal about needing subscription
      console.log(`Access denied for ${direction} chapter - subscription required`);
      // You could show a subscription upgrade prompt here
    }
  };
  
  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chapter not found or access denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${getThemeClasses()}`}>
      {/* Reading Header */}
      <header className="sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm border-b border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {showNavigation && onChapterChange && navigationInfo?.hasPrev && (
                <button
                  onClick={() => handleNavigation('prev')}
                  disabled={!navigationInfo.prevHasAccess}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    navigationInfo.prevHasAccess 
                      ? 'hover:bg-gray-200 dark:hover:bg-gray-700' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  title={navigationInfo.prevHasAccess ? `Previous: ${navigationInfo.prevTitle}` : 'Previous chapter requires subscription'}
                >
                  <ChevronLeft className="w-5 h-5" />
                  {!navigationInfo.prevHasAccess && (
                    <Lock className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
                  )}
                </button>
              )}
              
              <div>
                <h1 className="font-semibold truncate max-w-xs sm:max-w-sm md:max-w-md">
                  {chapter.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm opacity-75">
                    Chapter {chapter.chapter_number}
                  </p>
                  {chapter.is_free && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      FREE
                    </span>
                  )}
                  {!chapter.is_free && (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>PREMIUM</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Progress Indicator */}
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <BarChart3 className="w-4 h-4" />
                <span>{Math.round(readingProgress)}%</span>
              </div>
              
              {/* Reading Time */}
              <div className="hidden md:flex items-center space-x-1 text-sm opacity-75">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}</span>
              </div>
              
              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Reading Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {showNavigation && onChapterChange && navigationInfo?.hasNext && (
                <button
                  onClick={() => handleNavigation('next')}
                  disabled={!navigationInfo.nextHasAccess}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    navigationInfo.nextHasAccess 
                      ? 'hover:bg-gray-200 dark:hover:bg-gray-700' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  title={navigationInfo.nextHasAccess ? `Next: ${navigationInfo.nextTitle}` : 'Next chapter requires subscription'}
                >
                  <ChevronRight className="w-5 h-5" />
                  {!navigationInfo.nextHasAccess && (
                    <Lock className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
                  )}
                </button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Chapter Content */}
      <main className="py-8">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${getFontClasses()}`}>
          <article ref={contentRef}>
            {/* Hero Image - Render at top of first page */}
            {heroUrl && (
              <div className="chapter-hero">
                <img src={heroUrl} alt={`${chapter?.title || 'Chapter'} hero`} />
              </div>
            )}
            
            {/* Chapter Header */}
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {chapter.title}
              </h1>
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-sm opacity-75">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{chapter.estimated_read_time} min read</span>
                </div>
                {chapter.published_at && (
                  <div className="flex items-center space-x-1">
                    <span>{new Date(chapter.published_at).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Type className="w-4 h-4" />
                  <span>{chapter.word_count.toLocaleString()} words</span>
                </div>
              </div>
            </header>
            
            {/* Chapter Content */}
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none mb-12 reader-content">
              {renderContent(chapter.content)}
            </div>
          </article>
          
          {/* Chapter Actions */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isBookmarked
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              <MessageSquare className="w-4 h-4" />
              <span>Comments</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
          
          {/* Chapter Navigation */}
          {showNavigation && onChapterChange && navigationInfo && (
            <nav className="flex items-center justify-between border-t border-opacity-20 pt-8">
              <div className="flex-1">
                {navigationInfo.hasPrev ? (
                  <button 
                    onClick={() => handleNavigation('prev')}
                    disabled={!navigationInfo.prevHasAccess}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                      navigationInfo.prevHasAccess 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-xs opacity-75">Previous</div>
                      <div className="font-medium flex items-center space-x-1">
                        <span className="truncate max-w-40">{navigationInfo.prevTitle || 'Previous Chapter'}</span>
                        {!navigationInfo.prevHasAccess && <Lock className="w-3 h-3 text-yellow-500" />}
                      </div>
                    </div>
                  </button>
                ) : <div></div>}
              </div>
              
              <div className="text-center text-sm opacity-75 mx-8">
                <p>Chapter {chapter.chapter_number}</p>
                <p>{Math.round(readingProgress)}% Complete</p>
              </div>
              
              <div className="flex-1 flex justify-end">
                {navigationInfo.hasNext ? (
                  <button 
                    onClick={() => handleNavigation('next')}
                    disabled={!navigationInfo.nextHasAccess}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                      navigationInfo.nextHasAccess 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-right">
                      <div className="text-xs opacity-75">Next</div>
                      <div className="font-medium flex items-center space-x-1">
                        <span className="truncate max-w-40">{navigationInfo.nextTitle || 'Next Chapter'}</span>
                        {!navigationInfo.nextHasAccess && <Lock className="w-3 h-3 text-yellow-500" />}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : <div></div>}
              </div>
            </nav>
          )}
          
          {/* Reading Stats */}
          <div className="mt-8 p-4 rounded-lg bg-gray-100 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span>Session: {Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}</span>
                <span>Progress: {Math.round(readingProgress)}%</span>
                <span>Words: {chapter.word_count.toLocaleString()}</span>
              </div>
              
              {readingProgress >= 95 && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <BarChart3 className="w-4 h-4" />
                  <span>Chapter Complete!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <ReadingSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
};