import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Settings,
  Sun,
  Moon,
  Type,
  Palette,
  Clock,
  BarChart3,
  MessageSquare,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@zoroaster/shared';
import { Chapter, ReadingProgress, ContentItemWithChildren } from '../types/content';

// Mock data
const mockChapter: Chapter = {
  id: 'ch1',
  issue_id: '5',
  title: 'The Dream of Fire',
  slug: 'the-dream-of-fire',
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{
          type: 'text',
          text: 'In the depths of night, when the world lay silent and the stars whispered ancient secrets, Darius found himself standing in a realm that existed between dreams and reality. The air shimmered with an otherworldly heat, and before him stretched a vast temple wreathed in eternal flames.'
        }]
      },
      {
        type: 'paragraph',
        content: [{
          type: 'text',
          text: 'The flames danced with a life of their own, reaching toward the heavens as if trying to touch the face of Ahura Mazda himself. Each flicker told a story, each ember carried the weight of ancient wisdom. Darius felt drawn forward, his feet moving of their own accord across the sacred ground.'
        }]
      },
      {
        type: 'paragraph',
        content: [{
          type: 'text',
          text: '"You have been chosen," a voice resonated through the temple, neither male nor female, but something far more ancient and profound. "The eternal struggle between light and darkness requires a champion, one who can bridge both worlds and understand the balance that must be maintained."'
        }]
      },
      {
        type: 'paragraph',
        content: [{
          type: 'text',
          text: 'As the words echoed through his consciousness, Darius felt a warmth spreading through his chest, not unlike the sacred fire before him. It was then that he understood—this was no mere dream, but a calling that would change the very fabric of his existence.'
        }]
      },
      {
        type: 'paragraph',
        content: [{
          type: 'text',
          text: 'The temple began to fade as dawn approached, but the memory of the flames and the divine voice would remain with him forever. When Darius awakened in his simple bed in the village of Persepolis, he knew that his life as he had known it was over. The real journey was about to begin.'
        }]
      }
    ]
  },
  plain_content: '',
  chapter_number: 1,
  word_count: 3200,
  estimated_read_time: 16,
  status: 'published',
  published_at: '2025-02-10T00:00:00Z',
  metadata: {},
  created_at: '2025-02-01T00:00:00Z',
  updated_at: '2025-09-18T00:00:00Z'
};

const mockProgress: ReadingProgress = {
  id: 'prog1',
  user_id: 'user1',
  chapter_id: 'ch1',
  progress_percentage: 45,
  last_read_at: '2025-09-18T00:00:00Z',
  completed: false,
  reading_time_minutes: 8,
  bookmarks: [],
  notes: []
};

interface ReadingSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReadingSettings;
  onSettingsChange: (settings: ReadingSettings) => void;
}

interface ReadingSettings {
  theme: 'light' | 'dark' | 'sepia';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  fontFamily: 'serif' | 'sans';
  lineHeight: 'relaxed' | 'loose';
  maxWidth: 'narrow' | 'normal' | 'wide';
}

function ReadingSettingsPanel({ isOpen, onClose, settings, onSettingsChange }: ReadingSettingsProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Reading Settings</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {([['light', Sun], ['dark', Moon], ['sepia', Palette]] as const).map(([theme, Icon]) => (
                <button
                  key={theme}
                  onClick={() => onSettingsChange({ ...settings, theme })}
                  className={`p-3 rounded-lg border transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    settings.theme === theme
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="capitalize text-sm">{theme}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => onSettingsChange({ ...settings, fontSize: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="sm">Small</option>
              <option value="base">Normal</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>
          
          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => onSettingsChange({ ...settings, fontFamily: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="serif">Serif</option>
              <option value="sans">Sans Serif</option>
            </select>
          </div>
          
          {/* Line Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Line Spacing</label>
            <select
              value={settings.lineHeight}
              onChange={(e) => onSettingsChange({ ...settings, lineHeight: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="relaxed">Comfortable</option>
              <option value="loose">Spacious</option>
            </select>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChapterReaderPage() {
  const { workSlug, chapterId } = useParams<{ workSlug: string; chapterId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [chapter, setChapter] = useState<Chapter | null>(mockChapter);
  const [progress, setProgress] = useState<ReadingProgress | null>(mockProgress);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  
  const [settings, setSettings] = useState<ReadingSettings>({
    theme: 'light',
    fontSize: 'base',
    fontFamily: 'serif',
    lineHeight: 'relaxed',
    maxWidth: 'normal'
  });
  
  // Track reading progress
  useEffect(() => {
    const interval = setInterval(() => {
      if (contentRef.current && chapter) {
        const element = contentRef.current;
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
        
        // Update progress every few seconds
        setProgress(prev => prev ? {
          ...prev,
          progress_percentage: Math.max(scrollProgress, prev.progress_percentage),
          last_read_at: new Date().toISOString()
        } : null);
      }
      
      setReadingTime(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [chapter]);
  
  // Auto-save progress
  useEffect(() => {
    if (progress && user) {
      // Debounced API call to save progress
      const saveProgress = setTimeout(() => {
        console.log('Saving reading progress:', progress);
      }, 2000);
      
      return () => clearTimeout(saveProgress);
    }
  }, [progress, user]);
  
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
      xl: 'text-xl'
    };
    
    const fontFamilies = {
      serif: 'font-serif',
      sans: 'font-sans'
    };
    
    const lineHeights = {
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
  
  const renderChapterContent = (content: any) => {
    if (!content || !content.content) return null;
    
    return content.content.map((node: any, index: number) => {
      if (node.type === 'paragraph') {
        return (
          <p key={index} className="mb-4">
            {node.content?.map((textNode: any, textIndex: number) => {
              if (textNode.type === 'text') {
                return <span key={textIndex}>{textNode.text}</span>;
              }
              return null;
            })}
          </p>
        );
      }
      return null;
    });
  };
  
  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chapter Not Found</h2>
          <Link 
            to="/library"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Back to Library
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()}`}>
      {/* Reading Header */}
      <header className="sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm border-b border-opacity-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to={`/library/issue/${workSlug}`}
                className="p-2 rounded-lg hover:bg-gray-100 hover:bg-opacity-20 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div>
                <h1 className="font-semibold truncate max-w-xs">{chapter.title}</h1>
                <p className="text-sm opacity-75">Chapter {chapter.chapter_number}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Progress Indicator */}
              {progress && (
                <div className="flex items-center space-x-2 text-sm">
                  <BarChart3 className="w-4 h-4" />
                  <span>{Math.round(progress.progress_percentage)}%</span>
                </div>
              )}
              
              {/* Settings */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-gray-100 hover:bg-opacity-20 transition-colors duration-200"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chapter Content */}
      <main className="py-8">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${getFontClasses()}`}>
          <article ref={contentRef}>
            {/* Chapter Header */}
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {chapter.title}
              </h1>
              <div className="flex items-center justify-center space-x-6 text-sm opacity-75">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{chapter.estimated_read_time} min read</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(chapter.published_at || '').toLocaleDateString()}</span>
                </div>
              </div>
            </header>
            
            {/* Chapter Content */}
            <div className="prose prose-lg max-w-none mb-12">
              {renderChapterContent(chapter.content)}
            </div>
          </article>
          
          {/* Chapter Navigation */}
          <nav className="flex items-center justify-between border-t border-opacity-20 pt-8">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 hover:bg-opacity-20 transition-colors duration-200">
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Chapter</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 hover:bg-opacity-20 transition-colors duration-200">
                <Bookmark className="w-5 h-5" />
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 hover:bg-opacity-20 transition-colors duration-200">
                <MessageSquare className="w-5 h-5" />
              </button>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 hover:bg-opacity-20 transition-colors duration-200">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 hover:bg-opacity-20 transition-colors duration-200">
              <span>Next Chapter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
          
          {/* Reading Stats */}
          <div className="mt-8 p-4 rounded-lg bg-gray-100 bg-opacity-20">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span>Reading time: {Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}</span>
                <span>Progress: {progress?.progress_percentage.toFixed(0)}%</span>
              </div>
              
              {progress && progress.progress_percentage >= 100 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span>Chapter Complete!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <ReadingSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}