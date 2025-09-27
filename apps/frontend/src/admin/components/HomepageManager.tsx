// UPDATED: HomepageManager now uses the new component splitting architecture
import React from 'react';
import HomeContentManager from './HomeContentManager';

// Simple wrapper that uses the new component splitting architecture
const HomepageManager: React.FC = () => {
  return <HomeContentManager />;
};

export default HomepageManager;