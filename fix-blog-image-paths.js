/**
 * EMERGENCY FIX: Fix blog image file paths in database
 * 
 * The issue: File records have name='blog' instead of actual filename
 * This causes MediaPicker to construct wrong URLs like 'blog/blog' instead of 'blog/actualfile.jpg'
 * 
 * This script fixes existing file records to have correct names
 */

require('dotenv').config();

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBlogImagePaths() {
  console.log('🔧 Starting blog image path fix...');
  
  try {
    // 1. Find all files in blog folder with incorrect names
    console.log('🔍 Searching for blog files with incorrect paths...');
    
    const { data: blogFiles, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('folder', 'blog')
      .neq('name', 'path'); // Files where name doesn't match expected pattern
      
    if (fetchError) {
      console.error('❌ Error fetching blog files:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${blogFiles?.length || 0} blog files to check`);
    
    if (!blogFiles || blogFiles.length === 0) {
      console.log('✅ No blog files found to fix');
      return;
    }
    
    // 2. Display current file data for inspection
    console.log('\n📄 Current blog file records:');
    blogFiles.forEach((file, index) => {
      console.log(`\n  File ${index + 1}:`);
      console.log(`    ID: ${file.id}`);
      console.log(`    Name: ${file.name}`);
      console.log(`    Original Name: ${file.original_name}`);
      console.log(`    Path: ${file.path}`);
      console.log(`    Folder: ${file.folder}`);
      console.log(`    Bucket: ${file.bucket}`);
      console.log(`    Size: ${file.size} bytes`);
      console.log(`    Current URL would be: ${supabaseUrl}/storage/v1/object/public/${file.bucket}/${file.path || file.folder + '/' + file.name}`);
    });
    
    // 3. Fix files where name is incorrect
    const filesToFix = blogFiles.filter(file => {
      // Fix files where name is just 'blog' or doesn't match the actual filename in path
      if (file.name === 'blog' || file.name === file.folder) {
        return true;
      }
      
      // Fix files where path exists but name doesn't match the filename in path
      if (file.path && file.path.includes('/')) {
        const actualFilename = file.path.split('/').pop();
        if (actualFilename && actualFilename !== file.name) {
          return true;
        }
      }
      
      return false;
    });
    
    console.log(`\n🔧 Found ${filesToFix.length} files that need fixing`);
    
    if (filesToFix.length === 0) {
      console.log('✅ All blog files have correct paths already!');
      return;
    }
    
    // 4. Fix each file record
    for (const file of filesToFix) {
      try {
        let correctName = file.name;
        let correctPath = file.path;
        
        // If we have a path, extract the correct filename
        if (file.path && file.path.includes('/')) {
          const pathParts = file.path.split('/');
          correctName = pathParts[pathParts.length - 1]; // Get filename from path
        } else if (file.original_name) {
          // Use original name as fallback, cleaned
          correctName = file.original_name.replaceAll(' ', '_').replaceAll(/[^a-zA-Z0-9._-]/g, '');
          correctPath = `${file.folder}/${file.id}-${correctName}`;
        } else {
          console.warn(`⚠️ Cannot determine correct name for file ${file.id}, skipping`);
          continue;
        }
        
        console.log(`\n🔄 Fixing file ${file.id}:`);
        console.log(`   From: name='${file.name}', path='${file.path}'`);
        console.log(`   To: name='${correctName}', path='${correctPath}'`);
        
        const { error: updateError } = await supabase
          .from('files')
          .update({
            name: correctName,
            path: correctPath,
            updated_at: new Date().toISOString()
          })
          .eq('id', file.id);
          
        if (updateError) {
          console.error(`❌ Error updating file ${file.id}:`, updateError);
        } else {
          console.log(`✅ Fixed file ${file.id} successfully`);
          
          // Test the new URL
          const newUrl = `${supabaseUrl}/storage/v1/object/public/${file.bucket}/${correctPath}`;
          console.log(`   New URL: ${newUrl}`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing file ${file.id}:`, error);
      }
    }
    
    console.log('\n✅ Blog image path fix completed!');
    console.log('🔄 Please refresh your MediaPicker to see the fixed images');
    
  } catch (error) {
    console.error('❌ Error during blog image path fix:', error);
  }
}

// Run the fix
fixBlogImagePaths()
  .then(() => {
    console.log('\n🎉 Fix script completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fix script failed:', error);
    process.exit(1);
  });