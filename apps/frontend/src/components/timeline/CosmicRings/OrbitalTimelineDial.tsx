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

  // Simplified planet properties for stone wall aesthetic
  const getPlanetProperties = (age: Age, index: number) => {
    const colorSchemes = [
      { color: '#D4AF37', type: 'Golden' },      // Golden Age
      { color: '#CD7F32', type: 'Bronze' },      // Bronze
      { color: '#B8860B', type: 'Brass' },       // Brass
      { color: '#DAA520', type: 'Copper' },      // Copper
      { color: '#C0C0C0', type: 'Silver' },      // Silver
      { color: '#708090', type: 'Iron' },        // Iron
      { color: '#F4A460', type: 'Stone' },       // Sandy Brown
      { color: '#BC8F8F', type: 'Clay' },        // Rosy Brown
      { color: '#DEB887', type: 'Amber' }        // Burlywood
    ];

    const scheme = colorSchemes[index % colorSchemes.length];
    return {
      ...scheme,
      orbitRadius: 90 + (index * 40), // More spaced out orbits
      speed: 0.08 + (index * 0.02), // Much slower speeds
      size: 24 + (index % 3) * 6, // Bigger planet sizes
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
        planetType: props.type
      };
    });

    setOrbitingPlanets(planets);
  }, [ages]);

  // Much slower animation loop
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      setAnimationTime(prev => prev + 0.008); // Much slower: ~120fps but smaller increments
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
    <div className={`orbital-timeline-dial stone-wall-aesthetic ${className}`}>
      <div className="orbital-container">
        {/* Simplified Central Sun */}
        <div className="central-sun">
          <div className="sun-core stone-carved">
            <div className="sun-symbol">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Thicker Orbit Paths */}
        {orbitingPlanets.map((planet, index) => (
          <div
            key={`orbit-${index}`}
            className="orbit-path thick-carved-line"
            style={{
              width: `${planet.orbitRadius * 2}px`,
              height: `${planet.orbitRadius * 2}px`,
            }}
          />
        ))}

        {/* Larger Orbiting Planets */}
        {orbitingPlanets.map((planet, index) => {
          const position = calculatePlanetPosition(planet);
          const selected = isSelected(planet);
          
          return (
            <div
              key={`planet-${index}`}
              className={`orbiting-planet stone-planet ${selected ? 'selected' : ''}`}
              style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                width: `${planet.size}px`,
                height: `${planet.size}px`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer'
              }}
              onClick={() => handlePlanetClick(planet)}
              title={`${planet.age.name || planet.age.title} - ${planet.planetType} Node`}
            >
              {/* Simplified Planet Core */}
              <div 
                className="planet-core stone-carved"
                style={{
                  backgroundColor: planet.color,
                  borderColor: planet.color,
                }}
              >
                {/* Age number indicator */}
                <div className="age-indicator stone-text">
                  {planet.age.age_number}
                </div>
                
                {/* Selection indicator */}
                {selected && (
                  <div className="selection-ring"></div>
                )}
              </div>

              {/* Simplified Planet Label */}
              <div className="planet-label stone-inscription">
                <span className="planet-name">
                  {planet.age.name || planet.age.title}
                </span>
              </div>
            </div>
          );
        })}

        {/* Minimal Central Information Display */}
        {selectedAge && (
          <div className="central-info stone-tablet">
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