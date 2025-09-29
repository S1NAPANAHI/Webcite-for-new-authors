import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EnhancedSocialMediaStudio from './components/EnhancedSocialMediaStudio';

export const SocialMediaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<EnhancedSocialMediaStudio />} />
      <Route path="generator" element={<EnhancedSocialMediaStudio />} />
      <Route path="studio" element={<EnhancedSocialMediaStudio />} />
      <Route path="enhanced" element={<EnhancedSocialMediaStudio />} />
    </Routes>
  );
};