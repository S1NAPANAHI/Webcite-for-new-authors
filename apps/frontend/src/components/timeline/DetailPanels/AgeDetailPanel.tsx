import React, { useState, useEffect } from 'react';
import { Age, TimelineEvent } from '../../../lib/api-timeline';
import { useEventsByAge } from '../hooks/useTimelineData';
import { EventCard } from './EventCard';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';

interface AgeDetailPanelProps {
  age: Age;
  onEventSelect?: (events: TimelineEvent[]) => void;
  onClose?: () => void;
  isExpanded?: boolean;
  className?: string;
}

export const AgeDetailPanel: React.FC<AgeDetailPanelProps> = ({ 
  age, 
  onEventSelect,
  onClose,
  isExpanded = false,
  className = '' 
}) => {
  const { events, loading, error } = useEventsByAge(age.id);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [sortOrder, setSortOrder] = useState<'chronological' | 'importance'>('chronological');
  const [filterType, setFilterType] = useState<'all' | 'major' | 'minor'>('all');

  useEffect(() => {
    if (events.length > 0 && onEventSelect) {
      onEventSelect(events);
    }
  }, [events, onEventSelect]);

  const filteredAndSortedEvents = React.useMemo(() => {
    let filtered = events.filter(event => {
      if (filterType === 'all') return true;
      if (filterType === 'major') return event.importance === 'major';
      if (filterType === 'minor') return event.importance === 'minor';
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortOrder === 'chronological') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        const importanceOrder = { 'major': 3, 'medium': 2, 'minor': 1 };
        return (importanceOrder[b.importance] || 0) - (importanceOrder[a.importance] || 0);
      }
    });
  }, [events, sortOrder, filterType]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <LoadingSpinner size="large" />
        <p className="ml-4 text-timeline-text/70">Loading age timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className} ${isExpanded ? 'expanded-age-detail' : ''}`}>
      {/* Age Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-timeline-gold/5 to-transparent rounded-xl"></div>
        <div className="relative p-6 border border-timeline-gold/20 rounded-xl backdrop-blur-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className={`font-bold text-timeline-gold mb-2 ${
                isExpanded ? 'text-4xl' : 'text-3xl'
              }`}>
                {age.title || age.name}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-timeline-text/70">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {age.dateRange || `${age.start_year || '∞'} - ${age.end_year || '∞'}`}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {events.length} Events
                </span>
                {age.age_number && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    Age {age.age_number}
                  </span>
                )}
              </div>
            </div>
            
            {age.symbol && (
              <div className="text-4xl opacity-50">
                {age.symbol}
              </div>
            )}
          </div>
          
          <p className="text-timeline-text/80 leading-relaxed">
            {age.description}
          </p>

          {age.keyThemes && age.keyThemes.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-timeline-gold/80 mb-2">Key Themes:</h4>
              <div className="flex flex-wrap gap-2">
                {age.keyThemes.map((theme, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-timeline-gold/10 border border-timeline-gold/30 rounded-full text-xs text-timeline-gold"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Age-specific information */}
          {(age.major_events_summary || age.cultural_significance || age.notable_figures) && (
            <div className="mt-6 space-y-4">
              {age.major_events_summary && (
                <div>
                  <h4 className="text-sm font-semibold text-timeline-gold/80 mb-2">Major Events Summary:</h4>
                  <p className="text-timeline-text/70 text-sm leading-relaxed">
                    {age.major_events_summary}
                  </p>
                </div>
              )}
              
              {age.cultural_significance && (
                <div>
                  <h4 className="text-sm font-semibold text-timeline-gold/80 mb-2">Cultural Significance:</h4>
                  <p className="text-timeline-text/70 text-sm leading-relaxed">
                    {age.cultural_significance}
                  </p>
                </div>
              )}
              
              {age.notable_figures && age.notable_figures.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-timeline-gold/80 mb-2">Notable Figures:</h4>
                  <div className="flex flex-wrap gap-2">
                    {age.notable_figures.map((figure, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-timeline-gold/5 border border-timeline-gold/20 rounded text-xs text-timeline-gold/80"
                      >
                        {figure}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 bg-timeline-bg/50 p-4 rounded-lg border border-timeline-gold/10">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-timeline-text/70">Sort by:</label>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value as 'chronological' | 'importance')}
            className="px-3 py-1 bg-timeline-bg border border-timeline-gold/30 rounded text-sm text-timeline-text focus:outline-none focus:ring-2 focus:ring-timeline-gold/50"
          >
            <option value="chronological">Chronological</option>
            <option value="importance">Importance</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-timeline-text/70">Filter:</label>
          <div className="flex space-x-1">
            {(['all', 'major', 'minor'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                  filterType === type
                    ? 'bg-timeline-gold text-timeline-bg'
                    : 'bg-timeline-gold/10 text-timeline-gold hover:bg-timeline-gold/20'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-timeline-text flex items-center">
          <svg className="w-5 h-5 mr-2 text-timeline-gold" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Timeline Events
        </h3>
        
        {filteredAndSortedEvents.length === 0 ? (
          <div className="text-center py-12 text-timeline-text/60">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p>No events found matching your criteria</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-timeline-gold via-timeline-gold/50 to-timeline-gold/20"></div>
            
            {/* Events */}
            <div className="space-y-6">
              {filteredAndSortedEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isSelected={selectedEvent?.id === event.id}
                  onSelect={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-timeline-bg border border-timeline-gold/30 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-timeline-gold">
                  {selectedEvent.title}
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-timeline-text/60 hover:text-timeline-text transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-timeline-text/80 leading-relaxed">
                  {selectedEvent.detailedDescription || selectedEvent.description}
                </p>
                
                {selectedEvent.characters && selectedEvent.characters.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-timeline-gold mb-3">Key Characters:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedEvent.characters.map((character, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-timeline-gold/5 rounded-lg">
                          {character.avatar && (
                            <img 
                              src={character.avatar} 
                              alt={character.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-timeline-text">{character.name}</div>
                            <div className="text-sm text-timeline-text/60">{character.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .expanded-age-detail {
          padding-top: 1rem;
        }
        
        .expanded-age-detail .relative:first-child {
          background: linear-gradient(
            135deg,
            rgba(206, 181, 72, 0.1) 0%,
            rgba(206, 181, 72, 0.05) 50%,
            transparent 100%
          );
          border-radius: 1rem;
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
};