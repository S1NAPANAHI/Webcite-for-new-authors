import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ContentEditor } from '@zoroaster/ui';
import WikiManager from './components/WikiManager';
import { WikiCategoryManager } from './components/WikiCategoryManager';

// Define a simple WikiEditor wrapper for now
const WikiEditor = () => (
  <ContentEditor
    contentType="pages"
    onSave={(data) => console.log('Saving:', data)}
    onCancel={() => console.log('Cancelled')}
  />
);

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

