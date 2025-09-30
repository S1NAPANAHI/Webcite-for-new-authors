import React, { useState, useRef, useEffect } from 'react';
import { Age } from '../../../lib/api-timeline';
import { useEventsByAge } from '../hooks/useTimelineData';
import { EventCard } from '../DetailPanels/EventCard';
import './layered-timeline.css';

export interface LayeredTimelineInterfaceProps {
  ages: Age[];
  selectedAge?: Age | null;
  onAgeSelect: (age: Age) => void;
  className?: string;
}

interface LayerCard {
  age: Age;
  layerIndex: number; // 1-9, where 1 is top layer
  baseRadius: number;
  zIndex: number;
}

export const LayeredTimelineInterface: React.FC<LayeredTimelineInterfaceProps> = ({
  ages,
  selectedAge,
  onAgeSelect,
  className = ''
}) => {
  const [layerCards, setLayerCards] = useState<LayerCard[]>([]);
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants for the layered design
  const CONTAINER_WIDTH = 800;
  const CONTAINER_HEIGHT = 800;
  const CENTER_X = 80; // Left-aligned like the original
  const CENTER_Y = 400;
  const MIN_RADIUS = 72;
  const RADIUS_STEP = 44;
  const GOLD = '#CEB548';
  const MAX_RADIUS = 600; // Full expansion radius

  // Initialize layer cards from ages
  useEffect(() => {
    if (ages.length === 0) return;

    const layers: LayerCard[] = ages.map((age, index) => {
      const layerNumber = ages.length - index; // Reverse: 9, 8, 7, ..., 1
      const baseRadius = MIN_RADIUS + (index * RADIUS_STEP);
      const zIndex = layerNumber; // Layer 9 has z-index 9, Layer 1 has z-index 1
      
      return {
        age,
        layerIndex: layerNumber,
        baseRadius,
        zIndex
      };
    });

    setLayerCards(layers); // Keep original order (largest to smallest)
  }, [ages]);

  const handleLayerClick = async (layerCard: LayerCard) => {
    if (isAnimating) return;

    setIsAnimating(true);
    
    if (expandedLayer === layerCard.layerIndex) {
      // Collapse the layer
      setShowContent(false);
      setTimeout(() => {
        setExpandedLayer(null);
        setTimeout(() => {
          setIsAnimating(false);
        }, 800);
      }, 200);
    } else {
      // Expand the layer
      setExpandedLayer(layerCard.layerIndex);
      onAgeSelect(layerCard.age);
      
      // Show content after expansion animation
      setTimeout(() => {
        setShowContent(true);
        setIsAnimating(false);
      }, 800);
    }
  };

  const handleCloseExpanded = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowContent(false);
    
    setTimeout(() => {
      setExpandedLayer(null);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }, 200);
  };

  // Get the expanded layer data
  const expandedLayerData = expandedLayer ? layerCards.find(layer => layer.layerIndex === expandedLayer) : null;
  const { events, loading, error } = useEventsByAge(expandedLayerData?.age.id || '');

  // Age names for display
  const getAgeDisplayName = (age: Age): string => {
    return age.name || age.title || `Age ${age.age_number}`;
  };

  return (
    <div className={`layered-timeline-interface ${className} ${expandedLayer ? 'has-expanded' : ''}`} ref={containerRef}>
      {/* Background */}
      <div className="timeline-background" />
      
      {/* Layer Cards Container */}
      <div className="layer-cards-container">
        <svg 
          width={CONTAINER_WIDTH}
          height={CONTAINER_HEIGHT}
          viewBox={`0 0 ${CONTAINER_WIDTH} ${CONTAINER_HEIGHT}`}
          className="layers-svg"
        >
          <defs>
            {/* Enhanced gradient definitions for each layer */}
            {layerCards.map((layer, index) => {
              const opacity = Math.max(0.25 - (index * 0.02), 0.05);
              return (
                <radialGradient key={`layer${layer.layerIndex}Gradient`} id={`layer${layer.layerIndex}Gradient`} cx="0.3" cy="0.2">
                  <stop offset="0%" stopColor={`rgba(206, 181, 72, ${opacity})`} />
                  <stop offset="30%" stopColor={`rgba(206, 181, 72, ${opacity * 0.6})`} />
                  <stop offset="70%" stopColor={`rgba(206, 181, 72, ${opacity * 0.3})`} />
                  <stop offset="100%" stopColor={`rgba(206, 181, 72, ${opacity * 0.1})`} />
                </radialGradient>
              );
            })}
            
            {/* Expanded layer gradient */}
            <radialGradient id="expandedGradient" cx="0.5" cy="0.5">
              <stop offset="0%" stopColor="rgba(206, 181, 72, 0.15)" />
              <stop offset="40%" stopColor="rgba(206, 181, 72, 0.08)" />
              <stop offset="80%" stopColor="rgba(206, 181, 72, 0.03)" />
              <stop offset="100%" stopColor="rgba(15, 15, 20, 0.95)" />
            </radialGradient>
          </defs>

          {/* Render layer cards from bottom to top */}
          {layerCards.map((layer) => {
            const isExpanded = expandedLayer === layer.layerIndex;
            const isOtherExpanded = expandedLayer !== null && expandedLayer !== layer.layerIndex;
            const isSelected = selectedAge?.id === layer.age.id;
            
            // Calculate dynamic radius for smooth expansion
            const displayRadius = isExpanded ? MAX_RADIUS : layer.baseRadius;
            const gradientId = isExpanded ? 'expandedGradient' : `layer${layer.layerIndex}Gradient`;
            
            return (
              <g 
                key={`layer-${layer.layerIndex}`}
                className={`layer-card ${
                  isExpanded ? 'expanded' : ''
                } ${isOtherExpanded ? 'faded' : ''} ${isSelected ? 'selected' : ''}`}
                style={{
                  zIndex: isExpanded ? 1000 : layer.zIndex,
                  cursor: isAnimating ? 'wait' : 'pointer'
                }}
                onClick={() => !isAnimating && handleLayerClick(layer)}
              >
                {/* Main layer card with smooth radius expansion */}
                <path
                  d={`
                    M ${CENTER_X} ${CENTER_Y - displayRadius}
                    A ${displayRadius} ${displayRadius} 0 0 1 ${CENTER_X} ${CENTER_Y + displayRadius}
                    L ${CENTER_X} ${CENTER_Y}
                    Z
                  `}
                  fill={`url(#${gradientId})`}
                  stroke={GOLD}
                  strokeWidth={isSelected ? "4" : isExpanded ? "3" : "2"}
                  strokeOpacity={isExpanded ? "0.8" : "0.6"}
                  className="layer-path"
                  style={{
                    transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                />
                
                {/* Enhanced border */}
                <path
                  d={`
                    M ${CENTER_X} ${CENTER_Y - displayRadius}
                    A ${displayRadius} ${displayRadius} 0 0 1 ${CENTER_X} ${CENTER_Y + displayRadius}
                  `}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth={isExpanded ? "2" : "1"}
                  strokeOpacity={isExpanded ? "0.9" : "0.7"}
                  className="layer-highlight"
                  style={{
                    transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                />

                {/* Age label - only show when not expanded */}
                {!isExpanded && (
                  <text
                    x={CENTER_X + displayRadius * 0.7}
                    y={CENTER_Y}
                    fill={GOLD}
                    fontSize={isSelected ? "18" : "16"}
                    fontFamily="Papyrus, Comic Sans MS, fantasy, cursive"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    opacity={isOtherExpanded ? "0.3" : "0.9"}
                    className="layer-label"
                    style={{
                      transition: 'all 0.6s ease'
                    }}
                  >
                    {getAgeDisplayName(layer.age)}
                  </text>
                )}
                
                {/* Layer number indicator - only show when not expanded */}
                {!isExpanded && (
                  <g opacity={isOtherExpanded ? "0.3" : "1"} style={{ transition: 'opacity 0.6s ease' }}>
                    <circle
                      cx={CENTER_X + displayRadius - 30}
                      cy={CENTER_Y - displayRadius + 30}
                      r="15"
                      fill={GOLD}
                      fillOpacity="0.8"
                      className="layer-number-bg"
                    />
                    <text
                      x={CENTER_X + displayRadius - 30}
                      y={CENTER_Y - displayRadius + 30}
                      fill="#1a1a1a"
                      fontSize="12"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="layer-number"
                    >
                      {layer.layerIndex}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Central Sun - only visible when not expanded */}
        {!expandedLayer && (
          <div 
            className="central-sun"
            style={{
              position: 'absolute',
              left: CENTER_X - 24,
              top: CENTER_Y - 24,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: GOLD,
              zIndex: 1000,
              pointerEvents: 'none',
              boxShadow: `0 0 30px ${GOLD}60, 0 0 60px ${GOLD}30`,
              transition: 'all 0.8s ease'
            }}
          />
        )}
      </div>

      {/* Content within the expanded layer - NO POPUP! */}
      {expandedLayer && expandedLayerData && (
        <div className={`expanded-content-overlay ${showContent ? 'visible' : ''}`}>
          {/* Close button */}
          <button 
            className="floating-close-btn"
            onClick={handleCloseExpanded}
            disabled={isAnimating}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          
          {/* Age content directly in the expanded layer */}
          <div className="expanded-age-details">
            <div className="age-header">
              <h1 className="age-title">{getAgeDisplayName(expandedLayerData.age)}</h1>
              <div className="age-meta">
                <span className="age-years">
                  {expandedLayerData.age.start_year || '∞'} - {expandedLayerData.age.end_year || '∞'}
                </span>
                <span className="age-number">Age {expandedLayerData.age.age_number}</span>
                <span className="events-count">{events.length} Events</span>
              </div>
              <p className="age-description">{expandedLayerData.age.description}</p>
            </div>
            
            {/* Timeline Events */}
            {events.length > 0 && (
              <div className="events-section">
                <h3 className="events-title">Timeline Events</h3>
                <div className="events-grid">
                  {events.slice(0, 6).map((event, index) => (
                    <div key={event.id} className="event-item" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="event-date">{new Date(event.date).getFullYear()}</div>
                      <div className="event-title">{event.title}</div>
                      <div className="event-description">{event.description?.substring(0, 120)}...</div>
                    </div>
                  ))}
                </div>
                {events.length > 6 && (
                  <div className="more-events">
                    +{events.length - 6} more events
                  </div>
                )}
              </div>
            )}
            
            {events.length === 0 && !loading && (
              <div className="no-events">
                <p>No events found for this age</p>
              </div>
            )}
            
            {loading && (
              <div className="loading-events">
                <p>Loading events...</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Instructions - only show when not expanded */}
      {!expandedLayer && (
        <div className="instructions-panel">
          <h3>Layered Timeline Interface</h3>
          <p>Click any layer to watch it smoothly expand and reveal age details.</p>
          <p>Layers are stacked with true depth - newest on top.</p>
          <div className="features">
            <span className="feature">🌟 Smooth Radius Expansion</span>
            <span className="feature">📖 Content Reveals In-Place</span>
            <span className="feature">⚡ No Popups or Modals</span>
          </div>
        </div>
      )}
    </div>
  );
};