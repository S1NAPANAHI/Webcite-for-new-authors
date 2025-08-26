const { Client } = require('pg');
require('dotenv').config({ path: './apps/backend/.env' });

console.log('Starting database connection test...');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
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
    console.log('Connected successfully!');
    
    const res = await client.query('SELECT version()');
    console.log('Database version:', res.rows[0].version);
    
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

test();
