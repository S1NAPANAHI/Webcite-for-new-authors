const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://opukvvmumyegtkukqint.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWt2dm11bXllZ3RrdWtxaW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDM3ODQsImV4cCI6MjA3MDg3OTc4NH0.rqMHc03LOI4z5j1V0b0LHeW6J1fCQOiBm-I10tF82_s'
);

async function checkTables() {
  console.log('Checking what tables exist in the database...\n');
  
  const tablesToCheck = [
    'subscriptions',
    'user_subscriptions', 
    'profiles',
    'purchases',
    'wiki_pages',
    'wiki_categories',
    'beta_applications',
    'subscription_plans',
    'stripe_customers'
  ];
  
  for (const table of tablesToCheck) {
    try {
      console.log(`Testing table: ${table}`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Table exists (${data ? data.length : 0} rows found)`);
        if (data && data.length > 0) {
          console.log(`   Sample columns:`, Object.keys(data[0]).join(', '));
        }
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
    console.log('');
  }
  
  // Test specific problematic queries
  console.log('\n=== Testing Specific Problem Queries ===\n');
  
  // Test subscriptions query that's failing
  try {
    console.log('Testing subscriptions query with status filter...');
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', 'f099bd07-8de8-48ca-9266-6ae28d79f7a6')
      .in('status', ['active', 'trialing']);
    
    if (error) {
      console.log('❌ Subscriptions query error:', error.message);
      console.log('   Error details:', error);
    } else {
      console.log('✅ Subscriptions query works:', data);
    }
  } catch (err) {
    console.log('❌ Subscriptions query exception:', err.message);
  }
  
  console.log('');
  
  // Test wiki_pages query that's failing
  try {
    console.log('Testing wiki_pages query...');
    const { data, error } = await supabase
      .from('wiki_pages')
      .select('id, title, excerpt, content, slug, created_by, folder_id, category_id, is_published, created_at, updated_at')
      .limit(1);
    
    if (error) {
      console.log('❌ Wiki pages query error:', error.message);
      console.log('   Error details:', error);
    } else {
      console.log('✅ Wiki pages query works:', data);
    }
  } catch (err) {
    console.log('❌ Wiki pages query exception:', err.message);
  }
}

checkTables();
