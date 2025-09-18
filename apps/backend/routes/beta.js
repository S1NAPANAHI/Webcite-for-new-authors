import express from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { supabaseAdmin } from '@zoroaster/shared/supabaseAdminClient.js';

const router = express.Router();

// Get all beta applications
router.get('/applications', requireAdmin, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const { data: applications, error } = await supabaseAdmin
      .from('beta_applications')
      .select('*')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      applications: applications || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: applications?.length || 0
      }
    });
  } catch (error) {
    console.error('Error fetching beta applications:', error);
    res.status(500).json({ error: 'Failed to fetch beta applications', message: error.message });
  }
});

// Get a single beta application by ID
router.get('/applications/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: application, error } = await supabaseAdmin
      .from('beta_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Beta application not found' });
      }
      throw error;
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching beta application:', error);
    res.status(500).json({ error: 'Failed to fetch beta application', message: error.message });
  }
});

// Update a beta application
router.put('/applications/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationData } = req.body;

    const { data: updatedApplication, error } = await supabaseAdmin
      .from('beta_applications')
      .update(applicationData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating beta application:', error);
    res.status(500).json({ error: 'Failed to update beta application', message: error.message });
  }
});

export default router;