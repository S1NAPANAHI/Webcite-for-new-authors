const path = require('path');
// Try to load .env from multiple locations
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../apps/backend/.env') });
} catch (e) {
  // Fallback for production
  require('dotenv').config();
}

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  const { method } = req;
  
  try {
    switch (method) {
      case 'GET':
        await handleAdminTest(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ Admin API Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}

async function handleAdminTest(req, res) {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .limit(5);

  if (error) return res.status(500).json({ error });
  res.json({ message: 'Admin route works!', data });
}
