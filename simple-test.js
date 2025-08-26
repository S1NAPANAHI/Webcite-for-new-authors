console.log('Simple test running...');
console.log('Node.js version:', process.version);

// Test basic file system access
try {
  const fs = require('fs');
  const path = require('path');
  
  const testFile = path.join(__dirname, 'test-file.txt');
  fs.writeFileSync(testFile, 'test');
  console.log('✅ File system access working');
  fs.unlinkSync(testFile);
} catch (err) {
  console.error('❌ File system error:', err.message);
}

// Test basic HTTP request
try {
  const https = require('https');
  console.log('\nTesting HTTPS connection to google.com...');
  
  const req = https.get('https://google.com', (res) => {
    console.log(`✅ HTTPS status: ${res.statusCode}`);
    res.on('data', () => {}); // Consume data
    res.on('end', () => process.exit(0));
  });
  
  req.on('error', (err) => {
    console.error('❌ HTTPS request failed:', err.message);
    process.exit(1);
  });
} catch (err) {
  console.error('❌ HTTPS test failed:', err.message);
  process.exit(1);
}
