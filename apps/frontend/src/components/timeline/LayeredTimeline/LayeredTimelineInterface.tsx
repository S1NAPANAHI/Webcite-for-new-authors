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
      const layerNumber = index + 1; // 1-9
      const radius = MIN_RADIUS + (index * RADIUS_STEP);
      const zIndex = 9 - index; // Layer 1 (first age) has highest z-index (9)
      
      return {
        age,
        layerIndex: layerNumber,
        radius,
        zIndex
      };
    });

    setLayerCards(layers.reverse()); // Reverse so Layer 9 is first in array (bottom)
  }, [ages]);

  const handleLayerClick = async (layerCard: LayerCard) => {
    if (isAnimating) return;

    setIsAnimating(true);
    
    if (expandedLayer === layerCard.layerIndex) {
      // Collapse the layer
      setExpandedLayer(null);
      onAgeSelect(layerCard.age); // Keep selection but collapse
    } else {
      // Expand the layer
      setExpandedLayer(layerCard.layerIndex);
      onAgeSelect(layerCard.age);
    }

    // Animation duration
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const handleCloseExpanded = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setExpandedLayer(null);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  // Create the semi-circular clip path for each layer
  const createLayerClipPath = (radius: number) => {
    const centerX = CENTER_X;
    const centerY = CENTER_Y;
    
    // Create a semi-circular path (right half)
    return `polygon(${centerX}px ${centerY - radius}px, ${centerX + radius}px ${centerY}px, ${centerX}px ${centerY + radius}px)`;
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
        >
          <defs>
            {/* Glassy effect filters */}
            <filter id="glassy-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur"/>
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0"/>
            </filter>
            
            <filter id="inner-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>

            {/* Gradient definitions */}
            <radialGradient id="glassGradient" cx="0.5" cy="0.3">
              <stop offset="0%" stopColor="rgba(206, 181, 72, 0.15)" />
              <stop offset="50%" stopColor="rgba(206, 181, 72, 0.08)" />
              <stop offset="100%" stopColor="rgba(206, 181, 72, 0.03)" />
            </radialGradient>

            {/* Clip paths for each layer */}
            {layerCards.map((layer) => {
              const centerX = CENTER_X;
              const centerY = CENTER_Y;
              const radius = layer.radius;
              
              return (
                <clipPath key={`layer-clip-${layer.layerIndex}`} id={`layer-clip-${layer.layerIndex}`}>
                  <path d={`
                    M ${centerX} ${centerY - radius}
                    A ${radius} ${radius} 0 0 1 ${centerX} ${centerY + radius}
                    L ${centerX} ${centerY}
                    Z
                  `} />
                </clipPath>
              );
            })}
          </defs>

          {/* Render layer cards from bottom to top */}
          {layerCards.map((layer) => {
            const isExpanded = expandedLayer === layer.layerIndex;
            const isOtherExpanded = expandedLayer !== null && expandedLayer !== layer.layerIndex;
            const isSelected = selectedAge?.id === layer.age.id;
            
            return (
              <g 
                key={`layer-${layer.layerIndex}`}
                className={`layer-card ${
                  isExpanded ? 'expanded' : ''
                } ${isOtherExpanded ? 'dimmed' : ''} ${isSelected ? 'selected' : ''}`}
                style={{
                  zIndex: isExpanded ? 1000 : layer.zIndex,
                  cursor: isAnimating ? 'wait' : 'pointer'
                }}
                onClick={() => handleLayerClick(layer)}
              >
                {/* Main layer card */}
                <path
                  d={`
                    M ${CENTER_X} ${CENTER_Y - layer.radius}
                    A ${layer.radius} ${layer.radius} 0 0 1 ${CENTER_X} ${CENTER_Y + layer.radius}
                    L ${CENTER_X} ${CENTER_Y}
                    Z
                  `}
                  fill="url(#glassGradient)"
                  stroke={GOLD}
                  strokeWidth={isSelected ? "3" : "2"}
                  strokeOpacity={isOtherExpanded ? "0.3" : "0.6"}
                  fillOpacity={isOtherExpanded ? "0.2" : "0.4"}
                  filter="url(#glassy-blur)"
                  className="layer-path"
                />
                
                {/* Layer border highlight */}
                <path
                  d={`
                    M ${CENTER_X} ${CENTER_Y - layer.radius}
                    A ${layer.radius} ${layer.radius} 0 0 1 ${CENTER_X} ${CENTER_Y + layer.radius}
                  `}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth="1"
                  strokeOpacity={isOtherExpanded ? "0.2" : "0.8"}
                  filter="url(#inner-glow)"
                  className="layer-highlight"
                />

                {/* Age label */}
                <text
                  x={CENTER_X + layer.radius * 0.7}
                  y={CENTER_Y}
                  fill={GOLD}
                  fontSize={isSelected ? "18" : "16"}
                  fontFamily="Papyrus, Comic Sans MS, fantasy, cursive"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                  opacity={isOtherExpanded ? "0.4" : "0.9"}
                  className="layer-label"
                >
                  {getAgeDisplayName(layer.age)}
                </text>
                
                {/* Layer number indicator */}
                <circle
                  cx={CENTER_X + layer.radius - 20}
                  cy={CENTER_Y - layer.radius + 20}
                  r="12"
                  fill={GOLD}
                  fillOpacity={isOtherExpanded ? "0.3" : "0.7"}
                  className="layer-number-bg"
                />
                <text
                  x={CENTER_X + layer.radius - 20}
                  y={CENTER_Y - layer.radius + 20}
                  fill="#1a1a1a"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                  opacity={isOtherExpanded ? "0.5" : "1"}
                  className="layer-number"
                >
                  {layer.layerIndex}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Central Sun */}
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
            zIndex: 999,
            pointerEvents: 'none',
            opacity: expandedLayer ? '0.3' : '1',
            transition: 'opacity 0.8s ease'
          }}
        />
      </div>

      {/* Expanded Layer Content */}
      {expandedLayer && (
        <div className={`expanded-layer-overlay ${isAnimating ? 'animating' : ''}`}>
          <div className="expanded-content">
            <button 
              className="close-expanded-btn"
              onClick={handleCloseExpanded}
              disabled={isAnimating}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            
            {selectedAge && (
              <AgeDetailPanel 
                age={selectedAge}
                onClose={handleCloseExpanded}
                isExpanded={true}
              />
            )}
          </div>
        </div>
      )}
      
      {/* Instructions */}
      {!expandedLayer && (
        <div className="instructions-panel">
          <h3>Layered Timeline Interface</h3>
          <p>Click on any glassy layer to explore that age in detail.</p>
          <p>Layers are stacked with the most recent age on top.</p>
        </div>
      )}
    </div>
  );
};