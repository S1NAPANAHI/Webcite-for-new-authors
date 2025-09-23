// GET /api/characters - Get all characters for gallery
// 🚀 ENHANCED CHARACTER LIST API WITH CLEAN SLUGS

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://opukvvmumyegtkukqint.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWt2dm11bXllZ3RrdWtxaW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDM3ODQsImV4cCI6MjA3MDg3OTc4NH0.rqMHc03LOI4z5j1V0b0LHeW6J1fCQOiBm-I10tF82_s'
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
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
    
    // Clean up slugs in response and ensure consistency
    const charactersWithCounts = characters.map(character => ({
      ...character,
      slug: character.slug ? character.slug.trim() : character.slug, // Clean up slug
      relationship_count: relationshipCounts[character.id] || 0,
      appearance_count: appearanceCounts[character.id] || 0,
      abilities_count: abilitiesCounts[character.id] || 0
    }));
    
    res.json({ characters: charactersWithCounts });
    
  } catch (error) {
    console.error('💥 Unexpected error fetching characters:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}