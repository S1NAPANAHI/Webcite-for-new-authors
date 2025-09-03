import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Navbar } from '@zoroaster/ui';

export const TestLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1" style={{padding: '2rem'}}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
