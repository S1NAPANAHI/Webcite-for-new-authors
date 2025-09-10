const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('=== Testing Supabase Connection ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? '***' + supabaseKey.slice(-4) : 'Not found');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfileAccess() {
  try {
    // 1. Test authentication
    console.log('\n1. Testing authentication...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) throw authError;
    
    if (!session) {
      console.log('ℹ️ No active session. Please log in first.');
      return;
    }
    
    console.log('✅ Authenticated as:', session.user.email);
    
    // 2. Test profiles table access
    console.log('\n2. Testing profiles table access...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();
    
    if (profileError) {
      if (profileError.code === '42P01') {
        console.error('❌ Profiles table does not exist');
        console.log('Please run the migration: 20250908064700_create_profiles_table.sql');
      } else {
        console.error('❌ Error accessing profiles table:', profileError);
      }
      return;
    }
    
    if (!profile) {
      console.log('ℹ️ No profile found. Creating one...');
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: session.user.id,
            username: session.user.email,
            display_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (createError) throw createError;
      
      console.log('✅ Created profile:', {
        id: newProfile.id,
        username: newProfile.username,
        display_name: newProfile.display_name
      });
    } else {
      console.log('✅ Profile found:', {
        id: profile.id,
        username: profile.username,
        display_name: profile.display_name
      });
    }
    
    console.log('\n✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testProfileAccess();
