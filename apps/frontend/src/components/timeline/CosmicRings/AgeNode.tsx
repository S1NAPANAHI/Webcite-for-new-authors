import React from 'react';
import { AgeGlyphs } from '../../../assets/glyphs/index.tsx';
import { Age } from '../../../lib/api-timeline';

interface AgeNodeProps {
  age: Age;
  radius: number;
  angle: number;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const AgeNode: React.FC<AgeNodeProps> = ({ 
  age, 
  radius, 
  angle, 
  index, 
  isSelected = false, 
  onClick 
}) => {
  // Calculate position on the ring (adjusted for new viewBox center)
  const radianAngle = (angle - 90) * Math.PI / 180; // -90 to start from top
  const x = 160 + radius * Math.cos(radianAngle);
  const y = 160 + radius * Math.sin(radianAngle);
  
  const GlyphComponent = AgeGlyphs[age.glyph as keyof typeof AgeGlyphs];
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <g className="age-node cursor-pointer group" onClick={handleClick}>
      
      {/* Selection Glow Effect */}
      {isSelected && (
        <circle
          cx={x} 
          cy={y}
          r={25}
          fill="none"
          stroke="var(--timeline-gold)"
          strokeWidth="2"
          opacity="0.3"
          strokeDasharray="4,4"
        >
          <animate
            attributeName="r"
            values="25;30;25"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.6;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      
      {/* Age Image Background (if image exists) */}
      {age.image_url && (
        <defs>
          <pattern 
            id={`age-image-${age.id}`} 
            patternUnits="objectBoundingBox" 
            width="100%" 
            height="100%"
          >
            <image 
              href={age.image_url} 
              x="0" 
              y="0" 
              width="1" 
              height="1" 
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>
      )}
      
      {/* Node Background Circle with Image or Solid Fill */}
      <circle
        cx={x} 
        cy={y}
        r={isSelected ? 16 : 12}
        fill={age.image_url ? `url(#age-image-${age.id})` : (isSelected ? 'var(--timeline-gold)' : 'var(--timeline-bg)')}
        stroke="var(--timeline-gold)"
        strokeWidth={isSelected ? 3 : 2}
        className="transition-all duration-300 hover:scale-110"
        opacity={isSelected ? 1 : 0.8}
      >
        {/* Hover animation */}
        <animate
          attributeName="r"
          values={`${isSelected ? 16 : 12};${isSelected ? 18 : 14};${isSelected ? 16 : 12}`}
          dur="0.3s"
          begin="mouseover"
          fill="freeze"
        />
        <animate
          attributeName="r"
          values={`${isSelected ? 18 : 14};${isSelected ? 16 : 12}`}
          dur="0.3s"
          begin="mouseout"
          fill="freeze"
        />
      </circle>
      
      {/* Inner highlight circle - only show if no image or when selected */}
      {(!age.image_url || isSelected) && (
        <circle
          cx={x} 
          cy={y}
          r={isSelected ? 10 : 8}
          fill={age.image_url ? 'rgba(0,0,0,0.3)' : (isSelected ? 'var(--timeline-bg)' : 'var(--timeline-gold)')}
          opacity={isSelected ? 0.9 : 0.6}
          className="transition-all duration-300"
        />
      )}
      
      {/* Glyph Icon - overlay on image if present */}
      {GlyphComponent ? (
        <foreignObject 
          x={x - (isSelected ? 8 : 6)} 
          y={y - (isSelected ? 8 : 6)} 
          width={isSelected ? 16 : 12} 
          height={isSelected ? 16 : 12} 
          className="pointer-events-none"
        >
          <GlyphComponent 
            className={`w-full h-full transition-all duration-300 drop-shadow-lg ${
              age.image_url 
                ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                : (isSelected ? 'text-timeline-gold' : 'text-timeline-bg')
            }`} 
          />
        </foreignObject>
      ) : (
        // Fallback: Age number or symbol
        <text 
          x={x} 
          y={y + 2} 
          textAnchor="middle" 
          dominantBaseline="middle"
          className={`text-xs font-bold transition-all duration-300 ${
            age.image_url 
              ? 'fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
              : (isSelected ? 'fill-timeline-bg' : 'fill-timeline-gold')
          }`}
        >
          {age.symbol || (index + 1)}
        </text>
      )}
      
      {/* Connection Line to Ring */}
      <line
        x1={160 + (radius - 25) * Math.cos(radianAngle)}
        y1={160 + (radius - 25) * Math.sin(radianAngle)}
        x2={160 + (radius + 25) * Math.cos(radianAngle)}
        y2={160 + (radius + 25) * Math.sin(radianAngle)}
        stroke="var(--timeline-gold)"
        strokeWidth={isSelected ? 2 : 1}
        opacity={isSelected ? 0.6 : 0.3}
        className="transition-all duration-300"
      />
      
      {/* Age Title - Always visible but changes style */}
      <text 
        x={x + (isSelected ? 0 : 0)} 
        y={y + (isSelected ? 35 : 30)} 
        textAnchor="middle"
        dominantBaseline="middle"
        className={`font-medium transition-all duration-300 pointer-events-none ${
          isSelected 
            ? 'text-sm fill-timeline-gold font-bold' 
            : 'text-xs fill-timeline-text/70 opacity-0 group-hover:opacity-100'
        }`}
        transform={`rotate(${angle < 180 ? 0 : 180}, ${x}, ${y + (isSelected ? 35 : 30)})`}
      >
        {age.title}
      </text>
      
      {/* Age description on selection */}
      {isSelected && age.description && (
        <text 
          x={x} 
          y={y + 50} 
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-timeline-text/60 opacity-80 max-w-20"
        >
          {age.description.length > 30 ? `${age.description.substring(0, 30)}...` : age.description}
        </text>
      )}
      
      {/* Image indicator dot */}
      {age.image_url && (
        <circle
          cx={x + 12} 
          cy={y - 12}
          r="2"
          fill="var(--timeline-gold)"
          opacity="0.9"
        >
          <animate
            attributeName="opacity"
            values="0.9;0.5;0.9"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      
      {/* Pulsing dots for major ages */}
      {age.importance === 'major' && (
        <circle
          cx={x + 18} 
          cy={y - 18}
          r="3"
          fill="var(--timeline-gold)"
          opacity="0.8"
        >
          <animate
            attributeName="opacity"
            values="0.8;0.3;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      
      {/* Hover interaction zone */}
      <circle
        cx={x} 
        cy={y}
        r={25}
        fill="transparent"
        className="hover:fill-timeline-gold/5 transition-all duration-300"
      />
    </g>
  );
};