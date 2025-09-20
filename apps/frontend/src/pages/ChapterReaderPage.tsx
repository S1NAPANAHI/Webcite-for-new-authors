import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertCircle, Loader2, Lock, Crown } from 'lucide-react';
import { useAuth } from '@zoroaster/shared';
import { supabase } from '../lib/supabase';
import { EbookReader } from '../components/EbookReader';

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

  // Load chapter data using new database functions
  useEffect(() => {
    const loadChapterData = async () => {
      try {
        setLoading(true);
        setError(null);
        setAccessDenied(false);
        
        console.log('Loading chapter:', { issueSlug, chapterSlug });
        
        if (!issueSlug || !chapterSlug) {
          setError('Invalid chapter URL');
          return;
        }
        
        // Get chapter with access control using our new database function
        const { data: chapterData, error: chapterError } = await supabase
          .rpc('get_chapter_with_access', {
            p_issue_slug: issueSlug,
            p_chapter_identifier: chapterSlug,
            p_user_id: user?.id || null
          });
          
        if (chapterError) {
          console.error('Error loading chapter:', chapterError);
          setError('Failed to load chapter');
          return;
        }
        
        if (!chapterData || chapterData.length === 0) {
          console.log('No chapter found for:', { issueSlug, chapterSlug });
          setError('Chapter not found');
          return;
        }
        
        const chapterInfo = chapterData[0];
        console.log('Loaded chapter:', chapterInfo);
        
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
          console.error('Issue not found:', issueError);
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
          console.error('Error loading chapters list:', chaptersError);
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
          console.error('Error loading navigation:', navError);
        } else if (navData && navData.length > 0) {
          setNavigation(navData[0]);
        }
        
      } catch (err) {
        console.error('Unexpected error loading chapter:', err);
        setError('An unexpected error occurred while loading the chapter');
      } finally {
        setLoading(false);
      }
    };

    // Load data when params change, don't wait for auth
    if (issueSlug && chapterSlug) {
      loadChapterData();
    } else {
      setError('Invalid chapter URL');
      setLoading(false);
    }
  }, [issueSlug, chapterSlug, user?.id]);
  
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
  
  // Show loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
        </div>
      </div>
    );
  }
  
  // Show subscription required message
  if (accessDenied && chapter) {
    const isLoginRequired = error?.includes('Login required');
    const isPremiumRequired = error?.includes('Premium subscription');
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          {isLoginRequired ? (
            <Lock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          ) : (
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          )}
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {issue?.title}
          </h2>
          
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Chapter {chapter.chapter_number}: {chapter.title}
          </h3>
          
          {chapter.is_free ? (
            <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <p className="text-green-800 dark:text-green-200 font-medium mb-2">
                🎉 This is a FREE chapter!
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm">
                You can read this chapter without a subscription, but you may need to log in.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                👑 Premium Chapter
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                This chapter requires a premium subscription to read.
              </p>
            </div>
          )}
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          
          <div className="flex flex-col items-center space-y-4">
            {isLoginRequired ? (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <span>Login to Continue</span>
              </button>
            ) : isPremiumRequired ? (
              <button
                onClick={() => navigate('/subscriptions')}
                className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade to Premium</span>
              </button>
            ) : null}
            
            <button
              onClick={() => navigate('/library')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Library</span>
            </button>
          </div>
          
          {/* Show available free chapters */}
          {allChapters.length > 0 && (
            <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Available Chapters
              </h4>
              <div className="space-y-2">
                {allChapters.map((ch) => (
                  <div key={ch.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      Chapter {ch.chapter_number}: {ch.title}
                    </span>
                    <div className="flex items-center space-x-2">
                      {ch.is_free && (
                        <span className="text-green-600 text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900 rounded">
                          FREE
                        </span>
                      )}
                      {ch.has_access ? (
                        <button
                          onClick={() => navigate(`/read/${issueSlug}/${ch.slug}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Read
                        </button>
                      ) : (
                        <span className="text-gray-400">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Show error
  if (error && !accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Chapter Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => navigate('/library')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Library</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show chapter not found if no chapter loaded
  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Chapter Not Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This chapter may not be published yet or you may not have access to it.
          </p>
          <button
            onClick={() => navigate('/library')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </button>
        </div>
      </div>
    );
  }

  // Show the chapter reader if user has access
  return (
    <EbookReader
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
    />
  );
}