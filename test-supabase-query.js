import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? '***' + supabaseKey.slice(-4) : 'Not found');

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  try {
    console.log('\nTesting Supabase connection...');
    
    // Test connection
    const { data: timeData, error: timeError } = await supabase.rpc('now');
    if (timeError) throw timeError;
    console.log('✅ Connected to Supabase. Server time:', timeData);
    
    // Test subscriptions table query
    console.log('\nTesting subscriptions table...');
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Error querying subscriptions table:', error);
      
      // Check if table exists
      const { data: tableExists } = await supabase
        .rpc('table_exists', { table_name: 'subscriptions' });
        
      console.log('Table exists:', tableExists);
      
      if (!tableExists) {
        console.log('\nThe subscriptions table does not exist in your Supabase database.');
        console.log('Please run the following migrations:');
        console.log('1. Navigate to the supabase/migrations directory');
        console.log('2. Run the SQL files to create the subscriptions table');
      }
      
      return;
    }
    
    console.log('✅ Successfully queried subscriptions table');
    console.log('Sample data:', data);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testQuery();
