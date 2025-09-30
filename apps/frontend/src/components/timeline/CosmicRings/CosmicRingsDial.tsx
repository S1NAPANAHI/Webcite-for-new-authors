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

  // Generate ring radii - 9 concentric rings with proper spacing
  const generateRingRadius = (index: number): number => {
    const baseRadius = 85;
    const increment = 32;
    return baseRadius + (index * increment);
  };

  // Color palette for the 9 ages (innermost to outermost)
  const ageColors = [
    "#d4af37", // Gold
    "#cd7f32", // Bronze  
    "#8b7355", // Dark bronze
    "#a0522d", // Sienna
    "#696969", // Dim gray
    "#708090", // Slate gray
    "#b0c4de", // Light steel blue
    "#dcdcdc", // Gainsboro
    "#f5f5f5"  // White smoke
  ];

  // Generate text path ID for each ring
  const getTextPathId = (index: number): string => {
    return `text-path-${index}`;
  };

  const thickness = 24; // Thickness of each ring disk

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
          {/* Subtle stone texture filter - MUCH more subdued */}
          <filter id="subtleTexture" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.02" 
              numOctaves="1" 
              seed="5" 
              result="noise"
            />
            <feColorMatrix 
              type="matrix" 
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.3 0" 
              result="softNoise"
            />
            <feComposite operator="multiply" in="SourceGraphic" in2="softNoise"/>
          </filter>

          {/* Starfield background gradient */}
          <radialGradient id="spaceGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1a1f2e"/>
            <stop offset="70%" stopColor="#0f141f"/>
            <stop offset="100%" stopColor="#08090c"/>
          </radialGradient>

          {/* Ring masks for creating thick disks */}
          {sortedAges.map((_, index) => {
            const outerRadius = generateRingRadius(index) + thickness/2;
            const innerRadius = Math.max(0, generateRingRadius(index) - thickness/2);
            return (
              <mask key={`mask-${index}`} id={`ring-mask-${index}`}>
                <rect width="800" height="800" fill="white" />
                <circle cx="400" cy="400" r={innerRadius} fill="black" />
              </mask>
            );
          })}

          {/* Gradients for each ring */}
          {sortedAges.map((_, index) => {
            const color = ageColors[index] || "#d4af37";
            const transparency = 0.9 - (index * 0.08); // Progressive transparency
            return (
              <radialGradient 
                key={`gradient-${index}`} 
                id={`ring-gradient-${index}`} 
                cx="50%" cy="50%" r="100%"
              >
                <stop offset="0%" stopColor={color} stopOpacity={transparency} />
                <stop offset="70%" stopColor={color} stopOpacity={transparency * 0.6} />
                <stop offset="100%" stopColor={color} stopOpacity={transparency * 0.2} />
              </radialGradient>
            );
          })}

          {/* Text paths for labels */}
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

          {/* Glow filter for selection */}
          <filter id="selectionGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>

        {/* Space background */}
        <rect x="0" y="0" width="800" height="800" fill="url(#spaceGradient)" />
        
        {/* Subtle stars */}
        <g opacity="0.6">
          <circle cx="120" cy="140" r="1" fill="#ffffff"/>
          <circle cx="680" cy="200" r="0.8" fill="#ffffff"/>
          <circle cx="250" cy="650" r="1.2" fill="#ffffff"/>
          <circle cx="720" cy="580" r="0.9" fill="#ffffff"/>
          <circle cx="180" cy="450" r="0.7" fill="#ffffff"/>
        </g>

        {/* Center medallion */}
        <g>
          <circle 
            cx="400" 
            cy="400" 
            r="55" 
            fill="url(#ring-gradient-0)" 
            filter="url(#subtleTexture)"
            opacity="0.9"
          />
          <circle 
            cx="400" 
            cy="400" 
            r="55" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="2" 
            opacity="0.7"
          />
          <text 
            x="400" 
            y="396" 
            textAnchor="middle" 
            className="center-label"
            fontSize="11"
            fill="#f1deac"
          >
            COSMIC
          </text>
          <text 
            x="400" 
            y="408" 
            textAnchor="middle" 
            className="center-label"
            fontSize="11"
            fill="#f1deac"
          >
            AGES
          </text>
        </g>

        {/* Ring disks */}
        <g id="rings">
          {sortedAges.map((age, index) => {
            const outerRadius = generateRingRadius(index) + thickness/2;
            const isSelected = selectedAge?.id === age.id;
            const isHovered = hoveredAge === age.id;
            const ringClasses = `ring-disk ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`;

            return (
              <g 
                key={age.id}
                className={ringClasses}
                onClick={() => handleRingClick(age)}
                onMouseEnter={() => handleRingHover(age.id)}
                onMouseLeave={() => handleRingHover(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Main ring disk */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={outerRadius} 
                  fill={`url(#ring-gradient-${index})`}
                  mask={`url(#ring-mask-${index})`}
                  filter={isSelected ? "url(#selectionGlow)" : "url(#subtleTexture)"}
                  className="disk-base"
                />
                
                {/* Subtle inner rim */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={generateRingRadius(index) - thickness/2 + 1} 
                  fill="none" 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="1"
                  className="inner-rim"
                />
                
                {/* Outer rim */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={outerRadius - 1} 
                  fill="none" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth="1"
                  className="outer-rim"
                />

                {/* Age label */}
                <text className="ring-label">
                  <textPath 
                    href={`#${getTextPathId(index)}`} 
                    startOffset="50%" 
                    textAnchor="middle"
                  >
                    {age.name || age.title}
                  </textPath>
                </text>

                {/* Age number */}
                <text 
                  x={400 + generateRingRadius(index) * 0.7} 
                  y={400} 
                  textAnchor="middle" 
                  className="age-number"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="10"
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