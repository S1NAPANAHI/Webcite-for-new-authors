import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Environment validation with helpful error messages
console.log('🔧 Backend Configuration Check:');
console.log('================================');

// Critical environment variables
const criticalEnvVars = {
  'SUPABASE_URL': process.env.SUPABASE_URL,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY,
  'PORT': process.env.PORT || '3001'
};

// Supabase fallback variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('📊 Environment Variables Status:');
for (const [key, value] of Object.entries(criticalEnvVars)) {
  const status = value ? '✅ SET' : '❌ MISSING';
  const preview = value ? `${value.substring(0, 20)}...` : 'undefined';
  console.log(`   ${key}: ${status} (${preview})`);
}

console.log('🔗 Supabase Connection Check:');
console.log(`   URL: ${supabaseUrl ? '✅' : '❌'} (${supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING'})`);
console.log(`   KEY: ${supabaseKey ? '✅' : '❌'} (${supabaseKey ? `${supabaseKey.substring(0, 10)}...` : 'MISSING'})`);

if (!supabaseUrl || !supabaseKey) {
  console.log('');
  console.log('😨 ⚠️  CRITICAL: Missing Supabase Configuration!');
  console.log('================================');
  console.log('📋 Required Environment Variables (add to your deployment):');
  console.log('   ➡️  SUPABASE_URL=https://your-project.supabase.co');
  console.log('   ➡️  SUPABASE_ANON_KEY=eyJ0eXAiOi... (your anon key)');
  console.log('   OR');
  console.log('   ➡️  SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOi... (service role key)');
  console.log('');
  console.log('🔍 Find these values in:');
  console.log('   Supabase Dashboard → Project Settings → API');
  console.log('');
  console.log('🚀 The server will continue but Supabase features may not work!');
  console.log('================================');
} else {
  console.log('✅ Supabase configuration appears valid!');
}

console.log('');