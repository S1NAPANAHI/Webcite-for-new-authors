import React from 'react';
import { UIHomePage } from '../components/ui/HomePage';
import { LatestReleases } from '../components/home/LatestReleases';
import { useHomepageData } from '../hooks/useHomepageData';

export const HomePage: React.FC = () => {
  const { data, loading, error } = useHomepageData();

  console.log('✅ HomePage: Fetched API data successfully', { 
    hasData: !!data, 
    loading, 
    error,
    dataKeys: data ? Object.keys(data) : []
  });

  return (
    <div className="homepage-container">
      {/* Original UI HomePage */}
      <UIHomePage 
        data={data}
        loading={loading}
        error={error}
      />
      
      {/* NEW: Latest Releases Section */}
      <LatestReleases limit={6} />
    </div>
  );
};

export default HomePage;