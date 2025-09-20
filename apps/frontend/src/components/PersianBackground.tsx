import React, { useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import './PersianBackground.css';

interface PersianBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Clean, elegant background component that replaces busy patterns
 * with sophisticated gradients and subtle geometric elements.
 * 
 * Features:
 * - Atmospheric gradients with sci-fi/fantasy mood
 * - Subtle star and geometric patterns
 * - Smooth theme transitions
 * - Performance optimized
 * - Accessibility friendly
 */
const PersianBackground: React.FC<PersianBackgroundProps> = ({ 
  className = '', 
  children 
}) => {
  const { isDark, theme } = useTheme();

  useEffect(() => {
    // Apply theme classes to document root for CSS targeting
    const root = document.documentElement;
    
    // Ensure data-theme attribute is set for CSS targeting
    if (theme) {
      root.setAttribute('data-theme', theme);
    }
    
    // Add elegant background class
    document.body.classList.add('elegant-background');
    
    return () => {
      document.body.classList.remove('elegant-background');
    };
  }, [theme]);

  return (
    <div className={`elegant-background-wrapper ${className}`}>
      {/* Main content with backdrop blur */}
      <div className="main-content">
        {children}
      </div>
      
      {/* Optional atmospheric overlay for extra depth */}
      <div 
        className="atmospheric-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: -1,
          background: isDark 
            ? 'radial-gradient(circle at 30% 70%, rgba(192, 160, 98, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 70% 30%, rgba(184, 134, 11, 0.03) 0%, transparent 50%)',
          opacity: 0.6,
          transition: 'all 0.6s ease'
        }}
      />
    </div>
  );
};

export default PersianBackground;