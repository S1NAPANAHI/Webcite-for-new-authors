import React from 'react';
import { TimelineEvent } from '../../../lib/api-timeline';

interface EventCardProps {
  event: TimelineEvent;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const importanceColors = {
  major: {
    dot: 'bg-red-500 border-red-300',
    accent: 'border-red-500/30 bg-red-500/5',
    text: 'text-red-400'
  },
  medium: {
    dot: 'bg-timeline-gold border-timeline-gold-light',
    accent: 'border-timeline-gold/30 bg-timeline-gold/5',
    text: 'text-timeline-gold'
  },
  minor: {
    dot: 'bg-blue-400 border-blue-300',
    accent: 'border-blue-400/30 bg-blue-400/5',
    text: 'text-blue-300'
  }
};

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isSelected, 
  onSelect, 
  index 
}) => {
  const importance = event.importance || 'medium';
  const colors = importanceColors[importance];
  
  return (
    <div 
      className={`relative pl-20 pb-6 cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02] ${
        isSelected ? 'transform scale-[1.02]' : ''
      }`}
      onClick={onSelect}
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      {/* Timeline Dot */}
      <div className={`absolute left-6 top-2 w-4 h-4 rounded-full border-2 ${colors.dot} shadow-lg z-10`}>
        {importance === 'major' && (
          <div className="absolute -inset-1 rounded-full bg-red-500/20 animate-pulse"></div>
        )}
      </div>
      
      {/* Connection Line to Previous Event */}
      {index > 0 && (
        <div className="absolute left-8 -top-6 w-0.5 h-6 bg-gradient-to-b from-timeline-gold/50 to-transparent"></div>
      )}

      {/* Event Card */}
      <div className={`
        group relative p-5 rounded-xl border transition-all duration-300
        ${isSelected 
          ? `${colors.accent} shadow-lg border-2` 
          : 'bg-timeline-bg/30 border-timeline-gold/10 hover:bg-timeline-gold/5 hover:border-timeline-gold/20'
        }
        backdrop-blur-sm
      `}>
        
        {/* Importance Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
          importance === 'major' ? 'bg-red-500/20 text-red-400' :
          importance === 'medium' ? 'bg-timeline-gold/20 text-timeline-gold' :
          'bg-blue-400/20 text-blue-300'
        }`}>
          {importance.charAt(0).toUpperCase() + importance.slice(1)}
        </div>

        {/* Date */}
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 mr-2 text-timeline-gold/70" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <time className="text-sm font-medium text-timeline-gold/80">
            {event.date}
          </time>
        </div>

        {/* Title */}
        <h4 className={`text-lg font-semibold mb-2 group-hover:${colors.text} transition-colors duration-300`}>
          {event.title}
        </h4>

        {/* Description */}
        <p className="text-timeline-text/80 leading-relaxed mb-4">
          {event.description}
        </p>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {event.tags.map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className="px-2 py-1 bg-timeline-gold/10 text-timeline-gold/80 text-xs rounded border border-timeline-gold/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Characters Preview */}
        {event.characters && event.characters.length > 0 && (
          <div className="flex items-center space-x-2 mb-3">
            <svg className="w-4 h-4 text-timeline-text/60" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-sm text-timeline-text/60">
              {event.characters.length} character{event.characters.length !== 1 ? 's' : ''}
            </span>
            <div className="flex -space-x-1 ml-2">
              {event.characters.slice(0, 3).map((character, charIndex) => (
                <div 
                  key={charIndex}
                  className="w-6 h-6 rounded-full bg-timeline-gold/20 border border-timeline-gold/30 flex items-center justify-center text-xs font-medium text-timeline-gold"
                  title={character.name}
                >
                  {character.name.charAt(0)}
                </div>
              ))}
              {event.characters.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-timeline-text/20 border border-timeline-text/30 flex items-center justify-center text-xs font-medium text-timeline-text/70">
                  +{event.characters.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expand Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-timeline-text/60">
            {event.location && (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {event.location}
              </span>
            )}
            {event.duration && (
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {event.duration}
              </span>
            )}
          </div>
          
          <div className={`flex items-center text-xs ${colors.text} group-hover:translate-x-1 transition-transform duration-300`}>
            <span className="mr-1">Details</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Selection Glow Effect */}
        {isSelected && (
          <div className={`absolute inset-0 rounded-xl pointer-events-none opacity-20 ${colors.accent.split(' ')[1]}`}></div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};