const express = require('express');

function createWikiRoutes(supabase) {
  const router = express.Router();

  // GET /api/wiki/tree - Get the folder tree structure
  router.get('/tree', async (req, res) => {
    try {
      const { data, error } = await supabase.rpc('get_folder_tree', { root_id: req.query.root_id || null });
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching wiki tree:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/wiki/search - Search wiki content
  router.get('/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: 'Search query (q) is required.' });
      }
      const { data, error } = await supabase.rpc('search_content', { search_query: q });
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error searching wiki content:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Add more routes for CRUD operations on wiki_items
  // POST /api/wiki/items - Create a new wiki item (folder or page)
  router.post('/items', async (req, res) => {
    try {
      const { data, error } = await supabase.from('wiki_items').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating wiki item:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/wiki/items/:id - Get a single wiki item
  router.get('/items/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('wiki_items').select('*').eq('id', id).single();
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching wiki item:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /api/wiki/items/:id - Update a wiki item
  router.put('/items/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('wiki_items').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating wiki item:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /api/wiki/items/:id - Delete a wiki item
  router.delete('/items/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('wiki_items').delete().eq('id', id);
      if (error) throw error;
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting wiki item:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = createWikiRoutes;