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
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@zoroaster/shared';
import { supabase } from '../lib/supabase';
import { useFileUrl } from '../utils/fileUrls';
import './ebook-reader.css';

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
  hero_file_id?: string | null; // Add support for file ID
  banner_file_id?: string | null; // Add support for file ID
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

interface ImmersiveEbookReaderProps {
  chapter: Chapter;
  onChapterChange?: (direction: 'prev' | 'next') => void;
  showNavigation?: boolean;
  navigationInfo?: NavigationInfo;
  onExit?: () => void;
}

interface ReadingSettings {
  fontSize: number;       // px
  fontFamily: string;
  theme: 'light' | 'dark' | 'sepia' | 'night';
  lineHeight: number;     // unitless
  textAlign: 'justify' | 'left' | 'center';
  wordsPerPage: number;   // used for pagination
  showHeroImage: boolean; // NEW: Toggle hero image display
}

const READER_PORTAL_ID = 'zoro-reader-portal-root';

function ensurePortalRoot(): HTMLElement {
  let root = document.getElementById(READER_PORTAL_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = READER_PORTAL_ID;
    // Add CSS to ensure portal is above everything
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

// Word-based pagination function
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

// FIXED: Hero Image Component
function ChapterHero({ chapter }: { chapter: Chapter }) {
  const heroUrlFromFile = useFileUrl(chapter?.hero_file_id);
  const heroUrl = heroUrlFromFile || chapter?.hero_file_url || null;

  // Nothing to show
  if (!heroUrl) return null;

  return (
    <div
      className="chapter-hero"
      style={{
        width: '100%',
        margin: '0 0 32px',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
        background: '#f3f4f6',
      }}
    >
      <img
        src={heroUrl}
        alt={chapter?.hero_file_alt_text || chapter?.title || 'Chapter hero image'}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          maxHeight: '55vh',
          objectFit: 'cover',
        }}
        loading="lazy"
        onLoad={() => {
          console.log('✅ Hero image loaded successfully:', heroUrl);
        }}
        onError={(e) => {
          console.error('❌ Hero image failed to load:', heroUrl);
          // Hide the broken image element instead of showing broken icon
          (e.target as HTMLImageElement).style.display = 'none';
          // Hide the entire hero container if image fails
          const heroContainer = (e.target as HTMLImageElement).closest('.chapter-hero') as HTMLElement;
          if (heroContainer) {
            heroContainer.style.display = 'none';
          }
        }}
      />
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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [allChapters, setAllChapters] = useState<ChapterLite[]>([]);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  
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
          lineHeight: Number(parsed.lineHeight) || 1.6,
          showHeroImage: parsed.showHeroImage !== false // Default to true
        };
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
    return {
      theme: 'sepia',
      fontSize: 18,
      fontFamily: 'Georgia, serif',
      lineHeight: 1.6,
      textAlign: 'justify',
      wordsPerPage: 350,
      showHeroImage: true
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

  // Body scroll lock and footer height tracking for mobile
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('reader-active');
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove('reader-active');
    };
  }, []);

  // Footer height for mobile safe area
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

  // Paginate content by word count
  useEffect(() => {
    if (!chapter?.plain_content) return;

    const newPages = paginateByWordCount(chapter.plain_content, settings.wordsPerPage);
    setPages(newPages);
    setTotalPages(newPages.length);
    
    if (currentPage > newPages.length && newPages.length > 0) {
      setCurrentPage(1);
    }
  }, [chapter, settings.wordsPerPage, settings.fontSize, settings.lineHeight, currentPage]);

  // Handle page navigation
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const progress = Math.round((page / totalPages) * 100);
    setReadingProgress(progress);
  }, [totalPages]);

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
        setFullscreen(true);
      } else {
        await document.exitFullscreen?.();
        setFullscreen(false);
      }
    } catch {
      // fallback: simulated fullscreen via CSS
      setFullscreen((f) => !f);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showSettings || isSidebarOpen) return;
      
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
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, showSettings, isSidebarOpen, onChapterChange, navigationInfo, goToPage, onExit, isFullscreen]);

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
  const getFontFamily = () => {
    return settings.fontFamily;
  };

  // Theme colors
  const getThemeColors = () => {
    switch (settings.theme) {
      case 'light':
        return { bg: '#ffffff', text: '#1f2937', accent: 'rgba(31, 41, 55, 0.1)' };
      case 'dark':
        return { bg: '#1f2937', text: '#f9fafb', accent: 'rgba(249, 250, 251, 0.1)' };
      case 'sepia':
        return { bg: '#fef7ed', text: '#92400e', accent: 'rgba(146, 64, 14, 0.1)' };
      case 'night':
        return { bg: '#0f1419', text: '#e5e7eb', accent: 'rgba(229, 231, 235, 0.1)' };
      default:
        return { bg: '#fef7ed', text: '#92400e', accent: 'rgba(146, 64, 14, 0.1)' };
    }
  };

  const themeColors = getThemeColors();
  
  // Check if this is the first page and we have a hero image
  const shouldShowHeroImage = settings.showHeroImage && currentPage === 1;

  const overlay = (
    <div 
      className={`fixed inset-0 overflow-hidden ${isFullscreen ? 'z-[2147483647]' : 'z-[2147483647]'}`}
      style={{
        backgroundColor: themeColors.bg,
        color: themeColors.text,
        pointerEvents: 'auto'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Content Protection Overlay */}
      {protectionEnabled && (
        <div className="absolute inset-0 pointer-events-none select-none z-5" style={{ opacity: 0.02 }}>
          <div className="absolute top-6 right-20" style={{ color: themeColors.text }}>
            <Shield className="w-8 h-8" />
          </div>
        </div>
      )}

      {/* Sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar TOC */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 transition-transform duration-300 z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: themeColors.bg,
          borderRight: `1px solid ${themeColors.accent}`,
          boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
        }}
      >
        {/* Sidebar Header */}
        <div 
          className="flex items-center justify-between p-4"
          style={{ borderBottom: `1px solid ${themeColors.accent}` }}
        >
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold">Table of Contents</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: themeColors.accent }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto p-2">
          {allChapters.length > 0 ? allChapters.map((ch) => {
            const active = ch.chapter_number === chapter.chapter_number;
            const accessible = ch.has_access !== false;
            return (
              <button
                key={ch.id}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  active ? 'font-semibold' : ''
                } ${!accessible ? 'opacity-50' : ''}`}
                style={{
                  backgroundColor: active ? themeColors.accent : 'transparent',
                  borderLeft: active ? `4px solid ${themeColors.text}` : 'none'
                }}
                onClick={() => accessible && handleChapterSelect(ch.slug || ch.chapter_number.toString())}
                disabled={!accessible}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-mono opacity-70">
                        {ch.chapter_number.toString().padStart(2, '0')}
                      </span>
                      {!ch.is_free && <Crown className="w-3 h-3 text-yellow-500" />}
                      {!accessible && <span className="text-xs">🔒</span>}
                      {(ch.hero_file_url || ch.hero_file_id) && <ImageIcon className="w-3 h-3 text-purple-500" title="Has hero image" />}
                    </div>
                    <div className="font-medium text-sm mb-1">{ch.title}</div>
                    {ch.word_count && ch.estimated_read_time && (
                      <div className="text-xs opacity-60">
                        {ch.word_count.toLocaleString()} words • {ch.estimated_read_time} min
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          }) : (
            <div className="p-4 text-center opacity-60">
              <p>No chapters available</p>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4" style={{ borderTop: `1px solid ${themeColors.accent}` }}>
          <button 
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors"
            style={{ backgroundColor: themeColors.accent }}
            onClick={() => {
              setSidebarOpen(false);
              onExit?.();
            }}
          >
            <Home className="w-4 h-4" />
            <span>Back to Library</span>
          </button>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-16 z-30 flex items-center justify-between px-6"
        style={{ 
          backgroundColor: `${themeColors.bg}f0`,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${themeColors.accent}`
        }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: themeColors.accent }}
            title="Table of Contents (T)"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center">
          <h1 className="text-lg font-semibold">{chapter.title}</h1>
          <div className="text-sm opacity-75">Chapter {chapter.chapter_number}</div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm opacity-75 mr-2">
            {currentPage} / {totalPages}
          </div>
          
          <button
            onClick={() => setProtectionEnabled(!protectionEnabled)}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: themeColors.accent }}
            title={protectionEnabled ? 'Protection On' : 'Protection Off'}
          >
            {protectionEnabled ? <Shield className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: themeColors.accent }}
            title="Reading Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: themeColors.accent }}
            title={isFullscreen || document.fullscreenElement ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
          >
            {isFullscreen || document.fullscreenElement ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onExit}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: themeColors.accent }}
            title="Exit Reader (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reading Area with mobile-safe padding */}
      <div 
        className="pt-20 h-full flex items-start justify-center overflow-hidden"
        style={{
          paddingBottom: 'calc(100px + var(--reader-footer-height, 0px) + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <div className="w-full max-w-4xl px-8">
          {/* Page Content with Scrolling AND FIXED Hero Image Support */}
          <div
            ref={contentRef}
            className="h-full overflow-y-auto overflow-x-hidden relative select-none p-8 rounded-2xl ebook-content-scroll reader-content"
            style={{
              fontFamily: getFontFamily(),
              fontSize: `${settings.fontSize}px`,
              lineHeight: Number(settings.lineHeight),
              textAlign: settings.textAlign as any,
              backgroundColor: themeColors.accent,
              border: `1px solid ${themeColors.accent}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              // Override any global styles
              fontSizeAdjust: 'none',
              minHeight: 0
            }}
          >
            {/* FIXED HERO IMAGE - Show only on first page if enabled */}
            {shouldShowHeroImage && (
              <ChapterHero chapter={chapter} />
            )}
            
            {/* Typography reset wrapper */}
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
            
            {/* Page indicator */}
            <div className="mt-8 pt-4 text-center text-sm opacity-50" style={{ borderTop: `1px solid ${themeColors.accent}` }}>
              Page {currentPage} • ~{currentContent.split(' ').length} words
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {(currentPage > 1 || navigationInfo?.hasPrev) && (
        <button
          onClick={() => {
            if (currentPage > 1) {
              goToPage(currentPage - 1);
            } else if (onChapterChange && navigationInfo?.hasPrev) {
              onChapterChange('prev');
            }
          }}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-200 z-30 shadow-lg hover:shadow-xl touch-target"
          style={{
            backgroundColor: `${themeColors.bg}e0`,
            color: themeColors.text,
            border: `1px solid ${themeColors.accent}`
          }}
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
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-200 z-30 shadow-lg hover:shadow-xl touch-target"
          style={{
            backgroundColor: `${themeColors.bg}e0`,
            color: themeColors.text,
            border: `1px solid ${themeColors.accent}`
          }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Click Zones for Page Navigation */}
      <div className="absolute inset-0 grid grid-cols-3 z-20 pointer-events-none" style={{ top: '64px', bottom: '100px' }}>
        <div 
          className="cursor-pointer pointer-events-auto"
          onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
        />
        <div 
          className="cursor-pointer pointer-events-auto"
          onClick={() => setShowSettings(true)}
        />
        <div 
          className="cursor-pointer pointer-events-auto"
          onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
        />
      </div>

      {/* Bottom Status Bar */}
      <div 
        ref={footerRef}
        className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-center py-6"
        style={{ 
          backgroundColor: `${themeColors.bg}f0`,
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${themeColors.accent}`,
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <div className="flex items-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>{Math.round(readingProgress)}% complete</span>
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
                  className="px-3 py-1 rounded transition-colors"
                  style={{ backgroundColor: navigationInfo.prevHasAccess ? themeColors.accent : 'transparent' }}
                  disabled={!navigationInfo.prevHasAccess}
                >
                  ← Previous
                </button>
              )}
              
              {navigationInfo?.hasNext && (
                <button
                  onClick={() => onChapterChange('next')}
                  className="px-3 py-1 rounded transition-colors"
                  style={{ backgroundColor: navigationInfo.nextHasAccess ? themeColors.accent : 'transparent' }}
                  disabled={!navigationInfo.nextHasAccess}
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal - High z-index to prevent header overlap */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[2147483647] flex items-center justify-center p-4">
          <div 
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-6"
            style={{ backgroundColor: themeColors.bg, border: `1px solid ${themeColors.accent}` }}
          >
            {/* Settings Header */}
            <div className="flex items-center justify-between mb-6" style={{ borderBottom: `1px solid ${themeColors.accent}`, paddingBottom: '1rem' }}>
              <h3 className="text-xl font-bold">Reading Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ backgroundColor: themeColors.accent }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-semibold mb-4">Reading Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'light', label: 'Light', bg: '#ffffff', text: '#1f2937' },
                    { value: 'sepia', label: 'Sepia', bg: '#fef7ed', text: '#92400e' },
                    { value: 'dark', label: 'Dark', bg: '#1f2937', text: '#f9fafb' },
                    { value: 'night', label: 'Night', bg: '#0f1419', text: '#e5e7eb' }
                  ].map(({ value, label, bg, text }) => (
                    <button
                      key={value}
                      onClick={() => setSettings({ ...settings, theme: value as any })}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                        settings.theme === value ? 'border-blue-500 shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: bg, color: text, border: settings.theme === value ? '2px solid #3b82f6' : `2px solid ${themeColors.accent}` }}
                    >
                      <span className="font-medium text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-semibold mb-3">Font Family</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                  className="w-full p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: themeColors.accent, 
                    color: themeColors.text,
                    border: `1px solid ${themeColors.accent}`
                  }}
                >
                  <option value="Georgia, serif">Georgia (Serif)</option>
                  <option value="'Segoe UI', Arial, sans-serif">Segoe UI (Sans-serif)</option>
                  <option value="'Courier New', monospace">Courier New (Monospace)</option>
                  <option value="'Comic Sans MS', cursive">Comic Sans (Dyslexic-friendly)</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="14"
                  max="32"
                  value={settings.fontSize}
                  onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ backgroundColor: themeColors.accent }}
                />
                <div className="flex justify-between text-xs opacity-60 mt-1">
                  <span>14px</span>
                  <span>32px</span>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Line Spacing: {Number(settings.lineHeight).toFixed(1)}
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="2.5"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => setSettings({ ...settings, lineHeight: parseFloat(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ backgroundColor: themeColors.accent }}
                />
                <div className="flex justify-between text-xs opacity-60 mt-1">
                  <span>Tight</span>
                  <span>Loose</span>
                </div>
              </div>

              {/* Words Per Page */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Words Per Page: {settings.wordsPerPage}
                </label>
                <input
                  type="range"
                  min="200"
                  max="600"
                  step="25"
                  value={settings.wordsPerPage}
                  onChange={(e) => setSettings({ ...settings, wordsPerPage: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ backgroundColor: themeColors.accent }}
                />
                <div className="flex justify-between text-xs opacity-60 mt-1">
                  <span>200</span>
                  <span>400</span>
                  <span>600</span>
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-sm font-semibold mb-3">Text Alignment</label>
                <select
                  value={settings.textAlign}
                  onChange={(e) => setSettings({ ...settings, textAlign: e.target.value as any })}
                  className="w-full p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: themeColors.accent, 
                    color: themeColors.text,
                    border: `1px solid ${themeColors.accent}`
                  }}
                >
                  <option value="justify">Justified</option>
                  <option value="left">Left Aligned</option>
                  <option value="center">Centered</option>
                </select>
              </div>
              
              {/* FIXED: Hero Image Toggle */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showHeroImage}
                    onChange={(e) => setSettings({ ...settings, showHeroImage: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-semibold">Show Chapter Hero Image</div>
                    <div className="text-xs opacity-60">Display artwork at the beginning of the chapter</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div 
          className="text-xs rounded-lg px-4 py-2 opacity-0 hover:opacity-100 transition-opacity backdrop-blur"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }}
        >
          <div className="flex items-center space-x-4">
            <span>T = Sidebar</span>
            <span>•</span>
            <span>F = Fullscreen</span>
            <span>•</span>
            <span>← → = Pages</span>
            <span>•</span>
            <span>ESC = Exit</span>
          </div>
        </div>
      </div>

      {/* Add typography reset styles */}
      <style jsx>{`
        .typography-reset,
        .typography-reset *,
        .typography-reset p,
        .typography-reset h1,
        .typography-reset h2,
        .typography-reset h3,
        .typography-reset h4,
        .typography-reset h5,
        .typography-reset h6,
        .typography-reset span,
        .typography-reset div {
          font-family: ${getFontFamily()} !important;
          font-size: ${settings.fontSize}px !important;
          line-height: ${Number(settings.lineHeight)} !important;
          color: ${themeColors.text} !important;
        }
        
        .hero-image {
          display: block;
          width: 100%;
          height: auto;
          max-height: 55vh;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
        }
        
        .hero-image:hover {
          transform: scale(1.02);
        }
        
        .chapter-hero {
          width: 100%;
          margin: 0 0 32px 0;
          border-radius: 16px;
          overflow: hidden;
          background: #f3f4f6;
          border: 1px solid rgba(0,0,0,0.06);
        }
        
        .touch-target {
          min-width: 44px;
          min-height: 44px;
        }
        
        .ebook-content-scroll {
          overflow-y: auto !important;
          scrollbar-width: thin;
          scrollbar-color: rgba(128, 128, 128, 0.3) rgba(128, 128, 128, 0.1);
        }
        
        .ebook-content-scroll::-webkit-scrollbar {
          width: 8px;
        }
        
        .ebook-content-scroll::-webkit-scrollbar-track {
          background: rgba(128, 128, 128, 0.1);
          border-radius: 4px;
        }
        
        .ebook-content-scroll::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.3);
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        
        .ebook-content-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.5);
        }
      `}</style>
    </div>
  );

  // Portal so header can't overlap; extreme z-index in CSS guarantees it's on top
  return createPortal(overlay, ensurePortalRoot());
};