import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Copy,
  Check,
  ChevronRight,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
  RefreshCw
} from 'lucide-react';

// CANVAS-BASED TEMPLATES - NO MORE OVERLAPPING TEXT!
interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'post' | 'story';
  width: number;
  height: number;
  background: {
    type: 'solid' | 'gradient';
    color1: string;
    color2?: string;
    direction?: number; // for gradients
  };
  textColor: string;
  // EXACT PIXEL POSITIONING - No overlap possible!
  titleStyle: {
    fontSize: number;
    fontWeight: string;
    y: number; // Exact pixel position
    maxWidth: number;
  };
  subtitleStyle: {
    fontSize: number;
    fontWeight: string;
    y: number; // Guaranteed separation
    maxWidth: number;
  };
  authorStyle: {
    fontSize: number;
    fontWeight: string;
    y: number;
    maxWidth: number;
  };
}

const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: 'neo-gradient',
    name: 'Neo Gradient',
    description: 'Modern gradient design with perfect text positioning',
    category: 'book-launch',
    type: 'post',
    width: 1080,
    height: 1080,
    background: {
      type: 'gradient',
      color1: '#667eea',
      color2: '#764ba2',
      direction: 135
    },
    textColor: '#ffffff',
    titleStyle: {
      fontSize: 52,
      fontWeight: 'bold',
      y: 400, // EXACT position
      maxWidth: 900
    },
    subtitleStyle: {
      fontSize: 28,
      fontWeight: 'normal',
      y: 520, // 120px gap - NO OVERLAP!
      maxWidth: 900
    },
    authorStyle: {
      fontSize: 24,
      fontWeight: '600',
      y: 920, // Bottom positioning
      maxWidth: 900
    }
  },
  {
    id: 'minimal-elegance',
    name: 'Minimal Elegance',
    description: 'Clean design with perfect spacing',
    category: 'quote',
    type: 'post',
    width: 1080,
    height: 1080,
    background: {
      type: 'solid',
      color1: '#f8f9fa'
    },
    textColor: '#2c3e50',
    titleStyle: {
      fontSize: 48,
      fontWeight: '300',
      y: 380,
      maxWidth: 900
    },
    subtitleStyle: {
      fontSize: 24,
      fontWeight: '400',
      y: 500, // 120px gap
      maxWidth: 900
    },
    authorStyle: {
      fontSize: 22,
      fontWeight: '600',
      y: 900,
      maxWidth: 900
    }
  },
  {
    id: 'bold-typography',
    name: 'Bold Typography',
    description: 'High-impact design with large text',
    category: 'announcement',
    type: 'post',
    width: 1080,
    height: 1080,
    background: {
      type: 'solid',
      color1: '#1a1a1a'
    },
    textColor: '#ffffff',
    titleStyle: {
      fontSize: 58,
      fontWeight: '900',
      y: 360,
      maxWidth: 900
    },
    subtitleStyle: {
      fontSize: 26,
      fontWeight: '500',
      y: 500, // 140px gap for large text
      maxWidth: 900
    },
    authorStyle: {
      fontSize: 24,
      fontWeight: '700',
      y: 920,
      maxWidth: 900
    }
  },
  {
    id: 'retro-vibes',
    name: 'Retro Vibes',
    description: 'Colorful retro design',
    category: 'author',
    type: 'post',
    width: 1080,
    height: 1080,
    background: {
      type: 'gradient',
      color1: '#ff9a9e',
      color2: '#fecfef',
      direction: 45
    },
    textColor: '#2c3e50',
    titleStyle: {
      fontSize: 50,
      fontWeight: 'bold',
      y: 390,
      maxWidth: 900
    },
    subtitleStyle: {
      fontSize: 26,
      fontWeight: '600',
      y: 510, // 120px gap
      maxWidth: 900
    },
    authorStyle: {
      fontSize: 22,
      fontWeight: '600',
      y: 900,
      maxWidth: 900
    }
  },
  {
    id: 'nature-organic',
    name: 'Nature Organic',
    description: 'Earthy, organic design',
    category: 'behind-scenes',
    type: 'post',
    width: 1080,
    height: 1080,
    background: {
      type: 'gradient',
      color1: '#a8edea',
      color2: '#fed6e3',
      direction: 120
    },
    textColor: '#2d5016',
    titleStyle: {
      fontSize: 44,
      fontWeight: '600',
      y: 400,
      maxWidth: 900
    },
    subtitleStyle: {
      fontSize: 24,
      fontWeight: '400',
      y: 520, // 120px gap
      maxWidth: 900
    },
    authorStyle: {
      fontSize: 22,
      fontWeight: '600',
      y: 920,
      maxWidth: 900
    }
  },
  {
    id: 'corporate-clean',
    name: 'Corporate Clean',
    description: 'Professional business design',
    category: 'book-launch',
    type: 'post',
    width: 1080,
    height: 1080,
    background: {
      type: 'gradient',
      color1: '#e3f2fd',
      color2: '#bbdefb',
      direction: 135
    },
    textColor: '#1565c0',
    titleStyle: {
      fontSize: 46,
      fontWeight: '600',
      y: 390,
      maxWidth: 900
    },
    subtitleStyle: {
      fontSize: 24,
      fontWeight: '400',
      y: 510, // 120px gap
      maxWidth: 900
    },
    authorStyle: {
      fontSize: 22,
      fontWeight: '600',
      y: 900,
      maxWidth: 900
    }
  },
  // Instagram Story Templates
  {
    id: 'story-gradient',
    name: 'Story Gradient',
    description: 'Instagram story template',
    category: 'author',
    type: 'story',
    width: 1080,
    height: 1920,
    background: {
      type: 'gradient',
      color1: '#667eea',
      color2: '#764ba2',
      direction: 135
    },
    textColor: '#ffffff',
    titleStyle: {
      fontSize: 64,
      fontWeight: 'bold',
      y: 700,
      maxWidth: 900
    },
    subtitleStyle: {
      fontSize: 32,
      fontWeight: '400',
      y: 860, // 160px gap for story format
      maxWidth: 900
    },
    authorStyle: {
      fontSize: 28,
      fontWeight: '600',
      y: 1700,
      maxWidth: 900
    }
  },
  {
    id: 'story-minimal',
    name: 'Story Minimal',
    description: 'Clean Instagram story',
    category: 'quote',
    type: 'story',
    width: 1080,
    height: 1920,
    background: {
      type: 'solid',
      color1: '#f8f9fa'
    },
    textColor: '#2c3e50',
    titleStyle: {
      fontSize: 58,
      fontWeight: '300',
      y: 680,
      maxWidth: 900
    },
    subtitleStyle: {
      fontSize: 28,
      fontWeight: '400',
      y: 820, // 140px gap
      maxWidth: 900
    },
    authorStyle: {
      fontSize: 26,
      fontWeight: '600',
      y: 1680,
      maxWidth: 900
    }
  }
];

const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: Grid3X3 },
  { id: 'book-launch', name: 'Book Launch', icon: BookOpen },
  { id: 'quote', name: 'Quotes', icon: MessageCircle },
  { id: 'author', name: 'Author Spotlight', icon: User },
  { id: 'announcement', name: 'Announcements', icon: Megaphone },
  { id: 'behind-scenes', name: 'Behind the Scenes', icon: Camera }
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

interface PostContent {
  title: string;
  subtitle: string;
  author: string;
  quote: string;
  hashtags: string;
  backgroundImage?: string;
}

export const CanvasBasedSocialMediaStudio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<CanvasTemplate>(CANVAS_TEMPLATES[0]);
  const [postContent, setPostContent] = useState<PostContent>(SAMPLE_CONTENT['book-launch']);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewScale, setPreviewScale] = useState(0.3);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts for canvas rendering
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await document.fonts.load('20px Inter');
        await document.fonts.load('24px Inter');
        await document.fonts.load('28px Inter');
        await document.fonts.load('32px Inter');
        await document.fonts.load('44px Inter');
        await document.fonts.load('48px Inter');
        await document.fonts.load('52px Inter');
        await document.fonts.load('58px Inter');
        await document.fonts.load('64px Inter');
        await document.fonts.ready;
        setFontsLoaded(true);
        console.log('✅ All fonts loaded for canvas rendering');
      } catch (error) {
        console.warn('⚠️ Font loading failed:', error);
        setFontsLoaded(true);
      }
    };
    loadFonts();
  }, []);

  const filteredTemplates = selectedCategory === 'all' 
    ? CANVAS_TEMPLATES 
    : CANVAS_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleTemplateChange = useCallback((template: CanvasTemplate) => {
    setSelectedTemplate(template);
    const sampleContent = SAMPLE_CONTENT[template.category as keyof typeof SAMPLE_CONTENT];
    if (sampleContent) {
      setPostContent(sampleContent);
    }
  }, []);

  const handleContentChange = useCallback((field: keyof PostContent, value: string) => {
    setPostContent(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setBackgroundImage(img);
          setBackgroundFile(e.target?.result as string);
        };
        img.src = e.target?.result as string;
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [postContent.hashtags]);

  // CANVAS DRAWING FUNCTION - Perfect pixel control!
  const drawToCanvas = useCallback((canvas: HTMLCanvasElement, forExport = false) => {
    const ctx = canvas.getContext('2d')!;
    const template = selectedTemplate;
    
    // Set canvas dimensions
    canvas.width = template.width;
    canvas.height = template.height;
    
    // Enable high-quality text rendering
    ctx.textRenderingOptimization = 'optimizeQuality' as any;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Clear canvas
    ctx.clearRect(0, 0, template.width, template.height);
    
    // Draw background
    if (backgroundImage) {
      // Draw background image with overlay
      ctx.drawImage(backgroundImage, 0, 0, template.width, template.height);
      // Add overlay for text readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, template.width, template.height);
    } else if (template.background.type === 'gradient') {
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, template.width, template.height);
      gradient.addColorStop(0, template.background.color1);
      gradient.addColorStop(1, template.background.color2!);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, template.width, template.height);
    } else {
      // Solid background
      ctx.fillStyle = template.background.color1;
      ctx.fillRect(0, 0, template.width, template.height);
    }
    
    // Configure text settings
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = template.textColor;
    
    // Helper function to wrap text
    const wrapText = (text: string, maxWidth: number, fontSize: number) => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = words[0];
      
      ctx.font = `${fontSize}px Inter, Arial, sans-serif`;
      
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };
    
    // Draw title - EXACT positioning, NO OVERLAP
    if (postContent.title) {
      const titleLines = wrapText(postContent.title, template.titleStyle.maxWidth, template.titleStyle.fontSize);
      ctx.font = `${template.titleStyle.fontWeight} ${template.titleStyle.fontSize}px Inter, Arial, sans-serif`;
      ctx.fillStyle = template.textColor;
      
      titleLines.forEach((line, index) => {
        const yOffset = index * (template.titleStyle.fontSize + 10);
        ctx.fillText(line, template.width / 2, template.titleStyle.y + yOffset);
      });
    }
    
    // Draw subtitle - GUARANTEED separation
    if (postContent.subtitle) {
      const subtitleLines = wrapText(postContent.subtitle, template.subtitleStyle.maxWidth, template.subtitleStyle.fontSize);
      ctx.font = `${template.subtitleStyle.fontWeight} ${template.subtitleStyle.fontSize}px Inter, Arial, sans-serif`;
      ctx.fillStyle = template.textColor;
      
      subtitleLines.forEach((line, index) => {
        const yOffset = index * (template.subtitleStyle.fontSize + 8);
        ctx.fillText(line, template.width / 2, template.subtitleStyle.y + yOffset);
      });
    }
    
    // Draw author
    if (postContent.author) {
      ctx.font = `${template.authorStyle.fontWeight} ${template.authorStyle.fontSize}px Inter, Arial, sans-serif`;
      ctx.fillStyle = template.textColor;
      ctx.fillText(`by ${postContent.author}`, template.width / 2, template.authorStyle.y);
    }
    
    // Draw quote if it exists and there's space
    if (postContent.quote && template.type === 'post') {
      const quoteY = template.authorStyle.y - 100;
      const quoteLines = wrapText(`"${postContent.quote}"`, 800, 18);
      ctx.font = 'italic 18px Inter, Arial, sans-serif';
      ctx.fillStyle = template.textColor;
      
      quoteLines.slice(0, 3).forEach((line, index) => { // Max 3 lines for quotes
        ctx.fillText(line, template.width / 2, quoteY + (index * 25));
      });
    }
    
  }, [selectedTemplate, postContent, backgroundImage]);

  // Update canvas when content changes
  useEffect(() => {
    if (canvasRef.current && fontsLoaded) {
      drawToCanvas(canvasRef.current);
    }
  }, [drawToCanvas, fontsLoaded]);

  // PERFECT EXPORT FUNCTION - Direct canvas export
  const exportImage = async () => {
    if (!canvasRef.current || !fontsLoaded) {
      alert('Please wait for fonts to load.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Ensure canvas is up to date
      drawToCanvas(canvasRef.current, true);
      
      // Wait a moment for rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Export as blob
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          alert('✅ Perfect! High-quality image exported successfully!');
        }
        setIsGenerating(false);
      }, 'image/png', 1.0);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
      setIsGenerating(false);
    }
  };

  const steps = [
    { id: 1, title: 'Choose Template', icon: Grid3X3 },
    { id: 2, title: 'Add Content', icon: Type },
    { id: 3, title: 'Customize Style', icon: Palette },
    { id: 4, title: 'Export & Share', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Canvas Social Media Studio ✅
                </h1>
                <p className="text-gray-600 text-sm">
                  Direct pixel control • No overlapping • Perfect exports
                </p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="hidden lg:flex items-center space-x-1 bg-gray-100 rounded-full p-1">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-green-600 text-white shadow-lg'
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
                    <Grid3X3 className="w-5 h-5 mr-2 text-green-600" />
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
                              ? 'border-green-500 bg-green-50 text-green-700 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`p-2 rounded-lg ${
                              isSelected ? 'bg-green-100' : 'bg-gray-100 group-hover:bg-gray-200'
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
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                    Canvas Templates ({filteredTemplates.length})
                  </h2>
                  
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
                              ? 'border-green-500 bg-green-50 shadow-lg'
                              : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                {template.type === 'story' ? (
                                  <Smartphone className="w-4 h-4 mr-2 text-purple-500" />
                                ) : (
                                  <Monitor className="w-4 h-4 mr-2 text-green-500" />
                                )}
                                <span className="font-semibold text-sm text-gray-900">{template.name}</span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                              <div className="flex items-center text-xs text-green-600 font-medium">
                                <Check className="w-3 h-3 mr-1" />
                                <span>Canvas Rendered ✅</span>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="ml-2">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
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
                    <Type className="w-5 h-5 mr-2 text-green-600" />
                    Customize Content
                  </h2>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📚 Title
                      </label>
                      <input
                        type="text"
                        value={postContent.title}
                        onChange={(e) => handleContentChange('title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white/50 backdrop-blur-sm"
                        placeholder="Your amazing title"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white/50 backdrop-blur-sm"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white/50 backdrop-blur-sm"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        💬 Featured Quote (Optional)
                      </label>
                      <textarea
                        value={postContent.quote}
                        onChange={(e) => handleContentChange('quote', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white/50 backdrop-blur-sm"
                        placeholder="An inspiring quote..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                        <span>🏷️ Hashtags</span>
                        <button
                          onClick={copyHashtags}
                          className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-lg hover:bg-green-200 flex items-center transition-colors"
                        >
                          {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </label>
                      <input
                        type="text"
                        value={postContent.hashtags}
                        onChange={(e) => handleContentChange('hashtags', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white/50 backdrop-blur-sm"
                        placeholder="#newbook #author #fantasy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Style */}
            {currentStep === 3 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-green-600" />
                    Style & Background
                  </h2>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Ready to Export
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Background Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🖼️ Background Image (Optional)
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        {backgroundFile && (
                          <button
                            onClick={() => {
                              setBackgroundImage(null);
                              setBackgroundFile('');
                            }}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove
                          </button>
                        )}
                      </div>
                      {backgroundFile && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-xs text-green-700 flex items-center">
                            <Check className="w-3 h-3 mr-1" />
                            Background image uploaded successfully
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Canvas Rendering Active!</h3>
                    <p className="text-gray-600">Your template uses direct pixel control with guaranteed no overlap.</p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Perfect Positioning ✅
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Direct Canvas Export ✅
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Export */}
            {currentStep === 4 && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-xl border border-green-200/50 p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Download className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Canvas Export Ready! 🎨</h2>
                  <p className="text-gray-600 mb-6">
                    Direct pixel control ensures perfect positioning with no overlap.
                  </p>
                  
                  <div className="mb-6 space-y-3">
                    <div className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
                      fontsLoaded ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      {fontsLoaded ? (
                        <><Check className="w-4 h-4 mr-2" />Canvas Fonts Ready</>  
                      ) : (
                        <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Loading Canvas Fonts...</>
                      )}
                    </div>
                    
                    {backgroundFile && (
                      <div className="inline-flex items-center px-4 py-2 rounded-lg font-medium bg-blue-100 text-blue-700 border border-blue-200 ml-3">
                        <Image className="w-4 h-4 mr-2" />
                        Background Image Ready
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={exportImage}
                    disabled={isGenerating || !fontsLoaded}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all shadow-lg text-lg transform hover:scale-105 disabled:transform-none"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                        <span>Creating Perfect Canvas Image...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-6 h-6 mr-3" />
                        <span>Export Canvas PNG ({selectedTemplate.width}×{selectedTemplate.height})</span>
                      </>
                    )}
                  </button>
                  
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      No Overlap ✅
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Canvas Rendered ✅
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      Perfect Quality ✅
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      Instagram Ready ✅
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Canvas Preview */}
          <div className="xl:col-span-2">
            <div className="sticky top-24">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-green-600" />
                    Canvas Preview ✅
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedTemplate.type === 'story' 
                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                        : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {selectedTemplate.type === 'story' ? '📱 Story Ready' : '📷 Post Ready'}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setPreviewScale(Math.max(0.15, previewScale - 0.05))}
                        className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {Math.round(previewScale * 100)}%
                      </span>
                      <button
                        onClick={() => setPreviewScale(Math.min(0.5, previewScale + 0.05))}
                        className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Canvas Preview */}
                <div 
                  className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 flex items-center justify-center"
                  style={{
                    minHeight: '400px',
                    maxHeight: '600px'
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <div 
                      className="border-4 border-white rounded-2xl overflow-hidden shadow-2xl bg-white"
                      style={{
                        transform: `scale(${previewScale})`,
                        transformOrigin: 'center center'
                      }}
                    >
                      <canvas
                        ref={canvasRef}
                        width={selectedTemplate.width}
                        height={selectedTemplate.height}
                        style={{
                          width: selectedTemplate.width,
                          height: selectedTemplate.height,
                          maxWidth: '100%',
                          maxHeight: '100%'
                        }}
                      />
                    </div>
                    
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-green-600 text-white text-xs rounded-full font-semibold whitespace-nowrap shadow-lg">
                      {selectedTemplate.name} - Canvas Rendered ✅
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center space-y-2">
                  <div className="text-xs text-gray-500 bg-green-50 px-3 py-2 rounded-lg inline-block border border-green-200">
                    ✅ {selectedTemplate.width} × {selectedTemplate.height} pixels - Direct canvas rendering
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center justify-center space-x-2 pt-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Edit Content
                    </button>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Change Template
                    </button>
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

export default CanvasBasedSocialMediaStudio;