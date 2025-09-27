import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { buildApiUrl, logApiConfig } from '../../lib/config';

interface LayoutConfig {
  id?: number;
  show_latest_news: boolean;
  show_latest_releases: boolean;
  show_artist_collaboration: boolean;
  show_progress_metrics: boolean;
}

const LayoutEditor: React.FC = () => {
  // Simple hook pattern - only useState and useEffect
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    show_latest_news: true,
    show_latest_releases: true,
    show_artist_collaboration: true,
    show_progress_metrics: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Only one useEffect - loads data on mount
  useEffect(() => {
    // Log API configuration for debugging
    console.log('🔧 LayoutEditor - API Configuration:');
    logApiConfig();
    
    loadLayoutConfig();
  }, []);

  const loadLayoutConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use centralized API configuration pointing to Render backend
      // Note: Layout config is part of homepage content, so we use the content endpoint
      const apiUrl = buildApiUrl('api/homepage/content');
      console.log('🎨 LayoutEditor - Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      console.log('🎨 LayoutEditor - Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎨 LayoutEditor - Error response:', errorText);
        throw new Error(`Failed to load layout configuration: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('🎨 LayoutEditor - Received data:', result);
      
      // Extract layout config from homepage content response
      const data = result.success ? result.data : result;
      
      setLayoutConfig({
        show_latest_news: data.show_latest_news ?? true,
        show_latest_releases: data.show_latest_releases ?? true,
        show_artist_collaboration: data.show_artist_collaboration ?? true,
        show_progress_metrics: data.show_progress_metrics ?? true
      });
      
    } catch (err) {
      console.error('❌ LayoutEditor - Failed to load layout config:', err);
      setError('Failed to load layout settings');
      
      // Set default values on error
      setLayoutConfig({
        show_latest_news: true,
        show_latest_releases: true,
        show_artist_collaboration: false,
        show_progress_metrics: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChange = (field: keyof LayoutConfig, value: boolean) => {
    setLayoutConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Use centralized API configuration pointing to Render backend
      // Layout config is saved as part of homepage content
      const apiUrl = buildApiUrl('api/homepage/content');
      console.log('💾 LayoutEditor - Saving to:', apiUrl);
      console.log('💾 LayoutEditor - Save payload:', layoutConfig);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(layoutConfig)
      });
      
      console.log('💾 LayoutEditor - Save response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('💾 LayoutEditor - Save error response:', errorText);
        throw new Error(`Failed to save layout configuration: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('💾 LayoutEditor - Save result:', result);
      
      setLastSaved(new Date());
      console.log('✅ LayoutEditor - Layout settings saved successfully');
      
    } catch (err) {
      console.error('❌ LayoutEditor - Failed to save layout config:', err);
      setError('Failed to save layout settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading layout settings...</span>
      </div>
    );
  }

  const layoutSections = [
    {
      key: 'show_latest_news' as keyof LayoutConfig,
      title: 'Latest News Section',
      description: 'Display recent blog posts and news updates on the homepage',
      icon: '📰'
    },
    {
      key: 'show_latest_releases' as keyof LayoutConfig,
      title: 'Latest Releases Section',
      description: 'Show recently published books and upcoming releases',
      icon: '📚'
    },
    {
      key: 'show_artist_collaboration' as keyof LayoutConfig,
      title: 'Artist Collaboration Section',
      description: 'Highlight collaborations with cover artists and illustrators',
      icon: '🎨'
    },
    {
      key: 'show_progress_metrics' as keyof LayoutConfig,
      title: 'Progress Metrics Section',
      description: 'Display writing statistics and achievements',
      icon: '📊'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">🏛️ Layout Sections</h2>
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">👁️ Preview Impact</h3>
        <p className="text-blue-700 text-sm">
          Toggle sections on/off to customize what appears on your homepage. Changes take effect immediately after saving.
        </p>
      </div>

      <div className="space-y-4">
        {layoutSections.map((section) => {
          const isEnabled = layoutConfig[section.key] as boolean;
          
          return (
            <div 
              key={section.key}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                isEnabled 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{section.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`flex items-center text-sm ${
                  isEnabled ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {isEnabled ? (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      <span>Hidden</span>
                    </>
                  )}
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => handleToggleChange(section.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">📊 Section Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-green-600 font-medium">
              {Object.values(layoutConfig).filter(Boolean).length} sections enabled
            </span>
            <ul className="mt-1 space-y-1">
              {layoutSections
                .filter(section => layoutConfig[section.key])
                .map(section => (
                  <li key={section.key} className="flex items-center text-green-700">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    {section.title}
                  </li>
                ))
              }
            </ul>
          </div>
          <div>
            <span className="text-gray-600 font-medium">
              {Object.values(layoutConfig).filter(v => !v).length} sections hidden
            </span>
            <ul className="mt-1 space-y-1">
              {layoutSections
                .filter(section => !layoutConfig[section.key])
                .map(section => (
                  <li key={section.key} className="flex items-center text-gray-500">
                    <EyeOff className="w-3 h-3 mr-2" />
                    {section.title}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Layout Settings
        </button>
      </div>

      {/* API Debug Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p><strong>API Debug:</strong> Using centralized config pointing to Render backend</p>
        <p><strong>Layout Config URL:</strong> {buildApiUrl('api/homepage/content')}</p>
      </div>
    </div>
  );
};

export default LayoutEditor;