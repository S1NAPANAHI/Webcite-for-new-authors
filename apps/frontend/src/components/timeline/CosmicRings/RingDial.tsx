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
      <div className={`relative w-96 h-96 mx-auto flex items-center justify-center ${className}`}>
        <div className="cosmic-loading-container">
          {/* Spinning Rings */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`loading-ring-${index}`}
              className="absolute border-2 border-timeline-gold/30 rounded-full"
              style={{
                width: `${120 + (index * 40)}px`,
                height: `${120 + (index * 40)}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `spin ${3 + index}s linear infinite ${index === 1 ? 'reverse' : ''}`,
                borderTopColor: index === 0 ? 'var(--timeline-gold)' : 'transparent'
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

  return (
    <div className={`relative w-96 h-96 mx-auto ${className}`}>
      <svg
        width="384"
        height="384"
        viewBox="0 0 384 384"
        className="cosmic-ring transition-transform duration-700 ease-out"
        style={{
          transform: `rotate(${rotationAngle}deg)`,
          filter: 'drop-shadow(0 0 20px rgba(var(--timeline-gold-rgb), 0.3))'
        }}
      >
        {/* Enhanced Background Cosmic Circles */}
        {Array.from({ length: 12 }).map((_, index) => {
          const radius = 30 + (index * 15);
          const opacity = 0.05 + (index * 0.02);
          const strokeWidth = index % 3 === 0 ? 2 : 1;
          
          return (
            <circle
              key={`bg-ring-${index}`}
              cx="192"
              cy="192"
              r={radius}
              fill="none"
              stroke="var(--timeline-gold)"
              strokeWidth={strokeWidth}
              opacity={opacity}
              strokeDasharray={index % 4 === 0 ? '5,5' : undefined}
            >
              {/* Subtle rotation animation for background rings */}
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`0 192 192;${index % 2 === 0 ? 360 : -360} 192 192`}
                dur={`${20 + (index * 2)}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Age Rings with Enhanced Styling */}
        {ages.map((age, index) => {
          const ringRadius = 80 + (index * 30);
          const angleStep = 360 / ages.length;
          const angle = index * angleStep;
          const isSelected = selectedAgeId === age.id;
          
          return (
            <g key={age.id}>
              {/* Main Age Ring */}
              <circle
                cx="192"
                cy="192"
                r={ringRadius}
                fill="none"
                stroke="var(--timeline-gold)"
                strokeWidth={isSelected ? "3" : "2"}
                opacity={isSelected ? "0.9" : "0.6"}
                className="age-ring transition-all duration-300"
                strokeDasharray={isSelected ? undefined : "10,5"}
              >
                {/* Pulse animation for selected ring */}
                {isSelected && (
                  <animate
                    attributeName="stroke-width"
                    values="3;5;3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
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
              
              {/* Age Label Arc Path (for curved text) */}
              <defs>
                <path
                  id={`age-path-${age.id}`}
                  d={`M ${192 + (ringRadius + 25) * Math.cos((angle - 30) * Math.PI / 180)} ${192 + (ringRadius + 25) * Math.sin((angle - 30) * Math.PI / 180)} A ${ringRadius + 25} ${ringRadius + 25} 0 0 1 ${192 + (ringRadius + 25) * Math.cos((angle + 30) * Math.PI / 180)} ${192 + (ringRadius + 25) * Math.sin((angle + 30) * Math.PI / 180)}`}
                />
              </defs>
              
              {/* Curved Age Title */}
              <text 
                className={`text-xs font-medium transition-all duration-300 ${
                  isSelected ? 'fill-timeline-gold' : 'fill-timeline-text/70'
                }`}
                textAnchor="middle"
              >
                <textPath 
                  href={`#age-path-${age.id}`} 
                  startOffset="50%"
                >
                  {age.title}
                </textPath>
              </text>
            </g>
          );
        })}

        {/* Enhanced Center Hub */}
        <g className="center-hub">
          {/* Outer glow ring */}
          <circle
            cx="192"
            cy="192"
            r="40"
            fill="none"
            stroke="var(--timeline-gold)"
            strokeWidth="1"
            opacity="0.3"
          >
            <animate
              attributeName="r"
              values="35;45;35"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Main hub */}
          <circle
            cx="192"
            cy="192"
            r="32"
            fill="var(--timeline-gold)"
            opacity="0.8"
          />
          
          {/* Inner circle */}
          <circle
            cx="192"
            cy="192"
            r="24"
            fill="var(--timeline-bg)"
            stroke="var(--timeline-gold)"
            strokeWidth="3"
          />
          
          {/* Center text */}
          <text
            x="192"
            y="190"
            textAnchor="middle"
            className="fill-current text-timeline-gold font-bold text-xs"
          >
            COSMIC
          </text>
          <text
            x="192"
            y="202"
            textAnchor="middle"
            className="fill-current text-timeline-gold font-bold text-xs"
          >
            AXIS
          </text>
        </g>
      </svg>

      {/* Book Overlay with enhanced positioning */}
      <BookOverlay books={books} selectedAgeId={selectedAgeId} />
      
      {/* Selection Indicator */}
      {selectedAgeId && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-80 h-80 border-2 border-timeline-gold/20 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Cosmic Particle Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={`particle-${index}`}
            className="absolute w-1 h-1 bg-timeline-gold rounded-full opacity-60"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 5}s`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite alternate`
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
            transform: translateY(-20px) scale(1.2);
            opacity: 0.2;
          }
        }
        
        .age-ring:hover {
          stroke-width: 3;
          opacity: 0.9;
        }
        
        .center-hub:hover circle {
          filter: drop-shadow(0 0 10px var(--timeline-gold));
        }
      `}</style>
    </div>
  );
};