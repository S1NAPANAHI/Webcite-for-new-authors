import React, { useEffect, useState } from 'react';
import { Age } from '../../../lib/api-timeline';
import './orbital-timeline.css';

export interface OrbitalTimelineDialProps {
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
}

export const OrbitalTimelineDial: React.FC<OrbitalTimelineDialProps> = ({
  ages,
  selectedAge,
  onAgeSelect,
  className = ''
}) => {
  const [orbitingPlanets, setOrbitingPlanets] = useState<OrbitingPlanet[]>([]);
  const [planetAngles, setPlanetAngles] = useState<number[]>([]);

  // Constants for VERTICAL half-circle design (top to bottom on left side)
  const GOLD = '#CEB548';
  const SVG_SIZE = 800;
  const CENTER_X = 80; // Left side position
  const CENTER_Y = 400; // Vertical center
  const SUN_RADIUS = 24;
  const NODE_RADIUS = 16;
  
  // IMPROVED SPACING: More center padding and even gaps
  const MIN_ORBIT_RADIUS = 72; // Increased from 60 for much more center padding
  const ORBIT_STEP = 44; // Increased from 35 for more even spacing
  
  // Animation speed constants - FIXED VALUES
  const FULL_CIRCLE = 2 * Math.PI;
  const BASE_SPEED = 0.008;               // Slow base speed for contemplative visible movement
  const HIDDEN_SPEED_MULTIPLIER = 3;      // 3x faster when hidden
  
  // EXTENDED speed zone constants (+10° on each side)
  const NORMAL_SPEED_START = (340 * Math.PI) / 180; // 340° in radians ≈ 5.93
  const NORMAL_SPEED_END = (200 * Math.PI) / 180;   // 200° in radians ≈ 3.49

  // Age names for text rotation
  const ageNames = [
    'First Age', 'Second Age', 'Third Age', 'Fourth Age', 'Fifth Age',
    'Sixth Age', 'Seventh Age', 'Eighth Age', 'Ninth Age'
  ];

  // Initialize orbiting planets with randomized starting positions
  useEffect(() => {
    if (ages.length === 0) return;

    const planets: OrbitingPlanet[] = ages.map((age, index) => {
      // Randomize initial position along the FULL orbit (0 to 2π)
      const randomStartAngle = Math.random() * 2 * Math.PI; // Full circle
      
      return {
        age,
        orbitRadius: MIN_ORBIT_RADIUS + (index * ORBIT_STEP),
        angle: randomStartAngle,
        speed: 0.015 + (index * 0.003), // This is not used anymore
        size: NODE_RADIUS,
        planetType: ageNames[index] || `${age.age_number} Age`,
        initialAngle: randomStartAngle
      };
    });

    setOrbitingPlanets(planets);
    // Initialize angles array
    setPlanetAngles(planets.map(p => p.initialAngle));
  }, [ages]);

  // Animation loop with EXTENDED normal speed zone logic
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      setPlanetAngles(prevAngles => 
        prevAngles.map((angle) => {
          // Normalize angle to 0 to 2π range
          let normalizedAngle = (angle % FULL_CIRCLE + FULL_CIRCLE) % FULL_CIRCLE;
          
          // EXTENDED LOGIC: Check if planet is in NORMAL SPEED range
          // Normal speed zone: 340° to 200° (crosses 0°, so it's: >= 340° OR <= 200°)
          // Fast speed zone: 200° to 340°
          const isInNormalSpeedRange = (normalizedAngle >= NORMAL_SPEED_START) || (normalizedAngle <= NORMAL_SPEED_END);
          
          // Apply appropriate speed based on position
          let delta;
          if (isInNormalSpeedRange) {
            // Extended normal speed zone: slow, contemplative movement for longer
            delta = BASE_SPEED;
          } else {
            // Shorter fast speed zone: quick traversal behind mask
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
  }, []);

  const handlePlanetClick = (planet: OrbitingPlanet) => {
    onAgeSelect(planet.age);
  };

  // Calculate position for FULL orbit with current angle from state
  const calculatePlanetPosition = (planetIndex: number) => {
    if (!planetAngles[planetIndex] || !orbitingPlanets[planetIndex]) {
      return { x: CENTER_X, y: CENTER_Y, angle: 0 };
    }
    
    const planet = orbitingPlanets[planetIndex];
    const currentAngle = planetAngles[planetIndex];
    
    // Convert full orbit to our coordinate system
    // We want to show the right side of the orbit as our half-circle
    // Map full orbit (0 to 2π) to our display coordinates
    const displayAngle = currentAngle - Math.PI / 2; // Offset so 0 is at top
    
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

  // IMPROVED: Create segmented orbit path with DYNAMIC text-sized cut-outs
  const createSegmentedOrbitPath = (radius: number, textContent: string) => {
    // Calculate approximate text width based on content and font size
    // Using Papyrus font at 20px size
    const avgCharWidth = 12; // Papyrus is wider than average fonts
    const letterSpacing = 0.08; // em value
    const approxTextWidth = textContent.length * avgCharWidth * (1 + letterSpacing);
    
    // Convert text width to arc length and then to angle
    const arcLength = approxTextWidth + 20; // Add 20px padding (10px each side)
    const textSegmentAngle = arcLength / radius; // Convert pixels to radians
    
    const textCenterAngle = 0; // Center the text at the rightmost point of arc
    
    const startAngle = -Math.PI / 2; // Top
    const endAngle = Math.PI / 2; // Bottom
    const textStartAngle = textCenterAngle - textSegmentAngle / 2;
    const textEndAngle = textCenterAngle + textSegmentAngle / 2;
    
    // Calculate coordinates
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

  const isSelected = (planet: OrbitingPlanet) => {
    return selectedAge?.id === planet.age.id;
  };

  return (
    <div className={`orbital-timeline-dial vertical-half-circle-design improved-ui ${className}`}>
      <div className="vertical-half-circle-container improved-spacing">
        <svg 
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="orbital-svg vertical improved"
        >
          <defs>
            {/* Define paths for textPath */}
            {orbitingPlanets.map((planet, index) => (
              <path
                key={`textpath-${index}`}
                id={`vertical-orbit-path-${index}`}
                d={createVerticalHalfCirclePath(planet.orbitRadius)}
                fill="none"
              />
            ))}
            
            {/* SUBTLE CHALKY TEXTURE FILTER - Much lighter effect */}
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
            
            {/* FIXED MASKING: Extended clip path to cover orbit line overflow */}
            <clipPath id="rightHalfClip">
              {/* Rectangle covering the right side, extended 4px left to mask overflows */}
              <rect 
                x={CENTER_X - 4}  // Extended 4px left to cover overflows
                y={0} 
                width={SVG_SIZE - (CENTER_X - 4)}  // Adjusted width accordingly
                height={SVG_SIZE} 
                fill="white"
              />
            </clipPath>
          </defs>

          {/* IMPROVED: Orbit lines with DYNAMIC text-sized cut-outs - HIGH QUALITY */}
          {orbitingPlanets.map((planet, index) => {
            const segments = createSegmentedOrbitPath(planet.orbitRadius, planet.planetType);
            return (
              <g key={`orbit-segments-${index}`}>
                {/* Segment before text */}
                <path
                  d={segments.beforeText}
                  stroke={GOLD}
                  strokeWidth={3}
                  fill="none"
                  className="orbit-line static high-quality"
                  strokeLinecap="round"
                  filter="url(#subtleChalkyTexture)" // Very subtle texture
                  vectorEffect="non-scaling-stroke"
                  shapeRendering="geometricPrecision"
                />
                {/* Segment after text */}
                <path
                  d={segments.afterText}
                  stroke={GOLD}
                  strokeWidth={3}
                  fill="none"
                  className="orbit-line static high-quality"
                  strokeLinecap="round"
                  filter="url(#subtleChalkyTexture)" // Very subtle texture
                  vectorEffect="non-scaling-stroke"
                  shapeRendering="geometricPrecision"
                />
              </g>
            );
          })}

          {/* RESTORED: Static text integrated into orbit lines - PROPERLY POSITIONED */}
          {orbitingPlanets.map((planet, index) => (
            <text
              key={`orbit-text-${index}`}
              fontSize="20" // Matching the calculation in createSegmentedOrbitPath
              fontFamily="Papyrus, Comic Sans MS, fantasy, cursive" // Papyrus font with fallbacks
              fill={GOLD}
              fontWeight="bold"
              className="orbit-text static papyrus positioned"
              letterSpacing="0.08em" // Matching the calculation
            >
              <textPath
                href={`#vertical-orbit-path-${index}`}
                startOffset="50%" // Center the text on the right side of arc
                dominantBaseline="middle"
                textAnchor="middle"
              >
                {planet.planetType}
              </textPath>
            </text>
          ))}

          {/* Central Sun (STATIC) - NOT CLIPPED */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={SUN_RADIUS}
            fill={GOLD}
            className="central-sun-flat static"
          />

          {/* CLIPPED GROUP: Planets with smooth masking transition */}
          <g clipPath="url(#rightHalfClip)">
            {/* MOVING Planets with extended normal speed zone - ALL planets render, clipping handles visibility */}
            {orbitingPlanets.map((planet, index) => {
              const position = calculatePlanetPosition(index);
              const selected = isSelected(planet);
              
              return (
                <g key={`planet-group-${index}`}>
                  {/* Moving planet node */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={NODE_RADIUS}
                    fill={GOLD}
                    className={`planet-node moving ${selected ? 'selected' : ''}`}
                    onClick={() => handlePlanetClick(planet)}
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

        {/* Age info panel */}
        {selectedAge && (
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
      </div>
    </div>
  );
};