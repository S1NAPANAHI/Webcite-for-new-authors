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

const fetchReleaseItems = async (): Promise<ReleaseItem[]> => {
  const { data, error } = await supabase.from('release_items').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as ReleaseItem[];
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
  
  const { data: releaseData, isLoading: isLoadingReleases, isError: isErrorReleases } = useQuery<ReleaseItem[]>({ 
    queryKey: ['releaseItems'], 
    queryFn: fetchReleaseItems 
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
    spinsLeft,
    isLoading,
    isError,
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
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
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