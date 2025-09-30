import React from 'react';
import { AgeNode } from './AgeNode';
import { BookOverlay } from './BookOverlay';
import { useTimelineData } from '../hooks/useTimelineData';
import { useCosmicAnimation } from '../hooks/useCosmicAnimation';

export const RingDial: React.FC = () => {
  const { ages, books, loading } = useTimelineData();
  const { rotationAngle } = useCosmicAnimation();

  if (loading) {
    return (
      <div className="relative w-96 h-96 mx-auto flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-timeline-gold"></div>
        <p className="absolute mt-48 text-timeline-text">Loading cosmic data...</p>
      </div>
    );
  }

  return (
    <div className="relative w-96 h-96 mx-auto">
      <svg
        width="384"
        height="384"
        viewBox="0 0 384 384"
        className="cosmic-ring"
        style={{
          transform: `rotate(${rotationAngle}deg)`,
          filter: 'drop-shadow(0 0 20px var(--timeline-gold))'
        }}
      >
        {/* Background Cosmic Circles */}
        {Array.from({ length: 9 }).map((_, index) => (
          <circle
            key={`bg-ring-${index}`}
            cx="192"
            cy="192"
            r={40 + (index * 20)}
            fill="none"
            stroke="var(--timeline-gold)"
            strokeWidth="1"
            opacity={0.1 + (index * 0.05)}
          />
        ))}

        {/* Age Rings with Nodes */}
        {ages.map((age, index) => (
          <g key={age.id}>
            {/* Main Age Ring */}
            <circle
              cx="192"
              cy="192"
              r={60 + (index * 25)}
              fill="none"
              stroke="var(--timeline-gold)"
              strokeWidth="2"
              opacity="0.6"
              className="age-ring"
            />

            {/* Age Node */}
            <AgeNode
              age={age}
              radius={60 + (index * 25)}
              angle={index * 40} // Distribute evenly around circle
              index={index}
            />
          </g>
        ))}

        {/* Center Hub */}
        <circle
          cx="192"
          cy="192"
          r="30"
          fill="var(--timeline-gold)"
          opacity="0.8"
        />
        <circle
          cx="192"
          cy="192"
          r="20"
          fill="var(--timeline-bg)"
          stroke="var(--timeline-gold)"
          strokeWidth="2"
        />
        <text
          x="192"
          y="196"
          textAnchor="middle"
          className="fill-current text-timeline-text font-bold text-sm"
        >
          AXIS
        </text>
      </svg>

      {/* Book Overlay */}
      <BookOverlay books={books} />
    </div>
  );
};
