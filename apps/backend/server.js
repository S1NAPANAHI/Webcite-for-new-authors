const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const rateLimit = require('express-rate-limit');

const { createClient } = require('@supabase/supabase-js');

const authenticateAdmin = require('../../packages/shared/src/middleware/auth');

const createProductRoutes = require('../../packages/shared/src/routes/products');
const createAdminRoutes = require('../../packages/shared/src/routes/admin');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(express.json());
app.use(limiter);

const adminRouter = createAdminRoutes(supabase);
console.log('adminRouter:', adminRouter);

app.use('/api/products', createProductRoutes(supabase));
app.use('/api/admin', (req, res, next) => {
  console.log('Request received for /api/admin path:', req.originalUrl);
  next();
}, adminRouter);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});