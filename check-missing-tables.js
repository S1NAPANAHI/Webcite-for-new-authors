const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/backend/.env' });

console.log('🔍 Checking for missing tables...\n');

// Initialize the client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkTables() {
  try {
    const tablesToCheck = [
      'profiles',
      'user_activities', 
      'subscriptions',
      'user_stats',
      'works',
      'chapters',
      'posts',
      'products',
      'prices'
    ];
    
    console.log('📋 Checking tables existence and contents...\n');
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          if (error.message.includes('does not exist') || error.code === 'PGRST106') {
            console.log(`❌ Table '${tableName}' does not exist`);
          } else {
            console.log(`⚠️  Table '${tableName}' exists but has error:`, error.message);
          }
        } else {
          const count = data?.length || 0;
          console.log(`✅ Table '${tableName}' exists with ${count} rows`);
        }
      } catch (err) {
        console.log(`❌ Table '${tableName}' - Error:`, err.message);
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

checkTables();
