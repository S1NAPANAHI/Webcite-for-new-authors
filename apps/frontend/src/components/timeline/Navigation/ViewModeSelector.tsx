import React from 'react';
import { ViewMode } from '../EnhancedCosmicTimeline';

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  disabled?: boolean;
}

const modeConfig = {
  cosmic: {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2L3 7v11a1 1 0 001 1h3v-8a1 1 0 011-1h4a1 1 0 011 1v8h3a1 1 0 001-1V7l-7-5z" />
      </svg>
    ),
    label: 'Cosmic',
    description: 'Circular cosmic view'
  },
  hybrid: {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      </svg>
    ),
    label: 'Hybrid',
    description: 'Cosmic + detailed timeline'
  },
  linear: {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
    label: 'Linear',
    description: 'Traditional horizontal timeline'
  }
};

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ 
  currentMode, 
  onModeChange, 
  disabled = false 
}) => {
  return (
    <div className="flex items-center bg-timeline-bg/80 backdrop-blur-xl border border-timeline-gold/30 rounded-lg p-1 shadow-lg">
      {Object.entries(modeConfig).map(([mode, config]) => {
        const isActive = currentMode === mode;
        const isDisabled = disabled && mode !== 'cosmic';
        
        return (
          <button
            key={mode}
            onClick={() => !isDisabled && onModeChange(mode as ViewMode)}
            disabled={isDisabled}
            className={`
              relative flex items-center space-x-2 px-3 py-2 rounded transition-all duration-300
              ${isActive 
                ? 'bg-timeline-gold text-timeline-bg shadow-md' 
                : isDisabled
                ? 'text-timeline-text/30 cursor-not-allowed'
                : 'text-timeline-text/70 hover:text-timeline-gold hover:bg-timeline-gold/10'
              }
              ${!isDisabled ? 'hover:scale-105 active:scale-95' : ''}
            `}
            title={isDisabled ? 'Select an age first' : config.description}
          >
            <div className={`transition-transform duration-300 ${
              isActive ? 'scale-110' : 'group-hover:scale-105'
            }`}>
              {config.icon}
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              {config.label}
            </span>
            
            {isActive && (
              <div className="absolute inset-0 rounded bg-timeline-gold/20 animate-pulse"></div>
            )}
          </button>
        );
      })}
      
      {/* Mode Indicator */}
      <div className="ml-2 px-2 py-1 bg-timeline-gold/10 rounded text-xs text-timeline-gold hidden md:block">
        {modeConfig[currentMode].label}
      </div>
    </div>
  );
};

// Optional: Keyboard shortcut support
export const useViewModeShortcuts = (
  onModeChange: (mode: ViewMode) => void,
  disabled: boolean = false
) => {
  React.useEffect(() => {
    if (disabled) return;
    
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            onModeChange('cosmic');
            break;
          case '2':
            event.preventDefault();
            onModeChange('hybrid');
            break;
          case '3':
            event.preventDefault();
            onModeChange('linear');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onModeChange, disabled]);
};