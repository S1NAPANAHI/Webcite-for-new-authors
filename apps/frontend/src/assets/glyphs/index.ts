// Age Glyphs - Mystical symbols for each age
import React from 'react';

export const AgeGlyphs = {
  sun_disc: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="4" />
      <path d="m12 2 3 6-3-1-3 1 3-6ZM12 22l-3-6 3 1 3-1-3 6ZM20 12l-6-3 1 3-1 3 6-3ZM4 12l6 3-1-3 1-3-6 3Z" />
    </svg>
  ),

  wings: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-1.5 4-4 6.5-7 7 3 .5 5.5 3 7 7 1.5-4 4-6.5 7-7-3-.5-5.5-3-7-7Z" />
      <path d="M5 8c1.5 0 3 1 4 2.5C8 12 6.5 13 5 13s-3-1-4-2.5C2 9 3.5 8 5 8ZM19 8c-1.5 0-3 1-4 2.5 1 1.5 2.5 2.5 4 2.5s3-1 4-2.5c-1-1.5-2.5-2.5-4-2.5Z" />
    </svg>
  ),

  human_figure: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="4" r="2" />
      <path d="M15 7H9l1 7h4l1-7Z" />
      <path d="M10 14v6h1v-6h2v6h1v-6" />
    </svg>
  ),

  fire_altar: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-1 3-3 5-3 8 0 2 1 3 3 3s3-1 3-3c0-3-2-5-3-8Z" />
      <rect x="6" y="18" width="12" height="2" />
      <rect x="8" y="16" width="8" height="2" />
      <path d="M10 14c0 1 1 2 2 2s2-1 2-2" />
    </svg>
  ),

  serpent: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5Z" />
      <path d="M12 12c-2 2-4 4-4 7 0 1.5 1 2.5 2.5 2.5S13 20.5 13 19c0-1.5-1-2.5-1-2.5" />
      <circle cx="10" cy="6" r="1" />
    </svg>
  ),

  horizon_sun: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
      <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
      <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
      <path d="M2 20h20" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  twin_flame: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 2c-1 2-2 4-2 6 0 2 1 3 2 3s2-1 2-3c0-2-1-4-2-6Z" />
      <path d="M16 2c-1 2-2 4-2 6 0 2 1 3 2 3s2-1 2-3c0-2-1-4-2-6Z" />
      <ellipse cx="12" cy="18" rx="8" ry="3" />
    </svg>
  ),

  constellation: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
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
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 20v-8c0-4.4 3.6-8 8-8s8 3.6 8 8v8" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="2" y="20" width="2" height="2" />
      <rect x="20" y="20" width="2" height="2" />
      <rect x="6" y="16" width="12" height="1" />
    </svg>
  )
};

export const BookGlyphs = {
  sword: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.5 6.5 19 2l1 1-4.5 4.5L14.5 6.5Z" />
      <path d="m5 16 4-4 1.5 1.5L6 18l-1-1V16Z" />
      <rect x="10" y="10" width="6" height="1" transform="rotate(45 13 10.5)" />
    </svg>
  ),

  archive: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="18" height="4" />
      <rect x="3" y="7" width="18" height="13" />
      <rect x="7" y="10" width="10" height="1" />
      <rect x="7" y="13" width="8" height="1" />
      <rect x="7" y="16" width="6" height="1" />
    </svg>
  ),

  spiral: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10-8-3.5-8-8 3-6 6-6 4 1.5 4 4-1.5 2-2 2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  dragon: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-3 0-6 2-6 6 0 2 1 4 3 5l-3 3c-1 1-1 3 1 4l2-2c1 1 3 1 4-1l3-3c1 2 3 3 5 3 4 0 6-3 6-6s-2-6-6-6c-2 0-4 1-5 3l-4-6Z" />
      <circle cx="16" cy="8" r="1" />
    </svg>
  ),

  scroll: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg class={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6c0-1 1-2 2-2h12c1 0 2 1 2 2v12c0 1-1 2-2 2H6c-1 0-2-1-2-2V6Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
};