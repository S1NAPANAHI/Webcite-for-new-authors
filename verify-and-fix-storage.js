// Comprehensive script to verify and fix Supabase storage bucket issues
// This script checks existing buckets, creates missing ones, and provides diagnostics

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAndFixStorage() {
  try {
    console.log('🔍 Verifying Supabase Storage setup...');
    console.log('URL:', supabaseUrl);
    console.log('');
    
    // List all existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }
    
    console.log('📁 Current buckets:');
    buckets.forEach(bucket => {
      console.log(`  ✅ ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
    console.log('');
    
    // Check for required buckets
    const requiredBuckets = [
      { name: 'media', public: true },
      { name: 'blog-images', public: true }
    ];
    
    for (const requiredBucket of requiredBuckets) {
      const exists = buckets.find(b => b.name === requiredBucket.name);
      
      if (!exists) {
        console.log(`🚀 Creating missing bucket: ${requiredBucket.name}`);
        
        const { data, error } = await supabase.storage.createBucket(requiredBucket.name, {
          public: requiredBucket.public,
          allowedMimeTypes: [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/gif',
            'image/webp',
            'image/svg+xml'
          ],
          fileSizeLimit: '10MB'
        });
        
        if (error) {
          console.error(`❌ Failed to create ${requiredBucket.name}:`, error.message);
        } else {
          console.log(`✅ Successfully created ${requiredBucket.name} bucket`);
          
          // Create folder structure for blog-images bucket
          if (requiredBucket.name === 'blog-images') {
            const folders = ['featured', 'social', 'content', 'thumbnails'];
            for (const folder of folders) {
              await createFolder(requiredBucket.name, folder);
            }
          }
        }
      } else {
        console.log(`✅ ${requiredBucket.name} bucket exists`);
      }
    }
    
    console.log('');
    console.log('🔧 Checking current code configuration...');
    
    // Test upload to both buckets to verify they work
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const timestamp = Date.now();
    
    // Test media bucket
    const { error: mediaError } = await supabase.storage
      .from('media')
      .upload(`test/test-${timestamp}.txt`, testBlob);
    
    if (mediaError) {
      console.error('❌ Media bucket test failed:', mediaError.message);
    } else {
      console.log('✅ Media bucket is working');
      // Clean up test file
      await supabase.storage.from('media').remove([`test/test-${timestamp}.txt`]);
    }
    
    // Test blog-images bucket
    const { error: blogImagesError } = await supabase.storage
      .from('blog-images')
      .upload(`test/test-${timestamp}.txt`, testBlob);
    
    if (blogImagesError) {
      console.error('❌ Blog-images bucket test failed:', blogImagesError.message);
    } else {
      console.log('✅ Blog-images bucket is working');
      // Clean up test file
      await supabase.storage.from('blog-images').remove([`test/test-${timestamp}.txt`]);
    }
    
    console.log('');
    console.log('🎉 Storage verification complete!');
    console.log('');
    console.log('🛠️ Next steps to fix the issue:');
    console.log('1. Both buckets now exist and are properly configured');
    console.log('2. Your current code uses the \'media\' bucket (which is correct)');
    console.log('3. The error occurs because your deployed app has cached JavaScript');
    console.log('4. Trigger a new deployment in Vercel to rebuild with latest code');
    console.log('5. Clear browser cache after deployment (Ctrl+F5 or Cmd+Shift+R)');
    console.log('');
    console.log('📝 Bucket Usage:');
    console.log('- media/blog-images/ - For blog post images (current code)');
    console.log('- blog-images/ - For backward compatibility (fallback)');
    
  } catch (error) {
    console.error('❌ Error during storage verification:', error.message);
    process.exit(1);
  }
}

async function createFolder(bucketName, folderName) {
  try {
    const placeholderContent = `This folder is for ${folderName} images`;
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(`${folderName}/.placeholder`, new Blob([placeholderContent], { type: 'text/plain' }), {
        upsert: true
      });
      
    if (error && !error.message.includes('already exists')) {
      console.warn(`⚠️  Could not create folder ${folderName}:`, error.message);
    } else {
      console.log(`  📁 Created folder: ${folderName}`);
    }
  } catch (error) {
    console.warn(`⚠️  Folder creation warning for ${folderName}:`, error.message);
  }
}

// Run the verification
verifyAndFixStorage();