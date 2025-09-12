const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    console.log('=== Checking Database ===');
    
    // 1. Check if profiles table exists and get its structure
    console.log('\n1. Checking profiles table...');
    const { data: profilesTable, error: profilesError } = await supabase
      .from('pg_tables')
      .select('*')
      .eq('schemaname', 'public')
      .eq('tablename', 'profiles');
    
    if (profilesError) throw profilesError;
    
    if (profilesTable.length === 0) {
      console.log('❌ Profiles table does not exist');
      console.log('Please run the migration: 20250908064700_create_profiles_table.sql');
      return;
    }
    
    console.log('✅ Profiles table exists');
    
    // 2. Get profiles table columns
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles');
    
    if (columnsError) throw columnsError;
    
    console.log('\nProfiles table structure:');
    console.table(columns);
    
    // 3. Check if there are any users
    console.log('\n2. Checking auth users...');
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) throw usersError;
    
    console.log(`Found ${users.length} auth users`);
    
    if (users.length === 0) {
      console.log('No auth users found. Please sign up first.');
      return;
    }
    
    // 4. Check profiles for each user
    console.log('\n3. Checking user profiles...');
    for (const user of users) {
      console.log(`\nChecking profile for user: ${user.email} (${user.id})`);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        continue;
      }
      
      if (!profile) {
        console.log('❌ No profile found for this user');
      } else {
        console.log('✅ Profile exists:', {
          username: profile.username,
          display_name: profile.display_name,
          created_at: profile.created_at
        });
      }
    }
    
    console.log('\n=== Database Check Complete ===');
    
  } catch (error) {
    console.error('Error in checkDatabase:', error);
  }
}

checkDatabase();
