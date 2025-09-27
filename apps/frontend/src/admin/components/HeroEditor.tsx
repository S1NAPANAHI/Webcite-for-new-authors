import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';

interface HeroContent {
  id?: number;
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

  // Only one useEffect - loads data on mount
  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock API call - replace with your actual API endpoint
      const response = await fetch('/api/homepage/hero');
      if (!response.ok) throw new Error('Failed to load hero data');
      
      const data = await response.json();
      setHeroData(data);
    } catch (err) {
      console.error('Failed to load hero data:', err);
      setError('Failed to load hero content');
      // Set default values on error
      setHeroData({
        hero_title: 'Welcome to My Writing Journey',
        hero_subtitle: 'Fantasy Author & Storyteller',
        hero_description: 'Crafting epic tales inspired by Persian mythology and Zoroastrianism',
        hero_quote: 'Every story begins with a single word.',
        cta_button_text: 'Explore My Work',
        cta_button_link: '/library'
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
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Mock API call - replace with your actual API endpoint
      const response = await fetch('/api/homepage/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(heroData)
      });
      
      if (!response.ok) throw new Error('Failed to save hero data');
      
      setLastSaved(new Date());
      console.log('✅ Hero content saved successfully');
      
    } catch (err) {
      console.error('Failed to save hero data:', err);
      setError('Failed to save hero content');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading hero content...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">🏠 Hero Section</h2>
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
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hero Title
          </label>
          <input
            type="text"
            value={heroData.hero_title}
            onChange={(e) => handleInputChange('hero_title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hero title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hero Subtitle
          </label>
          <input
            type="text"
            value={heroData.hero_subtitle}
            onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hero subtitle..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hero Description
          </label>
          <textarea
            value={heroData.hero_description}
            onChange={(e) => handleInputChange('hero_description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hero description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hero Quote
          </label>
          <input
            type="text"
            value={heroData.hero_quote}
            onChange={(e) => handleInputChange('hero_quote', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter inspirational quote..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CTA Button Text
            </label>
            <input
              type="text"
              value={heroData.cta_button_text}
              onChange={(e) => handleInputChange('cta_button_text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Get Started"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CTA Button Link
            </label>
            <input
              type="url"
              value={heroData.cta_button_link}
              onChange={(e) => handleInputChange('cta_button_link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
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
            Save Hero Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;