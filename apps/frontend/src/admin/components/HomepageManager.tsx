import React, { useState, useEffect } from 'react';
import { Save, Eye, Loader2, CheckCircle, RefreshCw, Plus, X, BarChart3 } from 'lucide-react';
import { useHomepageData, useHomepageAdmin, formatMetricValue, type HomepageContent, type HomepageQuote } from '../../hooks/useHomepageData';

const HomepageManager: React.FC = () => {
  const { data, isLoading, error, refetch } = useHomepageData();
  const { 
    isLoading: isSaving, 
    error: adminError,
    updateContent, 
    updateMetrics, 
    calculateMetrics,
    getAllQuotes,
    addQuote: createQuote,
    updateQuote,
    deleteQuote
  } = useHomepageAdmin();
  
  const [localContent, setLocalContent] = useState<HomepageContent | null>(null);
  const [localQuotes, setLocalQuotes] = useState<HomepageQuote[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'metrics' | 'quotes' | 'sections'>('hero');
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);

  // Initialize local state when data is loaded
  useEffect(() => {
    if (data?.content) {
      setLocalContent(data.content);
    }
    if (data?.quotes) {
      setLocalQuotes(data.quotes);
    }
  }, [data]);

  // Load all quotes for admin management
  const loadAllQuotes = async () => {
    try {
      setIsLoadingQuotes(true);
      const allQuotes = await getAllQuotes();
      setLocalQuotes(allQuotes);
    } catch (error) {
      console.error('Failed to load all quotes:', error);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  const handleSaveContent = async () => {
    if (!localContent) return;
    console.log('🔍 Preparing to save content:', JSON.stringify(localContent, null, 2));
    
    try {
      await updateContent(localContent);
      
      setLastSaved(new Date());
      await refetch(); // Refresh data from server
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };

  const handleSaveMetrics = async () => {
    if (!localContent) return;
    
    try {
      await updateMetrics({
        words_written: localContent.words_written,
        beta_readers: localContent.beta_readers,
        average_rating: localContent.average_rating,
        books_published: localContent.books_published
      });
      
      setLastSaved(new Date());
      await refetch();
    } catch (error) {
      console.error('Failed to save metrics:', error);
    }
  };

  const handleCalculateMetrics = async () => {
    try {
      const result = await calculateMetrics();
      console.log('Metrics calculated:', result);
      await refetch(); // Refresh data to show updated metrics
    } catch (error) {
      console.error('Failed to calculate metrics:', error);
    }
  };

  const handleAddQuote = async () => {
    try {
      await createQuote({
        quote_text: 'New inspiring quote...',
        author: 'Zoroastrian Wisdom',
        display_order: localQuotes.length + 1
      });
      await loadAllQuotes();
    } catch (error) {
      console.error('Failed to add quote:', error);
    }
  };

  const handleUpdateQuote = async (id: number, updates: Partial<HomepageQuote>) => {
    try {
      await updateQuote(id, updates);
      await loadAllQuotes();
    } catch (error) {
      console.error('Failed to update quote:', error);
    }
  };

  const handleDeleteQuote = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    
    try {
      await deleteQuote(id);
      await loadAllQuotes();
    } catch (error) {
      console.error('Failed to delete quote:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading homepage content...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading homepage data: {error}</p>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!localContent) {
    return <div className="text-center py-8">No homepage content found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {lastSaved && (
        <div className="flex items-center text-sm text-green-600 bg-green-50 px-4 py-2 rounded-md">
          <CheckCircle className="w-4 h-4 mr-2" />
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
      
      {(error || adminError) && (
        <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-md">
          Error: {error || adminError}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'hero', name: 'Hero Section', icon: '🏠' },
            { id: 'metrics', name: 'Progress Metrics', icon: '📊' },
            { id: 'quotes', name: 'Scrolling Quotes', icon: '💬' },
            { id: 'sections', name: 'Section Visibility', icon: '👁️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Hero Section Content</h2>
              <button
                onClick={handleSaveContent}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Hero Content
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Title</label>
                  <textarea
                    value={localContent.hero_title}
                    onChange={(e) => setLocalContent(prev => prev ? { ...prev, hero_title: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Main homepage title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Subtitle (Optional)</label>
                  <input
                    type="text"
                    value={localContent.hero_subtitle || ''}
                    onChange={(e) => setLocalContent(prev => prev ? { ...prev, hero_subtitle: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional subtitle..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Description</label>
                  <textarea
                    value={localContent.hero_description}
                    onChange={(e) => setLocalContent(prev => prev ? { ...prev, hero_description: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Describe your website or mission..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Quote</label>
                  <textarea
                    value={localContent.hero_quote}
                    onChange={(e) => setLocalContent(prev => prev ? { ...prev, hero_quote: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Inspirational quote..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Button Text</label>
                    <input
                      type="text"
                      value={localContent.cta_button_text}
                      onChange={(e) => setLocalContent(prev => prev ? { ...prev, cta_button_text: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Learn More"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Button Link</label>
                    <input
                      type="text"
                      value={localContent.cta_button_link}
                      onChange={(e) => setLocalContent(prev => prev ? { ...prev, cta_button_link: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="/learn"
                    />
                  </div>
                </div>
              </div>
              
              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Live Preview</h3>
                <div className="space-y-4 text-center">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {localContent.hero_title}
                  </h1>
                  {localContent.hero_subtitle && (
                    <h2 className="text-xl text-gray-600 dark:text-gray-300">
                      {localContent.hero_subtitle}
                    </h2>
                  )}
                  <p className="text-gray-700 dark:text-gray-400 italic">
                    {localContent.hero_quote}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {localContent.hero_description}
                  </p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    {localContent.cta_button_text}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Progress Metrics</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleCalculateMetrics}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                  Auto-Calculate
                </button>
                <button
                  onClick={handleSaveMetrics}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Metrics
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-2">Words Written</label>
                <input
                  type="number"
                  value={localContent.words_written}
                  onChange={(e) => setLocalContent(prev => prev ? { ...prev, words_written: parseInt(e.target.value) || 0 } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatted: {formatMetricValue(localContent.words_written, 'words')}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-2">Beta Readers</label>
                <input
                  type="number"
                  value={localContent.beta_readers}
                  onChange={(e) => setLocalContent(prev => prev ? { ...prev, beta_readers: parseInt(e.target.value) || 0 } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatted: {formatMetricValue(localContent.beta_readers, 'number')}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-2">Average Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={localContent.average_rating}
                  onChange={(e) => setLocalContent(prev => prev ? { ...prev, average_rating: parseFloat(e.target.value) || 0 } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatted: {formatMetricValue(localContent.average_rating, 'rating')}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-2">Books Published</label>
                <input
                  type="number"
                  value={localContent.books_published}
                  onChange={(e) => setLocalContent(prev => prev ? { ...prev, books_published: parseInt(e.target.value) || 0 } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatted: {formatMetricValue(localContent.books_published, 'number')}
                </p>
              </div>
            </div>

            {/* Metrics Preview */}
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Metrics Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    {formatMetricValue(localContent.words_written, 'words')}
                  </div>
                  <div className="text-sm text-gray-600">Words Written</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    {formatMetricValue(localContent.beta_readers, 'number')}
                  </div>
                  <div className="text-sm text-gray-600">Beta Readers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    {formatMetricValue(localContent.average_rating, 'rating')}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    {formatMetricValue(localContent.books_published, 'number')}
                  </div>
                  <div className="text-sm text-gray-600">Books Published</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Scrolling Quotes Management</h2>
              <div className="flex space-x-2">
                <button
                  onClick={loadAllQuotes}
                  disabled={isLoadingQuotes}
                  className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingQuotes ? 'animate-spin' : ''}`} />
                  Refresh Quotes
                </button>
                <button
                  onClick={handleAddQuote}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Quote
                </button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {localQuotes.map((quote, index) => (
                <div key={quote.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={quote.quote_text}
                      onChange={(e) => {
                        const updatedQuotes = localQuotes.map(q => 
                          q.id === quote.id ? { ...q, quote_text: e.target.value } : q
                        );
                        setLocalQuotes(updatedQuotes);
                      }}
                      onBlur={() => handleUpdateQuote(quote.id, { quote_text: quote.quote_text })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Enter quote text..."
                    />
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={quote.author}
                        onChange={(e) => {
                          const updatedQuotes = localQuotes.map(q => 
                            q.id === quote.id ? { ...q, author: e.target.value } : q
                          );
                          setLocalQuotes(updatedQuotes);
                        }}
                        onBlur={() => handleUpdateQuote(quote.id, { author: quote.author })}
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Author..."
                      />
                      <input
                        type="number"
                        value={quote.display_order}
                        onChange={(e) => {
                          const updatedQuotes = localQuotes.map(q => 
                            q.id === quote.id ? { ...q, display_order: parseInt(e.target.value) || 0 } : q
                          );
                          setLocalQuotes(updatedQuotes);
                        }}
                        onBlur={() => handleUpdateQuote(quote.id, { display_order: quote.display_order })}
                        className="w-20 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Order"
                      />
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={quote.is_active}
                          onChange={(e) => {
                            const updatedQuotes = localQuotes.map(q => 
                              q.id === quote.id ? { ...q, is_active: e.target.checked } : q
                            );
                            setLocalQuotes(updatedQuotes);
                            handleUpdateQuote(quote.id, { is_active: e.target.checked });
                          }}
                          className="mr-2 rounded focus:ring-blue-500"
                        />
                        Active
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteQuote(quote.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {localQuotes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No quotes found. Click "Add Quote" to create your first quote.
              </div>
            )}
          </div>
        )}

        {/* Sections Visibility Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Section Visibility</h2>
              <button
                onClick={handleSaveContent}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Settings
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium">Latest News Section</h3>
                    <p className="text-sm text-gray-600">Display recent blog posts and updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localContent.show_latest_news}
                    onChange={(e) => setLocalContent(prev => prev ? { ...prev, show_latest_news: e.target.checked } : null)}
                    className="rounded focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium">Latest Releases Section</h3>
                    <p className="text-sm text-gray-600">Show new book releases and products</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localContent.show_latest_releases}
                    onChange={(e) => setLocalContent(prev => prev ? { ...prev, show_latest_releases: e.target.checked } : null)}
                    className="rounded focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium">Artist Collaboration Section</h3>
                    <p className="text-sm text-gray-600">Display artist collaboration opportunities</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localContent.show_artist_collaboration}
                    onChange={(e) => setLocalContent(prev => prev ? { ...prev, show_artist_collaboration: e.target.checked } : null)}
                    className="rounded focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium">Progress Metrics Section</h3>
                    <p className="text-sm text-gray-600">Show writing progress statistics</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localContent.show_progress_metrics}
                    onChange={(e) => setLocalContent(prev => prev ? { ...prev, show_progress_metrics: e.target.checked } : null)}
                    className="rounded focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Preview of sections */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Sections Preview</h3>
                <div className="space-y-2 text-sm">
                  <div className={`p-2 rounded ${localContent.show_latest_news ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                    📰 Latest News {localContent.show_latest_news ? '(Visible)' : '(Hidden)'}
                  </div>
                  <div className={`p-2 rounded ${localContent.show_latest_releases ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                    📚 Latest Releases {localContent.show_latest_releases ? '(Visible)' : '(Hidden)'}
                  </div>
                  <div className={`p-2 rounded ${localContent.show_artist_collaboration ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                    🎨 Artist Collaboration {localContent.show_artist_collaboration ? '(Visible)' : '(Hidden)'}
                  </div>
                  <div className={`p-2 rounded ${localContent.show_progress_metrics ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                    📊 Progress Metrics {localContent.show_progress_metrics ? '(Visible)' : '(Hidden)'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Save Button for Quick Access */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => {
            if (activeTab === 'metrics') {
              handleSaveMetrics();
            } else {
              handleSaveContent();
            }
          }}
          disabled={isSaving}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default HomepageManager;