import React, { useState, useRef, useEffect } from 'react';
import { RingDial } from './CosmicRings/RingDial';
import { LinearTimelinePanel } from './LinearTimeline/LinearTimelinePanel';
import { AgeDetailPanel } from './DetailPanels/AgeDetailPanel';
import { BreadcrumbCompass } from './Navigation/BreadcrumbCompass';
import { ModeToggle } from './Navigation/ModeToggle';
import { ViewModeSelector } from './Navigation/ViewModeSelector';
import { useTimelineContext } from '../../contexts/TimelineContext';
import { Age, TimelineEvent } from '../../lib/api-timeline';

export type ViewMode = 'cosmic' | 'hybrid' | 'linear';

export const EnhancedCosmicTimeline: React.FC = () => {
  const { isExpanded, selectedAge, setSelectedAge } = useTimelineContext();
  const [viewMode, setViewMode] = useState<ViewMode>('cosmic');
  const [selectedEvents, setSelectedEvents] = useState<TimelineEvent[]>([]);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to details when age is selected
  useEffect(() => {
    if (selectedAge && detailPanelRef.current) {
      detailPanelRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [selectedAge]);

  const handleAgeSelect = (age: Age) => {
    setSelectedAge(age);
    if (viewMode === 'cosmic') {
      setViewMode('hybrid');
    }
  };

  const handleBackToCosmic = () => {
    setSelectedAge(null);
    setViewMode('cosmic');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-timeline-bg via-timeline-bg-secondary to-timeline-bg-tertiary text-timeline-text relative overflow-hidden">
      
      {/* Enhanced Star Field Background */}
      <div className="star-field absolute inset-0 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="star absolute rounded-full bg-timeline-gold opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 0.5}px`,
              height: `${Math.random() * 3 + 0.5}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 3}s`,
              animation: 'twinkle infinite ease-in-out alternate'
            }}
          />
        ))}
      </div>

      {/* Floating Navigation Controls */}
      <div className="fixed top-6 right-6 z-50 flex flex-col space-y-4">
        <div className="flex space-x-3">
          <BreadcrumbCompass />
          <ModeToggle />
        </div>
        <ViewModeSelector 
          currentMode={viewMode} 
          onModeChange={setViewMode}
          disabled={!selectedAge && viewMode !== 'cosmic'}
        />
      </div>

      {/* Back Button */}
      {selectedAge && viewMode === 'hybrid' && (
        <button
          onClick={handleBackToCosmic}
          className="fixed top-6 left-6 z-50 px-4 py-2 bg-timeline-gold/20 backdrop-blur-sm border border-timeline-gold/30 rounded-lg text-timeline-gold hover:bg-timeline-gold/30 transition-all duration-300 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Cosmic View</span>
        </button>
      )}

      {/* Main Content Container */}
      <div className={`transition-all duration-1000 ease-in-out ${
        viewMode === 'cosmic' 
          ? 'flex items-center justify-center min-h-screen p-8' 
          : viewMode === 'hybrid'
          ? 'grid grid-cols-1 lg:grid-cols-5 min-h-screen'
          : 'p-8'
      }`}>
        
        {/* Cosmic Dial Section */}
        {(viewMode === 'cosmic' || viewMode === 'hybrid') && (
          <div className={`
            flex flex-col items-center justify-center
            ${viewMode === 'hybrid' ? 'lg:col-span-2 p-8 border-r border-timeline-gold/20' : ''}
            ${viewMode === 'cosmic' ? 'transform-gpu' : 'transform-gpu scale-75 lg:scale-90'}
          `}>
            <div className="text-center mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-timeline-gold via-timeline-gold-light to-timeline-gold bg-clip-text text-transparent">
                Cosmic Timeline
              </h1>
              <p className="text-timeline-text/70 text-lg">
                Navigate through the ages of the Zoroasterverse
              </p>
            </div>
            
            <div className="relative">
              <RingDial onAgeSelect={handleAgeSelect} />
              
              {/* Cosmic Pulse Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="cosmic-pulse-ring"></div>
              </div>
            </div>

            {/* Age Selection Hint */}
            {viewMode === 'cosmic' && !selectedAge && (
              <div className="mt-8 text-center">
                <p className="text-timeline-text/60 animate-pulse">
                  Click on any age to explore its timeline
                </p>
              </div>
            )}
          </div>
        )}

        {/* Detail Panel Section */}
        {selectedAge && viewMode === 'hybrid' && (
          <div ref={detailPanelRef} className="lg:col-span-3 overflow-y-auto">
            <AgeDetailPanel 
              age={selectedAge}
              onEventSelect={setSelectedEvents}
              className="p-8"
            />
          </div>
        )}

        {/* Full Linear Timeline */}
        {viewMode === 'linear' && (
          <div className="w-full">
            <LinearTimelinePanel 
              selectedAge={selectedAge}
              onAgeSelect={handleAgeSelect}
              showAllAges={true}
            />
          </div>
        )}
      </div>

      {/* Floating Age Info Card */}
      {selectedAge && viewMode === 'cosmic' && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-timeline-bg/90 backdrop-blur-xl border border-timeline-gold/30 rounded-xl p-6 max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-timeline-gold mb-2">
              {selectedAge.title}
            </h3>
            <p className="text-timeline-text/80 mb-4">
              {selectedAge.description}
            </p>
            <button
              onClick={() => setViewMode('hybrid')}
              className="w-full px-4 py-2 bg-timeline-gold text-timeline-bg rounded-lg hover:bg-timeline-gold-light transition-colors duration-300 font-medium"
            >
              Explore Timeline →
            </button>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        
        .cosmic-pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 400px;
          height: 400px;
          border: 2px solid var(--timeline-gold);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          animation: pulse-ring 4s infinite ease-out;
        }
        
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0;
          }
        }
        
        .star-field {
          background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
        }
      `}</style>
    </div>
  );
};