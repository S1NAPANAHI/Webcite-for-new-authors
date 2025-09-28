export interface SocialTemplate {
  id: string;
  name: string;
  description: string;
  type: 'post' | 'story' | 'carousel';
  width: number;
  height: number;
  background: string;
  textColor: string;
  layout: 'minimal' | 'centered' | 'split' | 'overlay' | 'modern' | 'vintage';
  category: 'book-launch' | 'quote' | 'author' | 'announcement' | 'behind-scenes';
}

export const ENHANCED_TEMPLATES: SocialTemplate[] = [
  // Book Launch Templates
  {
    id: 'book-launch-modern',
    name: 'Modern Book Launch',
    description: 'Clean, modern design perfect for new book announcements',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    layout: 'modern',
    category: 'book-launch'
  },
  {
    id: 'book-launch-vintage',
    name: 'Vintage Book Launch',
    description: 'Classic, elegant design with vintage aesthetics',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #8B4513 0%, #D2B48C 100%)',
    textColor: '#2F1B14',
    layout: 'vintage',
    category: 'book-launch'
  },
  
  // Quote Templates
  {
    id: 'quote-elegant',
    name: 'Elegant Quote',
    description: 'Beautiful typography-focused design for book quotes',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    textColor: '#ffffff',
    layout: 'centered',
    category: 'quote'
  },
  {
    id: 'quote-minimalist',
    name: 'Minimalist Quote',
    description: 'Clean, simple design that lets the quote shine',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    textColor: '#2d3748',
    layout: 'minimal',
    category: 'quote'
  },
  
  // Author Spotlight Templates
  {
    id: 'author-spotlight-split',
    name: 'Author Spotlight',
    description: 'Perfect for showcasing author information and quotes',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    textColor: '#ffffff',
    layout: 'split',
    category: 'author'
  },
  {
    id: 'author-modern',
    name: 'Modern Author Card',
    description: 'Contemporary design for author introductions',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    layout: 'modern',
    category: 'author'
  },
  
  // Story Templates
  {
    id: 'story-quote-overlay',
    name: 'Story Quote Overlay',
    description: 'Perfect for Instagram Stories with text overlay',
    type: 'story',
    width: 1080,
    height: 1920,
    background: 'linear-gradient(180deg, #ff9a9e 0%, #fecfef 100%)',
    textColor: '#ffffff',
    layout: 'overlay',
    category: 'quote'
  },
  {
    id: 'story-announcement',
    name: 'Story Announcement',
    description: 'Eye-catching design for book announcements in Stories',
    type: 'story',
    width: 1080,
    height: 1920,
    background: 'linear-gradient(180deg, #a8edea 0%, #fed6e3 100%)',
    textColor: '#2d3748',
    layout: 'centered',
    category: 'announcement'
  },
  {
    id: 'story-behind-scenes',
    name: 'Behind the Scenes',
    description: 'Casual design for sharing writing process and insights',
    type: 'story',
    width: 1080,
    height: 1920,
    background: 'linear-gradient(180deg, #ffeaa7 0%, #fab1a0 100%)',
    textColor: '#2d3748',
    layout: 'modern',
    category: 'behind-scenes'
  },
  
  // Announcement Templates
  {
    id: 'announcement-bold',
    name: 'Bold Announcement',
    description: 'High-impact design for major announcements',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #ff8a80 0%, #ffcc70 100%)',
    textColor: '#ffffff',
    layout: 'centered',
    category: 'announcement'
  },
  {
    id: 'announcement-professional',
    name: 'Professional Announcement',
    description: 'Business-appropriate design for formal announcements',
    type: 'post',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    textColor: '#ffffff',
    layout: 'split',
    category: 'announcement'
  },
  
  // Carousel Templates (Multi-slide posts)
  {
    id: 'carousel-book-preview',
    name: 'Book Preview Carousel',
    description: 'Multi-slide template for book previews and excerpts',
    type: 'carousel',
    width: 1080,
    height: 1080,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    layout: 'modern',
    category: 'book-launch'
  }
];

export const COLOR_SCHEMES = {
  ocean: {
    name: 'Ocean',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: '#ffffff',
    accent: '#4facfe'
  },
  sunset: {
    name: 'Sunset',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    text: '#ffffff',
    accent: '#ff6b6b'
  },
  forest: {
    name: 'Forest',
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    text: '#ffffff',
    accent: '#00d2d3'
  },
  vintage: {
    name: 'Vintage',
    background: 'linear-gradient(135deg, #8B4513 0%, #D2B48C 100%)',
    text: '#2F1B14',
    accent: '#CD853F'
  },
  monochrome: {
    name: 'Monochrome',
    background: 'linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)',
    text: '#ecf0f1',
    accent: '#95a5a6'
  },
  gold: {
    name: 'Gold',
    background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    text: '#2c3e50',
    accent: '#f39c12'
  },
  royal: {
    name: 'Royal',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: '#ffffff',
    accent: '#9b59b6'
  },
  fresh: {
    name: 'Fresh',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    text: '#2d3748',
    accent: '#4facfe'
  }
};

export const TYPOGRAPHY_PRESETS = {
  modern: {
    title: 'Inter, sans-serif',
    body: 'Source Sans Pro, sans-serif',
    accent: 'Montserrat, sans-serif'
  },
  classic: {
    title: 'Playfair Display, serif',
    body: 'Source Serif Pro, serif',
    accent: 'Crimson Text, serif'
  },
  elegant: {
    title: 'Cormorant Garamond, serif',
    body: 'Lora, serif',
    accent: 'Dancing Script, cursive'
  },
  minimal: {
    title: 'Helvetica Neue, sans-serif',
    body: 'system-ui, sans-serif',
    accent: 'SF Pro Display, sans-serif'
  },
  creative: {
    title: 'Nunito, sans-serif',
    body: 'Open Sans, sans-serif',
    accent: 'Pacifico, cursive'
  }
};

export const LAYOUT_CONFIGS = {
  minimal: {
    padding: '60px',
    spacing: '20px',
    titleSize: '64px',
    bodySize: '28px',
    alignment: 'center'
  },
  centered: {
    padding: '80px',
    spacing: '30px',
    titleSize: '56px',
    bodySize: '32px',
    alignment: 'center'
  },
  split: {
    padding: '60px',
    spacing: '25px',
    titleSize: '52px',
    bodySize: '26px',
    alignment: 'left'
  },
  overlay: {
    padding: '60px',
    spacing: '40px',
    titleSize: '72px',
    bodySize: '36px',
    alignment: 'center'
  },
  modern: {
    padding: '50px',
    spacing: '30px',
    titleSize: '58px',
    bodySize: '30px',
    alignment: 'left'
  },
  vintage: {
    padding: '70px',
    spacing: '35px',
    titleSize: '48px',
    bodySize: '24px',
    alignment: 'center'
  }
};

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: '📱' },
  { id: 'book-launch', name: 'Book Launch', icon: '📚' },
  { id: 'quote', name: 'Quotes', icon: '💭' },
  { id: 'author', name: 'Author Spotlight', icon: '👤' },
  { id: 'announcement', name: 'Announcements', icon: '📢' },
  { id: 'behind-scenes', name: 'Behind the Scenes', icon: '🎬' }
];