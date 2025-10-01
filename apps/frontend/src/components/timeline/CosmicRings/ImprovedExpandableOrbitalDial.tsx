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

interface SpringPhysics {
  mass: number;
  tension: number;
  friction: number;
  velocity: number;
  damping: number;
}

interface AdvancedAnimationState {
  isExpanding: boolean;
  isCollapsing: boolean;
  expandProgress: number;
  contentVisible: boolean;
  springState: SpringPhysics;
  morphProgress: number;
  layerDepth: number[];
  microVariations: number[];
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
  const [animationState, setAnimationState] = useState<AdvancedAnimationState>({
    isExpanding: false,
    isCollapsing: false,
    expandProgress: 0,
    contentVisible: false,
    springState: {
      mass: 1.0,
      tension: 280,
      friction: 20,
      velocity: 0,
      damping: 0.95
    },
    morphProgress: 0,
    layerDepth: [],
    microVariations: []
  });
  const [viewportDimensions, setViewportDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const expansionStartTimeRef = useRef<number>();
  const performanceMonitorRef = useRef<{ frameCount: number; lastTime: number; adaptiveQuality: boolean }>({
    frameCount: 0,
    lastTime: 0,
    adaptiveQuality: false
  });
  const microVariationTimeRef = useRef<number>(0);

  // Enhanced constants with smaller, optimized dial
  const GOLD = '#CEB548';
  const CENTER_X = 80;
  const CENTER_Y = 300;
  const SUN_RADIUS = 18;
  const NODE_RADIUS = 12;
  
  // Optimized orbit sizes with golden ratio spacing
  const MIN_ORBIT_RADIUS = 45;
  const ORBIT_STEP = 28;
  
  const FULL_CIRCLE = 2 * Math.PI;
  const BASE_SPEED = 0.004; // Slower for ultra-smooth motion
  const HIDDEN_SPEED_MULTIPLIER = 2.2;
  
  const NORMAL_SPEED_START = (340 * Math.PI) / 180;
  const NORMAL_SPEED_END = (200 * Math.PI) / 180;

  // Advanced spring physics constants based on research
  const EXPANSION_DURATION = 1200; // Optimized for 120fps displays
  const CONTENT_REVEAL_DELAY = 750;
  const LAYER_FADE_STAGGER = 45;
  const ANTICIPATION_DURATION = 180; // Pre-animation phase
  const SETTLE_DURATION = 120; // Post-animation phase

  const ageNames = [
    'First Age', 'Second Age', 'Third Age', 'Fourth Age', 'Fifth Age',
    'Sixth Age', 'Seventh Age', 'Eighth Age', 'Ninth Age'
  ];

  // Industry-leading easing functions based on GSAP and Framer Motion research
  const advancedEasing = {
    // Spring physics simulation with realistic damping
    springPhysics: (t: number, config: SpringPhysics): number => {
      const { mass, tension, friction, velocity, damping } = config;
      const w0 = Math.sqrt(tension / mass);
      const zeta = friction / (2 * Math.sqrt(tension * mass));
      
      if (zeta < 1) {
        // Under-damped (bouncy)
        const wd = w0 * Math.sqrt(1 - zeta * zeta);
        const A = 1;
        const B = (zeta * w0 + velocity) / wd;
        return 1 - (A * Math.cos(wd * t) + B * Math.sin(wd * t)) * Math.exp(-zeta * w0 * t);
      } else {
        // Critically/over-damped (smooth)
        return 1 - (1 + w0 * t) * Math.exp(-w0 * t);
      }
    },

    // Elastic bounce with customizable parameters (from CSS Spring Easing Generator)
    elasticOut: (t: number, bounce: number = 0.4): number => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : 
        Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75 + bounce) * c4) + 1;
    },

    // Professional anticipation curve (Disney's 12 principles)
    anticipate: (t: number): number => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * t * t * t - c1 * t * t;
    },

    // Advanced cubic-bezier with micro-adjustments
    ultraSmooth: (t: number): number => {
      // Custom curve optimized for morphing animations
      return t * t * t * (t * (t * 6 - 15) + 10);
    },

    // Organic breathing effect for subtle variations
    organicVariation: (t: number, frequency: number = 2): number => {
      return Math.sin(t * Math.PI * frequency) * 0.05;
    },

    // Industry-standard bounce (from bounce.js research)
    bounceOut: (t: number): number => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    }
  };

  // Performance monitoring for adaptive quality
  const monitorPerformance = useCallback(() => {
    const now = performance.now();
    performanceMonitorRef.current.frameCount++;
    
    if (now - performanceMonitorRef.current.lastTime >= 1000) {
      const fps = performanceMonitorRef.current.frameCount;
      performanceMonitorRef.current.frameCount = 0;
      performanceMonitorRef.current.lastTime = now;
      
      // Adaptive quality based on performance (research from web.dev)
      if (fps < 45) {
        performanceMonitorRef.current.adaptiveQuality = true;
        console.log('🎯 Adaptive quality enabled for better performance');
      } else if (fps > 58) {
        performanceMonitorRef.current.adaptiveQuality = false;
      }
    }
  }, []);

  // Advanced morphing path with cubic-bezier interpolation (GSAP MorphSVG inspired)
  const createAdvancedMorphingPath = (fromRadius: number, progress: number): string => {
    if (progress === 0) {
      // Crisp normal semicircle with mathematically precise curves
      const startX = CENTER_X;
      const startY = CENTER_Y - fromRadius;
      const endX = CENTER_X;
      const endY = CENTER_Y + fromRadius;
      
      return `M ${startX} ${startY} A ${fromRadius} ${fromRadius} 0 0 1 ${endX} ${endY} L ${CENTER_X} ${CENTER_Y} Z`;
    } else if (progress >= 1) {
      // Full screen coverage with organic edges
      const { width, height } = viewportDimensions;
      const margin = 10; // Small margin for better visual
      return `M ${-margin} ${-margin} L ${width + margin} ${-margin} L ${width + margin} ${height + margin} L ${-margin} ${height + margin} Z`;
    } else {
      // Advanced cubic-bezier morphing with multiple phases
      const morphRadius = fromRadius * (1 + progress * 3);
      const { width, height } = viewportDimensions;
      const maxRadius = Math.sqrt(width * width + height * height) * 0.7;
      
      // Multi-phase morphing for organic feel
      let currentRadius: number;
      let coverageAngle: number;
      
      if (progress < 0.3) {
        // Phase 1: Initial expansion with anticipation
        const phase1Progress = progress / 0.3;
        currentRadius = fromRadius + (fromRadius * 0.5) * advancedEasing.anticipate(phase1Progress);
        coverageAngle = Math.PI;
      } else if (progress < 0.7) {
        // Phase 2: Main morphing with spring physics
        const phase2Progress = (progress - 0.3) / 0.4;
        const springValue = advancedEasing.springPhysics(phase2Progress, animationState.springState);
        currentRadius = fromRadius * 1.5 + (maxRadius - fromRadius * 1.5) * springValue;
        coverageAngle = Math.PI * (1 + springValue * 0.8);
      } else {
        // Phase 3: Final settle with elastic bounce
        const phase3Progress = (progress - 0.7) / 0.3;
        const elasticValue = advancedEasing.elasticOut(phase3Progress, 0.3);
        currentRadius = maxRadius * (0.8 + elasticValue * 0.2);
        coverageAngle = Math.PI * (1.8 + elasticValue * 0.2);
      }
      
      // Advanced control points for ultra-smooth curves
      const startAngle = -coverageAngle / 2;
      const endAngle = coverageAngle / 2;
      
      // Organic curve with micro-variations
      const microVariation = advancedEasing.organicVariation(progress * 4) * currentRadius * 0.1;
      const adjustedRadius = currentRadius + microVariation;
      
      const startX = CENTER_X + Math.cos(startAngle) * adjustedRadius;
      const startY = CENTER_Y + Math.sin(startAngle) * adjustedRadius;
      const endX = CENTER_X + Math.cos(endAngle) * adjustedRadius;
      const endY = CENTER_Y + Math.sin(endAngle) * adjustedRadius;
      
      // Advanced cubic-bezier control points for smooth morphing
      const cp1Offset = adjustedRadius * 0.15;
      const cp1X = CENTER_X + Math.cos(startAngle + 0.1) * (adjustedRadius - cp1Offset);
      const cp1Y = CENTER_Y + Math.sin(startAngle + 0.1) * (adjustedRadius - cp1Offset);
      const cp2X = CENTER_X + Math.cos(endAngle - 0.1) * (adjustedRadius - cp1Offset);
      const cp2Y = CENTER_Y + Math.sin(endAngle - 0.1) * (adjustedRadius - cp1Offset);
      
      return `M ${CENTER_X} ${CENTER_Y} L ${startX} ${startY} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${endX} ${endY} Z`;
    }
  };

  // Update viewport dimensions with performance throttling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewportDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Next-generation spring-physics expansion animation
  const animateExpansion = useCallback((targetAge: Age, isExpanding: boolean) => {
    if (!isExpanding) {
      // Collapse with advanced elastic bounce
      setAnimationState(prev => ({ 
        ...prev, 
        isCollapsing: true, 
        contentVisible: false,
        springState: { ...prev.springState, velocity: -0.5, tension: 320 }
      }));
      
      const collapseStart = performance.now();
      
      const collapse = (currentTime: number) => {
        const elapsed = currentTime - collapseStart;
        const progress = Math.min(elapsed / (EXPANSION_DURATION * 0.75), 1);
        
        // Multi-phase collapse for organic feel
        let easedProgress: number;
        if (progress < 0.6) {
          // Fast initial collapse
          easedProgress = 1 - advancedEasing.ultraSmooth(progress / 0.6) * 0.9;
        } else {
          // Final settle with bounce
          const settleProgress = (progress - 0.6) / 0.4;
          easedProgress = 0.1 * (1 - advancedEasing.bounceOut(settleProgress));
        }
        
        setAnimationState(prev => ({
          ...prev,
          expandProgress: easedProgress,
          morphProgress: easedProgress,
          layerDepth: prev.layerDepth.map(depth => depth * easedProgress)
        }));
        
        monitorPerformance();
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(collapse);
        } else {
          setAnimationState(prev => ({
            ...prev,
            isExpanding: false,
            isCollapsing: false,
            expandProgress: 0,
            morphProgress: 0,
            contentVisible: false,
            layerDepth: new Array(ages.length).fill(0).map((_, i) => (ages.length - i) * 2),
            microVariations: new Array(ages.length).fill(0)
          }));
          setExpandedAge(null);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(collapse);
      return;
    }

    // Expanding with advanced spring physics and anticipation
    setAnimationState(prev => ({ 
      ...prev, 
      isExpanding: true,
      springState: { ...prev.springState, velocity: 0.1, tension: 280 }
    }));
    setExpandedAge(targetAge);
    
    const expandStart = performance.now();
    expansionStartTimeRef.current = expandStart;
    
    const expand = (currentTime: number) => {
      const elapsed = currentTime - expandStart;
      const totalDuration = EXPANSION_DURATION + ANTICIPATION_DURATION + SETTLE_DURATION;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Advanced multi-phase animation system
      let easedProgress: number;
      let morphProgress: number;
      let contentRevealProgress: number;
      
      if (progress < 0.1) {
        // Phase 1: Anticipation (Disney's 12 principles)
        const anticipationProgress = progress / 0.1;
        easedProgress = advancedEasing.anticipate(anticipationProgress) * 0.05;
        morphProgress = 0;
        contentRevealProgress = 0;
      } else if (progress < 0.75) {
        // Phase 2: Main expansion with spring physics
        const springProgress = (progress - 0.1) / 0.65;
        const springValue = advancedEasing.springPhysics(springProgress, animationState.springState);
        easedProgress = 0.05 + springValue * 0.85;
        morphProgress = advancedEasing.ultraSmooth(springProgress) * 0.9;
        contentRevealProgress = springProgress > 0.4 ? (springProgress - 0.4) / 0.6 : 0;
      } else {
        // Phase 3: Final settle with elastic bounce
        const settleProgress = (progress - 0.75) / 0.25;
        const elasticValue = advancedEasing.elasticOut(settleProgress, 0.2);
        easedProgress = 0.9 + elasticValue * 0.1;
        morphProgress = 0.9 + elasticValue * 0.1;
        contentRevealProgress = 1;
      }
      
      // Calculate advanced layer depth for 3D stacking effect
      const layerDepth = ages.map((_, index) => {
        const isCurrentAge = targetAge.id === ages[index]?.id;
        if (isCurrentAge) {
          return 25 + easedProgress * 50; // Expanding layer rises dramatically
        } else {
          const baseDepth = (ages.length - index) * 2;
          const sinkAmount = easedProgress * 20;
          return Math.max(0.5, baseDepth - sinkAmount); // Other layers sink
        }
      });
      
      // Generate organic micro-variations for natural feel
      const microVariations = ages.map((_, index) => {
        const timeOffset = elapsed * 0.001 + index * 0.5;
        return Math.sin(timeOffset * 2) * 0.8 + Math.cos(timeOffset * 1.3) * 0.5;
      });
      
      setAnimationState(prev => ({
        ...prev,
        expandProgress: easedProgress,
        morphProgress: morphProgress,
        contentVisible: contentRevealProgress > 0.5,
        layerDepth,
        microVariations
      }));
      
      monitorPerformance();
      
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
  }, [ages, animationState.springState, monitorPerformance]);

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

  // Close on Escape with smooth transition
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

  // Initialize orbiting planets with golden ratio positioning
  useEffect(() => {
    if (ages.length === 0) return;

    const planets: OrbitingPlanet[] = ages.map((age, index) => {
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle for optimal spacing
      const randomStartAngle = (index * goldenAngle) % (2 * Math.PI);
      
      return {
        age,
        orbitRadius: MIN_ORBIT_RADIUS + (index * ORBIT_STEP),
        angle: randomStartAngle,
        speed: 0.006 + (index * 0.0008), // Slightly varied speeds for organic motion
        size: NODE_RADIUS,
        planetType: ageNames[index] || `${age.age_number} Age`,
        initialAngle: randomStartAngle,
        ageIndex: index
      };
    });

    setOrbitingPlanets(planets);
    setPlanetAngles(planets.map(p => p.initialAngle));
    
    // Initialize layer depth and micro-variations
    setAnimationState(prev => ({
      ...prev,
      layerDepth: new Array(ages.length).fill(0).map((_, i) => (ages.length - i) * 2),
      microVariations: new Array(ages.length).fill(0)
    }));
  }, [ages]);

  // Advanced orbital animation with organic micro-variations
  useEffect(() => {
    let animationId: number;
    
    // Pause orbital animation during expansion/collapse
    if (animationState.isExpanding || animationState.isCollapsing || expandedAge) return;
    
    const animate = () => {
      microVariationTimeRef.current += 0.016; // ~60fps increment
      
      setPlanetAngles(prevAngles => 
        prevAngles.map((angle, index) => {
          let normalizedAngle = (angle % FULL_CIRCLE + FULL_CIRCLE) % FULL_CIRCLE;
          const isInNormalSpeedRange = (normalizedAngle >= NORMAL_SPEED_START) || (normalizedAngle <= NORMAL_SPEED_END);
          
          // Base speed calculation
          let delta = isInNormalSpeedRange ? BASE_SPEED : BASE_SPEED * HIDDEN_SPEED_MULTIPLIER;
          
          // Add organic micro-variations for natural feel
          const microVar1 = Math.sin(microVariationTimeRef.current * 1.2 + index * 1.1) * 0.0003;
          const microVar2 = Math.cos(microVariationTimeRef.current * 0.8 + index * 0.7) * 0.0002;
          delta += microVar1 + microVar2;
          
          // Adaptive quality reduces micro-variations on low-end devices
          if (performanceMonitorRef.current.adaptiveQuality) {
            delta = isInNormalSpeedRange ? BASE_SPEED : BASE_SPEED * HIDDEN_SPEED_MULTIPLIER;
          }
          
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

  // Enhanced semicircle click handler with haptic feedback simulation
  const handleSemicircleClick = (planet: OrbitingPlanet, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Prevent clicks during animation
    if (animationState.isExpanding || animationState.isCollapsing) return;

    // Simulate haptic feedback with micro-interaction
    const element = event.currentTarget as HTMLElement;
    if (element && element.style) {
      element.style.transform = 'scale(0.96) translateZ(0)';
      element.style.filter = 'brightness(1.1)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (element && element.style) {
            element.style.transform = 'scale(1) translateZ(0)';
            element.style.filter = '';
          }
        }, 120);
      });
    }

    onAgeSelect(planet.age);
    
    if (expandedAge?.id === planet.age.id) {
      // Collapse with elastic bounce
      animateExpansion(planet.age, false);
    } else {
      // Expand with spring physics
      animateExpansion(planet.age, true);
    }
  };

  // Handle text label clicks with advanced micro-interactions
  const handleTextClick = (planet: OrbitingPlanet, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Advanced text scaling micro-interaction
    const textElement = event.currentTarget as SVGTextElement;
    if (textElement) {
      // Web Animations API for smooth text scaling
      const keyframes = [
        { transform: 'scale(1)', filter: 'brightness(1)' },
        { transform: 'scale(1.08)', filter: 'brightness(1.15)', offset: 0.4 },
        { transform: 'scale(1)', filter: 'brightness(1)' }
      ];
      
      const animation = textElement.animate(keyframes, {
        duration: 250,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'forwards'
      });
      
      animation.play();
    }
    
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

  // Calculate planet positions with organic micro-variations
  const calculatePlanetPosition = (planetIndex: number) => {
    if (!planetAngles[planetIndex] || !orbitingPlanets[planetIndex]) {
      return { x: CENTER_X, y: CENTER_Y, angle: 0 };
    }
    
    const planet = orbitingPlanets[planetIndex];
    const currentAngle = planetAngles[planetIndex];
    const displayAngle = currentAngle - Math.PI / 2;
    
    // Add organic micro-variations for natural feel
    const microVariation = animationState.microVariations[planetIndex] || 0;
    const microX = microVariation * 0.3;
    const microY = microVariation * 0.2;
    
    const x = CENTER_X + Math.cos(displayAngle) * planet.orbitRadius + microX;
    const y = CENTER_Y + Math.sin(displayAngle) * planet.orbitRadius + microY;
    
    return { x, y, angle: displayAngle };
  };

  // Create advanced orbit paths with mathematical precision
  const createVerticalHalfCirclePath = (radius: number) => {
    const startX = CENTER_X;
    const startY = CENTER_Y - radius;
    const endX = CENTER_X;
    const endY = CENTER_Y + radius;
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  };

  // Create segmented orbit paths with advanced spacing algorithms
  const createSegmentedOrbitPath = (radius: number, textContent: string) => {
    const avgCharWidth = 9.5;
    const letterSpacing = 0.04;
    const approxTextWidth = textContent.length * avgCharWidth * (1 + letterSpacing);
    const arcLength = approxTextWidth + 12;
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

  // Enhanced expanded content with advanced staggered animations
  const renderExpandedContent = () => {
    if (!expandedAge || !animationState.contentVisible) return null;
    
    return (
      <div className="orbital-overlay enhanced ultra-crisp" onClick={handleBackgroundClick}>
        <div 
          className="orbital-overlay-fill enhanced ultra-crisp" 
          style={{ 
            "--ring-color": GOLD,
            opacity: animationState.contentVisible ? 1 : 0
          } as React.CSSProperties} 
        />
        
        <div 
          className="orbital-expanded-content enhanced ultra-crisp"
          style={{
            opacity: animationState.contentVisible ? 1 : 0,
            transform: `translateY(${animationState.contentVisible ? 0 : 15}px) scale(${animationState.contentVisible ? 1 : 0.98})`,
            filter: `blur(${animationState.contentVisible ? 0 : 1}px)`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="expanded-topbar enhanced ultra-crisp">
            <div className="title-wrap enhanced ultra-crisp">
              <h2 className="expanded-title enhanced ultra-crisp">{getAgeDisplayName(expandedAge)}</h2>
              <div className="expanded-sub enhanced ultra-crisp">
                {expandedAge.start_year || '∞'} – {expandedAge.end_year || '∞'}
              </div>
            </div>

            <button 
              className="close-btn enhanced ultra-crisp" 
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

          <div className="expanded-body enhanced ultra-crisp">
            {expandedAge.description && (
              <p className="expanded-desc enhanced ultra-crisp">{expandedAge.description}</p>
            )}

            <div className="age-events-section enhanced ultra-crisp">
              {events.length > 0 ? (
                <>
                  <h3 className="events-title enhanced ultra-crisp">Timeline Events</h3>
                  <div className="expanded-grid enhanced ultra-crisp">
                    {events.slice(0, 6).map((event, index) => (
                      <div 
                        key={event.id} 
                        className="grid-item enhanced ultra-crisp"
                        style={{
                          animationDelay: `${(index * 0.05 + 0.1)}s`, // Ultra-fast stagger
                          transform: `translateY(${animationState.contentVisible ? 0 : 10}px) scale(${animationState.contentVisible ? 1 : 0.99})`,
                          opacity: animationState.contentVisible ? 1 : 0
                        }}
                      >
                        <div className="item-head enhanced ultra-crisp">
                          {new Date(event.date).getFullYear()}
                        </div>
                        <div className="item-body enhanced ultra-crisp">
                          <h4 className="event-title enhanced ultra-crisp">{event.title}</h4>
                          <p className="event-description enhanced ultra-crisp">
                            {event.description?.substring(0, 120)}
                            {event.description && event.description.length > 120 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {events.length > 6 && (
                    <p className="more-events-note enhanced ultra-crisp">
                      +{events.length - 6} more events in this age
                    </p>
                  )}
                </>
              ) : loading ? (
                <div className="loading-state enhanced ultra-crisp">
                  <div className="loading-spinner enhanced ultra-crisp"></div>
                  <p className="loading-text enhanced ultra-crisp">Loading events...</p>
                </div>
              ) : (
                <div className="expanded-grid enhanced ultra-crisp">
                  <div className="grid-item enhanced ultra-crisp">
                    <div className="item-head enhanced ultra-crisp">Key Event</div>
                    <div className="item-body enhanced ultra-crisp">Founding of sacred order and covenantal rite.</div>
                  </div>
                  <div className="grid-item enhanced ultra-crisp">
                    <div className="item-head enhanced ultra-crisp">Adversary</div>
                    <div className="item-body enhanced ultra-crisp">Serpentine usurper stirs at the edge of empire.</div>
                  </div>
                  <div className="grid-item enhanced ultra-crisp">
                    <div className="item-head enhanced ultra-crisp">Relics</div>
                    <div className="item-body enhanced ultra-crisp">Avestan tablets, consecrated flame, seven seals.</div>
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
    <div className={`expandable-orbital-dial enhanced ultra-crisp ${className} ${expandedAge ? 'has-expanded' : ''}`} ref={containerRef}>
      <div className="orbital-background enhanced ultra-crisp" />
      
      <div className="orbital-container enhanced ultra-crisp">
        <svg 
          width={viewportDimensions.width}
          height={viewportDimensions.height}
          viewBox={`0 0 ${viewportDimensions.width} ${viewportDimensions.height}`}
          className="orbital-svg enhanced ultra-crisp"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            // Ultra-crisp rendering with GPU optimization
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision',
            imageRendering: 'crisp-edges',
            // Hardware acceleration for 120fps
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        >
          <defs>
            {/* Ultra-advanced gradients with HDR-like quality */}
            {orbitingPlanets.map((planet, index) => (
              <radialGradient 
                key={`ultra-gradient-${index}`}
                id={`ultra-layer-gradient-${index}`} 
                cx="0.08" cy="0.5" r="0.8"
              >
                <stop offset="0%" stopColor={`rgba(206, 181, 72, ${0.16 + (index * 0.022)})`} />
                <stop offset="20%" stopColor={`rgba(206, 181, 72, ${0.13 + (index * 0.018)})`} />
                <stop offset="50%" stopColor={`rgba(206, 181, 72, ${0.09 + (index * 0.014)})`} />
                <stop offset="80%" stopColor={`rgba(206, 181, 72, ${0.05 + (index * 0.010)})`} />
                <stop offset="100%" stopColor="rgba(15, 15, 20, 0.48)" />
              </radialGradient>
            ))}
            
            <radialGradient id="ultraExpandGrad" cx="18%" cy="50%" r="130%">
              <stop offset="0%" stopColor="rgba(255, 215, 0, 0.28)" />
              <stop offset="10%" stopColor="rgba(206, 181, 72, 0.22)" />
              <stop offset="30%" stopColor="rgba(206, 181, 72, 0.17)" />
              <stop offset="60%" stopColor="rgba(206, 181, 72, 0.10)" />
              <stop offset="85%" stopColor="rgba(206, 181, 72, 0.04)" />
              <stop offset="100%" stopColor="rgba(15, 15, 20, 0.97)" />
            </radialGradient>
            
            <clipPath id="rightHalfClip">
              <rect 
                x={CENTER_X - 2} y={0} 
                width={viewportDimensions.width - (CENTER_X - 2)}
                height={viewportDimensions.height} 
              />
            </clipPath>

            {/* Ultra-crisp text paths */}
            {orbitingPlanets.map((planet, index) => (
              <path
                key={`ultra-textpath-${index}`}
                id={`ultra-orbit-path-${index}`}
                d={createVerticalHalfCirclePath(planet.orbitRadius)}
                fill="none"
              />
            ))}
          </defs>

          {/* 🚀 NEXT-GENERATION SEMICIRCLE LAYERS with ADVANCED 3D DEPTH */}
          <g className="semicircle-layers enhanced ultra-crisp">
            {orbitingPlanets.map((planet, index) => {
              const isThisExpanded = expandedAge?.id === planet.age.id;
              const layerRadius = planet.orbitRadius;
              const otherLayersExpanded = expandedAge && !isThisExpanded;
              
              // Ultra-advanced staggered fade with exponential decay
              const fadeDelay = index * LAYER_FADE_STAGGER / 1000;
              const fadeOpacity = otherLayersExpanded ? 
                Math.max(0.01, (1 - animationState.expandProgress) * Math.exp(-fadeDelay * 4.5)) : 1;

              // Dynamic 3D depth calculation
              const currentDepth = animationState.layerDepth[index] || (orbitingPlanets.length - index) * 2;
              const microVariation = animationState.microVariations[index] || 0;
              
              return (
                <g key={`ultra-semicircle-${index}`} className="semicircle-layer-group enhanced ultra-crisp">
                  <path
                    d={createAdvancedMorphingPath(
                      layerRadius,
                      isThisExpanded ? animationState.morphProgress : 0
                    )}
                    fill={isThisExpanded && animationState.morphProgress > 0.15 ? "url(#ultraExpandGrad)" : `url(#ultra-layer-gradient-${index})`}
                    stroke={GOLD}
                    strokeWidth={isThisExpanded ? 2.8 + (animationState.morphProgress * 1.8) : 1.4}
                    strokeOpacity={isThisExpanded ? 0.98 : 0.68}
                    className={`semicircle-layer enhanced ultra-crisp clickable-semicircle ${isThisExpanded ? 'expanded' : ''}`}
                    data-age-index={index}
                    style={{
                      transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
                      zIndex: isThisExpanded ? 999 : (50 - index),
                      // 🎯 REVOLUTIONARY 3D DEPTH SYSTEM
                      // Progressive shadows with organic micro-variations
                      // Deeper layers = larger Y-offset + more blur + stronger opacity
                      filter: isThisExpanded && animationState.morphProgress > 0.15
                        ? `drop-shadow(0 0 ${90 + (animationState.morphProgress * 140)}px rgba(255, 215, 0, ${0.85 + (animationState.morphProgress * 0.4)})) drop-shadow(0 ${currentDepth * 1.5}px ${currentDepth * 3}px rgba(0, 0, 0, 0.65))` 
                        : `drop-shadow(0 ${Math.max(2, 2 + index * 1.8 + microVariation * 0.5)}px ${Math.max(4, 6 + (index * 3.2) + Math.abs(microVariation))}px rgba(0, 0, 0, ${0.42 + (index * 0.06) + Math.abs(microVariation) * 0.02}))`,
                      opacity: otherLayersExpanded ? fadeOpacity * 0.02 : (0.88 + (index * 0.025)),
                      cursor: (animationState.isExpanding || animationState.isCollapsing) 
                        ? "wait" 
                        : (otherLayersExpanded ? "not-allowed" : "pointer"),
                      pointerEvents: (animationState.isExpanding || animationState.isCollapsing || otherLayersExpanded) 
                        ? "none" 
                        : "auto",
                      // Ultra-crisp edge rendering with GPU optimization
                      strokeLinejoin: 'round',
                      strokeLinecap: 'round',
                      willChange: 'transform, opacity, filter',
                      transform: `translateZ(${currentDepth}px) scale(${1 + currentDepth * 0.0008 + microVariation * 0.0002}) translate(${microVariation * 0.1}px, ${microVariation * 0.08}px)`,
                      backfaceVisibility: 'hidden'
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

          {/* Ultra-enhanced orbital elements with organic motion */}
          <g 
            className="orbital-elements enhanced ultra-crisp"
            style={{
              opacity: expandedAge ? Math.max(0, 1 - animationState.expandProgress * 2.2) : 1,
              transform: `scale(${expandedAge ? Math.max(0.75, 1 - animationState.expandProgress * 0.25) : 1})`,
              pointerEvents: (animationState.isExpanding || animationState.isCollapsing || expandedAge) ? "none" : "auto",
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Ultra-crisp orbit lines with mathematical precision */}
            {orbitingPlanets.map((planet, index) => {
              const segments = createSegmentedOrbitPath(planet.orbitRadius, planet.planetType);
              const microVar = animationState.microVariations[index] || 0;
              return (
                <g key={`ultra-orbit-${index}`}>
                  <path 
                    d={segments.beforeText} 
                    stroke={GOLD} 
                    strokeWidth={2.4} 
                    fill="none" 
                    className="orbit-line enhanced ultra-crisp" 
                    strokeLinecap="round"
                    style={{
                      shapeRendering: 'geometricPrecision',
                      vectorEffect: 'non-scaling-stroke',
                      willChange: 'opacity',
                      opacity: 0.9 + microVar * 0.02
                    }}
                  />
                  <path 
                    d={segments.afterText} 
                    stroke={GOLD} 
                    strokeWidth={2.4} 
                    fill="none" 
                    className="orbit-line enhanced ultra-crisp" 
                    strokeLinecap="round"
                    style={{
                      shapeRendering: 'geometricPrecision',
                      vectorEffect: 'non-scaling-stroke',
                      willChange: 'opacity',
                      opacity: 0.9 + microVar * 0.02
                    }}
                  />
                </g>
              );
            })}

            {/* Ultra-enhanced age text labels with advanced typography */}
            {orbitingPlanets.map((planet, index) => {
              const microVar = animationState.microVariations[index] || 0;
              return (
                <text
                  key={`ultra-text-${index}`}
                  fontSize="16.2"
                  fontFamily="'Inter', 'SF Pro Display', 'Segoe UI', system-ui, -apple-system, sans-serif"
                  fill={GOLD}
                  fontWeight="620"
                  className="orbit-text enhanced ultra-crisp clickable-text"
                  letterSpacing="0.02em"
                  style={{ 
                    cursor: (animationState.isExpanding || animationState.isCollapsing) ? "wait" : "pointer",
                    textRendering: 'geometricPrecision',
                    fontSmooth: 'never',
                    WebkitFontSmoothing: 'none',
                    MozOsxFontSmoothing: 'unset',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
                    opacity: 0.95 + microVar * 0.01,
                    transform: `scale(${1 + microVar * 0.003}) translate(${microVar * 0.05}px, 0)`
                  }}
                  onClick={(e) => {
                    if (!animationState.isExpanding && !animationState.isCollapsing) {
                      handleTextClick(planet, e);
                    }
                  }}
                >
                  <textPath href={`#ultra-orbit-path-${index}`} startOffset="50%" textAnchor="middle">
                    {planet.planetType}
                  </textPath>
                </text>
              );
            })}
          </g>

          {/* Ultra-enhanced central sun with organic breathing effect */}
          <circle
            cx={CENTER_X} cy={CENTER_Y} r={SUN_RADIUS}
            fill={GOLD}
            className="central-sun enhanced ultra-crisp"
            style={{
              opacity: expandedAge ? Math.max(0.15, 1 - animationState.expandProgress * 3.5) : 1,
              transform: `scale(${expandedAge ? Math.max(0.4, 1 - animationState.expandProgress * 0.6) : 1 + Math.sin(microVariationTimeRef.current * 0.8) * 0.02})`,
              filter: `drop-shadow(0 0 ${20 + Math.sin(microVariationTimeRef.current * 1.2) * 6}px rgba(206, 181, 72, ${0.75 + Math.sin(microVariationTimeRef.current * 1.5) * 0.25}))`,
              willChange: 'transform, opacity, filter',
              backfaceVisibility: 'hidden'
            }}
          />

          {/* Ultra-enhanced moving planets with organic motion */}
          <g 
            clipPath="url(#rightHalfClip)"
            style={{ 
              opacity: expandedAge ? Math.max(0, 1 - animationState.expandProgress * 2.1) : 1,
              transform: `scale(${expandedAge ? Math.max(0.65, 1 - animationState.expandProgress * 0.35) : 1})`,
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
          >
            {orbitingPlanets.map((planet, index) => {
              const position = calculatePlanetPosition(index);
              const selected = selectedAge?.id === planet.age.id;
              const microVar = animationState.microVariations[index] || 0;
              
              return (
                <g key={`ultra-planet-${index}`}>
                  <circle
                    cx={position.x} cy={position.y} r={NODE_RADIUS + microVar * 0.05}
                    fill={GOLD}
                    className={`planet-node enhanced ultra-crisp ${selected ? 'selected' : ''}`}
                    style={{ 
                      filter: `drop-shadow(0 ${2 + Math.abs(microVar) * 0.3}px ${8 + Math.abs(microVar) * 0.8}px rgba(0, 0, 0, ${0.45 + Math.abs(microVar) * 0.02}))`,
                      willChange: 'filter, transform',
                      backfaceVisibility: 'hidden',
                      opacity: 0.95 + microVar * 0.01
                    }}
                  />
                  {selected && (
                    <circle
                      cx={position.x} cy={position.y} r={NODE_RADIUS + 6 + microVar * 0.1}
                      stroke={GOLD} strokeWidth={1.9} fill="none"
                      className="selection-ring enhanced ultra-crisp" 
                      opacity="0.96"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(206, 181, 72, 0.5))",
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                        transform: `scale(${1 + microVar * 0.01})`
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
      
      {/* Ultra-advanced loading overlay with performance feedback */}
      {(animationState.isExpanding || animationState.isCollapsing) && (
        <div className="animation-overlay enhanced ultra-crisp">
          <div className="animation-feedback enhanced ultra-crisp">
            <div className="feedback-spinner ultra-smooth"></div>
            <span className="feedback-text">
              {animationState.isExpanding ? 'Expanding cosmos...' : 'Collapsing reality...'}
            </span>
            {performanceMonitorRef.current.adaptiveQuality && (
              <small className="performance-notice">Optimized for your device</small>
            )}
          </div>
        </div>
      )}
    </div>
  );
};