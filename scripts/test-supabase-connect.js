const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testConnection() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('Supabase Key:', supabaseKey ? '✅ Set' : '❌ Missing');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test connection by getting server timestamp
    const { data, error } = await supabase.rpc('now');
    
    if (error) throw error;
    
    console.log('✅ Successfully connected to Supabase');
    console.log('Server time:', data);
    
  } catch (error) {
    console.error('❌ Error connecting to Supabase:', error);
  }
}

testConnection();
