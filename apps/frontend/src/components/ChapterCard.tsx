import React from 'react';
import { Clock, BookOpen, Crown, Star, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFileUrl } from '../utils/fileUrls';

interface Chapter {
  id: string;
  title: string;
  slug: string;
  chapter_number: number;
  word_count?: number;
  estimated_read_time?: number;
  is_free: boolean;
  subscription_tier_required?: string;
  has_access?: boolean;
  banner_file_id?: string | null;
  banner_file_url?: string;
  banner_file_alt_text?: string;
  status: string;
  published_at?: string;
  rating?: number;
  rating_count?: number;
}

interface ChapterCardProps {
  chapter: Chapter;
  issueSlug: string;
  className?: string;
  showBanner?: boolean;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ 
  chapter, 
  issueSlug, 
  className = '',
  showBanner = true 
}) => {
  const readUrl = `/read/${issueSlug}/${chapter.slug || chapter.chapter_number}`;
  const hasAccess = chapter.has_access !== false;
  const isPremium = !chapter.is_free;
  
  // FIXED: Get banner URL using the utility hook (now returns string directly)
  const bannerUrlFromFile = useFileUrl(chapter.banner_file_id);
  const bannerUrl = bannerUrlFromFile || chapter.banner_file_url || null;
  
  console.log('\n🎯 RENDERING CHAPTER CARD (ChapterCard):', {
    id: chapter.id,
    title: chapter.title,
    banner_file_id: chapter.banner_file_id,
    banner_file_url: chapter.banner_file_url,
    bannerUrlFromFile,
    finalBannerUrl: bannerUrl,
    canRead: hasAccess,
    issueSlug
  });
  
  return (
    <div 
      className={`chapter-card ${className} ${!hasAccess ? 'locked' : ''}`}
      style={{
        position: 'relative',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '400px', // Increased height for better banner-to-content ratio
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Banner Background - LARGER and covers more of the card */}
      <div
        className="chapter-card-banner"
        style={{
          height: '200px', // Increased from 120px to 200px for better coverage
          backgroundImage: bannerUrl 
            ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(${bannerUrl})`
            : 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '16px'
        }}
      >
        {/* Chapter number badge - positioned on banner */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          fontSize: '12px',
          fontWeight: 600,
          color: 'white',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          background: 'rgba(0,0,0,0.4)',
          padding: '4px 8px',
          borderRadius: '8px',
          backdropFilter: 'blur(4px)'
        }}>
          Chapter {chapter.chapter_number}
        </div>
        
        {/* Badges - positioned on banner */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap'
        }}>
          {chapter.is_free ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.025em',
              background: 'rgba(220, 252, 231, 0.9)',
              color: '#16a34a',
              backdropFilter: 'blur(4px)'
            }}>FREE</span>
          ) : (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.025em',
              background: 'rgba(254, 243, 199, 0.9)',
              color: '#d97706',
              backdropFilter: 'blur(4px)'
            }}>
              <Crown size={12} />
              PREMIUM
            </span>
          )}
          
          {!hasAccess && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.025em',
              background: 'rgba(243, 244, 246, 0.9)',
              color: '#6b7280',
              backdropFilter: 'blur(4px)'
            }}>
              <Lock size={12} />
              LOCKED
            </span>
          )}
        </div>
        
        {/* Title overlay - positioned at bottom of banner */}
        <div style={{
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            margin: '0 0 8px 0',
            lineHeight: 1.2
          }}>
            {chapter.title}
          </h3>
        </div>
      </div>
      
      {/* Content - SMALLER content area */}
      <div 
        className="chapter-card-body"
        style={{
          padding: '16px',
          height: 'calc(100% - 200px)', // Adjusted for larger banner
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* Stats */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}>
          {chapter.word_count && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#6b7280',
              fontSize: '13px'
            }}>
              <BookOpen size={14} />
              <span>{chapter.word_count.toLocaleString()} words</span>
            </div>
          )}
          
          {chapter.estimated_read_time && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#6b7280',
              fontSize: '13px'
            }}>
              <Clock size={14} />
              <span>{chapter.estimated_read_time} min read</span>
            </div>
          )}
          
          {chapter.rating && chapter.rating_count && chapter.rating_count > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#6b7280',
              fontSize: '13px'
            }}>
              <Star size={14} />
              <span>{chapter.rating.toFixed(1)} ({chapter.rating_count})</span>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <div>
          {hasAccess ? (
            <Link 
              to={readUrl} 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                width: '100%',
                textAlign: 'center',
                background: '#4f46e5',
                color: 'white'
              }}
            >
              <BookOpen size={16} />
              Start Reading
            </Link>
          ) : (
            <Link 
              to={readUrl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                width: '100%',
                textAlign: 'center',
                background: '#f3f4f6',
                color: '#6b7280',
                border: '2px solid #e5e7eb'
              }}
            >
              <Lock size={16} />
              {isPremium ? 'Upgrade to Read' : 'Login to Read'}
            </Link>
          )}
        </div>
      </div>
      
      {/* Hover overlay for locked chapters */}
      {!hasAccess && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          opacity: 0,
          transition: 'opacity 0.2s'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <Lock size={24} style={{ marginBottom: '8px' }} />
            <p style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 500
            }}>
              {isPremium ? 'Premium subscribers only' : 'Login required'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterCard;