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
  Star,
  Crop,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Save,
  X
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

interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  opacity: number;
  scale: number;
  positionX: number;
  positionY: number;
  rotation: number;
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

export const OptimizedSocialMediaGenerator: React.FC = () => {
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
  
  const [imageAdjustments, setImageAdjustments] = useState<ImageAdjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    opacity: 100,
    scale: 100,
    positionX: 50,
    positionY: 50,
    rotation: 0
  });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'templates' | 'content' | 'design'>('templates');
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.15); // FIXED: Reduced default scale from 0.25 to 0.15

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
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image too large. Please select an image under 10MB.');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPostContent(prev => ({
          ...prev,
          backgroundImage: e.target?.result as string
        }));
        setShowImageEditor(true);
        // Reset adjustments when new image is uploaded
        setImageAdjustments({
          brightness: 100,
          contrast: 100,
          saturation: 100,
          blur: 0,
          opacity: 100,
          scale: 100,
          positionX: 50,
          positionY: 50,
          rotation: 0
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageAdjustment = useCallback((property: keyof ImageAdjustments, value: number) => {
    setImageAdjustments(prev => ({ ...prev, [property]: value }));
  }, []);

  const resetImageAdjustments = useCallback(() => {
    setImageAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      opacity: 100,
      scale: 100,
      positionX: 50,
      positionY: 50,
      rotation: 0
    });
  }, []);

  const copyHashtags = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(postContent.hashtags);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = postContent.hashtags;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [postContent.hashtags]);

  const downloadPost = async () => {
    if (!canvasRef.current) {
      alert('Preview not ready. Please wait and try again.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Temporarily hide any UI elements that shouldn't be in the export
      const canvas = await html2canvas(canvasRef.current, {
        width: selectedTemplate.width,
        height: selectedTemplate.height,
        scale: 3, // Higher resolution for better quality
        useCORS: true,
        backgroundColor: null,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true,
        imageTimeout: 15000,
        removeContainer: true
      });
      
      // Create high-quality image
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.download = `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      alert('✅ High-quality image downloaded successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      alert('❌ Error generating image. Please try again or use a different browser.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getImageStyle = useCallback(() => {
    if (!postContent.backgroundImage) return {};
    
    const {
      brightness,
      contrast,
      saturation,
      blur,
      opacity,
      scale,
      positionX,
      positionY,
      rotation
    } = imageAdjustments;
    
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
      opacity: opacity / 100,
      transform: `scale(${scale / 100}) translate(${(positionX - 50) * 2}%, ${(positionY - 50) * 2}%) rotate(${rotation}deg)`,
      transformOrigin: 'center center'
    };
  }, [imageAdjustments, postContent.backgroundImage]);

  const renderPostContent = () => {
    const baseStyle: React.CSSProperties = {
      width: selectedTemplate.width,
      height: selectedTemplate.height,
      background: postContent.backgroundImage 
        ? 'transparent'
        : postContent.backgroundColor,
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

    const backgroundImageStyle = postContent.backgroundImage ? {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url(${postContent.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 0,
      ...getImageStyle()
    } : {};

    const overlayStyle = postContent.backgroundImage ? {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))',
      zIndex: 1
    } : {};

    const contentStyle = {
      position: 'relative' as const,
      zIndex: 2,
      textAlign: 'center' as const,
      maxWidth: '90%'
    };

    // Enhanced layouts with better typography and spacing
    switch (selectedTemplate.layout) {
      case 'modern':
        return (
          <div style={baseStyle}>
            {postContent.backgroundImage && <div style={backgroundImageStyle} />}
            {postContent.backgroundImage && <div style={overlayStyle} />}
            <div style={contentStyle}>
              <div style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: `${postContent.accentColor}40`,
                borderRadius: '25px',
                fontSize: Math.min(16, selectedTemplate.width / 60) + 'px',
                fontWeight: '700',
                marginBottom: '24px',
                border: `2px solid ${postContent.accentColor}60`,
                backdropFilter: 'blur(10px)'
              }}>
                NEW RELEASE
              </div>
              
              <h1 style={{ 
                fontSize: Math.min(52, selectedTemplate.width / 18) + 'px',
                fontWeight: '900',
                marginBottom: '20px',
                lineHeight: '1.1',
                textShadow: postContent.backgroundImage ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
                wordBreak: 'break-word' as const
              }}>
                {postContent.title}
              </h1>
              
              <p style={{ 
                fontSize: Math.min(28, selectedTemplate.width / 35) + 'px',
                marginBottom: '24px',
                opacity: 0.95,
                lineHeight: '1.3',
                fontWeight: '500',
                textShadow: postContent.backgroundImage ? '1px 1px 2px rgba(0,0,0,0.6)' : 'none'
              }}>
                {postContent.subtitle}
              </p>
              
              <p style={{ 
                fontSize: Math.min(22, selectedTemplate.width / 45) + 'px',
                fontWeight: '600',
                textShadow: postContent.backgroundImage ? '1px 1px 2px rgba(0,0,0,0.6)' : 'none'
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
            gap: '40px',
            alignItems: 'center' as const
          }}>
            {postContent.backgroundImage && <div style={backgroundImageStyle} />}
            {postContent.backgroundImage && <div style={overlayStyle} />}
            
            <div style={{ flex: 1, maxWidth: '50%', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: '80px',
                height: '6px',
                background: postContent.accentColor,
                marginBottom: '24px',
                borderRadius: '3px'
              }} />
              
              <h1 style={{ 
                fontSize: Math.min(46, selectedTemplate.width / 22) + 'px',
                fontWeight: '800',
                marginBottom: '20px',
                lineHeight: '1.1',
                textShadow: postContent.backgroundImage ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
                wordBreak: 'break-word' as const
              }}>
                {postContent.title}
              </h1>
              
              <p style={{ 
                fontSize: Math.min(24, selectedTemplate.width / 40) + 'px',
                marginBottom: '20px',
                opacity: 0.9,
                lineHeight: '1.3',
                textShadow: postContent.backgroundImage ? '1px 1px 2px rgba(0,0,0,0.6)' : 'none'
              }}>
                {postContent.subtitle}
              </p>
              
              <p style={{ 
                fontSize: Math.min(20, selectedTemplate.width / 50) + 'px',
                opacity: 0.85,
                fontWeight: '600',
                textShadow: postContent.backgroundImage ? '1px 1px 2px rgba(0,0,0,0.6)' : 'none'
              }}>
                by {postContent.author}
              </p>
            </div>
            
            <div style={{ 
              flex: 1,
              maxWidth: '50%',
              height: '75%',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '36px',
              backdropFilter: 'blur(15px)',
              border: '2px solid rgba(255,255,255,0.2)',
              position: 'relative',
              zIndex: 2
            }}>
              <p style={{ 
                fontSize: Math.min(26, selectedTemplate.width / 40) + 'px',
                fontStyle: 'italic',
                textAlign: 'center' as const,
                lineHeight: '1.4',
                fontWeight: '500',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
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
            {postContent.backgroundImage && <div style={backgroundImageStyle} />}
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: postContent.backgroundImage 
                ? 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.7))'
                : 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.2))',
              zIndex: 1
            }} />
            
            <div style={contentStyle}>
              <h1 style={{ 
                fontSize: Math.min(60, selectedTemplate.width / 16) + 'px',
                fontWeight: '900',
                marginBottom: '28px',
                lineHeight: '1.1',
                textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                wordBreak: 'break-word' as const
              }}>
                {postContent.title}
              </h1>
              
              <p style={{ 
                fontSize: Math.min(32, selectedTemplate.width / 30) + 'px',
                fontStyle: 'italic',
                lineHeight: '1.4',
                marginBottom: '24px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                fontWeight: '400',
                wordBreak: 'break-word' as const
              }}>
                "{postContent.quote}"
              </p>
              
              <p style={{ 
                fontSize: Math.min(26, selectedTemplate.width / 40) + 'px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                fontWeight: '700'
              }}>
                — {postContent.author}
              </p>
            </div>
          </div>
        );

      default: // minimal
        return (
          <div style={baseStyle}>
            {postContent.backgroundImage && <div style={backgroundImageStyle} />}
            {postContent.backgroundImage && <div style={overlayStyle} />}
            <div style={contentStyle}>
              <h1 style={{ 
                fontSize: Math.min(56, selectedTemplate.width / 18) + 'px',
                fontWeight: '800',
                marginBottom: '24px',
                lineHeight: '1.1',
                textShadow: postContent.backgroundImage ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
                wordBreak: 'break-word' as const
              }}>
                {postContent.title}
              </h1>
              
              <div style={{
                width: '100px',
                height: '4px',
                background: postContent.accentColor,
                margin: '24px auto',
                borderRadius: '2px'
              }} />
              
              <p style={{ 
                fontSize: Math.min(30, selectedTemplate.width / 35) + 'px',
                marginBottom: '24px',
                opacity: 0.9,
                lineHeight: '1.3',
                fontWeight: '500',
                textShadow: postContent.backgroundImage ? '1px 1px 2px rgba(0,0,0,0.6)' : 'none'
              }}>
                {postContent.subtitle}
              </p>
              
              <p style={{ 
                fontSize: Math.min(24, selectedTemplate.width / 45) + 'px',
                opacity: 0.85,
                fontWeight: '600',
                textShadow: postContent.backgroundImage ? '1px 1px 2px rgba(0,0,0,0.6)' : 'none'
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
          <div className="flex items-center justify-between">
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
            
            {/* Preview Scale Control */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Preview Size:</span>
              <button
                onClick={() => setPreviewScale(Math.max(0.1, previewScale - 0.05))} // FIXED: Updated min scale to 0.1
                className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale(Math.min(0.5, previewScale + 0.05))} // FIXED: Updated max scale to 0.5
                className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Changed from xl:grid-cols-4 to lg:grid-cols-3 for better balance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel - Now gets 2/3 of the space */}
          <div className="lg:col-span-2 space-y-4">
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
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50'
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          onClick={() => setSelectedCategory(category.id)}
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
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredTemplates.map((template) => {
                      const isSelected = selectedTemplate.id === template.id;
                      return (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateChange(template)}
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
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Content Editor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📚 Book Title
                    </label>
                    <input
                      type="text"
                      value={postContent.title}
                      onChange={(e) => handleContentChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Your book title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ✨ Subtitle
                    </label>
                    <input
                      type="text"
                      value={postContent.subtitle}
                      onChange={(e) => handleContentChange('subtitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                      <span>🏷️ Hashtags</span>
                      <button
                        onClick={copyHashtags}
                        className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 flex items-center transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </label>
                    <input
                      type="text"
                      value={postContent.hashtags}
                      onChange={(e) => handleContentChange('hashtags', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="#newbook #author #fantasy"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💬 Featured Quote
                    </label>
                    <textarea
                      value={postContent.quote}
                      onChange={(e) => handleContentChange('quote', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="An inspiring quote..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Design Section */}
            {activeSection === 'design' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Background Image</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all font-medium text-sm"
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Upload Background
                    </button>
                    
                    {postContent.backgroundImage && (
                      <div className="space-y-2">
                        <button
                          onClick={() => setShowImageEditor(!showImageEditor)}
                          className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center transition-colors font-medium text-sm"
                        >
                          <Crop className="w-4 h-4 mr-2" />
                          {showImageEditor ? 'Hide' : 'Show'} Image Editor
                        </button>
                        
                        <button
                          onClick={() => {
                            handleContentChange('backgroundImage', '');
                            setShowImageEditor(false);
                          }}
                          className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center justify-center transition-colors font-medium text-sm"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Remove Background
                        </button>
                      </div>
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

                {/* Image Editor */}
                {showImageEditor && postContent.backgroundImage && (
                  <div className="md:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">Image Adjustments</h3>
                      <div className="flex space-x-1">
                        <button
                          onClick={resetImageAdjustments}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Reset adjustments"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowImageEditor(false)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Close editor"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Brightness */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          ☀️ Brightness: {imageAdjustments.brightness}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={imageAdjustments.brightness}
                          onChange={(e) => handleImageAdjustment('brightness', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      {/* Contrast */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          🎨 Contrast: {imageAdjustments.contrast}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={imageAdjustments.contrast}
                          onChange={(e) => handleImageAdjustment('contrast', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      {/* Saturation */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          🌈 Saturation: {imageAdjustments.saturation}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={imageAdjustments.saturation}
                          onChange={(e) => handleImageAdjustment('saturation', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      {/* Scale */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          🔍 Scale: {imageAdjustments.scale}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={imageAdjustments.scale}
                          onChange={(e) => handleImageAdjustment('scale', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      {/* Position X */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          ↔️ Position X: {imageAdjustments.positionX}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={imageAdjustments.positionX}
                          onChange={(e) => handleImageAdjustment('positionX', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      {/* Position Y */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          ↕️ Position Y: {imageAdjustments.positionY}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={imageAdjustments.positionY}
                          onChange={(e) => handleImageAdjustment('positionY', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      {/* Opacity */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          💧 Opacity: {imageAdjustments.opacity}%
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={imageAdjustments.opacity}
                          onChange={(e) => handleImageAdjustment('opacity', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Download Section */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg border border-green-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Export</h3>
              <button
                onClick={downloadPost}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center transition-all shadow-lg text-base"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                    <span>Creating High-Quality Image...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-3" />
                    <span>Download High-Quality PNG</span>
                  </>
                )}
              </button>
              
              <div className="mt-3 text-sm text-gray-600 text-center">
                💎 3x resolution • Instagram ready • Professional quality
              </div>
            </div>
          </div>

          {/* Preview Panel - Now only gets 1/3 of the space - FIXED: Sticky container with max height and overflow */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 max-h-96 overflow-auto"> {/* FIXED: Added max-h-96 overflow-auto */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Eye className="w-4 h-4 mr-2 text-blue-600" />
                    Preview
                  </h3>
                  <div className="flex flex-col items-end space-y-1">
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
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
                
                {/* FIXED: Canvas Container with max height */}
                <div className="max-h-80 overflow-hidden rounded-lg border"> {/* FIXED: Added max-h-80 overflow-hidden */}
                  <div className="flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                    <div className="relative">
                      <div 
                        className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white"
                        style={{
                          transform: `scale(${previewScale})`,
                          transformOrigin: 'center center'
                        }}
                      >
                        <div ref={canvasRef}>
                          {renderPostContent()}
                        </div>
                      </div>
                      
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded font-semibold whitespace-nowrap">
                        {selectedTemplate.name}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quality indicators */}
                <div className="mt-4 flex justify-center space-x-3 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Live preview
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                    3x export
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

export default OptimizedSocialMediaGenerator;