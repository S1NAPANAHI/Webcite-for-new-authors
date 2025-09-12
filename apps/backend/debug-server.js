const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '***' : 'Not set');

const app = express();
app.use(express.json());

// Simple test route
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Test successful' });
});

// Import and use products route
const createProductRoutes = require('../../packages/shared/src/routes/products');
const { Pool } = require('pg');

// Create a test pool connection
const testPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

testPool.connect()
  .then(client => {
    console.log('✅ Successfully connected to database');
    return client.query('SELECT version()')
      .then(res => {
        console.log('📊 Database version:', res.rows[0].version);
        client.release();
      });
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
  });

// Use the products route
app.use('/api/products', createProductRoutes(testPool));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Test API: http://localhost:${PORT}/api/test`);
  console.log(`🛍️ Products API: http://localhost:${PORT}/api/products`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
