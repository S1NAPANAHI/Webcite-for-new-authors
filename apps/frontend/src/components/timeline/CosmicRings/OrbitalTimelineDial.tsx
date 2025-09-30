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

  // Constants for half-circle design
  const GOLD = '#CEB548';
  const SVG_SIZE = 600;
  const CENTER_X = 300; // Center of the half-circle
  const CENTER_Y = 300;
  const SUN_RADIUS = 32;
  const NODE_RADIUS = 20;
  const ORBIT_STEP = 45;
  const MIN_ORBIT_RADIUS = 80;

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
        angle: 0, // Starting angle for half-circle
        speed: 0.008 + (index * 0.002), // Very slow speeds
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
      setAnimationTime(prev => prev + 0.003); // Very slow animation
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

  // Calculate position for half-circle (π radians, 180 degrees)
  const calculatePlanetPosition = (planet: OrbitingPlanet) => {
    const currentAngle = Math.PI - ((animationTime * planet.speed) % Math.PI); // Half-circle from π to 0
    const x = CENTER_X + Math.cos(currentAngle) * planet.orbitRadius;
    const y = CENTER_Y + Math.sin(currentAngle) * planet.orbitRadius;
    return { x, y, angle: currentAngle };
  };

  // Create half-circle arc path
  const createHalfCirclePath = (radius: number) => {
    const startX = CENTER_X - radius;
    const startY = CENTER_Y;
    const endX = CENTER_X + radius;
    const endY = CENTER_Y;
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  };

  const isSelected = (planet: OrbitingPlanet) => {
    return selectedAge?.id === planet.age.id;
  };

  return (
    <div className={`orbital-timeline-dial half-circle-design ${className}`}>
      <div className="half-circle-container">
        <svg 
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="orbital-svg"
        >
          {/* Define paths for textPath */}
          <defs>
            {orbitingPlanets.map((planet, index) => (
              <path
                key={`textpath-${index}`}
                id={`orbit-path-${index}`}
                d={createHalfCirclePath(planet.orbitRadius)}
                fill="none"
              />
            ))}
          </defs>

          {/* Orbit lines */}
          {orbitingPlanets.map((planet, index) => (
            <path
              key={`orbit-${index}`}
              d={createHalfCirclePath(planet.orbitRadius)}
              stroke={GOLD}
              strokeWidth={4}
              fill="none"
              className="orbit-line"
            />
          ))}

          {/* Central Sun */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={SUN_RADIUS}
            fill={GOLD}
            className="central-sun-flat"
          />

          {/* Orbiting Planets */}
          {orbitingPlanets.map((planet, index) => {
            const position = calculatePlanetPosition(planet);
            const selected = isSelected(planet);
            
            return (
              <g key={`planet-group-${index}`}>
                {/* Planet node */}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={NODE_RADIUS}
                  fill={GOLD}
                  className={`planet-node ${selected ? 'selected' : ''}`}
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
                    className="selection-ring"
                    opacity="0.7"
                  />
                )}
                
                {/* Rotating age text along orbit path */}
                <text
                  fontSize="16"
                  fontFamily="Georgia, serif"
                  fill={GOLD}
                  fontWeight="bold"
                  className="orbit-text"
                >
                  <textPath
                    href={`#orbit-path-${index}`}
                    startOffset={`${((position.angle / Math.PI) * 100).toFixed(1)}%`}
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
          <div className="selected-age-info">
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