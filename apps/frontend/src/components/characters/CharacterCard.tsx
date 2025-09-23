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
// Note: useFileUrl would be imported here when file system is ready
// import { useFileUrl } from '../../utils/fileUrls';

interface CharacterCardProps {
  character: Character;
  variant?: 'default' | 'compact' | 'detailed';
  showRelationships?: boolean;
  showAppearances?: boolean;
  onClick?: (character: Character) => void;
  className?: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  variant = 'default',
  showRelationships = true,
  showAppearances = true,
  onClick,
  className = ''
}) => {
  // TODO: Use actual file URL when file system is integrated
  // const portraitUrl = useFileUrl(character.portrait_file_id);
  const portraitUrl = character.portrait_url; // Fallback to direct URL for now
  
  const typeConfig = getCharacterTypeConfig(character.character_type);
  const statusConfig = getCharacterStatusConfig(character.status);
  const powerConfig = getPowerLevelConfig(character.power_level);
  const importanceTier = getCharacterImportanceTier(character.importance_score);
  const displayName = getCharacterDisplayName(character);
  const shortDescription = getCharacterShortDescription(character, variant === 'compact' ? 60 : 120);
  const colorTheme = generateCharacterColorTheme(character);

  const handleClick = () => {
    if (onClick) {
      onClick(character);
    }
  };

  const CardContent = () => (
    <>
      {/* Character Portrait & Status Indicator */}
      <div className="relative">
        <div className={`
          ${variant === 'compact' ? 'w-16 h-16' : variant === 'detailed' ? 'w-24 h-24' : 'w-20 h-20'} 
          rounded-lg overflow-hidden bg-muted flex items-center justify-center
        `}>
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
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br" style="background: linear-gradient(135deg, ${colorTheme}20, ${colorTheme}10)">
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
              className="w-full h-full flex items-center justify-center bg-gradient-to-br" 
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
      
      {/* Character Info */}
      <div className="flex-1 min-w-0">
        {/* Name & Title */}
        <div className="mb-2">
          <h3 className={`
            font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate
            ${variant === 'compact' ? 'text-sm' : variant === 'detailed' ? 'text-lg' : 'text-base'}
          `}>
            {displayName}
          </h3>
          
          {/* Character Type & Power Level */}
          <div className="flex items-center gap-2 mt-1">
            <span 
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white`}
              style={{ backgroundColor: typeConfig.color }}
            >
              <span className="mr-1">{typeConfig.icon}</span>
              {typeConfig.label}
            </span>
            
            {variant !== 'compact' && (
              <span 
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white`}
                style={{ backgroundColor: powerConfig.color }}
              >
                <Zap className="w-3 h-3 mr-1" />
                {powerConfig.label}
              </span>
            )}
          </div>
        </div>
        
        {/* Description */}
        {variant !== 'compact' && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {shortDescription}
          </p>
        )}
        
        {/* Character Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {/* Relationships Count */}
            {showRelationships && character.relationship_count !== undefined && character.relationship_count > 0 && (
              <div className="flex items-center gap-1" title="Relationships">
                <Users className="w-3 h-3" />
                <span>{character.relationship_count}</span>
              </div>
            )}
            
            {/* Appearances Count */}
            {showAppearances && character.appearance_count !== undefined && character.appearance_count > 0 && (
              <div className="flex items-center gap-1" title="Appearances">
                <BookOpen className="w-3 h-3" />
                <span>{character.appearance_count}</span>
              </div>
            )}
            
            {/* POV Character Indicator */}
            {character.is_pov_character && (
              <div className="flex items-center gap-1" title="Point of View Character">
                <Eye className="w-3 h-3 text-blue-500" />
                <span className="text-blue-500">POV</span>
              </div>
            )}
          </div>
          
          {/* Action Indicator */}
          {onClick && (
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          )}
        </div>
      </div>
      
      {/* Character Abilities Preview (Detailed variant only) */}
      {variant === 'detailed' && character.abilities && character.abilities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex flex-wrap gap-1">
            {character.abilities.slice(0, 3).map((ability, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                title={ability.description}
              >
                {ability.name}
              </span>
            ))}
            {character.abilities.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                +{character.abilities.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );

  // Render as Link if no custom onClick handler
  if (!onClick) {
    return (
      <Link 
        to={`/characters/${character.slug}`}
        className={`
          group block bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-lg 
          transition-all duration-200 overflow-hidden
          ${variant === 'compact' ? 'p-3' : 'p-4'}
          ${className}
        `}
      >
        <div className={`flex gap-3 ${variant === 'detailed' ? 'flex-col' : 'items-start'}`}>
          <CardContent />
        </div>
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
        ${variant === 'compact' ? 'p-3' : 'p-4'}
        ${className}
      `}
    >
      <div className={`flex gap-3 ${variant === 'detailed' ? 'flex-col' : 'items-start'}`}>
        <CardContent />
      </div>
    </div>
  );
};

export default CharacterCard;