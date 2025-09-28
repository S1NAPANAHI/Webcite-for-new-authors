import React, { useState, useRef, useEffect } from 'react';
import { Download, Image, Type, Palette, Smartphone, Monitor, RotateCcw } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Template {
  id: string;
  name: string;
  type: 'post' | 'story';
  width: number;
  height: number;
  background: string;
  textColor: string;
  layout: 'minimal' | 'centered' | 'split' | 'overlay';
}

interface PostContent {
  title: string;
  subtitle: string;
  author: string;
  quote: string;
  hashtags: string;
  backgroundImage?: string;
  backgroundColor: string;
  textColor: string;
  titleFont: string;
  bodyFont: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'minimal-post',
    name: 'Minimal Post',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    layout: 'minimal'
  },
  {
    id: 'book-quote',
    name: 'Book Quote',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    textColor: '#ffffff',
    layout: 'centered'
  },
  {
    id: 'author-spotlight',
    name: 'Author Spotlight',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    textColor: '#ffffff',
    layout: 'split'
  },
  {
    id: 'story-minimal',
    name: 'Story Minimal',
    type: 'story',
    width: 1080,
    height: 1920,
    background: 'linear-gradient(180deg, #ff9a9e 0%, #fecfef 100%)',
    textColor: '#333333',
    layout: 'centered'
  },
  {
    id: 'story-quote',
    name: 'Story Quote',
    type: 'story',
    width: 1080,
    height: 1920,
    background: 'linear-gradient(180deg, #a8edea 0%, #fed6e3 100%)',
    textColor: '#2d3748',
    layout: 'overlay'
  },
  {
    id: 'book-announcement',
    name: 'Book Announcement',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #ff8a80 0%, #ffcc70 100%)',
    textColor: '#ffffff',
    layout: 'split'
  }
];

const FONT_OPTIONS = [
  'Inter, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Helvetica, sans-serif',
  'Arial, sans-serif',
  'Playfair Display, serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif'
];

const COLOR_PRESETS = [
  { name: 'Ocean', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff' },
  { name: 'Sunset', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#ffffff' },
  { name: 'Forest', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', text: '#ffffff' },
  { name: 'Royal', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff' },
  { name: 'Fire', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', text: '#333333' },
  { name: 'Ice', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', text: '#2d3748' },
  { name: 'Night', background: 'linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)', text: '#ecf0f1' },
  { name: 'Gold', background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', text: '#2c3e50' }
];

export const SocialMediaGenerator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);
  const [postContent, setPostContent] = useState<PostContent>({
    title: 'Your Book Title',
    subtitle: 'A compelling subtitle',
    author: 'Your Name',
    quote: 'An inspiring quote from your book that captures the essence of your story.',
    hashtags: '#newbook #author #writing #fantasy',
    backgroundColor: TEMPLATES[0].background,
    textColor: TEMPLATES[0].textColor,
    titleFont: 'Inter, sans-serif',
    bodyFont: 'Georgia, serif'
  });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateChange = (template: Template) => {
    setSelectedTemplate(template);
    setPostContent(prev => ({
      ...prev,
      backgroundColor: template.background,
      textColor: template.textColor
    }));
  };

  const handleContentChange = (field: keyof PostContent, value: string) => {
    setPostContent(prev => ({ ...prev, [field]: value }));
  };

  const handleColorPresetChange = (preset: typeof COLOR_PRESETS[0]) => {
    setPostContent(prev => ({
      ...prev,
      backgroundColor: preset.background,
      textColor: preset.text
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPostContent(prev => ({
          ...prev,
          backgroundImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadPost = async () => {
    if (!canvasRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(canvasRef.current, {
        width: selectedTemplate.width,
        height: selectedTemplate.height,
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });
      
      const link = document.createElement('a');
      link.download = `social-post-${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPostContent = () => {
    const { layout } = selectedTemplate;
    
    const baseStyle = {
      width: selectedTemplate.width,
      height: selectedTemplate.height,
      background: postContent.backgroundImage 
        ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${postContent.backgroundImage})`
        : postContent.backgroundColor,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: postContent.textColor,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px',
      position: 'relative' as const,
      overflow: 'hidden'
    };

    switch (layout) {
      case 'minimal':
        return (
          <div style={baseStyle}>
            <h1 style={{ 
              fontSize: '64px', 
              fontFamily: postContent.titleFont,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '20px',
              lineHeight: '1.2'
            }}>
              {postContent.title}
            </h1>
            <p style={{ 
              fontSize: '28px',
              fontFamily: postContent.bodyFont,
              textAlign: 'center',
              opacity: 0.9,
              marginBottom: '30px'
            }}>
              {postContent.subtitle}
            </p>
            <p style={{ 
              fontSize: '24px',
              fontFamily: postContent.bodyFont,
              textAlign: 'center',
              opacity: 0.8
            }}>
              by {postContent.author}
            </p>
          </div>
        );

      case 'centered':
        return (
          <div style={baseStyle}>
            <div style={{ textAlign: 'center', maxWidth: '80%' }}>
              <p style={{ 
                fontSize: '42px',
                fontFamily: postContent.bodyFont,
                fontStyle: 'italic',
                lineHeight: '1.4',
                marginBottom: '40px',
                position: 'relative'
              }}>
                "{postContent.quote}"
              </p>
              <p style={{ 
                fontSize: '24px',
                fontFamily: postContent.titleFont,
                fontWeight: 'bold'
              }}>
                — {postContent.author}
              </p>
              <p style={{ 
                fontSize: '20px',
                fontFamily: postContent.titleFont,
                marginTop: '20px',
                opacity: 0.8
              }}>
                {postContent.title}
              </p>
            </div>
          </div>
        );

      case 'split':
        return (
          <div style={baseStyle}>
            <div style={{ 
              display: 'flex', 
              width: '100%', 
              height: '100%',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1, paddingRight: '40px' }}>
                <h1 style={{ 
                  fontSize: '56px', 
                  fontFamily: postContent.titleFont,
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  lineHeight: '1.2'
                }}>
                  {postContent.title}
                </h1>
                <p style={{ 
                  fontSize: '24px',
                  fontFamily: postContent.bodyFont,
                  marginBottom: '20px',
                  opacity: 0.9
                }}>
                  {postContent.subtitle}
                </p>
                <p style={{ 
                  fontSize: '20px',
                  fontFamily: postContent.titleFont,
                  opacity: 0.8
                }}>
                  by {postContent.author}
                </p>
              </div>
              <div style={{ 
                flex: 1, 
                height: '100%',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
              }}>
                <p style={{ 
                  fontSize: '32px',
                  fontFamily: postContent.bodyFont,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  lineHeight: '1.4'
                }}>
                  "{postContent.quote}"
                </p>
              </div>
            </div>
          </div>
        );

      case 'overlay':
        return (
          <div style={baseStyle}>
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
              zIndex: 1
            }} />
            <div style={{ 
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              maxWidth: '90%'
            }}>
              <h1 style={{ 
                fontSize: selectedTemplate.type === 'story' ? '72px' : '64px',
                fontFamily: postContent.titleFont,
                fontWeight: 'bold',
                marginBottom: '40px',
                lineHeight: '1.2',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                {postContent.title}
              </h1>
              <p style={{ 
                fontSize: selectedTemplate.type === 'story' ? '36px' : '32px',
                fontFamily: postContent.bodyFont,
                fontStyle: 'italic',
                lineHeight: '1.4',
                marginBottom: '40px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}>
                "{postContent.quote}"
              </p>
              <p style={{ 
                fontSize: selectedTemplate.type === 'story' ? '28px' : '24px',
                fontFamily: postContent.titleFont,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}>
                — {postContent.author}
              </p>
              {selectedTemplate.type === 'story' && (
                <div style={{ 
                  position: 'absolute',
                  bottom: '100px',
                  left: 0,
                  right: 0,
                  fontSize: '24px',
                  fontFamily: postContent.titleFont,
                  opacity: 0.8
                }}>
                  {postContent.hashtags}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Social Media Post Generator
          </h1>
          <p className="text-gray-600">
            Create stunning Instagram posts and stories for your books
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Templates
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedTemplate.id === template.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {template.type === 'story' ? (
                        <Smartphone className="w-4 h-4 mr-1" />
                      ) : (
                        <Monitor className="w-4 h-4 mr-1" />
                      )}
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {template.width}×{template.height}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2" />
                Content
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={postContent.title}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={postContent.subtitle}
                    onChange={(e) => handleContentChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={postContent.author}
                    onChange={(e) => handleContentChange('author', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quote
                  </label>
                  <textarea
                    value={postContent.quote}
                    onChange={(e) => handleContentChange('quote', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    value={postContent.hashtags}
                    onChange={(e) => handleContentChange('hashtags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Design Controls */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Design
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Presets
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleColorPresetChange(preset)}
                        className="w-full h-12 rounded-lg shadow-sm border-2 border-gray-200 hover:border-gray-400 transition-colors"
                        style={{ background: preset.background }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title Font
                  </label>
                  <select
                    value={postContent.titleFont}
                    onChange={(e) => handleContentChange('titleFont', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font.split(',')[0]}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Body Font
                  </label>
                  <select
                    value={postContent.bodyFont}
                    onChange={(e) => handleContentChange('bodyFont', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font.split(',')[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Upload Image
                    </button>
                    {postContent.backgroundImage && (
                      <button
                        onClick={() => handleContentChange('backgroundImage', '')}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={downloadPost}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                {isGenerating ? 'Generating...' : 'Download Post'}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="flex justify-center">
                <div 
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-lg"
                  style={{
                    transform: selectedTemplate.type === 'story' 
                      ? 'scale(0.25)' 
                      : selectedTemplate.width > 800 
                        ? 'scale(0.4)' 
                        : 'scale(0.6)',
                    transformOrigin: 'top center'
                  }}
                >
                  <div ref={canvasRef}>
                    {renderPostContent()}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                {selectedTemplate.name} • {selectedTemplate.width}×{selectedTemplate.height}px
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};