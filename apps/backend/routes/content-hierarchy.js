import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireRole, requireAuth } from '../middleware/auth.js';

const router = Router();

// =====================================================
// Content Items CRUD
// =====================================================

// Get all content items with hierarchy
router.get('/content-items', requireAuth, async (req, res) => {
  try {
    const { type, parent_id, include_children, status } = req.query;
    
    let query = supabase
      .from('content_items')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (type) query = query.eq('type', type);
    if (parent_id) query = query.eq('parent_id', parent_id);
    if (status) query = query.eq('status', status);
    
    const { data: items, error } = await query;
    if (error) throw error;

    // Build hierarchy tree if requested
    if (include_children === 'true') {
      const hierarchyItems = await buildHierarchyTree(items);
      return res.json({ items: hierarchyItems });
    }

    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single content item with full details
router.get('/content-items/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { include_children, include_chapters } = req.query;
    
    // Get the main item
    const { data: item, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!item) return res.status(404).json({ error: 'Content item not found' });

    let result = { ...item };

    // Include children if requested
    if (include_children === 'true') {
      const { data: children } = await supabase
        .from('content_items')
        .select('*')
        .eq('parent_id', id)
        .order('order_index', { ascending: true });
      
      result.children = children || [];
    }

    // Include chapters if this is an issue
    if (include_chapters === 'true' && item.type === 'issue') {
      const { data: chapters } = await supabase
        .from('chapters')
        .select('*')
        .eq('issue_id', id)
        .order('chapter_number', { ascending: true });
      
      result.chapters = chapters || [];
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new content item
router.post('/content-items', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { type, title, description, cover_image_url, parent_id, order_index, status, published_at, metadata } = req.body;
    
    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Validate hierarchy
    if (parent_id) {
      const { data: parent } = await supabase
        .from('content_items')
        .select('type')
        .eq('id', parent_id)
        .single();
      
      if (!parent) {
        return res.status(400).json({ error: 'Parent item not found' });
      }
      
      // Validate hierarchy order
      const validParents = {
        volume: 'book',
        saga: 'volume',
        arc: 'saga',
        issue: 'arc'
      };
      
      if (type !== 'book' && validParents[type] !== parent.type) {
        return res.status(400).json({ 
          error: `Invalid hierarchy: ${type} cannot be child of ${parent.type}` 
        });
      }
    }

    const { data: item, error } = await supabase
      .from('content_items')
      .insert({
        type,
        title,
        slug,
        description,
        cover_image_url,
        parent_id,
        order_index: order_index || 0,
        status: status || 'draft',
        published_at,
        metadata: metadata || {},
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(item);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update content item
router.put('/content-items/:id', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };
    
    // If title is being updated, update slug too
    if (updates.title) {
      updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const { data: item, error } = await supabase
      .from('content_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete content item
router.delete('/content-items/:id', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Content item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// Chapters CRUD
// =====================================================

// Get chapters for an issue
router.get('/issues/:issueId/chapters', requireAuth, async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status, published_only } = req.query;
    
    let query = supabase
      .from('chapters')
      .select('*')
      .eq('issue_id', issueId)
      .order('chapter_number', { ascending: true });
    
    if (status) query = query.eq('status', status);
    if (published_only === 'true') query = query.eq('status', 'published');
    
    const { data: chapters, error } = await query;
    if (error) throw error;
    
    res.json({ chapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new chapter
router.post('/issues/:issueId/chapters', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { issueId } = req.params;
    const { title, content, chapter_number, status, published_at, metadata } = req.body;
    
    // Generate slug and calculate word count
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const plain_content = extractPlainText(content);
    const word_count = plain_content.split(/\s+/).length;
    const estimated_read_time = Math.ceil(word_count / 200); // 200 words per minute
    
    const { data: chapter, error } = await supabase
      .from('chapters')
      .insert({
        issue_id: issueId,
        title,
        slug,
        content,
        plain_content,
        chapter_number,
        word_count,
        estimated_read_time,
        status: status || 'draft',
        published_at,
        metadata: metadata || {},
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update chapter
router.put('/chapters/:id', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };
    
    // Recalculate word count if content is updated
    if (updates.content) {
      const plain_content = extractPlainText(updates.content);
      updates.plain_content = plain_content;
      updates.word_count = plain_content.split(/\s+/).length;
      updates.estimated_read_time = Math.ceil(updates.word_count / 200);
    }
    
    // Update slug if title changes
    if (updates.title) {
      updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    const { data: chapter, error } = await supabase
      .from('chapters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// User Library Management
// =====================================================

// Get user's library
router.get('/user-library', requireAuth, async (req, res) => {
  try {
    const { type, sort_by, sort_direction, page = 1, per_page = 20 } = req.query;
    const userId = req.user.id;
    
    let query = supabase
      .from('user_library')
      .select(`
        *,
        content_item:content_items!inner(*)
      `)
      .eq('user_id', userId);
    
    if (type) {
      query = query.eq('content_item.type', type);
    }
    
    // Sorting
    const sortField = sort_by || 'added_at';
    const sortDir = sort_direction === 'asc' ? true : false;
    query = query.order(sortField, { ascending: sortDir });
    
    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(per_page);
    query = query.range(offset, offset + parseInt(per_page) - 1);
    
    const { data: libraryItems, error, count } = await query;
    if (error) throw error;
    
    // Get reading progress for each item
    const itemsWithProgress = await Promise.all(
      libraryItems.map(async (item) => {
        const progress = await getUserReadingProgress(userId, item.content_item_id);
        return {
          ...item,
          reading_progress: progress
        };
      })
    );
    
    res.json({ 
      items: itemsWithProgress,
      pagination: {
        page: parseInt(page),
        per_page: parseInt(per_page),
        total: count,
        total_pages: Math.ceil(count / parseInt(per_page))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to user library
router.post('/user-library', requireAuth, async (req, res) => {
  try {
    const { content_item_id, is_favorite = false, personal_notes = '' } = req.body;
    const userId = req.user.id;
    
    const { data: libraryItem, error } = await supabase
      .from('user_library')
      .insert({
        user_id: userId,
        content_item_id,
        is_favorite,
        personal_notes
      })
      .select(`
        *,
        content_item:content_items(*)
      `)
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Item already in library' });
      }
      throw error;
    }
    
    res.status(201).json(libraryItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from user library
router.delete('/user-library/:contentItemId', requireAuth, async (req, res) => {
  try {
    const { contentItemId } = req.params;
    const userId = req.user.id;
    
    const { error } = await supabase
      .from('user_library')
      .delete()
      .eq('user_id', userId)
      .eq('content_item_id', contentItemId);

    if (error) throw error;
    res.json({ message: 'Item removed from library' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// Reading Progress Management
// =====================================================

// Update reading progress
router.post('/reading-progress', requireAuth, async (req, res) => {
  try {
    const { chapter_id, progress_percentage, bookmarks, notes } = req.body;
    const userId = req.user.id;
    
    const completed = progress_percentage >= 100;
    
    const { data: progress, error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: userId,
        chapter_id,
        progress_percentage,
        completed,
        bookmarks: bookmarks || [],
        notes: notes || [],
        last_read_at: new Date().toISOString(),
        reading_time_minutes: supabase.rpc('increment_reading_time', { 
          user_id: userId, 
          chapter_id, 
          minutes: 1 
        })
      })
      .select()
      .single();

    if (error) throw error;
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's reading progress for a content item
router.get('/reading-progress/:contentItemId', requireAuth, async (req, res) => {
  try {
    const { contentItemId } = req.params;
    const userId = req.user.id;
    
    const progress = await getUserReadingProgress(userId, contentItemId);
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// Public Library Endpoints
// =====================================================

// Get public library (published content)
router.get('/library', async (req, res) => {
  try {
    const { 
      type, 
      search, 
      sort_by = 'created_at', 
      sort_direction = 'desc',
      page = 1, 
      per_page = 20,
      min_rating,
      completion_status
    } = req.query;
    
    let query = supabase
      .from('content_items')
      .select('*')
      .eq('status', 'published');
    
    if (type) query = query.eq('type', type);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    if (min_rating) query = query.gte('average_rating', parseFloat(min_rating));
    
    if (completion_status) {
      switch (completion_status) {
        case 'completed':
          query = query.eq('completion_percentage', 100);
          break;
        case 'in_progress':
          query = query.gt('completion_percentage', 0).lt('completion_percentage', 100);
          break;
        case 'not_started':
          query = query.eq('completion_percentage', 0);
          break;
      }
    }
    
    // Sorting
    const sortDir = sort_direction === 'asc';
    query = query.order(sort_by, { ascending: sortDir });
    
    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(per_page);
    const { data: items, error, count } = await query
      .range(offset, offset + parseInt(per_page) - 1);
    
    if (error) throw error;
    
    res.json({ 
      items,
      pagination: {
        page: parseInt(page),
        per_page: parseInt(per_page),
        total: count,
        total_pages: Math.ceil(count / parseInt(per_page))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================================================
// Utility Functions
// =====================================================

// Build hierarchical tree structure
async function buildHierarchyTree(items) {
  const itemMap = new Map();
  const rootItems = [];
  
  // Create map of all items
  items.forEach(item => itemMap.set(item.id, { ...item, children: [] }));
  
  // Build tree structure
  items.forEach(item => {
    if (item.parent_id) {
      const parent = itemMap.get(item.parent_id);
      if (parent) {
        parent.children.push(itemMap.get(item.id));
      }
    } else {
      rootItems.push(itemMap.get(item.id));
    }
  });
  
  return rootItems;
}

// Extract plain text from TipTap JSON content
function extractPlainText(content) {
  if (!content || typeof content !== 'object') return '';
  
  function extractFromNode(node) {
    if (node.type === 'text') {
      return node.text || '';
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractFromNode).join(' ');
    }
    
    return '';
  }
  
  return extractFromNode(content).trim();
}

// Get user's reading progress for a content item and all its children
async function getUserReadingProgress(userId, contentItemId) {
  try {
    // Get all chapters related to this content item and its descendants
    const { data: chapters } = await supabase.rpc('get_content_item_chapters', {
      content_item_id: contentItemId
    });
    
    if (!chapters || chapters.length === 0) {
      return { overall_progress: 0, chapters_progress: [] };
    }
    
    // Get reading progress for all chapters
    const { data: progress } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', userId)
      .in('chapter_id', chapters.map(c => c.id));
    
    const progressMap = new Map();
    (progress || []).forEach(p => progressMap.set(p.chapter_id, p));
    
    const chaptersProgress = chapters.map(chapter => ({
      chapter,
      progress: progressMap.get(chapter.id) || {
        progress_percentage: 0,
        completed: false,
        last_read_at: null
      }
    }));
    
    const overallProgress = chapters.length > 0 
      ? Math.round(chaptersProgress.reduce((sum, cp) => sum + cp.progress.progress_percentage, 0) / chapters.length)
      : 0;
    
    return {
      overall_progress: overallProgress,
      chapters_progress: chaptersProgress,
      total_chapters: chapters.length,
      completed_chapters: chaptersProgress.filter(cp => cp.progress.completed).length
    };
  } catch (error) {
    console.error('Error getting reading progress:', error);
    return { overall_progress: 0, chapters_progress: [] };
  }
}

export default router;