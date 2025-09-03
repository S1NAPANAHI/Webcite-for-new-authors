import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Removed corrupted import
import { WikiCategoryManager } from './components/WikiCategoryManager';

export const WikiRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<WikiManager />} />
      <Route path="new" element={<WikiEditor />} />
      <Route path="edit/:id" element={<WikiEditor />} />
      <Route path="categories" element={<WikiCategoryManager />} />
    </Routes>
  );
};

export default WikiRoutes;

