// Test script to sync chapters to release items and populate the homepage
import { createClient } from '@supabase/supabase-js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: './apps/backend/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

console.log('🔄 Testing release sync and population...');
console.log('📡 Supabase URL:', process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
console.log('🔑 Using service key:', !!(process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY));

async function testReleaseSync() {
  try {
    console.log('\n1. 📊 Checking current release items...');
    const { data: currentReleases, error: currentError } = await supabase
      .from('release_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (currentError) {
      console.error('❌ Error fetching current releases:', currentError);
    } else {
      console.log(`✅ Found ${currentReleases?.length || 0} existing release items`);
      if (currentReleases && currentReleases.length > 0) {
        console.log('📋 Current releases:', currentReleases.map(r => `${r.title} (${r.type})`));
      }
    }

    console.log('\n2. 📚 Checking available chapters...');
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select(`
        id,
        title,
        chapter_number,
        created_at,
        work:work_id (
          id,
          title,
          slug
        )
      `)
      .not('work', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);

    if (chaptersError) {
      console.error('❌ Error fetching chapters:', chaptersError);
      console.log('\n3. 📝 Creating sample release items since no chapters found...');
      
      // Create some sample release items for testing
      const sampleReleases = [
        {
          title: 'The Sacred Fire - Chapter 1: Origins',
          type: 'Chapter',
          description: 'Introduction to the sacred fire and its significance in Zoroastrian worship',
          release_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week ago
          link: '/library/sacred-fire#chapter-1'
        },
        {
          title: 'Good Thoughts, Good Words, Good Deeds - Chapter 2: Practice',
          type: 'Chapter', 
          description: 'Practical applications of the threefold path in daily life',
          release_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
          link: '/library/threefold-path#chapter-2'
        },
        {
          title: 'Gathas Commentary - Chapter 5: Divine Wisdom',
          type: 'Chapter',
          description: 'Deep dive into Zarathustra\'s teachings on divine wisdom and truth',
          release_date: new Date().toISOString().split('T')[0], // Today
          link: '/library/gathas-commentary#chapter-5'
        }
      ];

      const { data: insertedSamples, error: insertError } = await supabase
        .from('release_items')
        .upsert(sampleReleases, { onConflict: 'title' })
        .select();

      if (insertError) {
        console.error('❌ Error inserting sample releases:', insertError);
      } else {
        console.log(`✅ Created ${insertedSamples?.length || 0} sample release items`);
      }
    } else {
      console.log(`✅ Found ${chapters?.length || 0} chapters in library`);
      if (chapters && chapters.length > 0) {
        console.log('📋 Available chapters:', chapters.map(c => 
          `${c.work?.title || 'Unknown'} - Ch.${c.chapter_number}: ${c.title}`
        ));

        console.log('\n3. 🔄 Syncing chapters to release items...');
        
        // Clear existing chapter-based releases
        await supabase
          .from('release_items')
          .delete()
          .eq('type', 'Chapter');

        // Create release items from chapters
        const releaseItems = chapters.map(chapter => ({
          title: `${chapter.work?.title || 'Unknown Work'} - Chapter ${chapter.chapter_number}: ${chapter.title}`,
          type: 'Chapter',
          description: `New chapter in ${chapter.work?.title || 'Unknown Work'}`,
          release_date: chapter.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          link: chapter.work?.slug ? `/library/${chapter.work.slug}#chapter-${chapter.chapter_number}` : '#'
        }));

        const { data: syncedData, error: syncError } = await supabase
          .from('release_items')
          .insert(releaseItems)
          .select();

        if (syncError) {
          console.error('❌ Error syncing chapters:', syncError);
        } else {
          console.log(`✅ Successfully synced ${syncedData?.length || 0} chapters to releases`);
        }
      } else {
        console.log('ℹ️ No chapters found to sync');
      }
    }

    console.log('\n4. 🏠 Testing API endpoint...');
    try {
      const API_BASE = 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/releases/latest`);
      if (response.ok) {
        const apiData = await response.json();
        console.log(`✅ API endpoint working: ${apiData.length} items returned`);
      } else {
        console.log(`⚠️ API endpoint returned status: ${response.status}`);
      }
    } catch (apiError) {
      console.log('⚠️ API endpoint not reachable (server may not be running):', apiError.message);
    }

    console.log('\n✨ Release sync test completed!');
    console.log('\n🎯 Next steps:');
    console.log('   1. Start your backend server: npm run dev (from apps/backend)');
    console.log('   2. Visit your homepage to see the Latest Releases section');
    console.log('   3. Add more chapters to your library to see them appear automatically');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testReleaseSync();