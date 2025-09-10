import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LearnPageAdmin } from '../pages/admin/LearnPageAdmin';

export const LearnRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<LearnPageAdmin />} />
    </Routes>
  );
};

export default LearnRoutes;
