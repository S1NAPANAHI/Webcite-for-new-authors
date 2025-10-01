import React, { useState, useMemo } from 'react';
import { ImprovedExpandableOrbitalDial } from './CosmicRings/ImprovedExpandableOrbitalDial';
import { AgeDetailPanel } from './DetailPanels/AgeDetailPanel';
import { LinearTimelinePanel } from './LinearTimeline/LinearTimelinePanel';
import { BreadcrumbCompass } from './Navigation/BreadcrumbCompass';
import { ModeToggle } from './Navigation/ModeToggle';
import { useTimelineContext } from '../../contexts/TimelineContext';
import { useTimelineData } from './hooks/useTimelineData';
import { Age, TimelineEvent } from '../../lib/api-timeline';
import './enhanced-cosmic-timeline.css';

export type ViewMode = 'hybrid' | 'linear';

interface TransitionState {
  isTransitioning: boolean;
  fromMode: ViewMode | null;
  toMode: ViewMode | null;
}

export const EnhancedCosmicTimeline: React.FC = () => {
  const { selectedAge, setSelectedAge } = useTimelineContext();
  const { ages, loading, error } = useTimelineData();
  const [viewMode, setViewMode] = useState<ViewMode>('hybrid');
  const [selectedEvents, setSelectedEvents] = useState<TimelineEvent[]>([]);
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    fromMode: null,
    toMode: null
  });
  
  const handleAgeSelect = (age: Age) => {
    setSelectedAge(age);
  };

  const handleViewToggle = () => {
    const newMode: ViewMode = viewMode === 'hybrid' ? 'linear' : 'hybrid';
    
    // Start transition
    setTransitionState({
      isTransitioning: true,
      fromMode: viewMode,
      toMode: newMode
    });
    
    // Change mode with slight delay for smooth transition
    setTimeout(() => {
      setViewMode(newMode);
      
      // End transition after a brief moment
      setTimeout(() => {
        setTransitionState({
          isTransitioning: false,
          fromMode: null,
          toMode: null
        });
      }, 300);
    }, 150);
  };

  // Format year range for display
  const formatYearRange = (age: Age): string => {
    if (!age.end_year) return `${age.start_year || '∞'}–∞`;
    return `${age.start_year || '∞'}–${age.end_year}`;
  };

  // Enhanced loading state with better UX
  if (loading) {
    return (
      <div className="enhanced-cosmic-timeline loading crisp" data-loading="true">
        <div className="loading-container">
          <div className="loading-content">
            <div className="cosmic-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring delay-1"></div>
              <div className="spinner-ring delay-2"></div>
            </div>
            <h2 className="loading-title">Initializing Cosmic Timeline</h2>
            <p className="loading-subtitle">Preparing the nine ages of Zoroasterverse...</p>
            <div className="loading-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="enhanced-cosmic-timeline error crisp" data-error="true">
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚡</div>
            <h2 className="error-title">Timeline Disruption Detected</h2>
            <p className="error-message">
              The cosmic timeline encountered an anomaly: <span className="error-detail">{error}</span>
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              <span className="retry-icon">🔄</span>
              Restore Timeline
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get current view mode display info with enhanced icons
  const getViewModeInfo = () => {
    switch (viewMode) {
      case 'hybrid':
        return {
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          ),
          label: 'Linear View',
          description: 'Switch to chronological timeline'
        };
      case 'linear':
        return {
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="10" cy="6" r="2" fill="currentColor"/>
              <circle cx="6" cy="14" r="2" fill="currentColor"/>
              <circle cx="14" cy="14" r="2" fill="currentColor"/>
            </svg>
          ),
          label: 'Orbital View',
          description: 'Return to cosmic orbital display'
        };
    }
  };

  const viewInfo = getViewModeInfo();

  return (
    <div className={`enhanced-cosmic-timeline improved crisp ${transitionState.isTransitioning ? 'transitioning' : ''}`}>
      {/* Enhanced background with subtle particle effects */}
      <div className="timeline-background improved crisp">
        <div className="cosmic-particles">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="particle crisp"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 12}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Navigation Controls */}
      <div className="navigation-controls improved crisp">
        <div className="control-group primary">
          <BreadcrumbCompass />
          <ModeToggle />
        </div>
        
        {/* Enhanced View Toggle Button with better feedback */}
        <button
          onClick={handleViewToggle}
          disabled={transitionState.isTransitioning}
          className={`view-toggle-btn improved crisp ${
            transitionState.isTransitioning ? 'transitioning' : ''
          }`}
          title={viewInfo.description}
        >
          <div className="toggle-icon">
            {transitionState.isTransitioning ? (
              <div className="transition-spinner"></div>
            ) : (
              viewInfo.icon
            )}
          </div>
          <span className="toggle-label">{viewInfo.label}</span>
        </button>
        
        {/* Enhanced View Mode Indicator */}
        <div className="view-indicator improved crisp">
          <div className="indicator-dot active"></div>
          <span className="indicator-text">
            {transitionState.isTransitioning 
              ? `Switching to ${transitionState.toMode}...`
              : `${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Mode`
            }
          </span>
        </div>
      </div>

      <div className="enhanced-timeline-layout improved crisp">
        {/* Conditional View Rendering with transition support */}
        {viewMode === 'hybrid' && !transitionState.isTransitioning && (
          <div className="orbital-timeline-section improved crisp">
            <ImprovedExpandableOrbitalDial
              ages={ages}
              selectedAge={selectedAge}
              onAgeSelect={handleAgeSelect}
              className="improved-orbital-dial-container crisp"
            />
          </div>
        )}

        {/* Enhanced Linear view overlay */}
        {viewMode === 'linear' && !transitionState.isTransitioning && (
          <div className="linear-timeline-overlay improved crisp">
            <LinearTimelinePanel 
              selectedAge={selectedAge}
              onAgeSelect={handleAgeSelect}
              showAllAges={true}
            />
          </div>
        )}
      </div>

      {/* Welcome message when no age is selected and in hybrid mode */}
      {!selectedAge && viewMode === 'hybrid' && (
        <div className="welcome-overlay">
          <div className="welcome-content">
            <h2 className="welcome-title">Zoroastervers Timeline</h2>
            <p className="welcome-description">
              Explore the cosmic ages through an expandable orbital design. Click on any golden planet orbiting the left half-circle to expand its age across the full page.
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
              <div className="feature-item">
                <span className="feature-icon">🎭</span>
                <span>Click planets to expand ages across page</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span>Smooth semicircle expansion animations</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Transition overlay */}
        {transitionState.isTransitioning && (
          <div className="transition-overlay crisp">
            <div className="transition-content">
              <div className="transition-spinner large"></div>
              <p className="transition-text">
                Transitioning to {transitionState.toMode} view...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* REMOVED: Welcome overlay info box - no longer displayed */}
      
      {/* Enhanced Custom Styles with improved crisp design */}
      <style jsx>{`
        .enhanced-cosmic-timeline.improved.crisp {
          background: linear-gradient(
            135deg,
            rgba(15, 15, 20, 1) 0%,
            rgba(25, 25, 30, 1) 30%,
            rgba(20, 20, 25, 1) 70%,
            rgba(15, 15, 20, 1) 100%
          );
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          /* Crisp rendering optimizations */
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        
        .timeline-background.improved.crisp {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at 8% 40%,
            rgba(206, 181, 72, 0.04) 0%,
            rgba(206, 181, 72, 0.02) 25%,
            rgba(206, 181, 72, 0.008) 50%,
            transparent 70%
          );
          pointer-events: none;
          transition: opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .cosmic-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .particle.crisp {
          position: absolute;
          width: 1.5px;
          height: 1.5px;
          background: rgba(206, 181, 72, 0.3);
          border-radius: 50%;
          animation: crispParticleFloat 18s linear infinite;
        }
        
        @keyframes crispParticleFloat {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-10vh) translateX(15px);
            opacity: 0;
          }
        }
        
        .enhanced-timeline-layout.improved.crisp {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100vh;
          position: relative;
        }
        
        .orbital-timeline-section.improved.crisp {
          flex: 1;
          width: 100%;
          position: relative;
          animation: crispSlideInFromCenter 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .linear-timeline-overlay.improved.crisp {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 15, 20, 0.95);
          z-index: 10;
          animation: crispSlideInFromCenter 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        @keyframes crispSlideInFromCenter {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .navigation-controls.improved.crisp {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          align-items: flex-end;
        }
        
        .control-group.primary {
          display: flex;
          gap: 0.6rem;
        }
        
        .view-toggle-btn.improved.crisp {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1rem;
          background: rgba(206, 181, 72, 0.12);
          border: 1.5px solid rgba(206, 181, 72, 0.35);
          border-radius: 12px;
          color: #CEB548;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          /* Removed backdrop-filter for crisp rendering */
          box-shadow: 0 2px 12px rgba(206, 181, 72, 0.12);
        }
        
        .view-toggle-btn.improved.crisp:hover:not(:disabled) {
          background: rgba(206, 181, 72, 0.2);
          border-color: rgba(206, 181, 72, 0.5);
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 4px 20px rgba(206, 181, 72, 0.2);
        }
        
        .view-toggle-btn.improved.crisp:disabled {
          opacity: 0.6;
          cursor: wait;
          transform: none;
        }
        
        .view-toggle-btn.improved.crisp.transitioning {
          background: rgba(206, 181, 72, 0.18);
          animation: crispTransitionPulse 1s ease-in-out infinite;
        }
        
        @keyframes crispTransitionPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        .toggle-icon {
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .transition-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(206, 181, 72, 0.3);
          border-top: 2px solid #CEB548;
          border-radius: 50%;
          animation: crispSpin 0.7s linear infinite;
        }
        
        .transition-spinner.large {
          width: 32px;
          height: 32px;
          border-width: 3px;
        }
        
        @keyframes crispSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .toggle-label {
          font-size: 0.85rem;
          white-space: nowrap;
          /* Crisp text rendering */
          text-rendering: geometricPrecision;
        }
        
        .view-indicator.improved.crisp {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.8rem;
          background: rgba(25, 25, 30, 0.8);
          border: 1px solid rgba(206, 181, 72, 0.2);
          border-radius: 10px;
          font-size: 0.8rem;
          color: rgba(206, 181, 72, 0.8);
          /* Removed backdrop-filter for crisp rendering */
        }
        
        .indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(206, 181, 72, 0.4);
          transition: all 0.25s ease;
        }
        
        .indicator-dot.active {
          background: #CEB548;
          box-shadow: 0 0 6px rgba(206, 181, 72, 0.5);
        }
        
        .transition-overlay.crisp {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 15, 20, 0.7);
          z-index: 50;
        }
        
        .transition-content {
          text-align: center;
          color: #CEB548;
        }
        
        .transition-text {
          margin-top: 0.8rem;
          font-size: 1rem;
          font-weight: 500;
          text-rendering: geometricPrecision;
        }
        
        /* Enhanced Loading Styles - Crisp */
        .enhanced-cosmic-timeline.loading.crisp {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .loading-container {
          text-align: center;
          color: #CEB548;
        }
        
        .cosmic-spinner {
          position: relative;
          width: 70px;
          height: 70px;
          margin: 0 auto 1.8rem;
        }
        
        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2.5px solid transparent;
          border-top: 2.5px solid #CEB548;
          border-radius: 50%;
          animation: crispCosmicSpin 2s linear infinite;
        }
        
        .spinner-ring.delay-1 {
          width: 55px;
          height: 55px;
          top: 7.5px;
          left: 7.5px;
          border-top-color: rgba(206, 181, 72, 0.7);
          animation-delay: 0.25s;
          animation-duration: 1.6s;
        }
        
        .spinner-ring.delay-2 {
          width: 40px;
          height: 40px;
          top: 15px;
          left: 15px;
          border-top-color: rgba(206, 181, 72, 0.4);
          animation-delay: 0.5s;
          animation-duration: 1.2s;
        }
        
        @keyframes crispCosmicSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-title {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 0.4rem;
          font-family: 'Segoe UI', 'Arial', sans-serif;
          text-rendering: geometricPrecision;
        }
        
        .loading-subtitle {
          font-size: 1rem;
          opacity: 0.8;
          margin-bottom: 1.8rem;
          text-rendering: geometricPrecision;
        }
        
        .loading-progress {
          width: 180px;
          height: 3px;
          background: rgba(206, 181, 72, 0.2);
          border-radius: 1.5px;
          margin: 0 auto;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #CEB548, #FFD700);
          border-radius: 1.5px;
          animation: crispProgressFlow 2s ease-in-out infinite;
        }
        
        @keyframes crispProgressFlow {
          0% { width: 0%; }
          50% { width: 65%; }
          100% { width: 100%; }
        }
        
        /* Enhanced Error Styles - Crisp */
        .enhanced-cosmic-timeline.error.crisp {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .error-container {
          text-align: center;
          max-width: 450px;
          padding: 1.8rem;
        }
        
        .error-icon {
          font-size: 3.5rem;
          margin-bottom: 0.8rem;
          animation: crispErrorPulse 2s ease-in-out infinite;
        }
        
        @keyframes crispErrorPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .error-title {
          color: #ff6b6b;
          font-size: 1.6rem;
          font-weight: bold;
          margin-bottom: 0.8rem;
          font-family: 'Segoe UI', 'Arial', sans-serif;
          text-rendering: geometricPrecision;
        }
        
        .error-message {
          color: rgba(206, 181, 72, 0.9);
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 1.8rem;
          text-rendering: geometricPrecision;
        }
        
        .error-detail {
          color: #ff9f9f;
          font-weight: 600;
        }
        
        .retry-button {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.2rem;
          background: rgba(206, 181, 72, 0.15);
          border: 1.5px solid rgba(206, 181, 72, 0.35);
          border-radius: 10px;
          color: #CEB548;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          margin: 0 auto;
        }
        
        .retry-button:hover {
          background: rgba(206, 181, 72, 0.25);
          border-color: rgba(206, 181, 72, 0.5);
          transform: translateY(-1px);
        }
        
        .retry-icon {
          font-size: 1.1rem;
        }
        
        /* Responsive Design - Crisp */
        @media (max-width: 768px) {
          .navigation-controls.improved.crisp {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          
          .control-group.primary {
            order: 2;
          }
          
          .view-toggle-btn.improved.crisp {
            order: 1;
            padding: 0.5rem 0.8rem;
          }
          
          .view-indicator.improved.crisp {
            order: 3;
            font-size: 0.75rem;
            padding: 0.35rem 0.6rem;
          }
        }
        
        @media (max-width: 480px) {
          .navigation-controls.improved.crisp {
            flex-direction: column;
            gap: 0.4rem;
          }
          
          .view-toggle-btn.improved.crisp .toggle-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};