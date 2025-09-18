const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/backend/.env' });

console.log('🔧 Creating missing user profile...\n');

// Initialize the client with service role key (has admin privileges)
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

async function createMissingProfiles() {
  try {
    // 1. Get all authenticated users
    console.log('1️⃣ Fetching authenticated users...');
    const { data: usersResponse, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }
    
    const users = usersResponse.users;
    console.log(`✅ Found ${users.length} authenticated users.`);
    
    // 2. Get existing profiles
    console.log('\n2️⃣ Fetching existing profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id');
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }
    
    const existingProfileIds = new Set(profiles.map(p => p.id));
    console.log(`✅ Found ${profiles.length} existing profiles.`);
    
    // 3. Find users without profiles
    const usersWithoutProfiles = users.filter(user => !existingProfileIds.has(user.id));
    
    if (usersWithoutProfiles.length === 0) {
      console.log('\n✅ All users already have profiles. No action needed.');
      return;
    }
    
    console.log(`\n3️⃣ Found ${usersWithoutProfiles.length} users without profiles. Creating them...`);
    
    // 4. Create missing profiles
    for (const user of usersWithoutProfiles) {
      console.log(`   Creating profile for user: ${user.email} (${user.id})`);
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: user.email?.split('@')[0] || null, // Use email prefix as username
          display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email,
          role: 'user',
          subscription_status: 'inactive',
          beta_reader_status: 'not_applied'
        })
        .select()
        .single();
      
      if (createError) {
        console.error(`   ❌ Error creating profile for ${user.email}:`, createError);
      } else {
        console.log(`   ✅ Created profile for ${user.email}`);
      }
    }
    
    console.log('\n🎉 Profile creation process completed!');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

createMissingProfiles();
