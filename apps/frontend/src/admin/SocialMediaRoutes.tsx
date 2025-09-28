import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ImprovedSocialMediaGenerator from './components/ImprovedSocialMediaGenerator';

export const SocialMediaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ImprovedSocialMediaGenerator />} />
      <Route path="generator" element={<ImprovedSocialMediaGenerator />} />
    </Routes>
  );
};