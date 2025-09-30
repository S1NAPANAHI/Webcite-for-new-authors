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

  // Generate ring radii - concentric rings with even spacing
  const generateRingRadius = (index: number): number => {
    const baseRadius = 60;
    const increment = 30;
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
        viewBox="0 0 700 700" 
        width="100%" 
        role="img" 
        aria-label="Concentric rings dial representing cosmic ages"
      >
        <defs>
          {/* Cosmic background gradient */}
          <radialGradient id="cosmicBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1a1f2e"/>
            <stop offset="60%" stopColor="#0f1419"/>
            <stop offset="100%" stopColor="#070a0e"/>
          </radialGradient>

          {/* Simple stone-like gradient for rings */}
          <linearGradient id="stoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b6653"/>
            <stop offset="30%" stopColor="#5a5447"/>
            <stop offset="70%" stopColor="#4a483f"/>
            <stop offset="100%" stopColor="#3b3a36"/>
          </linearGradient>

          {/* Metal rim gradient */}
          <linearGradient id="metalRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4e4b8"/>
            <stop offset="25%" stopColor="#d4af37"/>
            <stop offset="75%" stopColor="#b8941f"/>
            <stop offset="100%" stopColor="#8a6a1a"/>
          </linearGradient>

          {/* Glass overlay gradient */}
          <radialGradient id="glassOverlay" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)"/>
            <stop offset="50%" stopColor="rgba(255,255,255,0.15)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>

          {/* Text paths for each ring */}
          {sortedAges.map((_, index) => {
            const radius = generateRingRadius(index);
            return (
              <path 
                key={`path-${index}`}
                id={getTextPathId(index)}
                d={`M 350,350 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
              />
            );
          })}

          {/* Drop shadow filter for rings */}
          <filter id="ringShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>

          {/* Glow effect for selected/hovered rings */}
          <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Cosmic starfield background */}
        <rect x="0" y="0" width="700" height="700" fill="url(#cosmicBg)" />
        
        {/* Add some simple stars */}
        <g className="stars" opacity="0.6">
          <circle cx="120" cy="140" r="1.5" fill="#d4af37" opacity="0.8"/>
          <circle cx="580" cy="180" r="1" fill="#f4e4b8" opacity="0.6"/>
          <circle cx="480" cy="100" r="0.8" fill="#d4af37" opacity="0.7"/>
          <circle cx="250" cy="600" r="1.2" fill="#f4e4b8" opacity="0.5"/>
          <circle cx="650" cy="520" r="0.9" fill="#d4af37" opacity="0.8"/>
          <circle cx="180" cy="480" r="1.1" fill="#f4e4b8" opacity="0.6"/>
          <circle cx="600" cy="320" r="0.7" fill="#d4af37" opacity="0.7"/>
          <circle cx="80" cy="250" r="1.3" fill="#f4e4b8" opacity="0.5"/>
        </g>

        {/* Center core */}
        <g className="center-core">
          <circle 
            cx="350" 
            cy="350" 
            r="35" 
            fill="url(#stoneGradient)" 
            stroke="url(#metalRim)" 
            strokeWidth="6"
            filter="url(#ringShadow)"
          />
          <circle 
            cx="350" 
            cy="350" 
            r="35" 
            fill="url(#glassOverlay)" 
          />
        </g>
        
        <text x="350" y="355" textAnchor="middle" className="center-label">
          COSMIC AGES
        </text>

        {/* Concentric Rings */}
        <g className="rings">
          {sortedAges.map((age, index) => {
            const radius = generateRingRadius(index);
            const isSelected = selectedAge?.id === age.id;
            const isHovered = hoveredAge === age.id;
            const opacity = isSelected ? 1 : isHovered ? 0.9 : 0.8;
            
            return (
              <g 
                key={age.id}
                className={`ring-group ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                onClick={() => handleRingClick(age)}
                onMouseEnter={() => handleRingHover(age.id)}
                onMouseLeave={() => handleRingHover(null)}
                style={{ cursor: 'pointer' }}
                opacity={opacity}
              >
                {/* Stone base ring */}
                <circle 
                  className="ring-base" 
                  cx="350" 
                  cy="350" 
                  r={radius} 
                  fill="none" 
                  stroke="url(#stoneGradient)" 
                  strokeWidth="16"
                  filter="url(#ringShadow)"
                />
                
                {/* Metal rim overlay */}
                <circle 
                  className="ring-rim" 
                  cx="350" 
                  cy="350" 
                  r={radius} 
                  fill="none" 
                  stroke="url(#metalRim)" 
                  strokeWidth={isSelected ? "20" : isHovered ? "18" : "12"}
                  opacity="0.9"
                  filter={isSelected || isHovered ? "url(#ringGlow)" : undefined}
                />
                
                {/* Glass highlight overlay */}
                <circle 
                  className="ring-glass" 
                  cx="350" 
                  cy="350" 
                  r={radius} 
                  fill="none" 
                  stroke="url(#glassOverlay)" 
                  strokeWidth="8"
                  opacity="0.7"
                />
                
                {/* Age label along the ring */}
                <text className="ring-label" dy="-8">
                  <textPath 
                    href={`#${getTextPathId(index)}`} 
                    startOffset="50%" 
                    textAnchor="middle"
                  >
                    {age.name || age.title}
                  </textPath>
                </text>

                {/* Optional: Age number indicator */}
                <text 
                  className="age-number"
                  x={350 + (radius * Math.cos(-Math.PI/2))}
                  y={350 + (radius * Math.sin(-Math.PI/2)) - 15}
                  textAnchor="middle"
                >
                  {age.age_number}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};