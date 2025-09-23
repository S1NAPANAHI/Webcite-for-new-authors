import React, { useState } from 'react';
import { 
  BookOpen, 
  Zap, 
  Users, 
  Calendar, 
  Eye, 
  Heart, 
  Sword, 
  Shield, 
  Star,
  MapPin,
  Target,
  AlertTriangle
} from 'lucide-react';

interface Character {
  id: string;
  name: string;
  background_summary?: string;
  personality_traits?: string[];
  motivations?: string[];
  fears?: string[];
  goals?: string[];
  skills?: string[];
  weaknesses?: string[];
  character_arc_summary?: string;
  primary_faction?: string;
  allegiances?: string[];
  height?: string;
  build?: string;
  hair_color?: string;
  eye_color?: string;
  distinguishing_features?: string;
  origin?: string;
  abilities?: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    mastery_level: number;
  }>;
  relationships?: Array<{
    id: string;
    related_character_name: string;
    relationship_type: string;
    strength: number;
    description?: string;
  }>;
  appearances?: Array<{
    id: string;
    content_title: string;
    content_type: string;
    significance: string;
    is_major_appearance: boolean;
  }>;
}

interface CharacterTabsProps {
  character: Character;
}

type TabType = 'overview' | 'abilities' | 'relationships' | 'appearances' | 'symbolism';

const CharacterTabs: React.FC<CharacterTabsProps> = ({ character }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'abilities', label: 'Abilities & Traits', icon: Zap },
    { id: 'relationships', label: 'Relationships', icon: Users },
    { id: 'appearances', label: 'Appearances', icon: Calendar },
    { id: 'symbolism', label: 'Symbolism', icon: Eye }
  ] as const;

  const getRelationshipIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'family': return Heart;
      case 'friend': return Users;
      case 'ally': return Shield;
      case 'enemy': return Sword;
      case 'rival': return Target;
      case 'mentor': return BookOpen;
      case 'love_interest': return Heart;
      default: return Users;
    }
  };

  const getRelationshipColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'family': return 'text-pink-400';
      case 'friend': return 'text-green-400';
      case 'ally': return 'text-blue-400';
      case 'enemy': return 'text-red-400';
      case 'rival': return 'text-orange-400';
      case 'mentor': return 'text-purple-400';
      case 'love_interest': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const getAbilityCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'magical': return 'text-purple-400';
      case 'physical': return 'text-green-400';
      case 'mental': return 'text-blue-400';
      case 'social': return 'text-yellow-400';
      case 'technological': return 'text-gray-400';
      case 'divine': return 'text-yellow-300';
      default: return 'text-gray-400';
    }
  };

  const getMasteryLevel = (level: number) => {
    if (level >= 90) return { label: 'Master', color: 'text-yellow-300' };
    if (level >= 70) return { label: 'Expert', color: 'text-blue-300' };
    if (level >= 50) return { label: 'Skilled', color: 'text-green-300' };
    if (level >= 30) return { label: 'Novice', color: 'text-gray-300' };
    return { label: 'Beginner', color: 'text-gray-400' };
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Background */}
      {character.background_summary && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-yellow-400" />
            Background
          </h3>
          <p className="text-gray-300 leading-relaxed">{character.background_summary}</p>
        </div>
      )}

      {/* Physical Description */}
      {(character.height || character.build || character.hair_color || character.eye_color || character.distinguishing_features) && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-blue-400" />
            Physical Description
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.height && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Height</div>
                <div className="text-white font-medium">{character.height}</div>
              </div>
            )}
            {character.build && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Build</div>
                <div className="text-white font-medium">{character.build}</div>
              </div>
            )}
            {character.hair_color && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Hair Color</div>
                <div className="text-white font-medium">{character.hair_color}</div>
              </div>
            )}
            {character.eye_color && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Eye Color</div>
                <div className="text-white font-medium">{character.eye_color}</div>
              </div>
            )}
          </div>
          {character.distinguishing_features && (
            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Distinguishing Features</div>
              <p className="text-gray-300">{character.distinguishing_features}</p>
            </div>
          )}
        </div>
      )}

      {/* Character Arc */}
      {character.character_arc_summary && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-purple-400" />
            Character Arc
          </h3>
          <p className="text-gray-300 leading-relaxed">{character.character_arc_summary}</p>
        </div>
      )}

      {/* Origin */}
      {character.origin && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-400" />
            Origin
          </h3>
          <p className="text-gray-300">{character.origin}</p>
        </div>
      )}
    </div>
  );

  const renderAbilities = () => (
    <div className="space-y-8">
      {/* Abilities */}
      {character.abilities && character.abilities.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Abilities & Powers
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {character.abilities.map((ability) => {
              const mastery = getMasteryLevel(ability.mastery_level);
              return (
                <div key={ability.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">{ability.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${getAbilityCategory(ability.category)}`}>
                        {ability.category}
                      </span>
                      <span className={`text-sm ${mastery.color}`}>
                        {mastery.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{ability.description}</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ability.mastery_level}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}            
          </div>
        </div>
      )}

      {/* Personality Traits */}
      {character.personality_traits && character.personality_traits.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-400" />
            Personality Traits
          </h3>
          <div className="flex flex-wrap gap-2">
            {character.personality_traits.map((trait, index) => (
              <span key={index} className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {character.skills && character.skills.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-400" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {character.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {character.weaknesses && character.weaknesses.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
            Weaknesses
          </h3>
          <div className="flex flex-wrap gap-2">
            {character.weaknesses.map((weakness, index) => (
              <span key={index} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                {weakness}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Motivations */}
      {character.motivations && character.motivations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-400" />
            Motivations
          </h3>
          <ul className="space-y-2">
            {character.motivations.map((motivation, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-300">{motivation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Goals */}
      {character.goals && character.goals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-400" />
            Goals
          </h3>
          <ul className="space-y-2">
            {character.goals.map((goal, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-300">{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fears */}
      {character.fears && character.fears.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
            Fears
          </h3>
          <ul className="space-y-2">
            {character.fears.map((fear, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-300">{fear}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderRelationships = () => (
    <div className="space-y-6">
      {character.relationships && character.relationships.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {character.relationships.map((relationship) => {
            const RelIcon = getRelationshipIcon(relationship.relationship_type);
            const relationshipColor = getRelationshipColor(relationship.relationship_type);
            
            return (
              <div key={relationship.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <RelIcon className={`w-5 h-5 ${relationshipColor}`} />
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {relationship.related_character_name}
                      </h4>
                      <p className={`text-sm capitalize ${relationshipColor}`}>
                        {relationship.relationship_type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Strength</div>
                    <div className="text-white font-medium">{relationship.strength}/10</div>
                  </div>
                </div>
                
                {relationship.description && (
                  <p className="text-gray-300 text-sm mb-3">{relationship.description}</p>
                )}
                
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${relationshipColor.replace('text-', 'bg-')}`}
                    style={{ width: `${relationship.strength * 10}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No relationships recorded yet</p>
        </div>
      )}
    </div>
  );

  const renderAppearances = () => (
    <div className="space-y-6">
      {character.appearances && character.appearances.length > 0 ? (
        <div className="space-y-4">
          {character.appearances.map((appearance) => (
            <div key={appearance.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {appearance.content_title}
                  </h4>
                  <p className="text-sm text-gray-400 capitalize">
                    {appearance.content_type.replace('_', ' ')}
                  </p>
                </div>
                {appearance.is_major_appearance && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-medium">
                    Major Role
                  </span>
                )}
              </div>
              <p className="text-gray-300">{appearance.significance}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No appearances recorded yet</p>
        </div>
      )}
    </div>
  );

  const renderSymbolism = () => (
    <div className="space-y-6">
      {/* Faction & Allegiances */}
      {(character.primary_faction || (character.allegiances && character.allegiances.length > 0)) && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-400" />
            Allegiances
          </h3>
          
          {character.primary_faction && (
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">Primary Faction</div>
              <div className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg font-medium">
                {character.primary_faction}
              </div>
            </div>
          )}
          
          {character.allegiances && character.allegiances.length > 0 && (
            <div>
              <div className="text-sm text-gray-400 mb-3">Other Allegiances</div>
              <div className="flex flex-wrap gap-2">
                {character.allegiances.map((allegiance, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                    {allegiance}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Placeholder for future symbolism content */}
      <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
        <Eye className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Symbolism & Themes</h3>
        <p className="text-gray-400">
          Cultural significance, symbolic meanings, and thematic elements will be explored here.
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'abilities': return renderAbilities();
      case 'relationships': return renderRelationships();
      case 'appearances': return renderAppearances();
      case 'symbolism': return renderSymbolism();
      default: return renderOverview();
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'text-yellow-400 border-yellow-400'
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CharacterTabs;