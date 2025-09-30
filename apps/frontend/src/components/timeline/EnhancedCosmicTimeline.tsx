import React, { useState, useMemo } from 'react';
import { CosmicRingsDial } from './CosmicRings/CosmicRingsDial';
import { AgeDetailPanel } from './DetailPanels/AgeDetailPanel';
import { LinearTimelinePanel } from './LinearTimeline/LinearTimelinePanel';
import { BreadcrumbCompass } from './Navigation/BreadcrumbCompass';
import { ModeToggle } from './Navigation/ModeToggle';
import { useTimelineContext } from '../../contexts/TimelineContext';
import { useTimelineData } from './hooks/useTimelineData';
import { Age, TimelineEvent } from '../../lib/api-timeline';
import './enhanced-cosmic-timeline.css';

export type ViewMode = 'hybrid' | 'linear';

export const EnhancedCosmicTimeline: React.FC = () => {
  const { selectedAge, setSelectedAge } = useTimelineContext();
  const { ages, loading, error } = useTimelineData();
  const [viewMode, setViewMode] = useState<ViewMode>('hybrid');
  const [selectedEvents, setSelectedEvents] = useState<TimelineEvent[]>([]);
  
  const handleAgeSelect = (age: Age) => {
    setSelectedAge(age);
  };

  const handleViewToggle = () => {
    setViewMode(viewMode === 'hybrid' ? 'linear' : 'hybrid');
  };

  // Format year range for display
  const formatYearRange = (age: Age): string => {
    if (!age.end_year) return `${age.start_year || '∞'}–∞`;
    return `${age.start_year || '∞'}–${age.end_year}`;
  };

  if (loading) {
    return (
      <div className="enhanced-cosmic-timeline">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-timeline-gold"></div>
            <p className="mt-4 text-timeline-text/70">Loading cosmic timeline...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="enhanced-cosmic-timeline">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error loading timeline: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-timeline-gold/20 border border-timeline-gold/30 rounded-lg text-timeline-gold hover:bg-timeline-gold/30 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-cosmic-timeline">
      {/* Enhanced Star Field Background */}
      <div className="star-field absolute inset-0 pointer-events-none">
        {Array.from({ length: 150 }).map((_, i) => (
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
        
        {/* View Toggle Button */}
        <button
          onClick={handleViewToggle}
          className="px-4 py-2 bg-timeline-gold/20 backdrop-blur-sm border border-timeline-gold/30 rounded-lg text-timeline-gold hover:bg-timeline-gold/30 transition-all duration-300 flex items-center space-x-2"
          title={`Switch to ${viewMode === 'hybrid' ? 'linear' : 'hybrid'} view`}
        >
          {viewMode === 'hybrid' ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Linear View</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="hidden sm:inline">Hybrid View</span>
            </>
          )}
        </button>
      </div>

      <div className="timeline-layout">
        {/* Left side: Cosmic Rings Dial */}
        <div className="timeline-dial-section">
          <div className="dial-container">
            <CosmicRingsDial
              ages={ages}
              selectedAge={selectedAge}
              onAgeSelect={handleAgeSelect}
              className="main-cosmic-dial"
            />
          </div>
          
          {/* Age info panel */}
          <div className="age-info-panel">
            <h2 className="age-title">{selectedAge?.name || selectedAge?.title || 'Select an Age'}</h2>
            <p className="age-years">
              Year range: {selectedAge ? formatYearRange(selectedAge) : '—'}
            </p>
            <p className="age-description">
              {selectedAge?.description || 'Click a ring to explore the cosmic ages.'}
            </p>
            {/* Add events count when we have event data */}
            <div className="age-events-count">
              <span className="events-badge">
                {selectedAge ? 'Ring Selected' : 'No Selection'}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Timeline Content */}
        <div className="timeline-content-section">
          {viewMode === 'hybrid' ? (
            selectedAge ? (
              <AgeDetailPanel 
                age={selectedAge}
                onEventSelect={setSelectedEvents}
                className="p-8"
              />
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center max-w-md">
                  <div className="mb-8">
                    {/* Welcome Illustration - Concentric Rings */}
                    <div className="w-32 h-32 mx-auto mb-6 relative">
                      {/* Simulate concentric rings */}
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="absolute border-4 rounded-full"
                          style={{
                            width: `${120 - (index * 20)}px`,
                            height: `${120 - (index * 20)}px`,
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            borderColor: `rgba(212, 175, 55, ${0.6 - (index * 0.1)})`,
                            background: `radial-gradient(circle at 30% 30%, 
                              hsla(45, 60%, ${55 + (index * 5)}%, ${0.3 - (index * 0.05)}), 
                              hsla(45, 50%, ${45 + (index * 5)}%, ${0.2 - (index * 0.05)}))`,
                            boxShadow: `0 0 ${8 - index}px rgba(212, 175, 55, ${0.4 - (index * 0.1)})`,
                            animation: `ringPulse ${4 + index}s ease-in-out infinite alternate`,
                            animationDelay: `${index * 0.5}s`
                          }}
                        />
                      ))}
                      
                      {/* Center icon */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <svg className="w-12 h-12 text-timeline-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-timeline-gold mb-4">
                    Welcome to the Zoroasterverse Timeline
                  </h2>
                  <p className="text-timeline-text/80 leading-relaxed mb-6">
                    Begin your journey through the cosmic ages by selecting a **concentric ring** from the dial on the left. 
                    Each ring has stone-like textures with metallic rims and glassy highlights, representing a unique era in the Zoroasterverse.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-timeline-text/60">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Explore cosmic events and characters</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-timeline-text/60">
                      <div className="flex space-x-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div 
                            key={i}
                            className="w-3 h-3 rounded-full"
                            style={{
                              background: `radial-gradient(circle at 30% 30%, 
                                hsl(45, 60%, ${55 + (i * 10)}%), 
                                hsl(45, 40%, ${35 + (i * 10)}%))`,
                              opacity: 0.7 - (i * 0.1),
                              border: '1px solid rgba(212, 175, 55, 0.3)'
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm">True concentric rings with stone/metal/glass materials</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="w-full h-full">
              <LinearTimelinePanel 
                selectedAge={selectedAge}
                onAgeSelect={handleAgeSelect}
                showAllAges={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating Age Info Card */}
      {selectedAge && (
        <div className="fixed bottom-8 left-8 z-40 max-w-sm">
          <div className="bg-timeline-bg/90 backdrop-blur-xl border border-timeline-gold/30 rounded-xl p-4 shadow-2xl">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded-full flex-shrink-0 shadow-md border"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, hsl(45, 60%, 55%), hsl(45, 40%, 35%))',
                    borderColor: 'rgba(212, 175, 55, 0.5)'
                  }}
                ></div>
                <h3 className="text-lg font-bold text-timeline-gold">
                  {selectedAge.name || selectedAge.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAge(null)}
                className="text-timeline-text/60 hover:text-timeline-text transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-timeline-text/80 text-sm leading-relaxed">
              {selectedAge.description?.substring(0, 100)}...
            </p>
            <div className="mt-2 text-xs text-timeline-text/60">
              {formatYearRange(selectedAge)}
            </div>
            <div className="mt-2 text-xs text-timeline-gold/70">
              Concentric Ring • Stone & Metal & Glass
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes ringPulse {
          0% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
        }
        
        .star-field {
          background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
        }
      `}</style>
    </div>
  );
};