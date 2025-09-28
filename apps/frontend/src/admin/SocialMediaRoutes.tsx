import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FixedSocialMediaGenerator from './components/FixedSocialMediaGenerator';

export const SocialMediaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<FixedSocialMediaGenerator />} />
      <Route path="generator" element={<FixedSocialMediaGenerator />} />
    </Routes>
  );
};