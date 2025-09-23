// Character type definitions for the character management system

export type CharacterStatus = 'alive' | 'deceased' | 'missing' | 'unknown' | 'immortal';

export type CharacterType = 
  | 'protagonist' 
  | 'antagonist' 
  | 'supporting' 
  | 'minor' 
  | 'cameo'
  | 'narrator'
  | 'mentor'
  | 'villain'
  | 'anti-hero';

export type PowerLevel = 
  | 'mortal' 
  | 'enhanced' 
  | 'supernatural' 
  | 'divine' 
  | 'cosmic'
  | 'omnipotent';

export type RelationshipType = 
  | 'family' 
  | 'friend' 
  | 'ally' 
  | 'enemy' 
  | 'rival' 
  | 'mentor' 
  | 'student' 
  | 'love_interest'
  | 'neutral'
  | 'complex';

export interface CharacterAbility {
  id: string;
  name: string;
  description: string;
  power_level: PowerLevel;
  category: 'magical' | 'physical' | 'mental' | 'social' | 'technological' | 'divine';
  mastery_level: number; // 1-10 scale
}

export interface CharacterRelationship {
  id: string;
  character_id: string;
  related_character_id: string;
  relationship_type: RelationshipType;
  description: string;
  strength: number; // -10 to 10 (negative = hostile, positive = friendly)
  is_mutual: boolean;
  created_at: string;
  updated_at: string;
  // Populated relationships
  related_character?: Character;
}

export interface CharacterAppearance {
  id: string;
  content_item_id: string;
  chapter_id?: string;
  first_mention_at?: string; // Page/chapter reference
  importance: 'major' | 'minor' | 'cameo';
  description?: string;
  // Populated data
  content_item?: {
    id: string;
    title: string;
    type: string;
    slug: string;
  };
  chapter?: {
    id: string;
    title: string;
    chapter_number: number;
    slug: string;
  };
}

export interface Character {
  id: string;
  name: string;
  slug: string;
  title?: string; // Noble titles, nicknames, etc.
  aliases?: string[]; // Alternative names
  
  // Basic Information
  description: string;
  age?: number;
  age_description?: string; // "Ancient", "Teenage", etc.
  gender?: string;
  species?: string;
  occupation?: string;
  location?: string; // Current location
  origin?: string; // Where they're from
  
  // Character Classification
  character_type: CharacterType;
  status: CharacterStatus;
  power_level: PowerLevel;
  importance_score: number; // 1-100 scale for sorting
  
  // Visual & Media
  portrait_file_id?: string;
  portrait_url?: string;
  gallery_file_ids?: string[];
  color_theme?: string; // Hex color for theming
  
  // Physical Description
  height?: string;
  build?: string;
  hair_color?: string;
  eye_color?: string;
  distinguishing_features?: string;
  
  // Personality & Background
  personality_traits?: string[];
  background_summary?: string;
  motivations?: string[];
  fears?: string[];
  goals?: string[];
  
  // Abilities & Skills
  abilities?: CharacterAbility[];
  skills?: string[];
  weaknesses?: string[];
  
  // Story Integration
  first_appearance_content_id?: string;
  last_appearance_content_id?: string;
  character_arc_summary?: string;
  
  // Relationships
  relationships?: CharacterRelationship[];
  
  // Appearances
  appearances?: CharacterAppearance[];
  
  // Faction & Allegiance
  primary_faction?: string;
  allegiances?: string[];
  
  // Metadata
  is_major_character: boolean;
  is_pov_character: boolean; // Point of view character
  is_spoiler_sensitive: boolean;
  spoiler_tags?: string[];
  
  // Admin
  created_at: string;
  updated_at: string;
  created_by_user_id: string;
  
  // Computed fields (from joins/calculations)
  appearance_count?: number;
  relationship_count?: number;
  average_importance?: number;
}

export interface CharacterFilters {
  search?: string;
  character_types?: CharacterType[];
  statuses?: CharacterStatus[];
  power_levels?: PowerLevel[];
  factions?: string[];
  content_items?: string[]; // Filter by appearances in specific content
  relationship_to?: string; // Show characters related to specific character
  min_importance?: number;
  max_importance?: number;
  is_major_character?: boolean;
  is_pov_character?: boolean;
  has_abilities?: boolean;
}

export interface CharacterSortOptions {
  field: 'name' | 'importance_score' | 'first_appearance' | 'appearance_count' | 'created_at';
  direction: 'asc' | 'desc';
}

// Character Network/Relationship Graph
export interface CharacterNode {
  id: string;
  character: Character;
  x?: number;
  y?: number;
  connections: CharacterEdge[];
}

export interface CharacterEdge {
  from_character_id: string;
  to_character_id: string;
  relationship: CharacterRelationship;
  weight: number; // Relationship strength for graph layout
}

export interface CharacterNetwork {
  nodes: CharacterNode[];
  edges: CharacterEdge[];
  center_character_id?: string;
}

// Character Statistics
export interface CharacterStats {
  total_characters: number;
  by_type: Record<CharacterType, number>;
  by_status: Record<CharacterStatus, number>;
  by_power_level: Record<PowerLevel, number>;
  major_characters: number;
  pov_characters: number;
  total_relationships: number;
  most_connected_character: {
    character: Character;
    connection_count: number;
  };
  newest_character: Character;
  oldest_character: Character;
}

// For character creation/editing
export interface CreateCharacterInput {
  name: string;
  slug?: string;
  description: string;
  character_type: CharacterType;
  status: CharacterStatus;
  power_level: PowerLevel;
  importance_score: number;
  is_major_character: boolean;
  is_pov_character: boolean;
  portrait_file_id?: string;
  // ... other optional fields
}

export interface UpdateCharacterInput extends Partial<CreateCharacterInput> {
  id: string;
}