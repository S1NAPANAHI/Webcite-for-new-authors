// Character utility functions and constants

import { Character, CharacterType, CharacterStatus, PowerLevel, RelationshipType } from '../types/character';

// Character Type Configuration
export const CHARACTER_TYPE_CONFIG = {
  protagonist: {
    label: 'Protagonist',
    color: '#10B981', // Green
    icon: '👑',
    description: 'Main character driving the story'
  },
  antagonist: {
    label: 'Antagonist',
    color: '#EF4444', // Red
    icon: '⚔️',
    description: 'Primary opposition to the protagonist'
  },
  supporting: {
    label: 'Supporting',
    color: '#3B82F6', // Blue
    icon: '🤝',
    description: 'Important recurring character'
  },
  minor: {
    label: 'Minor',
    color: '#6B7280', // Gray
    icon: '👤',
    description: 'Less frequent but notable character'
  },
  cameo: {
    label: 'Cameo',
    color: '#9CA3AF', // Light Gray
    icon: '👥',
    description: 'Brief or single appearance'
  },
  narrator: {
    label: 'Narrator',
    color: '#8B5CF6', // Purple
    icon: '📖',
    description: 'Story narrator or voice'
  },
  mentor: {
    label: 'Mentor',
    color: '#F59E0B', // Amber
    icon: '🧙',
    description: 'Guide or teacher character'
  },
  villain: {
    label: 'Villain',
    color: '#DC2626', // Dark Red
    icon: '💀',
    description: 'Evil or malevolent character'
  },
  'anti-hero': {
    label: 'Anti-Hero',
    color: '#7C3AED', // Violet
    icon: '⚡',
    description: 'Morally ambiguous protagonist'
  }
} as const;

export const CHARACTER_STATUS_CONFIG = {
  alive: {
    label: 'Alive',
    color: '#10B981', // Green
    icon: '💚',
    description: 'Currently living'
  },
  deceased: {
    label: 'Deceased',
    color: '#6B7280', // Gray
    icon: '💀',
    description: 'Confirmed dead'
  },
  missing: {
    label: 'Missing',
    color: '#F59E0B', // Amber
    icon: '❓',
    description: 'Whereabouts unknown'
  },
  unknown: {
    label: 'Unknown',
    color: '#8B5CF6', // Purple
    icon: '❔',
    description: 'Status unclear'
  },
  immortal: {
    label: 'Immortal',
    color: '#06B6D4', // Cyan
    icon: '♾️',
    description: 'Cannot die naturally'
  }
} as const;

export const POWER_LEVEL_CONFIG = {
  mortal: {
    label: 'Mortal',
    color: '#6B7280', // Gray
    icon: '👤',
    description: 'Normal human capabilities',
    order: 1
  },
  enhanced: {
    label: 'Enhanced',
    color: '#3B82F6', // Blue
    icon: '💪',
    description: 'Above-average abilities',
    order: 2
  },
  supernatural: {
    label: 'Supernatural',
    color: '#8B5CF6', // Purple
    icon: '🌟',
    description: 'Magical or otherworldly powers',
    order: 3
  },
  divine: {
    label: 'Divine',
    color: '#F59E0B', // Amber
    icon: '✨',
    description: 'God-like abilities',
    order: 4
  },
  cosmic: {
    label: 'Cosmic',
    color: '#EC4899', // Pink
    icon: '🌌',
    description: 'Universal-scale powers',
    order: 5
  },
  omnipotent: {
    label: 'Omnipotent',
    color: '#DC2626', // Red
    icon: '♾️',
    description: 'Unlimited power',
    order: 6
  }
} as const;

export const RELATIONSHIP_TYPE_CONFIG = {
  family: {
    label: 'Family',
    color: '#10B981', // Green
    icon: '👨‍👩‍👧‍👦',
    description: 'Related by blood or adoption'
  },
  friend: {
    label: 'Friend',
    color: '#3B82F6', // Blue
    icon: '🤝',
    description: 'Close personal friendship'
  },
  ally: {
    label: 'Ally',
    color: '#06B6D4', // Cyan
    icon: '⚔️',
    description: 'Fighting on the same side'
  },
  enemy: {
    label: 'Enemy',
    color: '#EF4444', // Red
    icon: '⚡',
    description: 'Active opposition or hatred'
  },
  rival: {
    label: 'Rival',
    color: '#F59E0B', // Amber
    icon: '🏆',
    description: 'Competition or rivalry'
  },
  mentor: {
    label: 'Mentor',
    color: '#8B5CF6', // Purple
    icon: '🧙',
    description: 'Teacher or guide relationship'
  },
  student: {
    label: 'Student',
    color: '#7C3AED', // Violet
    icon: '📚',
    description: 'Learning from the other'
  },
  love_interest: {
    label: 'Love Interest',
    color: '#EC4899', // Pink
    icon: '💕',
    description: 'Romantic attraction or relationship'
  },
  neutral: {
    label: 'Neutral',
    color: '#6B7280', // Gray
    icon: '🤷',
    description: 'No strong feelings either way'
  },
  complex: {
    label: 'Complex',
    color: '#D946EF', // Fuchsia
    icon: '🌊',
    description: 'Complicated or changing relationship'
  }
} as const;

// Utility Functions
export const getCharacterTypeConfig = (type: CharacterType) => CHARACTER_TYPE_CONFIG[type];
export const getCharacterStatusConfig = (status: CharacterStatus) => CHARACTER_STATUS_CONFIG[status];
export const getPowerLevelConfig = (level: PowerLevel) => POWER_LEVEL_CONFIG[level];
export const getRelationshipTypeConfig = (type: RelationshipType) => RELATIONSHIP_TYPE_CONFIG[type];

// Generate character slug from name
export const generateCharacterSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Get character display name (with title if available)
export const getCharacterDisplayName = (character: Character): string => {
  if (character.title) {
    return `${character.name} "${character.title}"`;
  }
  return character.name;
};

// Get character short description for cards
export const getCharacterShortDescription = (character: Character, maxLength: number = 100): string => {
  if (character.description.length <= maxLength) {
    return character.description;
  }
  return character.description.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
};

// Calculate character importance tier
export const getCharacterImportanceTier = (importanceScore: number): {
  tier: 'legendary' | 'major' | 'important' | 'minor' | 'background';
  label: string;
  color: string;
} => {
  if (importanceScore >= 90) {
    return { tier: 'legendary', label: 'Legendary', color: '#FFD700' }; // Gold
  } else if (importanceScore >= 75) {
    return { tier: 'major', label: 'Major', color: '#DC2626' }; // Red
  } else if (importanceScore >= 50) {
    return { tier: 'important', label: 'Important', color: '#3B82F6' }; // Blue
  } else if (importanceScore >= 25) {
    return { tier: 'minor', label: 'Minor', color: '#6B7280' }; // Gray
  } else {
    return { tier: 'background', label: 'Background', color: '#9CA3AF' }; // Light Gray
  }
};

// Generate character color theme
export const generateCharacterColorTheme = (character: Character): string => {
  if (character.color_theme) return character.color_theme;
  
  // Generate color based on character properties
  const typeConfig = getCharacterTypeConfig(character.character_type);
  return typeConfig.color;
};

// Sort characters by different criteria
export const sortCharacters = (characters: Character[], sortBy: string, direction: 'asc' | 'desc' = 'asc'): Character[] => {
  const sorted = [...characters].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'importance_score':
        aValue = a.importance_score;
        bValue = b.importance_score;
        break;
      case 'appearance_count':
        aValue = a.appearance_count || 0;
        bValue = b.appearance_count || 0;
        break;
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case 'power_level':
        aValue = POWER_LEVEL_CONFIG[a.power_level].order;
        bValue = POWER_LEVEL_CONFIG[b.power_level].order;
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

// Filter characters based on criteria
export const filterCharacters = (characters: Character[], filters: any): Character[] => {
  return characters.filter(character => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        character.name.toLowerCase().includes(searchLower) ||
        character.description.toLowerCase().includes(searchLower) ||
        (character.aliases && character.aliases.some(alias => alias.toLowerCase().includes(searchLower))) ||
        (character.title && character.title.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    // Character type filter
    if (filters.character_types && filters.character_types.length > 0) {
      if (!filters.character_types.includes(character.character_type)) return false;
    }
    
    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      if (!filters.statuses.includes(character.status)) return false;
    }
    
    // Power level filter
    if (filters.power_levels && filters.power_levels.length > 0) {
      if (!filters.power_levels.includes(character.power_level)) return false;
    }
    
    // Importance range filter
    if (filters.min_importance !== undefined && character.importance_score < filters.min_importance) {
      return false;
    }
    if (filters.max_importance !== undefined && character.importance_score > filters.max_importance) {
      return false;
    }
    
    // Major character filter
    if (filters.is_major_character !== undefined && character.is_major_character !== filters.is_major_character) {
      return false;
    }
    
    // POV character filter
    if (filters.is_pov_character !== undefined && character.is_pov_character !== filters.is_pov_character) {
      return false;
    }
    
    return true;
  });
};

// Get character relationship strength color
export const getRelationshipStrengthColor = (strength: number): string => {
  if (strength <= -8) return '#DC2626'; // Dark Red - Hatred
  if (strength <= -5) return '#EF4444'; // Red - Dislike
  if (strength <= -2) return '#F59E0B'; // Amber - Tension
  if (strength <= 2) return '#6B7280'; // Gray - Neutral
  if (strength <= 5) return '#3B82F6'; // Blue - Friendly
  if (strength <= 8) return '#10B981'; // Green - Close
  return '#EC4899'; // Pink - Deep Bond
};

// Character search and autocomplete
export const searchCharacters = (characters: Character[], query: string, limit: number = 10): Character[] => {
  if (!query.trim()) return characters.slice(0, limit);
  
  const queryLower = query.toLowerCase();
  
  // Score characters based on relevance
  const scoredCharacters = characters.map(character => {
    let score = 0;
    
    // Exact name match gets highest score
    if (character.name.toLowerCase() === queryLower) score += 100;
    
    // Name starts with query
    if (character.name.toLowerCase().startsWith(queryLower)) score += 50;
    
    // Name contains query
    if (character.name.toLowerCase().includes(queryLower)) score += 25;
    
    // Title matches
    if (character.title && character.title.toLowerCase().includes(queryLower)) score += 20;
    
    // Aliases match
    if (character.aliases) {
      character.aliases.forEach(alias => {
        if (alias.toLowerCase().includes(queryLower)) score += 15;
      });
    }
    
    // Description contains query (lower priority)
    if (character.description.toLowerCase().includes(queryLower)) score += 5;
    
    // Boost score for major characters
    if (character.is_major_character) score += 10;
    
    return { character, score };
  });
  
  return scoredCharacters
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.character);
};

// Get character statistics
export const getCharacterStats = (characters: Character[]) => {
  const stats = {
    total: characters.length,
    major: characters.filter(c => c.is_major_character).length,
    pov: characters.filter(c => c.is_pov_character).length,
    by_type: {} as Record<string, number>,
    by_status: {} as Record<string, number>,
    by_power: {} as Record<string, number>
  };
  
  characters.forEach(character => {
    // Count by type
    stats.by_type[character.character_type] = (stats.by_type[character.character_type] || 0) + 1;
    
    // Count by status
    stats.by_status[character.status] = (stats.by_status[character.status] || 0) + 1;
    
    // Count by power level
    stats.by_power[character.power_level] = (stats.by_power[character.power_level] || 0) + 1;
  });
  
  return stats;
};