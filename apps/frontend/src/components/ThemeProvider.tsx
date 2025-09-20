import React, { useEffect } from 'react';
import useTheme from '../hooks/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Global Theme Provider that handles theme switching for the entire app.
 * Provides a single theme toggle button and ensures all content is properly themed.
 */
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Apply theme to document root for global CSS variables
    const root = document.documentElement;
    
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    
    // Apply dark class for Tailwind compatibility
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
    <>
      {/* Single Global Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolvedTheme === 'dark' ? (
          <>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Light</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span>Dark</span>
          </>
        )}
      </button>
      
      {/* All content gets proper theming automatically via CSS */}
      <div className="min-h-screen">
        {children}
      </div>
    </>
  );
};

export default ThemeProvider;