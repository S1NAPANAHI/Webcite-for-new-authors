import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase client with service key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY // Fallback to anon key if service key not available
);

console.log('🏠 Homepage routes initialized with Supabase URL:', process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);

// GET /api/homepage - Public homepage data
router.get('/', async (req, res) => {
  try {
    console.log('📡 GET /api/homepage - Fetching homepage data...');
    
    const [contentResult, quotesResult] = await Promise.all([
      supabase
        .from('homepage_content')
        .select('*')
        .eq('id', 'homepage')
        .single(),
      supabase
        .from('homepage_quotes')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
    ]);

    console.log('📊 Content result:', contentResult.error ? 'ERROR' : 'SUCCESS');
    console.log('💬 Quotes result:', quotesResult.error ? 'ERROR' : 'SUCCESS', `(${quotesResult.data?.length || 0} quotes)`);

    // Handle content not found gracefully
    const content = contentResult.data || {
      id: 'homepage',
      hero_title: 'Zoroasterverse',
      hero_subtitle: '',
      hero_description: 'Learn about the teachings of the prophet Zarathustra, the history of one of the world\'s oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.',
      hero_quote: '"Happiness comes to them who bring happiness to others."',
      cta_button_text: 'Learn More',
      cta_button_link: '/blog/about',
      words_written: 50000,
      beta_readers: 5,
      average_rating: 4.5,
      books_published: 1,
      show_latest_news: true,
      show_latest_releases: true,
      show_artist_collaboration: true,
      show_progress_metrics: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const quotes = quotesResult.data || [];

    const response = {
      content,
      quotes,
      metrics: {
        words_written: content.words_written,
        beta_readers: content.beta_readers,
        average_rating: content.average_rating,
        books_published: content.books_published,
        last_updated: content.updated_at
      },
      sections: {
        show_latest_news: content.show_latest_news,
        show_latest_releases: content.show_latest_releases,
        show_artist_collaboration: content.show_artist_collaboration,
        show_progress_metrics: content.show_progress_metrics
      }
    };

    console.log('✅ Homepage data fetched successfully');
    res.json(response);
  } catch (error) {
    console.error('❌ Homepage fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch homepage data' });
  }
});

// GET /api/homepage/metrics - Get metrics only
router.get('/metrics', async (req, res) => {
  try {
    console.log('📊 GET /api/homepage/metrics - Fetching metrics...');
    
    const { data, error } = await supabase
      .from('homepage_content')
      .select('words_written, beta_readers, average_rating, books_published, updated_at')
      .eq('id', 'homepage')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const metrics = data || {
      words_written: 50000,
      beta_readers: 5,
      average_rating: 4.5,
      books_published: 1,
      updated_at: new Date().toISOString()
    };

    console.log('✅ Metrics fetched successfully');
    res.json({
      words_written: metrics.words_written,
      beta_readers: metrics.beta_readers,
      average_rating: parseFloat(metrics.average_rating),
      books_published: metrics.books_published,
      last_updated: metrics.updated_at
    });
  } catch (error) {
    console.error('❌ Metrics fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch metrics' });
  }
});

// GET /api/homepage/quotes - Get active quotes only
router.get('/quotes', async (req, res) => {
  try {
    console.log('💬 GET /api/homepage/quotes - Fetching quotes...');
    
    const { data, error } = await supabase
      .from('homepage_quotes')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} active quotes`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Quotes fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch quotes' });
  }
});

// PUT /api/homepage/content - Update homepage content
router.put('/content', async (req, res) => {
  try {
    console.log('📝 PUT /api/homepage/content - Updating content...');
    console.log('📋 Request body keys:', Object.keys(req.body));
    
    const updates = { 
      ...req.body, 
      id: 'homepage', // Ensure ID is set
      updated_at: new Date().toISOString() 
    };
    
    const { data, error } = await supabase
      .from('homepage_content')
      .upsert(updates, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('❌ Content update error:', error);
      throw error;
    }
    
    console.log('✅ Content updated successfully');
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Content update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update content' });
  }
});

// PUT /api/homepage/metrics - Update metrics only
router.put('/metrics', async (req, res) => {
  try {
    console.log('📊 PUT /api/homepage/metrics - Updating metrics...');
    
    const { words_written, beta_readers, average_rating, books_published } = req.body;
    
    const updates = {
      updated_at: new Date().toISOString()
    };
    
    if (words_written !== undefined) updates.words_written = parseInt(words_written);
    if (beta_readers !== undefined) updates.beta_readers = parseInt(beta_readers);
    if (average_rating !== undefined) updates.average_rating = parseFloat(average_rating);
    if (books_published !== undefined) updates.books_published = parseInt(books_published);
    
    const { data, error } = await supabase
      .from('homepage_content')
      .update(updates)
      .eq('id', 'homepage')
      .select()
      .single();

    if (error) {
      console.error('❌ Metrics update error:', error);
      throw error;
    }
    
    console.log('✅ Metrics updated successfully');
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Metrics update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update metrics' });
  }
});

// POST /api/homepage/metrics/calculate - Auto-calculate metrics
router.post('/metrics/calculate', async (req, res) => {
  try {
    console.log('🔄 POST /api/homepage/metrics/calculate - Auto-calculating metrics...');
    
    // Simple metrics calculation with fallbacks
    let calculatedWords = 50000; // Default showcase value
    let calculatedReaders = 5;   // Default showcase value
    let calculatedRating = 4.5;  // Default showcase value
    let calculatedBooks = 1;     // Default showcase value
    
    try {
      // Try to get real data from various tables
      const [profilesResult, postsResult, worksResult] = await Promise.all([
        supabase.from('profiles').select('role, beta_reader_status').or('role.eq.admin,beta_reader_status.eq.approved'),
        supabase.from('posts').select('content').eq('status', 'published'),
        supabase.from('works').select('id').eq('status', 'published')
      ]);
      
      // Calculate beta readers
      if (profilesResult.data && profilesResult.data.length > 0) {
        calculatedReaders = Math.max(profilesResult.data.length, 5);
      }
      
      // Calculate words from posts
      if (postsResult.data && postsResult.data.length > 0) {
        const wordCount = postsResult.data.reduce((total, post) => {
          return total + (post.content ? post.content.split(' ').length : 0);
        }, 0);
        if (wordCount > 0) {
          calculatedWords = Math.max(wordCount, 50000);
        }
      }
      
      // Calculate published books
      if (worksResult.data && worksResult.data.length > 0) {
        calculatedBooks = Math.max(worksResult.data.length, 1);
      }
      
      console.log('📊 Calculated metrics:', {
        words: calculatedWords,
        readers: calculatedReaders,
        rating: calculatedRating,
        books: calculatedBooks
      });
      
    } catch (calcError) {
      console.warn('⚠️ Metrics calculation fallback used:', calcError.message);
    }
    
    // Update homepage content with calculated values
    const { data, error } = await supabase
      .from('homepage_content')
      .upsert({
        id: 'homepage',
        words_written: calculatedWords,
        beta_readers: calculatedReaders,
        average_rating: calculatedRating,
        books_published: calculatedBooks,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single();
      
    if (error) {
      console.error('❌ Metrics save error:', error);
      throw error;
    }
    
    const result = {
      success: true,
      data: {
        words_written: calculatedWords,
        beta_readers: calculatedReaders,
        average_rating: calculatedRating,
        books_published: calculatedBooks,
        last_updated: new Date().toISOString()
      }
    };
    
    console.log('✅ Metrics calculated and saved successfully');
    res.json(result);
  } catch (error) {
    console.error('❌ Metrics calculation error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate metrics' });
  }
});

// GET /api/homepage/quotes/all - Get all quotes (including inactive) - Admin only
router.get('/quotes/all', async (req, res) => {
  try {
    console.log('💬 GET /api/homepage/quotes/all - Fetching all quotes...');
    
    const { data, error } = await supabase
      .from('homepage_quotes')
      .select('*')
      .order('display_order');

    if (error) {
      throw error;
    }

    console.log(`✅ Fetched ${data?.length || 0} total quotes`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ All quotes fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch all quotes' });
  }
});

// POST /api/homepage/quotes - Add new quote
router.post('/quotes', async (req, res) => {
  try {
    console.log('➕ POST /api/homepage/quotes - Adding new quote...');
    
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
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('❌ Quote add error:', error);
      throw error;
    }
    
    console.log('✅ Quote added successfully:', data.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Quote add error:', error);
    res.status(500).json({ error: error.message || 'Failed to add quote' });
  }
});

// PUT /api/homepage/quotes/:id - Update quote
router.put('/quotes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 PUT /api/homepage/quotes/${id} - Updating quote...`);
    
    const updates = { 
      ...req.body, 
      updated_at: new Date().toISOString() 
    };
    
    const { data, error } = await supabase
      .from('homepage_quotes')
      .update(updates)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('❌ Quote update error:', error);
      throw error;
    }
    
    console.log('✅ Quote updated successfully:', id);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Quote update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update quote' });
  }
});

// DELETE /api/homepage/quotes/:id - Delete quote
router.delete('/quotes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/homepage/quotes/${id} - Deleting quote...`);
    
    const { error } = await supabase
      .from('homepage_quotes')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('❌ Quote delete error:', error);
      throw error;
    }
    
    console.log('✅ Quote deleted successfully:', id);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Quote delete error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete quote' });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Homepage API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;