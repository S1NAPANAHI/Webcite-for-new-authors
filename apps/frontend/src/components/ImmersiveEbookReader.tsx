import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@zoroaster/shared';
import { supabase } from '../lib/supabase';
import {
  Settings,
  Sun,
  Moon,
  Palette,
  ChevronLeft,
  ChevronRight,
  Lock,
  Crown,
  X,
  Eye,
  Shield,
  BookOpen,
  Clock,
  BarChart3,
  List,
  Home,
  ChevronDown,
  Check
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
  is_free?: boolean;
  subscription_tier_required?: string;
  has_access?: boolean;
  metadata: any;
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
  theme: 'light' | 'dark' | 'sepia' | 'night';
  fontSize: number;
  fontFamily: 'serif' | 'sans' | 'mono' | 'dyslexic';
  lineHeight: number;
  textAlign: 'left' | 'justify' | 'center';
  pageWidth: number;
  backgroundColor: string;
  textColor: string;
  pageMargin: number;
  wordsPerPage: number;
}

interface IssueChapter {
  id: string;
  title: string;
  slug: string;
  chapter_number: number;
  is_free: boolean;
  has_access: boolean;
  word_count: number;
  estimated_read_time: number;
  completed?: boolean;
}

interface ImmersiveEbookReaderProps {
  chapter: Chapter;
  onChapterChange?: (direction: 'prev' | 'next') => void;
  showNavigation?: boolean;
  navigationInfo?: NavigationInfo;
  onExit?: () => void;
}

// Word-based pagination function
const paginateByWordCount = (content: string, wordsPerPage: number): string[] => {
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const pages: string[] = [];
  
  for (let i = 0; i < words.length; i += wordsPerPage) {
    const pageWords = words.slice(i, i + wordsPerPage);
    pages.push(pageWords.join(' '));
  }
  
  return pages.length > 0 ? pages : [content];
};

// Content Protection Hook
const useContentProtection = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const disableSelection = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const disableContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (['a', 'c', 'v', 'x', 's', 'p'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
      }
      
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('selectstart', disableSelection);
    document.addEventListener('dragstart', disableSelection);
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableKeyboardShortcuts);
    
    return () => {
      document.removeEventListener('selectstart', disableSelection);
      document.removeEventListener('dragstart', disableSelection);
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
    };
  }, [enabled]);
};

// Table of Contents Component
interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: IssueChapter[];
  currentChapterId: string;
  onChapterSelect: (chapterSlug: string) => void;
  issueTitle?: string;
}

function TableOfContents({ isOpen, onClose, chapters, currentChapterId, onChapterSelect, issueTitle }: TableOfContentsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[110] flex items-start justify-start pt-20 pl-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Table of Contents</h3>
            {issueTitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{issueTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Chapters List */}
        <div className="max-h-96 overflow-y-auto">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => {
                onChapterSelect(chapter.slug);
                onClose();
              }}
              className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
                chapter.id === currentChapterId ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                      {chapter.chapter_number.toString().padStart(2, '0')}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {chapter.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {chapter.word_count.toLocaleString()} words • {chapter.estimated_read_time} min
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {chapter.completed && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  {chapter.is_free ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">FREE</span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>PREMIUM</span>
                    </span>
                  )}
                  {!chapter.has_access && (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {chapters.filter(c => c.completed).length} of {chapters.length} chapters completed
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Modal Component
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReadingSettings;
  onSettingsChange: (settings: ReadingSettings) => void;
}

function SettingsModal({ isOpen, onClose, settings, onSettingsChange }: SettingsModalProps) {
  if (!isOpen) return null;

  const themes = [
    { value: 'light', label: 'Light', bg: '#ffffff', text: '#1f2937', icon: Sun },
    { value: 'sepia', label: 'Sepia', bg: '#fef7ed', text: '#92400e', icon: Palette },
    { value: 'dark', label: 'Dark', bg: '#1f2937', text: '#f9fafb', icon: Moon },
    { value: 'night', label: 'Night', bg: '#0f1419', text: '#e5e7eb', icon: Moon }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[110] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reading Settings</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Reading Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              {themes.map(({ value, label, bg, text, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => onSettingsChange({
                    ...settings,
                    theme: value as any,
                    backgroundColor: bg,
                    textColor: text
                  })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                    settings.theme === value
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 hover:shadow-md'
                  }`}
                  style={{ backgroundColor: bg, color: text }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Font Size: {settings.fontSize}px
            </label>
            <input
              type="range"
              min="14"
              max="32"
              value={settings.fontSize}
              onChange={(e) => onSettingsChange({ ...settings, fontSize: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>14px</span>
              <span>32px</span>
            </div>
          </div>

          {/* Line Height */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Line Spacing: {Number(settings.lineHeight).toFixed(1)}
            </label>
            <input
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => onSettingsChange({ ...settings, lineHeight: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Tight</span>
              <span>Loose</span>
            </div>
          </div>

          {/* Words Per Page */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Words Per Page: {settings.wordsPerPage}
            </label>
            <input
              type="range"
              min="200"
              max="600"
              step="50"
              value={settings.wordsPerPage}
              onChange={(e) => onSettingsChange({ ...settings, wordsPerPage: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>200</span>
              <span>400</span>
              <span>600</span>
            </div>
          </div>

          {/* Page Width */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Page Width: {settings.pageWidth}px
            </label>
            <input
              type="range"
              min="500"
              max="900"
              value={settings.pageWidth}
              onChange={(e) => onSettingsChange({ ...settings, pageWidth: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Narrow</span>
              <span>Wide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ImmersiveEbookReader: React.FC<ImmersiveEbookReaderProps> = ({ 
  chapter, 
  onChapterChange,
  showNavigation = true,
  navigationInfo,
  onExit
}) => {
  const { user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [allChapters, setAllChapters] = useState<IssueChapter[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    const saved = localStorage.getItem('immersiveEbookSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure lineHeight is a number
        if (parsed.lineHeight && typeof parsed.lineHeight === 'string') {
          parsed.lineHeight = parseFloat(parsed.lineHeight);
        }
        return {
          ...parsed,
          lineHeight: Number(parsed.lineHeight) || 1.6
        };
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
    return {
      theme: 'light',
      fontSize: 18,
      fontFamily: 'serif',
      lineHeight: 1.6,
      textAlign: 'justify',
      pageWidth: 700,
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      pageMargin: 60,
      wordsPerPage: 350
    };
  });

  // Load all chapters for navigation
  useEffect(() => {
    const loadAllChapters = async () => {
      if (!chapter?.issue_id) return;
      
      try {
        const { data: chapters, error } = await supabase
          .rpc('get_accessible_chapters_for_issue', {
            p_issue_id: chapter.issue_id,
            p_user_id: user?.id || null
          });
          
        if (error) {
          console.error('Error loading chapters:', error);
        } else {
          setAllChapters(chapters || []);
        }
      } catch (err) {
        console.error('Error loading chapters:', err);
      }
    };
    
    loadAllChapters();
  }, [chapter?.issue_id, user?.id]);

  // Enable content protection
  useContentProtection(protectionEnabled && !user?.metadata?.isAdmin);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('immersiveEbookSettings', JSON.stringify(settings));
  }, [settings]);

  // Prevent body scroll when reader is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Paginate content by word count
  useEffect(() => {
    if (!chapter?.plain_content) return;

    const newPages = paginateByWordCount(chapter.plain_content, settings.wordsPerPage);
    setPages(newPages);
    setTotalPages(newPages.length);
    
    if (currentPage > newPages.length && newPages.length > 0) {
      setCurrentPage(1);
    }
  }, [chapter, settings.wordsPerPage, currentPage]);

  // Handle page navigation
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const progress = Math.round((page / totalPages) * 100);
    setReadingProgress(progress);
  }, [totalPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showSettings || showTOC) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          if (currentPage > 1) {
            goToPage(currentPage - 1);
          } else if (onChapterChange && navigationInfo?.hasPrev) {
            onChapterChange('prev');
          }
          break;
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          if (currentPage < totalPages) {
            goToPage(currentPage + 1);
          } else if (onChapterChange && navigationInfo?.hasNext) {
            onChapterChange('next');
          }
          break;
        case 'Home':
          e.preventDefault();
          goToPage(1);
          break;
        case 'End':
          e.preventDefault();
          goToPage(totalPages);
          break;
        case 'Escape':
          e.preventDefault();
          onExit?.();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          setShowTOC(true);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, showSettings, showTOC, onChapterChange, navigationInfo, goToPage, onExit]);

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
        const progressData = {
          user_id: user.id,
          chapter_id: chapter.id,
          progress_percentage: readingProgress,
          last_read_at: new Date().toISOString(),
          reading_time_minutes: Math.floor(readingTime / 60),
          completed: readingProgress >= 95,
          current_page: currentPage,
          total_pages: totalPages
        };
        
        await supabase.from('reading_progress').upsert(progressData);
      } catch (err) {
        console.error('Error saving progress:', err);
      }
    }, 3000);
    
    return () => clearTimeout(saveProgress);
  }, [readingProgress, readingTime, user, chapter, currentPage, totalPages]);

  // Touch gesture handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
    if (isRightSwipe && currentPage > 1) {
      goToPage(currentPage - 1);
    }
    
    setTouchStart(null);
  };

  const handleChapterSelect = (chapterSlug: string) => {
    const issueSlug = window.location.pathname.split('/')[2]; // Extract from current URL
    window.location.href = `/read/${issueSlug}/${chapterSlug}`;
  };

  if (!chapter) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-[99]">
        <div className="text-center text-white">
          <Lock className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-300">Chapter not found or access denied</p>
        </div>
      </div>
    );
  }

  const currentContent = pages[currentPage - 1] || '';
  const getFontFamily = () => {
    switch (settings.fontFamily) {
      case 'serif': return 'Georgia, serif';
      case 'sans': return 'Inter, sans-serif';
      case 'mono': return 'Monaco, monospace';
      case 'dyslexic': return 'OpenDyslexic, sans-serif';
      default: return 'Georgia, serif';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99] overflow-hidden"
      style={{
        backgroundColor: settings.backgroundColor,
        color: settings.textColor
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Content Protection Overlay */}
      {protectionEnabled && (
        <div className="absolute inset-0 pointer-events-none select-none z-5">
          <div className="absolute top-6 right-20 opacity-5 text-gray-400">
            <Shield className="w-8 h-8" />
          </div>
        </div>
      )}

      {/* Top Navigation Bar - UNOBSTRUCTED */}
      <div className="absolute top-0 left-0 right-0 h-20 z-30 flex items-center justify-between px-8" style={{ backgroundColor: `${settings.backgroundColor}F0` }}>
        <div className="flex items-center space-x-6">
          <button
            onClick={onExit}
            className="p-3 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
            title="Exit Reader"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setShowTOC(true)}
            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
            title="Table of Contents"
          >
            <List className="w-5 h-5" />
            <span className="text-sm font-medium">Chapters</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/library'}
            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
            title="Back to Library"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Library</span>
          </button>
        </div>
        
        <div className="text-center">
          <h1 className="text-lg font-semibold">{chapter.title}</h1>
          <div className="text-sm opacity-75">Chapter {chapter.chapter_number}</div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm opacity-75">
            {currentPage} / {totalPages}
          </div>
          
          <button
            onClick={() => setProtectionEnabled(!protectionEnabled)}
            className="p-3 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
            title={protectionEnabled ? 'Protection On' : 'Protection Off'}
          >
            {protectionEnabled ? <Shield className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
            title="Reading Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Reading Area - SPACIOUS AND SCROLLABLE */}
      <div className="pt-24 pb-24 px-12 h-full flex items-start justify-center overflow-hidden">
        <div 
          className="w-full max-h-full flex flex-col"
          style={{ maxWidth: `${settings.pageWidth}px` }}
        >
          {/* Page Content with Scrolling */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto overflow-x-hidden relative select-none px-8 py-12 rounded-2xl shadow-lg"
            style={{
              fontFamily: getFontFamily(),
              fontSize: `${settings.fontSize}px`,
              lineHeight: Number(settings.lineHeight),
              textAlign: settings.textAlign as any,
              backgroundColor: `${settings.backgroundColor}80`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${settings.textColor}20`,
              minHeight: 'calc(100vh - 200px)'
            }}
          >
            {/* Anti-screenshot overlay */}
            <div 
              className="absolute inset-0 pointer-events-none select-none opacity-[0.02] z-10"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 20px,
                  currentColor 20px,
                  currentColor 21px
                )`,
              }}
            />
            
            {/* Content */}
            <div 
              className="relative z-0 select-none leading-relaxed prose prose-lg max-w-none"
              style={{ 
                userSelect: 'none', 
                WebkitUserSelect: 'none', 
                MozUserSelect: 'none',
                color: settings.textColor
              }}
            >
              {currentContent}
            </div>
            
            {/* Word count indicator */}
            <div className="mt-12 pt-6 border-t border-current border-opacity-20 text-center text-sm opacity-50">
              Page {currentPage} • ~{currentContent.split(' ').length} words
            </div>

            {/* Custom scrollbar styles */}
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 8px;
              }
              div::-webkit-scrollbar-track {
                background: rgba(128, 128, 128, 0.1);
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb {
                background: rgba(128, 128, 128, 0.3);
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: rgba(128, 128, 128, 0.5);
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - BETTER POSITIONED */}
      <button
        onClick={() => {
          if (currentPage > 1) {
            goToPage(currentPage - 1);
          } else if (onChapterChange && navigationInfo?.hasPrev) {
            onChapterChange('prev');
          }
        }}
        className="absolute left-8 top-1/2 -translate-y-1/2 p-4 rounded-full transition-all duration-200 z-30 bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg hover:shadow-xl"
        disabled={currentPage === 1 && !navigationInfo?.hasPrev}
        style={{ 
          color: settings.textColor,
          display: (currentPage > 1) || navigationInfo?.hasPrev ? 'flex' : 'none'
        }}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => {
          if (currentPage < totalPages) {
            goToPage(currentPage + 1);
          } else if (onChapterChange && navigationInfo?.hasNext) {
            onChapterChange('next');
          }
        }}
        className="absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-full transition-all duration-200 z-30 bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg hover:shadow-xl"
        disabled={currentPage === totalPages && !navigationInfo?.hasNext}
        style={{ 
          color: settings.textColor,
          display: (currentPage < totalPages) || navigationInfo?.hasNext ? 'flex' : 'none'
        }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Click Zones for Page Navigation - NON-INTRUSIVE */}
      <div className="absolute inset-0 grid grid-cols-5 z-20 pointer-events-none">
        <div 
          className="cursor-pointer pointer-events-auto"
          onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
        />
        <div className="pointer-events-none" />
        <div 
          className="cursor-pointer pointer-events-auto"
          onClick={() => setShowSettings(true)}
        />
        <div className="pointer-events-none" />
        <div 
          className="cursor-pointer pointer-events-auto"
          onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
        />
      </div>

      {/* Bottom Status Bar - CLEAN AND SPACIOUS */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 flex items-center justify-center z-30"
        style={{ backgroundColor: `${settings.backgroundColor}F0` }}
      >
        <div className="flex items-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>{readingProgress}% complete</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>{chapter.word_count?.toLocaleString() || 0} words</span>
          </div>
          
          {/* Chapter Navigation */}
          {showNavigation && onChapterChange && (
            <div className="flex items-center space-x-4">
              {navigationInfo?.hasPrev && (
                <button
                  onClick={() => onChapterChange('prev')}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  disabled={!navigationInfo.prevHasAccess}
                >
                  ← Previous
                </button>
              )}
              
              {navigationInfo?.hasNext && (
                <button
                  onClick={() => onChapterChange('next')}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  disabled={!navigationInfo.nextHasAccess}
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table of Contents */}
      <TableOfContents
        isOpen={showTOC}
        onClose={() => setShowTOC(false)}
        chapters={allChapters}
        currentChapterId={chapter.id}
        onChapterSelect={handleChapterSelect}
        issueTitle={chapter.metadata?.issue_title}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Help Instructions - BOTTOM */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-black bg-opacity-30 text-white text-xs rounded-lg px-4 py-2 opacity-0 hover:opacity-100 transition-opacity backdrop-blur">
          <div className="flex items-center space-x-4">
            <span>← → Pages</span>
            <span>T = TOC</span>
            <span>ESC = Exit</span>
            <span>Space = Next</span>
          </div>
        </div>
      </div>
    </div>
  );
};