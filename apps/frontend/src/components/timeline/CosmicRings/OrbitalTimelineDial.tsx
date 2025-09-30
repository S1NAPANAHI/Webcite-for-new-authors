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
  const [animationTime, setAnimationTime] = useState(0);

  // Constants for VERTICAL half-circle design (top to bottom on left side)
  const GOLD = '#CEB548';
  const SVG_SIZE = 800;
  const CENTER_X = 80; // Left side position
  const CENTER_Y = 400; // Vertical center
  const SUN_RADIUS = 24;
  const NODE_RADIUS = 16;
  const ORBIT_STEP = 35;
  const MIN_ORBIT_RADIUS = 60;

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
        speed: 0.015 + (index * 0.003), // Base speed for visible arc
        size: NODE_RADIUS,
        planetType: ageNames[index] || `${age.age_number} Age`,
        initialAngle: randomStartAngle
      };
    });

    setOrbitingPlanets(planets);
  }, [ages]);

  // Animation loop
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      setAnimationTime(prev => prev + 0.02);
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

  // Calculate position for FULL orbit with accelerated back-side
  const calculatePlanetPosition = (planet: OrbitingPlanet) => {
    // Calculate current angle in full orbit (0 to 2π)
    const baseAngle = (planet.initialAngle + animationTime * planet.speed) % (2 * Math.PI);
    
    // Determine if planet is on visible side or back side
    // Visible side: from 3π/2 to π/2 (going through 0, which is rightmost point)
    // This creates a vertical half-circle from top (-π/2) to bottom (π/2) on the right side
    
    let currentAngle;
    let isVisible = false;
    
    // Convert to continuous angle for easier calculation
    const normalizedAngle = baseAngle;
    
    // Visible arc: 3π/2 to π/2 (270° to 90°, going through 0°)
    // This means we show the right side of the circle
    if (normalizedAngle >= 3 * Math.PI / 2 || normalizedAngle <= Math.PI / 2) {
      // Planet is on visible side - normal speed
      isVisible = true;
      
      // Map to our display coordinates (-π/2 to π/2)
      if (normalizedAngle >= 3 * Math.PI / 2) {
        // Top portion: 3π/2 to 2π maps to -π/2 to 0
        currentAngle = normalizedAngle - 2 * Math.PI; // This gives us -π/2 to 0
      } else {
        // Bottom portion: 0 to π/2 maps to 0 to π/2
        currentAngle = normalizedAngle;
      }
    } else {
      // Planet is on back side (invisible) - this case shouldn't render
      isVisible = false;
      currentAngle = 0; // Dummy value, won't be used
    }
    
    if (!isVisible) {
      return { x: 0, y: 0, angle: currentAngle, isVisible: false };
    }
    
    const x = CENTER_X + Math.cos(currentAngle) * planet.orbitRadius;
    const y = CENTER_Y + Math.sin(currentAngle) * planet.orbitRadius;
    
    return { x, y, angle: currentAngle, isVisible: true };
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
    const textSegmentLength = Math.max(textLength * 0.06, 0.3); // Reduced from 0.12 to 0.06
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
          {/* Define paths for textPath */}
          <defs>
            {orbitingPlanets.map((planet, index) => (
              <path
                key={`textpath-${index}`}
                id={`vertical-orbit-path-${index}`}
                d={createVerticalHalfCirclePath(planet.orbitRadius)}
                fill="none"
              />
            ))}
          </defs>

          {/* Orbit lines with SMALLER cut-outs for text */}
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

          {/* Static text integrated into orbit lines using textPath */}
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

          {/* Central Sun (STATIC) */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={SUN_RADIUS}
            fill={GOLD}
            className="central-sun-flat static"
          />

          {/* MOVING Planets - only visible when on front side of orbit */}
          {orbitingPlanets.map((planet, index) => {
            const position = calculatePlanetPosition(planet);
            const selected = isSelected(planet);
            
            // Only render if planet is on visible side
            if (!position.isVisible) return null;
            
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