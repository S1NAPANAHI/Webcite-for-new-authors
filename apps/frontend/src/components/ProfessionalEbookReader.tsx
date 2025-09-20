import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@zoroaster/shared';
import { supabase } from '../lib/supabase';
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
  Crown,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  RotateCcw,
  Eye,
  EyeOff,
  Shield,
  Zap,
  BookOpen,
  FileText
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
  columnWidth: 'narrow' | 'normal' | 'wide';
  pageWidth: number; // 400-800px
  backgroundColor: string;
  textColor: string;
  pageMargin: number; // 20-80px
}

interface ProfessionalEbookReaderProps {
  chapter: Chapter;
  onChapterChange?: (direction: 'prev' | 'next') => void;
  showNavigation?: boolean;
  navigationInfo?: NavigationInfo;
}

// Content Protection Hook
const useContentProtection = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    // Disable text selection
    const disableSelection = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable right-click context menu
    const disableContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, etc.)
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Disable common copy shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (['a', 'c', 'v', 'x', 's', 'p'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
      }
      
      // Disable F12, Ctrl+Shift+I, Ctrl+U
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        return false;
      }
    };

    // Blur content when dev tools detected
    let devToolsOpen = false;
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          document.body.style.filter = 'blur(5px)';
          document.body.style.pointerEvents = 'none';
        }
      } else {
        if (devToolsOpen) {
          devToolsOpen = false;
          document.body.style.filter = 'none';
          document.body.style.pointerEvents = 'auto';
        }
      }
    };

    // Add event listeners
    document.addEventListener('selectstart', disableSelection);
    document.addEventListener('dragstart', disableSelection);
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableKeyboardShortcuts);
    
    // Check dev tools periodically
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Disable printing
    const disablePrint = () => {
      window.addEventListener('beforeprint', (e) => {
        e.preventDefault();
        return false;
      });
    };
    disablePrint();

    return () => {
      document.removeEventListener('selectstart', disableSelection);
      document.removeEventListener('dragstart', disableSelection);
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      clearInterval(devToolsInterval);
      document.body.style.filter = 'none';
      document.body.style.pointerEvents = 'auto';
    };
  }, [enabled]);
};

// Reading Settings Modal Component
interface ReadingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReadingSettings;
  onSettingsChange: (settings: ReadingSettings) => void;
}

function ReadingSettingsModal({ isOpen, onClose, settings, onSettingsChange }: ReadingSettingsModalProps) {
  if (!isOpen) return null;

  const fontFamilies = [
    { value: 'serif', label: 'Serif (Traditional)', example: 'Aa' },
    { value: 'sans', label: 'Sans Serif (Modern)', example: 'Aa' },
    { value: 'mono', label: 'Monospace', example: 'Aa' },
    { value: 'dyslexic', label: 'Dyslexic Friendly', example: 'Aa' }
  ];

  const themes = [
    { value: 'light', label: 'Light', bg: '#ffffff', text: '#1f2937', icon: Sun },
    { value: 'sepia', label: 'Sepia', bg: '#fef7ed', text: '#92400e', icon: Palette },
    { value: 'dark', label: 'Dark', bg: '#1f2937', text: '#f9fafb', icon: Moon },
    { value: 'night', label: 'Night', bg: '#0f1419', text: '#e5e7eb', icon: Moon }
  ];

  const handleCustomTheme = (theme: any) => {
    onSettingsChange({
      ...settings,
      theme: theme.value,
      backgroundColor: theme.bg,
      textColor: theme.text
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reading Settings</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Reading Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {themes.map(({ value, label, bg, text, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleCustomTheme({ value, bg, text })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                    settings.theme === value
                      ? 'border-blue-500 shadow-lg transform scale-[1.02]'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                  }`}
                  style={{ backgroundColor: bg, color: text }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{label}</span>
                  <div className="w-full h-6 rounded text-xs px-2 py-1 border" style={{ backgroundColor: bg, color: text }}>
                    Sample Text
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Font Family</label>
            <div className="grid grid-cols-2 gap-3">
              {fontFamilies.map(({ value, label, example }) => (
                <button
                  key={value}
                  onClick={() => onSettingsChange({ ...settings, fontFamily: value as any })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    settings.fontFamily === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`text-2xl mb-2 ${
                    value === 'serif' ? 'font-serif' :
                    value === 'sans' ? 'font-sans' :
                    value === 'mono' ? 'font-mono' :
                    'font-sans' // dyslexic fallback
                  }`}>
                    {example}
                  </div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Font Size: {settings.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="32"
              value={settings.fontSize}
              onChange={(e) => onSettingsChange({ ...settings, fontSize: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>12px</span>
              <span>20px</span>
              <span>32px</span>
            </div>
          </div>

          {/* Line Height */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Line Spacing: {settings.lineHeight.toFixed(1)}
            </label>
            <input
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => onSettingsChange({ ...settings, lineHeight: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Tight</span>
              <span>Normal</span>
              <span>Loose</span>
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Text Alignment</label>
            <div className="flex space-x-2">
              {(['left', 'justify', 'center'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => onSettingsChange({ ...settings, textAlign: align })}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-all duration-200 ${
                    settings.textAlign === align
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`text-xs leading-tight ${
                    align === 'left' ? 'text-left' :
                    align === 'center' ? 'text-center' :
                    'text-justify'
                  }`}>
                    {align === 'left' ? 'Left\nAlign' :
                     align === 'center' ? 'Center\nAlign' :
                     'Justify\nText'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Page Width */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Page Width: {settings.pageWidth}px
            </label>
            <input
              type="range"
              min="400"
              max="800"
              value={settings.pageWidth}
              onChange={(e) => onSettingsChange({ ...settings, pageWidth: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Narrow</span>
              <span>Normal</span>
              <span>Wide</span>
            </div>
          </div>

          {/* Page Margin */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Page Margins: {settings.pageMargin}px
            </label>
            <input
              type="range"
              min="20"
              max="80"
              value={settings.pageMargin}
              onChange={(e) => onSettingsChange({ ...settings, pageMargin: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Tight</span>
              <span>Normal</span>
              <span>Spacious</span>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between">
          <button
            onClick={() => {
              // Reset to defaults
              onSettingsChange({
                theme: 'light',
                fontSize: 16,
                fontFamily: 'serif',
                lineHeight: 1.6,
                textAlign: 'justify',
                columnWidth: 'normal',
                pageWidth: 600,
                backgroundColor: '#ffffff',
                textColor: '#1f2937',
                pageMargin: 40
              });
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// Page Component for Pagination
interface PageProps {
  content: string;
  pageNumber: number;
  totalPages: number;
  settings: ReadingSettings;
  isActive: boolean;
}

function Page({ content, pageNumber, totalPages, settings, isActive }: PageProps) {
  return (
    <div
      className={`page-content transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
      style={{
        fontFamily: settings.fontFamily === 'serif' ? 'Georgia, serif' :
                   settings.fontFamily === 'sans' ? 'Inter, sans-serif' :
                   settings.fontFamily === 'mono' ? 'Monaco, monospace' :
                   'OpenDyslexic, sans-serif',
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.lineHeight,
        textAlign: settings.textAlign,
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
        padding: `${settings.pageMargin}px`,
        maxWidth: `${settings.pageWidth}px`,
        margin: '0 auto',
        minHeight: 'calc(100vh - 200px)'
      }}
    >
      {/* Anti-screenshot overlay */}
      <div 
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.02) 10px,
            rgba(0,0,0,0.02) 11px
          )`,
          zIndex: 1
        }}
      />
      
      {/* Content */}
      <div 
        className="relative z-0 select-none"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
      />
      
      {/* Page number */}
      <div className="text-center mt-8 pt-4 border-t border-gray-200 dark:border-gray-600">
        <span className="text-sm text-gray-500">{pageNumber} of {totalPages}</span>
      </div>
      
      {/* Invisible text for screen reader accessibility */}
      <div className="sr-only">{content}</div>
    </div>
  );
}

export const ProfessionalEbookReader: React.FC<ProfessionalEbookReaderProps> = ({ 
  chapter, 
  onChapterChange,
  showNavigation = true,
  navigationInfo
}) => {
  const { user } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [pageFlipAnimation, setPageFlipAnimation] = useState(false);
  
  const [settings, setSettings] = useState<ReadingSettings>(() => {
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
      fontSize: 16,
      fontFamily: 'serif',
      lineHeight: 1.6,
      textAlign: 'justify',
      columnWidth: 'normal',
      pageWidth: 600,
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      pageMargin: 40
    };
  });

  // Enable content protection
  useContentProtection(protectionEnabled && !user?.metadata?.isAdmin);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('ebookReaderSettings', JSON.stringify(settings));
  }, [settings]);

  // Paginate content based on settings
  useEffect(() => {
    if (!chapter?.content) return;

    const paginateContent = () => {
      try {
        const content = chapter.plain_content || '';
        const wordsPerPage = Math.floor((settings.pageWidth * 0.8) / (settings.fontSize * 0.6)) * 
                           Math.floor(((window.innerHeight - 200) / (settings.fontSize * settings.lineHeight)));
        
        const words = content.split(/\s+/);
        const newPages: string[] = [];
        
        for (let i = 0; i < words.length; i += wordsPerPage) {
          const pageWords = words.slice(i, i + wordsPerPage);
          newPages.push(pageWords.join(' '));
        }
        
        setPages(newPages.length > 0 ? newPages : ['']);
        setTotalPages(newPages.length || 1);
        
        // Reset to first page if current page is beyond new total
        if (currentPage > newPages.length) {
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error paginating content:', error);
        setPages([chapter.plain_content || '']);
        setTotalPages(1);
      }
    };

    paginateContent();
    
    // Re-paginate on window resize
    const handleResize = () => {
      setTimeout(paginateContent, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chapter, settings, currentPage]);

  // Handle page navigation
  const goToPage = useCallback((page: number, withAnimation: boolean = true) => {
    if (page < 1 || page > totalPages) return;
    
    if (withAnimation) {
      setPageFlipAnimation(true);
      setTimeout(() => {
        setCurrentPage(page);
        setPageFlipAnimation(false);
      }, 150);
    } else {
      setCurrentPage(page);
    }
    
    // Update reading progress
    const progress = Math.round((page / totalPages) * 100);
    setReadingProgress(progress);
  }, [totalPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showSettings) return; // Don't navigate when settings are open
      
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
        case ' ': // Spacebar
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
        case 'f':
        case 'F11':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, showSettings, onChapterChange, navigationInfo, goToPage]);

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
          bookmarks: JSON.stringify([{ page: currentPage, timestamp: Date.now() }])
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
    }, 3000);
    
    return () => clearTimeout(saveProgress);
  }, [readingProgress, readingTime, user, chapter, currentPage]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Touch gesture handlers for mobile
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">Chapter not found or access denied</p>
        </div>
      </div>
    );
  }

  const currentContent = pages[currentPage - 1] || '';

  return (
    <div 
      className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
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
          <div className="absolute top-4 right-4 opacity-20 rotate-45 text-gray-400 text-xs">
            <Shield className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Header Controls */}
      <header className={`sticky top-0 z-20 backdrop-blur-md border-b transition-all duration-300 ${
        isFullscreen ? 'bg-opacity-95' : 'bg-opacity-90'
      }`} style={{ backgroundColor: `${settings.backgroundColor}e6`, borderColor: `${settings.textColor}20` }}>
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="hidden sm:block">
                <h1 className="font-semibold text-lg truncate max-w-sm" style={{ color: settings.textColor }}>
                  {chapter.title}
                </h1>
                <div className="flex items-center space-x-3 text-sm opacity-75">
                  <span>Chapter {chapter.chapter_number}</span>
                  {chapter.is_free && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                      FREE
                    </span>
                  )}
                  {!chapter.is_free && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      <Crown className="w-3 h-3 mr-1" />
                      PREMIUM
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Center - Page Progress */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Page {currentPage} of {totalPages}</span>
              </div>
              
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(currentPage / totalPages) * 100}%` }}
                />
              </div>
              
              <div className="flex items-center space-x-2 text-sm opacity-75">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setProtectionEnabled(!protectionEnabled)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  protectionEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
                title={protectionEnabled ? 'Protection Enabled' : 'Protection Disabled'}
              >
                {protectionEnabled ? <Shield className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Reading Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Reader */}
      <main className="relative flex-1 min-h-0" ref={contentRef}>
        {/* Page Container */}
        <div 
          className={`relative transition-transform duration-300 ${
            pageFlipAnimation ? 'transform scale-95 opacity-50' : ''
          }`}
          style={{ minHeight: 'calc(100vh - 120px)' }}
        >
          <Page
            content={currentContent}
            pageNumber={currentPage}
            totalPages={totalPages}
            settings={settings}
            isActive={true}
          />
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={() => {
              if (currentPage > 1) {
                goToPage(currentPage - 1);
              } else if (onChapterChange && navigationInfo?.hasPrev && navigationInfo.prevHasAccess) {
                onChapterChange('prev');
              }
            }}
            className={`ml-4 p-3 rounded-full transition-all duration-200 ${
              (currentPage > 1) || (navigationInfo?.hasPrev && navigationInfo.prevHasAccess)
                ? 'bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 bg-opacity-50 cursor-not-allowed'
            }`}
            disabled={currentPage === 1 && !(navigationInfo?.hasPrev && navigationInfo.prevHasAccess)}
          >
            <ChevronLeft className="w-6 h-6" style={{ color: settings.textColor }} />
          </button>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={() => {
              if (currentPage < totalPages) {
                goToPage(currentPage + 1);
              } else if (onChapterChange && navigationInfo?.hasNext && navigationInfo.nextHasAccess) {
                onChapterChange('next');
              }
            }}
            className={`mr-4 p-3 rounded-full transition-all duration-200 ${
              (currentPage < totalPages) || (navigationInfo?.hasNext && navigationInfo.nextHasAccess)
                ? 'bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 bg-opacity-50 cursor-not-allowed'
            }`}
            disabled={currentPage === totalPages && !(navigationInfo?.hasNext && navigationInfo.nextHasAccess)}
          >
            <ChevronRight className="w-6 h-6" style={{ color: settings.textColor }} />
          </button>
        </div>

        {/* Click zones for page navigation */}
        <div 
          className="absolute inset-0 grid grid-cols-3"
          style={{ zIndex: 5 }}
        >
          {/* Left click zone - Previous page */}
          <div 
            className="cursor-pointer"
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            title="Previous page"
          />
          
          {/* Center click zone - Settings */}
          <div 
            className="cursor-pointer"
            onClick={() => setShowSettings(true)}
            title="Settings"
          />
          
          {/* Right click zone - Next page */}
          <div 
            className="cursor-pointer"
            onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
            title="Next page"
          />
        </div>
      </main>

      {/* Footer Controls */}
      <footer className={`sticky bottom-0 z-20 backdrop-blur-md border-t transition-all duration-300 ${
        isFullscreen ? 'bg-opacity-95' : 'bg-opacity-90'
      }`} style={{ backgroundColor: `${settings.backgroundColor}e6`, borderColor: `${settings.textColor}20` }}>
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Chapter Navigation */}
            <div className="flex items-center space-x-2">
              {showNavigation && onChapterChange && navigationInfo?.hasPrev && (
                <button
                  onClick={() => onChapterChange('prev')}
                  disabled={!navigationInfo.prevHasAccess}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 ${
                    navigationInfo.prevHasAccess
                      ? 'hover:bg-gray-200 dark:hover:bg-gray-700'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  title={navigationInfo.prevHasAccess ? navigationInfo.prevTitle : 'Previous chapter requires subscription'}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                  {!navigationInfo.prevHasAccess && <Lock className="w-3 h-3 text-yellow-500" />}
                </button>
              )}
            </div>

            {/* Reading Stats */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>{readingProgress}%</span>
              </div>
              
              <div className="hidden sm:flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>{chapter.word_count.toLocaleString()} words</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs">{currentPage}/{totalPages}</span>
              </div>
            </div>

            {/* Chapter Navigation */}
            <div className="flex items-center space-x-2">
              {showNavigation && onChapterChange && navigationInfo?.hasNext && (
                <button
                  onClick={() => onChapterChange('next')}
                  disabled={!navigationInfo.nextHasAccess}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 ${
                    navigationInfo.nextHasAccess
                      ? 'hover:bg-gray-200 dark:hover:bg-gray-700'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  title={navigationInfo.nextHasAccess ? navigationInfo.nextTitle : 'Next chapter requires subscription'}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                  {!navigationInfo.nextHasAccess && <Lock className="w-3 h-3 text-yellow-500" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <ReadingSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Anti-copy overlay (when protection is enabled) */}
      {protectionEnabled && (
        <div className="fixed inset-0 pointer-events-none select-none z-[5]">
          <div 
            className="absolute inset-0 opacity-[0.01]" 
            style={{
              background: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><text y='50' font-size='20' fill='%23000000' opacity='0.1'>PROTECTED</text></svg>") repeat`
            }}
          />
        </div>
      )}

      {/* Keyboard shortcuts help (show on hover) */}
      <div className="fixed bottom-20 left-4 z-30">
        <div className="bg-black bg-opacity-75 text-white text-xs rounded-lg px-3 py-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div>← → Arrow keys: Navigate pages</div>
          <div>Space: Next page</div>
          <div>F: Toggle fullscreen</div>
          <div>Home/End: First/Last page</div>
        </div>
      </div>
    </div>
  );
};