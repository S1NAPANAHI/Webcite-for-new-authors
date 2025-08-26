const { Pool } = require('pg');
require('dotenv').config();

const testConnection = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔄 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to the database');
    
    // Test a simple query
    console.log('🔍 Running test query...');
    const result = await client.query('SELECT version()');
    console.log('✅ Database version:', result.rows[0].version);
    
    // Test querying a table
    try {
      const tables = await client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      console.log('📊 Available tables:', tables.rows.map(r => r.table_name).join(', '));
    } catch (err) {
      console.warn('⚠️ Could not list tables (expected if no tables exist):', err.message);
    }
    
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection test failed:', err);
    process.exit(1);
  }
};

testConnection();
