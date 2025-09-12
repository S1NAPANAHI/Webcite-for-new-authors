// Simple Supabase test script
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl || 'Not found');
console.log('Supabase Key:', supabaseKey ? '***' + supabaseKey.slice(-4) : 'Not found');

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple test query
async function testQuery() {
  try {
    console.log('\nTesting Supabase connection...');
    
    // Test connection
    const { data: timeData, error: timeError } = await supabase.rpc('now');
    if (timeError) throw timeError;
    console.log('✅ Connected to Supabase. Server time:', timeData);
    
    // Test subscriptions table
    console.log('\nTesting subscriptions table...');
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Error querying subscriptions table:', error);
      return;
    }
    
    console.log('✅ Successfully queried subscriptions table');
    console.log('Sample data:', data);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testQuery();
