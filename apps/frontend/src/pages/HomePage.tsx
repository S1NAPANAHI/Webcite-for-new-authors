import React, { useState, useEffect } from 'react';
import { HomePage as UIHomePage, type HomepageContentItem, type Post, type ReleaseItem } from '@zoroaster/ui';
import { supabase } from '@zoroaster/shared';
import { useQuery } from '@tanstack/react-query';

// Data fetching functions
const fetchHomepageContent = async (): Promise<HomepageContentItem[]> => {
  const { data, error } = await supabase.from('homepage_content').select('*');
  if (error) throw new Error(error.message);
  return data as HomepageContentItem[];
};

const fetchLatestPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, content, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);
  if (error) throw new Error(error.message);
  return data as Post[];
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
  
  const { data: latestPosts, isLoading: isLoadingPosts, isError: isErrorPosts } = useQuery<Post[]>({ 
    queryKey: ['latestPosts'], 
    queryFn: fetchLatestPosts 
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

  const isLoading = isLoadingHomepage || isLoadingPosts || isLoadingReleases;
  const isError = isErrorHomepage || isErrorPosts || isErrorReleases;

  return (
    <UIHomePage
      homepageData={homepageData}
      latestPosts={latestPosts}
      releaseData={releaseData}
      spinsLeft={spinsLeft}
      isLoading={isLoading}
      isError={isError}
      onSpin={handleSpin}
    />
  );
};

export default HomePage;
