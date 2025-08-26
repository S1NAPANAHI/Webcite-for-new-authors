const { Client } = require('pg');
require('dotenv').config({ path: './apps/backend/.env' });

console.log('Testing direct database connection...');

const client = new Client({
  host: 'db.opukvvmumyegtkukqint.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Si19@99na',
  ssl: {
    rejectUnauthorized: false,
    require: true
  },
  connectionTimeoutMillis: 10000
});

async function testConnection() {
  console.log('Connecting to database...');
  
  try {
    await client.connect();
    console.log('✅ Successfully connected to the database!');
    
    try {
      const result = await client.query('SELECT version()');
      console.log('📊 Database version:', result.rows[0].version);
    } catch (queryError) {
      console.error('❌ Query error:', queryError.message);
    }
    
  } catch (connectError) {
    console.error('❌ Connection failed:', connectError.message);
    console.error('Error details:', {
      code: connectError.code,
      stack: connectError.stack
    });
  } finally {
    await client.end();
    console.log('Connection closed');
  }
}

testConnection().catch(console.error);
