const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/backend/.env' });

console.log('🔍 Debugging profile loading issue...\n');

// Initialize the client
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

async function debugProfileIssue() {
  try {
    // 1. Check if profiles table exists and its structure
    console.log('1️⃣ Checking profiles table structure...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (profilesError) {
      console.error('❌ Error querying profiles table:', profilesError);
      return;
    }
    
    console.log(`✅ Profiles table exists. Found ${profiles.length} profiles.`);
    if (profiles.length > 0) {
      console.log('📄 Sample profile:', profiles[0]);
    }
    
    // 2. Check auth.users table to see if there are authenticated users
    console.log('\n2️⃣ Checking auth.users table...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error querying auth.users:', usersError);
      return;
    }
    
    console.log(`✅ Found ${users.users.length} authenticated users.`);
    
    // 3. Check for users with missing profiles
    console.log('\n3️⃣ Checking for users without profiles...');
    const userIds = users.users.map(user => user.id);
    const profileUserIds = profiles.map(profile => profile.id);
    const usersWithoutProfiles = userIds.filter(id => !profileUserIds.includes(id));
    
    if (usersWithoutProfiles.length > 0) {
      console.log(`⚠️  Found ${usersWithoutProfiles.length} users without profiles:`);
      usersWithoutProfiles.forEach((userId, index) => {
        const user = users.users.find(u => u.id === userId);
        console.log(`   ${index + 1}. User ID: ${userId} (Email: ${user?.email || 'N/A'})`);
      });
    } else {
      console.log('✅ All authenticated users have profiles.');
    }
    
    // 4. Show example of the failing query
    if (userIds.length > 0) {
      console.log('\n4️⃣ Testing the failing query with a real user ID...');
      const testUserId = userIds[0];
      
      const { data: singleProfile, error: singleError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', testUserId)
        .single();
      
      if (singleError) {
        console.error('❌ Single profile query error (this is the error user sees):', singleError);
      } else {
        console.log('✅ Single profile query succeeded:', singleProfile);
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

debugProfileIssue();
