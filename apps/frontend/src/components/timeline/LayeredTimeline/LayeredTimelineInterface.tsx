import React, { useState, useRef, useEffect } from 'react';
import { Age } from '../../../lib/api-timeline';
import { useEventsByAge } from '../hooks/useTimelineData';
import './layered-timeline.css';

export interface LayeredTimelineInterfaceProps {
  ages: Age[];
  selectedAge?: Age | null;
  onAgeSelect: (age: Age) => void;
  className?: string;
}

interface LayerCard {
  age: Age;
  layerIndex: number;
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
  const [viewportDimensions, setViewportDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants
  const CENTER_X = 80;
  const CENTER_Y = 400;
  const MIN_RADIUS = 72;
  const RADIUS_STEP = 44;
  const GOLD = '#CEB548';

  // Update viewport dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate max radius for full viewport coverage
  const getMaxRadius = (): number => {
    const { width, height } = viewportDimensions;
    // Calculate diagonal distance from center to farthest corner + padding
    const radiusToRightEdge = width - CENTER_X;
    const radiusToTopEdge = CENTER_Y;
    const radiusToBottomEdge = height - CENTER_Y;
    const maxDistance = Math.max(radiusToRightEdge, radiusToTopEdge, radiusToBottomEdge);
    return maxDistance + 200; // Extra padding for complete coverage
  };

  // Initialize layer cards from ages
  useEffect(() => {
    if (ages.length === 0) return;

    const layers: LayerCard[] = ages.map((age, index) => {
      // Layer numbering: Age 0 = Layer 1 (top), Age 8 = Layer 9 (bottom)
      const layerNumber = index + 1;
      const baseRadius = MIN_RADIUS + (index * RADIUS_STEP);
      // Z-index: Layer 1 (first age) = highest z-index, Layer 9 (last age) = lowest
      const zIndex = ages.length - index;
      
      return {
        age,
        layerIndex: layerNumber,
        baseRadius,
        zIndex
      };
    });

    setLayerCards(layers);
  }, [ages]);

  const handleLayerClick = (layerCard: LayerCard, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (isAnimating) return;

    console.log(`Layer ${layerCard.layerIndex} clicked:`, layerCard.age.name);
    
    setIsAnimating(true);
    
    if (expandedLayer === layerCard.layerIndex) {
      // Collapse current layer
      setShowContent(false);
      setTimeout(() => {
        setExpandedLayer(null);
        setTimeout(() => {
          setIsAnimating(false);
        }, 1200);
      }, 200);
    } else {
      // Expand clicked layer
      setExpandedLayer(layerCard.layerIndex);
      onAgeSelect(layerCard.age);
      
      // Show content after expansion completes
      setTimeout(() => {
        setShowContent(true);
        setIsAnimating(false);
      }, 1200);
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
      }, 1200);
    }, 200);
  };

  // Get expanded layer data
  const expandedLayerData = expandedLayer ? layerCards.find(layer => layer.layerIndex === expandedLayer) : null;
  const { events, loading, error } = useEventsByAge(expandedLayerData?.age.id || '');

  const getAgeDisplayName = (age: Age): string => {
    return age.name || age.title || `Age ${age.age_number}` || 'Unknown Age';
  };

  const maxRadius = getMaxRadius();

  return (
    <div className={`layered-timeline-interface ${className} ${expandedLayer ? 'has-expanded' : ''}`} ref={containerRef}>
      <div className="timeline-background" />
      
      {/* SVG with all layers */}
      <div className="layer-cards-container">
        <svg 
          width={viewportDimensions.width}
          height={viewportDimensions.height}
          viewBox={`0 0 ${viewportDimensions.width} ${viewportDimensions.height}`}
          className="layers-svg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <defs>
            {/* Gradients for each layer */}
            {layerCards.map((layer, index) => {
              const opacity = Math.max(0.25 - (index * 0.015), 0.08);
              return (
                <radialGradient key={`gradient-${layer.layerIndex}`} id={`layer-gradient-${layer.layerIndex}`} cx="0.2" cy="0.5">
                  <stop offset="0%" stopColor={`rgba(206, 181, 72, ${opacity})`} />
                  <stop offset="40%" stopColor={`rgba(206, 181, 72, ${opacity * 0.6})`} />
                  <stop offset="80%" stopColor={`rgba(206, 181, 72, ${opacity * 0.3})`} />
                  <stop offset="100%" stopColor={`rgba(15, 15, 20, ${opacity * 0.1})`} />
                </radialGradient>
              );
            })}
            
            {/* Special expanded gradient */}
            <radialGradient id="expanded-gradient" cx="0.1" cy="0.5" r="0.8">
              <stop offset="0%" stopColor="rgba(206, 181, 72, 0.15)" />
              <stop offset="30%" stopColor="rgba(206, 181, 72, 0.08)" />
              <stop offset="70%" stopColor="rgba(206, 181, 72, 0.03)" />
              <stop offset="100%" stopColor="rgba(15, 15, 20, 0.95)" />
            </radialGradient>
          </defs>

          {/* Render layers from bottom to top (reverse z-index order for proper stacking) */}
          {[...layerCards].reverse().map((layer, reverseIndex) => {
            const isExpanded = expandedLayer === layer.layerIndex;
            const isOtherExpanded = expandedLayer !== null && expandedLayer !== layer.layerIndex;
            const isSelected = selectedAge?.id === layer.age.id;
            
            // Dynamic radius calculation
            const displayRadius = isExpanded ? maxRadius : layer.baseRadius;
            const gradientId = isExpanded ? 'expanded-gradient' : `layer-gradient-${layer.layerIndex}`;
            
            return (
              <g 
                key={`layer-group-${layer.layerIndex}`}
                className={`layer-card layer-${layer.layerIndex} ${
                  isExpanded ? 'expanded' : ''
                } ${isOtherExpanded ? 'faded' : ''} ${isSelected ? 'selected' : ''}`}
                style={{
                  zIndex: layer.zIndex,
                  cursor: isAnimating ? 'wait' : 'pointer',
                  pointerEvents: isOtherExpanded ? 'none' : 'auto'
                }}
                onClick={(e) => handleLayerClick(layer, e)}
              >
                {/* Main semi-circle path */}
                <path
                  d={`
                    M ${CENTER_X} ${CENTER_Y - displayRadius}
                    A ${displayRadius} ${displayRadius} 0 0 1 ${CENTER_X} ${CENTER_Y + displayRadius}
                    L ${CENTER_X} ${CENTER_Y}
                    Z
                  `}
                  fill={`url(#${gradientId})`}
                  stroke={GOLD}
                  strokeWidth={isExpanded ? "2" : isSelected ? "3" : "2"}
                  strokeOpacity={isExpanded ? "0.8" : isSelected ? "0.9" : "0.6"}
                  className="layer-path"
                  data-layer={layer.layerIndex}
                />
                
                {/* Border highlight */}
                <path
                  d={`
                    M ${CENTER_X} ${CENTER_Y - displayRadius}
                    A ${displayRadius} ${displayRadius} 0 0 1 ${CENTER_X} ${CENTER_Y + displayRadius}
                  `}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth={isExpanded ? "1" : "1"}
                  strokeOpacity={isExpanded ? "0.6" : "0.4"}
                  className="layer-highlight"
                  data-layer={layer.layerIndex}
                />

                {/* Age label - hide during expansion */}
                {!isExpanded && (
                  <text
                    x={CENTER_X + displayRadius * 0.6}
                    y={CENTER_Y}
                    fill={GOLD}
                    fontSize={isSelected ? "17" : "15"}
                    fontFamily="Papyrus, Comic Sans MS, fantasy, cursive"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    opacity={isOtherExpanded ? "0" : "0.9"}
                    className="layer-label"
                    style={{ pointerEvents: 'none' }}
                  >
                    {getAgeDisplayName(layer.age)}
                  </text>
                )}
                
                {/* Layer number indicator */}
                {!isExpanded && (
                  <g opacity={isOtherExpanded ? "0" : "1"} style={{ pointerEvents: 'none' }}>
                    <circle
                      cx={CENTER_X + displayRadius - 25}
                      cy={CENTER_Y - displayRadius + 25}
                      r="12"
                      fill={GOLD}
                      fillOpacity="0.9"
                      className="layer-number-bg"
                    />
                    <text
                      x={CENTER_X + displayRadius - 25}
                      y={CENTER_Y - displayRadius + 25}
                      fill="#1a1a1a"
                      fontSize="10"
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
        
        {/* Central Sun */}
        <div 
          className={`central-sun ${expandedLayer ? 'hidden' : ''}`}
          style={{
            position: 'absolute',
            left: CENTER_X - 24,
            top: CENTER_Y - 24,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: GOLD,
            zIndex: 1001,
            pointerEvents: 'none',
            boxShadow: `0 0 40px ${GOLD}60, 0 0 80px ${GOLD}30`
          }}
        />
      </div>

      {/* Content overlay - appears within expanded layer */}
      {expandedLayer && expandedLayerData && (
        <div className={`expanded-content ${showContent ? 'visible' : ''}`}>
          <button 
            className="close-btn"
            onClick={handleCloseExpanded}
            disabled={isAnimating}
          >
            ✕
          </button>
          
          <div className="content-area">
            <div className="age-info">
              <h1 className="age-title">{getAgeDisplayName(expandedLayerData.age)}</h1>
              
              <div className="age-meta">
                <span className="years">
                  {expandedLayerData.age.start_year || '∞'} - {expandedLayerData.age.end_year || '∞'}
                </span>
                <span className="layer-num">Layer {expandedLayerData.layerIndex}</span>
                <span className="events-count">{events.length} Events</span>
              </div>
              
              <p className="age-desc">{expandedLayerData.age.description}</p>
            </div>
            
            {/* Events list */}
            {events.length > 0 && (
              <div className="events-list">
                <h3>Timeline Events</h3>
                <div className="events-container">
                  {events.slice(0, 6).map((event, index) => (
                    <div 
                      key={event.id} 
                      className="event-card"
                      style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                    >
                      <div className="event-year">{new Date(event.date).getFullYear()}</div>
                      <div className="event-name">{event.title}</div>
                      <div className="event-summary">{event.description?.substring(0, 100)}...</div>
                    </div>
                  ))}
                </div>
                {events.length > 6 && (
                  <div className="more-events-note">+{events.length - 6} more events...</div>
                )}
              </div>
            )}
            
            {events.length === 0 && !loading && (
              <div className="no-events">
                <div className="icon">📖</div>
                <h4>No Events Recorded</h4>
                <p>This age has no timeline events yet.</p>
              </div>
            )}
            
            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading events...</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Instructions */}
      {!expandedLayer && (
        <div className="instructions">
          <h3>Layered Timeline</h3>
          <p>Click any layer to expand it across the page.</p>
          <p>All 9 layers are clickable!</p>
          <div className="tips">
            <span>🎯 Click any layer to expand</span>
            <span>📐 True radius expansion</span>
            <span>✨ Content reveals in-place</span>
          </div>
        </div>
      )}
    </div>
  );
};