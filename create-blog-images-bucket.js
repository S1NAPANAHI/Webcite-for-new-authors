// Script to create the blog-images bucket in Supabase
// This ensures backward compatibility with any cached frontend code

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

async function createBlogImagesBucket() {
  try {
    console.log('🚀 Creating blog-images bucket...');
    
    // First, check if bucket already exists
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw listError;
    }
    
    const bucketExists = existingBuckets.find(bucket => bucket.name === 'blog-images');
    
    if (bucketExists) {
      console.log('✅ blog-images bucket already exists');
      return;
    }
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('blog-images', {
      public: true, // Make it public so images can be accessed directly
      allowedMimeTypes: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp'
      ],
      fileSizeLimit: '10MB' // Set a reasonable file size limit
    });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Successfully created blog-images bucket:', data);
    
    // Create basic folder structure
    console.log('📁 Creating folder structure...');
    
    // We'll upload a small placeholder file to create the folder structure
    const placeholderContent = 'This is a placeholder file to create the folder structure';
    
    const folders = [
      'featured',
      'social',
      'content',
      'thumbnails'
    ];
    
    for (const folder of folders) {
      const { error: folderError } = await supabase.storage
        .from('blog-images')
        .upload(`${folder}/.placeholder`, new Blob([placeholderContent], { type: 'text/plain' }), {
          upsert: true
        });
        
      if (folderError) {
        console.warn(`⚠️  Warning: Could not create folder ${folder}:`, folderError.message);
      } else {
        console.log(`✅ Created folder: ${folder}`);
      }
    }
    
    console.log('🎉 Blog-images bucket setup complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Redeploy your application to Vercel');
    console.log('2. Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)');
    console.log('3. Test image upload functionality');
    
  } catch (error) {
    console.error('❌ Error creating blog-images bucket:', error);
    process.exit(1);
  }
}

// Run the function
createBlogImagesBucket();