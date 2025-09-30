import React from 'react';
import { useTimelineContext } from '../../../contexts/TimelineContext';

export const ModeToggle: React.FC = () => {
  const { themeMode, toggleTheme } = useTimelineContext();
  
  return (
    <button
      onClick={toggleTheme}
      className="bg-timeline-card border border-timeline-border rounded-lg p-2 shadow-lg hover:bg-timeline-border transition-colors"
      title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {themeMode === 'light' ? (
        // Moon icon for dark mode
        <svg className="w-5 h-5 text-timeline-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg className="w-5 h-5 text-timeline-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
};
