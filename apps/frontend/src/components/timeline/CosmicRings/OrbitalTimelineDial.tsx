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

  // Initialize orbiting planets
  useEffect(() => {
    if (ages.length === 0) return;

    const planets: OrbitingPlanet[] = ages.map((age, index) => {
      return {
        age,
        orbitRadius: MIN_ORBIT_RADIUS + (index * ORBIT_STEP),
        angle: -Math.PI / 2, // Start at top (-90 degrees)
        speed: 0.003 + (index * 0.0005), // Very slow, smooth speeds
        size: NODE_RADIUS,
        planetType: ageNames[index] || `${age.age_number} Age`
      };
    });

    setOrbitingPlanets(planets);
  }, [ages]);

  // Smooth animation loop
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Smooth, consistent animation speed
      setAnimationTime(prev => prev + 0.002);
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

  // Calculate position for VERTICAL half-circle (top to bottom, opening to the right)
  const calculatePlanetPosition = (planet: OrbitingPlanet) => {
    // Vertical half-circle: from -π/2 (top) to π/2 (bottom) going clockwise on RIGHT side
    const currentAngle = -Math.PI / 2 + ((animationTime * planet.speed) % Math.PI);
    
    const x = CENTER_X + Math.cos(currentAngle) * planet.orbitRadius;
    const y = CENTER_Y + Math.sin(currentAngle) * planet.orbitRadius;
    return { x, y, angle: currentAngle };
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
                d={createVerticalHalfCirclePath(planet.orbitRadius)}
                fill="none"
              />
            ))}
          </defs>

          {/* STATIC Orbit lines (these DON'T move) */}
          {orbitingPlanets.map((planet, index) => (
            <path
              key={`orbit-${index}`}
              d={createVerticalHalfCirclePath(planet.orbitRadius)}
              stroke={GOLD}
              strokeWidth={3}
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
            
            // Calculate text offset to avoid overlap with orbit lines
            const textOffset = planet.orbitRadius + 25; // Push text outside the orbit
            const textX = CENTER_X + Math.cos(position.angle) * textOffset;
            const textY = CENTER_Y + Math.sin(position.angle) * textOffset;
            
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
                
                {/* Age text positioned OUTSIDE orbit lines */}
                <text
                  x={textX}
                  y={textY}
                  fontSize="14"
                  fontFamily="Georgia, serif"
                  fill={GOLD}
                  fontWeight="bold"
                  className="orbit-text moving"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {planet.planetType}
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