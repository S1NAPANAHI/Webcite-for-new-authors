import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { StarsBackground } from './StarsBackground';

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
    <div className="min-h-screen flex flex-col" style={{
      background: 'var(--bg)',
      backgroundImage: 'var(--bg-gradient)',
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      color: 'var(--text)',
      transition: 'color var(--transition), background-color var(--transition), background-image var(--transition)'
    }}>
      {/* Stars background with theme awareness */}
      <StarsBackground />
      
      {/* Header - uses fixed theme */}
      <header className="site-header relative z-20">
        <Navbar 
          isAuthenticated={isAuthenticated}
          betaApplicationStatus={betaApplicationStatus}
          onLogout={onLogout}
        />
      </header>
      
      {/* Main content area */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      
      {/* Footer - uses fixed theme */}
      <footer className="site-footer relative z-20">
        <Footer />
      </footer>
    </div>
  );
};