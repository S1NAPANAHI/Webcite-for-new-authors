import React, { useState, useRef, useEffect } from 'react';
import { Age } from '../../../lib/api-timeline';
import { AgeDetailPanel } from '../DetailPanels/AgeDetailPanel';
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
  radius: number;
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants for the layered design
  const CONTAINER_WIDTH = 800;
  const CONTAINER_HEIGHT = 800;
  const CENTER_X = 80; // Left-aligned like the original
  const CENTER_Y = 400;
  const MIN_RADIUS = 72;
  const RADIUS_STEP = 44;
  const GOLD = '#CEB548';

  // Initialize layer cards from ages
  useEffect(() => {
    if (ages.length === 0) return;

    const layers: LayerCard[] = ages.map((age, index) => {
      const layerNumber = ages.length - index; // Reverse: 9, 8, 7, ..., 1
      const radius = MIN_RADIUS + (index * RADIUS_STEP);
      const zIndex = layerNumber; // Layer 9 has z-index 9, Layer 1 has z-index 1
      
      return {
        age,
        layerIndex: layerNumber,
        radius,
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
      setExpandedLayer(null);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
    } else {
      // Expand the layer
      setExpandedLayer(layerCard.layerIndex);
      onAgeSelect(layerCard.age);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
    }
  };

  const handleCloseExpanded = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setExpandedLayer(null);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  // Get the maximum radius for full expansion
  const getMaxRadius = () => {
    if (!containerRef.current) return 800;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(rect.width, rect.height) + 200; // Extra padding for full coverage
  };

  // Age names for display
  const getAgeDisplayName = (age: Age): string => {
    return age.name || age.title || `Age ${age.age_number}`;
  };

  return (
    <div className={`layered-timeline-interface ${className}`} ref={containerRef}>
      {/* Background */}
      <div className="timeline-background" />
      
      {/* Layer Cards Container */}
      <div className="layer-cards-container">
        <svg 
          width={CONTAINER_WIDTH}
          height={CONTAINER_HEIGHT}
          viewBox={`0 0 ${CONTAINER_WIDTH} ${CONTAINER_HEIGHT}`}
          className="layers-svg"
          style={{ 
            position: expandedLayer ? 'fixed' : 'relative',
            top: expandedLayer ? 0 : 'auto',
            left: expandedLayer ? 0 : 'auto',
            width: expandedLayer ? '100vw' : CONTAINER_WIDTH,
            height: expandedLayer ? '100vh' : CONTAINER_HEIGHT,
            zIndex: expandedLayer ? 1000 : 'auto',
            transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <defs>
            {/* Enhanced glassy effect filters */}
            <filter id="layerGlass" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.2 0"/>
              <feOffset in="blur" dx="0" dy="4" result="offset"/>
              <feMerge>
                <feMergeNode in="offset"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="layerShadow" x="-100%" y="-100%" width="300%" height="300%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.3" floodColor="#CEB548"/>
            </filter>

            {/* Enhanced gradient definitions */}
            <radialGradient id="layer1Gradient" cx="0.3" cy="0.2">
              <stop offset="0%" stopColor="rgba(206, 181, 72, 0.25)" />
              <stop offset="30%" stopColor="rgba(206, 181, 72, 0.15)" />
              <stop offset="70%" stopColor="rgba(206, 181, 72, 0.08)" />
              <stop offset="100%" stopColor="rgba(206, 181, 72, 0.03)" />
            </radialGradient>
            
            <radialGradient id="layer2Gradient" cx="0.3" cy="0.2">
              <stop offset="0%" stopColor="rgba(206, 181, 72, 0.22)" />
              <stop offset="30%" stopColor="rgba(206, 181, 72, 0.12)" />
              <stop offset="70%" stopColor="rgba(206, 181, 72, 0.06)" />
              <stop offset="100%" stopColor="rgba(206, 181, 72, 0.02)" />
            </radialGradient>
            
            <radialGradient id="layer3Gradient" cx="0.3" cy="0.2">
              <stop offset="0%" stopColor="rgba(206, 181, 72, 0.18)" />
              <stop offset="30%" stopColor="rgba(206, 181, 72, 0.10)" />
              <stop offset="70%" stopColor="rgba(206, 181, 72, 0.05)" />
              <stop offset="100%" stopColor="rgba(206, 181, 72, 0.01)" />
            </radialGradient>
            
            {/* Continue patterns for all 9 layers */}
            {[4, 5, 6, 7, 8, 9].map(layerNum => {
              const opacity = Math.max(0.15 - (layerNum - 4) * 0.02, 0.05);
              return (
                <radialGradient key={`layer${layerNum}Gradient`} id={`layer${layerNum}Gradient`} cx="0.3" cy="0.2">
                  <stop offset="0%" stopColor={`rgba(206, 181, 72, ${opacity})`} />
                  <stop offset="30%" stopColor={`rgba(206, 181, 72, ${opacity * 0.6})`} />
                  <stop offset="70%" stopColor={`rgba(206, 181, 72, ${opacity * 0.3})`} />
                  <stop offset="100%" stopColor={`rgba(206, 181, 72, ${opacity * 0.1})`} />
                </radialGradient>
              );
            })}
          </defs>

          {/* Render layer cards from bottom to top (largest to smallest z-index) */}
          {layerCards.map((layer) => {
            const isExpanded = expandedLayer === layer.layerIndex;
            const isOtherExpanded = expandedLayer !== null && expandedLayer !== layer.layerIndex;
            const isSelected = selectedAge?.id === layer.age.id;
            
            // Calculate dynamic radius for expansion
            const displayRadius = isExpanded ? getMaxRadius() : layer.radius;
            const gradientId = `layer${Math.min(layer.layerIndex, 3)}Gradient`;
            
            return (
              <g 
                key={`layer-${layer.layerIndex}`}
                className={`layer-card ${
                  isExpanded ? 'expanded' : ''
                } ${isOtherExpanded ? 'hidden' : ''} ${isSelected ? 'selected' : ''}`}
                style={{
                  zIndex: isExpanded ? 1000 : layer.zIndex,
                  cursor: isAnimating ? 'wait' : 'pointer',
                  opacity: isOtherExpanded ? 0 : 1,
                  transition: 'opacity 0.6s ease'
                }}
                onClick={() => !isAnimating && handleLayerClick(layer)}
              >
                {/* Main layer card with TRUE 3D depth */}
                <path
                  d={`
                    M ${CENTER_X} ${CENTER_Y - displayRadius}
                    A ${displayRadius} ${displayRadius} 0 0 1 ${CENTER_X} ${CENTER_Y + displayRadius}
                    L ${CENTER_X} ${CENTER_Y}
                    Z
                  `}
                  fill={`url(#${gradientId})`}
                  stroke={GOLD}
                  strokeWidth={isSelected ? "4" : isExpanded ? "6" : "2"}
                  strokeOpacity={isExpanded ? "1" : "0.6"}
                  filter="url(#layerGlass)"
                  className="layer-path"
                  style={{
                    transform: `translateZ(${layer.zIndex * 10}px)`,
                    transformStyle: 'preserve-3d',
                    transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
                
                {/* Enhanced border with 3D effect */}
                <path
                  d={`
                    M ${CENTER_X} ${CENTER_Y - displayRadius}
                    A ${displayRadius} ${displayRadius} 0 0 1 ${CENTER_X} ${CENTER_Y + displayRadius}
                  `}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth={isExpanded ? "3" : "1"}
                  strokeOpacity={isExpanded ? "1" : "0.8"}
                  filter="url(#layerShadow)"
                  className="layer-highlight"
                  style={{
                    transform: `translateZ(${layer.zIndex * 10 + 5}px)`,
                    transformStyle: 'preserve-3d',
                    transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />

                {/* Age label - positioned dynamically during expansion */}
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
                    opacity="0.9"
                    className="layer-label"
                    style={{
                      transform: `translateZ(${layer.zIndex * 10 + 10}px)`,
                      transformStyle: 'preserve-3d',
                      transition: 'all 0.8s ease'
                    }}
                  >
                    {getAgeDisplayName(layer.age)}
                  </text>
                )}
                
                {/* Layer number indicator */}
                {!isExpanded && (
                  <g style={{
                    transform: `translateZ(${layer.zIndex * 10 + 15}px)`,
                    transformStyle: 'preserve-3d'
                  }}>
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
              transform: 'translateZ(100px)',
              transformStyle: 'preserve-3d',
              boxShadow: `0 0 30px ${GOLD}40, 0 0 60px ${GOLD}20`,
              transition: 'all 0.8s ease'
            }}
          />
        )}
      </div>

      {/* Expanded Content - rendered as overlay within the expanded layer */}
      {expandedLayer && selectedAge && (
        <div className="expanded-layer-content">
          <button 
            className="close-expanded-btn"
            onClick={handleCloseExpanded}
            disabled={isAnimating}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          
          <div className="expanded-age-content">
            <AgeDetailPanel 
              age={selectedAge}
              onClose={handleCloseExpanded}
              isExpanded={true}
              className="expanded-age-panel"
            />
          </div>
        </div>
      )}
      
      {/* Instructions */}
      {!expandedLayer && (
        <div className="instructions-panel">
          <h3>Layered Timeline Interface</h3>
          <p>Click on any glassy layer to watch it expand and cover the page.</p>
          <p>Layers are truly stacked with 3D depth - newest on top.</p>
          <div className="features">
            <span className="feature">🌟 3D Layered Stacking</span>
            <span className="feature">📈 Radius Expansion Animation</span>
            <span className="feature">✨ Glass Morphism Effects</span>
          </div>
        </div>
      )}
    </div>
  );
};