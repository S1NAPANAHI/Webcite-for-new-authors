// Homepage Management API Routes
// Provides endpoints for managing homepage content, metrics, and quotes

import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Authentication middleware for admin-only routes
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = user;
    req.profile = profile;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// ===== PUBLIC ROUTES =====

// GET /api/homepage - Get complete homepage data
router.get('/', async (req, res) => {
  try {
    console.log('🏠 Homepage: Fetching complete homepage data');
    
    // Fetch homepage content
    const { data: homepageData, error: homepageError } = await supabase
      .from('homepage_content')
      .select('*')
      .eq('id', 'homepage')
      .single();

    if (homepageError) {
      console.error('Homepage content error:', homepageError);
      return res.status(500).json({ error: 'Failed to fetch homepage content' });
    }

    // Fetch active quotes
    const { data: quotes, error: quotesError } = await supabase
      .from('homepage_quotes')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (quotesError) {
      console.error('Homepage quotes error:', quotesError);
      return res.status(500).json({ error: 'Failed to fetch quotes' });
    }

    // Transform data for frontend compatibility
    const response = {
      content: homepageData,
      quotes: quotes || [],
      metrics: {
        words_written: homepageData.words_written,
        beta_readers: homepageData.beta_readers,
        average_rating: parseFloat(homepageData.average_rating),
        books_published: homepageData.books_published
      },
      sections: {
        show_latest_news: homepageData.show_latest_news,
        show_latest_releases: homepageData.show_latest_releases,
        show_artist_collaboration: homepageData.show_artist_collaboration,
        show_progress_metrics: homepageData.show_progress_metrics
      }
    };

    console.log('✅ Homepage data fetched successfully:', {
      contentId: homepageData.id,
      quotesCount: quotes?.length || 0,
      metricsIncluded: true
    });

    res.json(response);
  } catch (error) {
    console.error('❌ Homepage fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/homepage/metrics - Get just the metrics (for frequent updates)
router.get('/metrics', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('homepage_content')
      .select('words_written, beta_readers, average_rating, books_published, updated_at')
      .eq('id', 'homepage')
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch metrics' });
    }

    res.json({
      words_written: data.words_written,
      beta_readers: data.beta_readers,
      average_rating: parseFloat(data.average_rating),
      books_published: data.books_published,
      last_updated: data.updated_at
    });
  } catch (error) {
    console.error('Metrics fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/homepage/quotes - Get active quotes only
router.get('/quotes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('homepage_quotes')
      .select('id, quote_text, author, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch quotes' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Quotes fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== ADMIN-ONLY ROUTES =====

// PUT /api/homepage/content - Update homepage content
router.put('/content', requireAdmin, async (req, res) => {
  try {
    const {
      hero_title,
      hero_subtitle,
      hero_description,
      hero_quote,
      cta_button_text,
      cta_button_link,
      show_latest_news,
      show_latest_releases,
      show_artist_collaboration,
      show_progress_metrics
    } = req.body;

    console.log('🔄 Homepage: Updating content as admin:', req.user.email);

    const { data, error } = await supabase
      .from('homepage_content')
      .update({
        hero_title,
        hero_subtitle,
        hero_description,
        hero_quote,
        cta_button_text,
        cta_button_link,
        show_latest_news,
        show_latest_releases,
        show_artist_collaboration,
        show_progress_metrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', 'homepage')
      .select()
      .single();

    if (error) {
      console.error('Homepage update error:', error);
      return res.status(500).json({ error: 'Failed to update homepage content' });
    }

    console.log('✅ Homepage content updated successfully');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Homepage content update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/homepage/metrics - Manually update metrics
router.put('/metrics', requireAdmin, async (req, res) => {
  try {
    const {
      words_written,
      beta_readers,
      average_rating,
      books_published
    } = req.body;

    console.log('📊 Homepage: Manually updating metrics as admin:', req.user.email);

    const { data, error } = await supabase
      .from('homepage_content')
      .update({
        words_written: words_written ? parseInt(words_written) : undefined,
        beta_readers: beta_readers ? parseInt(beta_readers) : undefined,
        average_rating: average_rating ? parseFloat(average_rating) : undefined,
        books_published: books_published ? parseInt(books_published) : undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', 'homepage')
      .select()
      .single();

    if (error) {
      console.error('Metrics update error:', error);
      return res.status(500).json({ error: 'Failed to update metrics' });
    }

    console.log('✅ Homepage metrics updated manually');
    res.json({ success: true, data });
  } catch (error) {
    console.error('Metrics update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/homepage/metrics/calculate - Trigger automatic metrics calculation
router.post('/metrics/calculate', requireAdmin, async (req, res) => {
  try {
    console.log('⚡ Homepage: Triggering metrics calculation as admin:', req.user.email);

    // Call the PostgreSQL function to calculate metrics
    const { error } = await supabase.rpc('calculate_homepage_metrics');

    if (error) {
      console.error('Metrics calculation error:', error);
      return res.status(500).json({ error: 'Failed to calculate metrics' });
    }

    // Fetch updated metrics
    const { data, error: fetchError } = await supabase
      .from('homepage_content')
      .select('words_written, beta_readers, average_rating, books_published, updated_at')
      .eq('id', 'homepage')
      .single();

    if (fetchError) {
      return res.status(500).json({ error: 'Calculated successfully but failed to fetch updated data' });
    }

    console.log('✅ Homepage metrics calculated and updated automatically');
    res.json({ 
      success: true, 
      message: 'Metrics calculated successfully',
      data: {
        words_written: data.words_written,
        beta_readers: data.beta_readers,
        average_rating: parseFloat(data.average_rating),
        books_published: data.books_published,
        last_updated: data.updated_at
      }
    });
  } catch (error) {
    console.error('Metrics calculation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== QUOTES MANAGEMENT =====

// GET /api/homepage/quotes/all - Get all quotes (admin only)
router.get('/quotes/all', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('homepage_quotes')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch all quotes' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('All quotes fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/homepage/quotes - Add new quote
router.post('/quotes', requireAdmin, async (req, res) => {
  try {
    const { quote_text, author, display_order } = req.body;

    if (!quote_text) {
      return res.status(400).json({ error: 'Quote text is required' });
    }

    const { data, error } = await supabase
      .from('homepage_quotes')
      .insert({
        quote_text,
        author: author || 'Zoroastrian Wisdom',
        display_order: display_order || 0,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Quote creation error:', error);
      return res.status(500).json({ error: 'Failed to create quote' });
    }

    console.log('✅ New quote added:', data.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Quote creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/homepage/quotes/:id - Update quote
router.put('/quotes/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { quote_text, author, display_order, is_active } = req.body;

    const { data, error } = await supabase
      .from('homepage_quotes')
      .update({
        quote_text,
        author,
        display_order,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Quote update error:', error);
      return res.status(500).json({ error: 'Failed to update quote' });
    }

    console.log('✅ Quote updated:', data.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Quote update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/homepage/quotes/:id - Delete quote
router.delete('/quotes/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('homepage_quotes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Quote deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete quote' });
    }

    console.log('✅ Quote deleted:', id);
    res.json({ success: true, message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Quote deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('🚫 Homepage API Error:', error);
  res.status(500).json({
    error: 'Homepage API error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

export default router;
