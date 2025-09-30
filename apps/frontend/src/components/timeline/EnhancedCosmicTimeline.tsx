import React, { useState, useMemo } from 'react';
import { OrbitalTimelineDial } from './CosmicRings/OrbitalTimelineDial';
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
      <div className="enhanced-cosmic-timeline" data-loading="true">
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
      <div className="enhanced-cosmic-timeline" data-error="true">
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
      {/* Enhanced Star Field Background with Cosmic Drift */}
      <div className="enhanced-star-field absolute inset-0 pointer-events-none">
        {Array.from({ length: 200 }).map((_, i) => {
          const size = Math.random() * 2 + 0.5;
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const opacity = Math.random() * 0.8 + 0.2;
          const twinkleDelay = Math.random() * 8;
          const twinkleDuration = Math.random() * 4 + 2;
          
          return (
            <div
              key={i}
              className="enhanced-star absolute rounded-full bg-timeline-gold"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: opacity,
                animationDelay: `${twinkleDelay}s`,
                animationDuration: `${twinkleDuration}s`,
                animation: 'enhancedTwinkle infinite ease-in-out alternate'
              }}
            />
          );
        })}
        
        {/* Additional cosmic nebula effects */}
        <div className="cosmic-nebula-1"></div>
        <div className="cosmic-nebula-2"></div>
        <div className="cosmic-nebula-3"></div>
      </div>

      {/* Floating Navigation Controls */}
      <div className="fixed top-6 right-6 z-50 flex flex-col space-y-4">
        <div className="flex space-x-3">
          <BreadcrumbCompass />
          <ModeToggle />
        </div>
        
        {/* Enhanced View Toggle Button */}
        <button
          onClick={handleViewToggle}
          className="px-4 py-2 bg-timeline-gold/20 backdrop-blur-sm border border-timeline-gold/30 rounded-lg text-timeline-gold hover:bg-timeline-gold/30 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
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

      <div className="enhanced-timeline-layout">
        {/* Left side: NEW Orbital Timeline Dial */}
        <div className="enhanced-timeline-dial-section">
          <div className="enhanced-dial-container">
            <OrbitalTimelineDial
              ages={ages}
              selectedAge={selectedAge}
              onAgeSelect={handleAgeSelect}
              className="main-orbital-cosmic-dial"
            />
          </div>
          
          {/* Enhanced Age info panel with orbital theme */}
          <div className="enhanced-age-info-panel">
            <div className="info-panel-header">
              <div className="selected-age-indicator">
                {selectedAge && (
                  <div 
                    className="age-color-indicator"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, 
                        ${selectedAge.age_number <= 3 ? '#d4af37' : 
                          selectedAge.age_number <= 6 ? '#cd7f32' : '#9370db'}, 
                        ${selectedAge.age_number <= 3 ? '#b8860b' : 
                          selectedAge.age_number <= 6 ? '#a0522d' : '#708090'})`
                    }}
                  />
                )}
              </div>
              <h2 className="enhanced-age-title">
                {selectedAge?.name || selectedAge?.title || 'Select a Cosmic Planet'}
              </h2>
            </div>
            
            <div className="enhanced-age-details">
              <div className="age-year-range">
                <span className="range-label">Temporal Span:</span>
                <span className="range-value">
                  {selectedAge ? formatYearRange(selectedAge) : '—'}
                </span>
              </div>
              
              <div className="age-description-container">
                <p className="enhanced-age-description">
                  {selectedAge?.description || 
                   'Navigate through the cosmic ages by selecting the orbiting planets around the central sun. Each planet represents a distinct era in the Zoroasterverse timeline, orbiting at different speeds and distances like a celestial orrery.'}
                </p>
              </div>
              
              <div className="age-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Planet Type:</span>
                  <span className="metadata-value">
                    {selectedAge ? 
                      `${['Golden', 'Bronze', 'Crimson', 'Sapphire', 'Amethyst', 'Emerald', 'Ruby', 'Turquoise', 'Amber'][selectedAge.age_number - 1] || 'Cosmic'} Planet` : 
                      'Celestial Body'
                    }
                  </span>
                </div>
                
                <div className="metadata-item">
                  <span className="metadata-label">Orbital Motion:</span>
                  <span className="metadata-value">
                    {selectedAge ? 
                      `${[8, 12, 10, 15, 18, 22, 25, 30, 35][selectedAge.age_number - 1] || 20}s orbit • Distance: ${80 + ((selectedAge.age_number - 1) * 35)}px` : 
                      'Celestial Dance'
                    }
                  </span>
                </div>
              </div>
              
              <div className="enhanced-events-badge">
                <div className="badge-content">
                  {selectedAge ? (
                    <>
                      <div className="badge-icon">🪐</div>
                      <span className="badge-text">Cosmic Planet Selected</span>
                    </>
                  ) : (
                    <>
                      <div className="badge-icon">🌌</div>
                      <span className="badge-text">Awaiting Selection</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Enhanced Timeline Content */}
        <div className="enhanced-timeline-content-section">
          {viewMode === 'hybrid' ? (
            selectedAge ? (
              <AgeDetailPanel 
                age={selectedAge}
                onEventSelect={setSelectedEvents}
                className="enhanced-age-detail-panel p-8"
              />
            ) : (
              <div className="enhanced-welcome-section">
                <div className="welcome-content">
                  <div className="welcome-illustration">
                    {/* Enhanced orbital preview */}
                    <div className="preview-orbital-container">
                      <div className="preview-sun"></div>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="preview-orbit"
                          style={{
                            width: `${80 + (index * 30)}px`,
                            height: `${80 + (index * 30)}px`,
                            animationDelay: `${index * 0.5}s`,
                            animationDuration: `${8 + index * 2}s`
                          }}
                        >
                          <div 
                            className="preview-planet"
                            style={{
                              background: ['#FFD700', '#CD7F32', '#4169E1', '#9370DB'][index]
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="welcome-text">
                    <h2 className="welcome-title">
                      Journey Through the Zoroasterverse
                    </h2>
                    <p className="welcome-description">
                      Explore the cosmic ages through an **orbital orrery** with planets orbiting 
                      around a central golden sun. Each planet represents a distinct era, 
                      moving at different speeds and distances like a living astronomical instrument.
                    </p>
                    
                    <div className="welcome-features">
                      <div className="feature-item">
                        <div className="feature-icon">🪐</div>
                        <div className="feature-text">
                          <span className="feature-title">Orbiting Planets</span>
                          <span className="feature-desc">9 cosmic bodies in golden orbits</span>
                        </div>
                      </div>
                      
                      <div className="feature-item">
                        <div className="feature-icon">☀️</div>
                        <div className="feature-text">
                          <span className="feature-title">Central Sun</span>
                          <span className="feature-desc">Pulsing golden core with energy flares</span>
                        </div>
                      </div>
                      
                      <div className="feature-item">
                        <div className="feature-icon">🌌</div>
                        <div className="feature-text">
                          <span className="feature-title">Celestial Motion</span>
                          <span className="feature-desc">Continuous orbital animation</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="welcome-interaction-hint">
                      <div className="hint-icon">👆</div>
                      <span>Click any orbiting planet to begin your cosmic journey</span>
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

      {/* Enhanced Floating Age Info Card */}
      {selectedAge && (
        <div className="enhanced-floating-age-card">
          <div className="floating-card-content">
            <div className="card-header">
              <div className="card-age-indicator">
                <div 
                  className="age-planet-preview"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, 
                      ${['#FFD700', '#CD7F32', '#FF6347', '#4169E1', '#9370DB', '#32CD32', '#FF1493', '#20B2AA', '#FF8C00'][selectedAge.age_number - 1] || '#FFD700'}, 
                      ${['#B8860B', '#A0522D', '#DC143C', '#191970', '#4B0082', '#228B22', '#C71585', '#008B8B', '#FF7F00'][selectedAge.age_number - 1] || '#B8860B'})`
                  }}
                />
                <span className="age-number-small">{selectedAge.age_number}</span>
              </div>
              
              <div className="card-title-section">
                <h3 className="card-age-title">
                  {selectedAge.name || selectedAge.title}
                </h3>
                <span className="card-age-subtitle">
                  {['Golden', 'Bronze', 'Crimson', 'Sapphire', 'Amethyst', 'Emerald', 'Ruby', 'Turquoise', 'Amber'][selectedAge.age_number - 1] || 'Cosmic'} Planet
                </span>
              </div>
              
              <button
                onClick={() => setSelectedAge(null)}
                className="card-close-button"
                aria-label="Close age details"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="card-body">
              <p className="card-description">
                {selectedAge.description?.substring(0, 120)}...
              </p>
              
              <div className="card-metadata">
                <div className="metadata-row">
                  <span className="metadata-icon">⏰</span>
                  <span className="metadata-text">{formatYearRange(selectedAge)}</span>
                </div>
                
                <div className="metadata-row">
                  <span className="metadata-icon">🚀</span>
                  <span className="metadata-text">
                    Orbit {80 + ((selectedAge.age_number - 1) * 35)}px • {(0.2 + ((selectedAge.age_number - 1) * 0.1)).toFixed(1)}x speed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes enhancedTwinkle {
          0% { opacity: 0.2; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.1) rotate(180deg); }
          100% { opacity: 0.4; transform: scale(0.9) rotate(360deg); }
        }
        
        @keyframes previewOrbit {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .enhanced-star-field {
          background: radial-gradient(ellipse at center, 
            rgba(26, 31, 46, 0.8) 0%, 
            rgba(15, 20, 31, 0.9) 40%,
            rgba(8, 9, 12, 0.95) 70%,
            rgba(0, 0, 0, 1) 100%);
        }
        
        .preview-orbital-container {
          position: relative;
          width: 160px;
          height: 160px;
          margin: 0 auto;
        }
        
        .preview-sun {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle, #FFD700, #FFA500);
          box-shadow: 0 0 10px #FFD700;
          animation: sunPulse 3s ease-in-out infinite;
        }
        
        .preview-orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 50%;
          animation: previewOrbit linear infinite;
        }
        
        .preview-planet {
          position: absolute;
          top: -4px;
          left: calc(50% - 4px);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 4px currentColor;
        }
        
        .cosmic-nebula-1 {
          position: absolute;
          top: 10%;
          left: 20%;
          width: 300px;
          height: 200px;
          background: radial-gradient(ellipse, 
            rgba(138, 43, 226, 0.1) 0%, 
            rgba(72, 61, 139, 0.05) 50%, 
            transparent 100%);
          border-radius: 50%;
          animation: nebulaDrift 60s ease-in-out infinite;
        }
        
        .cosmic-nebula-2 {
          position: absolute;
          bottom: 20%;
          right: 15%;
          width: 250px;
          height: 180px;
          background: radial-gradient(ellipse, 
            rgba(220, 20, 60, 0.08) 0%, 
            rgba(139, 69, 19, 0.04) 50%, 
            transparent 100%);
          border-radius: 50%;
          animation: nebulaDrift 80s ease-in-out infinite reverse;
        }
        
        .cosmic-nebula-3 {
          position: absolute;
          top: 60%;
          left: 70%;
          width: 200px;
          height: 160px;
          background: radial-gradient(ellipse, 
            rgba(0, 191, 255, 0.06) 0%, 
            rgba(30, 144, 255, 0.03) 50%, 
            transparent 100%);
          border-radius: 50%;
          animation: nebulaDrift 100s ease-in-out infinite;
        }
        
        .age-planet-preview {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
        }
        
        @keyframes nebulaDrift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          33% { transform: translate(-20px, -15px) scale(1.1); opacity: 0.8; }
          66% { transform: translate(15px, -10px) scale(0.9); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};