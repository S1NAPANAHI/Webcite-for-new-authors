const { createClient } = require('@supabase/supabase-js');

// Load environment variables (you might need to adjust these paths)
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://opukvvmumyegtkukqint.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWt2dm11bXllZ3RrdWtxaW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDM3ODQsImV4cCI6MjA3MDg3OTc4NH0.rqMHc03LOI4z5j1V0b0LHeW6J1fCQOiBm-I10tF82_s'
);

async function testTableQueries() {
  console.log('Testing table queries...');
  
  try {
    // Test the old user_subscriptions table (should fail)
    console.log('\n1. Testing old user_subscriptions table (should fail):');
    const { data: oldData, error: oldError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .limit(1);
    
    if (oldError) {
      console.log('❌ Old table query failed as expected:', oldError.message);
    } else {
      console.log('⚠️ Old table still exists:', oldData);
    }
    
    // Test the new subscriptions table (should work)
    console.log('\n2. Testing new subscriptions table (should work):');
    const { data: newData, error: newError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    if (newError) {
      console.log('❌ New table query failed:', newError.message);
    } else {
      console.log('✅ New table query works:', newData || 'No data found');
    }
    
    // Test profiles table (should work)
    console.log('\n3. Testing profiles table:');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      console.log('❌ Profiles table query failed:', profileError.message);
    } else {
      console.log('✅ Profiles table query works:', profileData || 'No data found');
    }
    
    // Test stripe_customers table (should work)
    console.log('\n4. Testing stripe_customers table:');
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('*')
      .limit(1);
    
    if (customerError) {
      console.log('❌ Stripe customers table query failed:', customerError.message);
    } else {
      console.log('✅ Stripe customers table query works:', customerData || 'No data found');
    }
    
    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testTableQueries();
