import React, { useState, useRef, useEffect } from 'react';
import { Age, TimelineEvent } from '../../../lib/api-timeline';
import { useTimelineData } from '../hooks/useTimelineData';
import { EventCard } from '../DetailPanels/EventCard';
import { LoadingSpinner } from '../../ui/LoadingSpinner';

interface LinearTimelinePanelProps {
  selectedAge?: Age | null;
  onAgeSelect?: (age: Age) => void;
  showAllAges?: boolean;
  className?: string;
}

export const LinearTimelinePanel: React.FC<LinearTimelinePanelProps> = ({
  selectedAge,
  onAgeSelect,
  showAllAges = false,
  className = ''
}) => {
  const { ages, loading } = useTimelineData();
  const [expandedAge, setExpandedAge] = useState<number | null>(selectedAge?.id || null);
  const [allEvents, setAllEvents] = useState<Record<number, TimelineEvent[]>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ageRefs = useRef<Record<number, HTMLDivElement>>({});

  useEffect(() => {
    if (selectedAge && ageRefs.current[selectedAge.id]) {
      ageRefs.current[selectedAge.id].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [selectedAge]);

  const handleAgeToggle = (age: Age) => {
    const isExpanding = expandedAge !== age.id;
    setExpandedAge(isExpanding ? age.id : null);
    
    if (onAgeSelect && isExpanding) {
      onAgeSelect(age);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <LoadingSpinner size="large" />
        <p className="ml-4 text-timeline-text/70">Loading timeline...</p>
      </div>
    );
  }

  const sortedAges = [...ages].sort((a, b) => {
    const aDate = new Date(a.startDate || '0');
    const bDate = new Date(b.startDate || '0');
    return aDate.getTime() - bDate.getTime();
  });

  return (
    <div className={`linear-timeline-container ${className}`}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-timeline-gold mb-3">
          Linear Timeline View
        </h2>
        <p className="text-timeline-text/70">
          Chronological journey through the ages of the Zoroasterverse
        </p>
      </div>

      {/* Timeline */}
      <div 
        ref={scrollContainerRef}
        className="relative max-w-4xl mx-auto"
      >
        {/* Main Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-timeline-gold via-timeline-gold/60 to-timeline-gold/20 rounded-full"></div>
        
        {/* Floating Timeline Progress */}
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
          <div className="bg-timeline-bg/90 backdrop-blur-sm border border-timeline-gold/30 rounded-lg p-3 max-w-xs">
            <div className="text-sm font-medium text-timeline-gold mb-2">Timeline Progress</div>
            <div className="space-y-1">
              {sortedAges.map((age, index) => {
                const isActive = expandedAge === age.id;
                const isSelected = selectedAge?.id === age.id;
                return (
                  <div 
                    key={age.id}
                    className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
                      isSelected ? 'bg-timeline-gold text-timeline-bg' :
                      isActive ? 'bg-timeline-gold/20 text-timeline-gold' :
                      'text-timeline-text/60 hover:text-timeline-gold'
                    }`}
                    onClick={() => {
                      if (ageRefs.current[age.id]) {
                        ageRefs.current[age.id].scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                  >
                    {age.title}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ages */}
        <div className="space-y-12">
          {sortedAges.map((age, index) => {
            const isExpanded = expandedAge === age.id;
            const isSelected = selectedAge?.id === age.id;
            
            return (
              <div 
                key={age.id}
                ref={el => {
                  if (el) ageRefs.current[age.id] = el;
                }}
                className="relative pl-20"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animation: 'slideInFromLeft 0.8s ease-out forwards'
                }}
              >
                {/* Age Node */}
                <div className={`
                  absolute left-4 top-6 w-8 h-8 rounded-full border-4 shadow-lg z-20 cursor-pointer
                  transition-all duration-300 hover:scale-110
                  ${isSelected ? 'bg-timeline-gold border-timeline-gold-light shadow-timeline-gold/50' :
                    isExpanded ? 'bg-timeline-gold/80 border-timeline-gold' :
                    'bg-timeline-bg border-timeline-gold/60 hover:border-timeline-gold'
                  }
                `}>
                  {/* Age Symbol or Number */}
                  <div className="w-full h-full flex items-center justify-center">
                    {age.symbol ? (
                      <span className="text-xs font-bold">{age.symbol}</span>
                    ) : (
                      <span className="text-xs font-bold text-timeline-gold">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Pulse effect for selected age */}
                  {isSelected && (
                    <div className="absolute -inset-2 rounded-full border-2 border-timeline-gold/30 animate-ping"></div>
                  )}
                </div>

                {/* Age Card */}
                <div 
                  className={`
                    age-card p-6 rounded-xl border transition-all duration-500 cursor-pointer
                    ${isSelected ? 'border-timeline-gold bg-timeline-gold/5 shadow-lg' :
                      isExpanded ? 'border-timeline-gold/40 bg-timeline-gold/5' :
                      'border-timeline-gold/20 bg-timeline-bg/50 hover:border-timeline-gold/40 hover:bg-timeline-gold/5'
                    }
                    backdrop-blur-sm
                  `}
                  onClick={() => handleAgeToggle(age)}
                >
                  {/* Age Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-2 transition-colors ${
                        isSelected || isExpanded ? 'text-timeline-gold' : 'text-timeline-text'
                      }`}>
                        {age.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-timeline-text/70 mb-3">
                        {age.dateRange && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {age.dateRange}
                          </span>
                        )}
                        {age.duration && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            </svg>
                            {age.duration}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-timeline-text/80 leading-relaxed">
                        {age.description}
                      </p>
                    </div>
                    
                    {/* Expand Indicator */}
                    <div className={`ml-4 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}>
                      <svg className="w-5 h-5 text-timeline-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Key Themes */}
                  {age.keyThemes && age.keyThemes.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {age.keyThemes.map((theme, themeIndex) => (
                          <span 
                            key={themeIndex}
                            className="px-3 py-1 bg-timeline-gold/10 border border-timeline-gold/30 rounded-full text-xs text-timeline-gold"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Events Count */}
                  <div className="text-sm text-timeline-text/60">
                    Click to {isExpanded ? 'collapse' : 'explore'} timeline events
                  </div>
                </div>

                {/* Expanded Events */}
                {isExpanded && (
                  <div className="mt-6 ml-8 pl-6 border-l-2 border-timeline-gold/20">
                    <h4 className="text-lg font-semibold text-timeline-gold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Timeline Events
                    </h4>
                    
                    {/* This would be populated with actual events */}
                    <div className="text-timeline-text/60 italic">
                      Events for {age.title} would be loaded here...
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};