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
        <div className="p-6 border-b border-timeline-border" 
             style={{ borderLeftColor: ageColor, borderLeftWidth: '4px' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {GlyphComponent && (
                <GlyphComponent className="w-12 h-12 text-timeline-gold flex-shrink-0 mt-1" />
              )}
              <div>
                <h2 className="text-3xl font-bold text-timeline-text mb-2">{event.title}</h2>
                <p className="text-timeline-text opacity-70 text-lg">{event.date}</p>
                {(event.sagaarc || event.issuereference) && (
                  <div className="flex space-x-2 mt-3">
                    {event.sagaarc && (
                      <span className="px-3 py-1 rounded text-sm font-medium text-white"
                            style={{ backgroundColor: ageColor }}>
                        {event.sagaarc}
                      </span>
                    )}
                    {event.issuereference && (
                      <span className="px-3 py-1 rounded text-sm bg-timeline-border text-timeline-text">
                        Issue #{event.issuereference}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button onClick={onClose} 
                    className="p-2 hover:bg-timeline-border rounded-full transition-colors flex-shrink-0">
              <svg className="w-6 h-6 text-timeline-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <p className="text-timeline-text leading-relaxed text-lg">{event.description}</p>
          </div>

          {event.details && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-timeline-text mb-3">Chronicle Details</h3>
              <div className="bg-timeline-bg p-4 rounded-lg border border-timeline-border">
                <p className="text-timeline-text leading-relaxed">{event.details}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};