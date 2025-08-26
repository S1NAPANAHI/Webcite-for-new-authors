const http = require('http');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Create a log file
const logStream = fs.createWriteStream('server.log', { flags: 'a' });

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  process.stdout.write(logMessage);
  logStream.write(logMessage);
}

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test database connection
async function testDatabase() {
  try {
    const client = await pool.connect();
    log('✅ Connected to database');
    const result = await client.query('SELECT version()');
    log(`📊 Database version: ${result.rows[0].version}`);
    client.release();
    return true;
  } catch (err) {
    log(`❌ Database connection error: ${err.message}`);
    return false;
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  log(`\n📥 ${req.method} ${req.url}`);
  
  if (req.url === '/api/test-db') {
    const dbConnected = await testDatabase();
    res.writeHead(dbConnected ? 200 : 500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: dbConnected ? 'success' : 'error',
      message: dbConnected ? 'Database connection successful' : 'Database connection failed'
    }));
    return;
  }
  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'error', message: 'Not found' }));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  log(`\n🚀 Server running on port ${PORT}`);
  log(`🔗 Test database connection: http://localhost:${PORT}/api/test-db`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  log(`\n❌ Uncaught Exception: ${err.stack || err}`);  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log(`\n❌ Unhandled Rejection at: ${promise}, reason: ${reason}`);
});
