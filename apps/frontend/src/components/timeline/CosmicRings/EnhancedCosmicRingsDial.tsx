import React, { useState, useCallback, useRef } from 'react';
import { Age } from '../../../lib/api-timeline';
import './enhanced-cosmic-rings.css';

interface CosmicRingsDialProps {
  ages: Age[];
  selectedAge: Age | null;
  onAgeSelect: (age: Age) => void;
  className?: string;
}

export const EnhancedCosmicRingsDial: React.FC<CosmicRingsDialProps> = ({
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

  // Enhanced color palette with stone/metal theme
  const ageColors = [
    "#d4af37", // Gold - Dawn of Creation
    "#cd7f32", // Bronze - Wings of Time  
    "#b8860b", // Dark goldenrod - Rise of Humanity
    "#a0522d", // Sienna - Sacred Flames
    "#8b7355", // Dark khaki - Serpents Wisdom
    "#708090", // Slate gray - Horizons Promise
    "#9370db", // Medium purple - Twin Flames
    "#b0c4de", // Light steel blue - Star Paths
    "#dcdcdc"  // Gainsboro - Final Gateway
  ];

  // Stone texture types for each ring
  const stoneTextures = [
    'granite', 'marble', 'sandstone', 'slate', 'limestone',
    'basalt', 'quartzite', 'schist', 'obsidian'
  ];

  // Metallic finishes for each ring
  const metallicFinishes = [
    'gold', 'bronze', 'copper', 'brass', 'silver',
    'iron', 'pewter', 'platinum', 'titanium'
  ];

  // Rotation speeds (in seconds) for each ring
  const rotationSpeeds = [8, 12, 10, 15, 18, 22, 25, 30, 35];
  const rotationDirections = [1, -1, 1, -1, 1, -1, 1, -1, 1]; // 1 = clockwise, -1 = counter-clockwise

  // Generate text path ID for each ring
  const getTextPathId = (index: number): string => {
    return `text-path-${index}`;
  };

  // Sort ages by age_number to ensure correct order
  const sortedAges = [...ages].sort((a, b) => a.age_number - b.age_number);

  // Mathematical click detection (preserved from original)
  const handleSVGClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const svgSize = Math.min(svgRect.width, svgRect.height);
    const scale = svgSize / 800;
    
    const centerX = svgRect.width / 2;
    const centerY = svgRect.height / 2;
    const clickX = event.clientX - svgRect.left - centerX;
    const clickY = event.clientY - svgRect.top - centerY;
    
    const distance = Math.sqrt(clickX * clickX + clickY * clickY) / scale;

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

  // Handle hover with mathematical detection (preserved from original)
  const handleSVGMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const svgSize = Math.min(svgRect.width, svgRect.height);
    const scale = svgSize / 800;
    
    const centerX = svgRect.width / 2;
    const centerY = svgRect.height / 2;
    const mouseX = event.clientX - svgRect.left - centerX;
    const mouseY = event.clientY - svgRef.top - centerY;
    
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
    <div className={`enhanced-cosmic-rings-container ${className}`}>
      <svg 
        ref={svgRef}
        className="enhanced-cosmic-rings-dial" 
        viewBox="0 0 800 800" 
        width="100%" 
        role="img" 
        aria-label="Nine concentric rings dial representing cosmic ages with stone and metallic textures"
        onClick={handleSVGClick}
        onMouseMove={handleSVGMouseMove}
        onMouseLeave={handleSVGMouseLeave}
        style={{ cursor: 'pointer' }}
      >
        <defs>
          {/* Enhanced starfield background gradient */}
          <radialGradient id="enhancedSpaceGradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#1a1f2e"/>
            <stop offset="40%" stopColor="#0f141f"/>
            <stop offset="80%" stopColor="#08090c"/>
            <stop offset="100%" stopColor="#000000"/>
          </radialGradient>

          {/* Stone texture patterns for each ring */}
          {sortedAges.map((_, index) => {
            const textureType = stoneTextures[index] || 'granite';
            const baseColor = ageColors[index] || "#d4af37";
            
            return (
              <pattern 
                key={`stone-pattern-${index}`}
                id={`stone-texture-${index}`} 
                patternUnits="userSpaceOnUse" 
                width="20" 
                height="20"
              >
                {textureType === 'granite' && (
                  <>
                    <rect width="20" height="20" fill={baseColor} opacity="0.8"/>
                    <circle cx="4" cy="6" r="1.5" fill="rgba(80,70,60,0.6)"/>
                    <circle cx="12" cy="3" r="1" fill="rgba(90,80,70,0.4)"/>
                    <circle cx="16" cy="14" r="1.2" fill="rgba(70,60,50,0.5)"/>
                    <circle cx="8" cy="16" r="0.8" fill="rgba(100,90,80,0.3)"/>
                  </>
                )}
                {textureType === 'marble' && (
                  <>
                    <rect width="20" height="20" fill={baseColor} opacity="0.9"/>
                    <path d="M0,10 Q10,5 20,12" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
                    <path d="M5,0 Q12,8 18,20" stroke="rgba(200,200,200,0.2)" strokeWidth="0.8" fill="none"/>
                  </>
                )}
                {(textureType !== 'granite' && textureType !== 'marble') && (
                  <>
                    <rect width="20" height="20" fill={baseColor} opacity="0.85"/>
                    <rect x="0" y="0" width="20" height="1" fill="rgba(255,255,255,0.1)"/>
                    <rect x="0" y="10" width="20" height="1" fill="rgba(0,0,0,0.1)"/>
                  </>
                )}
              </pattern>
            );
          })}

          {/* Enhanced metallic gradients with realistic finishes */}
          {sortedAges.map((_, index) => {
            const color = ageColors[index] || "#d4af37";
            const finish = metallicFinishes[index] || 'bronze';
            
            return (
              <radialGradient 
                key={`metallic-gradient-${index}`} 
                id={`metallic-gradient-${index}`} 
                cx="30%" cy="30%" r="80%"
              >
                {finish === 'gold' && (
                  <>
                    <stop offset="0%" stopColor="#ffd700" stopOpacity="0.9" />
                    <stop offset="30%" stopColor="#ffed4e" stopOpacity="0.7" />
                    <stop offset="70%" stopColor="#b8860b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#daa520" stopOpacity="0.6" />
                  </>
                )}
                {finish === 'bronze' && (
                  <>
                    <stop offset="0%" stopColor="#ffdfba" stopOpacity="0.8" />
                    <stop offset="30%" stopColor="#cd7f32" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#8b4513" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#a0522d" stopOpacity="0.6" />
                  </>
                )}
                {finish === 'copper' && (
                  <>
                    <stop offset="0%" stopColor="#ffa07a" stopOpacity="0.8" />
                    <stop offset="30%" stopColor="#b87333" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#8b4513" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#48d1cc" stopOpacity="0.3" />
                  </>
                )}
                {!['gold', 'bronze', 'copper'].includes(finish) && (
                  <>
                    <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                    <stop offset="40%" stopColor={color} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.5" />
                  </>
                )}
              </radialGradient>
            );
          })}

          {/* Enhanced metallic shine gradients */}
          {sortedAges.map((_, index) => (
            <linearGradient 
              key={`shine-gradient-${index}`} 
              id={`shine-gradient-${index}`} 
              x1="0%" y1="0%" x2="100%" y2="100%"
              gradientTransform="rotate(45)"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="20%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="80%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
            </linearGradient>
          ))}

          {/* Glass-like highlight overlays */}
          {sortedAges.map((_, index) => (
            <radialGradient 
              key={`glass-highlight-${index}`} 
              id={`glass-highlight-${index}`} 
              cx="25%" cy="25%" r="60%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          ))}

          {/* Text paths for labels (preserved from original) */}
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

          {/* Enhanced filters */}
          <filter id="enhancedSelectionGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" type="matrix" values="1 0.8 0.3 0 0  1 0.8 0.3 0 0  0.5 0.4 0.1 0 0  0 0 0 1 0"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>

          <filter id="enhancedHoverGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" type="matrix" values="1 0.9 0.7 0 0  1 0.9 0.7 0 0  0.8 0.7 0.5 0 0  0 0 0 1 0"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>

          <filter id="enhancedMetallicSheen" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="0.5" result="softGlow"/>
            <feMerge> 
              <feMergeNode in="SourceGraphic"/>
              <feMergeNode in="softGlow"/> 
            </feMerge>
          </filter>
        </defs>

        {/* Enhanced space background with subtle movement */}
        <rect x="0" y="0" width="800" height="800" fill="url(#enhancedSpaceGradient)" className="space-background" />
        
        {/* Enhanced animated starfield */}
        <g className="starfield-layer" opacity="0.8">
          {Array.from({ length: 40 }).map((_, i) => {
            const x = 50 + (i * 19) % 700;
            const y = 50 + (i * 13) % 700;
            const size = 0.5 + (i % 3) * 0.3;
            const twinkleDelay = i * 0.2;
            
            return (
              <circle 
                key={`star-${i}`}
                cx={x} 
                cy={y} 
                r={size} 
                fill="#ffffff"
                className="twinkling-star"
                style={{
                  animationDelay: `${twinkleDelay}s`,
                  opacity: 0.6 + (i % 4) * 0.1
                }}
              />
            );
          })}
        </g>

        {/* Enhanced center medallion */}
        <g className="center-medallion">
          <circle 
            cx="400" 
            cy="400" 
            r="65" 
            fill="url(#metallic-gradient-0)" 
            opacity="0.95"
          />
          <circle 
            cx="400" 
            cy="400" 
            r="65" 
            fill="url(#glass-highlight-0)" 
          />
          <circle 
            cx="400" 
            cy="400" 
            r="65" 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="3" 
            opacity="0.9"
            strokeDasharray="2,2"
            className="center-rim"
          />
          <text 
            x="400" 
            y="390" 
            textAnchor="middle" 
            className="center-label"
            fontSize="13"
            fill="#f1deac"
            fontWeight="700"
          >
            COSMIC
          </text>
          <text 
            x="400" 
            y="415" 
            textAnchor="middle" 
            className="center-label"
            fontSize="13"
            fill="#f1deac"
            fontWeight="700"
          >
            AGES
          </text>
        </g>

        {/* Enhanced rotating rings with layered textures */}
        <g id="enhanced-rings">
          {sortedAges.map((age, index) => {
            const radius = generateRingRadius(index);
            const isSelected = selectedAge?.id === age.id;
            const isHovered = hoveredAge === age.id;
            const ringClasses = `enhanced-ring-disk ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`;
            const rotationClass = `ring-rotation-${index}`;

            return (
              <g 
                key={age.id}
                className={`${ringClasses} ${rotationClass}`}
                pointerEvents="none"
                style={{
                  transformOrigin: '400px 400px',
                  animation: `rotate${rotationDirections[index] === 1 ? 'Clockwise' : 'CounterClockwise'} ${rotationSpeeds[index]}s linear infinite`
                }}
              >
                {/* Base stone texture layer */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none"
                  stroke={`url(#stone-texture-${index})`}
                  strokeWidth={RING_THICKNESS}
                  className="ring-stone-base"
                />
                
                {/* Metallic gradient overlay */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none"
                  stroke={`url(#metallic-gradient-${index})`}
                  strokeWidth={RING_THICKNESS * 0.9}
                  className="ring-metallic-overlay"
                  style={{ mixBlendMode: 'multiply' }}
                />

                {/* Metallic shine highlight */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none"
                  stroke={`url(#shine-gradient-${index})`}
                  strokeWidth={RING_THICKNESS * 0.6}
                  className="ring-metallic-shine"
                  style={{ mixBlendMode: 'soft-light' }}
                />
                
                {/* Glass-like highlight */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius} 
                  fill="none"
                  stroke={`url(#glass-highlight-${index})`}
                  strokeWidth={RING_THICKNESS * 0.4}
                  className="ring-glass-highlight"
                  style={{ mixBlendMode: 'overlay' }}
                />
                
                {/* Enhanced rim definition */}
                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius + RING_THICKNESS/2 - 1} 
                  fill="none" 
                  stroke={isSelected ? "rgba(212, 175, 55, 0.9)" : "rgba(255,255,255,0.3)"} 
                  strokeWidth={isSelected ? "2" : "1"}
                  className="outer-rim-enhanced"
                />

                <circle 
                  cx="400" 
                  cy="400" 
                  r={radius - RING_THICKNESS/2 + 1} 
                  fill="none" 
                  stroke={isSelected ? "rgba(212, 175, 55, 0.7)" : "rgba(255,255,255,0.2)"} 
                  strokeWidth={isSelected ? "2" : "1"}
                  className="inner-rim-enhanced"
                />

                {/* Selection/hover glow effect */}
                {(isSelected || isHovered) && (
                  <circle 
                    cx="400" 
                    cy="400" 
                    r={radius} 
                    fill="none"
                    stroke={ageColors[index] || "#d4af37"}
                    strokeWidth={RING_THICKNESS}
                    filter={isSelected ? "url(#enhancedSelectionGlow)" : "url(#enhancedHoverGlow)"}
                    className="ring-glow-effect"
                    opacity="0.8"
                  />
                )}

                {/* Age label - not rotating with ring */}
                <text 
                  className="enhanced-ring-label"
                  style={{
                    transformOrigin: '400px 400px',
                    animation: `rotate${rotationDirections[index] === -1 ? 'Clockwise' : 'CounterClockwise'} ${rotationSpeeds[index]}s linear infinite`
                  }}
                >
                  <textPath 
                    href={`#${getTextPathId(index)}`} 
                    startOffset="50%" 
                    textAnchor="middle"
                  >
                    {age.name || age.title}
                  </textPath>
                </text>

                {/* Age number - not rotating with ring */}
                <text 
                  x={400 + radius * 0.7} 
                  y={400} 
                  textAnchor="middle" 
                  className="enhanced-age-number"
                  fill={isSelected ? "rgba(241, 222, 172, 0.9)" : "rgba(255,255,255,0.7)"}
                  fontSize="11"
                  fontWeight="600"
                  style={{
                    transformOrigin: '400px 400px',
                    animation: `rotate${rotationDirections[index] === -1 ? 'Clockwise' : 'CounterClockwise'} ${rotationSpeeds[index]}s linear infinite`
                  }}
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

export default EnhancedCosmicRingsDial;