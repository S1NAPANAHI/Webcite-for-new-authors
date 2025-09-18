const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/backend/.env' });

console.log('🔍 Checking tables with proper authentication...\n');

// Initialize the client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: { schema: 'public' },
  global: { headers: { 'Authorization': `Bearer ${supabaseKey}` } }
});

async function checkTablesRLS() {
  try {
    // Test profiles table specifically
    console.log('1️⃣ Testing profiles table directly...');
    
    const { data: profiles, error: profilesError, count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });
    
    if (profilesError) {
      console.error('❌ Profiles error:', profilesError);
    } else {
      console.log(`✅ Profiles: Found ${profilesCount} rows, data length: ${profiles?.length || 0}`);
      if (profiles && profiles.length > 0) {
        console.log('📄 First profile:', profiles[0]);
      }
    }
    
    // Test subscriptions table
    console.log('\n2️⃣ Testing subscriptions table...');
    const { data: subscriptions, error: subError, count: subCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact' });
    
    if (subError) {
      console.error('❌ Subscriptions error:', subError);
    } else {
      console.log(`✅ Subscriptions: Found ${subCount} rows, data length: ${subscriptions?.length || 0}`);
    }
    
    // Test user_activities table
    console.log('\n3️⃣ Testing user_activities table...');
    const { data: activities, error: actError, count: actCount } = await supabase
      .from('user_activities')
      .select('*', { count: 'exact' });
    
    if (actError) {
      console.error('❌ User activities error:', actError);
    } else {
      console.log(`✅ User activities: Found ${actCount} rows, data length: ${activities?.length || 0}`);
    }
    
    // Test with specific user ID
    console.log('\n4️⃣ Testing queries with specific user ID...');
    const userId = 'f099bd07-8de8-48ca-9266-6ae28d79f7a6';
    
    const { data: userProfile, error: userProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);
    
    if (userProfileError) {
      console.error('❌ User profile query error:', userProfileError);
    } else {
      console.log(`✅ User profile query: Found ${userProfile?.length || 0} rows`);
      if (userProfile && userProfile.length > 0) {
        console.log('📄 User profile data:', userProfile[0]);
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

checkTablesRLS();
