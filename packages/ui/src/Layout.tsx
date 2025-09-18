import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  isAuthenticated?: boolean;
  betaApplicationStatus?: string;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  isAuthenticated = false, 
  betaApplicationStatus = 'none', 
  onLogout 
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isAuthenticated={isAuthenticated}
        betaApplicationStatus={betaApplicationStatus}
        onLogout={onLogout}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
