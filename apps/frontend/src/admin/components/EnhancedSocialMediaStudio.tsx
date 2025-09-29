import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  RefreshCw,
  Crop,
  Move,
  RotateCw,
  Sliders,
  Save,
  Play,
  Square,
  Heart,
  Star
} from 'lucide-react';
import html2canvas from 'html2canvas';
import Cropper from 'react-easy-crop';

// Enhanced template interface with precise positioning
interface EnhancedTemplate {
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
    direction?: number;
  };
  textColor: string;
  titleStyle: {
    fontSize: number;
    fontWeight: string;
    y: number;
    maxWidth: number;
    fontFamily?: string;
  };
  subtitleStyle: {
    fontSize: number;
    fontWeight: string;
    y: number;
    maxWidth: number;
    fontFamily?: string;
  };
  authorStyle: {
    fontSize: number;
    fontWeight: string;
    y: number;
    maxWidth: number;
  };
}

// Comprehensive template collection
const ENHANCED_TEMPLATES: EnhancedTemplate[] = [
  // INSTAGRAM POSTS (1080x1080)
  {
    id: 'neo-gradient',
    name: 'Neo Gradient',
    description: 'Modern gradient with bold typography',
    category: 'book-launch',
    type: 'post',
    width: 1080,
    height: 1080,
    background: { type: 'gradient', color1: '#667eea', color2: '#764ba2', direction: 135 },
    textColor: '#ffffff',
    titleStyle: { fontSize: 52, fontWeight: '900', y: 400, maxWidth: 900, fontFamily: 'Inter' },
    subtitleStyle: { fontSize: 28, fontWeight: '400', y: 540, maxWidth: 900, fontFamily: 'Inter' },
    authorStyle: { fontSize: 24, fontWeight: '600', y: 920, maxWidth: 900 }
  },
  {
    id: 'minimal-elegance',
    name: 'Minimal Elegance',
    description: 'Clean and sophisticated design',
    category: 'quote',
    type: 'post',
    width: 1080,
    height: 1080,
    background: { type: 'solid', color1: '#f8f9fa' },
    textColor: '#2c3e50',
    titleStyle: { fontSize: 48, fontWeight: '300', y: 380, maxWidth: 900, fontFamily: 'Inter' },
    subtitleStyle: { fontSize: 24, fontWeight: '400', y: 500, maxWidth: 900, fontFamily: 'Inter' },
    authorStyle: { fontSize: 22, fontWeight: '600', y: 900, maxWidth: 900 }
  },
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    description: 'High-contrast design for announcements',
    category: 'announcement',
    type: 'post',
    width: 1080,
    height: 1080,
    background: { type: 'solid', color1: '#1a1a1a' },
    textColor: '#ffffff',
    titleStyle: { fontSize: 58, fontWeight: '900', y: 360, maxWidth: 900, fontFamily: 'Inter' },
    subtitleStyle: { fontSize: 26, fontWeight: '500', y: 500, maxWidth: 900, fontFamily: 'Inter' },
    authorStyle: { fontSize: 24, fontWeight: '700', y: 920, maxWidth: 900 }
  },
  {
    id: 'retro-vibes',
    name: 'Retro Vibes',
    description: 'Nostalgic design with vibrant colors',
    category: 'author',
    type: 'post',
    width: 1080,
    height: 1080,
    background: { type: 'gradient', color1: '#ff9a9e', color2: '#fecfef', direction: 45 },
    textColor: '#2c3e50',
    titleStyle: { fontSize: 50, fontWeight: '700', y: 390, maxWidth: 900, fontFamily: 'Inter' },
    subtitleStyle: { fontSize: 26, fontWeight: '600', y: 510, maxWidth: 900, fontFamily: 'Inter' },
    authorStyle: { fontSize: 22, fontWeight: '600', y: 900, maxWidth: 900 }
  },
  {
    id: 'nature-organic',
    name: 'Nature Organic',
    description: 'Earth tones with organic feel',
    category: 'behind-scenes',
    type: 'post',
    width: 1080,
    height: 1080,
    background: { type: 'gradient', color1: '#a8edea', color2: '#fed6e3', direction: 120 },
    textColor: '#2d5016',
    titleStyle: { fontSize: 44, fontWeight: '600', y: 400, maxWidth: 900, fontFamily: 'Inter' },
    subtitleStyle: { fontSize: 24, fontWeight: '400', y: 520, maxWidth: 900, fontFamily: 'Inter' },
    authorStyle: { fontSize: 22, fontWeight: '600', y: 920, maxWidth: 900 }
  },
  {
    id: 'corporate-clean',
    name: 'Corporate Clean',
    description: 'Professional business template',
    category: 'book-launch',
    type: 'post',
    width: 1080,
    height: 1080,
    background: { type: 'gradient', color1: '#e3f2fd', color2: '#bbdefb', direction: 135 },
    textColor: '#1565c0',
    titleStyle: { fontSize: 46, fontWeight: '600', y: 390, maxWidth: 900, fontFamily: 'Inter' },
    subtitleStyle: { fontSize: 24, fontWeight: '400', y: 510, maxWidth: 900, fontFamily: 'Inter' },
    authorStyle: { fontSize: 22, fontWeight: '600', y: 900, maxWidth: 900 }
  },
  {
    id: 'tech-futuristic',
    name: 'Tech Futuristic',
    description: 'Sci-fi inspired design',
    category: 'announcement',
    type: 'post',
    width: 1080,
    height: 1080,
    background: { type: 'gradient', color1: '#0c0c0c', color2: '#1a1a2e', direction: 135 },
    textColor: '#00ff88',
    titleStyle: { fontSize: 40, fontWeight: '700', y: 380, maxWidth: 900, fontFamily: 'Monaco' },
    subtitleStyle: { fontSize: 22, fontWeight: '400', y: 500, maxWidth: 900, fontFamily: 'Monaco' },
    authorStyle: { fontSize: 20, fontWeight: '600', y: 920, maxWidth: 900 }
  },
  {
    id: 'handcrafted',
    name: 'Handcrafted',
    description: 'Artisanal design with serif fonts',
    category: 'author',
    type: 'post',
    width: 1080,
    height: 1080,
    background: { type: 'solid', color1: '#fef7e0' },
    textColor: '#8b4513',
    titleStyle: { fontSize: 42, fontWeight: '600', y: 400, maxWidth: 900, fontFamily: 'Georgia' },
    subtitleStyle: { fontSize: 24, fontWeight: '400', y: 520, maxWidth: 900, fontFamily: 'Georgia' },
    authorStyle: { fontSize: 22, fontWeight: '600', y: 920, maxWidth: 900 }
  },
  // INSTAGRAM STORIES (1080x1920)
  {
    id: 'story-gradient',
    name: 'Story Gradient',
    description: 'Modern story template',
    category: 'author',
    type: 'story',
    width: 1080,
    height: 1920,
    background: { type: 'gradient', color1: '#667eea', color2: '#764ba2', direction: 135 },
    textColor: '#ffffff',
    titleStyle: { fontSize: 64, fontWeight: '800', y: 700, maxWidth: 900, fontFamily: 'Inter' },
    subtitleStyle: { fontSize: 32, fontWeight: '400', y: 860, maxWidth: 900, fontFamily: 'Inter' },
    authorStyle: { fontSize: 28, fontWeight: '600', y: 1700, maxWidth: 900 }
  },
  {
    id: 'story-minimal',
    name: 'Story Minimal',
    description: 'Clean story design',
    category: 'quote',
    type: 'story',
    width: 1080,
    height: 1920,
    background: { type: 'solid', color1: '#f8f9fa' },
    textColor: '#2c3e50',
    titleStyle: { fontSize: 58, fontWeight: '300', y: 680, maxWidth: 900, fontFamily: 'Inter' },
    subtitleStyle: { fontSize: 28, fontWeight: '400', y: 820, maxWidth: 900, fontFamily: 'Inter' },
    authorStyle: { fontSize: 26, fontWeight: '600', y: 1680, maxWidth: 900 }
  },
  {
    id: 'story-bold',
    name: 'Story Bold',
    description: 'High-impact story template',
    category: 'announcement',
    type: 'story',
    width: 1080,
    height: 1920,
    background: { type: 'solid', color1: '#1a1a1a' },
    textColor: '#ffffff',
    titleStyle: { fontSize: 72, fontWeight: '900', y: 650, maxWidth: 900, fontFamily: 'Inter' },
    subtitleStyle: { fontSize: 32, fontWeight: '500', y: 800, maxWidth: 900, fontFamily: 'Inter' },
    authorStyle: { fontSize: 28, fontWeight: '700', y: 1700, maxWidth: 900 }
  }
];

const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: Grid3X3, color: 'bg-gradient-to-br from-gray-500 to-gray-600' },
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

interface PostContent {
  title: string;
  subtitle: string;
  author: string;
  quote: string;
  hashtags: string;
  backgroundImage?: string;
}

interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  opacity: number;
  scale: number;
  x: number;
  y: number;
  rotation: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const EnhancedSocialMediaStudio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<EnhancedTemplate>(ENHANCED_TEMPLATES[0]);
  const [postContent, setPostContent] = useState<PostContent>(SAMPLE_CONTENT['book-launch']);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [imageAdjustments, setImageAdjustments] = useState<ImageAdjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    opacity: 100,
    scale: 100,
    x: 0,
    y: 0,
    rotation: 0
  });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewScale, setPreviewScale] = useState(0.3);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Load fonts for canvas rendering
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const fontFaces = [
          'Inter:wght@300;400;500;600;700;800;900',
          'Georgia:wght@400;600;700',
          'Monaco'
        ];

        const linkElement = document.createElement('link');
        linkElement.href = `https://fonts.googleapis.com/css2?${fontFaces.join('&family=')}&display=swap`;
        linkElement.rel = 'stylesheet';
        document.head.appendChild(linkElement);

        // Wait for fonts to load
        await document.fonts.load('400 20px Inter');
        await document.fonts.load('600 24px Inter');
        await document.fonts.load('700 32px Inter');
        await document.fonts.load('400 20px Georgia');
        await document.fonts.ready;
        
        setFontsLoaded(true);
        console.log('✅ All fonts loaded successfully');
      } catch (error) {
        console.warn('⚠️ Font loading failed:', error);
        setFontsLoaded(true);
      }
    };
    
    loadFonts();
  }, []);

  const filteredTemplates = selectedCategory === 'all' 
    ? ENHANCED_TEMPLATES 
    : ENHANCED_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleTemplateChange = useCallback((template: EnhancedTemplate) => {
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
      if (file.size > 10 * 1024 * 1024) {
        alert('Image too large. Please select an image under 10MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageSrc(result);
        setShowImageEditor(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const image = new Image();
      image.onload = () => {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setBackgroundImage(url);
            setPostContent(prev => ({ ...prev, backgroundImage: url }));
            setShowImageEditor(false);
          }
        });
      };
      image.src = imageSrc;
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleImageAdjustment = useCallback((property: keyof ImageAdjustments, value: number) => {
    setImageAdjustments(prev => ({ ...prev, [property]: value }));
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

  // Enhanced export function with better quality
  const exportImage = async () => {
    if (!canvasRef.current || !fontsLoaded) {
      alert('Please wait for fonts to load.');
      return;
    }

    setIsGenerating(true);

    try {
      // Wait for any pending renders
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(canvasRef.current, {
        width: selectedTemplate.width,
        height: selectedTemplate.height,
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: selectedTemplate.width,
        windowHeight: selectedTemplate.height,
        onclone: (clonedDoc) => {
          // Inject fonts into cloned document for better rendering
          const style = clonedDoc.createElement('style');
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Georgia:wght@400;600;700&display=swap');
            * { font-family: var(--font-family, 'Inter'), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Download the image
      const link = document.createElement('a');
      link.download = `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      alert('✅ Image exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getImageStyle = useCallback(() => {
    if (!backgroundImage) return {};
    
    const {
      brightness,
      contrast,
      saturation,
      blur,
      opacity,
      scale,
      x,
      y,
      rotation
    } = imageAdjustments;
    
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
      opacity: opacity / 100,
      transform: `scale(${scale / 100}) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
      transformOrigin: 'center center'
    };
  }, [imageAdjustments, backgroundImage]);

  const renderPostContent = () => {
    const baseStyle: React.CSSProperties = {
      width: selectedTemplate.width,
      height: selectedTemplate.height,
      background: backgroundImage ? 'transparent' : (
        selectedTemplate.background.type === 'gradient'
          ? `linear-gradient(${selectedTemplate.background.direction}deg, ${selectedTemplate.background.color1}, ${selectedTemplate.background.color2})`
          : selectedTemplate.background.color1
      ),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      boxSizing: 'border-box'
    };

    const backgroundImageStyle = backgroundImage ? {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 0,
      ...getImageStyle()
    } : {};

    const overlayStyle = backgroundImage ? {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))',
      zIndex: 1
    } : {};

    return (
      <div style={baseStyle}>
        {backgroundImage && <div style={backgroundImageStyle} />}
        {backgroundImage && <div style={overlayStyle} />}
        
        {/* Title */}
        <h1 style={{
          position: 'absolute',
          top: selectedTemplate.titleStyle.y,
          left: 40,
          right: 40,
          fontSize: selectedTemplate.titleStyle.fontSize,
          fontWeight: selectedTemplate.titleStyle.fontWeight,
          color: selectedTemplate.textColor,
          textAlign: 'center',
          margin: 0,
          padding: 0,
          zIndex: 2,
          lineHeight: '1.1',
          fontFamily: selectedTemplate.titleStyle.fontFamily || 'Inter',
          textShadow: backgroundImage ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'
        }}>
          {postContent.title}
        </h1>
        
        {/* Subtitle */}
        <p style={{
          position: 'absolute',
          top: selectedTemplate.subtitleStyle.y,
          left: 40,
          right: 40,
          fontSize: selectedTemplate.subtitleStyle.fontSize,
          fontWeight: selectedTemplate.subtitleStyle.fontWeight,
          color: selectedTemplate.textColor,
          textAlign: 'center',
          margin: 0,
          padding: 0,
          zIndex: 2,
          lineHeight: '1.2',
          fontFamily: selectedTemplate.subtitleStyle.fontFamily || 'Inter',
          textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
        }}>
          {postContent.subtitle}
        </p>
        
        {/* Author */}
        <div style={{
          position: 'absolute',
          top: selectedTemplate.authorStyle.y,
          left: 40,
          right: 40,
          fontSize: selectedTemplate.authorStyle.fontSize,
          fontWeight: selectedTemplate.authorStyle.fontWeight,
          color: selectedTemplate.textColor,
          textAlign: 'center',
          zIndex: 2,
          textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
        }}>
          by {postContent.author}
        </div>
        
        {/* Quote (if provided and there's space) */}
        {postContent.quote && (
          <div style={{
            position: 'absolute',
            top: selectedTemplate.authorStyle.y - 150,
            left: 60,
            right: 60,
            fontSize: selectedTemplate.type === 'story' ? 20 : 16,
            fontWeight: '400',
            color: selectedTemplate.textColor,
            textAlign: 'center',
            fontStyle: 'italic',
            zIndex: 2,
            lineHeight: '1.4',
            textShadow: backgroundImage ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
          }}>
            "{postContent.quote.slice(0, selectedTemplate.type === 'story' ? 120 : 80)}..."
          </div>
        )}
      </div>
    );
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
                  Enhanced Social Media Studio
                </h1>
                <p className="text-gray-600 text-sm">
                  Professional templates • Image editing • Perfect exports
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
                        ? 'bg-green-600 text-white shadow-lg'
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                      Templates ({filteredTemplates.length})
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {filteredTemplates.map((template) => {
                      const isSelected = selectedTemplate.id === template.id;
                      return (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateChange(template)}
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
                                  <Square className="w-4 h-4 mr-2 text-green-500" />
                                )}
                                <span className="font-semibold text-sm text-gray-900">{template.name}</span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                              <div className="flex items-center text-xs text-green-600 font-medium">
                                <Check className="w-3 h-3 mr-1" />
                                <span>{template.type === 'story' ? 'Story Format' : 'Post Format'}</span>
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
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setCurrentStep(2)}
                      disabled={!selectedTemplate}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                      Continue with Template
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
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

            {/* Step 3: Style & Background */}
            {currentStep === 3 && (
              <div className="space-y-6">
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
                  
                  {/* Background Image Upload */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Image className="w-5 h-5 mr-2" />
                      Background Image
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl flex items-center justify-center transition-all font-medium text-sm transform hover:scale-105 shadow-lg"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload & Edit Background
                      </button>
                      
                      {backgroundImage && (
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setShowImageEditor(true)}
                              className="flex-1 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl flex items-center justify-center transition-colors font-medium text-sm"
                            >
                              <Crop className="w-4 h-4 mr-2" />
                              Edit Image
                            </button>
                            
                            <button
                              onClick={() => {
                                setBackgroundImage(null);
                                setPostContent(prev => ({ ...prev, backgroundImage: undefined }));
                              }}
                              className="flex-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl flex items-center justify-center transition-colors font-medium text-sm"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Remove
                            </button>
                          </div>
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

                  {/* Image Adjustments */}
                  {backgroundImage && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Sliders className="w-4 h-4 mr-2" />
                        Image Adjustments
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Brightness: {imageAdjustments.brightness}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={imageAdjustments.brightness}
                            onChange={(e) => handleImageAdjustment('brightness', Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Contrast: {imageAdjustments.contrast}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={imageAdjustments.contrast}
                            onChange={(e) => handleImageAdjustment('contrast', Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Saturation: {imageAdjustments.saturation}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={imageAdjustments.saturation}
                            onChange={(e) => handleImageAdjustment('saturation', Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Scale: {imageAdjustments.scale}%
                          </label>
                          <input
                            type="range"
                            min="50"
                            max="200"
                            value={imageAdjustments.scale}
                            onChange={(e) => handleImageAdjustment('scale', Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Blur: {imageAdjustments.blur}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={imageAdjustments.blur}
                            onChange={(e) => handleImageAdjustment('blur', Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Opacity: {imageAdjustments.opacity}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={imageAdjustments.opacity}
                            onChange={(e) => handleImageAdjustment('opacity', Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setImageAdjustments({
                          brightness: 100, contrast: 100, saturation: 100,
                          blur: 0, opacity: 100, scale: 100, x: 0, y: 0, rotation: 0
                        })}
                        className="mt-3 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs transition-colors flex items-center"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reset
                      </button>
                    </div>
                  )}
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Export! 🎉</h2>
                  <p className="text-gray-600 mb-6">
                    Your enhanced social media post is ready for download.
                  </p>
                  
                  <div className="mb-6 space-y-3">
                    <div className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
                      fontsLoaded ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      {fontsLoaded ? (
                        <><Check className="w-4 h-4 mr-2" />Fonts Ready</>
                      ) : (
                        <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Loading Fonts...</>
                      )}
                    </div>
                    
                    {backgroundImage && (
                      <div className="inline-flex items-center px-4 py-2 rounded-lg font-medium bg-blue-100 text-blue-700 border border-blue-200 ml-3">
                        <Image className="w-4 h-4 mr-2" />
                        Custom Background Added
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
                        <span>Creating High-Quality Image...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-6 h-6 mr-3" />
                        <span>Download PNG ({selectedTemplate.width}×{selectedTemplate.height})</span>
                      </>
                    )}
                  </button>
                  
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Enhanced Quality ✅
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Perfect Positioning ✅
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      High Resolution ✅
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      Social Media Ready ✅
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
                    <Eye className="w-5 h-5 mr-2 text-green-600" />
                    Live Preview
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedTemplate.type === 'story' 
                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                        : 'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {selectedTemplate.type === 'story' ? '📱 Story Format' : '📷 Post Format'}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setPreviewScale(Math.max(0.15, previewScale - 0.05))}
                        className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {Math.round(previewScale * 100)}%
                      </span>
                      <button
                        onClick={() => setPreviewScale(Math.min(0.5, previewScale + 0.05))}
                        className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Preview Container */}
                <div 
                  className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 flex items-center justify-center"
                  style={{
                    minHeight: '400px',
                    maxHeight: '600px'
                  }}
                >
                  <div className="relative">
                    <div 
                      className="border-4 border-white rounded-2xl overflow-hidden shadow-2xl bg-white"
                      style={{
                        transform: `scale(${previewScale})`,
                        transformOrigin: 'center center'
                      }}
                    >
                      {/* Canvas Preview */}
                      <div 
                        ref={canvasRef}
                        style={{
                          width: selectedTemplate.width,
                          height: selectedTemplate.height,
                          maxWidth: '100%',
                          maxHeight: '100%'
                        }}
                      >
                        {renderPostContent()}
                      </div>
                    </div>
                    
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-green-600 text-white text-xs rounded-full font-semibold whitespace-nowrap shadow-lg">
                      {selectedTemplate.name} - Enhanced ✅
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center space-y-2">
                  <div className="text-xs text-gray-500 bg-green-50 px-3 py-2 rounded-lg inline-block border border-green-200">
                    ✅ {selectedTemplate.width} × {selectedTemplate.height} pixels - Perfect {selectedTemplate.type === 'story' ? 'Instagram Story' : 'Instagram Post'} format
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

      {/* Image Editor Modal */}
      {showImageEditor && imageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Crop className="w-6 h-6 mr-2 text-green-600" />
                Crop & Edit Image
              </h3>
              <button
                onClick={() => setShowImageEditor(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-6">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={selectedTemplate.width / selectedTemplate.height}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Zoom:</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowImageEditor(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createCroppedImage}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSocialMediaStudio;