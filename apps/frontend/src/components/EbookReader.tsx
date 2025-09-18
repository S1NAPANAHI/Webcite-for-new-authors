import React, { useState, useEffect, useRef } from 'react';
import { ContentService } from '@zoroaster/shared/services/content';
import { useAuth } from '@zoroaster/shared/hooks/useAuth';
import { Database } from '@zoroaster/shared/database.types';

type Chapter = Database['public']['Tables']['chapters']['Row'];

interface EbookReaderProps {
  chapter: Chapter;
}

export const EbookReader: React.FC<EbookReaderProps> = ({ chapter }) => {
  const { user } = useAuth();
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!contentRef.current || !user) return;

    const target = contentRef.current;
    const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;

    // Debounce this in a real app
    ContentService.updateReadingProgress(
      user.id,
      chapter.id,
      scrollPercentage,
      target.scrollTop
    );
  };

  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
    sepia: 'bg-amber-50 text-amber-900',
  };

  if (!chapter) return <div>Chapter not found or access denied</div>;

  return (
    <div className={`min-h-screen ${themeClasses[theme]}`}>
      <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold">{chapter.title}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="p-2 rounded hover:bg-gray-100"
            >
              A-
            </button>
            <span className="text-sm text-gray-800">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="p-2 rounded hover:bg-gray-100"
            >
              A+
            </button>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="p-2 rounded border bg-white text-gray-800"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="sepia">Sepia</option>
          </select>
        </div>
      </div>

      <div
        ref={contentRef}
        className="max-w-4xl mx-auto p-8 leading-relaxed prose"
        style={{ fontSize: `${fontSize}px` }}
        onScroll={handleScroll}
      >
        {chapter.content_format === 'markdown' && (
          <div dangerouslySetInnerHTML={{ __html: chapter.content_text || '' }} />
        )}
        {chapter.content_format === 'rich' && (
          <div>
            {/* You would render your rich text JSON here */}
            <p>{JSON.stringify(chapter.content_json)}</p>
          </div>
        )}
         {chapter.content_format === 'file' && (
          <div>
            <p>Content is in a file: <a href={chapter.content_url || '#'} target="_blank" rel="noopener noreferrer">Download</a></p>
          </div>
        )}
      </div>
    </div>
  );
};
