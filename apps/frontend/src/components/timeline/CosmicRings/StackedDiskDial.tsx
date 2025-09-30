import React from 'react';
import { useTimelineData } from '../hooks/useTimelineData';
import { useCosmicAnimation } from '../hooks/useCosmicAnimation';
import { Age } from '../../../lib/api-timeline';

interface StackedDiskDialProps {
  onAgeSelect?: (age: Age) => void;
  selectedAgeId?: number | null;
  className?: string;
}

// Age symbols for different ages
const AgeSymbol: React.FC<{ type: string; size?: number }> = ({ type, size = 16 }) => {
  const iconProps = {
    width: size,
    height: size,
    className: "age-symbol",
    fill: "currentColor"
  };

  switch (type) {
    case 'temple':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M2 21V19H4V6L12 2L20 6V19H22V21H2ZM6 19H8V13H16V19H18V7L12 4L6 7V19ZM10 11V9H14V11H10Z"/>
        </svg>
      );
    case 'star':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
        </svg>
      );
    case 'flame':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13.19 3.19 12.54 3.67 12 4.24C11.81 4.43 11.63 4.64 11.45 4.86C11.18 5.22 10.93 5.6 10.7 6C10.48 6.4 10.26 6.8 10.06 7.22C9.84 7.65 9.64 8.09 9.47 8.54C9.3 8.99 9.16 9.44 9.06 9.9C8.96 10.35 8.9 10.8 8.9 11.24C8.9 12.74 9.58 14.09 10.75 14.9C11.92 15.71 13.57 15.8 14.94 15.17C16.31 14.54 17.2 13.2 17.2 11.7C17.2 11.50 17.19 11.31 17.16 11.12C17.13 10.93 17.09 10.74 17.03 10.56C16.97 10.38 16.89 10.21 16.8 10.04C16.71 9.87 16.61 9.71 16.5 9.55C16.39 9.39 16.27 9.24 16.14 9.1C16.01 8.96 15.87 8.82 15.72 8.69C15.57 8.56 15.41 8.44 15.25 8.32C15.09 8.2 14.92 8.09 14.75 7.99C14.58 7.89 14.4 7.8 14.22 7.72C14.04 7.64 13.85 7.57 13.66 7.51C13.47 7.45 13.27 7.4 13.07 7.36C12.87 7.32 12.67 7.29 12.46 7.27C12.25 7.25 12.04 7.24 11.83 7.24C11.62 7.24 11.41 7.25 11.2 7.27C10.99 7.29 10.78 7.32 10.58 7.36C10.38 7.4 10.18 7.45 9.99 7.51C9.8 7.57 9.61 7.64 9.43 7.72C9.25 7.8 9.07 7.89 8.9 7.99C8.73 8.09 8.56 8.2 8.4 8.32C8.24 8.44 8.08 8.56 7.93 8.69C7.78 8.82 7.64 8.96 7.51 9.1C7.38 9.24 7.26 9.39 7.15 9.55C7.04 9.71 6.94 9.87 6.85 10.04C6.76 10.21 6.68 10.38 6.62 10.56C6.56 10.74 6.52 10.93 6.49 11.12C6.46 11.31 6.45 11.50 6.45 11.7C6.45 13.2 7.34 14.54 8.71 15.17C10.08 15.8 11.73 15.71 12.9 14.9C14.07 14.09 14.75 12.74 14.75 11.24C14.75 10.8 14.69 10.35 14.59 9.9C14.49 9.44 14.35 8.99 14.18 8.54C14.01 8.09 13.81 7.65 13.59 7.22C13.37 6.8 13.15 6.4 12.95 6C12.75 5.6 12.57 5.22 12.4 4.86C12.23 4.5 12.07 4.15 11.93 3.82C11.79 3.49 11.67 3.17 11.57 2.85C11.47 2.53 11.39 2.22 11.33 1.91C11.27 1.6 11.23 1.3 11.21 1C11.19 0.7 11.19 0.41 11.21 0.13C11.23 -0.15 11.27 -0.42 11.33 -0.68C11.39 -0.94 11.47 -1.19 11.57 -1.43C11.67 -1.67 11.79 -1.9 11.93 -2.12C12.07 -2.34 12.23 -2.55 12.4 -2.75C12.57 -2.95 12.75 -3.14 12.95 -3.32C13.15 -3.5 13.37 -3.67 13.59 -3.83C13.81 -3.99 14.01 -4.14 14.18 -4.28C14.35 -4.42 14.49 -4.55 14.59 -4.67C14.69 -4.79 14.75 -4.9 14.75 -5C14.75 -5.1 14.69 -5.19 14.59 -5.27C14.49 -5.35 14.35 -5.42 14.18 -5.48C14.01 -5.54 13.81 -5.59 13.59 -5.63C13.37 -5.67 13.15 -5.7 12.95 -5.72C12.75 -5.74 12.57 -5.75 12.4 -5.75C12.23 -5.75 12.07 -5.74 11.93 -5.72C11.79 -5.7 11.67 -5.67 11.57 -5.63C11.47 -5.59 11.39 -5.54 11.33 -5.48C11.27 -5.42 11.23 -5.35 11.21 -5.27C11.19 -5.19 11.19 -5.1 11.21 -5C11.23 -4.9 11.27 -4.79 11.33 -4.67C11.39 -4.55 11.47 -4.42 11.57 -4.28C11.67 -4.14 11.79 -3.99 11.93 -3.83C12.07 -3.67 12.23 -3.5 12.4 -3.32C12.57 -3.14 12.75 -2.95 12.95 -2.75C13.15 -2.55 13.37 -2.34 13.59 -2.12C13.81 -1.9 14.01 -1.67 14.18 -1.43C14.35 -1.19 14.49 -0.94 14.59 -0.68C14.69 -0.42 14.75 -0.15 14.77 0.13C14.79 0.41 14.79 0.7 14.77 1C14.75 1.3 14.69 1.6 14.59 1.91C14.49 2.22 14.35 2.53 14.18 2.85C14.01 3.17 13.81 3.49 13.59 3.82C13.37 4.15 13.15 4.5 12.95 4.86C12.75 5.22 12.57 5.6 12.4 6C12.23 6.4 12.07 6.8 11.93 7.22C11.79 7.65 11.67 8.09 11.57 8.54C11.47 8.99 11.39 9.44 11.33 9.9C11.27 10.35 11.23 10.8 11.21 11.24C11.19 11.68 11.19 12.12 11.21 12.56C11.23 13 11.27 13.43 11.33 13.86C11.39 14.29 11.47 14.71 11.57 15.13C11.67 15.55 11.79 15.96 11.93 16.36C12.07 16.76 12.23 17.15 12.4 17.53C12.57 17.91 12.75 18.28 12.95 18.64C13.15 19 13.37 19.35 13.59 19.69C13.81 20.03 14.01 20.36 14.18 20.68C14.35 21 14.49 21.31 14.59 21.61C14.69 21.91 14.75 22.2 14.75 22.48C14.75 22.76 14.69 23.03 14.59 23.29C14.49 23.55 14.35 23.8 14.18 24.04C14.01 24.28 13.81 24.51 13.59 24.73C13.37 24.95 13.15 25.16 12.95 25.36C12.75 25.56 12.57 25.75 12.4 25.93C12.23 26.11 12.07 26.28 11.93 26.44C11.79 26.6 11.67 26.75 11.57 26.89C11.47 27.03 11.39 27.16 11.33 27.28C11.27 27.4 11.23 27.51 11.21 27.61C11.19 27.71 11.19 27.8 11.21 27.88C11.23 27.96 11.27 28.03 11.33 28.09C11.39 28.15 11.47 28.2 11.57 28.24C11.67 28.28 11.79 28.31 11.93 28.33C12.07 28.35 12.23 28.36 12.4 28.36C12.57 28.36 12.75 28.35 12.95 28.33C13.15 28.31 13.37 28.28 13.59 28.24C13.81 28.2 14.01 28.15 14.18 28.09C14.35 28.03 14.49 27.96 14.59 27.88C14.69 27.8 14.75 27.71 14.75 27.61C14.75 27.51 14.69 27.4 14.59 27.28C14.49 27.16 14.35 27.03 14.18 26.89C14.01 26.75 13.81 26.6 13.59 26.44C13.37 26.28 13.15 26.11 12.95 25.93C12.75 25.75 12.57 25.56 12.4 25.36C12.23 25.16 12.07 24.95 11.93 24.73C11.79 24.51 11.67 24.28 11.57 24.04C11.47 23.8 11.39 23.55 11.33 23.29C11.27 23.03 11.23 22.76 11.21 22.48C11.19 22.2 11.19 21.91 11.21 21.61C11.23 21.31 11.27 21 11.33 20.68C11.39 20.36 11.47 20.03 11.57 19.69C11.67 19.35 11.79 19 11.93 18.64C12.07 18.28 12.23 17.91 12.4 17.53C12.57 17.15 12.75 16.76 12.95 16.36C13.15 15.96 13.37 15.55 13.59 15.13C13.81 14.71 14.01 14.29 14.18 13.86C14.35 13.43 14.49 13 14.59 12.56C14.69 12.12 14.75 11.68 14.75 11.24C14.75 10.8 14.69 10.35 14.59 9.9C14.49 9.44 14.35 8.99 14.18 8.54C14.01 8.09 13.81 7.65 13.59 7.22C13.37 6.8 13.15 6.4 12.95 6C12.75 5.6 12.57 5.22 12.4 4.86C12.23 4.5 12.07 4.15 11.93 3.82C11.79 3.49 11.67 3.17 11.57 2.85C11.47 2.53 11.39 2.22 11.33 1.91C11.27 1.6 11.23 1.3 11.21 1C11.19 0.7 11.19 0.41 11.21 0.13C11.23 -0.15 11.27 -0.42 11.33 -0.68C11.39 -0.94 11.47 -1.19 11.57 -1.43C11.67 -1.67 11.79 -1.9 11.93 -2.12C12.07 -2.34 12.23 -2.55 12.4 -2.75C12.57 -2.95 12.75 -3.14 12.95 -3.32C13.15 -3.5 13.37 -3.67 13.59 -3.83C13.81 -3.99 14.01 -4.14 14.18 -4.28C14.35 -4.42 14.49 -4.55 14.59 -4.67C14.69 -4.79 14.75 -4.9 14.75 -5Z"/>
        </svg>
      );
    case 'wings':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M23 12L20.56 14.78L20.9 18.46L17.29 19.28L15.4 22.46L12 21L8.6 22.46L6.71 19.28L3.1 18.46L3.44 14.78L1 12L3.44 9.22L3.1 5.54L6.71 4.72L8.6 1.54L12 3L15.4 1.54L17.29 4.72L20.9 5.54L20.56 9.22L23 12Z"/>
        </svg>
      );
    default:
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};

// Individual stacked disk component with 3D appearance
const StackedDisk: React.FC<{
  age: Age;
  level: number;
  isSelected: boolean;
  onClick: () => void;
  totalLevels: number;
}> = ({ age, level, isSelected, onClick, totalLevels }) => {
  // Calculate disk properties based on level (0 = bottom/largest, increasing = top/smallest)
  const baseRadius = 140;
  const radiusStep = 25;
  const radius = baseRadius - (level * radiusStep);
  
  // Calculate vertical offset for stacked appearance
  const baseOffset = 0;
  const offsetStep = 8;
  const yOffset = baseOffset - (level * offsetStep);
  
  // Calculate shadow and lighting for 3D effect
  const shadowBlur = 8 - (level * 1);
  const shadowOffset = 2 + level;
  
  const getAgeSymbol = (ageTitle: string) => {
    if (ageTitle.toLowerCase().includes('sacred') || ageTitle.toLowerCase().includes('flames')) return 'flame';
    if (ageTitle.toLowerCase().includes('rise') || ageTitle.toLowerCase().includes('humanity')) return 'star';
    if (ageTitle.toLowerCase().includes('wings') || ageTitle.toLowerCase().includes('time')) return 'wings';
    if (ageTitle.toLowerCase().includes('dawn') || ageTitle.toLowerCase().includes('creation')) return 'temple';
    return 'star';
  };

  return (
    <g 
      className={`stacked-disk level-${level} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      transform={`translate(0, ${yOffset})`}
    >
      {/* Disk shadow for 3D depth */}
      <ellipse
        cx="200"
        cy={210 + shadowOffset}
        rx={radius + 2}
        ry={radius * 0.3}
        fill="rgba(0, 0, 0, 0.3)"
        opacity={0.6 - (level * 0.1)}
        style={{
          filter: `blur(${shadowBlur}px)`,
        }}
      />
      
      {/* Main disk with gradient and texture */}
      <circle
        cx="200"
        cy="200"
        r={radius}
        fill={`url(#diskGradient${level})`}
        stroke={isSelected ? "rgba(212, 175, 55, 0.8)" : "rgba(212, 175, 55, 0.4)"}
        strokeWidth={isSelected ? "3" : "1"}
        className="main-disk"
        style={{
          filter: `drop-shadow(0 ${shadowOffset}px ${shadowBlur}px rgba(0, 0, 0, 0.4))`,
          transition: 'all 0.3s ease'
        }}
      />
      
      {/* Inner highlight ring for glassy effect */}
      <circle
        cx="200"
        cy="200"
        r={radius - 8}
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1"
        opacity={isSelected ? 0.6 : 0.3}
        className="inner-highlight"
      />
      
      {/* Age text positioned on disk */}
      <text
        x="200"
        y={200 - radius + 35}
        textAnchor="middle"
        dominantBaseline="middle"
        className="age-text"
        fill={isSelected ? "#d4af37" : "rgba(212, 175, 55, 0.9)"}
        style={{
          fontSize: `${Math.max(10, 14 - level)}px`,
          fontFamily: 'Cinzel, serif',
          fontWeight: isSelected ? 700 : 600,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
          pointerEvents: 'none',
          transition: 'all 0.3s ease'
        }}
      >
        {age.title}
      </text>
      
      {/* Age symbol */}
      <g transform={`translate(200, ${200 - radius + 55})`}>
        <foreignObject x="-10" y="-10" width="20" height="20">
          <div className="flex items-center justify-center text-timeline-gold">
            <AgeSymbol 
              type={getAgeSymbol(age.title)} 
              size={Math.max(12, 16 - level)}
            />
          </div>
        </foreignObject>
      </g>
      
      {/* Selection indicator */}
      {isSelected && (
        <circle
          cx="200"
          cy="200"
          r={radius + 5}
          fill="none"
          stroke="rgba(212, 175, 55, 0.6)"
          strokeWidth="2"
          strokeDasharray="6,6"
          opacity="0.8"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 200 200;360 200 200"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
};

export const StackedDiskDial: React.FC<StackedDiskDialProps> = ({ 
  onAgeSelect,
  selectedAgeId = null,
  className = ''
}) => {
  const { ages, loading } = useTimelineData();

  const handleAgeClick = (age: Age) => {
    if (onAgeSelect) {
      onAgeSelect(age);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center w-96 h-96 ${className}`}>
        <div className="text-center">
          {/* 3D Loading animation */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`loading-disk-${index}`}
                className="absolute border-4 rounded-full"
                style={{
                  width: `${100 - (index * 20)}px`,
                  height: `${100 - (index * 20)}px`,
                  left: '50%',
                  top: `${50 + (index * 4)}%`,
                  transform: 'translate(-50%, -50%)',
                  borderColor: `rgba(212, 175, 55, ${0.8 - (index * 0.2)})`,
                  borderTopColor: 'transparent',
                  animation: `spin ${2 + index}s linear infinite ${index % 2 === 1 ? 'reverse' : ''}`
                }}
              />
            ))}
          </div>
          <p className="text-timeline-text/70 text-sm animate-pulse">Loading cosmic disks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Circular SVG container - no square! */}
      <svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        className="stacked-disk-container overflow-visible"
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))'
        }}
      >
        {/* Gradient definitions for glass/stone textures */}
        <defs>
          {ages.map((age, index) => {
            const level = ages.length - 1 - index; // Reverse order for stacking
            const baseOpacity = 0.7 - (level * 0.1);
            const lightness = 45 + (level * 5);
            
            return (
              <radialGradient 
                key={`diskGradient${level}`}
                id={`diskGradient${level}`} 
                cx="30%" 
                cy="30%" 
                r="80%"
              >
                <stop offset="0%" stopColor={`hsl(45, 60%, ${lightness + 15}%)`} stopOpacity={baseOpacity + 0.2} />
                <stop offset="50%" stopColor={`hsl(45, 50%, ${lightness}%)`} stopOpacity={baseOpacity} />
                <stop offset="100%" stopColor={`hsl(45, 40%, ${lightness - 10}%)`} stopOpacity={baseOpacity - 0.1} />
              </radialGradient>
            );
          })}
          
          {/* Noise texture for stone effect */}
          <filter id="stoneTexture">
            <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
          
          {/* Glass reflection effect */}
          <filter id="glassReflection">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
            <feSpecularLighting in="blur" result="specOut" lightingColor="white" specularConstant="2" specularExponent="20">
              <fePointLight x="50" y="50" z="200" />
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut2" />
            <feComposite in="SourceGraphic" in2="specOut2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </defs>
        
        {/* Background cosmic atmosphere */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)"
          opacity="0.6"
        />
        
        {/* Stacked disks - render from largest to smallest (bottom to top) */}
        {ages.map((age, index) => {
          const level = ages.length - 1 - index; // Reverse order for proper stacking
          const isSelected = selectedAgeId === age.id;
          
          return (
            <StackedDisk
              key={age.id}
              age={age}
              level={level}
              isSelected={isSelected}
              onClick={() => handleAgeClick(age)}
              totalLevels={ages.length}
            />
          );
        })}
        
        {/* Central core */}
        <circle
          cx="200"
          cy="200"
          r="25"
          fill="url(#coreGradient)"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))'
          }}
        />
        
        {/* Core text */}
        <text
          x="200"
          y="195"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-bold"
          fill="#d4af37"
          style={{
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
            pointerEvents: 'none'
          }}
        >
          COSMIC
        </text>
        <text
          x="200"
          y="205"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-bold"
          fill="#d4af37"
          style={{
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
            pointerEvents: 'none'
          }}
        >
          AGES
        </text>
        
        {/* Core gradient definition */}
        <defs>
          <radialGradient id="coreGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="hsl(45, 80%, 65%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(45, 60%, 45%)" stopOpacity="0.8" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Enhanced styles for 3D stacked effect */}
      <style jsx>{`
        .stacked-disk {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stacked-disk:hover .main-disk {
          stroke-width: 2;
          filter: drop-shadow(0 6px 12px rgba(212, 175, 55, 0.4)) brightness(1.1);
        }
        
        .stacked-disk.selected .main-disk {
          filter: drop-shadow(0 8px 16px rgba(212, 175, 55, 0.6)) brightness(1.2);
        }
        
        .stacked-disk:hover {
          transform: translateY(-2px) scale(1.02);
        }
        
        .stacked-disk.selected {
          transform: translateY(-4px) scale(1.05);
        }
        
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        /* Responsive scaling */
        @media (max-width: 768px) {
          .stacked-disk-container {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};