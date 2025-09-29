import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OptimizedSocialMediaGenerator from './components/OptimizedSocialMediaGenerator';

export const SocialMediaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<OptimizedSocialMediaGenerator />} />
      <Route path="generator" element={<OptimizedSocialMediaGenerator />} />
    </Routes>
  );
};