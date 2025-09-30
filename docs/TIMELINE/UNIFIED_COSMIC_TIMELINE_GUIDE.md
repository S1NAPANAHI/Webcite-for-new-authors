# 🌌 The Unified Cosmic Timeline Implementation Guide

This document provides a complete, step-by-step guide for implementing the Cosmic Timeline feature on your website. It consolidates all previous plans, code files, and assets into a single, authoritative source.

## 📜 Part 1: Project Vision & Architecture

### Project Overview

The goal is to transform the existing linear, text-based timeline into a visually stunning, interactive, and immersive "Cosmic Timeline." This new interface will serve as a narrative atlas for your Zoroasterverse, guiding users through the 9 Ages and 5 Books of your lore.

### Key Features

*   **Dual Interface:** A "Cosmic Dial" of concentric rings for a high-level overview of the Ages, which transitions into a linear, horizontal "Codex View" for detailed event exploration.
*   **Symbolic Glyph System:** Unique, custom-designed SVG icons for each of the 9 Ages and 5 Books to create a rich, symbolic language.
*   **Dual Theme System:** A light "Parchment Codex" mode and a dark "Astral Observatory" mode, allowing users to choose their preferred aesthetic.
*   **Interactive & Animated:** The timeline will feature smooth animations, hover effects, and clickable elements to encourage exploration.
*   **Integrated Navigation:** Seamlessly connects the lore of the timeline to your website's library and shop, allowing users to discover and purchase books related to specific events.
*   **Responsive Design:** The timeline will be fully responsive and accessible on desktop, tablet, and mobile devices.

### System Architecture

*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS with CSS Modules and a custom theme system using CSS variables.
*   **Backend & Database:** Supabase for data storage and API.
*   **State Management:** React Context for managing the timeline's state.

---

## ⚙️ Part 2: Step-by-Step Implementation

Follow these phases to build and integrate the Cosmic Timeline into your project.

### Phase 1: Project Setup

#### 1. Create the Directory Structure

First, navigate to your frontend application's source directory (`apps/frontend/src` based on your project structure) and run the following commands to create the necessary folders:

```bash
mkdir -p assets/glyphs
mkdir -p components/timeline/CosmicRings
mkdir -p components/timeline/LinearTimeline
mkdir -p components/timeline/Navigation
mkdir -p components/timeline/hooks
mkdir -p contexts
mkdir -p styles
```

#### 2. Back Up Your Existing Timeline

To ensure you can revert if needed, back up your current timeline components:

```bash
# Navigate to your pages directory
cd apps/frontend/src/pages

# Rename the existing timeline files
mv Timelines.tsx Timelines.classic.tsx
mv Timelines.module.css Timelines.classic.module.css
```

### Phase 2: Database Seeding

Log in to your Supabase dashboard, navigate to the SQL Editor, and run the following script to create and populate the `ages`, `books`, and `book_age_spans` tables.

```sql
-- 🌌 COSMIC TIMELINE DATABASE SEEDING

-- Insert the 9 Ages
INSERT INTO ages (age_number, name, title, glyph, color_code, description, start_year, end_year) VALUES
(1, 'First Age', 'Dawn of Creation', 'sun_disc', '#FFD700', 'The cosmic awakening and the first light piercing the primordial darkness.', -10000, -8000),
(2, 'Second Age', 'Wings of Time', 'wings', '#3B1C6E', 'The age of celestial movements and the establishment of cosmic order.', -8000, -6000),
(3, 'Third Age', 'Rise of Humanity', 'human_figure', '#8B4513', 'The emergence of conscious beings and the first civilizations.', -6000, -4000),
(4, 'Fourth Age', 'Sacred Flames', 'fire_altar', '#DC143C', 'The age of spiritual awakening and the discovery of divine fire.', -4000, -2000),
(5, 'Fifth Age', 'Serpents Wisdom', 'serpent', '#228B22', 'The time of great knowledge and the temptation of forbidden wisdom.', -2000, 0),
(6, 'Sixth Age', 'Horizons Promise', 'horizon_sun', '#FF8C00', 'The age of exploration and the expansion beyond known boundaries.', 0, 2000),
(7, 'Seventh Age', 'Twin Flames', 'twin_flame', '#4169E1', 'The era of duality and the great cosmic balance.', 2000, 4000),
(8, 'Eighth Age', 'Star Paths', 'constellation', '#9932CC', 'The time of celestial navigation and cosmic consciousness.', 4000, 6000),
(9, 'Ninth Age', 'Final Gateway', 'archway', '#B22222', 'The culminating age and the approach to ultimate transformation.', 6000, 8000);

-- Insert the 5 Books
INSERT INTO books (book_number, title, glyph, color_code, description) VALUES
(1, 'Foundation Chronicles', 'sword', '#708090', 'The origins and early struggles of the cosmic order.'),
(2, 'Archive of Ages', 'archive', '#2F4F4F', 'The collected wisdom and records of all ages.'),
(3, 'Spiral of Time', 'spiral', '#800080', 'The cyclical nature of cosmic events and their interconnections.'),
(4, 'Dragons Testament', 'dragon', '#B8860B', 'The prophecies and the great cosmic dragons role.'),
(5, 'Final Scroll', 'scroll', '#A0522D', 'The ultimate revelations and the end of the cosmic cycle.');

-- Create book-age relationships (books span multiple ages)
INSERT INTO book_age_spans (book_id, age_id) VALUES
-- Foundation Chronicles (Book 1) spans First 3 ages
(1, 1), (1, 2), (1, 3),
-- Archive of Ages (Book 2) spans all ages
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9),
-- Spiral of Time (Book 3) spans middle ages
(3, 4), (3, 5), (3, 6),
-- Dragons Testament (Book 4) spans later ages
(4, 6), (4, 7), (4, 8),
-- Final Scroll (Book 5) spans final ages
(5, 8), (5, 9);
```

### Phase 3: Component Implementation

Create the following files in your repository at the specified paths. This section contains the complete code for all 18 components.

#### 1. Styling & Themes

**File:** `src/styles/timeline-themes.css`

```css
/* Cosmic Timeline Theme System */
:root {
  /* Light Mode - Parchment Codex */
  --timeline-bg-light: #f5f1eb;
  --timeline-text-light: #2d2013;
  --timeline-gold-light: #d4af37;
  --timeline-navy-light: #1e293b;
  --timeline-card-light: #ffffff;
  --timeline-shadow-light: rgba(0, 0, 0, 0.1);
  --timeline-border-light: #e5e7eb;
  --timeline-accent-light: #3b82f6;

  /* Dark Mode - Astral Observatory */
  --timeline-bg-dark: #0f0f23;
  --timeline-text-dark: #d4af37;
  --timeline-gold-dark: #ffd700;
  --timeline-navy-dark: #1e1b4b;
  --timeline-card-dark: #1a1a2e;
  --timeline-shadow-dark: rgba(212, 175, 55, 0.2);
  --timeline-border-dark: #374151;
  --timeline-accent-dark: #8b5cf6;

  /* Cosmic Ring Animations */
  --ring-rotation-duration: 120s;
  --age-pulse-duration: 2s;
  --hover-scale: 1.1;
  --transition-cosmic: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="light"] {
  --timeline-bg: var(--timeline-bg-light);
  --timeline-text: var(--timeline-text-light);
  --timeline-gold: var(--timeline-gold-light);
  --timeline-navy: var(--timeline-navy-light);
  --timeline-card: var(--timeline-card-light);
  --timeline-shadow: var(--timeline-shadow-light);
  --timeline-border: var(--timeline-border-light);
  --timeline-accent: var(--timeline-accent-light);
}

[data-theme="dark"] {
  --timeline-bg: var(--timeline-bg-dark);
  --timeline-text: var(--timeline-text-dark);
  --timeline-gold: var(--timeline-gold-dark);
  --timeline-navy: var(--timeline-navy-dark);
  --timeline-card: var(--timeline-card-dark);
  --timeline-shadow: var(--timeline-shadow-dark);
  --timeline-border: var(--timeline-border-dark);
  --timeline-accent: var(--timeline-accent-dark);
}

/* Cosmic Ring Animations */
@keyframes cosmicRotation {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes agePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.cosmic-ring {
  animation: cosmicRotation var(--ring-rotation-duration) linear infinite;
}

.age-node {
  transition: var(--transition-cosmic);
  animation: agePulse var(--age-pulse-duration) ease-in-out infinite;
}

.age-node:hover {
  transform: scale(var(--hover-scale));
  animation-play-state: paused;
}

.star-field {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.star {
  position: absolute;
  background: var(--timeline-gold);
  border-radius: 50%;
  animation: starTwinkle 3s ease-in-out infinite;
}

/* Timeline Panel Animations */
.timeline-panel-enter {
  transform: translateX(100%);
  opacity: 0;
}

.timeline-panel-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: transform 0.5s ease-out, opacity 0.5s ease-out;
}

.event-card {
  transition: var(--transition-cosmic);
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px var(--timeline-shadow),
              0 10px 10px -5px var(--timeline-shadow);
}
```

#### 2. Glyph System

**File:** `src/assets/glyphs/index.ts`

```typescript
// Age Glyphs - Mystical symbols for each age
import React from 'react';

export const AgeGlyphs = {
  sun_disc: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="4" />
      <path d="m12 2 3 6-3-1-3 1 3-6ZM12 22l-3-6 3 1 3-1-3 6ZM20 12l-6-3 1 3-1 3 6-3ZM4 12l6 3-1-3 1-3-6 3Z" />
    </svg>
  ),

  wings: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-1.5 4-4 6.5-7 7 3 .5 5.5 3 7 7 1.5-4 4-6.5 7-7-3-.5-5.5-3-7-7Z" />
      <path d="M5 8c1.5 0 3 1 4 2.5C8 12 6.5 13 5 13s-3-1-4-2.5C2 9 3.5 8 5 8ZM19 8c-1.5 0-3 1-4 2.5 1 1.5 2.5 2.5 4 2.5s3-1 4-2.5c-1-1.5-2.5-2.5-4-2.5Z" />
    </svg>
  ),

  human_figure: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="4" r="2" />
      <path d="M15 7H9l1 7h4l1-7Z" />
      <path d="M10 14v6h1v-6h2v6h1v-6" />
    </svg>
  ),

  fire_altar: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-1 3-3 5-3 8 0 2 1 3 3 3s3-1 3-3c0-3-2-5-3-8Z" />
      <rect x="6" y="18" width="12" height="2" />
      <rect x="8" y="16" width="8" height="2" />
      <path d="M10 14c0 1 1 2 2 2s2-1 2-2" />
    </svg>
  ),

  serpent: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5Z" />
      <path d="M12 12c-2 2-4 4-4 7 0 1.5 1 2.5 2.5 2.5S13 20.5 13 19c0-1.5-1-2.5-1-2.5" />
      <circle cx="10" cy="6" r="1" />
    </svg>
  ),

  horizon_sun: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
      <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
      <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
      <path d="M2 20h20" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  twin_flame: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 2c-1 2-2 4-2 6 0 2 1 3 2 3s2-1 2-3c0-2-1-4-2-6Z" />
      <path d="M16 2c-1 2-2 4-2 6 0 2 1 3 2 3s2-1 2-3c0-2-1-4-2-6Z" />
      <ellipse cx="12" cy="18" rx="8" ry="3" />
    </svg>
  ),

  constellation: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="4" cy="4" r="1" />
      <circle cx="12" cy="2" r="1" />
      <circle cx="20" cy="6" r="1" />
      <circle cx="6" cy="12" r="1" />
      <circle cx="18" cy="14" r="1" />
      <circle cx="8" cy="20" r="1" />
      <circle cx="16" cy="18" r="1" />
      <path d="m4 4 8-2m0 0 8 4m-8-4v10m-6 2 4-10m8 2-4 4" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </svg>
  ),

  archway: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 20v-8c0-4.4 3.6-8 8-8s8 3.6 8 8v8" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="2" y="20" width="2" height="2" />
      <rect x="20" y="20" width="2" height="2" />
      <rect x="6" y="16" width="12" height="1" />
    </svg>
  )
};

export const BookGlyphs = {
  sword: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.5 6.5 19 2l1 1-4.5 4.5L14.5 6.5Z" />
      <path d="m5 16 4-4 1.5 1.5L6 18l-1-1V16Z" />
      <rect x="10" y="10" width="6" height="1" transform="rotate(45 13 10.5)" />
    </svg>
  ),

  archive: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="18" height="4" />
      <rect x="3" y="7" width="18" height="13" />
      <rect x="7" y="10" width="10" height="1" />
      <rect x="7" y="13" width="8" height="1" />
      <rect x="7" y="16" width="6" height="1" />
    </svg>
  ),

  spiral: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10-8-3.5-8-8 3-6 6-6 4 1.5 4 4-1.5 2-2 2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  dragon: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-3 0-6 2-6 6 0 2 1 4 3 5l-3 3c-1 1-1 3 1 4l2-2c1 1 3 1 4-1l3-3c1 2 3 3 5 3 4 0 6-3 6-6s-2-6-6-6c-2 0-4 1-5 3l-4-6Z" />
      <circle cx="16" cy="8" r="1" />
    </svg>
  ),

  scroll: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6c0-1 1-2 2-2h12c1 0 2 1 2 2v12c0 1-1 2-2 2H6c-1 0-2-1-2-2V6Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
};
```

#### 3. State Management (Context)

**File:** `src/contexts/TimelineContext.tsx`

```typescript
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
```

#### 4. API Layer

**File:** `src/lib/api-timeline.ts`
*(Note: This assumes your Supabase client is initialized in `lib/supabase`. Adjust the import as needed.)*

```typescript
import { supabase } from './supabase'; // Adjust this import to your supabase client location

// Type definitions for the new timeline system
export interface Age {
  id: number;
  age_number: number;
  name: string;
  title: string;
  glyph: string;
  color_code: string;
  description?: string;
  start_year?: number;
  end_year?: number;
  created_at: string;
}

export interface Book {
  id: number;
  book_number: number;
  title: string;
  glyph: string;
  color_code: string;
  description?: string;
  span_ages?: number[]; // Array of age numbers this book spans
  created_at: string;
}

export interface BookAgeSpan {
  id: number;
  book_id: number;
  age_id: number;
}

// Extended TimelineEvent interface
export interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  details?: string;
  nested_events?: Array<{
    date: string;
    title: string;
    description: string;
  }>;
  background_image?: string;
  age_id?: number;
  book_id?: number;
  glyph?: string;
  saga_arc?: string;
  issue_reference?: string;
}

// API Functions
export async function fetchAges(): Promise<Age[]> {
  try {
    const { data, error } = await supabase
      .from('ages')
      .select('*')
      .order('age_number');

    if (error) {
      console.error('Supabase error fetching ages:', error);
      throw new Error(`Failed to fetch ages: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchAges:', error);
    throw error;
  }
}

export async function fetchBooks(): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        book_age_spans(
          age_id,
          ages(age_number)
        )
      `)
      .order('book_number');

    if (error) {
      console.error('Supabase error fetching books:', error);
      throw new Error(`Failed to fetch books: ${error.message}`);
    }

    // Transform the data to include span_ages array
    const booksWithSpans = (data || []).map(book => ({
      ...book,
      span_ages: book.book_age_spans?.map((span: any) => span.ages?.age_number).filter(Boolean) || []
    }));

    return booksWithSpans;
  } catch (error) {
    console.error('Error in fetchBooks:', error);
    throw error;
  }
}

export async function fetchEventsByAge(ageId: number): Promise<TimelineEvent[]> {
  try {
    if (!ageId) return [];

    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('age_id', ageId)
      .order('date');

    if (error) {
      console.error('Supabase error fetching events:', error);
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchEventsByAge:', error);
    throw error;
  }
}
```

#### 5. Custom Hooks

**File:** `src/components/timeline/hooks/useTimelineData.ts`

```typescript
import { useState, useEffect } from 'react';
import { Age, Book, TimelineEvent, fetchAges, fetchBooks, fetchEventsByAge } from '../../../lib/api-timeline';

export const useTimelineData = () => {
  const [ages, setAges] = useState<Age[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [agesData, booksData] = await Promise.all([
          fetchAges(),
          fetchBooks()
        ]);
        setAges(agesData);
        setBooks(booksData);
      } catch (err) {
        console.error('Failed to load timeline data:', err);
        setError('Failed to load timeline data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { ages, books, loading, error };
};

export const useEventsByAge = (ageId: number) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ageId) {
      setEvents([]);
      return;
    }

    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await fetchEventsByAge(ageId);
        setEvents(eventsData);
      } catch (err) {
        console.error('Failed to load events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [ageId]);

  return { events, loading, error };
};
```

**File:** `src/components/timeline/hooks/useCosmicAnimation.ts`

```typescript
import { useState, useEffect } from 'react';

export const useCosmicAnimation = () => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.1) % 360);
    }, 100); // Update every 100ms for smooth rotation

    return () => clearInterval(interval);
  }, [isAnimating]);

  const pauseAnimation = () => setIsAnimating(false);
  const resumeAnimation = () => setIsAnimating(true);

  return {
    rotationAngle,
    isAnimating,
    pauseAnimation,
    resumeAnimation
  };
};
```

**File:** `src/components/timeline/hooks/useThemeMode.ts`

```typescript
import { useState, useEffect } from 'react';

export const useThemeMode = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('timeline-theme') as 'light' | 'dark';
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage and apply to document
    localStorage.setItem('timeline-theme', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { themeMode, toggleTheme };
};
```

#### 6. UI Components

**File:** `src/components/timeline/CosmicRings/AgeNode.tsx`

```typescript
import React from 'react';
import { AgeGlyphs } from '../../../assets/glyphs';
import { useTimelineContext } from '../../../contexts/TimelineContext';
import { Age } from '../../../lib/api-timeline';

interface AgeNodeProps {
  age: Age;
  radius: number;
  angle: number;
  index: number;
}

export const AgeNode: React.FC<AgeNodeProps> = ({ age, radius, angle, index }) => {
  const { setSelectedAge, toggleExpansion, selectedAge } = useTimelineContext();

  // Calculate position on the ring
  const radianAngle = (angle * Math.PI) / 180;
  const x = 192 + radius * Math.cos(radianAngle);
  const y = 192 + radius * Math.sin(radianAngle);

  const GlyphComponent = AgeGlyphs[age.glyph as keyof typeof AgeGlyphs];
  const isSelected = selectedAge?.id === age.id;

  const handleClick = () => {
    setSelectedAge(age);
    if (!isExpanded) {
        toggleExpansion();
    }
  };

  return (
    <g
      className="age-node cursor-pointer group"
      onClick={handleClick}
      style={{ transformOrigin: '192px 192px' }}
    >
      {/* Node Background Circle */}
      <circle
        cx={x}
        cy={y}
        r={isSelected ? "18" : "15"}
        fill={isSelected ? age.color_code : "var(--timeline-card)"}
        stroke="var(--timeline-gold)"
        strokeWidth={isSelected ? "3" : "2"}
        className="transition-all duration-300"
      />

      {/* Glyph Icon */}
      <foreignObject
        x={x - 8}
        y={y - 8}
        width="16"
        height="16"
        className="pointer-events-none"
      >
        {GlyphComponent && (
          <GlyphComponent className={`w-4 h-4 ${
            isSelected ? 'text-white' : 'text-timeline-gold'
          }`} />
        )}
      </foreignObject>

      {/* Age Title (on hover) */}
      <text
        x={x}
        y={y + 35}
        textAnchor="middle"
        className="fill-current text-timeline-text font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        {age.title}
      </text>
    </g>
  );
};
```

**File:** `src/components/timeline/CosmicRings/BookOverlay.tsx`

```typescript
import React from 'react';
import { BookGlyphs } from '../../../assets/glyphs';
import { Book } from '../../../lib/api-timeline';

interface BookOverlayProps {
  books: Book[];
}

export const BookOverlay: React.FC<BookOverlayProps> = ({ books }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Book Legend */}
      <div className="absolute bottom-4 left-4 bg-timeline-card rounded-lg p-3 opacity-80 pointer-events-auto shadow-lg">
        <h4 className="text-sm font-bold text-timeline-text mb-2">Book Chronicles</h4>
        {books.slice(0, 5).map((book) => {
          const BookGlyph = BookGlyphs[book.glyph as keyof typeof BookGlyphs];
          return (
            <div key={book.id} className="flex items-center space-x-2 text-xs text-timeline-text">
              {BookGlyph && <BookGlyph className="w-3 h-3" style={{ color: book.color_code }} />}
              <span>{book.title}</span>
            </div>
          );
        })}
        {books.length > 5 && (
          <div className="text-xs text-timeline-text opacity-60 mt-1">
            +{books.length - 5} more...
          </div>
        )}
      </div>
    </div>
  );
};
```

**File:** `src/components/timeline/CosmicRings/RingDial.tsx`

```typescript
import React from 'react';
import { AgeNode } from './AgeNode';
import { BookOverlay } from './BookOverlay';
import { useTimelineData } from '../hooks/useTimelineData';
import { useCosmicAnimation } from '../hooks/useCosmicAnimation';

export const RingDial: React.FC = () => {
  const { ages, books, loading } = useTimelineData();
  const { rotationAngle } = useCosmicAnimation();

  if (loading) {
    return (
      <div className="relative w-96 h-96 mx-auto flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-timeline-gold"></div>
        <p className="absolute mt-48 text-timeline-text">Loading cosmic data...</p>
      </div>
    );
  }

  return (
    <div className="relative w-96 h-96 mx-auto">
      <svg
        width="384"
        height="384"
        viewBox="0 0 384 384"
        className="cosmic-ring"
        style={{
          transform: `rotate(${rotationAngle}deg)`,
          filter: 'drop-shadow(0 0 20px var(--timeline-gold))'
        }}
      >
        {/* Background Cosmic Circles */}
        {Array.from({ length: 9 }).map((_, index) => (
          <circle
            key={`bg-ring-${index}`}
            cx="192"
            cy="192"
            r={40 + (index * 20)}
            fill="none"
            stroke="var(--timeline-gold)"
            strokeWidth="1"
            opacity={0.1 + (index * 0.05)}
          />
        ))}

        {/* Age Rings with Nodes */}
        {ages.map((age, index) => (
          <g key={age.id}>
            {/* Main Age Ring */}
            <circle
              cx="192"
              cy="192"
              r={60 + (index * 25)}
              fill="none"
              stroke="var(--timeline-gold)"
              strokeWidth="2"
              opacity="0.6"
              className="age-ring"
            />

            {/* Age Node */}
            <AgeNode
              age={age}
              radius={60 + (index * 25)}
              angle={index * 40} // Distribute evenly around circle
              index={index}
            />
          </g>
        ))}

        {/* Center Hub */}
        <circle
          cx="192"
          cy="192"
          r="30"
          fill="var(--timeline-gold)"
          opacity="0.8"
        />
        <circle
          cx="192"
          cy="192"
          r="20"
          fill="var(--timeline-bg)"
          stroke="var(--timeline-gold)"
          strokeWidth="2"
        />
        <text
          x="192"
          y="196"
          textAnchor="middle"
          className="fill-current text-timeline-text font-bold text-sm"
        >
          AXIS
        </text>
      </svg>

      {/* Book Overlay */}
      <BookOverlay books={books} />
    </div>
  );
};
```

**File:** `src/components/timeline/LinearTimeline/EventCard.tsx`

```typescript
import React, { useState } from 'react';
import { AgeGlyphs } from '../../../assets/glyphs';
import { TimelineEvent } from '../../../lib/api-timeline';
import { CodexEntry } from './CodexEntry';

interface EventCardProps {
  event: TimelineEvent;
  index: number;
  ageColor: string;
}

export const EventCard: React.FC<EventCardProps> = ({ event, index, ageColor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const GlyphComponent = AgeGlyphs[event.glyph as keyof typeof AgeGlyphs];

  return (
    <>
      <div
        className="event-card bg-timeline-card rounded-lg p-6 w-80 shadow-lg border border-timeline-border cursor-pointer"
        onClick={() => setIsExpanded(true)}
        style={{
          animationDelay: `${index * 0.1}s`,
          borderLeftColor: ageColor,
          borderLeftWidth: '4px'
        }}
      >
        {/* Event Header */}
        <div className="flex items-center mb-4">
          {GlyphComponent && (
            <div className="flex-shrink-0 mr-3">
              <GlyphComponent className="w-8 h-8 text-timeline-gold" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-timeline-text truncate">
              {event.title}
            </h3>
            <p className="text-sm text-timeline-text opacity-60">
              {event.date}
            </p>
          </div>
        </div>

        {/* Event Description */}
        <p className="text-sm text-timeline-text mb-4 line-clamp-3">
          {event.description}
        </p>

        {/* Event Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.saga_arc && (
            <span
              className="px-2 py-1 rounded text-xs font-medium text-white"
              style={{ backgroundColor: ageColor }}
            >
              {event.saga_arc}
            </span>
          )}
          {event.issue_reference && (
            <span className="px-2 py-1 rounded text-xs bg-timeline-border text-timeline-text">
              Issue #{event.issue_reference}
            </span>
          )}
        </div>

        {/* Hover Indicator */}
        <div className="text-xs text-timeline-text opacity-40 mt-4 text-center group-hover:opacity-100">
          Click to expand
        </div>
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <CodexEntry
          event={event}
          ageColor={ageColor}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};
```

**File:** `src/components/timeline/LinearTimeline/CodexEntry.tsx`

```typescript
import React from 'react';
import { AgeGlyphs } from '../../../assets/glyphs';
import { TimelineEvent } from '../../../lib/api-timeline';

interface CodexEntryProps {
  event: TimelineEvent;
  ageColor: string;
  onClose: () => void;
}

export const CodexEntry: React.FC<CodexEntryProps> = ({ event, ageColor, onClose }) => {
  const GlyphComponent = AgeGlyphs[event.glyph as keyof typeof AgeGlyphs];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-timeline-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto border border-timeline-border shadow-2xl">
        {/* Header */}
        <div
          className="p-6 border-b border-timeline-border"
          style={{ borderLeftColor: ageColor, borderLeftWidth: '4px' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {GlyphComponent && (
                <GlyphComponent className="w-12 h-12 text-timeline-gold flex-shrink-0 mt-1" />
              )}
              <div>
                <h2 className="text-3xl font-bold text-timeline-text mb-2">
                  {event.title}
                </h2>
                <p className="text-timeline-text opacity-70 text-lg">
                  {event.date}
                </p>
                {(event.saga_arc || event.issue_reference) && (
                  <div className="flex space-x-2 mt-3">
                    {event.saga_arc && (
                      <span
                        className="px-3 py-1 rounded text-sm font-medium text-white"
                        style={{ backgroundColor: ageColor }}
                      >
                        {event.saga_arc}
                      </span>
                    )}
                    {event.issue_reference && (
                      <span className="px-3 py-1 rounded text-sm bg-timeline-border text-timeline-text">
                        Issue #{event.issue_reference}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-timeline-border rounded-full transition-colors flex-shrink-0"
            >
              <svg className="w-6 h-6 text-timeline-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <p className="text-timeline-text leading-relaxed text-lg">
              {event.description}
            </p>
          </div>

          {event.details && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-timeline-text mb-3">
                Chronicle Details
              </h3>
              <div className="bg-timeline-bg p-4 rounded-lg border border-timeline-border">
                <p className="text-timeline-text leading-relaxed">
                  {event.details}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

**File:** `src/components/timeline/LinearTimeline/TimelinePanel.tsx`

```typescript
import React from 'react';
import { EventCard } from './EventCard';
import { useTimelineContext } from '../../../contexts/TimelineContext';
import { useEventsByAge } from '../hooks/useTimelineData';

export const TimelinePanel: React.FC = () => {
  const { selectedAge, isExpanded, setSelectedAge } = useTimelineContext();
  const { events, loading } = useEventsByAge(selectedAge?.id || 0);

  if (!selectedAge || !isExpanded) return null;

  const handleClose = () => {
    setSelectedAge(null);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-full lg:w-2/3 bg-timeline-bg z-40 shadow-2xl timeline-panel-enter-active">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-timeline-border bg-timeline-card">
        <div className="flex items-center space-x-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: selectedAge.color_code }}
          >
            <span className="text-white font-bold text-2xl">{selectedAge.age_number}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-timeline-text">{selectedAge.name}</h2>
            <p className="text-timeline-text opacity-70">{selectedAge.title}</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-timeline-border rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-timeline-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Timeline Events */}
      <div className="h-full overflow-x-auto bg-timeline-bg">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-timeline-gold"></div>
            <p className="ml-4 text-timeline-text">Loading events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="flex items-stretch h-full p-8">
            <div className="flex space-x-6 min-w-max">
              {events.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  ageColor={selectedAge.color_code}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl opacity-20 mb-4">📜</div>
              <h3 className="text-xl font-semibold text-timeline-text mb-2">No Events Yet</h3>
              <p className="text-timeline-text opacity-70">
                This age awaits its chronicles to be written.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

**File:** `src/components/timeline/Navigation/BreadcrumbCompass.tsx`

```typescript
import React from 'react';
import { useTimelineContext } from '../../../contexts/TimelineContext';

export const BreadcrumbCompass: React.FC = () => {
  const { selectedAge, setSelectedAge } = useTimelineContext();

  return (
    <nav className="bg-timeline-card rounded-lg px-4 py-2 border border-timeline-border shadow-lg">
      <div className="flex items-center space-x-2 text-sm">
        {/* Home */}
        <button
          onClick={() => setSelectedAge(null)}
          className="flex items-center text-timeline-text hover:text-timeline-gold transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Cosmic Timeline
        </button>

        {/* Separator & Current Age */}
        {selectedAge && (
          <>
            <span className="text-timeline-text opacity-50">/</span>
            <span className="text-timeline-gold font-medium">
              {selectedAge.name}
            </span>
          </>
        )}
      </div>
    </nav>
  );
};
```

**File:** `src/components/timeline/Navigation/ModeToggle.tsx`

```typescript
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
```

**File:** `src/components/timeline/CosmicTimeline.tsx`

```typescript
import React from 'react';
import { RingDial } from './CosmicRings/RingDial';
import { TimelinePanel } from './LinearTimeline/TimelinePanel';
import { BreadcrumbCompass } from './Navigation/BreadcrumbCompass';
import { ModeToggle } from './Navigation/ModeToggle';
import { useTimelineContext } from '../../contexts/TimelineContext';

export const CosmicTimeline: React.FC = () => {
  const { isExpanded } = useTimelineContext();

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isExpanded ? 'grid grid-cols-1 lg:grid-cols-3' : 'flex flex-col items-center justify-center'
    }`}>
      {/* Star Field Background */}
      <div className="star-field">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="fixed top-4 right-4 z-50 flex space-x-4">
        <BreadcrumbCompass />
        <ModeToggle />
      </div>

      {/* Main Content Area */}
      <div className={`flex items-center justify-center p-8 ${
        isExpanded ? 'lg:col-span-1' : 'min-h-screen'
      }`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8 text-timeline-gold">
            Cosmic Timeline
          </h1>
          <RingDial />
        </div>
      </div>

      {/* Expandable Timeline Panel */}
      {isExpanded && (
        <div className="lg:col-span-2">
            <TimelinePanel />
        </div>
      )}
    </div>
  );
};
```

#### 7. Main Page Component

**File:** `src/pages/Timelines.tsx`

```typescript
import React from 'react';
import { CosmicTimeline } from '../components/timeline/CosmicTimeline';
import { TimelineProvider } from '../contexts/TimelineContext';

const TimelinesPage: React.FC = () => {
  return (
    <TimelineProvider>
      <div className="min-h-screen bg-timeline-bg text-timeline-text">
        <CosmicTimeline />
      </div>
    </TimelineProvider>
  );
};

export default TimelinesPage;
```

### Phase 4: Integration

#### 1. Import CSS

Open `apps/frontend/src/index.css` and add the following line at the top:

```css
@import './styles/timeline-themes.css';
```

#### 2. Update App Routing

Open `apps/frontend/src/App.tsx`. Find the line where `TimelinesPage` is imported and modify it to use the new local component.

**Change this:**

```typescript
import { SubscriptionPage, SubscriptionSuccessPage, LibraryPage, TimelinesPage } from '@zoroaster/ui';
```

**To this:**

```typescript
import { SubscriptionPage, SubscriptionSuccessPage, LibraryPage } from '@zoroaster/ui';
import TimelinesPage from './pages/Timelines'; // Use the new local cosmic timeline
```

### Phase 5: Testing & Verification

After completing the steps above, start your development server (`npm run dev` or similar).

1.  Navigate to your `/timelines` page.
2.  **Verify:** The Cosmic Ring dial should be visible and animating.
3.  **Test:** Click on an Age node. The linear timeline panel should slide in from the right.
4.  **Verify:** The panel should show the correct Age title and load events for that age.
5.  **Test:** Click on an event card to open the detailed Codex modal.
6.  **Test:** Use the theme toggle to switch between light and dark modes.
7.  **Verify:** Check the layout and functionality on different screen sizes (desktop and mobile).
8.  **Verify:** Check the browser's developer console for any errors.

---

## ↩️ Part 3: Rollback Plan

If you encounter any critical issues, you can quickly revert to your old timeline:

1.  In `apps/frontend/src/pages`, delete the new `Timelines.tsx`.
2.  Rename `Timelines.classic.tsx` back to `Timelines.tsx`.
3.  Rename `Timelines.classic.module.css` back to `Timelines.module.css`.
4.  In `apps/frontend/src/App.tsx`, revert the import change to use `@zoroaster/ui` again.
5.  Remove the CSS import from `index.css`.

This completes the unified guide. You now have all the necessary code and instructions to implement the Cosmic Timeline.
