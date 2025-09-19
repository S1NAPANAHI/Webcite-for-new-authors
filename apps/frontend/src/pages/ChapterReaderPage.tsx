import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
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
  word_count: number;
  estimated_read_time: number;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: any;
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
  const { user, isLoading: authLoading } = useAuth();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load chapter data
  useEffect(() => {
    const loadChapterData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading chapter:', { issueSlug, chapterSlug });
        
        // First, find the issue by slug
        const { data: issueData, error: issueError } = await supabase
          .from('content_items')
          .select('*')
          .eq('slug', issueSlug)
          .eq('type', 'issue')
          .single();
          
        if (issueError || !issueData) {
          console.error('Issue not found:', issueError);
          setError('Issue not found');
          return;
        }
        
        setIssue(issueData);
        console.log('Found issue:', issueData);
        
        // Load all chapters for this issue
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('*')
          .eq('issue_id', issueData.id)
          .eq('status', 'published')
          .order('chapter_number');
          
        if (chaptersError) {
          console.error('Error loading chapters:', chaptersError);
          setError('Failed to load chapters');
          return;
        }
        
        if (!chaptersData || chaptersData.length === 0) {
          console.log('No published chapters found for issue:', issueData.id);
          setError('No chapters available for this issue');
          return;
        }
        
        setAllChapters(chaptersData);
        console.log('Found chapters:', chaptersData);
        
        // Find the specific chapter by slug or number
        let targetChapter = chaptersData.find(ch => ch.slug === chapterSlug);
        
        // If not found by slug, try to find by chapter number if chapterSlug is numeric
        if (!targetChapter && /^\d+$/.test(chapterSlug || '')) {
          const chapterNumber = parseInt(chapterSlug || '0');
          targetChapter = chaptersData.find(ch => ch.chapter_number === chapterNumber);
        }
        
        // If still not found, default to first chapter
        if (!targetChapter) {
          targetChapter = chaptersData[0];
        }
        
        setChapter(targetChapter);
        console.log('Loaded chapter:', targetChapter);
        
      } catch (err) {
        console.error('Unexpected error loading chapter:', err);
        setError('An unexpected error occurred while loading the chapter');
      } finally {
        setLoading(false);
      }
    };

    // Only load if we have the required params and user is authenticated
    if (issueSlug && chapterSlug && !authLoading) {
      loadChapterData();
    } else if (!authLoading && !issueSlug) {
      setError('Invalid chapter URL');
      setLoading(false);
    }
  }, [issueSlug, chapterSlug, authLoading]);
  
  // Handle chapter navigation
  const handleChapterChange = (direction: 'prev' | 'next') => {
    if (!chapter || !allChapters.length) return;
    
    const currentIndex = allChapters.findIndex(ch => ch.id === chapter.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allChapters.length - 1;
    } else {
      newIndex = currentIndex < allChapters.length - 1 ? currentIndex + 1 : 0;
    }
    
    const newChapter = allChapters[newIndex];
    if (newChapter) {
      navigate(`/read/${issueSlug}/${newChapter.slug}`);
    }
  };
  
  // Show loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
        </div>
      </div>
    );
  }
  
  // Show error
  if (error) {
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

  return (
    <EbookReader
      chapter={chapter}
      onChapterChange={handleChapterChange}
      showNavigation={allChapters.length > 1}
    />
  );
}