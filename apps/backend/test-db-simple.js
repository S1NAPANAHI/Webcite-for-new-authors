const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

console.log('Environment Variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '***' : 'Not set');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

async function test() {
  let client;
  try {
    console.log('🔄 Attempting to connect to database...');
    client = await pool.connect();
    console.log('✅ Successfully connected to database');
    
    const res = await client.query('SELECT version()');
    console.log('📊 Database version:', res.rows[0].version);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

test().catch(console.error);
