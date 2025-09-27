import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  BookOpen,
  X,
  Maximize2,
  Minimize2,
  Home,
  Menu,
  Crown,
  Shield,
  Eye,
  Clock,
  BarChart3,
  Image as ImageIcon,
  Bookmark,
  Sun,
  Moon,
  Coffee,
  Palette,
  Type,
  AlignLeft,
  Keyboard,
  HelpCircle,
  Info
} from 'lucide-react';
import { useAuth } from '@zoroaster/shared';
import { supabase } from '../lib/supabase';
import { useFileUrl } from '../utils/fileUrls';
import './ebook-reader.css';
import '../styles/enhanced-reader-ui.css';

type Tier = 'free' | 'premium' | 'patron';

export interface ChapterLite {
  id: string;
  slug?: string | null;
  title: string;
  chapter_number: number;
  is_free?: boolean | null;
  subscription_tier_required?: Tier | null;
  has_access?: boolean;
  word_count?: number;
  estimated_read_time?: number;
  completed?: boolean;
  hero_file_url?: string;
  hero_file_alt_text?: string;
  banner_file_url?: string;
  banner_file_alt_text?: string;
  hero_file_id?: string | null;
  banner_file_id?: string | null;
}

interface Chapter extends ChapterLite {
  content?: any;
  plain_content?: string;
  issue_id?: string;
  metadata?: any;
}

interface User {
  id: string;
  subscription_tier?: Tier | null;
  metadata?: any;
}

interface NavigationInfo {
  hasPrev: boolean;
  hasNext: boolean;
  prevTitle?: string;
  nextTitle?: string;
  prevHasAccess: boolean;
  nextHasAccess: boolean;
}

interface ImmersiveEbookReaderEnhancedProps {
  chapter: Chapter;
  onChapterChange?: (direction: 'prev' | 'next') => void;
  showNavigation?: boolean;
  navigationInfo?: NavigationInfo;
  onExit?: () => void;
}

interface ReadingSettings {
  fontSize: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'sepia' | 'night';
  lineHeight: number;
  textAlign: 'justify' | 'left' | 'center';
  wordsPerPage: number;
  showHeroImage: boolean;
  pageTransition: 'fade' | 'slide' | 'none';
  focusMode: boolean;
  autoScroll: boolean;
  speedReading: boolean;
}

const READER_PORTAL_ID = 'zoro-reader-portal-root';

function ensurePortalRoot(): HTMLElement {
  let root = document.getElementById(READER_PORTAL_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = READER_PORTAL_ID;
    root.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 2147483647;
      pointer-events: none;
    `;
    document.body.appendChild(root);
  }
  return root;
}

const tierRank: Record<Tier, number> = { free: 0, premium: 1, patron: 2 };

function hasAccess(ch: Chapter, user: User | null) {
  if (ch.is_free) return true;
  if (!user) return false;
  const need = (ch.subscription_tier_required || 'premium') as Tier;
  const have = (user.subscription_tier || 'free') as Tier;
  return tierRank[have] >= tierRank[need];
}

// Enhanced word-based pagination with transition support
const paginateByWordCount = (content: string, wordsPerPage: number): string[] => {
  if (!content) return [''];
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const pages: string[] = [];
  
  for (let i = 0; i < words.length; i += wordsPerPage) {
    const pageWords = words.slice(i, i + wordsPerPage);
    pages.push(pageWords.join(' '));
  }
  
  return pages.length > 0 ? pages : [content];
};

// Enhanced content protection
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

// Enhanced Hero Image Component with loading states
function ChapterHero({ chapter, onLoad }: { chapter: Chapter; onLoad?: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const heroUrlFromFile = useFileUrl(chapter?.hero_file_id);
  const heroUrl = heroUrlFromFile || chapter?.hero_file_url || null;

  if (!heroUrl) return null;

  return (
    <div className="chapter-hero-enhanced">
      {!imageLoaded && !imageError && (
        <div className="hero-loading-placeholder loading-shimmer"
             style={{ width: '100%', height: '300px', borderRadius: '16px' }} />
      )}
      
      <img
        src={heroUrl}
        alt={chapter?.hero_file_alt_text || chapter?.title || 'Chapter hero image'}
        className={`hero-image-enhanced ${imageLoaded ? 'loaded' : ''}`}
        style={{
          display: imageError ? 'none' : 'block',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }}
        loading="lazy"
        onLoad={() => {
          setImageLoaded(true);
          onLoad?.();
          console.log('✅ Hero image loaded successfully:', heroUrl);
        }}
        onError={(e) => {
          setImageError(true);
          console.error('❌ Hero image failed to load:', heroUrl);
        }}
      />
    </div>
  );
}

// Reading Progress Ring Component
function ReadingProgress({ progress, size = 60 }: { progress: number; size?: number }) {
  const circumference = 2 * Math.PI * (size / 2 - 5);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="progress-ring" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 5}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 5}
          stroke="url(#progressGradient)"
          strokeWidth="3"
          fill="none"
          className="progress-ring-circle"
          style={{ strokeDashoffset }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold">{progress}%</span>
      </div>
    </div>
  );
}

// Status Indicator Component
function StatusIndicator({ message, type = 'info' }: { message: string; type?: 'info' | 'success' | 'warning' }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`reading-mode-indicator ${show ? 'show' : ''}`}>
      {message}
    </div>
  );
}

// 🎯 NEW: Keyboard Shortcuts Help Component
function KeyboardShortcutsHelp({ isOpen, onClose, theme }: { isOpen: boolean; onClose: () => void; theme: string }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '←/→', description: 'Navigate pages' },
    { key: 'Space', description: 'Next page' },
    { key: 'T', description: 'Toggle sidebar' },
    { key: 'S', description: 'Open settings' },
    { key: 'M', description: 'Toggle focus mode' },
    { key: 'F', description: 'Toggle fullscreen' },
    { key: 'G', description: 'Go to first page' },
    { key: 'Shift+G', description: 'Go to last page' },
    { key: 'H', description: 'Previous page (Vim)' },
    { key: 'L', description: 'Next page (Vim)' },
    { key: 'ESC', description: 'Exit reader' },
    { key: '?', description: 'Show this help' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[2147483647] flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
        theme === 'dark' || theme === 'night' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${
          theme === 'dark' || theme === 'night' 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-gray-100 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${
                  theme === 'dark' || theme === 'night' ? 'text-white' : 'text-gray-900'
                }`}>
                  Keyboard Shortcuts
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' || theme === 'night' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Power user shortcuts for faster reading
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' || theme === 'night' 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className={`text-sm ${
                  theme === 'dark' || theme === 'night' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {shortcut.description}
                </span>
                <kbd className={`px-3 py-1 text-xs font-mono font-bold rounded-lg ${
                  theme === 'dark' || theme === 'night' 
                    ? 'bg-gray-700 text-gray-200 border border-gray-600' 
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}>
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          theme === 'dark' || theme === 'night' 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-gray-100 bg-gray-50'
        }`}>
          <p className={`text-xs text-center ${
            theme === 'dark' || theme === 'night' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            💡 Tip: These shortcuts work when reading content
          </p>
        </div>
      </div>
    </div>
  );
}

export const ImmersiveEbookReaderEnhanced: React.FC<ImmersiveEbookReaderEnhancedProps> = ({ 
  chapter, 
  onChapterChange,
  showNavigation = true,
  navigationInfo,
  onExit
}) => {
  const { user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [allChapters, setAllChapters] = useState<ChapterLite[]>([]);
  const [pageTransitioning, setPageTransitioning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    const saved = localStorage.getItem('immersiveEbookSettingsEnhanced');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lineHeight && typeof parsed.lineHeight === 'string') {
          parsed.lineHeight = parseFloat(parsed.lineHeight);
        }
        return {
          ...parsed,
          lineHeight: Number(parsed.lineHeight) || 1.7,
          showHeroImage: parsed.showHeroImage !== false,
          pageTransition: parsed.pageTransition || 'slide',
          focusMode: parsed.focusMode || false,
          autoScroll: parsed.autoScroll || false,
          speedReading: parsed.speedReading || false
        };
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
    return {
      theme: 'sepia',
      fontSize: 18,
      fontFamily: 'Georgia, serif',
      lineHeight: 1.7,
      textAlign: 'justify',
      wordsPerPage: 350,
      showHeroImage: true,
      pageTransition: 'slide',
      focusMode: false,
      autoScroll: false,
      speedReading: false
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
    localStorage.setItem('immersiveEbookSettingsEnhanced', JSON.stringify(settings));
  }, [settings]);

  // Body scroll lock and setup
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('reader-active');
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove('reader-active');
    };
  }, []);

  // Footer height tracking
  useLayoutEffect(() => {
    if (!footerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      if (entries[0]) {
        const h = Math.ceil(entries[0].contentRect.height);
        document.documentElement.style.setProperty('--reader-footer-height', `${h}px`);
      }
    });
    ro.observe(footerRef.current);
    return () => ro.disconnect();
  }, []);

  // Enhanced pagination with transition support
  useEffect(() => {
    if (!chapter?.plain_content) return;

    const newPages = paginateByWordCount(chapter.plain_content, settings.wordsPerPage);
    setPages(newPages);
    setTotalPages(newPages.length);
    
    if (currentPage > newPages.length && newPages.length > 0) {
      setCurrentPage(1);
    }
  }, [chapter, settings.wordsPerPage, settings.fontSize, settings.lineHeight, currentPage]);

  // Enhanced page navigation with transitions
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    
    if (settings.pageTransition !== 'none') {
      setPageTransitioning(true);
      setTimeout(() => {
        setCurrentPage(page);
        setPageTransitioning(false);
      }, settings.pageTransition === 'fade' ? 200 : 300);
    } else {
      setCurrentPage(page);
    }
    
    const progress = Math.round((page / totalPages) * 100);
    setReadingProgress(progress);
  }, [totalPages, settings.pageTransition]);

  // Enhanced fullscreen toggle
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
        setFullscreen(true);
        setStatusMessage('Entered fullscreen mode');
      } else {
        await document.exitFullscreen?.();
        setFullscreen(false);
        setStatusMessage('Exited fullscreen mode');
      }
    } catch {
      setFullscreen((f) => !f);
    }
  };

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showSettings || showKeyboardHelp || isSidebarOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'PageUp':
        case 'h':
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
        case 'l':
          e.preventDefault();
          if (currentPage < totalPages) {
            goToPage(currentPage + 1);
          } else if (onChapterChange && navigationInfo?.hasNext) {
            onChapterChange('next');
          }
          break;
        case 'Home':
        case 'g':
          e.preventDefault();
          goToPage(1);
          setStatusMessage('Jumped to first page');
          break;
        case 'End':
        case 'G':
          e.preventDefault();
          goToPage(totalPages);
          setStatusMessage('Jumped to last page');
          break;
        case 'Escape':
          e.preventDefault();
          if (isFullscreen) {
            toggleFullscreen();
          } else {
            onExit?.();
          }
          break;
        case 't':
        case 'T':
          e.preventDefault();
          setSidebarOpen(true);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          setShowSettings(true);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setSettings(prev => ({ ...prev, focusMode: !prev.focusMode }));
          setStatusMessage(settings.focusMode ? 'Focus mode disabled' : 'Focus mode enabled');
          break;
        case '?':
          e.preventDefault();
          setShowKeyboardHelp(true);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, showSettings, showKeyboardHelp, isSidebarOpen, onChapterChange, navigationInfo, goToPage, onExit, isFullscreen, settings.focusMode]);

  // Reading time tracker
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

  // Enhanced touch gesture handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchStartY) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const distance = touchStart - touchEnd;
    const verticalDistance = Math.abs(touchStartY - touchEndY);
    const isHorizontalSwipe = Math.abs(distance) > verticalDistance * 2;
    
    if (isHorizontalSwipe) {
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;

      if (isLeftSwipe && currentPage < totalPages) {
        goToPage(currentPage + 1);
      }
      if (isRightSwipe && currentPage > 1) {
        goToPage(currentPage - 1);
      }
    }
    
    setTouchStart(null);
    setTouchStartY(null);
  };

  const handleChapterSelect = (chapterSlug: string) => {
    const issueSlug = window.location.pathname.split('/')[2];
    window.location.href = `/read/${issueSlug}/${chapterSlug}`;
  };

  if (!chapter) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-[2147483647]">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-4 text-red-400">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-300">Chapter not found or access denied</p>
        </div>
      </div>
    );
  }

  const currentContent = pages[currentPage - 1] || '';
  const getFontFamily = () => settings.fontFamily;

  // Enhanced theme colors
  const getThemeColors = () => {
    switch (settings.theme) {
      case 'light':
        return { 
          bg: 'linear-gradient(135deg, #fff 0%, #f9fafb 100%)', 
          text: '#2d3748', 
          accent: 'rgba(45, 55, 72, 0.1)',
          glass: 'rgba(255, 255, 255, 0.15)',
          settingsBg: 'rgba(255, 255, 255, 0.95)',
          settingsText: '#1f2937',
          settingsBorder: 'rgba(0, 0, 0, 0.1)'
        };
      case 'dark':
        return { 
          bg: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)', 
          text: '#e2e8f0', 
          accent: 'rgba(226, 232, 240, 0.1)',
          glass: 'rgba(0, 0, 0, 0.15)',
          settingsBg: 'rgba(31, 41, 55, 0.95)',
          settingsText: '#f9fafb',
          settingsBorder: 'rgba(255, 255, 255, 0.1)'
        };
      case 'sepia':
        return { 
          bg: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)', 
          text: '#8b4513', 
          accent: 'rgba(139, 69, 19, 0.1)',
          glass: 'rgba(139, 69, 19, 0.05)',
          settingsBg: 'rgba(254, 243, 199, 0.95)',
          settingsText: '#92400e',
          settingsBorder: 'rgba(139, 69, 19, 0.2)'
        };
      case 'night':
        return { 
          bg: 'linear-gradient(135deg, #0f1419 0%, #1a1a2e 100%)', 
          text: '#cbd5e0', 
          accent: 'rgba(203, 213, 224, 0.1)',
          glass: 'rgba(0, 0, 0, 0.3)',
          settingsBg: 'rgba(15, 20, 25, 0.95)',
          settingsText: '#e5e7eb',
          settingsBorder: 'rgba(255, 255, 255, 0.1)'
        };
      default:
        return { 
          bg: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)', 
          text: '#8b4513', 
          accent: 'rgba(139, 69, 19, 0.1)',
          glass: 'rgba(139, 69, 19, 0.05)',
          settingsBg: 'rgba(254, 243, 199, 0.95)',
          settingsText: '#92400e',
          settingsBorder: 'rgba(139, 69, 19, 0.2)'
        };
    }
  };

  const themeColors = getThemeColors();
  const shouldShowHeroImage = settings.showHeroImage && currentPage === 1;

  const overlay = (
    <div 
      className={`fixed inset-0 overflow-hidden ${isFullscreen ? 'z-[2147483647]' : 'z-[2147483647]'} theme-${settings.theme} ${settings.focusMode ? 'focus-mode' : ''}`}
      style={{
        background: themeColors.bg,
        color: themeColors.text,
        pointerEvents: 'auto'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Status Message */}
      {statusMessage && (
        <StatusIndicator message={statusMessage} />
      )}

      {/* Content Protection Overlay */}
      {protectionEnabled && (
        <div className="protection-overlay" style={{ color: themeColors.text }}>
          <Shield className="w-8 h-8" />
        </div>
      )}

      {/* Enhanced Sidebar with Glassmorphism */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div 
        className={`fixed top-0 left-0 h-full w-80 transition-all duration-500 z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${settings.theme === 'dark' || settings.theme === 'night' ? 'reader-sidebar-enhanced-dark' : 'reader-sidebar-enhanced'}`}
      >
        {/* Enhanced Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">Chapters</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Enhanced Chapters List */}
        <div className="flex-1 overflow-y-auto p-4 enhanced-scrollbar">
          {allChapters.length > 0 ? allChapters.map((ch) => {
            const active = ch.chapter_number === chapter.chapter_number;
            const accessible = ch.has_access !== false;
            return (
              <div
                key={ch.id}
                className={`sidebar-chapter-item ${
                  active ? 'active' : accessible ? '' : 'opacity-50'
                }`}
                onClick={() => accessible && handleChapterSelect(ch.slug || ch.chapter_number.toString())}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-mono font-semibold px-2 py-1 rounded bg-white/20">
                        {ch.chapter_number.toString().padStart(2, '0')}
                      </span>
                      {!ch.is_free && <Crown className="w-3 h-3 text-yellow-400" />}
                      {(ch.hero_file_url || ch.hero_file_id) && <ImageIcon className="w-3 h-3 text-purple-400" />}
                      {ch.completed && <div className="w-2 h-2 bg-green-400 rounded-full" />}
                    </div>
                    <div className="font-medium text-sm mb-1 leading-tight">{ch.title}</div>
                    {ch.word_count && ch.estimated_read_time && (
                      <div className="text-xs opacity-60 flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <BarChart3 className="w-3 h-3" />
                          <span>{ch.word_count.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{ch.estimated_read_time}m</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="p-6 text-center opacity-60">
              <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No chapters available</p>
            </div>
          )}
        </div>

        {/* Enhanced Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button 
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={() => {
              setSidebarOpen(false);
              onExit?.();
            }}
          >
            <Home className="w-4 h-4" />
            <span className="font-medium">Back to Library</span>
          </button>
        </div>
      </div>

      {/* Enhanced Top Navigation Bar with Glassmorphism */}
      {!settings.focusMode && (
        <div className="absolute top-0 left-0 right-0 h-20 z-30 reader-glass-panel">
          <div className="h-full flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="reader-fab"
                style={{ position: 'relative', background: themeColors.glass }}
                title="Table of Contents (T)"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Reading Progress */}
              <ReadingProgress progress={readingProgress} size={48} />
            </div>
            
            <div className="text-center flex-1 max-w-md">
              <h1 className="text-lg font-semibold truncate">{chapter.title}</h1>
              <div className="text-sm opacity-75">Chapter {chapter.chapter_number} • Page {currentPage} of {totalPages}</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowKeyboardHelp(true)}
                className="reader-fab"
                style={{ position: 'relative', background: themeColors.glass }}
                title="Keyboard Shortcuts (?)"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setSettings(prev => ({ ...prev, focusMode: !prev.focusMode }))}
                className="reader-fab"
                style={{ position: 'relative', background: themeColors.glass }}
                title="Focus Mode (M)"
              >
                {settings.focusMode ? <Eye className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="reader-fab"
                style={{ position: 'relative', background: themeColors.glass }}
                title="Settings (S)"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="reader-fab"
                style={{ position: 'relative', background: themeColors.glass }}
                title="Fullscreen (F)"
              >
                {isFullscreen || document.fullscreenElement ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              
              <button
                onClick={onExit}
                className="reader-fab"
                style={{ position: 'relative', background: 'rgba(239, 68, 68, 0.8)' }}
                title="Exit (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Main Reading Area with Proper Scrolling */}
      <div 
        className={`${settings.focusMode ? 'pt-8' : 'pt-24'} h-full flex items-start justify-center`}
        style={{
          paddingBottom: settings.focusMode ? '60px' : 'calc(120px + var(--reader-footer-height, 0px) + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <div className="w-full max-w-5xl px-6 h-full">
          <div
            ref={contentRef}
            className={`h-full overflow-y-auto overflow-x-hidden reader-content-enhanced enhanced-scrollbar ${
              pageTransitioning ? (settings.pageTransition === 'fade' ? 'opacity-50' : 'page-transition-exit') : 'page-transition-enter'
            }`}
            style={{
              fontFamily: getFontFamily(),
              fontSize: `${settings.fontSize}px`,
              lineHeight: Number(settings.lineHeight),
              textAlign: settings.textAlign as any,
              background: themeColors.glass,
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '48px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Enhanced Hero Image */}
            {shouldShowHeroImage && (
              <ChapterHero chapter={chapter} onLoad={() => setStatusMessage('Hero image loaded')} />
            )}
            
            {/* Enhanced Content with Typography */}
            <div 
              className="typography-reset"
              style={{
                fontFamily: `${getFontFamily()} !important`,
                fontSize: `${settings.fontSize}px !important`,
                lineHeight: `${Number(settings.lineHeight)} !important`,
                color: `${themeColors.text} !important`
              }}
            >
              {currentContent}
            </div>
            
            {/* Enhanced Page Indicator */}
            <div className="mt-12 pt-6 text-center" style={{ borderTop: `1px solid ${themeColors.accent}` }}>
              <div className="flex items-center justify-center space-x-6 text-sm opacity-70">
                <span className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Page {currentPage}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>~{currentContent.split(' ').length} words</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>~{Math.ceil(currentContent.split(' ').length / 250)} min</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Arrows */}
      {(currentPage > 1 || navigationInfo?.hasPrev) && (
        <button
          onClick={() => {
            if (currentPage > 1) {
              goToPage(currentPage - 1);
            } else if (onChapterChange && navigationInfo?.hasPrev) {
              onChapterChange('prev');
            }
          }}
          className="absolute left-6 top-1/2 -translate-y-1/2 nav-arrow-enhanced"
          title="Previous page (←)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {(currentPage < totalPages || navigationInfo?.hasNext) && (
        <button
          onClick={() => {
            if (currentPage < totalPages) {
              goToPage(currentPage + 1);
            } else if (onChapterChange && navigationInfo?.hasNext) {
              onChapterChange('next');
            }
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 nav-arrow-enhanced"
          title="Next page (→)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Enhanced Status Bar */}
      {!settings.focusMode && (
        <div 
          ref={footerRef}
          className="absolute bottom-0 left-0 right-0 z-30 status-bar-enhanced"
          style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex items-center justify-center py-4 px-6">
            <div className="flex items-center space-x-6">
              <div className="status-item heartbeat">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">{Math.round(readingProgress)}%</span>
              </div>
              
              <div className="status-item">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}</span>
              </div>
              
              <div className="status-item">
                <BarChart3 className="w-4 h-4" />
                <span>{chapter.word_count?.toLocaleString() || 0}</span>
              </div>
              
              {/* Enhanced Chapter Navigation */}
              {showNavigation && onChapterChange && (
                <div className="flex items-center space-x-3">
                  {navigationInfo?.hasPrev && (
                    <button
                      onClick={() => onChapterChange('prev')}
                      className="status-item hover:bg-blue-500/20 transition-colors"
                      disabled={!navigationInfo.prevHasAccess}
                      title={navigationInfo.prevTitle}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                  )}
                  
                  {navigationInfo?.hasNext && (
                    <button
                      onClick={() => onChapterChange('next')}
                      className="status-item hover:bg-blue-500/20 transition-colors"
                      disabled={!navigationInfo.nextHasAccess}
                      title={navigationInfo.nextTitle}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🎯 Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsHelp 
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
        theme={settings.theme}
      />

      {/* Enhanced Settings Modal with Theme-Aware Colors */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[2147483647] flex items-center justify-center p-4 settings-backdrop">
          <div 
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto enhanced-scrollbar rounded-2xl shadow-2xl border"
            style={{
              background: themeColors.settingsBg,
              backdropFilter: 'blur(30px)',
              borderColor: themeColors.settingsBorder,
              color: themeColors.settingsText
            }}
          >
            {/* Settings Header */}
            <div 
              className="p-6 border-b"
              style={{ borderColor: themeColors.settingsBorder }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Reading Settings</h3>
                    <p className="text-sm opacity-70">Customize your reading experience</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-lg hover:bg-black/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Theme Selection */}
            <div 
              className="p-6 border-b"
              style={{ borderColor: themeColors.settingsBorder }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Palette className="w-5 h-5" />
                <h4 className="font-semibold">Reading Theme</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'light', label: 'Light', icon: Sun, gradient: 'from-white to-gray-100' },
                  { value: 'sepia', label: 'Sepia', icon: Coffee, gradient: 'from-orange-50 to-amber-100' },
                  { value: 'dark', label: 'Dark', icon: Moon, gradient: 'from-gray-800 to-gray-900' },
                  { value: 'night', label: 'Night', icon: Moon, gradient: 'from-gray-900 to-black' }
                ].map(({ value, label, icon: Icon, gradient }) => (
                  <button
                    key={value}
                    onClick={() => setSettings({ ...settings, theme: value as any })}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 bg-gradient-to-br ${gradient} ${
                      settings.theme === value ? 'border-blue-500 shadow-lg shadow-blue-500/25 transform scale-105' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-medium text-sm">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Settings */}
            <div 
              className="p-6 border-b"
              style={{ borderColor: themeColors.settingsBorder }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Type className="w-5 h-5" />
                <h4 className="font-semibold">Typography</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Font Family */}
                <div>
                  <label className="block text-sm font-medium mb-2">Font Family</label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                    className="w-full p-3 rounded-xl border transition-all"
                    style={{
                      backgroundColor: settings.theme === 'dark' || settings.theme === 'night' ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      borderColor: themeColors.settingsBorder,
                      color: themeColors.settingsText
                    }}
                  >
                    <option value="Georgia, serif">Georgia (Serif)</option>
                    <option value="'Inter', 'Segoe UI', sans-serif">Inter (Sans-serif)</option>
                    <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                    <option value="'OpenDyslexic', cursive">OpenDyslexic</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Font Size: <span className="text-blue-600 font-semibold">{settings.fontSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="14"
                    max="32"
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                    className="range-slider-enhanced w-full"
                  />
                  <div className="flex justify-between text-xs opacity-60 mt-1">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>

                {/* Line Height */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Line Spacing: <span className="text-blue-600 font-semibold">{Number(settings.lineHeight).toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="1.2"
                    max="2.5"
                    step="0.1"
                    value={settings.lineHeight}
                    onChange={(e) => setSettings({ ...settings, lineHeight: parseFloat(e.target.value) })}
                    className="range-slider-enhanced w-full"
                  />
                  <div className="flex justify-between text-xs opacity-60 mt-1">
                    <span>Tight</span>
                    <span>Loose</span>
                  </div>
                </div>

                {/* Words Per Page */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Words Per Page: <span className="text-blue-600 font-semibold">{settings.wordsPerPage}</span>
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="600"
                    step="25"
                    value={settings.wordsPerPage}
                    onChange={(e) => setSettings({ ...settings, wordsPerPage: parseInt(e.target.value) })}
                    className="range-slider-enhanced w-full"
                  />
                  <div className="flex justify-between text-xs opacity-60 mt-1">
                    <span>Few</span>
                    <span>Many</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Settings */}
            <div 
              className="p-6 border-b"
              style={{ borderColor: themeColors.settingsBorder }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <AlignLeft className="w-5 h-5" />
                <h4 className="font-semibold">Layout & Behavior</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Text Alignment */}
                <div>
                  <label className="block text-sm font-medium mb-2">Text Alignment</label>
                  <select
                    value={settings.textAlign}
                    onChange={(e) => setSettings({ ...settings, textAlign: e.target.value as any })}
                    className="w-full p-3 rounded-xl border transition-all"
                    style={{
                      backgroundColor: settings.theme === 'dark' || settings.theme === 'night' ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      borderColor: themeColors.settingsBorder,
                      color: themeColors.settingsText
                    }}
                  >
                    <option value="justify">Justified</option>
                    <option value="left">Left Aligned</option>
                    <option value="center">Centered</option>
                  </select>
                </div>

                {/* Page Transition */}
                <div>
                  <label className="block text-sm font-medium mb-2">Page Transition</label>
                  <select
                    value={settings.pageTransition}
                    onChange={(e) => setSettings({ ...settings, pageTransition: e.target.value as any })}
                    className="w-full p-3 rounded-xl border transition-all"
                    style={{
                      backgroundColor: settings.theme === 'dark' || settings.theme === 'night' ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      borderColor: themeColors.settingsBorder,
                      color: themeColors.settingsText
                    }}
                  >
                    <option value="slide">Slide</option>
                    <option value="fade">Fade</option>
                    <option value="none">Instant</option>
                  </select>
                </div>
              </div>
              
              {/* Toggle Options */}
              <div className="mt-6 space-y-4">
                {[
                  { key: 'showHeroImage', label: 'Show Chapter Hero Images', description: 'Display artwork at the beginning of chapters' },
                  { key: 'focusMode', label: 'Focus Mode', description: 'Hide UI elements for distraction-free reading' },
                  { key: 'autoScroll', label: 'Auto Scroll', description: 'Automatically advance pages' },
                  { key: 'speedReading', label: 'Speed Reading Mode', description: 'Optimized for faster reading' }
                ].map(({ key, label, description }) => (
                  <label key={key} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-black/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings[key as keyof ReadingSettings] as boolean}
                      onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                      className="mt-0.5 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div>
                      <div className="font-medium">{label}</div>
                      <div className="text-sm opacity-70">{description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm opacity-70">
                  Settings are saved automatically
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('immersiveEbookSettingsEnhanced');
                    window.location.reload();
                  }}
                  className="px-4 py-2 text-sm bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced CSS Styles */}
      <style jsx>{`
        .hero-image-enhanced {
          width: 100%;
          height: auto;
          max-height: 60vh;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hero-image-enhanced.loaded {
          transform: scale(1.02);
        }
        
        .hero-image-enhanced:hover {
          transform: scale(1.05);
        }
        
        .chapter-hero-enhanced {
          width: 100%;
          margin: 0 0 40px 0;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
        }
        
        .focus-mode .reader-glass-panel,
        .focus-mode .status-bar-enhanced {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }
        
        .focus-mode:hover .reader-glass-panel,
        .focus-mode:hover .status-bar-enhanced {
          opacity: 1;
          pointer-events: auto;
        }
        
        /* Improved scrolling for content area */
        .enhanced-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(102, 126, 234, 0.3) transparent;
        }
        
        .enhanced-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .enhanced-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .enhanced-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.3);
          border-radius: 4px;
        }
        
        .enhanced-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.5);
        }
        
        kbd {
          font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.75em;
          font-weight: bold;
        }
      `}</style>
    </div>
  );

  return createPortal(overlay, ensurePortalRoot());
};