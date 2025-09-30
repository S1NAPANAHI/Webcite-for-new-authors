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
  spiralAngle: number; // New property for spiral text distribution
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
  const MIN_ORBIT_RADIUS = 65; // Increased from 60 for more center padding
  const ORBIT_STEP = 42; // Increased from 35 for more even spacing
  
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

  // Initialize orbiting planets with randomized starting positions and SPIRAL text distribution
  useEffect(() => {
    if (ages.length === 0) return;

    const planets: OrbitingPlanet[] = ages.map((age, index) => {
      // Randomize initial position along the FULL orbit (0 to 2π)
      const randomStartAngle = Math.random() * 2 * Math.PI; // Full circle
      
      // SPIRAL TEXT DISTRIBUTION: Calculate spiral angle for each orbit
      const totalArcs = ages.length;
      const spiralSpread = Math.PI * 1.4; // Total spiral spread (about 252 degrees)
      const spiralStartAngle = Math.PI * 0.7; // Start angle (about 126 degrees)
      const spiralAngle = spiralStartAngle + (spiralSpread * (index / Math.max(totalArcs - 1, 1)));
      
      return {
        age,
        orbitRadius: MIN_ORBIT_RADIUS + (index * ORBIT_STEP),
        angle: randomStartAngle,
        speed: 0.015 + (index * 0.003), // This is not used anymore
        size: NODE_RADIUS,
        planetType: ageNames[index] || `${age.age_number} Age`,
        initialAngle: randomStartAngle,
        spiralAngle: spiralAngle // Assign spiral angle for text positioning
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

  // Calculate SPIRAL text position for each orbit
  const calculateSpiralTextPosition = (planet: OrbitingPlanet) => {
    const radius = planet.orbitRadius + 25; // Offset text outside the orbit line
    const x = CENTER_X + Math.cos(planet.spiralAngle) * radius;
    const y = CENTER_Y + Math.sin(planet.spiralAngle) * radius;
    
    // Calculate rotation angle to make text tangent to spiral
    const rotationAngle = (planet.spiralAngle * 180 / Math.PI) + 90; // Tangent orientation
    
    return { x, y, rotation: rotationAngle };
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
    <div className={`orbital-timeline-dial vertical-half-circle-design improved-ui ${className}`}>
      <div className="vertical-half-circle-container improved-spacing">
        <svg 
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="orbital-svg vertical improved"
        >
          <defs>
            {/* CHALKY TEXTURE FILTER */}
            <filter id="chalkyTexture" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.04" 
                numOctaves="3" 
                result="noise"
              />
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="noise" 
                scale="2.5"
                result="displacement"
              />
              <feGaussianBlur 
                in="displacement" 
                stdDeviation="0.5" 
                result="blur"
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

          {/* Orbit lines with CHALKY TEXTURE - NOT CLIPPED */}
          {orbitingPlanets.map((planet, index) => {
            const orbitPath = createVerticalHalfCirclePath(planet.orbitRadius);
            return (
              <path
                key={`orbit-line-${index}`}
                d={orbitPath}
                stroke={GOLD}
                strokeWidth={3}
                fill="none"
                className="orbit-line static chalky"
                strokeLinecap="round"
                filter="url(#chalkyTexture)" // Apply chalky texture
              />
            );
          })}

          {/* SPIRAL distributed text - NOT CLIPPED */}
          {orbitingPlanets.map((planet, index) => {
            const textPos = calculateSpiralTextPosition(planet);
            return (
              <text
                key={`orbit-text-${index}`}
                x={textPos.x}
                y={textPos.y}
                fontSize="18" // Slightly larger for Papyrus
                fontFamily="Papyrus, Comic Sans MS, fantasy, cursive" // Papyrus font with fallbacks
                fill={GOLD}
                fontWeight="bold"
                className="orbit-text static spiral papyrus"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${textPos.rotation} ${textPos.x} ${textPos.y})`}
                letterSpacing="0.08em" // Better spacing for ancient feel
                textShadow="0 1px 0 rgba(0,0,0,0.6)" // Better text shadow
              >
                {planet.planetType}
              </text>
            );
          })}

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