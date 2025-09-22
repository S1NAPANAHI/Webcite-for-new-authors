// Homepage Data Management Hooks
// Provides hooks for fetching and managing homepage content, metrics, and quotes

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

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

// API Base URL
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api.zoroastervers.com' 
  : 'http://localhost:3001';

// Fetch functions
async function fetchFromAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}/api/homepage${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Hook: useHomepageData - Fetch complete homepage data
export const useHomepageData = () => {
  const [data, setData] = useState<HomepageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomepageData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🏠 useHomepageData: Fetching homepage data...');
      const response = await fetchFromAPI('');
      
      console.log('✅ useHomepageData: Data fetched successfully:', {
        hasContent: !!response.content,
        quotesCount: response.quotes?.length || 0,
        hasMetrics: !!response.metrics
      });
      
      setData(response);
    } catch (err) {
      console.error('❌ useHomepageData: Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch homepage data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchHomepageData
  };
};

// Hook: useHomepageMetrics - Fetch just metrics (for frequent updates)
export const useHomepageMetrics = (autoRefresh = false, intervalMs = 60000) => {
  const [metrics, setMetrics] = useState<HomepageMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setError(null);
      const response = await fetchFromAPI('/metrics');
      setMetrics(response);
      console.log('📈 useHomepageMetrics: Updated metrics:', response);
    } catch (err) {
      console.error('❌ useHomepageMetrics: Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    
    // Set up auto-refresh if enabled
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

  const fetchQuotes = useCallback(async () => {
    try {
      setError(null);
      const response = await fetchFromAPI('/quotes');
      setQuotes(response);
      console.log('💬 useHomepageQuotes: Fetched quotes:', response.length);
    } catch (err) {
      console.error('❌ useHomepageQuotes: Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    return session.access_token;
  };

  // Update homepage content
  const updateContent = useCallback(async (contentData: Partial<HomepageContent>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetchFromAPI('/content', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(contentData),
      });
      
      console.log('✅ useHomepageAdmin: Content updated successfully');
      return response;
    } catch (err) {
      console.error('❌ useHomepageAdmin: Content update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update metrics manually
  const updateMetrics = useCallback(async (metricsData: Partial<HomepageMetrics>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetchFromAPI('/metrics', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(metricsData),
      });
      
      console.log('✅ useHomepageAdmin: Metrics updated successfully');
      return response;
    } catch (err) {
      console.error('❌ useHomepageAdmin: Metrics update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update metrics');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate metrics automatically
  const calculateMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetchFromAPI('/metrics/calculate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('✅ useHomepageAdmin: Metrics calculated successfully');
      return response;
    } catch (err) {
      console.error('❌ useHomepageAdmin: Metrics calculation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate metrics');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Quote management
  const addQuote = useCallback(async (quoteData: { quote_text: string; author?: string; display_order?: number }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetchFromAPI('/quotes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(quoteData),
      });
      
      console.log('✅ useHomepageAdmin: Quote added successfully');
      return response;
    } catch (err) {
      console.error('❌ useHomepageAdmin: Quote add error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add quote');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuote = useCallback(async (id: number, quoteData: Partial<HomepageQuote>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetchFromAPI(`/quotes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(quoteData),
      });
      
      console.log('✅ useHomepageAdmin: Quote updated successfully');
      return response;
    } catch (err) {
      console.error('❌ useHomepageAdmin: Quote update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update quote');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteQuote = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetchFromAPI(`/quotes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('✅ useHomepageAdmin: Quote deleted successfully');
      return response;
    } catch (err) {
      console.error('❌ useHomepageAdmin: Quote delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete quote');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllQuotes = useCallback(async () => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetchFromAPI('/quotes/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response;
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
