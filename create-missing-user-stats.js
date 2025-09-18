const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/backend/.env' });

console.log('🔧 Creating missing user_stats entries...\n');

// Initialize the client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createMissingUserStats() {
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
    
    // 2. Get existing user_stats
    console.log('\n2️⃣ Fetching existing user_stats...');
    const { data: userStats, error: statsError } = await supabase
      .from('user_stats')
      .select('user_id');
    
    if (statsError) {
      console.error('❌ Error fetching user_stats:', statsError);
      return;
    }
    
    const existingStatsIds = new Set(userStats.map(s => s.user_id));
    console.log(`✅ Found ${userStats.length} existing user_stats entries.`);
    
    // 3. Find users without user_stats
    const usersWithoutStats = users.filter(user => !existingStatsIds.has(user.id));
    
    if (usersWithoutStats.length === 0) {
      console.log('\n✅ All users already have user_stats. No action needed.');
      return;
    }
    
    console.log(`\n3️⃣ Found ${usersWithoutStats.length} users without user_stats. Creating them...`);
    
    // 4. Create missing user_stats
    for (const user of usersWithoutStats) {
      console.log(`   Creating user_stats for user: ${user.email} (${user.id})`);
      
      const { data: newStats, error: createError } = await supabase
        .from('user_stats')
        .insert({
          user_id: user.id,
          books_read: 0,
          reading_hours: 0,
          achievements: 0,
          currently_reading: 'None'
        })
        .select()
        .single();
      
      if (createError) {
        console.error(`   ❌ Error creating user_stats for ${user.email}:`, createError);
      } else {
        console.log(`   ✅ Created user_stats for ${user.email}`);
      }
    }
    
    console.log('\n🎉 User stats creation process completed!');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

createMissingUserStats();
