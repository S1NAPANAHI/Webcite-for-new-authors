import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SocialMediaGenerator } from './components/SocialMediaGenerator';

export const SocialMediaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<SocialMediaGenerator />} />
      <Route path="generator" element={<SocialMediaGenerator />} />
    </Routes>
  );
};