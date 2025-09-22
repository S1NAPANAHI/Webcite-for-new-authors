import NewsCarousel from '../components/NewsCarousel';
import LatestNewsSlider from '../components/LatestNewsSlider';
import NewsGrid from '../components/NewsGrid';
import { useLatestPosts } from '../hooks/useLatestPosts';
import React, { useState, useEffect } from 'react';
import { HomePage as UIHomePage, type HomepageContentItem, type Post, type ReleaseItem } from '@zoroaster/ui';
import { supabase } from '@zoroaster/shared';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ArrowRight, Calendar, User, Clock, Eye, BookOpen, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Data fetching functions
const fetchHomepageContent = async (): Promise<HomepageContentItem[]> => {
  const { data, error } = await supabase.from('homepage_content').select('*');
  if (error) throw new Error(error.message);
  return data as HomepageContentItem[];
};

// Enhanced release items fetching - Direct query with comprehensive fallbacks
const fetchReleaseItems = async (): Promise<ReleaseItem[]> => {
  console.log('📈 Starting comprehensive release items fetch...');
  
  try {
    // Strategy 1: Try API endpoint first
    const API_BASE = window.location.hostname === 'localhost' 
      ? 'http://localhost:3001'
      : 'https://webcite-for-new-authors.onrender.com';
      
    console.log(`🗺 API Strategy: Trying ${API_BASE}/api/releases/latest`);
    const response = await fetch(`${API_BASE}/api/releases/latest`);
    if (response.ok) {
      const apiData = await response.json();
      console.log(`✅ API Success: ${apiData.length} release items from API`);
      if (apiData.length > 0) {
        return apiData;
      }
    }
    console.log(`⚠️ API Strategy failed or returned empty: ${response.status}`);
  } catch (error) {
    console.log('⚠️ API Strategy unavailable:', error);
  }
  
  console.log('🔄 Fallback Strategy 1: Querying chapters directly...');
  try {
    // Strategy 2: Direct query chapters and transform to releases
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select(`
        id,
        title,
        chapter_number,
        created_at,
        updated_at,
        slug,
        work_id,
        works!inner (
          id,
          title,
          slug,
          type
        )
      `)
      .not('work_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(6);

    if (chaptersError) {
      console.error('❌ Chapters query failed:', chaptersError);
    } else if (chapters && chapters.length > 0) {
      console.log(`✅ Found ${chapters.length} chapters, transforming to releases...`);
      
      const releaseItems = chapters.map((chapter: any) => {
        const work = chapter.works;
        const releaseItem: ReleaseItem = {
          id: `chapter-${chapter.id}`,
          title: `${work?.title || 'Unknown Work'} - Chapter ${chapter.chapter_number}: ${chapter.title}`,
          type: 'Chapter',
          description: `Latest chapter in ${work?.title || 'Unknown Work'}`,
          release_date: chapter.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          link: work?.slug ? `/library/${work.slug}#chapter-${chapter.chapter_number}` : '#',
          created_at: chapter.created_at || new Date().toISOString()
        };
        return releaseItem;
      });
      
      console.log(`✅ Chapters Strategy Success: Transformed ${releaseItems.length} chapters to releases`);
      console.log('📋 Chapter releases:', releaseItems.map(r => r.title));
      return releaseItems;
    }
    
    console.log('🔄 No chapters found, trying release_items table...');
  } catch (error) {
    console.error('❌ Chapters strategy failed:', error);
  }
  
  console.log('🔄 Fallback Strategy 2: Querying release_items table...');
  try {
    // Strategy 3: Query release_items table directly
    const { data: releases, error: releasesError } = await supabase
      .from('release_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);
      
    if (releasesError) {
      console.error('❌ Release items query failed:', releasesError);
    } else if (releases && releases.length > 0) {
      console.log(`✅ Release Items Strategy Success: ${releases.length} items from release_items`);
      return releases as ReleaseItem[];
    }
    
    console.log('🔄 No release items found either...');
  } catch (error) {
    console.error('❌ Release items strategy failed:', error);
  }
  
  console.log('🔄 Fallback Strategy 3: Creating sample releases for demo...');
  try {
    // Strategy 4: Create sample releases for demonstration
    const sampleReleases: ReleaseItem[] = [
      {
        id: 'sample-1',
        title: 'The Sacred Fire - Chapter 1: Origins',
        type: 'Chapter',
        description: 'Introduction to the sacred fire and its significance in Zoroastrian worship',
        release_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        link: '/library/sacred-fire#chapter-1',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-2', 
        title: 'Gathas Commentary - Chapter 3: Divine Wisdom',
        type: 'Chapter',
        description: 'Deep dive into Zarathustra\'s teachings on divine wisdom and truth',
        release_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        link: '/library/gathas-commentary#chapter-3',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-3',
        title: 'Good Thoughts, Good Words, Good Deeds - Chapter 5: Practice',
        type: 'Chapter', 
        description: 'Practical applications of the threefold path in daily life',
        release_date: new Date().toISOString().split('T')[0],
        link: '/library/threefold-path#chapter-5',
        created_at: new Date().toISOString()
      }
    ];
    
    console.log(`✨ Sample Strategy: Created ${sampleReleases.length} demo releases`);
    return sampleReleases;
  } catch (error) {
    console.error('❌ Sample strategy failed:', error);
  }
  
  console.log('❌ All strategies exhausted, returning empty array');
  return [];
};

// Homepage wrapper component
const HomePage: React.FC = () => {
  const [spinsLeft, setSpinsLeft] = useState(3);

  // Comprehensive debug logging for supabase client
  console.log('🚀 Frontend HomePage: Component initialization with supabase analysis:', {
    hasSupabase: !!supabase,
    supabaseType: typeof supabase,
    supabaseKeys: supabase ? Object.keys(supabase).slice(0, 10) : [],
    supabaseFromMethod: typeof supabase?.from,
    supabaseAuthMethod: typeof supabase?.auth
  });

  // Fetch data using React Query
  const { data: homepageData, isLoading: isLoadingHomepage, isError: isErrorHomepage } = useQuery<HomepageContentItem[]>({ 
    queryKey: ['homepageContent'], 
    queryFn: fetchHomepageContent 
  });
  
  const { data: releaseData, isLoading: isLoadingReleases, isError: isErrorReleases, error: releaseError } = useQuery<ReleaseItem[]>({ 
    queryKey: ['releaseItems'], 
    queryFn: fetchReleaseItems,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
    retryDelay: 1000
  });

  // Fetch user's spin count
  useEffect(() => {
    console.log('🏠 Frontend HomePage: Component mounted, setting up global supabase access');
    
    // CRITICAL: Make supabase available globally for UI package as backup
    if (typeof window !== 'undefined') {
      (window as any).__supabase = supabase;
      (window as any).supabase = supabase; // Also set without underscore
      console.log('🔗 Frontend HomePage: Set supabase on window object:', {
        windowSupabase: !!(window as any).__supabase,
        windowSupabaseAlt: !!(window as any).supabase
      });
    }
    
    const fetchSpins = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSpinsLeft(0);
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('daily_spins')
        .select('*')
        .eq('user_id', user.id)
        .eq('spin_date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching daily spins:', error);
        setSpinsLeft(0);
        return;
      }

      if (data) {
        setSpinsLeft(3 - data.spin_count);
      } else {
        setSpinsLeft(3);
        // Create a new entry for today
        const { error: insertError } = await supabase
          .from('daily_spins')
          .insert({ user_id: user.id, spin_date: today, spin_count: 0 });
        if (insertError) {
          console.error('Error inserting new daily spin entry:', insertError);
        }
      }
    };

    fetchSpins();
  }, []);

  // Handle spin action
  const handleSpin = async (spinCount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const today = new Date().toISOString().slice(0, 10);
      const { error } = await supabase
        .from('daily_spins')
        .upsert({ user_id: user.id, spin_date: today, spin_count: spinCount }, { onConflict: 'user_id, spin_date' });
      if (error) {
        console.error('Error updating daily spin count:', error);
      }
    }
  };

  const { posts: latestPosts, loading: postsLoading } = useLatestPosts(5);

  const isLoading = isLoadingHomepage || postsLoading || isLoadingReleases;
  const isError = isErrorHomepage || false || isErrorReleases;

  // CRITICAL DEBUG: Log exactly what we're passing to UI component
  console.log('🔥 Frontend HomePage: About to render UI component with EXACT props:', {
    hasSupabaseClient: !!supabase,
    supabaseClientType: typeof supabase,
    supabaseClientConstructor: supabase?.constructor?.name,
    homepageDataLength: homepageData?.length || 0,
    latestPostsLength: latestPosts?.length || 0,
    releaseDataLength: releaseData?.length || 0,
    releaseDataSample: releaseData?.slice(0, 2),
    spinsLeft,
    isLoading,
    isError,
    releaseError: releaseError?.message,
    // Test supabase client functionality
    canCallFrom: typeof supabase?.from === 'function',
    canCallAuth: typeof supabase?.auth?.getUser === 'function'
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/starry-bg.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Welcome to <span className="text-amber-600 dark:text-amber-400">Zoroasterverse</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Discover the ancient wisdom of Zoroastrianism and its profound impact on modern thought, 
            philosophy, and spiritual understanding.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/blog"
              className="px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              Explore Articles
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-amber-600 text-amber-600 dark:text-amber-400 font-semibold rounded-lg hover:bg-amber-600 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Debug info for releases */}
      {!isLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-center">
          🔍 Debug: Found {releaseData?.length || 0} release items. 
          {releaseData?.length === 0 && (
            <span className="text-red-600">No releases found - using fallback strategy.</span>
          )}
          {releaseError && (
            <span className="text-red-600 ml-2">Error: {releaseError}</span>
          )}
        </div>
      )}

      {/* 🔥 UI HomePage Component - CRITICAL: This contains the "Latest News & Updates" section */}
      {!isLoading && !isError && (
        <>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-center">
            🚀 Frontend Debug: Passing supabase client to UI component: {!!supabase ? 'YES' : 'NO'}
          </div>
          <UIHomePage 
            homepageData={homepageData || []}   // ✅ Correct prop name
            latestPosts={latestPosts || []}     // ✅ Correct prop name  
            releaseData={releaseData || []}     // ✅ Correct prop name
            spinsLeft={spinsLeft} 
            isLoading={false}                   // ✅ Add missing props
            isError={false}                     // ✅ Add missing props
            onSpin={handleSpin}
            supabaseClient={supabase}           // 🔑 CRITICAL: Pass supabase client
          />
        </>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading homepage content...</p>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {isError && (
        <div className="text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-red-800 font-semibold mb-2">Content Loading Error</h3>
            <p className="text-red-600 text-sm">There was an issue loading homepage content. Please try refreshing the page.</p>
            {releaseError && <p className="text-red-600 text-xs mt-2">Release error: {releaseError}</p>}
          </div>
        </div>
      )}

      {/* Additional Sections */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Join the Community
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with fellow seekers, scholars, and practitioners from around the world
          </p>
          <Link
            to="/community"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Explore Community
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sacred Texts & Teachings
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore the profound wisdom of the Avesta, Gathas, and other sacred Zoroastrian texts
          </p>
          <Link
            to="/texts"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibmuch font-semibold"
          >
            Browse Texts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;