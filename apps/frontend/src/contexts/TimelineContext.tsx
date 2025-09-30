import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Age, TimelineEvent } from '../lib/api-timeline';

interface TimelineContextType {
  // View state
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  
  // Selected entities
  selectedAge: Age | null;
  setSelectedAge: (age: Age | null) => void;
  selectedEvent: TimelineEvent | null;
  setSelectedEvent: (event: TimelineEvent | null) => void;
  
  // Navigation state
  breadcrumbs: string[];
  setBreadcrumbs: (crumbs: string[]) => void;
  
  // Theme state
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
  
  // Search and filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  
  // Navigation helpers
  navigateToAge: (age: Age) => void;
  navigateToEvent: (event: TimelineEvent, age?: Age) => void;
  goBack: () => void;
  
  // Utility methods
  clearSelection: () => void;
  toggleExpanded: () => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

interface TimelineProviderProps {
  children: ReactNode;
}

export const TimelineProvider: React.FC<TimelineProviderProps> = ({ children }) => {
  // View state
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Selected entities
  const [selectedAge, setSelectedAge] = useState<Age | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  
  // Navigation state
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Timeline']);
  
  // Theme state
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Navigation helpers
  const navigateToAge = (age: Age) => {
    setSelectedAge(age);
    setSelectedEvent(null);
    setIsExpanded(true);
    setBreadcrumbs(['Timeline', age.title]);
  };
  
  const navigateToEvent = (event: TimelineEvent, age?: Age) => {
    setSelectedEvent(event);
    if (age) {
      setSelectedAge(age);
      setBreadcrumbs(['Timeline', age.title, event.title]);
    } else if (selectedAge) {
      setBreadcrumbs(['Timeline', selectedAge.title, event.title]);
    } else {
      setBreadcrumbs(['Timeline', event.title]);
    }
    setIsExpanded(true);
  };
  
  const goBack = () => {
    if (selectedEvent) {
      setSelectedEvent(null);
      setBreadcrumbs(prev => prev.slice(0, -1));
    } else if (selectedAge) {
      setSelectedAge(null);
      setIsExpanded(false);
      setBreadcrumbs(['Timeline']);
    }
  };
  
  // Utility methods
  const clearSelection = () => {
    setSelectedAge(null);
    setSelectedEvent(null);
    setIsExpanded(false);
    setBreadcrumbs(['Timeline']);
  };
  
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  const value: TimelineContextType = {
    // View state
    isExpanded,
    setIsExpanded,
    
    // Selected entities
    selectedAge,
    setSelectedAge,
    selectedEvent,
    setSelectedEvent,
    
    // Navigation state
    breadcrumbs,
    setBreadcrumbs,
    
    // Theme state
    themeMode,
    setThemeMode,
    
    // Search and filter state
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    
    // Navigation helpers
    navigateToAge,
    navigateToEvent,
    goBack,
    
    // Utility methods
    clearSelection,
    toggleExpanded
  };

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimelineContext = (): TimelineContextType => {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimelineContext must be used within a TimelineProvider');
  }
  return context;
};

// Keyboard shortcuts hook
export const useTimelineKeyboardShortcuts = () => {
  const { goBack, clearSelection, toggleExpanded } = useTimelineContext();
  
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Escape key - go back or clear selection
      if (event.key === 'Escape') {
        event.preventDefault();
        goBack();
      }
      
      // Ctrl/Cmd + Home - clear all selections
      if ((event.ctrlKey || event.metaKey) && event.key === 'Home') {
        event.preventDefault();
        clearSelection();
      }
      
      // Space - toggle expanded view
      if (event.key === ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const activeElement = document.activeElement;
        // Only if not typing in an input
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          event.preventDefault();
          toggleExpanded();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goBack, clearSelection, toggleExpanded]);
};