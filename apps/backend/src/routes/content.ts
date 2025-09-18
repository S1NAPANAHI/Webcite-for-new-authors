import express from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { requireAuth, requireRole } from '../middleware/auth';

const router = express.Router();

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const contentItemSchema = z.object({
  type: z.enum(['book', 'volume', 'saga', 'arc', 'issue']),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  parent_id: z.string().uuid().optional(),
  order_index: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).default('draft'),
  published_at: z.string().datetime().optional(),
  metadata: z.record(z.any()).default({})
});

const chapterSchema = z.object({
  issue_id: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  chapter_number: z.number().int().min(1),
  content: z.record(z.any()),
  plain_content: z.string().default(''),
  word_count: z.number().int().min(0).default(0),
  estimated_read_time: z.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).default('draft'),
  published_at: z.string().datetime().optional(),
  metadata: z.record(z.any()).default({})
});

const libraryItemSchema = z.object({
  content_item_id: z.string().uuid(),
  is_favorite: z.boolean().optional(),
  personal_rating: z.number().int().min(1).max(5).optional(),
  personal_notes: z.string().optional()
});

const readingProgressSchema = z.object({
  chapter_id: z.string().uuid(),
  progress_percentage: z.number().int().min(0).max(100).default(0),
  completed: z.boolean().default(false),
  reading_time_minutes: z.number().int().min(0).default(0),
  bookmarks: z.array(z.any()).default([]),
  notes: z.array(z.any()).default([])
});

const contentRatingSchema = z.object({
  content_item_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  review_title: z.string().optional(),
  review_text: z.string().optional()
});

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Build hierarchical tree structure from flat content items
 */
function buildContentTree(items: any[]): any[] {
  const itemMap = new Map();
  const roots: any[] = [];
  
  // Create map of all items
  items.forEach(item => {
    item.children = [];
    itemMap.set(item.id, item);
  });
  
  // Build tree structure
  items.forEach(item => {
    if (item.parent_id && itemMap.has(item.parent_id)) {
      itemMap.get(item.parent_id).children.push(item);
    } else {
      roots.push(item);
    }
  });
  
  // Sort children by order_index
  function sortChildren(node: any) {
    if (node.children && node.children.length > 0) {
      node.children.sort((a: any, b: any) => a.order_index - b.order_index);
      node.children.forEach(sortChildren);
    }
  }
  
  roots.forEach(sortChildren);
  return roots.sort((a, b) => a.order_index - b.order_index);
}

/**
 * Get hierarchy path for a content item
 */
async function getHierarchyPath(itemId: string) {
  const { data, error } = await supabase
    .rpc('get_content_hierarchy_path', { content_item_id: itemId });
  
  if (error) throw error;
  return data || [];
}

// =====================================================
// CONTENT ITEMS ENDPOINTS
// =====================================================

/**
 * GET /api/content/items
 * Get all content items with optional filtering
 */
router.get('/items', async (req, res) => {
  try {
    const {
      type,
      status = 'published',
      search,
      parent_id,
      include_children = 'false',
      page = '1',
      limit = '20'
    } = req.query;
    
    let query = supabase
      .from('content_items')
      .select(`
        *,
        content_ratings!inner(
          rating,
          review_title,
          review_text,
          created_at,
          user_id
        )
      `);
    
    // Apply filters
    if (type) query = query.eq('type', type);
    if (status && status !== 'all') query = query.eq('status', status);
    if (parent_id) query = query.eq('parent_id', parent_id);
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Apply pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;
    
    query = query
      .order('order_index', { ascending: true })
      .range(offset, offset + limitNum - 1);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Build tree structure if requested
    let result = data;
    if (include_children === 'true' && !parent_id) {
      // Get all items to build tree
      const { data: allItems, error: allError } = await supabase
        .from('content_items')
        .select('*')
        .eq('status', status || 'published')
        .order('order_index', { ascending: true });
      
      if (allError) throw allError;
      result = buildContentTree(allItems || []);
    }
    
    res.json({
      data: result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: data?.length || 0
      }
    });
  } catch (error) {
    console.error('Error fetching content items:', error);
    res.status(500).json({ error: 'Failed to fetch content items' });
  }
});

/**
 * GET /api/content/items/:id
 * Get a specific content item with its children
 */
router.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { include_children = 'false', include_chapters = 'false' } = req.query;
    
    // Get the main item
    const { data: item, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!item) {
      return res.status(404).json({ error: 'Content item not found' });
    }
    
    // Get hierarchy path
    const hierarchyPath = await getHierarchyPath(id);
    
    // Get children if requested
    let children = [];
    if (include_children === 'true') {
      const { data: childrenData, error: childrenError } = await supabase
        .from('content_items')
        .select('*')
        .eq('parent_id', id)
        .order('order_index', { ascending: true });
      
      if (childrenError) throw childrenError;
      children = childrenData || [];
    }
    
    // Get chapters if requested (for issues)
    let chapters = [];
    if (include_chapters === 'true' && item.type === 'issue') {
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .eq('issue_id', id)
        .eq('status', 'published')
        .order('chapter_number', { ascending: true });
      
      if (chaptersError) throw chaptersError;
      chapters = chaptersData || [];
    }
    
    res.json({
      ...item,
      hierarchy_path: hierarchyPath,
      children,
      chapters
    });
  } catch (error) {
    console.error('Error fetching content item:', error);
    res.status(500).json({ error: 'Failed to fetch content item' });
  }
});

/**
 * POST /api/content/items
 * Create a new content item
 */
router.post('/items', requireAuth, requireRole(['admin', 'author']), async (req, res) => {
  try {
    const validatedData = contentItemSchema.parse(req.body);
    
    // Add created_by to metadata
    const itemData = {
      ...validatedData,
      metadata: {
        ...validatedData.metadata,
        created_by: req.user?.id
      }
    };
    
    const { data, error } = await supabase
      .from('content_items')
      .insert(itemData)
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating content item:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create content item' });
  }
});

/**
 * PUT /api/content/items/:id
 * Update a content item
 */
router.put('/items/:id', requireAuth, requireRole(['admin', 'author']), async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = contentItemSchema.partial().parse(req.body);
    
    const { data, error } = await supabase
      .from('content_items')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error updating content item:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update content item' });
  }
});

/**
 * DELETE /api/content/items/:id
 * Delete a content item (cascades to children)
 */
router.delete('/items/:id', requireAuth, requireRole(['admin', 'author']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting content item:', error);
    res.status(500).json({ error: 'Failed to delete content item' });
  }
});

// =====================================================
// CHAPTERS ENDPOINTS
// =====================================================

/**
 * GET /api/content/chapters
 * Get chapters with optional filtering
 */
router.get('/chapters', async (req, res) => {
  try {
    const {
      issue_id,
      status = 'published',
      search,
      page = '1',
      limit = '20'
    } = req.query;
    
    let query = supabase
      .from('chapters')
      .select(`
        *,
        issue:content_items!inner(
          id,
          title,
          slug,
          type
        )
      `);
    
    // Apply filters
    if (issue_id) query = query.eq('issue_id', issue_id);
    if (status && status !== 'all') query = query.eq('status', status);
    if (search) {
      query = query.or(`title.ilike.%${search}%,plain_content.ilike.%${search}%`);
    }
    
    // Apply pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;
    
    query = query
      .order('chapter_number', { ascending: true })
      .range(offset, offset + limitNum - 1);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: data?.length || 0
      }
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

/**
 * GET /api/content/chapters/:id
 * Get a specific chapter
 */
router.get('/chapters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('chapters')
      .select(`
        *,
        issue:content_items!inner(
          id,
          title,
          slug,
          type
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({ error: 'Failed to fetch chapter' });
  }
});

/**
 * POST /api/content/chapters
 * Create a new chapter
 */
router.post('/chapters', requireAuth, requireRole(['admin', 'author']), async (req, res) => {
  try {
    const validatedData = chapterSchema.parse(req.body);
    
    // Add created_by to metadata
    const chapterData = {
      ...validatedData,
      metadata: {
        ...validatedData.metadata,
        created_by: req.user?.id
      }
    };
    
    const { data, error } = await supabase
      .from('chapters')
      .insert(chapterData)
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating chapter:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create chapter' });
  }
});

/**
 * PUT /api/content/chapters/:id
 * Update a chapter
 */
router.put('/chapters/:id', requireAuth, requireRole(['admin', 'author']), async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = chapterSchema.partial().parse(req.body);
    
    const { data, error } = await supabase
      .from('chapters')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error updating chapter:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update chapter' });
  }
});

/**
 * DELETE /api/content/chapters/:id
 * Delete a chapter
 */
router.delete('/chapters/:id', requireAuth, requireRole(['admin', 'author']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({ error: 'Failed to delete chapter' });
  }
});

// =====================================================
// USER LIBRARY ENDPOINTS
// =====================================================

/**
 * GET /api/content/library
 * Get user's library with reading progress
 */
router.get('/library', requireAuth, async (req, res) => {
  try {
    const {
      content_type = 'all',
      library_filter = 'all',
      sort_by = 'added_at',
      sort_direction = 'desc',
      page = '1',
      limit = '20'
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;
    
    const { data, error } = await supabase
      .rpc('get_user_library_with_progress', {
        user_id: req.user!.id,
        content_type: content_type as string,
        library_filter: library_filter as string,
        sort_by: sort_by as string,
        sort_direction: sort_direction as string,
        page_size: limitNum,
        page_offset: offset
      });
    
    if (error) throw error;
    
    res.json({
      data: data || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: data?.length || 0
      }
    });
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({ error: 'Failed to fetch library' });
  }
});

/**
 * POST /api/content/library
 * Add item to user's library
 */
router.post('/library', requireAuth, async (req, res) => {
  try {
    const validatedData = libraryItemSchema.parse(req.body);
    
    const { data, error } = await supabase
      .from('user_library')
      .insert({
        ...validatedData,
        user_id: req.user!.id
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Item already in library' });
      }
      throw error;
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding to library:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to add to library' });
  }
});

/**
 * DELETE /api/content/library/:content_item_id
 * Remove item from user's library
 */
router.delete('/library/:content_item_id', requireAuth, async (req, res) => {
  try {
    const { content_item_id } = req.params;
    
    const { error } = await supabase
      .from('user_library')
      .delete()
      .eq('user_id', req.user!.id)
      .eq('content_item_id', content_item_id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    console.error('Error removing from library:', error);
    res.status(500).json({ error: 'Failed to remove from library' });
  }
});

// =====================================================
// READING PROGRESS ENDPOINTS
// =====================================================

/**
 * GET /api/content/progress
 * Get user's reading progress
 */
router.get('/progress', requireAuth, async (req, res) => {
  try {
    const { chapter_id, content_item_id } = req.query;
    
    let query = supabase
      .from('reading_progress')
      .select(`
        *,
        chapter:chapters!inner(
          id,
          title,
          chapter_number,
          issue_id
        )
      `)
      .eq('user_id', req.user!.id);
    
    if (chapter_id) {
      query = query.eq('chapter_id', chapter_id);
    }
    
    if (content_item_id) {
      // Get progress for all chapters in a content item
      query = query.eq('chapter.issue_id', content_item_id);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching reading progress:', error);
    res.status(500).json({ error: 'Failed to fetch reading progress' });
  }
});

/**
 * POST /api/content/progress
 * Update reading progress
 */
router.post('/progress', requireAuth, async (req, res) => {
  try {
    const validatedData = readingProgressSchema.parse(req.body);
    
    const { data, error } = await supabase
      .from('reading_progress')
      .upsert({
        ...validatedData,
        user_id: req.user!.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error updating reading progress:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update reading progress' });
  }
});

// =====================================================
// CONTENT RATINGS ENDPOINTS
// =====================================================

/**
 * GET /api/content/ratings/:content_item_id
 * Get ratings for a content item
 */
router.get('/ratings/:content_item_id', async (req, res) => {
  try {
    const { content_item_id } = req.params;
    const { page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;
    
    const { data, error } = await supabase
      .from('content_ratings')
      .select('*')
      .eq('content_item_id', content_item_id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);
    
    if (error) throw error;
    
    res.json({
      data: data || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: data?.length || 0
      }
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

/**
 * POST /api/content/ratings
 * Add/update a rating
 */
router.post('/ratings', requireAuth, async (req, res) => {
  try {
    const validatedData = contentRatingSchema.parse(req.body);
    
    const { data, error } = await supabase
      .from('content_ratings')
      .upsert({
        ...validatedData,
        user_id: req.user!.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error adding rating:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to add rating' });
  }
});

// =====================================================
// SEARCH ENDPOINTS
// =====================================================

/**
 * GET /api/content/search
 * Search across all content
 */
router.get('/search', async (req, res) => {
  try {
    const {
      query = '',
      content_type = 'all',
      min_rating = '0',
      completion_status = 'all',
      sort_by = 'created_at',
      sort_direction = 'desc',
      page = '1',
      limit = '20'
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;
    
    const { data, error } = await supabase
      .rpc('search_content_items', {
        search_query: query as string,
        content_type: content_type as string,
        min_rating: parseFloat(min_rating as string),
        completion_status: completion_status as string,
        sort_by: sort_by as string,
        sort_direction: sort_direction as string,
        page_size: limitNum,
        page_offset: offset
      });
    
    if (error) throw error;
    
    res.json({
      data: data || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: data?.[0]?.total_count || 0
      }
    });
  } catch (error) {
    console.error('Error searching content:', error);
    res.status(500).json({ error: 'Failed to search content' });
  }
});

export default router;