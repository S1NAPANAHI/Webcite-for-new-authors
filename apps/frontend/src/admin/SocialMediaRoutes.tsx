import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EnhancedSocialMediaGenerator } from './components/EnhancedSocialMediaGenerator';
import { SocialMediaGenerator } from './components/SocialMediaGenerator';

export const SocialMediaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<EnhancedSocialMediaGenerator />} />
      <Route path="generator" element={<EnhancedSocialMediaGenerator />} />
      <Route path="basic" element={<SocialMediaGenerator />} />
    </Routes>
  );
};