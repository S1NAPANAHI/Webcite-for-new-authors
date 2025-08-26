const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null; // Initialize supabase to null

if (supabaseUrl && supabaseServiceRoleKey) {
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
} else {
  console.warn('⚠️ Supabase environment variables are not fully set in userService.js. Supabase client will not be initialized.');
}

async function getAllUsers() {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Missing environment variables.');
  }
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;
  return data;
}

module.exports = { getAllUsers };