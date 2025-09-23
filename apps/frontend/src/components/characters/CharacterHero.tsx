import React from 'react';
import { Crown, Shield, Users, User, MessageCircle, BookOpen, Zap, Heart, Sword } from 'lucide-react';
import CharacterSymbol from './CharacterSymbol';

interface Character {
  id: string;
  name: string;
  title?: string;
  description: string;
  character_type: 'protagonist' | 'antagonist' | 'supporting' | 'minor' | 'cameo' | 'narrator' | 'mentor' | 'villain' | 'anti-hero';
  status: 'alive' | 'deceased' | 'missing' | 'unknown' | 'immortal';
  power_level: 'mortal' | 'enhanced' | 'supernatural' | 'divine' | 'cosmic' | 'omnipotent';
  importance_score: number;
  portrait_url?: string;
  color_theme?: string;
  is_major_character: boolean;
  is_pov_character: boolean;
  quote?: string;
  primary_faction?: string;
  occupation?: string;
  species?: string;
  age_description?: string;
  location?: string;
}

interface CharacterHeroProps {
  character: Character;
}

const CharacterHero: React.FC<CharacterHeroProps> = ({ character }) => {
  // Character type icons and colors
  const getCharacterTypeInfo = (type: string) => {
    switch (type) {
      case 'protagonist':
        return { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Protagonist' };
      case 'antagonist':
        return { icon: Sword, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Antagonist' };
      case 'supporting':
        return { icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Supporting' };
      case 'mentor':
        return { icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'Mentor' };
      case 'villain':
        return { icon: Sword, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Villain' };
      case 'anti-hero':
        return { icon: Shield, color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Anti-Hero' };
      default:
        return { icon: User, color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Character' };
    }
  };

  // Status indicators
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'alive':
        return { color: 'text-green-400', bg: 'bg-green-400/10', label: 'Alive', emoji: '💚' };
      case 'deceased':
        return { color: 'text-red-400', bg: 'bg-red-400/10', label: 'Deceased', emoji: '💀' };
      case 'missing':
        return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Missing', emoji: '❓' };
      case 'immortal':
        return { color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'Immortal', emoji: '♾️' };
      default:
        return { color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Unknown', emoji: '❔' };
    }
  };

  // Power level indicators
  const getPowerLevelInfo = (level: string) => {
    switch (level) {
      case 'divine':
        return { color: 'text-yellow-300', label: 'Divine', emoji: '✨' };
      case 'cosmic':
        return { color: 'text-purple-300', label: 'Cosmic', emoji: '🌌' };
      case 'omnipotent':
        return { color: 'text-white', label: 'Omnipotent', emoji: '∞' };
      case 'supernatural':
        return { color: 'text-blue-300', label: 'Supernatural', emoji: '🔮' };
      case 'enhanced':
        return { color: 'text-green-300', label: 'Enhanced', emoji: '⚡' };
      default:
        return { color: 'text-gray-300', label: 'Mortal', emoji: '👤' };
    }
  };

  // Importance tier
  const getImportanceTier = (score: number) => {
    if (score >= 90) return { label: 'Legendary', color: 'text-yellow-300', bg: 'bg-yellow-300/10' };
    if (score >= 70) return { label: 'Major', color: 'text-blue-300', bg: 'bg-blue-300/10' };
    if (score >= 50) return { label: 'Important', color: 'text-green-300', bg: 'bg-green-300/10' };
    return { label: 'Minor', color: 'text-gray-400', bg: 'bg-gray-400/10' };
  };

  const typeInfo = getCharacterTypeInfo(character.character_type);
  const statusInfo = getStatusInfo(character.status);
  const powerInfo = getPowerLevelInfo(character.power_level);
  const importanceInfo = getImportanceTier(character.importance_score);
  const TypeIcon = typeInfo.icon;

  return (
    <div className="relative overflow-hidden">
      {/* Animated Starry Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        <div className="absolute inset-0 opacity-30">
          {/* Animated stars */}
          <div className="star-field">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Portrait Section */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* Golden Portrait Frame */}
              <div className="w-64 h-64 relative">
                {/* Rotating golden ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 p-1 animate-spin" style={{animationDuration: '10s'}}>
                  <div className="w-full h-full rounded-full bg-gray-900"></div>
                </div>
                
                {/* Portrait */}
                <div className="absolute inset-2 rounded-full overflow-hidden bg-gray-800">
                  {character.portrait_url ? (
                    <img
                      src={character.portrait_url}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                      <TypeIcon className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Character Symbol Overlay */}
                <div className="absolute -bottom-4 -right-4">
                  <CharacterSymbol 
                    type={character.character_type}
                    powerLevel={character.power_level}
                    size="large"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Character Info */}
          <div className="lg:col-span-2 text-center lg:text-left space-y-6">
            {/* Name and Title */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {character.name}
              </h1>
              {character.title && (
                <p className="text-xl md:text-2xl text-yellow-300 font-medium">
                  "{character.title}"
                </p>
              )}
            </div>

            {/* Quote */}
            {character.quote && (
              <blockquote className="text-lg md:text-xl text-gray-300 italic border-l-4 border-yellow-400 pl-4 max-w-2xl">
                "{character.quote}"
              </blockquote>
            )}

            {/* Character Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {/* Character Type */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${typeInfo.bg} ${typeInfo.color} text-sm font-medium`}>
                <TypeIcon className="w-4 h-4 mr-2" />
                {typeInfo.label}
              </div>

              {/* Status */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color} text-sm font-medium`}>
                <span className="mr-2">{statusInfo.emoji}</span>
                {statusInfo.label}
              </div>

              {/* Power Level */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gray-800 ${powerInfo.color} text-sm font-medium`}>
                <span className="mr-2">{powerInfo.emoji}</span>
                {powerInfo.label}
              </div>

              {/* Importance */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${importanceInfo.bg} ${importanceInfo.color} text-sm font-medium`}>
                {importanceInfo.label}
              </div>

              {/* POV Character */}
              {character.is_pov_character && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  POV
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {character.species && character.species !== 'Human' && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{character.species}</div>
                  <div className="text-sm text-gray-400">Species</div>
                </div>
              )}
              
              {character.age_description && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{character.age_description}</div>
                  <div className="text-sm text-gray-400">Age</div>
                </div>
              )}
              
              {character.occupation && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white truncate">{character.occupation}</div>
                  <div className="text-sm text-gray-400">Occupation</div>
                </div>
              )}
              
              {character.location && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white truncate">{character.location}</div>
                  <div className="text-sm text-gray-400">Location</div>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
              {character.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </div>
  );
};

export default CharacterHero;