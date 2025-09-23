#!/usr/bin/env node
/**
 * Character Database Setup Script
 * 
 * This script sets up the character management tables in your Supabase database.
 * Run this after you have your Supabase project configured.
 * 
 * Usage:
 *   node scripts/setup-character-database.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('  - VITE_SUPABASE_URL or SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY');
  console.error('');
  console.error('You can find these in your Supabase dashboard under Settings > API');
  process.exit(1);
}

console.log('\n🌍 Zoroasterverse Character Database Setup');
console.log('=' .repeat(50));
console.log(`🔗 Supabase URL: ${SUPABASE_URL}`);
console.log(`🔑 Service Key: ${'*'.repeat(20)}...`);

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Read the SQL schema file
const schemaPath = path.join(__dirname, '../database/migrations/create_characters_schema_fixed.sql');

if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Schema file not found: ${schemaPath}`);
  console.error('Make sure you have the database migration file in the correct location.');
  process.exit(1);
}

const schemaSql = fs.readFileSync(schemaPath, 'utf8');

async function setupDatabase() {
  try {
    console.log('\n🚀 Starting database setup...');
    
    // Check if characters table already exists
    console.log('🔍 Checking existing tables...');
    const { data: existingTables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'characters');
    
    if (tableError && !tableError.message.includes('does not exist')) {
      console.error('❌ Error checking tables:', tableError);
    }
    
    if (existingTables && existingTables.length > 0) {
      console.log('⚠️  Characters table already exists!');
      console.log('Do you want to continue? This will attempt to run the full schema.');
      console.log('(You may see some "already exists" errors, which is normal)');
    }
    
    console.log('📝 Executing character database schema...');
    
    // Split the schema into individual statements to handle errors gracefully
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Check if it's a "already exists" error (which is okay)
          if (
            error.message.includes('already exists') ||
            error.message.includes('duplicate key') ||
            error.message.includes('relation') && error.message.includes('already exists')
          ) {
            skipCount++;
            // Skip logging these - they're expected
          } else {
            console.error(`⚠️  Warning executing statement: ${error.message}`);
            console.error(`SQL: ${statement.substring(0, 100)}...`);
          }
        } else {
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error executing statement: ${err.message}`);
        console.error(`SQL: ${statement.substring(0, 100)}...`);
      }
    }
    
    console.log(`\n✅ Database setup completed!`);
    console.log(`  - ${successCount} statements executed successfully`);
    console.log(`  - ${skipCount} statements skipped (already exists)`);
    
    // Test the setup by checking for sample data
    console.log('\n🧪 Testing database setup...');
    const { data: characters, error: testError } = await supabase
      .from('characters')
      .select('name, character_type, importance_score')
      .limit(5);
    
    if (testError) {
      console.error('❌ Error testing characters table:', testError);
      return;
    }
    
    console.log('✅ Characters table is working!');
    if (characters && characters.length > 0) {
      console.log(`🎆 Found ${characters.length} sample characters:`);
      characters.forEach(char => {
        console.log(`  - ${char.name} (${char.character_type}, score: ${char.importance_score})`);
      });
    } else {
      console.log('📝 No characters found - table is empty but ready to use!');
    }
    
    console.log('\n🎉 Success! Your character management system is ready!');
    console.log('🔗 You can now visit: https://zoroastervers.com/admin/world/characters');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Alternative: Use direct SQL execution if RPC doesn't work
async function setupDatabaseDirect() {
  try {
    console.log('🚀 Using direct SQL execution method...');
    
    // Try executing the full schema at once
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSql });
    
    if (error) {
      console.error('❌ Error executing schema:', error);
      console.log('\n📝 You may need to manually run the SQL in your Supabase dashboard.');
      console.log('Copy the contents of: database/migrations/create_characters_schema_fixed.sql');
      console.log('And paste it into: Supabase Dashboard > SQL Editor > New Query');
      return;
    }
    
    console.log('✅ Schema executed successfully!');
    
  } catch (error) {
    console.error('❌ Direct execution failed:', error);
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
    .then(() => {
      console.log('\n✨ Character management system is ready to use!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

export { setupDatabase };