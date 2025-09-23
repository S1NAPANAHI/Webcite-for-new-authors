import React, { useState } from 'react';
import {
  Grid,
  List,
  ArrowUpDown,
  Users,
  Crown,
  Loader,
  Eye,
  BookOpen,
  Star,
  LayoutGrid,
  AlignJustify
} from 'lucide-react';
import { Character, CharacterSortOptions } from '../../types/character';
import { sortCharacters, getCharacterStats } from '../../utils/characterUtils';
import CharacterCard from './CharacterCard';

interface CharacterGridProps {
  characters: Character[];
  loading?: boolean;
  sortOptions: CharacterSortOptions;
  onSortChange: (sort: CharacterSortOptions) => void;
  onCharacterClick?: (character: Character) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  className?: string;
}

const CharacterGrid: React.FC<CharacterGridProps> = ({
  characters,
  loading = false,
  sortOptions,
  onSortChange,
  onCharacterClick,
  viewMode = 'grid',
  onViewModeChange,
  className = ''
}) => {
  const [stats] = useState(() => getCharacterStats(characters));
  const sortedCharacters = sortCharacters(characters, sortOptions.field, sortOptions.direction);

  const sortOptions_list = [
    { value: 'name', label: 'Name', icon: <AlignJustify className="w-4 h-4" /> },
    { value: 'importance_score', label: 'Importance', icon: <Star className="w-4 h-4" /> },
    { value: 'appearance_count', label: 'Appearances', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'created_at', label: 'Date Added', icon: <Users className="w-4 h-4" /> }
  ];

  const handleSortChange = (field: string) => {
    const newDirection = sortOptions.field === field && sortOptions.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ field: field as any, direction: newDirection });
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Loading characters...</h3>
            <p className="text-muted-foreground">Fetching character data</p>
          </div>
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No characters found</h3>
          <p className="text-muted-foreground">
            No characters match your current filter criteria. Try adjusting your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header with Controls */}
      <div className="flex items-center justify-between mb-6">
        {/* Stats Summary */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{characters.length}</span> characters
          </div>
          
          {stats.major > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span>{stats.major} major</span>
            </div>
          )}
          
          {stats.pov > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="w-4 h-4 text-blue-500" />
              <span>{stats.pov} POV</span>
            </div>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortOptions.field}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-background border border-border rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
            >
              {sortOptions_list.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Direction Toggle */}
          <button
            onClick={() => onSortChange({ ...sortOptions, direction: sortOptions.direction === 'asc' ? 'desc' : 'asc' })}
            className="px-3 py-2 border border-border rounded-lg bg-background hover:bg-muted transition-colors duration-200"
            title={`Sort ${sortOptions.direction === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                sortOptions.direction === 'desc' ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-2 transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-2 transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Character Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              variant="default"
              onClick={onCharacterClick}
              showRelationships={true}
              showAppearances={true}
              className="character-grid-card"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              variant="compact"
              onClick={onCharacterClick}
              showRelationships={true}
              showAppearances={true}
              className="character-list-card"
            />
          ))}
        </div>
      )}

      {/* Load More / Pagination could go here in future */}
      {characters.length > 50 && (
        <div className="mt-8 text-center">
          <div className="text-sm text-muted-foreground">
            Showing first {Math.min(50, characters.length)} characters
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterGrid;