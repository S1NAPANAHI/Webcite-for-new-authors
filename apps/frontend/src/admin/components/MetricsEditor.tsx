import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, BarChart3 } from 'lucide-react';
import { buildApiUrl, logApiConfig } from '../../lib/config';

interface ProgressMetrics {
  id?: number;
  words_written: number;
  beta_readers: number;
  average_rating: number;
  books_published: number;
}

// Helper function to format large numbers
const formatMetricValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const MetricsEditor: React.FC = () => {
  // Simple hook pattern - only useState and useEffect
  const [metricsData, setMetricsData] = useState<ProgressMetrics>({
    words_written: 0,
    beta_readers: 0,
    average_rating: 0,
    books_published: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Only one useEffect - loads data on mount
  useEffect(() => {
    // Log API configuration for debugging
    console.log('🔧 MetricsEditor - API Configuration:');
    logApiConfig();
    
    loadMetricsData();
  }, []);

  const loadMetricsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use centralized API configuration pointing to Render backend
      const apiUrl = buildApiUrl('api/homepage/metrics');
      console.log('📊 MetricsEditor - Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      console.log('📊 MetricsEditor - Response status:', response.status);
      console.log('📊 MetricsEditor - Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('📊 MetricsEditor - Error response:', errorText);
        throw new Error(`Failed to load metrics data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 MetricsEditor - Received data:', data);
      
      setMetricsData({
        words_written: data.words_written || 0,
        beta_readers: data.beta_readers || 0,
        average_rating: data.average_rating || 0,
        books_published: data.books_published || 0
      });
      
    } catch (err) {
      console.error('❌ MetricsEditor - Failed to load metrics data:', err);
      setError('Failed to load metrics');
      
      // Set mock values on error for demonstration
      setMetricsData({
        words_written: 125000,
        beta_readers: 12,
        average_rating: 4.7,
        books_published: 2
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProgressMetrics, value: string) => {
    const numericValue = field === 'average_rating' ? parseFloat(value) || 0 : parseInt(value) || 0;
    setMetricsData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Use centralized API configuration pointing to Render backend
      const apiUrl = buildApiUrl('api/homepage/metrics');
      console.log('💾 MetricsEditor - Saving to:', apiUrl);
      console.log('💾 MetricsEditor - Save payload:', metricsData);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(metricsData)
      });
      
      console.log('💾 MetricsEditor - Save response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('💾 MetricsEditor - Save error response:', errorText);
        throw new Error(`Failed to save metrics data: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('💾 MetricsEditor - Save result:', result);
      
      setLastSaved(new Date());
      console.log('✅ MetricsEditor - Metrics saved successfully');
      
    } catch (err) {
      console.error('❌ MetricsEditor - Failed to save metrics data:', err);
      setError('Failed to save metrics');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoCalculate = async () => {
    try {
      setIsCalculating(true);
      setError(null);
      
      // Use centralized API configuration pointing to Render backend
      const apiUrl = buildApiUrl('api/homepage/metrics/calculate');
      console.log('🔄 MetricsEditor - Auto-calculating from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      console.log('🔄 MetricsEditor - Calculate response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔄 MetricsEditor - Calculate error response:', errorText);
        throw new Error(`Failed to calculate metrics: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('🔄 MetricsEditor - Calculate result:', result);
      
      if (result.success && result.data) {
        setMetricsData({
          words_written: result.data.words_written || 0,
          beta_readers: result.data.beta_readers || 0,
          average_rating: result.data.average_rating || 0,
          books_published: result.data.books_published || 0
        });
      }
      
      setLastSaved(new Date());
      console.log('✅ MetricsEditor - Metrics calculated successfully');
      
    } catch (err) {
      console.error('❌ MetricsEditor - Failed to calculate metrics:', err);
      setError('Failed to auto-calculate metrics');
      
      // Mock calculation for demonstration
      setMetricsData(prev => ({
        ...prev,
        words_written: prev.words_written + Math.floor(Math.random() * 5000) + 1000,
        beta_readers: prev.beta_readers + Math.floor(Math.random() * 3) + 1
      }));
    } finally {
      setIsCalculating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading metrics...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">📊 Progress Metrics</h2>
        {lastSaved && (
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-2" />
            Saved at {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <p className="text-xs text-red-500 mt-1">
            Check the browser console for detailed error information.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Words Written
          </label>
          <input
            type="number"
            value={metricsData.words_written}
            onChange={(e) => handleInputChange('words_written', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Formatted: {formatMetricValue(metricsData.words_written)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beta Readers
          </label>
          <input
            type="number"
            value={metricsData.beta_readers}
            onChange={(e) => handleInputChange('beta_readers', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Active readers providing feedback
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Rating
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={metricsData.average_rating}
            onChange={(e) => handleInputChange('average_rating', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Out of 5.0 stars
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Books Published
          </label>
          <input
            type="number"
            value={metricsData.books_published}
            onChange={(e) => handleInputChange('books_published', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Completed works released
          </p>
        </div>
      </div>

      {/* Metrics Preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-3">🎨 Preview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-900">{formatMetricValue(metricsData.words_written)}</div>
            <div className="text-sm text-blue-700">Words Written</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-900">{metricsData.beta_readers}</div>
            <div className="text-sm text-blue-700">Beta Readers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-900">{metricsData.average_rating.toFixed(1)}★</div>
            <div className="text-sm text-blue-700">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-900">{metricsData.books_published}</div>
            <div className="text-sm text-blue-700">Books Published</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={handleAutoCalculate}
          disabled={isCalculating || isSaving}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isCalculating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <BarChart3 className="w-4 h-4 mr-2" />
          )}
          Auto-Calculate from Database
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving || isCalculating}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Metrics
        </button>
      </div>

      {/* API Debug Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p><strong>API Debug:</strong> Using centralized config pointing to Render backend</p>
        <p><strong>Metrics URL:</strong> {buildApiUrl('api/homepage/metrics')}</p>
        <p><strong>Calculate URL:</strong> {buildApiUrl('api/homepage/metrics/calculate')}</p>
      </div>
    </div>
  );
};

export default MetricsEditor;