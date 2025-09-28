import React from 'react';
import { SocialTemplate, LAYOUT_CONFIGS } from './SocialMediaTemplates';

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
  accentColor?: string;
}

interface PostRendererProps {
  template: SocialTemplate;
  content: PostContent;
  className?: string;
}

export const PostRenderer: React.FC<PostRendererProps> = ({ template, content, className = '' }) => {
  const layoutConfig = LAYOUT_CONFIGS[template.layout];
  
  const baseStyle: React.CSSProperties = {
    width: template.width,
    height: template.height,
    background: content.backgroundImage 
      ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${content.backgroundImage})`
      : content.backgroundColor,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: content.textColor,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: template.layout === 'split' ? 'flex-start' : 'center',
    padding: layoutConfig.padding,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: content.bodyFont
  };

  const renderMinimalLayout = () => (
    <div style={baseStyle} className={className}>
      {/* Decorative elements */}
      <div 
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          width: '100px',
          height: '2px',
          background: content.textColor,
          opacity: 0.3
        }}
      />
      
      <div style={{ textAlign: 'center', maxWidth: '90%' }}>
        <h1 style={{ 
          fontSize: layoutConfig.titleSize,
          fontFamily: content.titleFont,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: layoutConfig.spacing,
          lineHeight: '1.2',
          letterSpacing: '-0.02em'
        }}>
          {content.title}
        </h1>
        
        <div 
          style={{
            width: '60px',
            height: '2px',
            background: content.textColor,
            margin: `${layoutConfig.spacing} auto`,
            opacity: 0.6
          }}
        />
        
        <p style={{ 
          fontSize: layoutConfig.bodySize,
          fontFamily: content.bodyFont,
          textAlign: 'center',
          opacity: 0.9,
          marginBottom: layoutConfig.spacing,
          lineHeight: '1.4'
        }}>
          {content.subtitle}
        </p>
        
        <p style={{ 
          fontSize: '24px',
          fontFamily: content.titleFont,
          textAlign: 'center',
          opacity: 0.8,
          fontWeight: '300',
          letterSpacing: '0.05em'
        }}>
          by {content.author}
        </p>
      </div>
      
      {/* Bottom decorative line */}
      <div 
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '30px',
          width: '100px',
          height: '2px',
          background: content.textColor,
          opacity: 0.3
        }}
      />
    </div>
  );

  const renderCenteredLayout = () => (
    <div style={baseStyle} className={className}>
      {/* Quote marks decoration */}
      <div 
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          fontSize: '120px',
          fontFamily: 'serif',
          opacity: 0.1,
          lineHeight: '1',
          pointerEvents: 'none'
        }}
      >
        “
      </div>
      
      <div style={{ textAlign: 'center', maxWidth: '85%', zIndex: 2 }}>
        <p style={{ 
          fontSize: layoutConfig.bodySize + 8,
          fontFamily: content.bodyFont,
          fontStyle: 'italic',
          lineHeight: '1.5',
          marginBottom: '40px',
          position: 'relative',
          fontWeight: '300'
        }}>
          “{content.quote}”
        </p>
        
        <div 
          style={{
            width: '80px',
            height: '1px',
            background: content.textColor,
            margin: '30px auto',
            opacity: 0.5
          }}
        />
        
        <p style={{ 
          fontSize: '28px',
          fontFamily: content.titleFont,
          fontWeight: '600',
          marginBottom: '8px'
        }}>
          {content.author}
        </p>
        
        <p style={{ 
          fontSize: '22px',
          fontFamily: content.titleFont,
          opacity: 0.8,
          fontWeight: '300'
        }}>
          {content.title}
        </p>
      </div>
    </div>
  );

  const renderSplitLayout = () => (
    <div style={baseStyle} className={className}>
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        height: '100%',
        alignItems: 'center',
        gap: '40px'
      }}>
        <div style={{ flex: 1 }}>
          <div 
            style={{
              width: '60px',
              height: '4px',
              background: content.accentColor || content.textColor,
              marginBottom: '30px',
              borderRadius: '2px'
            }}
          />
          
          <h1 style={{ 
            fontSize: layoutConfig.titleSize,
            fontFamily: content.titleFont,
            fontWeight: 'bold',
            marginBottom: '20px',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}>
            {content.title}
          </h1>
          
          <p style={{ 
            fontSize: '26px',
            fontFamily: content.bodyFont,
            marginBottom: '25px',
            opacity: 0.9,
            lineHeight: '1.4'
          }}>
            {content.subtitle}
          </p>
          
          <p style={{ 
            fontSize: '22px',
            fontFamily: content.titleFont,
            opacity: 0.8,
            fontWeight: '300',
            letterSpacing: '0.05em'
          }}>
            by {content.author}
          </p>
        </div>
        
        <div style={{ 
          flex: 1,
          height: '80%',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <p style={{ 
            fontSize: '34px',
            fontFamily: content.bodyFont,
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: '1.4',
            fontWeight: '300'
          }}>
            “{content.quote}”
          </p>
        </div>
      </div>
    </div>
  );

  const renderOverlayLayout = () => (
    <div style={baseStyle} className={className}>
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: template.type === 'story' 
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
          fontSize: template.type === 'story' ? '78px' : layoutConfig.titleSize,
          fontFamily: content.titleFont,
          fontWeight: 'bold',
          marginBottom: '50px',
          lineHeight: '1.1',
          textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
          letterSpacing: '-0.02em'
        }}>
          {content.title}
        </h1>
        
        <p style={{ 
          fontSize: template.type === 'story' ? '38px' : '34px',
          fontFamily: content.bodyFont,
          fontStyle: 'italic',
          lineHeight: '1.5',
          marginBottom: '40px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          fontWeight: '300'
        }}>
          “{content.quote}”
        </p>
        
        <p style={{ 
          fontSize: template.type === 'story' ? '30px' : '26px',
          fontFamily: content.titleFont,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          fontWeight: '500'
        }}>
          — {content.author}
        </p>
        
        {template.type === 'story' && (
          <div style={{ 
            position: 'absolute',
            bottom: '-300px',
            left: 0,
            right: 0,
            fontSize: '26px',
            fontFamily: content.titleFont,
            opacity: 0.8,
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            {content.hashtags}
          </div>
        )}
      </div>
    </div>
  );

  const renderModernLayout = () => (
    <div style={baseStyle} className={className}>
      {/* Geometric background elements */}
      <div 
        style={{
          position: 'absolute',
          top: '50px',
          right: '50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${content.accentColor || content.textColor}20, transparent)`,
          opacity: 0.3
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50px',
          width: '100px',
          height: '100px',
          background: `linear-gradient(45deg, ${content.accentColor || content.textColor}15, transparent)`,
          transform: 'rotate(45deg)'
        }}
      />
      
      <div style={{ 
        textAlign: template.layout === 'split' ? 'left' : 'center',
        maxWidth: '85%',
        zIndex: 2
      }}>
        <div 
          style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: `${content.accentColor || content.textColor}20`,
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '30px',
            backdropFilter: 'blur(10px)'
          }}
        >
          NEW RELEASE
        </div>
        
        <h1 style={{ 
          fontSize: layoutConfig.titleSize,
          fontFamily: content.titleFont,
          fontWeight: '700',
          marginBottom: '25px',
          lineHeight: '1.1',
          letterSpacing: '-0.03em',
          background: `linear-gradient(135deg, ${content.textColor}, ${content.accentColor || content.textColor}80)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {content.title}
        </h1>
        
        <p style={{ 
          fontSize: layoutConfig.bodySize,
          fontFamily: content.bodyFont,
          marginBottom: '30px',
          opacity: 0.85,
          lineHeight: '1.4',
          fontWeight: '300'
        }}>
          {content.subtitle}
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: template.layout === 'split' ? 'flex-start' : 'center' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${content.accentColor || content.textColor}40, ${content.accentColor || content.textColor}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            {content.author.charAt(0)}
          </div>
          <p style={{ 
            fontSize: '22px',
            fontFamily: content.titleFont,
            fontWeight: '500'
          }}>
            {content.author}
          </p>
        </div>
      </div>
    </div>
  );

  const renderVintageLayout = () => (
    <div style={{
      ...baseStyle,
      background: `${content.backgroundColor}, repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.05) 2px, rgba(255,255,255,.05) 4px)`,
    }} className={className}>
      {/* Ornamental borders */}
      <div 
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          right: '30px',
          bottom: '30px',
          border: `3px double ${content.textColor}40`,
          borderRadius: '15px',
          pointerEvents: 'none'
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          top: '50px',
          left: '50px',
          right: '50px',
          bottom: '50px',
          border: `1px solid ${content.textColor}20`,
          borderRadius: '10px',
          pointerEvents: 'none'
        }}
      />
      
      <div style={{ textAlign: 'center', maxWidth: '80%', zIndex: 2 }}>
        {/* Decorative flourish */}
        <div style={{ 
          fontSize: '40px',
          marginBottom: '20px',
          opacity: 0.6,
          fontFamily: 'serif'
        }}>
          ❦
        </div>
        
        <h1 style={{ 
          fontSize: layoutConfig.titleSize,
          fontFamily: 'Playfair Display, serif',
          fontWeight: '700',
          marginBottom: '25px',
          lineHeight: '1.2',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          {content.title}
        </h1>
        
        <div style={{ 
          fontSize: '30px',
          marginBottom: '30px',
          opacity: 0.4,
          fontFamily: 'serif'
        }}>
          • • •
        </div>
        
        <p style={{ 
          fontSize: layoutConfig.bodySize,
          fontFamily: 'Crimson Text, serif',
          marginBottom: '25px',
          opacity: 0.9,
          lineHeight: '1.5',
          fontStyle: 'italic'
        }}>
          {content.subtitle}
        </p>
        
        <div style={{ 
          fontSize: '24px',
          marginBottom: '15px',
          opacity: 0.4,
          fontFamily: 'serif'
        }}>
          ❦
        </div>
        
        <p style={{ 
          fontSize: '24px',
          fontFamily: 'Playfair Display, serif',
          fontWeight: '600',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: 0.8
        }}>
          {content.author}
        </p>
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (template.layout) {
      case 'minimal': return renderMinimalLayout();
      case 'centered': return renderCenteredLayout();
      case 'split': return renderSplitLayout();
      case 'overlay': return renderOverlayLayout();
      case 'modern': return renderModernLayout();
      case 'vintage': return renderVintageLayout();
      default: return renderMinimalLayout();
    }
  };

  return renderLayout();
};