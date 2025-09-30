import React from 'react';
import { useTimelineContext } from '../../../contexts/TimelineContext';

export const BreadcrumbCompass: React.FC = () => {
  const { selectedAge, setSelectedAge } = useTimelineContext();

  return (
    <nav className="bg-timeline-card rounded-lg px-4 py-2 border border-timeline-border shadow-lg">
      <div className="flex items-center space-x-2 text-sm">
        {/* Home */}
        <button onClick={() => setSelectedAge(null)} 
                className="flex items-center text-timeline-text hover:text-timeline-gold transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Cosmic Timeline
        </button>

        {/* Separator & Current Age */}
        {selectedAge && (
          <>
            <span className="text-timeline-text opacity-50">›</span>
            <span className="text-timeline-gold font-medium">{selectedAge.name}</span>
          </>
        )}
      </div>
    </nav>
  );
};