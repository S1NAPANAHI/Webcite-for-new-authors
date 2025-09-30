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
  const ORBIT_STEP = 35;
  const MIN_ORBIT_RADIUS = 60;
  
  // Animation speed constants - FIXED VALUES
  const FULL_CIRCLE = 2 * Math.PI;
  const BASE_SPEED = 0.008;               // Slow base speed for contemplative visible movement
  const HIDDEN_SPEED_MULTIPLIER = 3;      // 3x faster when hidden

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

  // Animation loop with CORRECTED variable speed logic
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      setPlanetAngles(prevAngles => 
        prevAngles.map((angle) => {
          // Normalize angle to 0 to 2π range
          let normalizedAngle = (angle % FULL_CIRCLE + FULL_CIRCLE) % FULL_CIRCLE;
          
          // CORRECTED LOGIC: Check if planet is in VISIBLE range
          // Visible arc: 0° to 180° (right half-circle that we can see)
          // Hidden arc: 180° to 360° (left half-circle behind the mask)
          const isInVisibleRange = normalizedAngle >= 0 && normalizedAngle <= Math.PI;
          
          // Apply appropriate speed based on position
          let delta;
          if (isInVisibleRange) {
            // On visible right half: slow, contemplative speed
            delta = BASE_SPEED;
          } else {
            // On hidden left half: fast speed to "rush" behind the mask
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

  // Create segmented orbit path with SMALLER cut-outs for text
  const createSegmentedOrbitPath = (radius: number, textLength: number) => {
    // Much smaller text gap - just enough for the text with minimal padding
    const textSegmentLength = Math.max(textLength * 0.06, 0.3);
    const textCenterAngle = 0; // Center the text at the rightmost point of arc
    
    const startAngle = -Math.PI / 2; // Top
    const endAngle = Math.PI / 2; // Bottom
    const textStartAngle = textCenterAngle - textSegmentLength / 2;
    const textEndAngle = textCenterAngle + textSegmentLength / 2;
    
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
    <div className={`orbital-timeline-dial vertical-half-circle-design ${className}`}>
      <div className="vertical-half-circle-container">
        <svg 
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="orbital-svg vertical"
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

          {/* Orbit lines with SMALLER cut-outs for text - NOT CLIPPED */}
          {orbitingPlanets.map((planet, index) => {
            const segments = createSegmentedOrbitPath(planet.orbitRadius, planet.planetType.length);
            return (
              <g key={`orbit-segments-${index}`}>
                {/* Segment before text */}
                <path
                  d={segments.beforeText}
                  stroke={GOLD}
                  strokeWidth={3}
                  fill="none"
                  className="orbit-line static"
                  strokeLinecap="round"
                />
                {/* Segment after text */}
                <path
                  d={segments.afterText}
                  stroke={GOLD}
                  strokeWidth={3}
                  fill="none"
                  className="orbit-line static"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Static text integrated into orbit lines - NOT CLIPPED */}
          {orbitingPlanets.map((planet, index) => (
            <text
              key={`orbit-text-${index}`}
              fontSize="13"
              fontFamily="Georgia, serif"
              fill={GOLD}
              fontWeight="bold"
              className="orbit-text static"
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
            {/* MOVING Planets with proper variable speed - ALL planets render, clipping handles visibility */}
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
          <div className="selected-age-info vertical">
            <h3 className="age-title">{selectedAge.name || selectedAge.title}</h3>
            <p className="age-years">
              {selectedAge.start_year ? `${selectedAge.start_year}` : '∞'} - {selectedAge.end_year || '∞'}
            </p>
            <p className="age-description">
              {selectedAge.description?.substring(0, 150)}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};