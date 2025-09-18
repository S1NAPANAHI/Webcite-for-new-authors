import express from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { supabaseAdmin } from '@zoroaster/shared/supabaseAdminClient.js';

const router = express.Router();

// Pages CRUD
router.get('/pages', requireAdmin, async (req, res) => {
  try {
    const { data: pages, error } = await supabaseAdmin
      .from('pages')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/pages', requireAdmin, async (req, res) => {
  try {
    const { title, slug, content, status, publish_at } = req.body;
    
    const { data: page, error } = await supabaseAdmin
      .from('pages')
      .insert({
        title,
        slug,
        content,
        status,
        publish_at,
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/pages/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status, publish_at } = req.body;

    const { data: page, error } = await supabaseAdmin
      .from('pages')
      .update({
        title,
        content,
        status,
        publish_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/pages/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog posts CRUD
router.get('/blog', requireAdmin, async (req, res) => {
  try {
    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/blog', requireAdmin, async (req, res) => {
  try {
    const { title, slug, excerpt, content, tags, cover_url, status, publish_at } = req.body;
    
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        title,
        slug,
        excerpt,
        content,
        tags,
        cover_url,
        status,
        publish_at,
        author_id: req.user.id
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/blog/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, tags, cover_url, status, publish_at } = req.body;

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .update({
        title,
        slug,
        excerpt,
        content,
        tags,
        cover_url,
        status,
        publish_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/blog/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chapters CRUD
router.get('/chapters', requireAdmin, async (req, res) => {
  try {
    const { data: chapters, error } = await supabaseAdmin
      .from('chapters')
      .select(`
        *,
        works (
          id,
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chapters', requireAdmin, async (req, res) => {
  try {
    const { work_id, chapter_number, title, content, status, release_at } = req.body;
    
    const { data: chapter, error } = await supabaseAdmin
      .from('chapters')
      .insert({
        work_id,
        chapter_number,
        title,
        content,
        status,
        release_at
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/chapters/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { work_id, chapter_number, title, content, status, release_at } = req.body;

    const { data: chapter, error } = await supabaseAdmin
      .from('chapters')
      .update({
        work_id,
        chapter_number,
        title,
        content,
        status,
        release_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/chapters/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('chapters')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;