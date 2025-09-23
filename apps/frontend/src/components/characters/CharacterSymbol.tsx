import React from 'react';

interface CharacterSymbolProps {
  type: string;
  powerLevel: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const CharacterSymbol: React.FC<CharacterSymbolProps> = ({ 
  type, 
  powerLevel, 
  size = 'medium', 
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-8 h-8';
      case 'large': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const getSymbolPath = (characterType: string, power: string) => {
    // Base symbol shapes based on character type
    const symbols = {
      protagonist: {
        mortal: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        enhanced: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        supernatural: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        divine: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        cosmic: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        omnipotent: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
      },
      antagonist: {
        mortal: 'M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.09 2.16-.33 3.16-.75C15.26 26.5 16.74 26 18 26c5.16-1 9-5.45 9-11V7l-10-5z',
        enhanced: 'M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.09 2.16-.33 3.16-.75C15.26 26.5 16.74 26 18 26c5.16-1 9-5.45 9-11V7l-10-5z',
        supernatural: 'M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.09 2.16-.33 3.16-.75C15.26 26.5 16.74 26 18 26c5.16-1 9-5.45 9-11V7l-10-5z',
        divine: 'M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.09 2.16-.33 3.16-.75C15.26 26.5 16.74 26 18 26c5.16-1 9-5.45 9-11V7l-10-5z',
        cosmic: 'M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.09 2.16-.33 3.16-.75C15.26 26.5 16.74 26 18 26c5.16-1 9-5.45 9-11V7l-10-5z',
        omnipotent: 'M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.09 2.16-.33 3.16-.75C15.26 26.5 16.74 26 18 26c5.16-1 9-5.45 9-11V7l-10-5z'
      },
      supporting: {
        mortal: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z',
        enhanced: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z',
        supernatural: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z',
        divine: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z',
        cosmic: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z',
        omnipotent: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z'
      },
      minor: {
        mortal: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        enhanced: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        supernatural: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        divine: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        cosmic: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        omnipotent: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
      },
      mentor: {
        mortal: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z',
        enhanced: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z',
        supernatural: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z',
        divine: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z',
        cosmic: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z',
        omnipotent: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z'
      },
      villain: {
        mortal: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z',
        enhanced: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z',
        supernatural: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z',
        divine: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z',
        cosmic: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z',
        omnipotent: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z'
      }
    };

    // Fallback to protagonist symbol if type not found
    const typeSymbols = symbols[type as keyof typeof symbols] || symbols.protagonist;
    return typeSymbols[powerLevel as keyof typeof typeSymbols] || typeSymbols.mortal;
  };

  const getGradientColors = (power: string) => {
    switch (power) {
      case 'divine':
        return { from: '#fbbf24', to: '#f59e0b', glow: '#fbbf24' }; // Golden
      case 'cosmic':
        return { from: '#a855f7', to: '#7c3aed', glow: '#a855f7' }; // Purple
      case 'omnipotent':
        return { from: '#ffffff', to: '#e5e7eb', glow: '#ffffff' }; // White
      case 'supernatural':
        return { from: '#3b82f6', to: '#1d4ed8', glow: '#3b82f6' }; // Blue
      case 'enhanced':
        return { from: '#10b981', to: '#059669', glow: '#10b981' }; // Green
      default:
        return { from: '#6b7280', to: '#4b5563', glow: '#6b7280' }; // Gray
    }
  };

  const symbolPath = getSymbolPath(type, powerLevel);
  const colors = getGradientColors(powerLevel);
  const gradientId = `gradient-${type}-${powerLevel}-${Math.random().toString(36).substr(2, 9)}`;
  const glowId = `glow-${type}-${powerLevel}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`relative ${getSizeClasses()} ${className}`}>
      {/* Background Circle */}
      <div className="absolute inset-0 rounded-full bg-gray-800 border border-gray-700"></div>
      
      {/* Symbol */}
      <svg
        className="absolute inset-0 w-full h-full p-2"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient Definition */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
          
          {/* Glow Filter */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Symbol Path */}
        <path
          d={symbolPath}
          fill={`url(#${gradientId})`}
          filter={`url(#${glowId})`}
          className="drop-shadow-sm"
        />
      </svg>
      
      {/* Animated Ring for Divine/Cosmic/Omnipotent */}
      {(['divine', 'cosmic', 'omnipotent'].includes(powerLevel)) && (
        <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-current opacity-60" style={{ color: colors.glow }}></div>
        </div>
      )}
      
      {/* Power Level Indicator Dots */}
      <div className="absolute -bottom-1 -right-1 flex space-x-0.5">
        {Array.from({ length: getPowerDots(powerLevel) }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ 
              backgroundColor: colors.glow,
              animationDelay: `${i * 0.2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Helper function to determine number of power indicator dots
const getPowerDots = (powerLevel: string): number => {
  switch (powerLevel) {
    case 'omnipotent': return 6;
    case 'cosmic': return 5;
    case 'divine': return 4;
    case 'supernatural': return 3;
    case 'enhanced': return 2;
    default: return 1; // mortal
  }
};

export default CharacterSymbol;