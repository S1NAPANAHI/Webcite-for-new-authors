import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CanvasBasedSocialMediaStudio from './components/CanvasBasedSocialMediaStudio';

export const SocialMediaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<CanvasBasedSocialMediaStudio />} />
      <Route path="generator" element={<CanvasBasedSocialMediaStudio />} />
      <Route path="canvas" element={<CanvasBasedSocialMediaStudio />} />
    </Routes>
  );
};