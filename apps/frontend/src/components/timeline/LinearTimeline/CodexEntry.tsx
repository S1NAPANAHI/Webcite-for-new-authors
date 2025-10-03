import React, { useState } from 'react';
import { AgeGlyphs } from '../../../assets/glyphs/index.tsx';
import { TimelineEvent } from '../../../lib/api-timeline';

interface CodexEntryProps {
  event: TimelineEvent;
  ageColor: string;
  onClose: () => void;
}

export const CodexEntry: React.FC<CodexEntryProps> = ({ event, ageColor, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [nestedImageStates, setNestedImageStates] = useState<{[key: string]: {loaded: boolean, error: boolean}}>({});
  const GlyphComponent = AgeGlyphs[event.glyph as keyof typeof AgeGlyphs];

  const handleNestedImageLoad = (nestedEventId: string) => {
    setNestedImageStates(prev => ({
      ...prev,
      [nestedEventId]: { ...prev[nestedEventId], loaded: true }
    }));
  };

  const handleNestedImageError = (nestedEventId: string) => {
    setNestedImageStates(prev => ({
      ...prev,
      [nestedEventId]: { ...prev[nestedEventId], error: true }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-timeline-card rounded-lg max-w-4xl w-full max-h-[95vh] overflow-auto border border-timeline-border shadow-2xl my-4">
        
        {/* Hero Image Section */}
        {event.background_image && !imageError && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={event.background_image}
              alt={event.image_alt || event.title}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {/* Hero Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Loading State */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-timeline-border/50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-timeline-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Close Button Overlay */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Title Overlay on Hero Image */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-start space-x-4">
                {GlyphComponent && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-full p-3">
                    <GlyphComponent className="w-8 h-8 text-timeline-gold drop-shadow-lg" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {event.title}
                  </h2>
                  <p className="text-white/90 text-lg drop-shadow-md">
                    {event.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Header (when no hero image) */}
        {(!event.background_image || imageError) && (
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
        )}

        {/* Content */}
        <div className="p-8">
          {/* Event Tags (when hero image is present) */}
          {event.background_image && !imageError && (event.saga_arc || event.issue_reference) && (
            <div className="flex flex-wrap gap-2 mb-6">
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
          
          {/* Main Description */}
          <div className="mb-6">
            <p className="text-timeline-text leading-relaxed text-lg">
              {event.description}
            </p>
          </div>

          {/* Details Section */}
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
          
          {/* Nested Events/Sub-events Section */}
          {event.nested_events && event.nested_events.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-timeline-text mb-4">
                Related Chronicles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.nested_events.map((nestedEvent) => {
                  const nestedState = nestedImageStates[nestedEvent.id || ''] || { loaded: false, error: false };
                  
                  return (
                    <div 
                      key={nestedEvent.id} 
                      className="bg-timeline-bg rounded-lg border border-timeline-border overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {/* Nested Event Image */}
                      {nestedEvent.image_url && !nestedState.error && (
                        <div className="relative h-24 overflow-hidden">
                          <img
                            src={nestedEvent.image_url}
                            alt={nestedEvent.image_alt || nestedEvent.title}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${
                              nestedState.loaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => handleNestedImageLoad(nestedEvent.id || '')}
                            onError={() => handleNestedImageError(nestedEvent.id || '')}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          
                          {/* Loading state for nested image */}
                          {!nestedState.loaded && !nestedState.error && (
                            <div className="absolute inset-0 bg-timeline-border/30 flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-timeline-gold border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                          
                          {/* Date badge on image */}
                          {nestedEvent.date && (
                            <div className="absolute top-2 right-2">
                              <span className="text-xs text-white bg-black/60 px-2 py-1 rounded font-medium">
                                {nestedEvent.date}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Nested Event Content */}
                      <div className="p-4">
                        {/* Title and Date (when no image) */}
                        {(!nestedEvent.image_url || nestedState.error) && nestedEvent.date && (
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-timeline-gold font-medium px-2 py-1 bg-timeline-gold/10 rounded">
                              {nestedEvent.date}
                            </span>
                          </div>
                        )}
                        
                        <h4 className="text-lg font-semibold text-timeline-text mb-2">
                          {nestedEvent.title}
                        </h4>
                        
                        <p className="text-sm text-timeline-text opacity-80 leading-relaxed">
                          {nestedEvent.description}
                        </p>
                        
                        {/* Image indicator */}
                        {nestedEvent.image_url && !nestedState.error && (
                          <div className="mt-2 flex items-center text-xs text-timeline-gold">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            Illustrated
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};