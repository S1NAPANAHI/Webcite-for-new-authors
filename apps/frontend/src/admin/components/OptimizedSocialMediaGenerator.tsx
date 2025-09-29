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
  X,
  ChevronRight,
  Play
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
  const [currentStep, setCurrentStep] = useState(1);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.35);

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
      if (file.size > 10 * 1024 * 1024) {
        alert('Image too large. Please select an image under 10MB.');
        return;
      }
      
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
      const canvas = await html2canvas(canvasRef.current, {
        width: selectedTemplate.width,
        height: selectedTemplate.height,
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true,
        imageTimeout: 15000,
        removeContainer: true
      });
      
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.download = `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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

  const steps = [
    { id: 1, title: 'Choose Template', icon: Grid3X3, description: 'Select a design that fits your content' },
    { id: 2, title: 'Add Content', icon: Type, description: 'Customize text, images, and details' },
    { id: 3, title: 'Customize Style', icon: Palette, description: 'Adjust colors and visual elements' },
    { id: 4, title: 'Export & Share', icon: Download, description: 'Download your high-quality image' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Social Media Studio
                </h1>
                <p className="text-gray-600 text-sm">
                  Create stunning Instagram posts in minutes
                </p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="hidden lg:flex items-center space-x-1 bg-gray-100 rounded-full p-1">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <step.icon className="w-4 h-4 mr-2" />
                    <span className="hidden xl:inline">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Panel - Controls */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Step 1: Template Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Categories */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Grid3X3 className="w-5 h-5 mr-2 text-blue-600" />
                    Choose Category
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TEMPLATE_CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      const isSelected = selectedCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`group relative p-4 rounded-xl border-2 text-sm font-semibold transition-all transform hover:scale-105 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`p-2 rounded-lg ${
                              isSelected ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <span className="text-center text-xs">{category.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Templates */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                      Templates ({filteredTemplates.length})
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {filteredTemplates.map((template) => {
                      const isSelected = selectedTemplate.id === template.id;
                      return (
                        <button
                          key={template.id}
                          onClick={() => {
                            handleTemplateChange(template);
                            setCurrentStep(2);
                          }}
                          className={`group relative p-4 rounded-xl border-2 text-left transition-all transform hover:scale-102 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                {template.type === 'story' ? (
                                  <Smartphone className="w-4 h-4 mr-2 text-purple-500" />
                                ) : (
                                  <Monitor className="w-4 h-4 mr-2 text-blue-500" />
                                )}
                                <span className="font-semibold text-sm text-gray-900">{template.name}</span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                              <div className="flex items-center text-xs text-gray-500">
                                <span>{template.width}×{template.height}px</span>
                                <span className="mx-2">•</span>
                                <span className="capitalize">{template.layout} layout</span>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="ml-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Content */}
            {currentStep === 2 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Type className="w-5 h-5 mr-2 text-blue-600" />
                    Customize Content
                  </h2>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📚 Book Title
                      </label>
                      <input
                        type="text"
                        value={postContent.title}
                        onChange={(e) => handleContentChange('title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/50 backdrop-blur-sm"
                        placeholder="Your amazing book title"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/50 backdrop-blur-sm"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/50 backdrop-blur-sm"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                        <span>💬 Featured Quote</span>
                      </label>
                      <textarea
                        value={postContent.quote}
                        onChange={(e) => handleContentChange('quote', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/50 backdrop-blur-sm"
                        placeholder="An inspiring quote from your book..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                        <span>🏷️ Hashtags</span>
                        <button
                          onClick={copyHashtags}
                          className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 flex items-center transition-colors"
                        >
                          {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </label>
                      <input
                        type="text"
                        value={postContent.hashtags}
                        onChange={(e) => handleContentChange('hashtags', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/50 backdrop-blur-sm"
                        placeholder="#newbook #author #fantasy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Design */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Palette className="w-5 h-5 mr-2 text-blue-600" />
                      Style & Design
                    </h2>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Color Schemes */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">🎨 Color Schemes</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                          <button
                            key={key}
                            onClick={() => handleColorSchemeChange(key)}
                            className="group relative h-16 rounded-xl shadow-lg border-2 border-gray-200 hover:border-gray-400 transition-all transform hover:scale-105"
                            style={{ background: scheme.background }}
                            title={scheme.name}
                          >
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center rounded-xl">
                              <span className="text-white font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                                {scheme.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Background Image */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">🖼️ Background</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl flex items-center justify-center transition-all font-medium text-sm transform hover:scale-105 shadow-lg"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          Upload Background Image
                        </button>
                        
                        {postContent.backgroundImage && (
                          <div className="space-y-2">
                            <button
                              onClick={() => setShowImageEditor(!showImageEditor)}
                              className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl flex items-center justify-center transition-colors font-medium text-sm"
                            >
                              <Crop className="w-4 h-4 mr-2" />
                              {showImageEditor ? 'Hide' : 'Edit'} Image
                            </button>
                            
                            <button
                              onClick={() => {
                                handleContentChange('backgroundImage', '');
                                setShowImageEditor(false);
                              }}
                              className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl flex items-center justify-center transition-colors font-medium text-sm"
                            >
                              <X className="w-4 h-4 mr-2" />
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
                  </div>
                </div>

                {/* Image Editor */}
                {showImageEditor && postContent.backgroundImage && (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">🖼️ Image Adjustments</h3>
                      <div className="flex space-x-2">
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
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
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
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
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
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
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
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
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
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Export */}
            {currentStep === 4 && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-xl border border-green-200/50 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Export!</h2>
                  <p className="text-gray-600 mb-6">Your social media post is ready. Download it as a high-quality PNG image.</p>
                  
                  <button
                    onClick={downloadPost}
                    disabled={isGenerating}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all shadow-lg text-lg transform hover:scale-105"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                        <span>Creating High-Quality Image...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-6 h-6 mr-3" />
                        <span>Download PNG (3x Quality)</span>
                      </>
                    )}
                  </button>
                  
                  <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Instagram Ready
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      High Resolution
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      Professional Quality
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Live Preview */}
          <div className="xl:col-span-2">
            <div className="sticky top-24">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                    Live Preview
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedTemplate.type === 'story' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedTemplate.type === 'story' ? '📱 Story' : '📷 Post'}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setPreviewScale(Math.max(0.2, previewScale - 0.05))}
                        className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {Math.round(previewScale * 100)}%
                      </span>
                      <button
                        onClick={() => setPreviewScale(Math.min(0.6, previewScale + 0.05))}
                        className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 flex items-center justify-center min-h-96">
                  <div className="relative">
                    <div 
                      className="border-4 border-white rounded-2xl overflow-hidden shadow-2xl bg-white"
                      style={{
                        transform: `scale(${previewScale})`,
                        transformOrigin: 'center center'
                      }}
                    >
                      <div ref={canvasRef}>
                        {renderPostContent()}
                      </div>
                    </div>
                    
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-full font-semibold whitespace-nowrap">
                      {selectedTemplate.name}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg inline-block">
                    {selectedTemplate.width} × {selectedTemplate.height} pixels
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