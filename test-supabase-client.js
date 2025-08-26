const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/backend/.env' });

console.log('Testing Supabase client connection...');

// Initialize the client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Service Role Key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test a simple query
    const { data, error } = await supabase
      .from('profiles')  // Change this to an existing table in your database
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase query error:', error);
      return;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('Data sample:', data);
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testConnection();
