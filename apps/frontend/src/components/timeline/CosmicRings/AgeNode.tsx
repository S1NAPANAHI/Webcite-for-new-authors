import React from 'react';
import { AgeGlyphs } from '../../../assets/glyphs/index.tsx';
import { useTimelineContext } from '../../../contexts/TimelineContext';
import { Age } from '../../../lib/api-timeline';

interface AgeNodeProps {
  age: Age;
  radius: number;
  angle: number;
  index: number;
}

export const AgeNode: React.FC<AgeNodeProps> = ({ age, radius, angle, index }) => {
  const { setSelectedAge, toggleExpansion, selectedAge, isExpanded } = useTimelineContext(); // Added isExpanded
  
  // Calculate position on the ring
  const radianAngle = (angle * Math.PI) / 180;
  const x = 192 + radius * Math.cos(radianAngle);
  const y = 192 + radius * Math.sin(radianAngle);
  
  const GlyphComponent = AgeGlyphs[age.glyph as keyof typeof AgeGlyphs];
  const isSelected = selectedAge?.id === age.id;
  
  const handleClick = () => {
    setSelectedAge(age);
    if (!isExpanded) { // Only toggle if not already expanded
        toggleExpansion();
    }
  };
  
  return (
    <g className="age-node cursor-pointer group" onClick={handleClick}
       style={{ transformOrigin: '192px 192px' }}>
      
      {/* Node Background Circle */}
      <circle
        cx={x} cy={y}
        r={isSelected ? 18 : 15}
        fill={isSelected ? age.color_code : 'var(--timeline-card)'}
        stroke="var(--timeline-gold)"
        strokeWidth={isSelected ? 3 : 2}
        className="transition-all duration-300"
      />
      
      {/* Glyph Icon */}
      <foreignObject x={x - 8} y={y - 8} width="16" height="16" className="pointer-events-none">
        {GlyphComponent && (
          <GlyphComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-timeline-gold'}`} />
        )}
      </foreignObject>
      
      {/* Age Title on hover */}
      <text x={x} y={y + 35} textAnchor="middle"
            className="fill-current text-timeline-text font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {age.title}
      </text>
    </g>
  );
};
