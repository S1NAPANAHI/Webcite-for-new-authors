import React, { useState, useCallback } from 'react';
import { Age } from '../../../lib/api-timeline';
import './cosmic-rings.css';

interface CosmicRingsDialProps {
  ages: Age[];
  selectedAge: Age | null;
  onAgeSelect: (age: Age) => void;
  className?: string;
}

export const CosmicRingsDial: React.FC<CosmicRingsDialProps> = ({
  ages,
  selectedAge,
  onAgeSelect,
  className = ''
}) => {
  const [hoveredAge, setHoveredAge] = useState<number | null>(null);

  const handleRingClick = useCallback((age: Age) => {
    onAgeSelect(age);
  }, [onAgeSelect]);

  const handleRingHover = useCallback((ageId: number | null) => {
    setHoveredAge(ageId);
  }, []);

  // Generate ring radii - 9 concentric rings with even spacing
  const generateRingRadius = (index: number): number => {
    const baseRadius = 75;
    const increment = 35;
    return baseRadius + (index * increment);
  };

  // Generate text path ID for each ring
  const getTextPathId = (index: number): string => {
    return `arc-r${index + 1}`;
  };

  // Format year range
  const formatYearRange = (age: Age): string => {
    if (!age.end_year) return `${age.start_year || '∞'}–∞`;
    return `${age.start_year || '∞'}–${age.end_year}`;
  };

  // Sort ages by age_number to ensure correct order
  const sortedAges = [...ages].sort((a, b) => a.age_number - b.age_number);

  return (
    <div className={`cosmic-rings-container ${className}`}>
      <svg 
        className="cosmic-rings-dial" 
        viewBox="0 0 800 800" 
        width="100%" 
        role="img" 
        aria-label="Nine concentric rings dial representing cosmic ages"
      >
        <defs>
          {/* Starfield background */}
          <radialGradient id="spaceGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#0c1120"/>
            <stop offset="60%" stopColor="#090d17"/>
            <stop offset="100%" stopColor="#07090e"/>
          </radialGradient>

          {/* Stone texture via turbulence */}
          <filter id="stoneTexture" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.9" 
              numOctaves="3" 
              seed="11" 
              result="noise"
            />
            <feColorMatrix 
              type="matrix" 
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 6 -2" 
              result="contrast"
            />
            <feBlend in="SourceGraphic" in2="contrast" mode="multiply"/>
          </filter>

          {/* Metal rim gradient */}
          <linearGradient id="metalRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1deac"/>
            <stop offset="35%" stopColor="#d4af37"/>
            <stop offset="65%" stopColor="#8a6a3a"/>
            <stop offset="100%" stopColor="#3a2b16"/>
          </linearGradient>

          {/* Glass highlight overlay */}
          <radialGradient id="glassGlow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/>
            <stop offset="35%" stopColor="rgba(255,255,255,0.20)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0.00)"/>
          </radialGradient>

          {/* Etched text shadow */}
          <filter id="etchShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feOffset dx="0.7" dy="0.7" result="offset"/>
            <feGaussianBlur in="offset" stdDeviation="0.6" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>

          {/* Text paths for each ring */}
          {sortedAges.map((_, index) => {
            const radius = generateRingRadius(index);
            return (
              <path 
                key={`path-${index}`}
                id={getTextPathId(index)}
                d={`M 400,400 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
              />
            );
          })}
        </defs>

        {/* Starfield background */}
        <rect x="0" y="0" width="800" height="800" fill="url(#spaceGlow)" />
        
        {/* Sprinkle some stars */}
        <g opacity="0.45">
          <circle cx="120" cy="140" r="1.4" fill="#cbd3ff"/>
          <circle cx="620" cy="220" r="1.2" fill="#cbd3ff"/>
          <circle cx="500" cy="90" r="0.9" fill="#ced6ff"/>
          <circle cx="300" cy="700" r="1.2" fill="#cbd3ff"/>
          <circle cx="720" cy="560" r="0.8" fill="#ced6ff"/>
          <circle cx="200" cy="520" r="0.9" fill="#cbd3ff"/>
        </g>

        {/* Center core */}
        <g transform="translate(400,400)">
          <circle r="50" fill="#3b3a36" filter="url(#stoneTexture)" />
          <circle r="50" fill="url(#glassGlow)" />
          <circle r="58" fill="none" stroke="url(#metalRim)" strokeWidth="10" />
        </g>
        
        <text x="400" y="402" textAnchor="middle" className="center-label etched">
          COSMIC AGES
        </text>

        {/* Rings */}
        <g id="rings">
          {sortedAges.map((age, index) => {
            const radius = generateRingRadius(index);
            const isSelected = selectedAge?.id === age.id;
            const isHovered = hoveredAge === age.id;
            const ringClasses = `ring-group ${isSelected ? 'selected' : ''} ${isHovered ? 'hover' : ''}`;

            return (
              <g 
                key={age.id}
                className={ringClasses}
                data-index={index}
                onClick={() => handleRingClick(age)}
                onMouseEnter={() => handleRingHover(age.id)}
                onMouseLeave={() => handleRingHover(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Stone base */}
                <circle 
                  className="ring-base" 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none" 
                  stroke="#4a483f" 
                  strokeWidth="20" 
                  filter="url(#stoneTexture)"
                />
                
                {/* Metal rim */}
                <circle 
                  className="ring-rim" 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none" 
                  stroke="url(#metalRim)" 
                  strokeWidth="14" 
                  opacity="0.95"
                />
                
                {/* Glass highlight */}
                <circle 
                  className="ring-glass" 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none" 
                  stroke="rgba(255,255,255,0.12)" 
                  strokeWidth="10"
                />
                
                {/* Age label along ring arc */}
                <text dy="-6" className="ring-label etched">
                  <textPath 
                    href={`#${getTextPathId(index)}`} 
                    startOffset="50%" 
                    textAnchor="middle"
                  >
                    {age.name || age.title}
                  </textPath>
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};