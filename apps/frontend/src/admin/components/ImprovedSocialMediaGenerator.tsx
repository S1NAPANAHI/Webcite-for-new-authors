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

export const ImprovedSocialMediaGenerator: React.FC = () => {
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
    titleFont: TYPOGRAPHY_PRESETS.modern.title,
    bodyFont: TYPOGRAPHY_PRESETS.modern.body,
    accentColor: COLOR_SCHEMES.ocean.accent
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
    setSelectedTemplate(template);
    setPostContent(prev => ({
      ...prev,
      backgroundColor: template.background,
      textColor: template.textColor
    }));
    
    // Auto-fill with sample content based on category
    const sampleContent = SAMPLE_CONTENT[template.category];
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

  const handleTypographyChange = useCallback((presetName: string) => {
    const preset = TYPOGRAPHY_PRESETS[presetName as keyof typeof TYPOGRAPHY_PRESETS];
    if (preset) {
      setPostContent(prev => ({
        ...prev,
        titleFont: preset.title,
        bodyFont: preset.body
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
        ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${postContent.backgroundImage})`
        : postContent.backgroundColor,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: postContent.textColor,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: postContent.bodyFont
    };

    // Render different layouts based on template
    switch (selectedTemplate.layout) {
      case 'modern':
        return (
          <div style={baseStyle}>
            {/* Modern geometric elements */}
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${postContent.accentColor}25, transparent)`,
              opacity: 0.6
            }} />
            
            <div style={{
              position: 'absolute',
              bottom: '60px',
              left: '40px',
              width: '80px',
              height: '80px',
              background: `linear-gradient(45deg, ${postContent.accentColor}20, transparent)`,
              transform: 'rotate(45deg)'
            }} />
            
            <div style={{ textAlign: 'center', maxWidth: '90%', zIndex: 2 }}>
              <div style={{
                display: 'inline-block',
                padding: '10px 25px',
                background: `${postContent.accentColor}25`,
                borderRadius: '30px',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '35px',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${postContent.accentColor}40`
              }}>
                NEW RELEASE
              </div>
              
              <h1 style={{ 
                fontSize: '62px',
                fontFamily: postContent.titleFont,
                fontWeight: '800',
                marginBottom: '25px',
                lineHeight: '1.1',
                letterSpacing: '-0.03em'
              }}>
                {postContent.title}
              </h1>
              
              <p style={{ 
                fontSize: '32px',
                fontFamily: postContent.bodyFont,
                marginBottom: '35px',
                opacity: 0.9,
                lineHeight: '1.4',
                fontWeight: '400'
              }}>
                {postContent.subtitle}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${postContent.accentColor}, ${postContent.accentColor}80)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#ffffff'
                }}>
                  {postContent.author.charAt(0)}
                </div>
                <p style={{ 
                  fontSize: '26px',
                  fontFamily: postContent.titleFont,
                  fontWeight: '600'
                }}>
                  {postContent.author}
                </p>
              </div>
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
              alignItems: 'center',
              gap: '60px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  width: '80px',
                  height: '6px',
                  background: postContent.accentColor,
                  marginBottom: '40px',
                  borderRadius: '3px'
                }} />
                
                <h1 style={{ 
                  fontSize: '64px',
                  fontFamily: postContent.titleFont,
                  fontWeight: 'bold',
                  marginBottom: '30px',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em'
                }}>
                  {postContent.title}
                </h1>
                
                <p style={{ 
                  fontSize: '30px',
                  fontFamily: postContent.bodyFont,
                  marginBottom: '35px',
                  opacity: 0.9,
                  lineHeight: '1.4'
                }}>
                  {postContent.subtitle}
                </p>
                
                <p style={{ 
                  fontSize: '26px',
                  fontFamily: postContent.titleFont,
                  opacity: 0.8,
                  fontWeight: '500',
                  letterSpacing: '0.05em'
                }}>
                  by {postContent.author}
                </p>
              </div>
              
              <div style={{ 
                flex: 1,
                height: '90%',
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
              }}>
                <p style={{ 
                  fontSize: '38px',
                  fontFamily: postContent.bodyFont,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  lineHeight: '1.5',
                  fontWeight: '300'
                }}>
                  "{postContent.quote}"
                </p>
              </div>
            </div>
          </div>
        );

      default: // minimal layout
        return (
          <div style={baseStyle}>
            <div style={{ textAlign: 'center', maxWidth: '90%' }}>
              <h1 style={{ 
                fontSize: '72px',
                fontFamily: postContent.titleFont,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '30px',
                lineHeight: '1.1',
                letterSpacing: '-0.02em'
              }}>
                {postContent.title}
              </h1>
              
              <div style={{
                width: '100px',
                height: '4px',
                background: postContent.accentColor,
                margin: '40px auto',
                borderRadius: '2px'
              }} />
              
              <p style={{ 
                fontSize: '34px',
                fontFamily: postContent.bodyFont,
                textAlign: 'center',
                opacity: 0.9,
                marginBottom: '40px',
                lineHeight: '1.4'
              }}>
                {postContent.subtitle}
              </p>
              
              <p style={{ 
                fontSize: '28px',
                fontFamily: postContent.titleFont,
                textAlign: 'center',
                opacity: 0.8,
                fontWeight: '500',
                letterSpacing: '0.05em'
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
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Social Media Generator
                </h1>
                <p className="text-gray-600 mt-1">
                  Create stunning Instagram posts and stories instantly
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 inline mr-1" />
                Professional Quality
              </div>
              <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4 inline mr-1" />
                Instant Generation
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Enhanced Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Navigation */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3">
              <div className="flex space-x-2">
                {[
                  { id: 'templates', icon: Grid3X3, label: 'Templates', color: 'from-blue-500 to-blue-600' },
                  { id: 'content', icon: Type, label: 'Content', color: 'from-purple-500 to-purple-600' },
                  { id: 'design', icon: Settings, label: 'Design', color: 'from-green-500 to-green-600' }
                ].map(section => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as any)}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? `bg-gradient-to-r ${section.color} text-white shadow-lg transform scale-105`
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <section.icon className="w-4 h-4 mr-2" />
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Templates Section */}
            {activeSection === 'templates' && (
              <div className="space-y-6">
                {/* Categories */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Grid3X3 className="w-5 h-5 mr-2" />
                    Categories
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATE_CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      const isSelected = selectedCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`p-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 flex flex-col items-center space-y-2 ${
                            isSelected
                              ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg transform scale-105'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500' : category.color}`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <span>{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Templates */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Templates ({filteredTemplates.length})
                  </h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                    {filteredTemplates.map((template) => {
                      const isSelected = selectedTemplate.id === template.id;
                      return (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateChange(template)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg transform scale-105'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              {template.type === 'story' ? (
                                <Smartphone className="w-4 h-4 mr-2 text-purple-500" />
                              ) : (
                                <Monitor className="w-4 h-4 mr-2 text-blue-500" />
                              )}
                              <span className="font-semibold text-gray-900">{template.name}</span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {template.width}×{template.height}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
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
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Type className="w-5 h-5 mr-2" />
                  Content Editor
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📖 Book Title
                    </label>
                    <input
                      type="text"
                      value={postContent.title}
                      onChange={(e) => handleContentChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Your amazing book title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ✨ Subtitle/Tagline
                    </label>
                    <input
                      type="text"
                      value={postContent.subtitle}
                      onChange={(e) => handleContentChange('subtitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="A compelling subtitle"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      👤 Author Name
                    </label>
                    <input
                      type="text"
                      value={postContent.author}
                      onChange={(e) => handleContentChange('author', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Your name or pen name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💬 Featured Quote
                    </label>
                    <textarea
                      value={postContent.quote}
                      onChange={(e) => handleContentChange('quote', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      placeholder="An inspiring quote from your book..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                      <span>🏷️ Hashtags</span>
                      <button
                        onClick={copyHashtags}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                      >
                        {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </label>
                    <input
                      type="text"
                      value={postContent.hashtags}
                      onChange={(e) => handleContentChange('hashtags', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="#newbook #author #fantasy #writing"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Design Section */}
            {activeSection === 'design' && (
              <div className="space-y-6">
                {/* Color Schemes */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Color Schemes
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                      <button
                        key={key}
                        onClick={() => handleColorSchemeChange(key)}
                        className="group relative h-20 rounded-xl shadow-lg border-3 border-gray-200 hover:border-gray-400 transition-all overflow-hidden transform hover:scale-105"
                        style={{ background: scheme.background }}
                        title={scheme.name}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <span className="text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-3 py-1 rounded-full">
                            {scheme.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Typography */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Typography Styles</h3>
                  <div className="space-y-3">
                    {Object.entries(TYPOGRAPHY_PRESETS).map(([key, preset]) => {
                      const isSelected = postContent.titleFont === preset.title;
                      return (
                        <button
                          key={key}
                          onClick={() => handleTypographyChange(key)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-bold text-base capitalize mb-1 flex items-center justify-between">
                            <span>{key} Style</span>
                            {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                          </div>
                          <div className="text-sm text-gray-600">
                            {preset.title.split(',')[0]} + {preset.body.split(',')[0]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Background Image */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Image className="w-5 h-5 mr-2" />
                    Background Image
                  </h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl flex items-center justify-center transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Image className="w-5 h-5 mr-2" />
                      Upload Custom Background
                    </button>
                    
                    {postContent.backgroundImage && (
                      <button
                        onClick={() => handleContentChange('backgroundImage', '')}
                        className="w-full px-6 py-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl flex items-center justify-center transition-all font-semibold"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Remove Background Image
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

            {/* Enhanced Export Section */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-xl border border-green-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Ready to Share?
              </h3>
              <button
                onClick={downloadPost}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-xl flex items-center justify-center transition-all text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3" />
                    <span>Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6 mr-3" />
                    <span>Download High-Quality PNG</span>
                  </>
                )}
              </button>
              <div className="mt-3 flex items-center justify-center space-x-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  2x Resolution
                </span>
                <span className="flex items-center">
                  <Smartphone className="w-4 h-4 mr-1" />
                  Instagram Ready
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Print Quality
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Preview Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Eye className="w-6 h-6 mr-3 text-blue-600" />
                  Live Preview
                </h3>
                <div className="flex items-center space-x-3">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedTemplate.type === 'story' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedTemplate.type === 'story' ? '📱 Instagram Story' : '📷 Instagram Post'}
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full font-medium">
                    {selectedTemplate.width}×{selectedTemplate.height}px
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl">
                <div className="relative">
                  <div 
                    className="border-4 border-gray-200 rounded-2xl overflow-hidden shadow-2xl bg-white"
                    style={{
                      transform: selectedTemplate.type === 'story' 
                        ? 'scale(0.35)' 
                        : 'scale(0.5)',
                      transformOrigin: 'center center'
                    }}
                  >
                    <div ref={canvasRef}>
                      {renderPostContent()}
                    </div>
                  </div>
                  
                  {/* Enhanced format indicator */}
                  <div className={`absolute -top-3 -right-3 px-3 py-2 text-xs font-bold text-white rounded-full shadow-lg ${
                    selectedTemplate.type === 'story' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}>
                    {selectedTemplate.type === 'story' ? '📱 STORY' : '📷 POST'}
                  </div>
                  
                  {/* Template name indicator */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-full">
                    {selectedTemplate.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ImprovedSocialMediaGenerator;