const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkTables() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey ? '***' + supabaseKey.slice(-4) : 'Not found');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Check auth state
    console.log('\n1. Checking auth state...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
    } else if (!session) {
      console.log('No active session. Please log in first.');
    } else {
      console.log('Authenticated as:', session.user.email);
    }

    // 2. Check if profiles table exists
    console.log('\n2. Checking profiles table...');
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (tablesError) throw tablesError;
    
    const tableNames = tables.map(t => t.tablename);
    console.log('Tables in public schema:', tableNames);
    
    const hasProfiles = tableNames.includes('profiles');
    console.log('\nProfiles table exists:', hasProfiles);

    if (hasProfiles) {
      // 3. Check profiles table structure
      console.log('\n3. Checking profiles table structure...');
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_schema', 'public')
        .eq('table_name', 'profiles');
      
      if (columnsError) throw columnsError;
      
      console.log('\nProfiles table structure:');
      console.table(columns);
      
      // 4. Check RLS policies
      console.log('\n4. Checking RLS policies...');
      const { data: policies, error: policiesError } = await supabase
        .rpc('get_policies', { schema_name: 'public', table_name: 'profiles' })
        .select('*');
      
      if (policiesError) {
        console.log('Error fetching RLS policies (this is normal if RPC is not set up):', policiesError.message);
      } else {
        console.log('\nRLS policies for profiles table:');
        console.table(policies);
      }
      
      // 5. Try to fetch a profile
      if (session?.user?.id) {
        console.log('\n5. Testing profile fetch...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (!profile) {
          console.log('No profile found for current user');
          
          // Try to create a profile
          console.log('\nAttempting to create a profile...');
          const newProfile = {
            id: session.user.id,
            username: session.user.email,
            display_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating profile:', createError);
          } else {
            console.log('Successfully created profile:', createdProfile);
          }
        } else {
          console.log('Profile found:', profile);
        }
      }
    } else {
      console.log('\nProfiles table does not exist. Please run the migration to create it.');
    }

  } catch (err) {
    console.error('Error checking tables:', err);
  }
}

checkTables();
