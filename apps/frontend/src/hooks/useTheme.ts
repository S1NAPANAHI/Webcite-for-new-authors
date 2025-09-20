import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if user has a saved preference
    const saved = localStorage.getItem('zoroasterverse-theme');
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
      return saved as Theme;
    }
    return 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      // Remove manual theme attribute to let CSS media queries work
      root.removeAttribute('data-theme');
    } else {
      // Set manual theme
      root.setAttribute('data-theme', theme);
    }
    
    // Save preference
    localStorage.setItem('zoroasterverse-theme', theme);
  }, [theme]);

  // Get the actual resolved theme (useful for UI elements)
  const getResolvedTheme = (): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  return {
    theme,
    setTheme,
    resolvedTheme: getResolvedTheme(),
    isDark: getResolvedTheme() === 'dark'
  };
}