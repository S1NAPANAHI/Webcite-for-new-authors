console.log('🔍 Testing Node.js environment...');
console.log('Node.js version:', process.version);
console.log('Current working directory:', process.cwd());
console.log('Environment variables loaded:', Object.keys(process.env).length > 0);

// Try to load and log .env file
const fs = require('fs');
const path = require('path');
const envPath = path.resolve(process.cwd(), 'apps/backend/.env');

console.log('\n🔍 Checking .env file at:', envPath);
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 .env content (sensitive values masked):', 
    envContent
      .split('\n')
      .map(line => {
        if (line.includes('=')) {
          const [key, ...values] = line.split('=');
          if (key.includes('PASSWORD') || key.includes('KEY') || key.includes('SECRET')) {
            return `${key}=***`;
          }
        }
        return line;
      })
      .join('\n')
  );
} else {
  console.error('❌ .env file not found at:', envPath);
}

// Test database connection
console.log('\n🔍 Testing database connection...');
try {
  const { Pool } = require('pg');
  require('dotenv').config({ path: envPath });
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      require: true
    },
    connectionTimeoutMillis: 10000
  });

  (async () => {
    const client = await pool.connect();
    try {
      console.log('✅ Connected to database');
      const result = await client.query('SELECT version()');
      console.log('📊 Database version:', result.rows[0].version);
    } finally {
      client.release();
      await pool.end();
    }
  })().catch(err => {
    console.error('❌ Database connection error:', err);
  });
} catch (err) {
  console.error('❌ Error initializing database connection:', err);
}
