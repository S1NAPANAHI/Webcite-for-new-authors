const { Client } = require('pg');
require('dotenv').config();

console.log('Testing database connection...');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
    require: true
  },
  connectionTimeoutMillis: 10000
});

async function test() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database!');
    
    const res = await client.query('SELECT version()');
    console.log('📊 Database version:', res.rows[0].version);
    
    // Test querying a table
    try {
      const tables = await client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      console.log('\n📋 Available tables:', tables.rows.map(r => r.table_name).join(', '));
    } catch (err) {
      console.warn('⚠️ Could not list tables:', err.message);
    }
    
  } catch (err) {
    console.error('❌ Connection error:', err);
  } finally {
    await client.end();
    console.log('\n🔌 Connection closed');
  }
}

test();
