import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import CharacterHero from '../components/characters/CharacterHero';
import CharacterTabs from '../components/characters/CharacterTabs';

interface Character {
  id: string;
  name: string;
  slug: string;
  title?: string;
  aliases?: string[];
  description: string;
  age?: number;
  age_description?: string;
  gender?: string;
  species?: string;
  occupation?: string;
  location?: string;
  origin?: string;
  character_type: 'protagonist' | 'antagonist' | 'supporting' | 'minor' | 'cameo' | 'narrator' | 'mentor' | 'villain' | 'anti-hero';
  status: 'alive' | 'deceased' | 'missing' | 'unknown' | 'immortal';
  power_level: 'mortal' | 'enhanced' | 'supernatural' | 'divine' | 'cosmic' | 'omnipotent';
  importance_score: number;
  portrait_url?: string;
  color_theme?: string;
  height?: string;
  build?: string;
  hair_color?: string;
  eye_color?: string;
  distinguishing_features?: string;
  personality_traits?: string[];
  background_summary?: string;
  motivations?: string[];
  fears?: string[];
  goals?: string[];
  skills?: string[];
  weaknesses?: string[];
  character_arc_summary?: string;
  primary_faction?: string;
  allegiances?: string[];
  is_major_character: boolean;
  is_pov_character: boolean;
  meta_description?: string;
  quote?: string;
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

const CharacterDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/characters/${slug}`);
        
        if (!response.ok) {
          throw new Error('Character not found');
        }
        
        const data = await response.json();
        setCharacter(data);
        
        // Also fetch all characters for navigation
        const allResponse = await fetch('/api/characters');
        if (allResponse.ok) {
          const allData = await allResponse.json();
          setAllCharacters(allData.characters || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load character');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [slug]);

  const handleShare = async () => {
    if (!character) return;
    
    const url = window.location.href;
    const title = `${character.name} - Zoroasterverse Character`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
      }
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const getCurrentCharacterIndex = () => {
    if (!character || !allCharacters.length) return -1;
    return allCharacters.findIndex(c => c.id === character.id);
  };

  const getNextCharacter = () => {
    const currentIndex = getCurrentCharacterIndex();
    if (currentIndex === -1) return null;
    
    const nextIndex = (currentIndex + 1) % allCharacters.length;
    return allCharacters[nextIndex];
  };

  const getPreviousCharacter = () => {
    const currentIndex = getCurrentCharacterIndex();
    if (currentIndex === -1) return null;
    
    const prevIndex = currentIndex === 0 ? allCharacters.length - 1 : currentIndex - 1;
    return allCharacters[prevIndex];
  };

  const navigateToCharacter = (targetCharacter: Character) => {
    navigate(`/characters/${targetCharacter.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300">Loading character...</p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl text-gray-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-white mb-2">Character Not Found</h1>
          <p className="text-gray-400 mb-6">
            {error || 'The character you\'re looking for doesn\'t exist.'}
          </p>
          <button
            onClick={() => navigate('/characters')}
            className="inline-flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Characters
          </button>
        </div>
      </div>
    );
  }

  const nextCharacter = getNextCharacter();
  const previousCharacter = getPreviousCharacter();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={() => navigate('/characters')}
              className="inline-flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Characters
            </button>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
              <button
                onClick={() => navigate('/characters')}
                className="hover:text-yellow-400 transition-colors"
              >
                Characters
              </button>
              <span>/</span>
              <span className="text-white">{character.name}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                title="Share Character"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Character Hero Section */}
      <CharacterHero character={character} />

      {/* Character Content Tabs */}
      <CharacterTabs character={character} />

      {/* Character Navigation */}
      {allCharacters.length > 1 && (
        <div className="bg-gray-800 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              {/* Previous Character */}
              {previousCharacter ? (
                <button
                  onClick={() => navigateToCharacter(previousCharacter)}
                  className="flex items-center space-x-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Previous</div>
                    <div className="text-white font-medium">{previousCharacter.name}</div>
                    {previousCharacter.title && (
                      <div className="text-sm text-gray-400">{previousCharacter.title}</div>
                    )}
                  </div>
                </button>
              ) : (
                <div></div>
              )}

              {/* Character Count */}
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide">Character</div>
                <div className="text-white font-medium">
                  {getCurrentCharacterIndex() + 1} of {allCharacters.length}
                </div>
              </div>

              {/* Next Character */}
              {nextCharacter ? (
                <button
                  onClick={() => navigateToCharacter(nextCharacter)}
                  className="flex items-center space-x-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                >
                  <div className="text-right">
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Next</div>
                    <div className="text-white font-medium">{nextCharacter.name}</div>
                    {nextCharacter.title && (
                      <div className="text-sm text-gray-400">{nextCharacter.title}</div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterDetailPage;