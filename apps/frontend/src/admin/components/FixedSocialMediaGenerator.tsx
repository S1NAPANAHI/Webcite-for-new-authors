import React, { useState, useRef, useCallback } from 'react';
import { 
  Download, 
  Image, 
  Type, 
  Palette, 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  BookOpen,
  MessageCircle,
  User,
  Megaphone,
  Camera,
  Grid3X3,
  Sparkles,
  Eye,
  Settings,
  Copy,
  Check,
  Zap,
  Star
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { ENHANCED_TEMPLATES, COLOR_SCHEMES, TYPOGRAPHY_PRESETS, SocialTemplate } from './SocialMediaTemplates';

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
  accentColor: string;
}

const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: Grid3X3, color: 'bg-gradient-to-br from-slate-500 to-slate-600' },
  { id: 'book-launch', name: 'Book Launch', icon: BookOpen, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { id: 'quote', name: 'Quotes', icon: MessageCircle, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  { id: 'author', name: 'Author Spotlight', icon: User, color: 'bg-gradient-to-br from-green-500 to-green-600' },
  { id: 'announcement', name: 'Announcements', icon: Megaphone, color: 'bg-gradient-to-br from-red-500 to-red-600' },
  { id: 'behind-scenes', name: 'Behind the Scenes', icon: Camera, color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' }
];

const SAMPLE_CONTENT = {
  'book-launch': {
    title: 'The Chronicles of Afrydun',
    subtitle: 'An Epic Persian Fantasy Adventure',
    author: 'Your Name',
    quote: 'In the realm where legends breathe and heroes rise, destiny awaits.',
    hashtags: '#newbook #fantasy #persian #mythology #epicfantasy'
  },
  'quote': {
    title: 'Wisdom from the Ages',
    subtitle: 'Ancient Persian Wisdom',
    author: 'Your Name',
    quote: 'The light of truth shines brightest in the darkest of times.',
    hashtags: '#wisdom #quote #inspiration #truth #light'
  },
  'author': {
    title: 'Meet the Author',
    subtitle: 'Crafting Worlds, Weaving Stories',
    author: 'Your Name',
    quote: 'Every story begins with a single word, but continues with a thousand dreams.',
    hashtags: '#author #writer #storyteller #books #writing'
  },
  'announcement': {
    title: 'Big News!',
    subtitle: 'Something Amazing is Coming',
    author: 'Your Name',
    quote: 'The wait is almost over. Get ready for an unforgettable journey.',
    hashtags: '#announcement #news #comingsoon #excited #newrelease'
  },
  'behind-scenes': {
    title: 'Behind the Scenes',
    subtitle: 'The Writing Process',
    author: 'Your Name',
    quote: 'Every great story starts with a messy first draft and lots of coffee.',
    hashtags: '#writing #process #behindthescenes #author #creativity'
  }
};

export const FixedSocialMediaGenerator: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<SocialTemplate>(ENHANCED_TEMPLATES[0]);
  const [postContent, setPostContent] = useState<PostContent>({
    title: 'The Chronicles of Afrydun',
    subtitle: 'An Epic Persian Fantasy Adventure',
    author: 'Your Name',
    quote: 'In the realm where legends breathe and heroes rise, destiny awaits.',
    hashtags: '#newbook #fantasy #persian #mythology #epicfantasy',
    backgroundColor: ENHANCED_TEMPLATES[0].background,
    textColor: ENHANCED_TEMPLATES[0].textColor,
    titleFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    accentColor: '#3b82f6'
  });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'templates' | 'content' | 'design'>('templates');

  const filteredTemplates = selectedCategory === 'all' 
    ? ENHANCED_TEMPLATES 
    : ENHANCED_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleTemplateChange = useCallback((template: SocialTemplate) => {
    console.log('Changing template to:', template.name);
    setSelectedTemplate(template);
    setPostContent(prev => ({
      ...prev,
      backgroundColor: template.background,
      textColor: template.textColor
    }));
    
    // Auto-fill with sample content based on category
    const sampleContent = SAMPLE_CONTENT[template.category as keyof typeof SAMPLE_CONTENT];
    if (sampleContent) {
      setPostContent(prev => ({ ...prev, ...sampleContent }));
    }
  }, []);

  const handleContentChange = useCallback((field: keyof PostContent, value: string) => {
    setPostContent(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleColorSchemeChange = useCallback((schemeName: string) => {
    const scheme = COLOR_SCHEMES[schemeName as keyof typeof COLOR_SCHEMES];
    if (scheme) {
      setPostContent(prev => ({
        ...prev,
        backgroundColor: scheme.background,
        textColor: scheme.text,
        accentColor: scheme.accent
      }));
    }
  }, []);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const copyHashtags = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(postContent.hashtags);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [postContent.hashtags]);

  const downloadPost = async () => {
    if (!canvasRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(canvasRef.current, {
        width: selectedTemplate.width,
        height: selectedTemplate.height,
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
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
    const baseStyle: React.CSSProperties = {
      width: selectedTemplate.width,
      height: selectedTemplate.height,
      background: postContent.backgroundImage 
        ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${postContent.backgroundImage})`
        : postContent.backgroundColor,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: postContent.textColor,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box'
    };

    // Simple, working layouts
    switch (selectedTemplate.layout) {
      case 'modern':
        return (
          <div style={baseStyle}>
            <div style={{
              textAlign: 'center' as const,
              maxWidth: '90%',
              zIndex: 2
            }}>
              <div style={{
                display: 'inline-block',
                padding: '8px 20px',
                background: `${postContent.accentColor}40`,
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '20px',
                border: `1px solid ${postContent.accentColor}60`
              }}>
                NEW RELEASE
              </div>
              
              <h1 style={{ 
                fontSize: Math.min(48, selectedTemplate.width / 20) + 'px',
                fontWeight: '800',
                marginBottom: '16px',
                lineHeight: '1.1',
                textAlign: 'center' as const,
                wordBreak: 'break-word' as const
              }}>
                {postContent.title}
              </h1>
              
              <p style={{ 
                fontSize: Math.min(24, selectedTemplate.width / 40) + 'px',
                marginBottom: '20px',
                opacity: 0.9,
                lineHeight: '1.3',
                textAlign: 'center' as const
              }}>
                {postContent.subtitle}
              </p>
              
              <p style={{ 
                fontSize: Math.min(20, selectedTemplate.width / 50) + 'px',
                fontWeight: '600',
                textAlign: 'center' as const
              }}>
                by {postContent.author}
              </p>
            </div>
          </div>
        );

      case 'split':
        return (
          <div style={{
            ...baseStyle,
            flexDirection: 'row' as const,
            gap: '30px',
            alignItems: 'center' as const
          }}>
            <div style={{ flex: 1, maxWidth: '50%' }}>
              <div style={{
                width: '60px',
                height: '4px',
                background: postContent.accentColor,
                marginBottom: '20px',
                borderRadius: '2px'
              }} />
              
              <h1 style={{ 
                fontSize: Math.min(42, selectedTemplate.width / 25) + 'px',
                fontWeight: 'bold',
                marginBottom: '16px',
                lineHeight: '1.1',
                wordBreak: 'break-word' as const
              }}>
                {postContent.title}
              </h1>
              
              <p style={{ 
                fontSize: Math.min(20, selectedTemplate.width / 50) + 'px',
                marginBottom: '16px',
                opacity: 0.9,
                lineHeight: '1.3'
              }}>
                {postContent.subtitle}
              </p>
              
              <p style={{ 
                fontSize: Math.min(18, selectedTemplate.width / 55) + 'px',
                opacity: 0.8,
                fontWeight: '500'
              }}>
                by {postContent.author}
              </p>
            </div>
            
            <div style={{ 
              flex: 1,
              maxWidth: '50%',
              height: '70%',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '30px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              <p style={{ 
                fontSize: Math.min(24, selectedTemplate.width / 45) + 'px',
                fontStyle: 'italic',
                textAlign: 'center' as const,
                lineHeight: '1.4',
                wordBreak: 'break-word' as const
              }}>
                "{postContent.quote}"
              </p>
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
              background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
              zIndex: 1
            }} />
            
            <div style={{ 
              position: 'relative',
              zIndex: 2,
              textAlign: 'center' as const,
              maxWidth: '90%'
            }}>
              <h1 style={{ 
                fontSize: Math.min(56, selectedTemplate.width / 18) + 'px',
                fontWeight: 'bold',
                marginBottom: '24px',
                lineHeight: '1.1',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                wordBreak: 'break-word' as const
              }}>
                {postContent.title}
              </h1>
              
              <p style={{ 
                fontSize: Math.min(28, selectedTemplate.width / 35) + 'px',
                fontStyle: 'italic',
                lineHeight: '1.4',
                marginBottom: '20px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                wordBreak: 'break-word' as const
              }}>
                "{postContent.quote}"
              </p>
              
              <p style={{ 
                fontSize: Math.min(22, selectedTemplate.width / 45) + 'px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                fontWeight: '600'
              }}>
                — {postContent.author}
              </p>
            </div>
          </div>
        );

      default: // minimal
        return (
          <div style={baseStyle}>
            <div style={{ textAlign: 'center' as const, maxWidth: '90%' }}>
              <h1 style={{ 
                fontSize: Math.min(52, selectedTemplate.width / 20) + 'px',
                fontWeight: 'bold',
                marginBottom: '20px',
                lineHeight: '1.1',
                wordBreak: 'break-word' as const
              }}>
                {postContent.title}
              </h1>
              
              <div style={{
                width: '80px',
                height: '3px',
                background: postContent.accentColor,
                margin: '20px auto',
                borderRadius: '2px'
              }} />
              
              <p style={{ 
                fontSize: Math.min(26, selectedTemplate.width / 40) + 'px',
                marginBottom: '20px',
                opacity: 0.9,
                lineHeight: '1.3'
              }}>
                {postContent.subtitle}
              </p>
              
              <p style={{ 
                fontSize: Math.min(20, selectedTemplate.width / 50) + 'px',
                opacity: 0.8,
                fontWeight: '500'
              }}>
                by {postContent.author}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Social Media Generator
              </h1>
              <p className="text-gray-600 text-sm">
                Create professional Instagram posts and stories
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel - Reduced width */}
          <div className="lg:col-span-1 space-y-4">
            {/* Section Navigation */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2">
              <div className="flex space-x-1">
                {[
                  { id: 'templates', icon: Grid3X3, label: 'Templates' },
                  { id: 'content', icon: Type, label: 'Content' },
                  { id: 'design', icon: Settings, label: 'Design' }
                ].map(section => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as any)}
                      className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <section.icon className="w-3 h-3 mr-1" />
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Templates Section */}
            {activeSection === 'templates' && (
              <div className="space-y-4">
                {/* Categories */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TEMPLATE_CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      const isSelected = selectedCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            console.log('Category selected:', category.id);
                            setSelectedCategory(category.id);
                          }}
                          className={`p-3 rounded-lg border-2 text-xs font-semibold transition-all flex flex-col items-center space-y-1 ${
                            isSelected
                              ? 'border-blue-400 bg-blue-50 text-blue-700 transform scale-105'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-center">{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Templates */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Templates ({filteredTemplates.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredTemplates.map((template) => {
                      const isSelected = selectedTemplate.id === template.id;
                      return (
                        <button
                          key={template.id}
                          onClick={() => {
                            console.log('Template clicked:', template.name);
                            handleTemplateChange(template);
                          }}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? 'border-blue-400 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              {template.type === 'story' ? (
                                <Smartphone className="w-3 h-3 mr-2 text-purple-500" />
                              ) : (
                                <Monitor className="w-3 h-3 mr-2 text-blue-500" />
                              )}
                              <span className="font-semibold text-sm text-gray-900">{template.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {template.width}×{template.height}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {template.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Content Section */}
            {activeSection === 'content' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Content Editor</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      📚 Book Title
                    </label>
                    <input
                      type="text"
                      value={postContent.title}
                      onChange={(e) => handleContentChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Your book title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      ✨ Subtitle
                    </label>
                    <input
                      type="text"
                      value={postContent.subtitle}
                      onChange={(e) => handleContentChange('subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="A compelling subtitle"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      👤 Author Name
                    </label>
                    <input
                      type="text"
                      value={postContent.author}
                      onChange={(e) => handleContentChange('author', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      💬 Featured Quote
                    </label>
                    <textarea
                      value={postContent.quote}
                      onChange={(e) => handleContentChange('quote', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="An inspiring quote..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center justify-between">
                      <span>🏷️ Hashtags</span>
                      <button
                        onClick={copyHashtags}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 flex items-center"
                      >
                        {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </label>
                    <input
                      type="text"
                      value={postContent.hashtags}
                      onChange={(e) => handleContentChange('hashtags', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="#newbook #author #fantasy"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Design Section */}
            {activeSection === 'design' && (
              <div className="space-y-4">
                {/* Color Schemes */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Color Schemes</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                      <button
                        key={key}
                        onClick={() => handleColorSchemeChange(key)}
                        className="h-12 rounded-lg shadow-md border-2 border-gray-200 hover:border-gray-400 transition-all relative group"
                        style={{ background: scheme.background }}
                        title={scheme.name}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center rounded-lg">
                          <span className="text-white font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-2 py-1 rounded">
                            {scheme.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Image */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Background</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all font-medium text-sm"
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Upload Background
                    </button>
                    
                    {postContent.backgroundImage && (
                      <button
                        onClick={() => handleContentChange('backgroundImage', '')}
                        className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center justify-center transition-colors font-medium text-sm"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Remove Background
                      </button>
                    )}
                    
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
            )}

            {/* Download Section */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg border border-green-200 p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Export</h3>
              <button
                onClick={downloadPost}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all shadow-lg text-sm"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download PNG</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel - Increased width and better sizing */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                  Live Preview
                </h3>
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedTemplate.type === 'story' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedTemplate.type === 'story' ? '📱 Story' : '📷 Post'}
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {selectedTemplate.width}×{selectedTemplate.height}px
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                <div className="relative">
                  <div 
                    className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-xl bg-white"
                    style={{
                      transform: selectedTemplate.type === 'story' 
                        ? 'scale(0.25)' 
                        : 'scale(0.35)',
                      transformOrigin: 'center center'
                    }}
                  >
                    <div ref={canvasRef}>
                      {renderPostContent()}
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded">
                    {selectedTemplate.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedSocialMediaGenerator;