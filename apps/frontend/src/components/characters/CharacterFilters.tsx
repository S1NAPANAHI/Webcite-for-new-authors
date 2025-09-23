import React, { useState } from 'react';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Users,
  Zap,
  Star,
  Eye,
  Crown,
  SlidersHorizontal
} from 'lucide-react';
import { CharacterFilters as ICharacterFilters, CharacterType, CharacterStatus, PowerLevel } from '../../types/character';
import {
  CHARACTER_TYPE_CONFIG,
  CHARACTER_STATUS_CONFIG,
  POWER_LEVEL_CONFIG
} from '../../utils/characterUtils';

interface CharacterFiltersProps {
  filters: ICharacterFilters;
  onFiltersChange: (filters: ICharacterFilters) => void;
  totalCount: number;
  filteredCount: number;
  availableFactions?: string[];
  availableContentItems?: { id: string; title: string; type: string }[];
  className?: string;
}

const CharacterFilters: React.FC<CharacterFiltersProps> = ({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
  availableFactions = [],
  availableContentItems = [],
  className = ''
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const updateFilter = (key: keyof ICharacterFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof ICharacterFilters, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray.length > 0 ? newArray : undefined);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof ICharacterFilters];
    return value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
  });

  const FilterSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    collapsible?: boolean;
  }> = ({ title, icon, children, collapsible = true }) => {
    const isActive = activeSection === title;
    
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          className={`w-full px-4 py-3 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors duration-200 ${
            collapsible ? 'cursor-pointer' : 'cursor-default'
          }`}
          onClick={() => collapsible && setActiveSection(isActive ? null : title)}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-sm">{title}</span>
          </div>
          {collapsible && (
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
          )}
        </button>
        
        {(!collapsible || isActive) && (
          <div className="p-4 bg-card">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Character Filters</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                showAdvancedFilters 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-1.5" />
              Advanced
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-1.5" />
                Clear All
              </button>
            )}
          </div>
        </div>
        
        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} characters
          {hasActiveFilters && (
            <span className="text-primary ml-1">• Filtered</span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search characters by name, title, or description..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
          />
        </div>

        {/* Character Type Filter */}
        <FilterSection title="Character Types" icon={<Users className="w-4 h-4" />}>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CHARACTER_TYPE_CONFIG).map(([type, config]) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.character_types || []).includes(type as CharacterType)}
                  onChange={() => toggleArrayFilter('character_types', type)}
                  className="rounded border-border focus:ring-primary/20 text-primary"
                />
                <span className="flex items-center gap-1.5 text-sm group-hover:text-primary transition-colors duration-200">
                  <span>{config.icon}</span>
                  {config.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Status Filter */}
        <FilterSection title="Status" icon={<Zap className="w-4 h-4" />}>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CHARACTER_STATUS_CONFIG).map(([status, config]) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.statuses || []).includes(status as CharacterStatus)}
                  onChange={() => toggleArrayFilter('statuses', status)}
                  className="rounded border-border focus:ring-primary/20 text-primary"
                />
                <span className="flex items-center gap-1.5 text-sm group-hover:text-primary transition-colors duration-200">
                  <span>{config.icon}</span>
                  {config.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Power Level Filter */}
        <FilterSection title="Power Levels" icon={<Star className="w-4 h-4" />}>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(POWER_LEVEL_CONFIG)
              .sort(([,a], [,b]) => a.order - b.order)
              .map(([level, config]) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.power_levels || []).includes(level as PowerLevel)}
                  onChange={() => toggleArrayFilter('power_levels', level)}
                  className="rounded border-border focus:ring-primary/20 text-primary"
                />
                <span className="flex items-center gap-1.5 text-sm group-hover:text-primary transition-colors duration-200">
                  <span>{config.icon}</span>
                  {config.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <>
            {/* Quick Filters */}
            <FilterSection title="Quick Filters" icon={<Eye className="w-4 h-4" />} collapsible={false}>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.is_major_character === true}
                    onChange={(e) => updateFilter('is_major_character', e.target.checked ? true : undefined)}
                    className="rounded border-border focus:ring-primary/20 text-primary"
                  />
                  <span className="flex items-center gap-1.5 text-sm group-hover:text-primary transition-colors duration-200">
                    <Crown className="w-4 h-4" />
                    Major Characters Only
                  </span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.is_pov_character === true}
                    onChange={(e) => updateFilter('is_pov_character', e.target.checked ? true : undefined)}
                    className="rounded border-border focus:ring-primary/20 text-primary"
                  />
                  <span className="flex items-center gap-1.5 text-sm group-hover:text-primary transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                    POV Characters Only
                  </span>
                </label>
              </div>
            </FilterSection>

            {/* Importance Range */}
            <FilterSection title="Importance Score" icon={<Star className="w-4 h-4" />}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Minimum Importance: {filters.min_importance || 0}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.min_importance || 0}
                    onChange={(e) => updateFilter('min_importance', parseInt(e.target.value) || undefined)}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Maximum Importance: {filters.max_importance || 100}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.max_importance || 100}
                    onChange={(e) => updateFilter('max_importance', parseInt(e.target.value) || undefined)}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </FilterSection>

            {/* Factions Filter */}
            {availableFactions.length > 0 && (
              <FilterSection title="Factions" icon={<Users className="w-4 h-4" />}>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {availableFactions.map((faction) => (
                    <label key={faction} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={(filters.factions || []).includes(faction)}
                        onChange={() => toggleArrayFilter('factions', faction)}
                        className="rounded border-border focus:ring-primary/20 text-primary"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors duration-200">
                        {faction}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CharacterFilters;