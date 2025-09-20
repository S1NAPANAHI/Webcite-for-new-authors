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
  Zap
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
        }\      }
      
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
                  onClick={() => handleCustomTheme({ value, bg, text })}\n                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
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
              ))}\n            </div>
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
              ))}\n            </div>
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
  
  const [settings, setSettings] = useState<ReadingSettings>(() => {\n    const saved = localStorage.getItem('ebookReaderSettings');\n    if (saved) {\n      try {\n        return JSON.parse(saved);\n      } catch (e) {\n        console.error('Error loading reading settings:', e);\n      }\n    }\n    return {\n      theme: 'light',\n      fontSize: 16,\n      fontFamily: 'serif',\n      lineHeight: 1.6,\n      textAlign: 'justify',\n      columnWidth: 'normal',\n      pageWidth: 600,\n      backgroundColor: '#ffffff',\n      textColor: '#1f2937',\n      pageMargin: 40\n    };\n  });\n\n  // Enable content protection\n  useContentProtection(protectionEnabled && !user?.metadata?.isAdmin);\n\n  // Save settings to localStorage\n  useEffect(() => {\n    localStorage.setItem('ebookReaderSettings', JSON.stringify(settings));\n  }, [settings]);\n\n  // Paginate content based on settings\n  useEffect(() => {\n    if (!chapter?.content) return;\n\n    const paginateContent = () => {\n      try {\n        const content = chapter.plain_content || '';\n        const wordsPerPage = Math.floor((settings.pageWidth * 0.8) / (settings.fontSize * 0.6)) * \n                           Math.floor(((window.innerHeight - 200) / (settings.fontSize * settings.lineHeight)));\n        \n        const words = content.split(/\\s+/);\n        const newPages: string[] = [];\n        \n        for (let i = 0; i < words.length; i += wordsPerPage) {\n          const pageWords = words.slice(i, i + wordsPerPage);\n          newPages.push(pageWords.join(' '));\n        }\n        \n        setPages(newPages.length > 0 ? newPages : ['']);\n        setTotalPages(newPages.length || 1);\n        \n        // Reset to first page if current page is beyond new total\n        if (currentPage > newPages.length) {\n          setCurrentPage(1);\n        }\n      } catch (error) {\n        console.error('Error paginating content:', error);\n        setPages([chapter.plain_content || '']);\n        setTotalPages(1);\n      }\n    };\n\n    paginateContent();\n    \n    // Re-paginate on window resize\n    const handleResize = () => {\n      setTimeout(paginateContent, 100);\n    };\n    \n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, [chapter, settings, currentPage]);\n\n  // Handle page navigation\n  const goToPage = useCallback((page: number, withAnimation: boolean = true) => {\n    if (page < 1 || page > totalPages) return;\n    \n    if (withAnimation) {\n      setPageFlipAnimation(true);\n      setTimeout(() => {\n        setCurrentPage(page);\n        setPageFlipAnimation(false);\n      }, 150);\n    } else {\n      setCurrentPage(page);\n    }\n    \n    // Update reading progress\n    const progress = Math.round((page / totalPages) * 100);\n    setReadingProgress(progress);\n  }, [totalPages]);\n\n  // Keyboard navigation\n  useEffect(() => {\n    const handleKeyPress = (e: KeyboardEvent) => {\n      if (showSettings) return; // Don't navigate when settings are open\n      \n      switch (e.key) {\n        case 'ArrowLeft':\n        case 'PageUp':\n          e.preventDefault();\n          if (currentPage > 1) {\n            goToPage(currentPage - 1);\n          } else if (onChapterChange && navigationInfo?.hasPrev) {\n            onChapterChange('prev');\n          }\n          break;\n        case 'ArrowRight':\n        case 'PageDown':\n        case ' ': // Spacebar\n          e.preventDefault();\n          if (currentPage < totalPages) {\n            goToPage(currentPage + 1);\n          } else if (onChapterChange && navigationInfo?.hasNext) {\n            onChapterChange('next');\n          }\n          break;\n        case 'Home':\n          e.preventDefault();\n          goToPage(1);\n          break;\n        case 'End':\n          e.preventDefault();\n          goToPage(totalPages);\n          break;\n        case 'f':\n        case 'F11':\n          e.preventDefault();\n          toggleFullscreen();\n          break;\n      }\n    };\n\n    document.addEventListener('keydown', handleKeyPress);\n    return () => document.removeEventListener('keydown', handleKeyPress);\n  }, [currentPage, totalPages, showSettings, onChapterChange, navigationInfo]);\n\n  // Track reading time\n  useEffect(() => {\n    const interval = setInterval(() => {\n      setReadingTime(prev => prev + 1);\n    }, 1000);\n    \n    return () => clearInterval(interval);\n  }, []);\n\n  // Auto-save reading progress\n  useEffect(() => {\n    if (!user || !chapter) return;\n    \n    const saveProgress = setTimeout(async () => {\n      try {\n        const progressData = {\n          user_id: user.id,\n          chapter_id: chapter.id,\n          progress_percentage: readingProgress,\n          last_read_at: new Date().toISOString(),\n          reading_time_minutes: Math.floor(readingTime / 60),\n          completed: readingProgress >= 95,\n          bookmarks: JSON.stringify([{ page: currentPage, timestamp: Date.now() }])\n        };\n        \n        const { error } = await supabase\n          .from('reading_progress')\n          .upsert(progressData);\n          \n        if (error) {\n          console.error('Error saving reading progress:', error);\n        }\n      } catch (err) {\n        console.error('Error saving progress:', err);\n      }\n    }, 3000);\n    \n    return () => clearTimeout(saveProgress);\n  }, [readingProgress, readingTime, user, chapter, currentPage]);\n\n  // Fullscreen toggle\n  const toggleFullscreen = () => {\n    if (!isFullscreen) {\n      document.documentElement.requestFullscreen?.();\n      setIsFullscreen(true);\n    } else {\n      document.exitFullscreen?.();\n      setIsFullscreen(false);\n    }\n  };\n\n  // Touch gesture handlers for mobile\n  const [touchStart, setTouchStart] = useState<number | null>(null);\n  const [touchEnd, setTouchEnd] = useState<number | null>(null);\n\n  const handleTouchStart = (e: React.TouchEvent) => {\n    setTouchEnd(null);\n    setTouchStart(e.targetTouches[0].clientX);\n  };\n\n  const handleTouchMove = (e: React.TouchEvent) => {\n    setTouchEnd(e.targetTouches[0].clientX);\n  };\n\n  const handleTouchEnd = () => {\n    if (!touchStart || !touchEnd) return;\n    \n    const distance = touchStart - touchEnd;\n    const isLeftSwipe = distance > 50;\n    const isRightSwipe = distance < -50;\n\n    if (isLeftSwipe && currentPage < totalPages) {\n      goToPage(currentPage + 1);\n    }\n    if (isRightSwipe && currentPage > 1) {\n      goToPage(currentPage - 1);\n    }\n  };\n\n  if (!chapter) {\n    return (\n      <div className=\"min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900\">\n        <div className=\"text-center\">\n          <Lock className=\"w-16 h-16 text-red-500 mx-auto mb-4\" />\n          <h2 className=\"text-xl font-semibold text-gray-900 dark:text-white mb-2\">Access Denied</h2>\n          <p className=\"text-gray-600 dark:text-gray-400\">Chapter not found or access denied</p>\n        </div>\n      </div>\n    );\n  }\n\n  const currentContent = pages[currentPage - 1] || '';\n\n  return (\n    <div \n      className={`min-h-screen transition-all duration-500 relative overflow-hidden ${\n        isFullscreen ? 'fixed inset-0 z-50' : ''\n      }`}\n      style={{\n        backgroundColor: settings.backgroundColor,\n        color: settings.textColor\n      }}\n      onTouchStart={handleTouchStart}\n      onTouchMove={handleTouchMove}\n      onTouchEnd={handleTouchEnd}\n    >\n      {/* Content Protection Overlay */}\n      {protectionEnabled && (\n        <div className=\"absolute inset-0 pointer-events-none select-none z-10\">\n          <div className=\"absolute top-4 right-4 opacity-20 rotate-45 text-gray-400 text-xs\">\n            <Shield className=\"w-4 h-4\" />\n          </div>\n        </div>\n      )}\n\n      {/* Header Controls */}\n      <header className={`sticky top-0 z-20 backdrop-blur-md border-b transition-all duration-300 ${\n        isFullscreen ? 'bg-opacity-95' : 'bg-opacity-90'\n      }`} style={{ backgroundColor: `${settings.backgroundColor}e6`, borderColor: `${settings.textColor}20` }}>\n        <div className=\"max-w-5xl mx-auto px-4 py-3\">\n          <div className=\"flex items-center justify-between\">\n            {/* Left Controls */}\n            <div className=\"flex items-center space-x-3\">\n              <button\n                onClick={() => window.history.back()}\n                className=\"p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200\"\n                title=\"Back\"\n              >\n                <ArrowLeft className=\"w-5 h-5\" />\n              </button>\n              \n              <div className=\"hidden sm:block\">\n                <h1 className=\"font-semibold text-lg truncate max-w-sm\" style={{ color: settings.textColor }}>\n                  {chapter.title}\n                </h1>\n                <div className=\"flex items-center space-x-3 text-sm opacity-75\">\n                  <span>Chapter {chapter.chapter_number}</span>\n                  {chapter.is_free && (\n                    <span className=\"inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800\">\n                      FREE\n                    </span>\n                  )}\n                  {!chapter.is_free && (\n                    <span className=\"inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800\">\n                      <Crown className=\"w-3 h-3 mr-1\" />\n                      PREMIUM\n                    </span>\n                  )}\n                </div>\n              </div>\n            </div>\n\n            {/* Center - Page Progress */}\n            <div className=\"hidden md:flex items-center space-x-4\">\n              <div className=\"flex items-center space-x-2 text-sm\">\n                <BookOpen className=\"w-4 h-4\" />\n                <span>Page {currentPage} of {totalPages}</span>\n              </div>\n              \n              <div className=\"w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5\">\n                <div \n                  className=\"bg-blue-600 h-1.5 rounded-full transition-all duration-500\"\n                  style={{ width: `${(currentPage / totalPages) * 100}%` }}\n                />\n              </div>\n              \n              <div className=\"flex items-center space-x-2 text-sm opacity-75\">\n                <Clock className=\"w-4 h-4\" />\n                <span>{Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}</span>\n              </div>\n            </div>\n\n            {/* Right Controls */}\n            <div className=\"flex items-center space-x-2\">\n              <button\n                onClick={() => setProtectionEnabled(!protectionEnabled)}\n                className={`p-2 rounded-lg transition-colors duration-200 ${\n                  protectionEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'\n                }`}\n                title={protectionEnabled ? 'Protection Enabled' : 'Protection Disabled'}\n              >\n                {protectionEnabled ? <Shield className=\"w-4 h-4\" /> : <Eye className=\"w-4 h-4\" />}\n              </button>\n              \n              <button\n                onClick={() => setShowSettings(true)}\n                className=\"p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200\"\n                title=\"Reading Settings\"\n              >\n                <Settings className=\"w-4 h-4\" />\n              </button>\n              \n              <button\n                onClick={toggleFullscreen}\n                className=\"p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200\"\n                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}\n              >\n                {isFullscreen ? <Minimize className=\"w-4 h-4\" /> : <Maximize className=\"w-4 h-4\" />}\n              </button>\n            </div>\n          </div>\n        </div>\n      </header>\n\n      {/* Main Reader */}\n      <main className=\"relative flex-1 min-h-0\" ref={contentRef}>\n        {/* Page Container */}\n        <div \n          className={`relative transition-transform duration-300 ${\n            pageFlipAnimation ? 'transform scale-95 opacity-50' : ''\n          }`}\n          style={{ minHeight: 'calc(100vh - 120px)' }}\n        >\n          <Page\n            content={currentContent}\n            pageNumber={currentPage}\n            totalPages={totalPages}\n            settings={settings}\n            isActive={true}\n          />\n        </div>\n\n        {/* Navigation Arrows */}\n        <div className=\"absolute inset-y-0 left-0 flex items-center\">\n          <button\n            onClick={() => {\n              if (currentPage > 1) {\n                goToPage(currentPage - 1);\n              } else if (onChapterChange && navigationInfo?.hasPrev && navigationInfo.prevHasAccess) {\n                onChapterChange('prev');\n              }\n            }}\n            className={`ml-4 p-3 rounded-full transition-all duration-200 ${\n              (currentPage > 1) || (navigationInfo?.hasPrev && navigationInfo.prevHasAccess)\n                ? 'bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg hover:shadow-xl'\n                : 'bg-gray-200 bg-opacity-50 cursor-not-allowed'\n            }`}\n            disabled={currentPage === 1 && !(navigationInfo?.hasPrev && navigationInfo.prevHasAccess)}\n          >\n            <ChevronLeft className=\"w-6 h-6\" style={{ color: settings.textColor }} />\n          </button>\n        </div>\n\n        <div className=\"absolute inset-y-0 right-0 flex items-center\">\n          <button\n            onClick={() => {\n              if (currentPage < totalPages) {\n                goToPage(currentPage + 1);\n              } else if (onChapterChange && navigationInfo?.hasNext && navigationInfo.nextHasAccess) {\n                onChapterChange('next');\n              }\n            }}\n            className={`mr-4 p-3 rounded-full transition-all duration-200 ${\n              (currentPage < totalPages) || (navigationInfo?.hasNext && navigationInfo.nextHasAccess)\n                ? 'bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg hover:shadow-xl'\n                : 'bg-gray-200 bg-opacity-50 cursor-not-allowed'\n            }`}\n            disabled={currentPage === totalPages && !(navigationInfo?.hasNext && navigationInfo.nextHasAccess)}\n          >\n            <ChevronRight className=\"w-6 h-6\" style={{ color: settings.textColor }} />\n          </button>\n        </div>\n\n        {/* Click zones for page navigation */}\n        <div \n          className=\"absolute inset-0 grid grid-cols-3\"\n          style={{ zIndex: 5 }}\n        >\n          {/* Left click zone - Previous page */}\n          <div \n            className=\"cursor-pointer\"\n            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}\n            title=\"Previous page\"\n          />\n          \n          {/* Center click zone - Settings */}\n          <div \n            className=\"cursor-pointer\"\n            onClick={() => setShowSettings(true)}\n            title=\"Settings\"\n          />\n          \n          {/* Right click zone - Next page */}\n          <div \n            className=\"cursor-pointer\"\n            onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}\n            title=\"Next page\"\n          />\n        </div>\n      </main>\n\n      {/* Footer Controls */}\n      <footer className={`sticky bottom-0 z-20 backdrop-blur-md border-t transition-all duration-300 ${\n        isFullscreen ? 'bg-opacity-95' : 'bg-opacity-90'\n      }`} style={{ backgroundColor: `${settings.backgroundColor}e6`, borderColor: `${settings.textColor}20` }}>\n        <div className=\"max-w-5xl mx-auto px-4 py-3\">\n          <div className=\"flex items-center justify-between\">\n            {/* Chapter Navigation */}\n            <div className=\"flex items-center space-x-2\">\n              {showNavigation && onChapterChange && navigationInfo?.hasPrev && (\n                <button\n                  onClick={() => onChapterChange('prev')}\n                  disabled={!navigationInfo.prevHasAccess}\n                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 ${\n                    navigationInfo.prevHasAccess\n                      ? 'hover:bg-gray-200 dark:hover:bg-gray-700'\n                      : 'opacity-50 cursor-not-allowed'\n                  }`}\n                  title={navigationInfo.prevHasAccess ? navigationInfo.prevTitle : 'Previous chapter requires subscription'}\n                >\n                  <ChevronLeft className=\"w-4 h-4\" />\n                  <span className=\"hidden sm:inline\">Previous</span>\n                  {!navigationInfo.prevHasAccess && <Lock className=\"w-3 h-3 text-yellow-500\" />}\n                </button>\n              )}\n            </div>\n\n            {/* Reading Stats */}\n            <div className=\"flex items-center space-x-4 text-sm\">\n              <div className=\"flex items-center space-x-2\">\n                <BarChart3 className=\"w-4 h-4\" />\n                <span>{readingProgress}%</span>\n              </div>\n              \n              <div className=\"hidden sm:flex items-center space-x-2\">\n                <FileText className=\"w-4 h-4\" />\n                <span>{chapter.word_count.toLocaleString()} words</span>\n              </div>\n              \n              <div className=\"flex items-center space-x-2\">\n                <span className=\"font-mono text-xs\">{currentPage}/{totalPages}</span>\n              </div>\n            </div>\n\n            {/* Chapter Navigation */}\n            <div className=\"flex items-center space-x-2\">\n              {showNavigation && onChapterChange && navigationInfo?.hasNext && (\n                <button\n                  onClick={() => onChapterChange('next')}\n                  disabled={!navigationInfo.nextHasAccess}\n                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center space-x-2 ${\n                    navigationInfo.nextHasAccess\n                      ? 'hover:bg-gray-200 dark:hover:bg-gray-700'\n                      : 'opacity-50 cursor-not-allowed'\n                  }`}\n                  title={navigationInfo.nextHasAccess ? navigationInfo.nextTitle : 'Next chapter requires subscription'}\n                >\n                  <span className=\"hidden sm:inline\">Next</span>\n                  <ChevronRight className=\"w-4 h-4\" />\n                  {!navigationInfo.nextHasAccess && <Lock className=\"w-3 h-3 text-yellow-500\" />}\n                </button>\n              )}\n            </div>\n          </div>\n        </div>\n      </footer>\n\n      {/* Settings Modal */}\n      <ReadingSettingsModal\n        isOpen={showSettings}\n        onClose={() => setShowSettings(false)}\n        settings={settings}\n        onSettingsChange={setSettings}\n      />\n\n      {/* Anti-copy overlay (when protection is enabled) */}\n      {protectionEnabled && (\n        <div className=\"fixed inset-0 pointer-events-none select-none z-[5]\">\n          <div \n            className=\"absolute inset-0 opacity-[0.01]\" \n            style={{\n              background: `url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><text y='50' font-size='20' fill='%23000000' opacity='0.1'>PROTECTED</text></svg>\") repeat`\n            }}\n          />\n        </div>\n      )}\n\n      {/* Keyboard shortcuts help (show on hover) */}\n      <div className=\"fixed bottom-20 left-4 z-30\">\n        <div className=\"bg-black bg-opacity-75 text-white text-xs rounded-lg px-3 py-2 opacity-0 hover:opacity-100 transition-opacity duration-300\">\n          <div>← → Arrow keys: Navigate pages</div>\n          <div>Space: Next page</div>\n          <div>F: Toggle fullscreen</div>\n          <div>Home/End: First/Last page</div>\n        </div>\n      </div>\n    </div>\n  );\n};