import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import useTheme from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'compact';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' }
  ];

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center bg-card/50 backdrop-blur-sm rounded-lg p-1 border border-border/50 shadow-sm ${className}`}>
        {themes.map(({ value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`p-2 rounded-md text-sm font-medium transition-all duration-200 ${
              theme === value
                ? 'bg-primary/20 text-primary shadow-sm border border-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            title={`Switch to ${value} mode`}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center bg-card/70 backdrop-blur-sm rounded-lg p-1 border border-border/50 shadow-lg ${className}`}>
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            theme === value
              ? 'bg-primary/20 text-primary shadow-sm border border-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
          title={`Switch to ${label} mode`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;