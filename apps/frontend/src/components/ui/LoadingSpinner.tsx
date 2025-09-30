import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  color?: 'primary' | 'gold' | 'white';
}

const sizeClasses = {
  small: 'w-4 h-4',
  medium: 'w-8 h-8', 
  large: 'w-12 h-12'
};

const colorClasses = {
  primary: 'border-primary border-t-transparent',
  gold: 'border-timeline-gold border-t-transparent',
  white: 'border-white border-t-transparent'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  className = '',
  color = 'gold'
}) => {
  return (
    <div 
      className={`
        animate-spin rounded-full border-2 
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Alternative cosmic-themed spinner
export const CosmicSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  className = ''
}) => {
  const dimensions = {
    small: { outer: 16, inner: 12 },
    medium: { outer: 32, inner: 24 },
    large: { outer: 48, inner: 36 }
  };
  
  const { outer, inner } = dimensions[size];
  
  return (
    <div className={`relative ${className}`} style={{ width: outer, height: outer }}>
      {/* Outer ring */}
      <div 
        className="absolute border-2 border-timeline-gold/30 border-t-timeline-gold rounded-full animate-spin"
        style={{ width: outer, height: outer }}
      />
      
      {/* Inner ring - spinning opposite direction */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-timeline-gold/50 border-b-transparent rounded-full"
        style={{ 
          width: inner, 
          height: inner,
          animation: 'spin 1s linear infinite reverse'
        }}
      />
      
      {/* Center dot */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-timeline-gold rounded-full animate-pulse"
      />
    </div>
  );
};