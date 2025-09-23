import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// GET /api/characters - Get all characters for gallery
router.get('/', async (req, res) => {
  try {
    console.log('📚 Fetching all characters for gallery...');
    
    const { data: characters, error } = await supabase
      .from('characters')
      .select(`
        id,
        name,
        slug,
        title,
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
        occupation,
        location,
        age_description,
        personality_traits,
        created_at,
        updated_at
      `)
      .order('importance_score', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching characters:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch characters', 
        details: error.message 
      });
    }
    
    if (!characters || characters.length === 0) {
      console.log('⚠️ No characters found in database');
      return res.json({ characters: [] });
    }
    
    console.log(`✅ Successfully fetched ${characters.length} characters`);
    
    // Get relationship and appearance counts for each character
    const characterIds = characters.map(c => c.id);
    
    let relationshipCounts = {};
    let appearanceCounts = {};
    let abilitiesCounts = {};
    
    if (characterIds.length > 0) {
      // Get relationship counts
      try {
        const { data: relationships } = await supabase
          .from('character_relationships')
          .select('character_id')
          .in('character_id', characterIds);
        
        relationships?.forEach(rel => {
          relationshipCounts[rel.character_id] = (relationshipCounts[rel.character_id] || 0) + 1;
        });
      } catch (err) {
        console.log('ℹ️ Relationships table not available yet');
      }
      
      // Get appearance counts
      try {
        const { data: appearances } = await supabase
          .from('character_appearances')
          .select('character_id')
          .in('character_id', characterIds);
        
        appearances?.forEach(app => {
          appearanceCounts[app.character_id] = (appearanceCounts[app.character_id] || 0) + 1;
        });
      } catch (err) {
        console.log('ℹ️ Appearances table not available yet');
      }
      
      // Get abilities counts
      try {
        const { data: abilities } = await supabase
          .from('character_abilities')
          .select('character_id')
          .in('character_id', characterIds);
        
        abilities?.forEach(ability => {
          abilitiesCounts[ability.character_id] = (abilitiesCounts[ability.character_id] || 0) + 1;
        });
      } catch (err) {
        console.log('ℹ️ Abilities table not available yet');
      }
    }
    
    // Combine data with counts
    const charactersWithCounts = characters.map(character => ({
      ...character,
      relationship_count: relationshipCounts[character.id] || 0,
      appearance_count: appearanceCounts[character.id] || 0,
      abilities_count: abilitiesCounts[character.id] || 0
    }));
    
    res.json(charactersWithCounts);
    
  } catch (error) {
    console.error('💥 Unexpected error fetching characters:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

// GET /api/characters/:slug - Get individual character by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`🔍 Fetching character with slug: ${slug}`);
    
    if (!slug) {
      return res.status(400).json({ error: 'Character slug is required' });
    }
    
    // Get character basic data
    const { data: character, error: characterError } = await supabase
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
        age,
        age_description,
        gender,
        species,
        occupation,
        location,
        origin,
        height,
        build,
        hair_color,
        eye_color,
        distinguishing_features,
        personality_traits,
        background_summary,
        motivations,
        fears,
        goals,
        skills,
        weaknesses,
        character_arc_summary,
        primary_faction,
        allegiances,
        is_major_character,
        is_pov_character,
        is_spoiler_sensitive,
        spoiler_tags,
        meta_description,
        meta_keywords,
        portrait_url,
        color_theme,
        quote,
        created_at,
        updated_at
      `)
      .eq('slug', slug)
      .single();
    
    if (characterError || !character) {
      console.log(`❌ Character not found with slug: ${slug}`);
      return res.status(404).json({ 
        error: 'Character not found', 
        slug: slug 
      });
    }
    
    console.log(`✅ Found character: ${character.name}`);
    
    // Get character abilities
    let abilities = [];
    try {
      const { data: abilitiesData, error: abilitiesError } = await supabase
        .from('character_abilities')
        .select(`
          id,
          name,
          description,
          category,
          mastery_level
        `)
        .eq('character_id', character.id)
        .order('mastery_level', { ascending: false });
      
      if (!abilitiesError && abilitiesData) {
        abilities = abilitiesData;
        console.log(`📋 Loaded ${abilities.length} abilities`);
      }
    } catch (err) {
      console.log('ℹ️ Abilities table not available yet');
    }
    
    // Get character relationships
    let relationships = [];
    try {
      const { data: relationshipsData, error: relationshipsError } = await supabase
        .from('character_relationships')
        .select(`
          id,
          related_character_name,
          relationship_type,
          strength,
          description
        `)
        .eq('character_id', character.id)
        .order('strength', { ascending: false });
      
      if (!relationshipsError && relationshipsData) {
        relationships = relationshipsData;
        console.log(`👥 Loaded ${relationships.length} relationships`);
      }
    } catch (err) {
      console.log('ℹ️ Relationships table not available yet');
    }
    
    // Get character appearances
    let appearances = [];
    try {
      const { data: appearancesData, error: appearancesError } = await supabase
        .from('character_appearances')
        .select(`
          id,
          content_title,
          content_type,
          significance,
          is_major_appearance
        `)
        .eq('character_id', character.id)
        .order('is_major_appearance', { ascending: false });
      
      if (!appearancesError && appearancesData) {
        appearances = appearancesData;
        console.log(`📚 Loaded ${appearances.length} appearances`);
      }
    } catch (err) {
      console.log('ℹ️ Appearances table not available yet');
    }
    
    // Combine all character data
    const fullCharacterData = {
      ...character,
      abilities,
      relationships,
      appearances
    };
    
    console.log(`🎉 Successfully compiled full character data for: ${character.name}`);
    res.json(fullCharacterData);
    
  } catch (error) {
    console.error('💥 Unexpected error fetching character:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

// GET /api/characters/:slug/relationships - Get character relationships
router.get('/:slug/relationships', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // First get the character ID from slug
    const { data: character } = await supabase
      .from('characters')
      .select('id, name')
      .eq('slug', slug)
      .single();
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    // Get relationships
    const { data: relationships, error } = await supabase
      .from('character_relationships')
      .select(`
        id,
        related_character_name,
        relationship_type,
        strength,
        description,
        is_mutual,
        created_at
      `)
      .eq('character_id', character.id)
      .order('strength', { ascending: false });
    
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch relationships' });
    }
    
    res.json({ 
      character: character.name,
      relationships: relationships || [] 
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

// GET /api/characters/:slug/abilities - Get character abilities
router.get('/:slug/abilities', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // First get the character ID from slug
    const { data: character } = await supabase
      .from('characters')
      .select('id, name')
      .eq('slug', slug)
      .single();
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    // Get abilities
    const { data: abilities, error } = await supabase
      .from('character_abilities')
      .select(`
        id,
        name,
        description,
        category,
        mastery_level,
        power_source,
        limitations,
        created_at
      `)
      .eq('character_id', character.id)
      .order('mastery_level', { ascending: false });
    
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch abilities' });
    }
    
    res.json({ 
      character: character.name,
      abilities: abilities || [] 
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

export default router;