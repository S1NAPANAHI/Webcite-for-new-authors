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
  Maximize,
  Minimize,
  Eye,
  Shield,
  X,
  Home,
  BookOpen,
  Clock,
  BarChart3
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
  fontSize: number; // 12-32px
  fontFamily: 'serif' | 'sans' | 'mono' | 'dyslexic';
  lineHeight: number; // 1.2-2.5
  textAlign: 'left' | 'justify' | 'center';
  pageWidth: number; // 400-800px
  backgroundColor: string;
  textColor: string;
  pageMargin: number; // 20-80px
  wordsPerPage: number; // 200-500 words per page
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

  const fontFamilies = [
    { value: 'serif', label: 'Serif', css: 'Georgia, serif' },
    { value: 'sans', label: 'Sans', css: 'Inter, sans-serif' },
    { value: 'mono', label: 'Mono', css: 'Monaco, monospace' },
    { value: 'dyslexic', label: 'Dyslexic', css: 'OpenDyslexic, sans-serif' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reading Settings</h2>
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
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
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
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                    settings.theme === value
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 hover:shadow-md'
                  }`}
                  style={{ backgroundColor: bg, color: text }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Font Family
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fontFamilies.map(({ value, label, css }) => (
                <button
                  key={value}
                  onClick={() => onSettingsChange({ ...settings, fontFamily: value as any })}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    settings.fontFamily === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-lg mb-1" style={{ fontFamily: css }}>Aa</div>
                  <div className="text-xs">{label}</div>
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
              min="12"
              max="32"
              value={settings.fontSize}
              onChange={(e) => onSettingsChange({ ...settings, fontSize: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Small</span>
              <span>Large</span>
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
              <span>Fewer</span>
              <span>More</span>
            </div>
          </div>

          {/* Page Width */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Page Width: {settings.pageWidth}px
            </label>
            <input
              type="range"
              min="400"
              max="800"
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
        
        <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Settings
          </button>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    const saved = localStorage.getItem('immersiveEbookSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure lineHeight is a number
        if (parsed.lineHeight && typeof parsed.lineHeight === 'string') {
          parsed.lineHeight = parseFloat(parsed.lineHeight);
        }
        return parsed;
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
      wordsPerPage: 350 // Default words per page
    };
  });

  // Enable content protection
  useContentProtection(protectionEnabled && !user?.metadata?.isAdmin);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('immersiveEbookSettings', JSON.stringify(settings));
  }, [settings]);

  // Paginate content by word count
  useEffect(() => {
    if (!chapter?.plain_content) return;

    const newPages = paginateByWordCount(chapter.plain_content, settings.wordsPerPage);
    setPages(newPages);
    setTotalPages(newPages.length);
    
    // Reset to first page if current page is beyond new total
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
      if (showSettings) return;
      
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
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, showSettings, onChapterChange, navigationInfo, goToPage, onExit]);

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
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
    if (isRightSwipe && currentPage > 1) {
      goToPage(currentPage - 1);
    }
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
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Content Protection Overlay */}
      {protectionEnabled && (
        <div className="absolute inset-0 pointer-events-none select-none z-10">
          <div className="absolute top-4 right-4 opacity-10 text-gray-400">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      )}

      {/* Minimal Top Bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-20"
        style={{ backgroundColor: `${settings.backgroundColor}95` }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={onExit}
            className="p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
            title="Exit Reader"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-sm font-medium opacity-75">
            {chapter.title} - Chapter {chapter.chapter_number}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm opacity-75">
            {currentPage} / {totalPages}
          </div>
          
          <button
            onClick={() => setProtectionEnabled(!protectionEnabled)}
            className="p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
            title={protectionEnabled ? 'Protection On' : 'Protection Off'}
          >
            {protectionEnabled ? <Shield className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reading Area */}
      <div className="pt-16 pb-20 px-6 h-full overflow-hidden flex items-center justify-center">
        <div 
          className="max-w-full h-full flex items-center justify-center"
          style={{ maxWidth: `${settings.pageWidth}px` }}
        >
          {/* Page Content */}
          <div
            className="w-full h-full flex flex-col justify-center relative select-none"
            style={{
              fontFamily: getFontFamily(),
              fontSize: `${settings.fontSize}px`,
              lineHeight: Number(settings.lineHeight),
              textAlign: settings.textAlign as any,
              padding: `${settings.pageMargin}px`
            }}
          >
            {/* Anti-screenshot overlay */}
            <div 
              className="absolute inset-0 pointer-events-none select-none opacity-[0.02]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 20px,
                  currentColor 20px,
                  currentColor 21px
                )`,
                zIndex: 1
              }}
            />
            
            {/* Content */}
            <div 
              className="relative z-0 select-none leading-relaxed"
              style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
            >
              {currentContent}
            </div>
            
            {/* Word count indicator */}
            <div className="absolute bottom-4 right-4 text-xs opacity-50">
              ~{currentContent.split(' ').length} words
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          if (currentPage > 1) {
            goToPage(currentPage - 1);
          } else if (onChapterChange && navigationInfo?.hasPrev) {
            onChapterChange('prev');
          }
        }}
        className={`absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full transition-all duration-200 z-30 ${
          (currentPage > 1) || (navigationInfo?.hasPrev)
            ? 'bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 bg-opacity-50 cursor-not-allowed'
        }`}
        disabled={currentPage === 1 && !navigationInfo?.hasPrev}
        style={{ color: settings.textColor }}
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
        className={`absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full transition-all duration-200 z-30 ${
          (currentPage < totalPages) || (navigationInfo?.hasNext)
            ? 'bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 bg-opacity-50 cursor-not-allowed'
        }`}
        disabled={currentPage === totalPages && !navigationInfo?.hasNext}
        style={{ color: settings.textColor }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Click Zones for Page Navigation */}
      <div className="absolute inset-0 grid grid-cols-3 z-20">
        {/* Left click zone - Previous page */}
        <div 
          className="cursor-pointer flex items-center justify-start pl-20"
          onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
        />
        
        {/* Center click zone - Settings */}
        <div 
          className="cursor-pointer flex items-center justify-center"
          onClick={() => setShowSettings(true)}
        />
        
        {/* Right click zone - Next page */}
        <div 
          className="cursor-pointer flex items-center justify-end pr-20"
          onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
        />
      </div>

      {/* Minimal Bottom Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-20 flex items-center justify-center z-20"
        style={{ backgroundColor: `${settings.backgroundColor}95` }}
      >
        <div className="flex items-center space-x-6 text-sm opacity-75">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>{readingProgress}%</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>{chapter.word_count?.toLocaleString() || 0} words</span>
          </div>
          
          {showNavigation && onChapterChange && (navigationInfo?.hasPrev || navigationInfo?.hasNext) && (
            <div className="flex items-center space-x-4">
              {navigationInfo?.hasPrev && (
                <button
                  onClick={() => onChapterChange('prev')}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  disabled={!navigationInfo.prevHasAccess}
                >
                  ← Prev Chapter
                </button>
              )}
              
              {navigationInfo?.hasNext && (
                <button
                  onClick={() => onChapterChange('next')}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  disabled={!navigationInfo.nextHasAccess}
                >
                  Next Chapter →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-24 left-6 z-30">
        <div className="bg-black bg-opacity-50 text-white text-xs rounded-lg px-3 py-2 opacity-0 hover:opacity-100 transition-opacity">
          <div>← → Arrow keys: Navigate pages</div>
          <div>Space: Next page</div>
          <div>Esc: Exit reader</div>
        </div>
      </div>
    </div>
  );
};