const { createClient } = require('@supabase/supabase-js');

let supabase = null;

function initializeSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  }
  return supabase;
}

// Get a single row using Supabase
async function getRow(table, id) {
  const client = initializeSupabase();
  const { data, error } = await client
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Get multiple rows using Supabase
async function getRows(table, filters = {}) {
  const client = initializeSupabase();
  let query = client.from(table).select('*');
  
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Insert a row using Supabase
async function insert(table, data) {
  const client = initializeSupabase();
  const { data: result, error } = await client
    .from(table)
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

// Update a row using Supabase
async function update(table, id, data) {
  const client = initializeSupabase();
  const { data: result, error } = await client
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

// Remove a row using Supabase
async function remove(table, id) {
  const client = initializeSupabase();
  const { error } = await client
    .from(table)
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

module.exports = {
  getRow,
  getRows,
  insert,
  update,
  remove,
  supabase: initializeSupabase
};
