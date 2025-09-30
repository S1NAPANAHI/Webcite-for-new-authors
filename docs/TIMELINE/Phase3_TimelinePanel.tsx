import React from 'react';
import { EventCard } from './EventCard';
import { useTimelineContext } from '../../../contexts/TimelineContext';
import { useEventsByAge } from '../hooks/useTimelineData';

export const TimelinePanel: React.FC = () => {
  const { selectedAge, isExpanded, setSelectedAge } = useTimelineContext();
  const { events, loading } = useEventsByAge(selectedAge?.id || 0);

  if (!selectedAge || !isExpanded) return null;

  const handleClose = () => setSelectedAge(null);

  return (
    <div className="fixed right-0 top-0 h-full w-full lg:w-2/3 bg-timeline-bg z-40 shadow-2xl timeline-panel-enter-active">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-timeline-border bg-timeline-card">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
               style={{ backgroundColor: selectedAge.colorcode }}>
            <span className="text-white font-bold text-2xl">{selectedAge.agenumber}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-timeline-text">{selectedAge.name}</h2>
            <p className="text-timeline-text opacity-70">{selectedAge.title}</p>
          </div>
        </div>
        <button onClick={handleClose} 
                className="p-2 hover:bg-timeline-border rounded-full transition-colors">
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
                  ageColor={selectedAge.colorcode} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl opacity-20 mb-4">📜</div>
              <h3 className="text-xl font-semibold text-timeline-text mb-2">No Events Yet</h3>
              <p className="text-timeline-text opacity-70">This age awaits its chronicles to be written.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};