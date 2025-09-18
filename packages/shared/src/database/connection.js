const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Use the connection string directly and let it override other settings
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
  max: 10, // Reduced max connections for connection pooler
  idleTimeoutMillis: 10000, // Close idle clients after 10 seconds
  connectionTimeoutMillis: 5000, // Increase timeout to 5 seconds
  application_name: 'zoroasterverse-backend', // Add application name for monitoring
});

// Test database connection
pool.on('connect', () => {
  console.log('📊 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🔄 Shutting down database connections...');
  pool.end();
  process.exit(0);
});

// Helper function to run queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`📝 Executed query in ${duration}ms:`, text.substring(0, 50) + '...');
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Helper function to get a single row
const getRow = async (text, params) => {
  const result = await query(text, params);
  return result.rows[0] || null;
};

// Helper function to get multiple rows
const getRows = async (text, params) => {
  const result = await query(text, params);
  return result.rows || [];
};

// Helper function to insert and return the inserted row
const insert = async (text, params) => {
  const result = await query(text, params);
  return result.rows[0] || null;
};

// Helper function to update and return the updated row
const update = async (text, params) => {
  const result = await query(text, params);
  return result.rows[0] || null;
};

// Helper function to delete and return the deleted row
const remove = async (text, params) => {
  const result = await query(text, params);
  return result.rows[0] || null;
};

// Transaction helper
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  getRow,
  getRows,
  insert,
  update,
  remove,
  transaction
};
