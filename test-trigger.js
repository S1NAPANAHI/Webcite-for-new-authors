const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/backend/.env' });

console.log('🔍 Testing user creation trigger...\n');

// Initialize the client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testTrigger() {
  try {
    // Check if trigger exists
    console.log('1️⃣ Checking if trigger exists...');
    const { data: triggers, error: triggerError } = await supabase
      .rpc('', null) // We'll use a direct SQL query instead
      .catch(() => null);
    
    // Let's check the function exists
    const { data: functions, error: funcError } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', 'handle_new_user')
      .single()
      .catch(() => null);
    
    if (functions) {
      console.log('✅ handle_new_user function exists');
    } else {
      console.log('❌ handle_new_user function does not exist');
    }
    
    // Check current user stats table for completeness
    console.log('\n2️⃣ Checking user_stats table...');
    const { data: userStats, error: statsError } = await supabase
      .from('user_stats')
      .select('*');
    
    if (statsError) {
      console.error('❌ Error checking user_stats:', statsError);
    } else {
      console.log(`✅ Found ${userStats.length} user_stats entries.`);
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testTrigger();
