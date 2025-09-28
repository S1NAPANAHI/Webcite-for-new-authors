import React, { useState, useRef } from 'react';
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
  Settings
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
  { id: 'all', name: 'All Templates', icon: Grid3X3, color: 'bg-gray-500' },
  { id: 'book-launch', name: 'Book Launch', icon: BookOpen, color: 'bg-blue-500' },
  { id: 'quote', name: 'Quotes', icon: MessageCircle, color: 'bg-purple-500' },
  { id: 'author', name: 'Author Spotlight', icon: User, color: 'bg-green-500' },
  { id: 'announcement', name: 'Announcements', icon: Megaphone, color: 'bg-red-500' },
  { id: 'behind-scenes', name: 'Behind the Scenes', icon: Camera, color: 'bg-yellow-500' }
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

export const EnhancedSocialMediaGenerator: React.FC = () => {
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
  const [activeTab, setActiveTab] = useState<'templates' | 'content' | 'design'>('templates');

  const filteredTemplates = selectedCategory === 'all' 
    ? ENHANCED_TEMPLATES 
    : ENHANCED_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleTemplateChange = (template: SocialTemplate) => {
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
  };

  const handleContentChange = (field: keyof PostContent, value: string) => {
    setPostContent(prev => ({ ...prev, [field]: value }));
  };

  const handleColorSchemeChange = (schemeName: string) => {
    const scheme = COLOR_SCHEMES[schemeName as keyof typeof COLOR_SCHEMES];
    if (scheme) {
      setPostContent(prev => ({
        ...prev,
        backgroundColor: scheme.background,
        textColor: scheme.text,
        accentColor: scheme.accent
      }));
    }
  };

  const handleTypographyChange = (presetName: string) => {
    const preset = TYPOGRAPHY_PRESETS[presetName as keyof typeof TYPOGRAPHY_PRESETS];
    if (preset) {
      setPostContent(prev => ({
        ...prev,
        titleFont: preset.title,
        bodyFont: preset.body
      }));
    }
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

      case 'vintage':
        return (
          <div style={{
            ...baseStyle,
            background: `${postContent.backgroundColor}, repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px)`,
          }}>
            {/* Ornamental borders */}
            <div style={{
              position: 'absolute',
              top: '25px',
              left: '25px',
              right: '25px',
              bottom: '25px',
              border: `4px double ${postContent.textColor}50`,
              borderRadius: '20px',
              pointerEvents: 'none'
            }} />
            
            <div style={{
              position: 'absolute',
              top: '45px',
              left: '45px',
              right: '45px',
              bottom: '45px',
              border: `1px solid ${postContent.textColor}25`,
              borderRadius: '15px',
              pointerEvents: 'none'
            }} />
            
            <div style={{ textAlign: 'center', maxWidth: '75%', zIndex: 2 }}>
              <div style={{ 
                fontSize: '50px',
                marginBottom: '25px',
                opacity: 0.7,
                fontFamily: 'serif'
              }}>
                ❦
              </div>
              
              <h1 style={{ 
                fontSize: '54px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '700',
                marginBottom: '30px',
                lineHeight: '1.2',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                {postContent.title}
              </h1>
              
              <div style={{ 
                fontSize: '35px',
                marginBottom: '35px',
                opacity: 0.5,
                fontFamily: 'serif',
                letterSpacing: '8px'
              }}>
                • • •
              </div>
              
              <p style={{ 
                fontSize: '30px',
                fontFamily: 'Crimson Text, serif',
                marginBottom: '30px',
                opacity: 0.9,
                lineHeight: '1.5',
                fontStyle: 'italic'
              }}>
                {postContent.subtitle}
              </p>
              
              <div style={{ 
                fontSize: '28px',
                marginBottom: '20px',
                opacity: 0.6,
                fontFamily: 'serif'
              }}>
                ❦
              </div>
              
              <p style={{ 
                fontSize: '28px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                {postContent.author}
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
              alignItems: 'center',
              gap: '50px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  width: '70px',
                  height: '5px',
                  background: postContent.accentColor,
                  marginBottom: '35px',
                  borderRadius: '3px'
                }} />
                
                <h1 style={{ 
                  fontSize: '58px',
                  fontFamily: postContent.titleFont,
                  fontWeight: 'bold',
                  marginBottom: '25px',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em'
                }}>
                  {postContent.title}
                </h1>
                
                <p style={{ 
                  fontSize: '28px',
                  fontFamily: postContent.bodyFont,
                  marginBottom: '30px',
                  opacity: 0.9,
                  lineHeight: '1.4'
                }}>
                  {postContent.subtitle}
                </p>
                
                <p style={{ 
                  fontSize: '24px',
                  fontFamily: postContent.titleFont,
                  opacity: 0.8,
                  fontWeight: '400',
                  letterSpacing: '0.05em'
                }}>
                  by {postContent.author}
                </p>
              </div>
              
              <div style={{ 
                flex: 1,
                height: '85%',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '55px',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <p style={{ 
                  fontSize: '36px',
                  fontFamily: postContent.bodyFont,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  lineHeight: '1.5',
                  fontWeight: '300'
                }}>
                  “{postContent.quote}”
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
              background: selectedTemplate.type === 'story' 
                ? 'linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.7))'
                : 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
              zIndex: 1
            }} />
            
            <div style={{ 
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              maxWidth: '90%'
            }}>
              <h1 style={{ 
                fontSize: selectedTemplate.type === 'story' ? '82px' : '68px',
                fontFamily: postContent.titleFont,
                fontWeight: 'bold',
                marginBottom: selectedTemplate.type === 'story' ? '60px' : '45px',
                lineHeight: '1.1',
                textShadow: '3px 3px 8px rgba(0,0,0,0.6)',
                letterSpacing: '-0.02em'
              }}>
                {postContent.title}
              </h1>
              
              <p style={{ 
                fontSize: selectedTemplate.type === 'story' ? '42px' : '38px',
                fontFamily: postContent.bodyFont,
                fontStyle: 'italic',
                lineHeight: '1.5',
                marginBottom: '45px',
                textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
                fontWeight: '300'
              }}>
                “{postContent.quote}”
              </p>
              
              <p style={{ 
                fontSize: selectedTemplate.type === 'story' ? '32px' : '28px',
                fontFamily: postContent.titleFont,
                textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                fontWeight: '600'
              }}>
                — {postContent.author}
              </p>
              
              {selectedTemplate.type === 'story' && (
                <div style={{ 
                  position: 'absolute',
                  bottom: '-250px',
                  left: 0,
                  right: 0,
                  fontSize: '28px',
                  fontFamily: postContent.titleFont,
                  opacity: 0.9,
                  textShadow: '1px 1px 3px rgba(0,0,0,0.6)'
                }}>
                  {postContent.hashtags}
                </div>
              )}
            </div>
          </div>
        );

      default: // minimal and centered
        return (
          <div style={baseStyle}>
            <div style={{ textAlign: 'center', maxWidth: '85%' }}>
              {selectedTemplate.layout === 'centered' && (
                <div style={{
                  position: 'absolute',
                  top: '35px',
                  left: '35px',
                  fontSize: '140px',
                  fontFamily: 'serif',
                  opacity: 0.08,
                  lineHeight: '1',
                  pointerEvents: 'none'
                }}>
                  “
                </div>
              )}
              
              <h1 style={{ 
                fontSize: '66px',
                fontFamily: postContent.titleFont,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '25px',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}>
                {postContent.title}
              </h1>
              
              <div style={{
                width: '80px',
                height: '3px',
                background: postContent.accentColor,
                margin: '30px auto',
                borderRadius: '2px'
              }} />
              
              <p style={{ 
                fontSize: '30px',
                fontFamily: postContent.bodyFont,
                textAlign: 'center',
                opacity: 0.9,
                marginBottom: '35px',
                lineHeight: '1.4'
              }}>
                {postContent.subtitle}
              </p>
              
              <p style={{ 
                fontSize: '26px',
                fontFamily: postContent.titleFont,
                textAlign: 'center',
                opacity: 0.8,
                fontWeight: '400',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Social Media Post Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Create professional Instagram posts and stories in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Control Panel */}
          <div className="xl:col-span-1 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-2">
              <div className="flex space-x-1">
                {[
                  { id: 'templates', icon: Grid3X3, label: 'Templates' },
                  { id: 'content', icon: Type, label: 'Content' },
                  { id: 'design', icon: Settings, label: 'Design' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-6">
                {/* Template Categories */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TEMPLATE_CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`p-3 rounded-lg border-2 text-xs font-medium transition-all flex flex-col items-center ${
                            selectedCategory === category.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <IconComponent className="w-5 h-5 mb-1" />
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Template Selection */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Templates</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateChange(template)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selectedTemplate.id === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {template.type === 'story' ? (
                              <Smartphone className="w-4 h-4 mr-2 text-gray-500" />
                            ) : (
                              <Monitor className="w-4 h-4 mr-2 text-gray-500" />
                            )}
                            <span className="font-semibold text-sm">{template.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {template.width}×{template.height}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {template.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Type className="w-5 h-5 mr-2" />
                  Content Editor
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Book Title
                    </label>
                    <input
                      type="text"
                      value={postContent.title}
                      onChange={(e) => handleContentChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your book title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle/Tagline
                    </label>
                    <input
                      type="text"
                      value={postContent.subtitle}
                      onChange={(e) => handleContentChange('subtitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="A compelling subtitle"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={postContent.author}
                      onChange={(e) => handleContentChange('author', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your name or pen name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Quote
                    </label>
                    <textarea
                      value={postContent.quote}
                      onChange={(e) => handleContentChange('quote', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="An inspiring quote from your book"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hashtags
                    </label>
                    <input
                      type="text"
                      value={postContent.hashtags}
                      onChange={(e) => handleContentChange('hashtags', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#newbook #author #fantasy"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Design Tab */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                {/* Color Schemes */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Color Schemes
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                      <button
                        key={key}
                        onClick={() => handleColorSchemeChange(key)}
                        className="group relative h-16 rounded-xl shadow-md border-2 border-gray-200 hover:border-gray-400 transition-all overflow-hidden"
                        style={{ background: scheme.background }}
                        title={scheme.name}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                          <span className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            {scheme.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Typography */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Typography</h3>
                  <div className="space-y-3">
                    {Object.entries(TYPOGRAPHY_PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => handleTypographyChange(key)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          postContent.titleFont === preset.title
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-semibold text-sm capitalize mb-1">{key}</div>
                        <div className="text-xs text-gray-500">
                          {preset.title.split(',')[0]} + {preset.body.split(',')[0]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Image */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Image className="w-5 h-5 mr-2" />
                    Background
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg flex items-center justify-center transition-all font-medium"
                    >
                      <Image className="w-5 h-5 mr-2" />
                      Upload Background Image
                    </button>
                    
                    {postContent.backgroundImage && (
                      <button
                        onClick={() => handleContentChange('backgroundImage', '')}
                        className="w-full px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center justify-center transition-colors font-medium"
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

            {/* Download Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Export
              </h3>
              <button
                onClick={downloadPost}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center transition-all text-lg shadow-lg"
              >
                <Download className="w-6 h-6 mr-3" />
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Generating...
                  </>
                ) : (
                  'Download High-Quality PNG'
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                2x resolution • Instagram ready
              </p>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <Eye className="w-6 h-6 mr-2 text-blue-600" />
                  Live Preview
                </h3>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {selectedTemplate.name} • {selectedTemplate.width}×{selectedTemplate.height}px
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="relative">
                  <div 
                    className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-2xl"
                    style={{
                      transform: selectedTemplate.type === 'story' 
                        ? 'scale(0.28)' 
                        : 'scale(0.45)',
                      transformOrigin: 'top center'
                    }}
                  >
                    <div ref={canvasRef}>
                      {renderPostContent()}
                    </div>
                  </div>
                  
                  {/* Format indicator */}
                  <div className={`absolute -top-2 -right-2 px-2 py-1 text-xs font-bold text-white rounded-full ${
                    selectedTemplate.type === 'story' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}>
                    {selectedTemplate.type === 'story' ? 'STORY' : 'POST'}
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