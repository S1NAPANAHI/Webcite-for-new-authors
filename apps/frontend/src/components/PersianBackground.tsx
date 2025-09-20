import React, { useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import './PersianBackground.css';

interface PersianBackgroundProps {
  className?: string;
  animated?: boolean;
  premium?: boolean;
}

const PersianBackground: React.FC<PersianBackgroundProps> = ({ 
  className = '', 
  animated = true,
  premium = false
}) => {
  const { isDark } = useTheme();

  useEffect(() => {
    // Apply Persian background styles to body
    const body = document.body;
    
    // Add Persian background classes
    body.classList.add('persian-background');
    
    if (animated) {
      body.classList.add('persian-animated');
    }
    
    if (premium) {
      body.classList.add('persian-background-premium');
    }
    
    // Cleanup function
    return () => {
      body.classList.remove('persian-background', 'persian-animated', 'persian-background-premium');
    };
  }, [animated, premium]);

  // Parallax effect for the pattern overlay
  useEffect(() => {
    if (!animated) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.05; // Subtle parallax effect
      const patternOverlay = document.querySelector('.persian-pattern-overlay') as HTMLElement;
      
      if (patternOverlay) {
        patternOverlay.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animated]);

  return (
    <>
      {/* Pattern overlay for subtle movement */}
      <div 
        className={`persian-pattern-overlay fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 ${
          isDark ? 'opacity-40' : 'opacity-30'
        } ${className}`}
        style={{
          backgroundImage: isDark 
            ? `url('/patterns/persian-dark.svg')` 
            : `url('/patterns/persian-light.svg')`,
          backgroundSize: '600px 600px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          mixBlendMode: isDark ? 'screen' : 'multiply',
        }}
      />
      
      {/* Cosmic particle overlay for enhanced sci-fi feel */}
      {animated && (
        <div className="cosmic-particles fixed inset-0 pointer-events-none z-5">
          {/* Subtle floating particles */}
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
          <div className="particle particle-4" />
          <div className="particle particle-5" />
        </div>
      )}
      
      {/* CSS-only animated gradient overlay */}
      <div 
        className={`cosmic-gradient-overlay fixed inset-0 pointer-events-none z-1 ${
          animated ? 'animate-cosmic-shift' : ''
        }`}
        style={{
          background: isDark
            ? `radial-gradient(
                ellipse at 20% 30%,
                rgba(106, 17, 203, 0.08) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse at 80% 70%,
                rgba(255, 215, 0, 0.06) 0%,
                transparent 50%
              )`
            : `radial-gradient(
                ellipse at 30% 20%,
                rgba(212, 175, 55, 0.04) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse at 70% 80%,
                rgba(32, 178, 170, 0.03) 0%,
                transparent 50%
              )`
        }}
      />
    </>
  );
};

export default PersianBackground;