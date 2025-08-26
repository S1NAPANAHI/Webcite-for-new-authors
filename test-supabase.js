const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Supabase connection...');

// Load environment variables from the correct .env file
const envPath = path.resolve(__dirname, 'apps/backend/.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('✅ Loaded .env file from:', envPath);
} else {
  console.error('❌ .env file not found at:', envPath);
  process.exit(1);
}

// Create a direct connection to Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    require: true
  },
  connectionTimeoutMillis: 10000
});

async function testConnection() {
  let client;
  try {
    console.log('\n🔌 Connecting to Supabase...');
    console.log('Connection string:', process.env.DATABASE_URL
      ? process.env.DATABASE_URL.replace(/:([^:]+)@/, ':***@') // Mask password
      : 'Not set');
    
    client = await pool.connect();
    console.log('✅ Successfully connected to Supabase');
    
    // Test a simple query
    console.log('\n🔍 Running test query...');
    const result = await client.query('SELECT version()');
    console.log('📊 Database version:', result.rows[0].version);
    
    // List all tables
    try {
      const tables = await client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      console.log('\n📋 Available tables:', tables.rows.map(r => r.table_name).join(', '));
    } catch (err) {
      console.warn('⚠️ Could not list tables:', err.message);
    }
    
  } catch (err) {
    console.error('\n❌ Connection error:', err);
    console.error('Error details:', {
      code: err.code,
      message: err.message,
      stack: err.stack
    });
  } finally {
    if (client) {
      client.release();
      console.log('\n🔌 Connection released');
    }
    await pool.end();
  }
}

// Run the test
testConnection().catch(console.error);
