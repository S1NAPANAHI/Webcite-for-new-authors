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
  color: string;
  glowColor: string;
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

  // Planet color schemes based on cosmic age
  const getPlanetProperties = (age: Age, index: number) => {
    const colorSchemes = [
      { color: '#FFD700', glowColor: '#FFF8DC', type: 'Golden' },      // Golden Age
      { color: '#CD7F32', glowColor: '#DEB887', type: 'Bronze' },      // Bronze
      { color: '#FF6347', glowColor: '#FFE4E1', type: 'Crimson' },     // Red/Fire
      { color: '#4169E1', glowColor: '#E6E6FA', type: 'Sapphire' },    // Blue
      { color: '#9370DB', glowColor: '#E6E6FA', type: 'Amethyst' },    // Purple/Mystical
      { color: '#32CD32', glowColor: '#F0FFF0', type: 'Emerald' },     // Green/Nature
      { color: '#FF1493', glowColor: '#FFF0F5', type: 'Ruby' },        // Pink/Magenta
      { color: '#20B2AA', glowColor: '#F0FFFF', type: 'Turquoise' },   // Cyan/Teal
      { color: '#FF8C00', glowColor: '#FFF8DC', type: 'Amber' }        // Orange/Amber
    ];

    const scheme = colorSchemes[index % colorSchemes.length];
    return {
      ...scheme,
      orbitRadius: 80 + (index * 35), // Spaced out orbits
      speed: 0.2 + (index * 0.1), // Different orbital speeds
      size: 12 + (index % 3) * 4, // Varying planet sizes
      angle: (index * (360 / ages.length)) * (Math.PI / 180) // Initial positions spread out
    };
  };

  // Initialize orbiting planets
  useEffect(() => {
    if (ages.length === 0) return;

    const planets: OrbitingPlanet[] = ages.map((age, index) => {
      const props = getPlanetProperties(age, index);
      return {
        age,
        orbitRadius: props.orbitRadius,
        angle: props.angle,
        speed: props.speed,
        size: props.size,
        color: props.color,
        glowColor: props.glowColor,
        planetType: props.type
      };
    });

    setOrbitingPlanets(planets);
  }, [ages]);

  // Animation loop for orbital motion
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      setAnimationTime(prev => prev + 0.016); // ~60fps
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

  const calculatePlanetPosition = (planet: OrbitingPlanet) => {
    const currentAngle = planet.angle + (animationTime * planet.speed);
    const x = Math.cos(currentAngle) * planet.orbitRadius;
    const y = Math.sin(currentAngle) * planet.orbitRadius;
    return { x, y, angle: currentAngle };
  };

  const isSelected = (planet: OrbitingPlanet) => {
    return selectedAge?.id === planet.age.id;
  };

  return (
    <div className={`orbital-timeline-dial ${className}`}>
      <div className="orbital-container">
        {/* Central Sun/Core */}
        <div className="central-sun">
          <div className="sun-core">
            <div className="sun-flare"></div>
            <div className="sun-rings">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="sun-ring"
                  style={{
                    width: `${20 + i * 8}px`,
                    height: `${20 + i * 8}px`,
                    animationDelay: `${i * 0.5}s`,
                    opacity: 0.8 - (i * 0.2)
                  }}
                />
              ))}
            </div>
            <div className="sun-symbol">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Orbit Paths */}
        {orbitingPlanets.map((planet, index) => (
          <div
            key={`orbit-${index}`}
            className="orbit-path"
            style={{
              width: `${planet.orbitRadius * 2}px`,
              height: `${planet.orbitRadius * 2}px`,
            }}
          >
            {/* Golden orbit trail */}
            <div className="orbit-trail"></div>
          </div>
        ))}

        {/* Orbiting Planets */}
        {orbitingPlanets.map((planet, index) => {
          const position = calculatePlanetPosition(planet);
          const selected = isSelected(planet);
          
          return (
            <div
              key={`planet-${index}`}
              className={`orbiting-planet ${selected ? 'selected' : ''}`}
              style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                width: `${planet.size}px`,
                height: `${planet.size}px`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer'
              }}
              onClick={() => handlePlanetClick(planet)}
              title={`${planet.age.name || planet.age.title} - ${planet.planetType} Planet`}
            >
              {/* Planet Core */}
              <div 
                className="planet-core"
                style={{
                  backgroundColor: planet.color,
                  boxShadow: `
                    0 0 ${planet.size * 0.5}px ${planet.glowColor},
                    inset -${planet.size * 0.2}px -${planet.size * 0.2}px ${planet.size * 0.3}px rgba(0,0,0,0.3),
                    inset ${planet.size * 0.1}px ${planet.size * 0.1}px ${planet.size * 0.2}px rgba(255,255,255,0.3)
                  `
                }}
              >
                {/* Planet surface details */}
                <div className="planet-surface">
                  <div className="surface-pattern"></div>
                  <div className="surface-highlight"></div>
                </div>
                
                {/* Planet rings for selected */}
                {selected && (
                  <div className="planet-rings">
                    <div className="ring ring-1"></div>
                    <div className="ring ring-2"></div>
                  </div>
                )}
                
                {/* Age number indicator */}
                <div className="age-indicator">
                  {planet.age.age_number}
                </div>
              </div>

              {/* Planet Trail */}
              <div 
                className="planet-trail"
                style={{
                  background: `radial-gradient(circle, ${planet.glowColor}22 0%, transparent 70%)`
                }}
              ></div>

              {/* Planet Label */}
              <div className="planet-label">
                <span className="planet-name">
                  {planet.age.name || planet.age.title}
                </span>
                <span className="planet-type">
                  {planet.planetType}
                </span>
              </div>
            </div>
          );
        })}

        {/* Cosmic Background Effects */}
        <div className="cosmic-effects">
          {/* Stardust */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="cosmic-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 4}s`
              }}
            />
          ))}
          
          {/* Cosmic Energy Waves */}
          <div className="energy-wave wave-1"></div>
          <div className="energy-wave wave-2"></div>
          <div className="energy-wave wave-3"></div>
        </div>

        {/* Central Information Display */}
        {selectedAge && (
          <div className="central-info">
            <div className="info-content">
              <h3 className="age-title">{selectedAge.name || selectedAge.title}</h3>
              <p className="age-years">
                {selectedAge.start_year ? `${selectedAge.start_year}` : '∞'} - {selectedAge.end_year || '∞'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};