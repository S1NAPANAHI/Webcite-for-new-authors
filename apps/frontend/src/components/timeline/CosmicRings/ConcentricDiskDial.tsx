import React from 'react';
import { useTimelineData } from '../hooks/useTimelineData';
import { useCosmicAnimation } from '../hooks/useCosmicAnimation';
import { Age } from '../../../lib/api-timeline';

interface ConcentricDiskDialProps {
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
    case 'sun':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L20 7L14.74 12.26L21 13.09L14.74 11.74L20 17L13.09 15.74L12 22L10.91 15.74L4 17L9.26 11.74L3 10.91L9.26 12.26L4 7L10.91 8.26L12 2Z"/>
        </svg>
      );
    case 'star':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z"/>
        </svg>
      );
    case 'moon':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4.74L13.5 1.75L14.56 4.74L17.75 4.09ZM21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11ZM18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23.54 8.5 23.54 4.59 19.07C.68 14.6.68 7.4 4.59 2.93C8.5-1.54 15.17-1.54 19.08 2.93C19.5 3.33 19.84 3.75 20.16 4.2C20.69 4.95 19.8 6.13 18.97 5.05C18.54 4.24 18.18 3.63 17.68 3.08C14.39-.22 9.61-.22 6.32 3.08C3.03 6.38 3.03 11.62 6.32 14.92C9.61 18.22 14.39 18.22 17.68 14.92C18.18 14.37 18.54 13.76 18.97 12.95V15.95Z"/>
        </svg>
      );
    default:
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
};

// Individual cosmic disk component
const CosmicDisk: React.FC<{
  age: Age;
  radius: number;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}> = ({ age, radius, isSelected, onClick, index }) => {
  const diskWidth = 28; // Thick disk bands
  const labelRadius = radius - 14; // Position text in middle of disk band
  
  // Age symbol mapping
  const getAgeSymbol = (ageTitle: string) => {
    if (ageTitle.toLowerCase().includes('five')) return 'temple';
    if (ageTitle.toLowerCase().includes('nine')) return 'sun';
    if (ageTitle.toLowerCase().includes('seven')) return 'star';
    if (ageTitle.toLowerCase().includes('three')) return 'moon';
    return 'sun';
  };

  return (
    <g 
      className={`cosmic-disk ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Main disk ring with thick stroke */}
      <circle
        cx="160"
        cy="160"
        r={radius}
        fill="none"
        stroke="rgba(212, 175, 55, 0.3)"
        strokeWidth={diskWidth}
        className="disk-ring"
        style={{
          transition: 'all 0.3s ease',
          strokeWidth: isSelected ? diskWidth + 4 : diskWidth
        }}
      />
      
      {/* Age label positioned on the disk */}
      <text
        x="160"
        y={160 - labelRadius + 6}
        textAnchor="middle"
        dominantBaseline="middle"
        className="age-label"
        fill={isSelected ? "#d4af37" : "rgba(212, 175, 55, 0.8)"}
        style={{
          fontSize: '11px',
          fontFamily: 'Cinzel, serif',
          fontWeight: 600,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          transition: 'all 0.3s ease'
        }}
      >
        {age.title}
      </text>
      
      {/* Age symbol positioned below text */}
      <g transform={`translate(160, ${160 - labelRadius + 20})`}>
        <foreignObject x="-8" y="-8" width="16" height="16">
          <div className="flex items-center justify-center">
            <AgeSymbol 
              type={getAgeSymbol(age.title)} 
              size={14}
            />
          </div>
        </foreignObject>
      </g>
      
      {/* Selection highlight ring */}
      {isSelected && (
        <circle
          cx="160"
          cy="160"
          r={radius}
          fill="none"
          stroke="rgba(212, 175, 55, 0.6)"
          strokeWidth="2"
          strokeDasharray="4,4"
          className="selection-ring"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;8"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      
      {/* Hover glow effect */}
      <circle
        cx="160"
        cy="160"
        r={radius}
        fill="none"
        stroke="rgba(212, 175, 55, 0)"
        strokeWidth={diskWidth + 8}
        className="hover-glow"
        style={{ transition: 'stroke 0.3s ease' }}
      />
    </g>
  );
};

export const ConcentricDiskDial: React.FC<ConcentricDiskDialProps> = ({ 
  onAgeSelect,
  selectedAgeId = null,
  className = ''
}) => {
  const { ages, loading } = useTimelineData();
  const { rotationAngle } = useCosmicAnimation();

  const handleAgeClick = (age: Age) => {
    if (onAgeSelect) {
      onAgeSelect(age);
    }
  };

  if (loading) {
    return (
      <div className={`relative w-80 h-80 mx-auto flex items-center justify-center ${className}`}>
        <div className="cosmic-loading-container">
          {/* Spinning disk layers for loading */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`loading-disk-${index}`}
              className="absolute border-8 border-timeline-gold/30 rounded-full"
              style={{
                width: `${120 + (index * 40)}px`,
                height: `${120 + (index * 40)}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `spin ${3 + index}s linear infinite ${index % 2 === 1 ? 'reverse' : ''}`,
                borderTopColor: 'var(--timeline-gold)',
                borderBottomColor: 'transparent'
              }}
            />
          ))}
          
          {/* Central loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-timeline-gold border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-timeline-text/70 text-sm animate-pulse">Loading cosmic disks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate disk radii for stacked concentric layers
  const diskRadii = ages.map((_, index) => {
    // Start from center and work outward
    return 60 + (index * 35); // 35px spacing between disk centers
  });

  return (
    <div className={`relative w-80 h-80 mx-auto ${className}`}>
      <svg
        width="320"
        height="320"
        viewBox="0 0 320 320"
        className="concentric-disks transition-transform duration-1000 ease-out"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.3))'
        }}
      >
        {/* Background cosmic atmosphere */}
        {Array.from({ length: 8 }).map((_, index) => {
          const radius = 40 + (index * 20);
          const opacity = 0.02 + (index * 0.008);
          
          return (
            <circle
              key={`atmosphere-${index}`}
              cx="160"
              cy="160"
              r={radius}
              fill="none"
              stroke="var(--timeline-gold)"
              strokeWidth="1"
              opacity={opacity}
              strokeDasharray={index % 2 === 0 ? '2,4' : undefined}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`0 160 160;${index % 2 === 0 ? 360 : -360} 160 160`}
                dur={`${40 + (index * 5)}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Concentric disk layers */}
        {ages.map((age, index) => {
          const radius = diskRadii[index];
          const isSelected = selectedAgeId === age.id;
          
          return (
            <CosmicDisk
              key={age.id}
              age={age}
              radius={radius}
              isSelected={isSelected}
              onClick={() => handleAgeClick(age)}
              index={index}
            />
          );
        })}

        {/* Enhanced center hub */}
        <g className="center-hub">
          {/* Central core */}
          <circle
            cx="160"
            cy="160"
            r="25"
            fill="var(--timeline-gold)"
            opacity="0.9"
          />
          
          {/* Inner circle */}
          <circle
            cx="160"
            cy="160"
            r="18"
            fill="var(--timeline-bg)"
            stroke="var(--timeline-gold)"
            strokeWidth="2"
          />
          
          {/* Center text */}
          <text
            x="160"
            y="155"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-current text-timeline-gold font-bold text-xs"
          >
            COSMIC
          </text>
          <text
            x="160"
            y="168"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-current text-timeline-gold font-bold text-xs"
          >
            AGES
          </text>
        </g>

        {/* Subtle constellation dots */}
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (index * 60) * Math.PI / 180;
          const radius = 200 + Math.random() * 15;
          const x = 160 + radius * Math.cos(angle);
          const y = 160 + radius * Math.sin(angle);
          
          return (
            <circle
              key={`star-${index}`}
              cx={x}
              cy={y}
              r="1.5"
              fill="var(--timeline-gold)"
              opacity="0.5"
            >
              <animate
                attributeName="opacity"
                values="0.2;0.7;0.2"
                dur={`${3 + Math.random() * 4}s`}
                repeatCount="indefinite"
                begin={`${Math.random() * 3}s`}
              />
            </circle>
          );
        })}
      </svg>

      {/* Enhanced CSS for disk interactions */}
      <style jsx>{`
        .cosmic-disk .disk-ring:hover {
          stroke: rgba(212, 175, 55, 0.5) !important;
          stroke-width: 32 !important;
          filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
        }
        
        .cosmic-disk.selected .disk-ring {
          stroke: rgba(212, 175, 55, 0.8) !important;
          filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.6));
        }
        
        .cosmic-disk.selected .age-label {
          font-weight: 700;
          font-size: 12px;
        }
        
        .cosmic-disk .hover-glow:hover {
          stroke: rgba(212, 175, 55, 0.2);
        }
        
        .center-hub:hover circle {
          filter: drop-shadow(0 0 15px var(--timeline-gold));
        }
        
        .age-symbol {
          color: rgba(212, 175, 55, 0.8);
          transition: color 0.3s ease;
        }
        
        .cosmic-disk.selected .age-symbol {
          color: #d4af37;
        }
        
        .cosmic-disk:hover .age-symbol {
          color: rgba(212, 175, 55, 0.9);
        }
        
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
