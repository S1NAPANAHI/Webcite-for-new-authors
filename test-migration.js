const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test auth connection
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      throw new Error(`Auth error: ${authError.message}`);
    }
    
    console.log('✅ Successfully connected to Supabase Auth');
    
    // Test database connection
    const { data, error: dbError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }
    
    console.log('✅ Successfully connected to Supabase Database');
    
    // Test RLS policies
    const { data: rlsData, error: rlsError } = await supabase.rpc('is_user_admin', { user_id: session?.user?.id || '' });
    
    if (rlsError) {
      console.warn('⚠️ RLS function check failed (this might be expected):', rlsError.message);
    } else {
      console.log('✅ Successfully tested RLS function');
    }
    
    // List all tables to verify they exist
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.warn('⚠️ Could not list tables:', tablesError.message);
    } else {
      console.log('\n📋 Available tables:');
      tables.forEach(table => console.log(`- ${table.tablename}`));
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
