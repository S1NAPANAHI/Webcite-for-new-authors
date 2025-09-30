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
