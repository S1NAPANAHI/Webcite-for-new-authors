import React, { useState, useMemo } from 'react';
import { EnhancedCosmicRingsDial } from './CosmicRings/EnhancedCosmicRingsDial';
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
        {/* Left side: Enhanced Cosmic Rings Dial */}
        <div className="enhanced-timeline-dial-section">
          <div className="enhanced-dial-container">
            <EnhancedCosmicRingsDial
              ages={ages}
              selectedAge={selectedAge}
              onAgeSelect={handleAgeSelect}
              className="main-enhanced-cosmic-dial"
            />
          </div>
          
          {/* Enhanced Age info panel with stone/metal theme */}
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
                {selectedAge?.name || selectedAge?.title || 'Select a Cosmic Age'}
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
                   'Navigate through the cosmic ages by selecting the textured rings on the dial. Each ring represents a distinct era in the Zoroasterverse timeline, with stone-like surfaces and metallic accents that rotate slowly like an ancient astronomical instrument.'}
                </p>
              </div>
              
              <div className="age-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Ring Material:</span>
                  <span className="metadata-value">
                    {selectedAge ? 
                      `${['Granite', 'Marble', 'Sandstone', 'Slate', 'Limestone', 'Basalt', 'Quartzite', 'Schist', 'Obsidian'][selectedAge.age_number - 1] || 'Stone'} • ${['Gold', 'Bronze', 'Copper', 'Brass', 'Silver', 'Iron', 'Pewter', 'Platinum', 'Titanium'][selectedAge.age_number - 1] || 'Metal'}` : 
                      'Stone & Metal'
                    }
                  </span>
                </div>
                
                <div className="metadata-item">
                  <span className="metadata-label">Rotation:</span>
                  <span className="metadata-value">
                    {selectedAge ? 
                      `${[8, 12, 10, 15, 18, 22, 25, 30, 35][selectedAge.age_number - 1] || 20}s • ${selectedAge.age_number % 2 === 1 ? 'Clockwise' : 'Counter-clockwise'}` : 
                      'Celestial Motion'
                    }
                  </span>
                </div>
              </div>
              
              <div className="enhanced-events-badge">
                <div className="badge-content">
                  {selectedAge ? (
                    <>
                      <div className="badge-icon">⚡</div>
                      <span className="badge-text">Cosmic Ring Selected</span>
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
                    {/* Enhanced concentric rings preview */}
                    <div className="preview-rings-container">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="preview-ring"
                          style={{
                            width: `${140 - (index * 25)}px`,
                            height: `${140 - (index * 25)}px`,
                            borderColor: `rgba(212, 175, 55, ${0.8 - (index * 0.15)})`,
                            background: `conic-gradient(from ${index * 45}deg, 
                              rgba(212, 175, 55, ${0.1 - (index * 0.02)}), 
                              rgba(205, 127, 50, ${0.08 - (index * 0.015)}), 
                              rgba(184, 134, 11, ${0.06 - (index * 0.01)}), 
                              rgba(212, 175, 55, ${0.1 - (index * 0.02)}))`,
                            animationDelay: `${index * 0.5}s`,
                            animationDuration: `${6 + index * 2}s`
                          }}
                        />
                      ))}
                      
                      {/* Center cosmic symbol */}
                      <div className="preview-center-symbol">
                        <svg className="w-16 h-16 text-timeline-gold" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                          <path d="M19 15L20.5 19L24 20.5L20.5 22L19 26L17.5 22L14 20.5L17.5 19L19 15Z" opacity="0.7" />
                          <path d="M6.5 2L7.5 5.5L11 6.5L7.5 7.5L6.5 11L5.5 7.5L2 6.5L5.5 5.5L6.5 2Z" opacity="0.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="welcome-text">
                    <h2 className="welcome-title">
                      Journey Through the Zoroasterverse
                    </h2>
                    <p className="welcome-description">
                      Explore the cosmic ages through an ancient astronomical dial enhanced with 
                      **stone textures** and **metallic finishes**. Each ring rotates slowly like a 
                      celestial instrument, revealing the deep history of the Zoroasterverse.
                    </p>
                    
                    <div className="welcome-features">
                      <div className="feature-item">
                        <div className="feature-icon">🏛️</div>
                        <div className="feature-text">
                          <span className="feature-title">Stone Crafted Rings</span>
                          <span className="feature-desc">Granite, marble, and sandstone textures</span>
                        </div>
                      </div>
                      
                      <div className="feature-item">
                        <div className="feature-icon">⚙️</div>
                        <div className="feature-text">
                          <span className="feature-title">Metallic Accents</span>
                          <span className="feature-desc">Bronze, copper, and brass finishes</span>
                        </div>
                      </div>
                      
                      <div className="feature-item">
                        <div className="feature-icon">🌟</div>
                        <div className="feature-text">
                          <span className="feature-title">Celestial Motion</span>
                          <span className="feature-desc">Slow rotation like an astrolabe</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="welcome-interaction-hint">
                      <div className="hint-icon">👆</div>
                      <span>Click any ring to begin your cosmic journey</span>
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
                  className="age-ring-preview"
                  style={{
                    background: `conic-gradient(from 0deg, 
                      ${selectedAge.age_number <= 3 ? '#d4af37' : 
                        selectedAge.age_number <= 6 ? '#cd7f32' : '#9370db'}, 
                      ${selectedAge.age_number <= 3 ? '#b8860b' : 
                        selectedAge.age_number <= 6 ? '#a0522d' : '#708090'})`
                  }}
                />
                <span className="age-number-small">{selectedAge.age_number}</span>
              </div>
              
              <div className="card-title-section">
                <h3 className="card-age-title">
                  {selectedAge.name || selectedAge.title}
                </h3>
                <span className="card-age-subtitle">
                  {['Granite•Gold', 'Marble•Bronze', 'Sandstone•Copper', 'Slate•Brass', 'Limestone•Silver', 'Basalt•Iron', 'Quartzite•Pewter', 'Schist•Platinum', 'Obsidian•Titanium'][selectedAge.age_number - 1] || 'Stone•Metal'}
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
                  <span className="metadata-icon">🔄</span>
                  <span className="metadata-text">
                    {[8, 12, 10, 15, 18, 22, 25, 30, 35][selectedAge.age_number - 1]}s rotation
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
        
        @keyframes enhancedRingPreview {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.02); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
        }
        
        .enhanced-star-field {
          background: radial-gradient(ellipse at center, 
            rgba(26, 31, 46, 0.8) 0%, 
            rgba(15, 20, 31, 0.9) 40%,
            rgba(8, 9, 12, 0.95) 70%,
            rgba(0, 0, 0, 1) 100%);
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
        
        @keyframes nebulaDrift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          33% { transform: translate(-20px, -15px) scale(1.1); opacity: 0.8; }
          66% { transform: translate(15px, -10px) scale(0.9); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};