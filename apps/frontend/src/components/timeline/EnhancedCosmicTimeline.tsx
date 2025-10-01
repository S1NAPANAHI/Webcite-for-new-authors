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
      <div className="enhanced-cosmic-timeline loading" data-loading="true">
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
      <div className="enhanced-cosmic-timeline error" data-error="true">
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
    <div className={`enhanced-cosmic-timeline improved ${transitionState.isTransitioning ? 'transitioning' : ''}`}>
      {/* Enhanced background with particle effects */}
      <div className="timeline-background improved">
        <div className="cosmic-particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Navigation Controls */}
      <div className="navigation-controls improved">
        <div className="control-group primary">
          <BreadcrumbCompass />
          <ModeToggle />
        </div>
        
        {/* Enhanced View Toggle Button with better feedback */}
        <button
          onClick={handleViewToggle}
          disabled={transitionState.isTransitioning}
          className={`view-toggle-btn improved ${
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
        <div className="view-indicator improved">
          <div className="indicator-dot active"></div>
          <span className="indicator-text">
            {transitionState.isTransitioning 
              ? `Switching to ${transitionState.toMode}...`
              : `${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Mode`
            }
          </span>
        </div>
      </div>

      <div className="enhanced-timeline-layout improved">
        {/* Conditional View Rendering with transition support */}
        {viewMode === 'hybrid' && !transitionState.isTransitioning && (
          <div className="orbital-timeline-section improved">
            <ImprovedExpandableOrbitalDial
              ages={ages}
              selectedAge={selectedAge}
              onAgeSelect={handleAgeSelect}
              className="improved-orbital-dial-container"
            />
          </div>
        )}

        {/* Enhanced Linear view overlay */}
        {viewMode === 'linear' && !transitionState.isTransitioning && (
          <div className="linear-timeline-overlay improved">
            <LinearTimelinePanel 
              selectedAge={selectedAge}
              onAgeSelect={handleAgeSelect}
              showAllAges={true}
            />
          </div>
        )}
        
        {/* Transition overlay */}
        {transitionState.isTransitioning && (
          <div className="transition-overlay">
            <div className="transition-content">
              <div className="transition-spinner large"></div>
              <p className="transition-text">
                Transitioning to {transitionState.toMode} view...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced welcome message with better animations */}
      {!selectedAge && viewMode === 'hybrid' && !transitionState.isTransitioning && (
        <div className="welcome-overlay improved">
          <div className="welcome-content">
            <div className="welcome-header">
              <h2 className="welcome-title">✨ Zoroasterverse Timeline ✨</h2>
              <div className="welcome-subtitle">Interactive Cosmic Chronicle</div>
            </div>
            
            <p className="welcome-description">
              Journey through the nine cosmic ages in an immersive orbital experience. 
              Each golden layer represents a distinct era, waiting to reveal its stories and secrets.
            </p>
            
            <div className="welcome-features improved">
              <div className="feature-group">
                <div className="feature-item enhanced">
                  <span className="feature-icon">🪐</span>
                  <div className="feature-content">
                    <span className="feature-title">Nine Cosmic Layers</span>
                    <span className="feature-desc">Stackable semicircle ages</span>
                  </div>
                </div>
                
                <div className="feature-item enhanced">
                  <span className="feature-icon">☀️</span>
                  <div className="feature-content">
                    <span className="feature-title">Central Golden Sun</span>
                    <span className="feature-desc">Source of all cosmic energy</span>
                  </div>
                </div>
                
                <div className="feature-item enhanced">
                  <span className="feature-icon">📜</span>
                  <div className="feature-content">
                    <span className="feature-title">Orbital Age Names</span>
                    <span className="feature-desc">Text follows curved paths</span>
                  </div>
                </div>
              </div>
              
              <div className="feature-group">
                <div className="feature-item enhanced">
                  <span className="feature-icon">🎭</span>
                  <div className="feature-content">
                    <span className="feature-title">Click to Expand</span>
                    <span className="feature-desc">Smooth fullscreen transitions</span>
                  </div>
                </div>
                
                <div className="feature-item enhanced">
                  <span className="feature-icon">✨</span>
                  <div className="feature-content">
                    <span className="feature-title">Morphing Animation</span>
                    <span className="feature-desc">Semicircle becomes full page</span>
                  </div>
                </div>
                
                <div className="feature-item enhanced">
                  <span className="feature-icon">⚡</span>
                  <div className="feature-content">
                    <span className="feature-title">Dynamic Content</span>
                    <span className="feature-desc">Events reveal with context</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="welcome-cta">
              <div className="cta-text">Click any golden layer to begin your journey</div>
              <div className="cta-arrow">↙</div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Custom Styles with improved design */}
      <style jsx>{`
        .enhanced-cosmic-timeline.improved {
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
        }
        
        .timeline-background.improved {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at 8% 50%,
            rgba(206, 181, 72, 0.06) 0%,
            rgba(206, 181, 72, 0.03) 30%,
            rgba(206, 181, 72, 0.01) 60%,
            transparent 80%
          );
          pointer-events: none;
          transition: opacity 1.0s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .cosmic-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(206, 181, 72, 0.4);
          border-radius: 50%;
          animation: particleFloat 15s linear infinite;
        }
        
        @keyframes particleFloat {
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
            transform: translateY(-10vh) translateX(20px);
            opacity: 0;
          }
        }
        
        .enhanced-timeline-layout.improved {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100vh;
          position: relative;
        }
        
        .orbital-timeline-section.improved {
          flex: 1;
          width: 100%;
          position: relative;
          animation: slideInFromCenter 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .linear-timeline-overlay.improved {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 15, 20, 0.95);
          z-index: 10;
          backdrop-filter: blur(4px);
          animation: slideInFromCenter 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        @keyframes slideInFromCenter {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .navigation-controls.improved {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-end;
        }
        
        .control-group.primary {
          display: flex;
          gap: 0.75rem;
        }
        
        .view-toggle-btn.improved {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: rgba(206, 181, 72, 0.15);
          backdrop-filter: blur(12px);
          border: 2px solid rgba(206, 181, 72, 0.4);
          border-radius: 16px;
          color: #CEB548;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 
            0 4px 20px rgba(206, 181, 72, 0.15),
            inset 0 1px 0 rgba(206, 181, 72, 0.2);
        }
        
        .view-toggle-btn.improved:hover:not(:disabled) {
          background: rgba(206, 181, 72, 0.25);
          border-color: rgba(206, 181, 72, 0.6);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 
            0 8px 30px rgba(206, 181, 72, 0.25),
            inset 0 1px 0 rgba(206, 181, 72, 0.3);
        }
        
        .view-toggle-btn.improved:disabled {
          opacity: 0.6;
          cursor: wait;
          transform: none;
        }
        
        .view-toggle-btn.improved.transitioning {
          background: rgba(206, 181, 72, 0.2);
          animation: transitionPulse 1s ease-in-out infinite;
        }
        
        @keyframes transitionPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .toggle-icon {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .transition-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(206, 181, 72, 0.3);
          border-top: 2px solid #CEB548;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        .transition-spinner.large {
          width: 40px;
          height: 40px;
          border-width: 3px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .toggle-label {
          font-size: 0.9rem;
          white-space: nowrap;
        }
        
        .view-indicator.improved {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(25, 25, 30, 0.8);
          border: 1px solid rgba(206, 181, 72, 0.2);
          border-radius: 12px;
          backdrop-filter: blur(8px);
          font-size: 0.85rem;
          color: rgba(206, 181, 72, 0.8);
        }
        
        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(206, 181, 72, 0.4);
          transition: all 0.3s ease;
        }
        
        .indicator-dot.active {
          background: #CEB548;
          box-shadow: 0 0 8px rgba(206, 181, 72, 0.6);
        }
        
        .transition-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 15, 20, 0.8);
          backdrop-filter: blur(4px);
          z-index: 50;
        }
        
        .transition-content {
          text-align: center;
          color: #CEB548;
        }
        
        .transition-text {
          margin-top: 1rem;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        /* Enhanced Loading Styles */
        .enhanced-cosmic-timeline.loading {
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
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
        }
        
        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top: 3px solid #CEB548;
          border-radius: 50%;
          animation: cosmicSpin 2s linear infinite;
        }
        
        .spinner-ring.delay-1 {
          width: 60px;
          height: 60px;
          top: 10px;
          left: 10px;
          border-top-color: rgba(206, 181, 72, 0.7);
          animation-delay: 0.3s;
          animation-duration: 1.5s;
        }
        
        .spinner-ring.delay-2 {
          width: 40px;
          height: 40px;
          top: 20px;
          left: 20px;
          border-top-color: rgba(206, 181, 72, 0.4);
          animation-delay: 0.6s;
          animation-duration: 1s;
        }
        
        @keyframes cosmicSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          font-family: 'Papyrus', Georgia, serif;
        }
        
        .loading-subtitle {
          font-size: 1.1rem;
          opacity: 0.8;
          margin-bottom: 2rem;
        }
        
        .loading-progress {
          width: 200px;
          height: 4px;
          background: rgba(206, 181, 72, 0.2);
          border-radius: 2px;
          margin: 0 auto;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #CEB548, #FFD700);
          border-radius: 2px;
          animation: progressFlow 2s ease-in-out infinite;
        }
        
        @keyframes progressFlow {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        /* Enhanced Error Styles */
        .enhanced-cosmic-timeline.error {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .error-container {
          text-align: center;
          max-width: 500px;
          padding: 2rem;
        }
        
        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: errorPulse 2s ease-in-out infinite;
        }
        
        @keyframes errorPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .error-title {
          color: #ff6b6b;
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 1rem;
          font-family: 'Papyrus', Georgia, serif;
        }
        
        .error-message {
          color: rgba(206, 181, 72, 0.9);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        
        .error-detail {
          color: #ff9f9f;
          font-weight: 600;
        }
        
        .retry-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(206, 181, 72, 0.2);
          border: 2px solid rgba(206, 181, 72, 0.4);
          border-radius: 12px;
          color: #CEB548;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 auto;
        }
        
        .retry-button:hover {
          background: rgba(206, 181, 72, 0.3);
          border-color: rgba(206, 181, 72, 0.6);
          transform: translateY(-2px);
        }
        
        .retry-icon {
          font-size: 1.2rem;
        }
        
        /* Enhanced Welcome Styles */
        .welcome-overlay.improved {
          position: fixed;
          top: 50%;
          right: 2rem;
          transform: translateY(-50%);
          z-index: 20;
          max-width: 450px;
          padding: 2.5rem;
          background: linear-gradient(
            135deg,
            rgba(25, 25, 30, 0.95) 0%,
            rgba(20, 20, 25, 0.95) 100%
          );
          border: 2px solid rgba(206, 181, 72, 0.4);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(206, 181, 72, 0.1),
            inset 0 1px 0 rgba(206, 181, 72, 0.2);
          animation: welcomeSlideIn 1s cubic-bezier(0.23, 1, 0.32, 1) 0.5s both;
        }
        
        @keyframes welcomeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-50%) translateX(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
        
        .welcome-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .welcome-title {
          color: #CEB548;
          font-size: 1.9rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          font-family: 'Papyrus', Georgia, serif;
          text-shadow: 0 0 20px rgba(206, 181, 72, 0.4);
          animation: titleShimmer 3s ease-in-out infinite;
        }
        
        @keyframes titleShimmer {
          0%, 100% { text-shadow: 0 0 20px rgba(206, 181, 72, 0.4); }
          50% { text-shadow: 0 0 30px rgba(206, 181, 72, 0.6); }
        }
        
        .welcome-subtitle {
          color: rgba(206, 181, 72, 0.7);
          font-size: 1rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .welcome-description {
          color: rgba(206, 181, 72, 0.9);
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .welcome-features.improved {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .feature-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .feature-item.enhanced {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: rgba(206, 181, 72, 0.05);
          border: 1px solid rgba(206, 181, 72, 0.15);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .feature-item.enhanced:hover {
          background: rgba(206, 181, 72, 0.1);
          border-color: rgba(206, 181, 72, 0.25);
          transform: translateX(4px);
        }
        
        .feature-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        
        .feature-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        
        .feature-title {
          color: rgba(206, 181, 72, 0.95);
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .feature-desc {
          color: rgba(206, 181, 72, 0.7);
          font-size: 0.8rem;
        }
        
        .welcome-cta {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(206, 181, 72, 0.2);
        }
        
        .cta-text {
          color: rgba(206, 181, 72, 0.8);
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .cta-arrow {
          font-size: 1.5rem;
          color: #CEB548;
          animation: arrowBounce 2s ease-in-out infinite;
        }
        
        @keyframes arrowBounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-4px); }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .navigation-controls.improved {
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
          
          .view-toggle-btn.improved {
            order: 1;
            padding: 0.5rem 1rem;
          }
          
          .view-indicator.improved {
            order: 3;
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
          
          .welcome-overlay.improved {
            position: static;
            transform: none;
            margin: 1rem;
            max-width: none;
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .navigation-controls.improved {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .view-toggle-btn.improved .toggle-label {
            display: none;
          }
          
          .welcome-features.improved {
            gap: 0.5rem;
          }
          
          .feature-item.enhanced {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};