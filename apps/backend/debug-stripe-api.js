// Debug script to test the Stripe API endpoint
import './config.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testStripeEndpoint() {
  console.log('\n=== STRIPE API ENDPOINT DEBUG ===\n');
  
  // Check environment variables
  console.log('Environment Check:');
  console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set (hidden)' : '❌ NOT SET');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL || '❌ NOT SET');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set (hidden)' : '❌ NOT SET');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || '❌ NOT SET');
  console.log('');
  
  // Test server health
  try {
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3001';
    console.log(`Testing server health at: ${serverUrl}/api/health`);
    
    const healthResponse = await fetch(`${serverUrl}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Server is running:', healthData);
    } else {
      console.log('❌ Server health check failed:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Server is not responding:', error.message);
    console.log('Make sure your backend server is running on port 3001');
  }
  
  console.log('');
  
  // Test database connection
  try {
    console.log('Testing Supabase connection...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Supabase auth error:', authError.message);
    } else {
      console.log('✅ Supabase connection working');
      console.log(`Found ${authData.users.length} users in auth.users`);
    }
  } catch (error) {
    console.log('❌ Supabase connection failed:', error.message);
  }
  
  console.log('');
  
  // Check for required tables
  try {
    console.log('Checking database tables...');
    
    // Check profiles table
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (profilesError) {
      console.log('❌ profiles table error:', profilesError.message);
    } else {
      console.log('✅ profiles table exists');
    }
    
    // Check stripe_customers table
    const { data: stripeCustomersData, error: stripeCustomersError } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .limit(1);
      
    if (stripeCustomersError) {
      console.log('⚠️  stripe_customers table error:', stripeCustomersError.message);
      console.log('   This table will be created automatically when needed');
    } else {
      console.log('✅ stripe_customers table exists');
    }
    
    // Check subscriptions table
    const { data: subscriptionsData, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);
      
    if (subscriptionsError) {
      console.log('⚠️  subscriptions table error:', subscriptionsError.message);
      console.log('   This table will be created automatically when needed');
    } else {
      console.log('✅ subscriptions table exists');
    }
  } catch (error) {
    console.log('❌ Database table check failed:', error.message);
  }
  
  console.log('\n=== DEBUG COMPLETE ===');
  console.log('\n📋 Next Steps:');
  console.log('1. Make sure your backend server is running: cd apps/backend && npm run dev');
  console.log('2. Check that all environment variables are set correctly');
  console.log('3. Ensure your Supabase database has the required tables');
  console.log('4. Test the checkout flow in your browser with developer tools open');
  console.log('');
}

testStripeEndpoint().catch(console.error);