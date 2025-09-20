import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertCircle, Loader2, Lock, Crown, LogIn, CreditCard } from 'lucide-react';
import { useAuth } from '@zoroaster/shared';
import { supabase } from '../lib/supabase';
import { ImmersiveEbookReader } from '../components/ImmersiveEbookReader';
import { redirectLegacyChapterUrl } from '../utils/chapterUtils';

// Import the immersive ebook reader styles
import '../styles/immersive-ebook.css';

interface Chapter {
  id: string;
  issue_id: string;
  title: string;
  slug: string;
  chapter_number: number;
  content: any;
  plain_content: string;
  status: string;
  published_at: string | null;
  is_free: boolean;
  subscription_tier_required: string;
  has_access: boolean;
  access_denied_reason: string | null;
  word_count: number;
  estimated_read_time: number;
  metadata: any;
}

interface ChapterNavigation {
  prev_chapter_id: string | null;
  prev_chapter_slug: string | null;
  prev_chapter_title: string | null;
  prev_chapter_number: number | null;
  prev_has_access: boolean;
  next_chapter_id: string | null;
  next_chapter_slug: string | null;
  next_chapter_title: string | null;
  next_chapter_number: number | null;
  next_has_access: boolean;
}

interface Issue {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
}

interface AccessDeniedPageProps {
  reason: 'not_found' | 'subscription_required' | 'login_required';
  chapter?: Chapter;
  issue?: Issue;
  subscriptionTier?: string;
  allChapters?: Chapter[];
  issueSlug?: string;
}

function AccessDeniedPage({ reason, chapter, issue, subscriptionTier, allChapters = [], issueSlug }: AccessDeniedPageProps) {
  const navigate = useNavigate();
  
  const getContent = () => {
    switch (reason) {
      case 'not_found':
        return {
          icon: <AlertCircle className="w-16 h-16 text-red-500" />,
          title: 'Chapter Not Found',
          description: 'The requested chapter could not be found or has been removed.',
          action: {
            label: 'Go to Library',
            onClick: () => navigate('/library'),
            variant: 'primary'
          }
        };
        
      case 'login_required':
        return {
          icon: <LogIn className="w-16 h-16 text-blue-500" />,
          title: 'Login Required',
          description: `This chapter requires a ${subscriptionTier || 'premium'} subscription to read. Please login to continue.`,
          action: {
            label: 'Login to Continue',
            onClick: () => navigate('/login'),
            variant: 'primary'
          }
        };
        
      case 'subscription_required':
        return {
          icon: <Crown className="w-16 h-16 text-yellow-500" />,
          title: 'Premium Content',
          description: `This chapter requires a ${subscriptionTier || 'premium'} subscription to read. Upgrade your account to continue reading.`,
          action: {
            label: 'Upgrade Subscription',
            onClick: () => navigate('/subscriptions'),
            variant: 'premium'
          }
        };
        
      default:
        return {
          icon: <Lock className="w-16 h-16 text-gray-500" />,
          title: 'Access Denied',
          description: 'You do not have permission to access this chapter.',
          action: {
            label: 'Go Back',
            onClick: () => navigate(-1),
            variant: 'secondary'
          }
        };
    }
  };
  
  const content = getContent();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {content.icon}
          </div>
          
          {/* Issue & Chapter info */}
          {issue && chapter && (
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {issue.title}
              </h2>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Chapter {chapter.chapter_number}: {chapter.title}
              </h3>
              
              {/* Chapter details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  {chapter.word_count && (
                    <span>{chapter.word_count.toLocaleString()} words</span>
                  )}
                  {chapter.estimated_read_time && (
                    <span>{chapter.estimated_read_time} min read</span>
                  )}
                  {chapter.is_free ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      FREE
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>PREMIUM</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            {content.title}
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-center">
            {content.description}
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={content.action.onClick}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                content.action.variant === 'primary'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  : content.action.variant === 'premium'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {content.action.variant === 'premium' && <Crown className="w-4 h-4" />}
              {content.action.variant === 'primary' && reason === 'login_required' && <LogIn className="w-4 h-4" />}
              <span>{content.action.label}</span>
            </button>
            
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Browse Library
            </button>
          </div>
          
          {/* Available chapters list */}
          {allChapters.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Available Chapters
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {allChapters.map((ch) => (
                  <div key={ch.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        Chapter {ch.chapter_number}: {ch.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {ch.word_count?.toLocaleString() || 0} words • {ch.estimated_read_time || 0} min
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {ch.is_free && (
                        <span className="text-green-600 text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900 rounded">
                          FREE
                        </span>
                      )}
                      {ch.has_access ? (
                        <button
                          onClick={() => navigate(`/read/${issueSlug}/${ch.slug}`)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Read
                        </button>
                      ) : (
                        <span className="text-gray-400 p-1">
                          <Lock className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Additional help text */}
          {reason === 'subscription_required' && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                💡 <strong>Tip:</strong> Free chapters are available to all users. Premium subscribers get access to all content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Chapter</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Preparing your immersive reading experience...</p>
        
        {/* Loading skeleton */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-8"></div>
        </div>
      </div>
    </div>
  );
}

export default function ChapterReaderPage() {
  const { issueSlug, chapterSlug } = useParams<{ issueSlug: string; chapterSlug: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading, userProfile } = useAuth();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [navigation, setNavigation] = useState<ChapterNavigation | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [showImmersiveReader, setShowImmersiveReader] = useState(false);

  // Load chapter data using database functions
  useEffect(() => {
    const loadChapterData = async () => {
      try {
        setLoading(true);
        setError(null);
        setAccessDenied(false);
        
        console.log('🔍 Loading chapter:', { issueSlug, chapterSlug });
        
        if (!issueSlug || !chapterSlug) {
          setError('Invalid chapter URL');
          return;
        }
        
        // Check if this is a legacy UUID-based URL and redirect if needed
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(chapterSlug)) {
          console.log('🔄 Detected legacy UUID-based URL, attempting redirect...');
          try {
            const cleanUrl = await redirectLegacyChapterUrl(issueSlug, chapterSlug);
            if (cleanUrl) {
              console.log('➡️ Redirecting to clean URL:', cleanUrl);
              navigate(cleanUrl, { replace: true });
              return;
            }
          } catch (redirectError) {
            console.warn('⚠️ Could not redirect legacy URL:', redirectError);
            // Continue with original logic as fallback
          }
        }
        
        // Get chapter with access control using database function
        const { data: chapterData, error: chapterError } = await supabase
          .rpc('get_chapter_with_access', {
            p_issue_slug: issueSlug,
            p_chapter_identifier: chapterSlug,
            p_user_id: user?.id || null
          });
          
        if (chapterError) {
          console.error('❌ Error loading chapter:', chapterError);
          setError('Failed to load chapter');
          return;
        }
        
        if (!chapterData || chapterData.length === 0) {
          console.log('📖 No chapter found for:', { issueSlug, chapterSlug });
          setError('Chapter not found');
          return;
        }
        
        const chapterInfo = chapterData[0];
        console.log('📚 Loaded chapter:', chapterInfo);
        
        // Check if access is denied
        if (!chapterInfo.has_access) {
          setAccessDenied(true);
          setError(chapterInfo.access_denied_reason || 'Access denied');
        }
        
        setChapter(chapterInfo);
        
        // Get issue information
        const { data: issueData, error: issueError } = await supabase
          .from('content_items')
          .select('*')
          .eq('id', chapterInfo.issue_id)
          .single();
          
        if (issueError) {
          console.error('❌ Issue not found:', issueError);
        } else {
          setIssue(issueData);
        }
        
        // Get all accessible chapters for this issue
        const { data: accessibleChapters, error: chaptersError } = await supabase
          .rpc('get_accessible_chapters_for_issue', {
            p_issue_id: chapterInfo.issue_id,
            p_user_id: user?.id || null
          });
          
        if (chaptersError) {
          console.error('❌ Error loading chapters list:', chaptersError);
        } else {
          setAllChapters(accessibleChapters || []);
        }
        
        // Get navigation info
        const { data: navData, error: navError } = await supabase
          .rpc('get_chapter_navigation', {
            p_issue_id: chapterInfo.issue_id,
            p_current_chapter_number: chapterInfo.chapter_number,
            p_user_id: user?.id || null
          });
          
        if (navError) {
          console.error('❌ Error loading navigation:', navError);
        } else if (navData && navData.length > 0) {
          setNavigation(navData[0]);
        }
        
        // Auto-start immersive reader if user has access
        if (chapterInfo.has_access) {
          setShowImmersiveReader(true);
        }
        
      } catch (err) {
        console.error('💥 Unexpected error loading chapter:', err);
        setError('An unexpected error occurred while loading the chapter');
      } finally {
        setLoading(false);
      }
    };

    // Load data when params change
    if (issueSlug && chapterSlug) {
      loadChapterData();
    } else {
      setError('Invalid chapter URL');
      setLoading(false);
    }
  }, [issueSlug, chapterSlug, user?.id, navigate]);
  
  // Handle chapter navigation
  const handleChapterChange = (direction: 'prev' | 'next') => {
    if (!navigation) return;
    
    let targetSlug: string | null = null;
    let hasAccess = false;
    
    if (direction === 'prev' && navigation.prev_chapter_slug) {
      targetSlug = navigation.prev_chapter_slug;
      hasAccess = navigation.prev_has_access;
    } else if (direction === 'next' && navigation.next_chapter_slug) {
      targetSlug = navigation.next_chapter_slug;
      hasAccess = navigation.next_has_access;
    }
    
    if (targetSlug) {
      if (hasAccess) {
        navigate(`/read/${issueSlug}/${targetSlug}`);
      } else {
        // Navigate but user will see access denied message
        navigate(`/read/${issueSlug}/${targetSlug}`);
      }
    }
  };
  
  const handleExitReader = () => {
    setShowImmersiveReader(false);
    navigate('/library');
  };
  
  // Show loading
  if (loading) {
    return <LoadingPage />;
  }
  
  // Show access denied messages
  if (accessDenied && chapter) {
    const isLoginRequired = error?.includes('Login required');
    const isPremiumRequired = error?.includes('Premium subscription');
    
    if (isLoginRequired) {
      return (
        <AccessDeniedPage 
          reason="login_required" 
          chapter={chapter}
          issue={issue}
          subscriptionTier={chapter.subscription_tier_required}
          allChapters={allChapters}
          issueSlug={issueSlug}
        />
      );
    }
    
    if (isPremiumRequired || !chapter.has_access) {
      return (
        <AccessDeniedPage 
          reason="subscription_required" 
          chapter={chapter}
          issue={issue}
          subscriptionTier={chapter.subscription_tier_required}
          allChapters={allChapters}
          issueSlug={issueSlug}
        />
      );
    }
  }
  
  // Show error
  if (error && !accessDenied) {
    if (error === 'Chapter not found') {
      return (
        <AccessDeniedPage 
          reason="not_found" 
          chapter={chapter}
          issue={issue}
          allChapters={allChapters}
          issueSlug={issueSlug}
        />
      );
    }
    
    // Generic error fallback
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Chapter</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Go to Library
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show chapter not found if no chapter loaded
  if (!chapter) {
    return (
      <AccessDeniedPage 
        reason="not_found" 
        allChapters={allChapters}
        issueSlug={issueSlug}
      />
    );
  }

  // Show the IMMERSIVE ebook reader if user has access
  if (chapter.has_access && showImmersiveReader) {
    return (
      <ImmersiveEbookReader
        chapter={chapter}
        onChapterChange={handleChapterChange}
        showNavigation={navigation && (navigation.prev_chapter_slug || navigation.next_chapter_slug) ? true : false}
        navigationInfo={{
          hasPrev: !!navigation?.prev_chapter_slug,
          hasNext: !!navigation?.next_chapter_slug,
          prevTitle: navigation?.prev_chapter_title || undefined,
          nextTitle: navigation?.next_chapter_title || undefined,
          prevHasAccess: navigation?.prev_has_access || false,
          nextHasAccess: navigation?.next_has_access || false
        }}
        onExit={handleExitReader}
      />
    );
  }

  // Fallback - show loading page to enter immersive reader
  if (chapter.has_access && !showImmersiveReader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="text-center max-w-lg w-full">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12">
            <BookOpen className="w-20 h-20 text-blue-500 mx-auto mb-6" />
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {chapter.title}
            </h2>
            
            <div className="text-gray-600 dark:text-gray-400 mb-8">
              <p className="mb-4">
                Chapter {chapter.chapter_number} • {chapter.word_count?.toLocaleString() || 0} words • {chapter.estimated_read_time || 0} min read
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  📚 <strong>Immersive Reading Experience</strong><br/>
                  • Distraction-free fullscreen mode<br/>
                  • Word-based page turning<br/>
                  • Collapsible navigation sidebar<br/>
                  • Customizable reading settings<br/>
                  • Mobile-optimized interface
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowImmersiveReader(true)}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📖 Enter Immersive Reader
            </button>
            
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => navigate('/library')}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                ← Back to Library
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Final fallback - access denied
  return (
    <AccessDeniedPage 
      reason="subscription_required" 
      chapter={chapter}
      issue={issue}
      subscriptionTier={chapter.subscription_tier_required}
      allChapters={allChapters}
      issueSlug={issueSlug}
    />
  );
}