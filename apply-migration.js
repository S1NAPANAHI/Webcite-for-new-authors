const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: './apps/backend/.env' });

console.log('🔧 Applying user_activities table migration...\n');

// Initialize the client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  try {
    // Read the migration file
    const migrationSQL = fs.readFileSync('add-user-activities-table.sql', 'utf8');
    
    console.log('📄 Executing migration...');
    console.log('SQL:', migrationSQL.substring(0, 200) + '...\n');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration error:', error);
      
      // Try alternative approach: execute each statement separately
      console.log('\n🔄 Trying alternative approach...');
      const statements = migrationSQL.split(';').filter(stmt => stmt.trim().length > 0);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim() + ';';
        if (statement.length > 1) {
          console.log(`Executing statement ${i + 1}/${statements.length}...`);
          const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement });
          if (stmtError) {
            console.error(`❌ Error in statement ${i + 1}:`, stmtError);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        }
      }
    } else {
      console.log('✅ Migration executed successfully!');
    }
    
    // Verify the table was created
    console.log('\n🔍 Verifying table creation...');
    const { data: activities, error: checkError } = await supabase
      .from('user_activities')
      .select('*', { count: 'exact', head: true });
    
    if (checkError) {
      console.error('❌ Table verification failed:', checkError);
    } else {
      console.log('✅ user_activities table is now accessible!');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

applyMigration();
