const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkProfiles() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Try to query the profiles table directly
    console.log('1. Trying to query profiles table...');
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (error) {
      console.error('Error querying profiles table:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      if (error.code === '42P01') { // Table doesn't exist
        console.error('\n❌ The profiles table does not exist in your database.');
        console.log('\nYou need to run the following SQL in your Supabase SQL editor:');
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
          
          -- Enable RLS
          alter table public.profiles enable row level security;
          
          -- Create policies
          create policy "Public profiles are viewable by everyone." 
          on profiles for select 
          using (true);
          
          create policy "Users can insert their own profile." 
          on profiles for insert 
          with check (auth.uid() = id);
          
          create policy "Users can update own profile." 
          on profiles for update 
          using (auth.uid() = id);
        `);
      }
      return;
    }

    console.log('✅ Successfully queried profiles table');
    console.log(`\nFound ${profiles.length} profiles:`);
    console.table(profiles);

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkProfiles();
