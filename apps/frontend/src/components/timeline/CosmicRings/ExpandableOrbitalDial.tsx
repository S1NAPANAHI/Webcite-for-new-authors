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
  const [showContent, setShowContent] = useState(false);
  const [viewportDimensions, setViewportDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants for VERTICAL half-circle design (top to bottom on left side)
  const GOLD = '#CEB548';
  const SVG_SIZE = 800;
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

  const handlePlanetClick = (planet: OrbitingPlanet, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (isAnimating) return;

    console.log(`Planet ${planet.ageIndex + 1} clicked:`, planet.age.name);
    
    setIsAnimating(true);
    
    if (expandedAge?.id === planet.age.id) {
      // Collapse current expanded age
      setShowContent(false);
      setTimeout(() => {
        setExpandedAge(null);
        setTimeout(() => {
          setIsAnimating(false);
        }, 1200);
      }, 200);
    } else {
      // Expand clicked age
      setExpandedAge(planet.age);
      onAgeSelect(planet.age);
      
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
      setExpandedAge(null);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
    }, 200);
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

  // Create expandable semicircle path for the expanded age
  const createExpandableSemicirclePath = (radius: number) => {
    const startX = CENTER_X;
    const startY = CENTER_Y - radius;
    const endX = CENTER_X;
    const endY = CENTER_Y + radius;
    
    // Create full semicircle path for expansion
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

  const maxRadius = getMaxRadius();

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
            
            {/* Gradient for expanded age */}
            <radialGradient id="expanded-age-gradient" cx="0.1" cy="0.5" r="0.8">
              <stop offset="0%" stopColor="rgba(206, 181, 72, 0.15)" />
              <stop offset="30%" stopColor="rgba(206, 181, 72, 0.08)" />
              <stop offset="70%" stopColor="rgba(206, 181, 72, 0.03)" />
              <stop offset="100%" stopColor="rgba(15, 15, 20, 0.95)" />
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

          {/* Expanded age semicircle - render first so it's behind everything */}
          {expandedAge && expandedPlanet && (
            <g className={`expanded-age-layer ${showContent ? 'visible' : ''}`}>
              <path
                d={createExpandableSemicirclePath(maxRadius)}
                fill="url(#expanded-age-gradient)"
                stroke={GOLD}
                strokeWidth="2"
                strokeOpacity="0.8"
                className="expanded-semicircle"
                data-age={expandedPlanet.ageIndex}
              />
            </g>
          )}

          {/* Regular orbit lines and text - hidden when expanded */}
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

              {/* Static text integrated into orbit lines */}
              {orbitingPlanets.map((planet, index) => (
                <text
                  key={`orbit-text-${index}`}
                  fontSize="20"
                  fontFamily="Papyrus, Comic Sans MS, fantasy, cursive"
                  fill={GOLD}
                  fontWeight="bold"
                  className="orbit-text static papyrus positioned"
                  letterSpacing="0.08em"
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

          {/* CLIPPED GROUP: Planets with smooth masking transition */}
          <g clipPath="url(#rightHalfClip)">
            {/* MOVING Planets - hide when that age is expanded */}
            {orbitingPlanets.map((planet, index) => {
              if (expandedAge?.id === planet.age.id) return null; // Hide expanded planet
              
              const position = calculatePlanetPosition(index);
              const selected = isSelected(planet);
              
              return (
                <g key={`planet-group-${index}`}>
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={NODE_RADIUS}
                    fill={GOLD}
                    className={`planet-node moving expandable ${selected ? 'selected' : ''}`}
                    onClick={(e) => handlePlanetClick(planet, e)}
                    style={{ cursor: 'pointer' }}
                  />
                  
                  {/* Selection ring */}
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
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Content overlay - appears within expanded semicircle */}
      {expandedAge && expandedPlanet && (
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
              <h1 className="age-title">{getAgeDisplayName(expandedAge)}</h1>
              
              <div className="age-meta">
                <span className="years">
                  {expandedAge.start_year || '∞'} - {expandedAge.end_year || '∞'}
                </span>
                <span className="age-num">Age {expandedPlanet.ageIndex + 1}</span>
                <span className="events-count">{events.length} Events</span>
              </div>
              
              <p className="age-desc">{expandedAge.description}</p>
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

      {/* Age info panel - only show when not expanded */}
      {selectedAge && !expandedAge && (
        <div className="selected-age-info vertical improved">
          <h3 className="age-title papyrus">{selectedAge.name || selectedAge.title}</h3>
          <p className="age-years papyrus">
            {selectedAge.start_year ? `${selectedAge.start_year}` : '∞'} - {selectedAge.end_year || '∞'}
          </p>
          <p className="age-description papyrus">
            {selectedAge.description?.substring(0, 150)}...
          </p>
        </div>
      )}

      {/* Instructions - only show when not expanded */}
      {!expandedAge && (
        <div className="instructions expanded-capable">
          <h3>Orbital Timeline</h3>
          <p>Click any golden planet to expand its age across the page.</p>
          <div className="tips">
            <span>🪐 Click planets to expand ages</span>
            <span>☀️ Golden sun at center</span>
            <span>📜 Age names along orbital paths</span>
            <span>✨ Smooth expansion animations</span>
          </div>
        </div>
      )}
    </div>
  );
};