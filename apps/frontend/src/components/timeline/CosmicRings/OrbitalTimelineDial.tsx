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
}

export const OrbitalTimelineDial: React.FC<OrbitalTimelineDialProps> = ({
  ages,
  selectedAge,
  onAgeSelect,
  className = ''
}) => {
  const [orbitingPlanets, setOrbitingPlanets] = useState<OrbitingPlanet[]>([]);
  const [animationTime, setAnimationTime] = useState(0);

  // Constants for VERTICAL half-circle design opening to the RIGHT
  const GOLD = '#CEB548';
  const SVG_SIZE = 800;
  const CENTER_X = 100; // LEFT side of viewport - this is the center of the half-circle
  const CENTER_Y = 400; // Center vertically
  const SUN_RADIUS = 28;
  const NODE_RADIUS = 18;
  const ORBIT_STEP = 40;
  const MIN_ORBIT_RADIUS = 70;

  // Age names for text rotation
  const ageNames = [
    'First Age', 'Second Age', 'Third Age', 'Fourth Age', 'Fifth Age',
    'Sixth Age', 'Seventh Age', 'Eighth Age', 'Ninth Age'
  ];

  // Initialize orbiting planets
  useEffect(() => {
    if (ages.length === 0) return;

    const planets: OrbitingPlanet[] = ages.map((age, index) => {
      return {
        age,
        orbitRadius: MIN_ORBIT_RADIUS + (index * ORBIT_STEP),
        angle: 0, // Start at rightmost point (0 radians)
        speed: 0.004 + (index * 0.001), // Very slow speeds, inner orbits faster
        size: NODE_RADIUS,
        planetType: ageNames[index] || `${age.age_number} Age`
      };
    });

    setOrbitingPlanets(planets);
  }, [ages]);

  // Slow animation loop
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      setAnimationTime(prev => prev + 0.008); // Slow, contemplative animation
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

  // Calculate position for VERTICAL half-circle opening to the RIGHT
  // Planets move from 0 (right) to π (left) - i.e., semicircle on the right side
  const calculatePlanetPosition = (planet: OrbitingPlanet) => {
    // Right-opening half-circle: from 0 (right) to π (left) going counter-clockwise
    const currentAngle = (animationTime * planet.speed) % Math.PI;
    
    const x = CENTER_X + Math.cos(currentAngle) * planet.orbitRadius;
    const y = CENTER_Y + Math.sin(currentAngle) * planet.orbitRadius;
    return { x, y, angle: currentAngle };
  };

  // Create VERTICAL half-circle arc path opening to the RIGHT (static orbit lines)
  const createRightOpeningHalfCirclePath = (radius: number) => {
    const startX = CENTER_X + radius; // Start at rightmost point
    const startY = CENTER_Y;
    const endX = CENTER_X - radius; // End at leftmost point
    const endY = CENTER_Y;
    
    // Half-circle arc from right to left (top half)
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 0 ${endX} ${endY}`;
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
          {/* Define STATIC paths for textPath (these DON'T rotate) */}
          <defs>
            {orbitingPlanets.map((planet, index) => (
              <path
                key={`textpath-${index}`}
                id={`vertical-orbit-path-${index}`}
                d={createRightOpeningHalfCirclePath(planet.orbitRadius)}
                fill="none"
              />
            ))}
          </defs>

          {/* STATIC Orbit lines (these DON'T move) */}
          {orbitingPlanets.map((planet, index) => (
            <path
              key={`orbit-${index}`}
              d={createRightOpeningHalfCirclePath(planet.orbitRadius)}
              stroke={GOLD}
              strokeWidth={4}
              fill="none"
              className="orbit-line static"
            />
          ))}

          {/* Central Sun (STATIC) */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={SUN_RADIUS}
            fill={GOLD}
            className="central-sun-flat static"
          />

          {/* MOVING Planets and rotating text */}
          {orbitingPlanets.map((planet, index) => {
            const position = calculatePlanetPosition(planet);
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
                    r={NODE_RADIUS + 8}
                    stroke={GOLD}
                    strokeWidth={2}
                    fill="none"
                    className="selection-ring moving"
                    opacity="0.7"
                  />
                )}
                
                {/* Rotating age text along STATIC orbit path */}
                <text
                  fontSize="16"
                  fontFamily="Georgia, serif"
                  fill={GOLD}
                  fontWeight="bold"
                  className="orbit-text moving"
                >
                  <textPath
                    href={`#vertical-orbit-path-${index}`}
                    startOffset={`${(position.angle / Math.PI * 100).toFixed(1)}%`}
                    dominantBaseline="middle"
                    textAnchor="middle"
                  >
                    {planet.planetType}
                  </textPath>
                </text>
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