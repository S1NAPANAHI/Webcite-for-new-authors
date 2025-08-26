import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="zr-root">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};