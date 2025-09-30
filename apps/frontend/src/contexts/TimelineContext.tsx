import React, { createContext, useContext, useState, useEffect } from 'react';
import { Age, TimelineEvent } from '../lib/api-timeline';

interface TimelineContextType {
  selectedAge: Age | null;
  selectedEvent: TimelineEvent | null;
  isExpanded: boolean;
  themeMode: 'light' | 'dark';
  setSelectedAge: (age: Age | null) => void;
  setSelectedEvent: (event: TimelineEvent | null) => void;
  toggleExpansion: () => void;
  toggleTheme: () => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedAge, setSelectedAge] = useState<Age | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('timeline-theme') as 'light' | 'dark' || 'dark';
    setThemeMode(savedTheme);
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('timeline-theme', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const handleSetSelectedAge = (age: Age | null) => {
    setSelectedAge(age);
    if (age) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  return (
    <TimelineContext.Provider value={{
      selectedAge,
      selectedEvent,
      isExpanded,
      themeMode,
      setSelectedAge: handleSetSelectedAge,
      setSelectedEvent,
      toggleExpansion,
      toggleTheme
    }}>
      <div data-theme={themeMode}>
        {children}
      </div>
    </TimelineContext.Provider>
  );
};

export const useTimelineContext = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimelineContext must be used within TimelineProvider');
  }
  return context;
};
