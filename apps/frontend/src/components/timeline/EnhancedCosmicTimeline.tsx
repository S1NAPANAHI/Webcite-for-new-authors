import React, { useState, useRef, useEffect } from 'react';
import { StackedDiskDial } from './CosmicRings/StackedDiskDial';
import { AgeDetailPanel } from './DetailPanels/AgeDetailPanel';
import { LinearTimelinePanel } from './LinearTimeline/LinearTimelinePanel';
import { BreadcrumbCompass } from './Navigation/BreadcrumbCompass';
import { ModeToggle } from './Navigation/ModeToggle';
import { useTimelineContext } from '../../contexts/TimelineContext';
import { Age, TimelineEvent } from '../../lib/api-timeline';

export type ViewMode = 'hybrid' | 'linear';

export const EnhancedCosmicTimeline: React.FC = () => {
  const { selectedAge, setSelectedAge } = useTimelineContext();
  const [viewMode, setViewMode] = useState<ViewMode>('hybrid');
  const [selectedEvents, setSelectedEvents] = useState<TimelineEvent[]>([]);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  
  const handleAgeSelect = (age: Age) => {
    setSelectedAge(age);
  };

  const handleViewToggle = () => {
    setViewMode(viewMode === 'hybrid' ? 'linear' : 'hybrid');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-timeline-bg via-timeline-bg-secondary to-timeline-bg-tertiary text-timeline-text relative overflow-hidden">
      
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

      {/* Main Content Container - Always Split Layout */}
      <div className="flex min-h-screen">
        
        {/* Left Side - Stacked Disk Dial (Fixed) */}
        <div className="w-full lg:w-2/5 xl:w-1/3 flex flex-col items-center justify-center p-8 border-r border-timeline-gold/20 bg-timeline-bg/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-timeline-gold via-timeline-gold-light to-timeline-gold bg-clip-text text-transparent">
              Cosmic Timeline
            </h1>
            <p className="text-timeline-text/70 text-sm lg:text-base">
              Navigate through the ages of the Zoroasterverse
            </p>
          </div>
          
          {/* Stacked Disk Dial Container - No Square Background */}
          <div className="relative flex items-center justify-center">
            <StackedDiskDial 
              onAgeSelect={handleAgeSelect} 
              selectedAgeId={selectedAge?.id || null}
              className="scale-75 sm:scale-85 lg:scale-100"
            />
          </div>

          {/* Age Selection Hint */}
          {!selectedAge && (
            <div className="mt-8 text-center max-w-sm">
              <p className="text-timeline-text/60 animate-pulse text-sm mb-3">
                Click on any stacked disk layer to explore its timeline
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-timeline-text/40">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-timeline-gold/60 rounded-full shadow-lg"></div>
                  <span>3D Layered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-timeline-gold/40 rounded-full shadow-md"></div>
                  <span>Stone Texture</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-timeline-gold/30 rounded-full shadow-sm"></div>
                  <span>Glass Effects</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Timeline Content (Always Visible) */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'hybrid' ? (
            selectedAge ? (
              <div ref={detailPanelRef}>
                <AgeDetailPanel 
                  age={selectedAge}
                  onEventSelect={setSelectedEvents}
                  className="p-8"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center max-w-md">
                  <div className="mb-8">
                    {/* Welcome Illustration - 3D Stacked Circles */}
                    <div className="w-32 h-32 mx-auto mb-6 relative perspective-1000">
                      {/* Simulate stacked disks */}
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="absolute border-4 border-timeline-gold/30 rounded-full"
                          style={{
                            width: `${120 - (index * 20)}px`,
                            height: `${120 - (index * 20)}px`,
                            left: '50%',
                            top: `${50 + (index * 4)}%`,
                            transform: 'translate(-50%, -50%)',
                            background: `radial-gradient(circle at 30% 30%, 
                              hsl(45, 60%, ${55 + (index * 5)}%) 0%, 
                              hsl(45, 50%, ${45 + (index * 5)}%) 50%, 
                              hsl(45, 40%, ${35 + (index * 5)}%) 100%)`,
                            opacity: 0.7 - (index * 0.1),
                            boxShadow: `0 ${2 + index}px ${8 - index}px rgba(0, 0, 0, 0.4)`,
                            animation: `float ${4 + index}s ease-in-out infinite alternate`,
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
                    Begin your journey through the cosmic ages by selecting a **3D stacked disk layer** from the dial on the left. 
                    Each disk has stone-like textures with glassy effects and represents a unique era in the Zoroasterverse.
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
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Filter and sort timeline events</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-timeline-text/60">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Discover detailed event information</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-timeline-text/60">
                      <div className="flex space-x-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div 
                            key={i}
                            className="w-3 h-3 rounded-full shadow-sm"
                            style={{
                              background: `radial-gradient(circle at 30% 30%, 
                                hsl(45, 60%, ${55 + (i * 10)}%), 
                                hsl(45, 40%, ${35 + (i * 10)}%))`,
                              opacity: 0.7 - (i * 0.1)
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm">True 3D stacked disk layers</span>
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

      {/* Floating Age Info Card - Enhanced for 3D Disk Design */}
      {selectedAge && (
        <div className="fixed bottom-8 left-8 z-40 max-w-sm">
          <div className="bg-timeline-bg/90 backdrop-blur-xl border border-timeline-gold/30 rounded-xl p-4 shadow-2xl">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded-full flex-shrink-0 shadow-md"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, hsl(45, 60%, 55%), hsl(45, 40%, 35%))',
                    opacity: 0.8
                  }}
                ></div>
                <h3 className="text-lg font-bold text-timeline-gold">
                  {selectedAge.title}
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
            {selectedAge.dateRange && (
              <div className="mt-2 text-xs text-timeline-text/60">
                {selectedAge.dateRange}
              </div>
            )}
            <div className="mt-2 text-xs text-timeline-gold/70">
              3D Stacked Disk • Stone & Glass Texture
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
        
        @keyframes float {
          0% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          100% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
        }
        
        .star-field {
          background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        /* Remove any square backgrounds */
        .stacked-disk-container {
          background: none !important;
          border: none !important;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .stacked-disk-container {
            transform: scale(0.9);
          }
        }
        
        @media (max-width: 768px) {
          .stacked-disk-container {
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
};