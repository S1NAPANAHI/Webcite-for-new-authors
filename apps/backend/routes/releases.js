import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Environment variables validation and fallbacks
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('📚 Releases API - Environment check:', {
  hasSupabaseUrl: !!SUPABASE_URL,
  hasSupabaseKey: !!SUPABASE_KEY,
  urlPreview: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 20)}...` : 'MISSING',
  keyPreview: SUPABASE_KEY ? `${SUPABASE_KEY.substring(0, 10)}...` : 'MISSING'
});

// Initialize Supabase client with better error handling
let supabase = null;

try {
  if (!SUPABASE_URL) {
    throw new Error('Missing SUPABASE_URL or VITE_SUPABASE_URL environment variable');
  }
  if (!SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY, or VITE_SUPABASE_ANON_KEY environment variable');
  }

  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✅ Releases API - Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Releases API - Supabase client initialization failed:', error.message);
  console.error('📋 Required environment variables:');
  console.error('   - SUPABASE_URL or VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY, or VITE_SUPABASE_ANON_KEY');
}

// Middleware to check if Supabase is available
const requireSupabase = (req, res, next) => {
  if (!supabase) {
    return res.status(500).json({
      error: 'Database connection not available',
      message: 'Supabase client not initialized. Check environment variables.',
      success: false,
      requiredEnvVars: [
        'SUPABASE_URL or VITE_SUPABASE_URL',
        'SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY, or VITE_SUPABASE_ANON_KEY'
      ]
    });
  }
  next();
};

// GET /api/releases - Get all release items (public)
router.get('/', async (req, res) => {
  try {
    console.log('📡 GET /api/releases - Fetching release items...');
    
    // If Supabase is not available, return empty array with helpful message
    if (!supabase) {
      console.log('⚠️ No Supabase connection, returning empty releases');
      return res.json({
        success: true,
        data: [],
        message: 'Database not connected - check environment variables'
      });
    }
    
    const { data, error } = await supabase
      .from('release_items')
      .select('*')
      .order('release_date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Releases fetch error:', error);
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} release items`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Releases fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch release items' });
  }
});

// GET /api/releases/latest - Get latest chapter releases from the library
router.get('/latest', async (req, res) => {
  try {
    console.log('🚀 GET /api/releases/latest - Starting comprehensive releases fetch...');
    
    // If Supabase is not available, return demo data
    if (!supabase) {
      console.log('⚠️ No Supabase connection, returning demo releases');
      const demoReleases = [
        {
          id: 'demo-1',
          title: 'The Sacred Fire - Chapter 1: Origins',
          description: 'Introduction to the sacred fire and its significance in Zoroastrian worship',
          release_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: 'Chapter',
          link: '/library/sacred-fire#chapter-1',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-2', 
          title: 'Gathas Commentary - Chapter 3: Divine Wisdom',
          description: 'Deep dive into Zarathustra\'s teachings on divine wisdom and truth',
          release_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: 'Chapter',
          link: '/library/gathas-commentary#chapter-3',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-3',
          title: 'Good Thoughts, Good Words, Good Deeds - Chapter 5: Practice',
          description: 'Practical applications of the threefold path in daily life',
          release_date: new Date().toISOString().split('T')[0],
          type: 'Chapter',
          link: '/library/threefold-path#chapter-5',
          created_at: new Date().toISOString()
        }
      ];
      return res.json({
        success: true,
        data: demoReleases,
        demo: true,
        message: 'Using demo data - database not connected'
      });
    }
    
    let releaseItems = [];
    
    // Strategy 1: Try to get the latest chapters from the chapters table
    console.log('📚 Strategy 1: Querying chapters directly...');
    try {
      const { data: chapters, error: chaptersError } = await supabase
        .from('chapters')
        .select(`
          id,
          title,
          chapter_number,
          created_at,
          updated_at,
          work:work_id (
            id,
            title,
            slug
          )
        `)
        .not('work', 'is', null)
        .order('created_at', { ascending: false })
        .limit(6);

      if (!chaptersError && chapters && chapters.length > 0) {
        console.log(`🎯 Found ${chapters.length} chapters, transforming to releases...`);
        
        // Transform chapters into release items format
        releaseItems = chapters.map(chapter => ({
          id: `chapter-${chapter.id}`,
          title: `${chapter.work?.title || 'Unknown Work'} - Chapter ${chapter.chapter_number}: ${chapter.title}`,
          type: 'Chapter',
          description: `New chapter released`,
          release_date: chapter.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          link: chapter.work?.slug ? `/library/${chapter.work.slug}#chapter-${chapter.chapter_number}` : '#',
          created_at: chapter.created_at || new Date().toISOString(),
          updated_at: chapter.updated_at || new Date().toISOString()
        }));
        
        console.log('✅ Chapters Strategy Success: Transformed', releaseItems.length, 'chapters to releases');
        return res.json({
          success: true,
          data: releaseItems
        });
      } else if (chaptersError) {
        console.warn('⚠️ Chapters fetch failed:', chaptersError.message);
      }
    } catch (error) {
      console.warn('⚠️ Chapters strategy failed:', error.message);
    }

    // Strategy 2: Try to get from release_items table as fallback
    console.log('📋 Strategy 2: Querying release_items table...');
    try {
      const { data: releaseData, error: releaseError } = await supabase
        .from('release_items')
        .select('*')
        .order('release_date', { ascending: false })
        .limit(6);

      if (!releaseError && releaseData && releaseData.length > 0) {
        console.log(`✅ Release Items Strategy Success: ${releaseData.length} items`);
        return res.json({
          success: true,
          data: releaseData
        });
      } else if (releaseError) {
        console.warn('⚠️ Release items fetch failed:', releaseError.message);
      }
    } catch (error) {
      console.warn('⚠️ Release items strategy failed:', error.message);
    }

    // Strategy 3: Return empty array if no data found
    console.log('💭 No releases found, returning empty array');
    res.json({
      success: true,
      data: [],
      message: 'No releases found'
    });
  } catch (error) {
    console.error('❌ Latest releases fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch latest releases',
      data: []
    });
  }
});

// POST /api/releases - Create new release item (admin only)
router.post('/', requireSupabase, async (req, res) => {
  try {
    console.log('➕ POST /api/releases - Creating new release item...');
    
    const { title, type, description, release_date, link } = req.body;
    
    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }
    
    const { data, error } = await supabase
      .from('release_items')
      .insert({
        title,
        type,
        description: description || '',
        release_date: release_date || new Date().toISOString().split('T')[0],
        link: link || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('❌ Release item create error:', error);
      throw error;
    }
    
    console.log('✅ Release item created successfully:', data.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Release item create error:', error);
    res.status(500).json({ error: error.message || 'Failed to create release item' });
  }
});

// PUT /api/releases/:id - Update release item (admin only)
router.put('/:id', requireSupabase, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 PUT /api/releases/${id} - Updating release item...`);
    
    const updates = { 
      ...req.body, 
      updated_at: new Date().toISOString() 
    };
    
    const { data, error } = await supabase
      .from('release_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Release item update error:', error);
      throw error;
    }
    
    console.log('✅ Release item updated successfully:', id);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Release item update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update release item' });
  }
});

// DELETE /api/releases/:id - Delete release item (admin only)
router.delete('/:id', requireSupabase, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/releases/${id} - Deleting release item...`);
    
    const { error } = await supabase
      .from('release_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Release item delete error:', error);
      throw error;
    }
    
    console.log('✅ Release item deleted successfully:', id);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Release item delete error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete release item' });
  }
});

// POST /api/releases/sync-from-chapters - Auto-sync latest chapters to release_items
router.post('/sync-from-chapters', requireSupabase, async (req, res) => {
  try {
    console.log('🔄 POST /api/releases/sync-from-chapters - Syncing chapters to releases...');
    
    // Get the latest chapters
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
      console.error('❌ Chapters sync error:', chaptersError);
      throw chaptersError;
    }

    if (!chapters || chapters.length === 0) {
      console.log('ℹ️ No chapters found to sync');
      return res.json({ success: true, synced: 0, message: 'No chapters found to sync' });
    }

    // Clear existing release items that are chapter-based
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
      link: chapter.work?.slug ? `/library/${chapter.work.slug}#chapter-${chapter.chapter_number}` : '#',
      created_at: chapter.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Insert new release items
    const { data: insertedData, error: insertError } = await supabase
      .from('release_items')
      .insert(releaseItems)
      .select();

    if (insertError) {
      console.error('❌ Release items insert error:', insertError);
      throw insertError;
    }

    console.log(`✅ Successfully synced ${insertedData?.length || 0} chapters to release items`);
    res.json({ 
      success: true, 
      synced: insertedData?.length || 0,
      data: insertedData 
    });
  } catch (error) {
    console.error('❌ Chapter sync error:', error);
    res.status(500).json({ error: error.message || 'Failed to sync chapters to releases' });
  }
});

// Health check endpoint - Works even without Supabase
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Releases API is running',
    timestamp: new Date().toISOString(),
    supabaseConnected: !!supabase
  });
});

export default router;