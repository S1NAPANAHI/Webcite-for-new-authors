const { Client } = require('pg');
require('dotenv').config();

console.log('Testing database connection...');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);

const client = new Client({
  host: process.env.DB_HOST,
  port: 5432, // Using direct database port
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
    console.log('\n🔌 Attempting to connect to Supabase...');
    await client.connect();
    console.log('✅ Successfully connected to Supabase!');
    
    // Test a simple query
    console.log('\n🔍 Running test query...');
    const res = await client.query('SELECT version()');
    console.log('📊 Database version:', res.rows[0].version);
    
  } catch (err) {
    console.error('\n❌ Connection error:', err);
    console.error('Error details:', {
      code: err.code,
      message: err.message,
      stack: err.stack
    });
    
    // Additional diagnostics
    console.log('\n🔍 Connection details:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ? '***' : 'Not set'
    });
    
  } finally {
    if (client) {
      await client.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

test();
