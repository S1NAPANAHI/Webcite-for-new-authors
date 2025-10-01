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

  // Enhanced constants for smaller, crisper dial
  const GOLD = '#CEB548';
  const CENTER_X = 80;
  const CENTER_Y = 300; // Moved up slightly for better centering
  const SUN_RADIUS = 18; // Slightly smaller sun
  const NODE_RADIUS = 12; // Smaller nodes
  
  // REDUCED orbit sizes for more compact design
  const MIN_ORBIT_RADIUS = 45; // Reduced from 72
  const ORBIT_STEP = 28; // Reduced from 44
  
  // Enhanced animation constants for smoother feel
  const FULL_CIRCLE = 2 * Math.PI;
  const BASE_SPEED = 0.006; // Slightly slower for smoother motion
  const HIDDEN_SPEED_MULTIPLIER = 2.5; // More subtle speed change
  
  const NORMAL_SPEED_START = (340 * Math.PI) / 180;
  const NORMAL_SPEED_END = (200 * Math.PI) / 180;

  // Animation duration constants - optimized for smoothness
  const EXPANSION_DURATION = 1400; // Shorter for more responsive feel
  const CONTENT_REVEAL_DELAY = 900; // Earlier content reveal
  const LAYER_FADE_STAGGER = 60; // Faster stagger for smoother effect

  const ageNames = [
    'First Age', 'Second Age', 'Third Age', 'Fourth Age', 'Fifth Age',
    'Sixth Age', 'Seventh Age', 'Eighth Age', 'Ninth Age'
  ];

  // Ultra-smooth easing functions
  const easeInOutQuart = (t: number): number => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  };

  const easeOutBack = (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };

  const easeInOutExpo = (t: number): number => {
    return t === 0 ? 0 : t === 1 ? 1 : t < 0.5 
      ? Math.pow(2, 20 * t - 10) / 2 
      : (2 - Math.pow(2, -20 * t + 10)) / 2;
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

  // Enhanced expansion animation with ultra-smooth progress tracking
  const animateExpansion = useCallback((targetAge: Age, isExpanding: boolean) => {
    if (!isExpanding) {
      // Collapsing animation - faster and more responsive
      setAnimationState(prev => ({ ...prev, isCollapsing: true, contentVisible: false }));
      
      const collapseStart = performance.now();
      
      const collapse = (currentTime: number) => {
        const elapsed = currentTime - collapseStart;
        const progress = Math.min(elapsed / (EXPANSION_DURATION * 0.8), 1); // Faster collapse
        const easedProgress = easeInOutQuart(1 - progress);
        
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

    // Expanding animation - ultra smooth with sophisticated easing
    setAnimationState(prev => ({ ...prev, isExpanding: true }));
    setExpandedAge(targetAge);
    
    const expandStart = performance.now();
    expansionStartTimeRef.current = expandStart;
    
    const expand = (currentTime: number) => {
      const elapsed = currentTime - expandStart;
      const progress = Math.min(elapsed / EXPANSION_DURATION, 1);
      const easedProgress = easeInOutExpo(progress); // Ultra-smooth expansion
      
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

  // Initialize orbiting planets with smaller radii
  useEffect(() => {
    if (ages.length === 0) return;

    const planets: OrbitingPlanet[] = ages.map((age, index) => {
      const randomStartAngle = Math.random() * 2 * Math.PI;
      
      return {
        age,
        orbitRadius: MIN_ORBIT_RADIUS + (index * ORBIT_STEP),
        angle: randomStartAngle,
        speed: 0.012 + (index * 0.002), // Slightly slower for smoother motion
        size: NODE_RADIUS,
        planetType: ageNames[index] || `${age.age_number} Age`,
        initialAngle: randomStartAngle,
        ageIndex: index
      };
    });

    setOrbitingPlanets(planets);
    setPlanetAngles(planets.map(p => p.initialAngle));
  }, [ages]);

  // Enhanced animation loop with ultra-smooth orbital motion
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

  // Enhanced semicircle path with ultra-smooth morphing
  const createSemicircleLayerPath = (radius: number, progress: number = 0) => {
    if (progress === 0) {
      // Crisp normal semicircle
      const startX = CENTER_X;
      const startY = CENTER_Y - radius;
      const endX = CENTER_X;
      const endY = CENTER_Y + radius;
      
      return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} L ${CENTER_X} ${CENTER_Y} Z`;
    } else {
      // Ultra-smooth morphing to fullscreen
      const { width, height } = viewportDimensions;
      const maxRadius = Math.sqrt(width * width + height * height) * 0.8; // More controlled expansion
      
      // Smooth radius interpolation
      const currentRadius = radius + (maxRadius - radius) * easeOutBack(progress);
      
      // Progressive coverage angle for natural morphing
      const coverageAngle = Math.PI * (1 + progress * 0.8);
      
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

  // Create crisp orbit paths for text
  const createVerticalHalfCirclePath = (radius: number) => {
    const startX = CENTER_X;
    const startY = CENTER_Y - radius;
    const endX = CENTER_X;
    const endY = CENTER_Y + radius;
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  };

  // Create segmented orbit paths with better spacing
  const createSegmentedOrbitPath = (radius: number, textContent: string) => {
    const avgCharWidth = 10; // Slightly tighter spacing
    const letterSpacing = 0.06;
    const approxTextWidth = textContent.length * avgCharWidth * (1 + letterSpacing);
    const arcLength = approxTextWidth + 16;
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

  // Enhanced expanded content with crisp rendering
  const renderExpandedContent = () => {
    if (!expandedAge || !animationState.contentVisible) return null;
    
    return (
      <div className="orbital-overlay enhanced crisp" onClick={handleBackgroundClick}>
        <div 
          className="orbital-overlay-fill enhanced crisp" 
          style={{ 
            "--ring-color": GOLD,
            opacity: animationState.contentVisible ? 1 : 0
          } as React.CSSProperties} 
        />
        
        <div 
          className="orbital-expanded-content enhanced crisp"
          style={{
            opacity: animationState.contentVisible ? 1 : 0,
            transform: `translateY(${animationState.contentVisible ? 0 : 30}px) scale(${animationState.contentVisible ? 1 : 0.98})`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="expanded-topbar enhanced crisp">
            <div className="title-wrap enhanced crisp">
              <h2 className="expanded-title enhanced crisp">{getAgeDisplayName(expandedAge)}</h2>
              <div className="expanded-sub enhanced crisp">
                {expandedAge.start_year || '∞'} – {expandedAge.end_year || '∞'}
              </div>
            </div>

            <button 
              className="close-btn enhanced crisp" 
              onClick={handleCloseExpanded} 
              aria-label="Close"
              disabled={animationState.isCollapsing}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="expanded-body enhanced crisp">
            {expandedAge.description && (
              <p className="expanded-desc enhanced crisp">{expandedAge.description}</p>
            )}

            <div className="age-events-section enhanced crisp">
              {events.length > 0 ? (
                <>
                  <h3 className="events-title enhanced crisp">Timeline Events</h3>
                  <div className="expanded-grid enhanced crisp">
                    {events.slice(0, 6).map((event, index) => (
                      <div 
                        key={event.id} 
                        className="grid-item enhanced crisp"
                        style={{
                          animationDelay: `${(index * 0.08 + 0.2)}s` // Faster, smoother stagger
                        }}
                      >
                        <div className="item-head enhanced crisp">
                          {new Date(event.date).getFullYear()}
                        </div>
                        <div className="item-body enhanced crisp">
                          <h4 className="event-title enhanced crisp">{event.title}</h4>
                          <p className="event-description enhanced crisp">
                            {event.description?.substring(0, 120)}
                            {event.description && event.description.length > 120 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {events.length > 6 && (
                    <p className="more-events-note enhanced crisp">
                      +{events.length - 6} more events in this age
                    </p>
                  )}
                </>
              ) : loading ? (
                <div className="loading-state enhanced crisp">
                  <div className="loading-spinner enhanced crisp"></div>
                  <p className="loading-text enhanced crisp">Loading events...</p>
                </div>
              ) : (
                <div className="expanded-grid enhanced crisp">
                  <div className="grid-item enhanced crisp">
                    <div className="item-head enhanced crisp">Key Event</div>
                    <div className="item-body enhanced crisp">Founding of sacred order and covenantal rite.</div>
                  </div>
                  <div className="grid-item enhanced crisp">
                    <div className="item-head enhanced crisp">Adversary</div>
                    <div className="item-body enhanced crisp">Serpentine usurper stirs at the edge of empire.</div>
                  </div>
                  <div className="grid-item enhanced crisp">
                    <div className="item-head enhanced crisp">Relics</div>
                    <div className="item-body enhanced crisp">Avestan tablets, consecrated flame, seven seals.</div>
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
    <div className={`expandable-orbital-dial enhanced crisp ${className} ${expandedAge ? 'has-expanded' : ''}`} ref={containerRef}>
      <div className="orbital-background enhanced crisp" />
      
      <div className="orbital-container enhanced crisp">
        <svg 
          width={viewportDimensions.width}
          height={viewportDimensions.height}
          viewBox={`0 0 ${viewportDimensions.width} ${viewportDimensions.height}`}
          className="orbital-svg enhanced crisp"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            // Enhanced rendering quality
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision'
          }}
        >
          <defs>
            {/* Enhanced gradients with crisp colors */}
            {orbitingPlanets.map((planet, index) => (
              <radialGradient 
                key={`crisp-gradient-${index}`}
                id={`crisp-layer-gradient-${index}`} 
                cx="0.1" cy="0.5" r="0.75"
              >
                <stop offset="0%" stopColor={`rgba(206, 181, 72, ${0.12 + (index * 0.018)})`} />
                <stop offset="25%" stopColor={`rgba(206, 181, 72, ${0.08 + (index * 0.012)})`} />
                <stop offset="60%" stopColor={`rgba(206, 181, 72, ${0.04 + (index * 0.008)})`} />
                <stop offset="100%" stopColor="rgba(15, 15, 20, 0.4)" />
              </radialGradient>
            ))}
            
            <radialGradient id="crispExpandGrad" cx="25%" cy="50%" r="100%">
              <stop offset="0%" stopColor="rgba(255, 215, 0, 0.2)" />
              <stop offset="15%" stopColor="rgba(206, 181, 72, 0.15)" />
              <stop offset="45%" stopColor="rgba(206, 181, 72, 0.1)" />
              <stop offset="80%" stopColor="rgba(206, 181, 72, 0.05)" />
              <stop offset="100%" stopColor="rgba(15, 15, 20, 0.95)" />
            </radialGradient>
            
            <clipPath id="rightHalfClip">
              <rect 
                x={CENTER_X - 2} y={0} 
                width={viewportDimensions.width - (CENTER_X - 2)}
                height={viewportDimensions.height} 
              />
            </clipPath>

            {/* Text paths for crisp text rendering */}
            {orbitingPlanets.map((planet, index) => (
              <path
                key={`crisp-textpath-${index}`}
                id={`crisp-orbit-path-${index}`}
                d={createVerticalHalfCirclePath(planet.orbitRadius)}
                fill="none"
              />
            ))}
          </defs>

          {/* ENHANCED SEMICIRCLE LAYERS with crisp morphing animation */}
          <g className="semicircle-layers enhanced crisp">
            {orbitingPlanets.map((planet, index) => {
              const isThisExpanded = expandedAge?.id === planet.age.id;
              const layerRadius = planet.orbitRadius;
              const otherLayersExpanded = expandedAge && !isThisExpanded;
              
              // Enhanced staggered fade for other layers
              const fadeDelay = index * LAYER_FADE_STAGGER / 1000;
              const fadeOpacity = otherLayersExpanded ? 
                Math.max(0.02, (1 - animationState.expandProgress) * Math.exp(-fadeDelay * 3)) : 1;
              
              return (
                <g key={`crisp-semicircle-${index}`} className="semicircle-layer-group enhanced crisp">
                  <path
                    d={createSemicircleLayerPath(
                      layerRadius, 
                      isThisExpanded ? animationState.expandProgress : 0
                    )}
                    fill={isThisExpanded && animationState.expandProgress > 0.2 ? "url(#crispExpandGrad)" : `url(#crisp-layer-gradient-${index})`}
                    stroke={GOLD}
                    strokeWidth={isThisExpanded ? 2 + (animationState.expandProgress * 1.5) : 1.2}
                    strokeOpacity={isThisExpanded ? 0.95 : 0.6}
                    className={`semicircle-layer enhanced crisp clickable-semicircle ${isThisExpanded ? 'expanded' : ''}`}
                    data-age-index={index}
                    style={{
                      transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
                      zIndex: isThisExpanded ? 999 : (50 - index),
                      // Removed all blur filters for crisp rendering
                      filter: isThisExpanded && animationState.expandProgress > 0.2
                        ? `drop-shadow(0 0 ${60 + (animationState.expandProgress * 80)}px rgba(255, 215, 0, ${0.7 + (animationState.expandProgress * 0.3)}))` 
                        : `drop-shadow(0 2px ${4 + (index * 2)}px rgba(0, 0, 0, 0.4))`,
                      opacity: otherLayersExpanded ? fadeOpacity * 0.05 : (0.8 + (index * 0.04)),
                      cursor: (animationState.isExpanding || animationState.isCollapsing) ? \"wait\" : \n                              (otherLayersExpanded ? \"not-allowed\" : \"pointer\"),\n                      pointerEvents: (animationState.isExpanding || animationState.isCollapsing || otherLayersExpanded) ? \"none\" : \"auto\",\n                      // Crisp edge rendering\n                      strokeLinejoin: 'round',\n                      strokeLinecap: 'round'\n                    }}\n                    onClick={(e) => {\n                      if (!animationState.isExpanding && !animationState.isCollapsing && (!expandedAge || isThisExpanded)) {\n                        handleSemicircleClick(planet, e);\n                      }\n                    }}\n                  />\n                </g>\n              );\n            })}\n          </g>\n\n          {/* Enhanced orbital elements with crisp rendering */}\n          <g \n            className=\"orbital-elements enhanced crisp\"\n            style={{\n              opacity: expandedAge ? Math.max(0, 1 - animationState.expandProgress * 1.8) : 1,\n              transform: `scale(${expandedAge ? Math.max(0.85, 1 - animationState.expandProgress * 0.15) : 1})`,\n              pointerEvents: (animationState.isExpanding || animationState.isCollapsing || expandedAge) ? \"none\" : \"auto\"\n            }}\n          >\n            {/* Crisp orbit lines */}\n            {orbitingPlanets.map((planet, index) => {\n              const segments = createSegmentedOrbitPath(planet.orbitRadius, planet.planetType);\n              return (\n                <g key={`crisp-orbit-${index}`}>\n                  <path \n                    d={segments.beforeText} \n                    stroke={GOLD} \n                    strokeWidth={2} \n                    fill=\"none\" \n                    className=\"orbit-line enhanced crisp\" \n                    strokeLinecap=\"round\"\n                    style={{\n                      // Crisp line rendering - no blur\n                      shapeRendering: 'geometricPrecision'\n                    }}\n                  />\n                  <path \n                    d={segments.afterText} \n                    stroke={GOLD} \n                    strokeWidth={2} \n                    fill=\"none\" \n                    className=\"orbit-line enhanced crisp\" \n                    strokeLinecap=\"round\"\n                    style={{\n                      // Crisp line rendering - no blur\n                      shapeRendering: 'geometricPrecision'\n                    }}\n                  />\n                </g>\n              );\n            })}\n\n            {/* Enhanced age text labels with crisp rendering */}\n            {orbitingPlanets.map((planet, index) => (\n              <text\n                key={`crisp-text-${index}`}\n                fontSize=\"16\" // Slightly smaller for better proportions\n                fontFamily=\"'Segoe UI', 'Arial', sans-serif\" // Crisper font rendering\n                fill={GOLD}\n                fontWeight=\"600\"\n                className=\"orbit-text enhanced crisp clickable-text\"\n                letterSpacing=\"0.05em\"\n                style={{ \n                  cursor: (animationState.isExpanding || animationState.isCollapsing) ? \"wait\" : \"pointer\",\n                  // Crisp text rendering\n                  textRendering: 'geometricPrecision',\n                  fontSmooth: 'never',\n                  WebkitFontSmoothing: 'none'\n                }}\n                onClick={(e) => {\n                  if (!animationState.isExpanding && !animationState.isCollapsing) {\n                    handleTextClick(planet, e);\n                  }\n                }}\n              >\n                <textPath href={`#crisp-orbit-path-${index}`} startOffset=\"50%\" textAnchor=\"middle\">\n                  {planet.planetType}\n                </textPath>\n              </text>\n            ))}\n          </g>\n\n          {/* Enhanced central sun with crisp edges */}\n          <circle\n            cx={CENTER_X} cy={CENTER_Y} r={SUN_RADIUS}\n            fill={GOLD}\n            className=\"central-sun enhanced crisp\"\n            style={{\n              opacity: expandedAge ? Math.max(0, 1 - animationState.expandProgress * 2.5) : 1,\n              transform: `scale(${expandedAge ? Math.max(0.6, 1 - animationState.expandProgress * 0.4) : 1})`,\n              // Crisp sun rendering - no blur\n              filter: \"drop-shadow(0 0 12px rgba(206, 181, 72, 0.6))\"\n            }}\n          />\n\n          {/* Enhanced moving planets with crisp rendering */}\n          <g \n            clipPath=\"url(#rightHalfClip)\"\n            style={{ \n              opacity: expandedAge ? Math.max(0, 1 - animationState.expandProgress * 1.8) : 1,\n              transform: `scale(${expandedAge ? Math.max(0.75, 1 - animationState.expandProgress * 0.25) : 1})`\n            }}\n          >\n            {orbitingPlanets.map((planet, index) => {\n              const position = calculatePlanetPosition(index);\n              const selected = selectedAge?.id === planet.age.id;\n              \n              return (\n                <g key={`crisp-planet-${index}`}>\n                  <circle\n                    cx={position.x} cy={position.y} r={NODE_RADIUS}\n                    fill={GOLD}\n                    className={`planet-node enhanced crisp ${selected ? 'selected' : ''}`}\n                    style={{ \n                      // Crisp planet rendering\n                      filter: \"drop-shadow(0 1px 4px rgba(0, 0, 0, 0.4))\"\n                    }}\n                  />\n                  {selected && (\n                    <circle\n                      cx={position.x} cy={position.y} r={NODE_RADIUS + 4}\n                      stroke={GOLD} strokeWidth={1.5} fill=\"none\"\n                      className=\"selection-ring enhanced crisp\" \n                      opacity=\"0.9\"\n                      style={{\n                        // Crisp selection ring\n                        filter: \"drop-shadow(0 0 4px rgba(206, 181, 72, 0.3))\"\n                      }}\n                    />\n                  )}\n                </g>\n              );\n            })}\n          </g>\n        </svg>\n      </div>\n      \n      {/* Enhanced expanded content overlay */}\n      {renderExpandedContent()}\n      \n      {/* Subtle loading overlay during animation */}\n      {(animationState.isExpanding || animationState.isCollapsing) && (\n        <div className=\"animation-overlay enhanced crisp\">\n          <div className=\"animation-feedback enhanced crisp\">\n            <div className=\"feedback-spinner\"></div>\n            <span className=\"feedback-text\">\n              {animationState.isExpanding ? 'Expanding...' : 'Collapsing...'}\n            </span>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n};