import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, Plus, X, Edit2, RefreshCw } from 'lucide-react';
import { buildApiUrl, logApiConfig } from '../../lib/config';

interface Quote {
  id: number;
  text: string;
  author: string;
  is_active: boolean;
  created_at?: string;
}

const QuotesEditor: React.FC = () => {
  // Simple hook pattern - only useState and useEffect
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // New quote form state
  const [newQuote, setNewQuote] = useState({ text: '', author: '' });
  
  // Editing state
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  // Only one useEffect - loads data on mount
  useEffect(() => {
    // Log API configuration for debugging
    console.log('🔧 QuotesEditor - API Configuration:');
    logApiConfig();
    
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use centralized API configuration pointing to Render backend
      const apiUrl = buildApiUrl('api/homepage/quotes');
      console.log('💬 QuotesEditor - Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      console.log('💬 QuotesEditor - Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('💬 QuotesEditor - Error response:', errorText);
        throw new Error(`Failed to load quotes: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('💬 QuotesEditor - Received data:', data);
      
      setQuotes(data);
    } catch (err) {
      console.error('❌ QuotesEditor - Failed to load quotes:', err);
      setError('Failed to load quotes');
      
      // Set mock quotes for demonstration
      setQuotes([
        {
          id: 1,
          text: "Every story begins with a single word.",
          author: "Anonymous",
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          text: "The best time to plant a tree was 20 years ago. The second best time is now.",
          author: "Chinese Proverb",
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          text: "In the depths of winter, I finally learned that within me there lay an invincible summer.",
          author: "Albert Camus",
          is_active: false,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuote = async () => {
    if (!newQuote.text.trim() || !newQuote.author.trim()) {
      setError('Both quote text and author are required');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      // Use centralized API configuration pointing to Render backend
      const apiUrl = buildApiUrl('api/homepage/quotes');
      console.log('➕ QuotesEditor - Adding quote to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          text: newQuote.text.trim(),
          author: newQuote.author.trim(),
          is_active: true
        })
      });
      
      console.log('➕ QuotesEditor - Add response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('➕ QuotesEditor - Add error response:', errorText);
        throw new Error(`Failed to add quote: ${response.status} ${response.statusText}`);
      }
      
      const addedQuote = await response.json();
      console.log('➕ QuotesEditor - Quote added:', addedQuote);
      
      setQuotes(prev => [addedQuote, ...prev]);
      setNewQuote({ text: '', author: '' });
      setLastSaved(new Date());
      console.log('✅ QuotesEditor - Quote added successfully');
      
    } catch (err) {
      console.error('❌ QuotesEditor - Failed to add quote:', err);
      setError('Failed to add quote');
      
      // Mock addition for demonstration
      const mockQuote: Quote = {
        id: Date.now(),
        text: newQuote.text.trim(),
        author: newQuote.author.trim(),
        is_active: true,
        created_at: new Date().toISOString()
      };
      setQuotes(prev => [mockQuote, ...prev]);
      setNewQuote({ text: '', author: '' });
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateQuote = async (updatedQuote: Quote) => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Use centralized API configuration pointing to Render backend
      const apiUrl = buildApiUrl(`api/homepage/quotes/${updatedQuote.id}`);
      console.log('📝 QuotesEditor - Updating quote at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updatedQuote)
      });
      
      console.log('📝 QuotesEditor - Update response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('📝 QuotesEditor - Update error response:', errorText);
        throw new Error(`Failed to update quote: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📝 QuotesEditor - Quote updated:', result);
      
      setQuotes(prev => prev.map(quote => 
        quote.id === updatedQuote.id ? updatedQuote : quote
      ));
      setEditingQuote(null);
      setLastSaved(new Date());
      console.log('✅ QuotesEditor - Quote updated successfully');
      
    } catch (err) {
      console.error('❌ QuotesEditor - Failed to update quote:', err);
      setError('Failed to update quote');
      
      // Mock update for demonstration
      setQuotes(prev => prev.map(quote => 
        quote.id === updatedQuote.id ? updatedQuote : quote
      ));
      setEditingQuote(null);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuote = async (quoteId: number) => {
    if (!confirm('Are you sure you want to delete this quote?')) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      // Use centralized API configuration pointing to Render backend
      const apiUrl = buildApiUrl(`api/homepage/quotes/${quoteId}`);
      console.log('🗑️ QuotesEditor - Deleting quote at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('🗑️ QuotesEditor - Delete response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🗑️ QuotesEditor - Delete error response:', errorText);
        throw new Error(`Failed to delete quote: ${response.status} ${response.statusText}`);
      }
      
      setQuotes(prev => prev.filter(quote => quote.id !== quoteId));
      setLastSaved(new Date());
      console.log('✅ QuotesEditor - Quote deleted successfully');
      
    } catch (err) {
      console.error('❌ QuotesEditor - Failed to delete quote:', err);
      setError('Failed to delete quote');
      
      // Mock deletion for demonstration
      setQuotes(prev => prev.filter(quote => quote.id !== quoteId));
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (quote: Quote) => {
    setEditingQuote({ ...quote });
  };

  const cancelEditing = () => {
    setEditingQuote(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading quotes...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">💬 Quotes Management</h2>
        <div className="flex items-center space-x-4">
          {lastSaved && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved at {lastSaved.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={loadQuotes}
            disabled={isLoading || isSaving}
            className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <p className="text-xs text-red-500 mt-1">
            Check the browser console for detailed error information.
          </p>
        </div>
      )}

      {/* Add New Quote Form */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-3">Add New Quote</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quote Text
            </label>
            <textarea
              value={newQuote.text}
              onChange={(e) => setNewQuote(prev => ({ ...prev, text: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the quote text..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={newQuote.author}
              onChange={(e) => setNewQuote(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Quote author..."
            />
          </div>
          <button
            onClick={handleAddQuote}
            disabled={!newQuote.text.trim() || !newQuote.author.trim() || isSaving}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Quote
          </button>
        </div>
      </div>

      {/* Quotes List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Existing Quotes ({quotes.length})</h3>
          <div className="text-sm text-gray-500">
            {quotes.filter(q => q.is_active).length} active, {quotes.filter(q => !q.is_active).length} inactive
          </div>
        </div>
        
        {quotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No quotes found. Add your first quote above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div key={quote.id} className="bg-white border border-gray-200 rounded-lg p-4">
                {editingQuote?.id === quote.id ? (
                  // Editing Mode
                  <div className="space-y-3">
                    <textarea
                      value={editingQuote.text}
                      onChange={(e) => setEditingQuote(prev => prev ? { ...prev, text: e.target.value } : null)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editingQuote.author}
                      onChange={(e) => setEditingQuote(prev => prev ? { ...prev, author: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingQuote.is_active}
                          onChange={(e) => setEditingQuote(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                      </label>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEditing}
                        className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateQuote(editingQuote)}
                        disabled={isSaving}
                        className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <blockquote className="text-gray-800 italic mb-2 text-lg">
                          "{quote.text}"
                        </blockquote>
                        <p className="text-sm text-gray-600 mb-3">— {quote.author}</p>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            quote.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {quote.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {quote.created_at && (
                            <span className="text-xs text-gray-500">
                              Added {new Date(quote.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => startEditing(quote)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Edit quote"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete quote"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Debug Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p><strong>API Debug:</strong> Using centralized config pointing to Render backend</p>
        <p><strong>Quotes URL:</strong> {buildApiUrl('api/homepage/quotes')}</p>
      </div>
    </div>
  );
};

export default QuotesEditor;