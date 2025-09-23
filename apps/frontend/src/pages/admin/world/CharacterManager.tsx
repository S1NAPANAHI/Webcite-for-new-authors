import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Crown,
  Star,
  Zap,
  Shield,
  Heart,
  Network,
  BookOpen,
  Settings,
  MoreVertical,
  ChevronDown,
  Upload,
  Download,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Character, CharacterFilters as ICharacterFilters, CharacterSortOptions } from '../../../types/character';
import { supabase } from '@zoroaster/shared';
import {
  filterCharacters,
  sortCharacters,
  getCharacterStats,
  getCharacterTypeConfig,
  getCharacterStatusConfig,
  getPowerLevelConfig,
  CHARACTER_TYPE_CONFIG,
  CHARACTER_STATUS_CONFIG,
  POWER_LEVEL_CONFIG
} from '../../../utils/characterUtils';
import CharacterCard from '../../../components/characters/CharacterCard';
import CharacterFilters from '../../../components/characters/CharacterFilters';

interface CharacterManagerProps {
  className?: string;
}

const CharacterManager: React.FC<CharacterManagerProps> = ({ className = '' }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  
  // Filter and sort state
  const [filters, setFilters] = useState<ICharacterFilters>({});
  const [sortOptions, setSortOptions] = useState<CharacterSortOptions>({
    field: 'importance_score',
    direction: 'desc'
  });

  // Memoized filtered and sorted characters
  const filteredCharacters = useMemo(() => {
    const filtered = filterCharacters(characters, filters);
    return sortCharacters(filtered, sortOptions.field, sortOptions.direction);
  }, [characters, filters, sortOptions]);

  // Character statistics
  const stats = useMemo(() => {
    return getCharacterStats(characters);
  }, [characters]);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('\ud83d\udd0d Loading characters from database...');
      
      const { data, error } = await supabase
        .from('characters')
        .select(`
          *,
          abilities:character_abilities(
            id, name, description, power_level, category, mastery_level, is_signature_ability
          ),
          relationships:character_relationships(
            id, relationship_type, description, strength, is_mutual,
            related_character:characters!character_relationships_related_character_id_fkey(
              id, name, slug, character_type, portrait_url
            )
          ),
          appearances:character_appearances(
            id, importance, description,
            content_item:content_items(id, title, type, slug)
          )
        `)
        .order('importance_score', { ascending: false });
      
      if (error) {
        console.error('\u274c Error loading characters:', error);
        setError('Failed to load characters');
        return;
      }
      
      // Process the data to add computed fields
      const processedCharacters = (data || []).map(character => ({
        ...character,
        appearance_count: character.appearances?.length || 0,
        relationship_count: character.relationships?.length || 0
      }));
      
      console.log(`\u2705 Loaded ${processedCharacters.length} characters`);
      setCharacters(processedCharacters);
    } catch (error) {
      console.error('\ud83d\udca5 Error loading characters:', error);
      setError('Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = () => {
    setSelectedCharacter(null);
    setShowCreateModal(true);
  };

  const handleEditCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setShowEditModal(true);
  };

  const handleDeleteCharacter = async (character: Character) => {
    if (!window.confirm(`Are you sure you want to delete "${character.name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', character.id);
      
      if (error) {
        console.error('\u274c Error deleting character:', error);
        alert('Failed to delete character');
        return;
      }
      
      console.log('\u2705 Character deleted successfully');
      await loadCharacters(); // Refresh the list
    } catch (error) {
      console.error('\ud83d\udca5 Error deleting character:', error);
      alert('Failed to delete character');
    }
  };

  const handleBulkAction = async (action: 'delete' | 'export' | 'update_type') => {
    const selectedIds = Array.from(bulkSelected);
    if (selectedIds.length === 0) {
      alert('Please select characters first');
      return;
    }
    
    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedIds.length} selected characters?`)) {
          try {
            const { error } = await supabase
              .from('characters')
              .delete()
              .in('id', selectedIds);
            
            if (error) throw error;
            
            setBulkSelected(new Set());
            await loadCharacters();
          } catch (error) {
            console.error('Bulk delete error:', error);
            alert('Failed to delete characters');
          }
        }
        break;
      case 'export':
        // TODO: Implement export functionality
        alert('Export functionality coming soon!');
        break;
    }
  };

  const toggleCharacterSelection = (characterId: string) => {
    const newSelected = new Set(bulkSelected);
    if (newSelected.has(characterId)) {
      newSelected.delete(characterId);
    } else {
      newSelected.add(characterId);
    }
    setBulkSelected(newSelected);
  };

  const selectAllCharacters = () => {
    if (bulkSelected.size === filteredCharacters.length) {
      setBulkSelected(new Set());
    } else {
      setBulkSelected(new Set(filteredCharacters.map(c => c.id)));
    }
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: number;
    color?: string;
    onClick?: () => void;
  }> = ({ icon, label, value, color = 'text-primary', onClick }) => (
    <div 
      className={`bg-card rounded-lg border border-border p-4 ${
        onClick ? 'cursor-pointer hover:border-primary/50 transition-colors duration-200' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={color}>{icon}</div>
        <div>
          <div className="text-2xl font-bold text-foreground">{value.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );

  const CharacterTableRow: React.FC<{ character: Character }> = ({ character }) => {
    const typeConfig = getCharacterTypeConfig(character.character_type);
    const statusConfig = getCharacterStatusConfig(character.status);
    const powerConfig = getPowerLevelConfig(character.power_level);
    const isSelected = bulkSelected.has(character.id);
    
    return (
      <tr 
        className={`hover:bg-muted/50 transition-colors duration-200 ${
          isSelected ? 'bg-primary/10 border-primary/20' : ''
        }`}
      >
        <td className="p-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleCharacterSelection(character.id)}
            className="rounded border-border focus:ring-primary/20 text-primary"
          />
        </td>
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {character.portrait_url ? (
                <img src={character.portrait_url} alt={character.name} className="w-full h-full object-cover" />
              ) : (
                <Users className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="font-medium text-foreground">{character.name}</div>
              {character.title && (
                <div className="text-sm text-muted-foreground">{character.title}</div>
              )}
            </div>
          </div>
        </td>
        <td className="p-4">
          <span 
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: typeConfig.color }}
          >
            <span className="mr-1">{typeConfig.icon}</span>
            {typeConfig.label}
          </span>
        </td>
        <td className="p-4">
          <span 
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: statusConfig.color }}
          >
            <span className="mr-1">{statusConfig.icon}</span>
            {statusConfig.label}
          </span>
        </td>
        <td className="p-4">
          <span 
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: powerConfig.color }}
          >
            <Zap className="w-3 h-3 mr-1" />
            {powerConfig.label}
          </span>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-1">
            <Star className={`w-4 h-4 ${
              character.importance_score >= 75 ? 'text-yellow-500 fill-current' : 'text-gray-300'
            }`} />
            <span className="text-sm font-medium">{character.importance_score}</span>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {character.is_major_character && (
              <Crown className="w-4 h-4 text-yellow-500" title="Major Character" />
            )}
            {character.is_pov_character && (
              <Eye className="w-4 h-4 text-blue-500" title="POV Character" />
            )}
            <span>{character.relationship_count || 0} rel</span>
            <span>{character.appearance_count || 0} app</span>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEditCharacter(character)}
              className="p-1 text-muted-foreground hover:text-primary transition-colors duration-200"
              title="Edit Character"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open(`/characters/${character.slug}`, '_blank')}
              className="p-1 text-muted-foreground hover:text-primary transition-colors duration-200"
              title="View Character"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteCharacter(character)}
              className="p-1 text-muted-foreground hover:text-red-500 transition-colors duration-200"
              title="Delete Character"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Users className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Loading Characters</h3>
            <p className="text-muted-foreground">Fetching character data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load Characters</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={loadCharacters}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Character Management</h1>
          <p className="text-muted-foreground">
            Manage characters, relationships, and story integration
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
              showFilters 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          <button
            onClick={handleCreateCharacter}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Character
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={<Users className="w-6 h-6" />} 
          label="Total Characters" 
          value={stats.total}
          onClick={() => setFilters({})}
        />
        <StatCard 
          icon={<Crown className="w-6 h-6" />} 
          label="Major Characters" 
          value={stats.major} 
          color="text-yellow-500"
          onClick={() => setFilters({ is_major_character: true })}
        />
        <StatCard 
          icon={<Eye className="w-6 h-6" />} 
          label="POV Characters" 
          value={stats.pov} 
          color="text-blue-500"
          onClick={() => setFilters({ is_pov_character: true })}
        />
        <StatCard 
          icon={<Network className="w-6 h-6" />} 
          label="Total Relationships" 
          value={characters.reduce((sum, c) => sum + (c.relationship_count || 0), 0)} 
          color="text-green-500"
        />
      </div>

      {/* Main Content */}
      <div className={`${showFilters ? 'grid grid-cols-1 lg:grid-cols-4 gap-6' : ''}`}>
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <CharacterFilters
                filters={filters}
                onFiltersChange={setFilters}
                totalCount={characters.length}
                filteredCount={filteredCharacters.length}
                availableFactions={Array.from(new Set(characters.map(c => c.primary_faction).filter(Boolean)))}
              />
            </div>
          </div>
        )}

        {/* Character List */}
        <div className={showFilters ? 'lg:col-span-3' : 'w-full'}>
          {/* Bulk Actions */}
          {bulkSelected.size > 0 && (
            <div className="bg-card border border-border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {bulkSelected.size} character{bulkSelected.size > 1 ? 's' : ''} selected
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="px-3 py-1.5 text-sm bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Export
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Characters Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={bulkSelected.size === filteredCharacters.length && filteredCharacters.length > 0}
                      onChange={selectAllCharacters}
                      className="rounded border-border focus:ring-primary/20 text-primary"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Character</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Power Level</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Importance</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Stats</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCharacters.length > 0 ? (
                  filteredCharacters.map((character) => (
                    <CharacterTableRow key={character.id} character={character} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Characters Found</h3>
                      <p className="text-muted-foreground mb-4">
                        {characters.length === 0 
                          ? 'Create your first character to get started'
                          : 'No characters match your current filters'
                        }
                      </p>
                      {characters.length === 0 && (
                        <button
                          onClick={handleCreateCharacter}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
                        >
                          Create First Character
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TODO: Character Creation/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {showCreateModal ? 'Create New Character' : 'Edit Character'}
            </h2>
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="w-12 h-12 mx-auto mb-4" />
              <p>Character creation/editing form coming in next update...</p>
              <p className="text-sm mt-2">This will include all character properties, relationships, and abilities.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedCharacter(null);
                }}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterManager;