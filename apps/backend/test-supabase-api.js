const https = require('https');
require('dotenv').config();

console.log('Testing Supabase REST API connection...');

const options = {
  hostname: process.env.SUPABASE_URL.replace('https://', ''),
  port: 443,
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
  }
};

console.log('\n🔍 Making request to:', options.hostname);

const req = https.request(options, (res) => {
  console.log('\n📡 Response status:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n📄 Response body:');
    console.log(data);
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request error:', error);
});

req.end();
