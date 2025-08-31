// Debug script to check environment variables
console.log('=== Environment Variables Debug ===');
console.log('import.meta.env.VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('import.meta.env.VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('process.env.VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('process.env.VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('All import.meta.env keys:', Object.keys(import.meta.env));
console.log('================================');
