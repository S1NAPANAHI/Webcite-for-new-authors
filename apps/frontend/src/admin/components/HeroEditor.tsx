import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient, buildApiUrl, getApiInfo } from '../../lib/config';

interface HeroContent {
  id?: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_quote: string;
  cta_button_text: string;
  cta_button_link: string;
}

const HeroEditor: React.FC = () => {
  // Simple hook pattern - only useState and useEffect
  const [heroData, setHeroData] = useState<HeroContent>({
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    hero_quote: '',
    cta_button_text: '',
    cta_button_link: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiInfo, setApiInfo] = useState(getApiInfo());

  // Only one useEffect - loads data on mount
  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Loading hero data from Render backend...');
      console.log('🌐 API Info:', apiInfo);
      
      // Try dedicated hero endpoint first
      let response = await apiClient.get('api/homepage/hero');
      let endpointUsed = 'hero';
      
      if (!response.ok) {
        // If hero endpoint fails, try general content endpoint
        console.warn('⚠️ Hero endpoint failed, trying content endpoint...');
        response = await apiClient.get('api/homepage/content');
        endpointUsed = 'content';
      }
      
      if (!response.ok) {
        // If both APIs fail, use fallback content
        console.warn('⚠️ Both API endpoints failed, using fallback content');
        const fallbackContent: HeroContent = {
          hero_title: 'ZOROASTERVERSE',
          hero_subtitle: '',
          hero_description: 'Learn about the teachings of the prophet Zarathustra, the history of one of the worlds oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.',
          hero_quote: 'Happiness comes to them who bring happiness to others.',
          cta_button_text: 'Learn More',
          cta_button_link: '/blog/about'
        };
        setHeroData(fallbackContent);
        setError(`API connection failed. Using fallback content. Backend: ${apiInfo.baseUrl}`);
        return;
      }
      
      const result = await response.json();
      console.log(`✅ API Response received from ${endpointUsed} endpoint:`, result);
      
      // Handle both direct data and wrapped response formats
      const data = result.data || result.content || result;
      
      if (data) {
        setHeroData({
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_description: data.hero_description || '',
          hero_quote: data.hero_quote || '',
          cta_button_text: data.cta_button_text || '',
          cta_button_link: data.cta_button_link || ''
        });
        console.log(`✅ Hero data loaded successfully from ${endpointUsed} endpoint`);
        setError(null); // Clear any previous errors
      } else {
        throw new Error('No hero data found in API response');
      }
      
    } catch (err) {
      console.error('❌ Failed to load hero data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to connect to backend: ${errorMessage}`);
      
      // Set fallback values that match your current live site
      setHeroData({
        hero_title: 'ZOROASTERVERSE',
        hero_subtitle: '',
        hero_description: 'Learn about the teachings of the prophet Zarathustra, the history of one of the worlds oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.',
        hero_quote: 'Happiness comes to them who bring happiness to others.',
        cta_button_text: 'Learn More',
        cta_button_link: '/blog/about'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof HeroContent, value: string) => {
    setHeroData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear success message when user starts editing
    if (success) setSuccess(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      
      console.log('💾 Saving hero data to Render backend...');
      console.log('📤 Data being sent:', heroData);
      console.log('🌐 Backend URL:', apiInfo.baseUrl);
      
      // Try dedicated hero endpoint first
      let response = await apiClient.put('api/homepage/hero', heroData);
      let endpointUsed = 'hero';
      
      if (!response.ok) {
        // If hero endpoint fails, try general content endpoint
        console.warn('⚠️ Hero save endpoint failed, trying content endpoint...');
        response = await apiClient.put('api/homepage/content', heroData);
        endpointUsed = 'content';
      }
      
      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ error: 'Unknown server error' }));
        throw new Error(errorResult.error || `Server error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`📥 Save response from ${endpointUsed} API:`, result);
      
      if (!result.success && result.error) {
        throw new Error(result.error);
      }
      
      setLastSaved(new Date());
      setSuccess(`Hero content saved successfully via ${endpointUsed} endpoint!`);
      console.log('✅ Hero content saved successfully');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err) {
      console.error('❌ Failed to save hero data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save hero content';
      setError(`Save failed: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Connecting to Render backend...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            🏠 Hero Section Editor
          </h2>
          <p className="text-gray-600 mt-1">Edit the main hero section of your homepage</p>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs ${
              apiInfo.isRenderBackend 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {apiInfo.isRenderBackend ? '✅ Render Backend' : '⚠️ Custom Backend'}
            </span>
            <span className="text-gray-400">|</span>
            <span>{apiInfo.baseUrl}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {lastSaved && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved at {lastSaved.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={loadHeroData}
            disabled={isLoading}
            className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-yellow-800 font-medium">Backend Connection Issue</h4>
              <p className="text-yellow-700 text-sm mt-1">{error}</p>
              <p className="text-yellow-600 text-xs mt-1">
                You can still edit and save. Changes will be applied when the connection is restored.
              </p>
              {!apiInfo.isRenderBackend && (
                <p className="text-yellow-600 text-xs mt-1">
                  ℹ️ Expected: Render backend (onrender.com)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          {/* Hero Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Title
            </label>
            <input
              type="text"
              value={heroData.hero_title}
              onChange={(e) => handleInputChange('hero_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter hero title (e.g., ZOROASTERVERSE)"
            />
          </div>

          {/* Hero Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Subtitle
              <span className="text-gray-500 text-xs ml-1">(Optional)</span>
            </label>
            <input
              type="text"
              value={heroData.hero_subtitle}
              onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter hero subtitle (optional)"
            />
          </div>

          {/* Hero Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Description
            </label>
            <textarea
              value={heroData.hero_description}
              onChange={(e) => handleInputChange('hero_description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter hero description that explains your site's purpose..."
            />
          </div>

          {/* Hero Quote */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Quote
            </label>
            <textarea
              value={heroData.hero_quote}
              onChange={(e) => handleInputChange('hero_quote', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter inspirational quote (without quotes - they'll be added automatically)"
            />
          </div>

          {/* CTA Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={heroData.cta_button_text}
                onChange={(e) => handleInputChange('cta_button_text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Learn More, Get Started, Explore"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Link
              </label>
              <input
                type="text"
                value={heroData.cta_button_link}
                onChange={(e) => handleInputChange('cta_button_link', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., /blog/about, /library, https://..."
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 p-6 rounded-md border">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              👁️ Live Preview
            </h3>
            <div className="bg-white p-6 rounded-md border shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {heroData.hero_title || 'Hero Title'}
              </h1>
              {heroData.hero_subtitle && (
                <h2 className="text-xl text-gray-700 mb-3">
                  {heroData.hero_subtitle}
                </h2>
              )}
              {heroData.hero_quote && (
                <blockquote className="text-lg text-gray-600 italic mb-4 border-l-4 border-blue-500 pl-4">
                  "{heroData.hero_quote}"
                </blockquote>
              )}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {heroData.hero_description || 'Hero description will appear here'}
              </p>
              <div className="inline-block">
                <div className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
                  {heroData.cta_button_text || 'CTA Button'} →
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Links to: {heroData.cta_button_link || '/link/url'}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving to Render Backend...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Hero Content
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Debug Info (in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 p-4 rounded-md border">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Backend: {apiInfo.baseUrl}</div>
            <div>Is Render: {apiInfo.isRenderBackend.toString()}</div>
            <div>Environment: {apiInfo.environment}</div>
            <div>Hero API: {buildApiUrl('api/homepage/hero')}</div>
            <div>Content API: {buildApiUrl('api/homepage/content')}</div>
            <div>Loading: {isLoading.toString()}</div>
            <div>Saving: {isSaving.toString()}</div>
            <div>Has Error: {!!error}</div>
            <div>Last Saved: {lastSaved?.toLocaleString() || 'Never'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroEditor;