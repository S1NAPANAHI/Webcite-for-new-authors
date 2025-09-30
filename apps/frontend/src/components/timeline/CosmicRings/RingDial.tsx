import React from 'react';
import { AgeNode } from './AgeNode';
import { BookOverlay } from './BookOverlay';
import { useTimelineData } from '../hooks/useTimelineData';
import { useCosmicAnimation } from '../hooks/useCosmicAnimation';
import { Age } from '../../../lib/api-timeline';

interface RingDialProps {
  onAgeSelect?: (age: Age) => void;
  selectedAgeId?: number | null;
  className?: string;
}

export const RingDial: React.FC<RingDialProps> = ({ 
  onAgeSelect,
  selectedAgeId = null,
  className = ''
}) => {
  const { ages, books, loading } = useTimelineData();
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
          {/* Spinning Rings */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`loading-ring-${index}`}
              className="absolute border-2 border-timeline-gold/30 rounded-full"
              style={{
                width: `${80 + (index * 50)}px`,
                height: `${80 + (index * 50)}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `spin ${2 + index}s linear infinite ${index % 2 === 1 ? 'reverse' : ''}`,
                borderTopColor: index % 2 === 0 ? 'var(--timeline-gold)' : 'transparent',
                borderRightColor: index % 2 === 1 ? 'var(--timeline-gold)' : 'transparent'
              }}
            />
          ))}
          
          {/* Central Loading Indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-timeline-gold border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-timeline-text/70 text-sm animate-pulse">Loading cosmic data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate ring positions for better distribution
  const ringConfig = [
    { radius: 60, opacity: 0.8, strokeWidth: 3 },   // Innermost ring
    { radius: 90, opacity: 0.7, strokeWidth: 2 },   // Second ring  
    { radius: 120, opacity: 0.6, strokeWidth: 2 },  // Third ring
    { radius: 150, opacity: 0.5, strokeWidth: 1 },  // Outermost ring
  ];

  return (
    <div className={`relative w-80 h-80 mx-auto ${className}`}>
      <svg
        width="320"
        height="320"
        viewBox="0 0 320 320"
        className="cosmic-ring transition-transform duration-1000 ease-out"
        style={{
          transform: `rotate(${rotationAngle}deg)`,
          filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.3))'
        }}
      >
        {/* Enhanced Background Cosmic Circles - More rings for fuller look */}
        {Array.from({ length: 16 }).map((_, index) => {
          const radius = 20 + (index * 10);
          const opacity = 0.03 + (index * 0.015);
          const strokeWidth = index % 4 === 0 ? 2 : 1;
          const isDashed = index % 3 === 0;
          
          return (
            <circle
              key={`bg-ring-${index}`}
              cx="160"
              cy="160"
              r={radius}
              fill="none"
              stroke="var(--timeline-gold)"
              strokeWidth={strokeWidth}
              opacity={opacity}
              strokeDasharray={isDashed ? '3,3' : undefined}
            >
              {/* Subtle rotation animation for background rings */}
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`0 160 160;${index % 2 === 0 ? 360 : -360} 160 160`}
                dur={`${30 + (index * 3)}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Main Age Rings */}
        {ages.map((age, index) => {
          const config = ringConfig[index % ringConfig.length];
          const ringRadius = config.radius;
          const angleStep = 360 / ages.length;
          const angle = index * angleStep;
          const isSelected = selectedAgeId === age.id;
          
          return (
            <g key={age.id}>
              {/* Main Age Ring */}
              <circle
                cx="160"
                cy="160"
                r={ringRadius}
                fill="none"
                stroke="var(--timeline-gold)"
                strokeWidth={isSelected ? config.strokeWidth + 1 : config.strokeWidth}
                opacity={isSelected ? config.opacity + 0.3 : config.opacity}
                className="age-ring transition-all duration-500 cursor-pointer"
                strokeDasharray={isSelected ? undefined : "8,4"}
                onClick={() => handleAgeClick(age)}
              >
                {/* Pulse animation for selected ring */}
                {isSelected && (
                  <>
                    <animate
                      attributeName="stroke-width"
                      values={`${config.strokeWidth + 1};${config.strokeWidth + 3};${config.strokeWidth + 1}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values={`${config.opacity + 0.3};${config.opacity + 0.6};${config.opacity + 0.3}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </>
                )}
              </circle>

              {/* Age Node */}
              <AgeNode
                age={age}
                radius={ringRadius}
                angle={angle}
                index={index}
                isSelected={isSelected}
                onClick={() => handleAgeClick(age)}
              />
              
              {/* Age Label - Positioned around the ring */}
              <text 
                x={160 + (ringRadius + 20) * Math.cos((angle - 90) * Math.PI / 180)}
                y={160 + (ringRadius + 20) * Math.sin((angle - 90) * Math.PI / 180)}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-xs font-medium transition-all duration-300 cursor-pointer ${
                  isSelected ? 'fill-timeline-gold font-bold' : 'fill-timeline-text/70'
                }`}
                onClick={() => handleAgeClick(age)}
                transform={`rotate(${angle < 180 ? 0 : 180}, ${160 + (ringRadius + 20) * Math.cos((angle - 90) * Math.PI / 180)}, ${160 + (ringRadius + 20) * Math.sin((angle - 90) * Math.PI / 180)})`}
              >
                {age.title}
              </text>
              
              {/* Selected Age Highlight Ring */}
              {isSelected && (
                <circle
                  cx="160"
                  cy="160"
                  r={ringRadius + 8}
                  fill="none"
                  stroke="var(--timeline-gold)"
                  strokeWidth="1"
                  opacity="0.4"
                  strokeDasharray="2,2"
                >
                  <animate
                    attributeName="r"
                    values={`${ringRadius + 8};${ringRadius + 12};${ringRadius + 8}`}
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Enhanced Center Hub */}
        <g className="center-hub">
          {/* Outer glow rings */}
          {Array.from({ length: 3 }).map((_, index) => (
            <circle
              key={`glow-${index}`}
              cx="160"
              cy="160"
              r={30 + (index * 8)}
              fill="none"
              stroke="var(--timeline-gold)"
              strokeWidth="1"
              opacity={0.2 - (index * 0.05)}
            >
              <animate
                attributeName="r"
                values={`${30 + (index * 8)};${35 + (index * 8)};${30 + (index * 8)}`}
                dur={`${3 + index}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
          
          {/* Main hub */}
          <circle
            cx="160"
            cy="160"
            r="28"
            fill="var(--timeline-gold)"
            opacity="0.9"
          />
          
          {/* Inner circle */}
          <circle
            cx="160"
            cy="160"
            r="20"
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
            AXIS
          </text>
        </g>

        {/* Constellation Dots - Random cosmic dots */}
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 30) * Math.PI / 180;
          const radius = 180 + Math.random() * 20;
          const x = 160 + radius * Math.cos(angle);
          const y = 160 + radius * Math.sin(angle);
          
          return (
            <circle
              key={`constellation-${index}`}
              cx={x}
              cy={y}
              r="1"
              fill="var(--timeline-gold)"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur={`${2 + Math.random() * 3}s`}
                repeatCount="indefinite"
                begin={`${Math.random() * 2}s`}
              />
            </circle>
          );
        })}
      </svg>

      {/* Book Overlay with enhanced positioning */}
      <BookOverlay books={books} selectedAgeId={selectedAgeId} />      

      {/* Cosmic Particle Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`particle-${index}`}
            className="absolute w-1 h-1 bg-timeline-gold rounded-full opacity-60"
            style={{
              left: `${25 + Math.random() * 50}%`,
              top: `${25 + Math.random() * 50}%`,
              animationDelay: `${Math.random() * 5}s`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes float {
          from {
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          to {
            transform: translateY(-15px) scale(1.1);
            opacity: 0.2;
          }
        }
        
        .age-ring:hover {
          stroke-width: 4;
          opacity: 0.9;
        }
        
        .center-hub:hover circle {
          filter: drop-shadow(0 0 15px var(--timeline-gold));
        }
        
        .cosmic-ring {
          overflow: visible;
        }
      `}</style>
    </div>
  );
};