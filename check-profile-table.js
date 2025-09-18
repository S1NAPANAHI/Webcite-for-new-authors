const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkProfileTable() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('1. Checking if profiles table exists...');
    
    // Check if table exists
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', 'profiles');

    if (tablesError) throw tablesError;
    
    if (tables.length === 0) {
      console.error('❌ Error: profiles table does not exist in the database');
      console.log('\nPlease run the following SQL to create the table:');
      console.log(`
        create table public.profiles (
          id uuid not null references auth.users on delete cascade,
          username text,
          display_name text,
          bio text,
          location text,
          favorite_genre text,
          reading_goal integer default 0,
          books_read integer default 0,
          currently_reading integer default 0,
          reading_hours integer default 0,
          achievements_count integer default 0,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
          constraint profiles_pkey primary key (id)
        );
      `);
      return;
    }

    console.log('✅ profiles table exists');

    // Check table structure
    console.log('\n2. Checking table structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles');
    
    if (columnsError) throw columnsError;
    
    console.log('\nTable structure:');
    console.table(columns);

    // Check RLS policies
    console.log('\n3. Checking RLS policies...');
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { schema_name: 'public', table_name: 'profiles' });
    
    if (policiesError) {
      console.log('Could not fetch RLS policies (this might be normal):', policiesError.message);
    } else {
      console.log('\nRLS Policies:');
      console.table(policies);
    }

    // Check if there's any data
    console.log('\n4. Checking for existing profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, created_at')
      .limit(5);
    
    if (profilesError) throw profilesError;
    
    console.log(`\nFound ${profiles.length} profiles:`);
    console.table(profiles);

  } catch (error) {
    console.error('Error checking profile table:', error);
  }
}

checkProfileTable();
