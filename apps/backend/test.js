console.log('Node.js is working!');
console.log('Environment variables:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

// Test database connection
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testDb() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to database');
    const res = await client.query('SELECT NOW()');
    console.log('Current database time:', res.rows[0].now);
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message);
  } finally {
    await pool.end();
  }
}

testDb();
