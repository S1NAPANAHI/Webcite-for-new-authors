import React, { useState } from 'react';
import { AgeGlyphs } from '../../../assets/glyphs/index.tsx';
import { TimelineEvent } from '../../../lib/api-timeline';
import { CodexEntry } from './CodexEntry';

interface EventCardProps {
  event: TimelineEvent;
  index: number;
  ageColor: string;
}

export const EventCard: React.FC<EventCardProps> = ({ event, index, ageColor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const GlyphComponent = AgeGlyphs[event.glyph as keyof typeof AgeGlyphs];
  
  return (
    <>
      <div
        className="event-card bg-timeline-card rounded-lg overflow-hidden w-80 shadow-lg border border-timeline-border cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        onClick={() => setIsExpanded(true)}
        style={{
          animationDelay: `${index * 0.1}s`,
          borderLeftColor: ageColor,
          borderLeftWidth: '4px'
        }}
      >
        {/* Event Image Header */}
        {event.background_image && !imageError && (
          <div className="relative h-32 overflow-hidden">
            <img
              src={event.background_image}
              alt={event.image_alt || event.title}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Image Loading State */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-timeline-border/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-timeline-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Glyph Overlay on Image */}
            {GlyphComponent && imageLoaded && (
              <div className="absolute top-3 left-3">
                <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
                  <GlyphComponent className="w-6 h-6 text-timeline-gold drop-shadow-lg" />
                </div>
              </div>
            )}
            
            {/* Date overlay on image */}
            <div className="absolute bottom-2 right-3">
              <span className="text-xs text-white/90 bg-black/50 px-2 py-1 rounded font-medium backdrop-blur-sm">
                {event.date}
              </span>
            </div>
          </div>
        )}
        
        {/* Event Content */}
        <div className="p-6">
          {/* Event Header - only show if no image */}
          {(!event.background_image || imageError) && (
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
          )}
          
          {/* Title when image is present */}
          {event.background_image && !imageError && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-timeline-text">
                {event.title}
              </h3>
            </div>
          )}

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
            {/* Image indicator tag */}
            {event.background_image && !imageError && (
              <span className="px-2 py-1 rounded text-xs bg-timeline-gold/20 text-timeline-gold border border-timeline-gold/30">
                📸 Illustrated
              </span>
            )}
          </div>

          {/* Hover Indicator */}
          <div className="text-xs text-timeline-text opacity-40 text-center group-hover:opacity-100 transition-opacity">
            Click to expand
          </div>
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