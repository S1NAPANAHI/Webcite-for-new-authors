import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Crown,
  Zap,
  Heart,
  Users,
  BookOpen,
  Star,
  ChevronRight,
  Eye,
  Shield
} from 'lucide-react';
import { Character } from '../../types/character';
import {
  getCharacterTypeConfig,
  getCharacterStatusConfig,
  getPowerLevelConfig,
  getCharacterDisplayName,
  getCharacterShortDescription,
  getCharacterImportanceTier,
  generateCharacterColorTheme
} from '../../utils/characterUtils';

interface CharacterCardHorizontalProps {
  character: Character;
  onClick?: (character: Character) => void;
  className?: string;
}

const CharacterCardHorizontal: React.FC<CharacterCardHorizontalProps> = ({
  character,
  onClick,
  className = ''
}) => {
  const portraitUrl = character.portrait_url;
  
  const typeConfig = getCharacterTypeConfig(character.character_type);
  const statusConfig = getCharacterStatusConfig(character.status);
  const powerConfig = getPowerLevelConfig(character.power_level);
  const importanceTier = getCharacterImportanceTier(character.importance_score);
  const displayName = getCharacterDisplayName(character);
  const shortDescription = getCharacterShortDescription(character, 150);
  const colorTheme = generateCharacterColorTheme(character);

  const handleClick = () => {
    if (onClick) {
      onClick(character);
    }
  };

  const CardContent = () => (
    <div className="flex items-center gap-6 p-6">
      {/* Circular Character Portrait */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border">
          {portraitUrl ? (
            <img 
              src={portraitUrl} 
              alt={character.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  container.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br rounded-full" style="background: linear-gradient(135deg, ${colorTheme}20, ${colorTheme}10)">
                      <svg class="w-8 h-8 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center bg-gradient-to-br rounded-full" 
              style={{ background: `linear-gradient(135deg, ${colorTheme}20, ${colorTheme}10)` }}
            >
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
        
        {/* Status Indicator */}
        <div 
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-xs"
          style={{ backgroundColor: statusConfig.color }}
          title={`Status: ${statusConfig.label}`}
        >
          <span className="text-white text-xs">{statusConfig.icon}</span>
        </div>
        
        {/* Importance Tier Badge */}
        {character.importance_score > 50 && (
          <div 
            className="absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center"
            style={{ backgroundColor: importanceTier.color }}
            title={`Importance: ${importanceTier.label}`}
          >
            {character.importance_score >= 90 && <Crown className="w-3 h-3 text-white" />}
            {character.importance_score >= 75 && character.importance_score < 90 && <Star className="w-3 h-3 text-white" />}
            {character.importance_score >= 50 && character.importance_score < 75 && <Shield className="w-3 h-3 text-white" />}
          </div>
        )}
      </div>
      
      {/* Character Information - Horizontal Layout */}
      <div className="flex-1 min-w-0">
        {/* Name & Badges Row */}
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
            {displayName}
          </h3>
          
          {/* Character Type Badge */}
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white flex-shrink-0"
            style={{ backgroundColor: typeConfig.color }}
          >
            <span className="mr-1">{typeConfig.icon}</span>
            {typeConfig.label}
          </span>
          
          {/* Power Level Badge */}
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white flex-shrink-0"
            style={{ backgroundColor: powerConfig.color }}
          >
            <Zap className="w-3 h-3 mr-1" />
            {powerConfig.label}
          </span>
          
          {/* POV Character Indicator */}
          {character.is_pov_character && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-medium flex-shrink-0" title="Point of View Character">
              <Eye className="w-3 h-3" />
              <span>POV</span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {shortDescription}
        </p>
        
        {/* Stats Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {/* Relationships Count */}
            {character.relationship_count !== undefined && character.relationship_count > 0 && (
              <div className="flex items-center gap-1" title="Relationships">
                <Users className="w-4 h-4" />
                <span>{character.relationship_count}</span>
              </div>
            )}
            
            {/* Appearances Count */}
            {character.appearance_count !== undefined && character.appearance_count > 0 && (
              <div className="flex items-center gap-1" title="Appearances">
                <BookOpen className="w-4 h-4" />
                <span>{character.appearance_count}</span>
              </div>
            )}
            
            {/* Importance Score */}
            <div className="flex items-center gap-1" title="Importance Score">
              <Star className="w-4 h-4" />
              <span>{character.importance_score}</span>
            </div>
          </div>
          
          {/* Action Indicator */}
          {onClick && (
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
          )}
        </div>
      </div>
    </div>
  );

  // Render as Link if no custom onClick handler
  if (!onClick) {
    return (
      <Link 
        to={`/characters/${character.slug}`}
        className={`
          group block bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-lg 
          transition-all duration-200 overflow-hidden
          ${className}
        `}
      >
        <CardContent />
      </Link>
    );
  }

  // Render as clickable div
  return (
    <div 
      onClick={handleClick}
      className={`
        group cursor-pointer bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-lg 
        transition-all duration-200 overflow-hidden
        ${className}
      `}
    >
      <CardContent />
    </div>
  );
};

export default CharacterCardHorizontal;