const net = require('net');

const host = 'db.opukvvmumyegtkukqint.supabase.co';
const port = 5432;

console.log(`Testing connection to ${host}:${port}...`);

const socket = new net.Socket();

socket.setTimeout(10000); // 10 seconds timeout

socket.on('connect', () => {
  console.log('✅ Successfully connected to the database port!');
  console.log('Local address:', socket.localAddress);
  console.log('Local port:', socket.localPort);
  socket.destroy();
});

socket.on('timeout', () => {
  console.error('❌ Connection timed out');
  socket.destroy();
});

socket.on('error', (err) => {
  console.error('❌ Connection error:', err.message);
});

socket.on('close', () => {
  console.log('Connection closed');
});

console.log('Attempting to connect...');
socket.connect(port, host);
