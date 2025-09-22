import React, { useState, useEffect } from 'react';
import { Save, Eye, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProgressMetrics {
  words_written: number;
  beta_readers: number;
  average_rating: number;
  books_published: number;
}

interface HomepageContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  cta_button_text: string;
  cta_button_link: string;
  progress_metrics: ProgressMetrics;
  show_latest_news: boolean;
  show_latest_releases: boolean;
  show_artist_collaboration: boolean;
  scrolling_quotes: string[];
  updated_at: string;
}

const HomepageManager: React.FC = () => {
  const [content, setContent] = useState<HomepageContent>({
    id: 'homepage',
    hero_title: 'Happiness comes to them who bring happiness to others.',
    hero_subtitle: '',
    hero_description: 'Discover the ancient wisdom of Zarathustra and explore the timeless teachings of Zoroastrianism through our immersive storytelling experience.',
    cta_button_text: 'Learn More',
    cta_button_link: '/learn',
    progress_metrics: {
      words_written: 0,
      beta_readers: 0,
      average_rating: 0,
      books_published: 0
    },
    show_latest_news: true,
    show_latest_releases: true,
    show_artist_collaboration: true,
    scrolling_quotes: [
      'Good thoughts, good words, good deeds.',
      'Happiness comes to them who bring happiness to others.',
      'Turn yourself not away from three best things: Good Thought, Good Word, and Good Deed.',
      'He who sows the ground with care and diligence acquires a greater stock of religious merit than he could gain by the repetition of ten thousand prayers.'
    ],
    updated_at: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [autoCalculateMetrics, setAutoCalculateMetrics] = useState(true);

  useEffect(() => {
    loadHomepageContent();
    if (autoCalculateMetrics) {
      calculateMetrics();
    }
  }, [autoCalculateMetrics]);

  const loadHomepageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('id', 'homepage')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading homepage content:', error);
        return;
      }

      if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error('Error loading homepage content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = async () => {
    try {
      // Calculate words written from chapters
      const { data: chapters } = await supabase
        .from('chapters')
        .select('word_count')
        .eq('published', true);
      
      const wordsWritten = chapters?.reduce((total, chapter) => 
        total + (chapter.word_count || 0), 0) || 0;

      // Calculate beta readers
      const { data: betaReaders } = await supabase
        .from('beta_applications')
        .select('id')
        .eq('status', 'approved');
      
      const betaReadersCount = betaReaders?.length || 0;

      // Calculate average rating from reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .not('rating', 'is', null);
      
      const averageRating = reviews?.length ? 
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

      // Count published books
      const { data: books } = await supabase
        .from('books')
        .select('id')
        .eq('status', 'published');
      
      const booksPublished = books?.length || 0;

      setContent(prev => ({
        ...prev,
        progress_metrics: {
          words_written: wordsWritten,
          beta_readers: betaReadersCount,
          average_rating: parseFloat(averageRating.toFixed(1)),
          books_published: booksPublished
        }
      }));
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('homepage_content')
        .upsert({
          ...content,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving homepage content:', error);
    } finally {
      setSaving(false);
    }
  };

  const addQuote = () => {
    setContent(prev => ({
      ...prev,
      scrolling_quotes: [...prev.scrolling_quotes, '']
    }));
  };

  const updateQuote = (index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      scrolling_quotes: prev.scrolling_quotes.map((quote, i) => 
        i === index ? value : quote
      )
    }));
  };

  const removeQuote = (index: number) => {
    setContent(prev => ({
      ...prev,
      scrolling_quotes: prev.scrolling_quotes.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading homepage content...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Homepage Manager
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your homepage content, progress metrics, and layout settings
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {lastSaved && (
        <div className="flex items-center text-sm text-green-600 bg-green-50 px-4 py-2 rounded-md">
          <CheckCircle className="w-4 h-4 mr-2" />
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Main Title</label>
              <textarea
                value={content.hero_title}
                onChange={(e) => setContent(prev => ({ ...prev, hero_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <input
                type="text"
                value={content.hero_subtitle}
                onChange={(e) => setContent(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={content.hero_description}
                onChange={(e) => setContent(prev => ({ ...prev, hero_description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">CTA Button Text</label>
                <input
                  type="text"
                  value={content.cta_button_text}
                  onChange={(e) => setContent(prev => ({ ...prev, cta_button_text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CTA Button Link</label>
                <input
                  type="text"
                  value={content.cta_button_link}
                  onChange={(e) => setContent(prev => ({ ...prev, cta_button_link: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Metrics */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Progress Metrics</h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoCalculate"
                checked={autoCalculateMetrics}
                onChange={(e) => setAutoCalculateMetrics(e.target.checked)}
                className="rounded focus:ring-blue-500"
              />
              <label htmlFor="autoCalculate" className="text-sm">Auto-calculate</label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Words Written</label>
              <input
                type="number"
                value={content.progress_metrics.words_written}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  progress_metrics: {
                    ...prev.progress_metrics,
                    words_written: parseInt(e.target.value) || 0
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={autoCalculateMetrics}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Beta Readers</label>
              <input
                type="number"
                value={content.progress_metrics.beta_readers}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  progress_metrics: {
                    ...prev.progress_metrics,
                    beta_readers: parseInt(e.target.value) || 0
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={autoCalculateMetrics}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Average Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={content.progress_metrics.average_rating}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  progress_metrics: {
                    ...prev.progress_metrics,
                    average_rating: parseFloat(e.target.value) || 0
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={autoCalculateMetrics}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Books Published</label>
              <input
                type="number"
                value={content.progress_metrics.books_published}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  progress_metrics: {
                    ...prev.progress_metrics,
                    books_published: parseInt(e.target.value) || 0
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={autoCalculateMetrics}
              />
            </div>
          </div>
          {autoCalculateMetrics && (
            <button
              onClick={calculateMetrics}
              className="mt-4 px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Recalculate Metrics
            </button>
          )}
        </div>

        {/* Content Sections Toggle */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Content Sections</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showNews"
                checked={content.show_latest_news}
                onChange={(e) => setContent(prev => ({ ...prev, show_latest_news: e.target.checked }))}
                className="rounded focus:ring-blue-500"
              />
              <label htmlFor="showNews" className="text-sm font-medium">Show Latest News</label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showReleases"
                checked={content.show_latest_releases}
                onChange={(e) => setContent(prev => ({ ...prev, show_latest_releases: e.target.checked }))}
                className="rounded focus:ring-blue-500"
              />
              <label htmlFor="showReleases" className="text-sm font-medium">Show Latest Releases</label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showArtist"
                checked={content.show_artist_collaboration}
                onChange={(e) => setContent(prev => ({ ...prev, show_artist_collaboration: e.target.checked }))}
                className="rounded focus:ring-blue-500"
              />
              <label htmlFor="showArtist" className="text-sm font-medium">Show Artist Collaboration</label>
            </div>
          </div>
        </div>

        {/* Scrolling Quotes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Scrolling Quotes</h2>
            <button
              onClick={addQuote}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              Add Quote
            </button>
          </div>
          <div className="space-y-3">
            {content.scrolling_quotes.map((quote, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={quote}
                  onChange={(e) => updateQuote(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter inspirational quote..."
                />
                <button
                  onClick={() => removeQuote(index)}
                  className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageManager;