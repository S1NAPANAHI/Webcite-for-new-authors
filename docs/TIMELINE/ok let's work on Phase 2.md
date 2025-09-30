<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# ok let's work on Phase 2

Phase 2 will establish all the core theme, glyph, and state management systems that power your Cosmic Timeline interface. This sets up the foundational styles, SVG icon library, and React context framework for your timeline, as detailed in your unified guide.[^1]

## Phase 2: Cosmic Timeline Foundation

### 1. Theme System (Cosmic Timeline CSS)

Create a theme CSS file for both modes:

- **Parchment Codex (Light)**
- **Astral Observatory (Dark)**

**File:** `src/styles/timeline-themes.css`

```css
:root[data-theme="light"] {
  --timeline-bg: #f5f1eb;
  --timeline-text: #2d2013;
  --timeline-gold: #d4af37;
  --timeline-navy: #1e293b;
  --timeline-card: #ffffff;
  --timeline-shadow: rgba(0, 0, 0, 0.1);
  --timeline-border: #e5e7eb;
  --timeline-accent: #3b82f6;
}
:root[data-theme="dark"] {
  --timeline-bg: #0f0f23;
  --timeline-text: #d4af37;
  --timeline-gold: #ffd700;
  --timeline-navy: #1e1b4b;
  --timeline-card: #1a1a2e;
  --timeline-shadow: rgba(212, 175, 55, 0.2);
  --timeline-border: #374151;
  --timeline-accent: #8b5cf6;
}
```

Import this in `src/index.css`:

```css
@import './styles/timeline-themes.css';
```


### 2. Age \& Book Glyph Icon Library

Add a TypeScript file exporting your SVG icons for each age and book:

**File:** `src/assets/glyphs/index.ts`

```typescript
import React from "react";

export const AgeGlyphs = {
  "sun-disc": (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="..." />
    </svg>
  ),
  "wings": (props) => (/* SVG for wings */),
  // ... add glyphs for each cosmic age
};

export const BookGlyphs = {
  "sword": (props) => (/* SVG for sword */),
  "archive": (props) => (/* SVG for archive */),
  // ... add glyphs for each book
};
```

Populate with the SVGs shown in your unified guide.[^1]

### 3. Timeline State (React Context)

**File:** `src/contexts/TimelineContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from "react";

const TimelineContext = createContext(undefined);

export const TimelineProvider = ({ children }) => {
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [themeMode, setThemeMode] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("timeline-theme");
    if (savedTheme) setThemeMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("timeline-theme", themeMode);
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  return (
    <TimelineContext.Provider value={{
      selectedAge,
      selectedEvent,
      isExpanded,
      themeMode,
      setSelectedAge,
      setSelectedEvent,
      setIsExpanded,
      setThemeMode,
    }}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimelineContext = () => useContext(TimelineContext);
```


### 4. Next Steps Checklist

- [ ] Add `timeline-themes.css` and import in index.css
- [ ] Create `glyphs/index.ts` for AgeGlyphs and BookGlyphs
- [ ] Implement `TimelineContext` and provider
- [ ] Confirm component folders exist from Phase 1
- [ ] Ready for UI implementation (RingDial, TimelinePanel, etc.) in Phase 3


### What This Enables

This phase establishes a visually rich, symbolic, and responsive foundation for your narrative timeline, making your lore navigable via glyphs and cosmic color themes across all devices. Your site will now have theme switching, mystical iconography, and event management powered by structured React context.[^1]

Confirm when these files are in place and we’ll move on to Phase 3 and begin building out the main UI components!Phase 2 sets up the foundational systems for your Cosmic Timeline: the dual-mode theme, mystical glyph icon library, and React Context state management. This enables a responsive, mythic interface and centralized control for your Age/Book navigation and theme toggling.[^1]

### Theme System Setup

Create `src/styles/timeline-themes.css` containing both light and dark mode variables:

```css
:root[data-theme="light"] {
  --timeline-bg: #f5f1eb;
  --timeline-text: #2d2013;
  --timeline-gold: #d4af37;
  --timeline-navy: #1e293b;
  --timeline-card: #ffffff;
  --timeline-border: #e5e7eb;
}
:root[data-theme="dark"] {
  --timeline-bg: #0f0f23;
  --timeline-text: #d4af37;
  --timeline-gold: #ffd700;
  --timeline-navy: #1e1b4b;
  --timeline-card: #1a1a2e;
  --timeline-border: #374151;
}
```

Import in `src/index.css`:

```css
@import './styles/timeline-themes.css';
```

This activates instant theme switching for the entire timeline interface.[^1]

### Glyph Icon Library

Create `src/assets/glyphs/index.ts` with exported SVG components for each Age and Book glyph:

```typescript
export const AgeGlyphs = {
  "sun-disc": (props) => (<svg {...props}><circle cx="12" cy="12" r="4" /></svg>),
  "wings": (props) => (<svg {...props}>/* wings glyph SVG */</svg>),
  // Add all age glyphs here
};
export const BookGlyphs = {
  "sword": (props) => (<svg {...props}>/* sword glyph SVG */</svg>),
  "archive": (props) => (<svg {...props}>/* archive glyph SVG */</svg>),
  // Add all book glyphs here
};
```

Populate these using the provided SVGs for mystical glyphs in your design guide.[^1]

### Timeline React Context

Create `src/contexts/TimelineContext.tsx` for global state:

```typescript
const TimelineContext = createContext(undefined);
export const TimelineProvider = ({ children }) => {
  // selectedAge, selectedEvent, isExpanded, themeMode setup
  // useEffect to sync themeMode with localStorage and <html data-theme>
  // methods for navigation/expansion
  // return Context.Provider
};
export const useTimelineContext = () => useContext(TimelineContext);
```

This centralizes selected Age/Book, themeMode, and event expansion for all Cosmic Timeline UI components.[^1]

### Phase 2 Checklist

- [ ] Add theme CSS and import in index.css
- [ ] Create AgeGlyphs and BookGlyphs in index.ts
- [ ] Implement TimelineContext.tsx for state logic
- [ ] Confirm directory structure from Phase 1 is present
- [ ] Ready for main UI buildout (Phase 3: UI Components)

These systems provide the full design foundation: symbolic, themeable, and structured for reactivity and accessibility.[^1]

Let me know when these pieces are set up, and we’ll move straight into UI component implementation for Phase 3!

<div align="center">⁂</div>

[^1]: UNIFIED_COSMIC_TIMELINE_GUIDE.md

