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
    <div className="enhanced-cosmic-timeline clean-design">
      {/* Clean, minimal background */}
      <div className="timeline-background" />

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

      <div className="enhanced-timeline-layout clean">
        {/* Full-width Orbital Timeline */}
        <div className="orbital-timeline-section">
          <OrbitalTimelineDial
            ages={ages}
            selectedAge={selectedAge}
            onAgeSelect={handleAgeSelect}
            className="half-circle-orbital-dial"
          />
        </div>

        {/* Linear view option */}
        {viewMode === 'linear' && (
          <div className="linear-timeline-overlay">
            <LinearTimelinePanel 
              selectedAge={selectedAge}
              onAgeSelect={handleAgeSelect}
              showAllAges={true}
            />
          </div>
        )}
      </div>

      {/* Welcome message when no age is selected */}
      {!selectedAge && viewMode === 'hybrid' && (
        <div className="welcome-overlay">
          <div className="welcome-content">
            <h2 className="welcome-title">Zoroasterverse Timeline</h2>
            <p className="welcome-description">
              Explore the cosmic ages through an orbital design. Click on any golden planet orbiting the left half-circle to discover its era and events.
            </p>
            <div className="welcome-features">
              <div className="feature-item">
                <span className="feature-icon">🪐</span>
                <span>Nine cosmic ages as orbiting planets</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">☀️</span>
                <span>Central golden sun</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📜</span>
                <span>Age names rotate along orbital paths</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Custom Styles for Clean Design */}
      <style jsx>{`
        .enhanced-cosmic-timeline.clean-design {
          background: linear-gradient(
            135deg,
            rgba(15, 15, 20, 1) 0%,
            rgba(25, 25, 30, 1) 50%,
            rgba(20, 20, 25, 1) 100%
          );
          min-height: 100vh;
          position: relative;
        }
        
        .timeline-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at center,
            rgba(206, 181, 72, 0.03) 0%,
            rgba(206, 181, 72, 0.01) 40%,
            transparent 70%
          );
          pointer-events: none;
        }
        
        .enhanced-timeline-layout.clean {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100vh;
          position: relative;
        }
        
        .orbital-timeline-section {
          flex: 1;
          width: 100%;
          position: relative;
        }
        
        .linear-timeline-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 15, 20, 0.95);
          z-index: 10;
          backdrop-filter: blur(2px);
        }
        
        .welcome-overlay {
          position: fixed;
          top: 50%;
          right: 2rem;
          transform: translateY(-50%);
          z-index: 5;
          max-width: 400px;
          padding: 2rem;
          background: rgba(20, 20, 25, 0.9);
          border: 2px solid rgba(206, 181, 72, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(4px);
        }
        
        .welcome-title {
          color: #CEB548;
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 1rem;
          font-family: Georgia, serif;
        }
        
        .welcome-description {
          color: rgba(206, 181, 72, 0.9);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .welcome-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(206, 181, 72, 0.8);
          font-size: 0.9rem;
        }
        
        .feature-icon {
          font-size: 1.2rem;
        }
        
        @media (max-width: 768px) {
          .welcome-overlay {
            position: static;
            transform: none;
            margin: 1rem;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};