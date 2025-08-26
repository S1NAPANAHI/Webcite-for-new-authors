const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('🔍 Checking database connection...');
console.log('Using database host:', process.env.DB_HOST);
console.log('Using database port:', process.env.DB_PORT);
console.log('Using database name:', process.env.DB_NAME);
console.log('Using database user:', process.env.DB_USER);

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
    console.log('\n🔌 Attempting to connect to the database...');
    client = await pool.connect();
    console.log('✅ Successfully connected to the database');
    
    // Test a simple query
    console.log('\n🔍 Running test query...');
    const result = await client.query('SELECT version()');
    console.log('✅ Database version:', result.rows[0].version);
    
    // Check if products table exists
    try {
      const tables = await client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      console.log('\n📊 Available tables:', tables.rows.map(r => r.table_name).join(', '));
    } catch (err) {
      console.warn('⚠️ Could not list tables:', err.message);
    }
    
  } catch (err) {
    console.error('❌ Connection error:', err);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

testConnection().catch(console.error);
