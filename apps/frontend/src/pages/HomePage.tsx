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

      {/* 🔥 LATEST NEWS & UPDATES - Dynamic Blog Posts Display */}
      <section className="py-20 bg-black dark:bg-black relative overflow-hidden">
        {/* Starry background effect */}
        <div className="absolute inset-0 bg-[url('/starry-bg.svg')] opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-wider">
              LATEST NEWS & UPDATES
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Stay informed with our latest insights, discoveries, and thoughts from the Zoroasterverse
            </p>
          </div>

          {/* 🎠 Dynamic Blog Posts - Using both components for maximum compatibility */}
          <div className="max-w-6xl mx-auto">
            {/* Try LatestNewsSlider first, fallback to NewsGrid */}
            <React.Suspense fallback={<NewsGrid />}>
              <LatestNewsSlider />
            </React.Suspense>
            
            {/* Backup: Simple NewsGrid that always works */}
            {/* Uncomment the line below and comment out LatestNewsSlider above if slider has issues */}
            {/* <NewsGrid /> */}
          </div>
        </div>
      </section>

      {/* Your existing sections - Keep the UIHomePage component if needed */}
      {!isLoading && !isError && (
        <UIHomePage 
          posts={latestPosts} 
          content={homepageData || []} 
          releases={releaseData || []} 
          spinsLeft={spinsLeft} 
          onSpin={handleSpin} 
        />
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