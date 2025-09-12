console.log('=== Node.js Environment Test ===');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Current directory:', process.cwd());
console.log('Environment variables:', Object.keys(process.env).length > 0 ? 'Available' : 'Not available');

// Test basic file system access
try {
  const fs = require('fs');
  fs.writeFileSync('test-file.txt', 'test');
  console.log('✅ File system access: Working');
  fs.unlinkSync('test-file.txt');
} catch (err) {
  console.error('❌ File system error:', err.message);
}

// Test network connectivity
console.log('\nTesting network connectivity...');
const https = require('https');
const req = https.get('https://www.google.com', (res) => {
  console.log(`✅ HTTPS connection to google.com: Status ${res.statusCode}`);
  res.resume();
});

req.on('error', (err) => {
  console.error('❌ HTTPS request failed:', err.message);
});

// Test DNS resolution
console.log('\nTesting DNS resolution...');
const dns = require('dns');
dns.lookup('google.com', (err, address) => {
  if (err) {
    console.error('❌ DNS resolution failed:', err.message);
  } else {
    console.log(`✅ DNS resolution: google.com -> ${address}`);
  }
});

// Test Supabase DNS resolution
dns.lookup('db.opukvvmumyegtkukqint.supabase.co', (err, address) => {
  if (err) {
    console.error('❌ Supabase DNS resolution failed:', err.message);
  } else {
    console.log(`✅ Supabase DNS resolution: db.opukvvmumyegtkukqint.supabase.co -> ${address}`);
  }
});
