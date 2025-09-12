const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndFixProfiles() {
  try {
    console.log('Checking profiles table...');
    
    // Check if profiles table exists
    const { data: tableExists, error: tableError } = await supabase
      .rpc('table_exists', { table_name: 'profiles' });
    
    if (tableError) throw tableError;
    
    if (!tableExists) {
      console.log('Profiles table does not exist. Please run the migration first.');
      return;
    }
    
    // Get all auth users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;
    
    console.log(`Found ${users.length} auth users`);
    
    // Check each user has a profile
    for (const user of users) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error(`Error checking profile for user ${user.id}:`, profileError);
        continue;
      }
      
      if (!profile) {
        console.log(`Creating profile for user ${user.id} (${user.email})`);
        
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: user.email,
            display_name: user.user_metadata?.full_name || user.email.split('@')[0],
            created_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error(`Error creating profile for user ${user.id}:`, insertError);
        } else {
          console.log(`Created profile for user ${user.id}`);
        }
      }
    }
    
    console.log('Profile check completed');
    
  } catch (error) {
    console.error('Error in checkAndFixProfiles:', error);
  }
}

checkAndFixProfiles();
