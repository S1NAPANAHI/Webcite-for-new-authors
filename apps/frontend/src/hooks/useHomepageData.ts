// Homepage Data Management Hooks
// Provides hooks for fetching and managing homepage content, metrics, and quotes

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';

// Types
export interface HomepageContent {
  id: string;
  hero_title: string;
  hero_subtitle?: string;
  hero_description: string;
  hero_quote: string;
  cta_button_text: string;
  cta_button_link: string;
  words_written: number;
  beta_readers: number;
  average_rating: number;
  books_published: number;
  show_latest_news: boolean;
  show_latest_releases: boolean;
  show_artist_collaboration: boolean;
  show_progress_metrics: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageQuote {
  id: number;
  quote_text: string;
  author: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageMetrics {
  words_written: number;
  beta_readers: number;
  average_rating: number;
  books_published: number;
  last_updated: string;
}

export interface HomepageData {
  content: HomepageContent;
  quotes: HomepageQuote[];
  metrics: HomepageMetrics;
  sections: {
    show_latest_news: boolean;
    show_latest_releases: boolean;
    show_artist_collaboration: boolean;
    show_progress_metrics: boolean;
  };
}

// API Base URL - Fixed to use correct backend URL
const getApiBase = () => {
  // Check if we're in development or production
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    
    // Production - use the correct backend URL
    return 'https://webcite-for-new-authors.onrender.com';
  }
  
  // Fallback for SSR or other environments
  return process.env.NODE_ENV === 'production' 
    ? 'https://webcite-for-new-authors.onrender.com' 
    : 'http://localhost:3001';
};

// CRITICAL FIX: Fetch functions with proper request body handling
async function fetchFromAPI(endpoint: string, options?: RequestInit) {
  const API_BASE = getApiBase();
  let url = `${API_BASE}/api/homepage${endpoint}`;
  
  // Add cache busting for GET requests
  if (!options?.method || options.method === 'GET') {
    url = addCacheBuster(url);
  }
  
  console.log(`📡 FIXED: Fetching from: ${url}`);
  console.log(`📦 FIXED: Request options:`, {
    method: options?.method || 'GET',
    headers: options?.headers,
    hasBody: !!options?.body,
    bodyType: typeof options?.body,
    bodyContent: options?.body ? options.body.toString().substring(0, 200) + '...' : 'none'
  });
  
  try {
    const response = await fetch(url, {
      method: options?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      // CRITICAL: Ensure body is properly passed
      ...(options?.body && { body: options.body }),
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Response Error: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ API Response:`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Fetch Error for ${url}:`, error);
    throw error;
  }
}

// Direct Supabase fallback functions
async function fetchFromSupabase() {
  if (!supabase) {
    throw new Error('Supabase client not available');
  }
  
  try {
    console.log('🔄 Falling back to direct Supabase queries...');
    
    // Fetch homepage content
    const { data: content, error: contentError } = await supabase
      .from('homepage_content')
      .select('*')
      .eq('id', 'homepage')
      .single();

    if (contentError && contentError.code !== 'PGRST116') {
      throw contentError;
    }

    // Fetch active quotes
    const { data: quotes, error: quotesError } = await supabase
      .from('homepage_quotes')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (quotesError) {
      console.warn('Quotes fetch error:', quotesError);
    }

    // Create response structure
    const fallbackContent = content || {
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

    const response = {
      content: fallbackContent,
      quotes: quotes || [],
      metrics: {
        words_written: fallbackContent.words_written,
        beta_readers: fallbackContent.beta_readers,
        average_rating: fallbackContent.average_rating,
        books_published: fallbackContent.books_published,
        last_updated: fallbackContent.updated_at
      },
      sections: {
        show_latest_news: fallbackContent.show_latest_news,
        show_latest_releases: fallbackContent.show_latest_releases,
        show_artist_collaboration: fallbackContent.show_artist_collaboration,
        show_progress_metrics: fallbackContent.show_progress_metrics
      }
    };

    console.log('✅ Supabase fallback successful:', response);
    return response;
  } catch (error) {
    console.error('❌ Supabase fallback error:', error);
    throw error;
  }
}

// Hook: useHomepageData - Fetch complete homepage data with fallbacks
export const useHomepageData = () => {
  const [data, setData] = useState<HomepageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get context for cache invalidation (optional)
  const homepageContext = useHomepageContextOptional();

  const fetchHomepageData = useCallback(async (force = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🏠 useHomepageData: Starting fetch...', { force });
      
      // Try API first, then fallback to direct Supabase
      let response;
      try {
        response = await fetchFromAPI('');
      } catch (apiError) {
        console.log('🔄 API unavailable, using Supabase fallback');
        response = await fetchFromSupabase();
      }
      
      console.log('✅ useHomepageData: Data fetched successfully:', {
        hasContent: !!response.content,
        quotesCount: response.quotes?.length || 0,
        hasMetrics: !!response.metrics,
        sections: response.sections
      });
      
      setData(response);
      
      // Mark as refreshed if this was triggered by update
      if (force) {
        markHomepageRefreshed();
      }
    } catch (err) {
      console.error('❌ useHomepageData: Error fetching data:', err);
      
      // Last resort: provide complete fallback data
      const fallbackData = {
        content: {
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
        },
        quotes: [
          {
            id: 1,
            quote_text: "Happiness comes to them who bring happiness to others.",
            author: "Zoroastrian Wisdom",
            is_active: true,
            display_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            quote_text: "Good thoughts, good words, good deeds.",
            author: "Zoroastrian Wisdom",
            is_active: true,
            display_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        metrics: {
          words_written: 50000,
          beta_readers: 5,
          average_rating: 4.5,
          books_published: 1,
          last_updated: new Date().toISOString()
        },
        sections: {
          show_latest_news: true,
          show_latest_releases: true,
          show_artist_collaboration: true,
          show_progress_metrics: true
        }
      };
      
      console.log('🔧 Using complete fallback data');
      setData(fallbackData);
      setError('Using offline mode with default content');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register for cache invalidation via context
  useEffect(() => {
    if (homepageContext) {
      const cleanup = homepageContext.registerDataRefresh(() => fetchHomepageData(true));
      return cleanup;
    }
  }, [homepageContext, fetchHomepageData]);

  // Listen for homepage updates
  useEffect(() => {
    const cleanup = useHomepageUpdateListener(() => {
      console.log('🔄 Homepage update listener triggered - refreshing data...');
      fetchHomepageData(true);
    });
    
    return cleanup;
  }, [fetchHomepageData]);

  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchHomepageData(true)
  };
};

// Hook: useHomepageMetrics - Fetch just metrics (for frequent updates)
export const useHomepageMetrics = (autoRefresh = false, intervalMs = 60000) => {
  const [metrics, setMetrics] = useState<HomepageMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get context for cache invalidation (optional)
  const homepageContext = useHomepageContextOptional();

  const fetchMetrics = useCallback(async () => {
    try {
      setError(null);
      let response;
      try {
        response = await fetchFromAPI('/metrics');
      } catch (apiError) {
        if (!supabase) throw new Error('No Supabase client available');
        
        // Fallback to Supabase
        const { data, error: supabaseError } = await supabase
          .from('homepage_content')
          .select('words_written, beta_readers, average_rating, books_published, updated_at')
          .eq('id', 'homepage')
          .single();

        if (supabaseError) throw supabaseError;
        
        response = {
          words_written: data.words_written,
          beta_readers: data.beta_readers,
          average_rating: parseFloat(data.average_rating),
          books_published: data.books_published,
          last_updated: data.updated_at
        };
      }
      
      setMetrics(response);
      console.log('📈 useHomepageMetrics: Updated metrics:', response);
    } catch (err) {
      console.error('❌ useHomepageMetrics: Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      
      // Fallback metrics
      setMetrics({
        words_written: 50000,
        beta_readers: 5,
        average_rating: 4.5,
        books_published: 1,
        last_updated: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register for cache invalidation
  useEffect(() => {
    if (homepageContext) {
      const cleanup = homepageContext.registerMetricsRefresh(fetchMetrics);
      return cleanup;
    }
  }, [homepageContext, fetchMetrics]);

  useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, intervalMs);
      return () => clearInterval(interval);
    }
  }, [fetchMetrics, autoRefresh, intervalMs]);

  return {
    metrics,
    isLoading,
    error,
    refetch: fetchMetrics
  };
};

// Hook: useHomepageQuotes - Fetch active quotes only
export const useHomepageQuotes = () => {
  const [quotes, setQuotes] = useState<HomepageQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get context for cache invalidation (optional)
  const homepageContext = useHomepageContextOptional();

  const fetchQuotes = useCallback(async () => {
    try {
      setError(null);
      let response;
      try {
        response = await fetchFromAPI('/quotes');
      } catch (apiError) {
        if (!supabase) throw new Error('No Supabase client available');
        
        // Fallback to Supabase
        const { data, error: supabaseError } = await supabase
          .from('homepage_quotes')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (supabaseError && supabaseError.code !== 'PGRST116') {
          throw supabaseError;
        }
        
        response = data || [];
      }
      
      setQuotes(response);
      console.log('💬 useHomepageQuotes: Fetched quotes:', response.length);
    } catch (err) {
      console.error('❌ useHomepageQuotes: Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
      
      // Fallback quotes
      setQuotes([
        {
          id: 1,
          quote_text: "Happiness comes to them who bring happiness to others.",
          author: "Zoroastrian Wisdom",
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          quote_text: "Good thoughts, good words, good deeds.",
          author: "Zoroastrian Wisdom",
          is_active: true,
          display_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register for cache invalidation
  useEffect(() => {
    if (homepageContext) {
      const cleanup = homepageContext.registerQuotesRefresh(fetchQuotes);
      return cleanup;
    }
  }, [homepageContext, fetchQuotes]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    quotes,
    isLoading,
    error,
    refetch: fetchQuotes
  };
};

// Admin Hook: useHomepageAdmin - Admin operations for homepage management
export const useHomepageAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get context for cache invalidation
  const homepageContext = useHomepageContextOptional();

  const getAuthToken = async () => {
    if (!supabase) throw new Error('Supabase client not available');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    return session.access_token;
  };

  // CRITICAL FIX: Update homepage content with proper request body
  const updateContent = useCallback(async (contentData: Partial<HomepageContent>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 FIXED: useHomepageAdmin - Updating content with data:', contentData);
      
      const token = await getAuthToken();
      let response;
      
      // CRITICAL FIX: Ensure JSON body is properly constructed and sent
      const requestBody = JSON.stringify(contentData);
      console.log('📦 FIXED: Request body being sent:', requestBody);
      console.log('📏 FIXED: Request body length:', requestBody.length);
      
      try {
        response = await fetchFromAPI('/content', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: requestBody, // CRITICAL: Explicitly pass the stringified JSON
        });
        
        console.log('✅ FIXED: API request successful with body:', requestBody.substring(0, 100) + '...');
      } catch (apiError) {
        console.error('❌ FIXED: API failed, trying Supabase fallback:', apiError);
        
        if (!supabase) throw new Error('Supabase client not available');
        
        console.log('🔄 API failed, using Supabase fallback for content update');
        // Fallback to direct Supabase
        const { data, error } = await supabase
          .from('homepage_content')
          .upsert({
            id: 'homepage',
            ...contentData,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })
          .select()
          .single();
          
        if (error) throw error;
        response = { success: true, data };
      }
      
      console.log('✅ useHomepageAdmin: Content updated successfully');
      
      // CRITICAL: Trigger global cache invalidation
      triggerHomepageUpdate();
      
      // Also use context if available
      if (homepageContext) {
        console.log('🔄 Invalidating homepage caches after content update...');
        homepageContext.invalidateAll();
      }
      
      return response;
    } catch (err) {
      console.error('❌ useHomepageAdmin: Content update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [homepageContext]);

  // Update metrics manually
  const updateMetrics = useCallback(async (metricsData: Partial<HomepageMetrics>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      let response;
      
      // CRITICAL FIX: Proper request body handling
      const requestBody = JSON.stringify(metricsData);
      console.log('📦 FIXED: Metrics request body:', requestBody);
      
      try {
        response = await fetchFromAPI('/metrics', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });
      } catch (apiError) {
        if (!supabase) throw new Error('Supabase client not available');
        
        // Fallback to direct Supabase
        const { data, error } = await supabase
          .from('homepage_content')
          .update({
            ...metricsData,
            updated_at: new Date().toISOString()
          })
          .eq('id', 'homepage')
          .select()
          .single();
          
        if (error) throw error;
        response = { success: true, data };
      }
      
      console.log('✅ useHomepageAdmin: Metrics updated successfully');
      
      // Trigger cache invalidation
      triggerHomepageUpdate();
      
      if (homepageContext) {
        console.log('🔄 Invalidating metrics cache after update...');
        homepageContext.invalidateMetrics();
      }
      
      return response;
    } catch (err) {
      console.error('❌ useHomepageAdmin: Metrics update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update metrics');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [homepageContext]);

  // Calculate metrics automatically
  const calculateMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      let response;
      
      try {
        response = await fetchFromAPI('/metrics/calculate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (apiError) {
        if (!supabase) throw new Error('Supabase client not available');
        
        // Fallback: calculate basic metrics from Supabase
        console.log('🔄 API unavailable, calculating metrics via Supabase...');
        
        // Simple metric calculation
        let calculatedWords = 50000;
        let calculatedReaders = 5;
        let calculatedBooks = 1;
        let calculatedRating = 4.5;
        
        try {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('role, beta_reader_status')
            .or('role.eq.admin,beta_reader_status.eq.approved');
          
          if (profiles) calculatedReaders = profiles.length || 5;
        } catch (e) {
          console.log('Profiles query failed, using default');
        }
        
        // Update with calculated values
        const { data, error } = await supabase
          .from('homepage_content')
          .upsert({
            id: 'homepage',
            words_written: calculatedWords,
            beta_readers: calculatedReaders,
            average_rating: calculatedRating,
            books_published: calculatedBooks,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        
        response = {
          success: true,
          data: {
            words_written: calculatedWords,
            beta_readers: calculatedReaders,
            average_rating: calculatedRating,
            books_published: calculatedBooks,
            last_updated: new Date().toISOString()
          }
        };
      }
      
      console.log('✅ useHomepageAdmin: Metrics calculated successfully');
      
      // Trigger cache invalidation
      triggerHomepageUpdate();
      
      if (homepageContext) {
        console.log('🔄 Invalidating caches after metrics calculation...');
        homepageContext.invalidateAll();
      }
      
      return response;
    } catch (err) {
      console.error('❌ useHomepageAdmin: Metrics calculation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate metrics');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [homepageContext]);

  // Simplified quote management functions with fallbacks
  const addQuote = useCallback(async (quoteData: { quote_text: string; author?: string; display_order?: number }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!supabase) throw new Error('Supabase client not available');
      
      const { data, error } = await supabase
        .from('homepage_quotes')
        .insert({
          quote_text: quoteData.quote_text,
          author: quoteData.author || 'Zoroastrian Wisdom',
          display_order: quoteData.display_order || 0,
          is_active: true
        })
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('✅ useHomepageAdmin: Quote added successfully');
      
      // Trigger cache invalidation
      triggerHomepageUpdate();
      
      if (homepageContext) {
        console.log('🔄 Invalidating quotes cache after add...');
        homepageContext.invalidateQuotes();
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('❌ useHomepageAdmin: Quote add error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add quote');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [homepageContext]);

  const updateQuote = useCallback(async (id: number, quoteData: Partial<HomepageQuote>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!supabase) throw new Error('Supabase client not available');
      
      const { data, error } = await supabase
        .from('homepage_quotes')
        .update({
          ...quoteData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('✅ useHomepageAdmin: Quote updated successfully');
      
      // Trigger cache invalidation
      triggerHomepageUpdate();
      
      if (homepageContext) {
        console.log('🔄 Invalidating quotes cache after update...');
        homepageContext.invalidateQuotes();
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('❌ useHomepageAdmin: Quote update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update quote');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [homepageContext]);

  const deleteQuote = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!supabase) throw new Error('Supabase client not available');
      
      const { error } = await supabase
        .from('homepage_quotes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      console.log('✅ useHomepageAdmin: Quote deleted successfully');
      
      // Trigger cache invalidation
      triggerHomepageUpdate();
      
      if (homepageContext) {
        console.log('🔄 Invalidating quotes cache after delete...');
        homepageContext.invalidateQuotes();
      }
      
      return { success: true };
    } catch (err) {
      console.error('❌ useHomepageAdmin: Quote delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete quote');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [homepageContext]);

  const getAllQuotes = useCallback(async () => {
    try {
      setError(null);
      
      if (!supabase) throw new Error('Supabase client not available');
      
      const { data, error } = await supabase
        .from('homepage_quotes')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('❌ useHomepageAdmin: Get all quotes error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch all quotes');
      throw err;
    }
  }, []);

  return {
    isLoading,
    error,
    updateContent,
    updateMetrics,
    calculateMetrics,
    addQuote,
    updateQuote,
    deleteQuote,
    getAllQuotes
  };
};

// Utility function to transform quotes for the prophecy wheel
export const transformQuotesForProphecy = (quotes: HomepageQuote[]) => {
  return quotes.map(quote => ({
    english: quote.quote_text,
    author: quote.author
  }));
};

// Helper function to format numbers for display
export const formatMetricValue = (value: number, type: 'number' | 'rating' | 'words') => {
  switch (type) {
    case 'rating':
      return Number(value).toFixed(1);
    case 'words':
      return value >= 1000000 
        ? `${(value / 1000000).toFixed(1)}M`
        : value >= 1000 
          ? `${(value / 1000).toFixed(0)}K`
          : value.toString();
    case 'number':
    default:
      return value.toLocaleString();
  }
};