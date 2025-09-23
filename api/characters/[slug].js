// GET /api/characters/:slug - Get single character by slug
// 🔧 ENHANCED CHARACTER LOOKUP WITH ROBUST FALLBACK STRATEGY

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
    const { slug } = req.query;
    const cleanSlug = slug.trim().toLowerCase();
    
    console.log(`🔍 Looking for character with slug: "${cleanSlug}"`);
    
    // Try exact match first
    let { data: character, error } = await supabase
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
      .eq('slug', cleanSlug)
      .single();
    
    if (error && error.code === 'PGRST116') {
      console.log('📋 Exact match failed, trying fallback with all characters...');
      
      // Fallback: Get all characters and match with trimmed slugs
      const { data: allCharacters, error: allError } = await supabase
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
        `);
      
      if (allError) {
        console.error('❌ Error fetching all characters:', allError);
        return res.status(500).json({ error: 'Database error', details: allError.message });
      }
      
      // Find character with matching trimmed slug
      character = allCharacters.find(c => 
        c.slug && c.slug.trim().toLowerCase() === cleanSlug
      );
      
      if (!character) {
        console.log(`❌ Character not found for slug: "${cleanSlug}"`);
        console.log(`📋 Available slugs:`, allCharacters.map(c => `"${c.slug}"`));
        return res.status(404).json({ 
          error: 'Character not found', 
          slug: cleanSlug,
          availableSlugs: allCharacters.map(c => c.slug?.trim())
        });
      }
    }
    
    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }
    
    // Clean the character data
    if (character.slug) {
      character.slug = character.slug.trim();
    }
    
    console.log(`✅ Found character: ${character.name} (slug: "${character.slug}")`);
    
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
    console.error('❌ Server error in character lookup:', error);
    res.status(500).json({ error: 'Server error' });
  }
}