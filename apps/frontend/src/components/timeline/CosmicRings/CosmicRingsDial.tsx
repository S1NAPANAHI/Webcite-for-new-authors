import React, { useState, useCallback, useRef } from 'react';
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
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate ring radius based on index
  const generateRingRadius = (index: number): number => {
    const baseRadius = 100;
    const increment = 35;
    return baseRadius + (index * increment);
  };

  // Ring thickness
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

  // Texture parameters for each ring
  const ringTextures = [
    { type: 'golden-grain', frequency: 0.6, seed: 42 },
    { type: 'bronze-weave', frequency: 0.5, seed: 17 },
    { type: 'copper-striations', frequency: 0.45, seed: 91 },
    { type: 'iron-hammered', frequency: 0.38, seed: 63 },
    { type: 'steel-crosshatch', frequency: 0.32, seed: 28 },
    { type: 'weathered-metal', frequency: 0.27, seed: 74 },
    { type: 'pewter-grain', frequency: 0.22, seed: 39 },
    { type: 'lead-crossweave', frequency: 0.18, seed: 55 },
    { type: 'silver-filigree', frequency: 0.15, seed: 83 }
  ];

  // Generate text path ID for each ring
  const getTextPathId = (index: number): string => {
    return `text-path-${index}`;
  };

  // Sort ages by age_number to ensure correct order
  const sortedAges = [...ages].sort((a, b) => a.age_number - b.age_number);

  // Mathematical click detection
  const handleSVGClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const svgSize = Math.min(svgRect.width, svgRect.height);
    const scale = svgSize / 800; // SVG viewBox is 800x800
    
    // Get click position relative to SVG center
    const centerX = svgRect.width / 2;
    const centerY = svgRect.height / 2;
    const clickX = event.clientX - svgRect.left - centerX;
    const clickY = event.clientY - svgRect.top - centerY;
    
    // Calculate distance from center in SVG units
    const distance = Math.sqrt(clickX * clickX + clickY * clickY) / scale;

    // Check each ring from outside to inside to handle overlaps
    for (let i = sortedAges.length - 1; i >= 0; i--) {
      const radius = generateRingRadius(i);
      const innerBound = radius - RING_THICKNESS / 2;
      const outerBound = radius + RING_THICKNESS / 2;

      if (distance >= innerBound && distance <= outerBound) {
        onAgeSelect(sortedAges[i]);
        return;
      }
    }
  }, [sortedAges, onAgeSelect]);

  // Handle hover with mathematical detection
  const handleSVGMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const svgSize = Math.min(svgRect.width, svgRect.height);
    const scale = svgSize / 800;
    
    const centerX = svgRect.width / 2;
    const centerY = svgRect.height / 2;
    const mouseX = event.clientX - svgRect.left - centerX;
    const mouseY = event.clientY - svgRect.top - centerY;
    
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY) / scale;

    let foundHover = null;
    for (let i = sortedAges.length - 1; i >= 0; i--) {
      const radius = generateRingRadius(i);
      const innerBound = radius - RING_THICKNESS / 2;
      const outerBound = radius + RING_THICKNESS / 2;

      if (distance >= innerBound && distance <= outerBound) {
        foundHover = sortedAges[i].id;
        break;
      }
    }

    if (foundHover !== hoveredAge) {
      setHoveredAge(foundHover);
    }
  }, [sortedAges, hoveredAge]);

  const handleSVGMouseLeave = useCallback(() => {
    setHoveredAge(null);
  }, []);

  return (
    <div className={`cosmic-rings-container ${className}`}>
      <svg 
        ref={svgRef}
        className="cosmic-rings-dial" 
        viewBox="0 0 800 800" 
        width="100%" 
        role="img" 
        aria-label="Nine concentric rings dial representing cosmic ages"
        onClick={handleSVGClick}
        onMouseMove={handleSVGMouseMove}
        onMouseLeave={handleSVGMouseLeave}
        style={{ cursor: 'pointer' }}
      >
        <defs>
          {/* Starfield background gradient */}
          <radialGradient id="spaceGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1a1f2e"/>
            <stop offset="70%" stopColor="#0f141f"/>
            <stop offset="100%" stopColor="#08090c"/>
          </radialGradient>

          {/* Gradients for each ring */}
          {sortedAges.map((_, index) => {
            const color = ageColors[index] || "#d4af37";
            const transparency = 0.9 - (index * 0.05);
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

          {/* Procedural texture filters for each ring */}
          {ringTextures.map((texture, index) => (
            <filter key={`texture-filter-${index}`} id={`textureFilter${index}`} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency={texture.frequency} 
                numOctaves="2" 
                seed={texture.seed} 
                result="noise"
              />
              <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
              <feComponentTransfer in="mono" result="textureNoise">
                <feFuncA type="discrete" tableValues="0 0.05 0.1 0.15 0.2 0.1 0.05 0" />
              </feComponentTransfer>
            </filter>
          ))}

          {/* Texture masks for each ring */}
          {ringTextures.map((_, index) => (
            <mask key={`texture-mask-${index}`} id={`textureMask${index}`}>
              <rect x="-250" y="-250" width="1300" height="1300" fill="white" filter={`url(#textureFilter${index})`} />
            </mask>
          ))}

          {/* Hatch patterns for additional texture variety */}
          <pattern id="hatchPattern1" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(35)">
            <rect width="12" height="12" fill="transparent" />
            <path d="M 0 0 L 0 12" stroke="#fff" strokeOpacity="0.08" strokeWidth="1" />
            <path d="M 6 0 L 6 12" stroke="#fff" strokeOpacity="0.06" strokeWidth="0.8" />
          </pattern>

          <pattern id="hatchPattern2" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(-25)">
            <rect width="10" height="10" fill="transparent" />
            <path d="M 0 0 L 0 10" stroke="#fff" strokeOpacity="0.07" strokeWidth="0.9" />
            <path d="M 5 0 L 5 10" stroke="#fff" strokeOpacity="0.05" strokeWidth="0.7" />
          </pattern>

          <pattern id="hatchPattern3" patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(15)">
            <rect width="14" height="14" fill="transparent" />
            <path d="M 0 0 L 0 14" stroke="#fff" strokeOpacity="0.06" strokeWidth="1.1" />
            <path d="M 7 0 L 7 14" stroke="#fff" strokeOpacity="0.04" strokeWidth="0.9" />
          </pattern>

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

        {/* Ring disks with enhanced textures */}
        <g id="rings">
          {sortedAges.map((age, index) => {
            const radius = generateRingRadius(index);
            const isSelected = selectedAge?.id === age.id;
            const isHovered = hoveredAge === age.id;
            const ringClasses = `ring-disk ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`;
            const hatchPattern = `hatchPattern${(index % 3) + 1}`;

            return (
              <g 
                key={age.id}
                className={ringClasses}
                pointerEvents="none"
              >
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
                />
                
                {/* Procedural texture overlay */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none"
                  stroke="#000"
                  strokeWidth={RING_THICKNESS}
                  mask={`url(#textureMask${index})`}
                  className="ring-texture-noise"
                  pointerEvents="none"
                />

                {/* Hatch pattern texture overlay */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none"
                  stroke={`url(#${hatchPattern})`}
                  strokeWidth={RING_THICKNESS}
                  className="ring-texture-hatch"
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
                  x={400 + radius * 0.7} 
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