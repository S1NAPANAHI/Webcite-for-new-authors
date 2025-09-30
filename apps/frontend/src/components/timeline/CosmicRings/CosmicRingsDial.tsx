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

  // Generate disk radii with thick appearance
  const generateDiskRadius = (index: number): number => {
    const baseRadius = 70;
    const increment = 35;
    return baseRadius + (index * increment);
  };

  // Color palette for different disk materials
  const diskColors = [
    '#d4af37', // Gold - innermost (most important)
    '#b8941f', // Deep gold
    '#8a6a3a', // Bronze
    '#6b6653', // Stone
    '#5a5447', // Dark stone
    '#7a7a6e', // Grey stone
    '#9d9d91', // Light stone
    '#a5adb7', // Silver
    '#c8c8c0'  // Pale stone - outermost
  ];

  // Generate text path ID for each ring
  const getTextPathId = (index: number): string => {
    return `arc-r${index + 1}`;
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
        aria-label="Thick concentric disks representing cosmic ages"
      >
        <defs>
          {/* Cosmic background gradient */}
          <radialGradient id="cosmicBg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#1a1f2e"/>
            <stop offset="60%" stopColor="#0f1419"/>
            <stop offset="100%" stopColor="#070a0e"/>
          </radialGradient>

          {/* Advanced stone texture filter */}
          <filter id="stoneTexture" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.15 0.08" 
              numOctaves="4" 
              seed="7" 
              result="noise"
            />
            <feColorMatrix 
              type="saturate" 
              values="0.1" 
              in="noise" 
              result="desaturatedNoise"
            />
            <feBlend 
              in="SourceGraphic" 
              in2="desaturatedNoise" 
              mode="multiply"
              result="textured"
            />
            <feGaussianBlur 
              in="textured" 
              stdDeviation="0.5" 
              result="softened"
            />
            <feComposite 
              in="softened" 
              in2="SourceGraphic" 
              operator="overlay"
            />
          </filter>

          {/* Metal shimmer effect */}
          <filter id="metalShimmer" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feOffset dx="1" dy="1" result="offset"/>
            <feMerge>
              <feMergeNode in="offset"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Glow effect for selected/hovered disks */}
          <filter id="diskGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Individual disk gradients for each age */}
          {sortedAges.map((age, index) => {
            const baseColor = diskColors[index] || '#8a6a3a';
            const alpha = 1 - (index / Math.max(sortedAges.length - 1, 1)) * 0.6; // Progressive transparency
            
            return (
              <React.Fragment key={`gradients-${age.id}`}>
                {/* Main disk gradient */}
                <radialGradient id={`disk-gradient-${index}`} cx="50%" cy="45%" r="60%">
                  <stop offset="0%" stopColor={baseColor} stopOpacity={alpha * 0.95}/>
                  <stop offset="35%" stopColor={baseColor} stopOpacity={alpha * 0.75}/>
                  <stop offset="70%" stopColor={baseColor} stopOpacity={alpha * 0.45}/>
                  <stop offset="100%" stopColor={baseColor} stopOpacity={alpha * 0.25}/>
                </radialGradient>
                
                {/* Inner shadow gradient */}
                <radialGradient id={`inner-shadow-${index}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0,0,0,0)"/>
                  <stop offset="85%" stopColor="rgba(0,0,0,0)"/>
                  <stop offset="100%" stopColor="rgba(0,0,0,0.4)"/>
                </radialGradient>
                
                {/* Highlight gradient for glass effect */}
                <radialGradient id={`highlight-${index}`} cx="35%" cy="30%" r="40%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" stopOpacity={alpha * 0.6}/>
                  <stop offset="50%" stopColor="rgba(255,255,255,0.2)" stopOpacity={alpha * 0.3}/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" stopOpacity="0"/>
                </radialGradient>
              </React.Fragment>
            );
          })}

          {/* Text paths for labels */}
          {sortedAges.map((_, index) => {
            const radius = generateDiskRadius(index);
            return (
              <path 
                key={`path-${index}`}
                id={getTextPathId(index)}
                d={`M 400,400 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
              />
            );
          })}
        </defs>

        {/* Cosmic starfield background */}
        <rect x="0" y="0" width="800" height="800" fill="url(#cosmicBg)" />
        
        {/* Scattered stars */}
        <g className="stars" opacity="0.7">
          <circle cx="150" cy="120" r="1.8" fill="#f4e4b8" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="650" cy="180" r="1.2" fill="#d4af37" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="520" cy="90" r="1" fill="#f4e4b8" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="200" cy="650" r="1.5" fill="#d4af37" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.4;0.6" dur="3.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="700" cy="550" r="1.1" fill="#f4e4b8" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="4.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="120" cy="480" r="1.3" fill="#d4af37" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="6s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* Center core */}
        <g className="center-core">
          <circle 
            cx="400" 
            cy="400" 
            r="45" 
            fill="url(#disk-gradient-0)" 
            filter="url(#stoneTexture)"
          />
          <circle 
            cx="400" 
            cy="400" 
            r="45" 
            fill="url(#highlight-0)" 
          />
          <circle 
            cx="400" 
            cy="400" 
            r="45" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="3"
            opacity="0.6"
          />
        </g>
        
        <text x="400" y="407" textAnchor="middle" className="center-label">
          COSMIC AGES
        </text>

        {/* Thick Concentric Disks */}
        <g className="disks">
          {sortedAges.map((age, index) => {
            const radius = generateDiskRadius(index);
            const thickness = 28; // Thick disk appearance
            const isSelected = selectedAge?.id === age.id;
            const isHovered = hoveredAge === age.id;
            const alpha = 1 - (index / Math.max(sortedAges.length - 1, 1)) * 0.6;
            
            return (
              <g 
                key={age.id}
                className={`disk-group ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                onClick={() => handleRingClick(age)}
                onMouseEnter={() => handleRingHover(age.id)}
                onMouseLeave={() => handleRingHover(null)}
                style={{ cursor: 'pointer' }}
                opacity={isSelected ? 1 : isHovered ? 0.95 : alpha}
              >
                {/* Main thick disk */}
                <circle 
                  className="disk-main" 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none"
                  stroke={`url(#disk-gradient-${index})`}
                  strokeWidth={thickness}
                  filter="url(#stoneTexture)"
                />
                
                {/* Inner shadow for depth */}
                <circle 
                  className="disk-shadow" 
                  cx="400" 
                  cy="400" 
                  r={radius - thickness/4} 
                  fill="none"
                  stroke={`url(#inner-shadow-${index})`}
                  strokeWidth={thickness/2}
                  opacity="0.6"
                />
                
                {/* Highlight overlay for glass effect */}
                <circle 
                  className="disk-highlight" 
                  cx="400" 
                  cy="400" 
                  r={radius + thickness/4} 
                  fill="none"
                  stroke={`url(#highlight-${index})`}
                  strokeWidth={thickness/3}
                  opacity="0.8"
                />
                
                {/* Metal rim for extra definition */}
                <circle 
                  className="disk-rim" 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none"
                  stroke={diskColors[index] || '#8a6a3a'}
                  strokeWidth={isSelected ? "4" : isHovered ? "3" : "2"}
                  opacity={isSelected ? "1" : "0.7"}
                  filter={isSelected || isHovered ? "url(#diskGlow)" : "url(#metalShimmer)"}
                />
                
                {/* Age label along the disk */}
                <text className="disk-label" dy="-10">
                  <textPath 
                    href={`#${getTextPathId(index)}`} 
                    startOffset="50%" 
                    textAnchor="middle"
                  >
                    {age.name || age.title}
                  </textPath>
                </text>

                {/* Age number indicator */}
                <text 
                  className="age-number"
                  x={400 + (radius * Math.cos(-Math.PI/2))}
                  y={400 + (radius * Math.sin(-Math.PI/2)) - 20}
                  textAnchor="middle"
                  opacity={isSelected || isHovered ? "1" : "0.7"}
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