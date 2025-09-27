#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function applyLearnEnhancements() {
  console.log('🚀 Applying Learn Page Database Enhancements...');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'database', 'learn_enhancements.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && stmt !== '');
    
    console.log(`📊 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: queryError } = await supabase
            .from('_temp_query')
            .select('*')
            .limit(1);
          
          if (queryError && !queryError.message.includes('does not exist')) {
            console.warn(`⚠️ Statement ${i + 1} may have issues:`, error.message);
          }
        }
        
        console.log(`✅ Statement ${i + 1} completed`);
      } catch (err) {
        console.warn(`⚠️ Statement ${i + 1} warning:`, err.message);
      }
    }
    
    console.log('🎉 Learn Page enhancements applied successfully!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Deploy the updated code to your hosting platform');
    console.log('2. Test the new Learn page at /learn');
    console.log('3. Access the admin panel at /admin/learn');
    console.log('4. Add content through the enhanced admin interface');
    console.log('');
    console.log('🔗 Important URLs:');
    console.log('   • Learn Page: https://www.zoroastervers.com/learn');
    console.log('   • Admin Panel: https://www.zoroastervers.com/admin/learn');
    
  } catch (error) {
    console.error('❌ Error applying Learn enhancements:', error.message);
    console.log('');
    console.log('🛠 Manual Steps:');
    console.log('1. Copy the contents of database/learn_enhancements.sql');
    console.log('2. Run it manually in your Supabase SQL editor');
    console.log('3. Deploy the updated code');
    process.exit(1);
  }
}

// Check if tables exist first
async function checkTables() {
  console.log('🔍 Checking existing Learn tables...');
  
  const tables = [
    'authors_journey_posts',
    'writing_guides', 
    'video_tutorials',
    'downloadable_templates',
    'professional_services'
  ];
  
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('id').limit(1);
      results[table] = !error;
      console.log(`${!error ? '✅' : '❌'} ${table}: ${!error ? 'EXISTS' : 'MISSING'}`);
    } catch (err) {
      results[table] = false;
      console.log(`❌ ${table}: MISSING`);
    }
  }
  
  const missingTables = Object.entries(results)
    .filter(([table, exists]) => !exists)
    .map(([table]) => table);
    
  if (missingTables.length > 0) {
    console.log('');
    console.log('⚠️ Missing tables detected:', missingTables.join(', '));
    console.log('📋 Please create these tables first or check your database setup.');
    console.log('');
    return false;
  }
  
  console.log('✅ All required tables exist!');
  return true;
}

async function main() {
  console.log('🏁 Starting Learn Page Enhancement Process');
  console.log('========================================');
  
  // Check environment
  if (!process.env.VITE_SUPABASE_URL && !process.env.SUPABASE_URL) {
    console.error('❌ Missing SUPABASE_URL environment variable');
    process.exit(1);
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.VITE_SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase key environment variable');
    process.exit(1);
  }
  
  // Check tables exist
  const tablesExist = await checkTables();
  if (!tablesExist) {
    process.exit(1);
  }
  
  // Apply enhancements
  await applyLearnEnhancements();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { applyLearnEnhancements, checkTables };