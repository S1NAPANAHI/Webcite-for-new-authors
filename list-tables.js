const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    const { data, error } = await supabase
      .rpc('get_public_tables');

    if (error) {
      throw error;
    }

    const tableNames = data.map(table => table.table_name);
    console.log('Tables in public schema:');
    console.log(tableNames.join('\n'));

  } catch (error) {
    console.error('Error listing tables:', error.message);
  }
}

listTables();