import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Age } from '../../../lib/api-timeline';
import { useEventsByAge } from '../hooks/useTimelineData';
import './improved-expandable-orbital.css';

export interface ImprovedExpandableOrbitalDialProps {
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

interface AnimationState {
  isExpanding: boolean;
  isCollapsing: boolean;
  expandProgress: number;
  contentVisible: boolean;
}

export const ImprovedExpandableOrbitalDial: React.FC<ImprovedExpandableOrbitalDialProps> = ({
  ages,
  selectedAge,
  onAgeSelect,
  className = ''
}) => {
  const [orbitingPlanets, setOrbitingPlanets] = useState<OrbitingPlanet[]>([]);
  const [planetAngles, setPlanetAngles] = useState<number[]>([]);
  const [expandedAge, setExpandedAge] = useState<Age | null>(null);
  const [animationState, setAnimationState] = useState<AnimationState>({
    isExpanding: false,
    isCollapsing: false,
    expandProgress: 0,
    contentVisible: false
  });
  const [viewportDimensions, setViewportDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const expansionStartTimeRef = useRef<number>();

  // Enhanced constants for better visual appeal
  const GOLD = '#CEB548';
  const CENTER_X = 80;
  const CENTER_Y = 400;
  const SUN_RADIUS = 24;
  const NODE_RADIUS = 16;
  
  const MIN_ORBIT_RADIUS = 72;
  const ORBIT_STEP = 44;
  
  // Enhanced animation constants
  const FULL_CIRCLE = 2 * Math.PI;
  const BASE_SPEED = 0.008;
  const HIDDEN_SPEED_MULTIPLIER = 3;
  
  const NORMAL_SPEED_START = (340 * Math.PI) / 180;
  const NORMAL_SPEED_END = (200 * Math.PI) / 180;

  // Animation duration constants
  const EXPANSION_DURATION = 1800; // Longer for smoother feel
  const CONTENT_REVEAL_DELAY = 1200;
  const LAYER_FADE_STAGGER = 80; // Stagger other layers fading

  const ageNames = [
    'First Age', 'Second Age', 'Third Age', 'Fourth Age', 'Fifth Age',
    'Sixth Age', 'Seventh Age', 'Eighth Age', 'Ninth Age'
  ];

  // Advanced easing functions for natural movement
  const easeInOutQuint = (t: number): number => {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
  };

  const easeOutElastic = (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  };

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

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

  // Enhanced expansion animation with progress tracking
  const animateExpansion = useCallback((targetAge: Age, isExpanding: boolean) => {
    if (!isExpanding) {
      // Collapsing animation
      setAnimationState(prev => ({ ...prev, isCollapsing: true, contentVisible: false }));
      
      const collapseStart = performance.now();
      
      const collapse = (currentTime: number) => {
        const elapsed = currentTime - collapseStart;
        const progress = Math.min(elapsed / EXPANSION_DURATION, 1);
        const easedProgress = easeInOutCubic(1 - progress);
        
        setAnimationState(prev => ({
          ...prev,
          expandProgress: easedProgress
        }));
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(collapse);
        } else {
          setAnimationState({
            isExpanding: false,
            isCollapsing: false,
            expandProgress: 0,
            contentVisible: false
          });
          setExpandedAge(null);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(collapse);
      return;
    }

    // Expanding animation
    setAnimationState(prev => ({ ...prev, isExpanding: true }));
    setExpandedAge(targetAge);
    
    const expandStart = performance.now();
    expansionStartTimeRef.current = expandStart;
    
    const expand = (currentTime: number) => {
      const elapsed = currentTime - expandStart;
      const progress = Math.min(elapsed / EXPANSION_DURATION, 1);
      const easedProgress = easeInOutQuint(progress);
      
      setAnimationState(prev => ({
        ...prev,
        expandProgress: easedProgress,
        contentVisible: elapsed > CONTENT_REVEAL_DELAY
      }));
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(expand);
      } else {
        setAnimationState(prev => ({
          ...prev,
          isExpanding: false,
          contentVisible: true
        }));
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(expand);
  }, []);

  // Disable body scroll when expanded
  useEffect(() => {
    if (expandedAge) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [expandedAge]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && expandedAge && !animationState.isExpanding && !animationState.isCollapsing) {
        handleCloseExpanded();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedAge, animationState]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
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

  // Enhanced animation loop with smooth orbital motion
  useEffect(() => {
    let animationId: number;
    
    // Pause orbital animation during expansion/collapse
    if (animationState.isExpanding || animationState.isCollapsing || expandedAge) return;
    
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
  }, [animationState, expandedAge]);

  // Enhanced semicircle click handler
  const handleSemicircleClick = (planet: OrbitingPlanet, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Prevent clicks during animation
    if (animationState.isExpanding || animationState.isCollapsing) return;

    console.log(`Enhanced Semicircle ${planet.ageIndex + 1} clicked:`, planet.age.name);
    
    onAgeSelect(planet.age);
    
    if (expandedAge?.id === planet.age.id) {
      // Collapse current
      animateExpansion(planet.age, false);
    } else {
      // Expand new
      animateExpansion(planet.age, true);
    }
  };

  // Handle text label clicks
  const handleTextClick = (planet: OrbitingPlanet, event: React.MouseEvent) => {
    event.stopPropagation();
    handleSemicircleClick(planet, event);
  };

  const handleCloseExpanded = (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (animationState.isExpanding || animationState.isCollapsing || !expandedAge) return;
    
    animateExpansion(expandedAge, false);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".orbital-expanded-content")) return;
    if (expandedAge && !animationState.isExpanding && !animationState.isCollapsing) {
      handleCloseExpanded();
    }
  };

  // Calculate planet positions with smooth interpolation
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

  // Enhanced semicircle path creation with morphing capability
  const createSemicircleLayerPath = (radius: number, progress: number = 0) => {
    if (progress === 0) {
      // Normal semicircle
      const startX = CENTER_X;
      const startY = CENTER_Y - radius;
      const endX = CENTER_X;
      const endY = CENTER_Y + radius;
      
      return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} L ${CENTER_X} ${CENTER_Y} Z`;
    } else {
      // Morphing to fullscreen
      const { width, height } = viewportDimensions;
      const maxRadius = Math.max(width, height) * 1.2;
      
      // Interpolate radius
      const currentRadius = radius + (maxRadius - radius) * progress;
      
      // Morph the path to cover more area
      const coverageAngle = Math.PI * (1 + progress); // Gradually cover more than semicircle
      
      const startAngle = -coverageAngle / 2;
      const endAngle = coverageAngle / 2;
      
      const startX = CENTER_X + Math.cos(startAngle) * currentRadius;
      const startY = CENTER_Y + Math.sin(startAngle) * currentRadius;
      const endX = CENTER_X + Math.cos(endAngle) * currentRadius;
      const endY = CENTER_Y + Math.sin(endAngle) * currentRadius;
      
      const largeArcFlag = coverageAngle > Math.PI ? 1 : 0;
      
      return `M ${startX} ${startY} A ${currentRadius} ${currentRadius} 0 ${largeArcFlag} 1 ${endX} ${endY} L ${CENTER_X} ${CENTER_Y} Z`;
    }
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

  // Enhanced expanded content with improved animations
  const renderExpandedContent = () => {
    if (!expandedAge || !animationState.contentVisible) return null;
    
    return (
      <div className="orbital-overlay enhanced is-expanded" onClick={handleBackgroundClick}>
        <div 
          className="orbital-overlay-fill enhanced" 
          style={{ 
            "--ring-color": GOLD,
            opacity: animationState.contentVisible ? 1 : 0
          } as React.CSSProperties} 
        />
        
        <div 
          className="orbital-expanded-content enhanced"
          style={{
            opacity: animationState.contentVisible ? 1 : 0,
            transform: `translateY(${animationState.contentVisible ? 0 : 40}px) scale(${animationState.contentVisible ? 1 : 0.95})`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="expanded-topbar enhanced">
            <div className="title-wrap enhanced">
              <h2 className="expanded-title enhanced">{getAgeDisplayName(expandedAge)}</h2>
              <div className="expanded-sub enhanced">
                {expandedAge.start_year || '∞'} – {expandedAge.end_year || '∞'}
              </div>
            </div>

            <button 
              className="close-btn enhanced" 
              onClick={handleCloseExpanded} 
              aria-label="Close"
              disabled={animationState.isCollapsing}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="expanded-body enhanced">
            {expandedAge.description && (
              <p className="expanded-desc enhanced">{expandedAge.description}</p>
            )}

            <div className="age-events-section enhanced">
              {events.length > 0 ? (
                <>
                  <h3 className="events-title enhanced">Timeline Events</h3>
                  <div className="expanded-grid enhanced">
                    {events.slice(0, 6).map((event, index) => (
                      <div 
                        key={event.id} 
                        className="grid-item enhanced"
                        style={{
                          animationDelay: `${(index * 0.1 + 0.3)}s`
                        }}
                      >
                        <div className="item-head enhanced">
                          {new Date(event.date).getFullYear()}
                        </div>
                        <div className="item-body enhanced">
                          <h4 className="event-title enhanced">{event.title}</h4>
                          <p className="event-description enhanced">
                            {event.description?.substring(0, 120)}
                            {event.description && event.description.length > 120 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {events.length > 6 && (
                    <p className="more-events-note enhanced">
                      +{events.length - 6} more events in this age
                    </p>
                  )}
                </>
              ) : loading ? (
                <div className="loading-state enhanced">
                  <div className="loading-spinner enhanced"></div>
                  <p className="loading-text enhanced">Loading events...</p>
                </div>
              ) : (
                <div className="expanded-grid enhanced">
                  <div className="grid-item enhanced">
                    <div className="item-head enhanced">Key Event</div>
                    <div className="item-body enhanced">Founding of sacred order and covenantal rite.</div>
                  </div>
                  <div className="grid-item enhanced">
                    <div className="item-head enhanced">Adversary</div>
                    <div className="item-body enhanced">Serpentine usurper stirs at the edge of empire.</div>
                  </div>
                  <div className="grid-item enhanced">
                    <div className="item-head enhanced">Relics</div>
                    <div className="item-body enhanced">Avestan tablets, consecrated flame, seven seals.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`expandable-orbital-dial enhanced ${className} ${expandedAge ? 'has-expanded' : ''}`} ref={containerRef}>
      <div className="orbital-background enhanced" />
      
      <div className="orbital-container enhanced">
        <svg 
          width={viewportDimensions.width}
          height={viewportDimensions.height}
          viewBox={`0 0 ${viewportDimensions.width} ${viewportDimensions.height}`}
          className="orbital-svg enhanced"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <defs>
            {/* Enhanced gradients with better color transitions */}
            {orbitingPlanets.map((planet, index) => (
              <radialGradient 
                key={`enhanced-gradient-${index}`}
                id={`enhanced-layer-gradient-${index}`} 
                cx="0.1" cy="0.5" r="0.8"
              >
                <stop offset="0%" stopColor={`rgba(206, 181, 72, ${0.08 + (index * 0.02)})`} />
                <stop offset="30%" stopColor={`rgba(206, 181, 72, ${0.05 + (index * 0.015)})`} />
                <stop offset="70%" stopColor={`rgba(206, 181, 72, ${0.02 + (index * 0.01)})`} />
                <stop offset="100%" stopColor="rgba(15, 15, 20, 0.3)" />
              </radialGradient>
            ))}
            
            <radialGradient id="enhancedExpandGrad" cx="30%" cy="50%" r="120%">
              <stop offset="0%" stopColor="rgba(255, 215, 0, 0.15)" />
              <stop offset="20%" stopColor="rgba(206, 181, 72, 0.12)" />
              <stop offset="60%" stopColor="rgba(206, 181, 72, 0.08)" />
              <stop offset="100%" stopColor="rgba(15, 15, 20, 0.95)" />
            </radialGradient>
            
            <clipPath id="rightHalfClip">
              <rect 
                x={CENTER_X - 4} y={0} 
                width={viewportDimensions.width - (CENTER_X - 4)}
                height={viewportDimensions.height} 
              />
            </clipPath>

            {/* Text paths */}
            {orbitingPlanets.map((planet, index) => (
              <path
                key={`textpath-${index}`}
                id={`enhanced-orbit-path-${index}`}
                d={createVerticalHalfCirclePath(planet.orbitRadius)}
                fill="none"
              />
            ))}
          </defs>

          {/* ENHANCED SEMICIRCLE LAYERS with morphing animation */}
          <g className="semicircle-layers enhanced">
            {orbitingPlanets.map((planet, index) => {
              const isThisExpanded = expandedAge?.id === planet.age.id;
              const layerRadius = planet.orbitRadius;
              const otherLayersExpanded = expandedAge && !isThisExpanded;
              
              // Calculate staggered fade for other layers
              const fadeDelay = index * LAYER_FADE_STAGGER;
              const fadeOpacity = otherLayersExpanded ? 
                Math.max(0, 1 - (animationState.expandProgress + fadeDelay / 1000)) : 1;
              
              return (
                <g key={`enhanced-semicircle-${index}`} className="semicircle-layer-group enhanced">
                  <path
                    d={createSemicircleLayerPath(
                      layerRadius, 
                      isThisExpanded ? animationState.expandProgress : 0
                    )}
                    fill={isThisExpanded && animationState.expandProgress > 0.3 ? "url(#enhancedExpandGrad)" : `url(#enhanced-layer-gradient-${index})`}
                    stroke={GOLD}
                    strokeWidth={isThisExpanded ? 3 + (animationState.expandProgress * 2) : 1.5}
                    strokeOpacity={isThisExpanded ? 0.9 : 0.4}
                    className={`semicircle-layer enhanced clickable-semicircle ${isThisExpanded ? 'expanded' : ''}`}
                    data-age-index={index}
                    style={{
                      transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
                      zIndex: isThisExpanded ? 999 : (50 - index),
                      transition: "stroke-width 0.6s ease, stroke-opacity 0.6s ease",
                      filter: isThisExpanded && animationState.expandProgress > 0.2
                        ? `drop-shadow(0 0 ${80 + (animationState.expandProgress * 120)}px rgba(255, 215, 0, ${0.6 + (animationState.expandProgress * 0.4)}))` 
                        : `drop-shadow(0 0 4px rgba(206, 181, 72, ${0.2 + (index * 0.05)}))`,
                      opacity: otherLayersExpanded ? fadeOpacity * 0.1 : (0.7 + (index * 0.05)),
                      cursor: (animationState.isExpanding || animationState.isCollapsing) ? "wait" : 
                              (otherLayersExpanded ? "not-allowed" : "pointer"),
                      pointerEvents: (animationState.isExpanding || animationState.isCollapsing || otherLayersExpanded) ? "none" : "auto"
                    }}
                    onClick={(e) => {
                      if (!animationState.isExpanding && !animationState.isCollapsing && (!expandedAge || isThisExpanded)) {
                        handleSemicircleClick(planet, e);
                      }
                    }}
                  />
                </g>
              );
            })}
          </g>

          {/* Enhanced orbital elements with better fade transitions */}
          <g 
            className="orbital-elements enhanced"
            style={{
              opacity: expandedAge ? Math.max(0, 1 - animationState.expandProgress * 1.5) : 1,
              transform: `scale(${expandedAge ? Math.max(0.8, 1 - animationState.expandProgress * 0.2) : 1})`,
              transition: "transform 0.8s ease",
              pointerEvents: (animationState.isExpanding || animationState.isCollapsing || expandedAge) ? "none" : "auto"
            }}
          >
            {/* Enhanced orbit lines */}
            {orbitingPlanets.map((planet, index) => {
              const segments = createSegmentedOrbitPath(planet.orbitRadius, planet.planetType);
              return (
                <g key={`enhanced-orbit-${index}`}>
                  <path 
                    d={segments.beforeText} 
                    stroke={GOLD} 
                    strokeWidth={2.5} 
                    fill="none" 
                    className="orbit-line enhanced" 
                    strokeLinecap="round"
                    style={{
                      filter: "drop-shadow(0 0 2px rgba(206, 181, 72, 0.3))"
                    }}
                  />
                  <path 
                    d={segments.afterText} 
                    stroke={GOLD} 
                    strokeWidth={2.5} 
                    fill="none" 
                    className="orbit-line enhanced" 
                    strokeLinecap="round"
                    style={{
                      filter: "drop-shadow(0 0 2px rgba(206, 181, 72, 0.3))"
                    }}
                  />
                </g>
              );
            })}

            {/* Enhanced age text labels */}
            {orbitingPlanets.map((planet, index) => (
              <text
                key={`enhanced-text-${index}`}
                fontSize="18"
                fontFamily="Papyrus, serif"
                fill={GOLD}
                fontWeight="bold"
                className="orbit-text enhanced clickable-text"
                letterSpacing="0.08em"
                style={{ 
                  cursor: (animationState.isExpanding || animationState.isCollapsing) ? "wait" : "pointer",
                  filter: "drop-shadow(0 0 4px rgba(206, 181, 72, 0.4))"
                }}
                onClick={(e) => {
                  if (!animationState.isExpanding && !animationState.isCollapsing) {
                    handleTextClick(planet, e);
                  }
                }}
              >
                <textPath href={`#enhanced-orbit-path-${index}`} startOffset="50%" textAnchor="middle">
                  {planet.planetType}
                </textPath>
              </text>
            ))}
          </g>

          {/* Enhanced central sun */}
          <circle
            cx={CENTER_X} cy={CENTER_Y} r={SUN_RADIUS}
            fill={GOLD}
            className="central-sun enhanced"
            style={{
              opacity: expandedAge ? Math.max(0, 1 - animationState.expandProgress * 2) : 1,
              transform: `scale(${expandedAge ? Math.max(0.5, 1 - animationState.expandProgress * 0.5) : 1})`,
              transition: "transform 0.8s ease",
              filter: "drop-shadow(0 0 16px rgba(206, 181, 72, 0.8))"
            }}
          />

          {/* Enhanced moving planets */}
          <g 
            clipPath="url(#rightHalfClip)"
            style={{ 
              opacity: expandedAge ? Math.max(0, 1 - animationState.expandProgress * 1.5) : 1,
              transform: `scale(${expandedAge ? Math.max(0.7, 1 - animationState.expandProgress * 0.3) : 1})`,
              transition: "transform 0.8s ease"
            }}
          >
            {orbitingPlanets.map((planet, index) => {
              const position = calculatePlanetPosition(index);
              const selected = selectedAge?.id === planet.age.id;
              
              return (
                <g key={`enhanced-planet-${index}`}>
                  <circle
                    cx={position.x} cy={position.y} r={NODE_RADIUS}
                    fill={GOLD}
                    className={`planet-node enhanced ${selected ? 'selected' : ''}`}
                    style={{ 
                      filter: "drop-shadow(0 0 8px rgba(206, 181, 72, 0.6))",
                      transition: "filter 0.3s ease"
                    }}
                  />
                  {selected && (
                    <circle
                      cx={position.x} cy={position.y} r={NODE_RADIUS + 6}
                      stroke={GOLD} strokeWidth={2} fill="none"
                      className="selection-ring enhanced" 
                      opacity="0.9"
                      style={{
                        filter: "drop-shadow(0 0 6px rgba(206, 181, 72, 0.4))"
                      }}
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      
      {/* Enhanced expanded content overlay */}
      {renderExpandedContent()}
      
      {/* Loading overlay during animation */}
      {(animationState.isExpanding || animationState.isCollapsing) && (
        <div className="animation-overlay enhanced">
          <div className="animation-feedback enhanced">
            {animationState.isExpanding ? 'Expanding...' : 'Collapsing...'}
          </div>
        </div>
      )}
    </div>
  );
};