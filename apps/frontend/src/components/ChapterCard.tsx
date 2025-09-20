import React from 'react';
import { Clock, BookOpen, Crown, Star, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  
  return (
    <div className={`chapter-card ${className} ${!hasAccess ? 'locked' : ''}`}>
      {/* Banner Background */}
      {showBanner && chapter.banner_file_url && (
        <div 
          className="chapter-banner"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url(${chapter.banner_file_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Content */}
      <div className="chapter-content">
        {/* Header */}
        <div className="chapter-header">
          <div className="chapter-number">Chapter {chapter.chapter_number}</div>
          <div className="chapter-badges">
            {chapter.is_free ? (
              <span className="badge free">FREE</span>
            ) : (
              <span className="badge premium">
                <Crown size={12} />
                PREMIUM
              </span>
            )}
            
            {!hasAccess && (
              <span className="badge locked">
                <Lock size={12} />
                LOCKED
              </span>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="chapter-title">{chapter.title}</h3>
        
        {/* Stats */}
        <div className="chapter-stats">
          {chapter.word_count && (
            <div className="stat">
              <BookOpen size={14} />
              <span>{chapter.word_count.toLocaleString()} words</span>
            </div>
          )}
          
          {chapter.estimated_read_time && (
            <div className="stat">
              <Clock size={14} />
              <span>{chapter.estimated_read_time} min read</span>
            </div>
          )}
          
          {chapter.rating && chapter.rating_count && chapter.rating_count > 0 && (
            <div className="stat">
              <Star size={14} />
              <span>{chapter.rating.toFixed(1)} ({chapter.rating_count})</span>
            </div>
          )}
        </div>
        
        {/* Action */}
        <div className="chapter-action">
          {hasAccess ? (
            <Link to={readUrl} className="read-button primary">
              <BookOpen size={16} />
              Start Reading
            </Link>
          ) : (
            <Link to={readUrl} className="read-button locked">
              <Lock size={16} />
              {isPremium ? 'Upgrade to Read' : 'Login to Read'}
            </Link>
          )}
        </div>
      </div>
      
      {/* Hover overlay for locked chapters */}
      {!hasAccess && (
        <div className="locked-overlay">
          <div className="locked-message">
            <Lock size={24} />
            <p>{isPremium ? 'Premium subscribers only' : 'Login required'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterCard;

// CSS styles for ChapterCard
export const ChapterCardStyles = `
.chapter-card {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 300px;
  display: flex;
  flex-direction: column;
}

.chapter-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.chapter-card.locked {
  opacity: 0.85;
}

.chapter-banner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
}

.chapter-content {
  position: relative;
  z-index: 2;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.95) 40%, white 100%);
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  margin-top: 60px;
}

.chapter-number {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chapter-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge.free {
  background: #dcfce7;
  color: #16a34a;
}

.badge.premium {
  background: #fef3c7;
  color: #d97706;
}

.badge.locked {
  background: #f3f4f6;
  color: #6b7280;
}

.chapter-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.chapter-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: auto;
  padding: 12px 0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 13px;
}

.stat svg {
  flex-shrink: 0;
}

.chapter-action {
  margin-top: auto;
}

.read-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
  width: 100%;
  text-align: center;
}

.read-button.primary {
  background: #4f46e5;
  color: white;
}

.read-button.primary:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.read-button.locked {
  background: #f3f4f6;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.read-button.locked:hover {
  background: #e5e7eb;
  color: #374151;
}

.locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
}

.chapter-card.locked:hover .locked-overlay {
  opacity: 1;
}

.locked-message {
  text-align: center;
  color: #6b7280;
}

.locked-message svg {
  margin-bottom: 8px;
}

.locked-message p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .chapter-card {
    height: 280px;
  }
  
  .chapter-banner {
    height: 100px;
  }
  
  .chapter-header {
    margin-top: 40px;
  }
  
  .chapter-title {
    font-size: 16px;
  }
  
  .chapter-stats {
    gap: 8px;
  }
  
  .stat {
    font-size: 12px;
  }
}
`;

// Inject styles into document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = ChapterCardStyles;
  document.head.appendChild(styleElement);
}