
'use client';
import { useState } from 'react';

interface Reference {
  docNumber: number;
  title: string;
  kind: string;
  similarity: number;
  excerpt: string;
}

interface SearchResponse {
  answer: string;
  references: Reference[];
  query: string;
  totalMatches: number;
}

const kindOptions = [
  { value: '', label: 'All Content' },
  { value: 'character', label: 'Characters' },
  { value: 'lore', label: 'Lore & Mythology' },
  { value: 'book', label: 'Books & Stories' },
  { value: 'location', label: 'Places & Locations' },
  { value: 'timeline', label: 'Timeline & Events' }
];

export default function AISearch() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kindFilter, setKindFilter] = useState('');
  const [showReferences, setShowReferences] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          topK: 8,
          minSimilarity: 0.2,
          kindFilter: kindFilter || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about characters, lore, locations, or storylines..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              disabled={loading}
            />
          </div>
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {kindOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Searching...' : 'Ask the Verse'}
          </button>
        </div>
      </form>

      {/* Results */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {response && (
        <div className="space-y-6">
          {/* Answer */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                {response.answer}
              </div>
            </div>
          </div>

          {/* References */}
          {response.references.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <button
                onClick={() => setShowReferences(!showReferences)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-medium text-gray-900">
                  References ({response.references.length})
                </span>
                <span className="text-gray-500">
                  {showReferences ? '▼' : '▶'}
                </span>
              </button>

              {showReferences && (
                <div className="mt-4 space-y-3">
                  {response.references.map((ref, index) => (
                    <div key={index} className="bg-white border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold text-sm text-blue-600">
                            Doc {ref.docNumber}:
                          </span>
                          <span className="ml-2 font-medium">{ref.title}</span>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <div>{ref.kind}</div>
                          <div>{Math.round(ref.similarity * 100)}% match</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {ref.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Query info */}
          <div className="text-xs text-gray-500 text-center">
            Found {response.totalMatches} relevant passages for "{response.query}"
            {kindFilter && ` in ${kindOptions.find(k => k.value === kindFilter)?.label}`}
          </div>
        </div>
      )}
    </div>
  );
}
