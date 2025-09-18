import express from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { supabaseAdmin } from '@zoroaster/shared/supabaseAdminClient.js';

const router = express.Router();

// Wiki CRUD
router.get('/wiki', requireAdmin, async (req, res) => {
  try {
    const { data: wikiItems, error } = await supabaseAdmin
      .from('wiki_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(wikiItems);
  } catch (error) {
    console.error('Error fetching wiki items:', error);
    res.status(500).json({ error: 'Failed to fetch wiki items', message: error.message });
  }
});

router.get('/wiki/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: wikiItem, error } = await supabaseAdmin
      .from('wiki_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Wiki item not found' });
      }
      throw error;
    }

    res.json(wikiItem);
  } catch (error) {
    console.error('Error fetching wiki item:', error);
    res.status(500).json({ error: 'Failed to fetch wiki item', message: error.message });
  }
});

router.post('/wiki', requireAdmin, async (req, res) => {
  try {
    const { wikiItemData } = req.body;

    const { data: newWikiItem, error } = await supabaseAdmin
      .from('wiki_items')
      .insert(wikiItemData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(newWikiItem);
  } catch (error) {
    console.error('Error creating wiki item:', error);
    res.status(500).json({ error: 'Failed to create wiki item', message: error.message });
  }
});

router.put('/wiki/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { wikiItemData } = req.body;

    const { data: updatedWikiItem, error } = await supabaseAdmin
      .from('wiki_items')
      .update(wikiItemData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(updatedWikiItem);
  } catch (error) {
    console.error('Error updating wiki item:', error);
    res.status(500).json({ error: 'Failed to update wiki item', message: error.message });
  }
});

router.delete('/wiki/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('wiki_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting wiki item:', error);
    res.status(500).json({ error: 'Failed to delete wiki item', message: error.message });
  }
});

// Timeline CRUD
router.get('/timeline', requireAdmin, async (req, res) => {
  try {
    const { data: timelineEvents, error } = await supabaseAdmin
      .from('timeline_events')
      .select('*')
      .order('occurred_at', { ascending: false });

    if (error) throw error;

    res.json(timelineEvents);
  } catch (error) {
    console.error('Error fetching timeline events:', error);
    res.status(500).json({ error: 'Failed to fetch timeline events', message: error.message });
  }
});

router.post('/timeline', requireAdmin, async (req, res) => {
  try {
    const { timelineEventData } = req.body;

    const { data: newTimelineEvent, error } = await supabaseAdmin
      .from('timeline_events')
      .insert(timelineEventData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(newTimelineEvent);
  } catch (error) {
    console.error('Error creating timeline event:', error);
    res.status(500).json({ error: 'Failed to create timeline event', message: error.message });
  }
});

router.put('/timeline/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { timelineEventData } = req.body;

    const { data: updatedTimelineEvent, error } = await supabaseAdmin
      .from('timeline_events')
      .update(timelineEventData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(updatedTimelineEvent);
  } catch (error) {
    console.error('Error updating timeline event:', error);
    res.status(500).json({ error: 'Failed to update timeline event', message: error.message });
  }
});

router.delete('/timeline/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('timeline_events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    res.status(500).json({ error: 'Failed to delete timeline event', message: error.message });
  }
});

// Character CRUD
router.get('/characters', requireAdmin, async (req, res) => {
  try {
    const { data: characters, error } = await supabaseAdmin
      .from('characters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters', message: error.message });
  }
});

router.post('/characters', requireAdmin, async (req, res) => {
  try {
    const { characterData } = req.body;

    const { data: newCharacter, error } = await supabaseAdmin
      .from('characters')
      .insert(characterData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(newCharacter);
  } catch (error) {
    console.error('Error creating character:', error);
    res.status(500).json({ error: 'Failed to create character', message: error.message });
  }
});

router.put('/characters/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { characterData } = req.body;

    const { data: updatedCharacter, error } = await supabaseAdmin
      .from('characters')
      .update(characterData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(updatedCharacter);
  } catch (error) {
    console.error('Error updating character:', error);
    res.status(500).json({ error: 'Failed to update character', message: error.message });
  }
});

router.delete('/characters/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('characters')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting character:', error);
    res.status(500).json({ error: 'Failed to delete character', message: error.message });
  }
});

export default router;