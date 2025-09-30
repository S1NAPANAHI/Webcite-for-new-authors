import React from 'react';
import { RingDial } from './CosmicRings/RingDial';
import { TimelinePanel } from './LinearTimeline/TimelinePanel';
import { BreadcrumbCompass } from './Navigation/BreadcrumbCompass';
import { ModeToggle } from './Navigation/ModeToggle';
import { useTimelineContext } from '../../contexts/TimelineContext';

export const CosmicTimeline: React.FC = () => {
  const { isExpanded } = useTimelineContext();
  
  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isExpanded ? 'grid grid-cols-1 lg:grid-cols-3' : 'flex flex-col items-center justify-center'
    }`}>
      {/* Star Field Background */}
      <div className="star-field">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Navigation Controls */}
      <div className="fixed top-4 right-4 z-50 flex space-x-4">
        <BreadcrumbCompass />
        <ModeToggle />
      </div>
      
      {/* Main Content Area */}
      <div className={`flex items-center justify-center p-8 ${
        isExpanded ? 'lg:col-span-1' : 'min-h-screen'
      }`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8 text-timeline-gold">
            Cosmic Timeline
          </h1>
          <RingDial />
        </div>
      </div>
      
      {/* Expandable Timeline Panel */}
      {isExpanded && (
        <div className="lg:col-span-2">
            <TimelinePanel />
        </div>
      )}
    </div>
  );
};
