import React, { useEffect } from 'react';
import useTheme from '../hooks/useTheme';

interface CleanBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Clean, elegant background component with subtle sci-fi elements.
 * Replaces the old Persian background system with a minimal, readable approach.
 */
const CleanBackground: React.FC<CleanBackgroundProps> = ({ 
  children, 
  className = '' 
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Ensure the theme is properly applied to the document
    const root = document.documentElement;
    
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else if (theme) {
      root.setAttribute('data-theme', theme);
    }
    
    // Apply dark class for Tailwind
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, resolvedTheme]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen relative ${className}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolvedTheme === 'dark' ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="hidden sm:inline">Light</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span className="hidden sm:inline">Dark</span>
          </>
        )}
      </button>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CleanBackground;