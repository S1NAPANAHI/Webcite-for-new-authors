import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase client with service key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
);

console.log('📚 Releases routes initialized');

// GET /api/releases - Get all release items (public)
router.get('/', async (req, res) => {
  try {
    console.log('📡 GET /api/releases - Fetching release items...');
    
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
    console.log('📡 GET /api/releases/latest - Fetching latest chapters from library...');
    
    // First, try to get the latest chapters from the chapters table
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

    if (chaptersError) {
      console.warn('⚠️ Chapters fetch failed, trying alternative approach:', chaptersError);
    }

    // Transform chapters into release items format
    let releaseItems = [];
    if (chapters && chapters.length > 0) {
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
    }

    // If no chapters, try to get from release_items table as fallback
    if (releaseItems.length === 0) {
      const { data: releaseData, error: releaseError } = await supabase
        .from('release_items')
        .select('*')
        .order('release_date', { ascending: false })
        .limit(6);

      if (releaseError) {
        console.warn('⚠️ Release items fetch also failed:', releaseError);
      } else {
        releaseItems = releaseData || [];
      }
    }

    console.log(`✅ Fetched ${releaseItems.length} latest release items`);
    res.json(releaseItems);
  } catch (error) {
    console.error('❌ Latest releases fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch latest releases' });
  }
});

// POST /api/releases - Create new release item (admin only)
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
router.post('/sync-from-chapters', async (req, res) => {
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

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Releases API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;