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

  // Constants for VERTICAL half-circle design
  const GOLD = '#CEB548';
  const CENTER_X = 80;
  const CENTER_Y = 400;
  const SUN_RADIUS = 24;
  const NODE_RADIUS = 16;
  
  // Improved spacing for better stacking
  const MIN_ORBIT_RADIUS = 72;
  const ORBIT_STEP = 44;
  
  // Animation constants
  const FULL_CIRCLE = 2 * Math.PI;
  const BASE_SPEED = 0.008;
  const HIDDEN_SPEED_MULTIPLIER = 3;
  
  const NORMAL_SPEED_START = (340 * Math.PI) / 180;
  const NORMAL_SPEED_END = (200 * Math.PI) / 180;

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

  // Initialize orbiting planets
  useEffect(() => {
    if (ages.length === 0) return;

    const planets: OrbitingPlanet[] = ages.map((age, index) => {
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
    setPlanetAngles(planets.map(p => p.initialAngle));
  }, [ages]);

  // Animation loop - pause when expanded
  useEffect(() => {
    let animationId: number;
    
    if (expandedAge) return;
    
    const animate = () => {
      setPlanetAngles(prevAngles => 
        prevAngles.map((angle) => {
          let normalizedAngle = (angle % FULL_CIRCLE + FULL_CIRCLE) % FULL_CIRCLE;
          const isInNormalSpeedRange = (normalizedAngle >= NORMAL_SPEED_START) || (normalizedAngle <= NORMAL_SPEED_END);
          
          let delta = isInNormalSpeedRange ? BASE_SPEED : BASE_SPEED * HIDDEN_SPEED_MULTIPLIER;
          return angle + delta;
        })
      );
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [expandedAge]);

  // ENHANCED: Handle semicircle clicks with smooth expansion
  const handleSemicircleClick = (planet: OrbitingPlanet, event: React.MouseEvent) => {
    event.stopPropagation();
    if (isAnimating) return;

    console.log(`Semicircle ${planet.ageIndex + 1} clicked:`, planet.age.name);
    
    setIsAnimating(true);
    onAgeSelect(planet.age);
    
    if (expandedAge?.id === planet.age.id) {
      // Collapse
      setExpandedAge(null);
      setTimeout(() => setIsAnimating(false), 1200);
    } else {
      // Expand with smooth animation
      setExpandedAge(planet.age);
      setTimeout(() => setIsAnimating(false), 1200);
    }
  };

  const handleCloseExpanded = (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (isAnimating) return;
    
    setIsAnimating(true);
    setExpandedAge(null);
    setTimeout(() => setIsAnimating(false), 1200);
  };

  const handleBackgroundClick = () => {
    if (expandedAge && !isAnimating) {
      handleCloseExpanded();
    }
  };

  // Calculate planet positions
  const calculatePlanetPosition = (planetIndex: number) => {
    if (!planetAngles[planetIndex] || !orbitingPlanets[planetIndex]) {
      return { x: CENTER_X, y: CENTER_Y, angle: 0 };
    }
    
    const planet = orbitingPlanets[planetIndex];
    const currentAngle = planetAngles[planetIndex];
    const displayAngle = currentAngle - Math.PI / 2;
    
    const x = CENTER_X + Math.cos(displayAngle) * planet.orbitRadius;
    const y = CENTER_Y + Math.sin(displayAngle) * planet.orbitRadius;
    
    return { x, y, angle: displayAngle };
  };

  // Create semicircle paths
  const createSemicircleLayerPath = (radius: number) => {
    const startX = CENTER_X;
    const startY = CENTER_Y - radius;
    const endX = CENTER_X;
    const endY = CENTER_Y + radius;
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} L ${CENTER_X} ${CENTER_Y} Z`;
  };

  // Create orbit paths for text
  const createVerticalHalfCirclePath = (radius: number) => {
    const startX = CENTER_X;
    const startY = CENTER_Y - radius;
    const endX = CENTER_X;
    const endY = CENTER_Y + radius;
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  };

  // Create segmented orbit paths
  const createSegmentedOrbitPath = (radius: number, textContent: string) => {
    const avgCharWidth = 12;
    const letterSpacing = 0.08;
    const approxTextWidth = textContent.length * avgCharWidth * (1 + letterSpacing);
    const arcLength = approxTextWidth + 20;
    const textSegmentAngle = arcLength / radius;
    
    const startAngle = -Math.PI / 2;
    const endAngle = Math.PI / 2;
    const textCenterAngle = 0;
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

  const { events, loading, error } = useEventsByAge(expandedAge?.id || '');

  const getAgeDisplayName = (age: Age): string => {
    return age.name || age.title || `Age ${age.age_number}` || 'Unknown Age';
  };

  // ENHANCED: Render expanded content overlay
  const renderExpandedContent = () => {
    if (!expandedAge) return null;
    
    return (
      <div className="expanded-age-overlay" onClick={handleBackgroundClick}>
        <div className="expanded-content-container" onClick={(e) => e.stopPropagation()}>
          <button className="close-button-enhanced" onClick={handleCloseExpanded}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          <div className="expanded-content-inner">
            <header className="age-header">
              <h1 className="age-title">{getAgeDisplayName(expandedAge)}</h1>
              <p className="age-duration">
                {expandedAge.start_year || '∞'} – {expandedAge.end_year || '∞'}
              </p>
            </header>
            
            <div className="age-description-section">
              <p className="age-description">{expandedAge.description}</p>
            </div>
            
            <div className="age-events-section">
              {events.length > 0 && (
                <div className="age-events">
                  <h3 className="events-title">Timeline Events</h3>
                  <div className="events-grid">
                    {events.slice(0, 8).map((event) => (
                      <div key={event.id} className="event-card">
                        <div className="event-year">
                          {new Date(event.date).getFullYear()}
                        </div>
                        <div className="event-content">
                          <h4 className="event-title">{event.title}</h4>
                          <p className="event-description">
                            {event.description?.substring(0, 150)}
                            {event.description && event.description.length > 150 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {events.length > 8 && (
                    <p className="more-events-note">
                      +{events.length - 8} more events in this age
                    </p>
                  )}
                </div>
              )}
              
              {events.length === 0 && !loading && (
                <div className="no-events-state">
                  <div className="no-events-icon">📖</div>
                  <h4 className="no-events-title">No Events Recorded</h4>
                  <p className="no-events-description">This age has no timeline events yet.</p>
                </div>
              )}
              
              {loading && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading events...</p>
                </div>
              )}
            </div>
          </div>
        </div>
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
            {/* Text paths */}
            {orbitingPlanets.map((planet, index) => (
              <path
                key={`textpath-${index}`}
                id={`expandable-orbit-path-${index}`}
                d={createVerticalHalfCirclePath(planet.orbitRadius)}
                fill="none"
              />
            ))}
            
            {/* Filters and gradients */}
            <filter id="subtleChalkyTexture" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8"/>
            </filter>
            
            {orbitingPlanets.map((planet, index) => (
              <radialGradient 
                key={`layer-gradient-${index}`}
                id={`layer-gradient-${index}`} 
                cx="0.1" cy="0.5" r="0.8"
              >
                <stop offset="0%" stopColor={`rgba(206, 181, 72, ${0.03 + (index * 0.015)})`} />
                <stop offset="50%" stopColor={`rgba(206, 181, 72, ${0.02 + (index * 0.01)})`} />
                <stop offset="100%" stopColor="rgba(15, 15, 20, 0.2)" />
              </radialGradient>
            ))}
            
            <radialGradient id="semicircleExpandGrad" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#CEB548" stopOpacity="0.7" />
              <stop offset="80%" stopColor="#8B7539" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.9" />
            </radialGradient>
            
            <clipPath id="rightHalfClip">
              <rect 
                x={CENTER_X - 4} y={0} 
                width={viewportDimensions.width - (CENTER_X - 4)}
                height={viewportDimensions.height} 
              />
            </clipPath>
          </defs>

          {/* ENHANCED SEMICIRCLE LAYERS - The main stacked expandable elements */}
          <g className="semicircle-layers">
            {orbitingPlanets.map((planet, index) => {
              const isThisExpanded = expandedAge?.id === planet.age.id;
              const layerRadius = planet.orbitRadius;
              
              // Calculate smooth expansion transform
              const maxRadius = Math.max(viewportDimensions.width, viewportDimensions.height) * 0.8;
              const scaleX = isThisExpanded ? maxRadius / layerRadius : 1;
              const scaleY = isThisExpanded ? maxRadius / layerRadius : 1;
              const translateX = isThisExpanded ? (viewportDimensions.width / 2 - CENTER_X) : 0;
              const translateY = isThisExpanded ? (viewportDimensions.height / 2 - CENTER_Y) : 0;
              
              return (
                <g key={`semicircle-layer-${index}`} className="semicircle-layer-group">
                  <path
                    d={createSemicircleLayerPath(layerRadius)}
                    fill={isThisExpanded ? "url(#semicircleExpandGrad)" : `url(#layer-gradient-${index})`}
                    stroke={GOLD}
                    strokeWidth={isThisExpanded ? "3" : "1.5"}
                    strokeOpacity={isThisExpanded ? "0.8" : "0.3"}
                    className={`semicircle-layer clickable-semicircle ${isThisExpanded ? 'expanded' : ''}`}
                    data-age-index={index}
                    style={{
                      transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
                      zIndex: isThisExpanded ? 999 : (50 - index),
                      transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      transform: isThisExpanded 
                        ? `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})` 
                        : "scale(1)",
                      filter: isThisExpanded 
                        ? "drop-shadow(0 0 80px rgba(255, 215, 0, 0.6))" 
                        : `drop-shadow(0 0 4px rgba(206, 181, 72, ${0.2 + (index * 0.05)}))`,
                      opacity: expandedAge ? (isThisExpanded ? 1 : 0.1) : (0.7 + (index * 0.05)),
                      cursor: expandedAge ? (isThisExpanded ? "auto" : "not-allowed") : "pointer"
                    }}
                    onClick={(e) => {
                      if (!expandedAge || isThisExpanded) {
                        handleSemicircleClick(planet, e);
                      }
                    }}
                  />
                </g>
              );
            })}
          </g>

          {/* Orbital elements - fade when expanded */}
          <g 
            className="orbital-elements"
            style={{
              opacity: expandedAge ? 0 : 1,
              transition: "opacity 0.6s ease",
              pointerEvents: expandedAge ? "none" : "auto"
            }}
          >
            {/* Orbit lines */}
            {orbitingPlanets.map((planet, index) => {
              const segments = createSegmentedOrbitPath(planet.orbitRadius, planet.planetType);
              return (
                <g key={`orbit-segments-${index}`}>
                  <path d={segments.beforeText} stroke={GOLD} strokeWidth={2.5} fill="none" 
                    className="orbit-line static" strokeLinecap="round" />
                  <path d={segments.afterText} stroke={GOLD} strokeWidth={2.5} fill="none" 
                    className="orbit-line static" strokeLinecap="round" />
                </g>
              );
            })}

            {/* Age text labels */}
            {orbitingPlanets.map((planet, index) => (
              <text
                key={`orbit-text-${index}`}
                fontSize="18"
                fontFamily="Papyrus, serif"
                fill={GOLD}
                fontWeight="bold"
                className="orbit-text static"
                letterSpacing="0.08em"
              >
                <textPath href={`#expandable-orbit-path-${index}`} startOffset="50%" textAnchor="middle">
                  {planet.planetType}
                </textPath>
              </text>
            ))}
          </g>

          {/* Central sun */}
          <circle
            cx={CENTER_X} cy={CENTER_Y} r={SUN_RADIUS}
            fill={GOLD}
            className="central-sun-flat"
            style={{
              opacity: expandedAge ? 0 : 1,
              transition: "opacity 0.6s ease",
              filter: "drop-shadow(0 0 12px rgba(206, 181, 72, 0.6))"
            }}
          />

          {/* Moving planets */}
          <g 
            clipPath="url(#rightHalfClip)"
            style={{ opacity: expandedAge ? 0 : 1, transition: "opacity 0.6s ease" }}
          >
            {orbitingPlanets.map((planet, index) => {
              const position = calculatePlanetPosition(index);
              const selected = selectedAge?.id === planet.age.id;
              
              return (
                <g key={`planet-group-${index}`}>
                  <circle
                    cx={position.x} cy={position.y} r={NODE_RADIUS}
                    fill={GOLD}
                    className={`planet-node ${selected ? 'selected' : ''}`}
                    style={{ filter: "drop-shadow(0 0 6px rgba(206, 181, 72, 0.4))" }}
                  />
                  {selected && (
                    <circle
                      cx={position.x} cy={position.y} r={NODE_RADIUS + 6}
                      stroke={GOLD} strokeWidth={2} fill="none"
                      className="selection-ring" opacity="0.8"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      
      {/* Expanded content overlay */}
      {expandedAge && renderExpandedContent()}
    </div>
  );
};