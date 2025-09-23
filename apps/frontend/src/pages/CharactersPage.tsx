import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Star,
  Crown,
  Eye,
  BarChart3,
  Loader,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { Character, CharacterFilters as ICharacterFilters, CharacterSortOptions } from '../types/character';
import { filterCharacters, getCharacterStats } from '../utils/characterUtils';
import { supabase } from '@zoroaster/shared';
import CharacterCard from '../components/characters/CharacterCard';
import CharacterFilters from '../components/characters/CharacterFilters';
import CharacterGrid from '../components/characters/CharacterGrid';

const CharactersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter and sort state
  const [filters, setFilters] = useState<ICharacterFilters>({
    search: searchParams.get('search') || undefined,
    character_types: searchParams.getAll('type') as any[] || undefined,
    statuses: searchParams.getAll('status') as any[] || undefined,
  });
  
  const [sortOptions, setSortOptions] = useState<CharacterSortOptions>({
    field: (searchParams.get('sort') as any) || 'importance_score',
    direction: (searchParams.get('dir') as 'asc' | 'desc') || 'desc'
  });

  // Memoized filtered and sorted characters
  const filteredCharacters = useMemo(() => {
    return filterCharacters(characters, filters);
  }, [characters, filters]);

  // Character statistics
  const stats = useMemo(() => {
    return getCharacterStats(characters);
  }, [characters]);

  // Featured characters (top importance)
  const featuredCharacters = useMemo(() => {
    return characters
      .filter(c => c.importance_score >= 75)
      .sort((a, b) => b.importance_score - a.importance_score)
      .slice(0, 6);
  }, [characters]);

  // Available factions for filtering
  const availableFactions = useMemo(() => {
    const factions = new Set<string>();
    characters.forEach(character => {
      if (character.primary_faction) factions.add(character.primary_faction);
      if (character.allegiances) {
        character.allegiances.forEach(allegiance => factions.add(allegiance));
      }
    });
    return Array.from(factions).sort();
  }, [characters]);

  useEffect(() => {
    loadCharacters();
  }, []);

  // Update URL params when filters/sort change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (filters.search) newParams.set('search', filters.search);
    if (filters.character_types) filters.character_types.forEach(type => newParams.append('type', type));
    if (filters.statuses) filters.statuses.forEach(status => newParams.append('status', status));
    if (sortOptions.field !== 'importance_score') newParams.set('sort', sortOptions.field);
    if (sortOptions.direction !== 'desc') newParams.set('dir', sortOptions.direction);
    
    setSearchParams(newParams, { replace: true });
  }, [filters, sortOptions, setSearchParams]);

  // FIXED: Simple query to avoid PostgREST relationship issues
  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('\ud83d\udd0d Loading characters for public page...');
      
      // Try to load from database first
      const { data, error } = await supabase
        .from('characters')
        .select(`
          id,
          name,
          slug,
          title,
          aliases,
          description,
          character_type,
          status,
          power_level,
          importance_score,
          is_major_character,
          is_pov_character,
          portrait_url,
          color_theme,
          primary_faction,
          species,
          personality_traits,
          background_summary,
          age,
          gender,
          occupation,
          location,
          origin,
          allegiances,
          created_at
        `)
        .eq('is_spoiler_sensitive', false) // Only show non-spoiler characters on public page
        .order('importance_score', { ascending: false });
      
      if (error) {
        console.error('\u274c Error loading characters from database:', error);
        // Fall back to sample data
        console.log('\ud83d\udd04 Using sample characters as fallback');
        loadSampleCharacters();
        return;
      }
      
      if (!data || data.length === 0) {
        console.log('\u26a0\ufe0f No characters found in database, using sample data');
        loadSampleCharacters();
        return;
      }
      
      console.log(`\u2705 Loaded ${data.length} characters from database`);
      
      // Add default counts for display
      const charactersWithStats = data.map(character => ({
        ...character,
        appearance_count: Math.floor(Math.random() * 30) + 5, // Mock data until relationships are implemented
        relationship_count: Math.floor(Math.random() * 10) + 2 // Mock data until relationships are implemented
      }));
      
      setCharacters(charactersWithStats);
      
    } catch (error: any) {
      console.error('\ud83d\udca5 Error loading characters:', error);
      console.log('\ud83d\udd04 Using sample characters as fallback');
      loadSampleCharacters();
    } finally {
      setLoading(false);
    }
  };

  // Fallback sample data
  const loadSampleCharacters = () => {
    const sampleCharacters: Character[] = [
      {
        id: '1',
        name: 'Zoroaster Zarathustra',
        slug: 'zoroaster-zarathustra',
        title: 'The Prophet',
        aliases: ['Zarathustra', 'The Blessed One'],
        description: 'The central figure of Zoroastrianism and the founding prophet of the religion. A wise teacher who received divine revelations and established the principles of good thoughts, good words, and good deeds.',
        character_type: 'protagonist',
        status: 'immortal',
        power_level: 'divine',
        importance_score: 100,
        is_major_character: true,
        is_pov_character: true,
        age_description: 'Ancient',
        species: 'Human (Divinely Blessed)',
        occupation: 'Prophet, Teacher',
        location: 'The Sacred Flame Temple',
        origin: 'Ancient Persia',
        personality_traits: ['Wise', 'Compassionate', 'Determined', 'Righteous'],
        primary_faction: 'Forces of Light',
        allegiances: ['Ahura Mazda', 'Followers of Truth'],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        created_by_user_id: 'user-1',
        appearance_count: 45,
        relationship_count: 12
      },
      {
        id: '2',
        name: 'Angra Mainyu',
        slug: 'angra-mainyu',
        title: 'The Destructive Spirit',
        aliases: ['Ahriman', 'The Dark Lord'],
        description: 'The primary antagonist representing destruction, darkness, and evil in Zoroastrian theology. The eternal opponent of Ahura Mazda and all that is good.',
        character_type: 'antagonist',
        status: 'immortal',
        power_level: 'divine',
        importance_score: 95,
        is_major_character: true,
        is_pov_character: false,
        species: 'Divine Entity',
        occupation: 'Destructive Force',
        location: 'The Realm of Darkness',
        origin: 'Primordial Existence',
        personality_traits: ['Malevolent', 'Cunning', 'Destructive', 'Deceitful'],
        primary_faction: 'Forces of Darkness',
        allegiances: ['Daevas', 'Followers of Lies'],
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        created_by_user_id: 'user-1',
        appearance_count: 38,
        relationship_count: 8
      },
      {
        id: '3',
        name: 'Spenta Armaiti',
        slug: 'spenta-armaiti',
        title: 'Holy Devotion',
        description: 'One of the Amesha Spentas, divine beings who serve Ahura Mazda. She represents devotion, serenity, and loving kindness.',
        character_type: 'supporting',
        status: 'immortal',
        power_level: 'divine',
        importance_score: 80,
        is_major_character: true,
        is_pov_character: false,
        species: 'Amesha Spenta',
        occupation: 'Divine Guardian',
        location: 'The Heavenly Realm',
        origin: 'Divine Creation',
        personality_traits: ['Devotional', 'Serene', 'Kind', 'Protective'],
        primary_faction: 'Forces of Light',
        allegiances: ['Ahura Mazda', 'Amesha Spentas'],
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-03T00:00:00Z',
        created_by_user_id: 'user-1',
        appearance_count: 22,
        relationship_count: 6
      },
      {
        id: '4',
        name: 'King Vishtaspa',
        slug: 'vishtaspa',
        title: 'Royal Patron',
        description: 'The first royal patron of Zoroaster, King Vishtaspa was crucial in spreading the Zoroastrian faith throughout his kingdom and beyond.',
        character_type: 'supporting',
        status: 'deceased',
        power_level: 'enhanced',
        importance_score: 70,
        is_major_character: true,
        is_pov_character: true,
        age: 65,
        species: 'Human',
        occupation: 'King',
        location: 'Bactria',
        origin: 'Royal Bloodline',
        personality_traits: ['Noble', 'Just', 'Brave', 'Faithful'],
        primary_faction: 'Kingdom of Bactria',
        allegiances: ['Zoroaster', 'Forces of Light'],
        created_at: '2023-01-04T00:00:00Z',
        updated_at: '2023-01-04T00:00:00Z',
        created_by_user_id: 'user-1',
        appearance_count: 18,
        relationship_count: 9
      },
      {
        id: '5',
        name: 'Jamasp',
        slug: 'jamasp',
        title: 'The Wise Counselor',
        description: 'A close disciple and advisor to Zoroaster, known for his wisdom and his ability to interpret divine visions.',
        character_type: 'supporting',
        status: 'alive',
        power_level: 'enhanced',
        importance_score: 60,
        is_major_character: false,
        is_pov_character: false,
        age: 45,
        species: 'Human',
        occupation: 'Counselor, Priest',
        location: 'Various Temples',
        origin: 'Learned Family',
        personality_traits: ['Wise', 'Patient', 'Insightful', 'Loyal'],
        primary_faction: 'Zoroastrian Clergy',
        allegiances: ['Zoroaster', 'Forces of Light'],
        created_at: '2023-01-05T00:00:00Z',
        updated_at: '2023-01-05T00:00:00Z',
        created_by_user_id: 'user-1',
        appearance_count: 14,
        relationship_count: 5
      },
      {
        id: '6',
        name: 'Hvovi',
        slug: 'hvovi',
        title: 'The Faithful Wife',
        description: 'Zoroaster\'s devoted wife who supported him throughout his prophetic mission and helped establish many of the early Zoroastrian communities.',
        character_type: 'supporting',
        status: 'deceased',
        power_level: 'mortal',
        importance_score: 55,
        is_major_character: false,
        is_pov_character: true,
        age: 58,
        gender: 'Female',
        species: 'Human',
        occupation: 'Community Leader',
        location: 'Various Settlements',
        origin: 'Noble Family',
        personality_traits: ['Devoted', 'Strong', 'Supportive', 'Organized'],
        primary_faction: 'Zoroastrian Community',
        allegiances: ['Zoroaster', 'Forces of Light'],
        created_at: '2023-01-06T00:00:00Z',
        updated_at: '2023-01-06T00:00:00Z',
        created_by_user_id: 'user-1',
        appearance_count: 12,
        relationship_count: 4
      }
    ];
    
    console.log('\u2705 Using sample character data');
    setCharacters(sampleCharacters);
  };

  const handleCharacterClick = (character: Character) => {
    // TODO: Navigate to character detail page
    console.log('\ud83d\udd0d Clicked character:', character.name);
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: number;
    color?: string;
  }> = ({ icon, label, value, color = 'text-primary' }) => (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center gap-3">
        <div className={`${color}`}>{icon}</div>
        <div>
          <div className="text-2xl font-bold text-foreground">{value.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Loading Characters</h3>
              <p className="text-muted-foreground">Fetching character data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load Characters</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={loadCharacters}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Characters</h1>
              <p className="text-xl text-muted-foreground">
                Explore the rich cast of characters in the Zoroasterverse
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                showFilters 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard 
              icon={<Users className="w-6 h-6" />} 
              label="Total Characters" 
              value={stats.total} 
            />
            <StatCard 
              icon={<Crown className="w-6 h-6" />} 
              label="Major Characters" 
              value={stats.major} 
              color="text-yellow-500"
            />
            <StatCard 
              icon={<Eye className="w-6 h-6" />} 
              label="POV Characters" 
              value={stats.pov} 
              color="text-blue-500"
            />
            <StatCard 
              icon={<TrendingUp className="w-6 h-6" />} 
              label="Total Appearances" 
              value={characters.reduce((sum, c) => sum + (c.appearance_count || 0), 0)} 
              color="text-green-500"
            />
          </div>
        </div>

        {/* Featured Characters */}
        {featuredCharacters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Characters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  variant="detailed"
                  onClick={handleCharacterClick}
                  showRelationships={true}
                  showAppearances={true}
                  className="featured-character-card"
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`${showFilters ? 'grid grid-cols-1 lg:grid-cols-4 gap-8' : ''}`}>
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CharacterFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  totalCount={characters.length}
                  filteredCount={filteredCharacters.length}
                  availableFactions={availableFactions}
                />
              </div>
            </div>
          )}

          {/* Character Grid */}
          <div className={showFilters ? 'lg:col-span-3' : 'w-full'}>
            <CharacterGrid
              characters={filteredCharacters}
              sortOptions={sortOptions}
              onSortChange={setSortOptions}
              onCharacterClick={handleCharacterClick}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharactersPage;