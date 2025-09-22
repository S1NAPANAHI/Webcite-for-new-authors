import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Environment variables validation and fallbacks
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Homepage API - Environment check:', {
  hasSupabaseUrl: !!SUPABASE_URL,
  hasSupabaseKey: !!SUPABASE_KEY,
  urlPreview: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 30)}...` : 'MISSING',
  keyPreview: SUPABASE_KEY ? `${SUPABASE_KEY.substring(0, 15)}...` : 'MISSING',
  keyType: SUPABASE_KEY ? (
    SUPABASE_KEY.includes('service_role') ? 'SERVICE_ROLE' :
    SUPABASE_KEY.includes('anon') ? 'ANON' : 'UNKNOWN'
  ) : 'MISSING'
});

// Initialize Supabase client with better error handling
let supabase = null;

try {
  if (!SUPABASE_URL) {
    throw new Error('Missing SUPABASE_URL or VITE_SUPABASE_URL environment variable');
  }
  if (!SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY, or VITE_SUPABASE_ANON_KEY environment variable');
  }

  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✅ Homepage API - Supabase client initialized successfully');
  
  // Test the connection
  supabase.from('homepage_content').select('id').limit(1).then(({ data, error }) => {
    if (error) {
      console.error('❌ Homepage API - Database connection test failed:', error);
    } else {
      console.log('✅ Homepage API - Database connection test successful');
    }
  });
  
} catch (error) {
  console.error('❌ Homepage API - Supabase client initialization failed:', error.message);
  console.error('📋 Required environment variables:');
  console.error('   - SUPABASE_URL or VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY, or VITE_SUPABASE_ANON_KEY');
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
        'SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY, or VITE_SUPABASE_ANON_KEY'
      ]
    });
  }
  next();
};

// GET /api/homepage - Public homepage data
router.get('/', requireSupabase, async (req, res) => {
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

// GET /api/homepage/content - Get homepage content only (ADDED MISSING ENDPOINT)
router.get('/content', requireSupabase, async (req, res) => {
  try {
    console.log('📡 GET /api/homepage/content - Fetching homepage content...');
    
    const { data, error } = await supabase
      .from('homepage_content')
      .select('*')
      .eq('id', 'homepage')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Content fetch error:', error);
      throw error;
    }

    // Handle content not found gracefully
    const content = data || {
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

    console.log('✅ Homepage content fetched successfully');
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('❌ Homepage content fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch homepage content' });
  }
});

// PUT /api/homepage/content - Update homepage content (ENHANCED WITH DEBUGGING)
router.put('/content', requireSupabase, async (req, res) => {
  try {
    console.log('📝 PUT /api/homepage/content - Starting update process...');
    console.log('📋 Request body keys:', Object.keys(req.body));
    console.log('🔧 Full request body:', JSON.stringify(req.body, null, 2));
    
    // Test database connection first
    const connectionTest = await supabase.from('homepage_content').select('id').limit(1);
    console.log('🔌 Database connection test:', connectionTest.error ? 'FAILED' : 'SUCCESS');
    if (connectionTest.error) {
      console.error('❌ Connection test error:', connectionTest.error);
    }
    
    // First, check what's currently in the database
    console.log('🔍 Checking current database state...');
    const { data: currentData, error: fetchError } = await supabase
      .from('homepage_content')
      .select('*')
      .eq('id', 'homepage')
      .single();

    console.log('📋 Current database state:', {
      hasData: !!currentData,
      fetchError: fetchError?.message || 'none',
      currentData: currentData ? {
        hero_title: currentData.hero_title,
        show_latest_news: currentData.show_latest_news,
        show_latest_releases: currentData.show_latest_releases,
        show_artist_collaboration: currentData.show_artist_collaboration,
        show_progress_metrics: currentData.show_progress_metrics,
        updated_at: currentData.updated_at
      } : 'NO_DATA'
    });

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.warn('⚠️ Could not fetch existing content:', fetchError.message);
    }

    // Map all possible fields from request body with proper handling
    const updates = {
      id: 'homepage', // Ensure ID is set
      updated_at: new Date().toISOString()
    };

    // Hero section fields
    if (req.body.hero_title !== undefined) updates.hero_title = String(req.body.hero_title);
    if (req.body.hero_subtitle !== undefined) updates.hero_subtitle = String(req.body.hero_subtitle || '');
    if (req.body.hero_description !== undefined) updates.hero_description = String(req.body.hero_description);
    if (req.body.hero_quote !== undefined) updates.hero_quote = String(req.body.hero_quote);
    if (req.body.cta_button_text !== undefined) updates.cta_button_text = String(req.body.cta_button_text);
    if (req.body.cta_button_link !== undefined) updates.cta_button_link = String(req.body.cta_button_link);

    // Metrics fields
    if (req.body.words_written !== undefined) updates.words_written = parseInt(req.body.words_written) || 0;
    if (req.body.beta_readers !== undefined) updates.beta_readers = parseInt(req.body.beta_readers) || 0;
    if (req.body.average_rating !== undefined) updates.average_rating = parseFloat(req.body.average_rating) || 0.0;
    if (req.body.books_published !== undefined) updates.books_published = parseInt(req.body.books_published) || 0;

    // Section visibility fields - CRITICAL FIX!
    if (req.body.show_latest_news !== undefined) updates.show_latest_news = Boolean(req.body.show_latest_news);
    if (req.body.show_latest_releases !== undefined) updates.show_latest_releases = Boolean(req.body.show_latest_releases);
    if (req.body.show_artist_collaboration !== undefined) updates.show_artist_collaboration = Boolean(req.body.show_artist_collaboration);
    if (req.body.show_progress_metrics !== undefined) updates.show_progress_metrics = Boolean(req.body.show_progress_metrics);

    console.log('💾 Final updates object:', JSON.stringify(updates, null, 2));
    console.log('📊 Section visibility in updates:', {
      show_latest_news: updates.show_latest_news,
      show_latest_releases: updates.show_latest_releases,
      show_artist_collaboration: updates.show_artist_collaboration,
      show_progress_metrics: updates.show_progress_metrics
    });
    
    // Perform the database update with enhanced logging
    console.log('🚀 Executing database upsert...');
    const { data, error } = await supabase
      .from('homepage_content')
      .upsert(updates, { 
        onConflict: 'id',
        ignoreDuplicates: false  // This ensures updates actually happen
      })
      .select()
      .single();

    console.log('📈 Database operation result:', {
      hasData: !!data,
      hasError: !!error,
      errorCode: error?.code || 'none',
      errorMessage: error?.message || 'none'
    });

    if (error) {
      console.error('❌ CRITICAL: Content update error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        updates: updates
      });
      throw error;
    }
    
    // Verify the update worked by immediately reading back
    console.log('🔍 Verification: Reading back updated data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('homepage_content')
      .select('*')
      .eq('id', 'homepage')
      .single();
      
    console.log('🔍 Verification result:', {
      hasData: !!verifyData,
      hasError: !!verifyError,
      verifyData: verifyData ? {
        hero_title: verifyData.hero_title,
        show_latest_news: verifyData.show_latest_news,
        show_latest_releases: verifyData.show_latest_releases,
        show_artist_collaboration: verifyData.show_artist_collaboration,
        show_progress_metrics: verifyData.show_progress_metrics,
        updated_at: verifyData.updated_at
      } : 'NO_DATA'
    });
    
    const responseData = data || verifyData;
    console.log('✅ Content updated successfully - final response data keys:', Object.keys(responseData || {}));
    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error('❌ CRITICAL: Content update failed:', {
      error: error.message,
      stack: error.stack,
      supabaseError: error.details || error.hint,
      requestBody: req.body
    });
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to update content',
      details: error.details || null,
      hint: error.hint || null,
      code: error.code || null
    });
  }
});

// GET /api/homepage/metrics - Get metrics only
router.get('/metrics', requireSupabase, async (req, res) => {
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

// PUT /api/homepage/metrics - Update metrics only
router.put('/metrics', requireSupabase, async (req, res) => {
  try {
    console.log('📊 PUT /api/homepage/metrics - Updating metrics...');
    console.log('📊 Metrics request body:', req.body);
    
    const { words_written, beta_readers, average_rating, books_published } = req.body;
    
    const updates = {
      updated_at: new Date().toISOString()
    };
    
    if (words_written !== undefined) updates.words_written = parseInt(words_written);
    if (beta_readers !== undefined) updates.beta_readers = parseInt(beta_readers);
    if (average_rating !== undefined) updates.average_rating = parseFloat(average_rating);
    if (books_published !== undefined) updates.books_published = parseInt(books_published);
    
    console.log('📊 Metrics updates object:', updates);
    
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
router.post('/metrics/calculate', requireSupabase, async (req, res) => {
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
        supabase.from('blog_posts').select('content').eq('status', 'published'),
        supabase.from('content_items').select('id').eq('type', 'book')
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

// GET /api/homepage/quotes - Get active quotes only
router.get('/quotes', requireSupabase, async (req, res) => {
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

// GET /api/homepage/quotes/all - Get all quotes (including inactive) - Admin only
router.get('/quotes/all', requireSupabase, async (req, res) => {
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
router.post('/quotes', requireSupabase, async (req, res) => {
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
router.put('/quotes/:id', requireSupabase, async (req, res) => {
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
router.delete('/quotes/:id', requireSupabase, async (req, res) => {
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

// DEBUG endpoint - Check database state (TEMPORARY FOR DEBUGGING)
router.get('/debug/database-state', requireSupabase, async (req, res) => {
  try {
    console.log('🔍 DEBUG: Checking database state...');
    
    const { data, error } = await supabase
      .from('homepage_content')
      .select('*')
      .eq('id', 'homepage')
      .single();
      
    const response = {
      timestamp: new Date().toISOString(),
      databaseState: {
        hasData: !!data,
        hasError: !!error,
        errorDetails: error || null,
        data: data || null
      },
      supabaseInfo: {
        hasClient: !!supabase,
        url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 30)}...` : 'MISSING',
        keyType: SUPABASE_KEY ? (
          SUPABASE_KEY.includes('service_role') ? 'SERVICE_ROLE' :
          SUPABASE_KEY.includes('anon') ? 'ANON' : 'UNKNOWN'
        ) : 'MISSING'
      }
    };
    
    console.log('🔍 DEBUG: Database state response:', response);
    res.json(response);
  } catch (error) {
    console.error('❌ DEBUG: Error checking database state:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint - Works even without Supabase
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Homepage API is running',
    timestamp: new Date().toISOString(),
    supabaseConnected: !!supabase,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasSupabaseUrl: !!SUPABASE_URL,
      hasSupabaseKey: !!SUPABASE_KEY,
      keyType: SUPABASE_KEY ? (
        SUPABASE_KEY.includes('service_role') ? 'SERVICE_ROLE' :
        SUPABASE_KEY.includes('anon') ? 'ANON' : 'UNKNOWN'
      ) : 'MISSING'
    }
  });
});

export default router;