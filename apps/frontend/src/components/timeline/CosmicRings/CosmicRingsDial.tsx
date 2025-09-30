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

  // Generate ring radii - 9 concentric rings with proper spacing for thick strokes
  const generateRingRadius = (index: number): number => {
    const baseRadius = 100;
    const increment = 35;
    return baseRadius + (index * increment);
  };

  // Ring thickness - genuinely thick strokes
  const RING_THICKNESS = 28;

  // Color palette for the 9 ages (innermost to outermost)
  const ageColors = [
    "#d4af37", // Gold
    "#cd7f32", // Bronze  
    "#b8860b", // Dark goldenrod
    "#a0522d", // Sienna
    "#8b7355", // Dark khaki
    "#708090", // Slate gray
    "#9370db", // Medium purple
    "#b0c4de", // Light steel blue
    "#dcdcdc"  // Gainsboro
  ];

  // Generate text path ID for each ring
  const getTextPathId = (index: number): string => {
    return `text-path-${index}`;
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
          {/* Starfield background gradient */}
          <radialGradient id="spaceGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1a1f2e"/>
            <stop offset="70%" stopColor="#0f141f"/>
            <stop offset="100%" stopColor="#08090c"/>
          </radialGradient>

          {/* Click area masks - create ring-shaped areas that don't overlap */}
          {sortedAges.map((_, index) => {
            const outerRadius = generateRingRadius(index) + RING_THICKNESS/2;
            const innerRadius = generateRingRadius(index) - RING_THICKNESS/2;
            return (
              <mask key={`click-mask-${index}`} id={`click-mask-${index}`}>
                <rect width="800" height="800" fill="black" />
                <circle cx="400" cy="400" r={outerRadius} fill="white" />
                <circle cx="400" cy="400" r={Math.max(0, innerRadius)} fill="black" />
              </mask>
            );
          })}

          {/* Gradients for each ring */}
          {sortedAges.map((_, index) => {
            const color = ageColors[index] || "#d4af37";
            const transparency = 0.9 - (index * 0.05); // Progressive transparency
            return (
              <radialGradient 
                key={`gradient-${index}`} 
                id={`ring-gradient-${index}`} 
                cx="50%" cy="50%" r="100%"
              >
                <stop offset="0%" stopColor={color} stopOpacity={transparency} />
                <stop offset="50%" stopColor={color} stopOpacity={transparency * 0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={transparency * 0.4} />
              </radialGradient>
            );
          })}

          {/* Inner highlight gradients */}
          {sortedAges.map((_, index) => {
            const color = ageColors[index] || "#d4af37";
            return (
              <radialGradient 
                key={`highlight-${index}`} 
                id={`highlight-gradient-${index}`} 
                cx="50%" cy="50%" r="100%"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="30%" stopColor={color} stopOpacity="0.1" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
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
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>

          {/* Hover glow filter */}
          <filter id="hoverGlow" x="-15%" y="-15%" width="130%" height="130%">
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
            r="60" 
            fill="url(#ring-gradient-0)" 
            opacity="0.95"
          />
          <circle 
            cx="400" 
            cy="400" 
            r="60" 
            fill="url(#highlight-gradient-0)" 
          />
          <circle 
            cx="400" 
            cy="400" 
            r="60" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="2" 
            opacity="0.8"
          />
          <text 
            x="400" 
            y="394" 
            textAnchor="middle" 
            className="center-label"
            fontSize="12"
            fill="#f1deac"
            fontWeight="600"
          >
            COSMIC
          </text>
          <text 
            x="400" 
            y="410" 
            textAnchor="middle" 
            className="center-label"
            fontSize="12"
            fill="#f1deac"
            fontWeight="600"
          >
            AGES
          </text>
        </g>

        {/* Ring disks - STROKE-BASED APPROACH WITH NON-OVERLAPPING CLICK AREAS */}
        <g id="rings">
          {sortedAges.map((age, index) => {
            const radius = generateRingRadius(index);
            const isSelected = selectedAge?.id === age.id;
            const isHovered = hoveredAge === age.id;
            const ringClasses = `ring-disk ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`;

            return (
              <g 
                key={age.id}
                className={ringClasses}
                style={{ cursor: 'pointer' }}
              >
                {/* Ring-shaped clickable area - MASKED to prevent overlap */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r="400"
                  fill="transparent"
                  mask={`url(#click-mask-${index})`}
                  onClick={() => handleRingClick(age)}
                  onMouseEnter={() => handleRingHover(age.id)}
                  onMouseLeave={() => handleRingHover(null)}
                  className="click-area"
                />
                
                {/* Main thick ring disk */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none"
                  stroke={`url(#ring-gradient-${index})`}
                  strokeWidth={RING_THICKNESS}
                  filter={isSelected ? "url(#selectionGlow)" : isHovered ? "url(#hoverGlow)" : "none"}
                  className="ring-stroke"
                  pointerEvents="none"
                />
                
                {/* Inner highlight ring */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none"
                  stroke={`url(#highlight-gradient-${index})`}
                  strokeWidth={RING_THICKNESS * 0.6}
                  className="ring-highlight"
                  pointerEvents="none"
                />
                
                {/* Outer rim definition */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius + RING_THICKNESS/2 - 1} 
                  fill="none" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth="1"
                  className="outer-rim"
                  pointerEvents="none"
                />

                {/* Inner rim definition */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius - RING_THICKNESS/2 + 1} 
                  fill="none" 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="1"
                  className="inner-rim"
                  pointerEvents="none"
                />

                {/* Age label */}
                <text className="ring-label" pointerEvents="none">
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
                  x={400 + radius * 0.7} 
                  y={400} 
                  textAnchor="middle" 
                  className="age-number"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="10"
                  pointerEvents="none"
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