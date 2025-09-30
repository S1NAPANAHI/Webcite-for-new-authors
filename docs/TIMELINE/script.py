# Phase 3: UI Component Implementation
# This phase creates all the interactive components for the Cosmic Timeline

# Let's create all the Phase 3 component files
import os

print("🎨 PHASE 3: UI COMPONENT IMPLEMENTATION")
print("=" * 60)
print("\nPhase 3 creates all the interactive components for your Cosmic Timeline:")
print("- Cosmic Ring Dial with rotating Age nodes")
print("- Linear Timeline Panel with event cards") 
print("- Navigation components (Breadcrumb Compass, Mode Toggle)")
print("- Custom hooks for animations and data management")
print("- Main CosmicTimeline component and updated Timelines page")
print("\nThis implements the dual-interface system from your design guide.\n")

# Create the component files
components = {
    "AgeNode.tsx": """import React from 'react';
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
    if (!isExpanded) toggleExpansion();
  };
  
  return (
    <g className="age-node cursor-pointer group" onClick={handleClick}
       style={{ transformOrigin: '192px 192px' }}>
      
      {/* Node Background Circle */}
      <circle
        cx={x} cy={y}
        r={isSelected ? 18 : 15}
        fill={isSelected ? age.colorcode : 'var(--timeline-card)'}
        stroke="var(--timeline-gold)"
        strokeWidth={isSelected ? 3 : 2}
        className="transition-all duration-300"
      />
      
      {/* Glyph Icon */}
      <foreignObject x={x - 8} y={y - 8} width="16" height="16" className="pointer-events-none">
        {GlyphComponent && (
          <GlyphComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-timeline-gold'}`} />
        )}
      </foreignObject>
      
      {/* Age Title on hover */}
      <text x={x} y={y + 35} textAnchor="middle"
            className="fill-current text-timeline-text font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {age.title}
      </text>
    </g>
  );
};""",

    "BookOverlay.tsx": """import React from 'react';
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
        {books.slice(0, 5).map(book => {
          const BookGlyph = BookGlyphs[book.glyph as keyof typeof BookGlyphs];
          return (
            <div key={book.id} className="flex items-center space-x-2 text-xs text-timeline-text">
              {BookGlyph && <BookGlyph className="w-3 h-3" style={{ color: book.colorcode }} />}
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
};""",

    "RingDial.tsx": """import React from 'react';
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
      <svg width="384" height="384" viewBox="0 0 384 384" 
           className="cosmic-ring"
           style={{ 
             transform: `rotate(${rotationAngle}deg)`,
             filter: 'drop-shadow(0 0 20px var(--timeline-gold))'
           }}>
        
        {/* Background Cosmic Circles */}
        {Array.from({ length: 9 }).map((_, index) => (
          <circle key={`bg-ring-${index}`}
                  cx="192" cy="192" r={40 + index * 20}
                  fill="none" stroke="var(--timeline-gold)" strokeWidth="1"
                  opacity={0.1 + index * 0.05} />
        ))}
        
        {/* Age Rings with Nodes */}
        {ages.map((age, index) => (
          <g key={age.id}>
            {/* Main Age Ring */}
            <circle cx="192" cy="192" r={60 + index * 25}
                    fill="none" stroke="var(--timeline-gold)" strokeWidth="2"
                    opacity="0.6" className="age-ring" />
            
            {/* Age Node */}
            <AgeNode 
              age={age} 
              radius={60 + index * 25} 
              angle={index * 40} // Distribute evenly around circle
              index={index} 
            />
          </g>
        ))}
        
        {/* Center Hub */}
        <circle cx="192" cy="192" r="30" fill="var(--timeline-gold)" opacity="0.8" />
        <circle cx="192" cy="192" r="20" fill="var(--timeline-bg)" 
                stroke="var(--timeline-gold)" strokeWidth="2" />
        <text x="192" y="196" textAnchor="middle" 
              className="fill-current text-timeline-text font-bold text-sm">
          AXIS
        </text>
      </svg>
      
      {/* Book Overlay */}
      <BookOverlay books={books} />
    </div>
  );
};""",

    "EventCard.tsx": """import React, { useState } from 'react';
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
      <div className="event-card bg-timeline-card rounded-lg p-6 w-80 shadow-lg border border-timeline-border cursor-pointer"
           onClick={() => setIsExpanded(true)}
           style={{ 
             animationDelay: `${index * 0.1}s`,
             borderLeftColor: ageColor,
             borderLeftWidth: '4px'
           }}>
        
        {/* Event Header */}
        <div className="flex items-center mb-4">
          {GlyphComponent && (
            <div className="flex-shrink-0 mr-3">
              <GlyphComponent className="w-8 h-8 text-timeline-gold" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-timeline-text truncate">{event.title}</h3>
            <p className="text-sm text-timeline-text opacity-60">{event.date}</p>
          </div>
        </div>
        
        {/* Event Description */}
        <p className="text-sm text-timeline-text mb-4 line-clamp-3">{event.description}</p>
        
        {/* Event Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.sagaarc && (
            <span className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: ageColor }}>
              {event.sagaarc}
            </span>
          )}
          {event.issuereference && (
            <span className="px-2 py-1 rounded text-xs bg-timeline-border text-timeline-text">
              Issue #{event.issuereference}
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
};"""
}

# Print summary of what we're creating
print("CREATING PHASE 3 COMPONENTS:")
print("-" * 40)
for filename in components.keys():
    print(f"✓ {filename}")

# Create the files
for filename, content in components.items():
    with open(f"Phase3_{filename}", 'w') as f:
        f.write(content)
    print(f"📁 Created: Phase3_{filename}")

print(f"\n🎯 {len(components)} core UI components created!")
print("\nNext: Create remaining components (CodexEntry, TimelinePanel, Navigation, hooks, main CosmicTimeline)")