import React, { useEffect, useState, useRef } from 'react';
import { Age } from '../../../lib/api-timeline';
import { useEventsByAge } from '../hooks/useTimelineData';
import './expandable-orbital.css';

export interface ExpandableOrbitalDialProps {
  ages: Age[];
  selectedAge?: Age | null;
  onAgeSelect: (age: Age) => void;
  className?: string;
}

interface OrbitingPlanet {
  age: Age;
  orbitRadius: number;
  angle: number;
  speed: number;
  size: number;
  planetType: string;
  initialAngle: number;
  ageIndex: number;
}

export const ExpandableOrbitalDial: React.FC<ExpandableOrbitalDialProps> = ({
  ages,
  selectedAge,
  onAgeSelect,
  className = ''
}) => {
  const [orbitingPlanets, setOrbitingPlanets] = useState<OrbitingPlanet[]>([]);
  const [planetAngles, setPlanetAngles] = useState<number[]>([]);
  const [expandedAge, setExpandedAge] = useState<Age | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewportDimensions, setViewportDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants for VERTICAL half-circle design (top to bottom on left side)
  const GOLD = '#CEB548';
  const CENTER_X = 80; // Left side position
  const CENTER_Y = 400; // Vertical center
  const SUN_RADIUS = 24;
  const NODE_RADIUS = 16;
  
  // IMPROVED SPACING: More center padding and even gaps
  const MIN_ORBIT_RADIUS = 72;
  const ORBIT_STEP = 44;
  
  // Animation speed constants
  const FULL_CIRCLE = 2 * Math.PI;
  const BASE_SPEED = 0.008;
  const HIDDEN_SPEED_MULTIPLIER = 3;
  
  // EXTENDED speed zone constants (+10° on each side)
  const NORMAL_SPEED_START = (340 * Math.PI) / 180;
  const NORMAL_SPEED_END = (200 * Math.PI) / 180;

  // Age names for text rotation
  const ageNames = [
    'First Age', 'Second Age', 'Third Age', 'Fourth Age', 'Fifth Age',
    'Sixth Age', 'Seventh Age', 'Eighth Age', 'Ninth Age'
  ];

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

  // Initialize orbiting planets with randomized starting positions
  useEffect(() => {
    if (ages.length === 0) return;

    const planets: OrbitingPlanet[] = ages.map((age, index) => {
      // Randomize initial position along the FULL orbit (0 to 2π)
      const randomStartAngle = Math.random() * 2 * Math.PI;
      
      return {
        age,
        orbitRadius: MIN_ORBIT_RADIUS + (index * ORBIT_STEP),
        angle: randomStartAngle,
        speed: 0.015 + (index * 0.003),
        size: NODE_RADIUS,
        planetType: ageNames[index] || `${age.age_number} Age`,
        initialAngle: randomStartAngle,
        ageIndex: index
      };
    });

    setOrbitingPlanets(planets);
    // Initialize angles array
    setPlanetAngles(planets.map(p => p.initialAngle));
  }, [ages]);

  // Animation loop with EXTENDED normal speed zone logic
  useEffect(() => {
    let animationId: number;
    
    // Only animate if not expanded
    if (expandedAge) {
      return;
    }
    
    const animate = () => {
      setPlanetAngles(prevAngles => 
        prevAngles.map((angle) => {
          // Normalize angle to 0 to 2π range
          let normalizedAngle = (angle % FULL_CIRCLE + FULL_CIRCLE) % FULL_CIRCLE;
          
          // Check if planet is in NORMAL SPEED range
          const isInNormalSpeedRange = (normalizedAngle >= NORMAL_SPEED_START) || (normalizedAngle <= NORMAL_SPEED_END);
          
          // Apply appropriate speed based on position
          let delta;
          if (isInNormalSpeedRange) {
            delta = BASE_SPEED;
          } else {
            delta = BASE_SPEED * HIDDEN_SPEED_MULTIPLIER;
          }

          // Apply clockwise rotation (positive delta)
          return angle + delta;
        })
      );
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [expandedAge]);

  // Updated to handle text clicks for semicircle expansion
  const handleTextClick = (planet: OrbitingPlanet, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (isAnimating) return;

    console.log(`Text for ${planet.ageIndex + 1} clicked:`, planet.age.name);
    
    setIsAnimating(true);
    onAgeSelect(planet.age);
    
    if (expandedAge?.id === planet.age.id) {
      // Collapse current expanded age
      setExpandedAge(null);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
    } else {
      // Expand clicked age
      setExpandedAge(planet.age);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
    }
  };

  const handleCloseExpanded = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setExpandedAge(null);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  // Calculate position for FULL orbit with current angle from state
  const calculatePlanetPosition = (planetIndex: number) => {
    if (!planetAngles[planetIndex] || !orbitingPlanets[planetIndex]) {
      return { x: CENTER_X, y: CENTER_Y, angle: 0 };
    }
    
    const planet = orbitingPlanets[planetIndex];
    const currentAngle = planetAngles[planetIndex];
    
    // Convert full orbit to our coordinate system
    const displayAngle = currentAngle - Math.PI / 2;
    
    const x = CENTER_X + Math.cos(displayAngle) * planet.orbitRadius;
    const y = CENTER_Y + Math.sin(displayAngle) * planet.orbitRadius;
    
    return { x, y, angle: displayAngle };
  };

  // Create VERTICAL half-circle arc path (top to bottom, opening right)
  const createVerticalHalfCirclePath = (radius: number) => {
    const startX = CENTER_X;
    const startY = CENTER_Y - radius; // Top point
    const endX = CENTER_X;
    const endY = CENTER_Y + radius; // Bottom point
    
    // Vertical half-circle arc opening to the RIGHT
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  };

  // Create segmented orbit path with DYNAMIC text-sized cut-outs
  const createSegmentedOrbitPath = (radius: number, textContent: string) => {
    const avgCharWidth = 12;
    const letterSpacing = 0.08;
    const approxTextWidth = textContent.length * avgCharWidth * (1 + letterSpacing);
    
    const arcLength = approxTextWidth + 20;
    const textSegmentAngle = arcLength / radius;
    
    const textCenterAngle = 0;
    
    const startAngle = -Math.PI / 2;
    const endAngle = Math.PI / 2;
    const textStartAngle = textCenterAngle - textSegmentAngle / 2;
    const textEndAngle = textCenterAngle + textSegmentAngle / 2;
    
    const startX = CENTER_X + Math.cos(startAngle) * radius;
    const startY = CENTER_Y + Math.sin(startAngle) * radius;
    const cutStartX = CENTER_X + Math.cos(textStartAngle) * radius;
    const cutStartY = CENTER_Y + Math.sin(textStartAngle) * radius;
    const cutEndX = CENTER_X + Math.cos(textEndAngle) * radius;
    const cutEndY = CENTER_Y + Math.sin(textEndAngle) * radius;
    const endX = CENTER_X + Math.cos(endAngle) * radius;
    const endY = CENTER_Y + Math.sin(endAngle) * radius;
    
    return {
      beforeText: `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${cutStartX} ${cutStartY}`,
      afterText: `M ${cutEndX} ${cutEndY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`
    };
  };

  // Create semicircle layer path for stacking
  const createSemicircleLayerPath = (radius: number) => {
    const startX = CENTER_X;
    const startY = CENTER_Y - radius;
    const endX = CENTER_X;
    const endY = CENTER_Y + radius;
    
    // Create filled semicircle path
    return `
      M ${startX} ${startY}
      A ${radius} ${radius} 0 0 1 ${endX} ${endY}
      L ${CENTER_X} ${CENTER_Y}
      Z
    `;
  };

  const isSelected = (planet: OrbitingPlanet) => {
    return selectedAge?.id === planet.age.id;
  };

  const isExpanded = (planet: OrbitingPlanet) => {
    return expandedAge?.id === planet.age.id;
  };

  // Get expanded planet data
  const expandedPlanet = expandedAge ? orbitingPlanets.find(p => p.age.id === expandedAge.id) : null;
  const { events, loading, error } = useEventsByAge(expandedAge?.id || '');

  const getAgeDisplayName = (age: Age): string => {
    return age.name || age.title || `Age ${age.age_number}` || 'Unknown Age';
  };

  // Render expanded content inside the semicircle
  const renderExpandedContent = () => {
    if (!expandedAge || !expandedPlanet) return null;
    return (
      <div className="semicircle-content">
        <button className="close-button" onClick={handleCloseExpanded}>
          ×
        </button>
        <h2>{getAgeDisplayName(expandedAge)}</h2>
        <p className="age-duration">
          {expandedAge.start_year || '∞'} – {expandedAge.end_year || '∞'}
        </p>
        <p className="age-description">{expandedAge.description}</p>
        
        {/* Events list */}
        {events.length > 0 && (
          <div className="age-events">
            <h3>Timeline Events</h3>
            <ul>
              {events.slice(0, 6).map((event, index) => (
                <li key={event.id}>
                  <strong>{new Date(event.date).getFullYear()}:</strong> {event.title}
                  <p>{event.description?.substring(0, 100)}...</p>
                </li>
              ))}
            </ul>
            {events.length > 6 && (
              <p className="more-events-note">+{events.length - 6} more events...</p>
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
    );
  };

  return (
    <div className={`expandable-orbital-dial ${className} ${expandedAge ? 'has-expanded' : ''}`} ref={containerRef}>
      <div className="orbital-background" />
      
      <div className="orbital-container">
        <svg 
          width={viewportDimensions.width}
          height={viewportDimensions.height}
          viewBox={`0 0 ${viewportDimensions.width} ${viewportDimensions.height}`}
          className="orbital-svg expandable"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <defs>
            {/* Define paths for textPath */}
            {orbitingPlanets.map((planet, index) => (
              <path
                key={`textpath-${index}`}
                id={`expandable-orbit-path-${index}`}
                d={createVerticalHalfCirclePath(planet.orbitRadius)}
                fill="none"
              />
            ))}
            
            {/* SUBTLE CHALKY TEXTURE FILTER */}
            <filter id="subtleChalkyTexture" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.02" 
                numOctaves="2" 
                result="noise"
              />
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale="0.8"
                result="displacement"
              />
            </filter>
            
            {/* Gradients for semicircle layers */}
            {orbitingPlanets.map((planet, index) => (
              <radialGradient 
                key={`layer-gradient-${index}`}
                id={`layer-gradient-${index}`} 
                cx="0.1" 
                cy="0.5" 
                r="0.8"
              >
                <stop offset="0%" stopColor={`rgba(206, 181, 72, ${0.02 + (index * 0.01)})`} />
                <stop offset="50%" stopColor={`rgba(206, 181, 72, ${0.01 + (index * 0.005)})`} />
                <stop offset="100%" stopColor="rgba(15, 15, 20, 0.1)" />
              </radialGradient>
            ))}
            
            {/* Expanded age gradient */}
            <radialGradient id="semicircleExpandGrad" cx="50%" cy="80%" r="80%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#ffd700" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.8" />
            </radialGradient>
            
            {/* CLIPPING: Extended clip path to cover orbit line overflow */}
            <clipPath id="rightHalfClip">
              <rect 
                x={CENTER_X - 4}
                y={0} 
                width={viewportDimensions.width - (CENTER_X - 4)}
                height={viewportDimensions.height} 
                fill="white"
              />
            </clipPath>
          </defs>

          {/* SEMICIRCLE LAYERS - Stacked underneath orbital elements */}
          <g className="semicircle-layers">
            {orbitingPlanets.map((planet, index) => {
              const isThisExpanded = expandedAge?.id === planet.age.id;
              const layerRadius = planet.orbitRadius;
              
              return (
                <g key={`semicircle-layer-${index}`} className="semicircle-layer-group">
                  <path
                    d={createSemicircleLayerPath(layerRadius)}
                    fill={isThisExpanded ? "url(#semicircleExpandGrad)" : `url(#layer-gradient-${index})`}
                    stroke={GOLD}
                    strokeWidth={isThisExpanded ? "6" : "1"}
                    strokeOpacity={isThisExpanded ? "0.8" : "0.2"}
                    className={`semicircle-layer ${isThisExpanded ? 'expanded' : ''}`}
                    data-age-index={index}
                    style={{
                      transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
                      zIndex: 9 - index, // 9th age (index 8) has lowest z-index, 1st age (index 0) has highest
                      transition: "all 1.2s cubic-bezier(0.61, 0.25, 0.54, 1.45)",
                      transform: isThisExpanded ? "scale(8.5, 6.5)" : "scale(1)",
                      filter: isThisExpanded ? "drop-shadow(0 0 64px #ffd700)" : "none",
                      opacity: expandedAge ? (isThisExpanded ? 1 : 0.07) : 1,
                      cursor: isThisExpanded ? "auto" : "pointer"
                    }}
                    onClick={() => {
                      if (!expandedAge) {
                        handleTextClick(planet, { stopPropagation: () => {} } as React.MouseEvent);
                      }
                    }}
                  />

                  {/* Expanded content inside the semicircle */}
                  {isThisExpanded && (
                    <foreignObject
                      x={-layerRadius * 6.5}
                      y={-layerRadius * 2.45}
                      width={layerRadius * 13}
                      height={layerRadius * 5}
                      style={{
                        zIndex: 99,
                        pointerEvents: 'auto'
                      }}
                    >
                      {renderExpandedContent()}
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </g>

          {/* Regular orbit lines and text - above the semicircle layers but hidden when expanded */}
          {!expandedAge && (
            <g className="orbital-elements">
              {/* Orbit lines with DYNAMIC text-sized cut-outs */}
              {orbitingPlanets.map((planet, index) => {
                const segments = createSegmentedOrbitPath(planet.orbitRadius, planet.planetType);
                return (
                  <g key={`orbit-segments-${index}`}>
                    <path
                      d={segments.beforeText}
                      stroke={GOLD}
                      strokeWidth={3}
                      fill="none"
                      className="orbit-line static high-quality"
                      strokeLinecap="round"
                      filter="url(#subtleChalkyTexture)"
                      vectorEffect="non-scaling-stroke"
                      shapeRendering="geometricPrecision"
                    />
                    <path
                      d={segments.afterText}
                      stroke={GOLD}
                      strokeWidth={3}
                      fill="none"
                      className="orbit-line static high-quality"
                      strokeLinecap="round"
                      filter="url(#subtleChalkyTexture)"
                      vectorEffect="non-scaling-stroke"
                      shapeRendering="geometricPrecision"
                    />
                  </g>
                );
              })}

              {/* CLICKABLE text integrated into orbit lines */}
              {orbitingPlanets.map((planet, index) => (
                <text
                  key={`orbit-text-${index}`}
                  fontSize="20"
                  fontFamily="Papyrus, Comic Sans MS, fantasy, cursive"
                  fill={GOLD}
                  fontWeight="bold"
                  className="orbit-text static papyrus positioned clickable-text"
                  letterSpacing="0.08em"
                  onClick={(e) => handleTextClick(planet, e)}
                  style={{ cursor: 'pointer' }}
                >
                  <textPath
                    href={`#expandable-orbit-path-${index}`}
                    startOffset="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                  >
                    {planet.planetType}
                  </textPath>
                </text>
              ))}
            </g>
          )}

          {/* Central Sun - hide when expanded */}
          {!expandedAge && (
            <circle
              cx={CENTER_X}
              cy={CENTER_Y}
              r={SUN_RADIUS}
              fill={GOLD}
              className="central-sun-flat static"
            />
          )}

          {/* CLIPPED GROUP: Planets with smooth masking transition - NON-CLICKABLE */}
          <g clipPath="url(#rightHalfClip)">
            {/* MOVING Planets - hide when that age is expanded, NON-INTERACTIVE */}
            {!expandedAge && orbitingPlanets.map((planet, index) => {
              const position = calculatePlanetPosition(index);
              const selected = isSelected(planet);
              
              return (
                <g key={`planet-group-${index}`}>
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={NODE_RADIUS}
                    fill={GOLD}
                    className={`planet-node moving non-clickable ${selected ? 'selected' : ''}`}
                    style={{ pointerEvents: 'none', cursor: 'default' }}
                  />
                  
                  {/* Selection ring - also non-clickable */}
                  {selected && (
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={NODE_RADIUS + 6}
                      stroke={GOLD}
                      strokeWidth={2}
                      fill="none"
                      className="selection-ring moving"
                      opacity="0.8"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};