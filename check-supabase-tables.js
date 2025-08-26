const https = require('https');
require('dotenv').config({ path: './apps/backend/.env' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase URL or Service Role Key in .env file');
  process.exit(1);
}

console.log('🔍 Checking Supabase tables...');

const options = {
  hostname: SUPABASE_URL.replace('https://', ''),
  path: '/rest/v1/?select=table_name',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Accept': 'application/json'
  }
};

const req = https.get(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const tables = JSON.parse(data);
        console.log('📋 Available tables:');
        tables.forEach(table => console.log(`- ${table.table_name}`));
        
        if (!tables.some(t => t.table_name === 'products')) {
          console.log('\n❌ Products table does not exist');
          console.log('\nRun this SQL in your Supabase SQL editor to create it:');
          console.log(`
            CREATE TABLE public.products (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              name TEXT NOT NULL,
              description TEXT,
              price DECIMAL(10, 2) NOT NULL,
              image_url TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `);
        }
      } catch (e) {
        console.error('❌ Error parsing response:', e);
      }
    } else {
      console.error(`❌ Error: ${res.statusCode} ${res.statusMessage}`);
      console.log('Response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e);
});

req.end();
