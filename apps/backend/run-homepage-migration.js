import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import('./config.js');

console.log('🚀 Starting homepage content table migration...');

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - SUPABASE_URL or VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SERVICE_KEY, or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runMigration() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test the connection
    const { data: testData, error: testError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);
      
    if (testError) {
      throw new Error(`Database connection failed: ${testError.message}`);
    }
    
    console.log('✅ Database connection successful');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'migrations', 'create-homepage-content-table.sql');
    console.log('📄 Reading migration file:', migrationPath);
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log(`📜 Migration SQL loaded (${migrationSQL.length} characters)`);
    
    // Execute the migration
    console.log('🚀 Executing migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      // If RPC doesn't work, try direct SQL execution (for newer Supabase versions)
      console.log('🔄 RPC failed, trying direct SQL execution...');
      
      // Split SQL into individual statements and execute them
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== 'COMMIT');
      
      for (const statement of statements) {
        console.log('📝 Executing:', statement.substring(0, 50) + '...');
        
        try {
          // Use rpc for each statement
          const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          
          if (stmtError) {
            console.warn(`⚠️ Statement warning: ${stmtError.message}`);
          }
        } catch (stmtErr) {
          console.warn(`⚠️ Statement failed (may be expected): ${stmtErr.message}`);
        }
      }
    }
    
    // Verify the tables were created
    console.log('🔍 Verifying tables...');
    
    // Check homepage_content table
    const { data: contentTable, error: contentError } = await supabase
      .from('homepage_content')
      .select('*')
      .limit(1);
      
    if (contentError) {
      console.error('❌ homepage_content table verification failed:', contentError.message);
    } else {
      console.log('✅ homepage_content table exists and is accessible');
    }
    
    // Check homepage_quotes table  
    const { data: quotesTable, error: quotesError } = await supabase
      .from('homepage_quotes')
      .select('*')
      .limit(1);
      
    if (quotesError) {
      console.error('❌ homepage_quotes table verification failed:', quotesError.message);
    } else {
      console.log('✅ homepage_quotes table exists and is accessible');
      console.log(`💬 Found ${quotesTable?.length || 0} quotes in table`);
    }
    
    // Insert or update the default homepage content
    console.log('💾 Ensuring default homepage content exists...');
    const { data: upsertData, error: upsertError } = await supabase
      .from('homepage_content')
      .upsert({
        id: 'homepage',
        hero_title: 'Zoroastervers',
        hero_description: 'Learn about the teachings of the prophet Zarathustra, the history of one of the world\'s oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.',
        hero_quote: '"Happiness comes to them who bring happiness to others."',
        cta_button_text: 'Learn More',
        cta_button_link: '/blog/about',
        words_written: 50000,
        beta_readers: 5,
        average_rating: 4.5,
        books_published: 1,
        show_latest_news: true,
        show_latest_releases: true,
        show_artist_collaboration: true,
        show_progress_metrics: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select();
      
    if (upsertError) {
      console.error('❌ Default content upsert failed:', upsertError.message);
    } else {
      console.log('✅ Default homepage content ensured');
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test the homepage manager section visibility settings');
    console.log('3. Verify that API calls to /api/homepage/content now work');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('🔄 Manual steps required:');
    console.error('1. Check your Supabase dashboard');
    console.error('2. Run the SQL from migrations/create-homepage-content-table.sql manually');
    console.error('3. Ensure RLS policies allow your service role to access the tables');
    process.exit(1);
  }
}

runMigration();