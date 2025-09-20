import React, { useEffect } from 'react';
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
  
  // Get banner URL using the utility hook
  const { url: bannerUrlFromFile, loading, error } = useFileUrl(chapter.banner_file_id);
  const bannerUrl = bannerUrlFromFile || chapter.banner_file_url || null;
  
  // DEBUG LOGGING - REMOVE AFTER TESTING
  useEffect(() => {
    console.log('\n=== CHAPTER CARD DEBUG ===');
    console.log('Chapter:', chapter.title);
    console.log('Banner file ID:', chapter.banner_file_id);
    console.log('Banner URL from file:', bannerUrlFromFile);
    console.log('Banner URL direct:', chapter.banner_file_url);
    console.log('Final banner URL:', bannerUrl);
    console.log('Hook loading:', loading);
    console.log('Hook error:', error);
    console.log('========================\n');
  }, [chapter, bannerUrlFromFile, bannerUrl, loading, error]);
  
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
        height: '300px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* DEBUG BANNER INFO */}
      {bannerUrl && (
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '10px',
          zIndex: 20
        }}>
          📷 BANNER
        </div>
      )}
      
      {/* Banner Background */}
      <div
        className="chapter-card-banner"
        style={{
          height: '120px',
          backgroundImage: bannerUrl 
            ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${bannerUrl})`
            : 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          // DEBUG: Add a border to see the banner area
          border: bannerUrl ? '2px solid #22c55e' : '2px solid #ef4444'
        }}
      >
        {/* Debug overlay showing URL */}
        {bannerUrl && (
          <div style={{
            position: 'absolute',
            bottom: '2px',
            left: '2px',
            right: '2px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '2px',
            fontSize: '8px',
            wordBreak: 'break-all',
            maxHeight: '20px',
            overflow: 'hidden'
          }}>
            URL: {bannerUrl}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div 
        className="chapter-card-body"
        style={{
          padding: '12px 14px',
          height: 'calc(100% - 120px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Chapter {chapter.chapter_number}
          </div>
          
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                background: '#dcfce7',
                color: '#16a34a'
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
                background: '#fef3c7',
                color: '#d97706'
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
                background: '#f3f4f6',
                color: '#6b7280'
              }}>
                <Lock size={12} />
                LOCKED
              </span>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#111827',
          margin: '0 0 12px 0',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {chapter.title}
        </h3>
        
        {/* Stats */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: 'auto',
          padding: '12px 0'
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
        
        {/* Action */}
        <div style={{ marginTop: 'auto' }}>
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